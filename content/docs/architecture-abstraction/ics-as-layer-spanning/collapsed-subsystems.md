---
title: "Collapsed Subsystems"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Collapsed Subsystems

Before the LM7805 existed, a regulated 5 V supply was a collection of discrete parts: a zener diode reference, a transistor error amplifier, a pass transistor, a handful of resistors for bias and feedback, and protection components. Each part was visible on the schematic, measurable at the bench, and independently replaceable. The subsystem's internal structure was fully exposed.

The LM7805 collapsed all of that into a single package. The reference, error amplifier, pass element, thermal shutdown, current limit, and safe operating area protection all still exist — they're fabricated on the die, performing the same functions — but they're no longer individually accessible. The schematic shows a three-terminal device. The internal nodes that once sat on the PCB are now bond wires and metallization layers inside the package.

This is what "collapsed subsystem" means: the functional hierarchy hasn't changed, but the physical accessibility has. The blocks are still there. The feedback loops are still there. The protection mechanisms are still there. They've just been collapsed into a single artifact that can only be observed through its external pins.

## What Gets Collapsed

The most commonly collapsed structures follow a pattern: functions that are tightly interdependent and benefit from being physically close on the same die get integrated first.

**Feedback loops.** A voltage regulator's error amplifier and reference need to be tightly matched and thermally coupled for accurate regulation. Integrating them on the same die gives them matched temperature coefficients and eliminates interconnect impedance within the loop. The same applies to PLLs, where the phase detector, charge pump, and VCO benefit from being on the same die to minimize noise injection in the loop.

**Protection circuits.** Overcurrent sensing, thermal shutdown, and overvoltage clamping work best when they're physically adjacent to the element they protect. A current-sense element on the same die as the pass transistor has no interconnect resistance to corrupt the measurement. A thermal sensor on the same die as the power stage measures the actual junction temperature, not a nearby PCB temperature.

**Bias networks.** Circuits that set operating points — current mirrors, bandgap references, bias generators — are collapsed because their accuracy depends on component matching that's far better on-die than it could ever be with discrete parts. Two transistors fabricated next to each other on a die match to within fractions of a millivolt of VBE; two discrete transistors from the same batch might differ by tens of millivolts.

**Coordination logic.** Startup sequencing, mode selection, enable/disable control, and fault state machines are collapsed because they need tight coupling to the functional blocks they manage. A soft-start circuit that ramps the internal reference needs direct access to the reference node — routing that through external pins would add noise, delay, and failure modes.

## What Collapse Hides

Collapsing a subsystem into an IC trades physical access for integration benefits. The tradeoffs are real and have consequences for both design and debugging.

**Internal nodes become invisible.** In a discrete regulator, the reference voltage, the error amplifier output, and the current-sense voltage are all measurable. In an IC regulator, these nodes exist inside the package. The only accessible information is what appears on the external pins — typically input, output, ground, and perhaps an enable or feedback pin. If the internal reference drifts, it manifests as output voltage drift, but there's no way to measure the reference directly to confirm the root cause.

**Internal tradeoffs become fixed.** The IC designer chose the loop bandwidth, the compensation strategy, the current limit threshold, and the thermal shutdown temperature. These choices represent tradeoffs — faster transient response versus more ripple, tighter current limit versus nuisance tripping, lower dropout versus higher quiescent current. In a discrete design, these tradeoffs can be adjusted. In a collapsed subsystem, they're frozen into the silicon.

**Internal failure modes become opaque.** When a discrete subsystem fails, individual blocks can be tested: is the reference correct? Is the error amplifier saturated? Is the pass transistor conducting? When a collapsed subsystem fails, the diagnostic resolution is coarser: the output is wrong, but the internal mechanism is hidden. Diagnosis proceeds by inference from external measurements rather than direct internal observation.

**Internal parasitics are predetermined.** The IC designer managed the parasitic capacitances, inductances, and resistances within the die. These are generally well-controlled — much better than PCB parasitics — but they're also fixed. Bond wire inductance, pad capacitance, and internal trace resistance contribute to the IC's behavior in ways that aren't always documented and can't be changed.

## Levels of Collapse

Not all collapsed subsystems hide the same amount of structure. The degree of collapse varies along a spectrum:

**Partially collapsed** — Some internal nodes are brought out to pins, giving limited visibility and adjustability. A voltage regulator with an exposed compensation pin allows the loop response to be adjusted externally. An op-amp with offset trim pins allows an internal parameter to be corrected. These partially collapsed designs give up some integration density in exchange for application flexibility.

**Fully collapsed** — The subsystem is reduced to its essential interfaces: input, output, power, and perhaps enable or configuration pins. A fixed-voltage LDO regulator is fully collapsed — three pins, no adjustability, no internal visibility. The entire subsystem specification is determined by the silicon.

**Over-collapsed** — The IC integrates so much that the resulting part serves only a narrow application. A power management IC (PMIC) designed for a specific processor integrates multiple regulators with specific voltage and sequencing requirements. If the processor changes, the PMIC is useless — the collapse was optimized for one configuration. Over-collapse trades generality for integration.

The practical consequence: the more collapsed the subsystem, the more the design depends on selecting the right IC rather than designing the right circuit. With a fully collapsed subsystem, the design work shifts from circuit design to IC selection, application condition verification, and external component specification compliance.

## Tips

- When evaluating a collapsed-subsystem IC, read the block diagram in the datasheet as a schematic of what's inside. It maps the collapsed structure back to its constituent blocks, showing the feedback paths, protection mechanisms, and internal coordination — information that's essential for understanding why the IC behaves the way it does under different conditions.
- Look for pins that expose internal nodes — compensation pins, sense pins, test pins, feedback pins. These are the IC designer's acknowledgment that the full collapse isn't always sufficient, and they provide the handles needed for application-specific adjustment and debugging.
- When a partially collapsed IC offers an adjustable parameter (loop compensation, current limit threshold, soft-start timing), the datasheet's recommended values represent the IC designer's default tradeoff. Deviating from those values is sometimes necessary but should be done with full understanding of what's being traded.
- Comparing the block diagram of a collapsed-subsystem IC to a discrete implementation of the same function clarifies what's been hidden. Application notes sometimes provide this comparison explicitly.

## Caveats

- **Collapsed subsystems still have internal failure modes** — The integration doesn't eliminate the failure mechanisms; it just hides them. An internal reference can drift, an internal bias current can shift with temperature, an internal protection circuit can trigger falsely. The failure modes of the discrete version still exist; they're just no longer directly observable.
- **Selecting an IC is not the same as designing a subsystem** — Choosing a voltage regulator IC and placing it on a board completes the integration step, but the design responsibility hasn't disappeared — it's been transferred to the IC designer for the internal portion and retained for the external portion. If the application conditions fall outside what the IC was designed for, the internal design decisions may not be appropriate.
- **The datasheet's block diagram is simplified** — IC datasheets show functional block diagrams, not actual circuit schematics. The block diagram omits biasing details, parasitic management, ESD structures, and test circuitry that exist on the die. The block diagram is a conceptual map, not a complete description.
- **Replacing a collapsed subsystem with a discrete equivalent isn't straightforward** — The matching, thermal coupling, and parasitic management inside the IC are difficult or impossible to replicate with discrete components. A discrete reconstruction may have worse performance than the IC it's replacing, even if the topology is identical.
