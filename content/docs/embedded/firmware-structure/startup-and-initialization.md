---
title: "Startup & Initialization"
weight: 10
---

# Startup & Initialization

There is a surprising amount of code that runs before `main()`. On a desktop system, the operating system handles loading your program into memory, setting up the stack, and initializing the runtime. On a bare-metal microcontroller, there is no OS — the silicon itself dictates what happens at power-on, and the startup code must get the hardware from an undefined state to a point where C code can run safely. Understanding this sequence matters because bugs here are among the hardest to diagnose: the system fails before your application logic ever executes.

## The Vector Table

The very first thing the Cortex-M CPU reads after power-on or reset is the vector table — a block of 32-bit values at the start of flash (address 0x00000000 by default, though it can be relocated). The vector table is not code. It is an array of addresses: function pointers and one stack pointer value.

- **Entry 0** — The initial value of the Main Stack Pointer (MSP). The CPU loads this into SP before executing any instructions. If this value is wrong (points to invalid SRAM, misaligned), the system faults immediately with no useful diagnostic.
- **Entry 1** — The address of the reset handler. The CPU sets the PC to this address and begins execution. This is the true entry point of the firmware.
- **Entries 2+** — Exception and interrupt handler addresses: NMI, HardFault, MemManage, BusFault, UsageFault, SVCall, PendSV, SysTick, and then vendor-specific peripheral interrupts.

The vector table is typically defined in the startup file provided by the chip vendor or toolchain. It looks like an array of function pointers in C, or a block of `.word` directives in assembly. If you never look at it, things usually work. But when they do not — when the system resets into a HardFault loop or hangs at power-on — the vector table is one of the first things to check.

## The Reset Handler

The reset handler is the first code that actually executes. On most Cortex-M toolchains, this is a small assembly routine (often called `Reset_Handler`) that does the minimum work needed to make C code functional:

1. **Copy `.data` from flash to SRAM** — Initialized global and static variables (e.g., `int counter = 5;`) have their initial values stored in flash. The startup code copies this block to the SRAM addresses where the linker expects them. Without this step, initialized variables contain whatever was in SRAM at power-on — which is not reliably zero or the expected value.
2. **Zero the `.bss` section** — Uninitialized global and static variables are required by the C standard to start at zero. The startup code fills the `.bss` region in SRAM with zeros.
3. **Optional: initialize the FPU** — On Cortex-M4F and M7, the FPU is disabled by default after reset. If the firmware uses floating-point instructions without enabling the FPU first, it faults. The startup code (or `SystemInit()`) typically sets the CPACR register bits to enable it.
4. **Call `SystemInit()`** — A vendor-provided function (CMSIS convention) that performs early hardware setup, usually configuring flash wait states and initial clock settings.
5. **Call `__libc_init_array()` or equivalent** — Runs global constructors and static initializers (mainly relevant for C++).
6. **Call `main()`** — Finally, application code begins.

If you are using C++, static constructors run before `main()`. They execute in an unspecified order, which means one static object's constructor cannot safely depend on another. I have seen systems crash because a static object tried to use a peripheral that had not been initialized yet — the fix was to move the initialization into `main()`.

## Clock Initialization

After `main()` starts, the first order of business is usually clock configuration. Most Cortex-M chips boot on an internal RC oscillator running at a modest frequency — 8 MHz is common, sometimes as low as 4 MHz. This is intentional: the internal oscillator is always available and does not depend on external components.

Switching to the final operating frequency involves:

- Enabling the HSE (High-Speed External) oscillator and waiting for it to stabilize
- Configuring the PLL multiplier and divider to reach the target system clock
- Setting flash wait states to match the new clock speed — this is easy to forget, and getting it wrong causes hard faults or corrupted instruction fetches
- Updating the peripheral bus prescalers (AHB, APB1, APB2) so peripherals run within their rated clock ranges

The order matters. If you switch the system clock to the PLL before the PLL is locked, the CPU runs on an unstable clock and behavior is undefined. If you forget to increase flash wait states before raising the clock speed, instruction fetches fail intermittently — a maddening bug because it is not deterministic.

## Peripheral Initialization Order

