---
title: "Is This Conducted or Radiated?"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is This Conducted or Radiated?

Distinguishing how noise gets from source to victim. Conducted noise travels on wires — power leads, signal cables, ground connections. Radiated noise travels through the air as electromagnetic fields. The fix is completely different for each, so identifying the coupling path before reaching for a solution saves time.

## The Four Coupling Mechanisms

| Mechanism | Path | Frequency tendency | Fix approach |
|-----------|------|-------------------|-------------|
| Conductive (galvanic) | Shared wire, trace, or ground | All frequencies, often low-frequency | Separate current paths, improve grounding |
| Capacitive (electric field) | Between traces/components with voltage difference | Increases with frequency and dV/dt | Shielding, distance, guard traces |
| Inductive (magnetic field) | Between current loops in proximity | Increases with frequency and dI/dt | Reduce loop area, distance, shielding |
| Radiated (far-field EM) | Through the air, antenna-to-antenna | Dominant above ~30 MHz | Shielding, filtering, layout |

At bench distances and PCB scales, most noise below ~30 MHz is near-field (capacitive or inductive coupling). Above ~30 MHz, radiated coupling becomes dominant.

## Distinguishing Conducted vs. Radiated

**Distance test:** Measure noise level, then physically move the noise source away from the victim. Noise that drops rapidly with distance is radiated. Noise that doesn't change with distance is conducted.

**Cable disconnect test:** Measure noise with all cables connected, then disconnect cables one at a time. If noise drops when a specific cable is disconnected, that cable conducts the noise. If noise persists with all cables disconnected, it's radiated.

**Ferrite clamp test:** Clip a ferrite around a cable suspected of conducting noise. If noise drops, common-mode conducted noise on that cable is the path. Ferrites attenuate common-mode current at high frequencies (typically > 1 MHz).

**Shielding test:** Place grounded conductive sheet between suspected source and victim. If noise drops, coupling is through electric or magnetic fields. For magnetic shielding at low frequencies (50/60 Hz), mu-metal or thick steel is needed — aluminum doesn't help.

## Common-Mode vs. Differential-Mode Noise

| Type | Where noise appears | How to measure |
|------|---------------------|----------------|
| Differential-mode (DM) | Between signal and return | Normal measurement — probe signal vs. ground |
| Common-mode (CM) | On both signal and return equally | Probe both wires vs. earth; or current clamp around entire cable |

Differential-mode noise is on the signal and must be filtered on the signal path. Common-mode noise is on both wires equally — a differential receiver rejects it if CMRR is high enough.

**Measuring common-mode current:** Clamp an AC current probe around the entire cable (all conductors together). If only differential-mode current flows, the fields cancel and probe reads zero. Any current the probe reads is common-mode.

## Empirical Fix Verification

1. **Before:** Measure and record noise level (scope screenshot, RMS voltage, FFT)
2. **Apply one fix** (ferrite, shield, filter cap, reroute, grounding change)
3. **After:** Measure again under same conditions
4. **Compare:** Improvement (dB) = 20 × log10(V_before / V_after)

| Improvement | Practical meaning |
|------------|------------------|
| 6 dB (2× reduction) | Noticeable but modest |
| 20 dB (10× reduction) | Significant |
| 40 dB (100× reduction) | Excellent — essentially eliminated |

## Tips

- Change one thing at a time — if multiple fixes are applied simultaneously, which one worked is unknown
- Both coupling paths often exist simultaneously — fixing one may reveal the other
- Test under worst-case conditions, not best-case

## Caveats

- Moving cables changes both conducted and radiated coupling geometry — be systematic
- Ferrite clamps only help with common-mode noise — if noise is differential-mode, ferrite does nothing
- Common-mode noise converts to differential-mode at any asymmetry (different trace lengths, mismatched impedances)
- Some fixes interact — adding filter capacitor to switching regulator output can affect stability

## In Practice

- Noise that drops with distance is radiated — shielding and separation are effective fixes
- Noise unchanged by distance is conducted — filtering and ground improvement are needed
- Noise eliminated by ferrite clamp is common-mode conducted — ferrites at cable entry are the fix
- Noise eliminated by shielding is capacitive or magnetic field coupling — permanent shield needed
- Noise reduced by both ferrite and shield indicates both paths exist — address both
- **A signal that becomes noisy only when a specific nearby IC is active, even though the two share no electrical connections,** is frequently electromagnetic coupling through the PCB — the active IC's bond wires or output traces are radiating, and the victim signal's trace is acting as a receiving antenna.
- **A design that works on revision A of a PCB but fails on revision B, where the only changes were "non-functional" layout improvements,** is frequently revealing an unrecognized layout dependency — the "non-functional" changes modified a parasitic property that the circuit's behavior depended on.
