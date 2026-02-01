---
title: "Is This Conducted or Radiated?"
weight: 30
---

# Is This Conducted or Radiated?

Distinguishing how noise gets from the source to the victim. Conducted noise travels on wires — power leads, signal cables, ground connections. Radiated noise travels through the air as electromagnetic fields. The fix is completely different for each, so identifying the coupling path before reaching for a solution saves time and frustration.

## The Four Coupling Mechanisms

**Concept:** How noise gets from here to there

| Mechanism | Path | Frequency tendency | Fix approach |
|-----------|------|-------------------|-------------|
| Conductive (galvanic) | Shared wire, trace, or ground | All frequencies, often low-frequency dominant | Separate current paths, improve grounding |
| Capacitive (electric field) | Between traces, components, or cables with voltage difference | Increases with frequency and dV/dt | Shielding, distance, guard traces |
| Inductive (magnetic field) | Between current loops in proximity | Increases with frequency and dI/dt | Reduce loop area, distance, shielding |
| Radiated (far-field EM) | Through the air, antenna-to-antenna | Dominant above ~30 MHz | Shielding, filtering, layout |

At bench distances and PCB scales, most noise below ~30 MHz is near-field (capacitive or inductive coupling). Above ~30 MHz, radiated coupling becomes dominant.

## Distinguishing Conducted vs. Radiated

**Tool:** Oscilloscope + various experiments
**When:** You've found noise and need to determine the coupling path before fixing it

### Distance Test

1. Measure the noise level on the victim signal
2. Physically move the noise source away from the victim (or move the victim away from the source)
3. Observe how the noise amplitude changes:
   - **Drops rapidly with distance:** Radiated (near-field or far-field) — the coupling is through the air
   - **Doesn't change with distance:** Conducted — the noise travels on a wire regardless of physical separation

### Cable Disconnect Test

1. Measure noise with all cables connected
2. Disconnect cables one at a time between the noise source and victim
3. If noise drops when a specific cable is disconnected, that cable is conducting the noise
4. If noise persists with all cables disconnected, it's radiated

### Ferrite Clamp Test

1. Clip a ferrite clamp (snap-on ferrite) around a cable suspected of conducting noise
2. If noise drops, common-mode conducted noise on that cable is the path
3. Ferrites attenuate common-mode current at high frequencies (typically > 1 MHz effective). They don't help with differential-mode noise or low-frequency conducted noise

### Shielding Test

1. Place a grounded conductive sheet (copper foil, aluminum sheet) between the suspected source and victim
2. If noise drops, the coupling is through electric or magnetic fields (radiated/near-field)
3. For magnetic shielding at low frequencies (50/60 Hz), you need mu-metal or thick steel — aluminum doesn't help

### What You Learn

- Whether the primary coupling path is conducted or radiated
- Which specific cable or path is carrying the noise

### Gotchas

- Both paths often exist simultaneously. Fixing the conducted path may reveal the radiated path (or vice versa)
- Moving cables changes both the conducted and radiated coupling geometry. Be systematic — change one thing at a time

## Common-Mode vs. Differential-Mode Noise

**Concept:** Two different types of conducted noise

| Type | Where the noise appears | How to measure |
|------|------------------------|----------------|
| Differential-mode (DM) | Between signal and return (on the signal itself) | Normal measurement — probe signal vs. ground |
| Common-mode (CM) | On both signal and return equally, relative to earth | Probe both wires vs. earth ground; or use a current clamp around the entire cable |

### Why It Matters

- **Differential-mode noise** is on the signal — it directly interferes with the intended signal and must be filtered on the signal path
- **Common-mode noise** is on both wires equally — a differential receiver rejects it (if CMRR is high enough), but it can convert to differential-mode noise at impedance imbalances

### Measuring Common-Mode Current

1. Clamp an AC current probe around the entire cable (all conductors together)
2. If the cable carries only differential-mode current, the fields from the signal and return conductors cancel — the probe reads zero
3. Any current the probe reads is common-mode current — flowing on the cable as a whole, returning through some other path (usually earth ground)

### What You Learn

- Whether noise on a cable is common-mode (fix: ferrites, common-mode chokes, [balanced connections]({{< relref "/docs/fundamentals/signaling-models/balanced-vs-unbalanced" >}})) or differential-mode (fix: differential filters, shielding, layout)

### Gotchas

- Common-mode noise converts to differential-mode noise at any asymmetry in the circuit — different trace lengths, different impedances, mismatched components. This is why balanced connections work well: they maintain symmetry, so CM-to-DM conversion is minimized
- Ferrite clamps only help with common-mode noise. If the noise is differential-mode, a ferrite clamp does nothing (it sees equal and opposite currents that cancel in the ferrite core)

## Empirical Fix Verification

**Tool:** Oscilloscope — before and after measurements
**When:** You've applied a fix and need to verify it worked

### Procedure

1. **Before:** Measure and record the noise level (scope screenshot, RMS voltage, FFT spectrum)
2. **Apply one fix** (add a ferrite, add a shield, reroute a trace, add a filter capacitor, change grounding)
3. **After:** Measure again under the same conditions
4. **Compare:** Quantify the improvement in dB: **Improvement (dB) = 20 × log10(V_before / V_after)**

### What Constitutes "Fixed"

| Improvement | Practical meaning |
|------------|------------------|
| 6 dB (2× reduction) | Noticeable but modest |
| 20 dB (10× reduction) | Significant — noise is clearly reduced |
| 40 dB (100× reduction) | Excellent — noise is essentially eliminated |

### Gotchas

- Change one thing at a time. If you add a ferrite, reroute a trace, and add a cap simultaneously, you don't know which fix worked (or whether they all contributed)
- Test under worst-case conditions, not best-case. Noise that's fixed at room temperature on the bench may return when the system is in its enclosure with everything running
- Some fixes interact — adding a filter capacitor to a switching regulator output can affect its stability. Verify that the fix doesn't create a new problem
