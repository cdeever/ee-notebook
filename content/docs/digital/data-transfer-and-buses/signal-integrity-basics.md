---
title: "Signal Integrity Basics"
weight: 30
---

# Signal Integrity Basics

At low speeds, a digital signal is just a voltage that's either HIGH or LOW, and a PCB trace is just a wire. At higher speeds, the wire becomes a transmission line, the signal edge becomes an electromagnetic wave, and reflections, crosstalk, and attenuation determine whether the receiver sees a clean logic level or an eye-diagram disaster.

Signal integrity (SI) is the discipline of ensuring that digital signals arrive at their destination with enough amplitude, timing accuracy, and cleanliness to be correctly interpreted. From the digital designer's perspective, SI is where the analog world reasserts itself — and where designs that work at 10 MHz fail at 100 MHz.

## When Does Signal Integrity Matter?

**Rule of thumb:** When the signal's rise time is shorter than twice the propagation delay of the trace, the trace must be treated as a transmission line.

- PCB trace propagation: roughly 6 inches per nanosecond (150 mm/ns) for outer layers, slightly slower for inner layers
- A 1 ns rise time signal on a 3-inch trace: propagation delay ≈ 0.5 ns. Since 1 ns > 2 x 0.5 ns, this is borderline
- A 0.5 ns rise time signal on the same trace: now 0.5 ns < 2 x 0.5 ns — transmission line effects dominate

**Practical thresholds:**
- Below ~25 MHz with slow-edge logic (74HC at 3.3 V): usually fine with no SI considerations
- 25-100 MHz: careful routing matters; termination may be needed
- Above 100 MHz: transmission line design is mandatory
- GHz+ (DDR, PCIe, USB 3.x): full SI analysis, controlled impedance, differential pairs, equalization

**Key insight:** It's the rise time, not the clock frequency, that determines when SI matters. A 10 MHz clock with 1 ns edges has the same SI challenges as a 100 MHz clock with 1 ns edges. Fast logic families (74AC, 74AUC) produce fast edges regardless of clock speed.

## Transmission Lines

A PCB trace over a ground plane is a transmission line with a characteristic impedance determined by the trace geometry and dielectric material.

**Characteristic impedance (Z0):** Typically 50 ohm for single-ended and 100 ohm for differential pairs. Depends on trace width, distance to ground plane, dielectric constant, and copper thickness. PCB fabricators specify impedance-controlled stackups.

**What happens when Z0 is not matched:**

When a signal traveling along a trace encounters an impedance discontinuity (a connector, a via, a stub, or an unterminated end), part of the signal reflects back. The reflection coefficient is:

```
rho = (Z_load - Z0) / (Z_load + Z0)
```

- Open end (Z_load = infinity): rho = +1 (full positive reflection, voltage doubles at the end)
- Short end (Z_load = 0): rho = -1 (full negative reflection, voltage goes to zero)
- Matched termination (Z_load = Z0): rho = 0 (no reflection, all energy absorbed)

## Termination

Termination absorbs the signal energy at the end of the transmission line, preventing reflections.

### Series Termination (Source Termination)

A resistor at the driver output, sized so that the driver's output impedance plus the series resistor equals Z0.

**How it works:** The driver launches a half-amplitude signal. At the unterminated far end, the signal reflects and doubles back. When the reflection reaches the source, the series resistor absorbs it. After one round-trip, the signal is at full amplitude everywhere.

**Advantages:**
- Low power (only one resistor, no DC current through it)
- Simple to implement
- Effective for point-to-point connections

**Disadvantages:**
- The signal at the midpoint of the trace is at half amplitude during the first propagation delay. Multi-drop buses cannot use source termination because intermediate receivers see the half-amplitude signal

### Parallel Termination

A resistor at the receiver end, connected to ground (or a bias voltage), equal to Z0.

**How it works:** The termination resistor absorbs the incoming signal energy, preventing reflection. The signal reaches full amplitude at the receiver immediately.

**Advantages:**
- Full-amplitude signal at the receiver from the start
- Works for multi-drop buses (all receivers see the correct signal)

**Disadvantages:**
- Continuous DC current when the driver outputs HIGH — a 50 ohm termination at 3.3 V draws 66 mA. This is significant for power-sensitive designs
- Requires the driver to deliver enough current to drive the termination resistance in parallel with the input impedance

### Thevenin Termination

Two resistors at the receiver end — one to VCC, one to GND — forming a voltage divider that equals Z0 and biases the line to a mid-level voltage. Lower DC current than single-resistor parallel termination but uses more components.

### AC Termination

A resistor and capacitor in series at the receiver end. The capacitor blocks DC current (saving power) while the resistor terminates high-frequency signal energy. The RC time constant must be much longer than the bit period.

