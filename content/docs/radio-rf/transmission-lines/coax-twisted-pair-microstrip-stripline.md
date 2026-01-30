---
title: "Coax, Twisted Pair, Microstrip & Stripline"
weight: 30
---

# Coax, Twisted Pair, Microstrip & Stripline

There are only a few basic ways to build a transmission line, and each one is a different answer to the same question: how do you guide electromagnetic energy between two conductors with controlled impedance, acceptable loss, and useful isolation? The choice depends on the application — whether you need shielding, bandwidth, ease of fabrication, or integration onto a PCB. Understanding the trade-offs between these structures is fundamental to any work involving RF signals or high-speed digital interconnects.

## Coaxial Cable

Coaxial cable is the most familiar RF transmission line. A center conductor (solid or stranded) is surrounded by a dielectric spacer, which is enclosed by an outer conductor (braid, foil, or solid tube), all wrapped in a protective jacket.

The geometry gives coax several key properties:

**Self-shielding.** The outer conductor completely surrounds the signal, containing the electric and magnetic fields within the cable. No energy radiates out (ideally), and external fields do not couple in. This makes coax inherently well-isolated — you can run it next to other cables without crosstalk.

**Well-defined Z0.** The impedance is set by the ratio of the outer conductor diameter to the center conductor diameter and the dielectric constant. Because these dimensions are controlled during manufacturing, Z0 is consistent and predictable.

