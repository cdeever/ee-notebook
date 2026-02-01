---
title: "Reference Planes & Grounds"
weight: 20
---

# Reference Planes & Grounds

Ground is a reference, not a destination. There is no universal zero-volt point in the universe — "ground" is just the node you choose to call zero for a particular circuit. Every voltage measurement is a difference between two points, and "ground" is the agreed-upon reference for one of them. Getting confused about this causes more measurement errors, noise problems, and design mistakes than almost anything else.

## What "Ground" Actually Means

In circuit theory, ground is the reference node — the node assigned 0 V in the analysis. All other voltages are measured with respect to it. This is a mathematical convenience. The choice of which node to call ground doesn't change the physics; it changes the numbers.

In practice, "ground" gets used to mean at least four different things:

| Term | What it actually means |
|------|----------------------|
| **Circuit ground (0 V reference)** | The node you chose as your voltage reference for analysis or measurement |
| **Signal ground** | The return path for signal currents — the conductor that completes the signal loop |
| **Chassis ground** | The metal enclosure of the equipment, usually connected to safety earth for shock protection |
| **Earth ground** | A physical connection to the earth, typically through building wiring (the green or green/yellow wire) |

These are not the same thing, even though schematics often use the same symbol for all of them. In a well-designed system, some or all of them may be connected together at a specific point — but they serve different functions and carry different currents.

## "0 V" Is Contextual

The voltage at any node depends on what you're measuring it against. A node that is at 0 V relative to the local circuit ground might be at 50 V relative to earth ground, or at -3 V relative to another circuit's ground.

This becomes practical in several ways:

**Between devices on the same bench.** Two instruments plugged into different outlets might have ground potentials that differ by millivolts to volts. When you connect them with a signal cable, that voltage difference drives current through the cable's ground — a ground loop (see [Is There a Ground Loop?]({{< relref "/docs/measurement/noise-interference-grounding/ground-loop" >}})).

**Between sections of the same PCB.** The ground plane has finite resistance and inductance. Heavy current flowing through the ground plane creates voltage drops — so the ground potential under a switching power supply is not the same as the ground potential under a sensitive analog input. This is ground bounce, and it's why analog and digital circuits are often referenced to different points on the same ground plane.

**Between battery-powered and mains-powered systems.** A battery-powered device has a floating ground — its 0 V rail has no defined relationship to earth ground. When you connect a mains-powered oscilloscope (whose ground is tied to earth) to a battery-powered circuit, the scope's ground clip forces a connection between the circuit's ground and earth. This can change the circuit's behavior, inject noise, or in some cases damage something.

## Local vs Global Reference

In a complex system — a PCB with multiple subsystems, or a rack of interconnected equipment — there is tension between having a single global ground reference and having local references optimized for each subsection.

**Global reference (single ground):** Every part of the system shares one ground node. Simple conceptually, but any noise current flowing through the shared ground affects every circuit. Works well for small, simple systems.

**Local references with defined interconnection:** Each subsystem has its own local ground reference, and the grounds are connected together at a single, controlled point. This is the idea behind star grounding in audio systems and behind separate analog and digital ground pins on mixed-signal ICs. The connection point is chosen to minimize the coupling of noisy return currents into sensitive circuits.

The key principle: it's not about isolating grounds (that usually makes things worse — see [Go & Return Paths]({{< relref "go-and-return-paths" >}})). It's about controlling where return currents flow so that noisy currents don't share a path with sensitive signals.

## Chassis Ground vs Signal Ground

In any equipment with a metal enclosure, there are at least two ground systems:

**Signal ground** is the return path for the circuit's signals. It carries the currents that are part of normal operation — signal return currents, power supply return currents, and bias currents. Signal ground is designed by the circuit designer and is part of the schematic.

**Chassis ground** is the metal enclosure. Its primary purpose is safety — if a mains wire comes loose and contacts the chassis, the chassis-to-earth connection provides a low-impedance path for fault current, tripping the breaker before anyone gets shocked. Chassis ground also provides shielding against external electromagnetic fields.

