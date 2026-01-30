---
title: "Characteristic Impedance"
weight: 20
---

# Characteristic Impedance

Characteristic impedance is probably the most important single concept in transmission line theory, and also one of the most misunderstood. It is not the resistance of the cable. It is not a property that depends on length. It is the ratio of voltage to current for a wave traveling in one direction along the line — a property determined entirely by the geometry of the conductor pair and the material between them. Every decision about termination, matching, and signal integrity flows from understanding what Z0 is and is not.

## What Z0 Actually Means

When a voltage step is launched into a transmission line, it propagates down the line as a wave, drawing current from the source. The ratio of that voltage to that current is the characteristic impedance:

**Z0 = V_wave / I_wave = sqrt(L / C)**

Where L is the inductance per unit length and C is the capacitance per unit length of the line. This ratio is set by geometry — the conductor dimensions, spacing, and the dielectric material between them. A wider trace over a closer ground plane has more capacitance and less inductance, giving a lower Z0. A narrower trace further from the ground plane gives a higher Z0.

The critical point: Z0 is the impedance that the source sees when launching a signal into the line, before any reflection from the far end arrives. If the line is infinitely long, or if it is terminated in a load equal to Z0, the source sees Z0 as a pure resistance forever. The energy is absorbed — either by the infinite line or by the matched load — and nothing comes back.

## Why 50, 75, and 100 Ohm?

The standard impedance values in use today are historical compromises:

**50 ohm** — The RF and microwave standard. For air-dielectric coax, 50 ohm is close to the geometric mean between the impedance that gives minimum loss (about 77 ohm) and the impedance that gives maximum power handling (about 30 ohm). It is a practical compromise for systems where both loss and power matter. Most RF test equipment, antennas, and interconnects are 50 ohm.

**75 ohm** — The minimum-loss impedance for common coax dielectrics (polyethylene). Used for cable TV, video distribution, and broadcast infrastructure where power levels are moderate but cable runs are long and loss must be minimized. The voltage-to-current ratio is higher, meaning lower current for a given power — which reduces resistive loss.

**100 ohm (differential)** — Common for differential digital signaling (USB, Ethernet, HDMI, PCIe). A 100 ohm differential pair is typically two 50 ohm single-ended traces. The differential impedance is approximately twice the single-ended impedance (exactly 2x for loosely-coupled pairs, somewhat less for tightly-coupled pairs).

There is nothing magical about these values. A 37 ohm or 93 ohm transmission line works perfectly well, as long as everything in the system is matched. The standards exist because you need agreement between equipment manufacturers, cable suppliers, and connector designers. Once an ecosystem is built around 50 ohm, everything connects to everything else without reflections.

## Geometry Determines Z0

For common transmission line types, Z0 is a function of physical dimensions:

**Microstrip** (trace over ground plane):
Z0 depends on trace width (w), dielectric thickness to ground plane (h), dielectric constant (epsilon_r), and trace thickness (t). Approximate formula for w/h > 1:

Z0 approximately = (120 pi / sqrt(epsilon_eff)) x (1 / (w/h + 1.393 + 0.667 x ln(w/h + 1.444)))

For FR4 (epsilon_r approximately 4.4):
| Trace width | Dielectric thickness | Approximate Z0 |
|------------|---------------------|-----------------|
| 0.3 mm (12 mil) | 0.2 mm (8 mil) | 50 ohm |
| 0.15 mm (6 mil) | 0.2 mm (8 mil) | 75 ohm |
| 0.45 mm (18 mil) | 0.2 mm (8 mil) | 37 ohm |

These values are approximate — exact Z0 depends on copper weight, solder mask, and etch tolerances. PCB fabricators provide impedance calculators and impedance-controlled processes that guarantee Z0 within ±10% (standard) or ±5% (tighter tolerance).

**Coaxial cable:**
Z0 = (138 / sqrt(epsilon_r)) x log10(D / d)

Where D is the inner diameter of the outer conductor and d is the outer diameter of the inner conductor. RG-58 (50 ohm) has d = 0.9 mm and D = 2.95 mm with polyethylene dielectric (epsilon_r = 2.25).

**Stripline** (trace between two ground planes):
Similar to microstrip but the trace is fully immersed in the dielectric, so the effective dielectric constant equals the actual dielectric constant. Stripline gives better impedance control and isolation but requires inner-layer routing.

## Z0 Is Real (Resistive) for Lossless Lines

