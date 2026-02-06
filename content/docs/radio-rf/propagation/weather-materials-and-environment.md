---
title: "Weather, Materials & Environment"
weight: 70
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Weather, Materials & Environment

RF propagation does not happen in a vacuum — it happens through air, rain, vegetation, and building materials, each of which interacts with electromagnetic waves in frequency-dependent ways. A link designed with only free-space path loss will work beautifully on a clear day and fail during a thunderstorm. Understanding what the real environment does to a signal is essential for building systems that work year-round.

## Rain Fade

Rain is the most significant weather impairment for RF links, but only above about 10 GHz. Raindrops are comparable in size to millimeter wavelengths, causing absorption and scattering. Below 10 GHz, rain has negligible effect.

| Frequency | Light rain (2 mm/hr) | Moderate rain (12 mm/hr) | Heavy rain (50 mm/hr) |
|-----------|---------------------|-------------------------|----------------------|
| 5 GHz | ~0 dB/km | ~0 dB/km | 0.01 dB/km |
| 10 GHz | 0.02 dB/km | 0.1 dB/km | 0.5 dB/km |
| 20 GHz | 0.1 dB/km | 1.0 dB/km | 5 dB/km |
| 40 GHz | 0.5 dB/km | 3 dB/km | 12 dB/km |
| 60 GHz | 1 dB/km | 5 dB/km | 18 dB/km |
| 80 GHz | 1.5 dB/km | 7 dB/km | 22 dB/km |

For a 1 km backhaul link at 38 GHz, heavy rain adds roughly 10 dB of loss on top of free-space path loss. This must be included in the link budget as rain margin. Telecom engineers use local rainfall statistics (often expressed as rain rate exceeded for 0.01% of the year) to calculate the required margin for a given availability target. A link designed for 99.99% availability in a rainy climate might need 15-20 dB more margin than one in an arid region.

Rain also depolarizes signals — the asymmetric shape of falling raindrops (oblate spheroids, not teardrops) rotates the polarization of the wave slightly. This affects systems that use orthogonal polarizations to carry separate data streams, as rain-induced cross-polarization creates interference between the streams.

## Fog, Humidity, and Atmospheric Moisture

Below 10 GHz, fog and humidity have negligible effect on propagation. At microwave and millimeter-wave frequencies, water vapor contributes to atmospheric absorption (see [Frequency-Dependent Propagation]({{< relref "/docs/radio-rf/propagation/frequency-dependent-behavior" >}})), but fog adds relatively little additional loss beyond what clear-air humidity contributes.

Dense fog at 60 GHz adds roughly 0.5 dB/km — significant but much less than rain. The common intuition that "fog blocks signals" is largely wrong at radio frequencies, though it is true for optical and infrared links where fog causes severe attenuation.

Humidity does affect propagation subtly. Higher humidity increases the refractive index of the atmosphere, which can create ducting conditions — layers where signals get trapped and propagate beyond the normal horizon. This is an occasional effect rather than a design factor, but it explains anomalous long-range reception seen in maritime and coastal environments.

## Snow and Ice on Antennas

Snow and ice on the antenna itself are a bigger problem than snow or ice in the propagation path. A layer of wet snow or ice on a dish antenna, patch array, or dipole does several things:

- **Detunes the antenna** — Ice changes the dielectric environment around the antenna elements, shifting the resonant frequency and degrading the impedance match. A well-tuned 2.4 GHz antenna might shift by tens of MHz when iced, reducing efficiency by 3-10 dB.
- **Absorbs signal** — Wet snow and ice have dielectric loss that absorbs RF energy. Loss through a centimeter of wet ice can be 1-5 dB depending on frequency and ice characteristics.
- **Adds weight** — Mechanical concern more than electrical, but ice loading can damage mast-mounted antennas and their mounting hardware.

Radomes (protective covers) shield antennas from direct ice accumulation, but ice on the radome surface still affects the signal. Heated radomes are used on critical links (radar systems, cellular base stations) in cold climates. For smaller installations, hydrophobic coatings help shed water and reduce ice adhesion.

Dry, powdery snow is much less of a problem than wet snow or ice. Dry snow has low water content and low dielectric loss. A coating of fluffy snow on a dish antenna may cause only 1-2 dB of additional loss.

## Vegetation

Trees and vegetation absorb RF energy, and the effect increases with frequency:

| Frequency | Loss through moderate tree canopy (10 m depth) |
|-----------|------------------------------------------------|
| 400 MHz | 3-5 dB |
| 900 MHz | 5-10 dB |
| 2.4 GHz | 10-20 dB |
| 5 GHz | 15-30 dB |
| 28 GHz | 30-50 dB |

The loss comes from absorption by water in leaves and branches, plus scattering from trunk and branch structures. Deciduous trees show strong seasonal variation — a tree that adds 15 dB of loss in summer may add only 5 dB in winter when bare. This creates links that work reliably in winter and fail in summer, which is confusing to diagnose without considering seasonal foliage.

Dense forest is extremely challenging for higher frequencies. A 5 GHz WiFi link through 50 meters of forest may experience 30-60 dB of excess loss beyond free-space path loss. For applications in forested environments (wildlife monitoring, trail cameras, forestry operations), lower frequencies (sub-GHz) are strongly preferred.

## Material RF Properties

When signals pass through or reflect off materials, two electrical properties determine the interaction:

**Dielectric constant (relative permittivity, epsilon_r):** Determines how much the wave slows down inside the material and how much is reflected at the surface. Higher dielectric constant means more reflection.