The question of how to connect signal ground to chassis ground is a recurring design decision:

| Connection method | When to use |
|------------------|-------------|
| **Direct connection at one point** | Most common. Signal ground and chassis are bonded at a single point (usually near the power entry). Prevents ground loops between signal and chassis while maintaining safety |
| **Direct connection at multiple points** | High-frequency systems (RF equipment) where a single point connection is too inductive. Multiple short bonds between signal ground and chassis provide low-impedance connection at high frequencies |
| **Through a capacitor** | When DC isolation between signal and chassis is needed (to prevent DC ground loops or for measurement reasons) but high-frequency bonding is desired. A ~10 nF capacitor between signal ground and chassis passes RF but blocks DC and mains-frequency currents |
| **No connection (floating signal ground)** | Battery-powered devices, isolated measurement systems, or systems where the signal ground must be independent of earth. Less common and requires careful design to avoid EMI issues |

## Floating vs Earth-Referenced Systems

A floating system has no galvanic connection to earth ground. Its ground reference is internal — the negative terminal of a battery, or the isolated secondary of a transformer. The circuit works fine because all its voltages are relative to its own internal reference.

An earth-referenced system has its ground connected to the building's earth ground system, usually through the power cord's ground pin.

| | Floating | Earth-referenced |
|-|---------|-----------------|
| **Ground reference** | Internal (battery, isolated supply) | Earth ground via mains wiring |
| **Noise immunity** | Immune to earth ground noise | Susceptible to ground potential differences |
| **Safety** | No automatic fault path to earth | Safety earth provides fault protection |
| **Measurement** | Can measure across any two points without constraint | One probe terminal is always at earth potential |
| **EMI** | May accumulate static charge; needs defined reference for EMC | Defined reference aids EMC compliance |

**Why it matters for measurement:** An earth-referenced oscilloscope has its ground clip tied to earth through the power cord. Connecting the ground clip to anything other than circuit ground creates a short through earth. A floating oscilloscope (battery-powered, or with an isolation adapter) doesn't have this constraint. Understanding whether your instruments are floating or earth-referenced prevents the most common source of accidental shorts during bench measurement.

## The Ground Symbol in Schematics

Schematics use several ground symbols, and the conventions are not always consistent:

| Symbol style | Typical meaning |
|-------------|----------------|
| Three decreasing horizontal lines (triangle) | Earth ground — connection to building earth |
| Three horizontal lines of equal length | Chassis ground — connection to equipment enclosure |
| Single horizontal line or downward-pointing triangle | Signal / circuit ground — the reference node |

When reading someone else's schematic, don't assume all ground symbols mean the same net. Check whether the design distinguishes between earth, chassis, and signal ground — especially in any design with a power supply, a metal enclosure, or connections to other equipment.

## Gotchas

- **"Connect to ground" is ambiguous.** Always ask: which ground? Signal, chassis, or earth? The answer determines where the return current flows and what noise it picks up
- **Ground planes have impedance.** A ground plane is not 0 V everywhere — it has resistance and inductance that create voltage gradients when current flows through it. At DC, the voltage drop is often negligible. At high frequencies or with large transient currents, ground plane voltage variations matter
- **Safety earth is non-negotiable.** Never disconnect the safety earth ground to fix a noise problem. Use proper solutions: balanced connections, isolation transformers, differential measurement. The safety earth exists to protect people, and compromising it for signal quality is never acceptable
- **Isolated power supplies don't guarantee floating operation.** An isolated DC-DC converter provides galvanic isolation at the power supply — but if the output ground connects to earth through any other path (a USB cable, a signal cable, a chassis connection), the system is no longer floating
- **Mixed-signal IC ground pins (AGND, DGND) are about return current management, not isolation.** The datasheet says to connect AGND and DGND together at the IC. The separate pins exist so the PCB designer can route analog and digital return currents on separate paths to the common connection point, preventing digital switching noise from riding on the analog reference. Leaving one of them unconnected, or connecting them at different points, usually makes performance worse
