---
title: "Clocks, Reset & Power Modes"
weight: 30
---

# Clocks, Reset & Power Modes

The clock system, reset logic, and power management are deeply intertwined. The clock determines how fast the MCU runs — and how much power it consumes. The reset system determines what state the MCU starts in, and what happens when something goes wrong. Power modes let you trade performance for battery life. Getting these right is not optional: a misconfigured clock means peripherals run at the wrong speed (UART baud rate is wrong, timers are off), a misunderstood reset means your firmware initializes into a state it did not expect, and poor power management means your battery-powered device dies in hours instead of years.

## Internal vs External Oscillators

Every MCU has at least one internal RC oscillator — a resistor-capacitor circuit on the die that generates a clock without external components.

**Internal RC oscillators:**
- Fast startup (microseconds)
- Poor frequency accuracy: typically 1-5% over temperature and voltage. Some factory-trimmed parts achieve 1%, but this degrades with temperature
- Adequate for GPIO toggling, ADC sampling, low-speed peripherals, and protocols that do not require precise timing
- Free — no external components needed

**External crystal oscillators:**
- Slow startup (milliseconds — a crystal needs time to build up oscillation). HSE startup on an STM32 is typically 2-10 ms depending on the crystal and load capacitors
- Excellent accuracy: 10-50 ppm for a standard crystal, which translates to 0.001-0.005%. Temperature-compensated crystals (TCXOs) are better still
- Required for USB (which demands 0.25% accuracy — beyond what most internal RCs can guarantee), CAN, Ethernet, and any UART communication at high baud rates over long periods

**When accuracy matters:** I initially underestimated this. A UART at 115200 baud can tolerate about 3-5% total clock error between transmitter and receiver. That sounds like plenty for an internal RC oscillator, but the error budget is shared — if both sides use internal RCs, each one's error adds. At temperature extremes, the RC oscillator may drift enough to cause framing errors. For reliable UART communication, especially in products, an external crystal is almost always worth the two extra components.

Most MCUs also have a low-speed oscillator — either an internal LSI RC (~32 kHz, very imprecise) or an external 32.768 kHz crystal (LSE). The 32.768 kHz crystal divides evenly to 1 Hz (2^15 = 32768), making it the standard clock source for the RTC (Real-Time Clock). If your device needs to keep time while sleeping, you need the LSE.

## PLLs and Clock Multiplication

A Phase-Locked Loop takes a low-frequency reference (the HSE crystal, typically 4-25 MHz) and multiplies it to produce a higher system clock (72 MHz, 168 MHz, 480 MHz — whatever the MCU supports).

**PLL configuration** involves setting multiplier and divider values. On an STM32F4, for example, a typical configuration takes an 8 MHz HSE crystal, divides by 8 (to 1 MHz), multiplies by 336 (to 336 MHz), then divides by 2 to produce a 168 MHz system clock. Getting these values wrong produces the wrong clock frequency — and every peripheral that derives its timing from the system clock (UART, SPI, timers, ADC) will be wrong by the same factor.

**Lock time:** After configuration, the PLL needs time to lock — to stabilize its output frequency. This typically takes hundreds of microseconds to a few milliseconds. The hardware provides a "PLL ready" flag. Switching the system clock to the PLL output before it locks produces an unstable clock that can cause erratic behavior or hard faults.

For more on PLL behavior and clock synthesis in general, see [Clocks]({{< relref "/docs/digital/timing-and-synchronization/clocks" >}}) in the Digital Electronics section.

## Clock Trees and Prescalers

The system clock does not feed every peripheral directly. A clock tree distributes it through a hierarchy of prescalers (dividers) and gates:

- **SYSCLK** — The main system clock (from HSI, HSE, or PLL)
- **AHB prescaler** — Divides SYSCLK to produce HCLK, which feeds the CPU core, memory, and DMA
- **APB1 prescaler** — Divides HCLK to produce PCLK1, the low-speed peripheral bus clock (typically limited to SYSCLK/2 or SYSCLK/4). Feeds UART2-5, SPI2/3, I2C, basic timers
- **APB2 prescaler** — Divides HCLK to produce PCLK2, the high-speed peripheral bus clock. Feeds UART1, SPI1, ADC, advanced timers

**Peripheral clock gating** is a critical power-saving mechanism and a common source of bugs. Each peripheral has a clock enable bit in the RCC (Reset and Clock Control) registers. A peripheral with its clock disabled is completely non-functional — its registers are inaccessible, and reading them triggers a bus fault. The very first step in configuring any peripheral is enabling its clock. I cannot count the number of times a hard fault during bringup turned out to be a missing clock enable.

**Timer clocks are often doubled.** On STM32, if the APB prescaler is not 1, the timer clock is automatically multiplied by 2. So if PCLK1 is 42 MHz (HCLK/4), timers on APB1 actually get 84 MHz. This catches people off guard when calculating timer periods.

## Reset Sources

A reset forces the MCU back to a known initial state: all registers to their default values, the program counter to the reset vector, peripherals to their power-on defaults. But not all resets are the same, and knowing which reset occurred matters for firmware that needs to behave differently on a cold start vs. a watchdog recovery.

