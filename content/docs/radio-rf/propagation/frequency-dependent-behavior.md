---
title: "Frequency-Dependent Propagation"
weight: 50
---

# Frequency-Dependent Propagation

The way radio waves travel through the real world depends profoundly on frequency. Low frequencies bend around obstacles and bounce off the ionosphere. Mid-range frequencies travel reliably in straight lines. High frequencies require clear line-of-sight and suffer from rain, but offer enormous bandwidth. Choosing a frequency band is choosing a set of propagation physics — and the constraints that come with them.

## The General Pattern

A few broad rules hold across the spectrum:

**Lower frequencies = longer range, better penetration, larger antennas.** Waves with long wavelengths diffract around obstacles, penetrate buildings, and propagate beyond the horizon via ground wave or ionospheric reflection. But they require physically large antennas (a quarter-wave at 1 MHz is 75 meters) and bandwidth is scarce — the entire AM broadcast band is only 1 MHz wide.

**Higher frequencies = shorter range, more directional, smaller antennas, wider bandwidth.** Short wavelengths do not diffract well, are absorbed by walls and rain, and are limited to line-of-sight. But small antennas can be highly directional, and there is vastly more bandwidth available. The entire usable spectrum below 1 GHz is less bandwidth than a single 5G millimeter-wave channel.

This tradeoff is the central tension in radio system design. Every frequency choice is a compromise.

## Band-by-Band Propagation Characteristics

### HF (3-30 MHz) — The Skywave Band

HF is unique because it reflects off the ionosphere — the electrically charged layers of the upper atmosphere at 60-400 km altitude. A signal transmitted upward at the right angle returns to Earth hundreds or thousands of kilometers away. This skywave propagation enables long-distance communication with modest power and simple antennas.

Ionospheric reflection depends on frequency, time of day, season, solar activity, and the angle of incidence. Lower HF frequencies (3-10 MHz) reflect more reliably but with more absorption loss. Higher HF frequencies (15-30 MHz) can propagate farther with less loss but are more affected by ionospheric variability. At night, the D layer (which absorbs HF) disappears, enabling longer-range propagation on lower frequencies — this is why AM radio stations are heard from farther away at night.

HF propagation is inherently unpredictable. The ionosphere changes hour by hour, and a frequency that works at noon may be useless at midnight. Amateur radio operators call this "conditions" — sometimes the bands are open, sometimes they are dead.

### VHF (30-300 MHz) — Line-of-Sight with Some Bending

VHF frequencies generally do not reflect from the ionosphere (with occasional exceptions during solar maxima or sporadic E events). Propagation is primarily line-of-sight, with some diffraction over terrain and tropospheric effects.

VHF still diffracts reasonably well around moderate obstacles. FM broadcast at 88-108 MHz provides coverage in hilly terrain that higher frequencies cannot match. VHF signals penetrate vegetation and light building construction moderately well.

Range is primarily limited by the horizon. For ground-based antennas, the radio horizon is about 15% farther than the visual horizon due to atmospheric refraction. Raising antenna height extends range significantly — this is why VHF broadcast and public safety transmitters are placed on hilltops and towers.

### UHF (300 MHz - 3 GHz) — The Workhorse Bands

UHF is where most modern wireless systems live: cellular (700 MHz - 2.6 GHz), WiFi (2.4 GHz), Bluetooth (2.4 GHz), GPS (1.575 GHz), LTE, and countless others. Propagation is line-of-sight with reflections and scattering from buildings and terrain.

At UHF, building penetration is still reasonable (especially at the lower end), antennas are small enough for handheld devices, and enough bandwidth exists for moderate to high data rates. The 900 MHz ISM band penetrates buildings well enough for whole-home IoT coverage. The 2.4 GHz band is a compromise — adequate penetration, compact antennas, and sufficient bandwidth for WiFi.

UHF signals interact strongly with the built environment. Urban propagation involves extensive multipath from buildings, and models like Okumura-Hata and COST 231 were developed specifically for UHF cellular planning.

### Microwave (3-30 GHz) — Directional and Weather-Sensitive

Above 3 GHz, propagation becomes increasingly directional and sensitive to environmental conditions. Signals are blocked by most building materials and vegetation. Line-of-sight is essential.

Atmospheric effects become significant. Rain attenuates signals noticeably above about 10 GHz — a phenomenon called rain fade. At 10 GHz, moderate rain (25 mm/hr) adds roughly 5 dB/km of attenuation. At 20 GHz, the same rain adds about 15 dB/km. This must be accounted for in link budgets for outdoor microwave links.

