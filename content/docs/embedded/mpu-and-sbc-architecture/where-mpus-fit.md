---
title: "Where MPUs Fit in Embedded Design"
weight: 100
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Where MPUs Fit in Embedded Design

This page is the synthesis — pulling together the architectural concepts from the rest of the section into practical design guidance. The question is not "MCU or MPU?" in the abstract, but "what does the system need to do, and which architecture makes that easier?" Sometimes the answer is one or the other. Sometimes it is both.

## The Design Decision Space

The MCU-vs-MPU decision exists in a three-dimensional space. The axes are real-time requirements, software complexity, and production constraints. Each axis pulls the design toward a different architecture, and most real systems do not sit neatly at an extreme.

**Real-time behavior.** Hard real-time means a missed deadline is a system failure — motor commutation, safety interlocks, bit-level protocol timing. Soft real-time means latency matters but occasional misses are tolerable — audio streaming, display refresh. Best-effort means the system does the work when it gets to it. MCUs dominate hard real-time. MPUs running Linux are best-effort by default, and even with PREEMPT_RT, they offer soft real-time at best. See [Timing, Latency & Determinism]({{< relref "timing-latency-and-determinism" >}}).

**Software complexity.** At one end: a bare-metal loop that reads a sensor and toggles an output. At the other: a system running a web server, TLS-encrypted MQTT, a database, camera processing, and over-the-air updates. As software complexity grows on an MCU, the firmware starts reimplementing OS services — TCP/IP stack, filesystem, task scheduler, memory allocator — each a fraction of the Linux equivalent and each code that must be maintained. At some point, the honest choice is to use an OS that already provides these services.

**Production constraints.** An MCU can cost under a dollar, run for years on a coin cell, and need only a crystal and decoupling caps. An MPU adds external DRAM, storage, a PMIC, and supporting passives — easily $5-15 in additional BOM cost, hundreds of milliamps minimum draw, and a more complex PCB. For millions of units, that cost difference is decisive. For hundreds of units, it is often irrelevant compared to development time.

MCUs dominate the corner where all three axes are favorable: low complexity, hard real-time, low cost. MPUs dominate the opposite corner. The interesting designs live in the middle. See [MCU vs MPU]({{< relref "mcu-vs-mpu" >}}) for the detailed architectural comparison.

## Hybrid Architectures

Rather than forcing a choice, hybrid SoCs provide both an application processor and a real-time microcontroller on the same die. The STM32MP1 pairs a Cortex-A7 (Linux) with a Cortex-M4 (bare-metal or FreeRTOS). NXP's i.MX 8M family pairs A53 cores with M4/M7. TI's AM64x includes A53, M4F, and R5F cores.

The pattern is consistent: Linux handles networking, filesystem, UI, and logging. The co-processor handles hard real-time tasks — motor control, sensor acquisition, safety-critical functions. They communicate via shared memory and hardware mailbox interrupts, typically through the RPMsg framework.

The most challenging aspect is the development workflow — two codebases, two toolchains, two debug setups, and asynchronous communication between them. When something goes wrong in inter-processor communication, correlating events across both sides requires care. The engineering cost of hybrid designs is not silicon or board area, but development and debugging time.

## Software Complexity as the Driver

Software complexity is the factor most likely to push a design from MCU to MPU. The transition point is often more obvious in retrospect.

Networking is the first threshold. A basic TCP/IP stack on an MCU is achievable, but add TLS, MQTT, an HTTP server, and mDNS, and the MCU spends more cycles on the network stack than on its actual job. Linux handles all of this natively with battle-tested implementations and regular security patches.

Graphical interfaces follow a similar pattern. LVGL runs on Cortex-M parts and produces impressive results within constraints, but on an MPU the options include Qt, GTK, web-based interfaces, or Wayland compositors with GPU acceleration.

Camera integration is perhaps the most clear-cut case. USB and MIPI CSI cameras work trivially under Linux through V4L2. On a bare-metal MCU, camera integration means writing interface drivers, managing DMA, and implementing image processing — development effort disproportionate to the result.

The key threshold: when a design starts reimplementing operating system services on an MCU, an MPU running Linux may be the more honest choice.

## Cost and Power Implications

An MPU is never just a chip. External DRAM, storage (eMMC for production), a PMIC with sequencing logic, and supporting passives add $5-15+ to the BOM. For consumer electronics shipping millions of units, this is enormous. For industrial equipment in thousands, it is often less important than development time saved.

Power consumption diverges sharply. A Cortex-M4 in stop mode draws single-digit microamps. An MPU running Linux draws hundreds of milliamps as a floor — DRAM refresh alone is continuous. In battery-powered designs, the common pattern is MCU-as-gatekeeper: the MCU handles always-on sensing at microamp levels, waking the MPU only when something interesting happens — boot, process, communicate, sleep.

## Tips

- Profile workload requirements before selecting an SoC — choosing a quad-core when a single core suffices wastes cost and power
- When MCU firmware starts reimplementing OS services, reconsider whether an MPU running Linux is the more honest choice
- Plan for long-term maintenance on MPU systems — Linux requires security patches, kernel updates, and userland maintenance over the product lifecycle
- Use vendor compute modules or evaluation boards rather than Raspberry Pi for prototypes intended to become production products

## Caveats

- **Over-specifying the MPU** — Choosing a quad-core A72 when a single A7 would suffice wastes cost, power, and thermal budget
- **Under-specifying the MCU** — Trying to run a complex networking stack with TLS on a Cortex-M0+ with 32 KB of RAM leads to fragile, partial reimplementations of OS services
- **Ignoring boot time** — An MCU is instant-on. An MPU takes 5-30 seconds. Fast-boot optimizations exist but cannot match MCU instant-on
- **Neglecting long-term maintenance** — An MCU firmware image can run unchanged for a decade. An MPU running Linux needs ongoing security and kernel maintenance
- **Prototype-to-production gap** — A Raspberry Pi prototype does not map cleanly to a production board. The boot process, device tree, and SoC availability are Pi-specific
- **Assuming "just add Linux" solves the problem** — Linux adds boot time, security surface area, update mechanisms, and failure modes along with its capabilities

## In Practice

- A design that meets requirements on an MCU but is implemented on an MPU "for convenience" carries unnecessary complexity and maintenance burden
- Firmware that runs fine in development but has security vulnerabilities in the field suggests maintenance planning was neglected
- A prototype on a Pi that cannot meet real-time requirements reveals an architectural mismatch — consider a hybrid SoC or dedicated MCU for real-time tasks
- A product that boots too slowly for user acceptance was designed without considering MPU boot time constraints
