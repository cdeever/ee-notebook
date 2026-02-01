---
title: "Speakers & Buzzers"
weight: 40
---

# Speakers & Buzzers

Devices that convert electrical signals into sound by moving air. Speakers use a voice coil in a magnetic field to drive a cone or diaphragm. Buzzers use either a piezoelectric element or a small electromagnetic mechanism to vibrate a diaphragm. Both are transducers — they convert energy from one domain (electrical) to another (mechanical/acoustic).

From a circuit perspective, these are loads with characteristics that matter: impedance, power handling, frequency response, and drive requirements that differ significantly by type.

## Dynamic Speakers

A coil of wire (the voice coil) attached to a cone, suspended in the field of a permanent magnet. Current through the coil creates a force that moves the cone, displacing air and producing sound. The current direction determines the direction of cone movement, so an AC signal produces corresponding sound waves.

### Electrical Characteristics

**Impedance:** A speaker's rated impedance (4, 8, 16 ohm typical) is the nominal impedance — roughly the DC resistance of the voice coil plus a small amount. But impedance varies dramatically with frequency:

- At the resonant frequency (f_s), impedance peaks — often 5-10x the nominal value
- Above resonance, impedance rises gradually due to the voice coil's inductance
- The nominal impedance is roughly the minimum impedance in the usable frequency range

This matters for amplifier design. An amplifier driving an 8 ohm speaker doesn't see a constant 8 ohm load — it sees a complex, frequency-dependent impedance.

**Power handling:** Rated in watts — the continuous electrical power the speaker can handle without damage. This is a thermal limit (the voice coil overheats) and a mechanical limit (the cone exceeds its excursion range). Peak or music power ratings are marketing numbers — use the continuous/RMS rating.

**Sensitivity:** Measured in dB SPL at 1 W at 1 meter. Tells you how loud the speaker is for a given input power. Typical values range from 82-95 dB for home speakers. A 3 dB increase in sensitivity is equivalent to doubling the amplifier power for the same loudness.

### Driving Speakers

**Audio amplifiers** drive speakers with a voltage signal. The amplifier must be able to source and sink the current demanded by the speaker impedance at the signal voltage. Key considerations:

- Match the amplifier's rated load impedance to the speaker. Driving a 4 ohm speaker with an amplifier rated for 8 ohm minimum draws twice the current and can overheat the output stage
- Speaker wires have resistance. At high currents (low impedance speakers, long runs), the wire resistance becomes a significant fraction of the load, reducing power delivered and degrading damping
- DC on a speaker is destructive — it displaces the cone to one extreme and heats the voice coil without producing useful sound. Amplifier output coupling capacitors or DC servo circuits prevent this

**Class D amplifiers** drive speakers with a high-frequency PWM signal that's filtered by the speaker's inductance. The speaker itself acts as part of the low-pass filter. Efficient (90%+), compact, and now standard in everything from Bluetooth speakers to automotive audio.

### Small Speakers and Microcontroller Audio

For embedded projects and alerts, small speakers (20-50 mm) driven directly or through a simple transistor amplifier are common:

- A GPIO pin through a series resistor can drive a small speaker for simple tones, but the output is quiet and the square wave sounds harsh
- A basic transistor driver (NPN or MOSFET) switching a speaker between supply and ground produces louder output
- For voice or music playback, a DAC or PWM output through a small Class D amplifier IC is the practical approach. I2S audio codecs handle this cleanly

## Piezoelectric Buzzers

A piezoelectric ceramic disc bonded to a metal diaphragm. Applying voltage deforms the ceramic, which flexes the diaphragm and produces sound. No coil, no magnet, no moving cone — the piezo element itself is the motor.

### Types

**Passive piezo elements (transducers):** Just the piezo disc and diaphragm. You supply the AC drive signal at the desired frequency. They need an external oscillator or microcontroller to produce a tone.

- Impedance is primarily capacitive (typically 10-100 nF at 1 kHz). This means current leads voltage, and the impedance drops with increasing frequency
- Maximum sound output occurs at the mechanical resonant frequency of the disc/diaphragm assembly — typically a narrow peak somewhere between 2-5 kHz. Away from resonance, output drops significantly
- Drive voltage can be high. Piezo elements respond to voltage, not current. 5 V works but is quiet; 12-30 V is common for alarm-level output. Some drive circuits use an inductor in parallel to create an LC resonance with the piezo's capacitance, boosting the voltage at the drive frequency

