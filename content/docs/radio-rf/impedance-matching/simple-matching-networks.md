---
title: "Simple Matching Networks"
weight: 30
---

# Simple Matching Networks

When two parts of an RF system have different impedances, you need something between them to transform one impedance into the other. The simplest approach uses reactive components — inductors and capacitors — arranged in networks that shift the impedance without dissipating power (at least in theory). The L-network, pi-network, and T-network are the workhorses here, and understanding how they work makes everything from antenna matching to filter design more intuitive.

## The L-Network

The L-network is the simplest matching network: just two reactive components, one in series and one in shunt. It's called an "L" because of the schematic shape. Despite its simplicity, it can match any two resistive impedances (as long as one is higher than the other).

The design principle is based on Q (quality factor) as an impedance transformation tool. The series element adds reactance that, combined with the lower resistance, creates a higher effective impedance. The shunt element cancels the unwanted reactance, leaving only the transformed resistance.

**Step-by-step L-network design (resistive impedances):**

1. Identify which impedance is higher (R_high) and which is lower (R_low)
2. Calculate the required Q: Q = sqrt(R_high / R_low - 1)
3. Series element reactance: X_series = Q * R_low
4. Shunt element reactance: X_shunt = R_high / Q
5. Choose inductor or capacitor for each element (two valid configurations exist)

**Example: Match 50 ohms to 200 ohms at 144 MHz**

- Q = sqrt(200/50 - 1) = sqrt(3) = 1.73
- X_series = 1.73 * 50 = 86.6 ohms
- X_shunt = 200 / 1.73 = 115.5 ohms

For a series inductor / shunt capacitor configuration:
- L_series = X_series / (2 * pi * f) = 86.6 / (2 * pi * 144e6) = 95.7 nH
- C_shunt = 1 / (2 * pi * f * X_shunt) = 1 / (2 * pi * 144e6 * 115.5) = 9.6 pF

For the alternative (series capacitor / shunt inductor):
- C_series = 1 / (2 * pi * f * X_series) = 12.8 pF
- L_shunt = X_shunt / (2 * pi * f) = 127.7 nH

Both configurations give a perfect match at 144 MHz, but they differ in their DC blocking behavior (the capacitor version blocks DC) and their frequency response above and below the design frequency. The inductor-series version is a low-pass topology (attenuates harmonics), which is often preferred in transmitter applications.

## The Pi-Network

The pi-network uses three components: two shunt elements and one series element, forming a shape like the Greek letter pi. It can be thought of as two L-networks back-to-back, which gives it an extra degree of freedom: you can choose the Q (bandwidth) independently of the impedance transformation ratio.

This is significant because the L-network's Q is fixed once you pick the impedances. A pi-network lets you design for a specific Q — higher Q for narrower bandwidth and more selectivity, lower Q for broader bandwidth.

Pi-networks are common in vacuum tube transmitter output stages (the classic "pi-tank"), where they simultaneously match the high plate impedance to a 50-ohm load and filter out harmonics. Component values tend to be practical at HF frequencies — inductors in the microhenry range and capacitors in the tens to hundreds of picofarads.

**Pi-network design approach:**

1. Choose a loaded Q (typically 5-15 for transmitter output)
2. Calculate intermediate impedance: R_virtual = R_low * (Q^2 + 1) — but this virtual resistance must be less than R_high
3. Design two L-sections transforming from each side to the virtual resistance
4. Combine the two shunt elements at the junction (they add in parallel)

## The T-Network

The T-network is the topological dual of the pi: two series elements with one shunt element between them, forming a T shape. Like the pi, it offers independent control of Q and transformation ratio.

T-networks are less common in transmitter applications because they're a high-pass topology in their basic form, which doesn't help with harmonic suppression. However, they're used in antenna tuners and some matching situations where the impedances favor the T configuration.

**Comparing network topologies:**

| Feature | L-Network | Pi-Network | T-Network |
|---|---|---|---|
| Components | 2 | 3 | 3 |
| Independent Q control | No | Yes | Yes |
| Typical topology | Low-pass or high-pass | Low-pass | High-pass |
| Harmonic suppression | Moderate (low-pass version) | Good | Poor |
| Common application | Simple interstage matching | Tube PA output, filters | Antenna tuners |
| Design complexity | Simple | Moderate | Moderate |
| Bandwidth | Fixed by impedance ratio | Selectable | Selectable |

