---
title: "Operating Regions"
weight: 20
---

# Operating Regions

Every active device has distinct operating regions, and the circuit's behavior depends entirely on which region the device is in. Moving between regions — intentionally or accidentally — changes the device from an amplifier to a switch to an open circuit. Understanding region boundaries is essential for both design and debugging.

## BJT Regions Revisited

### Active (Forward Active)

Where amplification happens. The transistor is a current-controlled current source: I_C = beta x I_B.

**Conditions:** V_BE > ~0.6 V (forward biased), V_CE > V_CE(sat) (~0.2-0.3 V for silicon).

**Behavior:** Output current is proportional to input current. The device has high output impedance. Small-signal parameters (g_m, r_pi, r_o) are valid.

### Saturation

The transistor is fully on — acting as a closed switch. Both junctions are forward biased.

**Conditions:** V_CE < V_CE(sat). The collector can't pull enough current to satisfy I_C = beta x I_B because the external circuit limits it.

**Behavior:** V_CE drops to a low, nearly fixed value (0.1-0.3 V). The transistor has low impedance between collector and emitter. Gain is lost. The base is "overdriven" — more base current flows than needed.

**Entering saturation accidentally** is a common amplifier failure mode: the output signal drives the collector voltage down until the transistor saturates, causing flat-topped (clipped) output waveforms.

### Cutoff

The transistor is fully off. Both junctions are reverse biased (or V_BE is below the turn-on threshold).

**Behavior:** No collector current flows (except nanoamps of leakage). The transistor is an open circuit between collector and emitter.

**Entering cutoff accidentally** clips the other half of the waveform — the output goes to VCC (or the collector supply voltage) and stays there.

## MOSFET Regions Revisited

### Cutoff (Sub-threshold)

V_GS < V_th. The channel doesn't exist. Drain current is effectively zero (sub-threshold leakage only).

### Linear (Triode / Ohmic)

V_GS > V_th, and V_DS < V_GS - V_th. The MOSFET behaves as a voltage-controlled resistor. Drain current depends on both V_GS and V_DS.

This is the "switch on" region for digital and power applications. R_DS(on) is the channel resistance.

### Saturation (Pinch-Off)

V_GS > V_th, and V_DS > V_GS - V_th. The channel is pinched off at the drain end. I_D depends primarily on V_GS, not V_DS.

This is the amplification region. The MOSFET is a voltage-controlled current source.

**Terminology trap:** MOSFET "saturation" and BJT "saturation" are completely different. MOSFET saturation is the high-impedance, constant-current region used for amplification. BJT saturation is the low-impedance, fully-on switch state.

## What Happens When You Leave the Intended Region

### Clipping

The most visible consequence. When an amplifier stage's output is driven to the supply rail (BJT enters saturation) or to ground (BJT enters cutoff), the output waveform is clipped flat. On an oscilloscope, this looks like the top, bottom, or both of the waveform are sliced off.

**Asymmetric clipping** means the Q-point isn't centered — the signal has more room to swing in one direction than the other. This is a biasing problem.

### Distortion Without Obvious Clipping

Even before hard clipping, the device's nonlinearity increases near the region boundaries. The gain isn't constant across the signal swing — it's higher in the middle and lower near the extremes. This creates harmonic distortion (new frequency components that weren't in the input).

### Crossover Distortion

In push-pull output stages (Class AB), the transition between the two output transistors creates a dead zone near zero signal. Both transistors are slightly off during the crossover, causing a notch in the output waveform. The bias current through both output transistors (the quiescent current) is set to minimize this crossover region.

### Recovery Time

When a transistor is driven into saturation or cutoff by a transient, it takes time to recover and return to the active region. BJT saturation recovery is limited by stored base charge (storage time). This delay can cause missed signal transitions, pulse width distortion, and timing errors.

## How to Verify the Operating Region

At the bench:

- **Measure V_CE (BJT) or V_DS (MOSFET)** — If V_CE < 0.3 V, the BJT is likely saturated. If V_DS is very low, the MOSFET is in the linear region
- **Measure V_BE or V_GS** — Confirms the device is turned on (V_BE > ~0.6 V for BJT, V_GS > V_th for MOSFET)
- **Check the output waveform** — Clipping on an oscilloscope immediately tells you the device is leaving the active region during part of the signal cycle
- **Measure collector/drain current** — Compare to the expected bias current. Significantly higher or lower suggests the wrong operating region

## Gotchas

- **Region boundaries are not sharp** — The transition from active to saturation is gradual. Gain starts to drop and distortion increases before the transistor is fully saturated
- **Temperature shifts region boundaries** — V_BE decreases about 2 mV/C, V_th decreases about 2-5 mV/C. A circuit at the edge of a region at room temperature may cross into the wrong region at elevated temperature
- **Load changes move the operating point** — A heavier load draws more current, which can push a transistor into saturation. A circuit that works with one load may clip with a heavier one
- **Transient excursions** — The bias point might be correct on average, but signal peaks can momentarily push the device out of the active region. The DC multimeter says everything is fine, but the oscilloscope shows clipping
