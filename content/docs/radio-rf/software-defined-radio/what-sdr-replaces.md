---
title: "What SDR Actually Replaces"
weight: 10
---

# What SDR Actually Replaces

A traditional radio receiver is a chain of analog stages, each performing a specific function with dedicated hardware. A software-defined radio replaces most of that chain with a digitizer and a computer. Understanding what was there before — and what SDR keeps, discards, and replaces — makes it much clearer why SDR works the way it does and where its limitations come from.

## The Traditional Superheterodyne Receiver

The superheterodyne architecture has dominated radio design since the 1930s. The signal chain looks like this:

**Antenna** receives the RF signal across a wide range of frequencies.

**Preselector filter** passes only the band of interest and rejects strong out-of-band signals that could overload later stages.

**Low-noise amplifier (LNA)** boosts the weak received signal while adding as little noise as possible. The LNA's noise figure largely determines the receiver's sensitivity.

**Mixer + local oscillator (LO)** multiplies the RF signal with a locally generated sine wave, shifting it to an intermediate frequency (IF). Tuning to a specific station means changing the LO frequency. The mixer is the heart of frequency conversion — it translates any desired RF frequency down to a fixed IF where the expensive, high-performance filtering can be done.

**IF filter** provides selectivity — the ability to receive one signal while rejecting adjacent ones. Crystal filters, ceramic filters, or SAW filters at the IF frequency determine the receiver's bandwidth and adjacent-channel rejection. This is the most critical filtering stage because it determines what makes it through and what does not.

**IF amplifier** provides most of the receiver's gain. Because the IF frequency is fixed, this amplifier and its associated AGC (automatic gain control) can be optimized for one frequency.

**Demodulator** extracts the original information from the carrier. An AM demodulator is an envelope detector. An FM demodulator might use a phase-locked loop or a discriminator circuit. An SSB demodulator uses a product detector with a beat-frequency oscillator (BFO).

**Audio amplifier** drives the speaker or headphones.

Each of these stages is a dedicated analog circuit optimized for its specific function. Changing from AM to FM reception might require switching demodulator circuits. Changing bandwidth means switching IF filters. Each capability requires hardware.

## What SDR Replaces

In an SDR, the signal chain is dramatically shortened:

**Antenna** — unchanged. The antenna is always analog.

**Preselector filter** — still needed, and still analog. The filter prevents strong out-of-band signals from reaching the amplifier and ADC.

**LNA** — still needed, and still analog. Noise figure is still determined by the first amplifier in the chain.

**ADC (analog-to-digital converter)** — replaces everything from the mixer onward. The ADC samples the signal and converts it to a stream of digital numbers.

**Software** — replaces the mixer, IF filter, IF amplifier, demodulator, and audio processing. All of these functions are performed computationally on the digitized samples.

The key insight: everything from the point of digitization onward is software. Changing from AM to FM is changing an algorithm, not swapping a circuit. Changing bandwidth is adjusting a digital filter parameter, not switching a crystal filter. Recording the raw signal for later analysis is trivial — just save the samples to a file.

## What SDR Does NOT Replace

This is the part that surprises people new to SDR. The analog front end — antenna, preselector filter, and LNA — is still there and still matters enormously.

**The antenna** determines what signals reach the system at all. A 2.4 GHz antenna will not receive HF signals, no matter how good the software is. Antenna choice is still the first and most important decision.

**The preselector filter** prevents strong out-of-band signals from overloading the LNA or ADC. Without it, a strong local FM broadcast station can saturate the front end and make reception of weak signals impossible. The filter must be analog because the ADC cannot reject signals it has already digitized — if the ADC is clipping, the damage is done.

**The LNA** sets the system noise floor. A noisy front end produces noisy samples. No amount of digital signal processing can recover a signal buried below the front-end noise floor. The noise figure of the first amplifier stage is the dominant factor in receiver sensitivity, just as it is in traditional receivers.

**The ADC** is the critical bridge between analog and digital. Its sample rate determines the maximum bandwidth. Its resolution (number of bits) determines the dynamic range. Its clock quality (phase noise, jitter) determines the noise floor at high frequencies. A weak ADC limits everything the software can do.

## Hybrid Architectures

In practice, most SDR systems use some analog frequency conversion before the ADC. This is because directly digitizing signals at GHz frequencies requires extremely fast (and expensive) ADCs.

