---
title: "Determinism & Timing"
weight: 10
---

# Determinism & Timing

"Real-time" does not mean fast. It means predictable. A system that produces the correct output one millisecond late has failed just as thoroughly as one that produces the wrong output on time. The distinction matters because most of what we learn about software emphasizes average performance, throughput, and optimization for the common case. Real-time firmware inverts that: the worst case is the only case that counts.

## Hard vs Soft Real-Time

The terms get thrown around loosely, but the distinction is about consequences.

**Hard real-time** means a missed deadline is a system failure. An airbag controller that fires 50 ms late is not "slower" -- it has failed its purpose entirely. A motor commutation loop that misses a step produces a current spike, a torque glitch, or a stall. There is no graceful degradation. The deadline is a requirement, not a target.

**Soft real-time** means a missed deadline degrades quality but does not break the system. An audio playback buffer that underruns produces a click or dropout -- annoying, but the system keeps running. A UI that takes 30 ms instead of 16 ms to render a frame feels sluggish but still works.

Most embedded systems are a mix. A motor controller might have a hard real-time commutation loop at 20 kHz and a soft real-time status display update at 10 Hz. The hard deadlines constrain the entire system design; the soft deadlines fill in around them.

There is also the term **firm real-time** -- a missed deadline does not cause catastrophic failure, but the result of the computation is worthless after the deadline. A video frame decoded 5 ms late cannot be displayed because the next frame is already due. The system survives, but the work was wasted. In practice, I find the hard/soft distinction covers most real design decisions. The important question is always: what happens when the deadline is missed?

## Worst-Case Execution Time (WCET)

Average execution time is nearly useless for real-time guarantees. If a function takes 12 us on average but 85 us when a particular branch is taken and the flash cache misses, the system must be designed for 85 us. If that function runs inside a 100 us control loop, the average says "plenty of margin" while the worst case says "15 us left for everything else."

WCET depends on more than just the code path. On a Cortex-M4 or M7 with flash caches, the first execution of a loop may be much slower than subsequent iterations because the cache is cold. Interrupts that preempt the critical section add to the effective execution time. DMA transfers competing for the bus can insert wait states.

I find it helpful to think of WCET as a budget. Every code path, every interrupt, and every bus contention event draws from the same time budget. If the budget is 100 us, and the task itself takes 60 us worst-case, that leaves 40 us for interrupt service, bus stalls, and scheduling overhead. Whether that is enough depends on what else is running.

### Measuring WCET

The practical approach for most firmware is direct measurement. Toggle a GPIO high at the start of the critical section, toggle it low at the end, and measure the pulse width with an oscilloscope or logic analyzer. Run the system under stress conditions -- maximum interrupt load, worst-case data, cache-cold startup -- and record the longest pulse.

```c
GPIO_SET(DEBUG_PIN);
run_control_loop();
GPIO_CLEAR(DEBUG_PIN);
```

This is not elegant, but it is ground truth. Static analysis tools exist (aiT, RapiTime) that attempt to compute WCET from the binary, but they are conservative by design and expensive. For most bench firmware work, the scope measurement is what I trust. See {{< relref "/docs/measurement/time-frequency-spectrum/jitter" >}} for technique details on measuring timing variation.

## Jitter

Jitter is the variation in timing of a periodic event. If a control loop is supposed to fire every 1000 us and it actually fires at 998, 1003, 997, 1005 us intervals, the jitter is roughly +/-5 us. The average period might be perfect, but the variation is what causes problems.

Sources of jitter include:
- **Interrupt latency variation** -- other interrupts delaying the one that triggers the task
- **Variable code paths** -- different branches taking different amounts of time on each iteration
- **Cache behavior** -- cache hits vs misses changing execution time unpredictably
- **Bus contention** -- DMA transfers or other bus masters inserting wait states

Jitter is often the real constraint, not average latency. A control loop that runs at exactly 1000 us every time is better than one that averages 950 us but jitters by +/-50 us, even though the latter is "faster" on average.

### Jitter Budgets

The acceptable jitter depends entirely on the application:
- **1 kHz control loop** (motor, power supply) -- +/-10 us is often acceptable. +/-100 us starts to affect stability
- **48 kHz audio sample rate** -- the sample period is ~20.8 us, so +/-1 us of jitter is significant. DAC output jitter directly causes audible distortion
- **PWM generation** -- jitter in the PWM edge timing appears as noise in the output. For LED dimming nobody cares; for precision analog output through a filtered PWM, sub-microsecond jitter matters

I do not always know the jitter budget up front. Sometimes I discover it when artifacts appear -- a motor vibrates at a new frequency, or an audio output has unexpected noise. Working backward from the artifact to the jitter source is a common debugging pattern.

