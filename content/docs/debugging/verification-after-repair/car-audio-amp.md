---
title: "Car Audio Amplifier"
weight: 10
categories:
  - Audio
  - High-Current
  - Automotive
---

# Verification Plan: Car Audio Amplifier

A full post-repair verification plan for high-power 12 V automotive amplifiers — Class AB, Class D, or Class A/B+D hybrid. This covers the sequence from cold board to confirmed-reliable, applicable to any car amp regardless of brand, topology, or channel count.

Car amps are simultaneously audio equipment, high-current power electronics, and automotive-environment devices. Verification has to cover all three dimensions.

## Equipment Needed

- **12 V bench supply capable of 20–30 A** (or a car battery with inline fuse — see below)
- **Inline fuse** — 30–40 A automotive blade fuse in a holder on the power lead. Non-negotiable
- **DMM** — voltage and resistance
- **Oscilloscope** — at least 2 channels
- **Dummy loads** — power resistors or dummy speaker loads matching the amp's rated impedance (typically 4 Ω or 2 Ω). Must be rated for the amp's output power. Wirewound resistors on heatsinks, or purpose-built dummy loads
- **Audio signal source** — function generator (1 kHz sine is the workhorse) or a phone/DAP with a known-clean output
- **RCA cables and speaker wire** — known-good

**On power supplies:** Most bench supplies can't source the current a car amp draws at full power. Options: a 12 V / 30 A+ switching supply, a server power supply converted for bench use, or an actual car battery with an inline fuse. If using a battery, the inline fuse is your only protection — do not skip it.

## Phase 1: Pre-Power Checks (Board Cold)

Do all of this before connecting power.

| # | Check | Method | Pass criteria |
|---|-------|--------|---------------|
| 1 | Visual inspection of rework area | Magnification — look for bridges, cold joints, lifted pads, misaligned components | Clean joints, correct placement, no visible damage |
| 2 | Power rail resistance to ground | DMM ohms across B+ to ground, and across each internal rail if accessible | Not shorted. Expect some resistance (output FETs have body diodes, so you may see a few ohms on the output stage rails — but not < 1 Ω) |
| 3 | Output resistance to ground | DMM ohms from each speaker output terminal to ground | Should not be near-zero. Low readings suggest a shorted output device |
| 4 | Fuse / protection circuit continuity | Verify inline fuse is intact, any on-board fuses or fusible links are good | Continuity through the protection path |

**If any pre-power check fails, stop. Do not apply power.**

## Phase 2: Initial Power-Up (No Signal, No Load)

Connect power but no audio input and no speaker load.

| # | Check | Method | Pass criteria |
|---|-------|--------|---------------|
| 1 | Current-limited power on | Apply 12 V with current limit set to ~2 A (or watch the ammeter if using a battery + fuse) | Idle current settles to a steady value. Typical idle for a car amp: 0.5–3 A depending on class and channel count. If it slams to the limit or climbs steadily, power off immediately |
| 2 | Supply voltage at the amp | Measure voltage at the amp's B+ and GND terminals | Within 0.5 V of supply voltage (accounts for wire drop) |
| 3 | Internal rail voltages | Measure the DC-DC converter output rails (typically ±30–50 V for the output stage, plus auxiliary rails for preamp/DSP) | Symmetrical bipolar rails within ~5% of each other. Auxiliary rails at expected values. If one rail is missing or significantly low, the converter or a secondary rectifier is suspect |
| 4 | DC offset at speaker outputs | DMM DC voltage from each speaker output to ground | < 50 mV. Higher DC offset means a bias problem, mismatched output devices, or a damaged driver stage. Some amps have DC protection that will engage if offset is too high |
| 5 | Protect / fault indicators | Observe the amp's protect LED or status indicator | Amp should come out of protect mode within a few seconds of power-up. If it stays in protect, something is still wrong — DC offset, overcurrent, thermal flag, or short detection |
| 6 | Thermal check | After a few minutes at idle, feel or IR-measure output devices, regulators, and the DC-DC converter FETs | Warm is fine. Hot at idle is wrong — suggests excessive bias current or a partially damaged device still conducting |

## Phase 3: Signal Test (Low Power, Dummy Load)

Connect dummy loads to all channels. Apply a low-level audio signal.

| # | Check | Method | Pass criteria |
|---|-------|--------|---------------|
| 1 | Connect dummy loads | 4 Ω (or rated impedance) dummy loads on all channels. **Do not use actual speakers for initial testing** — if something is wrong, you'll burn a speaker | Secure connections, no intermittent contact |
| 2 | Apply 1 kHz sine, low level | Feed a 1 kHz sine wave into one channel at a time via RCA input. Start with the signal source at minimum and bring up slowly | Clean sine on the scope at the speaker output. No distortion, no oscillation, no noise bursts |
| 3 | Check all channels individually | Repeat for each channel | Each channel produces clean output independently |
| 4 | Check gain / level tracking | Increase input level in steps, measure output voltage across the dummy load at each step | Output increases proportionally. Calculate power: P = V²/R. Confirm the amp reaches at least rated power before clipping |
| 5 | Clipping behavior | Increase input until the output clips | Clean clipping (flat tops on the sine wave), not oscillation or asymmetric clipping. The amp should clip symmetrically — if one rail clips before the other, the bipolar supply or the output stage has an imbalance |
| 6 | Crossover distortion (Class AB) | Scope the output at low levels (a few hundred mW) | No visible zero-crossing distortion. If present, bias is set too low or an output device is not conducting properly |
| 7 | DC offset under signal | DMM DC voltage at speaker output while signal is present | Still < 50 mV. Offset that appears only under signal suggests a problem in the driver or feedback network |
| 8 | Noise floor | Remove the audio input (leave RCA connected but no signal). Scope the output at high sensitivity (mV/div) | Noise should be low — hiss, hum, or buzz indicates grounding issues, failed filter caps, or oscillation. A clean amp with no input should show only a few mV of noise |