**Direct sampling** — The ADC directly digitizes the RF signal. Practical for HF and some VHF applications where frequencies are tens of MHz. Used in some KiwiSDR and Red Pitaya configurations.

**Single conversion** — A mixer and local oscillator downconvert the RF signal to a lower IF, which is then digitized. The RTL-SDR uses this approach: the R820T tuner chip performs analog downconversion, and the RTL2832U digitizes the IF. Most affordable SDR hardware uses single conversion.

**Dual conversion** — Two stages of analog downconversion before digitization. Used in higher-performance SDR platforms where image rejection and spurious response requirements are stringent.

The choice of architecture determines the SDR's frequency range, bandwidth, and dynamic range. Direct sampling avoids the complexity of mixers but requires a very fast ADC. Conversion-based architectures use a slower (higher-resolution) ADC but add the nonlinearity and spurious responses of analog mixers.

## What Is Gained

SDR provides several capabilities that are difficult or impossible with traditional analog receivers:

**Flexibility.** The same hardware can receive AM, FM, SSB, digital modes, and anything else — just by changing software. Adding a new modulation type means writing code, not building a circuit.

**Wideband capture.** An SDR can digitize and process a wide swath of spectrum simultaneously. An RTL-SDR captures about 2.4 MHz of bandwidth at once; a HackRF captures 20 MHz. This means you can see and decode multiple signals simultaneously.

**Recording and playback.** Raw I/Q samples can be saved to disk and replayed later. This is invaluable for debugging, for offline analysis, and for sharing interesting signals with others. You can record a satellite pass and decode it at your leisure.

**Programmable filtering.** Digital filters can have characteristics that are impractical or impossible in analog — extremely sharp rolloff, precisely controlled phase response, or adaptive characteristics that change in real time based on the received signal.

**Visualization.** Spectrum displays, waterfall plots, and constellation diagrams are natural outputs of the digital processing chain. They make RF behavior visible in ways that analog receivers never could.

## What Is Lost

SDR is not strictly superior to traditional receivers. There are real tradeoffs:

**Dynamic range.** An 8-bit ADC (common in inexpensive SDR hardware) provides about 48 dB of dynamic range. A good analog receiver can handle 90+ dB. This means an SDR receiver is more easily overloaded by strong signals near the desired weak one (see [Dynamic Range & Front-End Limits]({{< relref "/docs/radio-rf/software-defined-radio/dynamic-range-and-front-end-limits" >}})).

**Power consumption.** Running an ADC and a computer (or FPGA) to process samples uses far more power than a simple analog receiver. This matters for battery-powered and remote devices.

**Latency.** Digital processing introduces latency — buffering, FFT processing, and filter pipeline delays add milliseconds to the receive path. For real-time voice communication, this is manageable. For radar or time-critical applications, latency must be carefully managed.

**Cost of high performance.** A good 16-bit ADC running at 100+ MSPS is expensive. Achieving the dynamic range and spurious-free performance of a traditional analog receiver requires high-end hardware that costs as much or more than the analog equivalent.

## Gotchas

- **SDR does not eliminate analog problems, it hides them** — The analog front end still determines sensitivity, dynamic range, and susceptibility to overload. Software cannot fix what the hardware corrupts before digitization.
- **"Software-defined" does not mean "no hardware required"** — A good antenna, proper filtering, and a quality LNA matter as much for an SDR as for a traditional receiver. Plugging a rubber duck antenna into an RTL-SDR and expecting to receive weak signals is unrealistic.
- **ADC bits directly limit dynamic range** — 8 bits gives ~48 dB, 12 bits gives ~72 dB, 16 bits gives ~96 dB. If you need to receive a -100 dBm signal while a -20 dBm signal is present in the same bandwidth, you need 80 dB of dynamic range — more than an 8-bit SDR can provide without analog filtering.
- **Sample rate limits bandwidth, not frequency** — An RTL-SDR can tune to 1 GHz, but it only captures ~2.4 MHz of bandwidth around that center frequency. This is enough for a single FM broadcast station but not enough to see the entire FM band at once.
- **Raw I/Q files are large** — At 2.4 MSPS with 8-bit I/Q samples, the data rate is about 4.8 MB/s — roughly 17 GB per hour. At higher sample rates and bit depths, storage fills quickly.
- **The computer is now part of the receiver** — CPU performance, USB bandwidth, and operating system scheduling all affect SDR performance. A USB dropout causes a gap in the received signal. A CPU spike causes dropped samples. The computer must be treated as a reliability-critical part of the receive chain.
