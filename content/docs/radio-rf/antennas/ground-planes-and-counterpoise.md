---
title: "Ground Planes & Counterpoise"
weight: 50
---

# Ground Planes & Counterpoise

The concept of "ground" in antenna work is one of the most misunderstood topics I've encountered. It's not the same as safety ground, it's not the same as DC return, and it's not the same as the chassis ground on your oscilloscope. In antenna terms, a ground plane is the "other half" of a monopole antenna — the missing half of the dipole. Without it, the antenna doesn't work properly. Understanding what the ground plane actually does clears up a lot of confusion about why antenna performance changes when you move wires, resize PCBs, or bring your hand near the device.

## Why Monopoles Need Ground Planes

A monopole antenna is literally half of a dipole. The ground plane serves as an electrical mirror that creates a virtual image of the monopole below it — effectively completing the dipole. The currents flowing in the ground plane are the return currents for the antenna, and they radiate just as much as the currents in the monopole element.

For a quarter-wave monopole over a perfect infinite ground plane, the image theory is exact: the radiation pattern in the upper hemisphere is identical to the upper half of a dipole pattern, and the impedance is half the dipole impedance (~36 ohms vs ~73 ohms). The directivity is doubled compared to the dipole (5.15 dBi vs 2.15 dBi) because all the radiation goes into the upper hemisphere.

Remove the ground plane, and the monopole becomes a poor antenna. Without the return path, the current distribution changes, the radiation resistance drops, and the impedance becomes unpredictable. The antenna still radiates — any conductor carrying RF current will — but not efficiently or predictably.

## Ideal vs Real Ground Planes

The ideal ground plane is infinite in extent and perfectly conducting. Reality offers neither.

**Finite ground planes** cause several effects:

- **Edge diffraction**: currents reaching the edge of the ground plane radiate, creating ripples in the radiation pattern. The pattern is no longer smooth — it has lobes and nulls that depend on the ground plane size relative to the wavelength.
- **Impedance changes**: a finite ground plane shifts the antenna impedance from the ideal value. A monopole on a ground plane that's only 0.25 lambda in radius might have an impedance of 40-50 ohms instead of the ideal 36 ohms.
- **Back radiation**: with a finite ground plane, some radiation appears below the plane — energy that was supposed to be reflected upward leaks around the edges.

**Rule of thumb**: a ground plane should extend at least 0.25 lambda (a quarter wavelength) beyond the antenna element in all directions for reasonable performance. Larger is better, but returns diminish beyond about 1 lambda.

| Ground Plane Radius (in wavelengths) | Impedance Shift | Pattern Effect |
|---|---|---|
| Infinite (ideal) | None (36 ohms for quarter-wave) | Ideal half-space |
| 1.0 lambda | Minor (~1-2 ohms) | Slight ripple |
| 0.5 lambda | Moderate (~5 ohms) | Noticeable ripple, minor back lobe |
| 0.25 lambda | Significant (~10+ ohms) | Elevated pattern, back radiation |
| 0.1 lambda | Severe | Pattern distorted, low efficiency |

**Ground conductivity** matters for earth-ground systems (like HF vertical antennas). Salt water is nearly a perfect conductor at RF frequencies (conductivity ~5 S/m). Rich agricultural soil is decent (~0.03 S/m). Dry sandy soil or rock is poor (~0.001 S/m). A quarter-wave vertical over salt water has nearly ideal performance; over dry rock, the ground losses can absorb more power than the antenna radiates.

## Radial Ground Systems and Counterpoise

When you can't have a solid sheet ground plane (as with ground-mounted vertical antennas), radial wires laid on or buried in the ground approximate the ground plane function. The more radials, the better the approximation:

| Number of Radials | Ground Loss (typical) | Practical Notes |
|---|---|---|
| 4 | ~10-15 ohms | Minimum for acceptable performance |
| 16 | ~5-8 ohms | Good for portable operations |
| 32 | ~3-5 ohms | Diminishing returns begin |
| 60 | ~1-3 ohms | Approaching ideal for buried radials |
| 120 | ~1 ohm | Broadcast standard (AM radio) |

A **counterpoise** is an elevated radial system — wires run horizontally from the base of the antenna, elevated above the earth. Counterpoises are used when burying radials isn't practical. A single quarter-wave counterpoise wire creates a ground plane of sorts, but it's directional — the antenna pattern is skewed toward the side with the wire. Multiple counterpoise wires (at least 3-4, equally spaced) give a more symmetrical pattern.

