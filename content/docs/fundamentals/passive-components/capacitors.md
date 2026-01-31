---
title: "Capacitors"
weight: 20
---

# Capacitors

Two plates separated by a dielectric. Simple in concept, remarkably complicated in practice. The capacitor you pick — not just the capacitance value, but the type, voltage rating, and dielectric — determines whether your circuit works, how long it lasts, and what surprises it has in store.

## The Ideal vs. Reality Gap

An ideal capacitor has a fixed capacitance, zero ESR, zero leakage, infinite voltage breakdown, and no frequency dependence.

Real capacitors break every one of these assumptions:

- **Capacitance varies with voltage (DC bias effect)** — Ceramic capacitors, especially high-K types (X5R, X7R, Y5V), lose capacitance when you apply DC voltage. A "10 uF" X5R cap rated at 10 V might have only 4-5 uF at 10 V. This is the single most surprising capacitor behavior for people coming from textbooks
- **Capacitance varies with temperature** — Y5V can lose 80% of its capacitance at temperature extremes. X7R stays within +/- 15% over its rated range. C0G/NP0 is essentially flat
- **ESR (Equivalent Series Resistance)** — Real capacitors have internal resistance. ESR determines ripple current capability and self-heating. Electrolytic caps have the highest ESR; MLCC ceramics have the lowest
- **ESL (Equivalent Series Inductance)** — Lead and body inductance. At high frequencies, a capacitor becomes inductive. The self-resonant frequency (SRF) is where capacitance and inductance cancel, and above it the "capacitor" behaves as an inductor
- **Leakage current** — DC current through the dielectric. Electrolytics have the highest leakage. Important for hold-up circuits, sample-and-hold, and anything with long time constants
- **Aging** — Some ceramic dielectrics lose capacitance over time (logarithmic aging). Class II ceramics (X5R, X7R) can lose 2-5% per decade of time after last heating above Curie temperature

## Dielectric Types and When They Matter

### C0G / NP0 (Class I Ceramic)

Stable, precise, no DC bias effect, no aging. Available in small values (pF to low nF). The go-to for timing circuits, filters, and anything where the capacitance value must not change.

### X5R / X7R (Class II Ceramic)

High capacitance density. Available up to 100 uF in small packages. But capacitance varies with voltage, temperature, and time. Good for bulk decoupling and energy storage where exact value isn't critical.

### Electrolytic (Aluminum)

Large capacitance, polarized, high ESR, limited life. Standard for bulk energy storage on power rails. Lifetime depends on temperature and ripple current — the electrolyte dries out over time.

### Tantalum

Smaller than aluminum electrolytic for the same capacitance. Lower ESR. But failure mode is short circuit (potentially violent). Sensitive to voltage surges and reverse polarity. Derate significantly — never run at rated voltage.

### Film (Polyester, Polypropylene, etc.)

Stable, low loss, self-healing (can survive minor dielectric breakdowns). Larger than ceramics but better behaved. Common in audio, AC mains filtering, and snubber circuits.

## Practical Patterns

### Decoupling

Place a small capacitor close to each IC power pin. The capacitor supplies instantaneous current demands faster than the power supply can respond. Typical values: 100 nF ceramic per pin, plus a bulk electrolytic per supply rail.

The capacitor's ESR and ESL determine how well it decouples at different frequencies. Multiple capacitor values in parallel cover a wider frequency range.

### Filtering

Capacitors with resistors form RC low-pass and high-pass filters. The cutoff frequency is f = 1 / (2 x pi x R x C). But above the cap's SRF, the filter stops working as designed because the capacitor becomes inductive.

### Energy Storage and Holdup

Capacitors provide short-term energy during supply interruptions. Energy = 1/2 CV^2. Size the cap for the energy needed, and make sure the ESR can handle the discharge current without excessive voltage drop.

## Gotchas

- **10 uF is not always 10 uF** — Check the DC bias curve for ceramic caps. A 10 uF 6.3 V cap at 5 V might only give you 5-6 uF. Oversize the voltage rating or the capacitance to compensate
- **Polarity matters for electrolytics and tantalums** — Reverse voltage destroys them. Tantalums can fail violently (short, smoke, fire)
- **Ceramic caps are microphonic** — Mechanical vibration causes voltage on the cap due to the piezoelectric effect of the ceramic dielectric. This matters in audio and precision analog circuits. C0G is less microphonic than X7R
- **ESR is not always bad** — In voltage regulator output caps, some ESR helps stability. An LDO designed for electrolytic output caps (which have ESR) might oscillate with ultra-low-ESR ceramic caps. Check the datasheet
- **Capacitors in series halve the capacitance but double the voltage rating** — Useful for AC mains work. But the voltage division is only equal if the capacitors are identical. Mismatched caps get unequal voltage sharing, and one might see more than its rating