Peripherals have dependencies. On STM32 (and most Cortex-M parts), every peripheral's clock must be explicitly enabled in the RCC (Reset and Clock Control) registers before any of its other registers can be accessed. Writing to a peripheral with its clock disabled is silently ignored — no fault, no error, just nothing happens.

A typical initialization order:

1. Clock tree and flash wait states
2. GPIO port clocks, then pin configuration (mode, speed, alternate function)
3. Communication peripherals (UART, SPI, I2C) — these need their GPIO pins configured first
4. Timers and PWM outputs
5. ADC / DAC — may need specific clock sources and stabilization time
6. DMA channels — must be configured before enabling the peripheral that triggers them
7. Interrupts — enable in the NVIC only after the peripheral is fully configured, or you risk taking an interrupt before the handler is ready

Getting this sequence wrong produces subtle bugs. A UART that transmits garbage because its baud rate register was written before the UART clock was enabled. A DMA transfer that corrupts memory because the source peripheral was not configured. These are the kinds of problems that work on one board revision and fail on another, because the timing of power-on states can vary.

## Main Loop Patterns

Once initialization is complete, firmware enters its main loop. The structure of this loop defines the system's responsiveness, power consumption, and complexity.

### Superloop (Polling)

```c
while (1) {
    read_sensors();
    update_state();
    drive_outputs();
}
```

Simple, deterministic, easy to reason about. Every function runs in sequence, every cycle. The problem: if `read_sensors()` blocks waiting for an ADC conversion, nothing else runs until it finishes. Response time to external events equals the worst-case loop time.

### Interrupt-Driven

The main loop does nothing (or sleeps). ISRs handle all events — receiving UART data, processing timer ticks, responding to GPIO edges. This is power-efficient but makes the firmware harder to reason about: execution order depends on interrupt arrival, not code order. See {{< relref "interrupts" >}} for the design rules that make this manageable.

### Hybrid (Flags and Deferred Processing)

ISRs do the minimum — set a flag, copy a byte into a buffer — and the main loop checks flags and processes data. This gives fast interrupt response without putting complex logic in ISR context. Most production bare-metal firmware uses some variation of this pattern, and it connects naturally to the {{< relref "state-machines-and-event-loops" >}} approach.

## The "Before main()" Problem

Bugs in startup code are uniquely painful. The debugger may not be attached when the reset handler runs. Printf is not available. Peripheral registers are not yet configured. If the startup code crashes — because the linker script is wrong, the vector table is corrupt, or the stack pointer is invalid — the system enters a HardFault loop before any diagnostic code can run.

Strategies that help:

- **Toggle a GPIO pin at the top of the reset handler** — if the pin never toggles, execution is not reaching the reset handler. Check the vector table.
- **Set a breakpoint on `Reset_Handler` in the debugger** — most debuggers can halt at reset if configured to do so ("halt on connect" or "break on reset").
- **Implement an early HardFault handler** that blinks an LED or writes to a known SRAM location you can inspect after halting. The default handler is usually an infinite loop, which tells you nothing.
- **Check the `.map` file** — verify that `.data`, `.bss`, and the stack are placed in valid SRAM regions. A linker script error that places the stack outside physical SRAM is a silent, immediate crash.

## Gotchas

- **Writing to a peripheral before enabling its clock does nothing** — On STM32 and similar parts, peripheral register writes are silently ignored if the peripheral clock is off in the RCC. No fault, no error flag. The peripheral just does not respond. This is the single most common embedded initialization bug.
- **Flash wait states must be set before increasing the clock** — If you raise the system clock without adding flash wait states first, the CPU outruns flash and fetches corrupted instructions. The resulting hard faults appear random and are extremely difficult to correlate with the root cause.
- **The initial stack pointer must be 8-byte aligned and point to the top of SRAM** — An invalid or misaligned initial SP in the vector table causes an immediate fault at reset. The system never reaches the reset handler, and most debuggers do not show a useful state because no code has executed.
- **Static constructors in C++ run before main() in unspecified order** — If a static object's constructor touches a peripheral or depends on another static object, the result is undefined. This is a strong argument for performing all hardware initialization explicitly in `main()` rather than relying on constructor side effects.
- **SystemInit() varies wildly between vendors and chip families** — The function's behavior is not standardized beyond the name. Some implementations configure clocks, some only set flash wait states, some are nearly empty. Always read the vendor's implementation rather than assuming what it does.
