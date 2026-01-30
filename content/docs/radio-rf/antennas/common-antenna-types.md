---
title: "Common Antenna Types"
weight: 20
---

# Common Antenna Types

Choosing an antenna is about tradeoffs. Every antenna type sacrifices something — size, bandwidth, gain, complexity, or cost — to optimize something else. There's no "best" antenna, only the best antenna for a specific application. This page surveys the types I keep encountering, with enough detail to understand their characteristics and know when to reach for each one.

## Half-Wave Dipole

The half-wave dipole is the reference antenna that everything else is compared to. It's simply two conductors, each a quarter-wavelength long, fed at the center. At resonance, the impedance is approximately 73 + j0 ohms in free space, and the gain is 2.15 dBi (0 dBd by definition).

The radiation pattern is omnidirectional in the plane perpendicular to the wire (the H-plane) and has nulls off the ends. This "donut" pattern is ideal for general-purpose communication where you don't know the direction to the other station.

A half-wave dipole at 146 MHz is about 97 cm total length (shorter than the free-space half wavelength of 103 cm due to the end effect — charge bunches at the wire tips, making the antenna electrically longer than its physical length). At 2.4 GHz, it's about 6 cm — small enough for a PCB.

The dipole's bandwidth (defined as VSWR < 2:1) is typically 5-10% of the center frequency, depending on the wire diameter. Thicker elements give wider bandwidth.

## Quarter-Wave Monopole

A quarter-wave monopole is half of a dipole, mounted over a ground plane. The ground plane acts as an electrical mirror, making the antenna behave as if the missing half were present. The impedance is about half that of a dipole — roughly 36 + j0 ohms over a perfect ground plane.

The gain is 5.15 dBi over a perfect infinite ground plane (the ground reflects all energy upward, effectively doubling the gain in the upper hemisphere). In practice, ground planes are finite and imperfect, so real gain is lower.

Monopoles are everywhere: car radio antennas, WiFi antennas, rubber duck antennas on handheld radios. They're simple, omnidirectional (in the horizontal plane), and require only a single conductor plus a ground connection.

## Loop Antennas

Small loop antennas (circumference much less than a wavelength) are primarily used for receiving. They have very low radiation resistance (often a fraction of an ohm) and correspondingly poor efficiency as transmit antennas. But they have a useful property: they respond to the magnetic component of the field and are less susceptible to electric-field noise from nearby sources.

Full-wave loop antennas (circumference approximately one wavelength) are effective for both transmit and receive. A circular full-wave loop has about 3.4 dBi gain and 100-120 ohms impedance. Loops can be square, rectangular, triangular (delta loop), or any convenient shape — the performance is similar as long as the total perimeter is about one wavelength.

## Patch/Microstrip Antennas

Patch antennas are flat rectangular or circular conductors over a ground plane, separated by a dielectric substrate. They're compact, low-profile, and easy to fabricate on PCBs, making them the antenna of choice for GPS receivers, WiFi modules, and many IoT devices.

A typical rectangular patch resonates when its length is approximately half a wavelength in the dielectric. The gain is typically 5-7 dBi, and the bandwidth is narrow — 1-5% depending on the substrate thickness and dielectric constant. Thicker substrates with lower dielectric constant give wider bandwidth but larger antennas.

Patch antennas radiate primarily in one hemisphere (away from the ground plane), which can be advantageous when you want to avoid radiation in certain directions.

## Yagi-Uda

The Yagi-Uda (usually just called "Yagi") is the classic directional antenna — the type you see on rooftops for TV reception. It consists of a driven element (a dipole), a reflector behind it, and one or more directors in front.

Each director is slightly shorter than the driven element, and the reflector is slightly longer. The spacing and lengths create a traveling-wave effect that concentrates radiation in the forward direction. More directors = more gain = narrower beam = longer boom.

A 3-element Yagi (reflector, driven element, one director) has about 7-8 dBi gain and a front-to-back ratio of 15-20 dB. A 5-element Yagi gets about 10-11 dBi. Longer Yagis can reach 15-17 dBi with 10+ elements, but become mechanically unwieldy and very narrowband.

The main limitation is bandwidth — typically 2-5% for a well-designed Yagi. This makes them ideal for amateur radio (where you operate on a specific band) but poorly suited for wideband applications.

## Helical Antennas

