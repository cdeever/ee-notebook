---
title: "Latches & Flip-Flops"
weight: 10
---

# Latches & Flip-Flops

The fundamental memory elements in digital circuits. A latch or flip-flop stores one bit of information — it has two stable states (0 and 1) and remains in its current state until explicitly changed. The difference between a latch and a flip-flop is *when* the stored value can change: latches are level-sensitive (transparent while the control signal is active), flip-flops are edge-triggered (capture data only at the clock edge).

This distinction is the foundation of synchronous design. Edge-triggered flip-flops give designers a clean model: data is captured once per clock cycle, at a well-defined moment. Latches, by contrast, are transparent for the entire duration of the enable signal, which makes timing analysis harder and race conditions more likely.

## SR Latch

The simplest memory element: two cross-coupled gates (NAND or NOR) with Set and Reset inputs.

**NOR-based SR latch:**
- S=1, R=0: Output goes to 1 (Set)
- S=0, R=1: Output goes to 0 (Reset)
- S=0, R=0: Output holds its current state (Memory)
- S=1, R=1: Forbidden — both outputs go to 0, and the final state when both inputs return to 0 is indeterminate (depends on which input goes LOW first)

The forbidden state is the SR latch's fundamental problem. It means the designer must guarantee that S and R are never both active simultaneously — a constraint that is easy to violate in asynchronous circuits.

**Practical use:** SR latches appear in debouncing circuits (a mechanical switch connected to S and R inputs of cross-coupled NAND gates produces a clean, bounce-free output) and as the core element inside more complex flip-flops.

## D Latch

Eliminates the forbidden state by using a single data input (D) and an enable (or gate) signal.

- When Enable is HIGH: Q follows D (the latch is "transparent")
- When Enable is LOW: Q holds its last value (the latch is "opaque")

The D latch is built from an SR latch with an inverter: D connects to S and D-inverted connects to R, so S and R can never be simultaneously active.

**The transparency problem:** While the enable is HIGH, the output continuously tracks the input. Any noise, glitch, or unintended change on D during the transparent period passes through to Q. This makes level-sensitive latches tricky in synchronous designs — the data must be stable for the *entire* enable-HIGH period, not just at a single moment.

## D Flip-Flop

The workhorse of synchronous digital design. Captures the D input at the rising (or falling) clock edge and holds it until the next active edge.

**Edge-triggered behavior:** The output only changes at the clock edge. Between edges, the output is stable regardless of what the input does. This gives designers a simple contract: get the data to the D input before the clock edge, and it will be captured cleanly.

**Internal structure:** A D flip-flop is typically two D latches in series — the first (master) is transparent when the clock is LOW, and the second (slave) is transparent when the clock is HIGH. At the rising edge, the master closes (capturing data) and the slave opens (passing the captured data to the output). This master-slave arrangement ensures that the output changes only at the edge.

**Timing parameters:**
- **Setup time (t_su):** D must be stable this long *before* the clock edge. Violating setup time risks metastability
- **Hold time (t_h):** D must remain stable this long *after* the clock edge. Violating hold time means the flip-flop might capture the wrong value
- **Clock-to-Q delay (t_cq):** Time from the clock edge to the output changing. This is the flip-flop's response time

These three parameters define the timing constraints for every synchronous path in a digital system. See [Timing Constraints]({{< relref "/docs/digital/timing-and-synchronization/timing-constraints" >}}).

## JK Flip-Flop

Like an SR flip-flop, but the "forbidden" state (J=1, K=1) is defined: it toggles the output.

| J | K | Q (next) |
|---|---|----------|
| 0 | 0 | Q (hold) |
| 0 | 1 | 0 (reset) |
| 1 | 0 | 1 (set) |
| 1 | 1 | Q' (toggle) |

The JK flip-flop was historically important as a versatile building block — by tying J and K together, it becomes a T flip-flop. With separate J and K, it can set, reset, hold, or toggle. In modern designs, D flip-flops have largely replaced JK flip-flops because they are simpler, faster, and synthesis tools prefer them.

## T Flip-Flop

A toggle flip-flop: when T=1, the output toggles on each clock edge. When T=0, the output holds.

T flip-flops are the natural building block for counters — a chain of T flip-flops with T=1 produces a binary counter. Each stage toggles at half the frequency of the previous stage, dividing the clock by 2 at each step.

## Asynchronous Set and Reset

Most practical flip-flops have asynchronous preset (set) and clear (reset) inputs that override the clocked behavior. These are typically active-LOW.

**Common use:** System reset. An asynchronous reset forces all flip-flops to a known state at power-up, regardless of the clock. Without reset, flip-flops power up in an unpredictable state.

**Caution:** Asynchronous reset release must be synchronized to the clock. If the reset is released near a clock edge, some flip-flops may see the reset and others may not, creating an inconsistent state. The standard solution is a reset synchronizer — the asynchronous reset is captured by two flip-flops in series before being distributed as a synchronous reset. See [Clock Domain Crossing]({{< relref "/docs/digital/timing-and-synchronization/clock-domain-crossing" >}}) for the general principle.

## Edge-Triggered vs Level-Sensitive: Why It Matters

**Level-sensitive latches:**
- Simpler, faster (less internal delay), and use fewer transistors
- Used in ASIC designs for time-borrowing (a latch can borrow time from an adjacent pipeline stage with excess slack)
- Harder to analyze for timing — the data must be stable for the entire transparent period
- Susceptible to noise and glitches during the transparent window

**Edge-triggered flip-flops:**
- The standard element in synchronous design
- Clean timing model — data is sampled at one instant
- Easier to analyze, verify, and debug
- Used almost exclusively in FPGA and standard digital design

In practice, FPGA designers use D flip-flops almost exclusively. ASIC designers sometimes use latches for performance optimization, but this is an advanced technique with significant verification complexity.

## Gotchas

- **Metastability is real** — Violating setup or hold time doesn't just give a wrong answer — it can put the flip-flop into a metastable state where the output hovers between 0 and 1 for an indeterminate time. See [Metastability]({{< relref "/docs/digital/when-digital-breaks-down/metastability" >}})
- **Clock skew between flip-flops causes hold violations** — If the clock arrives at a downstream flip-flop before an upstream one, the downstream flip-flop might capture the old data before the upstream one has had time to change. This is a hold time violation, and it's the timing constraint that cannot be fixed by slowing the clock
- **Power-up state is not guaranteed** — Flip-flops power up in a random state unless explicitly reset. Designs that assume a specific initial state without a reset mechanism will fail intermittently
- **Asynchronous inputs are not debounced** — Mechanical switches connected to set/reset inputs will bounce, producing multiple triggers. Always debounce mechanical inputs before connecting to flip-flop control inputs
- **Latch inference in HDL** — In hardware description languages, an incomplete if/else statement (one that doesn't cover all cases) infers a latch rather than a flip-flop. This is almost always a bug, not intentional. Synthesis tools usually warn about inferred latches
