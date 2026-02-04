---
title: "Diagnosing Magnetics on the Bench"
weight: 46
---

# Diagnosing Magnetics on the Bench

Magnetic components don't fail in obvious ways. A saturated inductor looks identical to a healthy one on the bench. A transformer with excessive leakage inductance measures the same DC resistance as a good one. Diagnosing magnetics problems requires the right instruments and knowing what waveforms, temperatures, and current-draw patterns reveal.

## Scope Waveforms: What to Look For

The oscilloscope is the primary diagnostic tool for magnetics in switching circuits. The key signals are the inductor current waveform and the voltage across the component or at the switching node.

### Healthy Inductor in a Buck Converter

- **Current waveform:** Clean triangular ripple on top of the DC load current. Linear rising edge during the on-time, linear falling edge during the off-time. Amplitude of the ripple is set by V_in, V_out, L, and the switching frequency — if it matches the calculation, the inductor is behaving as expected
- **Switch node voltage:** Clean rectangular waveform between V_in and ground (approximately), with small ringing at the transitions from parasitic inductance and capacitance in the layout

### Saturated Inductor

- **Current waveform:** The rising edge of the current ramp curves upward at the end of the on-time — the slope increases because inductance is dropping. In severe saturation, the current spikes sharply upward near the end of each on-time, like a hockey stick. The peak current is much higher than expected
- **What to do:** Reducing the load current and checking whether the curve straightens out confirms this. If it does, the inductor is running out of headroom. Either the inductor is undersized, or the operating conditions have drifted (higher input voltage, higher temperature)

### Ringing from Leakage Inductance

- **Switch node voltage (flyback or forward converter):** After the switch turns off, a voltage spike appears above the reflected output voltage, followed by a damped oscillation. The spike amplitude and ring frequency indicate the leakage energy and the parasitic capacitance
- **Healthy:** A small ring that damps in 2–4 cycles, with peak voltage well below the switch's rating
- **Problematic:** Large ring amplitude approaching the switch's voltage rating, or a ring that doesn't damp (indicating insufficient snubber resistance)

### Transformer Saturation

- **Primary current in a push-pull or full-bridge converter:** If the flux is walking (DC imbalance), one half-cycle draws more current than the other. The asymmetry grows cycle by cycle until the core saturates on one side, causing a large current spike every other half-cycle. On the scope, this looks like alternating large and small current peaks
- **Primary current in a flyback:** Similar to inductor saturation — the current ramp curves upward at the end of the on-time

### Cross-Conduction / Shoot-Through

Not strictly a magnetics problem, but it shows up in the magnetics waveforms. In a half-bridge or full-bridge converter, if both switches conduct simultaneously (dead-time too short, gate driver malfunction), the transformer sees a short circuit. Current spikes to the supply rail limit, and the transformer current waveform shows sharp, high-amplitude spikes at the switching transitions.

## Current Probe vs. Sense Resistor

### Current Probe (Clamp-On or Dedicated)

- Clips around the wire or the inductor lead
- No circuit modification required
- AC-only probes (like Rogowski coils) show ripple but not DC. DC-capable probes (Hall-effect) show both
- Bandwidth matters — a 50 MHz current probe shows the ringing; a 100 kHz probe smooths it out and hides problems

### Sense Resistor

- A small resistor (1–50 milliohms) in series with the inductor
- Measured with a differential probe or an oscilloscope referenced to one side of the resistor
- Shows both DC and AC with full bandwidth
- Adds resistance and loss to the circuit — acceptable for diagnosis, not for production unless it's a designed-in current sense resistor
- At milliohm values, PCB trace resistance and probe contact resistance can introduce significant errors. Kelvin (4-wire) connections help where possible

## Temperature as a Diagnostic

### Where to Measure

- **Core surface:** Indicates total loss (core + copper). A thermocouple, IR thermometer, or thermal camera works here. Thermal cameras are excellent for magnetics diagnosis because they show the temperature distribution — a hot spot on one side of the core suggests localized saturation or a winding fault
- **Wire at the terminals:** High temperature here relative to the core suggests excessive DCR or AC resistance in the winding

### What Temperature Indicates

| Observation | Likely Cause |
|---|---|
| Core is warm, temperature rises with load | Normal copper loss (I²R). Check whether it stabilizes at an acceptable temperature |
| Core is hot at light load or no load | Core loss is excessive — wrong core material for the frequency, or the component is being driven at too high a flux density |
| Core gets hotter as frequency increases (same voltage) | Core loss is frequency-dependent and this core material isn't suited for the operating frequency |
| Temperature increases over time without reaching equilibrium | Thermal runaway — losses are increasing with temperature faster than heat can escape. Ferrite saturation decreasing with temperature is the usual suspect |
| One side of the core is hotter than the other | Asymmetric flux (DC bias in a push-pull converter), or a winding defect causing localized heating |

### IR Thermometer Limitations

