---
title: "Amplifier Dummy Load"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Amplifier Dummy Load

A dummy load replaces the speaker during bench testing. It presents the same impedance as a speaker without producing sound, without risking a good driver, and without the mechanical and acoustic variables that make real speakers unreliable as test loads. When verifying an amplifier after repair — or characterizing one during design — a dummy load is essential.

## Why Not Just Use a Speaker?

- **Volume** — An amplifier at full power into a speaker on the bench is dangerously loud
- **Speaker protection** — If the amp has a fault (DC offset, oscillation, shorted output), it will damage or destroy the speaker
- **Consistency** — A speaker's impedance varies with frequency; the nominal "8 Ω" or "4 Ω" is only accurate at one frequency. A resistive dummy load is a known, flat impedance — measurements against it are repeatable
- **Safety** — No moving cone means no acoustic feedback, no vibrating objects, no accidentally shorting exposed terminals

## Design Rules

### Rule 1: Match the Impedance

The load impedance must match what the amplifier expects to drive.

| Application | Typical load impedance |
|-------------|----------------------|
| Home hi-fi | 8 Ω (sometimes 4 Ω) |
| Car audio | 4 Ω (sometimes 2 Ω) |
| PA / pro audio | 8 Ω, 4 Ω, or 2 Ω depending on configuration |
| Guitar amps | 4 Ω, 8 Ω, or 16 Ω (must match output transformer tap) |
| Headphone amps | 32 Ω, 50 Ω, 300 Ω, 600 Ω (varies widely) |

**Why it matters:** The amplifier's output stage is designed for a specific impedance. Testing into the wrong impedance gives misleading power readings and may stress the output devices differently than real operation.

- **Too high impedance:** The amp delivers less current and less power than rated. Won't reveal thermal or current-handling issues.
- **Too low impedance:** The amp delivers more current than rated. May trigger protection circuits, cause distortion, or damage output devices. Some amplifiers are rated for 2 Ω; many are not.

### Rule 2: Size for the Power

The load must absorb the amplifier's full continuous output without overheating.

**Calculate the requirement:**
- RMS power rating of the amplifier per channel
- Multiply by the number of channels being loaded simultaneously
- Add margin — resistors derate at high temperature

**Example:** A 100 W/channel stereo amplifier needs at least 100 W per load resistor, and you need two of them. A 200 W rating per resistor provides margin.

**Undersized loads fail:** A resistor run beyond its power rating heats up, its resistance changes, and eventually it fails open. Wirewound resistors may survive briefly; film resistors may burn.

### Rule 3: Keep It Resistive

At audio frequencies (20 Hz – 20 kHz), a purely resistive load is ideal. Inductance or capacitance changes the phase relationship between voltage and current, which can affect stability measurements and doesn't represent a real speaker load.

**Wirewound resistors:** Most high-power resistors are wirewound. Standard wirewound construction is slightly inductive, but the inductance is negligible at audio frequencies. For most amplifier testing, this is fine.

**Non-inductive wirewound:** If you need to test at higher frequencies or want to eliminate any inductance, use non-inductive wirewound resistors (bifilar wound or Ayrton-Perry wound). These cost more but are purely resistive to much higher frequencies.

**Reactive loads (advanced):** Real speakers have complex impedance — resistive at some frequencies, inductive at others, with resonant peaks. Some amplifier test standards specify a reactive dummy load that mimics this behavior. For repair verification and basic testing, a resistive load is sufficient.

### Rule 4: Manage the Heat

Dummy loads convert electrical power to heat. A 200 W load at full power dissipates 200 W of heat — equivalent to several light bulbs or a small space heater.

**Thermal management options:**

| Method | Capacity | Notes |
|--------|----------|-------|
| Free air (no heatsink) | 5–25 W | Only for low-power amps or short bursts |
| Chassis-mount resistors on aluminum plate | 50–200 W | Adequate for most testing with short duty cycles |
| Heatsink with passive convection | 100–500 W | Needs adequate airflow around the heatsink |
| Heatsink with forced-air cooling (fan) | 200–1000 W+ | Required for sustained high-power testing |
| Water-cooled (DIY or commercial) | 1000 W+ | For serious PA or pro audio testing |

**Thermal compound:** Between the resistor body and the heatsink, use thermal paste or pads — same as for mounting a transistor. Air gaps kill thermal transfer.

### Rule 5: Make Solid Connections

High current through loose connections causes arcing, heating, and unreliable measurements.

**Connection requirements:**
- Heavy gauge wire (12 AWG or heavier for high-power loads)
- Proper terminals — binding posts, banana jacks, or heavy spade lugs
- Tightened connections — inspect and re-tighten periodically
- Short leads — long leads add resistance and inductance

## Build Approaches

### Wirewound Power Resistors on a Heatsink

The most common DIY approach.

