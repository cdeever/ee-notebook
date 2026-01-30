---
title: "Antennas in Enclosures & Real Environments"
weight: 80
---

# Antennas in Enclosures & Real Environments

Every antenna datasheet shows performance in free space or over an idealized ground plane. The moment you put the antenna in a product — inside a plastic housing, near a battery, behind an LCD, inside a metal chassis — everything changes. Frequency shifts, patterns distort, efficiency drops, and the beautiful VSWR curve you measured on the bench turns into something unrecognizable. Designing for the installed environment rather than free space is what separates a working product from a frustrating prototype.

## How Enclosures Change Everything

An enclosure affects an antenna through several mechanisms:

**Dielectric loading.** Any material near the antenna's radiating fields changes the effective permittivity of the environment. This slows down the wave and makes the antenna appear electrically longer, shifting the resonant frequency downward. The closer the material is and the higher its dielectric constant, the larger the shift.

Typical frequency shifts due to enclosure materials:

| Material | Dielectric Constant (approx.) | Typical Frequency Shift | Notes |
|---|---|---|---|
| Air (no enclosure) | 1.0 | None (reference) | Free space |
| ABS plastic (thin shell) | 2.5-3.5 | -2% to -5% | Common for consumer electronics |
| Polycarbonate | 2.9-3.0 | -3% to -5% | Impact-resistant housings |
| FR4 (PCB material) | 4.2-4.8 | -5% to -10% | When PCB is near antenna |
| Glass (display cover) | 6-8 | -5% to -15% | Phone front panel |
| Liquid water | 80 | -30% or more | Wet environments, body proximity |

A 2.4 GHz antenna designed for free space might resonate at 2.3 GHz inside an ABS enclosure. This shifts it partially or entirely out of the WiFi band, degrading performance. The fix is to design the antenna for the enclosure, not for free space — which means the antenna must be tuned with the enclosure in place.

**Loss.** Dielectric materials absorb RF energy. The loss tangent of the enclosure material determines how much. ABS and polycarbonate have loss tangents around 0.005-0.01 at 2.4 GHz — not great, not terrible. FR4 has a loss tangent around 0.02, which is significant. Wet materials (wood, soil, human tissue) are much lossier.

**Pattern distortion.** The enclosure changes the antenna's radiation pattern by refracting, reflecting, and absorbing radiation in different directions differently. A theoretically omnidirectional pattern might become lopsided if one side of the enclosure is thicker, if the PCB shields one hemisphere, or if metal components inside the enclosure reflect energy.

## Plastic Enclosures

Plastic enclosures are the most common housing for wireless devices and are relatively transparent to RF — but "relatively" is doing heavy lifting in that sentence.

**Design considerations:**

- **Wall thickness matters.** A thicker wall has more dielectric effect. At 2.4 GHz, a 2 mm ABS wall shifts frequency less than a 5 mm wall. Keep enclosure walls thin near the antenna if possible.
- **Paint and coatings.** Metallic paint, conductive coatings, and metallic labels are opaque to RF. A "plastic" enclosure with an internal EMI coating is a metal box at RF frequencies. Even decorative metallic paint can attenuate signals by 5-15 dB.
- **Mounting bosses and screw posts.** Thick plastic features near the antenna add dielectric loading. Minimize plastic volume in the antenna's near field.
- **Environmental seals.** Rubber gaskets and O-rings have high dielectric constants (3-8) and can affect antenna performance if they're close to the radiating element.

**Best practices:**

- Position the antenna at the edge of the PCB, as far from the enclosure walls as practical (to minimize dielectric loading), but also as close to the outer surface as possible (to minimize material between the antenna and free space)
- Include the enclosure in the antenna design process from the start — don't design the antenna separately and hope it works in the enclosure
- Use enclosure material samples during antenna prototyping — hold the plastic near the antenna while measuring VSWR to estimate the shift

## Metal Enclosures

Metal enclosures are a completely different challenge. Metal is opaque to RF — a closed metal box is a Faraday cage, and no radiation gets in or out. Any antenna inside a sealed metal enclosure is useless.

**Approaches for metal-enclosed products:**

