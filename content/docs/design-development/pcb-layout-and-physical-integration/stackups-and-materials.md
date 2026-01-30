---
title: "Stackups & Materials"
weight: 20
---

# Stackups & Materials

The PCB stackup — the arrangement of copper layers, dielectric materials, and their thicknesses — is one of the earliest and most consequential decisions in a layout. It determines controlled impedance, interlayer coupling, power distribution effectiveness, and manufacturing cost. Choosing a stackup is not just picking a number of layers; it's deciding how the board's electrical and physical properties will behave.

## What a Stackup Defines

A stackup specifies the number of copper layers, the dielectric material between them, the thickness of each dielectric layer, and the copper weight (thickness) on each layer. From these parameters, everything else follows:

- **Impedance.** The characteristic impedance of a trace depends on its width, the dielectric thickness to the nearest reference plane, and the dielectric constant of the material. You can't calculate or control impedance without knowing the stackup.
- **Coupling between layers.** Tightly coupled layers (thin dielectric between them) have stronger capacitive coupling, which is good for power-ground plane pairs and bad for signal isolation between layers.
- **Board thickness.** The total stackup determines the finished board thickness, which matters for connectors, enclosures, and flex requirements. Standard thickness is 1.6 mm (63 mils), but non-standard thicknesses are common.
- **Manufacturing cost.** More layers, tighter tolerances, and specialty materials all increase cost. A 2-layer FR4 board is cheap. A 10-layer board with controlled impedance on Rogers material is expensive.

## 2-Layer Boards

Two copper layers — top and bottom — are the simplest and cheapest option. They're suitable for:

- Simple circuits with low component density
- Low-frequency designs where impedance control isn't critical
- Projects where cost is the dominant constraint

The main limitation of 2-layer boards is the lack of dedicated ground and power planes. Ground return current must flow through traces rather than a continuous plane, which means higher inductance, less effective decoupling, and more EMI. For anything involving signals above a few megahertz, or anything sensitive to noise, 2-layer boards require careful layout discipline — wide ground traces, ground pours on unused areas, and short signal paths.

I've used 2-layer boards successfully for simple sensor breakouts, LED drivers, and low-speed microcontroller projects. Once a design includes high-speed signals, switching regulators, or sensitive analog circuits, the fight to make 2 layers work usually isn't worth the cost savings.

## 4-Layer Boards

The 4-layer stackup is the sweet spot for most designs. The classic arrangement is:

| Layer | Function |
|-------|----------|
| Top | Signal + components |
| Inner 1 | Ground plane |
| Inner 2 | Power plane |
| Bottom | Signal + components |

This gives you a continuous ground plane directly below the top signal layer, which means controlled impedance for top-layer traces, good return current paths, and effective decoupling between the ground and power planes. The cost premium over 2-layer boards has dropped significantly — many fabricators charge only 30-50% more for 4 layers — and the improvement in signal integrity and ease of routing is substantial.

Variations on the 4-layer stackup include using one inner layer for routing instead of a complete plane, but this sacrifices the ground plane continuity that makes 4-layer boards valuable. If you need more routing space than two signal layers provide, it's often better to move to 6 layers than to compromise the ground plane.

## 6+ Layer Boards

More layers become necessary when:

- **Component density is high.** Dense BGA packages with hundreds of pins may require four or more routing layers to escape all the pins.
- **Multiple power domains exist.** Separate power planes for analog, digital, and I/O supplies require dedicated layers.
- **High-speed or RF signals need shielding.** Stripline routing (a signal layer sandwiched between two ground planes) provides better shielding than microstrip (signal layer above a single ground plane).
- **Impedance requirements demand specific geometries.** Some designs need both 50-ohm and 100-ohm differential traces, which may require different dielectric thicknesses achievable only with more layers.

A common 6-layer stackup is: Signal - Ground - Signal - Signal - Power - Signal. An 8-layer might be: Signal - Ground - Signal - Power - Ground - Signal - Ground - Signal. The specific arrangement depends on the design's needs, and the fabricator's standard stackup offerings should be consulted early — custom stackups that don't match a fabricator's standard process add cost and lead time.

## FR4: The Default Material

