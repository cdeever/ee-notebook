---
title: "Metastability"
weight: 10
---

# Metastability

Metastability is a state where a flip-flop's output is neither a valid HIGH nor a valid LOW — it is stuck in between, at an intermediate voltage, for an indeterminate amount of time. This happens when the data input changes too close to the clock edge, violating setup or hold time. The flip-flop cannot decide which value to capture, and its output is undefined until the internal feedback loop resolves to one state or the other.

Metastability is not a manufacturing defect or a design flaw in the flip-flop — it is an inherent property of any bistable element. It cannot be eliminated, only managed.

## Why Metastability Happens

A flip-flop is a pair of cross-coupled inverters (or gates) that form a bistable circuit. When the clock captures data, the feedback loop must resolve to one of two stable states (0 or 1). If the data input is changing at the moment of capture:

- The internal nodes start at a value between the two stable states
- The positive feedback loop amplifies the small imbalance toward one state
- The resolution takes time — how much time depends on how close to the metastable balance point the initial state was

**Analogy:** A ball balanced on top of a hill. If nudged clearly to one side, it rolls quickly to the bottom. If nudged almost imperceptibly, it stays near the top for a long time before eventually falling to one side. The "nudge" is the data's value relative to the threshold at the clock edge. The "resolution time" is how long the ball takes to reach the bottom.

## What Metastability Looks Like

On an oscilloscope, a metastable flip-flop output:

- May sit at a mid-rail voltage (e.g., ~1.5 V on a 3.3 V supply) for an extended time
- May oscillate at high frequency as the internal feedback loop struggles to resolve
- Eventually resolves to a valid HIGH or LOW, but the time to resolution is unpredictable

Downstream logic that receives a metastable signal may:
- Interpret it as HIGH (if the metastable voltage is above the input threshold)
- Interpret it as LOW (if below)
- Interpret it differently at different inputs (if the voltage is in the uncertain region between V_IL and V_IH)
- Oscillate or latch up if the input is in the linear region of the downstream gate

The last case is the most dangerous — metastability can propagate through a chain of logic, causing widespread corruption.

## Metastability Resolution Time

The probability that a flip-flop remains metastable decreases exponentially with time. Given a time window t_r after the clock edge:

```
P(metastable after t_r) ~ T_w / (T_clk) x e^(-t_r / tau)
```

Where:
- T_w is the vulnerability window (related to the setup + hold time)
- T_clk is the clock period
- tau is the resolution time constant (a property of the flip-flop technology — faster processes have smaller tau)

**Key insight:** The probability drops exponentially. Each additional nanosecond of resolution time reduces the probability by a large factor (typically 10x to 1000x, depending on the process). This is why synchronizers work — a two-stage synchronizer gives one full clock period for resolution, which is usually enough to reduce the failure probability to negligibly small values.

## MTBF (Mean Time Between Failures)

MTBF quantifies the reliability of a synchronization scheme. It is the average time between metastability-induced failures.

```
MTBF = 1 / (f_clk x f_data x T_w x e^(-t_r / tau))
```

Where:
- f_clk = destination clock frequency
- f_data = rate of data transitions on the asynchronous input
- T_w = flip-flop's metastability vulnerability window
- t_r = resolution time available (clock period minus setup time of the next stage)
- tau = flip-flop's resolution time constant

**Practical MTBF targets:**
- Consumer electronics: > 100 years
- Industrial systems: > 1000 years
- Aerospace/military: > 10,000 years or more

**Example calculation intuition:** For a modern 28 nm FPGA flip-flop with tau ≈ 10 ps and T_w ≈ 30 ps, a two-stage synchronizer at 200 MHz (5 ns clock period, ~4 ns resolution time) with a 50 MHz data rate achieves MTBF >> 10^15 years. This is effectively zero risk.

At 1 GHz (1 ns period, < 1 ns resolution time), the same calculation might yield MTBF of only years or months — requiring a three-stage synchronizer.

## The Two-Flip-Flop Synchronizer

The standard defense against metastability. Described in detail in [Clock Domain Crossing]({{< relref "/docs/digital/timing-and-synchronization/clock-domain-crossing" >}}).

**Why it works:** The first flip-flop may go metastable, but it has one full clock period to resolve before the second flip-flop samples it. The exponential decay of metastability probability means that one clock period of resolution time typically reduces the failure probability to negligible levels.

**Why two stages, not one:** A single synchronizer flip-flop has only the time from the clock edge to when downstream logic reads the output — which can be very short if the output feeds combinational logic with tight timing. The second flip-flop guarantees a full clock period of resolution time.

**Why not always three stages:** Each stage adds one clock cycle of latency. For most applications and modern process nodes, two stages provide sufficient MTBF. Three stages are used when clock frequencies are very high (GHz+), resolution time per stage is very short, or extremely high reliability is required.

## Metastability Beyond CDC

While clock domain crossing is the most common context for metastability, it can occur anywhere a signal violates setup/hold timing:

- **Asynchronous inputs** — Buttons, sensors, external signals that are not synchronized to any clock
- **Asynchronous reset release** — Releasing a reset asynchronously can cause metastability if the release happens near a clock edge. See [Latches & Flip-Flops]({{< relref "/docs/digital/sequential-logic/latches-and-flip-flops" >}}) for reset synchronization
- **Race conditions in asynchronous logic** — Any path where signals arrive at a flip-flop with uncertain timing relative to the clock
- **PLL loss of lock** — If a PLL loses lock and the clock frequency suddenly changes, flip-flops throughout the system may experience timing violations

## Designing for Metastability

**Standard practices:**
1. Synchronize every signal that crosses a clock domain boundary. No exceptions
2. Synchronize every asynchronous external input before using it in synchronous logic
3. Use the vendor's recommended synchronizer cells — they may have optimized layouts with reduced tau
4. Verify MTBF calculations for the target clock frequencies and reliability requirements
5. Run CDC analysis tools to find unsynchronized crossings automatically

**What doesn't help:**
- Adding more combinational logic after a metastable output — the logic doesn't "filter" metastability; it can propagate or amplify it
- Using Schmitt trigger inputs — Schmitt triggers have hysteresis that helps with noisy signals, but they do not prevent metastability in flip-flops
- Using "special" flip-flops — All CMOS flip-flops have metastability. Some have better (smaller) tau, but none are immune

## Gotchas

- **Metastability is probabilistic, not deterministic** — A design with a metastability MTBF of 1 year might work for months, then fail multiple times in a week. Testing cannot prove the absence of metastability problems — only MTBF calculation and CDC analysis can
- **Higher clock frequencies increase metastability risk** — Both by increasing the number of opportunities per second (more clock edges) and by reducing the resolution time available per stage. Doubling the clock frequency can reduce MTBF by orders of magnitude
- **Temperature affects metastability** — Higher temperatures slow transistor switching, increasing the resolution time constant tau. A design with adequate MTBF at 25 C may have marginal MTBF at 85 C. Always calculate MTBF at the worst-case operating temperature
- **Simulation doesn't show metastability** — RTL simulation models flip-flops as perfect digital elements. A metastable condition in simulation produces either 0, 1, or X (unknown) — it doesn't model the analog resolution process. Gate-level simulation with back-annotated timing can detect setup/hold violations but still doesn't model the resolution behavior accurately
- **Metastability is not the same as a wrong value** — A flip-flop that captures the wrong value (because it sampled during a transition but resolved quickly) is not metastable — it simply captured the old or new value. Metastability is the prolonged indeterminate state. Both are problems, but they require different analysis
