---
title: "High-Speed Effects"
weight: 30
---

# High-Speed Effects

At some edge rate, digital signals stop behaving like simple voltage levels and start behaving like electromagnetic waves. Traces become transmission lines. Edges become broadband RF events. Crosstalk between traces is not just annoying — it corrupts data. And the PCB itself, with its dielectric losses, via discontinuities, and plane resonances, becomes an active participant in the signal path rather than a passive carrier.

"High-speed" is not defined by clock frequency alone. It's defined by edge rate — the rise and fall times of the signals. A 10 MHz signal with sub-nanosecond edges has the same high-speed challenges as a 1 GHz signal. The physics doesn't care about the repetition rate; it cares about how fast the voltage changes.

## Edges Are Analog Events

A digital signal transitions from LOW to HIGH (or HIGH to LOW) over a finite time — the rise time or fall time. During this transition, the signal passes through the linear (analog) region of every gate it drives. The voltage is changing continuously, not instantaneously.

**Spectral content of a digital edge:**

The frequency content of a signal is determined by its transitions, not its fundamental frequency. The bandwidth of a trapezoidal waveform:

- Spectrum is flat up to f_knee1 = 1 / (pi x T_period)
- Rolls off at -20 dB/decade above f_knee1
- Second knee at f_knee2 = 1 / (pi x t_rise)
- Rolls off at -40 dB/decade above f_knee2

**Practical implication:** A signal with 200 ps rise time has significant spectral content up to ~1.6 GHz, regardless of whether the clock frequency is 10 MHz or 1 GHz. The PCB layout, termination, and shielding must handle these frequencies even if the "data rate" is low.

## Why Fast Digital Becomes RF

When the rise time is comparable to or shorter than the signal's propagation time across the PCB trace, the wave nature of the signal dominates. The signal is no longer a voltage that appears instantaneously everywhere on the trace — it's a wave that travels at a finite speed (~6 inches per nanosecond on FR4), reflects off discontinuities, and interferes with itself.

**At this point, all RF rules apply:**
- Impedance matching and termination are mandatory (see [Signal Integrity Basics]({{< relref "/docs/digital/data-transfer-and-buses/signal-integrity-basics" >}}))
- Trace geometry determines characteristic impedance
- Vias, connectors, and component pads are discontinuities that cause reflections
- The ground plane is not just a return path — it's part of the transmission line structure
- Radiation increases (the board is an unintentional antenna)

**The 1/6 wavelength rule:** When a trace length exceeds 1/6 of the signal's wavelength (at the knee frequency), transmission line effects become significant. For a 1 ns rise time (f_knee ≈ 350 MHz, wavelength ≈ 19 inches on FR4), any trace longer than ~3 inches needs SI attention.

## Crosstalk at High Speed

Crosstalk is capacitive and inductive coupling between adjacent traces. At low speeds, coupling is weak and transient. At high speeds, coupling is strong and can corrupt data.

**Capacitive crosstalk** — An aggressor edge couples charge onto the victim trace through the parasitic capacitance between them. The noise pulse appears at both ends of the victim, with the same polarity as the aggressor edge.

**Inductive crosstalk** — A changing current in the aggressor creates a changing magnetic field that induces voltage in the victim. The noise pulse appears at the near end with the same polarity as the aggressor and at the far end with the opposite polarity.

**In microstrip (outer layer, one ground plane):** Both mechanisms contribute, and far-end crosstalk (FEXT) can be significant. FEXT adds up along the coupled length — longer parallel runs produce more crosstalk.

**In stripline (inner layer, between two ground planes):** Capacitive and inductive coupling cancel at the far end, producing near-zero FEXT. Stripline routing is preferred for high-speed signals that run near aggressors.

**Reducing crosstalk:**
- Increase trace spacing. The coupling coefficient drops rapidly with distance (roughly as the square of the separation for loosely coupled lines)
- Use ground planes — they confine fields and reduce coupling
- Minimize parallel run length between aggressors and victims
- Route sensitive signals on inner layers (stripline)
- Use differential signaling — the coupling is common-mode and rejected by the differential receiver

## Controlled Impedance

At high speed, every trace is a transmission line with a characteristic impedance determined by its geometry and the surrounding dielectric.

**Single-ended impedance** is typically targeted at 50 ohm (industry standard for most digital interfaces). The trace width for 50 ohm depends on the PCB stackup — dielectric thickness, dielectric constant, and copper weight.

**Differential impedance** is typically targeted at 100 ohm (two traces forming a differential pair). The impedance depends on trace width, spacing, and dielectric geometry.

**Why 50 ohm?** It's a compromise between minimum attenuation (which favors higher impedance) and maximum power handling (which favors lower impedance). For coaxial cable, the minimum attenuation impedance is ~77 ohm and the maximum power impedance is ~30 ohm; 50 ohm is a practical midpoint that became the standard.

