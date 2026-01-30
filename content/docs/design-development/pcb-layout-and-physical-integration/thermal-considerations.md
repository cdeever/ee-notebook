---
title: "Thermal Considerations"
weight: 50
---

# Thermal Considerations

Heat is not an afterthought — it's a design constraint that's present from the first component selection through the final layout. Every component dissipates power, every trace has resistance, and every PCB has a limited ability to move heat from where it's generated to where it can be removed. Boards that ignore thermal management either derate themselves into poor performance or fail outright when temperatures climb.

## Power Dissipation: Where Heat Comes From

Every component on a PCB generates some heat. The question is how much, and whether it matters.

- **Linear regulators** are the most straightforward: P = (Vin - Vout) x Iload. A regulator dropping 12V to 3.3V at 500 mA dissipates (12 - 3.3) x 0.5 = 4.35 W. That's significant heat from a small package. This is often the first component on a board that needs explicit thermal management.
- **Switching regulators** are more efficient but still dissipate power. A 90%-efficient buck converter delivering 5W still generates 0.55W of heat, concentrated in the switching FET and the inductor.
- **MCUs and digital ICs** dissipate power proportional to clock speed and voltage: P = C x V^2 x f. A microcontroller running at 100 MHz might dissipate 50-500 mW depending on architecture and activity.
- **Power transistors and MOSFETs** dissipate P = I^2 x Rds(on) when conducting, plus switching losses during transitions. High-current designs can easily generate several watts per transistor.
- **Traces** dissipate P = I^2 x R. A 10-mil trace carrying 1A on a 1-oz copper layer has a resistance of about 50 milliohms per inch, so a 2-inch trace dissipates 100 mW. Not much individually, but the total trace heating across a power distribution network adds up.

The first step in thermal management is knowing your power budget — adding up the dissipation of every significant heat source on the board.

## Thermal Paths: How Heat Moves

Heat flows from hot to cold through three mechanisms, and PCB design primarily deals with conduction:

**Component to pad:** The thermal connection from the IC die to the PCB is through the package. Many power components have an exposed thermal pad on the bottom — this is the primary heat exit path. A component's thermal resistance from junction to pad (theta-JC) is a fixed property of the package. You can't change it, but you can ensure the PCB side of the connection doesn't bottleneck it.

**Pad to copper plane (thermal vias):** An exposed thermal pad on the board surface needs a path to inner copper layers for heat spreading. This is where thermal vias come in — small vias directly under the thermal pad that connect the surface pad to internal ground or power planes. Without thermal vias, the heat is trapped on the surface layer and can only spread laterally through the top copper.

Rules of thumb for thermal vias:
- Use as many as the pad area allows, typically on a 1-1.2 mm grid
- Via diameter of 0.3-0.4 mm is standard
- Fill or plug vias under thermal pads to prevent solder wicking during reflow (solder gets sucked into open vias, leaving the pad poorly connected)
- Connect to the largest available copper area on inner layers

**Copper plane to air:** Copper planes on the outer layers radiate and convect heat to the surrounding air. Large copper areas act as heat spreaders and radiators. Inner copper planes store and spread heat laterally but can't radiate it directly — they depend on thermal vias to the outer layers or on conduction through the board thickness to the surface.

## Copper Pour as Heatsink

Unused board area on outer layers should generally be filled with copper pour connected to ground. This copper serves double duty: it provides shielding and a ground return path (electrically) and acts as a heat spreader and radiator (thermally).

For components that dissipate significant power, the surrounding copper pour area directly affects the steady-state temperature. A TO-252 (DPAK) voltage regulator on a 1 cm^2 copper island will run much hotter than the same part on a 10 cm^2 pour connected to inner planes through thermal vias.

When estimating thermal performance, the datasheet's thermal resistance values are typically specified for a given board area — often a "1 inch^2 2-layer board" or a "JEDEC standard thermal test board." Your actual board will be different. If your board has more copper area and more layers, the component will run cooler than the datasheet suggests. If less, it will run hotter.

## Heatsinks and Thermal Interface Materials

When copper alone can't remove enough heat, external heatsinks become necessary.

