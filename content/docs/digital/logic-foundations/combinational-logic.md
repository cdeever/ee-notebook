---
title: "Combinational Logic"
weight: 30
---

# Combinational Logic

Combinational circuits produce outputs that depend only on the current inputs — no memory, no state, no clock. Every combination of inputs maps to a fixed output, defined by a truth table or Boolean expression. Decoders, encoders, multiplexers, adders, and comparators are all combinational building blocks.

These blocks are the raw material of digital design. Combinational logic is conceptually simple — the function is fully specified by its truth table — but physical implementations introduce timing issues (propagation delay, hazards, glitches) that the Boolean algebra doesn't capture.

## Decoders

A decoder takes an n-bit input and activates one of 2^n outputs. Each output corresponds to exactly one input combination.

**Example: 3-to-8 decoder (74HC138)**
- 3 binary inputs select one of 8 outputs
- Only the selected output is active (LOW in the 74HC138); all others are inactive (HIGH)
- Enable inputs allow cascading decoders — two 3-to-8 decoders with complementary enables form a 4-to-16 decoder

**Common uses:**
- Address decoding — selecting one of several memory or peripheral chips based on address bits
- One-hot encoding — converting a binary number to a single active wire (used in state machines and control logic)
- Demultiplexing — routing a single signal to one of many destinations

**Design consideration:** Decoders have propagation delay from input change to output change. In address decoding, this delay adds to the memory access time. Fast decoders matter in high-speed systems.

## Encoders

The inverse of a decoder: many inputs, few outputs. An encoder converts a one-hot input (one active line) to a binary code.

**Priority encoder:** When multiple inputs are active simultaneously, the priority encoder reports the highest-priority one. This is essential in interrupt controllers where multiple interrupt sources may assert simultaneously — the processor needs to know which is most urgent.

**Example: 8-to-3 priority encoder (74HC148)**
- 8 inputs, 3-bit binary output
- If inputs 3 and 7 are both active, the output encodes 7 (higher priority)
- A "valid" output indicates whether any input is active

## Multiplexers

A multiplexer (mux) selects one of several data inputs and routes it to a single output, controlled by select lines. An n-to-1 mux has n data inputs, log2(n) select inputs, and 1 output.

**Example: 8-to-1 multiplexer (74HC151)**
- 8 data inputs, 3 select inputs, 1 output
- The select inputs choose which data input appears at the output

**Multiplexers as universal logic:** Any Boolean function of n variables can be implemented with a 2^n-to-1 mux by connecting the function's truth table values to the data inputs and the variables to the select inputs. A 4-to-1 mux can implement any 2-variable function. This makes muxes a flexible building block and is the basis of FPGA lookup tables (LUTs).

**Analog muxes** exist too (e.g., 74HC4051), but they have on-resistance (typically 50-200 ohm), leakage current, and charge injection — analog concerns that digital muxes avoid because they only pass logic levels.

## Adders

Binary addition is the foundation of digital arithmetic.

**Half adder:** Adds two 1-bit inputs. Produces a sum (XOR) and a carry (AND). No carry input.

**Full adder:** Adds two 1-bit inputs plus a carry-in. Produces a sum and a carry-out. This is the building block for multi-bit addition.

**Ripple carry adder:** Chain full adders together — each carry-out feeds the next carry-in. Simple but slow: the carry must "ripple" through all bits sequentially. For an n-bit adder, the worst-case delay is n times the carry propagation delay.

**Carry lookahead:** Computes all carries in parallel using additional logic. Much faster than ripple carry, but requires more gates. The tradeoff between speed and gate count is a classic digital design decision.

## Comparators

Compare two binary numbers and output their relationship: equal, greater-than, less-than.

**Bit-by-bit comparison** starts at the most significant bit and works down. If the MSBs differ, the comparison is resolved. If they're equal, check the next bit. This cascading structure means comparison time increases with word width.

**Practical note:** Magnitude comparators like the 74HC85 compare 4-bit numbers and can cascade for wider comparisons. In FPGA and ASIC designs, comparators are synthesized from the HDL description and optimized by the tools.

## Propagation Delay and Critical Paths

Every gate has propagation delay — the time from when the input changes to when the output settles to its new value. In a combinational circuit, the total delay from input to output depends on the longest path through the circuit.

**Critical path:** The path with the greatest total propagation delay. This determines the maximum operating speed of the circuit. In a synchronous system, the combinational logic between two flip-flops must settle within one clock period (minus setup time).

**Practical impact:** A 32-bit ripple carry adder might have a critical path of 32 x 5 ns = 160 ns, limiting speed to about 6 MHz. A carry-lookahead adder might have a critical path of 20 ns, allowing 50 MHz. The Boolean function is identical — the implementation determines the speed.

## Hazards and Glitches

A hazard is a potential for a momentary incorrect output during an input transition, even though the steady-state output is correct. A glitch is the actual occurrence of that incorrect output.

### Static Hazards

The output should remain at a constant value during an input transition but briefly pulses to the opposite value.

**Example:** Consider F = AB + AB'. This should always be 1 when A=1, regardless of B. But if the B and B' signals have slightly different delays through their respective gates, there can be a brief moment where neither term is active, producing a glitch to 0.

**Fix:** Add a redundant product term (the "consensus term") that covers the transition. For the example, adding AA' (which is always 0) doesn't help, but adding the term that bridges the two minterms eliminates the hazard. Karnaugh maps make hazard identification visual — any pair of adjacent 1-groups not covered by a single term has a potential static hazard.

### Dynamic Hazards

The output should transition once (0 to 1 or 1 to 0) but transitions multiple times before settling. These occur in multi-level logic where signals arrive at different times through different paths.

### When Hazards Matter

In purely synchronous designs, hazards are usually harmless — the output is only sampled by the clock edge, long after glitches have settled. But hazards matter in:

- **Asynchronous circuits** — where there is no clock to mask glitches
- **Clock generation logic** — glitches on a clock signal can cause spurious triggers
- **Set/Reset inputs** — a glitch on an asynchronous reset can corrupt state
- **Level-sensitive latches** — a glitch while the latch is transparent passes through to the output

## Gotchas

- **Propagation delay varies with conditions** — Temperature, supply voltage, and output loading all affect delay. Datasheet values are worst-case (slow corner). Typical delays may be 2-3x faster than worst-case, which means a design that "works on the bench" may fail at temperature extremes
- **Glitches are hard to see on a scope** — A 1 ns glitch on a 10 MHz signal requires high bandwidth and fast sampling to capture. If a design has intermittent misbehavior that disappears when probed more carefully, glitches are a likely suspect
- **Don't gate clocks with combinational logic** — Passing a clock signal through AND or OR gates to create gated clocks introduces hazards and uncontrolled delay. Use dedicated clock gating cells or clock enable inputs on flip-flops instead
- **Unused inputs on combinational ICs must be tied off** — An unconnected input on a gate, decoder, or mux floats to an undefined level. This causes unpredictable behavior and, in CMOS, excessive power draw. Tie unused inputs to VDD or GND as appropriate for the function
- **Decoder enables and mux selects have setup timing** — In synchronous designs, the select and enable signals must be stable before the data is sampled. If the select changes while the mux output is being used, the output momentarily reflects the wrong input
