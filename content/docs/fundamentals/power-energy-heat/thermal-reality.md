---
title: "Thermal Reality"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Thermal Reality

Every watt of electrical power that isn't doing useful work becomes heat. Components have maximum temperatures, and exceeding them causes failure — sometimes immediately, sometimes slowly. Understanding thermal limits bridges "works on the bench" and "works reliably."

## Dissipation Ratings and What They Mean

A component's power rating specifies the maximum continuous power it can dissipate without exceeding its maximum junction or body temperature — **at a specified ambient temperature**, usually 25°C.

- A 1/4 W resistor can dissipate 250 mW at 25°C ambient
- A TO-220 transistor might be rated for 50 W — but only with an infinite heatsink at 25°C
- The actual safe power dissipation depends on the actual thermal environment, not the datasheet headline number

## The Thermal Model

Heat flows from hot to cold through thermal resistance, analogous to current flowing through electrical resistance:

- **Temperature difference** (ΔT, in °C) = "voltage"
- **Power dissipated** (P, in W) = "current"
- **Thermal resistance** (θ, in °C/W) = "resistance"

**ΔT = P × θ**

For a chip with junction-to-ambient thermal resistance of 60°C/W, dissipating 1 W raises the junction 60°C above ambient. At 25°C ambient, that's 85°C junction temperature.

### Thermal Resistance Chain

The heat path from junction to ambient usually involves multiple thermal resistances in series:

- Junction to case (θ_JC) — through the package
- Case to heatsink (θ_CS) — through thermal interface material
- Heatsink to ambient (θ_SA) — through convection and radiation

Total: θ_JA = θ_JC + θ_CS + θ_SA

Each interface adds thermal resistance. Thermal paste or pads reduce θ_CS but don't eliminate it.

## Derating

Derating means reducing the maximum allowable power as temperature increases. Most datasheets include a derating curve showing how the power rating drops linearly from the rated value at 25°C to zero at the maximum temperature.

A 1/4 W resistor rated to 155°C maximum might derate linearly above 70°C. At 100°C ambient, it can only handle about 100 mW. At 155°C ambient, it can handle 0 W.

**Always check what ambient temperature the rating assumes.** Quoting a power rating without its temperature condition is meaningless.

## Quiet Failures Before Spectacular Ones

Thermal failures are often gradual:

- **Electrolytic capacitor dry-out** — Heat accelerates electrolyte evaporation. Capacitance drops, ESR rises, and the cap slowly stops doing its job. Lifetime halves for every 10°C rise above the rated temperature
- **Solder joint fatigue** — Thermal cycling (repeated heating and cooling) causes solder joints to crack over time. BGA packages are especially susceptible
- **Parameter drift** — Semiconductor parameters shift with temperature and long-term thermal stress. A circuit might work at room temperature but drift out of spec as components age under thermal stress
- **Insulation breakdown** — Elevated temperatures degrade insulation over time, eventually leading to leakage or shorts

The spectacular failures (magic smoke, fire, package cracking) happen when thermal limits are exceeded quickly and dramatically. But most thermal failures are the slow kind — the circuit works for weeks or months, then starts acting flaky.

## Tips

- Allow 30-50% margin below thermal limits for long-term reliability
- Add copper area around power components — it's free heatsinking
- Consider worst-case ambient temperature, not typical conditions
- Thermal vias under power pads significantly reduce θ_JA

## Caveats

- Still air vs. forced air — Datasheet ratings often assume some airflow. In a sealed enclosure with no fan, thermal resistance is much higher than the datasheet value
- Nearby heat sources — A component rated at 25°C ambient might be sitting next to a voltage regulator running at 80°C. The local ambient is not the room temperature
- Thermal coupling — Heat from one component conducts through the PCB to neighboring components. A hot regulator can raise the temperature of nearby electrolytics
- Copper pours help — PCB copper area acts as a heatsink. Datasheets for power components often specify minimum copper area. Skimping on copper area reduces the effective power rating
- Transient thermal behavior — Thermal mass provides short-term protection. A component can survive brief power pulses above its continuous rating because it takes time to heat up. But thermal mass runs out — this is borrowed time, not a design margin

## In Practice

- A component too hot to touch comfortably is above ~60°C — investigate the power path
- Burning immediately on contact indicates 70-80°C or higher — likely approaching or exceeding limits
- Intermittent failures that appear after warm-up and disappear after cooling suggest thermal margin issues
- Electrolytic capacitors near hot components often fail first in aging equipment — check ESR with an ESR meter
- A thermal camera or IR thermometer quickly identifies unexpected hot spots that point to design or fault issues