**Impedance discontinuities at high speed:**
- **Connectors** — Most board-to-board and cable connectors have characteristic impedances that differ from 50 ohm. The transition from trace to connector and back creates reflections. High-quality connectors are impedance-matched
- **Vias** — A via transitions the signal between layers, passing through a different geometry. The via barrel and pads create a localized capacitive discontinuity. At multi-GHz speeds, via design (anti-pad size, back-drilling, stub length) is critical
- **Component pads** — The pad geometry for IC pins is wider than the trace, creating a capacitive bump. Ground vias near the pad reduce the effect
- **Plane splits** — If a signal crosses a gap in its reference plane, the return current must detour, causing a massive impedance discontinuity

## Dielectric Loss and Skin Effect

At very high frequencies (multi-GHz), the PCB material itself attenuates the signal.

**Dielectric loss:** The FR4 dielectric absorbs electromagnetic energy, and the loss increases with frequency. At 1 GHz, a 10-inch FR4 trace might lose 3-5 dB. At 10 GHz, the loss can be 10-20 dB — the signal is dramatically attenuated. Low-loss dielectrics (Megtron, Rogers) reduce this for high-speed designs.

**Skin effect:** At high frequencies, current flows only in a thin layer (the "skin depth") on the surface of the conductor. This increases the effective resistance and thus the attenuation. Skin depth at 1 GHz in copper is about 2 um — much thinner than a typical PCB trace.

**Combined effect:** The channel (trace + vias + connectors) acts as a low-pass filter. High-frequency components of the signal are attenuated more than low-frequency components, turning sharp edges into rounded, low-amplitude signals. At the receiver, the "eye" closes — the voltage difference between HIGH and LOW shrinks, and the timing margin decreases.

**Equalization** compensates for this channel loss. Transmitter pre-emphasis boosts high-frequency content before it enters the channel. Receiver equalization (CTLE, DFE) restores the attenuated high-frequency content. Modern multi-gigabit SerDes (PCIe, USB 3.x, Ethernet) rely heavily on equalization.

## EMI and Radiation

Fast edges radiate electromagnetic energy. The PCB traces act as antennas, and the radiated energy can interfere with nearby circuits or violate regulatory emissions limits (FCC, CE).

**Common radiation mechanisms:**
- **Differential-mode radiation** — Signal current flowing on the trace and returning through the ground plane forms a loop. The loop area and the current's frequency content determine the radiated field. Minimizing loop area (keeping the signal trace close to its return path) reduces radiation
- **Common-mode radiation** — When the return current is not directly beneath the signal trace (because of a plane split, via transition, or connector), the imbalance creates common-mode current that radiates efficiently. Common-mode radiation is often the dominant EMI mechanism
- **Cable radiation** — Cables connected to the board act as antennas for common-mode currents. Proper filtering and shielding at cable entry points are essential for EMI compliance

**Reducing EMI:**
- Maintain solid, unbroken ground planes
- Minimize loop areas in high-speed signal paths
- Use differential signaling where possible (inherently low radiation)
- Filter high-frequency content at board edges and connectors
- Reduce edge rates to the minimum required for the application (slower edges = less high-frequency content = less radiation)

## Gotchas

- **Edge rate, not clock frequency, determines high-speed challenges** — A 74AUC buffer toggling at 1 MHz with 300 ps edges has the same SI and EMI challenges as a 1 GHz SerDes. Don't use faster logic families than necessary; the edge rate determines the bandwidth of the noise and radiation
- **FR4 is lossy above 5 GHz** — For interfaces operating at 10 Gbps and above, standard FR4 may not be adequate. Low-loss dielectrics (Megtron 6, Rogers 4350) reduce channel attenuation but increase board cost. The choice depends on trace length and data rate
- **Ground bounce is a high-speed effect** — Simultaneous switching of many outputs creates high dI/dt current transients that cause ground bounce. This is not a power supply problem — it's an inductance problem in the ground path. Minimizing ground path inductance (multiple ground vias, wide ground planes, short package leads) is the solution. See [Power Integrity]({{< relref "power-integrity" >}})
- **Decoupling and signal integrity are coupled** — Power rail noise from switching transients modulates the output voltage of every driver. A driver with a 100 mV ground bounce has its output shifted by 100 mV, which directly reduces the noise margin of every signal it drives. PI and SI must be designed together
- **"It passed simulation" is not enough** — SI simulation models the ideal trace geometry, nominal dielectric properties, and typical component models. Real boards have manufacturing tolerances (±10% trace width, ±5% dielectric constant, copper roughness). Margin analysis across these tolerances is necessary for reliable high-speed design
- **Probing high-speed signals is itself a high-speed problem** — A standard oscilloscope probe adds 8-12 pF and 5-10 nH to the node. This changes the signal enough to mask the actual behavior. Active probes, differential probes, and proper probing techniques are essential for accurate high-speed measurement
