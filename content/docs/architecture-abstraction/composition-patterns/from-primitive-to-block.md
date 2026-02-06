---
title: "From Primitive to Block"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# From Primitive to Block

A resistor is a primitive. Two resistors forming a voltage divider is a block. The difference isn't just quantity — it's that the combination has a purpose the individual parts don't. The resistor doesn't "know" it's dividing a voltage. The block does, in the sense that the designer placed those parts in that relationship to accomplish that function. This transition from component to function is the first and most fundamental composition step in electronics.

## What Makes a Block

A block is the smallest grouping of primitives that has a coherent function describable in a sentence. "This is a low-pass filter." "This is a voltage reference." "This is a common-emitter gain stage." "This is a pull-up network." The description captures the design intent — what the circuit is supposed to do — and that intent is what elevates a pile of parts into a functional unit.

Blocks have properties that their constituent primitives don't:

**Transfer functions.** A single resistor has an impedance. Two resistors in a divider have a voltage ratio. An RC network has a frequency-dependent transfer function with a cutoff frequency and a roll-off slope. These higher-order properties emerge from the relationship between parts, not from any individual part.

**Input and output contracts.** A block has identifiable inputs and outputs with definable characteristics: input impedance, output impedance, gain, bandwidth, bias requirements. These contracts are what allow the block to interface with other blocks. A common-emitter stage expects a certain bias range on its base, presents a certain impedance to the driving source, and delivers a certain gain to the load.

**Failure modes that don't exist in individual components.** A single transistor can fail open or short. A common-emitter stage can oscillate — a failure mode that requires the interaction between the transistor, its biasing, and its feedback path. Blocks introduce relational failures: problems that arise from how parts interact, not from individual part defects.

## Recognizing Blocks on a Schematic

Reading an unfamiliar schematic is largely an exercise in block recognition. The schematic is a flat collection of symbols and nets, but the design intent is hierarchical — the designer thought in blocks, even if the schematic doesn't explicitly draw boxes around them.

Several patterns help identify block boundaries:

**Functional clustering.** Parts that share a common purpose tend to cluster physically on the schematic. The biasing resistors around a transistor, the feedback network around an op-amp, the decoupling capacitors near a voltage regulator — these groupings usually correspond to blocks.

**Signal flow.** Blocks sit along signal paths. Follow a signal from input to output: each stage it passes through — a filter, an amplifier, a level shifter — is typically a block. The boundaries appear where signal conditioning changes character: from filtering to amplification, from single-ended to differential, from analog to digital.

**Named nets and reference designators.** Designers often name nets at block boundaries: VREF, FILT_OUT, CLK_BUF. These names encode the designer's block-level thinking. Reference designators sometimes cluster numerically within blocks, though this is less reliable.

**Datasheet application circuits.** Many blocks are direct implementations of datasheet reference circuits. Recognizing a standard inverting amplifier configuration, a standard boost converter topology, or a standard crystal oscillator circuit identifies the block immediately and reveals its intended behavior.

## The Composition Contract

When primitives combine into a block, the block offers a contract to the rest of the circuit: "Give me these inputs within these ranges, and I'll deliver this output with these characteristics." This contract is what allows the next level up to treat the block as a single functional unit rather than reasoning about every resistor individually.

The contract has explicit and implicit terms:

**Explicit terms** are the ones that can be calculated or simulated: gain, bandwidth, output voltage range, input impedance. These are the parameters that go in a design spreadsheet or get verified in simulation.

**Implicit terms** are the assumptions that are easy to overlook: the block assumes its supply is stable, its ground is quiet, its thermal environment is within range, and its input signal doesn't contain energy outside its designed bandwidth. These implicit assumptions are where most composition failures originate, because they're the terms nobody wrote down.

## How Blocks Fail as Compositions

The most instructive block failures aren't component failures — they're composition failures, where every part is within spec but the block doesn't work as intended.

**Loading violations.** The voltage divider's output voltage depends on the assumption that the load impedance is much higher than the divider's output impedance. Connect a low-impedance load, and the divider ratio shifts. The resistors are fine; the composition contract was violated.

**Bias point sensitivity.** A transistor amplifier stage is designed around a specific operating point. Temperature shifts, component tolerances, or supply voltage variations can move the operating point out of the linear region. Each component is within its individual spec, but the combination doesn't deliver the intended gain.

**Parasitic interactions.** An RC filter designed for a specific cutoff frequency may be loaded by parasitic capacitance on the PCB, shifting the frequency response. The resistor and capacitor are correct; the layout added an invisible component to the block.

**Feedback instability.** An amplifier block with feedback can oscillate if the phase margin is insufficient — a failure mode that only exists because of the feedback relationship between the parts. Each component in the loop is functioning correctly; the loop as a whole is unstable.

## Tips

- When encountering an unfamiliar block, try to identify its topology before analyzing individual component values. Knowing it's a Sallen-Key filter, a Colpitts oscillator, or a cascode stage is more informative than knowing every resistor value.
- Verify block-level behavior before moving to higher-level integration. If the reference voltage is wrong, everything downstream that depends on it will be wrong too — and the downstream symptoms won't point back to the reference.
- When a block's output doesn't match expectations, check the implicit contract terms first: supply voltage, ground quality, load impedance, and input signal range. These are violated more often than explicit design parameters.

## Caveats

- **Block boundaries are a thinking tool, not a physical reality** — The same set of components can be grouped into blocks in different ways depending on the analysis. A feedback resistor "belongs" to the gain block when analyzing gain, but "belongs" to the stability analysis when checking phase margin. The grouping should match the current question.
- **Not every cluster of parts is a block** — Decoupling capacitors, test points, and ESD protection components are primitives that serve the design without forming a functional block of their own. Trying to force every component into a block-level grouping overcomplicates the analysis.
- **Textbook blocks and real blocks diverge** — A textbook common-emitter stage has four or five components. A real one may have additional parts for bias stability, frequency compensation, or protection that aren't in the canonical topology. Recognizing the core topology while accounting for the additions is part of reading real schematics.
