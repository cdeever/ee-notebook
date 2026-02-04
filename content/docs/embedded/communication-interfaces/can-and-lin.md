---
title: "CAN & LIN"
weight: 70
---

# CAN & LIN

CAN (Controller Area Network) and LIN (Local Interconnect Network) are the two bus standards that dominate automotive and industrial networking. CAN is the backbone — it carries powertrain data, chassis control, body electronics, and diagnostics across multi-node networks that must work reliably in electrically hostile environments. LIN is the cheaper, simpler companion: a single-wire, master-slave bus used for non-critical subsystems where CAN's speed and cost are overkill.

Both buses originated in the automotive world, but CAN has spread widely into industrial automation, medical devices, and robotics. LIN stays mostly in vehicles, where it quietly handles seat motors, mirror adjustment, rain sensors, and interior lighting without anyone thinking about it much.

This page covers CAN and LIN from the MCU and firmware perspective. Other communication interfaces are covered separately: [UART]({{< relref "uart" >}}), [SPI & I2C]({{< relref "spi-and-i2c" >}}), [USB]({{< relref "usb" >}}), and [WiFi & Networking]({{< relref "wifi-and-networking" >}}). For DMA-based data handling applicable to CAN receive buffers and high-throughput configurations, see [DMA]({{< relref "dma" >}}).

## CAN

### What the Hardware Provides

The CAN peripheral handles the lowest protocol layers in hardware: bit timing, arbitration, CRC generation and checking, acknowledgment, and automatic retransmission on error. This is much more than UART or SPI hardware does — CAN's reliability depends on these mechanisms being handled at wire speed with deterministic timing. The arbitration mechanism alone — where multiple nodes can start transmitting simultaneously and the one with the highest-priority ID wins without any data loss — requires cycle-accurate bit-level control that firmware could never achieve.

CAN uses differential signaling (CAN_H and CAN_L) on a shared bus. The MCU's CAN peripheral connects to an external CAN transceiver that handles the physical layer voltage levels. The transceiver is not optional — the MCU's digital CAN_TX and CAN_RX pins are CMOS-level signals that cannot drive the bus directly. The differential signaling is what gives CAN its noise immunity: interference that couples equally onto both wires gets rejected by the receiver. This matters enormously in vehicles and industrial settings where motors, solenoids, and ignition systems create constant electrical noise.

### Message-Based Architecture

CAN is message-based, not address-based. Every message has an identifier (11-bit standard or 29-bit extended) that indicates its content, not its destination. All nodes on the bus see every message. Each node configures hardware filters to accept only the messages it cares about and discard the rest.

This is a fundamentally different model from UART or SPI, where communication is point-to-point between specific devices. On CAN, a temperature sensor broadcasts its reading with a specific message ID, and any node that cares about temperature accepts that message. The sensor does not know or care how many nodes are listening. Adding a new node that needs temperature data requires no changes to the sensor's firmware — just configure the new node's filters to accept that ID.

The hardware provides a small number of mailboxes (typically 3 transmit, 2 receive FIFOs with configurable depth). Transmit mailboxes are prioritized by message ID — the CAN protocol's arbitration ensures that the highest-priority message (lowest ID) wins bus access when multiple nodes transmit simultaneously. On some MCUs (notably the STM32 bxCAN and FDCAN peripherals), the hardware filter bank is quite flexible — the hardware supports mask-based filters that accept ranges of IDs, or exact-match filters for specific messages. Getting the filter configuration right is important: if the filters are too open, the receive FIFO fills with messages the application does not need, potentially causing overruns. Too restrictive, and messages are missed.

### CAN Transceivers

The CAN transceiver is a small, dedicated IC that sits between the MCU's CAN_TX/CAN_RX pins and the CAN_H/CAN_L bus wires. It converts the MCU's single-ended CMOS logic to the differential bus levels and vice versa. Common parts include:

- **MCP2551** — Classic CAN transceiver from Microchip. 1 Mbps, widely used, cheap. Not CAN FD capable.
- **MCP2562** — CAN FD capable version of the MCP2551 family. Supports the higher data-phase bit rates that CAN FD requires.
- **SN65HVD230** — TI part, 3.3V operation, popular in hobbyist and prototyping contexts. Classic CAN only.
- **TJA1050** — NXP part, very common in automotive designs. 5V supply, classic CAN.
- **TJA1443 / TJA1463** — NXP CAN FD transceivers with partial networking (wake on specific CAN message) for automotive low-power applications.

