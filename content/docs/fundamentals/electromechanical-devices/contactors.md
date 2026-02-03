---
title: "Contactors"
weight: 30
---

# Contactors

A contactor is a heavy-duty relay designed for switching high-power loads — primarily motors, heating elements, and mains distribution circuits. The operating principle is the same as a relay (coil energizes, armature moves, contacts close), but everything is scaled up: larger contacts, stronger springs, heavier armatures, and arc suppression mechanisms that relays don't need.

If a relay is a light switch, a contactor is a circuit breaker that can be actuated remotely.

## Where Contactors Live

Contactors are industrial and power distribution components. They're found in:

- **Motor control** — Starting, stopping, and reversing three-phase motors. This is the primary application
- **Lighting panels** — Switching large banks of lighting in commercial buildings
- **Heating loads** — Resistance heating elements in ovens, furnaces, and process heaters
- **Power distribution** — Connecting and disconnecting power feeds, generator transfer switching
- **EV and battery systems** — Main battery disconnect, pre-charge circuits, and high-voltage distribution

Contactors are rated in AC-1 through AC-4 utilization categories (IEC 60947), which define the load type:

- **AC-1** — Non-inductive or slightly inductive loads (resistive heating). Easiest on the contacts
- **AC-3** — Squirrel-cage motors, starting and stopping during normal running. The standard motor contactor rating
- **AC-4** — Squirrel-cage motors, plugging and jogging (reversing under load). The most demanding — very high inrush current and the contacts must break near-stall current where the power factor is low and arcing is severe

The same physical contactor has very different current ratings depending on the utilization category. A contactor rated 40 A in AC-3 might only be rated 10 A in AC-4.

## Arc Suppression

This is the critical difference between contactors and relays. At high currents and voltages, opening a contact draws a sustained electrical arc — a plasma channel that can reach thousands of degrees, erode contact material rapidly, and weld contacts shut.

Contactors use several mechanisms to manage arcs:

- **Arc chutes** — A stack of metal plates near the contacts. The arc is drawn into the chute by magnetic force and thermal convection, where it's stretched across multiple gaps and cooled until it can no longer sustain itself. This is the primary arc suppression method in AC contactors
- **Magnetic blowout coils** — A coil in series with the contacts creates a magnetic field that deflects the arc into the arc chute. Used in DC contactors where arcs are harder to extinguish (no zero crossing)
- **Contact gap** — Contactors open with a larger gap than relays (several millimeters to centimeters), making it harder for the arc to sustain
- **Contact material** — Silver alloys (silver-cadmium oxide, silver-tin oxide) resist arc erosion better than pure silver. The contact material choice affects the contactor's electrical life at rated load

## Coil Drive and Control

### Coil Voltage

Contactor coils are available in a wide range of voltages: 24 VAC, 120 VAC, 240 VAC, 24 VDC, 48 VDC, and others. AC coils are more common in industrial applications because the control voltage is often derived from the load circuit via a control transformer.

### AC vs. DC Coils

**AC coils:**

- Draw high inrush current when energizing (the coil impedance is low before the armature closes and the air gap reduces). Once pulled in, the impedance rises and current drops
- Produce a characteristic hum (the magnetic force pulsates at twice the line frequency). A shading ring on the pole face smooths this — without it, the armature chatters audibly
- If the armature is mechanically jammed and can't close, the coil stays at inrush current levels and will overheat and burn out

**DC coils:**

- Constant current regardless of armature position
- Silent operation (no pulsating magnetic field)
- No overheating risk from a stuck armature (current is the same open or closed)
- Require a flyback diode or suppression circuit, just like relay coils

Modern contactors increasingly use electronic coil drivers — the coil is DC internally with a built-in rectifier and inrush management circuit, regardless of the control voltage supplied.

### Auxiliary Contacts

Most contactors include one or more auxiliary contacts — low-current contacts that change state with the main contacts. These are used for:

