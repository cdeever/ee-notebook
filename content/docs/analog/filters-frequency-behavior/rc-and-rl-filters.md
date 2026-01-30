---
title: "RC & RL Filters"
weight: 10
---

# RC & RL Filters

The simplest frequency-selective circuits — a resistor and a reactive component. These are the building blocks of signal conditioning, power supply filtering, and bandwidth limiting. They're also the first place to build intuition about how signals behave in the frequency domain.

## Low-Pass Filters

### RC Low-Pass

R in series, C to ground. Passes low frequencies, attenuates high frequencies.

**Cutoff frequency:** f_c = 1 / (2 x pi x R x C)

At f_c, the output is -3 dB (70.7% of the input amplitude). Below f_c, the output follows the input. Above f_c, the output rolls off at -20 dB/decade (first-order slope).

**Time domain:** The step response is an exponential rise with time constant tau = RC. The filter smooths out fast edges and passes slow changes.

**Common uses:**
- Anti-aliasing before ADC (limit bandwidth to prevent aliased signals)
- Smoothing PWM output into a quasi-DC voltage
- Power supply ripple filtering
- Noise bandwidth limiting

### RL Low-Pass

L in series, R to ground (or the load is R). Same first-order behavior as RC.

**Cutoff frequency:** f_c = R / (2 x pi x L)

Less common than RC because inductors are larger, heavier, and more expensive than capacitors. Used primarily in power applications where the inductor is already present (switching regulator output) or where the low impedance of an inductor at DC is advantageous.

## High-Pass Filters

### RC High-Pass

C in series, R to ground. Passes high frequencies, attenuates low frequencies.

**Cutoff frequency:** f_c = 1 / (2 x pi x R x C) (same formula as low-pass)

Below f_c, the output rolls off at +20 dB/decade. Above f_c, the output follows the input.

**Time domain:** The step response is an exponential decay — the filter differentiates slow changes and passes fast ones. A step input produces a spike that decays with time constant tau = RC.

**Common uses:**
- AC coupling (blocking DC, passing signal). This is a high-pass filter whether you think of it that way or not
- Audio coupling between stages
- Removing DC offset before a measurement
- Tilt correction in pulse circuits

### AC Coupling Is a High-Pass Filter

Every AC coupling capacitor forms a high-pass filter with the impedance it sees. The -3 dB point is f_c = 1 / (2 x pi x C x R_load).

For audio: to pass down to 20 Hz into a 10 kohm load, you need C > 1 / (2 x pi x 20 x 10000) = 0.8 uF. A 1 uF cap is the standard choice.

The low-frequency roll-off causes droop on square waves and tilt on pulses. The coupling cap needs to be large enough that the droop is negligible at the lowest frequency of interest.

## Band-Pass Intuition

A high-pass filter followed by a low-pass filter (or vice versa) creates a band-pass response. The passband is between the two cutoff frequencies.

For this to work as expected, the two cutoff frequencies must be well separated (at least a decade apart). If they're close, the filters interact and the response is more complex than simple cascading suggests.

**Series RLC** circuits create a natural band-pass (or band-stop) response at the resonant frequency f_0 = 1 / (2 x pi x sqrt(L x C)). The Q factor (quality factor) determines how narrow the passband is: Q = (1/R) x sqrt(L/C). Higher Q = narrower passband = more selective.

## Impedance Perspective

A filter works because the impedance of the reactive component changes with frequency:

- **Capacitor:** Z_C = 1 / (2 x pi x f x C). Low impedance at high frequency, high impedance at low frequency
- **Inductor:** Z_L = 2 x pi x f x L. High impedance at high frequency, low impedance at low frequency

An RC low-pass filter is just a voltage divider where the bottom element (C) has frequency-dependent impedance. At low frequencies, Z_C is high, so most of the voltage appears across C (output is high). At high frequencies, Z_C is low, so most of the voltage drops across R (output is low).

This impedance-divider perspective connects directly to the [Voltage Dividers & Loading]({{< relref "/docs/fundamentals/circuit-analysis/voltage-dividers-and-loading" >}}) concept from Fundamentals — but with complex impedances instead of pure resistances.

## Cascading Filters

Two identical RC low-pass filters in series give -40 dB/decade roll-off (second-order), but the -3 dB point shifts to a lower frequency (about 0.64 x f_c of a single stage).

Important: you can only cascade without interaction if each stage doesn't load the previous one. If the second filter loads the first (because its input impedance is comparable to the first filter's output impedance), the combined response is not simply the product of the two individual responses.

Solutions:
- Buffer (op-amp follower) between stages
- Make each successive stage's impedance level much higher (10x) than the previous
- Use active filter designs that avoid this problem entirely

## Gotchas

- **Source impedance matters** — The filter's cutoff frequency depends on the total series resistance, including the source impedance. A 1 kohm filter driven by a 1 kohm source has an effective R of 2 kohm, halving the cutoff frequency
- **Load impedance matters** — The load appears in parallel with the filter's output element (C or R), changing the response. High-impedance loads have minimal effect; low-impedance loads shift the cutoff
- **Component tolerances** — A 10% capacitor tolerance means 10% cutoff frequency uncertainty. For precise filtering, use tight-tolerance components or active filters with gain-set feedback
- **Parasitic behavior** — At high frequencies, resistors become inductive and capacitors become inductive above their self-resonant frequency. A "low-pass" filter with a 100 nF ceramic cap stops being a low-pass above maybe 10-50 MHz depending on the package
- **Phase shift** — A first-order filter introduces up to 90 degrees of phase shift. At the cutoff frequency, the phase shift is 45 degrees. In feedback loops, this phase shift can affect stability
