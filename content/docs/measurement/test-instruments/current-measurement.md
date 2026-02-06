---
title: "Current Measurement & Probing"
weight: 80
---

# Current Measurement & Probing

Voltage is easy to see — put a probe on the node and read the result. Current is invisible. You can't probe current directly; you have to interrupt the circuit or infer current from a voltage drop across a known resistance. This makes current measurement harder than voltage measurement, and the choice of method matters more than it does for voltage.

## Why Current Measurement Matters

Current tells you what's actually happening:

- **Power consumption:** Voltage times current equals power. You can't calculate battery life without knowing current draw.
- **Fault detection:** A short circuit has normal voltage but excessive current. A failed regulator may output correct voltage but pull abnormal current from its input.
- **Efficiency:** Input power minus output power is loss. Efficiency calculations require current measurements on both sides.
- **Sleep current:** An embedded system that should draw 10 µA but actually draws 500 µA has a bug. You won't find it by measuring voltage.
- **Thermal behavior:** Components heat up in proportion to I²R. High current through a PCB trace or connector causes heating that voltage measurement doesn't reveal.

## Measurement Methods

### DMM Current Mode

The DMM interrupts the circuit and measures current through its internal shunt resistor.

**Setup:** Break the circuit path, insert the meter in series (positive to positive, maintaining current direction).

**Pros:**
- Simple, available in any DMM
- Reasonable accuracy (±1% or better in mid-range meters)
- Multiple ranges for different current levels

**Cons:**
- Requires breaking the circuit — not always possible or convenient
- Burden voltage: the meter's shunt drops voltage (10–200 mV typically), which affects the circuit
- Fuse limits: the 10A range may use an unfused input; the mA range has a small fuse. Overcurrent blows the fuse or damages the meter.
- Average reading: pulsed loads show average current, not peak

**Best for:** Static or slow-changing current up to a few amps; bench testing where the circuit can be interrupted.

### Shunt Resistor + Oscilloscope/DMM

Insert a low-value precision resistor in series; measure voltage across it and calculate I = V/R.

**Setup:** Choose shunt resistance for adequate voltage drop at expected current (10–100 mV typical) while keeping burden voltage acceptable. Use 4-wire (Kelvin) connections to avoid lead resistance error.

**Pros:**
- Works at any frequency (see waveform, not just average)
- No fuse limits — size the shunt for your current
- Can measure DC and AC components simultaneously
- Permanent installation for ongoing monitoring

**Cons:**
- Requires access to insert the shunt
- Burden voltage affects circuit operation
- Shunt inductance affects high-frequency measurements
- Voltage drop times current equals power dissipation in the shunt — can cause heating

**Shunt selection:**

| Current range | Typical shunt value | Voltage at full scale | Notes |
|---|---|---|---|
| 0–100 mA | 1 Ω | 100 mV | Low burden, adequate signal |
| 0–1 A | 100 mΩ | 100 mV | Check power rating |
| 0–10 A | 10 mΩ | 100 mV | Use 4-wire connection |
| 0–100 A | 1 mΩ | 100 mV | Specialty shunts required |

Use precision shunts (0.1–1%) for accurate measurements. General resistors drift with temperature and may not handle the power.

**Best for:** Waveform capture, high-frequency current, continuous monitoring, any situation where you need more than an average reading.

### Inline USB Meters

A specialized device that sits between USB power source and load, displaying voltage and current in real time.

**Setup:** Plug in series with the USB connection.

**Pros:**
- No circuit modification needed (for USB-powered devices)
- Continuous real-time display
- Often logs energy (mAh, Wh) over time
- Inexpensive

**Cons:**
- USB-only — doesn't help for non-USB circuits
- Moderate accuracy (±1–3% typical)
- Limited current range (usually 3A max for USB-A, 5A for USB-C)
- Adds connector resistance and inductance

**Best for:** Quick checks of USB-powered devices, battery charging current, USB power bank capacity verification.

### Current Clamp (Clamp Meter)

A clamp that encircles a conductor and measures current through magnetic coupling, without breaking the circuit.

**Setup:** Open the clamp jaws, insert the conductor, close the jaws. The conductor must carry the full load current — clamping around a power cable that has supply and return together measures zero (the fields cancel).

**Pros:**
- Non-contact measurement — no circuit interruption
- Safe for high-current measurements
- Works on existing wiring

**Cons:**
- Resolution and accuracy worse than direct measurement
- Minimum current sensitivity typically 100 mA–1 A
- AC-only for basic clamps (Hall effect clamps measure DC)
- Can't measure PCB traces or small wires easily
- Position sensitivity — clamp orientation affects reading

**Best for:** Power wiring, AC mains current, any high-current measurement where breaking the circuit is impractical.

### Current Probe (Oscilloscope)

A specialized probe that outputs a voltage proportional to current, allowing the oscilloscope to display current waveforms.

**Types:**
- **AC current probes:** Use transformer coupling. Simple, no power required, AC-only (typically >10 Hz).
- **DC/AC current probes (Hall effect):** Measure DC and AC. Require power (batteries or probe amplifier). More expensive but essential for DC and low-frequency measurements.

**Key specs:**

