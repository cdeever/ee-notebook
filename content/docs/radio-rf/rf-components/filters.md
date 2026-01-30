---
title: "RF Filters"
weight: 40
---

# RF Filters

Filters select the wanted signal and reject everything else. In an RF system, filters appear everywhere — before the LNA to reject out-of-band signals, after the mixer to select the IF, in the transmit chain to suppress harmonics, and between stages to prevent spurious signals from propagating. The choice of filter technology depends on the frequency, required selectivity, insertion loss budget, size, and cost.

## LC Filters

The simplest RF filters are built from discrete inductors and capacitors. They are tunable (by changing component values), available at any frequency, and easy to prototype on a bench.

**Advantages:**
- Tunable — swap components to adjust center frequency or bandwidth
- Any frequency from kHz to low GHz
- Low cost, standard components
- Easy to prototype and modify

**Limitations:**
- Component Q limits filter Q and selectivity (typical component Q: 30-100 at UHF)
- Insertion loss: 1-3 dB for simple filters, higher for complex filters with many stages
- Physical size increases at lower frequencies (larger inductors)
- Performance degrades above 2-3 GHz as parasitic effects dominate

LC filter topologies — Butterworth (maximally flat passband), Chebyshev (steeper rolloff, ripple in passband), and elliptic (steepest rolloff, ripple in both passband and stopband) — apply at RF just as they do at lower frequencies. The difference is that component parasitics limit how many stages are practical and how close the realized response matches the theoretical.

For prototyping at VHF/UHF frequencies, a 3-element bandpass filter (one inductor, two capacitors, or vice versa) is often the starting point. It provides moderate selectivity with low loss and is easy to tune on the bench.

## Crystal Filters

Quartz crystal resonators have extremely high Q — ranging from 10,000 to over 100,000. This makes crystal filters the standard choice for narrow-bandwidth IF filtering in communications receivers.

**Characteristics:**
- Center frequency: typically 455 kHz, 10.7 MHz, 21.4 MHz, 45 MHz, or other standard IFs
- Bandwidth: 200 Hz to 30 kHz (SSB, CW, AM bandwidths)
- Insertion loss: 2-6 dB
- Shape factor (ratio of -60 dB bandwidth to -6 dB bandwidth): 1.5 to 3.0
- Fixed frequency — not tunable

Crystal filters are built from multiple crystal resonators in a ladder or lattice configuration. More crystals mean steeper skirts and better shape factor but higher insertion loss. A 4-pole crystal filter (4 crystals) is common for SSB receivers; an 8-pole filter provides very steep skirts for CW operation.

The limitation is frequency range — practical crystal filters work from about 100 kHz to 200 MHz. Above that, crystal resonators become too thin to manufacture reliably.

## SAW Filters (Surface Acoustic Wave)

SAW filters convert electrical signals to acoustic waves on a piezoelectric substrate, filter them using interdigital transducers, and convert back. They offer moderate Q in a very small package.

**Characteristics:**
- Frequency range: 50 MHz to 3 GHz
- Bandwidth: 0.1% to 50% of center frequency
- Insertion loss: 1-5 dB (bandpass), lower for well-designed parts
- Size: 3 x 3 mm to 7 x 5 mm packages (SMD)
- Fixed frequency, not tunable
- Temperature stability: moderate (varies with substrate material)

SAW filters are widely used as IF filters and RF front-end filters in consumer radios (WiFi, Bluetooth, GPS, cellular). They are compact, inexpensive in volume, and available as standard parts for common frequencies.

Common SAW filter applications:
- 915 MHz ISM band: select the desired band, reject out-of-band signals
- 2.4 GHz WiFi/Bluetooth: front-end filtering before the LNA
- GPS at 1575.42 MHz: narrow bandpass to select the GPS signal

## Ceramic Filters

Ceramic filters use piezoelectric ceramic resonators and sit between LC filters and crystal filters in performance.

**Characteristics:**
- Frequency range: 100 kHz to 60 MHz (typical)
- Q: 200-2000 (much higher than LC, much lower than crystal)
- Bandwidth: wider than crystal filters for the same center frequency
- Insertion loss: 2-6 dB
- Size: larger than SAW, smaller than crystal ladder filters
- Cost: lower than crystal filters

Ceramic filters at 455 kHz and 10.7 MHz are the standard IF filters in inexpensive AM and FM radios. They provide adequate selectivity for broadcast reception without the cost or size of crystal filters.

