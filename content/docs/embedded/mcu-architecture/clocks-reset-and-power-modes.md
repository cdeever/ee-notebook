---
title: "Clocks, Reset & Power Modes"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Clocks, Reset & Power Modes

The clock system, reset logic, and power management are deeply intertwined. The clock determines how fast the MCU runs — and how much power it consumes. The reset system determines what state the MCU starts in. Power modes trade performance for battery life. Getting these right is not optional: a misconfigured clock means peripherals run at the wrong speed (UART baud rate is wrong, timers are off), a misunderstood reset means firmware initializes into an unexpected state, and poor power management means a battery-powered device dies in hours instead of years.

## Internal vs External Oscillators

Every MCU has at least one internal RC oscillator — a resistor-capacitor circuit on the die that generates a clock without external components. Internal RC oscillators start fast (microseconds) but have poor frequency accuracy, typically 1-5% over temperature and voltage. This is adequate for GPIO, ADC sampling, and low-speed peripherals.

External crystal oscillators are far more accurate (tens of ppm, translating to thousandths of a percent) but start slowly (milliseconds, as the crystal needs time to build up oscillation). A crystal is required for USB (which demands 0.25% accuracy — beyond what most internal RCs guarantee), CAN, Ethernet, and reliable high-baud-rate UART communication over long periods.

A UART at 115200 baud can tolerate about 3-5% total clock error between transmitter and receiver. That sounds like plenty for an internal RC, but the error budget is shared between both sides. At temperature extremes, internal RC drift can cause framing errors. For reliable UART communication, especially in products, an external crystal is almost always worth the two extra components.

Most MCUs also have a low-speed oscillator — either an internal ~32 kHz RC or an external 32.768 kHz crystal. The 32.768 kHz value divides evenly to 1 Hz (2^15 = 32768), making it the standard clock source for the RTC (Real-Time Clock).

## PLLs and Clock Multiplication

A Phase-Locked Loop takes a low-frequency reference (typically the external crystal at 4-25 MHz) and multiplies it to produce the system clock (72 MHz, 168 MHz, 480 MHz — whatever the MCU supports). The PLL is configured with multiplier and divider values; getting them wrong produces the wrong clock frequency, and every peripheral that derives timing from the system clock will be off by the same factor.

After configuration, the PLL needs time to lock — to stabilize its output frequency. The hardware provides a "PLL ready" flag. Switching the system clock to the PLL output before it locks produces an unstable clock that can cause erratic behavior or hard faults.

For more on PLL behavior and clock synthesis in general, see [Clocks]({{< relref "/docs/digital/timing-and-synchronization/clocks" >}}) in the Digital Electronics section.

## Clock Trees and Prescalers

The system clock does not feed every peripheral directly. A clock tree distributes it through a hierarchy of prescalers (dividers) and gates. The main system clock (SYSCLK) feeds through a bus prescaler to the CPU core, memory, and DMA. Further prescalers divide it down for low-speed and high-speed peripheral buses, each feeding different sets of peripherals (UARTs, SPI, I2C, timers, ADC).

**Peripheral clock gating** is both a power-saving mechanism and a common source of bugs. Each peripheral has a clock enable bit. A peripheral with its clock disabled is completely non-functional — its registers are inaccessible, and reading them triggers a bus fault. The very first step in configuring any peripheral is enabling its clock. A missing clock enable is the most common cause of hard faults during bringup.

## Reset Sources

A reset forces the MCU back to a known initial state: all registers to defaults, the program counter to the reset vector, peripherals to power-on configuration. Knowing which reset occurred matters for firmware that needs to behave differently on a cold start vs. a watchdog recovery.

Common reset sources:

- **Power-on reset (POR)** — Generated when supply voltage rises through the threshold. SRAM contents are undefined
- **Brownout reset (BOR)** — Generated when supply voltage drops below a configured threshold during operation. Prevents the MCU from running at voltages where behavior is undefined
- **Watchdog reset** — Generated when firmware fails to "feed" the watchdog within its timeout. Indicates firmware got stuck
- **External reset** — A signal on the reset pin from a button, supervisor IC, or debugger
- **Software reset** — Firmware requests a reset through the system control block

After reset, firmware can read status flags to determine the cause. A watchdog reset might log the event and skip slow initialization, while a power-on reset initializes everything from scratch.

## Startup Sequence

What happens between the reset signal deasserting and `main()` executing:

