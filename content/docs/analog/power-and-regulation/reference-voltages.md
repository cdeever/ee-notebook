---
title: "Reference Voltages"
weight: 30
---

# Reference Voltages

Why "stable" is hard. A voltage reference produces a known, stable voltage that other circuits compare against. It's the accuracy anchor for regulators, ADCs, DACs, and any measurement circuit. Everything downstream is only as accurate as its reference — if the reference drifts, everything drifts with it.

## Why References Are Difficult

A "stable" voltage means the output doesn't change when:

- Temperature changes (the big one)
- Supply voltage changes
- Load current changes
- Time passes (aging)
- The manufacturing process varies

No reference achieves perfect stability on all of these. The question is always: how much drift can you tolerate for your application?

## Reference Types

### Zener Diode

The simplest voltage reference — a Zener diode in reverse breakdown, fed through a resistor from the supply.

- Cheap and simple
- Poor temperature stability (100-1000 ppm/C unless in the 5-7 V range where tempco crosses zero)
- Poor load regulation (the Zener's dynamic impedance is 5-50 ohm)
- Noisy (breakdown generates broadband noise)
- Adequate for rough references, power indicator circuits, crude voltage clamping. Not suitable for precision work

### Bandgap Reference

The workhorse of modern voltage references. Exploits the complementary temperature coefficients of V_BE (negative tempco) and delta-V_BE (positive tempco, proportional to absolute temperature) to produce a voltage with near-zero net tempco.

The output voltage is approximately 1.25 V (the bandgap voltage of silicon), which is why many references and regulators have internal 1.25 V references.

- Typical tempco: 10-100 ppm/C
- Available as standalone references (LM4040, REF50xx) and integrated into regulators and ADCs
- Accuracy depends on trimming during manufacturing
- Some bandgap references are available in voltage options (2.048 V, 2.5 V, 3.0 V, 4.096 V) using internal gain stages

### Buried Zener

A Zener junction formed below the silicon surface (buried), which isolates it from surface contamination and stress effects.

- Much better stability than surface Zener: 1-10 ppm/C
- Lower noise than surface Zener
- Used in precision references (AD586, REF102)
- Requires higher supply voltage (typically > 8 V)
- More expensive

### Ultra-Precision References

For metrology-grade applications, references like the LTZ1000 achieve sub-ppm stability by combining a buried Zener with a temperature-controlled heater circuit that holds the die at a constant temperature.

- 0.05 ppm/C or better
- Long-term drift: a few ppm/year
- Complex support circuitry (heater, control loop)
- Expensive and power-hungry
- Only needed for calibration equipment, precision measurement, and high-resolution (>16-bit) data conversion

## Key Specifications

| Parameter | What it means | Typical range |
|-----------|--------------|---------------|
| Initial accuracy | How close to nominal out of the box | 0.02-2% |
| Temperature coefficient | Output change per degree C | 1-100 ppm/C |
| Line regulation | Output change per volt of input change | 0.001-0.1 %/V |
| Load regulation | Output change per mA of load change | 0.01-1 mV/mA |
| Long-term drift | Output change over time | 10-100 ppm/1000 hours |
| Noise | Output noise in a specified bandwidth | 1-100 uV_pp (0.1-10 Hz) |
| Turn-on settling time | Time to reach final value after power-on | Microseconds to seconds |

## Practical Use

### Series Reference vs. Shunt Reference

**Series (three-terminal):** Input, output, ground. Regulates the output voltage like a small LDO. Provides current to the load from the supply.

**Shunt (two-terminal):** Anode and cathode. Acts like a precise Zener diode — it sinks current to maintain a fixed voltage. Requires an external series resistor to set the operating current.

Shunt references are simpler but waste quiescent current through the series resistor. Series references are more efficient but more complex.

### Reference as ADC Voltage Source

The reference voltage defines the full-scale range of an ADC. A 12-bit ADC with a 4.096 V reference has 1 mV/LSB resolution. If the reference drifts 0.1%, the full-scale value shifts by 4 mV — that's 4 LSB of error.

For high-resolution ADCs (16+ bits), reference noise and drift become the dominant error sources, not the ADC itself.

## Gotchas

- **Load the reference consistently** — Changes in load current cause voltage changes (load regulation error). For best accuracy, present a constant load to the reference, or use a buffer amplifier
- **Decouple the reference output** — A capacitor on the reference output reduces noise and improves transient response. But check the datasheet — some references are unstable with certain capacitor values
- **Allow warm-up time** — References shift during the first few minutes after power-on as the die temperature stabilizes. Precision measurements require waiting for the reference to settle
- **Mechanical stress** — Some references are sensitive to PCB stress (bending, thermal gradients). Conformal coating and PCB stress relief help in precision applications
- **Don't use a regulator as a reference** — Regulators and references look similar (both produce fixed voltages), but regulators are optimized for load current capability and transient response, not for absolute voltage accuracy or tempco. A 3.3 V LDO might have 1% initial accuracy and 100 ppm/C tempco — usable for power but poor as a measurement reference
