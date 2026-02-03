---
title: "EMI/EMC Reality (When Your Circuit Becomes a Radio)"
weight: 5
---

# EMI/EMC Reality (When Your Circuit Becomes a Radio)

Every circuit is a radio. It transmits and receives whether intended or not. EMI (electromagnetic interference) is the unwanted signal; EMC (electromagnetic compatibility) is the discipline of making circuits coexist without interfering. In a compliance lab, these are measured against standards with calibrated antennas. At the bench, they're the reason the ADC reads garbage, the microcontroller resets when the relay fires, or the audio circuit buzzes when USB is plugged in.

## Emissions vs. Susceptibility

**Emissions:** The circuit is the noise source, radiating or conducting electromagnetic energy that interferes with other equipment.

**Susceptibility (immunity):** The circuit is the victim. External electromagnetic energy causes malfunction — noise on measurements, resets, data corruption, audio artifacts.

Most bench debugging is susceptibility work. But fixes are symmetric: reducing emissions and reducing susceptibility use the same techniques.

## The Four Coupling Mechanisms

**Conducted (galvanic):** Source and victim share a wire. Current flows through shared impedance, developing voltage the victim sees. Most common at low frequencies. Even milliohms of ground resistance create millivolts of noise at amp-level currents.

**Capacitive (electric field):** A changing voltage induces current in a nearby conductor through capacitance between them. Coupling strength depends on capacitance and dV/dt. A 3.3V signal switching in 1 ns has the same coupling strength as a 330V signal switching in 100 ns.

**Inductive (magnetic field):** A changing current creates a magnetic field that induces voltage in a nearby loop. This is transformer action — the source is the primary, the victim loop is the secondary. Coupling depends on dI/dt, loop area, and proximity.

**Radiated (far-field):** At distances greater than a wavelength, fields propagate as electromagnetic waves. Source and victim are antennas. A 15 cm trace is 1/20 of a wavelength at 100 MHz — already a non-trivial antenna.

## Why Fast Edges Cause RF Behavior

**It's not clock frequency that causes EMI — it's edge rate.**

A 10 MHz clock is not a 10 MHz sine wave. It's a trapezoidal wave with harmonics at 10, 30, 50, 70... MHz. Harmonic content extends up to:

**f_knee ≈ 0.35 / t_rise**

A signal with 1 ns rise time has significant content up to 350 MHz regardless of fundamental frequency. A 1 MHz signal with 1 ns edges produces more high-frequency EMI than a 100 MHz signal with 10 ns edges.

Adding a series resistor (22–100 Ohm) to a digital output slows the edge without affecting logic timing. High-frequency harmonic content drops dramatically.

## Common Symptoms

**Random resets or lockups:** Transient on power rail, reset line, or clock disrupts the processor. Check power rail and reset pin on scope during triggering event.

**ADC noise floor increase:** Noise couples into ADC input, reference, or power supply. AC-couple scope to ADC input and look for switching-frequency components.

**Audio hum, buzz, or whine:** Ground loops cause hum; switching supply noise causes whine. See [Is There a Ground Loop?]({{< relref "ground-loop" >}}).

**"Touching it fixes it":** Body provides ground path or adds capacitance that detunes antenna. Indicates uncontrolled impedance — floating ground, unterminated cable, ungrounded shield.

**Intermittent communication errors:** Transients on communication lines corrupt edges. Coupling may be conducted or capacitive/inductive.

## High-Value First Moves

**Reduce loop area:** Both inductive coupling (as victim) and magnetic radiation (as source) are proportional to loop area. Keep decoupling capacitors adjacent to IC power pins. Route high-speed signals over continuous ground plane.

**Improve return path:** At high frequency, return current flows directly under the signal trace on the nearest ground plane. Disrupted return path (split plane, long ground wire) creates larger loop.

**Decouple correctly:** Placement matters more than capacitor value. Under the IC connected by vias is ideal. Use 100 nF ceramic + 10 µF bulk.

**Add series resistance on fast outputs:** 22–100 Ohm resistor creates RC low-pass with trace capacitance, slowing edges without affecting logic level.

**Ferrites on cables:** Snap-on ferrites attenuate common-mode high-frequency current. Effective on power cables, USB, motor leads.

**Shielding:** Grounded conductive enclosure attenuates emissions and susceptibility. Every opening leaks — filter cables at entry point.

**Filtering at board edge:** Every signal and power line entering the board is a potential antenna. Filter close to connectors.

**Separation:** Physical distance is the cheapest filter.

## Tips

- Use spring-tip ground for EMI scope measurements — long ground leads are antennas
- Bandwidth limiting helps when looking for specific noise; use full bandwidth when hunting broadband EMI
- Near-field probes (DIY loop of coax) localize noise sources to specific components
- SDR dongle with small antenna gives wideband spectrum view for A/B comparison
- The A/B method works: measure, change one thing, measure again, compare

## Caveats

- The loudest emission is not always the problem — a harmonic may cause the actual symptom
- Ground pour doesn't help if it's not connected — isolated copper is a parasitic capacitor, not a shield
- "It passes on bench but fails in enclosure" is common — the enclosure changes every resonance
- Ferrites saturate at high DC current and can resonate with parasitic capacitance
- Shielded cables with ungrounded shields are worse than unshielded — floating shield couples to inner conductor
- Adding more decoupling caps eventually stops helping — parallel resonances create anti-resonances
- Spread spectrum reduces peak emission but not total energy — doesn't help broadband susceptibility
- The problem often isn't where the symptom appears — noise on ADC may originate from switcher on other side of board

## Bench Relevance

- ADC noise correlating with switcher activity confirms coupling path — improve decoupling and layout
- Reset triggered by relay/motor/solenoid indicates transient coupling — add snubber and improve decoupling
- Communication errors correlating with switching events indicates interference — check signal integrity and add filtering
- Symptom that changes with cable position indicates cable is part of coupling path
- Symptom that changes when touching enclosure indicates grounding issue
- Symptom that appears only with all equipment running indicates interaction between multiple sources
