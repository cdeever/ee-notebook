---
title: "Thyristors & Latching Devices"
weight: 40
---

# Thyristors & Latching Devices

Thyristors are a family of semiconductor devices that latch — once triggered on, they stay on until current drops below a minimum holding value. This is fundamentally different from transistors, which require continuous control input. A BJT or MOSFET turns off when the drive signal is removed. A thyristor ignores the gate until the current through it falls low enough to unlatch.

This latching behavior makes thyristors natural fits for AC power control, where the current crosses zero every half-cycle and the device resets itself. It also makes them dangerous in DC circuits — once triggered, they stay on until power is removed or the current is otherwise forced below the holding threshold.

## The PNPN Structure

All thyristors are built on a four-layer PNPN structure. The easiest mental model is two transistors — one PNP and one NPN — cross-coupled so that each one's collector feeds the other's base. Once either transistor begins conducting, it drives the other on, which drives the first one harder. This positive feedback loop snaps the device into full conduction.

The key parameters across all thyristors:

- **Breakover voltage (V_BO)** — The forward voltage at which the device self-triggers without a gate signal. Operating above this voltage causes unintended turn-on
- **Holding current (I_H)** — The minimum anode current to sustain conduction. Below this, the device turns off. Typically milliamps to tens of milliamps
- **Latching current (I_L)** — The minimum anode current needed immediately after triggering to establish the latched state. Always higher than I_H. If the load can't supply this much current at turn-on, the device won't stay on after the gate pulse ends
- **Gate trigger current (I_GT)** — The gate current needed to initiate turn-on (for gated devices like SCRs and triacs)

## SCRs (Silicon Controlled Rectifiers)

The SCR is the basic thyristor: three terminals (anode, cathode, gate), conducts in one direction only. Apply a gate pulse, and it latches on — current flows from anode to cathode. It stays on regardless of what the gate does afterward, until anode current drops below I_H.

### Triggering

A short current pulse into the gate is all that's needed. The gate does not need to be driven continuously — once latched, the gate is irrelevant. This is both the SCR's advantage (simple drive, low control power) and its limitation (it can be turned on but not off with the gate).

Gate sensitivity varies with temperature. Cold SCRs need more gate current to trigger. Some sensitive-gate SCRs trigger with microamps, which means noise on the gate can cause false triggering. A resistor from gate to cathode (typically 100 Ω to 1 kΩ) shunts noise and improves noise immunity.

### Turn-Off (Commutation)

Since the gate can't turn an SCR off, another mechanism is needed:

- **Natural commutation** — In AC circuits, the current crosses zero every half-cycle. The SCR turns off at the zero crossing. This is the normal operating mode for AC power control
- **Forced commutation** — In DC circuits, an external circuit (usually a charged capacitor) momentarily reverses the current through the SCR. More complex and less common in modern designs

### AC Phase Control

The classic SCR application: controlling power to a load by delaying the gate trigger pulse within each half-cycle.

- Trigger at the start of the half-cycle = full power
- Trigger near the end = minimum power
- The trigger delay angle (α) controls the fraction of each half-cycle that conducts

Since an SCR only conducts in one direction, single-SCR control only works on one half-cycle (half-wave control). For full-wave control, use two SCRs in anti-parallel or use a triac.

Phase-controlled SCRs produce chopped waveforms with significant harmonic content. This is the source of the buzzing sound from SCR-dimmed incandescent lights and the reason SCR dimmers can interfere with audio equipment and radio receivers on the same circuit.

## Triacs

A triac is effectively two SCRs in anti-parallel in a single package. It conducts in both directions, making it the standard choice for AC power control in a single device.

Three terminals: MT1 (Main Terminal 1), MT2, and gate. Triggering can occur with positive or negative gate current, and the device conducts in both directions. This four-quadrant triggering capability is convenient but comes with trade-offs.

### Quadrant Sensitivity

A triac can be triggered in four combinations of MT2 polarity and gate current polarity (the four "quadrants"). Not all quadrants are equally sensitive:

- **Quadrant I** (MT2+, gate+) and **Quadrant III** (MT2-, gate-) are the most sensitive — these are the "natural" trigger modes
- **Quadrant IV** (MT2-, gate+) is the least sensitive and should be avoided when possible — it requires more gate current and has slower, less reliable triggering

Most triac drive circuits are designed to trigger in Quadrants I and III only, using a gate signal that follows the polarity of MT2.

### Commutation Problems

Triacs have a critical limitation that SCRs don't: they must turn off and re-trigger every half-cycle as the AC polarity reverses. With inductive loads (motors, transformers, solenoids), the current zero crossing doesn't coincide with the voltage zero crossing — the current lags.

