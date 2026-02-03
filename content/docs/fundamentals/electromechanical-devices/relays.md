---
title: "Relays"
weight: 10
---

# Relays

An electromagnet that closes (or opens) a set of contacts. Apply current to the coil, the armature moves, and the contacts change state. Remove the current, a spring returns everything to the resting position. Simple, reliable, and electrically brutal in ways that catch people off guard.

## Why Relays Still Exist

Solid-state switches (MOSFETs, triacs, SSRs) can do most of what relays do, faster and with no moving parts. But relays have properties that are hard to replicate:

- **True galvanic isolation** — The coil circuit and contact circuit share no electrical connection. No leakage current, no parasitic coupling, no sneak paths. The isolation voltage can be thousands of volts
- **Near-zero on-resistance** — Metal-to-metal contact. Milliohms, not the tens of milliohms of a power MOSFET. No on-state voltage drop worth mentioning
- **Bidirectional, any signal type** — DC, AC, audio, RF (with the right relay). No polarity, no minimum holding current, no gate charge. The contacts don't care what's flowing through them
- **Multi-pole, multi-throw** — A single relay can switch multiple independent circuits simultaneously (DPDT, 4PDT, etc.). Doing this in solid-state requires multiple devices and careful isolation

## Coil Drive

The coil is an inductor. Driving it requires understanding inductive loads.

### Coil Specifications

- **Coil voltage** — The nominal voltage to activate the relay. Common values: 3.3 V, 5 V, 12 V, 24 V, 48 V
- **Coil resistance** — Determines coil current: I = V / R. A 12 V relay with a 400 Ω coil draws 30 mA
- **Pick-up voltage** — The minimum voltage to reliably pull in the relay (typically 75% of nominal)
- **Drop-out voltage** — The voltage at which the relay releases (typically 25-50% of nominal). The gap between pick-up and drop-out provides hysteresis

### Driving from Microcontrollers

A microcontroller GPIO pin typically can't drive a relay coil directly — the current is too high (20-80 mA typical) and the voltage may not match. Standard approach:

- NPN transistor (or N-channel MOSFET) as a low-side switch
- Coil connected between the supply rail and the transistor's collector (or drain)
- Base resistor sized for adequate saturation (for BJT) or gate connected through a resistor for noise immunity (for MOSFET)
- **Flyback diode across the coil** — absolutely essential

### The Flyback Diode

When the transistor turns off, the coil's magnetic field collapses. The inductance tries to maintain current flow (V = L × dI/dt), generating a voltage spike that can reach hundreds of volts from a 12 V coil. This spike destroys transistors.

A diode across the coil (cathode to the positive supply side, anode to the transistor side) clamps this spike to one diode drop. Problem solved — but at a cost: the diode slows the relay's release time because the coil current now decays through the diode instead of stopping instantly.

If fast release matters (and it sometimes does — overlap during switching, timing-critical applications), a Zener diode in series with the flyback diode lets the voltage spike rise to the Zener voltage before clamping. This speeds up the field collapse but increases the voltage the transistor must withstand.

## Contact Ratings

Relay contacts are specified for particular load types. The ratings are not interchangeable.

### Resistive vs. Inductive vs. Capacitive Loads

- **Resistive load rating** — The headline number. Clean switching, minimal arcing. 10 A resistive is straightforward
- **Inductive load rating** — Significantly derated from the resistive rating. Inductors maintain current flow when the contacts open, drawing an arc. The arc erodes the contact material and can weld the contacts shut. Motors, solenoids, and transformers are inductive loads
- **Capacitive load rating** — Derated because of inrush current. Switching a discharged capacitor bank draws a momentary current spike that can weld contacts

### AC vs. DC Ratings

AC contacts self-extinguish arcs because the current crosses zero every half-cycle. DC arcs are sustained — once struck, a DC arc must be mechanically stretched until it can't sustain itself. This is why DC contact ratings are often much lower than AC ratings for the same relay.

