---
title: "SI Units & Prefixes"
weight: 10
---

# SI Units & Prefixes

The metric prefix system is one of those things that seems trivially simple until you mix up micro and milli and order the wrong part or blow up a circuit. Getting units right — especially the scaled forms used constantly in electronics — is a prerequisite for everything else.

## The Units That Matter in Electronics

| Quantity | Unit | Symbol | Notes |
|----------|------|--------|-------|
| Voltage | volt | V | Potential difference |
| Current | ampere | A | Charge flow rate |
| Resistance | ohm | ohm | V/A |
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
| tera | T | 10^12 | 1 Tohm = very high resistance |
| giga | G | 10^9 | 1 GHz = microwave frequency |
| mega | M | 10^6 | 1 Mohm, 1 MHz |
| kilo | k | 10^3 | 1 kohm, 1 kHz |
| (none) | — | 10^0 | 1 V, 1 A, 1 ohm |
| milli | m | 10^-3 | 1 mA, 1 mV, 1 mohm |
| micro | u (or mu) | 10^-6 | 1 uF, 1 uH, 1 uA |
| nano | n | 10^-9 | 1 nF, 1 ns, 1 nH |
| pico | p | 10^-12 | 1 pF, 1 pA, 1 ps |
| femto | f | 10^-15 | 1 fF (on-chip capacitance) |

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

The most dangerous confusion. 1 mA (milliamp) is 1000x larger than 1 uA (microamp). Setting a current limit to 100 mA when you meant 100 uA delivers 1000x more current than intended.

On schematics and in datasheets:
- **m** = milli (10^-3)
- **u** or **mu** = micro (10^-6)

Some older schematics use "M" for both mega and milli depending on context. This is terrible practice but you'll encounter it. A "100M" resistor could mean 100 megaohm or 100 milliohm — context is everything.

### Kilo (k) vs. Mega (M) Capitalization

- **k** (lowercase) = kilo = 10^3
- **M** (uppercase) = mega = 10^6

"K" (uppercase) for kilo is technically wrong but widely used. "m" (lowercase) for mega would be confused with milli. Be careful when reading handwritten or informal notes.

### The R/K/M Notation on Schematics

European-style component value notation puts the multiplier where the decimal point would be:

- 4R7 = 4.7 ohm
- 47R = 47 ohm
- 4K7 = 4.7 kohm
- 47K = 47 kohm
- 4M7 = 4.7 Mohm

This avoids ambiguity from decimal points that might be missed on a photocopy or screen. You'll see this on PCB silkscreens and some schematics.

## Converting Between Prefixed Units

The mechanical process: count how many factors of 10^3 you're moving.

- 0.001 uF = 1 nF (multiply by 1000, move one prefix down)
- 2200 pF = 2.2 nF (divide by 1000, move one prefix up)
- 0.1 uF = 100 nF (multiply by 1000)

For capacitors especially, you'll see the same value expressed in different prefixes on different datasheets:

- 0.1 uF = 100 nF = 100,000 pF — all the same capacitor

Train yourself to convert fluently. Mixing up prefixes during calculation is a common source of off-by-1000 errors.

## Gotchas

- **Farads are huge** — A 1 F capacitor is enormous. Most capacitors are microfarads, nanofarads, or picofarads. Supercapacitors are the exception, with values in farads, but they're a special case
- **Henries are large** — Most inductors are microhenries or millihenries. A 1 H inductor is physically large. Nanohenries matter at RF
- **dB is not a unit** — It's a ratio. dBm is referenced to 1 mW. dBV is referenced to 1 V. dBu is referenced to 0.775 V. Don't mix them up
- **Percent vs. ppm** — 1% = 10,000 ppm. Temperature coefficients in ppm/C and tolerance in percent are measuring the same kind of thing at different scales
- **Angular frequency vs. frequency** — omega = 2 x pi x f. Forgetting the 2 pi gives you an answer that's off by a factor of 6.28. Some formulas use omega, some use f. Know which one you're working with
