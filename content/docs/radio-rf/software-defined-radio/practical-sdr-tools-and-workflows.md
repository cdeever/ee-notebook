---
title: "Practical SDR Tools & Workflows"
weight: 60
---

# Practical SDR Tools & Workflows

Having SDR hardware is only half the story. The software is where you actually tune, demodulate, record, and analyze signals. The SDR software ecosystem ranges from polished, beginner-friendly applications to powerful but demanding signal processing frameworks. Knowing which tool to reach for — and how to use it effectively — makes the difference between staring at noise and actually decoding signals.

## SDR# (SDRSharp)

SDR# is the most popular SDR application for Windows and is the default recommendation for RTL-SDR users. It provides a real-time spectrum display, waterfall plot, and built-in demodulators for AM, FM (narrow and wide), SSB (USB/LSB), CW, and raw I/Q.

**Strengths:** Easy to set up with RTL-SDR, responsive UI, large plugin ecosystem (frequency scanner, digital noise reduction, satellite tracker), good documentation and community support.

**Weaknesses:** Windows only. Closed source. The plugin architecture means some features require third-party additions. Not suitable for signal processing development or custom demodulation.

**Typical use:** First SDR software for beginners. FM broadcast listening, amateur radio monitoring, scanning for signals, quick spectrum analysis.

## GQRX

GQRX is a simple, open-source SDR application for Linux and macOS. It uses GNU Radio under the hood but presents a clean, straightforward interface with spectrum display, waterfall, and standard demodulators.

**Strengths:** Cross-platform (Linux, macOS). Open source. Simple and reliable. Supports a wide range of SDR hardware through the SoapySDR and OsmoSDR libraries.

**Weaknesses:** Fewer features than SDR#. No plugin system. Limited to basic demodulation modes. Occasional issues with hardware support depending on OS version and driver configuration.

**Typical use:** Quick spectrum browsing on Linux/Mac. Listening to known signals. Checking antenna performance. A lightweight alternative when you do not need GNU Radio's full power.

## SDR++

SDR++ is a modern, cross-platform SDR application that runs on Windows, Linux, macOS, and even Android. It has a clean, responsive UI with spectrum and waterfall displays, multiple demodulator modules, and support for a wide range of hardware.

**Strengths:** Cross-platform with consistent experience. Modern UI that is fast even on modest hardware. Active development with frequent updates. Modular architecture — demodulators and sources are loadable modules. Supports network-connected SDR hardware (remote operation).

**Weaknesses:** Younger project than SDR# or GQRX, so some features are still developing. Plugin ecosystem is smaller than SDR#.

**Typical use:** General-purpose SDR application on any platform. Good balance between simplicity and capability.

## CubicSDR

CubicSDR is a cross-platform SDR application focused on simplicity. It provides a clean waterfall display and supports AM, FM, and SSB demodulation. Uses the SoapySDR library for hardware support.

**Strengths:** Very simple to use. Cross-platform. Clean visual design.

**Weaknesses:** Limited demodulation options. Fewer features than SDR# or SDR++. Less actively maintained.

**Typical use:** Quick demonstrations. Situations where simplicity is more important than features.

## GNU Radio

GNU Radio is not an SDR application — it is a signal processing framework. You build signal processing chains by connecting blocks in a flowgraph, either graphically (using GNU Radio Companion) or programmatically in Python. It is the most powerful and flexible tool in the SDR ecosystem.

**Strengths:** Unlimited flexibility — if you can describe the signal processing mathematically, you can build it in GNU Radio. Supports custom demodulation, modulation, filtering, and analysis. Used extensively in academic research, amateur radio, and industry. Large library of existing blocks for common operations.

**Weaknesses:** Steep learning curve. Debugging flowgraphs is non-trivial — data flow issues, sample rate mismatches, and buffer overflows are common problems for beginners. The GUI (GNU Radio Companion) is functional but dated. Performance depends on properly configuring sample rates and buffer sizes.

**Typical use:** Custom demodulation of non-standard signals. Digital communications research. Building complete radio systems in software. Processing recorded I/Q data with custom algorithms.

## Common Workflows

### Tuning to a Known Frequency

1. Launch your SDR application and select your hardware
2. Set the center frequency near the signal of interest
3. Adjust the bandwidth and gain settings
4. Select the appropriate demodulation mode (AM, FM, SSB)
5. Fine-tune the frequency and bandwidth until the signal is clear

**Tips:** Start with maximum bandwidth to see the surrounding spectrum, then narrow down. Adjust gain to maximize signal without introducing distortion — watch for clipping indicators or a rising noise floor that indicates front-end overload.

### Scanning for Unknown Signals