## Timer-Driven Execution

The most important technique for deterministic timing is using a hardware timer interrupt to trigger periodic tasks. Instead of running a loop and hoping it takes the right amount of time, configure a timer to fire at the desired rate and do the work in the ISR (or signal a task from the ISR).

The timer period is set by hardware, not by code execution time. If the control loop code takes 40 us or 60 us, the next invocation still happens exactly when the timer fires. This decouples the period from the execution time and is the foundation of most real-time designs.

On Cortex-M, SysTick is often used for RTOS tick timing, while a general-purpose timer (TIM1, TIM2, etc.) drives application-specific periodic tasks. The timer's clock source and prescaler determine the achievable period and resolution. See {{< relref "/docs/embedded/peripherals-and-io" >}} for timer peripheral configuration details.

There is a subtlety here: the timer fires at exact intervals, but the ISR response is not instant. Interrupt latency (the time from the timer event to the first instruction of the handler) adds a fixed-ish offset, and interrupt jitter (variation in that latency) adds uncertainty. If the timer fires every 1000 us but the ISR entry varies by +/-3 us due to other interrupt activity, the task execution has 3 us of jitter even though the timer itself is perfect. The timer provides a stable reference; the rest of the system determines how closely the code follows it.

### Delay Loops vs Timer Interrupts

A common beginner pattern is using `delay_ms()` or busy-wait loops to create periodic timing. This is fragile because the total period is the delay plus the execution time of everything between delays. If the work takes 2 ms and the delay is 10 ms, the period is 12 ms, not 10 ms. Adding more work changes the period. Timer interrupts avoid this entirely -- the period is hardware-defined regardless of how long the work takes (as long as it finishes before the next interrupt).

## What Breaks Determinism

Even with timer-driven execution, several things can introduce unexpected timing variation:

- **Flash wait states** -- some MCUs have variable flash access time depending on which bank is being accessed or whether a prefetch buffer hits. Running time-critical code from RAM (or TCM on Cortex-M7) eliminates this
- **Cache misses** -- instruction or data cache misses stall the pipeline. The first iteration of a loop is often slower than subsequent ones
- **Interrupt preemption** -- a higher-priority interrupt can delay a lower-priority time-critical ISR. The worst case includes the longest higher-priority ISR in the system
- **DMA bus contention** -- DMA transfers compete with the CPU for bus bandwidth. A burst DMA transfer can stall CPU accesses for multiple cycles
- **Flash write/erase** -- writing or erasing flash can stall the CPU for milliseconds on some MCUs. Never perform flash operations while time-critical code is running from the same flash bank

## The Scope as Timing Verifier

Code review and simulation help, but the oscilloscope is the ground truth for timing verification. When I need to verify that a control loop meets its deadline, I toggle a GPIO pin and measure with the scope. The scope shows not just the average timing but the distribution -- {{< relref "/docs/measurement/test-instruments/scope" >}} persistence mode is particularly useful for spotting occasional outliers that would be invisible in a logic analyzer's protocol view.

The test setup matters. Run the system under realistic load with all features active. The timing measured with interrupts disabled and no communication traffic is not the timing the system will have in production.

## Gotchas

- **Average execution time hides worst-case failures** -- A function that averages 20 us but occasionally takes 200 us will appear fine in casual testing and fail in the field. Always measure under worst-case conditions, not typical ones.
- **Jitter is cumulative across interrupt priorities** -- Every higher-priority interrupt that can fire during a time-critical section adds to the jitter budget. The total worst-case jitter is the sum of all higher-priority ISR execution times, not just one.
- **Flash erase stalls the entire CPU** -- On many MCUs, erasing a flash sector blocks all code execution from that flash bank for milliseconds. If time-critical code runs from the same bank, it stops. Dual-bank flash or execution from RAM is the workaround.
- **Cold cache changes timing dramatically** -- The first execution of a function after reset or context switch may take 2-5x longer than subsequent executions due to instruction cache misses. If the deadline must be met on the first invocation, test the cold-cache case specifically.
- **SysTick is not free** -- The RTOS tick interrupt fires at 1 kHz (typically) and takes time to execute. On a busy system, this 1 kHz overhead is small; on a system with tight microsecond-level deadlines, the SysTick ISR is another jitter source.
- **Toggling a GPIO for measurement adds its own latency** -- The GPIO set/clear instructions take a few nanoseconds on most Cortex-M cores, which is negligible. But if the GPIO is on a slow peripheral bus (APB at a divided clock), the write may take longer. Use a fast-bus GPIO for timing instrumentation.
