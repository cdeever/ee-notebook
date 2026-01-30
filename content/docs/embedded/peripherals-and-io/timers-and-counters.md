---
title: "Timers & Counters"
weight: 20
---

# Timers & Counters

Hardware timers are the MCU's mechanism for generating and measuring time without burning CPU cycles. At the most basic level, a timer is just a counter clocked by a known frequency — but the peripherals built around that counter (prescalers, compare units, capture inputs, PWM outputs) make timers one of the most versatile and heavily used peripherals on any microcontroller.

## Basic Timer Operation

A timer is a hardware counter that increments (or decrements) on each tick of a clock source. When the counter reaches a configured reload value (or overflows past its maximum), it wraps and optionally generates an interrupt or hardware event.

The fundamental relationship:

```
Timer period = (Prescaler + 1) x (Reload value + 1) / Timer clock frequency
```

A 16-bit timer clocked at 1 MHz with no prescaler rolls over every 65.536 ms (65536 counts). A 32-bit timer at the same frequency runs for over 71 minutes before overflow. Timer width, clock frequency, and prescaler together define the resolution and range — and there is always a tradeoff between them.

## Prescalers

The prescaler divides the input clock before it reaches the counter, effectively setting the timer's time base. A prescaler of 7 divides the clock by 8 (prescaler + 1 in most implementations), so a 72 MHz system clock becomes a 9 MHz timer tick.

**The resolution-range tradeoff:** A larger prescaler gives a longer total period before overflow, but each tick represents a coarser time step. At 1 MHz, each tick is 1 us and a 16-bit timer covers 65.5 ms. Prescale to 1 kHz and each tick is 1 ms, covering 65.5 seconds — but you have lost the ability to time anything shorter than 1 ms.

Choosing the prescaler is one of the first decisions when configuring a timer. Start with what resolution you need, work backward to the required prescaler value, and verify the resulting range is sufficient. If both fine resolution and long range are needed, use a 32-bit timer or chain two 16-bit timers (most MCUs support this).

## PWM Generation

Pulse-width modulation is the most common timer application. An output compare unit toggles a pin when the counter matches a compare register value, producing a square wave with a controllable duty cycle.

### Single-Edge (Edge-Aligned) PWM

The counter counts up from 0 to the auto-reload value, then resets. The output goes HIGH at counter reset and LOW when the counter matches the compare value (or vice versa). The compare value sets the duty cycle; the auto-reload value sets the frequency.

**Resolution:** PWM resolution is limited by the ratio of timer clock to PWM frequency. At 72 MHz timer clock and 20 kHz PWM (for silent motor control above audible range), the auto-reload value is 3600, giving about 11.8 bits of duty cycle resolution. Push the PWM frequency to 200 kHz and resolution drops to about 8.5 bits. This matters for precision applications like power converters and audio output.

### Center-Aligned PWM

The counter counts up to the reload value, then counts back down to 0. The output toggles on both the up-count and down-count compare matches, producing a pulse centered in the period. Center-aligned PWM has half the effective frequency (the counter traverses the range twice per period), but produces lower harmonic content — beneficial for motor control and power conversion where EMI matters.

## Input Capture

Input capture latches the counter value when an external edge arrives on a capture pin. This gives a hardware timestamp of the event with timer-tick resolution, independent of interrupt latency or firmware overhead.

**Applications:**
- **Pulse width measurement:** Capture on the rising edge, then capture again on the falling edge. The difference is the pulse width
- **Period and frequency measurement:** Capture successive rising edges. The difference is the period; invert for frequency
- **Encoder interfaces:** Some timers have dedicated quadrature encoder modes that count edges from A/B encoder channels directly in hardware
- **Ultrasonic distance:** Capture the echo return time from an HC-SR04 or similar sensor

The critical advantage of input capture is that the counter value is latched in hardware at the exact moment of the edge. Interrupt latency affects when firmware reads the result, but not the measurement accuracy. This is why input capture is fundamentally more accurate than polling a GPIO and reading a counter in the ISR — the polling approach adds variable interrupt latency directly to the measurement error.

## Output Compare

Output compare triggers an action when the counter reaches a specific value. The action can be toggling, setting, or clearing an output pin — or generating an interrupt with precise timing.

**Uses beyond PWM:**
- Generating precise delays without blocking the CPU
- Creating waveforms with specific timing (pulse trains, signal generation)
- Triggering ADC conversions at exact moments in a PWM cycle (useful for motor control current sampling)

Multiple compare channels on a single timer allow several independently timed events within one timer period. This is how advanced motor control timers generate three-phase PWM with per-phase duty cycles from a single timer.

