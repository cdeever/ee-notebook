---
title: "Constraints: Size, Power, Cost & Environment"
weight: 30
---

# Constraints: Size, Power, Cost & Environment

Every design lives inside a box of constraints — some obvious, some hidden, and some that only reveal themselves when you violate them. Constraints are not the same as requirements. Requirements describe what the system must do. Constraints describe the boundaries within which the design must exist. You can negotiate requirements; constraints are usually imposed by physics, economics, or regulations.

## Recognizing Constraints Early

The most expensive time to discover a constraint is after the PCB has been fabricated. The cheapest time is before the schematic is started. Early constraint identification doesn't require detailed analysis — it requires asking the right questions:

- Where will this device physically exist? (Size, mounting, enclosure)
- What power sources are available? (Mains, battery, solar, USB, harvested)
- Who is paying for this, and what's the budget? (BOM cost, tooling, assembly)
- What environment will it operate in? (Temperature, humidity, vibration, dust, chemicals)
- Are there regulatory or compliance requirements? (EMC, safety, environmental)
- Who will build, maintain, and repair it? (Assembly complexity, test access, documentation)

Each question opens a category of constraints that shapes design decisions. Missing even one category can invalidate a design late in development.

## Size Constraints

Physical size affects nearly every electrical decision. Smaller boards mean:

- Tighter routing, more layers, and higher fabrication cost
- Smaller component packages with harder soldering and inspection
- Less copper area for power and ground planes, increasing impedance and noise
- Less physical separation between analog and digital sections
- Reduced thermal capacity and convection area — things run hotter
- Fewer test points and debug access features

Size constraints often come from an enclosure, a mounting location, or a form factor standard. A design that must fit inside an existing enclosure is constrained in three dimensions simultaneously — PCB area, component height, and connector placement.

| Package size | Typical passive | Hand-solderable? | Inspection difficulty |
|---|---|---|---|
| 0805 | 2.0 x 1.25 mm | Yes, comfortably | Easy with magnification |
| 0603 | 1.6 x 0.8 mm | Yes, with care | Moderate |
| 0402 | 1.0 x 0.5 mm | Difficult | Needs microscope |
| 0201 | 0.6 x 0.3 mm | Impractical by hand | Requires automated inspection |

For hobby and learning projects, staying at 0603 or larger keeps hand assembly feasible. Going smaller is sometimes necessary for size-constrained designs, but it changes the manufacturing process and inspection requirements.

## Power Constraints

Power constraints cascade through the design in ways that aren't immediately obvious:

- **Battery capacity limits total energy.** A CR2032 has roughly 225 mAh. At 10 mA continuous draw, that's less than a day. At 10 uA average, it lasts years.
- **Thermal budget limits continuous dissipation.** A TO-252 package can dissipate about 1-2W depending on the PCB copper area. Exceed that and the part overheats.
- **Available supply rails constrain component selection.** If the system runs on a single lithium cell (2.8V to 4.2V), every component must operate across that range.
- **Efficiency requirements drive topology.** A 12V to 3.3V conversion at 500 mA wastes 4.35W in a linear regulator but only about 0.2-0.5W in a switcher.

Power constraints interact with size constraints. A switching regulator is more efficient but needs an inductor and more PCB area. A linear regulator is compact but generates heat that needs somewhere to go. In a small sealed enclosure, that heat has nowhere to go, which brings us back to the size constraint.

## Cost Constraints

Cost constraints come in several flavors, and they don't all scale the same way:

| Cost type | Scales with | Example |
|---|---|---|
| Component (BOM) cost | Per unit | $3.50 per board |
| PCB fabrication | Per panel, decreasing with quantity | $5 for 5 boards from JLCPCB, $0.50/board at 1000 |
| Assembly | Per unit, decreasing with automation | $20 hand-built, $2 machine-assembled |
| Tooling (NRE) | One-time | $500 for a custom enclosure mold |
| Design time | One-time (but often underestimated) | 40 hours at your billing rate or opportunity cost |
| Test and validation | Per design, partially per unit | Test fixture, calibration, compliance testing |

