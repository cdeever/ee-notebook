---
title: "Current Shunt Fixture"
weight: 110
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

A current shunt is a precision low-value resistor placed in series with a load to measure current. The voltage drop across the shunt is proportional to current (Ohm's law: V = IR), and you measure this voltage with a multimeter or oscilloscope. A dedicated shunt fixture—with connectors, binding posts, and known resistance values—makes current measurement fast and repeatable without modifying the circuit under test.

## Why Use a Shunt?

**Non-intrusive inline measurement:** Unlike a clamp meter, a shunt doesn't require the wire to be accessible or separated. Unlike breaking the circuit to insert a meter, a shunt can be permanently or semi-permanently installed.

**High bandwidth:** Clamp meters and current transformers have frequency limitations. A resistive shunt works from DC to beyond what your oscilloscope can measure. This is essential for observing current waveforms, inrush events, and high-frequency noise.

**Dynamic range:** With appropriate shunt values, you can measure microamps to tens of amps—the same technique scales.

**Oscilloscope-compatible:** A shunt converts current to voltage, which oscilloscopes measure directly. This lets you see current waveform shape, timing, and transients.

## How Shunts Work

The principle is simple:

1. **Insert the shunt in series** with the current path
2. **Measure the voltage across the shunt** with a meter or scope
3. **Calculate current:** I = V / R (where R is the shunt resistance)

**Example:** A 0.1Ω shunt passes 2A. Voltage across it = 2A × 0.1Ω = 0.2V (200mV). Measure 200mV, divide by 0.1Ω, get 2A.

The shunt resistance must be:
- **Low enough** to not significantly affect the circuit (minimal voltage drop)
- **High enough** to produce a measurable voltage
- **Precise enough** for your accuracy requirements
- **Power-rated** to dissipate the I²R heat without damage

## Choosing Shunt Values

| Current Range | Shunt Value | Voltage at Full Scale |
|---------------|-------------|----------------------|
| 0–100mA | 1Ω | 100mV |
| 0–1A | 0.1Ω | 100mV |
| 0–10A | 0.01Ω (10mΩ) | 100mV |
| 0–50A | 0.001Ω (1mΩ) | 50mV |

A common convention targets 50–100mV at full-scale current—large enough to measure accurately, small enough to not affect the circuit significantly.

**Burden voltage:** The voltage drop across the shunt reduces voltage available to the load. For a 12V supply and 0.1Ω shunt at 5A, the shunt drops 0.5V, leaving 11.5V for the load. This may or may not matter depending on the application.

## Building a Shunt Fixture

A reusable fixture makes current measurement convenient:

### Basic Design

**Parts:**
- Precision shunt resistor (or several values with a selector switch)
- Binding posts or banana jacks for circuit connection (in and out)
- Binding posts or banana jacks for voltage measurement
- Enclosure

**Layout:**
```
[IN +] ——— [SHUNT] ——— [OUT +]
              |
        [SENSE + / -]
              |
[IN -] ————————————— [OUT -]
```

The SENSE terminals connect across the shunt only—no wire resistance from the power path is included in the measurement.

### Kelvin (4-Wire) Connection

For best accuracy, use a 4-wire (Kelvin) connection:

- **Two heavy wires** carry the load current (force connections)
- **Two light wires** sense the voltage across the shunt only (sense connections)

This eliminates lead resistance from the measurement. The sense leads carry negligible current, so their resistance doesn't affect accuracy.

**Why it matters:** A 10mΩ shunt with 5mΩ of lead resistance would read 50% high. Kelvin sensing measures only the shunt.

### Multi-Range Fixture

For versatility, include multiple shunt values with a selector:

| Position | Shunt | Best For |
|----------|-------|----------|
| 1 | 1Ω, 0.1% | Low-current (mA range) |
| 2 | 0.1Ω, 0.1% | Medium current (0.1–3A) |
| 3 | 0.01Ω, 0.1% | High current (1–30A) |

A rotary switch selects the shunt in use. Ensure the switch can handle the current—or use the switch only on the sense side and have separate input jacks for each current range.

## Shunt Resistor Selection

### Resistance Tolerance

- **0.1% tolerance** is common for precision work
- **1% tolerance** is adequate for troubleshooting
- Specify the tolerance at the expected operating temperature

### Temperature Coefficient

Shunts heat up at high current. If the resistance changes with temperature, accuracy suffers.

- **Manganin and constantan** alloys have very low temperature coefficients (10–50 ppm/°C)
- **Nichrome and other wirewound** resistors may have higher TC
- For precision work, use shunts rated for low TC

### Power Rating

The shunt dissipates power: P = I²R

| Shunt | At 10A | Power Dissipation |
|-------|--------|-------------------|
| 0.1Ω | 10A | 10W |
| 0.01Ω | 10A | 1W |
| 0.001Ω | 10A | 0.1W |

Size the shunt for continuous power handling with margin. Precision shunts often specify a maximum continuous current.

### Form Factor

- **Chassis-mount:** Bolt to heatsink, high power handling
- **PCB-mount:** Surface-mount or through-hole for permanent installation
- **Wire-wound:** Classic construction, some inductance
- **Metal strip/film:** Low inductance, better for high-frequency

## Using the Shunt Fixture

### DC Current Measurement

1. Insert the shunt fixture in series with the load
2. Connect voltmeter to the sense terminals
3. Read voltage, divide by shunt resistance = current

**Example:** 47.3mV across a 0.01Ω shunt = 4.73A

### AC/Pulsed Current Waveforms

1. Insert the shunt in series
2. Connect oscilloscope to sense terminals
3. Set scope vertical scale based on shunt value
4. Observe current waveform directly

Many oscilloscopes allow custom probe ratios. Set the scope to display amps directly (e.g., 100mV/div with 0.1Ω shunt = 1A/div).

### Inrush Current Capture

Shunts respond instantly—no bandwidth limit from the sensing element. Connect scope, trigger on rising edge, and capture inrush events that clamp meters would miss.

### Current Profiling

For battery-powered devices, profile current over time:
1. Insert shunt between battery and device
2. Record voltage across shunt (datalogger or scope in roll mode)
3. Convert voltage trace to current trace
4. Integrate for charge consumed

## Limitations

**Burden voltage:** The shunt drops voltage. For very low voltage circuits or battery testing, this may affect the result. Use the lowest shunt value that gives measurable voltage.

**Common-mode issues:** When measuring high-side current (shunt on positive rail), the sense voltage rides on top of the supply voltage. Meters handle this fine; oscilloscopes may need differential probes or isolated input.

**Inductance:** Wire-wound shunts have inductance that affects high-frequency response. For fast transients, use non-inductive shunts or account for the inductance.

**Ground loops:** If the shunt is on the ground side and you connect scope ground to both sides, you've shorted the shunt. Either measure high-side, use a differential probe, or use an isolated scope.

## Safety

- **High-current shunts can get hot.** Ensure adequate power rating and heatsinking.
- **Don't measure high-voltage circuits without isolation.** The shunt sense terminals are at circuit potential.
- **Ensure connections are secure.** A loose connection in a high-current path causes arcing and heating.
- **Fuse the input** if measuring unknown circuits that might exceed shunt ratings.

## In Practice

- A 0.1Ω/1W shunt handles most bench work from milliamps to a few amps—it's the one to have
- For quick current checks, a precision resistor and DMM are faster than finding and connecting a clamp meter
- When debugging switching supplies, the shunt + scope combination shows current waveform shape that you can't get any other way
- Label your shunts clearly with their exact value—confusing 0.1Ω with 0.01Ω gives a 10× error in calculated current
- For battery current profiling, the continuous monitoring capability of a shunt beats spot-checking with a meter
