---
title: "Single-Board Computers as Systems"
weight: 90
---

# Single-Board Computers as Systems

A single-board computer is a complete Linux-capable system on one PCB: SoC, RAM, storage interface, power regulation, and I/O connectors. SBCs are where MPU concepts become tangible — you can hold one, plug it in, and have a shell prompt. But the gap between "it boots on the bench" and "it runs reliably in a product" is wider than it looks.

## What Makes an SBC

At its simplest, an SBC combines a System-on-Chip with the external components needed to run a full operating system: DRAM (soldered directly to the board or integrated into the SoC package), a storage interface (SD card slot, eMMC, sometimes NVMe), voltage regulators to convert a single input supply into the multiple rails the SoC requires, and connectors for I/O — USB, HDMI, Ethernet, and typically a GPIO header for interfacing with custom hardware. See [CPU Cores & SoC Architecture]({{< relref "cpu-cores-and-soc-architecture" >}}) for details on what lives inside the SoC itself.

It is worth distinguishing an SBC from an MCU development board, because they look similar but serve fundamentally different roles. An MCU dev board — an STM32 Nucleo, an Arduino Mega, a Teensy — exists to evaluate the microcontroller. The board is scaffolding: USB-to-serial converters, debug headers, a handful of LEDs. The MCU is the product; the board is disposable. An SBC, by contrast, is closer to a complete system. The Raspberry Pi is not scaffolding for the BCM2711 — it is the system people deploy. Some SBCs do end up in production hardware exactly as shipped, which is both their appeal and their risk.

SBCs typically run full Linux distributions: Debian, Ubuntu, or vendor-specific builds. This means they have a filesystem, a package manager, network services, and all the software infrastructure of a desktop machine, compressed into a credit-card-sized board. The jump from "blink an LED with register writes" on an MCU to "install Python with apt-get and toggle a GPIO from a script" on an SBC is enormous in terms of what software layers are involved, even if the physical result looks the same.

A point that is easy to underestimate is how much of the SBC's behavior depends on the board design, not just the SoC. Two boards using the same Allwinner H6 can have very different thermal behavior, power regulation quality, and I/O stability depending on the PCB layout, the PMIC choice, the DRAM routing, and the quality of the voltage regulators. The SoC is necessary but not sufficient — the board design matters.

## The Raspberry Pi Ecosystem

The Raspberry Pi dominates the SBC landscape, and for good reason. The progression from the BCM2835 (Pi 1 and Pi Zero: single ARM1176 core, 256-512 MB RAM) through the BCM2711 (Pi 4: four Cortex-A72 cores at 1.5 GHz, 1-8 GB LPDDR4) to the BCM2712 (Pi 5: four Cortex-A76 cores at 2.4 GHz, 4-8 GB LPDDR4X) tracks a decade of Broadcom SoC evolution. Each generation brought meaningfully more compute while keeping the board dimensions and connector layout roughly stable.

One notable architectural detail is the Pi's boot process. Unlike most ARM systems where a boot ROM on the application processor loads the initial bootloader, the Pi's VideoCore GPU handles the entire early boot sequence. The GPU loads `bootcode.bin` from the SD card, which loads `start.elf`, which initializes DRAM and then loads the ARM kernel. The ARM cores are secondary — they are released from reset by the GPU after the kernel is in memory. This is unusual and has practical consequences: boot configuration happens through `config.txt` (a GPU-side configuration file), not through U-Boot or a device tree bootloader in the traditional sense. The Pi 5 changes this somewhat with a dedicated RP1 south bridge chip and a proper EEPROM-based boot flow, but the VideoCore legacy is still visible.

Raspberry Pi OS (formerly Raspbian) is Debian-based and well-maintained by the Raspberry Pi Foundation. The Pi ecosystem's real strength is not the hardware specs — other boards often match or exceed them — but the software support. Kernel patches are upstreamed, documentation is extensive, and community troubleshooting resources are deep. When a problem arises on a Pi, someone has almost certainly solved it before.

The 40-pin GPIO header has become a de facto standard that other SBC manufacturers often copy. It provides GPIO, I2C, SPI, UART, PWM, and power pins in a standardized layout. The HAT (Hardware Attached on Top) specification goes further: HATs include an EEPROM that the Pi reads at boot to identify the attached board and automatically load the correct device tree overlay and drivers. This auto-configuration is genuinely useful — plug in a HAT, reboot, and the hardware is available without manual configuration.

The Pi ecosystem also includes CSI (camera) and DSI (display) interfaces, which connect to the SoC's dedicated camera and display blocks through ribbon cables. These interfaces provide higher bandwidth than USB for video data, though they are proprietary to the Broadcom SoC and not interchangeable with CSI/DSI on other platforms.

