---
title: "Selecting Magnetics by Application"
weight: 60
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Selecting Magnetics by Application

Picking the right inductor or transformer starts with the application, not the datasheet. A buck converter inductor, an EMI filter choke, an audio output transformer, and a flyback transformer are all "magnetic components," but they operate under completely different constraints. The specs that matter for one application are irrelevant — or even counterproductive — for another.

## The Selection Mindset

Before opening a distributor search page, answer these questions:

1. **What is the component doing?** Storing energy, filtering, isolating, transforming voltage, matching impedance?
2. **What frequency range?** DC with AC ripple, audio band, switching frequency, RF?
3. **What current profile?** Mostly DC with small ripple? Pure AC? Pulsed?
4. **What's the thermal environment?** Forced air, sealed enclosure, ambient temperature range?
5. **What fails if this component is wrong?** Efficiency loss, overheating, EMI failure, signal distortion, component damage?

## Buck / Boost / Buck-Boost Converter Inductor

The workhorse of switching power conversion. The inductor stores energy during one phase and delivers it during the other.

### What Matters Most

- **Saturation current** — Must exceed the peak inductor current (DC load current + half the ripple current) under worst-case conditions (maximum load, maximum input voltage for boost, minimum input voltage for buck). Temperature derating required — check the saturation current at operating temperature, not at 25°C
- **DCR** — Directly subtracts from efficiency. At 5 A load, every 10 mΩ of DCR costs 0.25 W. For battery-powered designs, this is critical. For wall-powered designs with generous thermal budget, less so
- **Inductance at operating DC bias** — The inductance at operating current, not the zero-current value on the datasheet front page. A "10 µH" inductor might deliver 7 µH at rated current. Use the inductance vs. DC bias curve
- **Core material** — Soft saturation (powdered iron, composite) is more forgiving of transient overloads. Hard saturation (ferrite) is more efficient at high frequency but less tolerant of current spikes
- **Size and height** — Physical constraints often drive the selection more than electrical specs. Taller inductors have more room for turns and air gap, providing better performance per footprint

### What Matters Less

- AC resistance (unless ripple current is a large fraction of DC current)
- Self-resonant frequency (unless switching frequency is in the MHz range)
- Shielding (for EMI-sensitive designs it matters; for a power bank, usually not)

## EMI Filter Inductor / Common-Mode Choke

Used on power inputs and signal lines to attenuate high-frequency noise.

### What Matters Most

- **Impedance at the noise frequency** — Not the inductance value itself, but the impedance (resistive + reactive) at the frequency to be blocked. A 10 µH inductor has an impedance of about 6 Ω at 100 kHz. If 50 Ω of impedance is needed at that frequency, a larger inductance or a ferrite bead is required
- **Self-resonant frequency** — Above the SRF, the inductor becomes capacitive and its impedance drops. The useful filtering range is below the SRF. For broadband EMI filtering, multiple stages with different SRFs may be needed
- **DC bias handling** — Common-mode chokes carry the full load current as DC. If the core saturates from DC bias, the common-mode impedance drops and filtering is lost. Differential-mode filter inductors also carry DC and must avoid saturation
- **Rated current** — Thermal, not just saturation. EMI components are often in the power path and must handle full load current continuously without overheating

### What Matters Less