1. Set a wide bandwidth and tune slowly across a band of interest
2. Watch the waterfall display — signals appear as bright lines or patterns
3. When you see a signal, click on it to tune and listen
4. Identify the modulation by its appearance on the waterfall:
   - **Constant-width carrier:** AM or CW
   - **Wide, constant signal:** FM broadcast (200 kHz)
   - **Narrow, constant signal:** NFM (12.5 or 25 kHz)
   - **Pulsed or bursty:** Digital, pager, or intermittent transmission
   - **Spread, noise-like:** Spread spectrum or digital modulation

### Recording and Playback

Most SDR applications can record raw I/Q data to a file. This captures everything within the SDR's bandwidth at full fidelity — you can tune to different signals, change demodulation mode, and adjust filters after the fact.

**Recording workflow:**
1. Set center frequency and bandwidth to cover the signals of interest
2. Start recording (usually a button or menu option)
3. Record for the desired duration
4. Stop recording — the file contains the raw I/Q samples

**Playback workflow:**
1. Open the recorded file in an SDR application or analysis tool
2. Process it exactly as you would a live signal
3. Advantage: you can replay the same data with different settings, share it with others, or process it with tools that run slower than real time

**File sizes:** At 2.4 MSPS with 8-bit I/Q, the data rate is about 4.8 MB/s (17 GB/hr). At 20 MSPS with 16-bit I/Q, it is 80 MB/s (288 GB/hr). Plan storage accordingly.

Common I/Q file formats:
- `.raw` / `.iq` — raw interleaved I/Q samples (no header)
- `.wav` — WAV audio file with I/Q data as stereo channels
- `.sigmf` — SigMF (Signal Metadata Format) — includes metadata about sample rate, frequency, and data type

### Spectrum Analysis with SDR

An SDR can function as a basic spectrum analyzer, with important caveats:

**What it does well:** Shows signal presence, relative signal strength, modulation characteristics, and frequency. Excellent for identifying what is on the air, checking antenna performance qualitatively, and observing the RF environment.

**What it does poorly:** Absolute power measurement (SDR amplitude accuracy is typically +/- 5-10 dB without calibration), dynamic range (limited by ADC bits), frequency accuracy (depends on oscillator quality), and bandwidth (limited to the SDR's instantaneous bandwidth).

For general exploration and learning, SDR spectrum analysis is invaluable. For compliance testing, calibrated measurements, or situations requiring absolute accuracy, a real spectrum analyzer is necessary.

## Specialized Decoding Tools

Beyond general SDR applications, several tools decode specific protocols:

- **dump1090 / tar1090:** ADS-B aircraft transponder decoding (1090 MHz). Shows aircraft positions on a map in real time. Works with RTL-SDR out of the box.
- **rtl_433:** Decodes hundreds of ISM band devices — weather stations, tire pressure monitors, door sensors, thermometers — at 433 MHz and 915 MHz.
- **WXtoImg / SatDump:** Decode weather satellite imagery from NOAA APT (137 MHz) and Meteor-M LRPT satellites.
- **multimon-ng:** Decodes POCSAG pager messages, AFSK, DTMF, and other common protocols from audio or I/Q input.
- **Direwolf:** APRS (Automatic Packet Reporting System) decoding for amateur radio position and messaging.
- **inspectrum:** Offline I/Q file analysis tool that displays I/Q data as a waterfall with measurement cursors. Good for reverse-engineering unknown signals.

## Gotchas

- **Start simple** — SDR# or SDR++ with an RTL-SDR receiving FM broadcast is the right first step. Do not start with GNU Radio unless you already have signal processing experience. Build confidence with easy signals before tackling difficult ones.
- **Gain settings matter more than software choice** — An overloaded front end produces garbage regardless of which application you use. Learn to set gain properly before blaming the software for poor reception.
- **Waterfall speed affects what you see** — A fast waterfall update rate shows short-duration signals but uses more CPU. A slow update rate averages signals and may miss brief transmissions. Adjust the FFT size and update rate for the type of signal you are looking for.
- **CPU matters for SDR** — Real-time spectrum display and demodulation at high sample rates requires significant CPU. An older laptop may struggle with 20 MSPS processing in GNU Radio. Start with lower sample rates and increase as your hardware allows.
- **I/Q file formats are not standardized** — Different tools produce and expect different file formats (sample type, byte order, interleaving). Getting the format wrong produces noise. Always document or use SigMF metadata for recorded files.
- **SDR is not a calibrated instrument** — The amplitude displayed on the spectrum is relative, not absolute. Two signals that appear the same height on the waterfall may differ by several dB in actual power. For quantitative measurements, use a calibrated spectrum analyzer or apply known calibration correction factors.
