---
title: "Do I Need Isolation or Differential Measurement?"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Do I Need Isolation or Differential Measurement?

Most bench instruments — scopes, DMMs in some modes, signal generators — have their ground terminal connected to earth ground through the power cord. If the measurement point isn't at earth potential, connecting a ground-referenced instrument either shorts something to earth, gives a meaningless reading, or both.

## The Ground Problem

Most oscilloscopes connect the ground clip (the outer shell of BNC, the probe ground clip) directly to earth ground through the three-prong power cord. The ground clip is not a floating reference that can go anywhere — it's hard-wired to the building's earth. Connecting it to any node that isn't already at earth potential creates a short circuit through the scope's ground path. This can destroy the circuit, destroy the scope, blow fuses, or in mains-connected circuits, create a lethal shock hazard.

### Scenarios Where This Fails

| Scenario | What happens with scope ground clipped to it |
|----------|---------------------------------------------|
| Half-bridge midpoint (motor drive, class-D amp) | Ground clip shorts the low-side switch through earth — smoke and/or dead FETs |
| Primary side of mains SMPS | Ground clip connects mains live or neutral to earth — massive fault current, tripped breaker, possible fire |
| Bridge rectifier output (no isolation transformer) | Ground clip shorts a diode — blows the diode or the scope's ground path |
| Floating battery in series stack | Ground clip forces one terminal to earth — disrupts the circuit, potentially dangerous in high-voltage stacks |
| Across a current-sense resistor not at ground | Ground clip shorts out the sense resistor — removes current sensing, changes circuit behavior |

## Solutions

Three approaches exist for measuring voltage between nodes that aren't at earth potential.

### Differential Probes

A differential probe has two input pins (+ and −) and no ground clip connection to the circuit. It amplifies the difference between the two inputs and rejects the common-mode voltage (the voltage both inputs share relative to earth). The output connects to a single-ended scope input.

Differential probes allow true voltage measurement between floating nodes without disturbing the circuit, and safe measurement of nodes at high common-mode voltage (e.g., high-side gate drive signals). Common-mode ratings are typically 600V–1000V peak.

### Isolation Transformers

An isolation transformer breaks the galvanic connection between the DUT's mains power and earth ground. With the DUT floating, its internal nodes can be at any potential relative to earth — connecting a ground-referenced scope probe no longer creates a short.

The scope ground clip connects to the DUT's local ground (circuit common), and signals are probed as usual. This approach is particularly useful for primary-side SMPS measurements where real scope bandwidth and multiple channels are needed.

### CH1 − CH2 Math Subtraction

With no differential probe available, two scope channels and math subtraction provide a rough approximation. CH1 connects to the "+" node, CH2 to the "−" node, and both ground clips connect to a common earth-ground point on the circuit (not to either measurement node). The math trace (CH1 − CH2) shows the differential voltage.

This technique works for low-frequency, low-common-mode situations — such as measuring across a sense resistor near ground — but has significant limitations compared to true differential measurement.

## Tips

- Set the scope's probe attenuation to match the differential probe's actual ratio
- Verify common-mode voltage is within the differential probe's rating before connecting
- Use matched probes (same attenuation, delay, bandwidth) for CH1 − CH2 math measurements
- Size the isolation transformer for the DUT's power draw and voltage — undersized transformers saturate and stop isolating
- When using math subtraction, connect both ground clips to the same earth-ground point, never to the measurement nodes

## Caveats

- Scope ground clips are hard-wired to earth through the power cord — not a floating reference
- Differential probes have finite CMRR (typically 60–80 dB); at 60 dB (1000:1), 100V of common mode leaks through as 100 mV of error, which can dominate small-signal measurements
- Differential probe bandwidth varies widely — cheap probes may be 25–50 MHz while high-end active probes reach 1 GHz+
- Isolation transformers have parasitic capacitance between windings that leaks at high frequencies, limiting common-mode rejection
- Everything downstream of an isolation transformer floats — including the DUT's chassis; touching the DUT and earth simultaneously creates a shock hazard
- **Never float the scope by lifting its earth prong** — the scope chassis becomes live at whatever potential the circuit puts on it
- CH1 − CH2 math has poor CMRR (20–30 dB at DC, degrading rapidly with frequency) — 100x worse than a real differential probe
- Both channels receive full common-mode voltage with math subtraction; if common-mode exceeds the scope's input range, clipping occurs before subtraction
- Probe cable length differences create phase errors at high frequency that appear as false differential signal

## In Practice

- Smoke or dead FETs when probing a bridge circuit indicates the ground clip shorted a switch node to earth
- Tripped breaker when probing mains-connected equipment indicates the ground clip connected live or neutral to earth
- Unexpected DC offset on a small differential signal suggests CMRR leakage from high common-mode voltage — check differential probe specifications
- Math trace that looks phase-shifted or distorted at high frequency indicates probe mismatch or cable length difference — this technique is only trustworthy at low frequencies
- A differential probe reading that changes when the probe orientation is reversed indicates a connection or calibration issue
- Isolation transformer that runs hot or hums loudly is saturating — the DUT draws more power than the transformer can supply while maintaining isolation
