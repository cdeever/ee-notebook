---
title: "FPGAs"
weight: 20
---

# FPGAs

A Field-Programmable Gate Array is a chip containing a large array of configurable logic blocks, programmable interconnect, and I/O cells — all of which can be configured after manufacturing to implement virtually any digital circuit. FPGAs are not processors. They don't execute instructions. They *are* the hardware: the configuration defines the actual circuit topology, and once configured, the FPGA is electrically equivalent to a custom ASIC (just slower and larger).

## Architecture

### Logic Elements (LEs) and Lookup Tables (LUTs)

The basic building block of an FPGA is the Logic Element (or Configurable Logic Block, depending on the vendor). Each LE contains:

- **A lookup table (LUT)** — Typically a 4-input or 6-input LUT that can implement any Boolean function of its inputs. The LUT is essentially a small SRAM: the truth table values are stored in memory, and the inputs select which value to output. A 4-input LUT has 16 memory cells (2^4); a 6-input LUT has 64
- **A flip-flop** — Usually a D flip-flop with clock enable, set, and reset. The LUT output can optionally pass through this flip-flop for registered outputs
- **Carry logic** — Dedicated fast carry chains for arithmetic operations. Without these, an adder built from LUTs would be very slow
- **Multiplexers** — For routing and combining signals within the LE

A modern mid-range FPGA has tens of thousands to hundreds of thousands of LEs. High-end FPGAs have millions.

### Programmable Interconnect

The interconnect is a network of programmable switches and routing channels that connect LEs to each other and to I/O pins. The interconnect typically consumes more silicon area and more delay than the logic itself.

**Routing hierarchy:**
- **Local routing** — Connects neighboring LEs with minimal delay. Used for short, performance-critical paths
- **Row/column routing** — Medium-distance connections along rows and columns of the logic array
- **Global routing** — Long-distance connections that span the entire chip. Higher delay but reach everywhere. Used for clocks, resets, and wide-fan-out control signals

**Routing delay is usually the dominant factor in FPGA timing.** The logic in a LUT completes in roughly 0.3-1 ns, but the interconnect delay from one LE to another can be 1-5 ns depending on distance. Placement and routing quality directly determine the maximum clock frequency.

### Hard IP Blocks

Modern FPGAs include dedicated hardware blocks that would be inefficient to build from LUTs:

- **Block RAM (BRAM)** — Dual-port SRAM blocks, typically 18-36 kbit each. Used for FIFOs, buffers, lookup tables, and small memories. Much denser and faster than implementing memory from LUT SRAM
- **DSP blocks** — Multiply-accumulate units (18x18 or 27x27 bit multipliers with accumulators). Essential for signal processing, filtering, and any math-heavy computation
- **Clock management** — PLLs and DLLs for frequency synthesis, clock multiplication/division, and phase adjustment. See [Clocks]({{< relref "/docs/digital/timing-and-synchronization/clocks" >}})
- **High-speed transceivers (SerDes)** — Multi-gigabit serial transceivers for PCIe, Ethernet, HDMI, and other high-speed interfaces. These are fully analog circuits embedded in the FPGA
- **Processor cores** — Some FPGAs include hard ARM Cortex-A or Cortex-M cores (Xilinx Zynq, Intel Cyclone V SoC). These are full processors, not soft-core implementations

### I/O Cells

FPGA I/O pins are highly configurable:

- Voltage standard: 3.3 V LVCMOS, 2.5 V, 1.8 V, 1.2 V, LVDS, HSTL, SSTL, and many others
- Drive strength: selectable output current
- Slew rate: fast or slow edge rate
- Input delay: programmable delay elements for data alignment (used in DDR interfaces)
- Differential/single-ended: most I/O pairs can be configured as LVDS differential inputs or two single-ended pins

I/O pins are grouped into banks, and each bank has a single I/O voltage (VCCO). Planning which signals go to which bank is part of the pin planning process.

## The FPGA Design Mindset

The critical conceptual shift: an FPGA design is not software. The HDL code does not execute sequentially — it describes hardware that exists in parallel.

