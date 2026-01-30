---
title: "Via Placement & Stitching"
weight: 40
---

# Via Placement & Stitching

Vias are the vertical connections in a PCB — metal-plated holes that carry signals and ground between layers. At DC, a via is just a connection. At RF, a via is an inductor, and its inductance matters. A standard PCB via has roughly 0.5-1 nH of inductance, which sounds negligible until you calculate its impedance at GHz frequencies: 1 nH at 1 GHz is 6.3 ohms, and at 5 GHz it is 31 ohms. That is enough to disrupt impedance matching, detune filters, and compromise ground connections.

## Via Inductance

The inductance of a via depends primarily on its length (the board thickness it passes through) and its diameter. A rough estimate for a through-hole via:

**L (nH) approximately equal to 5.08 * h * (ln(4h/d) + 1)**

Where h is the via height in inches and d is the via diameter in inches. For a typical via (10 mil drill, 62 mil board thickness), this gives approximately 0.7-1.0 nH.

| Via Type | Drill Size | Board Thickness | Approximate L |
|----------|-----------|----------------|---------------|
| Standard through-hole | 10 mil (0.25 mm) | 62 mil (1.6 mm) | 0.7-1.0 nH |
| Standard through-hole | 12 mil (0.3 mm) | 62 mil (1.6 mm) | 0.6-0.9 nH |
| Microvia (laser drilled) | 4 mil (0.1 mm) | 4 mil (0.1 mm) | 0.05-0.1 nH |
| Blind via | 10 mil (0.25 mm) | 10 mil (0.25 mm) | 0.1-0.2 nH |

The key insight: via inductance is proportional to via length. Shorter vias (blind vias, microvias) have dramatically less inductance. For high-frequency designs above 5-10 GHz, microvias or blind vias are often necessary for acceptable performance.

## Vias and Bypass Capacitors

A bypass capacitor connected to a ground plane through a via forms a series resonant circuit: the capacitor's own series inductance plus the via inductance, in series with the capacitance. The series resonant frequency determines where the bypass is most effective.

For a 100 pF capacitor (approximately 0.5 nH internal ESL) with a 0.8 nH via to ground, the total series inductance is about 1.3 nH. The series resonant frequency is:

**f = 1 / (2 * pi * sqrt(L * C)) = approximately 440 MHz**

At that frequency, the bypass capacitor presents its lowest impedance. Well below that frequency, it acts as a capacitor. Above it, the inductance dominates and the "capacitor" behaves as an inductor.

If you need effective bypassing at 2.4 GHz, a 100 pF cap with a single standard via will not do the job — it resonated at 440 MHz and is inductive at 2.4 GHz. You need either a smaller capacitor (which resonates at a higher frequency), a shorter via (microvia or blind via), or multiple vias in parallel to reduce the total inductance.

## Multiple Vias in Parallel

Placing multiple vias in parallel reduces the total inductance. Two vias in parallel have roughly half the inductance of one (slightly more than half, because of mutual inductance between the vias). Three vias give about one-third the inductance.

| Number of Vias | Approximate Total L (% of single via) |
|----------------|----------------------------------------|
| 1 | 100% |
| 2 | 55-60% |
| 3 | 38-42% |
| 4 | 30-35% |

The exact reduction depends on via spacing. Vias spaced farther apart have less mutual inductance, so parallel reduction is more effective. As a rule of thumb, space parallel vias at least two diameters apart for best inductance reduction.

For critical bypass capacitors at GHz frequencies, placing two or three vias under the ground pad is a standard technique.

## Ground Stitching

Ground stitching is the practice of placing regular arrays of vias connecting ground planes on different layers throughout the PCB. This serves several purposes:

**Preventing cavity resonances.** Two parallel ground planes separated by dielectric form a parallel-plate resonator. At certain frequencies, this cavity can resonate, creating high-impedance spots on the ground plane. Stitching vias short-circuit these resonances by connecting the planes at intervals shorter than the resonant wavelength.

**Providing return current paths.** When a signal trace changes layers, the return current must also change layers. Nearby ground stitching vias provide a low-inductance path for this transition.

**Shielding.** A continuous row of stitching vias between two circuit sections acts like a metal wall, reducing electromagnetic coupling between them.

**Reducing ground impedance.** Multiple connections between ground planes lower the overall impedance of the ground structure at high frequencies.

## Via Spacing for Shielding

For a via fence to be effective as a shield, the spacing between vias must be less than lambda/20 at the highest frequency of concern. This ensures the gaps between vias are electrically small and do not allow significant leakage.

| Frequency | Lambda in FR4 (approx.) | Lambda/20 Max Spacing |
|-----------|------------------------|-----------------------|
| 1 GHz | 143 mm | 7.1 mm |
| 2.4 GHz | 60 mm | 3.0 mm |
| 5.8 GHz | 25 mm | 1.2 mm |
| 10 GHz | 14 mm | 0.7 mm |
| 24 GHz | 6 mm | 0.3 mm |

At 2.4 GHz, a via fence needs vias every 3 mm or closer. At 10 GHz, you need vias every 0.7 mm — which starts to push PCB fabrication limits for standard processes. At millimeter-wave frequencies, via fences may need to be supplemented with continuous copper walls (embedded in the PCB stackup) or tightly packed via arrays.

## Layer Transitions for RF Signals

When an RF signal trace must transition between layers, the via creates an impedance discontinuity. Minimizing this discontinuity requires careful via design:

**Back-to-back ground vias.** Place at least two ground vias immediately adjacent to the signal via, one on each side. These provide a local return current path and help maintain the transmission line impedance through the transition.

**Antipads.** The clearance hole in the ground plane around the signal via (the antipad) must be sized to maintain approximately 50 ohms. Too large an antipad raises impedance; too small increases capacitance. Typical antipad diameters are 20-30 mil for a 10-mil via drill.

**Via stubs.** A through-hole via used for a transition between Layer 1 and Layer 2 has a stub extending from Layer 2 to the bottom of the board. This stub is an open-ended transmission line that creates a resonance at the frequency where the stub length is a quarter wavelength. For a 62-mil board using Layer 1 to Layer 2 (10-mil transition), the stub is about 52 mil long — resonating around 18 GHz in FR4. Below 10 GHz, the stub effect is usually tolerable. Above 10 GHz, back-drilling (removing the unused via stub) is necessary.

**Pad-less vias.** Removing the landing pads on unused layers reduces the capacitive loading of the via, improving the impedance match through the transition.

## Gotchas

- **A single via to ground is not "grounded" at GHz frequencies** — 1 nH at 5 GHz is over 30 ohms. For any ground connection that matters at high frequency, use multiple vias or microvias.
- **Via inductance scales with board thickness** — A 4-layer board with 62-mil total thickness has much higher via inductance than a 6-layer board where the RF layers are separated by only 10 mil. Stackup choice directly affects via performance.
- **Ground stitching is not optional at GHz frequencies** — Without stitching, the ground planes form a resonant cavity that can amplify noise at specific frequencies. If you see mysterious narrowband noise spikes, check ground plane resonances.
- **Via fence gaps leak energy** — Electromagnetic energy finds the weakest point in a shield. A via fence with even one missing via has dramatically reduced shielding at the gap location.
- **Back-drilling adds cost but is necessary above 10 GHz** — Via stubs create resonances that can notch out signals at critical frequencies. If your design operates above 10 GHz, budget for back-drilling in fabrication.
- **Mutual inductance between parallel vias reduces the benefit** — Two vias placed very close together (touching pads) do not give 50% inductance — mutual coupling keeps the total higher. Space parallel vias apart for best reduction.
