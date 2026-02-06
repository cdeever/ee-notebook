---
title: "How Internal Behavior Leaks Out of ICs"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# How Internal Behavior Leaks Out of ICs

A well-designed IC presents a clean interface: defined inputs, defined outputs, specified behavior. But the package boundary is not a perfect seal. Internal activity creates physical side effects — current transients on supply pins, heat conducted through the package, electromagnetic fields radiating from bond wires and die traces — that escape through channels the datasheet either underspecifies or ignores entirely. These leaks are not defects in the IC; they are consequences of physics that no amount of integration can eliminate.

Understanding leakage mechanisms matters because the leaked behavior doesn't disappear — it becomes an input to something else. A supply current spike from one IC becomes noise on the power rail feeding another IC. Heat from a power stage shifts the operating point of a nearby precision reference. Radiated EMI from a switching converter corrupts a sensitive analog measurement. The leaked behavior crosses the abstraction boundary and violates the independence assumption that the rest of the design relies on.

## Supply Current Modulation

Every IC draws current from its supply pins, and that current is never constant. Digital ICs draw current spikes on every clock edge as internal capacitances charge and discharge. Analog ICs draw current that varies with signal level — a class AB output stage draws high current during large signal swings and low current at idle. Switching regulators draw pulsed current at their switching frequency.

This varying current flows through the impedance of the supply network — trace resistance, via inductance, plane impedance, connector resistance — and creates voltage variations on the supply rail. The voltage variation is visible to every other IC on the same rail. The internal behavior of one IC has leaked through the power supply into every other IC that shares it.

The leakage is frequency-dependent. At low frequencies, the supply network's impedance is low (dominated by capacitor ESR and plane resistance), and the voltage variation is small. At higher frequencies — tens to hundreds of megahertz, where digital switching and resonances dominate — the supply impedance can be much higher, and the resulting voltage noise is correspondingly larger. The worst leakage often occurs at frequencies where the supply network has impedance peaks due to anti-resonances between decoupling capacitors.

## Thermal Leakage

Every IC dissipates power, and that power becomes heat. The heat flows through the package, through solder joints, through copper planes, and through the air. Along the way, it raises the temperature of everything in the thermal path — including other components that may be temperature-sensitive.

Thermal leakage is slow — thermal time constants in PCB assemblies range from seconds to minutes — but persistent. A power amplifier that runs hot during signal peaks raises the temperature of a nearby voltage reference gradually. The reference's output drifts, and the drift is correlated with the amplifier's signal activity, but with a time delay that makes the correlation non-obvious. The thermal path connects two components that the schematic shows as electrically independent.

The most insidious thermal leakage occurs within multi-function ICs. A microcontroller running computationally intensive code heats its die, which shifts the offset of its internal ADC. A power management IC's internal regulator heats the die, drifting the reference voltage of an adjacent regulator on the same die. These internal thermal couplings are usually not specified in datasheets because they depend on operating conditions the IC designer can't fully predict.

## Electromagnetic Radiation

Internal conductors carrying rapidly changing currents act as antennas. Bond wires, die traces, and package leads radiate electromagnetic fields proportional to the rate of current change (di/dt) and the effective loop area. This radiation couples into nearby conductors — PCB traces, other IC pins, cables — and appears as noise.

The radiation mechanism has several distinct flavors:

**Near-field magnetic coupling** dominates at short distances. A bond wire carrying a fast current pulse creates a magnetic field that induces voltage in nearby bond wires or PCB traces. The coupling strength depends on the loop area, the separation distance, and the frequency content of the current pulse. This mechanism is why the internal routing of an IC's bond wires — a detail completely invisible from outside — can determine how much noise appears on adjacent pins.

**Near-field electric coupling** occurs when rapidly changing voltages on internal nodes capacitively couple to nearby conductors. A high-speed digital output toggling inside an IC creates an electric field that can couple into adjacent analog input pins through inter-pin capacitance in the package. The coupling is typically small (femtofarads to picofarads of inter-pin capacitance), but at high frequencies and with high-impedance victims, even small coupling can be significant.