1. **Core loads initial SP and PC** — From the vector table. The first word is the initial stack pointer, the second is the reset handler address
2. **Reset handler runs on the internal RC oscillator** — No crystal, no PLL — just the fast, imprecise internal oscillator
3. **System initialization** — Configures flash wait states, enables the external crystal (waits for ready), configures and enables the PLL (waits for lock), switches SYSCLK to PLL output. Only after this step is the MCU running at full speed
4. **C runtime initialization** — Copies initialized data from flash to SRAM, zeros the `.bss` section. See [Memory Map]({{< relref "memory-map" >}}) for details
5. **`main()` begins**

If the external crystal fails to start (bad solder joint, wrong load capacitors, damaged crystal), the MCU remains on the internal RC. Some vendor startup code handles this with a timeout; others hang forever waiting. Knowing which behavior the startup code implements matters.

## Power Modes

MCUs offer multiple power modes that progressively shut down more of the chip to save power:

- **Run** — Everything active. Current consumption is roughly proportional to clock speed
- **Sleep** — CPU clock stopped, peripherals continue running. Wake-up is fast (interrupt resumes execution immediately). Moderate power savings
- **Stop** — Most clocks stopped, PLL and crystal disabled. SRAM contents preserved. Current drops to microamps. Wake-up requires re-initializing the clock system
- **Standby** — Almost everything off, SRAM contents lost (except backup domain). Current drops to single-digit microamps or less. Wake-up is essentially a reset

The key insight for low-power design is "race to sleep": a sensor node that wakes for 1 ms every second at full speed and sleeps the rest uses far less energy than one that runs continuously at a slow clock. Running slower does not save energy for compute-bound work — it saves instantaneous power draw but doubles the time to finish, leaving total energy roughly constant. The real savings come from finishing fast and entering a deep sleep mode.

## Tips

- **Set flash wait states before increasing the clock** — configuring the PLL and switching to a faster clock with default wait states corrupts instruction fetches; always raise wait states first, then increase clock speed
- **Check the crystal ready flag before switching** — vendor startup code may or may not have a timeout on crystal startup; verifying the ready flag explicitly avoids hanging or running at the wrong frequency
- **Use "race to sleep" for battery-powered designs** — finishing a task at full speed and entering deep sleep uses far less energy than running slowly and continuously, because total energy is power multiplied by time
- **Read the reset cause register early in `main()`** — distinguishing a watchdog reset from a power-on reset allows firmware to skip slow initialization or log the fault before proceeding
- **Crystal load capacitance matching is critical** — the load capacitors must match the crystal's specified load capacitance; wrong values cause frequency error or failure to start
- **Power budget analysis should happen early in system design** — adding up the worst-case current draw of every device, in every operating mode, often reveals that the chosen battery or supply is undersized before any hardware is assembled

## Caveats

- **Flash wait states must match clock speed** — If the PLL is configured for a fast clock but flash wait states remain at the reset default, the CPU reads corrupted instructions. Always set wait states before switching to the faster clock. See [Memory Map]({{< relref "memory-map" >}}) for more on flash access timing
- **Crystal startup failure is silent** — If the external crystal does not oscillate, the MCU stays on the internal RC with no indication unless firmware checks the ready flag. Everything appears to work, but at the wrong frequency — UART baud rates are off, USB fails enumeration
- **Peripheral clock gating hides hard faults** — Accessing a peripheral register before enabling its clock causes a bus fault. The first thing to check during bringup
- **Wake-up from stop mode restarts on the internal RC** — After exiting stop mode, the system clock is the internal oscillator, not the PLL. Firmware must re-initialize the clock tree before timing-sensitive peripherals can resume

## In Practice

A UART producing garbled output at a steady wrong baud rate almost always means the system clock is not what the firmware expects — typically the PLL was not configured or the crystal failed to start, leaving the MCU on its internal RC oscillator. A device that works on the bench but resets in the field often traces to a brownout: the supply dips below the BOR threshold under transient load, triggering a reset that looks like a power cycle. When firmware hangs at startup with no debug output, the external crystal is the first suspect — a bad solder joint or incorrect load capacitors can prevent oscillation entirely, and if the startup code waits for the crystal ready flag without a timeout, the MCU stalls before reaching `main()`. These symptoms are opaque until the clock and reset architecture is understood; once it is, the diagnosis follows directly from the reset cause register or a frequency measurement on the clock output pin.
