---
title: "Measurement Basics"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Measurement Basics

A measurement is only as good as the understanding of what the instrument is actually reporting. Every instrument has limitations — bandwidth, input impedance, burden voltage, accuracy — and ignoring them leads to measurements that are precise, repeatable, and wrong.

## What the Multimeter Actually Tells

A DMM (digital multimeter) is the most common bench instrument, and it's easy to take its readings at face value without thinking about what's behind them.

### Voltage Measurement (DC)

The DMM measures the potential difference between its two probes. It has a finite input impedance (typically 10 MΩ) that draws current from the circuit.

- For low-impedance circuits (power rails, logic outputs), 10 MΩ loading is negligible
- For high-impedance circuits (sensor outputs, bias networks with large R values), 10 MΩ can significantly load the circuit and change the voltage being measured
- The reading is an average over the measurement period. Fast transients are smoothed out

### Current Measurement

The DMM is inserted in series with the circuit. It has a **burden voltage** — the voltage drop across the meter's internal shunt resistor.

- Typical burden voltage: 100-400 mV at full scale
- On low-voltage circuits, this burden voltage can be a significant fraction of the supply, changing the circuit's behavior
- **Never connect an ammeter in parallel with a circuit.** The low shunt resistance will create a near-short-circuit and blow the fuse (or worse)

### Resistance Measurement

The DMM applies a small known current and measures the resulting voltage to calculate R = V/I.

- Measurements are only valid on **de-energized circuits**. Measuring resistance in a powered circuit gives meaningless numbers and can damage the meter
- Parallel paths give false readings. If R1 is in parallel with R2, the meter measures the parallel combination, not R1 alone. One end of the component may need to be lifted
- The test current is small (typically microamps to milliamps), which means contact resistance at the probes matters for low-resistance measurements

## Probe Loading

Every measurement instrument affects the circuit it's measuring. The question is whether the effect is small enough to ignore.

### Oscilloscope Probes

- **10× passive probe:** ~10 MΩ || ~10 pF at the tip. The capacitance matters at high frequencies — it loads the circuit with impedance that drops with frequency
- **1× probe:** ~1 MΩ || ~100 pF. More loading but better sensitivity for small signals
- **Active probe:** Very low capacitance (~1 pF) and high impedance. Needed for high-speed or high-impedance measurements

At 100 MHz, a 10 pF probe tip capacitance has an impedance of about 160 Ω. That's significant loading on many circuits.

### Rule of Thumb

The instrument's input impedance should be at least 10× (preferably 100×) the source impedance of the circuit being measured. If it's not, the measurement is changing what's being measured.

## Accuracy, Resolution, and Precision

These three concepts are often confused:

- **Resolution** — The smallest change the instrument can detect. A 4.5-digit DMM can resolve 10 µV on the 1 V range. But that doesn't mean the reading is accurate to 10 µV
- **Accuracy** — How close the reading is to the true value. Specified in the datasheet as ±(% of reading + digits). A typical handheld DMM is accurate to ±0.5-1% for DC voltage
- **Precision (repeatability)** — How consistent the readings are when measuring the same thing repeatedly. A meter can be precise (same reading every time) but inaccurate (consistently wrong)

### Reading the Accuracy Spec

A typical DMM accuracy spec: ±(0.5% of reading + 2 digits)

For a reading of 5.000 V on a 4-digit display:
- 0.5% of 5.000 = 0.025 V
- 2 digits = 0.002 V
- Total uncertainty: ±0.027 V
- True value is between 4.973 and 5.027 V

This is far worse than the 1 mV resolution suggests. Don't confuse resolution with accuracy.

## When to Question Instruments

Red flags that suggest the measurement might not mean what it appears to:

- **The reading is exactly at a range boundary** — The meter may be auto-ranging, and the worst accuracy of two ranges may be occurring
- **The reading fluctuates wildly** — Could be a real signal, or could be noise pickup, bad probe contact, or a ground loop
- **The reading doesn't match the calculation by a large margin** — Before assuming the circuit is wrong, check the measurement setup. Probe loading? Wrong range? AC vs. DC coupling?
- **A small voltage is being measured in the presence of a large one** — Common-mode rejection limits can make the reading unreliable. Differential measurement or DC offset subtraction may be needed
- **The circuit behavior changes when the probe is connected** — The measurement is loading the circuit. Use a higher-impedance probe or measurement technique

## Tips

- Always check the instrument's input impedance relative to the circuit's source impedance
- Use 10× probes on oscilloscopes unless the signal is too small to see
- Verify accuracy on a known reference before trusting measurements on an unknown circuit

## Caveats

- **Probe where intended** — Voltage measured at the output pin of a regulator is not the same as voltage at the load 6 inches of trace away. Measure at the point of interest
- **Use short ground leads** — Long ground clips on oscilloscope probes pick up noise and add inductance. For accurate high-frequency measurements, use the shortest ground connection possible
- **AC coupling vs. DC coupling** — AC coupling blocks the DC component. Useful for seeing small AC signals on top of a DC rail. But it also filters out low-frequency content below the coupling capacitor's cutoff
- **Know the trigger** — On an oscilloscope, an unstable or wrong trigger makes the waveform look wrong even when the signal is fine. Set the trigger appropriately before interpreting what's displayed
- **Measure twice, differently** — If a measurement is surprising, verify with a different instrument, different probe, or different technique. Agreement between independent measurements builds confidence

## In Practice

- A voltage reading that changes when the probe is connected indicates the circuit is being loaded — use a higher impedance measurement method
- A resistance reading that varies with probe pressure indicates contact resistance issues at the measurement points
- Wildly fluctuating readings often indicate noise pickup — check grounding and shielding
- An oscilloscope waveform that looks wrong (noisy, distorted, unstable) may be a trigger or coupling issue rather than a circuit problem
