---
title: "Boot Chain: ROM to Bootloader to Kernel"
weight: 40
---

# Boot Chain: ROM to Bootloader to Kernel

An MCU boots in microseconds — power on, fetch from reset vector, start executing firmware. An MPU boots in seconds through a multi-stage chain: ROM code, first-stage bootloader, second-stage bootloader, kernel, and finally user space. Each stage initializes just enough hardware to load the next. Understanding this chain is essential because boot failures are common and opaque without knowing where in the sequence things went wrong.

## Why Multi-Stage Boot Exists

On an MCU, boot is almost trivially simple. The processor reads the reset vector and starts executing. The whole process is a single stage, entirely deterministic, and completes in milliseconds. This is covered in [Startup & Initialization]({{< relref "/docs/embedded/firmware-structure/startup-and-initialization" >}}) and [Power-Up & Reset]({{< relref "/docs/embedded/embedded-reality/power-up-and-reset" >}}).

MPU boot is fundamentally different because of one problem: DRAM. The kernel needs tens or hundreds of megabytes of working memory, and that memory lives in external DDR chips that require complex initialization — clock training, impedance calibration, timing parameter configuration. But the code that performs this initialization needs somewhere to run. External DRAM is not available yet, and the SoC's internal SRAM is tiny — typically 64-256 KB.

This chicken-and-egg problem is why MPU boot has multiple stages. Each stage runs in whatever memory is available, initializes the next piece of hardware, and loads the next (larger) stage into the newly available memory:

1. **Boot ROM** — Mask ROM in the silicon. Initializes a minimal set of peripherals, loads the first-stage bootloader from boot media (SD, eMMC, SPI flash) into internal SRAM. Cannot be modified or patched.
2. **First-stage bootloader (SPL)** — Runs from internal SRAM. Its primary job is initializing DRAM, then loading the full bootloader into DRAM.
3. **U-Boot (full bootloader)** — Runs from DRAM. Loads the kernel image, device tree blob, and optionally an initramfs. Provides a serial console command line for debugging.
4. **Kernel** — Takes over from U-Boot, enables the MMU, probes devices from the device tree, mounts the root filesystem, launches the init process.
5. **User space** — Init starts services and presents a shell or launches the target application.

Each handoff is a potential failure point.

## U-Boot

U-Boot is the dominant bootloader in embedded Linux, and understanding it is practically mandatory. It is open source, supports hundreds of SoCs, and provides a command-line environment over the serial console for loading and booting kernels.

U-Boot maintains environment variables that control boot behavior — which device to boot from, the kernel command line, load addresses, and boot scripts. A typical boot sequence: U-Boot loads a kernel image and device tree blob from the SD card, sets the kernel command line to specify the root filesystem location, and hands off to the kernel.

When things go wrong, interrupt automatic boot by pressing a key on the serial console, dropping into the U-Boot shell where it is possible to manually inspect boot media, load files, examine memory, and test configurations. Much configuration lives in U-Boot rather than the kernel — if U-Boot loads the wrong device tree or passes a bad command line, the kernel fails in ways that look like kernel bugs but are really bootloader configuration errors.

The Raspberry Pi is a notable exception — it uses a proprietary bootloader running on the VideoCore GPU rather than U-Boot.

## Boot Takes Seconds, Not Milliseconds

The total time from power-on to a shell prompt depends on the platform and configuration. A minimal Buildroot system on a fast SoC can boot in under 5 seconds. A full Debian installation with systemd takes 15-30 seconds. Most time is spent probing devices (especially slow ones like USB) and starting services. Even an optimized MPU boot is orders of magnitude slower than an MCU — this is one of the key tradeoffs of the architecture.

## Tips

- Always connect a serial console before attempting embedded Linux bringup — every boot stage outputs messages to it
- Ensure a recovery path exists (USB boot, UART boot, SD card fallback) before flashing bootloaders to eMMC
- Check the boot device order and remove development SD cards before flashing production images to eMMC
- Interrupt U-Boot at the serial console to manually inspect boot media, load files, and test configurations when things go wrong

## Caveats

- **The serial console is essential for debugging boot** — Without a serial console, boot problems are nearly impossible to diagnose. A USB-to-UART adapter and terminal emulator are non-negotiable
- **Bricking is real if the bootloader is corrupted** — If the bootloader on eMMC is corrupted and no fallback boot mode exists, the board cannot boot
- **Kernel panic at boot usually means a bad device tree or missing root filesystem** — "Unable to mount root fs" means the `root=` command line is wrong, the storage driver is missing, or the filesystem driver is missing
- **Boot device order causes surprises** — Some SoCs try boot devices in a fixed order. A development SD card left in the slot boots instead of the intended eMMC image
- **Boot ROM bugs exist and cannot be fixed** — Mask ROM errata persist for the lifetime of the silicon revision
- **Initramfs is not always optional** — If the kernel needs modules to access the root filesystem, an initramfs is required

## Bench Relevance

- A board that hangs at power-on with no serial output has a boot ROM or first-stage bootloader problem
- "Unable to mount root fs" in serial output indicates the kernel booted but cannot find the root filesystem — check the `root=` command line and storage drivers
- A board that boots an old image despite flashing a new one likely has an SD card in a higher-priority boot slot
- No output at all after U-Boot often means the wrong device tree was loaded
