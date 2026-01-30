---
title: "Skin Effect & Proximity Effect"
weight: 40
---

# Skin Effect & Proximity Effect

At DC, current flows through the entire cross-section of a conductor — every part of the copper carries its share. As frequency increases, something counterintuitive happens: the current retreats from the interior and concentrates near the surface. At RF frequencies, essentially all the current flows in a thin shell on the outside of the conductor. This is the skin effect, and it fundamentally changes how conductors behave at high frequencies — increasing resistance, altering inductance, and making the geometry of the surface more important than the bulk of the metal.

## How Skin Effect Works

An alternating current creates a time-varying magnetic field inside the conductor. That field induces eddy currents that oppose the original current flow in the interior and reinforce it near the surface. The result is that current density decays exponentially from the surface inward.

The characteristic depth at which the current density falls to 1/e (about 37%) of its surface value is called the skin depth, delta:

**delta = sqrt(rho / (pi x f x mu))**

Where rho is the resistivity of the conductor, f is frequency, and mu is the magnetic permeability (mu_0 for non-magnetic materials like copper).

For copper (rho = 1.68 x 10^-8 ohm-m), the skin depth simplifies to approximately:

**delta (mm) = 66.1 / sqrt(f in Hz)**

## Skin Depth for Copper at Various Frequencies

| Frequency | Skin depth | Context |
|-----------|-----------|---------|
| 60 Hz | 8.5 mm | Power line — full wire cross-section is used |
| 1 kHz | 2.1 mm | Audio — skin effect is negligible for most wire gauges |
| 10 kHz | 0.66 mm | Switching power supply — starting to matter in large conductors |
| 100 kHz | 0.21 mm | Switching regulators, induction heating — significant |
| 1 MHz | 66 um | AM radio — only the outer 66 microns carry current |
| 10 MHz | 21 um | HF radio — comparable to PCB copper thickness (35 um = 1 oz) |
| 100 MHz | 6.6 um | VHF/FM — much thinner than standard PCB copper |
| 1 GHz | 2.1 um | UHF/microwave — almost all current is on the surface |
| 10 GHz | 0.66 um | Microwave — current skin is thinner than many surface finishes |

The key takeaway: at 10 MHz, the skin depth in copper is 21 um. Standard 1 oz PCB copper is 35 um thick. This means that at 10 MHz and above, the bottom of the copper trace carries noticeably less current than the top. By 100 MHz, essentially all current flows in the outer few microns.

## Practical Consequences of Skin Effect

**Increased AC resistance.** Because current is confined to a thin shell, the effective cross-section carrying current is smaller than the full conductor area. A round wire of radius r at high frequency has an effective cross-section of approximately 2 x pi x r x delta (the circumference times the skin depth). The AC resistance increases as the square root of frequency — double the frequency, increase resistance by about 41%.

For example, a 1 mm diameter copper wire:
- DC resistance: about 22 mohm per meter
- At 1 MHz: about 83 mohm per meter (3.8x DC)
- At 100 MHz: about 830 mohm per meter (38x DC)
- At 1 GHz: about 2.6 ohm per meter (120x DC)

**Hollow conductors work at RF.** If current only flows on the surface, the interior of a conductor is wasted copper. This is why RF conductors are often hollow tubes, silver-plated surfaces, or thin copper foil. A hollow tube has nearly the same RF resistance as a solid rod of the same outer diameter — and uses far less material.

**Surface finish matters.** At 10 GHz, the skin depth is 0.66 um. The current is flowing in a layer thinner than many surface finishes. The roughness of the copper surface directly affects loss — microscopically rough surfaces force the current to travel a longer path, increasing resistance. This is why microwave PCB fabrication specifies surface roughness (often as Rz or Ra values), and why electropolished or rolled copper is preferred over electrodeposited copper for low-loss RF boards.

**Silver plating helps (but only barely).** Silver has about 5% lower resistivity than copper, so silver-plated conductors have slightly lower RF loss. The skin effect means only a few microns of plating are needed. Gold plating, despite being a worse conductor than copper, is used for corrosion resistance — but at RF frequencies, the gold layer must be thin enough that current penetrates through to the copper or silver beneath, or loss will increase.

