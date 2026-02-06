---
title: "Legacy Signaling and Interfaces"
weight: 50
bookCollapseSection: true
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Legacy Signaling and Interfaces

Many "legacy" interface standards are still in daily use -- they just are not the ones a designer would pick for a new design. RS-232 serial links run industrial equipment and test instruments. RS-485 multi-drop buses connect sensors across factory floors. 4–20 mA current loops carry analog measurements in process control. Relay logic still runs HVAC systems and older machine tools. These interfaces have electrical characteristics that differ from modern standards in ways that matter at the bench.

## RS-232

The granddaddy of serial interfaces, standardized in 1962 and still on every piece of test equipment with a serial port. RS-232 uses bipolar voltage signaling: a logical 1 (mark) is −3 V to −15 V, a logical 0 (space) is +3 V to +15 V. The ±3 V to ±15 V range means RS-232 signals will damage unprotected 3.3 V or 5 V logic inputs.

**Electrical characteristics:**
- Single-ended, point-to-point (one transmitter, one receiver)
- Maximum cable length nominally 15 m (50 ft), though slower baud rates work over longer runs
- Common baud rates: 9600, 19200, 38400, 115200
- Typical driver ICs: MAX232 (generates ±10 V from +5 V using charge pumps), SP232, ICL232

**Common encounters:** DB-9 and DB-25 connectors. DTE vs. DCE pin assignments — a constant source of confusion. Null modem cables that swap TX and RX for connecting two DTE devices. Hardware flow control (RTS/CTS) that is sometimes wired, sometimes not, and sometimes wired incorrectly. Many legacy devices use only TX, RX, and ground — three wires.

**Interfacing to modern systems:** USB-to-serial adapters (FTDI FT232, CP2102, CH340) handle the voltage translation and protocol conversion. The adapter presents a virtual COM port to the PC. This works well, with one caveat: USB serial adapters add latency that wasn't present with native serial ports, which can cause timing-sensitive protocols to fail.

## RS-485

Multi-drop, differential, half-duplex (or full-duplex with four wires). RS-485 supports up to 32 devices on a shared bus over distances up to 1200 m (4000 ft) at moderate speeds. It's the backbone of industrial communication: Modbus RTU, Profibus, BACnet MSTP, and DMX512 all run on RS-485 physical layers.

**Electrical characteristics:**
- Differential signaling: data is the voltage difference between the A and B lines. Common-mode noise rejects well, which is why RS-485 works in electrically noisy industrial environments
- Driver output: ±1.5 V to ±5 V differential
- Receiver threshold: ±200 mV differential. Anything above +200 mV is a valid logic state; anything below −200 mV is the other state. The gap between provides noise margin
- Requires termination resistors (120 Ω typical) at each end of the bus to prevent reflections

**Caveats with RS-485:**
- A and B naming is not standardized — some manufacturers swap them. If communication doesn't work, swap the two data lines before debugging further
- Bias resistors (pull-up on one line, pull-down on the other) keep the bus in a defined state when no driver is active. Without biasing, the bus floats during idle periods and receivers may see garbage
- Half-duplex requires driver enable control. The transmitting device enables its driver, sends data, then disables the driver. If the driver stays enabled, it blocks all other devices on the bus. A stuck driver enable line is a common failure mode

## 4–20 mA Current Loops

The standard analog signal for process control instrumentation. A sensor or transmitter outputs a current between 4 mA and 20 mA proportional to the measured variable. 4 mA represents the zero or minimum reading; 20 mA represents full scale.

**Why current, not voltage:**
- Current is immune to wire resistance. A 500 m cable run doesn't affect the signal accuracy — the transmitter adjusts its output voltage to maintain the correct current regardless of loop resistance
- The live zero at 4 mA distinguishes "zero reading" from "broken wire." If the loop current drops below 4 mA, the receiver knows the loop is faulted — open wire, dead transmitter, or lost power. A 0–20 mA signal can't make this distinction
- Standard 250 Ω sense resistor converts 4–20 mA to 1–5 V for an ADC

**Loop-powered devices:** Many 4–20 mA transmitters are "two-wire" — they draw their operating power from the loop current itself. The minimum 4 mA provides enough power for the transmitter's electronics (the transmitter must operate on less than 4 mA × loop voltage). This simplifies wiring dramatically: just two wires from the control room to the sensor, carrying both power and signal.

**Interfacing to a microcontroller:** A precision sense resistor (250 Ω, 0.1% tolerance) converts the current to a 1–5 V voltage. This feeds an ADC input. The resistor tolerance directly affects measurement accuracy — a 1% resistor introduces up to 1% error before the ADC even contributes. For isolation, use an isolated ADC or an analog optocoupler.

## Relay Logic

