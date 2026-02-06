---
title: "Integrated Analog Devices"
weight: 15
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Integrated Analog Devices

An integrated analog device is a circuit frozen into silicon. Op-amps, voltage regulators, comparators, references, audio amplifiers — these are not atomic components like a resistor or a transistor. They are complete circuits: dozens to hundreds of transistors, resistors, capacitors, and bias networks, designed together, fabricated together, and trimmed together on a single die. The package hides the schematic, but the schematic is still in there, and it still obeys the same circuit laws as anything built on a breadboard.

Understanding integrated analog devices at an architectural level — what's inside, what assumptions the designer made, what changes when a circuit moves into silicon — is essential for using them well and for diagnosing what's happening when they don't behave as expected.

## Why Analog Circuits Move Into Silicon

Discrete analog circuits work. A perfectly good differential amplifier can be built from two matched BJTs, a handful of resistors, and a current source. But certain problems get dramatically easier when integrated onto a single die:

### Matching and Thermal Coupling

- **Matching** — Two transistors on the same die, fabricated in the same process step, sitting microns apart, will have nearly identical V_BE, beta, and V_th. Discrete components from the same production batch might differ by 10-20%. On-die matching can be better than 0.1%. Differential pairs, current mirrors, and bandgap references all depend on matching, not absolute accuracy
- **Thermal coupling** — Devices on the same die are at nearly the same temperature. This makes temperature-compensated circuits (bandgap references, bias networks) far more effective than discrete equivalents where components are at different temperatures and track differently

### Complexity Without Assembly Cost

- **Complexity without assembly cost** — Adding transistors to an IC is nearly free. A discrete current mirror is two transistors, two resistors, and careful layout. An integrated one is just part of the mask. This means IC designers use topologies that would be impractical to build discretely — cascode stacks, Wilson mirrors, folded cascodes, startup circuits

### Trimming and Parasitics

- **Trimming** — Laser trimming or fuse-blowing during production can adjust resistor values, offset voltages, or reference levels on each individual die. This achieves precision that would require hand-selection of discrete components
- **Parasitics under control** — The designer knows the parasitic capacitances, substrate coupling, and interconnect resistance at design time. In a discrete circuit, parasitics depend on layout, wiring, and the PCB — and they change every time something is rearranged

### The Tradeoff: Loss of Flexibility

The tradeoff: flexibility is lost. A discrete circuit can be modified, probed at every node, and adapted. An integrated circuit does exactly what the designer intended, with the constraints the designer chose. If those constraints don't match the application, workarounds must be implemented externally or a different part selected.

## What Changes When a Circuit Moves Into Silicon

The building blocks inside an analog IC are the same devices covered in [Semiconductors]({{< relref "/docs/fundamentals/semiconductors" >}}) — [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}), [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}), diodes, resistors, capacitors — but integration changes which parameters can be relied on and which cannot.

### Matching Over Absolute Accuracy

IC resistors have poor absolute accuracy — process variations can shift values by 20% or more. But two resistors of the same type, same geometry, placed side by side, will **ratio** to within a fraction of a percent. The same applies to transistor pairs.

This is why integrated circuits are designed around **ratios and differences**, not absolute values. A bandgap reference doesn't depend on any single V_BE being exactly 0.6 V — it depends on the *difference* in V_BE between two transistors running at different current densities. A current mirror doesn't depend on beta being 200 — it depends on two transistors having the *same* beta.

If analog IC schematics look different from textbook discrete circuits, this is the reason. The design style is fundamentally ratio-metric.

### Layout Is Circuit

In a discrete design, the schematic is drawn first and the PCB laid out second. In an IC, layout and schematic are intertwined. The physical placement of devices determines:

- Matching quality (closer = better matched)
- Thermal coupling (affects bias stability)
- Parasitic capacitance (affects bandwidth and stability)
- Substrate currents (can cause latch-up or signal coupling)

IC designers use techniques like common-centroid layout (interleaving two devices so process gradients affect both equally) and dummy structures (placing unused devices at the edges of arrays where edge effects degrade matching). These are invisible to the user but fundamental to how the IC achieves its specifications.

### Thermal Coupling as a Feature

On a PCB, a power transistor might be 5 cm from a reference transistor, with a 20°C temperature gradient between them. On a die, they can be microns apart, at essentially the same temperature.

IC designers exploit this deliberately. Bandgap voltage references work because two transistors track each other's V_BE over temperature — this only works reliably if they're at the same temperature. Thermal shutdown circuits sense die temperature directly. In some ICs, the power device and its protection circuitry share enough thermal coupling that the protection responds in microseconds, faster than any external sense circuit could.

