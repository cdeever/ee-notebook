---
title: "USB"
weight: 30
---

# USB

USB is one of those interfaces where the hardware peripheral does surprisingly little and the firmware does almost everything. The MCU provides the electrical interface and handles low-level packet mechanics, but enumeration, device class behavior, descriptor management, and data flow are all firmware's problem. Compared to [UART]({{< relref "uart" >}}) or [SPI]({{< relref "spi-and-i2c" >}}) where you configure a few registers and start moving bytes, USB requires a complete protocol stack to do anything useful.

This page covers USB from the MCU/firmware perspective — what the hardware provides, what firmware must handle, and the practical realities of getting a USB device working on an embedded system.

## USB Roles: Device vs Host

USB is fundamentally asymmetric. There is always a **host** and a **device**, and they have very different responsibilities:

- **Host** — Initiates all communication. Polls devices, schedules transfers, provides power on VBUS. On a PC, the host controller and its driver stack handle this. On an MCU, running as a host requires a USB host stack (which is a substantial piece of software) and a peripheral that supports host mode.
- **Device** — Responds to the host. Never initiates communication on its own — even when a device has data to send, it waits for the host to ask for it. This is the role that 99% of MCU USB work involves.

Some MCUs support **OTG (On-The-Go)**, which means the same peripheral can operate as either host or device, negotiating the role at connection time via the ID pin on the USB connector. OTG is useful for niche applications — an embedded device that can talk to a USB flash drive when acting as host, or appear as a serial device when connected to a PC. But OTG adds complexity to both hardware and firmware, and most projects never need it.

For embedded development, the practical reality is: you are building a USB device. The host is a PC (or phone, or SBC) running a full operating system with mature USB host drivers. Your firmware's job is to appear as a well-behaved device that the host can enumerate and communicate with.

I have not personally done much with host-mode USB on MCUs. The few times I have seen it used, it was for reading USB mass storage devices (flash drives) in data logging applications. It works, but the host stack consumes significant RAM and flash, and debugging is harder because you are now responsible for both sides of the protocol.

## Speed Grades

USB defines several speed grades, and the practical implications for MCU work are significant:

**Low Speed (1.5 Mbps)** — Originally for keyboards, mice, and other simple HID devices. Uses a single differential pair with relaxed signal quality requirements. Some very small MCUs support only low speed. The data rate is limiting, but for a device that sends a few bytes per keystroke, it is more than enough.

**Full Speed (12 Mbps)** — This is the workhorse for MCU USB. Most Cortex-M MCUs with USB support include a full-speed PHY on-chip. CDC virtual serial ports, HID devices, and even mass storage all work fine at full speed. The actual throughput for bulk transfers is typically 800-900 KB/s after protocol overhead — plenty for most embedded applications.

**High Speed (480 Mbps)** — Needed for applications that move substantial data: audio interfaces with many channels, fast data acquisition, or anything approaching real-time video. Most MCUs do not have a high-speed PHY on-chip. Getting high speed usually means either a specific MCU family (STM32H7 and some NXP RT parts have an integrated HS PHY) or an external PHY connected via the ULPI (UTMI+ Low Pin Interface) bus, which consumes a lot of pins and requires careful PCB layout.

For most embedded projects, full speed is the right choice. It is simple, well-supported, and the on-chip PHY means no external components beyond the USB connector and a few passives.

## What the Hardware Provides

The USB peripheral on an MCU includes the PHY (physical layer transceiver) and a packet engine that handles the low-level USB protocol: generating and detecting SYNC patterns, stuffing and unstuffing bits, computing CRCs, and managing the basic packet handshake (ACK, NAK, STALL). Some MCUs integrate a full-speed (12 Mbps) PHY directly; high-speed (480 Mbps) typically requires an external PHY connected via ULPI.

The hardware also provides endpoint buffers — small memory regions (often a dedicated USB SRAM of 512 to 2048 bytes) where incoming and outgoing packets are staged. The peripheral generates interrupts for completed transfers, bus resets, suspend/resume events, and setup packets.

What the hardware does *not* do: it has no concept of descriptors, device classes, enumeration sequences, or application-level data flow. The packet engine will dutifully send and receive packets, but deciding what those packets should contain is entirely up to firmware.

## Transfer Types

