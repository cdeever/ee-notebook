---
title: "Why RF Problems Feel Non-Local"
weight: 60
---

# Why RF Problems Feel Non-Local

At low frequencies, debugging follows a comforting logic: the problem is at the node where the voltage is wrong. You probe a point, find the signal is incorrect, and trace backward through the schematic to find the source. The cause and effect are connected by wires and components that behave predictably. At RF, this breaks down. Moving a cable changes the behavior of a distant amplifier. Touching the board with a probe shifts the oscillation frequency. Adding a ground wire makes things worse. Problems feel non-local because energy is coupling through fields, not just flowing through wires — and fields do not respect the neat boundaries drawn on schematics.

## Fields, Not Just Currents

At low frequencies, nearly all energy transfer happens through conducted current flowing in wires. The electric and magnetic fields exist, but they are tightly bound to the conductors and decay rapidly with distance. The fields are a side effect of the current.

At RF, the fields become the primary mechanism of energy transfer. An alternating current in a wire generates a magnetic field that extends into the surrounding space. That field induces current in any nearby conductor — intentionally (antennas, transformers) or unintentionally (crosstalk, interference). The higher the frequency, the more efficiently energy radiates away from conductors and couples to other structures.

This means the schematic is an incomplete description of the circuit. Two traces that have no connection on the schematic may be strongly coupled through their fields. A metal enclosure wall that does not appear on the schematic may be carrying return current or creating reflections. The physical world is always there, but at low frequencies it is usually invisible. At RF, it asserts itself.

## Crosstalk and Parasitic Coupling

Crosstalk is unintended signal transfer between conductors. It happens through two mechanisms:

**Capacitive (electric field) coupling.** Two conductors near each other form a capacitor. The coupled voltage is proportional to the rate of change of the source signal (dV/dt) and the mutual capacitance. Higher frequencies and faster edges create more coupling. Two parallel PCB traces 0.2 mm apart with 1 cm of parallel run have roughly 0.5-1 pF of mutual capacitance. At 100 MHz, that 1 pF has an impedance of 1.6 kohm — low enough to couple significant signal energy in a 50 ohm system.

**Inductive (magnetic field) coupling.** Current in one conductor generates a magnetic field that links through nearby conductors, inducing a voltage. The induced voltage is proportional to the mutual inductance and the rate of change of current (dI/dt). Two traces sharing a common ground return path have mutual inductance through the shared impedance. This is why ground plane cuts, splits, and slots are so problematic at RF — they force return currents to detour, increasing the shared path and the coupling.

The practical impact is that signals appear where they should not be. An aggressor signal on one trace leaks onto a victim trace, degrading signal integrity. The coupling increases with frequency, parallel run length, proximity, and the impedance of the victim circuit.

## Radiation and Unintended Antennas

Any conductor carrying alternating current is an antenna. The question is only how efficient an antenna it is. Radiation efficiency depends on the conductor's length relative to the wavelength — as the length approaches lambda/4 or lambda/2, radiation increases dramatically.

At 100 MHz, a 75 cm wire is a half-wavelength antenna. That might be an Ethernet cable, a power cord, or a long PCB trace. At 2.4 GHz, a 3 cm trace segment is a quarter-wavelength antenna. At these frequencies, unintentional radiation is a real concern — both for EMC compliance (you are transmitting interference) and for circuit performance (you are losing energy that should stay in the circuit).

Common unintended antennas:
- Cables connected to a PCB (USB, power, serial) act as antennas driven by common-mode currents
- Gaps or slots in ground planes radiate as slot antennas
- Heat sinks connected to switching nodes radiate at the switching frequency and harmonics
- Differential pair imbalance creates common-mode current that radiates

This radiation is why EMC testing exists — and why many circuits that work fine on the bench fail in an anechoic chamber. The circuit is functionally correct but radiating at levels that exceed regulatory limits.

## Enclosure Resonances and Cavity Effects

A metal enclosure is not just a shield — it is a microwave cavity. When the interior dimensions of the enclosure are comparable to a half wavelength, standing wave resonances can form inside. At resonance, energy bounces back and forth between the walls, creating field concentrations that can couple between circuits that are physically separated.

