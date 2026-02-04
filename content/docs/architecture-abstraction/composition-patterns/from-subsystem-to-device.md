---
title: "From Subsystem to Device"
weight: 30
---

# From Subsystem to Device

A regulated power supply is a subsystem. A bench power supply — with its own enclosure, front panel, binding posts, and user controls — is a device. A motor driver subsystem on a PCB is part of a device. A development board that integrates a microcontroller subsystem, power supply, debugger interface, and I/O headers is a device. The transition from subsystem to device is the step where internal functional structure meets the external world: connectors, enclosures, user interfaces, and the physical and electrical contracts that define how this thing interacts with everything else.

## What Makes a Device

A device is a self-contained unit with defined external interfaces. It has been integrated — meaning its subsystems have been made to work together — and it presents itself to the outside world through a finite set of connections with specified characteristics. The internal subsystem structure is, from the outside, an implementation detail.

Devices have properties that emerge from the integration of their subsystems:

**External interfaces with published specifications.** A device's connectors, voltage levels, communication protocols, and mechanical dimensions are its contract with the rest of the world. A bench power supply has binding posts that deliver a specified voltage and current range. A sensor module has a digital bus interface that delivers calibrated readings in a defined format. These interface specifications are what let devices be combined into systems without requiring knowledge of their internals.

**A power architecture.** Every device has an internal power distribution strategy — how the input power is converted, regulated, distributed, and sequenced to its subsystems. A development board might take 5 V from USB, regulate it to 3.3 V and 1.8 V, and sequence those rails at startup. This power architecture is invisible from outside but determines the device's input requirements, efficiency, thermal behavior, and resilience to power disturbances.

**Thermal management.** Subsystems dissipate power. The device must manage the resulting heat — through PCB copper, heat sinks, airflow, or thermal derating. Thermal management is a device-level concern because it depends on the physical proximity and arrangement of subsystems, the enclosure, and the operating environment. A subsystem might be rated for continuous operation, but the device it lives in might not provide the thermal environment needed to sustain that.

**Integration side effects.** When subsystems that were designed and tested independently are placed together in a device, they interact through shared resources: power rails, ground networks, thermal paths, electromagnetic coupling, and mechanical structure. These interactions don't exist during subsystem-level testing and only appear at the device level. Much of the effort in taking a design from "all subsystems work on the bench" to "the device works reliably" is finding and managing these integration side effects.

## The Composition Step

Building a device from subsystems introduces concerns that don't appear at lower levels:

**Power distribution becomes a design problem.** A subsystem assumes it receives clean, stable power within a specified range. The device has to actually deliver that — from whatever power source is available at its input, through whatever conversion and regulation stages are needed, to every subsystem's supply pins. Power distribution involves voltage conversion, filtering, decoupling, trace impedance, and current capacity. A device with a poor power distribution network may have subsystems that all work on the bench individually but fail when sharing a real power supply and a real PCB.

**Grounding strategy matters.** At the subsystem level, "ground" is an abstract reference. At the device level, ground is a physical conductor with resistance, inductance, and shared current paths. Analog and digital subsystems sharing a ground plane can corrupt each other through ground bounce. High-current and low-current paths sharing a ground trace can introduce voltage drops that shift operating points. Ground strategy — star grounding, split planes, controlled return paths — is a device-level composition concern.

**EMC becomes relevant.** Individual subsystems may be electrically quiet or only mildly noisy. But a device with a switching power supply, a digital processor, and a sensitive analog front end creates an EMC environment internally. Fast digital edges radiate; switching regulators conduct noise onto their input supplies; sensitive receivers pick up coupling from nearby traces. Managing electromagnetic compatibility within a device — before any regulatory requirement enters the picture — is a device-level composition task.

**Mechanical integration constrains electrical design.** The enclosure, connectors, mounting, and form factor impose constraints that subsystem-level design can ignore. A subsystem's layout may need to be rearranged to fit the enclosure. Thermal paths depend on mechanical contact and airflow. Connector placement determines cable routing, which affects signal integrity and EMI. The device is where electrical and mechanical design intersect.

