---
title: "Winding and Core Losses"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Winding and Core Losses

Every magnetic component converts some input energy into heat. The two sources are copper losses (current through wire resistance) and core losses (the core material dissipating energy as flux swings back and forth). At DC and low frequencies, copper loss dominates. At high switching frequencies, core loss can dominate. Getting the balance right determines whether the inductor runs cool or cooks itself.

## Copper Loss (DCR and AC Resistance)

### DCR — The DC Component

Every winding has DC resistance: copper wire has finite conductivity, and longer wire or thinner wire means more resistance. DCR is the simplest loss mechanism:

P_copper = I² × DCR

For a power inductor carrying 3 A with a DCR of 50 mΩ, that's 0.45 W of heat. In a buck converter running at 90% efficiency delivering 10 W, total losses are about 1.1 W — so 0.45 W is a significant fraction.

**Why "low DCR" matters for power inductors:** Every milliohm of DCR costs efficiency under load. Datasheets specify DCR at 25°C; copper resistance increases about 0.4% per degree C, so at 100°C operating temperature the DCR is roughly 30% higher than the room-temperature spec.

### AC Resistance — Skin Effect and Proximity Effect

At DC, current distributes uniformly across the wire cross-section. As frequency increases, two effects push current toward the surface:

**Skin effect:** At high frequency, current flows only in a thin layer at the surface of the conductor. The skin depth in copper at 100 kHz is about 0.2 mm. If the wire radius is much larger than the skin depth, the interior of the wire carries no current and the effective resistance increases.

**Proximity effect:** In a multi-turn winding, the magnetic field from adjacent turns forces current into an even smaller region of each conductor. This can increase AC resistance by 5–50× above DCR in tightly packed, multi-layer windings at switching frequencies.

These effects are why high-frequency magnetics use:
- **Litz wire** — many individually insulated thin strands twisted together, each thinner than the skin depth. Current distributes across all strands, keeping AC resistance close to DC resistance
- **Flat/foil windings** — thin copper strips that spread the current over a large surface area
- **Fewer layers** — single-layer windings have much lower proximity effect than multi-layer windings

### Total Copper Loss at Switching Frequencies

In a switching converter inductor, the current has a DC component (the load current) and an AC component (the triangular ripple). Total copper loss is:

P_copper = I_dc² × R_dc + I_ac_rms² × R_ac

The DC component dissipates through DCR. The AC component dissipates through the (higher) AC resistance. For power inductors where ripple current is a small fraction of DC current, DCR dominates. For filter inductors and transformers carrying mostly AC current, the AC resistance matters much more.

## Core Loss

The core material dissipates energy every time the flux density changes. This is separate from and in addition to copper losses.

### Hysteresis Loss

Each magnetic cycle traverses the B-H loop. The area enclosed by the loop is energy lost per cycle per unit volume. Hysteresis loss is proportional to:
- Frequency (more cycles per second = more loss per second)
- Flux swing (larger B-H loop = more area = more loss per cycle)
- A material constant (different core materials have different hysteresis loop shapes)

### Eddy Current Loss

The changing magnetic flux induces circulating currents in the core material itself. These eddy currents flow through the core's finite resistivity and dissipate power. Eddy current loss is proportional to:
- Frequency squared (higher frequency = larger induced voltage = larger currents)
- Flux swing squared
- Core conductivity (more conductive core = larger eddy currents)

This is why laminated steel cores use thin insulated laminations — breaking the core into thin layers limits the path for eddy currents. Ferrite cores have very high resistivity (10⁴ to 10⁶ Ω-cm) compared to steel (10⁻⁵ Ω-cm), so eddy current losses are intrinsically low in ferrite. But at MHz frequencies, even ferrite eddy currents matter.

### The Steinmetz Equation

