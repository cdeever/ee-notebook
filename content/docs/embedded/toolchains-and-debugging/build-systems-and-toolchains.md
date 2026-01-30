---
title: "Build Systems & Toolchains"
weight: 10
---

# Build Systems & Toolchains

Getting source code into a running microcontroller involves more stages than most developers realize at first. On a desktop, you type `gcc main.c -o main` and run the result. On an embedded target, the CPU cannot run a compiler, the output format matters, the linker script defines the hardware memory layout, and a startup file runs before `main()` even exists. Each stage in this pipeline can produce errors that look like they belong to a different stage entirely, which makes understanding the full chain worth the effort.

## Cross-Compilation

The target microcontroller has no operating system, no filesystem, and nowhere near enough memory to run a compiler. So the host machine — a laptop or desktop — runs a compiler that emits instructions for the target architecture. For ARM Cortex-M, the standard toolchain is `arm-none-eabi-gcc`: ARM architecture, no operating system, Embedded ABI. The "none" is important. It means no assumptions about a hosted environment — no `printf` that writes to a terminal, no `malloc` backed by an OS heap, no standard I/O.

Installing the toolchain is usually straightforward (package managers, ARM's downloads, or bundled with an IDE), but version mismatches between the compiler, newlib (the embedded C library), and your project's expected ABI can produce linker errors that are genuinely baffling. I keep the toolchain version pinned per project for this reason.

## The Compilation Pipeline

Source code goes through a longer pipeline than it appears:

1. **Preprocessor** — Expands `#include`, `#define`, `#ifdef`. The output is a single translation unit with no macros left. Errors here are usually missing headers or macro expansion mistakes.
2. **Compiler** — Translates C/C++ into assembly for the target architecture. This is where type errors, syntax errors, and most warnings appear.
3. **Assembler** — Converts assembly into an object file (`.o`) containing machine code and relocation information. Hand-written assembly (startup files, DSP routines) enters the pipeline here.
4. **Linker** — Combines all object files, resolves symbol references, and places sections into memory according to the linker script. Undefined reference errors appear here, often from missing source files or libraries rather than code mistakes.
5. **Post-processing** — The linker output is an ELF file. Tools like `objcopy` convert it to raw binary or Intel HEX for the flash programmer.

An error at any stage can masquerade as something else. A missing `volatile` qualifier produces no compiler warning, but the optimizer removes a peripheral read, and the firmware hangs — looking like a hardware problem. A linker script that places `.data` at the wrong address builds cleanly but crashes at runtime. Learning to reason about which stage owns a given failure saves real debugging time.

## Compiler Flags That Matter

Not all flags are equal. These are the ones I find myself reaching for repeatedly on Cortex-M projects:

- **`-O0`** — No optimization. Variables live where you expect. Stepping in the debugger follows the source line by line. Essential for debugging, but the binary is large and slow. A project that fits in flash at `-Os` may overflow at `-O0` — keep both build configurations working.
- **`-O2` / `-Os`** — Production optimization. `-Os` optimizes for size, which is often the right choice when flash is tight. The debugger may skip lines, reorder operations, or eliminate variables entirely. If a bug disappears at `-O2`, it is almost certainly a missing `volatile` or an undefined-behavior issue in your code, not a compiler bug.
- **`-Wall -Wextra`** — Enable the important warnings. I treat warnings as errors (`-Werror`) in CI builds. The compiler catches real bugs here: sign comparison, unused variables, implicit fallthrough in switch statements.
- **`-ffunction-sections -fdata-sections`** paired with **`-Wl,--gc-sections`** — Places each function and global variable in its own linker section, then lets the linker discard sections that are never referenced. This is dead code elimination, and it can save significant flash on projects that pull in libraries where only a fraction of functions are used.
- **`-mthumb`** — Selects Thumb instruction encoding, which is the standard (and often only) mode for Cortex-M. Forgetting this flag with a bare `arm-none-eabi-gcc` invocation produces ARM-mode code that the Cortex-M cannot execute.
- **`-g` / `-gdwarf-4`** — Include debug information in the ELF file. This does not affect the binary flashed to the target (debug info lives in ELF sections that `objcopy` strips out), so there is no reason to omit it even in production builds. Without `-g`, the debugger cannot map addresses to source lines.

## The Linker Script

The linker script (`.ld` file) is the firmware's memory map. It tells the linker what memory exists and where each section goes. A minimal Cortex-M linker script defines two memory regions and a handful of sections:

```
MEMORY {
    FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 256K
    SRAM  (rwx) : ORIGIN = 0x20000000, LENGTH = 64K
}
```

Sections placement follows a standard pattern: `.text` (executable code) and `.rodata` (constants) go in flash. `.data` (initialized globals) is stored in flash but copied to SRAM at startup. `.bss` (zero-initialized globals) is zeroed in SRAM at startup. The stack typically starts at the top of SRAM and grows downward. See {{< relref "/docs/embedded/mcu-architecture/memory-map" >}} for how these sections map to the hardware address space.

Getting the linker script wrong is uniquely dangerous because the build succeeds. The linker trusts you. If you declare 128 KB of SRAM on a chip that only has 64 KB, the linker places data in nonexistent memory, and the firmware crashes at runtime with no compile-time warning.

Vendor-provided linker scripts are a good starting point, but they often include features you may not need (heap allocation, multiple SRAM banks) or make assumptions about stack size that do not match your application. Reading the vendor's linker script line by line, at least once, is time well spent.

## The Startup File

Before `main()`, someone has to set up the vector table, copy `.data` from flash to SRAM, zero `.bss`, and call `SystemInit()`. That someone is the startup file — usually assembly (e.g., `startup_stm32f411xe.s`) provided by the MCU vendor. For details on what the startup file does and why it matters, see {{< relref "/docs/embedded/firmware-structure/startup-and-initialization" >}}.

Most projects never modify the startup file, and that is fine. But when you need to add an early debug GPIO toggle, change the initial stack location, or support a custom bootloader entry, understanding what this file does is essential. It is not magic — it is a short sequence of loads, stores, and branch instructions.

## ELF vs Binary vs Intel HEX

The linker produces an ELF (Executable and Linkable Format) file. ELF contains everything: machine code, debug symbols, section headers, relocation info. Your debugger reads the ELF file to map addresses back to source lines.

Flash programmers and bootloaders typically want one of two formats:

- **Raw binary** (`.bin`) — Just the machine code bytes, starting at the base address. No metadata. The programmer must know where to write it. Generated with `arm-none-eabi-objcopy -O binary`.
- **Intel HEX** (`.hex`) — ASCII text with address and data records. Each line encodes a block of bytes and its target address. The programmer reads the addresses from the file. Generated with `arm-none-eabi-objcopy -O ihex`.

I have been burned by flashing a `.bin` file at the wrong address. The binary format has no way to tell the programmer "I belong at 0x08000000" — that information is in the ELF or HEX file but not in the raw binary.

Another useful tool is `arm-none-eabi-objdump`, which can disassemble the ELF file and show the section layout. Running `objdump -h firmware.elf` gives a quick summary of where each section was placed and how large it is — a lighter-weight alternative to reading the full map file.

## Build Systems

**Make** is the traditional choice. A `Makefile` lists source files, compiler flags, and build rules. It is transparent — you can read the Makefile and see exactly what commands will run. It is also verbose, error-prone for large projects, and does not handle header dependency tracking well without extra tooling.

**CMake** is increasingly common in embedded, especially with frameworks like Zephyr and STM32CubeIDE's newer project formats. CMake generates build files (Makefiles, Ninja files) from a higher-level description. It handles cross-compilation via toolchain files, and dependency tracking is automatic. The learning curve is real, but for multi-target or multi-library projects, it pays off.

**Vendor IDEs** (STM32CubeIDE, Keil, IAR) hide the build system behind a GUI. This works until it does not — when you need to add a custom linker script section, integrate a third-party library, or reproduce the build in CI. Understanding what the IDE is doing underneath (which compiler flags, which linker script, which startup file) matters when the GUI options are not enough.

Whichever build system you use, the goal is the same: reproducible builds. Given the same source, the same toolchain version, and the same flags, the output should be identical every time. When a build breaks, the first question is always "what changed?" — and a well-structured build system makes that question answerable.

## Map Files

The linker's map file (`-Wl,-Map=firmware.map`) is the report card for the build. It shows where every function and variable was placed, how much flash and SRAM are used, and which sections are consuming the most space.

When the build fails with "region FLASH overflowed" or "region SRAM overflowed," the map file tells you exactly what filled up. I check the map file periodically even when the build succeeds, to catch memory usage trends before they become emergencies.

Reading a map file for the first time is overwhelming — they are long and dense. Start by looking at the memory usage summary at the bottom (total flash used, total SRAM used) and the list of symbols sorted by size. The largest functions and data objects are usually the first candidates for optimization when space runs tight. Tools like `puncover` or `bloaty` can parse map files and present the data more readably, but the raw map file is always available and requires no extra tooling.

## Gotchas

- **Missing `-mthumb` produces ARM-mode code that faults on Cortex-M** — The Cortex-M only executes Thumb instructions. If the compiler emits ARM-mode code (32-bit ARM encoding), the CPU faults immediately. This usually only happens with hand-assembled build commands or custom Makefiles that forgot the flag.
- **Optimization makes bugs appear and disappear** — A bug that manifests at `-O2` but not `-O0` is almost always undefined behavior or a missing `volatile`. The optimizer is not wrong; it is exploiting freedom the C standard gives it. Blaming the compiler is tempting but rarely correct.
- **Linker script memory sizes are not validated against hardware** — The linker has no way to know how much flash or SRAM your chip actually has. If you copy a linker script from a different board with more memory, the build succeeds and the firmware crashes. Always verify the MEMORY section against the datasheet.
- **Dead code elimination requires both compile and link flags** — Using `-ffunction-sections` without `--gc-sections` (or vice versa) does nothing useful. Both flags must be present, and they must be passed to the right stage: `-f` flags to the compiler, `--gc-sections` to the linker.
- **`objcopy` binary output does not encode the base address** — If your flash is at 0x08000000 and you flash the `.bin` at 0x00000000, the firmware will not run and there will be no error message from the programmer. Intel HEX avoids this problem because it includes address records.
- **Newlib pulls in more than you expect** — The default C library for `arm-none-eabi-gcc` is newlib, which includes a full `printf` implementation with floating-point support. A single `printf` call can add 20-50 KB of flash usage. Use newlib-nano (`--specs=nano.specs`) for a smaller implementation, or avoid `printf` entirely in flash-constrained projects.
