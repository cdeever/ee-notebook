---
title: "HDL Concepts"
weight: 30
---

# HDL Concepts

A Hardware Description Language (HDL) describes digital circuits in text — not as software instructions, but as hardware structures. The two dominant HDLs are Verilog and VHDL, both of which describe the same underlying hardware concepts in different syntaxes. Understanding what HDL constructs actually mean in hardware — and how synthesis tools interpret them — is the key to writing HDL that produces efficient, correct, and timing-clean circuits.

## The Fundamental Distinction: Combinational vs Sequential

Every piece of digital hardware is either combinational (output depends only on current inputs) or sequential (output depends on current inputs and stored state). HDL makes this distinction explicit, and getting it wrong is the most common source of synthesis bugs.

### Combinational Logic in HDL

Combinational logic is described by assigning outputs based on inputs, with no clock and no memory.

**What synthesis produces:** A network of logic gates (LUTs in an FPGA) that directly implements the Boolean function. No flip-flops, no clock dependency.

**Key rules for correct combinational description:**
- Every possible input combination must produce a defined output. If any case is missing, the synthesis tool infers a latch (because the output must "remember" its previous value when the missing case occurs). Latch inference from incomplete combinational descriptions is almost always a bug
- There must be no feedback (output feeding back to input) without a clock. Feedback in combinational logic creates oscillation or undefined behavior
- Sensitivity lists (in Verilog `always @(*)` or VHDL `process(all)`) must include all signals that affect the output. Missing signals cause simulation/synthesis mismatches

### Sequential Logic in HDL

Sequential logic is described by assigning outputs on a clock edge, using a flip-flop to store the value.

**What synthesis produces:** D flip-flops whose inputs are combinational functions of the current state and inputs. The clock edge captures the new state.

**Key rules:**
- The clock signal defines when state updates. Between clock edges, the flip-flop output is stable
- Reset (synchronous or asynchronous) initializes the state. Without reset, the initial state is undefined in hardware (even if the simulation tool assigns a default)
- Non-blocking assignments (Verilog `<=`) are used in sequential blocks to correctly model the simultaneous capture behavior of flip-flops on a clock edge

## What Synthesis Actually Does

Synthesis is the process of converting an HDL description into a netlist — a list of logic elements (LUTs, flip-flops, hard IP) and their connections.

**The synthesis process:**
1. **Parse and elaborate** — Read the HDL, resolve parameters and generates, build the design hierarchy
2. **Infer hardware** — Identify combinational logic, flip-flops, memories, arithmetic operators, and state machines from the HDL constructs
3. **Optimize** — Apply Boolean simplification, constant propagation, dead-code elimination, resource sharing, and other optimizations
4. **Technology mapping** — Map the optimized logic onto the target device's primitives (LUTs for FPGAs, standard cells for ASICs)

**What the synthesis tool infers from common patterns:**

- `if/else` or `case` with all cases covered → multiplexer (combinational)
- `if/else` or `case` with missing cases → latch (usually a bug)
- Assignment on `posedge clk` → D flip-flop
- `+`, `-`, `*` → adder, subtractor, multiplier (may map to DSP blocks)
- Array access with variable index → multiplexer (read) or decoder (write)
- Large `case` statement on a registered variable → state machine (tools may optimize encoding)

**What synthesis cannot infer:**
- Timing-dependent behavior ("wait 10 ns") — HDL delays are for simulation only. Synthesis ignores them
- Analog behavior — no synthesis tool creates analog circuits from HDL
- Tri-state internal buses — modern FPGAs don't support internal tri-state. The tool converts them to multiplexers

## Thinking in Hardware

The most common mistake in HDL is writing code that reads like software and expecting it to become efficient hardware.

### Parallelism Is the Default

In hardware, everything that can operate simultaneously does operate simultaneously. Two `always` blocks that both trigger on the same clock edge execute in parallel — both flip-flop groups capture their inputs at the same instant.

A `for` loop in HDL does not iterate sequentially. It unrolls into parallel hardware: `for (i = 0; i < 8; i++)` creates 8 copies of the loop body, all operating simultaneously. This means:

- An 8-iteration loop that performs addition creates 8 adders (or an adder tree)
- A loop that accesses memory creates multiple read ports (or a multiplexed access with arbitration)
- Resource cost is proportional to the number of unrolled iterations, not the "execution time"

### Pipelining

Breaking a long combinational path into stages separated by flip-flops. Each stage performs part of the computation, and the result propagates through the pipeline over multiple clock cycles.

**Tradeoff:** Pipelining increases latency (more clock cycles from input to output) but allows a higher clock frequency (each stage has a shorter combinational path). Throughput (results per second) increases because the pipeline can accept a new input every clock cycle.

