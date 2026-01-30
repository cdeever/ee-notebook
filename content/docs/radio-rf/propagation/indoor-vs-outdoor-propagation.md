---
title: "Indoor vs Outdoor Propagation"
weight: 40
---

# Indoor vs Outdoor Propagation

Outdoor RF propagation is complicated enough — terrain, weather, and distance all affect the signal. But indoor propagation is in a different league of difficulty. Every wall, floor, door, piece of furniture, and person between transmitter and receiver interacts with the signal. Indoor environments are dense, reflective, and constantly changing. Understanding the differences between indoor and outdoor propagation is essential for anyone designing or troubleshooting wireless systems.

## Outdoor Propagation Characteristics

Outdoor propagation is dominated by a few large-scale effects:

**Path loss:** Signal strength decreases with distance, roughly following the free-space path loss model for line-of-sight links. Over longer distances, the path loss exponent increases beyond the free-space value of 2 due to ground reflections and terrain effects — typical values range from 2.5 to 4.5 depending on the environment.

**Terrain effects:** Hills, ridges, and valleys block and diffract signals. Terrain analysis is standard practice for outdoor link planning, and tools like terrain elevation databases make this predictable.

**Ground reflections:** The two-ray ground reflection model describes how a direct signal and a ground-reflected signal combine. Depending on antenna height and distance, these can add constructively or destructively. At long distances, the received power falls as 1/d^4 instead of the free-space 1/d^2 due to destructive interference between direct and reflected paths.

**Weather:** Rain, fog, and atmospheric conditions affect propagation, primarily above 10 GHz (see [Weather, Materials & Environment]({{< relref "/docs/radio-rf/propagation/weather-materials-and-environment" >}})).

The key advantage of outdoor propagation: it is relatively predictable. With good terrain data and line-of-sight analysis, you can estimate link performance to within a few dB before deploying anything.

## Indoor Propagation Characteristics

Indoor environments are electromagnetically chaotic. The signal path between two points inside a building may involve:

- Direct line-of-sight (if walls do not block it)
- Penetration through multiple walls and floors
- Reflections from metal surfaces, concrete, and glass
- Diffraction around doorways and corridor openings
- Scattering from furniture, equipment, and people
- Waveguiding down hallways and elevator shafts

All of these effects happen simultaneously, and their relative contributions change with frequency, position, and time (as people and doors move).

## Wall and Material Penetration Loss

Every wall or floor between transmitter and receiver adds loss. The amount depends on the material, its thickness, and the signal frequency.

### Typical single-wall penetration loss

| Material | Thickness | Loss at 900 MHz | Loss at 2.4 GHz | Loss at 5 GHz |
|----------|-----------|-----------------|-----------------|---------------|
| Drywall (gypsum) | 13 mm | 1-2 dB | 2-3 dB | 3-4 dB |
| Wooden door | 45 mm | 2-3 dB | 3-4 dB | 4-6 dB |
| Glass (single pane) | 6 mm | 1-2 dB | 2-3 dB | 3-6 dB |
| Low-E glass (metalized) | 6 mm | 8-15 dB | 10-20 dB | 15-25 dB |
| Brick | 100 mm | 4-8 dB | 5-10 dB | 8-15 dB |
| Concrete (reinforced) | 200 mm | 10-15 dB | 12-18 dB | 15-25 dB |
| Concrete block | 200 mm | 8-12 dB | 10-15 dB | 12-20 dB |
| Metal (steel, aluminum) | Any | 30+ dB | 30+ dB | 30+ dB |
| Elevator shaft (metal) | - | 30-40 dB | 30-40 dB | 30-40 dB |

These values vary significantly with construction details. A concrete wall with dense rebar is much worse than plain concrete. A drywall partition with metal studs is worse than one with wood studs. Low-E coated glass (common in modern energy-efficient buildings) has a metallic coating that reflects RF very effectively — a major and growing problem for indoor coverage from outdoor base stations.

## Floor-to-Floor Attenuation

Signals penetrating between floors experience substantial loss:

| Number of floors | Typical additional loss |
|-----------------|----------------------|
| 1 floor | 10-15 dB |
| 2 floors | 15-20 dB |
| 3 floors | 20-25 dB |
| 4+ floors | 25-30 dB |