This confuses many people at first: the characteristic impedance has units of ohms and behaves like a resistance in that energy is absorbed, but it is not a resistive loss. A signal traveling down a matched, lossless transmission line delivers all its energy to the matched load at the far end. None is dissipated in the line itself.

The "resistance" analogy works this way: the source sees Z0 as its load and delivers power into it. That power propagates as a wave and is delivered to the termination. If the termination equals Z0, all power is absorbed. If not, some reflects. But Z0 itself does not dissipate power — it governs the ratio of voltage to current in the traveling wave.

Real cables have loss (conductor resistance, dielectric loss), which is modeled separately from Z0. The loss causes signal attenuation but does not fundamentally change the concept of characteristic impedance.

## Common Misunderstandings

**"Z0 is the DC resistance of the cable."** No. A 50-foot length of RG-58 has a DC resistance of about 1.5 ohm (center conductor) plus 0.5 ohm (shield). Its characteristic impedance is 50 ohm. These are completely different quantities. DC resistance causes loss; characteristic impedance determines how waves propagate.

**"A longer cable has a different Z0."** No. Z0 is an intrinsic property of the cable's cross-section geometry and dielectric material. A 1-meter and 100-meter piece of the same cable have identical Z0. Length affects loss and delay, not characteristic impedance.

**"Z0 changes with frequency."** Mostly no. For an ideal lossless line, Z0 = sqrt(L/C) and is frequency-independent. Real cables have a slight frequency dependence because conductor loss and skin effect alter the effective L at different frequencies. But for practical purposes, the Z0 of a good cable or controlled-impedance trace is essentially constant over the operating bandwidth.

**"You need a special instrument to measure Z0."** A TDR (Time Domain Reflectometer) directly shows Z0 by launching a step and observing the voltage level on the line before reflections return. A VNA can also determine Z0 from S-parameter measurements. In a pinch, you can estimate Z0 from the capacitance per unit length (measured with an LCR meter on a short cable with the far end open) and the known velocity factor: Z0 = 1 / (v x C_per_length).

## Impedance in System Design

Designing an RF system means choosing an impedance and keeping everything matched to it:

- **Source output impedance** = Z0 (or matched through a network)
- **Transmission line** = Z0 (controlled by physical geometry)
- **Connectors** = Z0 (SMA, BNC, N-type are all designed for 50 ohm)
- **Load input impedance** = Z0 (or matched through a network)

Any deviation from Z0 at any point creates a [reflection]({{< relref "/docs/radio-rf/transmission-lines/reflections-standing-waves-and-vswr" >}}) that degrades performance. The severity depends on how large the mismatch is and the electrical length of the mismatched section.

In practice, nothing is perfectly matched. A connector might be 49.5 ohm instead of 50. A PCB trace might be 52 ohm due to etch tolerance. A cable might be 50.5 ohm. Each imperfection creates a small reflection, and the cumulative effect of many small reflections determines the overall system performance. This is why system-level specifications are given in terms of return loss (dB of reflected power) or VSWR rather than demanding exact impedance values.

## Gotchas

- **Solder mask changes microstrip impedance** — Solder mask adds a thin dielectric layer on top of the trace, increasing the effective dielectric constant and lowering Z0 by a few ohms. Impedance-controlled PCB processes account for this, but if you are hand-calculating, remember that the bare-copper formula will overestimate Z0.
- **Differential impedance is not simply twice single-ended** — For tightly-coupled differential pairs, the coupling between traces reduces the differential impedance below 2 x Z0_single. A pair of 55 ohm single-ended traces might have a 100 ohm differential impedance only if they are loosely coupled. Tight coupling might give 90 ohm differential.
- **Etch tolerance affects Z0 more than you expect** — A 0.3 mm trace (target 50 ohm) that etches to 0.27 mm (10% narrower) might measure 55 ohm. At RF, that 5 ohm difference produces measurable reflections. Specify impedance control in the PCB fab notes, not just trace width.
- **Connector choice must match the system impedance** — Mixing 50 ohm and 75 ohm connectors and cables creates a 6 dB return loss mismatch at every interface. BNC connectors come in both 50 and 75 ohm versions that are physically compatible but electrically mismatched.
- **Via transitions disrupt Z0** — A via through a PCB is not a transmission line with controlled Z0. It is a short, uncontrolled-impedance structure (typically 25-40 ohm for a standard via in FR4). At frequencies where the via is electrically significant, this discontinuity causes reflections. Back-drilled vias and via-in-pad designs minimize this effect.
