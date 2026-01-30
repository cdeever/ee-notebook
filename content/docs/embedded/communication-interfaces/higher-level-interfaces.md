---
title: "Higher-Level Interfaces"
weight: 30
---

# Higher-Level Interfaces

USB, CAN, and Ethernet occupy a different category than the [serial interfaces]({{< relref "serial-interfaces" >}}) covered earlier. The MCU still provides hardware peripherals for them, but the hardware only handles the lowest layers — electrical signaling and basic framing. Everything above that requires firmware: protocol state machines, descriptor tables, message filtering, or full TCP/IP stacks. The gap between "peripheral configured" and "communication working" is much larger, and the resource cost in flash, RAM, and CPU time is real.

## USB

### What the Hardware Provides

The USB peripheral on an MCU includes the PHY (physical layer transceiver) and a packet engine that handles the low-level USB protocol: generating and detecting SYNC patterns, stuffing and unstuffing bits, computing CRCs, and managing the basic packet handshake (ACK, NAK, STALL). Some MCUs integrate a full-speed (12 Mbps) PHY directly; high-speed (480 Mbps) typically requires an external PHY connected via ULPI.

The hardware also provides endpoint buffers — small memory regions (often a dedicated USB SRAM of 512 to 2048 bytes) where incoming and outgoing packets are staged. The peripheral generates interrupts for completed transfers, bus resets, suspend/resume events, and setup packets.

### What Firmware Must Handle

Everything that makes USB actually useful lives in firmware:

**Enumeration** is the process where the host discovers the device. The device must respond to a specific sequence of control transfers on Endpoint 0, providing device descriptors, configuration descriptors, interface descriptors, and endpoint descriptors. These are structured data tables that tell the host what the device is, what class it belongs to, how many endpoints it uses, and what protocols it supports. Getting a single byte wrong in a descriptor causes enumeration to fail, and the host typically reports only "unknown device."

**Device classes** define how the device behaves after enumeration. The most common for embedded work:
- **CDC (Communications Device Class)** — Appears as a virtual serial port. The simplest way to get a serial console over USB. Requires two interfaces and at least three endpoints.
- **HID (Human Interface Device)** — Keyboard, mouse, joystick, or custom data reports. No driver installation needed on any major OS. Data rate is limited (up to 64 KB/s at full speed).
- **MSC (Mass Storage Class)** — Makes the device appear as a removable drive. Requires a block-level storage backend (SD card, flash).

Each class requires its own firmware layer implementing class-specific requests and data flow. Most developers use a USB stack library (TinyUSB, STM32 USB middleware, etc.) rather than writing this from scratch.

### Clock Requirements

USB full-speed requires a 48 MHz clock with accuracy of plus or minus 0.25%. This is much tighter than most peripherals require, and it constrains the [clock tree]({{< relref "/docs/embedded/mcu-architecture" >}}) design. An internal RC oscillator is usually not accurate enough — USB typically requires a crystal or MEMS oscillator, or an MCU with a clock recovery system that locks to the USB Start-of-Frame packets from the host (some STM32 parts support this).

If the clock is slightly off, the device may enumerate but then fail intermittently under load. This is maddening to debug because it looks like a firmware bug.

## CAN

### What the Hardware Provides

The CAN peripheral handles the lowest protocol layers in hardware: bit timing, arbitration, CRC generation and checking, acknowledgment, and automatic retransmission on error. This is much more than UART or SPI hardware does — CAN's reliability depends on these mechanisms being handled at wire speed with deterministic timing.

CAN uses differential signaling (CAN_H and CAN_L) on a shared bus. The MCU's CAN peripheral connects to an external CAN transceiver (MCP2551, SN65HVD230, or similar) that handles the physical layer voltage levels. The transceiver is not optional — the MCU's digital CAN_TX and CAN_RX pins cannot drive the bus directly.

### Message-Based Architecture

CAN is message-based, not address-based. Every message has an identifier (11-bit standard or 29-bit extended) that indicates its content, not its destination. All nodes on the bus see every message. Each node configures hardware filters to accept only the messages it cares about and discard the rest.

The hardware provides a small number of mailboxes (typically 3 transmit, 2 receive FIFOs with configurable depth). Transmit mailboxes are prioritized by message ID — the CAN protocol's arbitration ensures that the highest-priority message (lowest ID) wins bus access when multiple nodes transmit simultaneously.

### Bit Timing and Bus Configuration

CAN bit timing is more involved than UART baud rates. Each bit is divided into segments (synchronization, propagation, phase 1, phase 2) measured in time quanta. The bit rate, sample point position, and synchronization jump width are all configurable. Standard bit rates are 125 kbps, 250 kbps, 500 kbps, and 1 Mbps, but the actual register values depend on the peripheral clock frequency and the desired sample point (typically 75-87.5%).

The bus must be properly terminated with 120 ohm resistors at each physical end. Missing termination causes reflections that corrupt communication — and the symptoms (intermittent errors, error frames, bus-off conditions) do not obviously point to a termination problem.

