---
title: "Primitives, Blocks, Subsystems, Devices, Systems"
weight: 10
---

# Primitives, Blocks, Subsystems, Devices, Systems

Five levels of abstraction appear repeatedly in electronics, whether or not anyone names them explicitly. They aren't a formal taxonomy — real circuits don't carry labels announcing which level they belong to — but they capture genuine differences in the kind of reasoning that works at each scale. Learning to recognize which level you're operating at, and what kind of questions belong there, is one of the most useful structural skills in electronics.

## Primitives

A primitive is a single component: the thing you can hold between tweezers, find on a BOM line, and characterize from a datasheet. A resistor, capacitor, inductor, diode, transistor, or crystal. At this level, you reason about voltage, current, impedance, power dissipation, temperature coefficients, and parasitic properties. The datasheet is the contract: it tells you what the component promises under specified conditions.

Primitive-level thinking answers questions like: What is the voltage drop across this diode at 10 mA? What is the impedance of this capacitor at 100 kHz? Will this resistor survive the power dissipation in worst-case conditions?

The boundary of a primitive is physical — it's a single part on the board. Its behavior is governed by physics and material properties, not by design intent. A resistor doesn't know it's part of a voltage divider.

## Blocks

A block is a small functional circuit made from a handful of primitives that accomplishes one identifiable job. A voltage divider. An RC low-pass filter. A common-emitter amplifier stage. A pull-up network on an I2C bus. A bootstrap capacitor circuit on a gate driver. At this level, you reason about transfer functions, gain, bandwidth, input impedance, output impedance, bias points, and frequency response.

Block-level thinking answers questions like: What is the cutoff frequency of this filter? What gain does this amplifier stage provide at the operating point? Is the pull-up strong enough for this bus capacitance and data rate?

The boundary of a block is functional — it's the smallest grouping of primitives that has a coherent purpose on the schematic. Blocks are where the circuit starts to have intent: the designer put these parts together to do something specific. Recognizing blocks on an unfamiliar schematic is one of the first steps toward understanding it.

## Subsystems

A subsystem is a collection of blocks that together perform a higher-level function with defined performance specifications. A regulated power supply — reference, error amplifier, pass element, output filter, protection circuits. An ADC front end — anti-alias filter, buffer amplifier, sample-and-hold, converter. A motor driver — H-bridge, gate drivers, current sensing, shoot-through protection. At this level, you reason about specifications: output regulation, conversion accuracy, response time, efficiency, operating temperature range.

Subsystem-level thinking answers questions like: Does this supply maintain regulation under the expected load transients? Does this ADC front end preserve signal integrity from the sensor to the digital output? Does the motor driver respond safely to a stall condition?

The boundary of a subsystem is contractual — it's defined by what the subsystem promises to deliver and what it requires from the rest of the design. A power supply subsystem promises a regulated voltage within a tolerance band; it requires an input voltage range and a thermal environment. These promises and requirements are the interface between the subsystem and the rest of the design.

## Devices

A device is a self-contained product or module with defined external interfaces. A bench power supply. An oscilloscope. A development board. A sensor module with a digital output. A USB-to-serial adapter. At this level, you reason about capabilities, interfaces, operating modes, and integration constraints.

Device-level thinking answers questions like: Can this power supply deliver the current this board requires? Does the oscilloscope have enough bandwidth to capture this signal faithfully? Will this sensor module coexist on the same I2C bus as the other peripherals?

The boundary of a device is physical and electrical — it has connectors, power inputs, and defined I/O. A device has been designed, built, tested, and (usually) documented as a unit. It may contain multiple subsystems, but the user interacts with the device through its external interfaces, not through the internals of its subsystems.

## Systems

A system is multiple devices working together to accomplish a purpose. A test setup: DUT, power supply, signal generator, oscilloscope, and a PC running control software. A data acquisition system: sensors, signal conditioning modules, an ADC board, and a processing unit. A control loop: sensor, controller, actuator, and the physical process being controlled. At this level, you reason about coordination, sequencing, data flow, timing relationships between devices, and emergent behavior.

System-level thinking answers questions like: Is the power supply sequencing correct for this multi-rail board? Do the timing relationships between clock, data, and control signals hold across the entire signal chain? Why does this test setup give different results when the scope probe is connected?

The boundary of a system is defined by its purpose — it includes everything needed to accomplish the goal, and nothing else. System-level problems are often coordination problems: every device works correctly on its own, but the system fails because of an interaction between them. This is where the hardest debugging often lives.

## The Levels Are a Thinking Tool

These five levels aren't a rigid classification system. The boundaries between them are sometimes blurry: is an op-amp IC a primitive or a block? (It depends on whether you're reasoning about its internal compensation or its closed-loop gain.) Is a development board a device or a subsystem? (It depends on whether you're using it as a standalone test platform or integrating it into a larger system.)

The value isn't in categorizing things perfectly — it's in recognizing that different questions belong at different levels, and that trying to answer a subsystem question with primitive-level reasoning (or vice versa) wastes time and generates confusion. When you catch yourself staring at oscilloscope traces of individual gate transitions while the real problem is that the power supply droops under load, you're at the wrong level.

## Tips

- When reading an unfamiliar schematic, start by identifying the subsystems before trying to trace individual signals. The subsystem boundaries usually correspond to functional blocks in the datasheet or design guide.
- Name the level you're working at, even if only to yourself. "I'm checking the block-level transfer function" or "I'm looking at system-level timing" keeps you focused on the right questions.
- The primitives-to-systems hierarchy maps roughly to the order of questions during bring-up: power primitives first, then power blocks, then power subsystem stability, then device-level functionality, then system-level integration.

## Caveats

- **These levels describe how to think, not how circuits are physically organized** — a single PCB might contain multiple subsystems, or a single subsystem might span two boards. The hierarchy is about reasoning, not about physical boundaries.
- **Not every circuit fits neatly into five levels** — some simple circuits are just a block. Some complex systems have sub-devices and sub-subsystems. Use as many levels as are useful and no more.
- **Schematic hierarchy doesn't always match abstraction hierarchy** — a schematic organized by page doesn't necessarily group things by functional level. A single schematic sheet might contain parts of two different subsystems, or a single block might be split across sheets for layout reasons.
