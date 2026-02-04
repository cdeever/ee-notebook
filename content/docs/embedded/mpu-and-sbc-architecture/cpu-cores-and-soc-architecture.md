---
title: "CPU Cores & SoC Architecture"
weight: 20
---

# CPU Cores & SoC Architecture

Application processor cores and the SoCs built around them are a different world from MCU cores. Moving from a Cortex-M to a Cortex-A part is not just a step up in clock speed — the core microarchitecture changes fundamentally, and the chip surrounding the core grows into an entire computing platform on a single die.

## Cortex-A: The Application Processor Core

Coming from Cortex-M territory, the Cortex-A family feels like a different species. The Cortex-M cores described in [Core Architectures]({{< relref "/docs/embedded/mcu-architecture/core-architectures" >}}) are designed around determinism: short pipelines, in-order execution, single-issue, and predictable cycle counts. The Cortex-A cores prioritize throughput. They execute instructions out of order, speculatively fetch down both sides of a branch, issue multiple instructions per cycle, and rely on deep pipelines to sustain high clock frequencies. The hardware hides memory latency — while one instruction waits for a cache miss, others continue executing — but at the cost of predictability. Counting cycles on a Cortex-A the way one can on an M0 is not possible.

The specific cores worth knowing fall into two camps. The efficiency cores — A53 and A55 — are modest designs that trade peak performance for low power and small die area. The A53 is probably the single most widely deployed 64-bit core in the world. The performance cores — A72, A76, and beyond — are wide, aggressive out-of-order designs that chase single-threaded performance. For the SBC world, the A72 (Raspberry Pi 4) and A76 (Pi 5) are the cores encountered most often, with A55 appearing on budget boards.

Understanding the [MCU vs MPU decision]({{< relref "mcu-vs-mpu" >}}) helps frame why these differences matter. The Cortex-A is the right choice when throughput, memory management hardware, and software ecosystem matter — not when deterministic timing is the priority.

## Multi-Core and big.LITTLE

Most application processors ship with multiple CPU cores, and the marketing claims can be misleading. A "quad-core A72" does not deliver four times the performance of a single A72. Only the parallelizable portion of a workload benefits from additional cores, and a single-threaded application runs on one core while the others sit idle.

Where multiple cores genuinely help is concurrent workloads — not one task split into threads, but multiple independent tasks running simultaneously. An embedded Linux system might run a web server on one core, a sensor acquisition daemon on another, a database on a third, and the display compositor on a fourth. This is the common case on SBC-based embedded designs. Symmetric multiprocessing (SMP) is the standard model: all cores are identical, share the same view of memory, and can run any thread. The Linux scheduler assigns threads to cores and migrates them as load shifts.

ARM's big.LITTLE architecture (and its successor DynamIQ) combines heterogeneous cores on a single SoC — pairing high-performance cores (e.g., A76) with efficiency cores (e.g., A55). Background tasks run on the power-efficient cores, while compute-heavy tasks get dispatched to the big cores. The scheduler makes these placement decisions based on load history and power targets. The RK3588 (4x A76 + 4x A55) found in higher-end SBCs is a DynamIQ arrangement. The power difference is significant: a Cortex-A55 core at 1.0 GHz might consume 100-200 mW, while a Cortex-A76 at 2.4 GHz might draw 2-4 W under load.

## The SoC: More Than a CPU

The term "System on Chip" is literal — the CPU core, even a quad-core cluster, is often a minority of the die area. The rest is a collection of specialized hardware blocks: GPU, video encoder/decoder, camera ISP, crypto engine, display controller, and bus controllers for USB, PCIe, SDIO, and MIPI interfaces. Each block has its own registers, DMA channels, and interrupt lines, and the Linux kernel needs a driver for each one.

The practical consequence is that an SoC's value depends heavily on driver support. A chip may integrate a capable hardware video decoder, but if the Linux kernel does not have a working driver for it, the system is stuck with CPU-based software decoding. There are SBCs with impressive spec sheets where half the hardware blocks are unusable under mainline Linux because the vendor only provided drivers for their Android BSP. Community Linux support (mainline kernel drivers, upstream device tree bindings) matters as much as the silicon itself.

On an MCU, the CPU *is* the chip, with peripherals attached. On an SoC, the CPU is one client on a shared bus, competing with a GPU, a VPU, camera pipelines, and DMA engines for access to the same DRAM. A 4K video decode pipeline or a GPU rendering a display frame can dominate the memory bus, leaving the CPU starved for bandwidth.

## Memory Hierarchy: Caches