**Conducted emission** travels through the IC's pins to the PCB. High-frequency currents generated internally — by oscillators, switching logic, or output drivers — exit through supply pins, ground pins, and signal pins, and then radiate from the PCB traces they flow through. The IC's internal behavior has leaked first through the pins and then through the board.

## Substrate Coupling

In monolithic ICs, all circuits share a common silicon substrate. This substrate is not an ideal insulator — it has finite resistivity and parasitic capacitance to every junction on the die. Currents injected into the substrate by one circuit can propagate to other circuits on the same die.

Substrate coupling is the primary mechanism by which digital switching noise corrupts analog circuits in mixed-signal ICs. A digital output buffer switching from low to high injects displacement current into the substrate through the drain junction capacitance of its output transistors. This current spreads through the substrate and appears as a voltage perturbation at the junctions of analog transistors elsewhere on the die. The analog circuit sees a noise pulse that's correlated with digital activity but arrives through a path that's entirely internal to the IC and invisible from outside.

IC designers mitigate substrate coupling with guard rings, deep trenches, and careful floor planning. These measures reduce the coupling but don't eliminate it. The residual coupling is often characterized in the datasheet as "channel-to-channel crosstalk" or "digital feedthrough," but the specification typically covers only one frequency or one specific test condition. The actual coupling depends on the specific activity pattern of the digital circuits, which varies with the application.

## Pin-to-Pin Coupling

The IC package itself creates coupling paths between pins. Lead frames, bond wire routing, and shared die pads create parasitic mutual inductance and capacitance between pins. Two pins that are electrically independent inside the die can be coupled through the package:

- **Mutual inductance between bond wires** couples fast current transients from one pin to another. A ground pin carrying return current from a noisy digital output can induce voltage noise on an adjacent analog input pin.
- **Shared lead frame segments** create common impedance coupling. Two ground pins connected to the same internal lead frame segment share the lead frame's resistance and inductance. Current flowing through one ground pin creates a voltage drop that appears on the other.
- **Package capacitance** between adjacent pins or between pins and the die pad creates high-frequency coupling paths. These capacitances are typically small (sub-picofarad) but can be significant for high-impedance or high-frequency circuits.

## Tips

- When a sensitive circuit is near a noisy IC, the first leakage path to investigate is the power supply. Measuring the supply rail at both ICs with adequate bandwidth (oscilloscope, not DMM) reveals whether the noisy IC's current transients are appearing at the sensitive IC's supply pins.
- Thermal leakage can be identified by correlation with time. If a measurement drifts over seconds to minutes after a load change, thermal coupling is a likely mechanism. An IR camera or a thermocouple on the suspect component confirms or rules out the thermal path.
- When debugging noise in a mixed-signal IC, disabling internal peripherals one at a time (timers, communication interfaces, PWM outputs) while monitoring the analog measurement can isolate which internal activity is leaking through the substrate or supply.
- Package pin assignments matter for leakage. ICs with analog inputs adjacent to digital outputs have higher pin-to-pin coupling risk. Reviewing the package pinout diagram — not just the schematic symbol — reveals these physical adjacencies.

## Caveats

- **Leakage mechanisms combine** — A single symptom (noise on an analog measurement) might result from supply coupling, substrate coupling, and electromagnetic radiation simultaneously. Fixing one mechanism may reduce the symptom without eliminating it, leading to the false conclusion that the first mechanism wasn't the cause.
- **Leakage is application-dependent** — An IC that exhibits negligible leakage in one application may leak significantly in another because the sensitive victim circuit is different, the supply impedance is different, or the layout places different conductors in the coupling path. Leakage characterization from one design doesn't transfer directly to another.
- **IC manufacturers test under specific conditions** — Crosstalk and noise specifications in datasheets are measured under controlled conditions with defined loads and source impedances. Real applications rarely replicate these conditions exactly, so the actual leakage may differ from the datasheet values in either direction.
- **Shielding addresses radiation but not conduction** — A metal shield over a noisy IC reduces radiated coupling but does nothing about supply current modulation, thermal leakage, or conducted emissions through the pins. The most common leakage paths are conducted, not radiated.
