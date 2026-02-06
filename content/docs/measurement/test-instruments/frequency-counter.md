---
title: "Frequency Counter"
weight: 75
---

# Frequency Counter

A frequency counter measures the frequency of a periodic signal with higher accuracy than an oscilloscope's built-in frequency measurement. While a mid-range scope might measure frequency to 3–4 digits, a basic frequency counter provides 6–8 digits, and a lab-grade counter can reach 10–12 digits. For oscillator validation, clock debugging, and any application where "close enough" isn't good enough, a dedicated counter is the right tool.

## What It Does

A frequency counter measures:

- **Frequency:** How many cycles per second (Hz). The fundamental measurement.
- **Period:** Time for one cycle (1/frequency). More precise than frequency for low-frequency signals.
- **Ratio:** Frequency of one signal divided by another — useful for verifying frequency dividers and PLLs.
- **Time interval:** Time between edges on one or two channels — measures pulse width, duty cycle, and propagation delay.
- **Totalize:** Counts events over a gate time or indefinitely — useful for counting pulses, rotations, or other discrete events.

The core difference from an oscilloscope's frequency readout is the timebase. A counter uses a precision crystal oscillator (often TCXO or OCXO in better instruments) as its reference, while a scope's timebase is optimized for waveform display, not frequency accuracy. The scope tells you approximately what frequency; the counter tells you exactly what frequency.

## Key Specs and What They Mean

| Spec | What it means | Why it matters |
|---|---|---|
| Resolution (digits) | Number of significant figures in the reading | 8 digits resolves 1 Hz at 100 MHz (0.01 ppm). More digits = finer resolution |
| Accuracy | Error in the timebase, specified in ppm | A 1 ppm timebase has ±1 Hz error at 1 MHz, ±100 Hz error at 100 MHz. This is the floor — you can't measure more accurately than your reference |
| Frequency range | Maximum input frequency | Must exceed your signal frequency. 100 MHz covers most digital clocks; 1 GHz+ needed for RF work |
| Input sensitivity | Minimum signal amplitude for reliable counting | Matters for low-level signals. A counter that needs 100 mVpp won't count a 20 mVpp signal |
| Input impedance | 1 MΩ (high-Z) or 50 Ω | 50 Ω for RF and high-frequency work; 1 MΩ for general-purpose probing |
| Gate time | Measurement interval | Longer gate time = more resolution but slower updates. A 1-second gate gives 1 Hz resolution; a 10-second gate gives 0.1 Hz resolution |
| Timebase type | TCXO, OCXO, or basic crystal | TCXO: ±0.5–2 ppm. OCXO: ±0.01–0.1 ppm. Basic crystal: ±10–50 ppm. The timebase determines accuracy floor |
| External reference input | Allows locking to an external 10 MHz reference | Essential for calibration and for measurements requiring better than the internal timebase accuracy. GPS-disciplined references provide sub-ppb accuracy |

## Feature Tiers

| Tier | Typical specs | Good enough for | Not sufficient for |
|---|---|---|---|
| **Entry** (6–7 digits, basic timebase) | 100 MHz, ±5 ppm, 6-digit display | Verifying oscillators within spec, clock presence checks, hobbyist RF work | Precision crystal characterization, calibration work, sub-ppm measurements |
| **Mid-range** (8 digits, TCXO) | 200–350 MHz, ±0.5 ppm, 8-digit display, period/ratio | Oscillator validation, clock frequency verification, audio/RF debugging | Atomic reference work, OCXO characterization, production calibration |
| **Lab-grade** (10+ digits, OCXO) | 3–20 GHz, ±0.01 ppm or better, reciprocal counting, time interval | Precision frequency calibration, RF synthesizer verification, time/frequency standards | National metrology lab references (use GPS-disciplined or atomic standards) |

## Reciprocal Counting

Traditional counters count cycles during a fixed gate time. This works well at high frequencies — a 1-second gate gives 1 Hz resolution regardless of input frequency. But at low frequencies, you wait a long time for enough cycles to count.

Reciprocal counters measure period precisely and compute frequency from 1/period. This gives high resolution at any frequency without long gate times. A reciprocal counter with a 100 MHz timebase achieves 8-digit resolution in 1 second at both 10 Hz and 10 MHz. Most modern counters use reciprocal counting.