- Shiny surfaces (bare ferrite, bare copper) have low emissivity and read lower than the actual temperature. Applying a small piece of tape (known emissivity ~0.95) on the surface and measuring the tape gives a more accurate reading
- The spot size of the IR thermometer matters — if the spot is larger than the component, the reading averages the component temperature with the cooler PCB around it

## LCR Meter Measurements

An LCR meter measures inductance, capacitance, and resistance at a specific test frequency and test current level.

### Verifying Inductance Value

Measure at the frequency and current level closest to the operating conditions. Most bench LCR meters test at 100 Hz or 1 kHz with milliamp-level test current. This gives the small-signal, low-frequency inductance — which may be significantly higher than the inductance at operating current and frequency.

If the reading matches the datasheet value, the component is probably nominal. If it reads significantly low, the core may be cracked (loss of magnetic path = lower permeability), or the component has been through a thermal event that degraded the core.

### Checking for Shorted Turns

A winding with a shorted turn (from insulation breakdown) will show:
- Lower inductance than expected (the shorted turn acts like a secondary winding with a resistive load, reflecting as a reduced inductance and increased loss)
- Higher loss factor (Q drops, or D increases)
- Often confirmed by comparing with a known-good unit

### DC Resistance Measurement

The LCR meter's DC resistance mode (or a DMM in 4-wire resistance mode) measures winding resistance. Compare to the datasheet DCR. Significant deviation suggests:
- Open winding (infinite resistance) — broken wire
- Higher than expected — corroded connections, thinner wire than spec, or a long, fine-wire winding with higher temperature than expected
- Lower than expected — probably measurement error (lead resistance, contact resistance) or a different part

## Current Draw Patterns

Monitoring input current to a power supply during different operating conditions reveals magnetics problems:

### Steady-State Current Higher Than Expected

- The magnetic component has higher losses than designed (wrong part, degraded core, insufficient wire gauge)
- The inductor is partially saturating, causing the converter to work harder to maintain output regulation

### Current Spikes at Startup

- Inrush through a transformer and rectifier into an uncharged capacitor (see [Inrush Current]({{< relref "/docs/fundamentals/magnetics-in-practice/inrush-current" >}}))
- Inductor saturation during the first few switching cycles before the converter's soft-start ramps up

### Current That Increases Over Time (Minutes to Hours)

- Thermal runaway: losses heat the component, increasing losses further
- Core permeability drift with temperature (some materials have a pronounced temperature dependence)
- A thermal camera check is definitive — if the inductor or transformer is the hottest component on the board and the temperature is still rising, that's the culprit

### Asymmetric Current Draw on AC Input

If a circuit draws more current on one half-cycle of the AC mains than the other, a transformer core may have a DC bias (from a faulty rectifier passing DC, or from DC on the mains). This asymmetry increases core loss and can lead to saturation on one half-cycle.

## Quick Functional Checks Without Instruments

When a scope or LCR meter isn't available:

- **Continuity check:** A DMM in resistance mode confirms the winding isn't open. Compare resistance of suspect windings to known-good ones or to the datasheet DCR
- **Ring test:** For simple inductors, a ring tester applies a pulse to the inductor and shows the ringing on a scope (or through a piezo speaker). A healthy inductor rings cleanly; a shorted turn damps the ring quickly. This is a common ham radio technique for checking toroidal cores
- **Touch test:** If the component is too hot to touch (above ~60°C), something may be wrong — or the design runs hot by intention. Comparing to a known-good board helps if available
- **Listen:** Audible noise from an inductor or transformer that wasn't there before suggests a mechanical change (loose winding, cracked core) or an operating condition change (different load, different frequency)

## Caveats

- **LCR meters measure at small signal.** A component that reads 10 uH on the LCR meter may provide only 6 uH at operating current. LCR meters with DC bias capability exist but are expensive. Without one, operating inductance must be inferred from scope waveforms (L = V × dt / dI from the current ramp slope)
- **Current probes have insertion impedance.** A clamp-on probe around a wire adds a small series impedance. For low-impedance power circuits this is negligible, but for high-impedance signal circuits it can affect the measurement
- **Thermal equilibrium takes time.** A component's temperature after 30 seconds of operation is not representative. Running the circuit at full load for 15–30 minutes (or until the temperature stabilizes) is necessary before concluding the component runs at an acceptable temperature. The initial rate of temperature rise is not the final temperature
- **"It measures fine on the bench" doesn't mean it works in the circuit.** A magnetics component can pass all static tests (inductance, DCR, SRF) and still fail in the application due to saturation at operating current, core loss at operating frequency, or thermal issues in the enclosure. Bench measurements characterize the component; in-circuit measurements characterize the system
- **Scope probes on switching nodes need bandwidth and low inductance.** A long ground lead on a scope probe adds inductance that rings with the parasitic capacitance, creating false ringing in the measurement that looks like a circuit problem. A ground spring or tip-and-barrel probing technique produces clean measurements at switching nodes
