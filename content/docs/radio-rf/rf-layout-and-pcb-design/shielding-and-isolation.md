---
title: "Shielding & Isolation Techniques"
weight: 70
---

# Shielding & Isolation Techniques

RF energy goes where it wants, not where you want. Shielding is about controlling electromagnetic energy — keeping it inside a circuit block so it does not radiate, and keeping external energy outside so it does not interfere. At RF frequencies, even small openings leak energy, and the effectiveness of any shield depends on frequency, construction, and how well it is grounded.

## Why Shielding Matters

In a radio receiver, the input signal might be -100 dBm (0.01 picowatts). The local oscillator might be at +7 dBm (5 milliwatts). That is a 107 dB difference. If even a tiny fraction of the LO energy leaks into the receiver input, it overwhelms the signal. Similarly, digital switching noise from a microcontroller's clock harmonics can fall right on the receive frequency if not contained.

Shielding is not about perfect isolation — it is about enough isolation. A 40 dB shield reduces a +7 dBm interferer to -33 dBm, which might still be too strong for a sensitive receiver. A 60 dB shield reduces it to -53 dBm, which might be acceptable with additional filtering. The required isolation depends on the signal levels and sensitivity of the system.

## Shield Cans

Board-level shield cans are metal enclosures soldered to the PCB that cover a section of circuitry. They are the most common form of RF shielding on production boards.

**Soldered shield cans** are permanently attached during reflow soldering. They provide the best shielding because the solder joint creates a continuous ground connection around the perimeter. Typical isolation: 40-60 dB depending on frequency and construction quality.

**Snap-on or clip-on shields** use a frame soldered to the board and a removable lid that clips in place. This allows rework and debugging while the frame remains in place. The lid-to-frame interface has some leakage through the contact points, so isolation is typically 5-10 dB worse than a fully soldered can.

**Two-piece shields** combine a soldered frame with a snap-on lid. The frame is soldered during initial assembly, providing a ground perimeter. The lid can be removed for rework. This is the most common approach in production RF designs.

Design considerations for shield cans:

- The shield must connect to the PCB ground plane through a continuous row of pads or a solid ring of copper. Any gap in the ground connection is a slot antenna that leaks energy.
- Shield can height must clear the tallest component inside with adequate margin (typically 0.5-1 mm).
- Internal partitions can further isolate sensitive sub-circuits within a single shield.
- Openings for signals to enter/exit must be small relative to wavelength, or use feedthrough filtering.

## Guard Traces and Guard Rings

A guard trace is a grounded copper trace that runs alongside a sensitive signal trace, providing a degree of electromagnetic isolation. It is less effective than a shield can but much simpler to implement.

**Guard traces** on the same layer as the signal trace help reduce capacitive coupling from adjacent traces. The guard trace should be connected to ground at frequent intervals (via stitching every lambda/20 or closer) — an ungrounded guard trace is worse than no guard trace because it can couple and re-radiate.

**Guard rings** surround a sensitive component or area with a continuous grounded copper ring on the surface layer, stitched to ground with vias. This provides partial shielding of the enclosed area.

Guard traces and rings are most effective against electric field coupling (capacitive coupling). They are less effective against magnetic field coupling, which requires a full enclosure or significant physical separation.

## Physical Separation

Sometimes the best isolation strategy is simply distance. Electromagnetic field strength falls off with distance — near-field coupling drops as 1/r^2 to 1/r^3, and far-field as 1/r. Doubling the distance between an aggressor and a victim reduces coupling by 6-9 dB in the near field.

Practical separation guidelines for mixed RF/digital boards:

- Keep sensitive RF input stages (LNA, first mixer) as far from digital ICs as board size allows
- Place the crystal oscillator or TCXO away from power amplifier output stages
- Route RF traces on the opposite side of the board from high-speed digital traces when possible
- Use intermediate ground areas between RF and digital sections

Physical separation works in all directions — horizontal distance on the board surface and vertical separation through the PCB stackup. Placing RF circuits on one side and digital on the other, with a solid ground plane between them, combines separation with shielding.

## Apertures and Leakage

Any opening in a shield leaks electromagnetic energy. The rule of thumb: an aperture (hole, slot, gap) leaks significantly when its largest dimension exceeds lambda/20 at the frequency of concern.

| Frequency | Lambda in Free Space | Lambda/20 Aperture Limit |
|-----------|---------------------|--------------------------|
| 1 GHz | 300 mm | 15 mm |
| 2.4 GHz | 125 mm | 6.3 mm |
| 5.8 GHz | 52 mm | 2.6 mm |
| 10 GHz | 30 mm | 1.5 mm |

A ventilation hole, a gap in a shield can seam, or a slot for a cable can all be apertures. Multiple small holes leak less than one large hole of the same total area — this is why perforated screens are used for ventilation in shielded enclosures.

Long, narrow slots are worse than round holes of the same area. A 0.5 mm x 10 mm slot in a shield can leaks much more at high frequency than a 2.5 mm diameter round hole, even though the hole has more area. The slot's 10 mm dimension sets its effective antenna length.

## Feedthrough Capacitors and Filtered Connectors

Signals that must cross a shield boundary (power, control lines, low-frequency signals) need filtering to prevent RF energy from riding along them:

**Feedthrough capacitors** are designed to mount in a shield wall or bulkhead. The signal conductor passes through a capacitor that shunts RF energy to the shield ground. They provide much better performance than a regular bypass capacitor because the ground connection is the shield wall itself — zero inductance.

**Filtered connectors** integrate capacitors or pi-filters into each pin of a multi-pin connector. They are used where multiple signals must pass through a shield boundary while maintaining RF integrity.

**Ferrite chokes** on cables passing through shield boundaries absorb common-mode RF energy. They are effective at suppressing RF coupling on power and signal cables.

## Grounding the Shield

How a shield connects to ground depends on frequency:

**Low frequency (below approximately 1 MHz):** A single-point ground connection avoids ground loops. The shield connects to the system ground at one point.

**High frequency (above approximately 1 MHz):** Multiple ground connections provide low impedance. The shield should connect to the ground plane at many points around its perimeter — every pad, every possible via.

**For board-level shield cans at RF:** Always use multiple ground connections. The shield can frame should sit on a continuous ground pad ring connected to the ground plane by a dense row of vias. A shield can with a single ground connection is barely a shield — it resonates and re-radiates.

The transition frequency is not sharp. In practice, for RF work above 100 MHz, always use multi-point grounding for shields. The ground loop concern that dominates at audio frequencies is irrelevant at RF, where the wavelength is short enough that multiple ground points create beneficial cancellation rather than problematic loops.

## Gotchas

- **A shield can without sufficient ground vias is a resonant cavity** — The can itself becomes an enclosure that resonates at frequencies related to its dimensions. Without good grounding, it amplifies RF energy inside rather than containing it.
- **Snap-on shield lids leak more than soldered cans** — The mechanical contact points have small gaps that function as slot apertures. For critical isolation, specify soldered construction or add conductive gaskets.
- **Guard traces without vias are floating antennas** — A guard trace connected to ground at only two distant points has high impedance between them at RF. It picks up noise and re-radiates it. Stitch to ground every 2-3 mm at GHz frequencies.
- **Shield can resonances can fall on your operating frequency** — A 20 mm x 20 mm shield can has a first resonance around 5-7 GHz depending on height and fill. If your circuit operates near that frequency, the shield amplifies instead of attenuating. Add absorber material or partition the can.
- **Slots in shield seams are worse than holes** — A 0.5 mm gap running the length of a shield can seam is an efficient slot antenna. Ensure seam continuity with solder or conductive gaskets.
