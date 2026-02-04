---
title: "MMU, Virtual Memory & Address Spaces"
weight: 30
---

# MMU, Virtual Memory & Address Spaces

The MMU is the biggest conceptual leap from MCU to MPU. On an MCU, a pointer is a physical address. On an MPU running Linux, a pointer is a virtual address that the MMU translates to a physical address — and that translation is what makes process isolation, memory protection, and modern operating systems possible.

## Why Virtual Memory Exists

On a microcontroller, every piece of code shares one flat physical address space. The main loop, ISRs, RTOS tasks — they all see the same memory, can write to the same addresses, and can corrupt each other freely. See [Memory Map]({{< relref "/docs/embedded/mcu-architecture/memory-map" >}}) for how that flat physical address space works on Cortex-M.

Virtual memory solves problems that emerge when running multiple independent programs on the same hardware. Isolation: a buggy process must not corrupt another's data. Protection: user-space code must not access kernel memory. Convenience: each process sees the entire address space as its own. Additional benefits follow from the same mechanism — shared libraries loaded once in physical memory can be mapped into every process that needs them, and memory-mapped files allow accessing file contents as if they were in memory.

All of this requires hardware support. The MMU sits between the CPU and the memory bus, translating every virtual address to a physical address on the fly. Without it, none of these features are practical.

## How the MMU Works

The MMU divides both virtual and physical memory into fixed-size pages (typically 4 KB). When the CPU accesses a virtual address, the MMU looks up which physical page it maps to. The mapping is stored in a page table — a hierarchical data structure in memory. Permission bits on each entry control read, write, execute, and user/kernel access.

The critical performance concern is that every memory access conceptually requires multiple memory reads to walk the page table. The solution is the Translation Lookaside Buffer (TLB) — a small, fast cache of recent virtual-to-physical mappings. TLB hit rates in practice are typically 99% or higher, because programs exhibit strong locality. A TLB miss triggers a hardware page table walk on ARM, costing dozens to hundreds of cycles depending on whether the table entries are in cache.

## Address Spaces in Practice

Each process on a Linux system sees its own flat virtual address space. Two processes can have the same virtual address mapping to completely different physical pages. Neither can see the other's data.

The key shift from MCU thinking: a pointer is no longer a physical address. Writing to address `0x4000_0000` does not touch whatever hardware lives at that physical location — it accesses whatever the MMU has mapped there for that process, which is almost certainly regular RAM (or nothing at all, resulting in a segfault).

## Memory-Mapped I/O in an MMU World

On a microcontroller, writing to a peripheral register is just a store to a physical address. On an MPU running Linux, user-space code cannot access physical addresses directly — any attempt results in a segmentation fault. This is a feature, not a limitation. If any user-space process could write to arbitrary physical addresses, one buggy program could crash the entire system.

The proper way to access hardware is through kernel drivers. A driver runs in kernel space, maps physical peripheral addresses using `ioremap()`, and exposes a controlled interface to user space — device files in `/dev`, attributes in `/sys`, or platform device interfaces. User-space code talks to the driver through standard system calls. See [Drivers, Kernel Space & User Space]({{< relref "drivers-kernel-space-and-user-space" >}}) for how the driver model works.

## Memory Overcommit and OOM

Virtual memory allows the system to promise more memory than physically exists. The kernel only assigns physical pages when they are actually written to (demand paging), so total allocations can exceed physical RAM. On desktop systems, swap extends this to disk. On embedded Linux, swap is almost always a bad idea — SD cards have limited write endurance, and swap latency (milliseconds) compared to DRAM (nanoseconds) makes the system unusable.

When physical memory is exhausted and there is no swap, the kernel invokes the OOM (Out of Memory) killer, selecting a process to terminate. On an embedded system with a well-defined workload, the OOM killer should never fire. If it does, the memory budget was wrong. Embedded Linux configurations often set `vm.overcommit_memory=2` with no swap, so that `malloc` fails early rather than allowing processes to allocate memory that cannot be backed.

## Tips

- Use `mlockall()` early in real-time applications to pre-fault all memory and eliminate page fault jitter
- Disable swap on embedded systems and budget physical RAM instead — swap on SD cards kills both performance and card lifespan
- Set `oom_score_adj` to -1000 for critical processes to make them immune to the OOM killer
- Use `/dev/mem` only for quick experiments, never in production — it bypasses all kernel protections

## Caveats

- **Page faults cause non-deterministic latency** — A page fault triggers kernel code to allocate a page, possibly zeroing it or reading from disk. This can add hundreds of microseconds to milliseconds
- **Swap on SD cards kills the card and the performance** — Flash storage has limited write cycles, and swap generates enormous write traffic
- **OOM killer picks victims heuristically and may kill the wrong process** — If physical memory is exhausted, the kernel selects a process to terminate based on heuristics
- **/dev/mem access bypasses all kernel protections and can crash the system** — Mapping physical memory lets user space write to kernel data structures, DMA buffers, or peripheral registers
- **Faults manifest differently on MCUs and MPUs** — On a Cortex-M, a bad memory access triggers a HardFault. On an MPU, the kernel delivers a SIGSEGV, killing just that process

## Bench Relevance

- Latency spikes that appear randomly in otherwise fast code suggest page faults — use `mlockall()` and pre-allocate all memory at startup
- An embedded system that slows dramatically over time and eventually corrupts the SD card likely has swap enabled — disable it
- A critical process that gets killed under memory pressure has the default `oom_score_adj` — set it to -1000
- A SIGSEGV in one process while the rest of the system continues running demonstrates MMU protection working as designed