Before PLCs, industrial control logic was built from electromechanical relays wired into logic networks. Relay logic implements AND, OR, NOT, latching, timing, and sequencing using relay contacts, timer relays, and control relays. This is still the installed base in many older buildings, manufacturing facilities, and machine tools.

**Basic elements:**
- **Control relay** — An electromagnet that operates one or more sets of contacts. Normally open (NO) contacts close when energized; normally closed (NC) contacts open. A single relay can have multiple contact sets (poles)
- **Timer relay** — A relay with a built-in time delay. On-delay timers energize the coil and wait before closing the contacts. Off-delay timers open the contacts some time after the coil de-energizes. Timing ranges from fractions of a second to minutes
- **Contactor** — A heavy-duty relay designed for switching power loads (motors, heaters). Contactors have arc suppression and are rated for the inrush current of the load they switch

**Reading ladder diagrams:** Relay logic is documented in ladder diagrams — two vertical power rails with horizontal "rungs" connecting them. Each rung represents a current path from L1 (hot) through a series of contacts and coils to L2 (neutral or return). Contacts in series form AND logic. Contacts in parallel form OR logic. A coil anywhere in the rung energizes when the path from L1 to L2 is complete.

**Common failure modes:** Contact erosion and welding (contacts that won't open or won't close). Coil burnout (open circuit). Mechanical sticking from dirt, corrosion, or worn pivots. Timer drift from aging components (older pneumatic timers are particularly prone to drift). Intermittent failures from vibration-sensitive connections.

## Parallel Port I/O

The PC parallel port (DB-25, LPT) was repurposed as a general-purpose digital I/O interface for a generation of lab equipment, CNC controllers, and custom instrumentation. The standard parallel port provides 8 data output lines, 5 status input lines, and 4 control output lines — enough for simple device control and data acquisition without custom hardware.

**Electrical characteristics:**
- 5 V TTL-level outputs with limited drive capability (about 2.6 mA source, 24 mA sink on some implementations — varies widely by chipset)
- No isolation — the port is directly connected to the PC's I/O bus. A wiring mistake can damage the parallel port controller or the motherboard
- Directly addressable via I/O port instructions (legacy PC architecture). Modern USB-to-parallel adapters often don't support the bit-banging mode that lab equipment relies on

**Where it appears:** CNC machine controllers (Mach3, LinuxCNC), custom test fixtures, printer-port logic analyzers, EPROM programmers, and any bespoke lab equipment from the 1990s and early 2000s. Replacing the parallel port interface often means replacing the control software, which may be the harder problem.

## Tips

- When an RS-485 bus fails to communicate, swap the A and B lines before any other debugging -- the naming convention is not standardized and some manufacturers reverse them
- Keep a USB-to-serial adapter (FTDI FT232 or CP2102) and a MAX3232 breakout on the bench for quick RS-232 interfacing -- these cover the vast majority of legacy serial connections
- For 4-20 mA loops, always use a precision sense resistor (0.1% or better) at 250 ohms to convert to 1-5 V -- the resistor tolerance directly limits measurement accuracy
- Before probing relay logic, verify the operating voltage (120 V AC or 24 V DC) and follow lockout/tagout procedures -- these are not bench-safe voltage levels

## Caveats

- **RS-232 voltage levels will damage modern logic** -- Never connect RS-232 signals directly to a 3.3 V or 5 V microcontroller. Use a level translator (MAX232 or equivalent) or a USB-serial adapter
- **Current loop polarity matters** -- A 4-20 mA loop must be wired with the correct polarity. Reversing the loop typically results in zero output (the transmitter cannot push current backwards), which looks identical to a broken wire
- **Relay logic is powered by mains voltage** -- Ladder logic circuits typically operate at 120 V AC or 24 V DC. These are not bench-safe voltages. Use proper lockout/tagout procedures before probing relay logic circuits. For measurement technique and safety procedures, see [Measurement & Test]({{< relref "/docs/measurement" >}})
- **Legacy interfaces have no protection** -- Modern interfaces (USB, Ethernet) include ESD protection, termination, and defined failure modes. Legacy interfaces assume the operator understands the electrical requirements. Miswiring RS-232, RS-485, or a current loop can damage equipment

## In Practice

- A 4-20 mA loop reading exactly 0 mA indicates a broken wire or dead transmitter, not a zero measurement -- the live-zero at 4 mA is specifically designed to distinguish faults from valid readings
- An RS-485 bus that shows garbage characters during idle periods is likely missing bias resistors -- without pull-up and pull-down biasing, the bus floats when no driver is active
- A half-duplex RS-485 device that blocks all other devices on the bus has a stuck driver-enable line -- this is one of the most common RS-485 failure modes
- USB-to-serial adapters add latency that native serial ports do not have, which can cause timing-sensitive legacy protocols to fail even when the voltage levels and wiring are correct
