---
title: "Antenna Height & Placement Effects"
weight: 60
---

# Antenna Height & Placement Effects

Antenna selection gets most of the attention in wireless system design, but placement often matters more. A good antenna mounted in a bad location can perform worse than a mediocre antenna mounted well. Height above ground, proximity to reflecting surfaces, Fresnel zone clearance, and orientation relative to the link all affect actual performance — sometimes by tens of decibels. This is where theory meets the physical reality of mounting hardware in real environments.

## Height Above Ground

For VHF and UHF frequencies, antenna height is one of the most powerful variables you can control. Raising the antenna extends the radio horizon, clears nearby obstacles, and reduces ground-reflection nulls.

The radio horizon distance (in kilometers) for an antenna at height h (in meters) is approximately:

**d = 4.12 * sqrt(h)**

| Antenna height | Radio horizon |
|---------------|---------------|
| 1.5 m (handheld) | 5.0 km |
| 5 m (rooftop, single story) | 9.2 km |
| 10 m (two-story rooftop) | 13.0 km |
| 30 m (tower) | 22.6 km |
| 100 m (tall tower) | 41.2 km |

For a link between two antennas, the total horizon distance is the sum of both horizon distances. Two antennas at 10 m height have a combined radio horizon of about 26 km.

In practice, raising an antenna from 1.5 m to 10 m often improves signal strength by 10-20 dB — not just from horizon extension but from clearing ground clutter, avoiding ground-reflection nulls, and getting above nearby absorbing objects (vegetation, vehicles, buildings).

## Fresnel Zones

Line-of-sight is necessary but not sufficient for a reliable RF link. The signal does not travel in a thin ray like a laser beam — it occupies a volume of space around the direct path. This volume is described by Fresnel zones, which are a series of concentric ellipsoids between transmitter and receiver.

The first Fresnel zone is the most important. Its radius at the midpoint of a link is:

**r1 = 17.3 * sqrt(d / (4 * f))**

Where r1 is in meters, d is the total link distance in kilometers, and f is the frequency in GHz.

| Link distance | Fresnel zone radius at 900 MHz | Fresnel zone radius at 2.4 GHz | Fresnel zone radius at 5.8 GHz |
|--------------|-------------------------------|-------------------------------|-------------------------------|
| 100 m | 2.9 m | 1.8 m | 1.1 m |
| 500 m | 6.4 m | 3.9 m | 2.5 m |
| 1 km | 9.1 m | 5.6 m | 3.6 m |
| 5 km | 20.3 m | 12.5 m | 8.0 m |
| 10 km | 28.8 m | 17.6 m | 11.3 m |

The rule of thumb: at least 60% of the first Fresnel zone must be clear of obstructions for the link to perform near its free-space potential. If the zone is partially blocked — by terrain, buildings, or vegetation — additional loss occurs beyond what free-space path loss predicts.

For a 5 km link at 900 MHz, the first Fresnel zone radius at midpoint is about 20 meters. This means that even with visual line of sight, if there is a tree line or building within 12 meters (60%) of the direct path at the midpoint, you will experience additional loss. This is a surprisingly large clearance requirement and is the most common reason that links that "should work" do not.

## Ground Reflections

The ground itself is a reflector. A signal traveling from transmitter to receiver is accompanied by a ground-reflected copy that arrives via a longer path. Whether these add constructively or destructively depends on the path length difference, which is determined by antenna height and link distance.

At low antenna heights, the direct and reflected paths are nearly equal in length and the reflected signal arrives approximately 180 degrees out of phase (due to the reflection phase shift from a conductive ground). This creates destructive interference and a weak signal. As antenna height increases, the path length difference increases, and the interference pattern cycles between constructive and destructive peaks.

The practical result: signal strength does not decrease smoothly with distance. Instead, it oscillates — with peaks and nulls that depend on height and frequency. At VHF/UHF, these oscillations can cause 20 dB swings in signal strength over a few hundred meters. Raising the antenna smooths out these variations by increasing the angle between direct and reflected paths.

Over water or flat ground (salt marshes, desert, parking lots), ground reflections are particularly strong because the surface is smooth and conductive. These environments can produce deep, persistent nulls at specific distances.

## Mounting Location