But thermal coupling can also be a problem. A high-power output stage heats the die, shifting the bias points of nearby precision circuits. This is why many analog ICs specify warm-up drift or have thermally-sensitive specifications that depend on power dissipation.

### The On-Die Component Palette

Not everything translates well to silicon:

- **Transistors** — Abundant and cheap. BJTs and MOSFETs are the primary active devices. IC designers use them lavishly in ways that would be impractical discretely
- **Resistors** — Available but imprecise (absolute tolerance of 20% or worse). Large values consume die area. High-precision ratios are achievable through careful layout. Values above ~100 kΩ are uncommon on-die
- **Capacitors** — Small values only, typically picofarads to tens of picofarads on-die. Anything larger is brought in externally (hence the external compensation capacitor on many op-amps and regulators)
- **Inductors** — Essentially unavailable in standard analog processes. This is why integrated filters use active topologies (gyrators, switched-capacitor techniques) rather than LC networks
- **Precision references** — Achieved through bandgap circuits exploiting transistor matching, not through precision resistors

This palette shapes every integrated analog architecture. When an IC requires external capacitors or resistors, that's the designer providing what the silicon can't.

## Common Classes of Integrated Analog Devices

Integrated analog devices cluster into recognizable architectural patterns. Each class solves a specific problem by combining the building blocks described above. The following classes are covered in detail elsewhere; this section exists to show how they relate architecturally.

- **Op-amps and instrumentation amplifiers** — Differential input, high gain, feedback-configured. The canonical integrated analog building block. Internal architecture: differential pair input stage, gain stage (often a current mirror load), output stage, bias network, and compensation. Instrumentation amplifiers add precision gain-setting and high common-mode rejection through matched internal resistor networks
- **Comparators** — Structurally similar to op-amps (differential input, high gain) but designed without frequency compensation, optimized for speed to a defined output state rather than linear operation. Not interchangeable with op-amps despite superficial similarity
- **Voltage references** — Bandgap circuits that produce a stable voltage (often 1.25 V or a scaled multiple) with low temperature coefficient. Depend entirely on transistor matching and thermal coupling. The core of almost every precision analog system
- **Linear regulators** — A voltage reference, an error amplifier, and a pass element (BJT or MOSFET) in a feedback loop. The IC integrates the precision parts (reference, amplifier) and may integrate or externalize the pass device depending on power requirements
- **Switching regulator controllers** — Oscillator, error amplifier, comparator, and gate driver integrated together. Often require external inductors, capacitors, and sometimes the power switch itself. The IC handles the control intelligence; the power path is partially or fully external
- **Audio power amplifiers** — Output stages capable of driving low-impedance loads (speakers, headphones) with bias control, thermal protection, and often short-circuit limiting integrated. The internal architecture is recognizable as a textbook amplifier topology (class AB, class D) with protection and biasing added
- **Data converters (ADC/DAC)** — Mixed-signal devices that bridge analog and digital domains. Internally combine precision analog circuits (references, comparators, sample-and-hold) with digital logic. Architecturally diverse: successive approximation, delta-sigma, pipeline, flash — each trading speed, resolution, and complexity differently
- **Analog switches and multiplexers** — MOSFET switches with charge injection compensation, level shifting for the gate drive, and sometimes break-before-make logic. The integration handles the gate drive complexity that would make discrete analog switching awkward
- **Current-sense and power-monitoring ICs** — Precision amplifiers optimized for measuring small voltages across shunt resistors, often with high common-mode capability. The matching and trimming achievable on-die makes these far more accurate than discrete op-amp sense circuits in the same price range

## Application-Specific Analog ICs and Embedded Assumptions

Beyond general-purpose building blocks, many analog ICs are designed for a single application. These embed domain-specific assumptions into the silicon:

- **Motor driver ICs** assume specific coil inductances, supply voltages, and commutation schemes
- **Battery charger ICs** assume a particular chemistry (Li-ion, lead-acid) and encode its charge profile
- **LED driver ICs** assume constant-current drive with specific dimming methods (PWM, analog)
- **Sensor interface ICs** assume a particular transducer type (thermocouple, RTD, strain gauge) and provide excitation, amplification, and sometimes linearization
- **Power management ICs (PMICs)** combine multiple regulators, references, sequencers, and supervisors into one device for a specific processor or system architecture

The embedded assumptions make these devices highly effective in their intended application and problematic outside it. A Li-ion charger IC cannot be repurposed for NiMH by changing external resistors — the charge termination logic is in the silicon. An LED driver designed for PWM dimming may not support analog dimming at all.

