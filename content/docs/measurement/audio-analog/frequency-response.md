---
title: "Is the Frequency Response Flat Where It Should Be?"
weight: 20
---

# Is the Frequency Response Flat Where It Should Be?

Swept or stepped frequency response measurements. An amplifier down 3 dB at 5 kHz, a filter with wrong cutoff frequency, a speaker crossover 6 dB off at the crossover point — frequency response reveals whether the signal chain treats all frequencies as the design intended.

## Swept Response Measurement

Connect the generator to the circuit input, scope CH1 to the input, CH2 to the output. Set the generator to a sine wave at a mid-band frequency known to be in the passband. Record the output amplitude — this is the 0 dB reference.

Step the frequency through the range of interest. For audio: 20 Hz, 50 Hz, 100 Hz, 200 Hz, 500 Hz, 1 kHz, 2 kHz, 5 kHz, 10 kHz, 20 kHz. At each step, record output amplitude.

**Gain (dB) = 20 × log10(V_out / V_out_ref)**

The -3 dB frequency is where output drops to 70.7% of reference.

| Gain relative to passband | dB |
|---------------------------|-----|
| 100% (passband) | 0 dB |
| 70.7% (-3 dB point) | -3 dB |
| 50% | -6 dB |
| 10% | -20 dB |

| Frequency response | Verdict |
|--------------------|---------|
| All points within ±0.5 dB | Flat — excellent for audio |
| All points within ±1 dB | Mostly flat — acceptable for most applications |
| All points within ±3 dB | Nominally flat — ±3 dB points define bandwidth |
| More than ±3 dB variation | Not flat — intentional (filter/EQ) or a problem |

## Audio Analyzer Automated Sweep

Dedicated audio analyzers automate the measurement — they generate a sine sweep and measure output amplitude at each frequency. Results include a plotted frequency response curve with ±0.1 dB accuracy.

Advantages over manual scope measurement: automated sweep with hundreds of points in seconds, better amplitude accuracy, built-in distortion and noise measurements.

## Speaker and Crossover Measurement

**Electrical crossover measurement:** Feed a swept sine into the crossover input. Measure the output of each section (high-pass, low-pass, band-pass). The crossover frequency is where outputs are equal.

**Acoustic measurement:** Position a measurement microphone at a fixed distance from the speaker. Feed swept sine or pink noise. Record microphone output and analyze frequency response. Room reflections dominate acoustic measurements — use near-field measurement or anechoic space.

## Phase Response

Frequency response has two parts — amplitude and phase. Phase matters for feedback loop stability, audio crossover alignment, and sensor signal conditioning.

Measure phase with two-channel scope: CH1 on input, CH2 on output. At each frequency, measure time delay between zero crossings.

**Phase (degrees) = (time_delay / period) × 360°**

## Tips

- Keep input amplitude constant across the sweep — some generators' output varies with frequency
- Monitor CH1 (input) and use the ratio V_out/V_in rather than absolute V_out
- Don't overdrive the circuit at any frequency — set input level so output stays in linear range

## Caveats

- Source impedance and load impedance affect the response — measure with actual source and load
- At high frequencies, cable capacitance and probe loading affect measurement
- Audio analyzers typically cover 20 Hz–20 kHz — for RF or wideband, use scope method
- Microphone calibration matters for acoustic measurements — cheap microphones have their own frequency response
- Phase wraps at ±180° — be careful with interpretation near boundaries

## Bench Relevance

- Frequency response down at low frequencies indicates coupling capacitor too small or high-pass filtering
- Frequency response down at high frequencies indicates parasitic capacitance, cable loading, or intentional low-pass filtering
- Peaks or dips in passband indicate resonance or impedance mismatch
- Rolloff slope reveals filter order — first-order = -20 dB/decade, second-order = -40 dB/decade
- Response that varies with load indicates output impedance issue — check if actual load matches design assumptions