When the triac turns off at the current zero crossing, the full line voltage (which is near its peak due to the phase shift) appears across the device. If the voltage rises too fast (exceeds the dV/dt rating), the triac re-triggers immediately without a gate signal. This is called **dV/dt retriggering** or **commutation failure** and causes loss of control — the triac conducts full cycles regardless of the gate timing.

The fix is a **snubber network** — typically a series RC (100 Ω, 100 nF is a common starting point) across the triac. The snubber limits the rate of voltage rise after commutation. For highly inductive loads, sometimes an SCR pair is preferred over a triac because SCRs have a full half-cycle to recover.

### Common Applications

- Light dimmers (resistive loads — easy case, no snubber needed)
- Fan speed control (inductive — needs snubber, and triacs don't work well at very low speeds because motors need minimum current to start)
- Heating element control
- Solid-state relays (often a triac triggered by an optocoupled LED — the opto-triac)

## DIACs

A DIAC (diode for alternating current) is a two-terminal trigger device — no gate. It blocks in both directions until the voltage across it exceeds its breakover voltage (typically 28-36 V), then it snaps into conduction with a negative resistance characteristic.

DIACs exist almost exclusively to trigger triacs. The classic triac dimmer circuit uses a DIAC in the gate circuit:

1. An RC network creates a phase-delayed voltage ramp
2. When the ramp reaches the DIAC's breakover voltage, the DIAC fires and dumps the capacitor charge into the triac gate
3. The triac latches on for the remainder of the half-cycle
4. The potentiometer in the RC network controls the delay, which controls the power

The DIAC provides a sharp, consistent trigger pulse regardless of which half-cycle is active. Without it, the triac triggering would be asymmetric between half-cycles (because of the quadrant sensitivity differences), causing even-harmonic distortion and potential DC offset in the load current.

Some modern triac trigger ICs and opto-triacs have replaced discrete DIAC circuits, but the DIAC-triggered phase control circuit is still everywhere in simple dimmers and motor controls.

## Thyristors vs. Transistors for Switching

Why use a latching device when transistors can be switched off at will?

**Thyristors win when:**

- The load is AC and power levels are high — thyristors handle kilowatts easily and cheaply
- Simple on/off control per half-cycle is sufficient
- Gate drive simplicity matters — a single pulse turns the device on; no continuous drive needed
- Cost and robustness at high current matter more than switching speed

**Transistors (MOSFETs/IGBTs) win when:**

- The load is DC
- Fast, arbitrary switching patterns are needed (PWM, variable frequency)
- The ability to turn the device off at any time is required
- Switching frequencies above a few hundred Hz are required

In power electronics, IGBTs and MOSFETs have largely replaced thyristors for new designs below a few kilowatts. But SCRs and triacs are still the cheapest, simplest solution for line-frequency AC power control — which is why they persist in dimmers, motor controls, and solid-state relays.

## Tips

- Always use a snubber with triacs driving inductive loads
- Add a gate-cathode resistor (100 Ω - 1 kΩ) to improve noise immunity on sensitive-gate SCRs
- For DC applications requiring turn-off capability, use MOSFETs or IGBTs instead of thyristors

## Caveats

- **DC circuits and thyristors** — If an SCR is triggered in a DC circuit with no commutation mechanism, it stays on permanently. The only way to reset it is to interrupt the current. This is a common surprise
- **dV/dt false triggering** — Fast voltage transients across an off-state thyristor can trigger it without any gate signal. Snubbers help. Selecting devices with adequate dV/dt ratings is essential
- **di/dt at turn-on** — Thyristors don't turn on uniformly across their entire junction area; conduction starts near the gate and spreads. If the initial current rises too fast (exceeds the di/dt rating), the small conducting area overheats and the device fails. Series inductance or gate drive design can limit di/dt
- **Inductive loads and triacs** — The commutation problem described above. Always use a snubber with inductive loads
- **Gate noise sensitivity** — Especially sensitive-gate SCRs. A gate-cathode resistor is cheap insurance against false triggering from noise, dV/dt coupling, or temperature-induced leakage
- **Minimum load current** — If the load current is less than the holding current, the thyristor drops out of conduction after every trigger pulse. This looks like erratic behavior — the device works at high power settings but flickers or fails at low settings
- **Thermal considerations** — Thyristors have relatively high on-state voltage drops (1-2 V). At high currents, this means significant heat. Heatsinking is required for anything beyond a few amps

## Bench Relevance

- A triac that conducts full power regardless of gate timing has commutation failure — add or increase the snubber
- A thyristor that triggers erratically at low power settings but works at high settings is dropping below the holding current — increase the minimum load or use a different device
- An SCR in a DC circuit that won't turn off is behaving normally — remove power to reset it
- A dimmer that buzzes loudly or causes radio interference has excessive harmonic content — this is inherent to phase control but can be reduced with filtering
