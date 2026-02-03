---
title: "When Was This Last Calibrated / Compensated?"
weight: 30
---

# When Was This Last Calibrated / Compensated?

Probe compensation, scope self-cal, DMM calibration status. Some things should be checked every session, some periodically, and some only when something seems off. Knowing the difference keeps time from being wasted on unnecessary calibration while catching cases where a drifted instrument is lying.

## Probe Compensation: Every Session

Check every time a different probe is used, a probe is moved to a different scope, or at the start of a session.

Connect the probe to the scope's CAL output (1 kHz square wave, typically ~3Vpp). Set scope to show a clean square wave. Look at the edges:
- **Correct compensation:** Square corners, flat tops and bottoms
- **Under-compensated:** Rounded leading edges, droopy
- **Over-compensated:** Overshoot at corners, spiky

Adjust the trimmer capacitor on the probe until the square wave is flat.

An uncompensated probe has frequency-dependent attenuation ratio. At DC the 10:1 ratio is correct; at higher frequencies it changes. This distorts any waveform with high-frequency content.

## Scope Self-Cal: Monthly or After Temperature Changes

Run after significant temperature changes or whenever readings seem off.

1. Warm up the scope for at least 30 minutes
2. Disconnect all probes and inputs
3. Run self-calibration routine (Utility or Calibration menu)
4. Wait for completion (5–15 minutes)

Self-cal adjusts DC offset, vertical gain accuracy, timebase accuracy, channel-to-channel delay, and ADC linearity. It must be done with inputs disconnected — any signal during self-cal corrupts calibration.

Self-cal is not a substitute for traceable calibration. It corrects temperature drift and aging within the scope's self-calibration range.

## DMM Calibration: Annually

Formal calibration requires measuring known reference standards and adjusting internal correction factors. This needs a voltage reference more accurate than the meter (at least 4×), resistance and current references, and traceability to national standards.

**Self-check between calibrations:**
- Measure a known voltage reference (precision IC like LM4040 or REF5025)
- Measure precision resistors of known value
- Short leads and verify < 0.5 Ohm continuity reading

Most hobbyists never formally calibrate meters. For bench electronics work, factory calibration of a name-brand meter is typically valid for 1–3 years.

## Start-of-Session Checklist

| Check | How | Time |
|-------|-----|------|
| Probe compensation | Cal output, adjust if needed | 30 seconds per probe |
| DMM leads zero check | Short leads, read resistance | 10 seconds |
| DMM battery | Note if display is dim or readings erratic | 5 seconds |
| Scope vertical position | Verify ground level with probe grounded | 10 seconds per channel |
| Scope trigger | Set to Auto, verify baseline noise visible | 5 seconds |

## Tips

- Skipping probe compensation is the #1 preventable measurement error — takes 30 seconds and catches problems that ruin all subsequent measurements
- DMM lead zero-check catches corroded probes, broken wires, and bad banana plug contacts
- Compensation is specific to the probe-scope combination — changing channels may require re-compensation

## Caveats

- Compensation adjustment range is limited — if flat square wave can't be achieved, probe may be damaged or incompatible
- On switchable 1x/10x probes, compensation only applies to 10x — 1x has no compensation network
- Self-cal failure indicates scope may need service
- If two meters disagree, the one with more recent calibration wins — otherwise check both against known reference
- Cheap meters may never have been properly calibrated at factory

## Bench Relevance

- Square wave with droopy corners indicates under-compensated probe — adjust before trusting any waveform
- Square wave with overshoot indicates over-compensated probe — adjust to flat corners
- DMM reading 2 Ohm with leads shorted indicates corroded or damaged leads — replace
- Scope measurements that drift over time indicate self-cal needed — warm up and run calibration
- Two meters disagreeing by more than combined accuracy specs indicates one needs calibration
