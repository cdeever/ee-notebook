---
title: "Directional Couplers & Power Meters"
weight: 40
---

# Directional Couplers & Power Meters

Measuring RF power seems straightforward — just measure the voltage across a known impedance and calculate. In practice, RF power measurement requires specialized techniques because signals flow in two directions (forward and reverse), connections must maintain impedance continuity, and the frequencies involved make simple voltage measurement unreliable. Directional couplers and power meters are the tools that solve these problems.

## Directional Couplers: Sampling Without Interrupting

A directional coupler is a passive four-port device that samples a fraction of the signal power traveling in one direction through a transmission line, without significantly disturbing the main signal path. The four ports are:

- **Input**: Where the signal enters
- **Output (through)**: Where most of the signal exits, continuing to the load
- **Coupled**: Where a small fraction of the forward-traveling signal appears
- **Isolated**: Ideally sees no signal; in practice, a small amount leaks through

The coupling factor describes how much power is diverted to the coupled port, expressed in dB. A -20 dB coupler diverts 1% of the forward power. A -10 dB coupler diverts 10%. The main signal path sees very little loss — a well-designed coupler might insert only 0.1-0.5 dB of loss in the through path.

| Coupling Factor | Power to Coupled Port | Main Path Loss (typical) |
|---|---|---|
| -10 dB | 10% | 0.5 dB |
| -20 dB | 1% | 0.1 dB |
| -30 dB | 0.1% | 0.04 dB |

The key parameter beyond coupling is **directivity** — how well the coupler distinguishes forward-traveling signals from reverse-traveling signals. A coupler with 30 dB of directivity means that a signal traveling in the reverse direction appears 30 dB weaker at the coupled port than a forward-traveling signal of the same power. Higher directivity means more accurate measurements of forward and reverse power independently.

Practical directivity ranges:

- **Strip-line couplers on PCB**: 15-25 dB directivity (adequate for monitoring, not precision measurement)
- **Discrete coaxial couplers**: 25-35 dB (good for most applications)
- **Precision laboratory couplers**: 35-45 dB (required for calibration and precision work)

## Common Uses of Directional Couplers

- **Transmitter monitoring**: Place a coupler between the transmitter output and antenna. The coupled port feeds a power meter or spectrum analyzer, showing the transmitter's output level without disconnecting the antenna.
- **VSWR measurement**: Use two couplers (or a dual-directional coupler) to sample both forward and reverse power simultaneously. The ratio of reverse to forward power gives the reflection coefficient, from which VSWR is calculated.
- **Test points in amplifier chains**: A coupler between amplifier stages lets you monitor the signal without adding a probe or breaking the impedance match.
- **Feedback sampling**: Some automatic level control (ALC) circuits use a coupler to sample the output and feed a control loop.

## RF Power Meters

RF power meters measure the actual power delivered to a sensor. There are two primary sensor types, each with distinct characteristics:

**Thermal sensors (thermocouple and thermistor)**:

These measure the heating effect of RF energy. A resistive element absorbs the RF power and the resulting temperature change is measured. The key advantage is that thermal sensors measure true RMS power regardless of waveform — they respond to total energy, not peak voltage. The disadvantage is speed: thermal sensors respond in milliseconds to seconds, making them unsuitable for pulsed or rapidly changing signals.

Typical thermal sensor specs: frequency range DC to 18+ GHz, power range -30 dBm to +20 dBm, accuracy ±0.5% to ±2%.

**Diode detector sensors**:

A Schottky diode rectifies the RF signal, producing a DC voltage proportional to the RF power. Diode sensors are fast (microsecond response) and can measure very low power levels (down to -70 dBm). Below about -20 dBm, the diode operates in the square-law region and the output is proportional to true RMS power regardless of waveform. Above -20 dBm, the diode enters the linear detection region and the output depends on the waveform shape — a CW signal reads differently than a modulated signal with the same average power.

Modern diode sensors use multiple diode paths and digital correction to extend the square-law-equivalent range, but there's always a waveform-dependent region.

| Characteristic | Thermal Sensor | Diode Sensor |
|---|---|---|
| Frequency range | DC – 18+ GHz | 10 MHz – 18+ GHz |
| Power range | -30 to +20 dBm | -70 to +20 dBm |
| Response time | Milliseconds to seconds | Microseconds |
| Waveform dependent? | No (true RMS) | Yes, above ~-20 dBm |
| Measures peak power? | No | Yes (with peak-hold circuitry) |
| Typical accuracy | ±0.5% | ±1-3% |