**Active buzzers (with internal oscillator):** The drive circuit is built in. Apply DC power and they beep. Simpler to use — one GPIO pin and a transistor is all you need. But you can't control the frequency or produce different tones; you only control on/off.

### Driving Piezo Elements

Since piezo elements are capacitive loads, drive considerations differ from speakers:

- **Square wave drive** is fine — the sharp edges efficiently excite the resonant frequency, and the harmonics above the resonant peak are mechanically filtered out
- **Push-pull drive** doubles the effective voltage swing (the piezo sees V+ to V- rather than 0 to V+), quadrupling the acoustic output for the same supply voltage. H-bridge drivers accomplish this
- **Resonant drive** — An inductor in series or parallel with the piezo creates an electrical resonance that boosts voltage at the mechanical resonant frequency. This is how 3 V coin-cell devices produce surprisingly loud alarm tones

### Feedback Buzzers

Some piezo buzzers have a third terminal — a feedback electrode that outputs a signal proportional to the diaphragm's motion. This can drive a simple oscillator circuit that self-resonates at the element's mechanical resonant frequency, ensuring maximum output without needing to know or tune the exact frequency. The classic three-terminal piezo buzzer circuit uses one transistor and two resistors.

## Electromagnetic Buzzers

A small electromagnet drives a steel diaphragm or armature at its resonant frequency, similar in principle to a relay but optimized for continuous vibration rather than a single actuation.

- Simpler drive than piezo (just DC — the mechanism self-oscillates, or contains an internal oscillator)
- Lower impedance than piezo — draws more current (tens of mA vs. the microamps a piezo draws at audio frequencies)
- Louder at low frequencies than piezo elements of similar size
- Used where a distinctive buzzing or clicking alert is needed rather than a tonal beep

## Practical Considerations

### Resonant Frequency and Bandwidth

Speakers are broadband devices — designed to reproduce a range of frequencies. Buzzers and piezo elements are narrowband — designed to produce maximum output at or near their resonant frequency. Trying to use a buzzer as a speaker (or vice versa) produces poor results.

For alert tones and alarms: use a buzzer or piezo driven at its resonant frequency. For audio playback, voice, or multi-tone output: use a speaker.

### Enclosure Effects

A bare speaker produces very little bass because the sound from the back of the cone cancels the sound from the front (acoustic short circuit). An enclosure (sealed box, ported box, or baffle) prevents this cancellation. Even a simple mounting plate or panel helps. This is why a speaker that sounds thin on the bench sounds much better mounted in an enclosure.

Buzzers are less sensitive to mounting — their output is primarily at the resonant frequency, and the diaphragm is already enclosed or partially enclosed in the buzzer housing.

### Acoustic Coupling

A buzzer mounted in an enclosure with a small port (Helmholtz resonator) can be significantly louder than the same buzzer in open air. Many commercial alarm devices use this principle — the buzzer itself produces modest output, but the enclosure geometry amplifies it at the target frequency.

## Gotchas

- **Speaker impedance is not resistance** — Don't measure a speaker with a DC ohmmeter and expect the result to match the rated impedance. The DC resistance (DCR) is typically 70-80% of the nominal impedance. The rated impedance is the minimum AC impedance in the operating range
- **Piezo elements are capacitors** — They can hold charge after the drive signal is removed. High-voltage drive circuits can leave a painful or damaging charge on the element. Discharge through a resistor if you're handling them
- **Acoustic feedback** — A speaker near a microphone in the same system creates a feedback loop. If the loop gain exceeds unity at any frequency, the system oscillates (the familiar squeal of PA feedback). Physical separation, directional microphones, or electronic feedback suppression are the fixes
- **Thermal limits on speakers** — Continuous sine wave testing at rated power can overheat a speaker that handles the same power level fine with music (which has a much lower average-to-peak ratio). Continuous power ratings assume a specific test signal — real-world durability depends on the signal's crest factor
- **Back-EMF from speakers** — A speaker is also a microphone and a generator. Sound hitting the cone generates a voltage. Moving the cone by hand generates a voltage. In some circuits, this back-EMF can feed back into the amplifier and cause unexpected behavior
- **Piezo elements are microphonic** — Mechanical vibration produces voltage on the piezo element's terminals, which can couple back into the circuit as noise. This is a feature in sensors but a bug in buzzer applications where the mounting is subject to vibration