When evaluating an application-specific analog IC, the critical question is: **which decisions are fixed in the silicon and which are configurable?** The datasheet answers this, but it requires reading with architectural awareness — understanding that every internal block has constraints that the external circuit must satisfy.

## Practical Implications

### Designing With Analog ICs

- **Read the application circuit, not just the specifications.** The datasheet's recommended circuit isn't a suggestion — it reflects the assumptions the designer made about source impedance, load impedance, decoupling, and feedback network placement. Deviating without understanding why the recommendation exists leads to instability, oscillation, or degraded performance
- **External components matter.** The capacitor on the compensation pin, the resistor setting the gain, the decoupling capacitors on the supply — these are functionally part of the IC's circuit. Using wrong values or types (ceramic vs. electrolytic, ESR too low or too high) changes the behavior of the internal circuit
- **Thermal behavior is part of the design.** Integrated protection (thermal shutdown, current limiting) relies on die temperature. Mounting, copper area, and airflow affect where the IC operates within its safe operating area. Some specifications (like output current capability) are thermally limited, not electrically limited
- **Pin-compatible is not circuit-compatible.** Different op-amps in the same package may have different input bias current directions, different output stage topologies (rail-to-rail vs. not), and different stability requirements. Dropping in a "better" part without reviewing the datasheet can create new problems

### Troubleshooting and Repair

- **Internal nodes are inaccessible.** Probing the bias network inside an IC is not possible. Troubleshooting is limited to what can be observed at the pins: supply current, input and output voltages, and the behavior of external components. Knowing the internal architecture helps infer what's happening inside from what can be measured outside
- **Failure modes reflect the architecture.** An op-amp with a damaged input stage may show large offset voltage but still respond to signals. A regulator with a failed reference will output the wrong voltage but may still regulate (just to the wrong level). Understanding the block diagram helps localize the fault
- **Operating outside absolute maximum ratings causes unpredictable damage.** Overvoltage on one pin can damage a specific internal structure while leaving others intact, producing partial failures that are difficult to diagnose
- **The package is a thermal system.** Excessive die temperature degrades specifications long before it causes outright failure. Intermittent problems that appear only under load or at elevated ambient temperature often trace to thermal design, not component defects

## Tips

- Follow the datasheet's recommended circuit unless there's a specific, understood reason to deviate
- Pay attention to external capacitor type and ESR requirements — they're often critical for stability
- When substituting parts, verify not just pinout but also input bias current direction, output topology, and compensation requirements

## Caveats

- **Analog ICs are not black boxes** — Treating them as ideal input-output transfer functions works until it doesn't. The internal architecture determines input impedance, output impedance, frequency response, noise, and failure modes. Ignoring the internals leads to designs that fail at the margins
- **Matching degrades with distance and temperature gradients** — Even on-die, devices that are physically far apart or straddling a thermal gradient will show worse matching. Datasheet specs for matching assume the die is at a uniform temperature, which may not hold at high power dissipation
- **External capacitor type matters** — Many IC specifications assume a particular capacitor type. A linear regulator designed for a tantalum output capacitor (with ESR providing phase margin) may oscillate with a low-ESR ceramic. The datasheet specifies this, but it's easy to miss
- **Internal protection is not a design margin** — Thermal shutdown and current limiting exist to prevent destruction, not to define normal operating limits. Running an IC continuously at its current limit means it's cycling in and out of thermal shutdown, which is hard on the device and unreliable for the system
- **Supply sensitivity is real** — Integrated bias networks derive their currents from the supply rails. Noise, ripple, and transients on the supply propagate into the analog signal path. The PSRR specification tells how well the IC rejects supply variation, but it degrades with frequency — high-frequency supply noise gets through
- **Latch-up is a physical hazard in CMOS analog ICs** — Parasitic thyristor structures in the substrate can be triggered by input or output voltages that exceed the supply rails. Once triggered, the IC draws excessive current and can be destroyed. This is why absolute maximum ratings for input voltage relative to supply matter

## In Practice

- An analog IC that works on the bench but fails in the field may have thermal or supply noise issues not present in the lab environment
- An op-amp or regulator that oscillates after a "drop-in" replacement likely has different compensation or ESR requirements than the original
- An IC that runs hot even at light load suggests internal bias networks are damaged or the part is counterfeit
- Partial failures (correct function in some modes but not others) indicate damage to specific internal blocks — correlate symptoms with the internal block diagram