## Timer Interrupts

Timers generate interrupts on several events:

- **Overflow / update:** The counter has rolled over. This is commonly used as the system tick — the periodic heartbeat driving an RTOS scheduler or a software timing framework
- **Compare match:** The counter reached a compare value. Used for precise event timing
- **Input capture:** An edge was detected. Firmware reads the captured timestamp

**Keep ISRs short.** Timer interrupts often fire at high rates — a 1 kHz system tick is modest; a PWM update interrupt at 20 kHz fires every 50 us. Any significant processing in the ISR will either miss deadlines or starve background code. Set a flag, update a variable, or trigger a DMA transfer — do the heavy lifting in the main loop or a lower-priority handler.

The system tick timer deserves special attention. Most RTOSes (FreeRTOS, Zephyr, etc.) need a periodic interrupt for scheduling. The SysTick timer on ARM Cortex-M is purpose-built for this: a simple 24-bit down-counter that fires an interrupt at a configurable rate, typically 1 kHz. Using a general-purpose timer for the system tick works too, but SysTick is available on all Cortex-M cores and requires no peripheral clock configuration.

## Dead-Time Insertion

When driving a half-bridge (two switches in series between supply and ground, with the load at the midpoint), both switches must never be ON simultaneously — that shorts the supply through both transistors, a condition called **shoot-through**. Since transistors take time to turn off, the complementary PWM outputs need a brief dead time inserted between one output turning off and the other turning on.

Advanced timer peripherals (like TIM1 on STM32) include hardware dead-time generators. The dead time is typically configurable from tens of nanoseconds to a few microseconds. Getting dead time wrong is destructive: too short and shoot-through occurs during switching transitions (sometimes only at specific duty cycles or load conditions), too long and the output distortion increases. The right value depends on the FET gate driver and MOSFET switching characteristics — see the MOSFET datasheet for turn-off time and add margin.

Dead-time insertion is critical for motor drivers, synchronous buck converters, and any push-pull or bridge power stage. It is one of those features that works perfectly in simulation and fails on the bench when parasitic inductance or gate drive weakness extends switching transitions beyond the configured dead time.

## Watchdog Timers

A watchdog timer is a special-purpose countdown timer that resets the MCU if firmware fails to reload ("kick" or "feed") it before it expires. The watchdog detects firmware lockups, infinite loops, and other conditions where the normal program flow has stalled.

Watchdog timers come in two flavors on most MCUs: **independent watchdog** (IWDG, clocked from a separate low-speed oscillator so it works even if the main clock fails) and **window watchdog** (WWDG, requiring the kick to occur within a specific time window, detecting both stuck-early and stuck-late conditions).

Watchdog configuration and recovery strategies are covered in detail in the Embedded Reality section under Watchdogs & Recovery.

## Gotchas

- **Prescaler off-by-one errors are universal** — Some MCUs divide by (prescaler register value + 1), others divide by the register value directly. A prescaler register value of 0 might mean "divide by 1" or "timer stopped." Always verify against the reference manual, not the HAL documentation, because the HAL may or may not add 1 for you
- **PWM frequency and resolution are coupled** — You cannot independently choose both. Higher PWM frequency means fewer counter ticks per period and coarser duty cycle steps. A 16-bit timer at 72 MHz can produce 1 kHz PWM with 16-bit resolution, but only about 10-bit resolution at 70 kHz. Calculate both before committing to a design
- **Input capture overflows silently** — If two consecutive edges are more than one timer period apart, the counter wraps and the measurement is wrong. Firmware must track overflow events (using the update interrupt) and account for them. Missing an overflow interrupt means the timing measurement is off by one full timer period
- **Timer clock sources vary by timer** — Not all timers on the same MCU are clocked at the same frequency. On STM32, timers on APB1 and APB2 may run at different clock rates, and the timer clock may be double the APB bus clock (depending on the prescaler configuration). Check the clock tree diagram, not just the system clock frequency
- **Dead-time values need bench verification** — Calculated dead time based on datasheet switching times is a starting point, not a finished value. Board parasitics, gate drive strength, and temperature all affect actual switching speed. Verify with an oscilloscope across the full operating range before declaring the design done. See [Signals & Waveforms]({{< relref "/docs/measurement/signals-waveforms" >}}) for scope measurement techniques
- **Changing timer registers mid-count can glitch** — Writing to the auto-reload or compare registers while the timer is running can produce unexpected output pulses if the new value is below the current counter value. Many timers have shadow registers (preload / buffered update) that apply changes only at the next update event — enable preload to avoid mid-cycle glitches
