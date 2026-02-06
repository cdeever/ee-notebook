---
title: "ESR Meter"
weight: 50
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# ESR Meter

An ESR meter measures the Equivalent Series Resistance of a capacitor — the real resistive loss that limits how effectively the cap can deliver or absorb current at high frequency. A capacitor can have correct capacitance and still be failing if its ESR has risen. This is the single most common failure mode of aluminum electrolytic capacitors, and the ESR meter catches it when a DMM's capacitance mode does not.

## What It Does

The meter injects a small AC test signal (typically 50–100 kHz) into the capacitor and measures the resistive component of the impedance at that frequency. Because the test frequency is high enough that the capacitive reactance of typical electrolytics is very low, the measurement is dominated by ESR — the series resistance from lead resistance, foil contact resistance, and electrolyte conductivity.

The result is a low-ohm reading that represents real power dissipation. A 1000 µF cap with 0.5Ω ESR wastes power and generates heat under ripple current. The same cap with 0.02Ω ESR handles the same ripple with negligible loss.

## Key Specs and What They Mean

| Spec | What it means | Why it matters |
|---|---|---|
| ESR range | The measurable ohm range (typically 0.00Ω to 40Ω) | Must cover the expected ESR of caps you test. Good electrolytics have ESR from 0.01Ω to a few ohms; degraded caps may be higher |
| Test frequency | Frequency of the injected AC signal (50–100 kHz is common) | ESR is frequency-dependent. The test frequency should be relevant to the application — 100 kHz is appropriate for switching power supply decoupling. ESR at 120 Hz (ripple rectifier duty) may be different |
| Capacitance range | Minimum to maximum capacitance the meter can measure | The meter needs enough capacitive reactance at the test frequency to separate ESR from total impedance. Small caps (below ~0.3 µF) may have too much reactance at 100 kHz for an accurate ESR reading |
| Resolution | Smallest ESR change the meter can display | 0.01Ω resolution matters for comparing good caps (ESR 0.02Ω) to marginal ones (ESR 0.10Ω). Coarser resolution may mask early degradation |
| In-circuit capability | Whether the meter can measure ESR without desoldering the cap | In-circuit ESR testing saves enormous time on boards with dozens of electrolytics. Parallel paths affect accuracy but the reading is usually useful as a screening tool |
| Test voltage | Peak voltage of the test signal | Must be low enough not to forward-bias semiconductor junctions in the surrounding circuit (which would invalidate in-circuit readings). Typical: ~40 mV |

## When It Beats a DMM or LCR Meter

A DMM's capacitance mode measures... capacitance. A cap that has dried out may still show correct capacitance on a DMM while having 10× its rated ESR. The DMM says "good," the ESR meter says "bad," and the ESR meter is right — the circuit fails because the cap cannot handle ripple current, not because the capacitance changed.

An LCR meter measures ESR too, but it is typically more expensive, more complex to operate, and overkill for rapid cap screening. The ESR meter is a single-purpose tool optimized for speed: touch probes, read number, move on. When screening a board with 30 electrolytics looking for the one bad cap, speed is the point.

## Feature Tiers

| Tier | Typical specs | Good enough for | Not sufficient for |
|---|---|---|---|
| **Basic** (ESR only, fixed frequency) | 0–40Ω range, 100 kHz, 0.01Ω resolution, in-circuit | Screening electrolytics on power supply boards, quick go/no-go testing, repair triage | Characterizing capacitor behavior at multiple frequencies, measuring very small caps, precision comparison |
| **ESR + Capacitance** | ESR + capacitance readout, audible alert, out-of-circuit cap measurement | Screening plus verification of capacitance value, component sorting | Frequency-dependent characterization, dissipation factor measurement, impedance plots |
| **Multi-frequency / advanced** | Selectable test frequency, higher accuracy, wider range | Comparing ESR at different frequencies, verifying datasheet specs, research | These overlap with LCR meter territory — at this point, consider an LCR meter instead |

## Gotchas and Limits

- **Discharge capacitors before testing:** The meter expects a discharged cap. A charged electrolytic — especially one from a power supply — can damage the meter or give a false reading. Always discharge first with a resistor (100Ω works, and avoids the spark and stress of a screwdriver short).
- **In-circuit readings are approximate:** Parallel paths through the rest of the circuit affect the reading. A suspiciously low ESR reading in-circuit may mean the meter is seeing a parallel low-impedance path, not a miraculously good cap. For definitive results, desolder one lead.
- **Small caps are out of range:** Caps below about 0.3 µF have too much reactance at the 100 kHz test frequency for the meter to separate ESR from capacitive impedance. For small ceramics, film caps, and low-value electrolytics, an LCR meter is needed.
- **Temperature affects ESR:** ESR rises at cold temperatures — this is real cap behavior, not meter error. Testing a cold board straight from storage gives higher readings than the same board at room temperature. Let it warm up, or account for the shift.
- **ESR ceiling does not matter in practice:** A 40Ω upper range limit is not a practical limitation. A cap with 40Ω ESR is catastrophically failed. If the meter reads "out of range," the cap is dead — you do not need to know whether it is 50Ω or 500Ω.

## Tips

- Use the audible tone (if available) for rapid screening — probe each cap and listen for the pitch change without looking at the display. The outlier is immediately obvious
- Keep a reference table of expected ESR values by capacitance and voltage rating. Datasheet ESR specs are specified at rated conditions (usually 120 Hz and 20°C for aluminum electrolytics) — the 100 kHz test frequency ESR is usually lower
- On boards with rows of identical caps (like a motherboard's CPU VRM), compare ESR readings against each other. You may not know the "correct" value, but the bad cap will stand out from the group
- Clean oxidized leads before testing — contact resistance between the probe and the cap lead adds directly to the ESR reading

## Caveats

- **ESR is not the whole story** — A cap can have good ESR but reduced capacitance (partial dry-out). For complete health assessment, also check capacitance out-of-circuit
- **Test frequency matters more than you might think** — Datasheet ESR is often specified at 120 Hz; meter tests at 100 kHz. The values differ. Some caps (especially tantalum and polymer) have ESR that varies significantly with frequency. The meter's reading is valid for the test frequency, not necessarily for the frequency your circuit uses
- **Semiconductor junctions can confuse in-circuit readings** — If the test voltage exceeds ~0.3V (germanium) or ~0.6V (silicon), in-circuit measurements may forward-bias diodes or transistor junctions, creating a low-impedance parallel path that masks the real ESR
- **"Good ESR" depends on the application** — A 0.5Ω ESR cap is fine in an audio coupling application but may be failing in a 500 kHz switching supply where the datasheet specifies 0.05Ω. Always compare to the spec for the specific part and application

## In Practice

- A power supply that develops increased output ripple while the regulation voltage stays correct almost always has a cap with rising ESR — the ESR meter finds it in minutes
- LCD monitor or TV power boards that develop symptoms over time (flickering, failure to start, intermittent shutoff) are classic electrolytic ESR failure. Test every electrolytic on the board; replace the high-ESR ones as a set, not individually
- When an ESR reading is borderline (slightly above expected but not dramatically), compare it to identical caps on the same board. A cap that reads 2× its neighbors' ESR is suspect even if the absolute value does not look terrible
- Caps near heat sources (power transistors, regulators, bridge rectifiers) fail first — prioritize testing those locations