## BAW / FBAR Filters (Bulk Acoustic Wave)

BAW filters, including Film Bulk Acoustic Resonator (FBAR) technology, use acoustic resonance in thin piezoelectric films deposited on a semiconductor substrate. They are the enabling technology for modern smartphones and compact RF front ends.

**Characteristics:**
- Frequency range: 500 MHz to 6+ GHz
- Q: 500-2000 (better than SAW at high frequency)
- Insertion loss: 1-3 dB
- Size: very compact (2 x 2 mm or smaller)
- Power handling: moderate to high
- Fixed frequency, not tunable

BAW/FBAR filters outperform SAW above about 2 GHz, where SAW insertion loss and temperature stability degrade. They are standard in cellular and WiFi front-end modules, handling the demanding requirements of modern frequency bands (tight passband, steep rejection of nearby bands).

## Filter Comparison Table

| Type | Frequency Range | Q | Size | Insertion Loss | Tunable | Cost |
|------|----------------|---|------|----------------|---------|------|
| LC (discrete) | kHz - 3 GHz | 20-100 | Large | 1-3 dB | Yes | Low |
| Crystal | 100 kHz - 200 MHz | 10k-100k | Medium | 2-6 dB | No | Medium |
| Ceramic | 100 kHz - 60 MHz | 200-2000 | Medium | 2-6 dB | No | Low |
| SAW | 50 MHz - 3 GHz | 500-2000 | Small | 1-5 dB | No | Low-Med |
| BAW/FBAR | 500 MHz - 6 GHz | 500-2000 | Very small | 1-3 dB | No | Medium |
| Cavity/waveguide | 500 MHz - 100 GHz | 5k-50k | Very large | 0.1-1 dB | Mech. | High |

## Filter Specifications Explained

**Insertion loss:** The loss in signal power from input to output at the center of the passband. Lower is better. Every dB of insertion loss before the LNA directly degrades receiver sensitivity.

**Bandwidth:** The frequency range between the -3 dB points (or sometimes -1 dB points for tighter specifications). Can be expressed as an absolute value (e.g., 20 MHz) or as a percentage of center frequency (e.g., 2%).

**Shape factor:** The ratio of the stopband bandwidth to the passband bandwidth, measured at two different attenuation levels (e.g., -60 dB / -6 dB bandwidth ratio). A shape factor of 1.0 would be a perfect brick wall. Practical values range from 1.2 (exceptional) to 5.0 (poor). Crystal filters achieve 1.5-2.0; LC filters are typically 3.0-5.0.

**Rejection (stopband attenuation):** How much the filter attenuates signals outside the passband. Specified in dB at a given frequency offset. For example, "40 dB rejection at +/- 50 MHz from center."

**Group delay:** The time delay through the filter as a function of frequency. Non-constant group delay distorts the signal. Bessel filters have the flattest group delay; Chebyshev and elliptic filters have more group delay variation near the passband edges.

**Termination impedance:** Most RF filters are designed for 50-ohm source and load impedance. If the actual impedance differs from the design impedance, the filter response changes — the passband ripple increases, the center frequency shifts, and the rejection degrades. This is a common problem when connecting filters between stages that are not exactly 50 ohms.

## Gotchas

- **Termination impedance must match the filter's design impedance** — A SAW filter designed for 50 ohms that sees 75 ohms will have degraded passband flatness and rejection. Check the datasheet and match accordingly.
- **Insertion loss before the LNA costs sensitivity, dB for dB** — A 2 dB filter loss before the LNA degrades the receiver noise figure by 2 dB. This is the most expensive loss in the system. Use the lowest-loss filter you can find for the antenna-to-LNA path.
- **Filter passband ripple creates gain variation** — A filter with 1 dB of passband ripple means the signal at the passband edge is 1 dB weaker than at center. In a receiver, this appears as sensitivity variation across the channel.
- **LC filter performance is limited by component Q** — A theoretically perfect 5-pole Chebyshev filter loses its steep skirts when built with Q=30 inductors. Simulate with realistic Q values, not ideal components.
- **SAW and BAW filters are not interchangeable even at the same frequency** — Different parts have different impedances, bandwidths, and PCB layout requirements. Always follow the datasheet layout recommendations.
- **Filter return loss affects the stages connected to it** — A filter with poor input return loss reflects energy back to the driving amplifier, potentially causing instability. Check S11 as well as S21.
