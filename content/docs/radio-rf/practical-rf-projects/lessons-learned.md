---
title: "Lessons Learned from Real Builds"
weight: 60
---

# Lessons Learned from Real Builds

RF wisdom comes from building things that do not work and figuring out why. Every rule of thumb in this section was learned the hard way — through failed circuits, wasted debugging hours, and the slow realization that RF design rewards discipline and punishes shortcuts. These lessons are not theoretical; they come from real builds and real frustrations, distilled into principles worth remembering.

## Start with Receive, Then Transmit

Receiving is legal everywhere, requires no license, and teaches most of the same RF concepts as transmitting. A receiver teaches about sensitivity, selectivity, impedance matching, noise, filtering, and antenna behavior. It is possible to receive broadcast FM, amateur radio, weather satellites, aircraft transponders, and ISM band devices — all without any regulatory concern.

Transmitting adds regulatory requirements (licensing, power limits, spurious emission standards) and the risk of causing interference. It also adds the complexity of power amplifiers, harmonic filtering, and load matching under power. Starting by receiving means having a much better understanding of RF behavior by the time transmitting begins.

A practical receive-first path:
1. SDR receiver with a simple antenna — observe the electromagnetic environment
2. Direct conversion receiver build — understand frequency conversion
3. Antenna experiments with a NanoVNA — understand impedance and matching
4. Only then, a low-power transmitter into a dummy load

See [Simple Transmitters & Receivers]({{< relref "/docs/radio-rf/practical-rf-projects/simple-transmitters-and-receivers" >}}) for specific project suggestions.

## Measure Before Changing

When something does not work, the temptation is to start changing things: swap a capacitor, reroute a trace, add a ferrite bead. Resist this urge until the current state has been measured and documented.

The measurement establishes a baseline. Without it, there is no way to know whether a change improved things, made them worse, or did nothing. With it, there is data: "Before adding the ferrite bead, the oscillation was at 430 MHz with -15 dBm amplitude. After adding the bead, the oscillation moved to 510 MHz at -25 dBm." This is useful information even though the problem is not fully solved — the bead shifted the frequency and reduced the amplitude.

The baseline should include:
- DC voltages at all active devices (comparing expected vs actual)
- Spectrum analyzer sweep showing all signals present (wide span first)
- S-parameter measurements if a VNA is available
- Power supply current (compare to expected; excess current suggests oscillation)
- Temperature of active devices (infrared thermometer or thermal camera if available)

Record these measurements. Write them down or screenshot them. Memory is unreliable, especially deep in a debugging session.

## Connectors and Cables Fail More Often Than Circuits

This sounds trivial until three hours have been spent debugging a circuit that was fine while the SMA connector on the test cable had an intermittent center pin. Connectors are mechanical components subject to wear, corrosion, damage from overtorquing, and damage from cross-threading. Cables flex, strain, and develop internal faults.

When a measurement is unreliable or irreproducible:
1. Wiggle every connector while watching the measurement. If the reading jumps, the problem is found.
2. Swap the cable for a known-good one.
3. Check for bent center pins, splayed outer contacts, and corroded surfaces.
4. Verify that SMA connectors are tightened to 5 in-lbs (use a torque wrench for repeatable measurements).

A set of known-good cables, verified with a VNA (low return loss, stable under flexing), is one of the most valuable things on an RF bench. Label them, protect them, and do not let anyone step on them.

## Shielding Is Easier to Add Than to Remove

If a circuit might need shielding, add shielding. If the final product will be in an enclosure, design the PCB with a shield can footprint and ground pad ring from the beginning. Adding a shield to a board designed for one costs $0.10 in extra copper and $0 in design time. Retrofitting a shield to a board that was not designed for one requires rework, bodge wires, and often a board respin.

Shield cans (stamped metal covers soldered to the PCB) are available from Laird, TE Connectivity, and others in standard sizes from 10 x 10 mm to 50 x 50 mm. They provide 40-60 dB of isolation between sections at frequencies up to several GHz.

Practical shielding decisions:
- **Always shield oscillators and PLLs**: Their output radiates and couples into everything.
- **Shield the LNA/front-end of receivers**: The most sensitive part of the signal chain is the most vulnerable to interference.
- **Separate transmit and receive paths**: If both are on the same board, metal walls between them are essential.
- **Shield digital circuits from analog/RF circuits**: Clock harmonics extend into the GHz range and interfere with RF circuits. See [Enclosure Effects on RF Systems]({{< relref "/docs/radio-rf/practical-rf-projects/enclosure-effects-on-rf" >}}) for more detail.

## Simulation Gets Close; the Bench Tells the Truth

RF simulators (SPICE for circuit behavior, HFSS/Sonnet/openEMS for electromagnetic simulation) are powerful tools that get a design in the right neighborhood. A well-modeled circuit in simulation might predict 18 dB of gain where the real circuit delivers 16 dB. A simulated filter might show 30 dB of stopband rejection where the real one achieves 25 dB. These differences come from:

- Component tolerances (5% capacitors, 2% inductors)
- Parasitic elements not included in the model (trace inductance, pad capacitance, via impedance)
- Layout coupling not captured in schematic-level simulation
- Manufacturing variations (PCB dielectric constant tolerance, etch variation)
- Temperature effects

Simulation is essential for getting a first design that is in the ballpark. Without it, the process is guessing. But treating simulation results as ground truth leads to disappointment. Build it, measure it, compare to simulation, and understand the discrepancies.

## The First Prototype Will Not Work as Expected

Plan for iteration. Budget time and PCBs for at least two board spins. The first prototype reveals problems that simulation did not predict, and measurement of the first build informs the second design.

