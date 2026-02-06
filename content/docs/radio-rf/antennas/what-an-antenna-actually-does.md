---
title: "What an Antenna Actually Does"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# What an Antenna Actually Does

An antenna converts between two fundamentally different forms of electromagnetic energy: guided waves traveling along a transmission line, and radiated waves propagating through free space. This sounds simple, but the mechanism is subtle -- and understanding it changes how to think about everything from dipoles to chip antennas. The key insight is that an antenna is not just a piece of wire; it is a structure that launches (or captures) electromagnetic fields in a controlled way.

## The Conversion Process

On a transmission line, electric and magnetic fields are confined between the conductors — they travel along the line but don't radiate. The energy is guided. At the antenna, the fields are released into space (for transmit) or captured from space (for receive).

What makes this possible is acceleration of charge. When alternating current flows through a conductor, the charges accelerate and decelerate, and accelerating charges radiate electromagnetic waves. A straight wire carrying RF current radiates — the question is how much and in what pattern. An antenna is a structure designed to radiate efficiently and in a desired pattern.

The complementary process — receiving — works by induction. An incoming electromagnetic wave induces currents in the antenna conductor. The voltage and current at the feedpoint are a scaled version of the incident field, limited by the antenna's properties.

## Reciprocity

One of the most powerful concepts in antenna theory is reciprocity: an antenna has the same radiation pattern, gain, and impedance whether transmitting or receiving. A Yagi antenna that has 10 dBi gain when transmitting has the same 10 dBi gain when receiving. A dipole that's resonant at 146 MHz for transmit is resonant at 146 MHz for receive.

This means an antenna only needs to be characterized once -- the transmit characterization fully describes the receive behavior (and vice versa). It also means an antenna can be designed or optimized for either mode and will work for both.

There are practical asymmetries (noise pickup, intermodulation in nearby metal, amplifier noise figure) that make transmit and receive systems different in practice, but these are system-level issues, not antenna issues. The antenna itself is reciprocal.

## Radiation Resistance

This concept confused me for a while until I found the right framing. Radiation resistance is the part of the antenna's input impedance that represents power actually radiated into space. It's not a physical resistor — it's a mathematical construct that accounts for the power leaving the antenna as radiation.

A half-wave dipole has a radiation resistance of about 73 ohms. This means that if driven with 1 amp of RF current at the feedpoint, it radiates 73 watts. The power calculation is the same as for a real resistor: P = I^2 * R_rad.

But the antenna also has loss resistance — resistance in the conductors, connections, and any loading coils. The total feedpoint resistance is R_total = R_rad + R_loss. Antenna efficiency is the ratio: eta = R_rad / R_total. For a full-size half-wave dipole made of reasonable wire, R_loss might be 1-2 ohms, so efficiency is 73/75 or about 97%. For a tiny 2.4 GHz chip antenna with R_rad of 5 ohms and R_loss of 15 ohms, efficiency might be 25% (-6 dB). More on this in [Radiation Resistance & Efficiency]({{< relref "/docs/radio-rf/antennas/radiation-resistance-and-efficiency" >}}).

## Gain and Directivity

Antennas don't create energy — they're passive devices (unless they include an amplifier, making them "active antennas"). But they can focus energy in certain directions at the expense of others, just like a reflector focuses light.

**Directivity** measures how focused the radiation pattern is. An isotropic radiator (a theoretical point source that radiates equally in all directions) has directivity of 1 (0 dBi). A half-wave dipole has directivity of 1.64 (2.15 dBi) — it concentrates energy in the plane perpendicular to the wire.

**Gain** is directivity multiplied by efficiency. If an antenna has directivity of 6 dBi but efficiency of 50% (-3 dB), the gain is 3 dBi. Gain is what matters for link budget calculations because it accounts for both pattern focusing and losses.

The units matter:
- **dBi**: gain relative to an isotropic radiator
- **dBd**: gain relative to a half-wave dipole (dBd = dBi - 2.15)
- Gain specifications without a suffix are ambiguous — always check which reference is used

## Radiation Patterns

A radiation pattern is a 3D plot showing the relative field strength (or power density) in every direction around the antenna. Since 3D plots are hard to read, patterns are usually shown as 2D slices:

- **E-plane pattern**: the slice containing the electric field vector and the direction of maximum radiation
- **H-plane pattern**: perpendicular to the E-plane, containing the magnetic field vector
- **Azimuth pattern**: horizontal plane (useful for ground-based antennas)
- **Elevation pattern**: vertical plane through the main beam

