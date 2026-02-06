---
title: "Bench Power Supply"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Bench Power Supply

The bench power supply is the first instrument powered on and the last powered off. It replaces batteries, wall adapters, and USB ports with a controllable, current-limited source that protects both the circuit under test and the person testing it. Reaching for a bench supply instead of a fixed adapter means being able to set exact voltages, watch current draw in real time, and have the supply shut down before a short circuit becomes a burnt trace.

## What It Does

A bench power supply converts mains AC into adjustable DC output with two key modes:

- **Constant Voltage (CV):** Output holds a set voltage regardless of load current (up to the current limit). This is normal operation — powering a circuit at 3.3V, 5V, 12V, etc.
- **Constant Current (CC):** When the load tries to draw more than the set current limit, the supply drops voltage to maintain that current. This is the protection mode — it prevents overcurrent damage during faults, shorts, or bring-up of unknown circuits.

The CC/CV crossover is the core safety feature. A short circuit across a bench supply in CC mode just means the supply drops to near-zero volts at the set current — no smoke, no blown traces. The same short across a USB port or battery delivers whatever current the source can push, limited only by wire resistance.

## Key Specs and What They Mean

| Spec | What it means | Why it matters |
|---|---|---|
| Voltage range | Maximum output voltage per channel | Must exceed highest rail you need to supply. 30V covers most low-voltage work; 60V needed for motor drivers, some amplifiers |
| Current range | Maximum output current per channel | 3A covers most bench work. Higher-power loads (motors, LED strings, RF PAs) may need 5–10A+ |
| Number of channels | Independent outputs | Multi-rail circuits need multiple channels. A 3-channel supply (two adjustable + one fixed 5V or 3.3V) is common |
| Output ripple/noise | AC content on the DC output | Matters for sensitive analog, audio, and RF circuits. Linear supplies are inherently quieter than switching |
| Load regulation | How much voltage changes with load current | Better regulation = more stable voltage as current varies. Spec'd in mV or % of full scale |
| Line regulation | How much voltage changes with mains input variation | Usually a smaller effect than load regulation but matters for precision work |
| Readback resolution | Digits shown on the voltage/current display | 3-digit display reads 5.00V (10 mV resolution); 4-digit reads 5.000V (1 mV resolution). More digits help during bring-up |
| Programming interface | Remote control (USB, GPIB, LAN, RS-232) | Enables automated test sequences, voltage sweeps, and logging |

## Feature Tiers

| Tier | Typical specs | Good enough for | Not sufficient for |
|---|---|---|---|
| **Entry** (single channel, no remote) | 0–30V, 0–3A, ~10 mV ripple, 3-digit display | Powering digital boards, LED experiments, basic bring-up | Multi-rail sequencing, sensitive analog, automated test |
| **Mid-range** (2–3 channels, series/parallel) | 0–30V, 0–5A per channel, <5 mV ripple, 4-digit display, tracking | Multi-rail embedded systems, audio circuits, motor control | Sub-mV noise floors, high-power loads, production test |
| **Lab-grade** (low noise, programmable) | 0–60V, 0–10A, <1 mV ripple, 5-digit readback, SCPI | Precision analog, RF front-ends, automated characterization, power cycling | Very high current (>10A), extremely low noise (use battery or LDO post-regulation) |

## Linear vs Switching

**Linear supplies** use a transformer and linear regulator. They are heavier, less efficient, and produce less output noise. The ripple is at mains frequency (50/60 Hz) and low harmonics — easy to filter and far from most signal frequencies.

**Switching supplies** use high-frequency conversion (typically 50–500 kHz). They are lighter, more efficient, and produce ripple at the switching frequency and its harmonics. This noise can couple into sensitive circuits, especially if the switching frequency lands near a frequency of interest.

For most digital and general embedded work, a switching bench supply is fine. For audio, low-level analog, or RF work, either use a linear supply or add post-regulation (an LDO after the bench supply) to clean up the output.

## Gotchas and Limits

- **Turn-on overshoot:** Some supplies momentarily output a voltage spike when first enabled or when the load steps suddenly. Check with a scope during enable — some circuits (especially 1.8V and lower rails) are intolerant of overshoot.
- **Sense lines (remote sense):** Higher-end supplies have separate sense terminals to compensate for voltage drop in the load wires. Without remote sense, wire resistance causes the actual voltage at the load to be lower than what the supply displays.
- **Series/parallel modes:** Some multi-channel supplies can combine channels for higher voltage (series) or higher current (parallel). Verify the supply actually regulates properly in these modes — some budget supplies have poor cross-regulation.
- **Electronic loads vs resistive loads:** The supply's transient response depends on the load type. A circuit that rapidly switches between low and high current (like a microcontroller with radio bursts) tests the supply's transient response harder than a steady resistive load.
- **CC mode is not a current source:** CC mode limits current but was designed as a protection feature, not as a precision current source. For constant-current driving (LEDs, sensor excitation), the regulation and accuracy in CC mode may be worse than in CV mode.

## Tips

- Set the current limit before connecting the circuit — dial voltage to zero, set the current limit with the output shorted or into a dummy load, then set the voltage
- Use CC mode as a debugging aid: if a board immediately pulls the supply into CC at power-on, something is shorted or drawing excessive current before you even get to firmware
- Monitor current draw during bring-up — a circuit that draws 150 mA idle when the design says 80 mA is telling you something
- For multi-rail sequencing, use the output enable buttons or a programmable supply to control power-on order rather than relying on dialing voltages up manually
- Keep load wires short and use appropriate gauge — long thin wires add resistance and inductance, degrading regulation at the load

## Caveats

- **Supply noise is not zero** — Even a "clean" linear supply has some ripple and noise. If the circuit is sensitive to sub-mV noise, measure the supply output with a scope at the load terminals, not at the supply terminals
- **Displayed current is average** — Pulsed loads (like a transmitting radio module) draw high peak current but the supply display shows the average. The supply must be able to source the peak, not just the average, or the voltage will droop during pulses
- **Ground is not always earth** — Floating-output supplies have output terminals isolated from earth ground. Connecting the negative terminal to circuit ground and assuming it is at earth potential can create ground loops or safety issues if other equipment is also connected

## In Practice

- A board that works from a battery but not from the bench supply may be reacting to supply noise or turn-on overshoot — check with a scope at the power input
- Current draw that creeps upward over minutes suggests thermal runaway or a component operating outside its safe region
- A circuit that only fails when a second rail is present points to a power sequencing dependency — use a multi-channel supply with controlled enable to test sequencing
- If the supply drops into CC mode during normal operation, the circuit is drawing more current than expected — investigate before increasing the limit
