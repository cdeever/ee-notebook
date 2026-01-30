---
title: "Inductors"
weight: 30
---

# Inductors

A coil of wire around a core (or air). Inductors store energy in magnetic fields and resist changes in current. They're essential in power conversion, filtering, and RF — and they're the component most likely to surprise you with unexpected behavior.

## The Basic Relationship

V = L x (dI/dt)

The voltage across an inductor is proportional to the rate of change of current through it. Constant current = zero voltage. Changing current = voltage. Sudden interruption of current = very large voltage (because dI/dt is huge).

This is why inductors create voltage spikes when you switch off current abruptly, and why flyback diodes are essential on inductive loads.

## Stored Energy

E = 1/2 LI^2

The energy is in the magnetic field. It's proportional to current squared, so doubling the current quadruples the stored energy. When the current path is interrupted, this energy has to go somewhere — typically into a voltage spike that can destroy semiconductors.

## Where Inductors Live

### Power Conversion

Switching regulators (buck, boost, buck-boost) use inductors as the energy storage element. The inductor charges during one phase of the switching cycle and delivers energy during the other. Inductor selection (inductance, saturation current, DCR) is critical to converter performance.

### Filtering

LC filters provide sharper roll-off than RC filters. Used in power supply output filtering, EMI filtering, and RF signal conditioning. The LC resonant frequency is f = 1 / (2 x pi x sqrt(L x C)).

### RF and Signal

RF circuits use inductors for impedance matching, tank circuits, and chokes. At RF frequencies, every wire is an inductor, and PCB trace inductance matters.

## Saturation: The Main Gotcha

Every inductor with a magnetic core has a saturation current. Above this current, the core can't store more magnetic energy, and the inductance drops dramatically — often to a fraction of its rated value.

What happens when an inductor saturates:

- Inductance drops suddenly
- Current rises rapidly (because V = L x dI/dt, and L just got much smaller)
- In a switching converter, this means a current spike that can blow the switching transistor or trip overcurrent protection
- The inductor might not be damaged, but the circuit around it can be

**Always check the saturation current rating** and make sure your worst-case peak current stays below it. Datasheets specify saturation as the current where inductance drops by some percentage (typically 20-30%).

### Soft vs. Hard Saturation

- **Ferrite cores** — Hard saturation. Inductance drops sharply at the saturation point. Little warning
- **Powdered iron / composite cores** — Soft saturation. Inductance rolls off gradually as current increases. More forgiving, often used in power inductors for this reason

## DCR (DC Resistance)

The winding wire has resistance. This is DCR — the inductor's series resistance at DC. It causes:

- I^2 R losses (heat)
- Voltage drop under load
- Reduced efficiency in power converters

Lower DCR means higher efficiency but usually means larger physical size or fewer turns (and thus lower inductance). It's always a tradeoff.

## Core Losses

At AC, the core material dissipates power through:

- **Hysteresis loss** — Energy lost each cycle as the magnetic domains reverse. Proportional to frequency and flux swing
- **Eddy current loss** — Currents induced in the core material. Proportional to frequency squared

Core losses add to DCR losses. At high switching frequencies, core losses can dominate. This is why inductor datasheets specify a maximum operating frequency or provide loss curves vs. frequency.

## Practical Considerations

- **Inductor current ripple** — In a switching converter, the inductor current has a triangular ripple waveform. The peak current is the DC current plus half the ripple. This peak must stay below the saturation rating
- **EMI** — Inductors with open magnetic paths (unshielded) radiate magnetic fields. Shielded inductors contain the field but are larger and more expensive. Board placement matters — keep sensitive circuits away from power inductors
- **Mechanical noise** — Inductors can audibly buzz at switching frequencies in the audible range (or subharmonics). Loose windings, magnetostriction in the core, and PCB vibration all contribute

## Gotchas

- **Inductors fight current changes** — When you open a switch in series with an inductor, the inductor tries to maintain current flow. The voltage will rise until it finds a path (flyback diode, arc across the switch contacts, or semiconductor breakdown). This is not a malfunction — it's the fundamental behavior. Always provide a current path
- **Parallel inductors need care** — Unlike resistors, paralleling inductors is complicated by mutual inductance. Two inductors close together on a board may couple magnetically, changing the effective inductance
- **Self-resonant frequency** — Like capacitors, inductors have parasitic capacitance (between turns). Above the SRF, the "inductor" becomes capacitive. For RF work, always check SRF vs. operating frequency
- **Current rating vs. saturation rating** — Some datasheets list two current ratings: thermal (how much current before overheating due to DCR losses) and saturation (how much current before inductance drops). Use the lower of the two as your design limit