- Low DCR (unless it's a high-current path where voltage drop is a concern)
- Inductance precision (EMI filtering doesn't require 1% tolerance)
- Soft vs. hard saturation (if operated well below saturation, the characteristic doesn't matter)

## Flyback Transformer (Coupled Inductor)

The "transformer" in a flyback converter is really two coupled inductors sharing a gapped core. Energy is stored in the core gap during the switch-on time and delivered to the secondary during the switch-off time.

### What Matters Most

- **Magnetizing inductance** — Determines the peak primary current and energy stored per cycle. Too high: insufficient energy transfer per cycle. Too low: excessive peak current
- **Saturation current** — The primary carries the full magnetizing current. Must not saturate at peak current plus margin for transients
- **Leakage inductance** — Stored energy in leakage inductance is lost to the snubber every cycle. Lower leakage = higher efficiency and lower switch voltage stress. Good winding technique (interleaving, tight coupling) is critical
- **Turns ratio** — Sets the output voltage for a given duty cycle. Must be designed with the converter's duty cycle range and feedback loop in mind
- **Isolation voltage** — If the flyback provides safety isolation (mains to low voltage), the transformer must meet creepage, clearance, and hipot requirements
- **Core gap** — The gap stores the energy. Larger gap = more energy storage capacity, lower effective permeability, higher saturation current, lower inductance per turn. The gap is a fundamental design parameter, not an afterthought

### What Matters Less

- DCR (significant only in high-current, low-voltage designs)
- AC resistance (unless operating at very high frequency with significant AC ripple)
- Shielding (the magnetic field is mostly contained in the core)

## Audio Output Transformer

Matches the high-impedance output of a tube amplifier to a low-impedance speaker load. Bandwidth, distortion, and frequency response are the priorities.

### What Matters Most

- **Frequency response** — The transformer must pass the audio band (20 Hz to 20 kHz minimum) with minimal rolloff. Low-frequency response is limited by magnetizing inductance (too low = bass rolloff). High-frequency response is limited by leakage inductance and stray capacitance (too high = treble rolloff)
- **Magnetizing inductance** — Must be high enough that the inductive reactance at the lowest frequency of interest is much greater than the reflected load impedance. For 20 Hz into 8 Ω reflected, the magnetizing inductance needs to be at least several henries
- **Leakage inductance** — Must be low enough that the series impedance at 20 kHz doesn't attenuate the signal. Tight winding coupling (interleaved primaries and secondaries) is essential
- **Core saturation at low frequency** — Large flux swing at low frequency requires a large core with high B_sat material. This is why audio output transformers are physically large and heavy — the core size is set by the lowest frequency and the maximum power level
- **DC balance** — Push-pull output stages cancel DC in the core. Single-ended designs pass DC through the primary, biasing the core and reducing available flux swing. Single-ended transformers need gapped cores or cores with high B_sat to accommodate the DC bias
- **Distortion** — Nonlinearity in the core's B-H curve adds harmonic distortion. Lower flux density (larger core) and better core material reduce distortion

### What Matters Less

- DCR (contributes to insertion loss and damping factor, but audio transformers have relatively low turns count)
- Efficiency in the power conversion sense (a few percent loss is acceptable for signal quality)
- Size and weight (audio transformers are expected to be large)

## Isolation / Safety Transformer

Provides galvanic isolation between circuits — either for safety (mains isolation) or for signal isolation (breaking ground loops, level shifting).

### What Matters Most

- **Isolation voltage rating** — The dielectric strength between primary and secondary windings. Safety transformers must be rated and tested to withstand specific voltages (1500 V, 4000 V, etc.) per the applicable safety standard
- **Creepage and clearance** — Physical distances between primary and secondary conductors on the bobbin, pins, and PCB. These are safety-critical dimensions, not electrical performance specs
- **Inter-winding capacitance** — Lower is better for isolation integrity. High inter-winding capacitance couples common-mode noise across the isolation barrier, defeating part of the isolation's purpose
- **Leakage current** — Related to inter-winding capacitance. At mains frequency, the current that flows through the capacitance between windings. Medical and sensitive applications have strict leakage current limits
- **Insulation system** — Triple-insulated wire, reinforced insulation tape, or physical barriers between windings. The insulation must not degrade over the product's lifetime under thermal, voltage, and mechanical stress

### What Matters Less

- Core loss (unless efficiency is a primary requirement)
- DCR (unless the transformer carries high current)
- Magnetizing inductance (as long as it's sufficient for the operating frequency — undersized mains transformers draw excessive magnetizing current)

## Tips

- Always check the inductance vs. DC bias curve — the front-page inductance number is the zero-bias value
- Match core material to operating frequency for best efficiency
- For switching converters, calculate peak current including ripple and transients, not just average load current

## Caveats

- The "same" inductance value from different manufacturers can behave completely differently under DC bias — A 10 µH inductor from one vendor may hold 8 µH at 3 A; from another, it may drop to 5 µH at 3 A. Core material and construction matter more than the headline spec
- "Shielded" does not mean zero external field — Shielded inductors contain most of the field, but some leakage is inevitable. If a shielded inductor is placed next to a sensitive analog circuit, check the manufacturer's field plot or measure the coupling
- Audio transformer specs rarely include distortion data — THD may need to be measured, especially at low frequencies and high signal levels where core nonlinearity is worst
- Flyback transformers from different winding houses for the "same" schematic can have dramatically different leakage inductance — Winding technique and consistency are critical. If suppliers change, re-measure leakage and re-validate the snubber
- Selecting by inductance alone is the most common magnetics mistake in switching converter design — Current rating, saturation current, DCR, and core material all matter as much or more than the inductance value. Two "10 µH, 5 A" inductors from the same distributor search can behave completely differently in the same circuit

## In Practice

- An inductor that saturates in one design but not another with the "same" requirements likely has different DC bias characteristics
- Converter efficiency that doesn't match calculations often traces to higher-than-expected DCR or core losses
- EMI that passes with one inductor but fails with an "equivalent" replacement indicates the SRF or impedance vs. frequency differs
- A flyback that rings excessively after switching has too much leakage inductance — compare different transformer samples