The loss does not scale linearly — the first floor adds the most, and additional floors add somewhat less because signals find alternative paths (through stairwells, elevator shafts, and exterior windows). Concrete floors with metal decking are the worst case.

## Frequency Matters

Lower frequencies penetrate building materials better and diffract around obstacles more effectively. This has major practical consequences:

**900 MHz (ISM band, some IoT):** Penetrates most non-metal walls well. Provides good coverage through 1-2 walls. Better diffraction around obstacles. This is why 900 MHz IoT protocols (Z-Wave, some LoRa) are popular for whole-building coverage.

**2.4 GHz (WiFi, Bluetooth, Zigbee):** Moderate penetration. Suffers noticeably through concrete and brick. This is the most congested ISM band, so interference adds to propagation challenges. Still, 2.4 GHz is a reasonable compromise between coverage and data rate.

**5 GHz (WiFi 5/6):** Higher throughput but significantly worse penetration. A single concrete wall can render a 5 GHz link unusable. Coverage areas are smaller, so more access points are needed. The advantage is less congestion and wider channels.

**6 GHz (WiFi 6E/7):** Even worse penetration, but massive bandwidth available. Best for same-room, high-throughput applications. Essentially requires line-of-sight or a single light wall.

## The Hallway Waveguide Effect

Long corridors with smooth walls can act as waveguides, channeling RF energy down their length with surprisingly low loss. A signal can propagate hundreds of meters down a hospital or office corridor while penetrating only one or two rooms to each side. This creates elongated coverage patterns — strong signal down the hall, weak signal through the walls.

This effect is frequency-dependent and works better at higher frequencies where the corridor dimensions are large relative to the wavelength. It is one of the few indoor propagation effects that actually helps, though it makes coverage patterns irregular and hard to predict from floor plans alone.

## Indoor Path Loss Models

Several empirical models exist for indoor propagation:

**ITU-R P.1238:** Models indoor loss as a function of distance, frequency, and number of floors. Provides a path loss exponent and floor penetration factors for different building types (residential, office, commercial).

**Multi-wall model:** Adds free-space path loss to the cumulative penetration loss of each wall and floor in the path. Requires knowing the building layout and wall materials. More accurate than simple distance-based models.

**Log-distance model:** FSPL modified with a higher path loss exponent (typically 2.5-4 for indoor environments) and a log-normal shadowing term with 3-8 dB standard deviation.

None of these models are accurate enough to replace actual measurement. They are useful for initial planning — estimating the number of access points needed, for example — but final placement always requires on-site testing.

## Practical Walk Testing

The most reliable way to understand indoor propagation is to measure it. A walk test involves:

1. Place the transmitter (or access point) at the planned location
2. Walk through the coverage area with a signal strength measurement tool
3. Record received signal level (RSSI) at multiple points
4. Map the coverage and identify dead zones

For WiFi, smartphone apps like WiFi Analyzer provide rough RSSI measurements. For more accurate work, a laptop with a calibrated WiFi adapter or a dedicated survey tool (Ekahau, NetSpot) is appropriate. For non-WiFi systems, an SDR or spectrum analyzer with appropriate antenna can measure signal levels.

Walk testing reveals surprises that no model predicts: the metal filing cabinet blocking the signal to the corner office, the elevator shaft creating a dead zone, the conference room with metallized glass that is RF-dark.

## Gotchas

- **Modern buildings are getting worse for RF** — Energy-efficient construction uses Low-E glass, foil-backed insulation, and metal vapor barriers. These are essentially RF shielding. A building that is great for energy efficiency may be terrible for wireless coverage.
- **Wall loss is not constant across the wall** — Penetration loss depends on angle of incidence. Signals hitting a wall at a steep angle travel through more material and experience more loss. The "one wall = 3 dB" rule assumes near-normal incidence.
- **Doors make a huge difference** — An open door is nearly transparent to RF. A closed fire door with metal core can add 10-15 dB. Coverage can change dramatically depending on whether doors are open or closed — and they change throughout the day.
- **People absorb 2.4 and 5 GHz significantly** — A crowded conference room has 10-15 dB more loss than an empty one at 2.4 GHz. This is one reason links that work during testing (empty building) fail during actual use.
- **Do not trust floor plan models alone** — The only way to know indoor coverage is to measure it. Plans do not show rebar density, metal ductwork, lead-lined walls (found in hospitals and labs), or the giant metal bookshelf someone placed between you and the access point.