- **Seal-in (holding) circuits** — An auxiliary NO contact in parallel with the start button keeps the contactor energized after the button is released. The stop button breaks this seal-in path
- **Interlocking** — An auxiliary NC contact from one contactor prevents another from energizing simultaneously (used in reversing motor starters to prevent both directions from being commanded at once)
- **Status indication** — Signaling to a PLC or control system that the contactor has actually pulled in (or dropped out)

## Motor Starting Circuits

The most common contactor application. Basic patterns:

### Direct-On-Line (DOL)

The simplest arrangement. The contactor connects the motor directly to the supply. Inrush current is 6-8× the full-load current. Acceptable for small motors (up to a few kW on most supply systems), but the voltage dip from high inrush can upset other equipment on the same supply.

### Star-Delta Starting

Two contactors and a timer. The motor starts in star (wye) connection — the voltage across each winding is reduced by √3, and the starting current is reduced to about 1/3 of DOL inrush. After a timed interval, the contactors switch the motor to delta connection for normal running.

The transition from star to delta is open — both contactors are briefly off while switching. The motor is briefly disconnected from the supply and may slip in speed. When the delta contactor closes, there can be a secondary current transient. Closed-transition starters (which briefly connect a resistor during the switchover) reduce this, at the cost of a third contactor.

### Reversing

Two contactors, mechanically and electrically interlocked. One connects the motor in the forward direction; the other swaps two phases for reverse. Both must never be on simultaneously — this would short two phases together and trip the upstream protection instantly (or destroy the contactors).

Interlocking is done at two levels:

- **Electrical** — Each contactor's auxiliary NC contact is wired in series with the other's coil circuit
- **Mechanical** — A physical linkage between the two contactors prevents both armatures from closing simultaneously

Both levels are required. Electrical interlocking alone can fail if a contactor welds shut.

## Tips

- Match contactor utilization category to the actual application — AC-3 ratings don't apply to AC-4 duty
- Use both electrical and mechanical interlocking in reversing circuits
- Check coil voltage tolerance — low supply voltage causes chattering that destroys contacts

## Caveats

- AC coil burnout from stuck armature — If the contactor can't close (jammed mechanism, mechanical obstruction, insufficient voltage), the AC coil stays at inrush current and overheats within seconds. This is one of the most common contactor failure modes
- Contact welding — Just like relays, but at higher energy levels. Switching high-inrush loads (motors, capacitor banks) is the usual cause. Welded contacts can't be released by de-energizing the coil — the load stays connected until upstream protection trips or power is removed manually
- Coil voltage tolerance — Contactors have a minimum pick-up voltage (typically 85% of nominal) and a maximum rated voltage (110%). Low supply voltage may cause the contactor to chatter (pull in and drop out repeatedly), which destroys the contacts rapidly
- Mounting orientation — Some contactors are designed to be mounted vertically (upright). Mounting them sideways or inverted can affect the armature's closing force and the arc chute's effectiveness. Check the datasheet
- Ambient temperature derating — Contactor ratings assume a specific ambient temperature (usually 40°C). In hot enclosures, the current rating must be derated. The coil is also affected — hotter coils have higher resistance (less current) and may fail to pull in reliably
- Noise and vibration — AC contactors produce mechanical noise when they pull in and release, and a steady hum while energized. In noise-sensitive environments, DC coil contactors or electronic coil drivers are preferred
- Pre-charge in DC systems — In battery and EV systems, closing a contactor into a large capacitor bank (like a motor drive's DC bus capacitors) draws enormous inrush current that can weld the contacts on the first close. A pre-charge resistor and a secondary contactor are used to slowly charge the capacitors before the main contactor closes

## Bench Relevance

- A contactor that hums loudly or chatters has insufficient coil voltage or a stuck armature
- Contacts that won't release indicate welding — check the load for inrush conditions
- An AC coil that overheats quickly suggests the armature is jammed and can't close
- A contactor that works sometimes indicates marginal coil voltage — measure at the coil terminals during operation
