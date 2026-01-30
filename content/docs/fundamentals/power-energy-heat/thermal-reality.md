---
title: "Thermal Reality"
weight: 30
---

# Thermal Reality

Every watt of electrical power that isn't doing useful work becomes heat. Components have maximum temperatures, and exceeding them causes failure — sometimes immediately, sometimes slowly. Understanding thermal limits is the bridge between "my circuit works on the bench" and "my circuit works reliably."

## Dissipation Ratings and What They Mean

A component's power rating tells you the maximum continuous power it can dissipate without exceeding its maximum junction or body temperature — **at a specified ambient temperature**, usually 25 C.

- A 1/4 W resistor can dissipate 250 mW at 25 C ambient
- A TO-220 transistor might be rated for 50 W — but only with an infinite heatsink at 25 C
- The actual power you can safely dissipate depends on your actual thermal environment, not the datasheet headline number

## The Thermal Model

Heat flows from hot to cold through thermal resistance, analogous to current flowing through electrical resistance:

- **Temperature difference** (delta T, in C) = "voltage"
- **Power dissipated** (P, in W) = "current"
- **Thermal resistance** (theta, in C/W) = "resistance"

**delta T = P x theta**

For a chip with junction-to-ambient thermal resistance of 60 C/W, dissipating 1 W raises the junction 60 C above ambient. At 25 C ambient, that's 85 C junction temperature.

### Thermal Resistance Chain

The heat path from junction to ambient usually involves multiple thermal resistances in series:

- Junction to case (theta_JC) — through the package
- Case to heatsink (theta_CS) — through thermal interface material
- Heatsink to ambient (theta_SA) — through convection and radiation

Total: theta_JA = theta_JC + theta_CS + theta_SA

Each interface adds thermal resistance. Thermal paste or pads reduce theta_CS but don't eliminate it.

## Derating

Derating means reducing the maximum allowable power as temperature increases. Most datasheets include a derating curve showing how the power rating drops linearly from the rated value at 25 C to zero at the maximum temperature.

A 1/4 W resistor rated to 155 C maximum might derate linearly above 70 C. At 100 C ambient, it can only handle about 100 mW. At 155 C ambient, it can handle 0 W.

**Always check what ambient temperature the rating assumes.** Quoting a power rating without its temperature condition is meaningless.

## Quiet Failures Before Spectacular Ones

Thermal failures are often gradual:

- **Electrolytic capacitor dry-out** — Heat accelerates electrolyte evaporation. Capacitance drops, ESR rises, and the cap slowly stops doing its job. Lifetime halves for every 10 C rise above the rated temperature
- **Solder joint fatigue** — Thermal cycling (repeated heating and cooling) causes solder joints to crack over time. BGA packages are especially susceptible
- **Parameter drift** — Semiconductor parameters shift with temperature and long-term thermal stress. A circuit might work at room temperature but drift out of spec as components age under thermal stress
- **Insulation breakdown** — Elevated temperatures degrade insulation over time, eventually leading to leakage or shorts

The spectacular failures (magic smoke, fire, package cracking) happen when thermal limits are exceeded quickly and dramatically. But most thermal failures are the slow kind — the circuit works for weeks or months, then starts acting flaky.

## Practical Thermal Checks

- **Finger test** — If you can't comfortably touch a component, it's above about 60 C. If it burns immediately, it's above 70-80 C. This is crude but catches gross problems. (Don't touch mains-connected circuits)
- **IR thermometer** — Quick non-contact temperature reading. Accuracy depends on emissivity settings. Shiny metal surfaces read low
- **Thermocouple** — More accurate than IR for specific spot measurements. Needs good thermal contact
- **Thermal camera** — The gold standard for finding hot spots. Immediately shows the thermal landscape of a board

## Gotchas

- **Still air vs. forced air** — Datasheet ratings often assume some airflow. In a sealed enclosure with no fan, thermal resistance is much higher than the datasheet value
- **Nearby heat sources** — A component rated at 25 C ambient might be sitting next to a voltage regulator running at 80 C. The local ambient is not the room temperature
- **Thermal coupling** — Heat from one component conducts through the PCB to neighboring components. A hot regulator can raise the temperature of nearby electrolytics
- **Copper pours help** — PCB copper area acts as a heatsink. Datasheets for power components often specify minimum copper area. Skimping on copper area reduces the effective power rating
- **Transient thermal behavior** — Thermal mass provides short-term protection. A component can survive brief power pulses above its continuous rating because it takes time to heat up. But thermal mass runs out — this is borrowed time, not a design margin