A helical antenna is a conductor wound in a helix. In axial mode (when the circumference is approximately one wavelength), it produces circular polarization and moderate gain (10-15 dBi for a helix of 5-10 turns). This makes it popular for satellite communication, where circular polarization eliminates the need for polarization alignment between ground and satellite.

In normal mode (when the helix is much smaller than a wavelength), it behaves like a short dipole or monopole with a broader radiation pattern. Rubber duck antennas on handheld radios are normal-mode helicals — they're electrically short but physically compact.

## Wire vs PCB vs Chip Antennas

For compact products, the choice between wire antennas, PCB trace antennas, and ceramic chip antennas involves significant tradeoffs:

**Wire antennas** (whip, coil, helix) typically have the best efficiency because they can be designed with physical dimensions close to the optimal electrical length. A quarter-wave whip for 915 MHz is about 8 cm — acceptable for many products. For 2.4 GHz, it's about 3 cm.

**PCB trace antennas** (meandered inverted-F, meandered dipole, slot) are printed directly on the circuit board, costing nothing in assembly. They offer good efficiency when properly designed with adequate ground plane size and clearance. The main challenge is that they're sensitive to PCB layout, ground plane size, and nearby components.

**Chip antennas** (ceramic SMD packages from manufacturers like Johanson, Antenova, Fractus) are the smallest option — typically 2-7 mm in length. They're easy to integrate but have the lowest efficiency (typically -3 to -6 dB or worse) and the narrowest bandwidth. They also require careful ground plane design and keep-out zones specified in the datasheet.

## Comparison Table

| Antenna Type | Gain (dBi) | Bandwidth | Size (relative to lambda) | Impedance | Polarization | Best For |
|---|---|---|---|---|---|---|
| Half-wave dipole | 2.15 | 5-10% | 0.5 lambda | ~73 ohms | Linear | Reference, general use |
| Quarter-wave monopole | 2-5 | 5-10% | 0.25 lambda + ground plane | ~36 ohms | Linear (vertical) | Handheld, vehicle-mount |
| Small loop | -10 to 0 | Very narrow | << lambda | Very low | Linear | Receive-only, direction finding |
| Full-wave loop | 3.4 | 5-10% | ~0.32 lambda diameter | ~100-120 ohms | Linear | HF, limited space |
| Patch/microstrip | 5-7 | 1-5% | ~0.5 lambda x 0.5 lambda | ~50-300 ohms (feed-dependent) | Linear or circular | GPS, WiFi, IoT |
| Yagi-Uda (3 el.) | 7-8 | 2-5% | ~0.5 lambda boom | ~20-50 ohms | Linear | Directional comm, amateur |
| Helical (axial) | 10-15 | 15-25% | ~0.32 lambda diameter | ~140 ohms | Circular | Satellite, space comm |
| Chip antenna | -3 to 2 | 2-8% | << lambda | Varies (matched) | Linear | IoT, compact products |
| PCB trace (IFA) | 0-3 | 3-8% | < 0.25 lambda | ~50 ohms (designed) | Linear | WiFi, Bluetooth, IoT |

## Gotchas

- **"Omnidirectional" doesn't mean "isotropic"** — An omnidirectional antenna is uniform in azimuth but not in elevation. A vertical monopole has maximum gain at the horizon and zero gain straight up. It's omnidirectional in the horizontal plane only.
- **Published gain figures often use optimistic conditions** — Free space, infinite ground plane, or peak gain in the most favorable direction. Real-world gain is almost always lower than the spec sheet claims.
- **Small antennas sacrifice more than just gain** — They also have narrow bandwidth and are more sensitive to surroundings. The Chu-Harrington limit (see [Radiation Resistance & Efficiency]({{< relref "/docs/radio-rf/antennas/radiation-resistance-and-efficiency" >}})) sets the fundamental tradeoff.
- **Chip antenna datasheets are reference designs, not guarantees** — The performance specified assumes a particular PCB size, shape, ground plane, and component placement. Change any of these and the antenna performance changes too.
- **Yagi gain claims are often exaggerated** — A manufacturer claiming 15 dBi for a 5-element Yagi is almost certainly overstating. Check the boom length and compare to published Yagi gain curves.
- **Matching is part of the antenna, not separate** — A chip antenna or PCB antenna with a required matching network should be evaluated as a system. The matching network loss reduces the effective gain. A chip antenna with 2 dBi gain and a 1 dB matching loss gives 1 dBi in practice.
