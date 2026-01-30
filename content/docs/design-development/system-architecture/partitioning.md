---
title: "Partitioning Analog, Digital, Power & RF"
weight: 20
---

# Partitioning Analog, Digital, Power & RF

Different signal domains follow different physical rules, and mixing them carelessly is one of the most common sources of "it works on the bench but fails in the product" problems. Partitioning is the practice of identifying which parts of the design belong to which domain and organizing the architecture so that each domain gets the environment it needs without contaminating the others.

## Why Partitioning Matters

Every digital edge generates noise. Every switching regulator radiates. Every analog signal is a victim waiting to be corrupted. These are not exotic corner cases — they are the normal behavior of electronic circuits. Partitioning doesn't eliminate these effects, but it manages them by controlling where noise is generated, where sensitive circuits live, and how they're separated.

A design that mixes analog, digital, power, and RF circuits without partitioning will probably work — on a bench, with short wires, at room temperature, with a lab supply. It will start to fail when traces get longer, loads get heavier, temperature changes, or EMI appears. Partitioning is what makes a design robust enough to survive conditions beyond the bench.

## Domain Characteristics

Understanding what each domain needs is the first step in deciding how to separate them:

### Analog

Analog circuits are the sensitive residents of the board. They care about:

- **Low noise on supply rails.** A few millivolts of power supply ripple can show up directly in the output of a high-gain amplifier. Analog sections often need their own regulation or extensive filtering.
- **Clean ground references.** Ground bounce from digital switching can shift the reference voltage of analog circuits. Shared ground paths between analog and digital sections are a common noise coupling path.
- **Physical isolation from noise sources.** Distance from switching regulators, clock oscillators, and high-speed digital buses reduces capacitive and inductive coupling.
- **Controlled impedances for signal paths.** High-impedance analog inputs pick up interference easily. Keeping analog signal traces short and away from digital traces is essential.

### Digital

Digital circuits are the noisy neighbors:

- **Fast edges generate broadband noise.** A 100 MHz clock isn't just 100 MHz — its harmonics extend into the GHz range. Every digital edge couples energy into nearby traces and planes.
- **Switching currents create ground bounce.** When multiple CMOS outputs switch simultaneously, the transient current through the ground inductance creates voltage spikes on the ground plane.
- **Tolerant of moderate supply noise.** Digital logic has noise margins — a 3.3V CMOS input doesn't care about 100 mV of ripple on its supply. This tolerance means digital sections can share a regulator that would be too noisy for analog circuits.
- **Clock routing requires care.** Clock signals are the highest-frequency, most repetitive signals on the board. They should be routed away from analog sections and kept short.

### Power

Power circuits handle high currents and generate magnetic fields:

- **Switching regulators radiate.** The inductor in a buck converter has a time-varying magnetic field that couples into nearby circuits. Placement and orientation of the inductor matters.
- **High-current loops radiate.** The switching current loop (input capacitor, switch, inductor, output capacitor) should be as small as possible to minimize radiated EMI.
- **Thermal dissipation needs space.** Power components get hot and need copper area or heatsinks for cooling. Cramming them into a corner creates hot spots.
- **Input and output capacitor placement is critical.** Capacitors must be close to the regulator pins with short, wide traces. Long traces to capacitors add inductance that degrades regulator performance.

### RF

RF circuits are the prima donnas — demanding and unforgiving:

- **Impedance control is essential.** A 50-ohm transmission line that varies by 10% creates reflections that degrade signal quality. RF traces need controlled stackups and consistent geometry.
- **Shielding may be required.** RF circuits both radiate and are susceptible. Shield cans, guard traces, and ground plane isolation are common partitioning techniques.
- **Placement is dictated by physics.** The antenna, matching network, and RF front-end must be co-located with minimal trace length. You can't route a 2.4 GHz signal across the board and expect it to work.
- **Ground plane continuity under RF traces.** Any gap or slot in the ground plane under an RF trace creates an impedance discontinuity and increases radiation.

