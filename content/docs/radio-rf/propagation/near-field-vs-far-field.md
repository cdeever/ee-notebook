---
title: "Near-Field vs Far-Field"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Near-Field vs Far-Field

The space around an antenna is not uniform. Close to the antenna, electromagnetic fields are complex, reactive, and tightly coupled to the antenna structure. Farther away, the fields detach and propagate as free-running waves. The boundary between these regions matters enormously — it determines how signals couple, how antennas are measured, and why some wireless technologies work only at close range.

## Three Regions Around an Antenna

The space around any antenna divides into three regions, each with different physics:

**Reactive near-field:** Extends from the antenna surface to approximately lambda/(2*pi), or about 0.16 wavelengths. In this region, the electric and magnetic fields are out of phase and energy sloshes back and forth between the antenna and the surrounding space. Power is stored, not radiated. The impedance of the field varies wildly with distance and direction — it is not the 377 ohms of free space.

**Radiating near-field (Fresnel region):** Extends from the reactive boundary to roughly 2*D^2/lambda, where D is the largest dimension of the antenna. In this region, energy does radiate outward, but the field pattern changes shape with distance. The wavefront is not yet planar — it is still curved and varies in both amplitude and phase across the aperture.

**Far-field (Fraunhofer region):** Beyond 2*D^2/lambda, the fields propagate as plane waves. The radiation pattern is stable — it does not change shape with distance. The electric and magnetic fields are in phase, perpendicular to each other and to the direction of propagation, and the wave impedance settles to approximately 377 ohms. This is the region where free-space path loss formulas apply.

## Boundary Distances at Common Frequencies

| Frequency | Wavelength | Reactive boundary (lambda/2*pi) | Far-field boundary (example) |
|-----------|-----------|-------------------------------|------------------------------|
| 13.56 MHz (NFC) | 22.1 m | 3.5 m | Antenna-dependent |
| 433 MHz | 69 cm | 11 cm | ~1.5 m (for 10 cm antenna) |
| 915 MHz | 33 cm | 5.2 cm | ~1.2 m (for 15 cm antenna) |
| 2.4 GHz | 12.5 cm | 2.0 cm | ~2 m (for 10 cm patch array) |
| 5.8 GHz | 5.2 cm | 0.8 cm | ~8 m (for 30 cm dish) |

The far-field boundary (2*D^2/lambda) depends on antenna size. A small dipole at 2.4 GHz has its far-field within centimeters. A 30 cm dish antenna at 5.8 GHz does not reach the far-field until about 8 meters. This distinction matters whenever antennas are tested or measured.

## What Happens in the Near-Field

In the reactive near-field, the fields do not behave like propagating waves. Key differences:

**Impedance varies with distance.** An electric dipole antenna creates a predominantly electric field close in, with impedance much higher than 377 ohms. A magnetic loop antenna creates a predominantly magnetic field close in, with impedance much lower than 377 ohms. Only in the far-field do both converge to 377 ohms.

**Fields decay faster than 1/r.** Reactive fields decay as 1/r^2 or 1/r^3, much faster than the 1/r decay of far-field radiation. This rapid decay is why near-field coupling is inherently short-range.

**Coupling is mutual.** An object in the near-field loads the antenna — it changes the antenna's impedance, resonant frequency, and radiation pattern. In the far-field, a receiving antenna has negligible effect on the transmitter. In the near-field, the two are coupled and influence each other.

**Phase relationships are complex.** The electric and magnetic fields are not in phase with each other. Energy oscillates between the antenna and the surrounding space rather than propagating outward. This stored energy is the reactive component that gives the region its name.

## Near-Field Technologies

Several practical technologies deliberately exploit near-field coupling:

**NFC (Near Field Communication):** Operates at 13.56 MHz, where the wavelength is 22 meters. At typical operating distances of a few centimeters, the system is deep in the reactive near-field. NFC uses inductive coupling between coils — there is no radio propagation in the conventional sense. The short range is a security feature.

**RFID:** Passive RFID at 13.56 MHz (HF) uses near-field inductive coupling, similar to NFC. UHF RFID at 860-960 MHz operates in the far-field and works by backscatter — a fundamentally different mechanism despite the similar-sounding application.

**Wireless charging (Qi):** Operates at around 100-200 kHz, with wavelengths of 1.5-3 km. At centimeter coupling distances, this is extremely deep in the near-field. The system is essentially an air-gapped transformer, transferring power through magnetic coupling.