**Things that are different from software:**
- Every signal assignment creates a physical wire. Every `always` block creates physical logic and/or flip-flops
- There is no "instruction pointer" — all logic operates simultaneously, every clock cycle
- Loops in HDL unroll into parallel hardware. A `for` loop that iterates 8 times creates 8 copies of the logic, not a sequential iteration
- "Functions" create combinational logic blocks. "Tasks" create blocks of hardware. Neither is a subroutine call
- Resource usage is determined by the design description, not by execution time. An unused module still consumes LUTs and routing

**Common misconceptions:**
- "A faster FPGA clock makes the design faster" — Only up to the point where timing closure fails. Beyond that, a faster clock requires pipeline stages (more latency) or architectural changes
- "FPGAs are slow processors" — FPGAs are not processors at all. A soft-core processor on an FPGA is slow (100-300 MHz). But an FPGA implementing a custom datapath can process data at rates no processor can match, because the parallelism is unlimited by instruction fetch/decode
- "More LUTs means better" — If the design fits, a smaller FPGA is cheaper, lower power, and often faster (shorter routing). Don't oversize the FPGA

## Configuration and Startup

Most FPGAs use SRAM-based configuration — the logic and routing are defined by SRAM cells that are loaded at power-up. This means:

- **Configuration is volatile** — The FPGA forgets its configuration when power is removed
- **Configuration storage** — An external flash memory (SPI or parallel) stores the bitstream. At power-up, the FPGA loads its configuration from this memory
- **Configuration time** — Typically 10-500 ms depending on FPGA size and configuration interface speed. During this time, the FPGA is not functional and its I/O pins are in a defined (usually high-impedance) state
- **Partial reconfiguration** — Some FPGAs can reconfigure part of their fabric while the rest continues operating. An advanced technique used in adaptive systems

**Alternatives to SRAM-based FPGAs:**
- **Flash-based FPGAs** (Microchip PolarFire, Lattice MachXO3) — Non-volatile, instant-on, radiation tolerant. Configuration survives power loss. Lower density than SRAM-based devices
- **Antifuse FPGAs** (Microchip RTAX) — One-time programmable, radiation hardened. Used in space and military applications

## The FPGA Design Flow

1. **Design entry** — Write HDL (Verilog or VHDL), or use block design tools for IP integration
2. **Simulation** — Verify functional correctness in a simulator before touching hardware
3. **Synthesis** — Convert HDL into a netlist of LUTs, flip-flops, and hard IP blocks
4. **Place and Route (P&R)** — Map the netlist onto the physical FPGA: assign logic to specific LEs and route interconnects
5. **Timing analysis** — Static timing analysis (STA) verifies that all paths meet setup and hold constraints. See [Timing Constraints]({{< relref "/docs/digital/timing-and-synchronization/timing-constraints" >}})
6. **Bitstream generation** — Create the binary file that configures the FPGA
7. **Programming** — Load the bitstream via JTAG (for development) or program the configuration flash (for production)

Steps 3-5 often iterate: if timing fails, the designer modifies the HDL, constrains the placement, or adjusts the clock frequency, then re-runs synthesis and P&R.

## Gotchas

- **Routing congestion can prevent a design from fitting** — Even if there are enough LUTs, the routing resources may be exhausted. High fan-out signals, heavily interconnected logic, or designs that use >80% of the LUTs often hit routing congestion
- **Timing closure gets harder with utilization** — A design that uses 50% of the FPGA fabric is easy to place and route with good timing. At 80%, the tools struggle to find good placements. At 90%+, timing closure may be impossible. Leave margin
- **FPGA power is dominated by the interconnect** — The programmable routing switches have parasitic capacitance that is charged and discharged on every signal transition. This makes FPGAs inherently higher power than ASICs for the same function. Clock frequency and toggle rate are the primary power knobs
- **Configuration at power-up is not instant** — Systems that depend on FPGA logic being active at power-up (reset sequencing, power supply control) need external logic or a CPLD to manage the startup window. The FPGA is not functional during configuration loading
- **The bitstream is the design** — Protecting the bitstream is protecting the intellectual property. Most FPGAs support bitstream encryption (AES-256) to prevent reverse engineering from the configuration file. Without encryption, the design is readable by anyone with JTAG access
- **Simulation is essential but not sufficient** — RTL simulation verifies functional correctness but not timing. Gate-level simulation with back-annotated timing verifies timing but is very slow. Formal verification can prove properties exhaustively but requires expertise to set up. Real hardware testing catches issues that no simulation anticipated