One important distinction: the Raspberry Pi Pico, based on the RP2040, is not an SBC. It is a microcontroller board — dual Cortex-M0+ cores, 264 KB SRAM, no MMU, no Linux. The "Raspberry Pi" brand creates confusion here, but the Pico belongs in MCU territory, alongside the Nucleo and the Arduino. The RP2040's PIO (Programmable I/O) state machines are interesting in their own right, but they solve MCU-class problems, not SBC-class problems.

## BeagleBone and PRU Co-Processors

The BeagleBone family takes a different approach from the Raspberry Pi, and it is the PRU subsystem that makes it worth knowing about. The BeagleBone Black uses TI's AM335x SoC — a single Cortex-A8 core that is slower than any recent Pi — but the SoC also includes two PRU (Programmable Real-time Unit) cores. These are 200 MHz 32-bit RISC processors with deterministic, single-cycle execution: no cache, no pipeline stalls, no interrupts unless you enable them. One instruction per 5-nanosecond clock cycle, every cycle, guaranteed.

What makes the PRUs remarkable is their relationship to the main ARM core. The PRUs share memory with the A8 through a shared RAM region — the ARM side writes commands or data into shared memory, and the PRU reads them. The PRU can toggle GPIO pins with single-cycle precision, bit-bang protocols, or sample inputs at a fixed rate, all while Linux runs normally on the A8. This is not soft real-time with jitter measured in microseconds — it is hard real-time with jitter measured in nanoseconds. See [Timing, Latency & Determinism]({{< relref "timing-latency-and-determinism" >}}) for more on why this matters and how it compares to PREEMPT_RT and other approaches.

The newer BeagleBone AI (AM5729) scales this up: dual Cortex-A15 cores, dual Cortex-M4 cores, dual C66x DSP cores, and four PRU cores. It is a heterogeneous compute platform that can run Linux, real-time firmware, and signal processing simultaneously. The complexity is significant — debugging a system with three different ISAs is not trivial — but for industrial I/O applications, the capability is hard to match.

BeagleBone uses a cape ecosystem (their name for expansion boards) that attaches to dual 46-pin headers. Capes cover motor drivers, CAN bus, industrial I/O, and LCD displays. The ecosystem is smaller than Pi's HAT ecosystem but more focused on industrial and real-time applications.

The BeagleBone's weakness is its community size and documentation. TI's technical reference manuals for the AM335x are thorough but dense, and the PRU programming model has a steep learning curve. Getting a PRU program running for the first time takes considerably longer than any equivalent Pi setup. But once it works, the deterministic timing is something no Pi can offer from Linux user space.

## Other Platforms Worth Knowing

Beyond Pi and BeagleBone, the SBC landscape is broad and fragmented. It is useful to know the major families even without using them all regularly, because each fills a niche that the Pi does not cover well.

The **Orange Pi and Banana Pi** families use Allwinner SoCs (H3, H5, H6, H616) and compete primarily on price. A board with comparable specs to a Pi 4 might cost half as much. The tradeoff is documentation and software support — Allwinner's BSP kernel is often several major versions behind mainline, community resources are thinner, and some boards ship with kernels that will never receive security patches. These boards can work for non-critical applications where cost matters more than long-term support, but they are poor choices for anything that needs reliable updates.

**NVIDIA Jetson** boards (Nano, Xavier NX, Orin Nano, Orin NX) occupy a completely different niche: GPU compute for machine learning inference and computer vision. The Jetson Nano provides 128 CUDA cores; the Orin NX provides up to 1024. When your embedded system needs to run neural network inference — object detection, pose estimation, natural language processing at the edge — Jetson is the standard platform. NVIDIA's JetPack SDK includes CUDA, TensorRT, and optimized ML libraries. The cost is power consumption (the Orin NX can draw 15-25W, and the full Orin module can reach 60W) and a more complex software stack tied to NVIDIA's proprietary tooling.

**Pine64** takes an open hardware approach — schematics published, community-driven software, RISC-V boards alongside ARM. The PinePhone and PineBook are interesting experiments in open mobile hardware. Their RISC-V boards (Star64, Ox64) provide early access to RISC-V Linux platforms, which is valuable for understanding where that architecture is heading, even if the boards are not production-ready.

**ODROID** boards from Hardkernel (often using Samsung Exynos or Amlogic SoCs) tend toward higher performance than Pi at comparable price points. The ODROID-N2+ with an Amlogic S922X was one of the faster ARM SBCs before the Pi 5 arrived.

Two important negative examples: the **ESP32 is not an SBC** despite occasionally running experimental Linux builds. It is a WiFi/BLE microcontroller — dual-core Xtensa or RISC-V, 520 KB SRAM, no MMU in the standard variants. Similarly, **Arduino boards are not SBCs**, even the more powerful ones. The distinction matters because using the wrong type of platform for a problem leads to fighting the hardware instead of solving the problem.

