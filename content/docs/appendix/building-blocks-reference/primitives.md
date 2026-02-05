---
title: "Primitives"
weight: 10
---

# Primitives

Primitives are single components — the things that fit between tweezers, occupy one line on a BOM, and are fully characterized by a datasheet. Reasoning at this level concerns voltage, current, impedance, power dissipation, temperature coefficients, and parasitic properties. A primitive doesn't know what circuit it belongs to or what function it serves; it just obeys physics within its rated conditions.

Most primitives are cross-cutting: a resistor appears in every domain of electronics, and its behavior doesn't change based on whether it's in a power supply or an audio circuit. The few that are domain-specific (crystals, ferrite beads) are noted below. The key skill at this level is matching the component's actual parameters — not just the nominal value — to the circuit's requirements, especially under worst-case conditions.

## Passive

**Resistor.** Fixed resistance element characterized by nominal value, tolerance, power rating, temperature coefficient, and parasitic inductance. Appears in every domain. Composes into voltage dividers, bias networks, current-sense circuits, and pull-up/pull-down networks. The most common failure mode is exceeding the power rating without realizing it — especially in SMD packages where the rating drops sharply above 70 °C.

**Capacitor.** Energy storage and AC coupling element characterized by capacitance, voltage rating, dielectric type, ESR, ESL, and temperature/voltage derating behavior. Appears in every domain. Composes into filters, timing circuits, decoupling networks, and energy storage. Dielectric matters enormously: a 1 µF ceramic in X5R may lose half its capacitance at rated voltage, while the same value in C0G stays flat but only comes in small values.

**Inductor.** Energy storage and filtering element characterized by inductance, DC resistance, saturation current, and self-resonant frequency. Appears primarily in power, RF, and filtering applications. Composes into LC filters, switching converter output stages, and impedance matching networks. Saturation current is the critical gotcha — once exceeded, inductance drops sharply and the converter loses regulation.

**Ferrite bead.** Lossy inductor designed to dissipate high-frequency energy as heat rather than store it. Characterized by impedance at 100 MHz (the Z@100MHz spec), DC resistance, and rated current. Appears primarily in EMI filtering and power rail cleanup. Composes into decoupling networks and supply filtering. Not a general-purpose inductor — using one where real inductance is needed causes confusing results because the impedance curve is resistive, not reactive, at the frequencies that matter.

**Crystal/resonator.** Precision frequency-determining element characterized by fundamental frequency, load capacitance, ESR, frequency tolerance, and temperature stability. Appears in digital, RF, and timing domains. Composes into oscillator circuits and clock sources. The load capacitance spec is critical — mismatching it shifts the oscillation frequency and can prevent startup entirely.

**Transformer.** Magnetically coupled winding pair (or more) that transfers energy and/or provides galvanic isolation. Characterized by turns ratio, inductance, leakage inductance, winding resistance, and isolation voltage. Appears in power (switching converters, mains isolation) and signal (audio, RF) domains. The boundary between "primitive" and "block" blurs here — a transformer is a single purchased component but contains multiple coupled windings with complex frequency-dependent behavior.

**Fuse.** Overcurrent protection element that destructs to open the circuit above its rated current. Characterized by current rating, voltage rating, breaking capacity, and speed (fast-blow vs. slow-blow). Appears in power and safety applications. Composes into protection circuits and mains input stages. The breaking capacity spec is often overlooked — a fuse rated for 250 mA may not safely interrupt a fault current of 1 kA if its breaking capacity is too low.

## Active

**Diode.** One-way current valve characterized by forward voltage drop, reverse breakdown voltage, leakage current, junction capacitance, and recovery time. Appears in every domain. Composes into rectifiers, clamps, protection circuits, and voltage references (Zeners). The variety is enormous: signal diodes, power rectifiers, Schottky, Zener, TVS, and LED are all "diodes" with very different parameter priorities.

**BJT.** Bipolar junction transistor — current-controlled current amplifier characterized by hFE (current gain), VCE(sat), transition frequency (fT), and power dissipation. Appears in analog, power, and legacy digital domains. Composes into amplifier stages, current mirrors, switches, and bias networks. The base current requirement is what distinguishes BJT reasoning from MOSFET reasoning — it's not a free control input.

