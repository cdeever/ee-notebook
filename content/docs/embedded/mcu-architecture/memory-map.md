---
title: "Memory Map"
weight: 20
---

# Memory Map

The memory map is the contract between hardware and software. Every address in the microcontroller's address space has a defined meaning: some ranges are flash (where code lives), some are SRAM (where variables live), some are peripheral registers (where writing a value actually toggles a pin or starts a timer). The memory map is not optional knowledge — it is the foundation of everything firmware does. When you write to a GPIO register, you are writing to a specific address. When a hard fault fires, the faulting address tells you whether you hit an unmapped region, a peripheral you forgot to clock-enable, or the end of your stack.

## The Address Space

On a 32-bit Cortex-M, the address space is 4 GB (0x00000000 to 0xFFFFFFFF). ARM defines a standard partitioning:

- **0x00000000 - 0x1FFFFFFF** — Code region (typically flash)
- **0x20000000 - 0x3FFFFFFF** — SRAM region
- **0x40000000 - 0x5FFFFFFF** — Peripheral region
- **0x60000000 - 0x9FFFFFFF** — External RAM
- **0xA0000000 - 0xDFFFFFFF** — External device
- **0xE0000000 - 0xE00FFFFF** — Private peripheral bus (NVIC, SysTick, debug registers)

No chip uses all of this. A typical Cortex-M4 MCU might have 512 KB of flash starting at 0x08000000, 128 KB of SRAM at 0x20000000, and peripherals scattered through 0x40000000-0x50000000. Everything else is unmapped — accessing it triggers a bus fault (if the fault is enabled) or a hard fault.

The vendor's reference manual contains the detailed memory map. I have found this to be the single most-referenced chapter of any MCU reference manual. Bookmarking it saves real time.

## Flash

Flash memory stores the program code and read-only data (constants, lookup tables, string literals). It is non-volatile — contents survive power loss.

**Runtime behavior:**
- Flash is read-only during normal execution. Writing to flash requires a special erase-then-program sequence through the flash controller peripheral, not a simple store instruction
- At high clock speeds, flash may be slower than the CPU. Flash access time is often 20-30 ns, but a 168 MHz Cortex-M4 has a clock period of ~6 ns. The flash controller inserts wait states (extra cycles where the CPU stalls waiting for the data). Vendor datasheets specify wait states vs. clock speed
- Many MCUs include a flash prefetch buffer or instruction cache to hide wait states. The STM32F4 ART accelerator, for example, achieves zero-wait-state performance for sequential code by prefetching the next flash line while the current one executes

**Endurance:** Flash has a finite number of erase/program cycles — typically 10,000 to 100,000 per sector. This does not matter for code that is flashed during development or firmware updates, but it matters a lot if you are using flash for data storage. See EEPROM and flash emulation below.

## SRAM

SRAM holds all runtime data: local variables (on the stack), global and static variables, the heap (if you use dynamic allocation), and sometimes DMA buffers.

**Key properties:**
- Volatile — contents are lost at power-off (and undefined at power-on, though some vendors guarantee zeroing)
- No endurance limits — read/write as many times as you want
- Typically single-cycle access at the CPU clock speed, though some MCUs have multiple SRAM banks with different access speeds
- Some MCUs have special SRAM regions (e.g., CCM — Core Coupled Memory — on STM32F4, which is tightly coupled to the CPU and not accessible by DMA)

**Size matters differently than on a PC.** A mid-range Cortex-M4 might have 128-256 KB of SRAM. That is where your stack, your global buffers, your RTOS task stacks, and your heap all compete for space. Running out of SRAM is a real and common failure mode, and unlike a desktop OS, there is no swap file — you just crash.

## EEPROM and Flash Emulation

Some MCUs include dedicated EEPROM — byte-addressable non-volatile memory with high endurance (100,000 to 1,000,000 cycles). This is the right place for calibration data, user settings, boot counters, and other small pieces of persistent state.

Many modern MCUs (especially Cortex-M parts) do not have dedicated EEPROM. Instead, vendors provide "flash emulation of EEPROM" — a software layer that uses one or more flash sectors to simulate byte-level persistent storage with wear leveling. This works but has quirks: writes are slow (flash erase takes milliseconds), the emulation library consumes SRAM and flash, and a power failure during a write can corrupt the emulated EEPROM if the library does not use a journaling or dual-page strategy.

## Memory-Mapped I/O

On Cortex-M (and most modern MCU architectures), peripherals are not accessed through special I/O instructions. They are accessed through normal memory addresses. Reading the GPIO input data register is a load from address 0x40020010 (or wherever the vendor placed it). Writing the UART data register is a store to a specific address. This is memory-mapped I/O.

**Why this matters for firmware:**