## Proximity Effect

When two conductors carrying current are close together, their magnetic fields interact and redistribute the current within each conductor. This is the proximity effect, and it compounds the skin effect.

In two parallel conductors carrying current in opposite directions (like signal and return), the current tends to concentrate on the surfaces facing each other — the nearest surfaces. This happens because the magnetic field is strongest in the gap between the conductors, and the induced eddy currents push current toward that gap.

In two parallel conductors carrying current in the same direction (like turns of an inductor), the current concentrates on the far surfaces — it is pushed away from the gap.

The result is that the current distribution is even more non-uniform than skin effect alone would predict. The effective resistance increases beyond what skin-effect calculations suggest.

## Impact on Real Components

**Inductor Q factor.** The quality factor of an inductor, Q = omega x L / R, is directly affected by skin and proximity effects. At higher frequencies, the effective resistance increases, reducing Q. Multi-layer wound inductors suffer the most — proximity effect between adjacent turns can increase resistance by a factor of 2-10x compared to skin effect alone. This is why high-Q RF inductors use single-layer coils, spaced windings, or Litz wire (at lower RF frequencies).

**Litz wire.** Below about 1-2 MHz, Litz wire (many thin individually-insulated strands woven together) mitigates skin and proximity effects by ensuring each strand is thin compared to the skin depth and that each strand spends equal time on the inside and outside of the bundle. Above a few MHz, Litz wire stops helping — the individual strands themselves are thick compared to the skin depth, and the inter-strand capacitance creates additional losses.

**Transformer coupling.** Proximity effect in transformer windings pushes current to the surfaces of the windings nearest the other winding. This increases winding loss but can actually improve coupling (since the current-carrying surfaces are closer together). High-frequency transformer design interleaves primary and secondary windings to control proximity effect and reduce leakage inductance.

**PCB trace losses.** On a microstrip trace, skin effect means the current flows mostly on the bottom surface (facing the ground plane) and the edges of the trace. The ground plane return current flows on its top surface (facing the trace). Copper roughness on the bottom of the trace and the top of the ground plane directly contributes to loss. The top surface of the trace and the bulk of the ground plane copper carry very little current at GHz frequencies.

## Frequency Regions and Design Approach

| Frequency range | Skin effect significance | Design approach |
|----------------|------------------------|----------------|
| DC - 10 kHz | Negligible for most conductors | Standard wire gauges based on DC resistance |
| 10 kHz - 1 MHz | Noticeable in large conductors | Litz wire for inductors, thicker traces help less than expected |
| 1 MHz - 100 MHz | Dominant | Surface area matters more than cross-section, Litz wire works at lower end |
| 100 MHz - 10 GHz | Extreme | Surface finish critical, hollow conductors, plating thickness matters |
| Above 10 GHz | Sub-micron skin depth | Waveguides preferred, surface roughness is a primary loss mechanism |

## Gotchas

- **Thicker copper does not always mean lower RF loss** — Doubling copper thickness from 1 oz to 2 oz on a PCB halves DC resistance but barely changes loss at 1 GHz, where the skin depth (2.1 um) is far thinner than either copper weight (35 um vs 70 um). You are paying for copper the current never reaches.
- **Surface roughness can increase loss by 30-50% at millimeter-wave** — The current follows the microscopic contours of the surface. Standard electrodeposited copper (Rz around 5-10 um) is much rougher than the skin depth at 10 GHz. Smooth or very-low-profile copper (Rz < 2 um) is specified for mmWave designs.
- **Gold plating can increase loss if too thick** — Gold has about 50% higher resistivity than copper. A thick gold layer (several skin depths) forces current to flow in gold rather than copper. For RF, gold plating should be thin (flash gold) or avoided where loss matters.
- **Proximity effect is often larger than skin effect in wound components** — Two tightly-wound layers of an inductor may have 5x the AC resistance predicted by skin effect alone. Electromagnetic simulation or measurements are needed for accurate loss prediction.
- **Skin effect changes inductance too, not just resistance** — The internal inductance of a conductor (due to flux linkage inside the conductor) decreases as skin effect forces current to the surface. Total inductance drops slightly at high frequencies, which can shift resonant frequencies in precision circuits.