**MOSFET.** Field-effect transistor — voltage-controlled switch or amplifier characterized by threshold voltage (Vth), RDS(on), gate charge, and drain-source breakdown voltage. Appears in power switching, analog, and digital domains. Composes into switches, H-bridges, amplifier stages, and logic gates. The gate is capacitive, not resistive — drive current matters for switching speed but not for static state. The distinction between logic-level and standard-gate-threshold MOSFETs catches many beginners.

**Op-amp.** Integrated differential amplifier characterized by open-loop gain, bandwidth (GBW), input offset voltage, input bias current, slew rate, and output drive capability. Appears in analog, audio, and instrumentation domains. Composes into inverting/non-inverting amplifiers, filters, comparator substitutes (poorly), and instrumentation amps. Purchased as a single IC — a primitive by sourcing — but functions as a block internally. This is one of the clearest boundary cases in the hierarchy.

**Comparator.** High-speed differential amplifier designed for switching between output states, characterized by propagation delay, input offset, hysteresis (if built in), and output type (push-pull, open-drain, open-collector). Appears in analog, power, and digital interface domains. Composes into threshold detectors, window comparators, and oscillators. Looks like an op-amp but is designed for a different job — using an op-amp as a comparator works in slow circuits but fails at speed, and using a comparator as an op-amp fails immediately because there's no linear region.

**Voltage reference.** Precision voltage source characterized by initial accuracy, temperature coefficient, noise, long-term drift, and load regulation. Appears in measurement, data conversion, and precision analog domains. Composes into ADC/DAC reference inputs, calibration sources, and precision bias networks. The temperature coefficient is the spec that separates cheap references from expensive ones — a 50 ppm/°C reference drifts millivolts over a bench temperature swing.

## Connectors and Electromechanical

**Connector.** Mechanical-electrical interface characterized by pin count, pitch, current rating, voltage rating, mating cycles, and contact resistance. Appears in every domain. Composes into board-to-board links, cable assemblies, and test points. The mechanical reliability often limits the system before the electrical specs do — intermittent connector failures are one of the most common and most maddening bench problems.

**Switch/relay.** Manually or electrically actuated mechanical contact characterized by contact rating (voltage and current), contact resistance, bounce time, actuation force or coil voltage, and lifetime. Appears in power, control, and user interface domains. Composes into power switching, input selection, and safety interlocks. Contact bounce is the classic gotcha for digital interfacing — a single press can produce dozens of transitions over several milliseconds.

**Potentiometer/trimmer.** Variable resistor characterized by total resistance, taper (linear or logarithmic), power rating, resolution, and mechanical life. Appears in analog, audio, and calibration applications. Composes into adjustable bias networks, volume controls, and trim circuits. The distinction between linear and logarithmic taper matters for audio applications, where perceived loudness follows a logarithmic curve.

## Thermal and Mechanical

**Heatsink.** Thermal management component characterized by thermal resistance (°C/W), surface area, material, and mounting method. Appears in power and any domain with significant dissipation. Composes into thermal management subsystems alongside thermal pads, fans, and thermal vias. The thermal interface between the component and the heatsink often dominates the total thermal resistance — the heatsink itself may be adequate while the mounting is not.

**PCB (as a primitive).** The printed circuit board itself, characterized by layer count, copper weight, dielectric material, trace width/spacing rules, via structure, and thermal conductivity. Appears in every domain. Composes into every higher level of the hierarchy. Treating the PCB as "just a substrate" works at low frequencies and low power, but at higher frequencies it becomes a distributed network of transmission lines, parasitic capacitances, and ground return paths. In RF and high-speed digital work, the PCB is as much a circuit element as any component mounted on it.

## Tips

- Datasheet parameters are specified at particular test conditions. The actual value in the circuit depends on temperature, frequency, voltage, and aging — checking the graphs, not just the headline number, avoids surprises.

## Caveats

- The boundary between a primitive and a block is defined by the level of reasoning, not by the part number. An op-amp is a primitive when selecting it from a catalog; it becomes a block when analyzing its internal compensation.
- Some "primitives" contain significant internal complexity (voltage references, crystals with internal oscillator trim). The primitive label means reasoning at this level treats the component as a black box with datasheet parameters, not that the component is simple internally.