The 60 GHz oxygen absorption line deserves special mention: atmospheric oxygen absorbs RF energy strongly around 60 GHz, with peak attenuation of about 15 dB/km even in clear air. This limits 60 GHz links to very short range but provides inherent security — the signal does not propagate far enough to be intercepted at a distance.

Microwave bands are used for point-to-point backhaul links (highly directional dishes), satellite communication, and radar. The high directivity possible with moderate-sized antennas makes these bands ideal for focused links.

### Millimeter Wave (30+ GHz) — Extreme Bandwidth, Extreme Limitations

Millimeter-wave frequencies (30-300 GHz) offer enormous bandwidth — hundreds of MHz to multi-GHz channels. 5G NR uses 24-40 GHz bands, and automotive radar operates at 77 GHz. WiGig uses 60 GHz for multi-gigabit short-range links.

Propagation is extremely limited. Millimeter waves are blocked by walls, windows, hands, and even heavy rain. Effective range outdoors is typically hundreds of meters at best. Indoor range may be a single room.

The practical approach with mmWave is to use dense arrays of small antennas (beamforming) to create highly directional beams that can be electronically steered. 5G base stations use arrays of 64-256 antenna elements to focus energy toward individual users. This compensates for the severe path loss with massive antenna gain.

## Frequency Band Summary Table

| Band | Range | Propagation | Penetration | Typical Uses |
|------|-------|-------------|-------------|-------------|
| HF (3-30 MHz) | Thousands of km (skywave) | Ionospheric reflection | Excellent through buildings | Amateur radio, maritime, military |
| VHF (30-300 MHz) | 50-200 km LOS | LOS + diffraction | Good through walls | FM broadcast, public safety, aviation |
| UHF (300 MHz-3 GHz) | 1-50 km LOS | LOS + reflection/scattering | Moderate (900 MHz good, 2.4 GHz fair) | Cellular, WiFi, Bluetooth, GPS |
| Microwave (3-30 GHz) | 1-30 km LOS | LOS only, rain fade | Poor | Satellite, radar, point-to-point |
| mmWave (30-300 GHz) | 10-500 m | LOS only, atmospheric abs. | Very poor (blocked by glass, hands) | 5G, automotive radar, WiGig |

## Atmospheric Absorption

The atmosphere itself has frequency-dependent absorption, primarily from water vapor and oxygen molecules:

| Frequency | Absorption Source | Attenuation (clear air) |
|-----------|------------------|------------------------|
| Below 10 GHz | Minimal | < 0.01 dB/km |
| 22.235 GHz | Water vapor resonance | ~0.2 dB/km |
| 60 GHz | Oxygen absorption peak | ~15 dB/km |
| 118.75 GHz | Oxygen | ~3 dB/km |
| 183 GHz | Water vapor | ~30 dB/km |

The absorption peaks create natural "fences" in the spectrum. The 60 GHz peak is deliberately exploited for short-range links (WiGig) where atmospheric absorption limits interference between nearby systems. The 22 GHz water vapor line is used by weather satellites to map atmospheric moisture.

Between these peaks are "windows" of relatively low absorption — at 35 GHz, 94 GHz, and 140 GHz — which are used for radar and communication.

## Gotchas

- **Ionospheric propagation is not reliable** — HF skywave can reach thousands of kilometers, but it depends on solar conditions, time of day, and season. A frequency that works today may not work tomorrow. HF communication requires constant frequency management and the willingness to try several bands.
- **"Line of sight" includes Fresnel zone clearance** — Having visual line of sight is not enough. The first Fresnel zone must be substantially clear (60%+) for reliable propagation. A link that visually clears a hill by a few meters may still lose 10-20 dB from Fresnel zone obstruction (see [Antenna Height & Placement Effects]({{< relref "/docs/radio-rf/propagation/antenna-height-and-placement" >}})).
- **Rain fade matters above 10 GHz but is often forgotten** — Outdoor microwave links that work perfectly in clear weather can fail during heavy rain. Link budgets must include rain margin based on local rainfall statistics, not just clear-air loss.
- **Lower frequency does not always mean better coverage** — While lower frequencies penetrate and diffract better, they also require larger antennas and have less bandwidth. A 900 MHz link through two walls may deliver 100 kbps; a 5 GHz link in the same room with line-of-sight delivers 100 Mbps. The right frequency depends on the application, not just the propagation.
- **The 2.4 GHz band is brutally congested** — WiFi, Bluetooth, Zigbee, microwave ovens, baby monitors, and countless other devices all share the 2.4 GHz ISM band. In a dense apartment building, interference can be a bigger problem than propagation loss. Moving to 5 GHz or 6 GHz may improve performance despite worse propagation because of reduced interference.