## Power Measurement Units

RF power is universally expressed in dBm — decibels referenced to 1 milliwatt into 50 ohms. This logarithmic scale makes it easy to add gains and subtract losses across a signal chain.

| dBm | Milliwatts | Watts | Context |
|---|---|---|---|
| -30 | 0.001 | 1 uW | Weak received signal |
| -10 | 0.1 | 100 uW | Typical signal generator output (low) |
| 0 | 1 | 1 mW | Reference level; common LO drive |
| +10 | 10 | 10 mW | Signal generator output |
| +20 | 100 | 100 mW | Small transmitter output |
| +30 | 1,000 | 1 W | Handheld radio |
| +37 | 5,000 | 5 W | QRP amateur transmitter |
| +40 | 10,000 | 10 W | Medium transmitter |
| +47 | 50,000 | 50 W | Typical amateur HF transceiver |

The conversion formula: P(mW) = 10^(dBm/10). Going the other way: dBm = 10 × log10(P/1mW).

A useful shortcut: every 3 dB doubles the power, every 10 dB multiplies by 10. So +33 dBm = 2 watts (start at +30 dBm = 1 W, add 3 dB = double).

## Return Loss Bridges

A return loss bridge is a simpler, less expensive alternative to a VNA for measuring impedance mismatch. It's essentially a Wheatstone bridge at RF frequencies: one arm is a precision 50-ohm reference, the other arm is the device under test. When the DUT is exactly 50 ohms, the bridge is balanced and no signal appears at the detector port. Any deviation from 50 ohms produces an output proportional to the mismatch.

Connected to a signal generator and spectrum analyzer (or even an oscilloscope), a return loss bridge measures scalar return loss — magnitude only, no phase. This tells you how well matched a device is at each frequency, but doesn't tell you whether the mismatch is capacitive, inductive, or resistive. For antenna tuning and cable testing, scalar return loss is often sufficient.

Return loss bridges cost $20-50 and cover broad frequency ranges (1 MHz to 1+ GHz). They're a useful tool when a VNA is not available. See [Field-Expedient RF Measurement]({{< relref "/docs/radio-rf/measurement-debugging-and-rf-tools/field-expedient-measurement" >}}) for more on making do with affordable instruments.

## Connecting It All Together

A typical transmitter test setup might include:

1. Transmitter output into the input port of a dual-directional coupler
2. Coupler through port into a dummy load (50-ohm termination rated for the transmitter's power)
3. Forward coupled port into a power meter or spectrum analyzer (through an attenuator if needed)
4. Reverse coupled port into a second meter to monitor reflected power

This setup lets you measure transmitter output power, harmonic content (on the spectrum analyzer), and load match simultaneously — without ever connecting the transmitter to an antenna. This is particularly important during development and debugging, when radiating the signal would be both illegal (if unlicensed) and unhelpful (if you're trying to isolate the transmitter from the antenna).

## Gotchas

- **Coupler frequency range** — A directional coupler designed for 100-500 MHz will have degraded directivity and coupling accuracy outside that range. Always check the coupler's specified frequency range before trusting measurements.
- **Coupled port termination** — The isolated port of a directional coupler must be terminated in 50 ohms. Leaving it open creates reflections that degrade directivity and accuracy. Most couplers come with an internal termination on the isolated port, but verify this.
- **Power sensor zeroing** — Diode power sensors have offset voltages that drift with temperature. Zero the sensor (disconnect the input and set the reading to zero) before each measurement session. Thermal sensors also need zeroing.
- **Exceeding sensor power rating** — Power sensors have maximum input ratings, typically +20 to +30 dBm. A 5 W transmitter outputs +37 dBm — directly connecting it to a sensor rated for +20 dBm will destroy the sensor. Always calculate the expected power and use appropriate attenuation.
- **Connector mismatch** — Mixing connector types (SMA, BNC, N-type) with adapters adds reflection and loss at each junction. For serious power measurements, use the same connector type throughout and keep adapters to a minimum.
- **Forgetting cable loss** — A 20 dB attenuator followed by 2 dB of cable loss gives 22 dB total attenuation. If you correct for the attenuator but forget the cable, your reading is 2 dB high. Characterize or estimate all losses in the measurement path.