FR4 (flame-retardant fiberglass-reinforced epoxy laminate) is the default PCB substrate material. It's inexpensive, widely available, and mechanically robust. Its dielectric constant is approximately 4.2-4.5 (varying with frequency, temperature, and resin content), and its loss tangent is adequate for signals up to about 1-2 GHz for most applications, with careful design pushing usable frequencies to around 6 GHz.

FR4's limitations become apparent at higher frequencies: the dielectric constant is not precisely controlled (it can vary by 10% or more), the loss tangent increases with frequency, and the material's inhomogeneity (fiberglass weave pattern) can cause impedance variations. For most digital designs up to a few gigahertz and most analog designs below a few hundred megahertz, FR4 is perfectly adequate.

## Specialty Materials

When FR4 isn't good enough, several alternatives exist:

- **Rogers (RO4003C, RO4350B, etc.)** — Low-loss, tightly controlled dielectric constant. Standard for RF designs above a few gigahertz. Significantly more expensive than FR4, but the predictable electrical properties simplify impedance matching and filter design. See also [RF Layout & PCB Design]({{< relref "/docs/radio-rf/rf-layout-and-pcb-design" >}}) for domain-specific guidance.
- **Isola (I-Tera, Astra, etc.)** — High-speed digital materials with lower loss than FR4 but lower cost than Rogers. Used for high-speed SerDes, DDR4/5 routing, and similar applications.
- **Polyimide (Kapton-based)** — Flexible materials for flex and rigid-flex PCBs. Higher cost but enables designs that must bend or fit into curved enclosures.
- **Hybrid stackups** — Some designs use Rogers for the RF signal layers and FR4 for the remaining layers, combining performance where needed with economy where possible. This requires careful fabrication but is common in production RF designs.

## Copper Weight

Copper weight is specified in ounces per square foot, which translates to thickness:

| Weight | Thickness | Typical use |
|--------|-----------|-------------|
| 0.5 oz | 17 um (0.7 mil) | Fine-pitch routing, HDI designs |
| 1 oz | 35 um (1.4 mil) | Standard for most designs |
| 2 oz | 70 um (2.8 mil) | Power traces, high-current paths |
| 3+ oz | 105+ um | Power electronics, bus bars |

Heavier copper carries more current for a given trace width and spreads heat more effectively, but it limits minimum trace width and spacing (the etching process is less precise with thicker copper). Inner layers often use lighter copper than outer layers because the inner copper is better thermally coupled to the board and doesn't need as much cross-section for equivalent current handling.

## Working with Your Fabricator

The stackup is not just a design document — it's a contract with the PCB fabricator. Key practices:

- **Request the fabricator's standard stackups early.** Most fabricators publish their standard stackup options. Designing to a standard stackup avoids custom processing charges and reduces lead time.
- **Specify controlled impedance if needed.** If your design requires specific trace impedances, call this out explicitly. The fabricator will adjust dielectric thicknesses to hit your target and provide an impedance test coupon on the panel.
- **Run DFM checks.** Most fabricators offer free design-for-manufacturing checks. Use them. They'll catch minimum spacing violations, drill-to-copper clearances, and other issues before you pay for fabrication.
- **Ask questions.** If you're unsure whether a stackup will work, call the fabricator. Their engineers deal with these decisions daily and can save you from expensive mistakes.

## Gotchas

- **Dielectric constant varies with frequency.** FR4's Dk of ~4.3 is measured at 1 MHz. At 1 GHz, it's lower. If you're calculating impedance for high-speed signals using the low-frequency Dk value, your traces will be the wrong width.
- **Standard stackup thicknesses vary by fabricator.** Don't assume a "4-layer 1.6mm" stackup has the same dielectric thicknesses at every fabricator. Get the specific stackup data and calculate impedance against it.
- **More layers doesn't automatically mean better.** A poorly planned 6-layer board can perform worse than a well-planned 4-layer board. Layer count is a tool, not a score.
- **Copper weight affects etching limits.** With 2 oz copper, minimum trace width and spacing are wider than with 1 oz copper. Check your fabricator's design rules for the copper weight you're specifying.
- **Hybrid stackups need careful registration.** Mixing materials (e.g., Rogers + FR4) introduces different thermal expansion coefficients, which can cause registration issues during lamination. Discuss this with your fabricator before committing to the design.
- **Via aspect ratio limits depth.** A standard drill can't create a via much deeper than about 10:1 aspect ratio (depth to diameter). Thick boards with small vias may need laser drilling or back-drilling, which adds cost.
