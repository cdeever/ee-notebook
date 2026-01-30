---
title: "Toolchains & Debugging"
weight: 60
bookCollapseSection: true
---

# Toolchains & Debugging

Seeing what the system is doing. Embedded development requires a toolchain that cross-compiles for a target that cannot run a compiler, a debug interface that connects to hardware with no screen or keyboard, and observability techniques that reveal behavior without changing it. The tools are different from desktop development, and so are the failure modes.

Understanding the toolchain — what the compiler generates, how the linker places code and data, what the startup file does before main() — matters because embedded bugs often live at these boundaries. A misplaced section in the linker script, a missing volatile qualifier, or an incorrect interrupt vector can produce failures that no amount of application-level debugging will find.

## What This Section Covers

- **[Build Systems & Toolchains]({{< relref "build-systems-and-toolchains" >}})** — Compilers, linkers, startup files, linker scripts, and memory placement: from source code to binary on the target.
- **[Debug Interfaces]({{< relref "debug-interfaces" >}})** — JTAG, SWD, breakpoints, watchpoints, and semihosting: connecting to the running system.
- **[Observability]({{< relref "observability" >}})** — Logging, tracing, logic analyzers, and scope-assisted debugging: seeing firmware behavior without a debugger.