Practical implications:
- Order three or more PCBs — the first one may be modified and possibly destroyed during debugging.
- Include test points, pad-out components, and unpopulated footprints for modifications. A footprint for a 0-ohm resistor that can be replaced with a ferrite bead costs nothing but enables rapid debugging.
- Use socketed components where possible for RF-critical parts (crystals, filters). Being able to swap a crystal without desoldering saves time.
- Keep schematics and layout files organized so that changes for rev 2 can be made quickly.

The goal of prototype 1 is not perfection — it is data. Everything learned from prototype 1 makes prototype 2 better.

## Documentation Matters

Record measurements, changes, and results. When a circuit is modified, write down what changed, why, and what happened. Six months from now, a board with a ferrite bead soldered on a bodge wire will prompt no memory of why it is there — unless it was documented.

Useful things to record:
- **Date and conditions**: Temperature, humidity, power supply type, test equipment used
- **Schematic changes**: What was modified from the original design, and why
- **Measurement data**: Screenshots of spectrum analyzer displays, VNA plots, oscilloscope captures
- **What worked and what did not**: The failures are as valuable as the successes
- **Open questions**: Things noticed but not investigated, hypotheses to test next time

A lab notebook (physical or digital) is the single most valuable tool that costs nothing and is used too rarely.

## RF Hygiene: The Boring Stuff That Matters

Professional RF labs are obsessive about cleanliness, calibration, and connector care. There is a reason: at RF frequencies, the small stuff matters.

- **Clean connectors**: Fingerprints, flux residue, and dust on SMA connector interfaces cause loss and reflection. Clean with isopropyl alcohol and a lint-free swab before precision measurements.
- **Calibrated cables**: A cable with unknown loss is a source of unknown error. Measure cable loss at the frequencies of interest and label the cable.
- **Known-good references**: A 50-ohm termination, a calibrated attenuator, and a known-frequency signal source allow verification that the measurement setup is working before trusting it with an unknown device.
- **Torque wrenches for SMA**: 5 in-lbs. Every time. Over-torquing damages connectors. Under-torquing gives unreliable contact. A $30 torque wrench pays for itself the first time it prevents a damaged connector.
- **Proper connector mating**: Never rotate the body of an SMA connector — only rotate the nut. Rotating the body damages the center pin interface. Never force a cross-threaded connection.

## The Value of a Reference Design That Works

When debugging a new circuit, having a known-working reference to compare against is invaluable. If a 2.4 GHz radio is under development and an evaluation board from the IC manufacturer works correctly, it is possible to:

- Compare the S11 measurement to the eval board's S11
- Compare DC bias currents
- Compare output power and spectral purity
- Identify exactly where the new design diverges from the known-good reference

Many IC manufacturers provide free or low-cost evaluation boards. TI, Analog Devices, Nordic Semiconductor, and Semtech all offer eval kits for their RF ICs. These boards are designed by the IC manufacturer's applications engineers, and they work. When a new board does not work, the eval board shows what "working" looks like.

Even without a manufacturer's eval board, having a previous version of the same design that worked becomes a reference. This is another reason to keep old boards and document what worked.

## Tips

- Establish a "measure before touching" discipline — take a full baseline (DC voltages, spectrum sweep, S-parameters) before changing any component, so that every modification has a documented before-and-after comparison
- Invest in a set of known-good SMA cables verified on a VNA and reserve them exclusively for measurement — mixing measurement cables with general-purpose cables introduces unknown errors
- Include shield can footprints and ground pad rings on every RF PCB layout, even if shielding seems unnecessary — the cost is negligible and retrofitting a shield later is far more expensive
- Keep a physical or digital lab notebook with dated entries for every build session, including failed experiments, because past failures become the most useful reference material over time

## Caveats

- **Changing multiple things at once** — If two things are changed and the circuit improves, there is no way to know which change helped. Maybe one helped and the other hurt, and the net improvement was smaller than it could have been. Change one thing, measure, record, then change the next thing
- **Optimism about prototypes** — "It will work on the first try" is almost never true for RF circuits. Budget time and money for revision. Under-promise delivery dates
- **Ignoring thermal effects** — A circuit that works at 25C may fail at 0C or 60C. Transistor gain, capacitor values, crystal frequencies, and inductor permeability all change with temperature. If the product operates outdoors, test across the temperature range early
- **Trusting datasheets blindly** — Datasheets specify typical values under specific conditions. Actual conditions (frequency, temperature, supply voltage, load impedance) may be different. The "typical" gain of an amplifier might vary by 3 dB from unit to unit. Design with margins
- **Neglecting the power supply** — A clean, well-decoupled power supply is the foundation of every RF circuit. A noisy supply undermines everything downstream. Verify supply quality before blaming the RF circuit
- **Working alone in a vacuum** — RF has a long history and a large community. Forums (eevblog.com, groups.io, reddit.com/r/amateurradio), books (ARRL Handbook, Experimental Methods in RF Design), and local ham radio clubs are resources that can save weeks of debugging. Ask for help when stuck

## Bench Relevance

- A circuit that draws significantly more supply current than expected (often 2-3x) without obvious cause is likely oscillating at a frequency outside the intended band — a wide-span spectrum sweep confirms or rules out parasitic oscillation
- Swapping a cable and seeing a measurement suddenly become stable and repeatable confirms that the original cable or connector was the source of the anomaly, not the circuit under test
- A prototype that works on the bench but fails in the enclosure (oscillation, frequency shift, gain change) indicates enclosure interaction — testing with and without the lid isolates whether cavity resonance or dielectric loading is the cause
- A component that measures within tolerance at DC but causes unexpected RF behavior (such as a bypass capacitor with high ESR at the operating frequency) is revealed by comparing the circuit's performance with a substitute component from a different lot or manufacturer