USB defines four transfer types, each designed for different use cases. Understanding these matters because they determine bandwidth allocation, latency guarantees, and error handling:

**Control Transfers** — Used for device configuration, primarily during enumeration. Every USB device must support control transfers on Endpoint 0. The host sends SETUP packets containing standard requests (GET_DESCRIPTOR, SET_ADDRESS, SET_CONFIGURATION) and the device responds. Control transfers have built-in error recovery and are guaranteed bandwidth on the bus, but throughput is low. After enumeration, control transfers are occasionally used for class-specific or vendor-specific requests.

**Bulk Transfers** — Designed for large, non-time-critical data. MSC (mass storage) and CDC (serial) use bulk transfers. Bulk gets whatever bandwidth is left over after control, interrupt, and isochronous transfers are scheduled. There is no latency guarantee — in a busy USB bus, bulk transfers can be delayed significantly. But bulk has error detection and automatic retransmission, so data integrity is guaranteed. For most embedded data transfer applications, bulk is the right choice.

**Interrupt Transfers** — Despite the name, these are not interrupt-driven in the hardware sense. The host polls the device at a guaranteed interval (1 ms to 255 ms at full speed). HID devices use interrupt transfers — when you press a key, the keyboard reports it on the next poll. The guaranteed polling interval means bounded latency, which is why HID feels responsive. The tradeoff is limited bandwidth: at full speed with a 1 ms polling interval and 64-byte packets, the maximum is 64 KB/s.

**Isochronous Transfers** — Fixed bandwidth, guaranteed timing, but no error recovery. If a packet is corrupted, it is lost — there is no retransmission. This is designed for streaming data where a late packet is worse than a lost packet: audio and video. USB audio devices use isochronous transfers to maintain a constant sample rate. Implementing isochronous transfers in firmware is more complex because the timing constraints are hard and the buffer management must be precise. I have not implemented isochronous transfers myself yet, but from what I have read, the interaction between the USB frame timing and the audio sample clock is the tricky part.

## What Firmware Must Handle

Everything that makes USB actually useful lives in firmware.

### Enumeration

Enumeration is the process where the host discovers the device. The device must respond to a specific sequence of control transfers on Endpoint 0, providing device descriptors, configuration descriptors, interface descriptors, and endpoint descriptors. These are structured data tables that tell the host what the device is, what class it belongs to, how many endpoints it uses, and what protocols it supports. Getting a single byte wrong in a descriptor causes enumeration to fail, and the host typically reports only "unknown device."

The descriptor hierarchy looks roughly like this:

- **Device Descriptor** — One per device. Contains vendor/product IDs, USB version, device class (or zero if class is defined per-interface), and the number of configurations (almost always one).
- **Configuration Descriptor** — Describes the power requirements and the number of interfaces. Most devices have a single configuration.
- **Interface Descriptor** — Describes one functional unit of the device. A CDC serial port uses two interfaces; a composite device has multiple interfaces.
- **Endpoint Descriptor** — Describes each endpoint's direction (IN or OUT), transfer type, and maximum packet size.
- **String Descriptors** — Human-readable names (manufacturer, product, serial number). Optional but recommended.

The host reads these in a specific order during enumeration. Class-specific descriptors (HID report descriptors, CDC functional descriptors) are nested within this hierarchy. The exact layout matters — the total length fields in configuration descriptors must account for all nested descriptors, and getting these lengths wrong is a common cause of enumeration failure.

### Device Classes

Device classes define how the device behaves after enumeration. The most common for embedded work:

**CDC (Communications Device Class)** — Appears as a virtual serial port on the host. This is the simplest way to get a serial console over USB and is probably the first USB class most embedded developers encounter. Requires two interfaces (a communication interface and a data interface) and at least three endpoints (one interrupt IN for notifications, one bulk IN, one bulk OUT for data). The descriptor setup for CDC is surprisingly involved for what amounts to "serial port over USB."

**HID (Human Interface Device)** — Keyboard, mouse, joystick, or custom data reports. The big advantage of HID is that no driver installation is needed on any major OS — the class drivers are built in. Data rate is limited (up to 64 KB/s at full speed), but for sending sensor readings, button states, or configuration data, this is often sufficient. HID report descriptors define the data format and are their own mini language — cryptic but well-documented.

