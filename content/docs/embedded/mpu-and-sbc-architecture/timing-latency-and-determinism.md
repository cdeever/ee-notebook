---
title: "Timing, Latency & Determinism"
weight: 70
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Timing, Latency & Determinism

On an MCU, interrupt response is deterministic — the datasheet gives a worst-case cycle count, and it can be trusted. On an MPU running Linux, "how fast will it respond" becomes "how fast will it usually respond, and what is the worst case nobody can guarantee." This page covers why MPUs are not deterministic, what can be done about it, and when to stop fighting Linux and offload real-time work to a co-processor.

## Why MPUs Are Not Deterministic

An MPU running Linux has many layers of hardware and software between an external event and the application's response, and each layer introduces variable delay. The combined effect is sobering.

**Caches** are the first source of jitter. A cache hit returns data in a few cycles; a miss can cost 50-200+ cycles going to DRAM. Since cache state depends on what other code has been running, there is no way to predict whether a critical code path will be hot or cold.

**Virtual memory** adds another layer. Every memory access goes through the TLB. A TLB miss forces a page table walk. Worse, if the page is not even mapped (a page fault), the kernel must handle the fault — allocating memory, possibly reading from disk — adding microseconds to milliseconds of latency. See [MMU, Virtual Memory & Address Spaces]({{< relref "mmu-virtual-memory-and-address-spaces" >}}).

**The Linux scheduler** is perhaps the most visible source of non-determinism. Any given process shares the CPU with potentially hundreds of other threads, and the default scheduler optimizes for throughput and fairness, not response time. Kernel code paths can hold spinlocks or disable preemption, blocking everything else on that CPU.

**Interrupts** go through the kernel's interrupt framework — acknowledge, top-half handler, then schedule a bottom-half — before anything reaches user space. This overhead is typically 5-20 microseconds even in the best case.

The combined effect: measured GPIO toggle latency on a stock Raspberry Pi 4 shows an average around 5-10 microseconds from user space, but occasional spikes beyond 500 microseconds. Under heavy I/O load, spikes exceeding a millisecond are observable. Plotting a latency histogram reveals a sharp peak at typical latency and a long, fat tail. That tail is fundamentally different from the MCU world where worst-case timing is deterministic and in the datasheet. See [Determinism & Timing]({{< relref "/docs/embedded/real-time-concepts/determinism-and-timing" >}}) for how MCUs handle this differently.

## PREEMPT_RT

The PREEMPT_RT patch set is the most significant software improvement available for Linux real-time performance. It transforms the kernel from a throughput-optimized system into one that can provide bounded worst-case latency.

The key change is making nearly all kernel code preemptible. Stock kernels have non-preemptible regions (spinlock-held sections) that can block high-priority threads. PREEMPT_RT converts most spinlocks to sleeping mutexes with priority inheritance, and converts most interrupt handlers to schedulable kernel threads. A high-priority real-time thread can preempt nearly anything.

The practical result is substantial. On a Raspberry Pi 4, worst-case latency under heavy load drops from 1-2 milliseconds (stock kernel) to under 80 microseconds (PREEMPT_RT) — a 10-20x improvement. The cost: slight throughput reduction from additional context switches, and not all drivers are RT-safe.

PREEMPT_RT has been progressively merged into mainline Linux, and most core patches are in the 6.x kernel series. Yocto and Buildroot both support building PREEMPT_RT kernels. See [RTOS Fundamentals]({{< relref "/docs/embedded/real-time-concepts/rtos-fundamentals" >}}) for how dedicated real-time operating systems compare.

## When to Offload: Co-Processors and Bare Metal

When even PREEMPT_RT is not fast enough, the answer is to stop fighting Linux and offload the real-time work entirely. This is a sound architectural pattern, not an admission of defeat.

Even simple hardware bypass helps. Many SoC peripherals operate autonomously once configured — a hardware timer generates PWM, an SPI controller clocks out a buffer via DMA, an ADC samples on a timer trigger and fills a DMA buffer — all with zero software jitter. This is the easiest form of "real-time on Linux" and it is underutilized.

For tasks requiring deterministic code execution, dedicated co-processors are the answer. The TI PRU on BeagleBone boards provides 200 MHz RISC cores with single-cycle I/O — no caches, no MMU, no pipeline hazards. Cortex-M companion cores on hybrid SoCs (STM32MP1's M4, i.MX 8M's M4/M7) operate exactly like standalone MCUs, with Linux on the A-cores handling networking, filesystems, and UI while the M-core handles hard real-time tasks.

A rough decision framework: for anything requiring better than ~100 microseconds worst-case response, use PREEMPT_RT. For better than ~20 microseconds, use a co-processor or dedicated MCU. For sub-microsecond determinism, bare-metal MCU code or a specialized peripheral like the PRU.

## Tips

- Use `SCHED_FIFO` via `chrt`, call `mlockall()`, and pre-allocate all memory at startup for RT user-space code
- Characterize worst-case latency under load, not average — the tail matters, not the peak
- Check `/proc/sys/kernel/sched_rt_runtime_us` when RT tasks exhibit unexpected latency spikes — the default throttles RT tasks to 95% CPU
- For requirements below ~20 microseconds worst-case, use a co-processor or dedicated MCU rather than fighting Linux

## Caveats

- **PREEMPT_RT is not a magic fix on its own** — User-space code must use `SCHED_FIFO`, call `mlockall()`, pre-fault stack and heap, and avoid blocking syscalls
- **Page faults in RT code paths destroy latency** — A single demand page fault can cost hundreds of microseconds
- **The RT throttling safety net catches people off guard** — `/proc/sys/kernel/sched_rt_runtime_us` defaults to 950 ms per second. If an RT task tries to use more, latency explodes
- **One bad driver ruins system-wide RT latency** — A single driver that disables preemption for too long creates spikes regardless of tuning elsewhere
- **`nice` is not RT priority** — The `nice` value only affects CFS scheduler fairness. For real-time behavior, use `SCHED_FIFO` or `SCHED_RR`
- **Worst case matters, not average** — An average latency of 10 microseconds is meaningless if the worst case is 2 milliseconds

## In Practice

- Latency histograms with a sharp peak and a long tail reveal the difference between average and worst case — measure both
- RT tasks that run fine for a few seconds then stall are hitting the RT throttling limit — check `sched_rt_runtime_us`
- Latency spikes that correlate with specific drivers or peripherals indicate a non-RT-safe driver
- A task using `nice` that still has poor latency under load needs `SCHED_FIFO`, not a lower nice value