- **Clip-on heatsinks** for TO-220 and similar packages add significant thermal capacity. A small aluminum heatsink with fins can reduce junction-to-ambient thermal resistance from 50 C/W (package alone) to 10-15 C/W.
- **Thermal interface materials (TIMs)** fill the air gap between the component and the heatsink. Thermal paste, thermal pads, and phase-change materials each have different thermal conductivity and ease-of-use tradeoffs. Even a thin air gap dramatically increases thermal resistance — TIMs are not optional when using heatsinks.
- **Board-mounted heatsinks** attach directly to the PCB over a hot component. These require careful mechanical planning: the heatsink must clear other components, and its mounting method (adhesive, clip, or screw-through) must be designed into the board layout.

## Temperature Estimation

Before building the board, you can estimate component temperatures using the thermal resistance chain from the datasheet:

T_junction = T_ambient + (P_dissipated x theta_JA)

Where theta_JA (junction-to-ambient thermal resistance) is the total thermal resistance from the IC die to the surrounding air. This value is published in datasheets but is specific to the test conditions. Your board will be different, so treat the calculation as an estimate, not a guarantee.

For more accuracy, break the thermal path into segments:

T_junction = T_ambient + P x (theta_JC + theta_CS + theta_SA)

Where theta_JC is junction-to-case, theta_CS is case-to-sink (the TIM), and theta_SA is sink-to-ambient. This approach lets you evaluate the impact of heatsink selection and TIM choice independently.

If the estimated junction temperature exceeds the component's maximum rating with comfortable margin, redesign before building. Options include: better thermal paths (more vias, more copper), a heatsink, a different package (a TO-263 instead of a SOT-223), or a different component entirely (switching regulator instead of linear).

## Derating

Components have a maximum operating temperature, but their performance degrades before reaching it. Derating is the practice of reducing the allowable stress on a component as temperature increases.

- **Capacitors** lose capacitance at high temperatures (ceramics) or have shortened life (electrolytics — every 10C above rated temperature halves the lifetime).
- **Voltage regulators** reduce their maximum output current at elevated ambient temperatures. The datasheet includes a derating curve showing the relationship.
- **Power semiconductors** have a maximum junction temperature (often 150C or 175C), but the safe operating area shrinks as temperature increases.
- **Resistors** derate power handling above a certain temperature (typically 70C). A 0.25W resistor at 125C might only handle 0.1W safely.

Good thermal design aims for component temperatures well below the derating threshold during normal operation, leaving margin for hot days, enclosed environments, and aging.

## The Thermal-Mechanical Connection

Heat doesn't just degrade performance — it creates mechanical stress. Every material on the PCB expands when heated, and different materials expand at different rates:

- **FR4** has a CTE (coefficient of thermal expansion) of about 14-17 ppm/C in X and Y, and 50-70 ppm/C in Z (through the board thickness).
- **Copper** has a CTE of about 17 ppm/C.
- **Ceramic chip components** have a CTE of 5-7 ppm/C.
- **BGA solder balls** must bridge the gap between the component CTE and the board CTE.

When the board heats up, these mismatches create stress in solder joints. Components near heat sources experience thermal cycling — heating when the system is on, cooling when it's off — and this cycling fatigues solder joints over time. This is why large ceramic capacitors (1206 and above) near heat sources are more prone to cracking than small ones, and why BGA packages on boards with frequent thermal cycling need careful attention to solder joint reliability.

## Gotchas

- **Thermal vias under QFN pads are essential, not optional.** A QFN package with no thermal vias under its exposed pad can easily reach junction temperatures 30-50C higher than the same package with proper vias. This is one of the most commonly missed layout details.
- **Solder wicking through open thermal vias starves the pad.** If thermal vias under a component are not plugged or tented, solder can wick down through the via during reflow, leaving insufficient solder on the thermal pad. The result is a poor thermal connection despite proper via placement.
- **Natural convection is weaker than you think.** In still air, a small PCB can only dissipate about 5-10 mW per square centimeter through natural convection. Forced airflow improves this dramatically — even a small fan can halve component temperatures.
- **Hot spots on inner layers are invisible.** You can feel a hot component on the surface, but heat building up on an inner copper plane is undetectable without thermal imaging. An IR camera during bring-up is enormously valuable.
- **Adjacent component heating is cumulative.** Two 1W components placed 5 mm apart will each run hotter than either would alone, because each one heats the other's local environment. Space hot components apart when possible.
