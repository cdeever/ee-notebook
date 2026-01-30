---
title: "Environmental Testing"
weight: 20
---

# Environmental Testing

The lab bench is a lie — a comfortable, temperature-controlled, vibration-free, ESD-safe lie. Every circuit eventually leaves the bench and enters a world of temperature swings, humidity, mechanical shock, and electromagnetic interference. Environmental testing is about finding out whether your design survives that transition before your users do.

## Temperature Testing

Temperature is the most common environmental stress and the one most likely to reveal marginal designs. Semiconductor parameters shift with temperature — thresholds drift, leakage currents increase, oscillator frequencies change, and battery capacity drops. A design that works perfectly at 25C may misbehave at 0C or 85C.

The three fundamental temperature tests are cold start, hot soak, and thermal cycling. Cold start powers the device from a cold state — this stresses oscillator startup, LCD contrast, battery impedance, and any component with temperature-dependent initialization. Hot soak runs the device at elevated temperature for an extended period — this stresses power dissipation, electrolytic capacitor lifetime, and thermal runaway potential. Thermal cycling repeatedly moves between temperature extremes — this stresses solder joints, mechanical connections, and any interface between materials with different thermal expansion coefficients.

## Temperature Ranges

The appropriate temperature range depends on the application. Industry-standard ranges provide useful reference points:

- **Commercial**: 0C to 70C. Indoor, climate-controlled environments. Consumer electronics.
- **Industrial**: -40C to 85C. Factories, outdoor equipment, non-climate-controlled spaces.
- **Automotive**: -40C to 125C. Under-hood and exposed vehicle locations.
- **Military**: -55C to 125C. Extreme environments with high reliability requirements.

When selecting components, every part in the BOM must be rated for the intended temperature range. A single commercial-rated component in an industrial design creates a weak link. Datasheets specify operating temperature range — check it for every critical component, not just the main IC.

## Humidity

Moisture causes problems that temperature alone doesn't reveal. Condensation on a PCB can create leakage paths between traces, especially at high-impedance nodes. Moisture absorption in FR4 substrate changes dielectric properties. Conformal coatings and sealed enclosures help, but they add cost and complicate rework.

The most dangerous humidity condition is condensation — when a cold board enters a warm, humid environment and water droplets form on the surface. This can cause short circuits at voltages as low as a few volts if the trace spacing is tight enough. Thermal cycling through the dew point is the standard test for condensation susceptibility.

For designs that will see humidity, consider the PCB material, conformal coating, connector sealing, and the spacing of high-impedance or high-voltage traces. None of these are exotic measures — they're standard practice for anything that lives outside a climate-controlled room.

## Vibration and Shock

Mechanical stress reveals weaknesses that purely electrical testing misses. Vibration can loosen connectors, fatigue solder joints (especially on heavy components like large capacitors or transformers), and cause intermittent contact failures. Shock — from drops, impacts, or transportation — can crack ceramic capacitors, break PCBs at stress concentration points, and dislodge through-hole components.

For most bench-top or handheld projects, the primary mechanical concern is drop testing: what happens when the device falls off a table? The answer depends on the enclosure, the mounting of the PCB within it, and the mechanical robustness of the solder joints. Heavy components should have mechanical support beyond their solder connections — adhesive, brackets, or strain relief.

Formal vibration testing requires a shaker table, which is expensive equipment. For prototype-stage testing, simpler approaches work: shake the assembled unit by hand while monitoring for intermittent failures, drop it from representative heights onto representative surfaces, and transport it in a vehicle on rough roads. These are crude but surprisingly effective at finding mechanical weaknesses.

## ESD Testing

Electrostatic discharge is a real-world threat that's easy to ignore on the bench, where you're wearing a wrist strap and working on a grounded mat. Users don't have ESD protection. They touch buttons, plug in cables, and walk across carpets in dry winter air.

The IEC 61000-4-2 standard defines ESD test levels: contact discharge at 2, 4, 6, and 8 kV, and air discharge at 2, 4, 8, and 15 kV. For consumer products, surviving level 2 (4 kV contact, 8 kV air) is a common target. Every external connector, button, switch, and exposed metal surface is a potential ESD entry point.

ESD protection starts at the schematic level — TVS diodes, series resistors, and proper grounding at every external interface. But it's validated through testing, and testing often reveals paths that the schematic analysis missed: unexpected coupling through enclosure gaps, sneak paths through internal wiring, or protection components that don't respond fast enough.

## EMC Testing

Electromagnetic compatibility has two sides: emissions (does the device radiate or conduct excessive electromagnetic energy?) and immunity (does the device malfunction when exposed to external electromagnetic fields?). Both matter for any product that will be sold commercially, and both can cause problems even for personal projects if the design operates near sensitive equipment.

Full EMC testing requires an anechoic chamber or OATS (Open Area Test Site) and expensive instrumentation. For prototype-stage work, simpler approaches give useful early data: a near-field probe connected to a spectrum analyzer can identify major emission sources on the board. A handheld radio (walkie-talkie) keyed near the device provides a crude immunity test. These aren't substitutes for formal testing, but they catch gross problems early enough to fix them cheaply.

Common EMC failures include excessive emissions from switching power supplies, clock harmonics radiating from unshielded traces, and susceptibility at communication interfaces. Most EMC problems are layout problems — fixing them means rerouting traces, adding ground planes, or improving shielding, all of which are easier to address early in the design.

## When to Test

Environmental testing is most useful when it happens early enough to influence the design — but the design must be representative enough that the results are meaningful. Testing a breadboard prototype for vibration resistance tells you nothing useful. Testing the final production unit is too late to make changes cheaply.

The sweet spot is a prototype that's physically representative of the final design: same PCB, same components, same enclosure (or a reasonable approximation). This is typically the second or third hardware revision, after the basic electrical functionality has been validated.

## Budget-Friendly Environmental Testing

Professional environmental test chambers cost thousands to tens of thousands of dollars. For small-scale and learning projects, creative alternatives work for initial screening:

- **Cold testing**: A household freezer reaches -18C to -20C. Not -40C, but enough to catch many cold-start problems.
- **Hot testing**: A heat gun with a thermocouple for monitoring. Apply heat carefully to avoid localized hot spots. An oven set to a known temperature works for soak testing.
- **Humidity**: A sealed container with a wet sponge creates a high-humidity environment. Not calibrated, but sufficient to check for obvious condensation problems.
- **Vibration**: A car ride on a rough road, or a washing machine (in a padded container) for crude vibration exposure.

These are screening tests, not qualification tests. They find gross problems cheaply. They don't replace formal environmental testing when the application demands it — but for learning and prototyping, they're far better than testing only at room temperature on a clean bench.

## Gotchas

- **Room temperature is not representative.** The bench is 25C with stable power and no vibration. The real world is none of these things. If you've only tested at room temp, you haven't really tested.
- **Component temperature ratings are not margins.** A component rated to 85C will work at 85C — but its performance at that limit may be significantly degraded compared to 25C. Derating is not optional.
- **Condensation is sneaky.** It doesn't take tropical humidity. Moving a cold device into a warm room can cause condensation even in moderate climates. This is a real failure mode, not a theoretical one.
- **ESD damage can be latent.** A device that survives an ESD event may have weakened components that fail hours or weeks later. The absence of immediate failure doesn't mean the device is undamaged.
- **EMC problems are layout problems.** Adding filters and shields after the layout is done is expensive and often ineffective. EMC should be considered during layout, not discovered during testing.
- **Screening is not qualification.** A freezer test is useful for finding obvious cold-start problems. It does not qualify a design for -40C operation. Know the difference between "we checked" and "we proved."