## Phase 4: Full Power Stress Test

This is where marginal repairs reveal themselves.

| # | Check | Method | Pass criteria |
|---|-------|--------|---------------|
| 1 | Full power, all channels driven | 1 kHz sine, all channels at rated power into dummy loads simultaneously. Run for 10–15 minutes minimum | Stable output, no protect trips, no thermal shutdown. Current draw should be consistent |
| 2 | Current draw at full power | Monitor supply current | Should be consistent with rated power output plus efficiency losses. A Class D amp at 500 W output into 4 Ω draws roughly 50–60 A from 12 V (accounting for ~80% efficiency). Class AB is less efficient — expect more current for the same output |
| 3 | Thermal behavior under load | Monitor heatsink temperature (IR thermometer or thermocouple) over the stress period | Temperature should stabilize, not climb indefinitely. If the amp has a fan, it should spin up. Thermal shutdown is a fail — the repair may be marginal or the thermal interface (pad/paste) needs attention |
| 4 | Rail sag under load | Measure internal bipolar rails while driving full power | Some sag is normal (the DC-DC converter is working hard), but rails should stay within ~10% of their no-load value. Excessive sag means the converter can't keep up — suspect converter FETs, transformer, or filter caps |
| 5 | Power cycling under load | Power off and on 5–10 times with signal and load connected | Amp should come up cleanly each time without protect trips or thumps. Thump on power-up/down suggests the mute relay or soft-start circuit isn't working correctly |

## Phase 5: Feature and Protection Verification

| # | Check | Method | Pass criteria |
|---|-------|--------|---------------|
| 1 | All inputs | Test each input type the amp supports (RCA, high-level, digital if applicable) | All inputs produce clean output |
| 2 | Crossover / DSP functions | Sweep the input frequency and verify filter behavior (LP, HP, BP as applicable). If the amp has a built-in DSP, test presets | Filters engage at correct frequencies, slopes are reasonable |
| 3 | Bass boost / EQ | Engage any onboard EQ or bass boost | Boost is clean, no oscillation or clipping at the boosted frequency |
| 4 | Remote turn-on | Verify the amp turns on and off with the remote wire, not just with constant 12 V | Clean on/off, no thump, reasonable delay |
| 5 | Short-circuit protection | Briefly short one speaker output (with a heavy wire, not your fingers). **Do this with the signal level low** | Amp should enter protect mode, not blow output devices. After removing the short, the amp should recover (may need a power cycle) |
| 6 | Thermal protection | If you can safely induce thermal stress (block airflow, reduce heatsinking), verify the amp shuts down before anything gets damaged | Protect engages before critical temperature. Amp recovers after cooldown |
| 7 | Reverse polarity protection (if equipped) | Some amps have reverse polarity diodes or FETs. If you know the amp has this, briefly reverse B+ and GND at low voltage. **Skip this if you aren't sure — reverse polarity on an unprotected amp is destructive** | Amp does not power on, no damage |

## Phase 6: Reassembly and Final Check

| # | Check | Method | Pass criteria |
|---|-------|--------|---------------|
| 1 | Reassemble into enclosure | Replace heatsink, cover, any thermal pads or paste. Torque heatsink screws evenly | All hardware secure, thermal interface intact |
| 2 | Post-reassembly power-up | Repeat Phase 2 checks (idle current, rail voltages, DC offset) | Same results as before reassembly. If something changed, the reassembly disturbed a connection |
| 3 | Brief signal check after reassembly | 1 kHz sine, moderate power, all channels | Clean output, no new issues |
| 4 | Final thermal run | 10+ minutes at moderate power in the closed enclosure | Temperature stabilizes within safe range. Fan operates if equipped |

## Confidence Checklist

Check off the level you've actually reached:

- [ ] **Boots** — Powers on, comes out of protect, draws reasonable idle current
- [ ] **Stable** — All channels produce clean audio, DC offset is low, no protect trips at moderate power
- [ ] **Reliable** — Passes full-power stress test, thermal soak, power cycling, and protection tests

Be honest. If you only got to "Stable," don't put it back in a car and push it hard on the first drive.

## Notes on Bench vs. Car

A bench verification gets you to "Reliable" under controlled conditions. The car environment adds:

- **Voltage swings** — Alternator output ranges from ~13.5 V (running) to ~14.4 V (charging hard). Battery voltage drops to ~12.0 V or below with the engine off, and can dip further during cranking. If your bench supply was locked at 13.8 V, you haven't tested the extremes
- **Ground loops** — The car chassis is the ground, and it's shared with everything else. Noise that doesn't exist on the bench may appear in the car
- **Vibration** — Continuous vibration stresses solder joints and connectors. A marginal joint that passes bench testing may fail on the road
- **Heat** — Trunk-mounted amps in summer can see ambient temperatures over 50°C before they even turn on

A clean bench verification is necessary but not sufficient. The final test is always in the vehicle.