## Physical Partitioning Strategies

Partitioning happens at multiple physical levels:

**Board zoning.** The most common approach: divide the PCB into regions dedicated to each domain. Analog in one area, digital in another, power in a third. Keep sensitive analog inputs far from switching regulators and high-speed digital buses.

| PCB region | Typical contents | Placement priority |
|---|---|---|
| Analog zone | Op-amps, ADCs, sensor interfaces, precision references | Away from switching noise, near signal connectors |
| Digital zone | MCU, memory, logic, oscillators | Central, with good decoupling, away from analog inputs |
| Power zone | Regulators, inductors, power MOSFETs | Board edge or dedicated area, near input connector |
| RF zone | Antenna, matching network, RF IC | Board edge near antenna, shielded from digital noise |

**Separate boards.** For highly sensitive designs, different domains go on different PCBs connected by cables or board-to-board connectors. This provides maximum isolation at the cost of additional connectors, cables, and enclosure volume.

**Separate enclosures.** The ultimate isolation — physically separate boxes with only cables between them. Common in test and measurement equipment where the sensitive analog front-end is in a shielded enclosure separate from the digital processing.

## Electrical Partitioning Strategies

Physical separation alone isn't enough. Electrical partitioning controls how power and ground are shared between domains:

**Power domain separation.** Use separate regulators for analog and digital sections. A low-noise LDO for analog, a switching regulator for digital. The switching regulator's output ripple stays out of the analog supply, and the analog section's load changes don't disturb the digital supply.

**Ground strategy.** This is one of the most debated topics in electronics design, and the "right" answer depends on the specific design. Some principles I've found reliable:

- Use a continuous ground plane wherever possible. Splits and cuts in the ground plane create impedance and force return currents to detour, which increases noise coupling.
- If analog and digital grounds must be separated, connect them at a single well-defined point (usually near the ADC).
- Don't let digital return currents flow through analog ground regions. Route digital signals over digital ground, analog signals over analog ground.
- The ADC is the bridge between domains. Its analog and digital ground pins define the connection point between the two ground regions.

**Signal isolation.** Where signals cross domain boundaries, consider:

- Level translators for voltage domain crossings
- Optocouplers or digital isolators for galvanic isolation
- Differential signaling for noise-immune communication between boards
- Filtering at domain boundaries to prevent noise from propagating

## Cross-References

Partitioning decisions made at the architecture level have direct consequences in layout and testing. The physical placement of analog and digital sections determines routing constraints, ground plane design, and EMC performance. Similarly, the power architecture (covered in [Interfaces & Boundaries]({{< relref "/docs/design-development/system-architecture/interfaces-and-boundaries" >}})) defines how domains interact electrically.

## Gotchas

- **A ground plane split is not always the answer.** Splitting the ground plane forces return currents to take long paths around the split, which can increase noise instead of reducing it. A solid ground plane with careful component placement often works better.
- **ADC placement is a partitioning decision.** The ADC sits at the boundary between analog and digital domains. Its physical location on the board determines where the domain boundary falls. Place it at the transition between analog and digital zones, not deep in one or the other.
- **Switching regulator inductors have a preferred orientation.** The magnetic field from an inductor is directional. Orient inductors so their field doesn't couple into sensitive analog traces or components. Rotating an inductor 90 degrees can make a measurable difference.
- **Clock traces are the worst offenders.** A clock signal is the highest-frequency, most repetitive signal on the board. Keep clock traces as short as possible, away from analog signals, and over a continuous ground plane. A clock trace routed near an analog input will couple into it.
- **Don't partition in the schematic and then ignore it in the layout.** A schematic with cleanly separated analog and digital sections is meaningless if the layout intermixes them. The partitioning must be carried through from architecture to physical placement.
- **RF sections need their own ground via stitching.** The ground plane under RF traces should be densely via-stitched to the reference plane to maintain a low-impedance return path and prevent cavity resonances.