**Common reset sources:**
- **Power-on reset (POR)** — Generated when the supply voltage rises through the POR threshold. This is a cold start; SRAM contents are undefined
- **Brownout reset (BOR)** — Generated when the supply voltage drops below a configured threshold during operation. Prevents the MCU from running at voltages where behavior is undefined. Some MCUs have programmable BOR thresholds
- **Watchdog reset** — Generated by the watchdog timer when firmware fails to "feed" it within the timeout period. Indicates that firmware got stuck. SRAM may retain its contents (depending on the MCU), which is useful for post-mortem debugging
- **External reset (NRST pin)** — An external signal (usually from a reset button, supervisor IC, or debugger) pulls the reset pin low
- **Software reset** — Firmware requests a reset through the SCB (System Control Block). The AIRCR register's SYSRESETREQ bit triggers a system reset. Used for firmware update sequences or error recovery

After reset, firmware can read the RCC reset status flags to determine what caused the reset. This allows different behavior: a watchdog reset might log the event and skip slow initialization, while a power-on reset initializes everything from scratch.

## Startup Sequence

What happens between the reset signal deasserting and `main()` executing is a sequence most firmware developers never think about — until something goes wrong.

1. **Core loads initial SP and PC** — From the vector table at address 0x00000000 (or wherever the boot memory maps). The first word is the initial stack pointer, the second is the reset handler address
2. **Reset handler runs on the internal RC oscillator** — The HSI (or equivalent) is the default clock after reset. No crystal, no PLL — just the fast, imprecise internal oscillator
3. **System initialization (SystemInit)** — Configures flash wait states, enables the HSE crystal, waits for HSE ready, configures and enables the PLL, waits for PLL lock, switches SYSCLK to PLL output. Only after this step is the MCU running at full speed
4. **C runtime initialization** — Copies `.data` from flash to SRAM, zeros `.bss`. See [Memory Map]({{< relref "memory-map" >}}) for details on these sections
5. **`main()` begins**

If the external crystal fails to start (bad solder joint, wrong load capacitors, damaged crystal), the MCU remains on the internal RC. Some vendors' startup code handles this with a timeout — if HSE does not become ready, the system continues on HSI. Others hang forever waiting. Knowing which behavior your startup code implements matters.

## Power Modes

MCUs offer multiple power modes that progressively shut down more of the chip to save power:

**Run mode** — Everything active. CPU executing, all clocked peripherals running. Current consumption is roughly proportional to clock speed: a Cortex-M4 at 168 MHz might draw 40-100 mA; the same chip at 16 MHz draws a fraction of that.

**Sleep mode** — CPU clock stopped, CPU core not executing. Peripherals continue running. Wake-up is fast (interrupt resumes execution immediately). Power savings are moderate — peripherals and SRAM still draw current. Good for waiting on a peripheral event (UART receive, timer expiry).

**Stop mode** — Most clocks stopped, PLL and HSE disabled. SRAM contents preserved. Only the LSI/LSE and a few wake-capable peripherals remain active. Current drops to microamps. Wake-up requires re-initializing the clock system (PLL lock takes milliseconds). Good for low-duty-cycle applications that wake periodically.

**Standby mode** — Almost everything off. SRAM contents lost (except backup domain registers). Only the RTC, backup registers, and wake-up pins remain active. Current drops to single-digit microamps or less. Wake-up is essentially a reset — the firmware restarts from the beginning, but can check the backup registers to determine that it is waking from standby rather than a cold start.

## Clock Speed and Power

Dynamic power consumption in CMOS follows the relationship P = C * V^2 * f, where C is switched capacitance, V is supply voltage, and f is frequency. In practice, this means:

- Halving the clock speed roughly halves the dynamic power draw
- But it also doubles the time to complete a task
- The energy per task (power times time) stays roughly constant — this is important. Running slower does not save energy for compute-bound work. It saves power (instantaneous draw), which matters for peak current and thermal constraints
- The real power savings come from sleeping between tasks. A sensor node that wakes for 1 ms every second at full speed and sleeps the rest uses far less energy than one that runs continuously at a slow clock

This tradeoff — "race to sleep" vs. "run slow" — is one of the fundamental decisions in low-power embedded design. For most applications, racing to sleep wins.

## Gotchas

- **Forgetting flash wait states when increasing clock speed** — If you configure the PLL to run at 168 MHz but leave flash wait states at 0 (the reset default), the CPU reads corrupted instructions from flash. Always set wait states before switching to the faster clock. See [Memory Map]({{< relref "memory-map" >}}) for more on flash access timing
- **Crystal startup failure is silent** — If the HSE crystal does not oscillate (wrong load caps, bad solder, cracked crystal), the MCU stays on the internal RC with no indication unless firmware checks the HSE ready flag. Everything appears to work, but at the wrong frequency — UART baud rates are off, timers are inaccurate, USB fails enumeration
- **Peripheral clock gating hides hard faults** — Accessing a peripheral register before enabling its clock causes a bus fault. This is the most common cause of hard faults during bringup and the first thing to check
- **Wake-up from stop mode restarts on HSI** — After exiting stop mode, the system clock is the internal RC, not the PLL. Firmware must re-initialize the clock tree (HSE, PLL, wait for lock, switch SYSCLK) before peripherals that depend on precise timing can resume
- **Timer prescaler gotcha on STM32** — When the APB prescaler is greater than 1, the timer input clock is automatically doubled. If you assume the timer clock equals the APB bus clock, your timer periods will be off by a factor of 2. Always check the clock tree diagram in the reference manual
- **Brownout detection must be enabled** — Some MCUs ship with brownout detection disabled or set to a low threshold. Without proper BOR, a drooping supply voltage can cause the MCU to execute corrupted instructions before the voltage drops far enough for a power-on reset. Configure BOR early in the startup sequence