## Reflections in Practice

Unterminated signals exhibit ringing — the signal overshoots and undershoots as reflections bounce back and forth, gradually dying out. On an oscilloscope, this appears as damped oscillation after each edge.

**Problems caused by reflections:**
- **Overshoot/undershoot** — Exceeding the input voltage rating can trigger ESD protection diodes or damage the receiver. Overshoot also causes substrate injection in CMOS, which can corrupt nearby logic
- **False triggering** — If a reflection crosses the input threshold, the receiver sees an extra transition. On a clock line, this causes double-clocking. On a data line, it corrupts data
- **Increased jitter** — Reflections that don't quite cross the threshold still shift the apparent crossing point of the signal, increasing timing uncertainty

## Crosstalk

Crosstalk is the coupling of signal energy from one trace (the aggressor) to an adjacent trace (the victim). The coupling is both capacitive (electric field) and inductive (magnetic field).

**Near-end crosstalk (NEXT):** Noise appears at the end of the victim trace nearest the aggressor driver. Capacitive and inductive coupling add constructively.

**Far-end crosstalk (FEXT):** Noise appears at the far end. In stripline (trace between two ground planes), capacitive and inductive coupling cancel and FEXT is near zero. In microstrip (trace on the outer layer), they don't cancel, and FEXT is significant.

**Reducing crosstalk:**
- Increase spacing between traces. The 3W rule (space traces by 3 times the trace width) reduces crosstalk to roughly 5% of the aggressor signal
- Use ground planes — traces over a continuous ground plane have better field containment
- Route sensitive signals on inner layers (stripline) for zero FEXT
- Minimize parallel run length between aggressors and victims

## Edge Rate and Bandwidth

A signal's spectral content is determined by its edge rate, not its repetition frequency. The bandwidth of a digital signal is approximately:

```
BW ≈ 0.35 / t_rise
```

A signal with 1 ns rise time has frequency content up to about 350 MHz, regardless of whether it's a 1 MHz or 100 MHz clock. This means:

- Slow logic at high frequencies may not need SI attention
- Fast logic at low frequencies absolutely does
- A 10 MHz 74AUC clock (0.5 ns edges) needs more SI care than a 50 MHz 74HC clock (5 ns edges)

## Controlled Impedance Design

For designs requiring SI discipline:

1. **Choose a controlled-impedance PCB stackup** — The fabricator specifies layer thicknesses and dielectric constants. Trace widths for target impedances are calculated from the stackup
2. **Route critical signals on impedance-controlled layers** — Typically inner layers (stripline) for best shielding, or outer layers (microstrip) when probing is needed
3. **Maintain continuous reference planes** — Every trace needs a solid ground or power plane beneath it. Gaps, splits, or vias that break the reference plane cause impedance discontinuities
4. **Length-match differential pairs** — The two traces of a differential pair must be matched in length and symmetrically routed. Skew between them converts differential signal to common mode
5. **Minimize vias, stubs, and discontinuities** — Each via adds ~0.5-1 nH of inductance and ~0.3-0.5 pF of capacitance, creating a localized impedance bump. Back-drilling (removing unused via stubs) is standard at multi-gigabit speeds

## Gotchas

- **"It works on my bench" is not SI validation** — A signal that looks clean at room temperature, nominal voltage, and one board sample may fail at temperature extremes, voltage corners, or on a different PCB batch with different dielectric thickness. Margin analysis across corners is the only way to guarantee reliability
- **Probe loading affects the measurement** — A 10x passive oscilloscope probe adds ~10 pF to the node. On a high-impedance, high-speed signal, this changes the signal. Active probes (< 1 pF) are needed for accurate SI measurement
- **Vias are impedance discontinuities** — Every signal via introduces a brief impedance change. For signals below 1 GHz, this is usually negligible. Above 1 GHz, via design (diameter, pad size, antipad, back-drill) becomes a significant SI concern
- **Return path matters as much as signal path** — Every signal current has a return current flowing in the reference plane directly beneath the trace. If the reference plane has a gap, slot, or break, the return current detours around it, increasing loop area and radiation. Never route high-speed signals across plane splits
- **Differential pairs are not just "two wires"** — Differential impedance depends on the coupling between the two traces (spacing), not just individual trace impedance. Loosely coupled pairs have differential impedance close to 2x single-ended. Tightly coupled pairs have lower differential impedance. The PCB stackup must specify both single-ended and differential impedance
- **Edge rate is set by the driver, not the clock frequency** — A 74AUC buffer produces ~0.5 ns edges regardless of whether the signal is toggling at 1 MHz or 100 MHz. The SI challenges are the same. Don't use faster logic families than necessary
