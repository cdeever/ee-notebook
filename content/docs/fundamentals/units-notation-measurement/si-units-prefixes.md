---
title: "SI Units & Prefixes"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# SI Units & Prefixes

The metric prefix system is one of those things that seems trivially simple until micro and milli get mixed up and the wrong part gets ordered or a circuit gets blown up. Getting units right — especially the scaled forms used constantly in electronics — is a prerequisite for everything else.

## The Units That Matter in Electronics

| Quantity | Unit | Symbol | Notes |
|----------|------|--------|-------|
| Voltage | volt | V | Potential difference |
| Current | ampere | A | Charge flow rate |
| Resistance | ohm | Ω | V/A |
| Capacitance | farad | F | Charge per volt |
| Inductance | henry | H | Flux per ampere |
| Power | watt | W | Energy per second |
| Energy | joule | J | Work done |
| Frequency | hertz | Hz | Cycles per second |
| Charge | coulomb | C | Ampere-seconds |
| Time | second | s | |

## SI Prefixes Used in Electronics

| Prefix | Symbol | Factor | Example |
|--------|--------|--------|---------|
| tera | T | 10¹² | 1 TΩ = very high resistance |
| giga | G | 10⁹ | 1 GHz = microwave frequency |
| mega | M | 10⁶ | 1 MΩ, 1 MHz |
| kilo | k | 10³ | 1 kΩ, 1 kHz |
| (none) | — | 10⁰ | 1 V, 1 A, 1 Ω |
| milli | m | 10⁻³ | 1 mA, 1 mV, 1 mΩ |
| micro | µ (or u) | 10⁻⁶ | 1 µF, 1 µH, 1 µA |
| nano | n | 10⁻⁹ | 1 nF, 1 ns, 1 nH |
| pico | p | 10⁻¹² | 1 pF, 1 pA, 1 ps |
| femto | f | 10⁻¹⁵ | 1 fF (on-chip capacitance) |

### The Common Range

Most bench electronics lives in the milli-to-mega range:

- Voltages: millivolts to hundreds of volts
- Currents: microamps to amps
- Resistances: milliohms to megaohms
- Capacitances: picofarads to millifarads
- Inductances: nanohenries to henries
- Frequencies: hertz to gigahertz

## Prefix Mistakes That Kill Hardware

### Milli vs. Micro

The most dangerous confusion. 1 mA (milliamp) is 1000× larger than 1 µA (microamp). Setting a current limit to 100 mA when 100 µA was intended delivers 1000× more current than expected.

On schematics and in datasheets:
- **m** = milli (10⁻³)
- **µ** or **u** = micro (10⁻⁶)

Some older schematics use "M" for both mega and milli depending on context. This is terrible practice but does occur. A "100M" resistor could mean 100 MΩ or 100 mΩ — context is everything.

### Kilo (k) vs. Mega (M) Capitalization

- **k** (lowercase) = kilo = 10³
- **M** (uppercase) = mega = 10⁶

"K" (uppercase) for kilo is technically wrong but widely used. "m" (lowercase) for mega would be confused with milli. Care is needed when reading handwritten or informal notes.

### The R/K/M Notation on Schematics

European-style component value notation puts the multiplier where the decimal point would be:

- 4R7 = 4.7 Ω
- 47R = 47 Ω
- 4K7 = 4.7 kΩ
- 47K = 47 kΩ
- 4M7 = 4.7 MΩ

This avoids ambiguity from decimal points that might be missed on a photocopy or screen. This notation is common on PCB silkscreens and some schematics.

## Converting Between Prefixed Units

The mechanical process: count how many factors of 10³ are being moved.

- 0.001 µF = 1 nF (multiply by 1000, move one prefix down)
- 2200 pF = 2.2 nF (divide by 1000, move one prefix up)
- 0.1 µF = 100 nF (multiply by 1000)

For capacitors especially, the same value gets expressed in different prefixes on different datasheets:

- 0.1 µF = 100 nF = 100,000 pF — all the same capacitor

Train to convert fluently. Mixing up prefixes during calculation is a common source of off-by-1000 errors.

## Tips

- When in doubt, convert to base units (volts, amps, ohms) before calculating, then convert back
- Use the R/K/M notation on silkscreens and schematics to avoid decimal point ambiguity
- Double-check prefix conversions whenever the result seems surprising

## Caveats

- Farads are huge — A 1 F capacitor is enormous. Most capacitors are microfarads, nanofarads, or picofarads. Supercapacitors are the exception, with values in farads, but they're a special case
- Henries are large — Most inductors are microhenries or millihenries. A 1 H inductor is physically large. Nanohenries matter at RF
- dB is not a unit — It's a ratio. dBm is referenced to 1 mW. dBV is referenced to 1 V. dBu is referenced to 0.775 V. Don't mix them up
- Percent vs. ppm — 1% = 10,000 ppm. Temperature coefficients in ppm/°C and tolerance in percent are measuring the same kind of thing at different scales
- Angular frequency vs. frequency — ω = 2πf. Forgetting the 2π gives an answer that's off by a factor of 6.28. Some formulas use ω, some use f. Know which one is expected

## In Practice

- A measurement that's off by exactly 1000× usually indicates a prefix conversion error
- Component values that seem wrong often trace back to milli/micro confusion on the label or schematic
- Oscilloscope and DMM readings in unexpected ranges suggest the wrong scale was assumed
- When ordering parts, verify the prefix in the part number matches the intended value