Core loss is commonly estimated with the empirical Steinmetz equation, which relates loss to frequency, peak flux density, and core volume using material-specific constants from the datasheet. The key behavior: core loss scales aggressively with both frequency and flux density — doubling either more than doubles the loss, because the exponents are greater than 1.

### Frequency Dependence in Practice

| Frequency Range | Dominant Core Loss | Typical Core Material |
|---|---|---|
| 50–400 Hz | Hysteresis | Laminated silicon steel |
| 10–500 kHz | Hysteresis + eddy current | MnZn ferrite, powdered iron |
| 500 kHz – 5 MHz | Eddy current | NiZn ferrite, thin-film materials |
| > 5 MHz | Eddy current, dimensional resonance | NiZn ferrite, air core |

At each frequency range, there's a core material optimized for low loss. Using the wrong material at the wrong frequency wastes power and generates heat. A laminated steel core that works great at 60 Hz would be a space heater at 100 kHz.

## How Losses Manifest as Heat

Total loss in the component is P_total = P_copper + P_core. All of this becomes heat. The steady-state temperature rise depends on the thermal resistance from the component to ambient — a function of size, airflow, mounting, and PCB copper area.

A useful rule of thumb: if the inductor can't be touched comfortably (above ~60°C surface temperature), it's running hotter than most designs intend. If the surface hits 100–120°C, the component's life is likely being shortened or core temperature limits are being approached.

### Temperature Effects on Losses

- **Copper loss increases with temperature** — copper resistivity rises ~0.4%/°C, so at 100°C, DCR is ~30% above 25°C spec
- **Core loss changes with temperature** — ferrite core loss typically has a minimum around 60–100°C and increases above and below that range. The datasheet loss curves are measured at 25°C and may not reflect operating conditions
- **The interaction creates a thermal equilibrium** — losses heat the component, changing the loss characteristics, which changes the heat. Well-designed magnetics reach a stable operating temperature. Poorly designed ones enter thermal runaway

## Tips

- Balance copper and core losses — optimizing one at the expense of the other doesn't minimize total loss
- Use the inductance vs. DC bias curve to find actual inductance at operating current
- Increase core size or reduce flux swing if core losses dominate; use heavier wire if copper losses dominate

## Caveats

- Core loss is invisible to a DMM — It shows up as heat and as a phase shift in the impedance (the resistive component of the inductor's impedance at frequency). Core loss is measured with specialized equipment or inferred from temperature rise
- Low DCR doesn't mean low total loss — A power inductor might have 10 mΩ DCR but significant core losses at the switching frequency. Total loss at operating frequency can be 2–5× the DC copper loss alone
- Powdered iron cores have higher core loss than ferrite at the same frequency — Their soft saturation is an advantage, but the tradeoff is higher loss per cycle. At switching frequencies above 200–300 kHz, powdered iron cores run hot
- Gapping increases fringing flux, which increases local core loss — The flux near a gap spreads out (fringes), and the concentrated flux in the core adjacent to the gap causes localized heating. This can crack ferrite cores or degrade adhesive holding a gapped core together
- Manufacturers don't always specify core loss directly — Some inductor datasheets give a "maximum temperature rise" at rated current and frequency. Others give core loss curves for the raw core material but not for the finished inductor. Calculation or measurement of core loss may be necessary
- Skin effect matters in inductors, not just transformers — A power inductor carrying mostly DC with small ripple might seem immune to skin effect, but the ripple current (which can be 30–40% of DC at the switching frequency) flows through the AC resistance. If the wire is thick and the frequency is high, the AC loss component can be surprisingly large

## In Practice

- An inductor running hotter than expected despite correct DC current suggests core losses — check if the switching frequency is appropriate for the core material
- Temperature rise that increases with frequency (at constant current) indicates core loss dominance
- Temperature rise that increases with current (at constant frequency) indicates copper loss dominance
- A thermal camera shows where the heat concentrates — uniform heating suggests distributed loss; hot spots suggest localized loss (near gaps, at wire terminations)