A 15 cm x 10 cm x 5 cm enclosure has its lowest resonant mode around 1.8 GHz. Above that frequency, there are increasingly many resonant modes, each with its own field pattern. Energy injected into the cavity at a resonant frequency builds up, and any conductor inside the cavity can pick it up.

This explains otherwise baffling behavior: a circuit that works with the enclosure lid off fails when the lid is on (the closed cavity has different resonances). Or adding a screw changes the performance (the screw acts as a coupling probe or detunes a resonance). These effects are invisible on the schematic and impossible to predict without electromagnetic simulation or empirical testing.

To suppress cavity resonances, RF enclosures use absorbing materials (ferrite-loaded foam), compartmentalization (internal walls that create smaller cavities with higher resonant frequencies), and strategic placement of ground vias to break up resonant modes.

## Why Moving a Wire Changes Everything

This is perhaps the most disorienting experience for someone new to RF: you move a cable, shift a component, or touch the board — and the behavior changes. In a lumped circuit, physical position is irrelevant (within reason). In an RF circuit, position is an electrical parameter.

The reasons are cumulative:

**Coupling changes.** Moving a wire changes its proximity to other conductors and to ground, altering capacitive and inductive coupling. A cable resting on a ground plane has very different common-mode impedance than the same cable lifted a few centimeters into the air.

**Antenna pattern changes.** A cable or wire that is acting as an unintended antenna has a radiation pattern that depends on its orientation and position relative to other conductors. Moving it changes the pattern, which changes how much energy it radiates and absorbs.

**Loading effects.** Your hand near a circuit introduces capacitance (a human body has roughly 100 pF to ground). At 100 MHz, 100 pF has an impedance of 16 ohm. If your hand is near a high-impedance node, you are adding a significant load. This is why RF circuits on the bench sometimes behave differently depending on where you stand.

**Resonance detuning.** If the wire or cable is part of a resonant structure (even unintentionally), moving it changes the resonant frequency. An oscillator whose frequency shifts when you move a nearby cable has parasitic coupling to that cable — the cable is part of the resonant circuit.

## The Mindset Shift

Working effectively at RF requires a fundamental change in how you think about circuits:

**From nodes to fields.** Instead of asking "what is the voltage at this node?", ask "what is the field distribution in this region?" Problems arise from field interactions, not just node voltages.

**From connections to coupling.** Two circuits do not need a wire between them to interact. They interact through shared fields, shared impedances (like a ground plane), and radiation. Isolation requires physical separation, shielding, and careful management of coupling paths.

**From wires to structures.** A wire, trace, cable, or enclosure is not just a passive container or connection. It is a structure with resonant frequencies, impedance, and radiation properties. Every physical object in and around an RF circuit is an electrical element.

**From schematics to layouts.** The schematic defines the intentional circuit. The layout defines the actual circuit, including all the unintentional coupling, radiation, and parasitic elements. In RF, the layout often matters more than the schematic. Two identical schematics with different layouts will perform differently.

**From measurement to interaction.** At RF, connecting a measurement instrument changes the circuit. A probe adds capacitance and a ground path. A cable adds an antenna. A spectrum analyzer input adds a load. The measurement is never passive — you must account for the instrument's effect on the circuit.

## Gotchas

- **Adding ground wires can make things worse** — A long ground wire at RF is an inductor, an antenna, or both. If it resonates near the operating frequency, it may amplify the problem instead of fixing it. Grounding at RF must be done through short, wide connections or solid planes.
- **Shielding a circuit is not just putting it in a box** — The box must be properly sealed (gaps smaller than lambda/20 at the highest frequency of concern), and all cables entering the box must be filtered or bonded to the enclosure. A box with a cable-sized gap is a resonant cavity with an antenna attached.
- **Hand capacitance is a debugging clue, not just a nuisance** — If the circuit's behavior changes when you bring your hand near it, you have identified a high-impedance node that is coupling to the environment. This often points to the source of instability or unwanted feedback.
- **Resonances hide until you sweep frequency** — A cavity resonance at 2.1 GHz will not show up if you are only testing at 915 MHz. Broadband sweeps and EMC pre-scans are the only way to find unexpected resonances before they cause problems in the field.
- **The "same" circuit works differently on different boards** — Layout differences, ground plane integrity, stackup changes, and even solder mask thickness can shift RF behavior. If a proven design stops working on a new board revision, the layout and fabrication are the first places to look, not the components.
