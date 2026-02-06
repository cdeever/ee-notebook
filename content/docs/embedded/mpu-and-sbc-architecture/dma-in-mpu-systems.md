---
title: "DMA in MPU Systems"
weight: 80
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# DMA in MPU Systems

DMA on an MCU means configuring a peripheral to read from or write to physical memory addresses — set up source, destination, and length in registers, and the transfer runs without CPU intervention. DMA on an MPU running Linux involves the same concept but adds layers of complexity: virtual-to-physical address translation, cache coherency, and kernel-managed DMA mappings. The hardware problem is the same — move data without burning CPU cycles — but the software machinery is fundamentally different.

## DMA with an MMU

The core problem: DMA controllers operate on physical addresses, but the kernel and user space work with virtual addresses. A buffer allocated with `malloc()` has a virtual address that means nothing to the DMA controller — it is an index into that process's page table, not a location on the memory bus. Passing a virtual address to a DMA controller reads or writes whatever happens to live at that numerical value in physical memory, which is almost certainly not the intended buffer. On an MCU, this entire problem does not exist because all addresses are physical. See [DMA Fundamentals]({{< relref "/docs/embedded/communication-interfaces/dma" >}}) for how DMA works in that simpler world.

The kernel must translate virtual addresses to physical addresses before programming a DMA transfer. It must also pin the physical pages — locking them so the virtual memory system cannot swap them out or reclaim them during the transfer. And a buffer that is contiguous in virtual memory may map to scattered physical pages, creating the scatter-gather problem for any DMA transfer larger than a single page. See [MMU, Virtual Memory & Address Spaces]({{< relref "mmu-virtual-memory-and-address-spaces" >}}) for the details of virtual-to-physical translation.

The Linux kernel provides a DMA API that abstracts all of this. Most driver and application code never directly touches DMA addresses, page pinning, or scatter-gather lists — the kernel handles the complexity. The API provides two main approaches: coherent mappings (where CPU and device always see consistent data, at the cost of uncacheable memory) and streaming mappings (which use cached memory but require explicit synchronization).

## Cache Coherency and DMA

This is the same fundamental problem that exists on MCUs with data caches, but with more layers. The CPU accesses memory through its cache hierarchy; the DMA controller bypasses the cache and accesses DRAM directly. This creates two stale-data scenarios. See [DMA Fundamentals]({{< relref "/docs/embedded/communication-interfaces/dma" >}}) for how this manifests on Cortex-M7 MCUs with caches.

When the CPU writes data to a buffer and a DMA controller needs to read it (transmitting a network packet), CPU writes sitting in cache must be flushed to DRAM first — otherwise the DMA controller reads stale data. When a DMA controller writes to a buffer (receiving sensor data) and the CPU needs to read it, the CPU's cache must be invalidated for those addresses — otherwise it reads cached old data instead of fresh DMA data.

The kernel's DMA API handles these cache operations when used correctly. Coherent mappings sidestep the problem by marking memory as uncacheable. Streaming mappings use cached memory but require explicit sync calls before and after transfers. Forgetting a sync call produces intermittent data corruption — intermittent because it depends on cache state, which varies with system load and timing.

Some SoCs provide hardware cache coherency for DMA through interconnect protocols, eliminating the need for software cache management. But many mid-range embedded SoCs have non-coherent DMA for at least some peripherals, so understanding the software cache management path remains essential.

## DMA and User Space

For the vast majority of embedded Linux work — SPI devices, I2C sensors, UARTs — DMA is invisible to user-space code. The kernel driver manages DMA internally, and user space interacts through standard file operations. There is no need to allocate a DMA buffer or think about cache coherency. The driver handles all of it. See [Drivers, Kernel Space & User Space]({{< relref "drivers-kernel-space-and-user-space" >}}) for how this abstraction works.

User-space DMA exists for specialized high-performance scenarios (networking with DPDK, camera capture with V4L2, GPU rendering with DRM/KMS), but for typical embedded work, understanding that these frameworks exist and handle the DMA complexity is more important than knowing the implementation details.

## Tips

- Always use the kernel DMA API for address translation and cache management — never pass virtual addresses directly to DMA controllers
- Use streaming DMA mappings for performance-critical transfers and call sync functions at the right points
- Reserve coherent DMA memory only for buffers that must be shared with devices — it is uncacheable and slow for CPU access
- Size the CMA pool adequately at boot time — it cannot be expanded at runtime

## Caveats

- **Using virtual addresses for DMA is a guaranteed bug** — The DMA controller will read or write the wrong physical location. This mistake is easy to make when porting MCU code to an MPU
- **Forgetting to sync caches with streaming DMA mappings causes intermittent data corruption** — The hardest kind of bug to diagnose because it depends on cache state, which varies with system load
- **Coherent DMA memory is uncacheable and slow for CPU access** — `dma_alloc_coherent()` memory bypasses the CPU cache. Do not use it as general-purpose memory
- **CMA pool size is fixed at boot** — The Contiguous Memory Allocator reserves its pool during early boot. If undersized, large contiguous allocations fail at runtime

## In Practice

- Data corruption that appears and disappears randomly with DMA transfers suggests missing cache sync calls — the bug depends on cache state
- DMA transfers that work on MCU code but fail when ported to Linux likely pass virtual addresses instead of using the DMA API
- CPU operations on DMA buffers that are unexpectedly slow may be using `dma_alloc_coherent()` memory — it is uncacheable
- Allocation failures for large contiguous buffers at runtime indicate an undersized CMA pool
