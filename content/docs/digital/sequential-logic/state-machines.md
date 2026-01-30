---
title: "State Machines"
weight: 30
---

# State Machines

A state machine is a sequential circuit that moves through a defined set of states according to its inputs and current state. It is the fundamental model for any digital system that exhibits behavior over time — traffic light controllers, communication protocol handlers, motor controllers, vending machines, and processor control units are all state machines at their core.

Every sequential circuit is technically a state machine, but the term is usually reserved for designs that are explicitly structured around a finite set of named states with defined transitions between them.

## The Two Types

### Moore Machine

Outputs depend only on the current state. The output is "attached to the state" — it changes only when the state changes, which means outputs are synchronous and change one clock cycle after the input that caused the state transition.

**Characteristics:**
- Outputs are stable for the entire clock cycle (no combinational path from inputs to outputs)
- Easier to design and debug — each state has a fixed, predictable output
- May require more states than Mealy (because different outputs for the same transition require different states)
- The one-cycle output delay can be a timing advantage (cleaner timing) or a disadvantage (slower response)

### Mealy Machine

Outputs depend on both the current state and the current inputs. The output can change asynchronously with respect to the clock (whenever an input changes while in a particular state).

**Characteristics:**
- Outputs can respond within the same clock cycle as the input change
- Often requires fewer states than Moore (because output differences can be encoded in the transitions rather than requiring separate states)
- Outputs may glitch during input transitions (since they pass through combinational logic from inputs to outputs)
- In synchronous Mealy designs, outputs are registered, which eliminates glitches but adds one cycle of latency — making them functionally similar to Moore machines

**Practical choice:** Moore machines are more common in practice because they are easier to verify and produce cleaner outputs. Registered-output Mealy machines are used when the Mealy state encoding is significantly simpler. Pure (unregistered) Mealy outputs are avoided in most synchronous designs because of glitch sensitivity.

## State Diagrams

A state diagram is a directed graph where:
- **Circles (or ovals)** represent states, labeled with the state name and (for Moore) the outputs
- **Arrows** represent transitions, labeled with the input conditions and (for Mealy) the outputs
- An arrow from State A to State B labeled "X=1" means: "when in State A and input X is 1, move to State B on the next clock edge"

**Design process:**
1. Identify the states — every distinct behavior or condition the system can be in
2. Define the transitions — for every state and every input combination, where does the system go?
3. Assign outputs — what should the system output in each state (Moore) or during each transition (Mealy)?
4. Check for completeness — every state must have a defined transition for every possible input combination. Missing transitions create undefined behavior

A well-drawn state diagram is the single most important design document for a sequential system. It forces the designer to think about every state and every transition explicitly, which is where most design errors are caught — not in the implementation.

## State Encoding

States are abstract labels (IDLE, RUN, WAIT, ERROR). They must be encoded as binary values for the flip-flops.

### Binary Encoding

States are numbered sequentially (000, 001, 010, 011, ...). Uses the minimum number of flip-flops: ceil(log2(n)) flip-flops for n states. But the next-state logic is complex because multiple flip-flops change simultaneously.

### One-Hot Encoding

Each state uses one flip-flop. In a system with n states, there are n flip-flops, and exactly one is HIGH at any time. The next-state logic is simpler (each flip-flop's input depends only on the transitions into that state), but more flip-flops are used.

**FPGAs prefer one-hot:** FPGAs have abundant flip-flops but limited combinational logic resources. One-hot encoding trades flip-flops (cheap) for simpler logic (expensive). Most FPGA synthesis tools default to one-hot encoding for state machines.

**ASICs prefer binary:** In ASICs, flip-flops and logic have comparable costs. Binary encoding minimizes total gate count.

### Gray Code Encoding

Only one bit changes between adjacent states. Useful when the state machine cycles through states in a fixed sequence (like a counter). Reduces switching noise and power.

## Implementation

A state machine implementation consists of three parts:

1. **State register** — Flip-flops that hold the current state encoding. Clocked by the system clock. Reset to the initial state.
2. **Next-state logic** — Combinational logic that computes the next state from the current state and inputs. Feeds the D inputs of the state register.
3. **Output logic** — Combinational logic (Moore: from state register only; Mealy: from state register and inputs) that produces the outputs.

In HDL, these are typically described as three distinct processes or always blocks. Some coding styles merge the state register and next-state logic into one clocked block, which can be cleaner but makes the logic harder to inspect separately.

## Designing Robust State Machines

### Default State

If the state register enters an undefined state (due to noise, SEU, or a bug), the state machine is stuck. Always include a default transition to a known safe state (typically the reset state or an error state).

In HDL:
- Always include a `default` case in the state machine's case statement
- The default should transition to the reset/idle state, not just hold the current state

### Error States

For safety-critical or communication protocol state machines, an explicit ERROR state that produces a safe output and waits for a reset or recovery condition is a standard practice.

### State Machine Watchdog

If the state machine should complete a sequence within a bounded time, a timer that resets the state machine if it gets stuck is a useful safety mechanism. This is analogous to a watchdog timer in embedded systems, but implemented in pure hardware.

## State Machines in Practice

**Traffic light controller:** A classic example. States are the light phases (NS_GREEN, NS_YELLOW, EW_GREEN, EW_YELLOW, etc.). Transitions are driven by timers and sensor inputs. Outputs are the light control signals. Safety requires that conflicting greens (both NS and EW green simultaneously) are unreachable from any state — this is verified by inspection of the state diagram.

**SPI controller:** States are IDLE, LOAD, SHIFT, DONE. The state machine loads data, shifts bits out one per clock, counts to the word length, and asserts a "done" signal. Inputs are start, clock count, and configuration. Outputs are chip select, clock enable, and shift register controls.

**Debouncer:** A state machine that waits for a button input to be stable for a minimum number of clock cycles before asserting the debounced output. States: IDLE, PRESSED_WAIT, PRESSED, RELEASED_WAIT. A counter (or separate state for each wait cycle) provides the timing.

## Gotchas

- **Unreachable states waste resources and hide bugs** — If a state exists in the encoding but is never reached through normal transitions, it should either be removed or assigned a safe default transition. In one-hot encoding, illegal states (where zero or more than one flip-flop is set) are especially dangerous
- **Missing transitions cause undefined behavior** — If a state-input combination is not explicitly defined, the synthesis tool may assign arbitrary behavior. Always cover every case, including impossible ones (defensive design)
- **Large state machines are hard to verify** — A state machine with n states and m input bits has n x 2^m possible transitions. For a 16-state machine with 4 inputs, that's 256 transitions to verify. State diagram review is essential, and formal verification tools can check for unreachable states, deadlocks, and safety properties
- **One-hot encoding needs illegal-state detection** — In a one-hot state machine, any state where more than one flip-flop is set (or none is set) is illegal. A single bit-flip (from noise or SEU) creates an illegal state. Adding a parity check or using a Hamming-encoded state can detect and recover from single-bit errors
- **Clock enable vs. state machine clock** — Slowing down a state machine by gating its clock creates timing analysis problems. The preferred approach is to run the state machine at the full system clock and use a clock enable (derived from a counter) to advance the state only at the desired rate