Key features to read on a radiation pattern:

| Feature | What it means |
|---|---|
| Main lobe | Direction of maximum radiation |
| Half-power beamwidth (HPBW) | Width of main lobe at -3 dB points |
| Side lobes | Secondary radiation directions |
| Back lobe | Radiation in the opposite direction from main lobe |
| Null | Direction of minimum radiation |
| Front-to-back ratio | Main lobe power vs back lobe power (dB) |

A dipole's pattern looks like a donut — maximum radiation broadside to the wire, zero off the ends. A Yagi has a cardioid pattern — maximum in one direction, reduced in others. An isotropic pattern is a perfect sphere (theoretical only).

## The Isotropic Radiator and dBi

The isotropic radiator is a mathematical reference — a point source that radiates equally in all directions. It can't physically exist (it would violate Maxwell's equations for a finite structure), but it's an incredibly useful reference. All real antennas are compared to it.

When we say a dipole has 2.15 dBi gain, we mean it radiates 2.15 dB more power in its favored direction than an isotropic source fed with the same total power. The dipole doesn't create extra power — it just pushes more of it toward the horizon and less toward the poles.

## Effective Aperture

For a receiving antenna, effective aperture (A_e) describes how much space the antenna "captures" incoming radiation from. It's measured in square meters and relates gain to received power:

A_e = G * lambda^2 / (4 * pi)

A half-wave dipole at 144 MHz (lambda = 2.08 m) has:
A_e = 1.64 * 2.08^2 / (4 * pi) = 0.565 m^2

This means the dipole captures the power flowing through a 0.565 m^2 area of the incoming wave. A higher-gain antenna captures a larger area. This is why high-gain antennas seem to "amplify" weak signals — they're sampling a larger portion of the wavefront.

At higher frequencies, lambda is smaller, so the effective aperture for the same gain antenna is smaller. This is why satellite dishes get physically larger for lower frequencies — more physical area is needed to maintain the same gain when the wavelength is longer.

## Tips

- When comparing antennas, always confirm whether gain is stated in dBi or dBd before drawing conclusions -- a 2.15 dB difference can be misleading if the reference is ambiguous
- Use the effective aperture formula to estimate how much of an incoming wavefront a receive antenna captures -- this helps build intuition for link budget calculations
- Start with a half-wave dipole as a reference antenna for any new frequency band -- its well-known characteristics make it a reliable baseline for comparison
- Think of the radiation pattern as a power budget: every dB of gain in one direction is a dB lost somewhere else, so match the pattern to the application geometry

## Caveats

- **Gain is not amplification** -- an antenna with 10 dBi gain does not add energy; it focuses existing power, and higher gain in one direction necessarily means lower gain in other directions
- **Radiation patterns are idealized** -- published patterns assume free space or specific ground conditions; real installations always have distorted patterns from ground reflections, nearby structures, and feedline radiation
- **Radiation resistance is not a real resistor** -- it cannot be measured with an ohmmeter; it is the real part of the antenna impedance that accounts for radiated power, extracted from impedance measurements or calculated from field theory
- **dBi vs dBd catches people constantly** -- an antenna spec that says "8 dB gain" is ambiguous; 8 dBi is a modest antenna, while 8 dBd is the same as 10.15 dBi -- a high-gain antenna; manufacturers sometimes use the larger number without specifying the reference
- **Effective aperture is larger than physical size for low-frequency antennas** -- a half-wave dipole at 7 MHz (40m band) has an effective aperture of about 218 m^2, yet the wire is only 20 m long; the fields extend well beyond the physical conductor
- **Reciprocity does not mean symmetry in a system** -- the antenna is reciprocal, but the transmitter and receiver are not; a system may perform differently in each direction due to power levels, noise figures, and sensitivity, even though the antenna behaves identically

## In Practice

- A dipole oriented broadside to a transmitter shows maximum received signal; rotating it so the end points at the transmitter drops the signal into the null -- this directly demonstrates the radiation pattern
- Swapping between a dipole and a Yagi on a receiver shows the gain difference as a measurable increase in signal strength in the favored direction
- Measuring feedpoint impedance with a NanoVNA at resonance reveals the radiation resistance as the real part of the impedance -- for a half-wave dipole, expect roughly 73 ohms
- Comparing received signal levels at two frequencies on the same antenna shows effective aperture changes -- lower frequencies capture a larger portion of the wavefront, producing stronger signals for the same transmitted power
