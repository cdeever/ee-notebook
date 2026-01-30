---
title: "RTOS Fundamentals"
weight: 20
---

# RTOS Fundamentals

A real-time operating system is not about making code faster. It is about making timing behavior explicit and manageable. An RTOS provides a framework for running multiple activities concurrently, each with defined priorities, and guarantees that the highest-priority ready task always gets the CPU. Whether this helps or hurts depends on the system -- an RTOS adds structure, but it also adds overhead and new categories of bugs.

## What an RTOS Provides

At its core, an RTOS provides preemptive multitasking with priority-based scheduling. Each task (thread) runs as though it owns the CPU, with its own stack and execution context. The RTOS scheduler decides which task runs based on priority and readiness. When a higher-priority task becomes ready, it immediately preempts whatever is currently running.

This is fundamentally different from a bare-metal superloop, where the programmer manually sequences all activities and timing depends on how long each step takes. The RTOS moves scheduling decisions from the code structure to the priority assignments, which is both its power and its danger.

## Tasks (Threads)

A task is an independent execution context. Each task has:
- **A priority** -- a number that determines its importance relative to other tasks
- **A stack** -- its own block of RAM for local variables, function call frames, and saved context
- **A state** -- ready (can run), running (currently executing), blocked (waiting for something), or suspended (explicitly paused)

The highest-priority task in the "ready" state always runs. If two tasks have the same priority, most RTOSes use round-robin time-slicing between them, though I try to avoid equal priorities because the behavior becomes less predictable.

Tasks are created at startup or dynamically at runtime. A typical FreeRTOS task function looks like an infinite loop:

```c
void vControlTask(void *pvParameters) {
    for (;;) {
        wait_for_timer_signal();
        read_sensors();
        compute_output();
        write_actuators();
    }
}
```

The task blocks on `wait_for_timer_signal()`, which releases the CPU to lower-priority tasks. When the timer fires, the RTOS unblocks this task, and if it is the highest-priority ready task, it preempts whatever else is running.

## Context Switching

When the scheduler switches from one task to another, it must save the current task's CPU registers and stack pointer, then load the next task's saved registers and stack pointer. This is a context switch, and it costs both time and space.

On a Cortex-M4, a context switch typically takes 2-10 us depending on the RTOS and whether the FPU context is saved (FPU registers are large -- 32 single-precision registers). This is not free. A system that context-switches thousands of times per second is spending meaningful CPU time just on housekeeping.

Each task's stack must be large enough for its deepest call chain plus the context saved during a switch. Stack overflows in RTOS tasks are a common and dangerous failure mode -- the task silently corrupts adjacent memory, often another task's stack. FreeRTOS has a stack overflow detection hook, but it only catches some cases. I have learned to be generous with stack sizes during development and only trim them after profiling.

## Priority-Based Preemptive Scheduling

The defining characteristic of an RTOS is preemption. When a higher-priority task becomes ready -- because an ISR posted a semaphore it was waiting on, a timeout expired, or a queue received data -- the scheduler immediately stops the lower-priority task and switches to the higher-priority one. "Immediately" means at the next scheduling point, which is typically at the end of the ISR that caused the state change.

This is what makes the system "real-time." The high-priority control loop does not wait for the low-priority logging task to finish its UART write. It runs as soon as it has work to do, regardless of what else is happening. The worst-case response time is the context switch time plus any interrupt latency, not the execution time of unrelated lower-priority code.

### Rate Monotonic Assignment

A common approach to priority assignment: tasks with shorter periods (faster rates) get higher priorities. A 10 kHz motor control task has higher priority than a 1 kHz sensor sampling task, which has higher priority than a 10 Hz display update. This is not the only valid scheme, but it has well-studied theoretical properties and works well in practice for periodic tasks.

## Common RTOS Primitives

Most RTOSes provide the same core primitives, though naming varies:

- **Semaphores** -- signaling between contexts. An ISR gives a semaphore; a task takes it. Binary semaphores signal events; counting semaphores track available resources
- **Mutexes** -- mutual exclusion for shared resources. A task acquires the mutex, accesses the resource, and releases it. Mutexes support priority inheritance (see {{< relref "concurrency-and-shared-resources" >}}). ISRs cannot use mutexes because ISRs cannot block
- **Queues** -- thread-safe message passing. A producer puts data into the queue; a consumer takes it out. The queue handles all synchronization internally. This is often the cleanest way to pass data between tasks or from ISRs to tasks
- **Event flags (event groups)** -- waiting for combinations of events. A task can block until any or all of a set of flags are set. Useful when a task must synchronize with multiple sources
- **Software timers** -- deferred execution. The RTOS calls a callback after a delay or at a periodic rate. These run in the context of a timer service task, not an ISR, so they can use blocking API calls

## Memory Overhead

Every task needs its own stack. On a Cortex-M with 16 KB or 32 KB of SRAM, this is a significant design constraint.

A minimal task might get by with 256 bytes of stack (no deep call chains, no large local arrays). A task that calls `printf` or processes complex data structures might need 1-4 KB. The RTOS kernel itself uses RAM for task control blocks (TCBs), queue storage, semaphore structures, and internal bookkeeping -- typically 1-3 KB total.