For one-off learning projects, BOM cost and design time dominate. For anything approaching production, assembly cost and tooling become significant. The BOM optimization that saves $0.10 per unit is irrelevant at 10 units but critical at 100,000.

A common trap is optimizing the wrong cost. Spending 20 hours of design time to save $2 on a BOM only makes sense if you're building more than a handful of units.

## Environmental Constraints

The operating environment determines which components survive and which fail:

- **Temperature.** Commercial components are typically rated 0 C to +70 C. Industrial: -40 C to +85 C. Automotive: -40 C to +125 C. Each step up costs more and narrows the selection of available parts.
- **Humidity.** High humidity causes corrosion, leakage currents, and dielectric breakdown. Conformal coating or sealed enclosures add cost and complexity.
- **Vibration and shock.** Through-hole components are mechanically robust. Tall electrolytic capacitors on a vibrating platform will fatigue their leads and fail. Heavy components (transformers, large connectors) need mechanical reinforcement.
- **Dust and particulates.** Conductive dust (metal particles, carbon) can cause shorts. Enclosure IP rating and filtration become design requirements.
- **Chemical exposure.** Certain solvents attack PCB conformal coatings, connector plastics, or enclosure materials. Know the environment.
- **Altitude.** Reduced air pressure at altitude reduces convection cooling and changes the voltage at which arcing occurs. Relevant for aerospace and some industrial applications.

## How Constraints Interact

Constraints rarely exist in isolation. They form a web of interdependencies that tighten the design space:

- **Smaller = hotter.** Reducing PCB size concentrates heat dissipation into a smaller area, raising component temperatures. This can push components beyond their ratings unless power consumption is also reduced.
- **Cheaper = fewer features.** Cutting BOM cost often means fewer protection components (TVS diodes, fuses, filtering), which reduces robustness in harsh environments.
- **Lower power = slower.** Reducing power consumption often means lower clock speeds, fewer active peripherals, and longer processing times. If latency is also constrained, these pull in opposite directions.
- **More environmental protection = larger and more expensive.** Conformal coating, potting, sealed enclosures, and extended-temperature components all add cost and often size.

The design space is the region where all constraints are simultaneously satisfied. If that region is empty — if no design can meet all constraints — then one or more constraints must be relaxed. Recognizing this early is far better than discovering it after layout.

## Common Constraint Categories

| Category | Typical parameters | What it affects |
|---|---|---|
| Size | PCB dimensions, height limit, enclosure volume | Package selection, routing density, layer count |
| Power | Supply voltage range, current budget, battery life | Regulator topology, sleep strategy, component selection |
| Cost | BOM target, assembly budget, tooling budget | Component selection, board complexity, quantity decisions |
| Temperature | Operating range, storage range, thermal derating | Component grade, cooling strategy, material selection |
| Regulatory | EMC limits, safety standards, RoHS/REACH | Shielding, isolation, material restrictions |
| Mechanical | Vibration, shock, mounting method | Component selection, PCB mounting, enclosure design |
| Schedule | Design deadline, lead times, prototype turnaround | Design reuse, component availability, fab house selection |

## Gotchas

- **Hidden constraints appear late.** The enclosure designer mentions a height limit after the PCB is laid out with tall electrolytic capacitors. Always ask about physical constraints before component selection.
- **Constraints propagate through the supply chain.** A component that meets your technical constraints but has a 16-week lead time violates your schedule constraint. Availability is a constraint, not just a logistics inconvenience.
- **Temperature derating is not optional.** A capacitor rated for 85 C at full voltage is only rated for a fraction of that voltage at higher temperatures. Datasheet maximum ratings assume ideal conditions that your design may not provide.
- **"Low cost" and "reliable" are in tension.** Cheap components have wider tolerances, fewer screening steps, and less consistent supply chains. Understand what you're trading away.
- **The constraint you don't write down is the one that bites you.** If the device must survive being dropped, that's a constraint. If it must be assembled by someone with no soldering experience, that's a constraint. Make them explicit.
- **Environmental constraints compound over time.** A device that survives thermal cycling for a week may fail after a year of daily cycling due to solder fatigue and material degradation. Short-term testing may not reveal long-term environmental failures.
