---
title: "Reference Designs: How to Use Them Safely"
weight: 20
---

# Reference Designs: How to Use Them Safely

Reference designs are one of the greatest resources available to electronics designers — and one of the greatest sources of subtle bugs when used carelessly. A chip vendor's reference design represents hundreds of engineering hours distilled into a schematic and layout. But it was designed for the vendor's demonstration purposes, not for your specific application, and that gap is where problems hide.

## Starting Points, Not Finished Products

A reference design is a proof that a chip or topology works under specific conditions. It demonstrates that the IC functions correctly, that the passives are reasonable, and that the layout can be made to work. What it does not demonstrate is that the design works in your system, with your power supply, your load, your PCB stackup, your operating temperature range, or your EMC requirements.

Treating a reference design as a finished product is like treating a recipe as a restaurant. The recipe gives you the ingredients and steps, but your oven runs hot, your altitude affects baking, and your guests have different preferences. You need to understand the recipe well enough to adapt it.

I've seen projects where a reference design was copied verbatim into a production schematic with zero modifications. Sometimes it works. More often, there are subtle mismatches: the reference design assumed a 4-layer board but the product uses 2 layers, the reference assumed a bench supply but the product has a noisy switching regulator upstream, or the reference design's layout was optimized for a form factor completely different from the product.

## What Reference Designs Get Right

Credit where it's due — reference designs provide enormous value:

- **Proven circuit topology.** The basic circuit architecture has been validated by the IC vendor's application engineers. The feedback network of a switching regulator, the biasing of an amplifier, the decoupling scheme for a microcontroller — these have been tested and (usually) work.
- **Tested component values.** The resistor and capacitor values in the compensation network, the inductor selection for a power supply, the bias resistors for an LED driver — these have been calculated and verified against the IC's requirements.
- **Known-good layout guidance.** Many reference designs include layout recommendations or even complete PCB layouts. These show critical placement and routing constraints that might not be obvious from the datasheet alone.
- **Bill of materials with real part numbers.** The BOM lists specific, real components that the vendor has verified work with their IC. This saves significant part selection time.

## What They Get Wrong for Your Application

Here's where uncritical copying causes problems:

**Your power supply isn't their power supply.** Reference designs often assume a clean, well-regulated input. If your input is a battery that sags under load, a noisy switching converter output, or a long cable with significant voltage drop, the reference design's assumptions about input impedance and voltage range may not hold.

**Your PCB isn't their PCB.** A reference design on a 4-layer board with dedicated ground and power planes will behave differently on a 2-layer board. Trace impedances change, ground return paths differ, and thermal dissipation varies. The layout "looks the same" but performs differently.

**Your load isn't their load.** A voltage regulator reference design loaded with a simple resistor performs differently than one driving a microcontroller with burst-mode current consumption. The reference design might be stable with a resistive load but oscillate with your capacitive or switched load.

**Your environment isn't their lab.** Reference designs are typically validated at room temperature with controlled input sources. Your product may need to work from -20 to +85 degrees Celsius, survive ESD events, and operate in an electrically noisy environment.

## The Copy-Paste Trap

The most dangerous mode of using reference designs is copying them without understanding why each component is present. Every passive in a well-designed circuit serves a purpose: setting a frequency, providing compensation for stability, limiting current, filtering noise, or protecting against transients. When you copy without understanding, you lose the ability to evaluate whether a modification is safe.

I've caught myself copying a reference design's output filter capacitor value without checking whether the capacitor I selected (different manufacturer, different dielectric) has the same ESR characteristics that the original design required for stability. The schematic looked identical, but the circuit behavior was different because the component's parasitic properties had changed.

The antidote is straightforward but requires discipline: for every component in a reference design you intend to use, understand its function. Not "it's a capacitor on the output" but "it's a 22uF output capacitor providing output voltage hold-up during load transients, and its ESR must be below 10 milliohms for regulator stability." That level of understanding lets you evaluate substitutions and modifications safely.

## How to Adapt Reference Designs

A reliable process for adapting reference designs:

1. **Read the datasheet and application note completely.** Not just the reference schematic — the explanation of how the circuit works and why each component was chosen. Many datasheets have a "Component Selection" section that explains the design equations.
2. **Identify your requirements that differ from the reference.** Different input voltage? Different output current? Different temperature range? List every difference explicitly.
3. **Recalculate affected component values.** If you changed the output voltage, the feedback resistors change. If you changed the switching frequency, the inductor and capacitors change. Use the datasheet's design equations, not guesswork.
4. **Verify stability with your modifications.** A switching regulator compensation network designed for one output capacitance may be unstable with a different value. Check the Bode plot (by simulation or using the vendor's design tool) with your actual component values.
5. **Check the layout guidelines.** Many ICs have critical layout requirements for the ground plane, component placement, or trace routing. Verify that your PCB can accommodate these constraints.

## Application Notes vs Evaluation Board Schematics

These are different documents with different levels of generality:

**Application notes** explain the design methodology. They describe how to calculate component values for a range of operating conditions. They're educational — they teach you to fish. Reading the application note gives you the understanding needed to adapt the design confidently.

**Evaluation board schematics** are specific implementations. They show one particular configuration that the vendor tested. They're a data point — here's one way it works. They don't explain the tradeoffs or alternatives.

When both are available, read the application note first and the evaluation board schematic second. The application note gives you the framework for understanding the choices made in the evaluation board design. Without that framework, you're just copying shapes.

Some vendors also provide interactive design tools (TI's WEBENCH, Analog Devices' LTpowerCAD, Microchip's MPLAB Mindi) that let you enter your specific requirements and generate a customized reference design. These are extremely valuable because they adapt the design to your conditions rather than forcing you to adapt a generic reference.

## Gotchas

- **Reference design passives have hidden requirements.** A "10uF capacitor" in a reference design might specifically need low ESR, specific voltage rating, or a particular dielectric (X7R vs Y5V). The value alone isn't sufficient — check the full part specification.
- **Reference design layout is part of the design.** For high-frequency or switching circuits, the layout is inseparable from the schematic. Copying the schematic but ignoring the layout recommendations can create a circuit that oscillates, overheats, or fails EMC.
- **Vendor design tools have defaults you need to question.** Automated design tools often select components from a specific vendor or optimize for one parameter (cost, size, efficiency). Verify that the tool's priorities match yours.
- **"Typical" application circuits in datasheets are often simplified.** They may omit protection components, filtering, or support circuitry that a real application needs. Treat them as starting points for further development, not as complete designs.
- **Reference designs rarely include system integration considerations.** Power sequencing with other supplies, interaction with nearby circuits, EMC filtering at connectors — these system-level concerns are your responsibility, not the reference design's.