**CAN FD** (Flexible Data-rate) extends classic CAN by allowing a higher bit rate during the data phase (up to 8 Mbps) and larger payloads (up to 64 bytes vs. classic CAN's 8 bytes). Many newer MCUs support CAN FD natively, but the transceivers must also be CAN FD rated.

### Error Handling

CAN includes sophisticated built-in error management. Each node maintains transmit and receive error counters. As errors accumulate, a node progresses from "error active" (normal) to "error passive" (reduced participation) to "bus off" (completely silent). Firmware must monitor these states and implement recovery — a bus-off node can re-enter the bus after a defined interval, but a persistent bus-off condition indicates a hardware or configuration problem.

## Ethernet

### What the Hardware Provides

Ethernet on an MCU is split between two chips: the **MAC** (Media Access Controller) inside the MCU, and the **PHY** (physical layer transceiver) as an external chip. The MAC handles frame assembly, CRC, and media access. The PHY handles the analog signaling on the wire — encoding, link negotiation, and the transformer-coupled interface to the RJ45 jack. The MAC and PHY communicate via MII or RMII (Reduced MII), which is a parallel interface requiring several pins and careful PCB layout.

Some MCUs integrate the PHY (notably certain NXP and Microchip parts), which simplifies the board design but limits flexibility. For most STM32 designs, the PHY is external (common choices: LAN8720, DP83848, KSZ8081).

### The Software Stack

Ethernet's hardware peripheral gets you frames on and off the wire. Making those frames useful requires a TCP/IP stack — a substantial software component. lwIP (lightweight IP) is the de facto standard for embedded Ethernet on Cortex-M MCUs, and it handles ARP, IP, ICMP, UDP, TCP, DHCP, and optionally DNS, HTTP, MQTT, and others.

lwIP alone consumes 40-100 KB of flash and 20-40 KB of RAM, depending on configuration. Add an application protocol (HTTP server, MQTT client) and the footprint grows further. This is a fundamentally different resource category than UART or SPI — Ethernet is only viable on MCUs with sufficient memory, which in practice means the upper-mid-range parts and above.

The MAC peripheral uses [DMA]({{< relref "dma" >}}) extensively — both transmit and receive paths use DMA descriptor rings to move frames between the MAC and RAM without CPU involvement for each byte. Understanding DMA is a prerequisite for bringing up Ethernet.

### PHY Management

The MAC communicates with the PHY for configuration and status via MDIO (Management Data Input/Output), a low-speed serial interface separate from the data path. Through MDIO, firmware can read the link status, negotiate speed and duplex, and configure PHY features. Auto-negotiation (which happens in the PHY hardware) determines whether the link runs at 10 or 100 Mbps, full or half duplex. Firmware needs to detect the negotiated speed and configure the MAC accordingly — a mismatch causes no communication.

## The Protocol Stack Boundary

The pattern across USB, CAN, and Ethernet is consistent: the MCU hardware peripheral handles the electrical interface and the lowest protocol layers, but the functional behavior lives in firmware. The amount of firmware varies:

- **CAN** has the simplest software layer — message filtering and mailbox management. A basic CAN node can be a few hundred lines of code.
- **USB** requires a complete device stack with enumeration, descriptors, and class-specific handling. A minimal CDC implementation is a few thousand lines, and most of it is fiddly descriptor and state machine code.
- **Ethernet** requires a full network stack. Even a "simple" UDP application needs ARP, IP, and link management. TCP adds connection state, retransmission, and flow control.

This has practical implications for development time, flash and RAM budgets, and debugging complexity. A UART link can be debugged by looking at a single wire with a logic analyzer. An Ethernet TCP problem may involve MAC configuration, PHY negotiation, IP addressing, ARP resolution, and TCP state — each a potential failure point.

## When Simple Serial Is Better

If the application needs point-to-point communication at a few hundred kilobits per second, UART or SPI is dramatically simpler and lower cost. USB makes sense when you need host connectivity without custom drivers, CAN makes sense for reliable multi-node networks in noisy environments, and Ethernet makes sense when you need IP networking. But each one brings substantial complexity, and choosing them when a UART would suffice is a common source of schedule overruns in embedded projects.

## Gotchas

- **USB enumeration failures are hard to diagnose from the device side** — The host controls the enumeration sequence. If the device fails to respond correctly, the host gives up and may only report "unknown device." The device firmware has no indication of what went wrong. A USB protocol analyzer (hardware sniffer) is the proper debug tool, but most people end up iterating blindly on descriptor tables.
- **CAN requires external transceivers and termination** — The MCU's CAN peripheral outputs CMOS-level digital signals. Without a CAN transceiver, there is no differential signaling and no bus connection. Without 120-ohm termination resistors at both ends of the bus, reflections cause intermittent errors that look like firmware bugs.
- **Ethernet PHY reset and initialization timing matters** — The PHY chip needs a proper reset sequence (hardware reset pin held low for a specified duration, then released) before MDIO communication works. If firmware tries to configure the PHY before it is ready, the MDIO reads return garbage. Many Ethernet bring-up problems are PHY initialization timing issues.
- **USB clock accuracy is a hard requirement** — The plus or minus 0.25% tolerance for the 48 MHz USB clock is not negotiable. An internal RC oscillator drifting outside this range causes intermittent failures that vary with temperature. If USB works on the bench but fails in the field, check the clock source.
- **lwIP is not thread-safe by default** — If you call lwIP functions from multiple threads or interrupt contexts without proper locking, you get memory corruption and crashes that are extremely difficult to trace. The lwIP documentation describes the required locking model, but it is easy to get wrong, especially when integrating with an RTOS.
- **CAN bus-off recovery is not automatic on all MCUs** — When a CAN node reaches the bus-off state due to accumulated errors, some MCU peripherals require firmware to explicitly initiate recovery. If the error handling code does not account for bus-off, the node goes silent permanently until reset.
