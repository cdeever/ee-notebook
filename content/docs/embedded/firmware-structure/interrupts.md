---
title: "Interrupts"
weight: 20
---

# Interrupts

Interrupts are the fundamental mechanism for real-time response in embedded systems. Instead of constantly polling a peripheral to see if something happened, the hardware itself signals the CPU: "stop what you are doing and handle this." The CPU saves its current context, jumps to a handler function, executes it, restores context, and resumes where it left off. This sounds straightforward, but the details — priority levels, nesting, shared data, and latency — are where most embedded bugs come from.

## How Interrupts Work

When a peripheral (timer overflow, UART byte received, GPIO edge detected) asserts its interrupt line, the CPU finishes the current instruction, pushes a set of registers onto the stack (on Cortex-M: R0-R3, R12, LR, PC, xPSR — eight words), fetches the handler address from the vector table, and begins executing the ISR. When the ISR returns (via a special return value in the LR), the CPU pops the saved registers and resumes the interrupted code.

This context save/restore is automatic on Cortex-M — the hardware does it, not the compiler. This means ISR functions in C look like normal functions with no special prologue or epilogue (unlike AVR, where the compiler must generate explicit register save/restore sequences, and you need the `ISR()` macro or `__attribute__((interrupt))` to get the right code generation).

## The NVIC

The ARM Cortex-M Nested Vectored Interrupt Controller is the hardware block that manages all external interrupts (and some internal exceptions). Every interrupt source gets a slot in the NVIC with:

- **Enable/disable** — Each interrupt can be individually enabled or disabled
- **Pending flag** — An interrupt can be "pending" (requested) even if it is disabled; when enabled, it fires immediately
- **Priority level** — A configurable numeric priority (lower number = higher priority on Cortex-M)

"Nested" means a higher-priority interrupt can preempt a lower-priority ISR that is already running. "Vectored" means the hardware fetches the handler address from the vector table directly, without software dispatch. This combination makes Cortex-M interrupt entry very fast compared to architectures that use a single interrupt handler and require software to determine the source.

### Tail-Chaining

If a second interrupt becomes pending while the CPU is finishing an ISR, the NVIC skips the context restore and immediately enters the next handler. This "tail-chaining" eliminates the overhead of popping and re-pushing the same registers and reduces back-to-back interrupt latency from ~24 cycles to ~6 cycles on Cortex-M3/M4.

## Priority Levels and Grouping

Cortex-M priority is encoded in a field that is typically 3-4 bits wide (8 or 16 levels), though the exact number depends on the implementation — many chips implement only the top 3 or 4 bits of the 8-bit priority field, making the effective range 0-7 or 0-15.

Priority grouping divides this field into two parts:

- **Preemption priority** — Determines whether one interrupt can preempt another. Only a numerically lower preemption priority can preempt.
- **Sub-priority** — Breaks ties when two interrupts with the same preemption priority are pending simultaneously. The one with the lower sub-priority runs first, but it will not preempt the other.

Setting the priority grouping wrong is a common and confusing bug. If all bits are assigned to sub-priority, no interrupt can preempt any other — the system behaves as if nesting is disabled. The CMSIS function `NVIC_SetPriorityGrouping()` controls this, and it should be configured once at startup before enabling any interrupts.

I am still building intuition for how to assign priorities in practice. The general guidance is: give the highest priority (lowest number) to interrupts with the hardest real-time deadlines (motor commutation, safety-critical timers), and lower priority to everything else (UART receive, background timers). But the number of levels is small, and getting the assignment wrong can lead to priority inversion or missed deadlines that only appear under load.

## Interrupt Latency

Interrupt latency is the time from the hardware event (e.g., pin edge) to the first instruction of the ISR executing. On Cortex-M3/M4, this is deterministic: 12 clock cycles in the best case. That includes the exception entry sequence (stacking, vector fetch, pipeline refill).

In practice, latency is longer than 12 cycles because of:

- **Higher-priority ISR already running** — Your interrupt waits until the higher-priority handler finishes
- **Disabled-interrupt regions** — Code that disables interrupts (via `__disable_irq()` or `PRIMASK`) adds the disabled window duration directly to the latency
- **Multi-cycle instructions** — The CPU must finish the current instruction before taking the exception. Most Cortex-M instructions are 1 cycle, but load/store multiples and divides can take many cycles
- **Flash wait states** — Vector fetch goes through the flash interface; additional wait states add cycles
- **Bus contention** — DMA and other bus masters competing for the same bus as the vector fetch

## Jitter

Jitter is the variation in interrupt latency from one occurrence to the next. Even if the average latency is acceptable, high jitter means some events are handled faster than others. For periodic tasks — sampling an ADC at a fixed rate, generating a precise PWM update — jitter directly translates to timing error.

