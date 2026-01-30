---
title: "SDR-Based Experiments"
weight: 50
---

# SDR-Based Experiments

A software-defined radio turns a computer into a radio receiver — and a remarkably versatile one. For $25 (an RTL-SDR dongle) you get a receiver covering 25 MHz to 1.7 GHz with enough bandwidth and dynamic range to receive broadcast FM, decode aircraft transponders, capture weather satellite images, and observe the invisible electromagnetic activity happening all around you. SDR is the fastest way to develop intuition about RF signals because you can see, hear, and analyze real signals immediately.

## Receiving FM Broadcast

The simplest SDR experiment is receiving a local FM broadcast station. Connect the antenna, open SDR software (SDR#, CubicSDR, or GQRX), tune to a known FM station (88-108 MHz in the US), and listen.

What you observe and learn:

- **The spectrum display shows the FM signal's bandwidth**: A mono FM broadcast signal occupies about 150 kHz. With stereo pilot tone and subcarriers, the occupied bandwidth extends to 200+ kHz. You can see this directly on the spectrum display — the signal is not a single spike but a wide hump.
- **FM deviation**: The width of the signal changes with modulation. During quiet passages, the signal narrows. During loud passages, it widens. This is frequency modulation — the carrier frequency moves up and down with the audio signal, and the amount of movement (deviation) determines the bandwidth.
- **Adjacent channel signals**: You can see neighboring stations and observe how close they are in frequency. In the US, FM stations are spaced 200 kHz apart (even channels only in most markets), and you can see the gaps between them.
- **Multipath effects**: If you move the antenna, you may notice signal strength variations and, in extreme cases, distortion caused by multipath — the signal arriving via two paths with different delays.

The demodulation is handled by the SDR software. For WBFM (wideband FM), the software applies an FM discriminator — a function that converts frequency variations back into amplitude variations (audio). Most SDR software includes stereo FM decoding and RDS (Radio Data System) decoding, which extracts station name and song title information embedded in the FM signal.

## ADS-B Aircraft Tracking

ADS-B (Automatic Dependent Surveillance-Broadcast) is a system where aircraft continuously broadcast their position, altitude, speed, and identification on 1090 MHz. An RTL-SDR with a simple antenna can receive these broadcasts and display aircraft on a map.

Setup:

1. RTL-SDR dongle with a 1090 MHz antenna (a quarter-wave monopole is 6.9 cm)
2. Software: dump1090 (command-line decoder) or a graphical tool like ADSBexchange or tar1090
3. Connect the dongle, run the decoder, and watch aircraft appear on a map

What you learn:

- **Signal propagation at 1090 MHz**: ADS-B is line-of-sight. You can track aircraft out to 100-200 nautical miles with a good antenna and clear horizon. Aircraft below the horizon (behind terrain or buildings) disappear from the display. This demonstrates VHF/UHF propagation limits viscerally.
- **Antenna performance comparison**: Swap antennas and observe the change in reception range and number of aircraft tracked. A purpose-built collinear antenna might track 300 aircraft simultaneously, while a basic whip sees 50. This is a dramatic, real-world demonstration of antenna gain.
- **Signal strength vs distance**: Aircraft close overhead produce strong signals; aircraft near the horizon produce weak ones. The signal drops with distance following free-space path loss plus any atmospheric effects.
- **Pulsed signal structure**: ADS-B messages are 112-microsecond pulse-position-modulated bursts. On a spectrum analyzer or waterfall display, they appear as brief flashes.

## NOAA Weather Satellite Image Reception

NOAA polar-orbiting weather satellites (NOAA 15, 18, and 19) transmit Automatic Picture Transmission (APT) images at 137 MHz as they pass overhead. A pass takes about 12-15 minutes, and with an SDR and a simple antenna, you can receive and decode the satellite image directly.

Setup:

1. RTL-SDR with a 137 MHz antenna — a V-dipole (two legs at 120 degrees, each about 54 cm) works well
2. Software: SDR# with WXtoImg plugin, or SatDump
3. Satellite pass prediction: use a website like n2yo.com or an app like Look4Sat
4. Record the 137.1, 137.62, or 137.9125 MHz signal during the satellite pass
5. Decode the recording with APT decoding software

What you learn:

- **Doppler shift**: As the satellite approaches, its signal is shifted higher in frequency (about +3 kHz at 137 MHz). As it recedes, the frequency shifts lower. You can watch this happen in real time on the SDR waterfall display. The software must track this shift for clean decoding.
- **Signal strength profile**: The signal starts weak as the satellite appears above the horizon, grows to maximum at maximum elevation, and fades as it drops below the horizon. The shape of this curve depends on the maximum elevation angle — a pass directly overhead (90 degrees) produces a strong, sustained signal; a low-elevation pass (20 degrees) is weaker and shorter.
- **Antenna polarization**: NOAA satellites transmit right-hand circular polarization (RHCP). A linearly polarized antenna (like a dipole) loses 3 dB compared to a matched RHCP antenna (like a turnstile or QFH). You can test this by comparing a dipole to a purpose-built QFH antenna — the difference is visible in image quality.
- **The reward is tangible**: Receiving an image of your geographic region from a satellite 850 km above using $25 of equipment is genuinely thrilling and deeply motivating for further RF learning.

## ISM Band Observation

The ISM (Industrial, Scientific, and Medical) bands — 433 MHz, 915 MHz, and 2.4 GHz — are full of unlicensed devices transmitting continuously. Tuning an SDR to these bands reveals the invisible RF activity in your environment.

At 433 MHz (Europe, also used in the US for some devices):

- Weather station transmissions (periodic bursts every 30-60 seconds)
- Car key fobs (brief burst when pressed)
- Tire pressure monitoring sensors (periodic, very weak)
- Garage door openers
- Wireless doorbells

At 915 MHz (Americas):

- LoRa devices (chirp-spread-spectrum — visible as diagonal sweeps on the waterfall)
- Smart home sensors (Zigbee, Z-Wave devices in some configurations)
- RFID systems (industrial readers)

What you learn:

- **The spectrum is not empty**: Even in a quiet residential area, dozens of devices transmit regularly at 433 and 915 MHz. The waterfall display makes this activity visible.
- **Modulation variety**: Different devices use different modulation schemes. OOK (on-off keying) appears as simple on/off pulses. FSK appears as frequency-shifting patterns. LoRa chirps are visually distinctive — diagonal lines on the waterfall.
- **Signal identification**: With tools like rtl_433 (a multi-protocol decoder), you can decode many of these signals and identify the device type, manufacturer, and transmitted data. Your neighbor's weather station probably transmits temperature and humidity in the clear.

## Comparing Antenna Performance with SDR

One of the most practical SDR applications is comparing antennas. The procedure:

1. Identify a stable signal source: a broadcast FM station, a known beacon, or a NOAA weather satellite pass.
2. Connect antenna A and record the signal level (use the SDR software's signal strength indicator or record a short segment).
3. Switch to antenna B and repeat the measurement as quickly as possible (to minimize signal variation).
4. Compare the signal levels. The difference is the gain difference between the antennas.

For more rigorous comparison, use a satellite pass: both antennas experience the same signal over the same time period, and you can compare the received signal strength curves.

This is a relative measurement — the SDR's absolute calibration doesn't matter because you're comparing two readings on the same instrument. See [Field-Expedient RF Measurement]({{< relref "/docs/radio-rf/measurement-debugging-and-rf-tools/field-expedient-measurement" >}}) for more on relative measurement techniques.

## Bandpass Filter Effects

Observing filter performance with an SDR is immediately educational. Connect a bandpass filter between the antenna and the SDR and watch the spectrum display change.

Without the filter, you see everything the antenna receives across the SDR's bandwidth — broadcast FM, pager signals, amateur radio, cellular, ISM devices. With a bandpass filter centered on your frequency of interest, out-of-band signals disappear from the display, the noise floor may drop (if strong out-of-band signals were causing intermodulation in the SDR), and the signal of interest may actually appear stronger (because the SDR's ADC is no longer wasting dynamic range on unwanted signals).

This demonstrates several concepts simultaneously: filter selectivity, SDR dynamic range limitations, intermodulation distortion from overloading, and the practical value of front-end filtering.

## Building a Simple GNU Radio Flowgraph

GNU Radio is a free, open-source software toolkit for signal processing. It uses a visual flowgraph editor (GNU Radio Companion) where you connect processing blocks: sources, filters, demodulators, and sinks.

A starter FM receiver flowgraph:

1. **RTL-SDR Source**: Configured for the FM station frequency, 2.4 MHz sample rate
2. **Low-Pass Filter**: Reduces the bandwidth to the FM signal's occupied bandwidth (~200 kHz)
3. **WBFM Receive block**: Demodulates the FM signal to audio
4. **Rational Resampler**: Converts the sample rate to match audio output (48 kHz)
5. **Audio Sink**: Plays the demodulated audio through the computer speakers

Building this flowgraph teaches signal processing concepts hands-on: sample rates, filter design, decimation, resampling, and demodulation. Changing filter parameters and observing the audio quality change is far more educational than reading about filter theory.

After the basic FM receiver, progressively more complex flowgraphs teach AM demodulation, SSB reception, digital signal decoding, and signal recording/playback.

## SDR Limitations Discovered Through Experiments

Working with an SDR quickly reveals its limitations — and understanding those limitations is itself educational:

- **Dynamic range problems**: Tune near a strong broadcast FM station and watch the noise floor rise and spurious signals appear. The ADC is overloaded, creating intermodulation products. The solution is a bandpass filter or attenuator, but understanding why the problem occurs teaches ADC dynamic range concepts.
- **Image frequencies**: Some SDR architectures (particularly the RTL-SDR in direct sampling mode) produce image frequencies — phantom signals at mirror frequencies. Learning to identify and ignore images is a practical skill.
- **Frequency accuracy**: An uncalibrated RTL-SDR may be off by 50-100 ppm (50-100 kHz at 1 GHz). Calibrating against a known signal (like a broadcast station or GPS-disciplined reference) teaches the importance of frequency accuracy.
- **Quantization noise**: The 8-bit ADC in an RTL-SDR produces visible quantization noise that raises the noise floor. Comparing this to a 14-bit Airspy demonstrates the relationship between ADC resolution and receiver sensitivity.

## Gotchas

- **Strong signal overload** — An SDR near a cell tower or broadcast transmitter may show spurious signals across the entire band. Add an FM bandstop filter (for broadcast FM) or a bandpass filter for your frequency of interest. Do not blame the SDR for showing signals that aren't there — blame the ADC overload.
- **Antenna matters more than the SDR** — Upgrading from a $25 RTL-SDR to a $200 Airspy without improving the antenna is often wasted money. The antenna determines what signals reach the receiver. Invest in antennas first.
- **USB cable noise** — The USB cable connecting the SDR to the computer can radiate or conduct noise, raising the noise floor. Use a short, shielded USB cable and try different USB ports (USB 3.0 ports are noisier than USB 2.0 in some computers).
- **CPU load during recording** — SDR software is computationally intensive. If the CPU can't keep up, samples are dropped, causing gaps in the waterfall and distortion in demodulated audio. Close other applications during critical recordings.
- **Sample rate and bandwidth confusion** — The sample rate determines the maximum receivable bandwidth, not the tuning range. An RTL-SDR sampling at 2.4 MHz can see 2.4 MHz of spectrum at once, centered on the tuned frequency. To see a different 2.4 MHz window, you retune.
- **Comparing SDR signal levels to absolute power** — SDR software displays signal levels in dBFS (dB relative to full scale of the ADC) or arbitrary units, not in dBm. Without calibration against a known power source, these numbers are relative, not absolute.
