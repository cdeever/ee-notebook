---
title: "Switching Regulators"
weight: 20
---

# Switching Regulators

Where linear regulators burn the excess as heat, switching regulators convert it. A switching regulator rapidly toggles a transistor on and off, storing energy in an inductor (or capacitor) and delivering it to the output at the desired voltage. Efficiencies of 85-95% are typical — compared to 40-60% for linear regulators with significant input-output differential.

Despite the word "switching," this is not digital logic — it's a feedback control system using switching devices. The switching is a means of energy conversion, not information processing. What we care about here is ripple, transient response, EMI, layout, and loop stability — all analog concerns. The transistor toggles on and off, but the design discipline is analog power electronics.

The tradeoff: switching regulators are electrically noisy, more complex to design, and require careful component selection and layout. But for any application with significant voltage conversion or moderate-to-high current, they're the only practical choice.

## Core Topologies

### Buck (Step-Down)

Converts a higher input voltage to a lower output voltage. The most common switching regulator topology.

**How it works:** A switch connects the input to the inductor. When the switch is on, current flows through the inductor to the output, storing energy in the inductor's magnetic field. When the switch turns off, the inductor's stored energy drives current through a diode (or synchronous switch) to the output. The output capacitor smooths the pulsating current into a relatively steady voltage.

**Key relationships:**
- Duty cycle: D = V_out / V_in (ideal)
- Output voltage is always less than input voltage
- The inductor current has a triangular ripple waveform

### Boost (Step-Up)

Converts a lower input voltage to a higher output voltage.

**How it works:** The switch connects the inductor to ground. When on, current ramps up in the inductor, storing energy. When the switch turns off, the inductor's voltage adds to the input voltage, forward-biasing a diode to charge the output capacitor to a voltage higher than the input.

**Key relationships:**
- Duty cycle: D = 1 - (V_in / V_out) (ideal)
- Output voltage is always higher than input voltage
- Cannot regulate if the load is too light (minimum load requirement)

### Buck-Boost and Inverting Topologies

- **Buck-boost:** Output can be higher or lower than input (but inverted polarity in basic topology)
- **SEPIC:** Non-inverting buck-boost. Output can be above or below input with the same polarity. More complex (two inductors or coupled inductor + extra cap) but very useful when the input voltage range spans the desired output voltage
- **Charge pump:** Uses capacitors instead of inductors for voltage conversion. Limited current capability, but simple and inductor-free. Common for small loads (LCD bias, LED drivers)

## Efficiency vs. Noise

This is the fundamental tradeoff against linear regulators:

**Efficiency advantage:**
- A buck converter from 12 V to 3.3 V at 1 A: P_loss ≈ 0.5-1.5 W (85-95% efficient)
- A linear regulator for the same conversion: P_loss = 8.7 W (28% efficient)
- The switching regulator produces 6-17x less waste heat

**Noise disadvantage:**
- Switching creates ripple at the switching frequency (typically 100 kHz to several MHz) and harmonics
- Switching edges create broadband EMI
- Inductor and transformer magnetics can radiate
- Output ripple is typically 10-50 mV peak-to-peak (compared to microvolts for a good LDO)

**The common compromise:** Use a switching regulator for bulk conversion, then follow it with an LDO for noise-sensitive circuits. The LDO only drops a few hundred millivolts (high efficiency, low heat), and its PSRR cleans up the switching noise.

## Component Selection

Switching regulator performance depends heavily on external components:

### Inductor

- **Inductance value** sets the ripple current magnitude. Higher L = less ripple but slower transient response and larger physical size
- **Saturation current** must exceed the peak inductor current (DC + half the ripple). Saturation causes a current spike that can destroy the switch
- **DCR** (DC resistance) causes I^2R losses. Lower DCR = higher efficiency
- **Core material** determines losses at the switching frequency

### Output Capacitor

- **Capacitance** determines output voltage ripple and transient response
- **ESR** contributes to ripple voltage (V_ripple_ESR = I_ripple x ESR) and affects loop stability
- **Ceramic caps** have low ESR (good ripple) but capacitance drops with DC bias. Often need more capacitance than the nominal value suggests
- **Multiple smaller caps** in parallel often outperform one large cap (lower effective ESR and ESL)

### Input Capacitor

- Handles pulsating input current (especially in buck converters where input current is a square wave)
- Must have low ESR and adequate ripple current rating
- Place as close to the converter as physically possible

## Layout Matters

Switching regulator layout is critical — far more so than linear regulators. Poor layout causes:

- Increased EMI radiation
- Ground bounce that couples into sensitive circuits
- Voltage spikes from parasitic inductance
- Oscillation or instability from stray feedback paths

**Key layout rules:**
- Keep the switching loop (input cap → switch → inductor → output cap → ground → input cap) as small and tight as possible. This is the highest-priority routing constraint
- Place input and output capacitors directly at the converter IC pins
- Use a solid ground plane under the converter
- Keep sensitive analog traces away from switching nodes
- The switch node (between the switch and inductor) is the noisiest net on the board — keep it short and don't route anything sensitive near it

## Gotchas

- **Minimum load** — Some converters (especially boost) require a minimum load to regulate properly. With no load, the output voltage can rise above the target
- **Light-load efficiency** — Switching losses and quiescent current dominate at light loads. Some converters switch to a low-frequency burst mode (PFM) at light loads to improve efficiency, but this makes the output ripple frequency variable and unpredictable
- **Loop compensation** — The feedback loop needs to be stable across all operating conditions (input voltage range, load range, temperature). External compensation (R-C networks) must be designed for the specific application. Getting this wrong causes oscillation or slow transient response
- **Audible noise** — Converters switching in or near the audible range (20 Hz-20 kHz) can produce audible whine from magnetostriction in the inductor. This is common in burst-mode operation at light loads
- **EMI compliance** — Switching regulators are the #1 source of conducted and radiated EMI on most boards. Meeting EMI standards often requires input filters, shielding, and careful layout — all of which add cost and complexity
- **Start-up and soft-start** — Inrush current during start-up can trip upstream protection or cause voltage dips. Most modern converters have soft-start features that ramp the output voltage slowly, but the soft-start time and behavior need to be appropriate for the application