The transceiver choice matters for more than just electrical compatibility. Many automotive transceivers have standby and sleep modes that reduce quiescent current to microamps — critical for vehicle modules that must not drain the battery when the car is off. In standby mode, the transceiver can still monitor the bus for a wake-up pattern (a dominant state held for a defined duration) and assert a wake pin to bring the MCU out of its own low-power state. This selective wake-up capability is part of why automotive CAN networks can have dozens of modules without excessive parasitic drain.

For bench prototyping and development, the transceiver is sometimes the part people forget. CAN communication between two MCU boards cannot be tested without a transceiver on each side. Even loopback mode on the MCU's CAN peripheral (which is useful for initial firmware bring-up) only tests the internal data path — it does not exercise the transceiver or the physical bus.

### Bit Timing and Bus Configuration

CAN bit timing is more involved than UART baud rates. Each bit is divided into segments (synchronization, propagation, phase 1, phase 2) measured in time quanta. The bit rate, sample point position, and synchronization jump width are all configurable. Standard bit rates are 125 kbps, 250 kbps, 500 kbps, and 1 Mbps, but the actual register values depend on the peripheral clock frequency and the desired sample point (typically 75-87.5%).

The sample point position is not arbitrary — it represents the point within each bit period where the receiver samples the bus state. A sample point around 87.5% is common for automotive CAN and is specified by some higher-layer standards. Choosing the wrong sample point can cause a node to read bits incorrectly, especially on longer buses where propagation delay shifts the bit boundaries. Online CAN bit timing calculators (like the one at kvaser.com) are genuinely useful here — manually computing the prescaler, time segment 1, and time segment 2 values from the peripheral clock and desired bit rate is tedious and error-prone.

The bus must be properly terminated with 120 ohm resistors at each physical end. Missing termination causes reflections that corrupt communication — and the symptoms (intermittent errors, error frames, bus-off conditions) do not obviously point to a termination problem. The correct topology is a linear bus with a 120 ohm resistor at each end, giving 60 ohms total across CAN_H and CAN_L when measured with all nodes powered down. This is easy to verify with a multimeter before powering anything up.

