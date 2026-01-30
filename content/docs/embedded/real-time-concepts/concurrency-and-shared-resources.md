---
title: "Concurrency & Shared Resources"
weight: 30
---

# Concurrency & Shared Resources

The hardest bugs in embedded firmware are concurrency bugs. They appear intermittently, depend on exact timing, and often vanish when you add instrumentation to find them. The root cause is always the same: two execution contexts access the same data, and the result depends on who gets there first. Understanding the problem and the available solutions is essential for writing firmware that does not fail under load at 2 AM in a customer's facility.

## The Fundamental Problem

A race condition occurs when two execution contexts -- the main loop and an ISR, or two RTOS tasks -- read or modify the same data, and the outcome depends on the order of access. Consider a main loop that checks a `data_ready` flag, processes a buffer, then clears the flag. If an ISR fires between the processing and the flag clear, the ISR might set the flag again and start filling a new buffer -- only for the main loop to immediately clear it without processing the new data. One buffer is lost. This happens once every few thousand interrupts, making it nearly impossible to catch in casual testing.

## Critical Sections

The simplest solution on a single-core MCU: disable interrupts around the shared data access.

```c
__disable_irq();
shared_counter++;
__enable_irq();
```

With interrupts disabled, no ISR can preempt the code, so the read-modify-write sequence is atomic. This works, but it delays all interrupt servicing for the duration of the critical section. If the critical section takes 5 us and a time-critical ISR has a 10 us deadline, this is fine. If the critical section takes 500 us, it is not.

On Cortex-M, `PRIMASK` disables all configurable interrupts. `BASEPRI` is more selective -- it disables interrupts below a certain priority, allowing higher-priority interrupts through. RTOS critical sections typically use `BASEPRI` so the RTOS-managed priority range is protected while truly time-critical ISRs above the RTOS ceiling remain responsive. See {{< relref "/docs/embedded/mcu-architecture/core-architectures" >}} for details on Cortex-M registers.

The rule is simple: keep critical sections as short as possible. Copy the shared data to a local variable inside the critical section, then process the local copy outside it.

## Volatile

The C keyword `volatile` tells the compiler that a variable can change outside the current execution flow -- modified by an ISR, a DMA controller, or a hardware register. Without `volatile`, the compiler may optimize away repeated reads, caching the value in a register. A `while (!data_ready) { }` loop can become an infinite loop if the compiler reads `data_ready` once and never re-checks memory. Adding `volatile` forces the compiler to re-read from memory on every access.

Here is what `volatile` does NOT do: it does not provide atomicity. A `volatile uint64_t` on a 32-bit MCU still requires two load instructions to read, and an ISR can fire between them. `volatile` prevents compiler optimization; it does not prevent hardware-level race conditions. I see this confusion regularly, and it leads to subtle bugs.

## Atomic Operations

An atomic operation completes in a single, uninterruptible step at the hardware level. On a 32-bit ARM Cortex-M:
- A 32-bit aligned read or write is atomic (one bus transaction)
- A 64-bit read or write is NOT atomic (two bus transactions)
- A read-modify-write (like `counter++`) is NOT atomic (load, add, store -- three separate operations)

This means that writing a 32-bit value from an ISR and reading it from the main loop is safe without protection, as long as the variable is `volatile` (to prevent compiler caching) and naturally aligned. But incrementing a counter, setting a bitfield, or modifying a structure requires protection.

### LDREX/STREX

ARM Cortex-M3 and above provide exclusive access instructions for lock-free atomic operations. `LDREX` loads a value and marks the memory location as exclusive. `STREX` attempts to store a new value, but it fails if any other context accessed that location between the `LDREX` and `STREX`. The pattern looks like:

```c
do {
    old_val = __LDREXW(&shared_var);
    new_val = old_val + 1;
} while (__STREXW(new_val, &shared_var));
```

If an ISR fires between `LDREX` and `STREX` and touches the same variable, `STREX` returns failure, and the loop retries. This is the mechanism behind CMSIS atomic functions and many RTOS internal primitives. Cortex-M0 lacks these instructions, so atomic operations on M0 require disabling interrupts.

## Mutexes

A mutex (mutual exclusion) is a lock that a task acquires before accessing shared data and releases afterward. Only one task can hold the mutex at a time; others that attempt to acquire it block until it is released.

```c
xSemaphoreTake(data_mutex, portMAX_DELAY);
modify_shared_structure();
xSemaphoreGive(data_mutex);
```

The key property of an RTOS mutex (as distinct from a binary semaphore) is **priority inheritance**: if a high-priority task blocks on a mutex held by a low-priority task, the RTOS temporarily raises the holder's priority to match the blocked task. This prevents priority inversion (discussed below).

**ISRs cannot use mutexes.** An ISR cannot block -- it has no task context to suspend. Attempting to take a mutex from an ISR either fails immediately or corrupts the RTOS state. If an ISR needs to share data with a task, use a queue or a semaphore for signaling instead.

## Semaphores

Semaphores serve two purposes in embedded systems, and the distinction matters:

**Signaling** -- a binary semaphore used to notify a task that something happened. The ISR "gives" the semaphore; the task "takes" it and processes the event. This is the standard ISR-to-task communication pattern.

**Resource counting** -- a counting semaphore tracks the number of available resources (buffers, DMA channels, pool slots). Each consumer takes one count; each producer gives one back.

Binary semaphores look like mutexes but lack priority inheritance. This means using a binary semaphore for mutual exclusion in a priority-sensitive system can lead to unbounded priority inversion. FreeRTOS documentation explicitly warns against this, but I have seen it in production code. Use mutexes for mutual exclusion; use semaphores for signaling.

## Queues

Queues are the cleanest concurrency primitive because they eliminate shared variables entirely. One context puts a copy of the data into the queue; another takes it out. The RTOS handles all synchronization internally.

```c
// ISR: send the sample
xQueueSendFromISR(sample_queue, &new_sample, &woken);

// Task: receive and process
xQueueReceive(sample_queue, &sample, portMAX_DELAY);
process(sample);
```

The data is copied into and out of the queue, so the ISR and the task never touch the same memory. No mutex, no critical section, no volatile needed. The cost is copy overhead and queue storage RAM, but for most embedded data sizes this is well worth the safety. For larger data (image buffers, audio frames), the common pattern is to pass pointers through the queue instead of copying the payload.

## Priority Inversion

Priority inversion is the most famous RTOS pathology, immortalized by the Mars Pathfinder incident. The scenario:

1. A low-priority task (L) acquires a mutex
2. A high-priority task (H) attempts to acquire the same mutex and blocks
3. A medium-priority task (M) preempts L and runs
4. H is effectively running at L's priority, because H cannot proceed until L releases the mutex, and L cannot run because M preempts it

The high-priority task is blocked by every medium-priority task in the system, not just the low-priority holder. On Mars Pathfinder, this caused a watchdog reset.

**Priority inheritance** is the standard solution. When H blocks on the mutex held by L, the RTOS temporarily raises L's priority to match H. Now M cannot preempt L, so L finishes quickly, releases the mutex, and H runs. FreeRTOS mutexes implement priority inheritance by default. Nested mutexes can still produce complex inversion scenarios; the **priority ceiling protocol** handles those but is less commonly implemented.

## Deadlock

Deadlock occurs when two tasks each hold a resource the other needs. Both block forever:

1. Task A acquires mutex X
2. Task B acquires mutex Y
3. Task A tries to acquire mutex Y -- blocks, because B holds it
4. Task B tries to acquire mutex X -- blocks, because A holds it

Neither task can proceed. The system appears to hang. Deadlock prevention strategies include:

- **Always acquire locks in the same order** -- if every task acquires X before Y, the circular dependency cannot form
- **Use timeouts** -- `xSemaphoreTake(mutex, pdMS_TO_TICKS(100))` returns failure after 100 ms instead of blocking forever. The task can log the failure and recover
- **Design to minimize shared resources** -- fewer mutexes means fewer opportunities for deadlock. Queues often eliminate the need for mutexes entirely

In practice, the best defense is simplicity. Systems with one or two mutexes rarely deadlock. Systems with five or more mutexes held in varying orders are deadlock factories. If I find myself needing that many mutexes, the design probably needs restructuring. See {{< relref "/docs/embedded/firmware-structure" >}} for patterns that reduce shared-state coupling.

## Gotchas

- **Volatile does not mean atomic** -- a `volatile uint64_t` on a 32-bit MCU is still read as two 32-bit loads. An ISR can fire between them, giving the main loop a half-old, half-new value. Use a critical section or copy under interrupt disable.
- **Binary semaphores lack priority inheritance** -- using a binary semaphore as a mutex works functionally, but without priority inheritance, the system is vulnerable to unbounded priority inversion under load. Always use the RTOS mutex primitive for mutual exclusion.
- **Read-modify-write on a peripheral register is not atomic** -- code like `GPIOA->ODR |= (1 << 5)` is a read, OR, write sequence. If an ISR modifies another bit in the same register between the read and write, the ISR's change is lost. Use the BSRR register (set/reset) on STM32 for atomic single-bit GPIO operations.
- **Queue overflow silently drops data** -- if the queue is full when `xQueueSendFromISR` is called, the data is discarded (the function returns failure, but ISR code often ignores it). Size queues for the worst-case burst rate, not the average rate.
- **Deadlock symptoms look like a hang, not a crash** -- the system is alive (other tasks may still run, watchdog may still be fed), but the deadlocked tasks produce no output. A task state dump (FreeRTOS `vTaskList()` or a debugger) shows the blocked tasks and the mutexes they hold.
- **Compiler reordering defeats hand-rolled synchronization** -- the C compiler and the CPU can reorder memory accesses for performance. `volatile` prevents compiler reordering but not CPU reordering (though on Cortex-M, the single-core in-order pipeline makes CPU reordering largely a non-issue). Using RTOS primitives avoids this class of problem entirely.