**Frequency range.** Coax supports a TEM (Transverse Electromagnetic) mode from DC up to a cutoff frequency where higher-order modes begin to propagate. For RG-58 (50 ohm, polyethylene), this cutoff is around 11 GHz. Smaller coax (like semi-rigid 0.085" SMA cable) works to 18 GHz or higher.

Common coax types:

| Cable | Z0 | Velocity factor | Loss at 100 MHz | Loss at 1 GHz | Typical use |
|-------|-----|----------------|-----------------|---------------|-------------|
| RG-58 | 50 ohm | 0.66 | 5.3 dB/100m | 18 dB/100m | General lab, short runs |
| RG-59 | 75 ohm | 0.66 | 3.6 dB/100m | 12 dB/100m | Video, CCTV |
| RG-174 | 50 ohm | 0.66 | 9.8 dB/100m | 33 dB/100m | Thin, flexible, short runs |
| RG-213 | 50 ohm | 0.66 | 2.8 dB/100m | 9.4 dB/100m | Higher power, longer runs |
| LMR-400 | 50 ohm | 0.85 | 1.5 dB/100m | 5.1 dB/100m | Low-loss feedline, antennas |
| Semi-rigid 0.141" | 50 ohm | 0.70 | 4.0 dB/100m | 13 dB/100m | Lab, fixed installations to 18 GHz |

**When to choose coax:** Bench connections between instruments, antenna feedlines, any situation requiring shielding, interconnects longer than a few centimeters at RF.

## Twisted Pair

A twisted pair is two insulated conductors wound around each other with a controlled twist rate (twists per meter). The twisting serves a specific purpose: each half-twist reverses the orientation of the pair relative to external fields, so the noise induced in one half-twist cancels the noise from the next. This gives common-mode rejection without requiring shielding.

**Differential signaling.** Twisted pairs naturally support differential signals, where the information is in the voltage difference between the two wires. Common-mode noise (induced equally in both wires) is rejected by the differential receiver. This is the basis of Ethernet (Cat5/6/7), USB, RS-485, and many other standards.

**Impedance.** Unshielded twisted pair (UTP) typically has Z0 of 100-120 ohm depending on wire gauge, insulation thickness, and twist rate. Cat5e/Cat6 Ethernet cable is specified at 100 ohm. Shielded twisted pair (STP) adds a foil or braid shield and is used where external interference is severe.

**Frequency limitations.** Twisted pair works well into the hundreds of MHz for short runs. Cat6a supports 10 Gigabit Ethernet to 100 meters at 500 MHz. But loss increases rapidly with frequency, and at GHz frequencies, the twist rate must be very tight and the dielectric well-controlled. Twinax (a shielded differential pair with solid dielectric) extends differential signaling into the GHz range for short-reach applications like 10/25/100 Gigabit Ethernet direct-attach cables.

**When to choose twisted pair:** Digital differential signaling, moderate distances, environments with common-mode noise, board-to-board connections where shielding is not critical.

## Microstrip

Microstrip is the most common transmission line structure on PCBs. A signal trace runs on the outer layer of the board, with a ground plane on the layer beneath it. The electric field spans the gap between the trace and ground plane, passing partly through the PCB dielectric (below) and partly through air (above).

**Impedance control.** Z0 depends on trace width (w), dielectric height to ground plane (h), dielectric constant (epsilon_r), and trace thickness (t). For FR4 (epsilon_r approximately 4.4), a 50 ohm microstrip on an 8-mil (0.2 mm) dielectric requires a trace width of roughly 12 mil (0.3 mm). PCB fabricators control impedance by adjusting trace width during etching.

**Effective dielectric constant.** Because the fields are partly in the substrate and partly in air, the effective dielectric constant is between 1 and epsilon_r. For FR4 microstrip, epsilon_eff is typically around 3.0-3.5, giving a propagation velocity of about 55-58% of the speed of light.

**Radiation.** Microstrip is partially open — the fields extend into the air above the trace. This means microstrip radiates more than enclosed structures and is more susceptible to coupling from nearby structures. At higher frequencies (above a few GHz), microstrip radiation loss becomes a significant fraction of total loss.

**Dispersion.** The effective dielectric constant of microstrip varies slightly with frequency (higher frequencies see more of the substrate dielectric), which means different frequency components travel at slightly different speeds. For narrowband signals, this is negligible. For very wideband signals or short pulses, it can cause pulse distortion.

**When to choose microstrip:** Default choice for RF and high-speed digital PCB traces on outer layers. Easy to probe, easy to rework, well-understood. Suitable from DC through tens of GHz with appropriate materials.

## Stripline

Stripline places the signal trace between two ground planes, fully immersed in the PCB dielectric. The trace is on an inner layer of the board, sandwiched between ground layers above and below.

**Better isolation.** Because the trace is fully enclosed by ground planes, stripline does not radiate and is well-shielded from external interference. Adjacent stripline traces have less crosstalk than adjacent microstrip traces.

**True TEM mode.** Unlike microstrip (which has a quasi-TEM mode due to the mixed dielectric), stripline in a uniform dielectric supports a true TEM mode. This means the effective dielectric constant equals the substrate dielectric constant, propagation velocity is independent of frequency (no dispersion), and impedance calculations are more straightforward.

**Slower propagation.** Because the wave is fully immersed in the dielectric, it travels slower than in microstrip. On FR4, stripline velocity is about 47-50% of the speed of light, compared to 55-58% for microstrip.

**Harder to probe.** Inner layers cannot be accessed for debugging or measurement without destructive techniques. Stripline designs must be right the first time, or test structures must be included on outer layers.

**Tighter trace width.** For the same Z0, stripline requires a narrower trace than microstrip because the full dielectric constant applies. This can push against manufacturing tolerances for high-impedance lines.

**When to choose stripline:** When isolation matters — high-density routing where crosstalk must be minimized, sensitive receiver circuits, or when outer-layer real estate is occupied by components.

## Comparison Table

| Property | Coax | Twisted pair | Microstrip | Stripline |
|----------|------|-------------|------------|-----------|
| Z0 range | 25-100 ohm | 80-150 ohm | 20-120 ohm | 20-120 ohm |
| Shielding | Excellent | Moderate (STP) / Low (UTP) | Low | Good |
| Loss | Low-moderate | Moderate-high | Moderate | Moderate |
| Bandwidth | DC to 18+ GHz | DC to ~1 GHz | DC to 50+ GHz | DC to 50+ GHz |
| Dispersion | Very low | Low | Moderate | Very low |
| Ease of fabrication | Factory cable | Factory cable | Standard PCB | Standard PCB (inner layer) |
| Probing / debugging | Easy | Easy | Easy | Difficult |
| Integration | External | External | On-board | On-board |
| Crosstalk | N/A (shielded) | Moderate | Higher | Lower |

## Coplanar Waveguide — Worth Mentioning

Coplanar waveguide (CPW) places the signal trace between ground areas on the same PCB layer, with or without a ground plane beneath. It is used at very high frequencies (mmWave) because it allows easy ground connections for surface-mount components (no via needed — ground is right there on the same layer). CPW has its own impedance formulas based on trace width and gap to the coplanar ground. It is common in MMIC (Monolithic Microwave Integrated Circuit) and chip-level RF design.

## Gotchas

- **Not all 50-ohm cables are equal** — RG-58 and LMR-400 are both 50 ohm, but LMR-400 has less than one-third the loss at 1 GHz. The impedance match is perfect, but the signal arrives 10 dB weaker on the lossy cable. Always check loss specifications, not just Z0.
- **Microstrip impedance changes with solder mask** — A solder mask layer over a microstrip trace increases the effective dielectric constant and lowers Z0 by 2-5 ohm. Specify impedance with or without mask, and communicate this to the fabricator.
- **Stripline needs good ground plane stitching** — The two ground planes enclosing a stripline must be connected by closely-spaced vias to prevent the ground cavity from resonating. Without stitching, the ground planes act as a parallel-plate waveguide that supports unwanted modes.
- **Twisted pair impedance varies with bending** — Bending a twisted pair changes the spacing between conductors, altering Z0. For impedance-sensitive applications, maintain consistent bend radii and avoid sharp bends or crushing.
- **Mixing transmission line types creates discontinuities** — A coax-to-microstrip transition, for example, changes the field geometry even if both are nominally 50 ohm. Well-designed transitions (like edge-mount SMA connectors with proper ground via fencing) minimize the discontinuity, but there is always some reflection at the transition.