Sources of jitter include everything listed under latency, plus: variable-length instruction sequences in higher-priority ISRs, cache misses (on M7), and flash accelerator behavior. Measuring jitter requires toggling a GPIO pin at the start of the ISR and capturing the timing on an oscilloscope or logic analyzer. I have found that jitter is often a bigger problem in practice than absolute latency — a system with 2 us average latency and 10 us jitter is harder to work with than one with 5 us average and 0.5 us jitter.

## ISR Design Rules

The overriding principle: **keep ISRs short**. The ISR is executing at elevated priority, blocking all equal- and lower-priority interrupts. Every cycle spent in the ISR is a cycle that other interrupt sources must wait.

Practical rules I have collected (and am still learning to apply consistently):

- **Do the minimum work** — Read the data register, copy the value to a buffer, clear the interrupt flag, set a flag for the main loop. That is it.
- **Never call blocking functions** — No `delay_ms()`, no busy-wait loops, no `printf()`. These belong in main loop context.
- **Never allocate memory** — `malloc()` is not reentrant on most embedded C libraries. Calling it from an ISR risks heap corruption.
- **Clear the interrupt source flag** — If the peripheral's interrupt flag is not cleared, the ISR returns and the NVIC immediately re-enters it. This creates an interrupt storm: the main loop never runs, the system appears locked up, and the watchdog (if present) eventually resets the device.
- **Keep shared data access atomic** — If the ISR writes a 32-bit variable that the main loop reads, consider whether the access is atomic on your platform. On Cortex-M, aligned 32-bit reads and writes are atomic, but 64-bit values or multi-field structures are not.

## Shared Data and volatile

When an ISR sets a flag that the main loop checks, the variable must be declared `volatile`. Without it, the compiler may optimize the main-loop read into a single load that is never refreshed — the classic "flag never seen" bug:

```c
volatile uint8_t data_ready = 0;

void USART1_IRQHandler(void) {
    rx_buffer[rx_head++] = USART1->DR;
    data_ready = 1;
}

int main(void) {
    while (1) {
        if (data_ready) {    // without volatile, compiler may hoist this check
            process_data();
            data_ready = 0;
        }
    }
}
```

But `volatile` only prevents compiler reordering and caching — it does not make multi-byte accesses atomic. Writing a `uint64_t` from an ISR and reading it in `main()` can produce a torn read (half old value, half new) even with `volatile`. For multi-byte shared data, disable interrupts briefly around the access or use a lock-free structure like a ring buffer. See the discussion of race conditions in {{< relref "state-machines-and-event-loops" >}} for how event queues help with this.

## Disabling Interrupts

The simplest way to protect shared data is to disable interrupts:

```c
__disable_irq();
// critical section — read/modify/write shared data
__enable_irq();
```

This is a blunt instrument. While interrupts are disabled, every pending interrupt is delayed. The disabled window adds directly to worst-case interrupt latency for the entire system. Best practice is to keep critical sections as short as possible — ideally just a few instructions — and measure the actual disabled duration with a logic analyzer.

On Cortex-M3+, `BASEPRI` offers a finer tool: it masks interrupts below a given priority without affecting higher-priority ones. This lets you protect shared data from a specific set of ISRs without blocking time-critical higher-priority handlers. I have not used `BASEPRI` extensively yet, but it seems like the right approach for systems with both hard-real-time and background interrupts.

## Gotchas

- **Forgetting to clear the interrupt flag causes an interrupt storm** — The ISR runs, returns, and immediately re-enters because the peripheral still asserts the interrupt. The main loop starves. The system appears frozen. Always clear the source flag in the ISR, and check with a debugger that the flag actually clears.
- **Priority number 0 is the highest priority, not the lowest** — This is backwards from most people's intuition. On Cortex-M, a lower numeric value means a higher urgency level. Setting a non-critical interrupt to priority 0 means nothing else can preempt it.
- **volatile does not mean atomic** — Declaring a shared variable `volatile` prevents the compiler from caching it in a register, but it does not prevent torn reads or writes for types wider than the bus width. A 16-bit variable on an 8-bit AVR requires interrupt protection even if it is `volatile`.
- **Enabling an interrupt before its peripheral is configured risks an immediate spurious ISR** — If the peripheral's interrupt flag is already set (from a previous configuration or power-on state), enabling the interrupt in the NVIC causes an immediate entry into the handler. Always clear pending flags before enabling.
- **Interrupt nesting depends on priority grouping configuration** — If all priority bits are assigned to sub-priority (grouping set to 0 preemption bits), no ISR can preempt any other, regardless of assigned priority numbers. This is a system-level setting that affects all interrupts and should be configured once at startup.
- **Long ISRs cause jitter in all lower-priority interrupts** — A 100 us ISR at priority 1 adds up to 100 us of jitter to every interrupt at priority 2 or lower. Measuring ISR execution time with a scope (toggle a pin at entry and exit) is the fastest way to find this problem.