## Practical Component Considerations

Real inductors and capacitors aren't ideal. Every real component has parasitic elements that limit its usefulness in matching networks:

**Inductor Q factor.** A real inductor has winding resistance, which dissipates power. The Q of the inductor (not to be confused with the network Q) determines the insertion loss. An air-core inductor might have Q of 100-300 at HF. A ferrite-core inductor might have Q of 50-100. A chip inductor at UHF might have Q of 20-40. Low-Q inductors in a matching network eat your signal power as heat.

**Capacitor self-resonance.** Every capacitor has parasitic inductance from its leads and plates. Above the self-resonant frequency (SRF), a capacitor acts as an inductor. A typical leaded ceramic capacitor might have an SRF of 100-500 MHz. A 0402 chip capacitor might be usable to several GHz. Always check that your capacitor is operating well below its SRF.

**Standard values.** You can't buy a 9.6 pF capacitor. The nearest standard E24 values are 8.2 pF and 10 pF. Either will shift the match slightly off the design frequency. In practice, you might use a fixed capacitor close to the calculated value plus a small trimmer for fine adjustment.

**Component values at common frequencies:**

| Match (50 to X ohms) | Frequency | L_series | C_shunt | Notes |
|---|---|---|---|---|
| 50 to 75 | 145 MHz | 54.8 nH | 14.7 pF | Coax mismatch |
| 50 to 200 | 145 MHz | 95.7 nH | 9.6 pF | Typical antenna mismatch |
| 50 to 200 | 435 MHz | 31.9 nH | 3.2 pF | UHF band, smaller values |
| 50 to 200 | 2.4 GHz | 5.7 nH | 0.58 pF | Sub-pF capacitors needed |
| 50 to 300 | 7 MHz | 567 nH | 79.7 pF | HF band, larger values |

The trend is clear: higher frequencies require smaller component values, which eventually become impractical for lumped components. Above a few GHz, matching is typically done with transmission line stubs or distributed elements rather than discrete L's and C's.

## Choosing a Topology

For a single-frequency match between two known resistive impedances, the L-network is usually the right choice. It uses the fewest components, has the lowest loss (fewer components means fewer parasitic losses), and is straightforward to design.

Use a pi or T-network when you need to control bandwidth independently of the impedance ratio, when you want harmonic filtering as part of the match, or when the impedance ratio is extreme (cascading two L-sections can handle a wider range more gracefully).

For complex impedances (with a reactive component), you first need to absorb or resonate out the reactive part, then transform the resistive remainder. The Smith chart approach covered in [Smith Chart Intuition]({{< relref "/docs/radio-rf/impedance-matching/smith-chart-intuition" >}}) makes this much more visual and intuitive than purely algebraic methods.

## Gotchas

- **An L-network's Q is fixed** — You can't independently set the bandwidth. If the impedance ratio requires Q = 5, that's what you get. If you need different bandwidth, use a pi or T.
- **Two L-network solutions always exist** — For any impedance pair, you can put the series element on either side. One gives low-pass behavior, the other high-pass. Choose based on whether you want harmonic suppression (low-pass) or DC blocking (capacitor in series).
- **Component parasitics dominate at UHF and above** — A 5 nH inductor might just be a short trace on a PCB. A 0.5 pF capacitor might be smaller than the pad capacitance. Matching at microwave frequencies is a different game from HF matching.
- **Insertion loss comes from component Q, not network Q** — A high-Q matching network with low-Q components is lossy. A low-Q matching network with high-Q components is efficient. The network Q sets bandwidth; the component Q sets loss.
- **Don't forget to verify with a VNA** — Calculated values get you close, but parasitic capacitance from the PCB layout, lead inductance, and coupling between components shift the actual match. Always measure and tweak on the bench.
- **Temperature changes component values** — Inductors with ferrite cores can drift significantly with temperature. NPO/C0G capacitors are stable; X7R and Y5V are not. Use stable dielectrics in matching networks.