**User interaction creates new requirements.** If the device has controls, indicators, or a display, those elements have their own subsystems and create their own integration challenges. A front-panel encoder generates switch bounce that needs debouncing. Status LEDs draw current that affects the power budget. A display creates digital noise near analog circuitry. User-facing elements are often treated as afterthoughts, but they're subsystems of the device and participate in all the integration effects.

## How Devices Fail as Compositions

Device-level failures are often invisible during subsystem-level testing because they arise from interactions between subsystems:

**Cross-subsystem power coupling.** A motor driver subsystem draws pulsed current that modulates the supply rail, and a sensitive ADC subsystem on the same rail produces readings that correlate with motor speed rather than the quantity being measured. Both subsystems pass their individual tests; the device fails because the power architecture doesn't adequately isolate them.

**Ground-mediated interference.** A digital subsystem's return current flows through a shared ground impedance, creating a voltage offset that the analog subsystem interprets as signal. The analog subsystem's accuracy specification is met in isolation but violated in the device.

**Thermal interaction.** A power subsystem heats the board area near a precision voltage reference, causing the reference to drift outside its tolerance. The reference is within spec at the temperature its own datasheet assumes; the device put it next to a heat source that the subsystem-level test didn't include.

**Startup race conditions.** Subsystem A requires subsystem B to be stable before it initializes, but the power sequencing doesn't enforce this order. On most power-up cycles the timing works out by accident; occasionally it doesn't, and the device fails to start. The failure rate depends on component tolerances, temperature, and input voltage ramp rate — all device-level variables.

**Connector and cable effects.** A subsystem with a high-impedance input works perfectly when tested with short leads on the bench. In the device, a cable from a front-panel connector to the PCB acts as an antenna, picking up interference that the subsystem's input stage amplifies faithfully.

## Tips

- During device integration, bring up subsystems one at a time when possible. Power the analog section first and verify it's clean before powering the digital section. This isolates cross-subsystem effects and makes them easier to identify when they appear.
- Measure power rail quality at the point of use (the subsystem's supply pins), not at the regulator output. The impedance of the distribution path — traces, vias, connectors — can make a clean source look noisy at the load.
- When a subsystem that worked on the bench misbehaves in the device, check power, ground, and thermal environment before suspecting the subsystem itself. The three most common integration-induced failures are all environmental: noisy power, corrupted ground reference, and excessive temperature.

## Caveats

- **"Works on the bench" is a weaker statement than it sounds** — Bench testing usually means short cables, a lab supply with excellent regulation, no nearby interference sources, and room temperature. The device operates with its own internal supply, its own ground network, its own thermal environment, and whatever electromagnetic environment it lives in. The gap between bench conditions and device conditions is where integration failures live.
- **Device-level debugging requires device-level thinking** — When a device exhibits a problem that no subsystem shows in isolation, adding more subsystem-level measurements won't find the cause. The interactions need measuring: shared supply rail noise, ground differential between subsystems, thermal gradients across the board. These are device-level observations.
- **Integration is not a one-time event** — Each design revision, component substitution, or layout change can reintroduce integration effects that were previously resolved. A new switching frequency, a different PCB stackup, or a relocated connector can change the coupling between subsystems.

## Bench Relevance

- A device that works at room temperature but fails in an enclosure reveals a thermal integration problem — the enclosure restricts airflow, and some subsystem is exceeding its thermal limits.
- Noise on an analog measurement that correlates with a digital bus's activity is cross-subsystem coupling through power, ground, or proximity. The correlation pattern reveals the coupling mechanism: supply frequency means conducted, clock frequency means radiated, and data-dependent means ground bounce.
- A device that fails intermittently on power-up but works once running has a startup sequencing or reset timing problem. Monitoring the power rails, reset lines, and enable signals with a scope during power-up — capturing the first 100 ms — usually reveals which subsystem is losing the race.