When to look beyond Raspberry Pi: when you need GPU compute for ML inference (Jetson), deterministic real-time I/O alongside Linux (BeagleBone PRU), a specific form factor or I/O arrangement the Pi does not offer, the lowest possible per-unit cost in volume (Allwinner-based boards), or open hardware with full schematics (Pine64).

## Power, Thermals, and Reliability

SBCs are designed for development convenience, not production reliability, and the difference becomes apparent when you try to run one continuously. This is the area where failures most often have nothing to do with software.

Power consumption varies widely. A Raspberry Pi 4 draws 3-7W under load depending on CPU activity and attached peripherals. A Pi Zero draws under 1W. A Jetson Orin module can draw 15-60W depending on the power profile and GPU utilization. These numbers matter because they determine thermal management requirements and power supply sizing. But the more insidious issue is power supply quality. SBCs are typically powered through USB-C or micro-USB, and not all USB power supplies deliver clean, stable voltage. A cheap supply that droops from 5.0V to 4.6V under load will cause brownout resets — the Pi reboots randomly, logs show nothing useful, and the failure looks like a software bug. Hours can be wasted debugging "kernel panics" that turn out to be a dollar-store USB charger. Use a supply rated for the board's peak current draw, with short cables that minimize voltage drop.

Thermals are the next surprise. These are small boards with small (or no) heatsinks, and the SoCs are designed for smartphones where thermal throttling is normal. A Pi 4 running a sustained CPU-intensive workload will reach 80-85 degrees Celsius and throttle, reducing clock speed to stay within thermal limits. The throttling is silent — there is no warning, no error, just reduced performance. Adding a heatsink drops temperatures by 10-15 degrees. Adding a fan on top of that keeps the SoC at 50-60 degrees under full load. For any sustained-compute application, thermal management is not optional.

SD card reliability is, in practice, the single biggest source of SBC failures in deployed systems. Consumer SD cards are designed for cameras — sequential writes of large files, with the card spending most of its time idle. An SBC running Linux writes constantly: journal logs, syslog, /tmp files, swap (if enabled), and application data. Consumer SD cards lack the wear-leveling sophistication of enterprise storage and will develop bad sectors after months of continuous writes. SD cards can fail silently — reads return stale data, the filesystem corrupts gradually, and the system becomes unreliable long before it fails completely. Solutions: use eMMC (better wear leveling, higher write endurance, soldered to the board so no contact issues), mount the root filesystem read-only and write logs to RAM (tmpfs), or use NVMe storage via USB 3 or PCIe (the Pi 5 exposes a PCIe lane for M.2 drives).

For production deployments, compute modules change the equation. The Raspberry Pi CM4 (and now CM5) package the SoC, RAM, and eMMC onto a small module that plugs into a custom carrier board. The carrier board is designed for the specific application — the right connectors, the right form factor, the right power regulation, proper mounting. This separates the hard part (SoC + DRAM routing, which requires controlled-impedance PCB design) from the application-specific part (connectors, power, mechanical). See [Embedded Reality]({{< relref "/docs/embedded/embedded-reality" >}}) for broader discussion of reliability in deployed embedded systems.

## Gotchas

- **SD card corruption is the number-one SBC reliability problem in the field** — consumer SD cards are not designed for the write patterns Linux generates. Use read-only root filesystems, eMMC, or NVMe for anything that runs unattended
- **USB power supplies are not all equal** — voltage drop under load causes brownout resets that look like random reboots or kernel panics. Measure the actual voltage at the board under load, not at the supply
- **GPIO voltage levels vary by platform** — Raspberry Pi GPIO is 3.3V. Some boards (particularly those with Rockchip or certain Allwinner SoCs) use 1.8V I/O on some pins. Connecting 5V signals directly to any of these will damage the SoC. Level shifters are not optional
- **SBC GPIO is not as fast as MCU GPIO** — toggling a GPIO from Linux user space takes microseconds (going through the kernel, sysfs or libgpiod, context switches). An MCU toggles GPIO in nanoseconds with a single register write. If you need fast, deterministic I/O, an SBC alone is the wrong platform
- **Not all SBCs have mainline Linux kernel support** — vendor kernels are often based on old kernel versions (3.x or 4.x), may not receive security patches, and may be abandoned when the vendor moves to a new SoC. Check kernel support before committing to a platform
- **The 40-pin header is a Pi convention, not a standard** — other boards may use the same physical connector with completely different pinouts. Assuming pin compatibility because the connector looks the same will damage hardware
- **WiFi and Bluetooth on SBCs almost always require proprietary firmware blobs** — there is no source code, no ability to audit, and updates depend on the vendor continuing to maintain the binary. This matters for security-sensitive applications and for long-term product support
- **Thermal throttling is silent** — the SoC reduces clock speed to manage temperature, and performance drops with no log message, no error, and no notification unless you actively monitor `/sys/class/thermal/` or use `vcgencmd measure_temp` (Pi-specific). Sustained workloads on unventilated boards will underperform without any indication of why