The memory hierarchy on a Cortex-A SoC is fundamentally different from the flat, deterministic memory map on a Cortex-M. On an MCU, every memory access takes a known number of cycles. On a Cortex-A, access time depends on where the data currently lives in a multi-level cache hierarchy, and that changes dynamically as the program executes.

Every Cortex-A core has private L1 instruction and data caches (typically 32 or 64 KB each), servicing most accesses in 1-4 cycles. An L1 miss falls through to the L2 cache (256 KB to 2 MB), and some SoCs add a shared L3. A last-level cache miss that goes to DRAM costs 50-200+ cycles. This variability is the fundamental reason Cortex-A cores are not suitable for hard real-time work — the same function, called twice with the same arguments, may take wildly different amounts of time depending on cache state.

For embedded work, cache behavior matters in two specific ways. First, DMA coherency: when a peripheral DMA engine writes data to DRAM, the CPU's cache may still hold stale data. The kernel must manage cache invalidation and flushing around DMA transfers — getting this wrong produces intermittent data corruption. Second, real-time jitter: the order-of-magnitude difference between a cache hit and a DRAM access makes execution time unpredictable. See [MMU, Virtual Memory & Address Spaces]({{< relref "mmu-virtual-memory-and-address-spaces" >}}) for how caches interact with the virtual memory system.

## Common SoC Families

A handful of SoC families dominate the embedded Linux and SBC world. Each has a distinct character, and the choice is about the entire package: peripherals, Linux BSP quality, documentation, and supply chain.

**Broadcom BCM2xxx (Raspberry Pi).** BCM2711 (Pi 4, quad A72) and BCM2712 (Pi 5, quad A76). Historically poorly documented silicon, but the Pi Foundation's software support and community make the ecosystem unmatched for learning embedded Linux.

**Allwinner (H3, H5, H616).** Budget-tier SoCs for low-cost SBCs like the Orange Pi. Mainline Linux support has improved thanks to the linux-sunxi community, though some peripherals still rely on vendor-patched kernels. Attractive when cost matters most.

**Rockchip (RK3399, RK3588).** Mid-to-high performance tier. The RK3588 (4x A76 + 4x A55, Mali-G610, 6-TOPS NPU) is found in boards like the Orange Pi 5 and Rock 5B. More documentation than Broadcom, reasonable mainline upstreaming. Compelling for projects needing serious compute.

**TI Sitara AM335x (BeagleBone).** Single Cortex-A8 with two PRU co-processors — 200 MHz deterministic cores for hard real-time I/O alongside Linux. Excellent documentation. The AM335x is aging, but TI's newer AM62x/AM64x carry the philosophy forward.

**NXP i.MX 6/8.** Targets industrial, automotive, and medical applications with long-term availability guarantees and comprehensive reference manuals. Higher cost, heavier software stack, but 10-year supply commitments and vendor support.

The pattern across these families: the choice involves a combination of silicon capability, software maturity, documentation quality, and supply chain characteristics. For learning, start with whatever has the strongest community. For production, documentation and vendor support matter more than raw specs.

## Tips

- Characterize worst-case timing behavior, not average — cache misses can add 50-200 cycles to operations that normally take 5 cycles
- Verify GPU and video hardware block driver support under mainline Linux before selecting an SoC — many impressive hardware features lack working drivers
- For learning, start with platforms that have the strongest community support regardless of raw specs
- Budget time for discovering what SoC documentation does not tell — vendor docs are often incomplete or under NDA

## Caveats

- **Cache misses destroy determinism** — A single L2 cache miss can add 50-200 cycles to an operation that normally completes in 5 cycles. Cortex-A cores are not suitable for hard real-time work
- **Multi-core does not mean multi-threaded code runs faster automatically** — An application must be explicitly written to use multiple threads, and the workload must be parallelizable
- **GPU driver support on embedded SoCs is often poor** — Mali GPUs historically relied on closed-source drivers. Panfrost and Lima have improved the situation, but hardware video acceleration remains incomplete on many SoCs
- **SoC documentation is often under NDA or incomplete** — Expect to discover missing information through experimentation
- **Thermal throttling on small SBCs limits sustained performance** — A Cortex-A72 in a fanless case throttles within minutes under sustained load. Quoted clock speed is a peak, not a sustained guarantee

## Bench Relevance

- Performance that varies unpredictably under similar conditions suggests cache behavior differences — run timing tests multiple times and look at worst case, not average
- A multi-core SoC with one core at 100% and others idle indicates a single-threaded workload — parallelizing will help, but only if the workload is parallelizable
- Hardware video acceleration that does not work despite being listed in the SoC specs likely lacks driver support — check mainline kernel status
- A fanless SBC that runs slower after a few minutes of load is thermal throttling — add a heatsink or active cooling
