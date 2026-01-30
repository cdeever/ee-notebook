---
title: "PLDs & CPLDs"
weight: 10
---

# PLDs & CPLDs

Before FPGAs, programmable logic meant PLDs — devices that implement Boolean functions using a fixed architecture of AND/OR arrays. Simple PLDs (PALs, GALs) replace handfuls of discrete logic chips. CPLDs scale the concept to hundreds or thousands of gates with predictable timing. These devices fill the gap between discrete 74xx logic and full FPGAs: more flexible than fixed-function chips, simpler and more predictable than FPGAs.

## Why Programmable Logic Exists

Discrete logic (74xx gates, flip-flops, decoders) works well for small designs, but as complexity grows, the problems compound:

- **Board space** — Each IC takes PCB area, needs decoupling caps, and adds routing complexity
- **Propagation delay accumulates** — Signals passing through multiple discrete ICs add up gate delays
- **Inventory and assembly** — More unique part numbers means more procurement overhead and assembly steps
- **Inflexibility** — A logic change means redesigning the PCB or cutting traces and adding bodge wires

A single PLD can replace 5-20 discrete logic ICs, with the logic defined by a programming file rather than copper traces. A design change is a reprogramming step, not a board spin.

## Simple PLDs

### PAL (Programmable Array Logic)

The original programmable logic device. A PAL has a programmable AND array feeding a fixed OR array. Each output is the OR of several AND terms (sum of products).

**Architecture:**
- Inputs connect to a programmable AND array through fuse links
- Each AND term is a product of any combination of inputs and their complements
- A fixed number of AND terms feed each OR gate (typically 4-8 terms per output)
- Outputs may be active-high, active-low, or registered (with a flip-flop)

**Programming:** Originally one-time programmable (OTP) — fuses were physically blown to define the logic. Once programmed, the configuration is permanent.

**Limitations:**
- Fixed number of product terms per output. If a function needs more terms than available, it can't fit without external logic or cascading outputs
- One-time programmable (for fuse-based PALs). A mistake means discarding the device

### GAL (Generic Array Logic)

Electrically erasable and reprogrammable version of the PAL. Same basic architecture (programmable AND, fixed OR) but uses EEPROM cells instead of fuses.

**Advantages over PAL:**
- Reprogrammable — design iterations without discarding parts
- In-system programmable versions available
- Functionally identical to PALs for logic design purposes

The 22V10 is the most widely used GAL, with 10 registered outputs and a generous number of product terms. It remains in production and is still useful for small glue logic tasks.

### PLA (Programmable Logic Array)

Both the AND array and the OR array are programmable. This is more flexible than a PAL (any product term can feed any output) but slower (more programmable connections in the signal path) and more complex to program. PLAs are rarely used as standalone devices today but the architecture appears inside CPLDs and ASICs.

## CPLDs (Complex Programmable Logic Devices)

A CPLD is multiple PLD blocks on a single chip, connected by a programmable interconnect. This scales the PLD concept from tens of gates to thousands.

**Architecture:**
- Multiple function blocks, each resembling a PAL (programmable AND array, fixed OR, macrocells with flip-flops)
- A global routing matrix connects function blocks to each other and to I/O pins
- Macrocells at each output provide configurable flip-flops, polarity control, and feedback paths
- Non-volatile configuration — CPLDs use EEPROM or flash to store their configuration, so they are active immediately at power-up (no loading delay)

**Key characteristics:**
- **Predictable timing** — Because the routing matrix has a fixed structure, the propagation delay from any input to any output is deterministic and specified in the datasheet. This makes CPLDs easy to use in timing-critical glue logic
- **Non-volatile** — Unlike SRAM-based FPGAs, CPLDs retain their configuration when power is removed. They are operational from the first clock edge after power-up
- **Instant-on** — No configuration loading time. The CPLD is ready to function as soon as the supply voltage reaches the operating threshold
- **Limited density** — Typically hundreds to low thousands of macrocells. For anything larger, an FPGA is needed

**Common CPLD families:**
- Xilinx CoolRunner-II — Ultra-low power, up to 512 macrocells
- Intel (Altera) MAX series — Up to 2,210 macrocells, 5 V tolerant I/O options
- Lattice MachXO — Bridges the CPLD/FPGA boundary with SRAM-based fabric plus flash configuration

## When to Use a PLD or CPLD

**Good fit:**
- Address decoding for memory-mapped systems (a few gates of combinational logic)
- Glue logic between ICs with incompatible interfaces (voltage translation, protocol conversion, timing adjustment)
- Power-up sequencing logic that must be active before the FPGA or microcontroller configures
- Simple state machines (a few states, a few inputs/outputs)
- Replacing 5-20 discrete 74xx ICs with a single device
- Level translation or signal conditioning where programmable I/O standards are useful
- Designs where deterministic, datasheet-specified timing is required

**Poor fit:**
- Anything needing more than a few thousand gates — use an FPGA
- Designs that need block RAM, DSP multipliers, or high-speed SerDes — these resources don't exist in CPLDs
- High-performance signal processing, complex protocols, or large state machines

## The Design Flow

1. **Describe the logic** — Using schematic entry (for simple designs) or HDL (Verilog/VHDL for larger designs)
2. **Synthesize** — The tool converts the description into product terms and macrocell assignments
3. **Fit** — The fitter maps the logic onto the specific device's architecture and routing resources
4. **Simulate** — Verify the logic and timing in simulation
5. **Program** — Download the configuration to the device via JTAG or a dedicated programmer

For simple PLDs (22V10), the tool chain is minimal: the ABEL or CUPL languages were historically used, and some modern tools still support them. For CPLDs, standard FPGA vendor tools (Vivado, Quartus, Lattice Diamond) handle the full flow.

## Gotchas

- **Product term limits are hard constraints** — If a Boolean function needs 12 product terms and the macrocell only has 8, the function either can't fit or must be split across multiple macrocells (consuming extra resources and adding delay). The fitter will report this as a fitting error
- **CPLD timing is predictable but not zero** — "Predictable" means the datasheet specifies the worst-case delay (e.g., 5 ns pin-to-pin). This is the actual delay, not an optimistic estimate. Design with the datasheet number, not the typical or best-case
- **Power-up configuration is not instant** — Even though CPLDs are non-volatile, the internal power-on reset takes some time (microseconds to milliseconds). Outputs may be in an undefined state during this period. If the CPLD controls power sequencing or reset for other devices, ensure the power-on sequence is safe
- **I/O standards must match** — Modern CPLDs support multiple I/O voltage standards (3.3 V, 2.5 V, 1.8 V) configured per bank. Mixing standards incorrectly can damage the CPLD or the connected devices. Check the bank assignments before programming
- **PLDs are disappearing from the market** — Simple PLDs (22V10, PAL-type devices) are aging out of production. For new designs, small CPLDs or low-cost FPGAs (Lattice iCE40, Gowin GW1N) are replacing them. But understanding the PLD architecture is still valuable — it's the mental model behind combinational logic implementation in all programmable devices