**Parts:**
- Wirewound power resistors — rated for the required impedance and power
- Aluminum heatsink or thick aluminum plate (¼" / 6 mm minimum)
- Thermal paste or thermal pads
- Binding posts or banana jacks
- Optional: 12 V fan for active cooling

**Combining resistors:** Use series and parallel combinations to achieve the target impedance and power.

| Target | Configuration | Example |
|--------|--------------|---------|
| 8 Ω, 200 W | Two 16 Ω 100 W in parallel | R_total = 8 Ω, P_total = 200 W |
| 4 Ω, 200 W | Four 16 Ω 50 W in parallel | R_total = 4 Ω, P_total = 200 W |
| 4 Ω, 200 W | Two 8 Ω 100 W in parallel | R_total = 4 Ω, P_total = 200 W |
| 2 Ω, 400 W | Four 8 Ω 100 W in parallel | R_total = 2 Ω, P_total = 400 W |

**Construction tips:**
- Bolt resistors flat against the heatsink, with thermal paste in between
- Keep internal wiring short and heavy gauge
- Add a small fan (12 V PC fan) for sustained tests
- Label the impedance clearly

### Commercial Dummy Loads

Purpose-built audio dummy loads are available from test equipment suppliers. Common ratings are 8 Ω for home audio; 4 Ω and 2 Ω models exist for pro and car audio.

**Advantages:**
- Properly rated and tested
- Often include a scope tap (attenuated output for safe oscilloscope connection)
- Some include multiple impedance settings

**Disadvantages:**
- More expensive than DIY
- May not match the exact impedance/power combination needed

### The Halogen Bulb Trick

A halogen bulb (car headlight, work light) works as a rough dummy load in a pinch. A 55 W H7 bulb presents roughly 2–3 Ω when hot.

**Limitations:**
- Resistance changes dramatically with temperature (cold filament is much lower resistance)
- Not suitable for accurate measurements
- Provides a visual power indicator (brightness)

Use only for quick smoke tests when a proper load isn't available.

## Using the Dummy Load

### Measuring Output Power

1. Connect scope or True RMS DMM across the load
2. Drive the amplifier with a sine wave at the frequency of interest (typically 1 kHz)
3. Read the RMS voltage (V_rms) across the load
4. Calculate: **Power = V_rms² / R_load**

**Example:** 28.3 V_rms across 8 Ω = 100 W

### Checking for Clipping

- Scope across the load while increasing drive level
- A clean sine should remain sinusoidal
- Flat tops and bottoms indicate clipping — the amp is at maximum clean output
- Note the voltage at clipping onset; calculate the corresponding power

### Checking for DC Offset

- DMM on DC voltage across the load with no signal input
- Should read < 50 mV for most amplifiers
- Significant DC offset (hundreds of mV or volts) indicates a fault — do not connect a speaker

A dummy load tolerates DC offset that would destroy a speaker voice coil. This is why you test with the dummy load first.

### Checking for Oscillation

- Scope across the load with and without signal
- Look for high-frequency hash, ringing on edges, or sustained oscillation
- Oscillation may appear only under load, only at certain power levels, or only with certain input conditions

## Multi-Channel and Bridged Testing

For multi-channel amplifiers (stereo, 4-channel, etc.), load all channels being tested simultaneously.

**Why all channels matter:**
- The power supply is shared — loading one channel affects the rails
- Thermal behavior differs under full load vs. single-channel
- Channel crosstalk and power supply sag only appear with realistic loading

**Bridged mode:** Bridging combines two channels to drive one load at higher voltage. The load sees doubled voltage, so power is roughly 4× per-channel power into double the impedance.

- If each channel is rated 100 W into 4 Ω, bridged mode delivers roughly 400 W into 8 Ω
- The dummy load must be rated accordingly

## Safety

- **Burns:** Resistors at full dissipation cause burns on contact. Don't touch during or immediately after testing.
- **Fire hazard:** Keep flammable materials away. A resistor run past its rating can glow red and ignite nearby materials.
- **Ventilation:** Hundreds of watts in an enclosed space heats up fast. Test in a ventilated area.
- **Secure connections:** Loose connections at high current arc and melt. Tighten terminals and inspect before each session.
- **Don't leave unattended:** Stay at the bench during sustained full-power tests, especially with DIY builds.
- **Guitar amps:** Tube amplifiers with output transformers can be damaged by operating without a load. Always connect the dummy load before powering on. Some solid-state amps are also not safe to run unloaded.

## In Practice

- A repaired amplifier should be tested into a dummy load before connecting a speaker — the load survives faults that would destroy drivers
- Power measurements on a dummy load are higher than real-world speaker power because speaker impedance rises at low and high frequencies
- If the load resistance drifts upward during testing, it's overheating — add more thermal capacity or reduce duty cycle
- For quick checks, one dummy load and channel switching is fine; for full characterization, load all channels simultaneously
