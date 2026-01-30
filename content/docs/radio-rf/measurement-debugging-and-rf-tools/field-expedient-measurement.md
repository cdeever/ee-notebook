---
title: "Field-Expedient RF Measurement"
weight: 70
---

# Field-Expedient RF Measurement

Not everyone has a $20,000 spectrum analyzer, a calibrated VNA, and a rack of precision attenuators. Most people learning RF have a modest oscilloscope, maybe an SDR dongle, and whatever they can afford to buy. The good news is that useful RF measurements are possible with inexpensive tools — the key is understanding what each tool can and cannot tell you, and relying on relative measurements rather than absolute ones whenever possible.

## SDR as a Receiver and Spectrum Display

A software-defined radio receiver (RTL-SDR at $25, or an Airspy/SDRplay at $100-200) connected to a computer running SDR software (SDR#, CubicSDR, GQRX) provides a real-time spectrum display and waterfall. For many debugging and learning tasks, this is surprisingly effective.

What an SDR can do:

- **Show you what's there**: Tune to a frequency range and see what signals are present. Identify transmitter output, harmonics, interference sources, and ambient signals.
- **Relative power comparison**: Compare antenna performance by switching antennas and observing the signal level change. If antenna A shows a signal at -35 dB on the SDR display and antenna B shows it at -29 dB, antenna B is roughly 6 dB better — regardless of the SDR's absolute calibration.
- **Frequency identification**: SDRs use a synthesized local oscillator with reasonable frequency accuracy (1-2 ppm with a TCXO). They can identify signal frequencies to within a few hundred Hz at VHF.
- **Modulation analysis**: Observe AM, FM, SSB, and digital modulation in real time. Listen to audio, examine the spectral shape of the modulation.
- **Time-domain events on the waterfall**: The waterfall display shows frequency vs time, revealing intermittent signals, frequency hopping, and periodic interference.

SDR limitations for measurement:

- **Dynamic range**: A typical RTL-SDR has about 50-55 dB of dynamic range in a given tuning window. An Airspy achieves 60-70 dB. Compare this to 100+ dB for a benchtop spectrum analyzer. This means you can see a signal 50 dB above the noise floor, but not a harmonic 60 dB below a strong fundamental.
- **Amplitude accuracy**: Without calibration, the displayed signal level is only roughly related to actual power. Variations of 3-5 dB across the tuning range are typical.
- **Overloading**: Strong signals anywhere in the receiver's passband (not just the tuned frequency) can cause false signals and distortion. An SDR near a broadcast FM transmitter may show spurious signals across the entire band.
- **Frequency coverage gaps**: Most low-cost SDRs cover 25 MHz to 1.7 GHz. Below 25 MHz requires an upconverter; above 1.7 GHz requires a different receiver.

## NanoVNA for Impedance and Antenna Measurement

The NanoVNA (discussed in detail in [Vector Network Analyzers]({{< relref "/docs/radio-rf/measurement-debugging-and-rf-tools/vector-network-analyzers" >}})) is the single most impactful low-cost instrument for RF learning. At $30-100, it provides:

- Antenna impedance and VSWR measurement across frequency
- Filter characterization (passband, stopband, insertion loss)
- Cable loss and length measurement
- Matching network verification
- Smith chart display for impedance visualization

The NanoVNA has genuine limitations (70 dB dynamic range, limited frequency accuracy, small screen), but for antenna work and filter testing it is transformatively useful. Before the NanoVNA existed, impedance measurement required instruments costing thousands of dollars. Now the barrier to entry is the cost of a nice lunch.

Use NanoVNA-Saver (free PC software) for better display, data export, and calibration management. It transforms the NanoVNA from a handy gadget into a capable measurement tool.

## Signal Generator Plus Oscilloscope

If you have a signal generator (even a cheap DDS module at $10-30) and an oscilloscope, you can measure frequency response by sweeping the generator across frequencies and recording the oscilloscope's reading at each point.

The procedure:

1. Set the signal generator to the starting frequency at a known output level.
2. Connect the generator to the input of the device under test (filter, amplifier, cable).
3. Connect the oscilloscope to the output.
4. Record the output amplitude.
5. Step the frequency (manually or with a sweep function) and record amplitude at each point.
6. Plot amplitude vs frequency.

This is tedious compared to an automated VNA sweep, but it works. The frequency response you get is a scalar measurement (magnitude only, no phase), equivalent to |S21|. For characterizing a bandpass filter's passband shape and approximate insertion loss, this is entirely adequate.

The accuracy depends on the oscilloscope's frequency response (see [Using Oscilloscopes at RF]({{< relref "/docs/radio-rf/measurement-debugging-and-rf-tools/using-oscilloscopes-at-rf" >}})) and the generator's amplitude flatness. A DDS generator's output amplitude varies with frequency — characterize the generator into a 50-ohm load first, then subtract its frequency response from your device measurements.

## LED Power Indicator

A crude but genuinely useful transmitter test: connect an LED in series with a small resistor across the transmitter output (through appropriate attenuation for power levels above a few hundred milliwatts). At 50 ohms, 100 mW (+20 dBm) produces about 2.2 Vrms. An LED with a 100-ohm series resistor will glow visibly.

This tells you nothing about frequency, spectral purity, or exact power — but it immediately answers the most basic question: "Is the transmitter producing any RF power at all?" During initial bring-up of a transmitter project, this is the first test. If the LED doesn't light, there's no point reaching for the spectrum analyzer.

For higher power levels, a small incandescent lamp (like a #47 pilot lamp rated for 6.3 V, 150 mA) works as a dummy load and visual power indicator. At 1 watt, it glows dimly. At 5 watts, it's bright. This gives you a rough, hands-on feel for power output.

## Dummy Loads

Every transmitter test requires a dummy load — a non-inductive resistance that absorbs RF power without radiating it. Transmitting into an antenna during development is both illegal (if you're not licensed for that frequency and power) and unhelpful (reflections from the environment complicate measurements).

A simple dummy load for QRP (low-power) work is a collection of non-inductive resistors combining to 50 ohms. Common approaches:

- **Two 100-ohm resistors in parallel**: Gives 50 ohms. Carbon composition or metal film, rated for the expected power. Two 2-watt resistors handle 4 watts total.
- **Purpose-built dummy load**: A 50-ohm resistor on a heatsink, often in a metal can with an RF connector. Available commercially for $20-50, rated from 5 watts to kilowatts.
- **Oil-cooled dummy load**: For high power (100+ watts), immerse a resistive load in mineral oil for heat dissipation. This is a classic ham radio construction project.

The critical requirement is that the dummy load must present 50 ohms with minimal reactance at the frequencies of interest. Wire-wound resistors are inductive and become poor dummy loads above a few MHz. Use carbon composition or thick-film resistors with short leads.

## Reference Cables and Attenuators

Having known-quantity components in your toolbox enables comparison measurements:

- **Calibrated attenuator**: A 20 dB attenuator with ±0.5 dB accuracy across its rated frequency range is a measurement reference. Insert it in the signal path and verify that the receiver shows exactly 20 dB less signal. If it doesn't, your measurement setup has an error.
- **Known-loss cable**: Measure a cable's loss at several frequencies (using a NanoVNA or by comparing signal levels with and without the cable). Label it with the loss values. Now it's a reference — any future measurement through that cable can be corrected.
- **50-ohm termination**: A precision 50-ohm terminator is a reference for calibration and a sanity check. Connecting it to a VNA should show return loss better than 30 dB. If it doesn't, something is wrong with the VNA setup.

## Comparison Measurements: Relative Over Absolute

The most powerful technique available to the modestly-equipped bench is comparison measurement. Instead of asking "What is the absolute power level?" ask "How does this compare to a known reference?"

Examples:

- Antenna comparison: Record the SDR signal level from a known broadcast station with antenna A. Switch to antenna B. The difference in signal level is the gain difference between the antennas — no calibrated receiver needed.
- Filter testing: Measure the signal through a direct connection (bypass the filter). Then measure through the filter. The difference is the filter's insertion loss at that frequency.
- Cable loss: Compare the signal at the beginning and end of a cable at the same frequency.

Comparison measurements cancel out most systematic errors in the measurement equipment. The SDR's poor amplitude calibration doesn't matter if you're comparing two measurements made seconds apart on the same equipment.

## When Cheap Tools Give Misleading Results

Inexpensive instruments have failure modes that can lead you astray:

- **SDR overloading**: A strong signal outside the tuned band creates intermodulation products that look like real signals. If you see unexpected signals, try adding a bandpass filter before the SDR or reducing the gain.
- **NanoVNA calibration drift**: If the NanoVNA has been sitting in a cold car and you calibrate it immediately, the calibration will drift as the instrument warms up. Let it stabilize for 5-10 minutes.
- **DDS generator harmonics**: A cheap DDS signal generator produces harmonics typically 25-35 dB below the fundamental. If you're measuring a filter's stopband rejection, the generator's harmonics can create false "leakage" through the filter.
- **Poorly shielded equipment**: Low-cost instruments often lack proper shielding. Signals can leak in or out through the enclosure, creating phantom signals or radiating test signals that couple into other equipment.

The sanity check: if a measurement seems too good or too bad, it probably is. Verify unexpected results by changing the measurement approach — use a different instrument, a different cable, or a different technique.

## Gotchas

- **Assuming SDR power readings are accurate** — Most SDR software displays relative power in arbitrary units or uncalibrated dBFS. Treat these as relative measurements only unless you've calibrated the SDR against a known source.
- **Forgetting attenuator power ratings** — A 20 dB attenuator rated for 1 watt will handle +30 dBm input. But connecting a 5-watt transmitter (+37 dBm) will overheat and potentially damage it. Always check both the attenuation value and the power handling.
- **Using long cables for NanoVNA measurements** — The NanoVNA calibration assumes specific cable length and loss. Using a 3-foot cable when you calibrated with a 1-foot cable introduces errors. Always calibrate with the exact cables you'll use for measurement.
- **Trusting a single measurement** — Measure twice, with different connections or approaches. A single measurement with cheap equipment is an indication, not a fact. Repeatability builds confidence.
- **Ignoring connector quality** — A cheap BNC-to-SMA adapter with poor center pin contact can introduce 1-2 dB of intermittent loss. When measurements fluctuate, suspect the connectors first — wiggle each one and see if the reading changes.
- **Comparing measurements made at different times** — If you measured antenna A yesterday and antenna B today, temperature, ambient RF environment, and equipment drift may have changed. Make comparison measurements back-to-back for meaningful results.