**When to pipeline:** Whenever the combinational path between flip-flops exceeds what the clock period allows. Timing analysis (STA) identifies the critical path; pipelining breaks it.

### Resource Sharing

If two operations can never be active simultaneously (mutually exclusive), they can share hardware. For example, a multiplier used in state A and a different multiplier used in state B can be the same physical multiplier with a mux on its inputs — reducing resource usage at the cost of additional mux logic.

Synthesis tools perform some resource sharing automatically, but explicit sharing (using a single operator with input selection) gives the designer control.

## Common HDL Pitfalls

### Latch Inference

An incomplete conditional (an `if` without `else`, or a `case` without `default`) in a combinational context infers a latch. The synthesis tool assumes the output must hold its value when the missing condition is true.

**How to avoid:** Always include `else` and `default` clauses in combinational logic. Most linting and synthesis tools warn about inferred latches.

### Simulation/Synthesis Mismatch

HDL constructs that simulate correctly but synthesize differently:

- **Initial values** — `initial` blocks set simulation values but have no hardware equivalent (except in some FPGAs that support initial values in BRAM)
- **Timing delays** — `#10` delays are simulation-only; synthesis ignores them
- **Incomplete sensitivity lists** — Simulation uses the specified list; synthesis uses the actual dependencies. Result: simulation behaves differently from hardware. Using `always @(*)` (Verilog) or `process(all)` (VHDL) prevents this

### Blocking vs Non-Blocking Assignments

In Verilog:
- **Blocking (`=`)** — Executes sequentially within the block, like software. Used in combinational `always` blocks
- **Non-blocking (`<=`)** — Schedules the assignment for the end of the time step, modeling the parallel capture behavior of flip-flops. Used in sequential (clocked) `always` blocks

Mixing them up causes simulation bugs that don't appear in synthesis (or vice versa). The rule: blocking for combinational, non-blocking for sequential. Never mix both in the same `always` block.

### Register vs Wire

In Verilog, `reg` does not mean "register" (flip-flop). It means "a variable that can be assigned in an `always` block." Whether it becomes a flip-flop depends on whether the `always` block is triggered by a clock edge. This naming confusion has misled many beginners. SystemVerilog's `logic` type eliminates this confusion.

## HDL Beyond RTL

### Behavioral vs Structural

- **Behavioral** — Describe what the circuit does. "Add A and B" becomes `C = A + B`. The synthesis tool decides how
- **Structural** — Describe the circuit's topology. Instantiate specific gates, flip-flops, and modules, and wire them together

Most modern HDL design is behavioral (RTL — Register Transfer Level). Structural description is used for low-level primitives, IP instantiation, and technology-specific optimizations.

### Testbenches

A testbench is HDL code that drives the design under test (DUT) with stimulus and checks the outputs. Testbenches are not synthesizable — they use simulation-only constructs (delays, file I/O, assertions) to verify the design.

**Good testbench practices:**
- Self-checking — the testbench compares outputs against expected values automatically
- Coverage-driven — the testbench exercises all states, transitions, and corner cases
- Randomized stimulus with constraints — for complex designs, random testing finds bugs that directed testing misses

## Gotchas

- **Synthesis warnings are not optional reading** — Inferred latches, unused signals, constant outputs, and multi-driven nets are all reported as warnings. Each one is a potential bug. Review every synthesis warning
- **The HDL is not the hardware** — The HDL describes intent. The synthesis tool, optimizer, and place-and-route produce the actual hardware. The final circuit may be structurally very different from the HDL description while being functionally equivalent
- **Simulation passes do not guarantee correct hardware** — Simulation verifies the RTL description. It does not verify timing, power-up behavior, metastability, or physical effects. Hardware testing is always necessary
- **Don't write HDL like software** — Sequential thinking (do A, then B, then C) creates pipeline stages or state machines in hardware. Parallel thinking (A, B, and C all happen simultaneously) creates parallel hardware. The right approach depends on the problem, but hardware always executes in parallel — sequential behavior must be explicitly designed with state machines or pipelines
- **Reset strategy must be deliberate** — Synchronous reset (reset sampled on clock edge) is cleanest for timing but requires the clock to be running. Asynchronous reset (immediate) works without a clock but needs careful deassertion synchronization. Mixing strategies within a design creates confusion and potential bugs. Pick one and be consistent
- **Uninitialized flip-flops are genuinely random in hardware** — Simulation tools assign a default (usually 0 or X). Real flip-flops power up to whatever state the silicon decides. Any design that depends on an initial value without an explicit reset will work in simulation and fail in hardware