**MSC (Mass Storage Class)** — Makes the device appear as a removable drive. Requires a block-level storage backend (SD card, flash). MSC implements the SCSI command set over USB bulk transfers, which sounds intimidating but USB stack libraries handle the protocol layer. The main firmware responsibility is providing read/write block callbacks to the storage medium.

**UAC (USB Audio Class)** — Makes the device appear as a sound card. Uses isochronous transfers to stream audio data. UAC1 is simpler and widely supported; UAC2 supports higher sample rates and bit depths but requires drivers on Windows (macOS and Linux support it natively). Audio class is significantly more complex than CDC or HID because of the real-time constraints and the clock synchronization between the USB frame rate and the audio sample clock. I have not built a UAC device yet, but it is on my list — it seems like the natural next step for audio DSP projects.

**Vendor-Specific** — A custom protocol where the device does not conform to any standard class. The device uses vendor-specific interface descriptors and defines its own endpoint layout and data format. The downside: the host needs a custom driver (or uses a generic USB library like libusb). This is the right choice when no standard class fits, but the need for host-side software makes it less convenient than using a standard class.

**Composite Devices** — A single USB device that presents multiple classes simultaneously. For example, CDC + MSC (serial console and mass storage on the same device) or CDC + HID. The device descriptor sets the class to 0x00 (defined at interface level), and each interface has its own class. Composite devices require more endpoints and more careful descriptor layout, but USB stack libraries like TinyUSB make this manageable. I have used CDC + MSC composite devices for data loggers where you want both a serial debug console and the ability to read log files as a mass storage device.

### Clock Requirements

USB full-speed requires a 48 MHz clock with accuracy of plus or minus 0.25%. This is much tighter than most peripherals require, and it constrains the clock tree design. An internal RC oscillator is usually not accurate enough — USB typically requires a crystal or MEMS oscillator, or an MCU with a clock recovery system that locks to the USB Start-of-Frame packets from the host (some STM32 parts support this).

If the clock is slightly off, the device may enumerate but then fail intermittently under load. This is maddening to debug because it looks like a firmware bug.

## USB Stacks and Libraries

Nobody writes USB from scratch. The protocol is too complex and too fiddly for hand-rolled implementations to be worthwhile. The practical reality is that you pick a USB stack library and configure it for your device class and MCU.

**TinyUSB** — The current best choice for most new projects. It is portable across many MCU families (STM32, NXP, RP2040, ESP32-S2/S3, and more), well-documented, actively maintained, and supports device and host modes. The API is clean, the examples are practical, and the community is helpful. If I were starting a new USB project today, I would use TinyUSB unless there was a specific reason not to.

**STM32 USB Middleware** — ST's own USB stack, generated by STM32CubeMX. It works and integrates with the rest of the HAL ecosystem, but the code is harder to follow than TinyUSB and the documentation is thinner. The generated code tends to be verbose and the abstraction layers can make debugging harder. That said, if you are already deep in the STM32 HAL ecosystem and using CubeMX for everything, it is the path of least resistance.

**LUFA (Lightweight USB Framework for AVRs)** — The go-to for AVR-based USB (ATmega32U4, AT90USB1287). Mature and well-tested, but AVR-specific. If you are working with Arduino Leonardo/Pro Micro style boards, LUFA (or the Arduino USB stack built on it) is what you will encounter.

The common pattern across all these stacks: you provide descriptor tables, implement callbacks for class-specific events (data received, data requested, configuration changed), and the stack handles the protocol machinery. Getting the descriptors right is still your problem, but the stack handles the enumeration state machine, endpoint management, and low-level peripheral interaction.

One thing I have learned: read the USB stack's examples first, then modify them for your use case. Starting from a working CDC example and changing it to do what you need is dramatically faster than trying to configure a USB stack from scratch based on the API documentation.

## Power Delivery

USB provides power as well as data, and the power specifications interact with firmware in ways that are easy to overlook.

**VBUS** is nominally 5V. A device can draw up to **100 mA** before enumeration (the "unconfigured" state). After successful enumeration, if the device's configuration descriptor declares a higher current requirement and the host accepts the configuration, the device can draw up to **500 mA** (USB 2.0) or **900 mA** (USB 3.0). The maximum current is declared in the configuration descriptor in units of 2 mA.

