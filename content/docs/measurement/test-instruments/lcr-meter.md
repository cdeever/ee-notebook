---
title: "LCR Meter / Component Tester"
weight: 60
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# LCR Meter / Component Tester

An LCR meter measures inductance (L), capacitance (C), and resistance (R) along with their associated loss factors — dissipation factor, quality factor, ESR, and impedance magnitude and phase. It is the instrument that answers "what is this component actually doing at the frequency my circuit operates?" rather than just "what is the nominal value?"

## What It Does

The meter applies an AC test signal at a selectable frequency and measures the complex impedance of the device under test. From the impedance (magnitude and phase angle), it calculates the equivalent circuit parameters: series or parallel resistance, reactance, capacitance or inductance, quality factor (Q), dissipation factor (D), and impedance magnitude (|Z|).

The key differentiator from a DMM is **frequency selection**. A DMM's capacitance mode tests at one fixed (often unspecified) frequency. An LCR meter lets you choose the test frequency — 100 Hz, 1 kHz, 10 kHz, 100 kHz, 1 MHz — so you can characterize the component at the frequency it actually operates in your circuit.

## Key Specs and What They Mean

| Spec | What it means | Why it matters |
|---|---|---|
| Test frequencies | Available frequencies for measurement (fixed spots or continuous range) | More frequencies enable characterization across the operating range. A cap that measures 10 µF at 1 kHz might measure 4 µF at 100 kHz due to dielectric rolloff |
| Basic accuracy | Error in impedance measurement, usually ±(% + conditions) | Determines how closely the reading matches reality. 0.1% is good for component characterization; 1% is adequate for sorting and screening |
| Measurement parameters | Which values the meter computes (L, C, R, Z, Q, D, ESR, θ, etc.) | More parameters = more complete picture. Q and D are essential for evaluating inductor and capacitor quality at frequency |
| Equivalent circuit mode | Series or parallel model selection | Real components do not behave as ideal L, C, or R. The meter calculates values assuming either a series or parallel equivalent. Series model is appropriate for low-impedance components (large caps, low-inductance coils); parallel model for high-impedance ones (small caps, high-inductance coils) |
| Test signal level | Voltage and current of the applied test signal | Must be low enough to avoid nonlinear behavior but high enough for good signal-to-noise. Some components (ferrite inductors, varistors, ceramic caps) are voltage-dependent — test level matters |
| Fixture and compensation | Kelvin (4-wire) connection, open/short compensation | Lead resistance and fixture parasitics add error. Kelvin sensing and open/short calibration remove these. Essential for measuring small values (<1Ω, <10 pF, <1 µH) |

## When DMM Capacitance Mode Is Not Enough

A DMM capacitance mode gives one number at one frequency. That is fine for checking whether a cap is roughly the right value. It is not enough when:

- **The component operates at a different frequency than the DMM tests at.** A Class II ceramic cap (X7R, X5R) loses significant capacitance at higher frequencies and with applied DC bias. The DMM says "10 µF" but at 100 kHz under 5V bias, it might be 3 µF.
- **You need Q or D.** Inductor quality factor matters for filters and resonant circuits. A DMM does not measure Q.
- **You need ESR at a specific frequency.** A dedicated ESR meter tests at one frequency (typically 100 kHz). An LCR meter lets you pick the frequency and also gives you the full impedance picture.
- **You are characterizing an unknown component.** Measuring impedance at several frequencies reveals whether the component is behaving as an inductor, a capacitor, or a complex impedance — and where its self-resonant frequency lies.

## Feature Tiers

| Tier | Typical specs | Good enough for | Not sufficient for |
|---|---|---|---|
| **Entry** (few fixed frequencies) | 100 Hz, 1 kHz, 10 kHz, 100 kHz; 1% accuracy; L, C, R, Q, D | Component verification, incoming inspection, sorting, confirming inductor and capacitor values | Frequency sweeps, high-accuracy characterization, impedance plots, very small or very large values |
| **Mid-range** (selectable frequencies, better accuracy) | 20 Hz–300 kHz continuous; 0.1% accuracy; Kelvin connection; programmable test levels | Component characterization, matching, filter design, evaluating temperature and voltage effects | RF-frequency impedance, sub-pF or sub-nH measurements, precision reference standards |
| **High-end** (wide frequency, high accuracy) | 20 Hz–2 MHz+; 0.05% accuracy; DC bias capability; sweep and plot; remote control | Full impedance characterization, self-resonant frequency identification, production test, material characterization | Microwave frequencies, on-wafer measurements (use an impedance analyzer or VNA) |

