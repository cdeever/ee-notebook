---
title: "Saturation in Practice"
weight: 10
---

# Saturation in Practice

Saturation is the most important non-ideal behavior of any magnetic component with a core. When the core saturates, the inductor stops being an inductor — inductance collapses, current shoots up, and things downstream get damaged. Understanding saturation in practical terms means knowing what causes it, how to recognize it, and why datasheets don't always tell the full story.

## What Saturation Actually Is

A magnetic core stores energy by aligning magnetic domains in the core material. As current through the winding increases, more domains align with the applied field. When most of the domains are aligned, the core can't store more flux — it's saturated.

At that point, the permeability of the core drops toward the permeability of air. Since inductance is proportional to permeability, the inductance drops dramatically. For a ferrite core, this can be a 90%+ drop over a narrow current range.

The key relationship is B = (L × I) / (N × A_e), where B is flux density, N is turns count, and A_e is the effective core cross-section. Saturation occurs when B reaches the material's B_sat — typically 300–500 mT for ferrites and 1.0–1.5 T for powdered iron and laminated steel.

## Why It's Current-Dependent

Saturation depends on flux density, which depends on current. This makes inductor behavior nonlinear in a way that resistors and capacitors aren't:

- At low current, the inductor behaves close to its rated value
- As current increases, the core approaches saturation and inductance begins to drop
- Above the saturation current, inductance collapses

This means an inductor that works perfectly at 1 A may fail catastrophically at 2 A — not by gradually degrading, but by suddenly ceasing to limit current.

## Soft Saturation vs. Hard Saturation

Different core materials saturate differently, and this matters enormously in practice:

### Hard Saturation (Ferrite Cores)

Ferrite cores have a sharp B-H curve knee. Inductance holds close to its rated value until the current reaches the saturation point, then drops sharply. There's little warning — the inductor goes from "working" to "not an inductor" over a narrow current range.

This behavior is common in:
- Switching power supply inductors using MnZn or NiZn ferrite
- Ferrite-core transformers
- EMI filter inductors

Hard saturation is dangerous in switching converters because the sudden inductance drop causes a sudden current increase (V = L × dI/dt — if L drops, dI/dt increases for the same applied voltage). This current spike can exceed the switch transistor's rating.

### Soft Saturation (Powdered Iron, Composite, Sendust)

Powdered iron and composite cores have a distributed air gap throughout the material. Saturation is gradual — inductance rolls off smoothly as current increases. An inductor rated at 10 µH might still provide 7 µH at 150% of its rated current.

This is more forgiving in practice:
- Transient overloads cause a temporary inductance reduction, not a cliff
- The circuit continues to function (with degraded performance) rather than failing
- Switching converters see increased ripple current but not the sudden runaway that hard saturation causes

Many power inductor designs (especially for DC-DC converters) use composite cores specifically for this soft saturation characteristic.

## Temperature Makes It Worse

Ferrite B_sat decreases with temperature. A ferrite core with B_sat = 450 mT at 25°C might only manage 350 mT at 100°C. This creates a nasty feedback loop:

1. Core and copper losses heat the inductor
2. Higher temperature reduces B_sat
3. The inductor saturates at a lower current
4. Saturation increases current, which increases losses
5. More heat, more saturation — thermal runaway

Inductor designs with tight margin on saturation at room temperature may fail in a warm enclosure. Always check B_sat at the expected operating temperature, not at 25°C.

## DC Bias Effect

This is the same problem stated differently for capacitors, but it hits inductors hard: the inductance of a magnetic component changes with DC current flowing through it.

Datasheets for power inductors often include an "inductance vs. DC bias" curve showing how inductance rolls off with increasing DC current. A "10 µH" inductor might only provide 6 µH at its rated DC current. This matters for:

- LC filter corner frequency calculations (the filter shifts if L changes with load)
- Switching converter ripple calculations (ripple current increases as inductance decreases under load)
- Energy storage calculations (the actual stored energy at rated current is less than ½ × L_nominal × I²)

## Tips

- Always check the inductance vs. DC bias curve — the nominal inductance may be much higher than what's available at operating current
- Design with margin: peak current should be 70-80% of saturation current, not 95%
- Prefer soft-saturation cores for applications where transient overloads are possible

## Caveats

- Saturation current is not the same as rated current — Some datasheets specify a "thermal" current rating (current before overheating due to I²R losses) and a "saturation" current rating (current before inductance drops by 20–30%). The design limit is the lower of the two, but they're not always both listed
- Peak current matters, not average — In a switching converter, the inductor sees DC plus a triangular ripple. The peak current (DC + half the ripple) determines whether saturation occurs, not the average current. At heavy load or during transients, the peak can far exceed the average
- Saturation is per-cycle in AC applications — A transformer core can saturate on one half-cycle if the drive waveform is asymmetric (DC offset, duty cycle imbalance in a push-pull converter). The flux walks up the B-H curve cycle by cycle until it hits B_sat. This is called "flux walking" and is a common failure mode in full-bridge and push-pull converters
- Saturation can't be seen with a DMM — Saturation is a dynamic, current-dependent phenomenon. A resistance measurement tells nothing. An inductance measurement at low test current (as most LCR meters do) shows the small-signal inductance, not the inductance at operating current. A scope and a current waveform are needed to see saturation

## Bench Relevance

- An inductor current waveform with a curved or hooked rising edge (slope increasing toward the end) indicates approaching saturation
- Current spikes at the end of the switch on-time in a converter indicate the inductor is saturating
- Unexpectedly high ripple current suggests inductance is lower than expected — likely due to DC bias derating
- An inductor that runs hot despite correct DC current rating may be experiencing core losses from near-saturation operation