The counterpoise doesn't need to touch the ground. In fact, it works by being a conductor that carries return current, not by "grounding" anything. This is a key conceptual point: the ground plane's role is electromagnetic, not electrical in the DC sense.

## PCB Ground Planes for Chip and Trace Antennas

For small wireless devices operating at 900 MHz, 2.4 GHz, or 5.8 GHz, the PCB ground plane is the antenna's ground plane. Getting it right is critical — and the datasheets for chip antennas are very specific about requirements.

**Typical requirements for a 2.4 GHz chip antenna:**

- Minimum ground plane size: 40 mm x 30 mm (about the size of a credit card)
- Keep-out zone: no copper (ground or traces) within 2-3 mm of the antenna element
- Antenna placement: at the PCB edge or corner, not in the center
- Ground plane must be continuous under the rest of the PCB (no slots or breaks near the antenna)

These dimensions are not arbitrary. At 2.4 GHz, a quarter wavelength is about 31 mm. The ground plane needs to be at least this large to function as an effective reflector. A PCB that's only 20 mm x 15 mm (common in tiny IoT sensors) simply doesn't have enough ground plane for a 2.4 GHz antenna to work well. The efficiency penalty can be 3-6 dB — half to a quarter of the power is lost.

**Common PCB antenna layout mistakes:**

- Placing the antenna in the center of the PCB instead of at the edge
- Running traces or pouring ground copper in the keep-out zone
- Using a ground plane that's too small for the operating frequency
- Cutting slots in the ground plane near the antenna (for routing signals) that disrupt current flow
- Mounting a battery or LCD directly behind the antenna

## Ground in Antennas vs Other "Grounds"

This distinction trips people up constantly. In electronics, "ground" has at least three different meanings:

1. **Safety ground (earth ground)**: the green wire connecting equipment chassis to the earth via the electrical system. Purpose: shock prevention. Has nothing to do with antenna function.

2. **DC return (circuit ground)**: the 0V reference for the circuit. May or may not be connected to earth. In battery-powered devices, it's floating relative to earth.

3. **RF ground plane**: a conductor that serves as the return path for antenna currents and as a reflector. It's an electromagnetic structure, not just an electrical connection.

These can overlap — a grounded metal chassis can serve as all three — but they're fundamentally different functions. Moving a safety ground wire might have zero effect on antenna performance. Moving a ground plane wire changes the antenna impedance, pattern, and efficiency.

## Why Moving a Ground Wire Changes Antenna Performance

Because the ground plane carries RF current, its geometry affects the antenna just as much as the radiating element. Moving a ground wire changes the current distribution, which changes the radiation pattern and impedance.

A concrete example: many handheld devices use the coaxial cable shield as part of the antenna ground plane. If you reroute the cable (say, during debugging), the antenna's impedance and pattern change. I've seen cases where moving a USB cable 2 cm shifted a 2.4 GHz antenna's resonance by 50 MHz and degraded the match from VSWR 1.3:1 to 3:1.

Similarly, adding or removing screws from a metal enclosure near the antenna changes the effective ground plane and can shift performance. This is why antenna measurements should always be done in the final mechanical configuration.

## Gotchas

- **A bigger ground plane is almost always better** — Up to about 1 wavelength radius, increasing the ground plane improves antenna performance. Beyond that, the improvement is marginal. But many practical designs are ground-plane-limited, and adding even a small amount of copper helps.
- **The ground plane radiates too** — It's not passive. Currents on the ground plane produce radiation. In a handheld phone, the ground plane (the PCB and chassis) often radiates more than the antenna element itself. This is why the phone's radiation pattern depends heavily on how you hold it.
- **Slot antennas are the inverse of wire antennas** — A slot in a ground plane is an antenna (Babinet's principle). An unintentional slot in a ground plane — like a gap between PCB sections — can radiate or couple signals in unexpected ways.
- **A counterpoise that's too short doesn't work as a ground plane** — A 10 cm wire is not a ground plane at 145 MHz (where a quarter wave is 51 cm). It might work at 700 MHz, though. The wire must be at least a quarter wavelength.
- **Battery and LCD placement affect the effective ground plane** — A lithium battery's foil pouch is conductive and can extend the effective ground plane — or shield the antenna if placed behind it. LCDs have conductive layers that interact with nearby antennas.
- **Connecting the antenna ground to "system ground" isn't enough** — The ground connection must be low impedance at the operating frequency. A long, thin trace from the antenna ground pad to the main ground plane adds inductance that decouples the ground at RF, even though it's connected at DC.
