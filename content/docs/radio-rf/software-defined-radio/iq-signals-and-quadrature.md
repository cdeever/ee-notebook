---
title: "I/Q Signals & Quadrature"
weight: 20
---

# I/Q Signals & Quadrature

Every modern radio — SDR or otherwise — relies on I/Q signal processing at some level. The idea is deceptively simple: represent a radio signal as two components 90 degrees apart, and you capture both amplitude and phase in a way that makes all subsequent processing elegant and general. Understanding I/Q is not optional for working with SDR — it is the fundamental data format that everything else builds on.

## Why Two Signals?

Consider a single sine wave at a fixed frequency. If you sample it with a single ADC, you get a real-valued signal. This real signal contains amplitude information (how strong is it?), but it has an ambiguity: you cannot distinguish a signal that is slightly above the center frequency from one that is slightly below. Mathematically, a real-valued signal has symmetric positive and negative frequency content — the positive and negative frequency components are mirror images and cannot be separated.

This is a problem for radio. When you tune to a center frequency and look at a band of spectrum around it, you want to distinguish signals above the center from signals below. A signal at +10 kHz offset (above center) is a different station than one at -10 kHz (below center). With only a real-valued signal, these two are indistinguishable.

The solution is to capture two versions of the signal that are 90 degrees apart in phase. Together, these two components — called I (In-phase) and Q (Quadrature) — form a complex-valued signal that has distinct positive and negative frequencies. The ambiguity disappears.

## I and Q Defined

In a quadrature receiver, the incoming RF signal is multiplied by two copies of the local oscillator signal:

- **I (In-phase):** The RF signal multiplied by cos(2*pi*f_LO*t). This is the "reference" component — in phase with the local oscillator.
- **Q (Quadrature):** The RF signal multiplied by sin(2*pi*f_LO*t). This is the component 90 degrees behind the local oscillator.

After low-pass filtering to remove the sum-frequency products, you are left with two baseband signals that together represent the original RF signal as a complex number:

**s(t) = I(t) + j * Q(t)**

At each sample instant, I and Q together define a point in the complex plane. The magnitude sqrt(I^2 + Q^2) gives the instantaneous amplitude. The angle atan2(Q, I) gives the instantaneous phase. The rate of change of that angle gives the instantaneous frequency.

This complex representation is the native data format of SDR. When you record an I/Q file, you are recording a stream of complex samples — pairs of numbers, one I and one Q, for each time step.

## Visualizing I/Q

**Time domain:** Plot I and Q as two separate waveforms versus time. For an AM signal, both I and Q vary in amplitude together. For an FM signal, I and Q form sinusoids whose frequency changes with the modulation.

**Complex plane (I/Q plane):** Plot each sample as a point with I on the horizontal axis and Q on the vertical axis. An unmodulated carrier appears as a single point rotating around the origin at the offset frequency. AM appears as a point that moves radially (in and out from the origin). FM appears as a point moving around the origin at a varying rate.

**Constellation diagram:** For digital modulation, each symbol maps to a specific point in the I/Q plane. QPSK has 4 points (one in each quadrant). 16-QAM has 16 points in a grid pattern. 64-QAM has 64 points. The constellation diagram shows where the samples cluster — tight clusters mean a clean signal; spread-out clusters mean noise, interference, or distortion.

| Modulation | I/Q Plane Appearance |
|-----------|---------------------|
| Unmodulated carrier | Single point (or circle if offset) |
| AM | Point moves radially |
| FM | Point circles at varying rate |
| BPSK | Two points on horizontal axis |
| QPSK | Four points, one per quadrant |
| 16-QAM | 4x4 grid of points |
| 64-QAM | 8x8 grid of points |

## Quadrature Mixing in Hardware

The hardware that produces I and Q from an RF signal is called a quadrature mixer or quadrature demodulator. It contains:

1. A local oscillator at the desired center frequency
2. A 0-degree power splitter that feeds the LO to two paths
3. A 90-degree phase shifter on one LO path
4. Two mixers — one for I (using the 0-degree LO), one for Q (using the 90-degree LO)
5. Two low-pass filters to remove the sum-frequency products
6. Two ADCs to digitize the I and Q baseband signals

In practice, many SDR front-end chips integrate all of this into a single IC. The RTL-SDR's R820T tuner performs quadrature downconversion internally. Higher-end SDRs use dedicated quadrature demodulator ICs (like the ADL5380) or perform the mixing digitally after a high-speed ADC.

## I/Q Imbalance

In an ideal quadrature system, the I and Q paths are perfectly matched — identical gain and exactly 90 degrees of phase difference. Real hardware is never perfect:

**Gain imbalance:** The I path has slightly different gain than the Q path. If I has 1% more gain than Q, the complex signal is slightly distorted — the circle in the I/Q plane becomes an ellipse.

**Phase imbalance:** The phase difference between I and Q is not exactly 90 degrees. Even 1 degree of error creates a measurable effect.

**DC offset:** Each path may have a small DC bias, which appears as a spike at the center frequency in the spectrum display. This is the bright line you often see at the center of an SDR waterfall — it is an artifact, not a real signal.

The practical effect of I/Q imbalance is image artifacts. A signal at +10 kHz offset creates a ghost image at -10 kHz. In a perfect system, the image is infinitely suppressed. With 1 degree of phase imbalance and 1% gain imbalance, the image is only about 40 dB below the real signal. For an 8-bit SDR with ~48 dB dynamic range, this is within a few dB of the noise floor and barely noticeable. For a 16-bit SDR with ~96 dB range, 40 dB of image rejection is poor and software correction is essential.

Many SDR applications include I/Q correction features that calibrate out the imbalance by measuring the image response and applying a compensating transformation to the samples.

## I/Q in Digital Modulation

Digital communication systems map data bits to specific I/Q values:

**BPSK (Binary Phase Shift Keying):** Two constellation points — (+1, 0) and (-1, 0). Each symbol carries 1 bit. Robust, used for control channels and low-SNR situations.

**QPSK (Quadrature Phase Shift Keying):** Four points — (+1,+1), (+1,-1), (-1,+1), (-1,-1), normalized. Each symbol carries 2 bits. Used extensively in satellite communication, early LTE, and GPS.

**16-QAM:** 16 points in a 4x4 grid. Each symbol carries 4 bits. Used in WiFi and LTE for moderate SNR conditions.

**64-QAM:** 64 points in an 8x8 grid. Each symbol carries 6 bits. Requires good SNR (~26 dB). Used in WiFi and LTE for high-throughput conditions.

**256-QAM and beyond:** WiFi 6 uses 1024-QAM, packing 10 bits per symbol. This requires very high SNR (~35 dB) and extremely clean I/Q processing. Any I/Q imbalance, phase noise, or nonlinearity smears the constellation and causes errors.

The progression from BPSK to higher-order QAM is a direct tradeoff between spectral efficiency (bits per Hz) and required signal quality. Each doubling of constellation points adds 1 bit per symbol but requires roughly 3 dB more SNR.

## Why I/Q Matters for SDR Users

Even if you never design a quadrature mixer, I/Q understanding is essential because:

- **Every SDR produces I/Q data.** The file format, the display, and the processing all work in terms of I and Q samples. You cannot use SDR tools effectively without understanding what the numbers mean.
- **Bandwidth is defined by sample rate of I/Q pairs.** If your SDR samples at 2.4 MSPS (million samples per second) of I/Q data, you have 2.4 MHz of usable bandwidth — centered on the tuned frequency, extending 1.2 MHz above and below.
- **The center spike is an I/Q artifact.** That bright line in the middle of the waterfall is DC offset in the I/Q data, not a real signal. Knowing this prevents confusion and is the first thing to explain when someone new sees an SDR display.

## Gotchas

- **I/Q data is complex, so bandwidth equals sample rate** — This is different from real-valued sampling where bandwidth is half the sample rate (Nyquist). With I/Q, a 2.4 MSPS rate gives 2.4 MHz of bandwidth because the complex representation has no negative-frequency aliasing.
- **The center spike is not a signal** — The DC offset in the I/Q data creates a spurious signal at the tuned center frequency. Most SDR applications offer DC removal or allow you to offset the center frequency slightly so the spike does not obscure signals of interest.
- **I/Q imbalance creates mirror images** — If you see a weak mirror image of a strong signal on the opposite side of the center frequency, it is probably an I/Q imbalance artifact, not a real signal. Check by slightly retuning — the real signal moves smoothly, the artifact jumps.
- **Phase noise in the LO smears the I/Q data** — A noisy local oscillator adds phase uncertainty to every sample. This appears as a skirt of noise around every signal in the spectrum display. Cheap oscillators in inexpensive SDR hardware contribute visible phase noise.
- **Not all SDR software handles I/Q byte ordering the same way** — Some tools expect I first then Q; others expect interleaved or specific data types (8-bit unsigned, 16-bit signed, 32-bit float). Getting the format wrong produces noise or garbage. Check the documentation for your specific hardware and software combination.
- **Higher-order QAM is extremely sensitive to I/Q quality** — 256-QAM requires I/Q balance, phase noise, and linearity far beyond what inexpensive SDR hardware can provide. If constellation points look smeared, the problem may be hardware limitations rather than a poor signal.