**CAN FD** (Flexible Data-rate) extends classic CAN by allowing a higher bit rate during the data phase (up to 8 Mbps) and larger payloads (up to 64 bytes vs. classic CAN's 8 bytes). The arbitration phase still runs at the nominal bit rate (up to 1 Mbps), so backward compatibility with classic CAN nodes is maintained during arbitration — though classic nodes will flag FD frames as errors, so a mixed bus requires careful planning. Many newer MCUs support CAN FD natively (STM32G4 and H7 with FDCAN, NXP S32K with FlexCAN), but the transceivers must also be CAN FD rated. Classic CAN transceivers like the MCP2551 have slew rate limiting that cannot handle the faster data-phase bit rates.

### Error Handling

CAN includes sophisticated built-in error management that I find genuinely impressive compared to other embedded buses. Each node maintains transmit and receive error counters. As errors accumulate, a node progresses through three states:

1. **Error active** — Normal operation. The node can transmit error flags that disrupt invalid frames.
2. **Error passive** — The node has accumulated significant errors. It can still transmit and receive, but it sends passive error flags that do not disturb other nodes, and it must wait an extra delay before retransmitting.
3. **Bus off** — Error count has exceeded 255. The node is completely disconnected from the bus and cannot transmit or receive.

Firmware must monitor these states and implement recovery. The error counters and current state are available in the CAN peripheral's status registers. A bus-off node can re-enter the bus after detecting 128 occurrences of 11 consecutive recessive bits, but on some MCU peripherals this recovery must be explicitly initiated by firmware. A persistent bus-off condition indicates a hardware problem (bad termination, damaged transceiver, bus wiring issue) or a configuration mismatch (wrong bit rate or sample point).

In practice, monitoring the error counters in firmware and logging their values is the best early warning system for bus health issues. Error counters that slowly climb during normal operation suggest marginal timing or electrical problems that will eventually cause a bus-off event.

### CAN in Practice

CAN is everywhere in vehicles, and increasingly in industrial systems. A few of the major application-layer protocols built on top of CAN:

**OBD-II** — Every passenger vehicle sold in the US since 1996 has an OBD-II diagnostic port, and CAN is the dominant physical layer (mandated since 2008). OBD-II CAN typically runs at 500 kbps with 11-bit IDs. The diagnostic protocol uses specific CAN IDs (0x7DF for broadcast requests, 0x7E0-0x7E7 for targeted requests) and ISO-TP (ISO 15765-2) for multi-frame messages. This is the interface that cheap ELM327-based scan tools talk to — and it is a reasonable starting point for learning CAN on a real vehicle, since the OBD-II connector provides CAN_H, CAN_L, and ground in a standardized pinout.

**SAE J1939** — The standard for heavy-duty vehicles (trucks, buses, construction equipment, agricultural machinery). J1939 uses CAN at 250 kbps with 29-bit extended IDs. The extended ID encodes parameter group numbers (PGNs), source addresses, and priority — so the CAN ID itself carries application-layer meaning. J1939 defines thousands of standardized parameters for engine speed, fuel consumption, GPS position, and more.

**CANopen** — An industrial automation protocol used in robotics, medical devices, and factory equipment. CANopen defines a device model, a communication profile (PDOs for real-time data, SDOs for configuration, NMT for network management), and standard device profiles for common device types (drives, I/O modules, sensors).

**DeviceNet** — Allen-Bradley's (Rockwell) CAN-based industrial network. Less common in new designs but still encountered in existing factory installations.

**DBC files** are the de facto standard for describing CAN message layouts — which signals live in which message ID, their bit positions, scaling factors, and units. When working with vehicle CAN data, DBC files will eventually come up, and tools like Vector CANdb++, SavvyCAN, or the Python cantools library can parse them. Working with raw CAN without a DBC file (or equivalent documentation) means reverse-engineering message contents byte by byte, which is educational but slow.

I am not going deep on any of these protocols here — each one is its own rabbit hole. The point is that the CAN peripheral on the MCU handles the bus-level mechanics, but any real application involves a higher-layer protocol that defines what the messages mean and how nodes interact.

## LIN

### What LIN Is

LIN (Local Interconnect Network) is a single-wire, master-slave serial bus designed as a low-cost complement to CAN. Where CAN provides multi-master arbitration, high speed, and robust error handling for critical vehicle systems, LIN handles the simple, non-critical stuff: adjusting mirrors, moving seats, reading a rain sensor, controlling interior lights. The entire point of LIN is cost reduction — one wire instead of two, a simple transceiver instead of a CAN transceiver, and slave controllers that can be much cheaper than CAN-capable MCUs.

LIN was developed by a consortium of automotive manufacturers and semiconductor companies (the LIN specification is freely available). The current version is LIN 2.2A, though devices built to earlier versions are still encountered.

### Physical Layer

LIN uses a single wire for communication, referenced to ground, with voltage levels based on the vehicle battery (nominally 12V, though the specification covers the full automotive range). A LIN transceiver converts between the MCU's UART-level signals and the bus-level 12V signaling. Common LIN transceivers include:

- **TJA1020** — NXP, widely used, supports LIN 2.0 and later.
- **TJA1021** — NXP, smaller package, lower quiescent current.
- **MCP2003 / MCP2004** — Microchip parts with integrated voltage regulator, which is handy for simple LIN slave nodes that can be powered directly from the bus wire's pull-up supply.

The bus is pulled high through a resistor (typically 1 kohm to the supply) at the master node. Communication happens by pulling the bus low (dominant state). The maximum bus length is about 40 meters, and up to 16 slave nodes can share a single LIN bus.

### Speed

LIN runs at up to 20 kbps. That is not a typo — twenty kilobits per second. This is roughly 1000 times slower than CAN at its maximum and about twice as fast as 9600 baud UART. For a seat motor controller or a rain sensor that sends a few bytes every 100 ms, this is perfectly adequate. LIN is not trying to be fast; it is trying to be cheap.

### Master-Slave Architecture

Unlike CAN's multi-master bus, LIN is strictly master-slave. One master node controls all communication on the bus. The master sends a header (consisting of a sync break, sync byte, and protected identifier), and the designated slave responds with data. No slave ever transmits without being asked. This eliminates the need for arbitration hardware — a major cost saving in the slave nodes.

The master maintains a schedule table that defines which messages are sent at what intervals. This makes LIN communication completely deterministic: exactly when every message will appear on the bus is known in advance. The schedule is typically defined at design time and does not change at runtime, though the specification allows the master to modify it.

A LIN frame consists of:
1. **Sync break** — At least 13 dominant bits. This is longer than any valid UART byte and signals the start of a new frame.
2. **Sync field** — The byte 0x55, which provides a bit pattern that slaves can use for automatic baud rate detection.
3. **Protected identifier (PID)** — A 6-bit frame ID (0-63) plus two parity bits. The PID tells the slaves which frame is being requested.
4. **Data** — 1 to 8 bytes of payload, transmitted by whichever node (master or slave) is the publisher for this frame ID.
5. **Checksum** — Either classic (data bytes only, LIN 1.x) or enhanced (data bytes plus PID, LIN 2.x).

### MCU Connection: UART Plus Transceiver

Here is something I found initially surprising: most MCUs do not have a dedicated LIN peripheral. Instead, LIN is implemented using a standard UART peripheral connected to a LIN transceiver. The LIN frame format maps onto UART bytes — the sync byte is 0x55, the PID and data are regular UART bytes at the configured baud rate. The sync break is the main exception: it is longer than a normal UART frame and requires special handling.

For a LIN master, generating the sync break means either:
- Temporarily switching the UART to a lower baud rate to produce a longer "byte" that looks like a break
- Using a LIN break generation feature if the UART peripheral has one (many STM32 UART peripherals do)
- Bit-banging the TX pin low for the required duration

For a LIN slave, detecting the sync break means recognizing a framing error (since the break violates normal UART framing) followed by the 0x55 sync byte. The slave can then measure the 0x55 pattern to calibrate its own baud rate — this auto-baud feature lets LIN slaves use cheaper, less accurate oscillators (like internal RC oscillators) instead of external crystals.

Some MCUs do include dedicated LIN peripherals or UART modes with built-in LIN support: break detection, auto-baud from the sync field, and automatic checksum generation/checking. STM32's USART peripherals, for example, have a LIN mode that handles break detection in hardware. This simplifies the firmware considerably — without it, the firmware must parse UART framing errors and manually synchronize to the break/sync pattern.

### Use Cases

LIN shows up in vehicles for anything that does not need CAN's speed, reliability, or multi-master capability:

- Window lift controllers
- Mirror adjustment (position, fold, heat)
- Seat motors and position memory
- Rain and light sensors
- Interior and ambient lighting (especially LED dimming)
- Sunroof control
- Steering wheel button clusters
- Simple sensor readings (temperature, humidity)

In each case, a cheap LIN slave controller handles the local function and communicates with a body control module (BCM) or door module that acts as the LIN master. That master module typically also sits on the vehicle's CAN bus, acting as a gateway between the LIN subnet and the rest of the vehicle network.

### Cost Advantage

The cost argument for LIN is concrete:
- **One wire** instead of CAN's two (plus ground, which is shared with the power supply ground in vehicles)
- **Simpler transceiver** — LIN transceivers cost roughly half what CAN transceivers cost in automotive-qualified versions
- **Cheaper slave MCUs** — A LIN slave only needs a UART and a basic oscillator. No CAN peripheral, no crystal (thanks to auto-baud), potentially a very small and cheap 8-bit MCU.
- **Reduced wiring harness** — In a vehicle, the wiring harness is a significant cost. Every wire eliminated saves material, weight, and assembly time.

Multiplied across dozens of modules in a vehicle — and across millions of vehicles — the cost difference is substantial.

### LIN vs. Plain UART

It is tempting to think of LIN as "just UART on a car," but that misses several important differences:

- **Defined schedule** — LIN communication follows a fixed timetable. There is no ad-hoc communication; the master controls exactly when each frame appears.
- **Sync mechanism** — The break and sync field let slaves synchronize to the master's clock, enabling the use of low-accuracy oscillators.
- **Error detection** — The checksum catches data corruption. The PID parity bits catch header corruption.
- **Standardized physical layer** — Voltage levels, termination, and transceiver behavior are specified for automotive environments.
- **Interoperability** — Any LIN-compliant device from any manufacturer can be connected to a LIN bus and will handle framing and synchronization correctly (assuming matching checksum versions).

A bare UART connection between two MCUs works fine on a bench, but it provides none of this structure. LIN is a bus protocol with defined behavior; UART is just a bit-level transport.

## Choosing CAN vs. LIN

| | CAN | LIN |
|---|---|---|
| **Topology** | Multi-master, shared bus | Single master, up to 16 slaves |
| **Speed** | Up to 1 Mbps (8 Mbps data phase for CAN FD) | Up to 20 kbps |
| **Wiring** | Two wires (differential) | One wire (single-ended) |
| **Arbitration** | Hardware, non-destructive, priority-based | None — master controls all communication |
| **Error handling** | CRC, ACK, error counters, bus-off recovery | Checksum, PID parity |
| **Transceiver cost** | Higher | Lower |
| **MCU requirement** | CAN peripheral required | UART sufficient |
| **Typical use** | Powertrain, chassis, diagnostics, industrial | Comfort/convenience, simple sensors/actuators |

In a vehicle, the choice is usually straightforward: anything safety-related or performance-critical gets CAN; anything that is a simple actuator or non-critical sensor gets LIN. The body control module, door module, or gateway ECU bridges between the two worlds.

Outside of automotive, CAN is widely used but LIN is rare. Industrial and robotics applications that need a cheap, slow bus are more likely to use RS-485, Modbus, or a simple UART network than LIN, because those ecosystems are not built around LIN tooling and transceiver availability. CAN, on the other hand, has fully crossed over from automotive into general-purpose embedded networking.

## Tips

- Measure CAN bus termination resistance before debugging — two 120-ohm terminators in parallel should read around 60 ohms across CAN_H and CAN_L
- Use loopback mode for initial CAN firmware bring-up before connecting transceivers and the physical bus
- Plan CAN message ID allocation early — IDs determine arbitration priority and poorly planned IDs can delay critical messages
- Monitor CAN error counters in firmware as an early warning system for bus health issues
- Enable LIN break detection mode if the UART peripheral supports it to avoid framing error confusion
- Verify LIN checksum version (classic vs. enhanced) matches between master and slave when integrating devices

## Caveats

- **CAN requires external transceivers and termination** — Without a transceiver, there is no differential signaling. Without 120-ohm termination at both ends, reflections cause intermittent errors
- **CAN bus-off recovery is not automatic on all MCUs** — Some peripherals require firmware to explicitly initiate recovery from bus-off state. Without this, the node goes silent until reset
- **CAN ID allocation is a system-level design decision** — Message IDs determine arbitration priority. Poorly planned IDs can delay critical messages and waste bus bandwidth
- **LIN break detection can confuse regular UART receive** — The sync break does not look like a valid UART byte and may generate spurious framing errors
- **LIN checksum versions must match between master and slave** — Classic (LIN 1.x) and enhanced (LIN 2.x) checksums are incompatible
- **CAN FD mixed-mode buses need careful planning** — Classic CAN nodes interpret CAN FD frames as errors, incrementing error counters toward bus-off
- **LIN slave auto-baud depends on receiving the sync field** — If a slave misses the 0x55 sync byte, it cannot calibrate baud rate and misinterprets subsequent data

## Bench Relevance

- Intermittent CAN errors that look like firmware bugs often trace to missing or incorrect bus termination — check resistance first
- A CAN node that goes silent after a burst of errors has likely reached bus-off — verify firmware handles bus-off recovery
- CAN error counters that climb slowly during normal operation suggest marginal timing or electrical problems before they cause bus-off
- LIN slaves that occasionally misinterpret frames may have checksum version mismatches — check LDF specifications
- LIN communication that works after master restart but fails after slave restart suggests the slave relies on initial sync rather than per-frame re-synchronization
