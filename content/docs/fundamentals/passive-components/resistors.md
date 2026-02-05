---
title: "Resistors"
weight: 10
---

# Resistors

The simplest component — and the one most likely to be treated as ideal when it isn't. A resistor converts current into voltage drop and electrical energy into heat. Selecting and using them well means understanding where the ideal model breaks down.

## Ideal vs. Real

The ideal resistor has a fixed resistance, no voltage coefficient, no temperature coefficient, no noise, no inductance, no capacitance, and works from DC to daylight.

Real resistors deviate in ways that matter at the bench:

- **Tolerance** — A 10 kΩ 5% resistor is anywhere from 9.5 kΩ to 10.5 kΩ. For voltage dividers, current sense, and precision circuits, tolerance matters. 1% is standard for most work; 0.1% exists for precision applications
- **Temperature coefficient (tempco)** — Resistance changes with temperature. Thick-film resistors are typically 100-200 ppm/°C. Metal film is 25-50 ppm/°C. Wirewound can be under 10 ppm/°C. A 100 ppm/°C resistor changes 1% over a 100°C temperature swing
- **Voltage coefficient** — Some resistor types (especially thick-film and carbon) change resistance with applied voltage. Usually negligible at low voltages, but can matter in high-voltage dividers
- **Noise** — Resistors generate thermal noise (Johnson noise): V_noise = √(4kTRB). Higher resistance = more noise. Carbon composition resistors also generate excess noise (current noise) beyond the thermal floor. Metal film is quieter
- **Parasitic inductance** — Wirewound resistors are literally coils. They have significant inductance that matters at higher frequencies. Even non-wirewound resistors have some lead inductance
- **Parasitic capacitance** — At very high frequencies, capacitance across the resistor body provides an alternative current path, effectively shunting the resistance
- **Power rating** — Maximum continuous dissipation. Exceeding it overheats the resistor, potentially changing its value, cracking the substrate, or catching fire

## Series and Parallel: Beyond the Textbook

Series: R_total = R1 + R2 + ... (simple addition)

Parallel: 1/R_total = 1/R1 + 1/R2 + ... (reciprocal of sum of reciprocals)

For two resistors in parallel: R_total = (R1 × R2) / (R1 + R2)

The textbook formulas are straightforward. The practical nuances:

- **Paralleling for lower resistance** — Two identical resistors in parallel give half the resistance and double the power handling. Useful when a value or power rating isn't in stock
- **Tolerance stacking** — Series resistors: worst-case tolerances add. Parallel resistors: worst case is more complex but generally better than series stacking for matched pairs
- **Thermal coupling** — Two paralleled resistors share the power. But if one is hotter (different airflow, different position), its resistance changes differently, and the power sharing becomes unequal. This can cause thermal runaway in extreme cases with PTC (positive temperature coefficient) types — the hotter one gets even hotter

## Common Types and When They Matter

| Type | Tolerance | Tempco | Noise | Parasitic | Notes |
|------|-----------|--------|-------|-----------|-------|
| Thick film (SMD) | 1-5% | 100-200 ppm/°C | Moderate | Low L/C | Default choice, cheap, everywhere |
| Thin film (SMD) | 0.1-1% | 5-50 ppm/°C | Low | Low L/C | Precision work, low noise |
| Metal film (through-hole) | 1% | 50 ppm/°C | Low | Low L | Good all-around through-hole |
| Carbon composition | 5-20% | Large | High | Low L | Vintage, pulse handling |
| Wirewound | 0.01-5% | Low | Low | High L | Precision, power, but inductive |

## Tips

- Use 1% metal film or thin film for voltage dividers and precision circuits
- Parallel resistors when a specific value isn't available or more power handling is needed
- Check temperature coefficient for circuits that must maintain accuracy over temperature

## Caveats

- Power derating — A 1/4 W resistor is rated at 25°C ambient. In a hot enclosure, it handles less. Check the derating curve
- Pulse handling — A resistor can survive short pulses far above its continuous rating, but repetitive pulses cause cumulative thermal stress. Energy per pulse and duty cycle both matter
- High-value resistors pick up noise — A 10 MΩ resistor in a high-impedance circuit is an antenna. Guard rings, shielding, and short leads help
- SMD resistor markings — 4.7 kΩ might be marked "472" (47 × 10²). "4R7" means 4.7 Ω. "0" means 0 Ω (jumper). Worth memorizing the common codes
- 0 Ω resistors exist — They're jumpers in SMD form. Used for routing flexibility on PCBs. They have milliohms of actual resistance and limited current ratings
- Temperature and aging effects are almost always larger than expected — a design that works on the bench at 25°C may fail in the field at 60°C, and the failure will trace back to a component whose parameter shifted outside the assumed range

## Bench Relevance

- A resistor measuring significantly different from its marked value (beyond tolerance) indicates damage or wrong part
- A hot resistor suggests more power dissipation than expected — trace back to find why current or voltage is higher than designed
- Drifting resistance readings on a powered circuit often indicate thermal effects — the resistor is heating up and changing value
- Intermittent high-impedance faults often trace to cracked resistors or cold solder joints on resistor leads
