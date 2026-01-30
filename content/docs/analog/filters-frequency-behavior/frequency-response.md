---
title: "Frequency Response"
weight: 30
---

# Frequency Response

Every analog circuit has a frequency response — how its gain and phase change with frequency. Even circuits that aren't designed as filters have bandwidth limits, resonances, and roll-off characteristics that determine how they handle signals. Understanding frequency response is understanding what your circuit actually does to a signal across its entire operating range.

## Gain vs. Frequency

The magnitude response shows how much gain (or attenuation) the circuit provides at each frequency.

**Key features:**
- **Passband** — The frequency range where gain is approximately flat (within some tolerance, like ±3 dB)
- **Cutoff frequency (f_c or f_3dB)** — Where gain has dropped 3 dB from the passband level. This is the conventional boundary of "useful" bandwidth
- **Roll-off rate** — How fast gain decreases outside the passband. Measured in dB/decade or dB/octave. First-order = -20 dB/decade. Second-order = -40 dB/decade. Each additional pole adds another -20 dB/decade
- **Stopband** — The frequency range where the circuit provides significant attenuation
- **Gain peaking** — An unintended rise in gain near the cutoff frequency, caused by underdamped poles (Q > 0.707 for second-order systems). A warning sign for potential instability

## Phase vs. Frequency

The phase response shows how much the circuit delays the signal (in terms of phase angle) at each frequency.

**Key features:**
- Each pole contributes up to -90 degrees of phase shift. A first-order system can shift 0 to -90 degrees. A second-order system: 0 to -180 degrees
- Each zero contributes up to +90 degrees
- At the cutoff frequency of a first-order system, the phase shift is -45 degrees
- Phase shift is cumulative through cascaded stages

**Why phase matters:**
- In feedback systems, excessive phase shift at the crossover frequency (where loop gain = 1) causes oscillation. This is the stability criterion — see [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}})
- Phase distortion (non-constant group delay) distorts waveforms even without any amplitude distortion. Bessel filters minimize this; Chebyshev filters are worst
- In audio, phase shifts between channels create spatial distortion

## Bode Plots

The standard visualization of frequency response: gain (in dB) and phase (in degrees) plotted against frequency on a logarithmic scale.

**Reading a Bode plot:**

- Flat horizontal line = constant gain. The circuit is in its passband
- Downward slope of -20 dB/decade = one pole dominating. Single RC roll-off
- Downward slope of -40 dB/decade = two poles. Second-order roll-off
- Upward slope = a zero providing gain that increases with frequency
- A peak in the magnitude plot = resonance or underdamped poles. The height of the peak indicates Q

**Sketching approximate Bode plots by hand:**

For many circuits, you can sketch a reasonable Bode plot by identifying poles and zeros:

1. At each pole frequency, the slope changes by -20 dB/decade
2. At each zero frequency, the slope changes by +20 dB/decade
3. Connect the segments with straight lines (asymptotic approximation)
4. The actual curve is -3 dB from the asymptote at each break frequency

This asymptotic approximation is surprisingly useful for quick analysis and sanity-checking simulation results.

## Bandwidth

**-3 dB bandwidth** is the standard measure: the frequency range over which gain stays within 3 dB of the maximum. For a low-pass system, bandwidth extends from DC to f_3dB.

**Gain-bandwidth product (GBW):** For most amplifiers, the product of gain and bandwidth is approximately constant. An amplifier with GBW = 10 MHz can provide gain of 100 up to 100 kHz, or gain of 10 up to 1 MHz. You can trade gain for bandwidth but the product stays fixed.

**Rise time and bandwidth:** For a first-order system, t_rise ≈ 0.35 / BW. An amplifier with 10 MHz bandwidth has a rise time of about 35 ns. This connects frequency-domain and time-domain behavior.

## Unintended Frequency Behavior

Circuits that aren't designed as filters still have frequency-dependent behavior:

- **Amplifier bandwidth** — Every amplifier rolls off at some frequency. The open-loop gain of an op-amp drops at 20 dB/decade above its dominant pole (often a few Hz)
- **Parasitic resonances** — Stray capacitance and lead inductance create unintended LC resonances. A decoupling capacitor plus its trace inductance forms a series resonant circuit that can amplify noise at the resonant frequency
- **Cable capacitance** — A cable driving a high-impedance input forms an RC low-pass filter. A 100 pF/meter cable at 3 meters into a 10 kohm load has a cutoff around 50 kHz
- **Power supply impedance** — The output impedance of a power supply rises with frequency (the regulation loop has finite bandwidth). Above the loop bandwidth, supply impedance may resonate with decoupling capacitors

## Measuring Frequency Response

**Swept sine (network analyzer or Bode plot analyzer):**
- Apply a sine wave at each frequency, measure output amplitude and phase
- The gold standard for accurate frequency response measurement
- Can be done manually with a signal generator and oscilloscope, but it's tedious

**Step response (oscilloscope):**
- Apply a square wave and observe the output
- Overshoot indicates gain peaking. Ringing indicates underdamped resonance. Slow rise time indicates limited bandwidth
- Quick and qualitative, but doesn't give you precise dB values at each frequency

**Noise injection:**
- Inject broadband noise and compare input to output spectrum (FFT)
- Gives the full frequency response in one measurement
- Requires an FFT or spectrum analyzer and more setup

## Gotchas

- **-3 dB is not "half"** — -3 dB is half power, but it's 70.7% of voltage amplitude. -6 dB is half voltage amplitude. The distinction matters when you're specifying requirements
- **Gain-bandwidth product assumes single-pole roll-off** — For amplifiers with more complex frequency responses (multiple poles, zeros), GBW is an approximation. Some amplifiers have gain-dependent bandwidth that doesn't follow a simple GBW rule
- **Measuring bandwidth requires the right instrument bandwidth** — Your oscilloscope or probe must have significantly more bandwidth than what you're measuring (at least 3-5x). A 100 MHz scope measuring a 50 MHz signal shows a -3 dB error from the scope itself
- **Phase margin is hard to measure directly** — In a closed-loop system, you can't easily inject a signal into the feedback loop without breaking it. Loop-breaking techniques (like Middlebrook's method) exist but require careful setup
- **Frequency response changes with operating point** — A transistor amplifier's bandwidth depends on its bias current. An op-amp's bandwidth depends on its closed-loop gain. The frequency response you measure at one operating point may not apply at another