- **External antenna**: a connector (SMA, U.FL) through the enclosure wall to an external antenna. Simple but adds cost and a potential ingress point.
- **Slot antennas**: cut a slot in the metal enclosure and excite it as an antenna. The slot is the complement of a dipole (Babinet's principle). A half-wave slot at 2.4 GHz is about 6 cm long — practical for many enclosures. The enclosure becomes the antenna.
- **Aperture coupling**: a non-radiating antenna inside the enclosure couples through a window or slot to radiate from the outside surface. Used in some laptop and phone designs.
- **Dielectric window**: a section of the enclosure uses plastic instead of metal, creating an RF-transparent window. The antenna radiates through the window.

Slot antenna design is tricky because the rest of the enclosure (its size, shape, and what's inside) affects the slot's performance. Small changes to the enclosure — like a different screw location or a modified internal bracket — can shift the slot's resonant frequency.

## Keep-Out Zones Around PCB Antennas

Chip antennas and PCB trace antennas require clear space around them for the radiating fields. The antenna's near field extends several millimeters to centimeters depending on frequency and antenna type. Anything conductive in this zone couples to the antenna and degrades performance.

**Typical keep-out zone requirements (2.4 GHz):**

| Antenna Type | Keep-Out (no copper) | Keep-Out (no components) | Notes |
|---|---|---|---|
| Chip antenna (SMD) | 2-3 mm all sides | 5 mm from radiating edge | Per manufacturer datasheet |
| PCB inverted-F | 3-5 mm from element | 5-7 mm | Larger clear zone needed |
| PCB meandered dipole | 2-3 mm | 5 mm | Both arms need clearance |
| PCB slot antenna | 1-2 mm from slot edges | 3-5 mm | Ground plane defines slot |

**What happens when keep-out zones are violated:**

- **Copper trace in keep-out**: shifts frequency, degrades match, reduces efficiency. Even a thin signal trace can cause 1-2 dB efficiency loss.
- **Component in keep-out**: a tall component (like a capacitor or connector) near the antenna couples to the fields and detunes it. Metal-cased components (shielded ICs, connectors) are worse than plastic ones.
- **Ground plane extending into keep-out**: this is the most common mistake. The antenna is designed to radiate at the boundary between the ground plane and the keep-out zone. Extending ground copper into the clear area changes the antenna's effective length and impedance.

## The Impact of Nearby Objects

In deployed environments, the antenna's performance depends on what's near it:

**Human body.** The human body is mostly water (dielectric constant ~50-80 at RF frequencies, very lossy). A hand wrapped around a phone antenna can detune it by 50-100 MHz at 900 MHz and absorb 3-10 dB of the radiated power. This is the "death grip" effect that makes phone antenna design so challenging.

At 2.4 GHz, the body absorbs even more aggressively. A wearable device antenna in direct contact with skin can lose 6-10 dB compared to free-space operation. Some designs intentionally radiate away from the body (patch antenna with ground plane toward skin) to minimize this effect.

**Tables and surfaces.** A device sitting on a metal desk has a very different antenna environment than one on a wooden table or in mid-air. The metal surface acts as a reflector (good or bad depending on geometry), while the wooden table adds dielectric loading.

**Walls and structures.** Indoor environments create multipath that changes the apparent antenna performance. A WiFi access point antenna might perform well in one location and poorly in another, just meters away, due to constructive and destructive interference from wall reflections.

**Other electronics.** Nearby circuit boards, cables, and metal objects couple to the antenna. A USB cable plugged into a device can change the antenna impedance significantly — the cable shield becomes part of the antenna's ground system, altering the effective ground plane size and current distribution.

## Lab Performance vs Field Performance

The gap between lab measurements and field performance is one of the biggest challenges in antenna engineering. Some typical discrepancies:

| Parameter | Lab (free space / chamber) | Installed in Product | Difference |
|---|---|---|---|
| Resonant frequency | 2.44 GHz (on target) | 2.38 GHz (shifted low) | -60 MHz |
| VSWR at 2.44 GHz | 1.2:1 | 2.5:1 | Match degraded |
| Peak gain | 2 dBi | -1 dBi | 3 dB loss from enclosure + ground |
| Efficiency | 65% | 30% | Body/environment loss |
| Radiation pattern | Smooth, omnidirectional | Lumpy, directional | Ground plane, enclosure effects |

These differences aren't unusual — they're typical. The lesson: always measure the antenna in its final configuration, not just on the bench.

## Design for the Installed Environment

The practical workflow for product antenna design:

1. **Start with simulation** using the actual enclosure geometry, PCB layout, and expected nearby materials. Include the ground plane, battery, LCD, and any metal structures.
2. **Prototype early** with the real enclosure. 3D-print a mock enclosure if the final one isn't ready, using similar material and wall thickness.
3. **Measure in-situ**: put the prototype in the enclosure on a representative surface (not a metal test bench) and measure S11. Compare to simulation.
4. **Tune for the installed condition**: adjust the antenna length, matching network, or both to optimize performance in the enclosure, not in free space.
5. **Test with human interaction**: hold the device, place it in a pocket, set it on a table. Measure each condition. Design the matching network for the worst-case condition that must still meet specifications.
6. **Verify range performance**: ultimately, the antenna is judged by its contribution to communication range. A range test (or over-the-air test) in a representative environment is the final validation.

## Gotchas

- **Free-space antenna data is a starting point, not a specification** — The antenna will behave differently in your product. Budget time and iterations for in-situ tuning.
- **Metallic paint is invisible to the eye but opaque to RF** — A single coat of metallic or conductive paint on the inside of a plastic enclosure can add 10+ dB of attenuation. Verify that decorative coatings are RF-transparent.
- **The enclosure is part of the antenna** — For slot antennas and antennas with metal chassis as ground planes, the enclosure is literally part of the radiating structure. Changing the enclosure design changes the antenna.
- **Screw position matters** — A metal screw near a PCB antenna or slot antenna couples to the fields and shifts performance. Moving a screw by 3 mm can change VSWR from 1.5:1 to 3:1 at 2.4 GHz.
- **Conformal coating on the PCB affects antenna performance** — Coating applied over a PCB trace antenna adds dielectric loading. Account for this in the design or keep coating away from the antenna area.
- **"It worked on the eval board" is not a valid antenna design** — Evaluation boards from module vendors have specific PCB sizes and layouts optimized for their antenna. Your product has a different PCB, different ground plane, and different enclosure. The antenna must be re-tuned for your design.
