---
title: "Timing Constraints"
weight: 20
---

# Timing Constraints

Every synchronous digital system is a race between data and clocks. Data must arrive at a flip-flop's input early enough to be captured (setup time) and stay stable long enough afterward (hold time). Propagation delay through combinational logic determines how fast the data can travel. When these constraints are met, the system works. When they're violated, the system fails — sometimes subtly, sometimes catastrophically.

Timing analysis is how designers verify that a digital system will work at the intended clock frequency, across all operating conditions.

## Setup Time

The minimum time the data input must be stable *before* the active clock edge.

**What happens if setup time is violated:** The flip-flop may capture the wrong value, or worse, enter a metastable state where the output hovers between 0 and 1 for an indeterminate time. See [Metastability]({{< relref "/docs/digital/when-digital-breaks-down/metastability" >}}).

**Setup time equation for a register-to-register path:**

```
t_clk >= t_cq + t_logic + t_su + t_skew
```

Where:
- t_clk = clock period
- t_cq = clock-to-Q delay of the source flip-flop
- t_logic = propagation delay through combinational logic between flip-flops
- t_su = setup time of the destination flip-flop
- t_skew = clock skew (positive if clock arrives later at the destination)

**The setup constraint limits maximum clock frequency.** Rearranging: f_max = 1 / (t_cq + t_logic + t_su - t_skew). Faster clocks require faster logic, faster flip-flops, or less logic between flip-flops (pipelining).

## Hold Time

The minimum time the data input must remain stable *after* the active clock edge.

**What happens if hold time is violated:** The flip-flop captures the wrong value — not the previous cycle's data (intended) but the current cycle's data (arriving too early from the source). This is a functional failure, not metastability.

**Hold time equation:**

```
t_cq + t_logic >= t_h + t_skew
```

Where t_h is the hold time of the destination flip-flop, and t_skew is the clock skew (positive if clock arrives earlier at the destination, which is the dangerous direction for hold).

**Critical insight:** The hold time constraint is independent of clock frequency. Slowing down the clock does not fix a hold violation — only adding delay to the data path or reducing clock skew does. This is why hold violations are harder to fix after fabrication than setup violations (which can always be fixed by reducing the clock frequency).

## Propagation Delay

The time from when an input changes to when the output settles to its final value.

**Gate delay:** Each logic gate has a propagation delay, typically 1-10 ns for discrete logic (74HC family at 5 V) or 10-100 ps for FPGA/ASIC internal logic. The total delay through a combinational path is the sum of individual gate delays along the path.

**Factors affecting propagation delay:**
- **Supply voltage** — Lower voltage means slower transitions and longer delay. A 74HC gate at 2 V is 3-4x slower than at 5 V
- **Temperature** — Higher temperature generally means slower logic (for CMOS). Timing analysis uses the "slow corner" (low voltage, high temperature) for setup analysis
- **Output loading** — More capacitance on the output means slower edges. Fan-out increases delay
- **Process variation** — Manufacturing tolerances cause device-to-device and chip-to-chip delay variation. Timing analysis must account for worst-case process

## Critical Path

The critical path is the longest delay path from any flip-flop output through combinational logic to any flip-flop input in the entire design. This path determines the maximum clock frequency.

**Optimizing the critical path:**
- **Logic restructuring** — Rearrange logic to reduce the number of gate levels. A tree structure is faster than a chain
- **Pipelining** — Insert flip-flops to break a long combinational path into shorter segments. Each segment runs in one clock cycle. This increases latency (more cycles from input to output) but allows a higher clock frequency
- **Retiming** — Move flip-flops backward or forward across combinational logic to balance path delays. This doesn't add latency if done correctly
- **Parallelism** — Use wider datapaths or duplicated logic to do more work per cycle at a lower clock frequency

## Static Timing Analysis (STA)

STA is the automated method for verifying timing in digital designs. It traces every possible path through the design, computes the worst-case delay, and checks whether setup and hold constraints are met.

**Key concepts:**
- **Arrival time** — When data arrives at a flip-flop input (computed from the source flip-flop, through combinational logic)
- **Required time** — When data must be stable (derived from the clock period and setup/hold requirements)
- **Slack** — Required time minus arrival time. Positive slack means the constraint is met. Negative slack means timing violation
- **Timing corners** — Combinations of process, voltage, and temperature (PVT) that represent worst-case conditions. Setup analysis uses the slow corner (slow process, low voltage, high temperature). Hold analysis uses the fast corner (fast process, high voltage, low temperature)

**Why both corners matter:** A path might meet setup timing at the slow corner but violate hold timing at the fast corner, or vice versa. Both must be checked.

## Timing Closure

Timing closure is the process of modifying a design until all timing constraints are met. In FPGA and ASIC design flows, this is often the most time-consuming part of the design cycle.

**Common timing closure strategies:**
- Fix the worst negative-slack paths first — they have the most impact
- Add pipeline stages to break long paths
- Reduce fan-out on critical signals (add buffers)
- Place critical logic closer together (floorplanning) to reduce routing delay
- Adjust clock skew deliberately (useful clock skew) to balance setup and hold margins
- Reduce logic complexity on the critical path (logic optimization)
- In FPGAs, use dedicated resources (DSP blocks, block RAM) instead of general-purpose logic for arithmetic and memory operations

**Diminishing returns:** As the clock frequency approaches the technology limit, each additional MHz of improvement requires disproportionately more effort. The last 5% of performance often takes as long as the first 95%.

## Multi-Cycle Paths and False Paths

Not all paths need to complete in one clock cycle.

**Multi-cycle paths:** If a block of combinational logic is known to take multiple clock cycles (because it is enabled only every N cycles), the timing constraint can be relaxed. Declaring a path as a multi-cycle path tells the STA tool to check it against N x t_clk instead of 1 x t_clk.

**False paths:** Paths that are physically present in the netlist but can never be exercised during operation (because of mutually exclusive control signals or mode settings). Declaring them as false paths removes them from timing analysis, which can resolve apparent violations and speed up analysis.

**Danger:** Incorrectly declaring a false path or multi-cycle path hides a real timing violation. These exceptions must be carefully reviewed.

## Gotchas

- **Hold violations cannot be fixed by slowing the clock** — This is the most important asymmetry in timing analysis. Setup violations disappear if the clock is slow enough. Hold violations are frequency-independent and must be fixed in the design
- **Datasheet timing is worst-case** — A flip-flop with 5 ns setup time on the datasheet might work with 3 ns in typical conditions. Designing to typical values is gambling — the design will fail in production when conditions hit the worst case
- **Temperature and voltage affect timing in opposite directions** — Slow corner (high temp, low voltage) is worst for setup. Fast corner (low temp, high voltage) is worst for hold. A design that works at room temperature on the bench may fail in a hot enclosure
- **IO timing is separate from internal timing** — Signals entering or leaving the chip have additional delays from IO buffers, board traces, and connector pins. These must be included in the timing analysis for interface logic
- **Timing constraints must be specified correctly** — In FPGA design, the constraints file (SDC or XDC format) tells the tools what clock frequencies, IO timing, and exceptions to check. Incorrect or incomplete constraints can make the tools produce a design that meets its constraints but fails in hardware
- **Metastability from timing violations is probabilistic** — A marginal setup violation doesn't always fail. It fails with some probability that increases as the margin decreases. This makes timing violations difficult to reproduce and debug — the design may work "most of the time" but fail under specific conditions