## Timebase Hierarchy

The counter's accuracy is limited by its timebase. From worst to best:

| Timebase type | Typical accuracy | Stability | Warm-up | Notes |
|---|---|---|---|---|
| Basic crystal (XO) | ±10–50 ppm | Poor (drifts with temperature) | Seconds | Fine for ±0.01% verification |
| Temperature-compensated (TCXO) | ±0.5–2 ppm | Good | Minutes | Standard for bench counters |
| Oven-controlled (OCXO) | ±0.01–0.1 ppm | Excellent | 5–30 minutes | Required for precision work |
| GPS-disciplined (GPSDO) | ±0.001 ppb | Excellent (long-term) | Minutes (lock time) | Transfers atomic standard accuracy |
| Rubidium/Cesium | ±0.0001 ppb or better | Excellent | Varies | Primary standards |

For most bench work, a TCXO is adequate. For calibration or production test, OCXO or GPS disciplining is worth the cost.

## Gotchas and Limits

- **Timebase warm-up:** OCXO timebases need 15–30 minutes to stabilize. Measurements made during warm-up may drift by several ppm. Wait for the warm-up indicator (if present) or allow adequate time.
- **Trigger level:** The counter triggers on signal crossings of a threshold. Noisy signals may trigger multiple times per cycle (false counts). Adjust trigger level and use low-pass filtering if available.
- **Input coupling:** DC coupling includes any DC offset; AC coupling blocks DC but has a low-frequency limit. For signals below ~10 Hz, DC coupling may be necessary.
- **High-frequency input path:** Signals above ~100 MHz typically require the 50 Ω input for proper impedance match. Using the 1 MΩ input at high frequency causes reflections and false readings.
- **Prescaling:** Some counters use prescalers to extend frequency range but lose resolution in the prescaled range (dividing by 8 costs 3 bits of resolution). Check whether your counter's high-frequency range uses prescaling.

## Tips

- For best accuracy, let the counter warm up before making precision measurements — even TCXO timebases stabilize over 10–15 minutes
- Use the longest gate time practical for maximum resolution — a 10-second gate gives 10× more resolution than a 1-second gate
- When measuring a crystal oscillator, compare against the counter's timebase — if the crystal is supposed to be 8.000000 MHz and reads 8.000047 MHz, the error is 5.9 ppm (or your counter's timebase is off)
- For signals below 1 kHz, use period mode rather than frequency mode for faster, higher-resolution readings
- If measurements are unstable, check for noise on the signal — add a low-pass filter or reduce input sensitivity to reject noise while still triggering reliably on the signal

## Caveats

- **Scope frequency readout is usually adequate** — A good modern oscilloscope reads frequency to 5–6 digits, which is sufficient for "is the clock present and approximately right?" checks. The counter adds value for precision verification, not routine checks.
- **Accuracy vs. resolution** — A counter may display 8 digits, but if the timebase is only ±1 ppm accurate, those last few digits are meaningless. Resolution is how finely you can read; accuracy is how close the reading is to the true value.
- **Frequency is an average** — The counter reports the average frequency over the gate time. If the signal has jitter or frequency modulation, the counter reports the mean, not the instantaneous value. Use a scope or spectrum analyzer to see variation.
- **Don't chase digits without need** — Verifying that an 8 MHz crystal is within ±50 ppm of nominal requires only 5 digits of resolution. More resolution than needed doesn't improve the test, it just adds cost and warm-up time.

## In Practice

- An MCU that runs slightly slow or fast may have a crystal pulled off frequency by wrong load capacitors — the counter quantifies the error (e.g., "47 ppm high suggests ~1 pF too little load capacitance")
- When debugging clock trees, measuring each stage (oscillator, PLL output, divided clocks) confirms where frequency error is introduced
- A signal that reads differently each time you measure may have frequency modulation (intentional or not), jitter, or a marginal oscillator — the counter reveals instability that the scope misses
- For UART bit rate issues, measure the actual baud rate clock — a 115200 baud that's actually 117000 baud (1.6% error) will cause bit errors at long packet lengths
- When calibrating other instruments, the frequency counter (with a known-good timebase) is the reference — calibrate the counter first, against GPS or a known standard
