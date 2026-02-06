---
title: "Is My Ground Connection Adding Artifacts?"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is My Ground Connection Adding Artifacts?

The ground lead on a scope probe is not just a return path — it's an inductor. Every millimeter of wire has inductance (~1 nH/mm), and that inductance resonates with the probe's input capacitance to create ringing on fast edges. The result is overshoot and oscillation in the measurement that does not exist in the circuit.

## Ground Lead Inductance

The ground lead's inductance resonates with the probe capacitance at a frequency determined by LC:

**Resonant frequency: f = 1 / (2π × √(L × C))**

| Ground lead | Approximate length | Inductance (~1 nH/mm) | Resonant freq with 15 pF probe cap |
|------------|-------------------|----------------------|-------------------------------------|
| Standard alligator clip lead | 150 mm (6") | ~150 nH | ~106 MHz |
| Short clip lead | 75 mm (3") | ~75 nH | ~150 MHz |
| Spring-tip / barrel ground | 3–5 mm | ~3–5 nH | ~580–750 MHz |

At the resonant frequency, the ground lead's impedance peaks, and any fast edge excites this resonance. The result is a damped oscillation (ringing) superimposed on the actual signal.

On a fast edge (5 ns rise time), the standard 6-inch ground clip adds 20–50% overshoot on the rising edge and damped ringing at ~100 MHz that decays over 2–5 cycles. This looks exactly like real impedance-mismatch ringing — and that's what makes it dangerous.

## Spring-Tip Ground

The spring-tip ground (barrel ground, ground spring) makes contact through the probe's ground barrel directly to a ground point on the board. The ground path is only a few millimeters long, reducing inductance by 30–50x compared to the alligator clip lead.

The spring-tip requires that signal and ground points are physically close together on the board (within a few mm). Probing directly at a component where signal and ground are adjacent (e.g., a decoupling cap, an IC pin pair) gives the best results.

## When Long Ground Is Acceptable

The ringing artifact only matters when the signal has frequency content near the ground lead's resonant frequency.

**Long ground clip is fine:**
- DC measurements
- Audio-frequency signals (< 100 kHz)
- Low-frequency ripple measurements (fundamental < 2 MHz)
- Slow analog signals (temperature, strain, battery voltage)
- Any signal with rise time > 100 ns

**Short ground needed:**
- Digital logic with rise times < 20 ns (most modern CMOS)
- Switching converter switch nodes (single-digit nanosecond transitions)
- Clock signals where edge quality, jitter, or duty cycle matters
- Any measurement involving overshoot, ringing, or settling behavior
- EMI pre-compliance measurements

## Tips

- Use the spring-tip ground accessory for any measurement where edge fidelity matters
- Probe directly at components where signal and ground are adjacent
- If no ground is available near the measurement point, solder a short ground wire stub or use a probe tip adapter with built-in ground contact
- The ringing frequency is a diagnostic clue — if it matches the calculated LC resonance of the ground lead (~100 MHz for a 6" clip), it's probably the probe

## Caveats

- Ground-lead ringing looks exactly like real impedance-mismatch ringing — the only way to distinguish them is to change the ground lead length and see if the ringing changes
- Even with a spring-tip ground, the probe still adds some capacitance and a small amount of inductance — for multi-GHz measurements, active probes with integrated ground contacts are needed
- Some probes don't come with a spring-tip accessory — aftermarket options exist, or a short (< 10 mm) ground wire can be soldered directly to the probe's ground barrel

## In Practice

- Ringing that disappears or significantly reduces when switching from long ground clip to spring-tip ground is a measurement artifact, not circuit behavior
- Ringing that remains at the same frequency and amplitude with both ground configurations is real circuit behavior
- Ringing that changes frequency when the ground lead is changed indicates a mix — some real, some probe-induced
- Ringing frequency matching the calculated LC resonance of the ground lead (~100 MHz for 6" clip) strongly suggests probe artifact
- Overshoot of 20–50% on fast edges with the standard ground clip that drops to < 10% with spring-tip indicates ground lead inductance was the dominant contributor
- **A measurement that changes depending on which ground point is used for the oscilloscope probe** commonly appears when the device's internal ground has significant impedance — different probe ground locations see different effective ground potentials, revealing that the device boundary's ground reference is not a single equipotential surface.
- **An oscilloscope trace that shows different noise levels depending on where the probe ground clip is attached** is revealing ground impedance coupling — different ground clip locations sample different points in the ground network, and the current flowing through the ground impedance between those points creates different effective noise levels.
- **A measurement that changes when the scope probe is moved to a different ground point on the same IC** is revealing internal ground impedance — the IC's internal ground bus has resistance and inductance, so different ground pins are at slightly different potentials depending on the current flowing through the internal ground structure.
- **Noise that differs by probe ground clip location** is revealing ground impedance coupling — different ground clip locations sample different points in the ground network.
