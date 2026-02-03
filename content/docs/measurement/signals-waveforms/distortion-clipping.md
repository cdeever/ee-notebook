---
title: "Is This Stage Adding Distortion or Clipping?"
weight: 40
---

# Is This Stage Adding Distortion or Clipping?

Waveform integrity through amplifier stages, filters, and buffers. The signal is present and roughly the right shape — but is it clean? Soft clipping, crossover distortion, saturation, slew-rate limiting, and unexpected nonlinearity all show up here.

## Visual Distortion Check

Compare a stage's input and output. CH1 on the input, CH2 on the output, trigger on CH1. Adjust vertical scales so both waveforms are clearly visible, scaling the output by the expected gain. The output should be a clean, scaled (and possibly inverted) copy of the input.

| Symptom | Meaning |
|---------|---------|
| Flat tops or bottoms on output | Clipping — signal exceeds the stage's output swing, hitting supply rail or internal limit |
| Flat tops on positive half only (or negative only) | Asymmetric clipping — one side of the output stage is limiting. Bias issue, failed transistor, or asymmetric supply |
| Notch or step at zero crossing | Crossover distortion — class-B or class-AB output stage with insufficient bias current |
| Rounded edges on what should be sharp | Slew-rate limiting — the output stage can't change voltage fast enough |
| Waveshape changes with amplitude | Nonlinearity — small signals look clean, large signals get distorted |
| Ringing or oscillation on edges | Instability — the stage is borderline oscillating |

## Identifying Clipping

To confirm clipping, reduce the input signal amplitude. If the flat section disappears and the output shape returns to normal, the stage was clipping. The clipping level indicates the output voltage swing limit of the stage. Compare to the supply voltage — most op-amps clip 1–2V below the rail (unless rail-to-rail output).

## XY Mode Transfer Curve

For direct visualization of the input-to-output transfer function, use XY display mode with CH1 (X-axis) on the stage input and CH2 (Y-axis) on the stage output. Apply a sine wave or slowly varying signal at the input.

| Display shape | Meaning |
|--------------|---------|
| Straight diagonal line | Linear transfer — constant gain, no distortion |
| Diagonal line that flattens at the ends | Clipping — output saturates at extremes |
| S-curve | Compression/expansion — nonlinear but smooth |
| Flat region near center with diagonal sides | Crossover distortion — dead zone around zero |
| Ellipse (for sine-to-sine) | Phase shift between input and output (not distortion, just delay or filter effect) |

## FFT Harmonic Analysis

Apply a clean sine wave at the frequency of interest and capture the output. Run FFT and look for harmonics of the fundamental frequency. Second harmonic (2× fundamental) indicates asymmetric distortion. Third harmonic (3× fundamental) indicates symmetric distortion (clipping). Higher-order harmonics indicate harder clipping or crossover distortion.

| Harmonic pattern | Typical cause |
|-----------------|---------------|
| Strong 2nd harmonic | Asymmetric transfer curve — single-ended stage with uneven bias |
| Strong 3rd harmonic | Symmetric clipping — both halves limited equally |
| Many harmonics, slowly declining | Hard clipping — sharp corners spread energy across many harmonics |
| Strong odd harmonics (3rd, 5th, 7th) | Crossover distortion — zero-crossing step creates odd-harmonic content |

## Tips

- Use DC coupling when checking for clipping — AC coupling can make a clipped signal look non-clipped by shifting the DC level
- Ensure digital scope sample rate is at least 5× the signal frequency — aliasing can make a clean signal look distorted
- Use a low-distortion signal generator for THD measurements — distortion in the test signal shows up in the output and can't be distinguished from circuit distortion

## Caveats

- Probe-induced distortion can mimic circuit distortion — on high-impedance nodes, probe capacitance can round off edges and ring
- The input sine wave must be clean for FFT analysis — generator distortion can't be separated from circuit distortion
- FFT windowing affects results — use flat-top window for amplitude accuracy or Hann window for frequency resolution
- Most bench scopes can reliably measure THD down to about -50 to -60 dB (0.1–0.3%) — below that, the scope's distortion dominates
- Phase delay through the stage causes XY trace to open into an ellipse even with no distortion — this is normal for stages with frequency-dependent phase shift

## Bench Relevance

- Clipping on both positive and negative peaks indicates the stage is running out of headroom symmetrically — reduce input level or increase supply voltage
- Clipping on one side only indicates asymmetric bias or a failed component in one half of the output stage
- Crossover distortion audible in audio circuits even when not visually obvious — use FFT to detect odd harmonics
- Slew-rate limiting on a fast signal that should be clean indicates the op-amp or driver can't keep up — use a faster device or slow the signal
- Distortion that appears only at high amplitudes suggests the circuit is being overdriven — check gain structure for proper headroom
