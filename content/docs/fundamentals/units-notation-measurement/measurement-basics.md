---
title: "Measurement Basics"
weight: 30
---

# Measurement Basics

A measurement is only as good as your understanding of what the instrument is actually telling you. Every instrument has limitations — bandwidth, input impedance, burden voltage, accuracy — and ignoring them leads to measurements that are precise, repeatable, and wrong.

## What the Multimeter Actually Tells You

A DMM (digital multimeter) is the most common bench instrument, and it's easy to take its readings at face value without thinking about what's behind them.

### Voltage Measurement (DC)

The DMM measures the potential difference between its two probes. It has a finite input impedance (typically 10 Mohm) that draws current from the circuit.

- For low-impedance circuits (power rails, logic outputs), 10 Mohm loading is negligible
- For high-impedance circuits (sensor outputs, bias networks with large R values), 10 Mohm can significantly load the circuit and change the voltage you're trying to measure
- The reading is an average over the measurement period. Fast transients are smoothed out

### Current Measurement

The DMM is inserted in series with the circuit. It has a **burden voltage** — the voltage drop across the meter's internal shunt resistor.

- Typical burden voltage: 100-400 mV at full scale
- On low-voltage circuits, this burden voltage can be a significant fraction of the supply, changing the circuit's behavior
- **Never connect an ammeter in parallel with a circuit.** The low shunt resistance will create a near-short-circuit and blow the fuse (or worse)

### Resistance Measurement

The DMM applies a small known current and measures the resulting voltage to calculate R = V/I.

- Measurements are only valid on **de-energized circuits**. Measuring resistance in a powered circuit gives meaningless numbers and can damage the meter
- Parallel paths give false readings. If R1 is in parallel with R2, you measure the parallel combination, not R1 alone. You may need to lift one end of the component
- The test current is small (typically microamps to milliamps), which means contact resistance at the probes matters for low-resistance measurements

## Probe Loading

Every measurement instrument affects the circuit it's measuring. The question is whether the effect is small enough to ignore.

### Oscilloscope Probes

- **10x passive probe:** ~10 Mohm || ~10 pF at the tip. The capacitance matters at high frequencies — it loads the circuit with impedance that drops with frequency
- **1x probe:** ~1 Mohm || ~100 pF. More loading but better sensitivity for small signals
- **Active probe:** Very low capacitance (~1 pF) and high impedance. Needed for high-speed or high-impedance measurements

At 100 MHz, a 10 pF probe tip capacitance has an impedance of about 160 ohm. That's significant loading on many circuits.

### Rule of Thumb

The instrument's input impedance should be at least 10x (preferably 100x) the source impedance of the circuit being measured. If it's not, the measurement is changing what you're trying to measure.

## Accuracy, Resolution, and Precision

These three concepts are often confused:

- **Resolution** — The smallest change the instrument can detect. A 4.5-digit DMM can resolve 10 uV on the 1 V range. But that doesn't mean the reading is accurate to 10 uV
- **Accuracy** — How close the reading is to the true value. Specified in the datasheet as ± (% of reading + digits). A typical handheld DMM is accurate to ± 0.5-1% for DC voltage
- **Precision (repeatability)** — How consistent the readings are when measuring the same thing repeatedly. A meter can be precise (same reading every time) but inaccurate (consistently wrong)

### Reading the Accuracy Spec

A typical DMM accuracy spec: ± (0.5% of reading + 2 digits)

For a reading of 5.000 V on a 4-digit display:
- 0.5% of 5.000 = 0.025 V
- 2 digits = 0.002 V
- Total uncertainty: ± 0.027 V
- True value is between 4.973 and 5.027 V

This is far worse than the 1 mV resolution suggests. Don't confuse resolution with accuracy.

## When to Question Your Instruments

Red flags that suggest the measurement might not mean what you think:

- **The reading is exactly at a range boundary** — The meter may be auto-ranging and you might be getting the worst accuracy of two ranges
- **The reading fluctuates wildly** — Could be a real signal, or could be noise pickup, bad probe contact, or a ground loop
- **The reading doesn't match your calculation by a large margin** — Before assuming the circuit is wrong, check the measurement setup. Probe loading? Wrong range? AC vs. DC coupling?
- **You're measuring a small voltage in the presence of a large one** — Common-mode rejection limits can make the reading unreliable. Differential measurement or DC offset subtraction may be needed
- **The circuit behavior changes when you connect the probe** — Your measurement is loading the circuit. Use a higher-impedance probe or measurement technique

## Measurement Technique Basics

- **Probe where you mean to measure** — Voltage measured at the output pin of a regulator is not the same as voltage at the load 6 inches of trace away. Measure at the point of interest
- **Use short ground leads** — Long ground clips on oscilloscope probes pick up noise and add inductance. For accurate high-frequency measurements, use the shortest ground connection possible
- **AC coupling vs. DC coupling** — AC coupling blocks the DC component. Useful for seeing small AC signals on top of a DC rail. But it also filters out low-frequency content below the coupling capacitor's cutoff
- **Know your trigger** — On an oscilloscope, an unstable or wrong trigger makes the waveform look wrong even when the signal is fine. Set the trigger appropriately before interpreting what you see
- **Measure twice, differently** — If a measurement is surprising, verify with a different instrument, different probe, or different technique. Agreement between independent measurements builds confidence