## Gotchas and Limits

- **Series vs parallel mode gives different numbers for the same component.** This is not an error — it is two different equivalent-circuit models of the same impedance. Use series mode for low-impedance components (ESR < ~10Ω, large caps, small inductors) and parallel mode for high-impedance components (ESR > ~10 kΩ, small caps, large inductors). At intermediate impedances, both models give similar results.
- **Test frequency changes the measured value.** This is real component behavior, not meter error. Inductors have frequency-dependent permeability. Capacitors have dielectric relaxation. Resistors have skin effect and parasitic reactance. If your reading changes with frequency, you are learning something about the component.
- **DC bias changes capacitance.** Class II ceramic capacitors (X7R, X5R, Y5V) lose significant capacitance under DC bias. A "10 µF" X5R cap may measure 4 µF with 5V across it. Basic LCR meters do not apply DC bias; you need a bias adapter or a meter with built-in DC bias to see this.
- **Open/short compensation is not optional for small values.** Fixture and lead parasitics are typically 0.1–1 pF and 10–50 mΩ. Measuring a 5 pF cap without open compensation gives a wildly wrong answer. Measuring a 20 mΩ ESR without short compensation is equally unreliable.
- **Component leads matter.** Measuring a cap on its radial leads gives different results than measuring the same cap soldered onto a PCB with different trace lengths. The leads add inductance and resistance. For precision work, minimize lead length and use consistent fixturing.

## Tips

- Always perform open/short compensation before measuring, especially for small values — it takes 30 seconds and eliminates the most common source of error
- When verifying capacitors for a specific circuit, test at the frequency closest to the circuit's operating frequency, not the default 1 kHz
- Compare series-model and parallel-model results: if they differ significantly, the component has substantial loss, and choosing the right model for your application matters
- For inductors used in filters or resonant circuits, measure Q at the operating frequency — two inductors with the same inductance but different Q behave very differently in a tuned circuit
- Use the meter to find the self-resonant frequency (SRF) of capacitors and inductors by sweeping frequency and watching where the impedance dips (for capacitors) or peaks (for inductors). Above SRF, a cap behaves as an inductor and vice versa

## Caveats

- **Accuracy degrades at the extremes of the range** — Measuring 0.5 pF on a meter rated for 0.1 pF minimum is at the edge of capability. Fixture parasitics and noise dominate. Similarly, measuring 100 H at low frequency pushes the high end
- **Some components are nonlinear** — Ferrite-core inductors change inductance with current level. Varistors and TVS diodes are voltage-dependent. If the LCR meter's small test signal gives a different value than the component sees in-circuit under real operating conditions, the in-circuit value is the one that matters
- **"Accuracy" includes more than the basic spec** — Temperature, humidity, warm-up time, and test signal level all affect accuracy. The headline spec (e.g., 0.1%) applies under specified conditions. Real-bench conditions may be worse
- **Winding resistance is not the same as ESR** — For inductors, the DC resistance measured by a DMM differs from the AC resistance (ESR) measured by an LCR meter at frequency, because the AC measurement includes skin effect and core losses. Both numbers are useful for different purposes

## In Practice

- When a filter circuit does not match simulation, measure the actual inductor and capacitor values at the filter's operating frequency — nominal values from the part marking may be far from actual values at frequency
- A capacitor that passes DMM testing but fails in-circuit may have acceptable capacitance but excessive ESR or reduced capacitance under DC bias — the LCR meter reveals what the DMM cannot
- If replacing a failed component with a "same value" substitute changes circuit behavior, the replacement may have a different Q, SRF, or DC bias characteristic. Characterize both parts at the operating frequency to find the difference
- Incoming inspection for critical components (precision filters, resonant circuits) benefits from LCR measurement at the operating frequency rather than relying on the part marking and the manufacturer's typical-value guarantee