| Spec | What it means | Typical values |
|---|---|---|
| Current range | Maximum measurable current | 10–500 A depending on probe |
| Bandwidth | Highest frequency captured | DC to 50–100 MHz |
| Sensitivity | Output volts per amp | 10 mV/A to 1 V/A (switchable on some probes) |
| Accuracy | Measurement error | ±1–3% typical |
| Minimum loop diameter | Smallest wire/trace that fits | 5–20 mm |

**Pros:**
- Non-contact — no circuit interruption
- See current waveforms, not just DC averages
- Works on existing wiring
- Can measure very high currents safely

**Cons:**
- Expensive (especially DC/AC Hall effect probes)
- Bulky — may not fit in tight spaces
- Requires demagnetization (degauss) periodically to maintain accuracy
- Position sensitivity affects readings

**Best for:** Power electronics debugging, motor drive current, inrush current, any measurement where you need to see current waveform shape without interrupting the circuit.

## Choosing the Right Method

| Situation | Recommended method | Alternatives |
|---|---|---|
| Quick check of DC current | DMM current mode | USB meter (if USB-powered) |
| Current waveform capture | Shunt + scope | Current probe (if available) |
| Sleep/standby current (µA level) | DMM µA range | Precision shunt + sensitive DMM |
| High current (>10A) | Current clamp or current probe | Low-value shunt (thermal issues) |
| USB device current | Inline USB meter | DMM in series |
| Inrush / transient current | Current probe | Shunt + scope (if fast enough) |
| Current in existing wiring (can't break) | Clamp meter or current probe | — |
| PCB-level current | Shunt (designed in) | Add series resistor pads for test |

## Design for Measurability

Current measurement is easiest when anticipated during design:

- **Add shunt resistor pads:** 0Ω or low-value resistors in key current paths (power input, major rails, motor drives) allow easy measurement by substituting a shunt or measuring across existing low-value components.
- **Add test points:** Even without shunts, test points on both sides of a series component (inductor, fuse, sense resistor) allow voltage measurement for current inference.
- **Separate return paths:** If ground is common for multiple supplies, measuring individual rail currents is difficult. Separate return paths enable per-rail current measurement.
- **Current sense ICs:** For production monitoring, dedicated current sense amplifiers (like INA219, INA226) provide digital current readout without external measurement equipment.

## Gotchas and Limits

- **Burden voltage affects circuit operation** — A 100 mV drop in a 3.3V supply is a 3% reduction. Size shunts or select DMM ranges to keep burden voltage acceptable.
- **DMM fuses blow silently** — If current measurement reads zero unexpectedly, the meter's fuse may have blown. Check resistance through the current path before assuming the circuit is open.
- **Clamp position matters** — Clamping around a power cord with both conductors inside measures zero. The wire carrying current must be isolated.
- **Ground loops with shunts** — If both scope ground and power supply ground connect to the same circuit, inserting a shunt can create a ground loop or short out the shunt. Use isolated probes or battery-powered analyzers.
- **Average vs. peak current** — A DMM shows average current. Pulsed loads (transmitting radios, motor PWM) have peak currents much higher than average. The supply and wiring must handle the peak, not just the average.

## Tips

- For µA-level sleep current measurement, use the DMM's µA range (typically 200 µA or 2 mA full scale) and connect in series with the battery or power input
- When using shunt + scope, set the scope to high-resolution (averaging) mode for cleaner DC measurements
- Clamp meters work best on single conductors — wrap multiple turns of wire through the clamp to multiply sensitivity (10 turns gives 10× the reading; divide by 10 for actual current)
- Demagnetize (degauss) Hall effect current probes before precision measurements — residual magnetization causes DC offset errors
- Log current over time to catch intermittent events — a device that draws high current for 50 ms every 10 seconds won't show up in spot checks

## Caveats

- **Current probe bandwidth matters** — A 1 MHz probe won't capture the high-frequency content of a switching power supply's current waveform. Match probe bandwidth to the frequencies you need to see.
- **Clamp meters are not precision instruments** — ±2–3% accuracy is typical; sub-1% accuracy requires calibrated shunts or precision current probes.
- **High-side vs. low-side measurement** — Shunts in the ground return (low-side) are easier to measure (referenced to ground) but create a ground offset. High-side shunts maintain ground integrity but require differential or isolated measurement.
- **Minimum current for clamps** — Most clamp meters and probes have a minimum sensitivity around 10–100 mA. Milliamp and microamp currents require direct measurement methods (DMM or shunt).

## In Practice

- A device that runs longer on battery than expected may be measuring current with the DMM burden voltage artificially lowering the supply voltage and reducing clock speed or radio power
- Motor inrush current that trips a fuse but doesn't show on the ammeter is happening too fast for the meter's averaging — use a current probe and scope to capture the transient
- A "5A" USB charger that only delivers 3A may have a current limit, or the cable drop may be triggering the load's undervoltage protection
- Sleep current that varies from board to board is often a pull-up resistor to a floating or mis-configured GPIO — current measurement identifies which specific board is affected, and which rail shows the extra current
- When debugging efficiency, measure input current and output current separately — efficiency = (Vout × Iout) / (Vin × Iin). Low efficiency is either high quiescent current or high switching/conduction losses