**Bus-powered** devices draw all their power from VBUS. The device descriptor and configuration descriptor must accurately report the maximum current draw. If the device actually draws more than it declared, the host may disable the port — or the voltage may sag and cause erratic behavior.

**Self-powered** devices have their own power supply and do not draw significant current from VBUS. The configuration descriptor has a flag for this. A device can also support both modes (self-powered with bus-powered fallback).

**USB-C and Power Delivery (PD)** — USB-C connectors and the USB PD protocol allow negotiation of higher voltages (up to 20V) and currents (up to 5A), but this is a separate protocol layer (communicated over the CC pins) and is mostly out of scope for basic MCU USB device work. Some MCUs (STM32G0, STM32G4) include USB PD controllers, but implementing PD is a project in itself. For most embedded USB devices, the 5V/500mA from a standard USB port is sufficient.

## DMA and USB

Some MCU USB peripherals support [DMA]({{< relref "dma" >}}) for moving data between the endpoint buffers and application memory. Whether this matters depends on the data rate and how much CPU time you can afford to spend on USB data handling. For a CDC serial port running at a few KB/s, interrupt-driven transfers are fine. For MSC or high-throughput vendor-specific devices, DMA can free up significant CPU time.

The details are MCU-specific. On some STM32 parts, the USB peripheral has its own dedicated SRAM for endpoint buffers, and DMA is not directly applicable — the CPU must copy data between this USB SRAM and main RAM. On others (particularly those with the "OTG" USB peripheral), DMA is integrated into the USB data path. Check the reference manual for your specific part.

## Gotchas

- **USB enumeration failures are hard to diagnose from the device side** — The host controls the enumeration sequence. If the device fails to respond correctly, the host gives up and may only report "unknown device." The device firmware has no indication of what went wrong. A USB protocol analyzer (hardware sniffer) is the proper debug tool, but most people end up iterating blindly on descriptor tables. On Linux, `dmesg` sometimes gives more detail than Windows Device Manager about why enumeration failed.

- **USB clock accuracy is a hard requirement** — The plus or minus 0.25% tolerance for the 48 MHz USB clock is not negotiable. An internal RC oscillator drifting outside this range causes intermittent failures that vary with temperature. If USB works on the bench but fails in the field, check the clock source.

- **Suspend and resume handling is not optional** — The USB specification requires devices to enter a low-power suspend state when the host stops sending Start-of-Frame packets (which happens when the host goes to sleep, or just because the USB scheduler decides to). If the device firmware ignores suspend, some hosts will eventually disconnect the device. At minimum, firmware should handle the suspend interrupt and reduce power consumption. Resume detection (the host signaling the device to wake up) must also be handled. Many USB stack examples omit or stub out suspend handling, which works fine on the bench but causes problems in the field when laptops go to sleep.

- **Windows CDC requires driver installation on older versions** — On Windows 10 and later, CDC devices using standard descriptors are recognized automatically as virtual COM ports. On Windows 7 and 8, a `.inf` file (driver information file) is needed to tell Windows which driver to use. If your product must support older Windows, you need to provide this file and deal with the driver installation process. Alternatively, using the Microsoft-specific WCID (Windows Compatible ID) descriptors can enable automatic driver binding on some older Windows versions.

- **Endpoint buffer management is trickier than it looks** — The USB peripheral's endpoint buffers are small (often 64 bytes for full speed). If the host sends data faster than firmware processes it, the peripheral NAKs incoming packets until a buffer is free. This is fine for flow control, but if firmware takes too long to drain the buffer, throughput drops dramatically. For receive-heavy applications, double-buffered endpoints (where the hardware alternates between two buffers) help keep throughput up.

- **USB connector pin-out matters for USB-C** — If your board uses a USB-C connector but only supports USB 2.0 (which is common for MCU projects), you need the correct CC pull-down resistors (5.1k to ground on each CC pin) to identify as a device. Without these, a USB-C host may not provide VBUS at all. This catches people who just wire up D+ and D- and expect it to work like a Type-B connector.

- **Descriptor total lengths must be exact** — The configuration descriptor contains a `wTotalLength` field that must equal the total byte count of the configuration descriptor plus all subordinate interface, endpoint, and class-specific descriptors. If this number is wrong, the host reads too many or too few bytes, and enumeration fails or the device behaves erratically. This is one of the first things to check when debugging enumeration problems.