On a 64 KB SRAM MCU, this is comfortable. On a 16 KB SRAM MCU, five tasks with 1 KB stacks plus the kernel overhead consumes half the available RAM before the application allocates a single buffer. I have worked on projects where the RTOS memory overhead was the deciding factor against using one.

## When an RTOS Helps

- **Multiple independent activities with different timing requirements** -- a control loop, a communication handler, and a user interface each run at their own rate with their own priority
- **Clean separation of concerns** -- each task handles one responsibility; interactions happen through explicit primitives rather than shared globals and flags
- **Built-in synchronization** -- queues, semaphores, and mutexes are tested and correct; writing your own lock-free data structures in bare metal is error-prone
- **Feature growth** -- adding a new feature means adding a new task, not restructuring the superloop. Existing task timing is less affected because the scheduler handles preemption

## When an RTOS Hurts

- **Single-purpose tight loops** -- a system that does one thing at one rate gains nothing from a scheduler. The RTOS overhead (context switch time, stack RAM, code flash) is pure cost
- **Very small MCUs** -- on an ATtiny or a Cortex-M0 with 4 KB of SRAM, the RTOS kernel may not fit, or it leaves too little RAM for the application
- **New failure modes** -- stack overflow, priority inversion, deadlock, and starvation are all RTOS-specific bugs that do not exist in a bare-metal superloop. Debugging them requires understanding the scheduler state, which is harder than reading a single execution flow
- **False sense of structure** -- an RTOS does not automatically make firmware well-organized. Poorly designed tasks with excessive coupling are just as hard to maintain as a tangled superloop, with the added complexity of inter-task synchronization

## FreeRTOS, Zephyr, and Others

**FreeRTOS** is the most widely used embedded RTOS. It is small (a few thousand lines of kernel code), well-documented, and runs on virtually every MCU with more than a few KB of RAM. Amazon maintains it now, with cloud connectivity features added. For learning RTOS concepts, FreeRTOS is the standard starting point.

**Zephyr** is a more ambitious project -- closer to a full embedded OS than a minimal kernel. It includes a device tree model, a driver framework, networking stacks, Bluetooth, and a build system (west + CMake). The learning curve is steeper, but the payoff is a richer ecosystem. I think of Zephyr as where you go when FreeRTOS feels too bare.

**ThreadX** (now Azure RTOS), **ChibiOS**, **RT-Thread**, and **NuttX** fill various niches. ChibiOS has very fast context switching and a strong STM32 HAL. NuttX targets POSIX compatibility. ThreadX is known for safety certifications.

## Bare-Metal to RTOS Transition

The most common migration path is starting with a superloop and moving to an RTOS when complexity outgrows the superloop. This transition is not trivial. It requires:

- Restructuring sequential code into independent tasks
- Replacing global flags and shared variables with RTOS primitives (queues, semaphores)
- Choosing priorities that reflect timing requirements, not just intuition
- Sizing stacks for each task (too small crashes; too large wastes RAM)
- Testing for new concurrency bugs that did not exist in the sequential design

I have seen teams attempt this transition mid-project under schedule pressure. It usually goes badly. The better approach is to decide early whether the system's complexity warrants an RTOS and start with one if so. Retrofitting is possible but painful. For more on bare-metal patterns that delay or avoid the need for an RTOS, see {{< relref "/docs/embedded/firmware-structure" >}}.

## Gotchas

- **Stack overflow is silent on most MCUs** -- a task that overflows its stack writes into whatever memory is adjacent, often another task's stack or global data. The symptoms are bizarre and intermittent. Enable FreeRTOS stack overflow checking during development and size stacks generously.
- **Equal-priority tasks behave differently across RTOSes** -- some use round-robin time-slicing, some use FIFO (first ready, runs until it blocks). If you assume one behavior and get the other, tasks may starve. Assign distinct priorities when possible.
- **Calling blocking RTOS functions from an ISR crashes or hangs** -- ISRs cannot block (they are not tasks and have no context to suspend). Most RTOSes provide separate ISR-safe API variants (e.g., `xSemaphoreGiveFromISR` in FreeRTOS). Using the wrong variant is a common early mistake.
- **The idle task must run** -- the RTOS idle task handles memory cleanup and watchdog feeding in many configurations. If higher-priority tasks never block and consume 100% of the CPU, the idle task starves. Design tasks to block when they have no work, not to spin-wait.
- **Context switch time includes FPU context** -- on Cortex-M4F and M7, saving and restoring the 32 floating-point registers roughly doubles the context switch time. FreeRTOS uses lazy stacking (deferred FPU save) to avoid this when tasks do not use the FPU, but if most tasks use floating point, the cost is real.
- **An RTOS does not make timing deterministic by itself** -- it provides the mechanism (preemptive scheduling), but the timing guarantees depend on correct priority assignment, bounded ISR execution times, and proper use of synchronization primitives. A badly structured RTOS application can have worse timing than a well-written superloop.
