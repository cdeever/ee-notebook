---
title: "Simple Transmitters & Receivers"
weight: 10
---

# Simple Transmitters & Receivers

The simplest RF transmitter is an oscillator connected to an antenna. The simplest receiver is an antenna connected to a detector. Everything else — modulation, selectivity, sensitivity, stability — is refinement built on these foundations. Building simple transmitters and receivers teaches more about RF behavior than any amount of reading, because the gap between "schematic that should work" and "circuit that actually does" is where all the real learning happens.

## Crystal Oscillator Transmitter

The most basic RF transmitter uses a quartz crystal to set the frequency and a single transistor to sustain oscillation. A Colpitts or Pierce oscillator circuit with a crystal at, say, 7.040 MHz produces a few milliwatts of RF energy. Connect that to a wire antenna, and you have a transmitter — crude, but functional.

What makes this a good learning project:

- The crystal controls the frequency to within a few tens of ppm, so you know exactly where to look on a receiver.
- The circuit requires only 5-10 components: one transistor, one crystal, a few capacitors and resistors, and a power source.
- The output is a CW (continuous wave) signal — no modulation to complicate things.
- The power level is low enough (5-50 mW depending on the design) that a dummy load and near-field probe can detect it without an antenna.

The practical challenge: getting the oscillator to start reliably and produce a clean signal. Common problems include insufficient feedback (oscillator won't start), excessive feedback (distorted output with strong harmonics), and crystal heating (frequency drift as the crystal warms up). A good oscillator starts within milliseconds of power application and settles to a stable frequency within a few seconds.

Crystal oscillator output is rich in harmonics — the square-ish waveform at the collector or drain contains energy at the fundamental and all odd harmonics. A 7 MHz oscillator produces significant energy at 21, 35, 49 MHz and beyond. A low-pass filter after the oscillator is essential to avoid transmitting on harmonic frequencies.

## Simple AM Transmitter

Adding amplitude modulation to an oscillator creates a transmitter that can carry audio. The simplest approach modulates the supply voltage of the oscillator — as the audio signal increases the supply voltage, the oscillator's output amplitude increases proportionally.

A basic AM transmitter for learning:

1. Crystal oscillator stage running at the desired carrier frequency
2. Audio amplifier to boost microphone or audio source output
3. Modulator stage that varies the oscillator's supply voltage with the audio signal
4. Output filter to suppress harmonics

The result is a signal you can receive on any AM radio (if the frequency is in the AM broadcast band) or on an SDR tuned to the crystal frequency. Hearing your own voice or music transmitted wirelessly, even across a room, makes the abstract concepts of modulation and demodulation tangible.

The power output of such a circuit is typically 10-100 mW before filtering. This is enough to receive across a room or a building with a simple receiver, but it also means regulatory compliance matters — see the legal section below.

## Direct Conversion Receiver

A direct conversion (DC) receiver is the simplest architecture that can receive single-sideband (SSB) and CW signals. The signal path is: antenna, bandpass filter, mixer, audio filter, audio amplifier, headphones.

The mixer multiplies the incoming RF signal by a local oscillator (LO) at the same frequency. When the incoming signal and LO are at slightly different frequencies, the mixer output contains the difference frequency — which is in the audio range. A 7.040 MHz signal mixed with a 7.039 MHz LO produces a 1 kHz audio tone.

Why this is an excellent learning project:

- **Minimal parts count**: One mixer IC (like the SA612/NE602), one oscillator (VFO or crystal), a few filter components, and an audio amplifier (LM386 or similar).
- **Teaches frequency conversion**: You directly experience the relationship between LO frequency, signal frequency, and audio output.
- **Reveals mixer behavior**: You hear intermodulation, images, LO leakage, and other mixer effects as audible artifacts.

Practical limitations of direct conversion:

- **Audio frequency images**: A signal 1 kHz above the LO and a signal 1 kHz below the LO both produce 1 kHz audio. You hear both, and can't distinguish them without additional processing (I/Q detection and phasing).
- **LO radiation**: The local oscillator couples back through the mixer to the antenna and radiates. Other nearby receivers can hear your LO.
- **Microphonics**: Mechanical vibration modulates the VFO frequency, creating audio artifacts. Tapping the circuit produces audible thumps.
- **DC offset and hum**: The mixer produces a DC component that can saturate the audio amplifier. AC coupling and careful grounding are necessary.

## Superheterodyne Receiver

The superheterodyne architecture converts the incoming signal to a fixed intermediate frequency (IF), where filtering and amplification are easier and more effective. This is the architecture used in virtually every commercial receiver from the 1930s to today.

The signal path: antenna, RF preselector filter, mixer, IF filter, IF amplifier, detector, audio amplifier.

The key insight: by converting every incoming signal to the same IF (say 455 kHz for AM, 10.7 MHz for FM, or 9 MHz for communications receivers), you only need to build one high-performance filter at a fixed frequency. The LO tunes to select different incoming signals by changing the difference frequency.

For a receiver tuning 7.0 to 7.3 MHz with a 10 MHz IF, the LO tunes from 17.0 to 17.3 MHz. The mixer produces the difference: 17.0 - 7.0 = 10.0 MHz, 17.3 - 7.3 = 10.0 MHz. Every signal in the tuning range gets converted to 10 MHz, where the crystal filter selects the desired signal.

Building a superheterodyne receiver is a significantly more complex project than a direct conversion receiver, but it teaches:

- Why image rejection matters (a signal at LO + IF and LO - IF both produce the same IF)
- The role of the preselector filter (rejecting the image frequency)
- IF filter selectivity and its effect on received signal quality
- AGC (automatic gain control) for handling signals of vastly different strength

## Legal Considerations

RF transmission is regulated everywhere. Before transmitting, understand the legal framework:

| Regulation | What It Allows | Limits |
|---|---|---|
| FCC Part 15 (US) | Unlicensed intentional radiators | Extremely low power: ~200 uV/m at 3 meters (roughly microwatts) at HF |
| Amateur radio license (US) | Licensed operation on specific bands | Up to 1.5 kW PEP on many bands; requires passing an exam |
| ISM bands | Unlicensed operation at specific frequencies | 915 MHz, 2.4 GHz, 5.8 GHz with power and modulation restrictions |
| Part 15 low-power broadcast | AM broadcast band transmitters | ~200 foot range, specific technical requirements |

For learning, the safest approach is:

1. **Use a dummy load** for all transmitter testing. No antenna means no radiation (in theory — in practice, even a dummy load radiates a little).
2. **Get a ham radio license** (Technician class in the US) for legal transmission privileges on amateur bands. The exam is straightforward.
3. **Start with receiving** — all receiving is legal, and you learn just as much about RF behavior by receiving as by transmitting.

## What You Learn from Building vs Buying

The gap between schematic and working circuit teaches things no textbook covers:

- **Component placement matters**: Moving a capacitor 2 cm changes the behavior at RF. The schematic doesn't show this.
- **Ground is not ground**: Different ground points on the same board have different RF voltages. Star grounding, ground plane design, and via placement all matter.
- **Stray coupling is real**: Two unshielded inductors near each other couple magnetically. A trace running near an oscillator pulls its frequency.
- **Stability is hard**: An oscillator that works at room temperature may drift or stop at 0C or 50C. A receiver that works alone may fail when a nearby switching power supply turns on.
- **Shielding is not optional**: Without shielding, a sensitive receiver hears everything — including its own LO harmonics, power supply noise, and the computer sitting next to it.

## Suggested Starter Projects

In roughly increasing order of complexity:

1. **Crystal oscillator on a breadboard**: Verify operation with an oscilloscope or SDR. Observe harmonics.
2. **Direct conversion receiver**: Receive CW and SSB signals on an amateur band. Experience mixer behavior firsthand.
3. **Crystal oscillator transmitter into a dummy load**: Verify output with an SDR or spectrum analyzer. Add a low-pass filter and observe the harmonic suppression.
4. **AM transmitter and receiver pair**: Transmit audio across a room. Experience modulation and demodulation.
5. **Superheterodyne receiver**: Build selectivity and sensitivity. Compare to the direct conversion receiver.

Each project builds on the concepts from the previous one and connects to the fundamentals covered in [RF Fundamentals]({{< relref "/docs/radio-rf/rf-fundamentals" >}}).

## Gotchas

- **Breadboards are terrible for RF** — The stray capacitance between breadboard rows is 1-2 pF per row. Above 30-50 MHz, breadboard circuits are unreliable. Use dead-bug construction (components soldered directly to a copper ground plane) or proper PCBs.
- **Crystal frequency is not exact** — A crystal marked "7.040 MHz" oscillates at that frequency only under specific load capacitance conditions. In your circuit, it may oscillate 1-5 kHz away depending on the feedback network.
- **The oscillator won't start** — Insufficient loop gain, wrong bias point, or too much loading. Check that the transistor is biased in the active region and that the feedback network provides enough gain at the crystal frequency.
- **AM modulation depth confusion** — 100% modulation doubles the peak voltage and quadruples the peak power. Over-modulating (above 100%) causes splatter — wideband interference that's audible on adjacent frequencies and violates regulations.
- **Receiver overload from nearby transmitters** — A direct conversion receiver near a strong broadcast station or cell tower may produce intermodulation products that sound like real signals. An attenuator or preselector filter at the input helps.
- **Forgetting the output filter** — An unfiltered oscillator transmitter radiates harmonics across a wide spectrum. Always use a low-pass filter between the oscillator and any antenna connection, even for bench testing.
