---
title: "Controlled Impedance Traces"
weight: 20
---

# Controlled Impedance Traces

A 50-ohm trace is not just a wire — it is a transmission line whose characteristic impedance is set by geometry. The trace width, the dielectric thickness between the trace and the ground plane, the dielectric constant of the PCB material, and the copper weight all combine to determine the impedance. Getting this right is the foundation of every RF PCB design.

## What Determines Trace Impedance

Characteristic impedance (Z0) of a PCB trace depends on four main factors:

- **Trace width (w):** Wider traces have lower impedance. This is the primary design variable.
- **Dielectric thickness (h):** The distance between the trace and the reference ground plane. Thicker dielectric raises impedance.
- **Dielectric constant (Er):** The relative permittivity of the PCB material. Higher Er lowers impedance. FR4 is typically 4.2-4.6, Rogers RO4003C is about 3.38.
- **Copper thickness (t):** Thicker copper slightly lowers impedance, though the effect is smaller than the other three factors. Standard 1 oz copper is about 35 um (1.4 mil).

The relationship is not a simple formula — it involves fringing fields and geometry-dependent effects. In practice, everyone uses calculators rather than computing by hand.

## Transmission Line Geometries

### Microstrip

The most common RF trace geometry. The signal trace runs on an outer layer of the PCB with a ground plane on the layer below. Part of the electric field travels through the dielectric, and part through air above the trace.

Typical 50-ohm microstrip dimensions on standard FR4 (Er = 4.4, 10 mil dielectric):
- Trace width: approximately 18-19 mil (0.46-0.48 mm)
- This varies with copper weight, dielectric tolerance, and solder mask

Microstrip is easy to probe, easy to access for rework, and well-supported by PCB calculators. Its main disadvantage is that the exposed trace can radiate and couple to nearby structures.

### Stripline

The signal trace is sandwiched between two ground planes inside the PCB stackup. The electric field is entirely contained in the dielectric, which provides better shielding and less radiation than microstrip.

For 50 ohms in stripline, the trace is typically narrower than microstrip for the same dielectric thickness, because the field is fully enclosed. Stripline offers better isolation and more consistent impedance, but the trace is buried inside the board — you cannot probe it, and rework is impossible.

### Coplanar Waveguide (CPW)

The signal trace runs on the same layer as ground copper on both sides, with a gap between them. The ground plane below may or may not be present (grounded CPW vs ungrounded CPW). The gap width and trace width together set the impedance.

CPW is useful for dense layouts and for components with ground pads on the same layer (common in MMIC packaging). It also provides some inherent shielding from the coplanar ground.

### Comparison

| Geometry | Shielding | Probing | Radiation | Typical Use |
|----------|-----------|---------|-----------|-------------|
| Microstrip | Low | Easy | Higher | General RF, prototyping |
| Stripline | High | Not possible | Very low | Inner-layer RF routing, sensitive signals |
| Coplanar waveguide | Moderate | Easy | Moderate | MMIC interfaces, dense layouts |
| Grounded CPW | Good | Easy | Low | High-frequency, good isolation |

## Using Impedance Calculators

Several tools compute trace impedance from physical dimensions:

- **Saturn PCB Design Toolkit** — Free, widely used, covers microstrip, stripline, and CPW
- **KiCad built-in calculator** — Integrated into the KiCad PCB tools
- **Manufacturer stackup calculators** — Many PCB fabricators (JLCPCB, OSH Park, Eurocircuits) provide online calculators matched to their actual stackups
- **Polar Instruments Si9000** — Industry standard for controlled impedance design, often used by fabricators

The critical input is the actual stackup — not the nominal values. A "10 mil" dielectric might be 9.5 or 10.5 mil in practice. An Er of "4.4" might be 4.2 at 1 GHz and 4.0 at 10 GHz, because FR4's dielectric constant varies with frequency.

For prototyping, use the calculator with nominal values and accept the tolerance. For production, request the fabricator's actual stackup data and use their calculator.

## Fabrication Tolerances

Controlled impedance is always specified with a tolerance. Typical values:

| Tolerance | What It Means | When It's Used |
|-----------|--------------|----------------|
| +/- 10% | Standard controlled impedance | Most RF designs, ISM band radios |
| +/- 7% | Tighter control | Multi-GHz designs, precision matching |
| +/- 5% | High precision | Radar, instrumentation, telecom |

A +/- 10% tolerance on 50 ohms means the trace impedance will be between 45 and 55 ohms. This creates a worst-case return loss of about 26 dB — good enough for most applications. At +/- 5%, worst-case return loss improves to about 32 dB.

Tighter tolerances cost more because they require the fabricator to measure and adjust etch processes, often running test coupons alongside the production panel.

## Specifying Controlled Impedance

When ordering PCBs with controlled impedance, include:

1. **Stackup drawing** with layer assignments, dielectric thicknesses, and materials
2. **Impedance table** listing each controlled impedance: the target value, tolerance, trace geometry (microstrip/stripline/CPW), and which layers
3. **Test coupon requirements** if you need the fabricator to verify impedance with TDR measurements

Example specification line: "50 ohm +/- 10%, microstrip, Layer 1 over Layer 2, 1 oz copper, FR4 core."

The fabricator will adjust trace width to hit the target impedance on their actual stackup, so the final width may differ from what your calculator predicted. This is normal — the impedance is the specification, not the trace width.

## Bends and Discontinuities

RF traces should avoid sharp corners. A 90-degree bend creates a capacitive discontinuity because the outer corner has extra copper area. The standard solutions:

- **Chamfered (mitered) bend:** Cut the outer corner at 45 degrees. Removes the excess copper and maintains impedance reasonably well.
- **Curved bend:** Use a smooth arc instead of a sharp corner. The radius should be at least three times the trace width.
- **45-degree routing:** Route in 45-degree segments instead of 90-degree turns.

At frequencies below about 5 GHz, chamfered bends are usually adequate. Above 10 GHz, curved bends or careful EM simulation of discontinuities becomes important.

## Gotchas

- **"50-ohm trace" means nothing without a stackup** — The trace width for 50 ohms depends entirely on the dielectric thickness and material. A 50-ohm trace on one stackup is 30 ohms on another. Always calculate for your specific stackup.
- **Solder mask changes impedance** — Solder mask over a microstrip trace adds dielectric loading, typically lowering impedance by 2-5 ohms. Some designs specify solder mask relief (no mask) over RF traces.
- **FR4 dielectric constant varies with frequency** — Datasheets typically give Er at 1 MHz. At 1 GHz it may be 4.2; at 10 GHz it may be below 4.0. Use frequency-appropriate values for high-frequency designs.
- **Do not taper traces casually** — A trace that changes width changes impedance. If you must transition between widths (for example, to connect to a component pad), keep the transition short and taper smoothly.
- **Coplanar ground must connect to the ground plane** — CPW ground copper on the same layer needs frequent via connections to the ground plane below. Without them, the coplanar ground floats and the impedance is undefined.
- **Fabrication etch varies across the panel** — Trace width may differ between the center and edge of a PCB panel by 0.5-1 mil. For tight-tolerance designs, specify where on the panel your board should be placed, or accept that edge boards may have wider tolerances.