A relay rated for 10 A at 250 VAC might only be rated for 5 A at 30 VDC. The DC voltage rating matters too — above about 30 VDC, arcing becomes increasingly difficult to extinguish.

## Contact Bounce

When relay contacts close, they don't make a single clean connection. The contact surfaces bounce — making and breaking contact several times over a period of 1-10 ms. This is invisible to a motor or a heater, but it's a problem for:

- Digital logic inputs — Each bounce looks like a separate signal edge. A counter sees multiple counts. An interrupt fires multiple times
- Sensitive analog circuits — Each bounce is a transient

**Debouncing** is required when a relay drives a digital input. Hardware (RC filter + Schmitt trigger) or software (timing-based filtering) approaches both work. The bounce duration depends on the relay — check the datasheet or measure it.

## Relay Types

### General-Purpose PCB Relays

The most common type. Small, cheap, available in every coil voltage and contact configuration. Sugar-cube form factor. Good for switching a few amps at moderate voltages. Used for signal routing, low-power load switching, and isolation.

### Power Relays

Larger, higher current ratings (10-30 A). Used for appliance control, automotive loads, and industrial switching. Often have clear plastic covers so the contact state is visible.

### Latching Relays

Bistable — they stay in the last commanded position with no coil power. A pulse to one coil sets the relay; a pulse to a second coil (or reverse polarity on the same coil) resets it. Used where power consumption matters or where the relay must maintain state through a power failure.

### Solid-State Relays (SSRs)

Not actually relays — no mechanical contacts. An optocoupler drives a MOSFET (DC SSR) or triac (AC SSR). They're included here because they're often drop-in replacements for mechanical relays with different tradeoffs:

- No contact bounce, no arcing, no mechanical wear
- Silent operation
- Higher on-state resistance (milliohms to ohms) — generates heat
- Leakage current when off (a few mA for triac types) — this can be a problem for low-power loads that stay partially energized
- No multi-pole capability (one SSR per circuit)
- Vulnerable to voltage spikes and overcurrent in ways that mechanical contacts aren't (contacts can survive brief overloads; semiconductors die instantly)

## Tips

- Always use a flyback diode on the coil — omitting it is a time bomb
- Match contact ratings to the actual load type (resistive, inductive, capacitive)
- Use slow-blow fuses or add snubbers when switching inductive loads

## Caveats

- Flyback diode is mandatory — Driving a relay coil without one is a time bomb. It might work for a while. Then the transistor fails, usually at the worst possible time
- Contact welding — Exceeding the contact rating (especially with inductive or capacitive loads) can weld the contacts shut permanently. The relay appears stuck on and cannot be released by de-energizing the coil. The only fix is replacement
- Coil power consumption — A relay that's energized continuously draws continuous power. A 12 V, 30 mA relay consumes 360 mW. In battery-powered applications, this adds up. Latching relays solve this
- Mechanical life vs. electrical life — Datasheets list both. Mechanical life (no load) might be 10 million cycles. Electrical life (at rated load) might be 100,000 cycles. The difference is entirely due to contact erosion from arcing
- Contact material matters — Silver contacts have low resistance but are susceptible to sulfide tarnishing in contaminated environments. Gold-plated contacts resist tarnishing and work better for low-level signals (microvolts, microamps) where oxide films would cause intermittent connections
- Coil suppression slows release — The flyback diode that protects the transistor also extends the relay's release time from ~1 ms to ~5-20 ms. If switching speed matters, use a Zener-clamped suppression circuit

## Bench Relevance

- A relay that won't release when the coil is de-energized likely has welded contacts
- A transistor that fails when switching a relay likely lacks a flyback diode
- Erratic behavior when a relay switches indicates contact bounce affecting downstream logic — add debouncing
- A relay coil that draws more current than expected may have a shorted turn or be the wrong voltage rating