## Why Antenna Measurements Require the Far-Field

Antenna gain and radiation patterns are defined in the far-field. Measuring in the near-field gives misleading results because:

- The pattern shape changes with distance in the near-field
- Amplitude and phase vary across the aperture
- Mutual coupling between test antenna and antenna under test distorts measurements

For a 30 cm dish at 5.8 GHz, the far-field starts at about 3.5 meters. For a 1-meter dish at 10 GHz, the far-field starts at about 67 meters. Building an indoor test range that large is impractical, which is why near-field antenna measurement techniques exist — they measure amplitude and phase on a surface close to the antenna and use mathematical transforms to compute the far-field pattern. This is sophisticated work requiring specialized equipment, not a typical bench measurement.

For small antennas (dipoles, chip antennas, small patches), the far-field distance is modest and direct measurement in an anechoic chamber is practical.

## Near-Field Probing for EMC Debugging

Near-field probes are small loop or stub antennas used to sniff electromagnetic fields very close to a circuit board. Because near-field coupling decays rapidly with distance, a near-field probe can localize emissions to specific components, traces, or board features.

A typical EMC debugging workflow: scan the board with a near-field probe connected to a spectrum analyzer, identify which component or trace is radiating most strongly, then address the issue with shielding, filtering, or layout changes. The near-field probe's spatial resolution improves with proximity to the board — within millimeters, individual IC pins or trace segments become distinguishable.

This works precisely because near-field coupling is localized. A far-field measurement (antenna across the room) reveals that the board is radiating but not where. A near-field probe reveals where but does not directly predict far-field emission levels.

## Tips

- Always calculate 2*D^2/lambda for the specific antenna before attempting antenna pattern measurements — the result determines the minimum measurement distance
- When debugging EMC issues, use a near-field probe connected to a spectrum analyzer to localize emission sources to individual components or traces before applying broad fixes
- For NFC and Qi wireless charging designs, test with real-world loading objects (hands, phone cases, metal surfaces) in the near-field, since these directly affect antenna tuning and coupling efficiency
- When placing chip antennas on a PCB, maintain at least a few millimeters of clearance from ground pours and metal components to avoid near-field detuning

## Caveats

- **Far-field distance depends on antenna size, not just frequency** — A small chip antenna at 2.4 GHz reaches the far-field within centimeters; a large antenna array at the same frequency may not reach the far-field for several meters; always calculate 2*D^2/lambda for the specific antenna
- **Near-field measurements do not predict far-field performance** — A strong near-field reading does not necessarily mean strong far-field radiation; near-field probing is useful for finding emission sources, but compliance testing requires far-field or calibrated near-field measurements
- **Objects in the near-field change the antenna** — A hand near an NFC antenna detunes it; a metal case touching a 2.4 GHz antenna shifts its resonance; near-field loading is mutual — the antenna and the environment are coupled; this is why antenna placement on a PCB requires careful consideration of nearby components and enclosure walls
- **RFID "near-field" and "far-field" are not just about distance** — HF RFID (13.56 MHz) uses near-field inductive coupling; UHF RFID (900 MHz) uses far-field backscatter; these are fundamentally different mechanisms with different range, antenna, and protocol characteristics; the frequency choice dictates the physics
- **377 ohms is free-space wave impedance, not antenna impedance** — The 377-ohm impedance of free space is the ratio of electric to magnetic field strength in a propagating wave; it has nothing to do with the 50-ohm or 75-ohm impedance conventions used for transmission lines and antenna feedpoints
- **Near-field does not mean "no radiation"** — Even in the reactive near-field, some energy radiates; the distinction is that most energy is stored reactively; the radiated component exists but is hard to separate from the reactive fields until the far-field is reached

## In Practice

- A near-field probe scanning across a PCB shows dramatically different emission levels at individual IC pins and trace segments — a hot spot at one pin versus a quiet adjacent pin indicates the source of radiated emissions
- When an NFC or wireless charging system exhibits inconsistent coupling range, the symptom is often near-field detuning caused by nearby metal objects or enclosure changes shifting the antenna resonance
- A chip antenna that measures good return loss on a bare board but poor return loss once enclosed in a case is exhibiting near-field loading from the enclosure walls
- Placing a hand near a 2.4 GHz antenna and observing RSSI drop on a connected receiver demonstrates mutual near-field coupling — the signal recovers immediately when the hand is removed