Where on a building or structure you mount the antenna matters:

**Edge vs center of rooftop:** An antenna at the edge of a flat roof benefits from ground gain — diffraction over the roof edge enhances the signal in the horizontal plane. An antenna at the center of a large flat roof may suffer because the roof itself blocks low-angle radiation and reflects signal back upward.

**Roof vs wall mount:** Roof mounting is usually superior because it provides maximum height and 360-degree clearance. Wall mounting biases coverage toward one direction and puts the building itself in the back lobe. Wall mounting is acceptable when coverage is needed primarily in one direction.

**Tower vs building:** A standalone tower provides the cleanest RF environment — no nearby reflecting surfaces to distort the pattern. A building-mounted antenna has the building as a large reflector and scatterer behind it, which skews the radiation pattern.

**Ground plane effects:** Many antennas (especially verticals and ground planes) require a conductive surface beneath them to form the lower half of the radiating structure. Mounting a ground-plane antenna on a non-conductive pole without a ground plane degrades its performance. A metal roof, a vehicle roof, or a purpose-built ground plane radials are suitable.

## Separation from Other Antennas

When multiple antennas are mounted nearby — common on commercial buildings and cell towers — they interact:

**Horizontal separation:** Antennas should be separated by at least several wavelengths horizontally to minimize mutual coupling. At 900 MHz (lambda = 33 cm), a minimum separation of 1-2 meters is typical. At 2.4 GHz, 0.5-1 meter may suffice.

**Vertical separation:** Vertically stacked antennas on a tower benefit from the different radiation pattern nulls at each height. Vertical separation of 1-2 meters is common for diversity or multiple-system installations.

**Isolation requirements:** Two co-located transmitters on nearby frequencies need enough isolation between their antennas to prevent one from overloading the other's receiver. Required isolation is typically 30-50 dB, which may need several meters of separation plus directional antennas or band-pass filtering.

## Practical Placement Advice

Based on patterns seen over many installations:

- **Higher is almost always better** for range and reliability, until structural and cost constraints dominate.
- **Clear the Fresnel zone** — do the calculation for your link distance and frequency. You may be surprised at how much clearance is needed.
- **Avoid metal surfaces within a wavelength** — nearby metal distorts the radiation pattern and detunes the antenna. If metal is unavoidable, include it in the design (as a ground plane or reflector) rather than ignoring it.
- **Cable loss increases with length and frequency** — a long cable run from a low mounting point may lose more signal than you gained by using a better antenna. At 5.8 GHz, LMR-400 cable loses about 0.36 dB/m. A 10-meter run costs 3.6 dB — more than the difference between many antenna choices. Mount the radio close to the antenna or use low-loss cable.
- **Polarization alignment matters** — a vertically polarized transmitter and a horizontally polarized receiver lose 20+ dB from polarization mismatch. Ensure both ends of a link use the same polarization, or use circular polarization if orientation is uncertain.

## Gotchas

- **Visual line of sight does not guarantee RF line of sight** — Fresnel zone clearance is required, not just an unobstructed view. A link that visually clears a hill by 2 meters may still lose 10-15 dB if the Fresnel zone is partially blocked.
- **Ground reflections create height-dependent nulls** — Moving an antenna up or down by as little as half a wavelength can change a null into a peak. If a link is marginal, try adjusting antenna height by 10-30 cm before making larger changes.
- **Cable loss is often the biggest loss in the system** — A 15-meter run of RG-58 at 2.4 GHz loses about 12 dB. That is more than the difference between a 3 dBi and a 15 dBi antenna. Use the shortest cable possible and the lowest-loss cable you can afford.
- **The building itself is part of the antenna environment** — A metal roof, HVAC equipment, or a parapet wall near the antenna affects the radiation pattern. Do not assume the antenna's datasheet pattern is what you will actually get once it is installed on a real structure.
- **Nearby antennas can detune each other** — Two antennas mounted close together on the same frequency band will couple and shift each other's resonant frequency and impedance. If adding a second antenna degrades the first, separation is insufficient.
- **Do not forget about snow and ice** — An antenna designed for summer conditions may detune or degrade significantly when covered in ice. Radomes help, but ice on a radome still adds loss and changes the electrical environment.