**Loss tangent (tan delta):** Determines how much energy is absorbed as the wave passes through the material. Higher loss tangent means more absorption.

### RF properties of common materials

| Material | Dielectric constant (epsilon_r) | Loss tangent (tan delta) | Notes |
|----------|-------------------------------|-------------------------|-------|
| Dry air | 1.0006 | ~0 | Essentially transparent |
| Dry wood | 1.5-2.5 | 0.01-0.05 | Low loss, moderate penetration |
| Dry plywood | 1.5-2.0 | 0.02-0.04 | Similar to wood |
| Glass | 4-8 | 0.005-0.02 | Low loss, moderate reflection |
| Dry brick | 3.5-5 | 0.01-0.03 | Moderate penetration |
| Dry concrete | 4-8 | 0.01-0.05 | Moderate to high reflection |
| Wet concrete | 8-15 | 0.1-0.3 | Much higher loss when wet |
| Water (liquid) | 80 | 0.1-1 (freq-dependent) | Very high reflection and absorption |
| FR4 (PCB) | 4.2-4.8 | 0.02 | Relevant for on-board antennas |
| PTFE (Teflon) | 2.1 | 0.0002 | Very low loss, used in RF substrates |
| Soil (dry) | 3-5 | 0.01-0.1 | Variable with moisture content |
| Soil (wet) | 10-30 | 0.1-0.5 | Dramatically worse when wet |

### Attenuation through common building materials

| Material | Loss at 2.4 GHz | Loss at 5 GHz |
|----------|-----------------|---------------|
| Drywall (13 mm) | 2-3 dB | 3-4 dB |
| Plywood (19 mm) | 1-2 dB | 2-3 dB |
| Single glass pane | 2-3 dB | 3-6 dB |
| Low-E coated glass | 10-20 dB | 15-25 dB |
| Brick wall (single wythe) | 5-10 dB | 8-15 dB |
| Concrete (200 mm) | 12-18 dB | 15-25 dB |
| Concrete with rebar | 15-25 dB | 20-30 dB |
| Metal door/panel | 30+ dB | 30+ dB |

Water content has an enormous effect on material properties. Dry concrete may have a loss tangent of 0.02; wet concrete can reach 0.3 — an order of magnitude higher. A freshly poured concrete wall absorbs far more RF than a fully cured one. Wet soil is dramatically worse than dry soil. After a rainstorm, outdoor ground-reflected paths change because the ground's electrical properties change.

## Seasonal and Temporal Variation

Several environmental factors change with time:

**Seasonal foliage:** Deciduous trees in temperate climates create seasonal propagation changes of 5-15 dB at UHF and above. Links designed in winter may fail in summer.

**Diurnal atmospheric changes:** Temperature inversions (common at dawn and dusk) can create ducting conditions that bend signals beyond the horizon, causing temporary extended range or interference from distant transmitters.

**Construction and landscaping:** Buildings get built, walls get added, trees grow. A link budget calculated today may not apply in five years if the environment changes.

**Moisture variation:** Rain on the ground, humidity in walls, and water in vegetation all change with weather and season, subtly affecting propagation conditions.

## Tips

- When a link fails intermittently, correlate the failures with weather data — rain, humidity, and recent watering all change material RF properties and can explain patterns that look random
- Design outdoor links for the worst-case season, not the season when testing happens; a tree-lined path that is clear in winter may add 10-15 dB of loss when foliage returns in summer
- Use local rainfall statistics (rain rate exceeded for 0.01% of the year) rather than generic values when calculating rain margin for links above 10 GHz
- Protect antennas from direct ice and snow accumulation with radomes or hydrophobic coatings — detuning from ice on the antenna elements costs far more than any attenuation from ice in the air path

## Caveats

- **Wet anything is worse than dry** — Water has a dielectric constant of 80, which means it strongly reflects and absorbs RF; wet concrete, wet soil, wet wood, and wet vegetation all attenuate signals much more than their dry counterparts; if a link fails intermittently, check whether it correlates with rain or recent watering
- **Low-E glass is an invisible RF wall** — Modern energy-efficient windows have metallic coatings that reflect RF as effectively as a metal sheet; if a signal must pass through modern glazing, test the actual glass — do not assume it behaves like old single-pane windows
- **Seasonal foliage changes are real and large** — A link that works in winter may fail in summer due to 10-15 dB of additional tree absorption; design for the worst-case season, not the season of initial testing
- **Rain fade calculations need local climate data** — A 38 GHz link in Arizona needs far less rain margin than one in Seattle; use local rainfall statistics, not generic values, for link budget calculations
- **Ice on the antenna is worse than ice in the path** — Detuning from ice on the antenna elements can cost 3-10 dB, while ice in the air path has negligible effect at most frequencies; protect the antenna, not the air space
- **Soil moisture affects ground-mounted and buried antennas dramatically** — A ground-plane antenna on wet soil has different impedance and radiation characteristics than on dry soil; if the antenna is at or near ground level, expect performance to vary with weather

## In Practice

- Monitoring a long-running outdoor link's RSSI alongside a rain gauge produces a clear correlation above 10 GHz — signal drops appear during heavy rain and recover as the rain stops
- A VNA sweep of a dish antenna before and after spraying it with water shows the resonant frequency shift and increased return loss caused by moisture on the antenna surface
- Measuring WiFi signal strength through a window and then through the same window with a Low-E coating sample taped over it demonstrates the 10-20 dB difference that metallic coatings introduce
- Comparing RSSI readings on a tree-lined outdoor link in summer versus winter, with all other variables held constant, quantifies the seasonal foliage penalty for that specific path