- Peripheral registers are declared as pointers to specific addresses. The vendor header files define structs overlaid on the peripheral address. When you write `GPIOA->ODR = 0x01`, the compiler generates a store to a fixed address
- The `volatile` keyword is essential. Without it, the compiler may optimize away reads from peripheral registers (assuming the value hasn't changed) or reorder writes. Every peripheral register pointer must be `volatile`
- Not every access size is valid. Some peripheral registers must be accessed as 32-bit words; byte or halfword access may read back garbage or have no effect. The reference manual specifies the access width for each register
- Read-modify-write on peripheral registers is not atomic. If you read a GPIO output register, OR in a bit, and write it back, an interrupt between the read and write can clobber the other bits. Cortex-M3+ bit-banding or the BSRR (bit set/reset register) avoids this. On M0, you need to mask interrupts. See [Core Architectures]({{< relref "core-architectures" >}}) for bit-banding details

## Stack and Heap

### Stack

The stack holds function call frames: return addresses, saved registers, and local variables. On Cortex-M, the stack grows downward (from high addresses to low).

- The initial stack pointer is loaded from address 0x00000000 at reset (the first word of the vector table)
- Each function call pushes a frame; each return pops one. Interrupt handlers also push context onto the stack
- Stack overflow is silent and catastrophic. There is no guard page, no segfault, no exception (unless the MPU is configured for it). The stack simply writes into whatever memory is below it — typically the heap, or `.bss`, or another SRAM region. The resulting corruption may not crash immediately, making it extremely hard to diagnose
- Stack usage is hard to predict. Recursive functions, deep call chains, and interrupt nesting all consume stack. Static analysis tools (`-fstack-usage` in GCC, or tools like `puncover`) can estimate worst-case usage

### Heap

Dynamic memory allocation (`malloc`, `free`, `new`, `delete`) uses the heap. On MCUs, the heap is usually whatever SRAM is left between the end of static data and the bottom of the stack.

Most experienced embedded developers avoid dynamic allocation entirely in production firmware. The reasons: fragmentation in long-running systems (the heap becomes a patchwork of small free blocks that cannot satisfy larger requests), non-deterministic allocation time, and the absence of an OS to clean up after you. If you must allocate, use a pool allocator or a fixed-size block allocator instead of the general-purpose `malloc`.

## Linker Scripts Define the Map

The linker script (`.ld` file on GCC-based toolchains) is where the firmware's view of memory is defined. It specifies:

- **MEMORY regions** — Flash start address, size; SRAM start address, size; any additional memories (CCM, backup SRAM, external RAM)
- **SECTIONS** — Where each type of data goes:
  - `.text` — executable code, placed in flash
  - `.rodata` — read-only data (constants, string literals), placed in flash
  - `.data` — initialized global/static variables. Stored in flash (initial values), copied to SRAM at startup by the C runtime
  - `.bss` — zero-initialized global/static variables. Not stored in flash (just zeroed in SRAM at startup)
  - `.heap` and `.stack` — regions carved out of remaining SRAM

The startup code (usually `startup_stm32xxxx.s` or equivalent) is responsible for copying `.data` from flash to SRAM and zeroing `.bss` before `main()` runs. If the linker script is wrong — say, the SRAM size is larger than reality — the system may appear to work but corrupt memory silently.

I find it useful to examine the linker's map file (`-Wl,-Map=output.map`) after every build. It shows exactly where every symbol landed, how much flash and SRAM are used, and whether things are getting tight.

## Gotchas

- **Accessing an unclocked peripheral faults** — On most Cortex-M MCUs, peripheral registers are inaccessible until the peripheral's clock is enabled via the RCC (or equivalent). Reading an unclocked peripheral address returns a bus fault. This is the number-one cause of hard faults in new firmware bringup
- **Stack overflow corrupts silently** — Without an MPU region guarding the stack boundary, overflow writes into adjacent memory with no exception. The symptom is usually mysterious data corruption or a crash far removed from the actual overflow. Painting the stack with a known pattern and checking it periodically is a crude but effective detection method
- **Flash wait states must match clock speed** — If you increase the system clock but forget to increase the flash wait states, the CPU reads garbage from flash. The result is usually an immediate hard fault or wild branching. Always configure wait states before increasing the clock, or configure them conservatively first
- **Linker script errors are silent until they crash** — If the linker script declares 256 KB of SRAM but the chip only has 128 KB, the linker happily places data in addresses that do not exist. Everything builds cleanly. The firmware crashes at runtime when it accesses nonexistent memory
- **Read-modify-write on shared peripheral registers is a race condition** — If main-loop code and an ISR both modify the same register using read-modify-write sequences, bits get lost. Use atomic set/clear registers (like BSRR for GPIO) or disable interrupts around the critical section
- **`.data` initialization depends on startup code** — If the startup code does not copy `.data` from flash to SRAM, initialized global variables contain whatever was in SRAM at power-on (random values). This is a common problem with custom or minimal startup files
