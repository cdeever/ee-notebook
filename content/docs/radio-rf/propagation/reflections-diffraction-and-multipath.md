---
title: "Reflections, Diffraction & Multipath"
weight: 30
---

# Reflections, Diffraction & Multipath

Free-space path loss describes signal behavior in a perfect vacuum with nothing between transmitter and receiver. The real world is full of surfaces, edges, and objects that interact with radio waves. Signals bounce off walls, bend around corners, scatter from rough surfaces, and arrive at the receiver via multiple paths. These effects can either help or hurt — multipath can fill in coverage shadows, but it can also cause deep signal nulls exactly where you need coverage.

## Reflection

When a radio wave hits a smooth surface that is large compared to the wavelength, it reflects. The behavior follows the same law as optical reflection — angle of incidence equals angle of reflection. Metals are near-perfect reflectors at radio frequencies. Concrete, glass, and water reflect strongly. Wood and drywall reflect partially.

The reflected signal carries most of the original energy but may undergo a phase shift at the surface. For a metal surface, the phase shift is approximately 180 degrees for the electric field component. This phase shift matters because when the reflected signal combines with the direct signal at the receiver, the relative phase determines whether they add constructively or cancel destructively.

Large flat surfaces — building walls, floors, metal roofs, bodies of water — create strong, coherent reflections. These produce the most significant multipath effects because the reflected signal retains most of its energy and coherence.

## Diffraction

Diffraction occurs when a radio wave encounters an edge or obstacle. The wave bends around the obstacle, partially filling in the shadow region behind it. Lower frequencies diffract more effectively — this is why AM radio (hundreds of kHz to low MHz) bends around hills and buildings while microwave signals (GHz) cast sharp shadows.

The degree of diffraction depends on the size of the obstacle relative to the wavelength. An obstacle much larger than the wavelength creates a sharp shadow with only slight bending at the edges. An obstacle comparable to the wavelength causes significant diffraction. An obstacle much smaller than the wavelength barely affects the wave at all.

Knife-edge diffraction — where a signal passes over a sharp ridge or building rooftop — is a common model for estimating diffraction loss. A signal passing just over a hilltop might experience only 6 dB of additional loss compared to free space. But a signal needing to diffract deep into the shadow behind a building might lose 20-30 dB.

## Scattering

Scattering occurs when a signal encounters objects that are roughly the same size as the wavelength or surfaces that are rough on the scale of a wavelength. Instead of a clean reflection, the energy disperses in many directions. Trees, lampposts, vehicles, and rough building surfaces all scatter radio waves.

Scattering generally reduces the energy in any one direction but spreads it more broadly. In urban environments, scattering from street furniture, vehicles, and building details fills in coverage gaps that pure reflection and diffraction models would predict as dead zones. This is why real-world coverage is often better than simple two-ray models predict — scattering creates diffuse energy that reaches unexpected places.

## Multipath Propagation

In any real environment, the receiver antenna collects signals that have traveled via multiple paths: the direct line-of-sight path, one or more reflected paths, diffracted paths, and scattered energy. Each path has a different length, a different attenuation, and a different phase when it arrives.

The received signal is the vector sum of all these components. Depending on the relative phases:

**Constructive interference:** When path length differences are multiples of the wavelength, signals add. The received signal can actually be stronger than the direct path alone — up to 6 dB stronger with one strong reflection.

**Destructive interference:** When path length differences are odd multiples of half a wavelength, signals cancel. In theory, two equal-strength signals with 180-degree phase difference produce zero — a complete null. In practice, the null is not perfect, but deep fades of 20-30 dB below the average are common.

A half wavelength at 2.4 GHz is about 6.25 cm. Moving the receiver by just a few centimeters can swing the signal from a deep null to a strong peak. This spatial variation is called small-scale fading or Rayleigh fading.

## Fading

Fading describes signal strength variations caused by multipath, and it comes in several flavors:

**Small-scale (fast) fading:** Rapid signal variation over distances of a wavelength or less. Moving the antenna a few centimeters changes the multipath combination. At 2.4 GHz in an indoor environment, you can observe 20-30 dB signal variation over a few centimeters.

**Large-scale (slow) fading / shadowing:** Gradual signal variation over distances of many wavelengths, caused by obstacles blocking the path. Walking behind a concrete pillar or around a corner creates slow fading. Log-normal shadowing models describe this, with standard deviations typically 4-12 dB depending on the environment.

**Flat fading:** When all frequency components of the signal experience the same fade. This occurs when the signal bandwidth is narrow compared to the channel coherence bandwidth.

**Frequency-selective fading:** When different frequencies within the signal bandwidth experience different fading. This occurs when multipath delay spread is significant relative to the symbol duration, causing inter-symbol interference in digital communications. Wideband signals are more susceptible.

## Multipath Delay Spread

Each multipath component arrives at a slightly different time because it traveled a different distance. The difference between the first arriving signal and the last significant component is the delay spread. Typical values:

| Environment | RMS Delay Spread | Implication |
|-------------|-----------------|-------------|
| Open field | 10-50 ns | Minimal multipath |
| Suburban | 50-200 ns | Moderate multipath |
| Urban outdoor | 200-500 ns | Significant multipath |
| Indoor (office) | 20-100 ns | Variable, depends on building |
| Indoor (factory) | 50-300 ns | Metal surfaces create strong reflections |

A delay spread of 100 ns means some signal copies arrive 100 ns after the direct path. For a digital system with a symbol rate of 10 Msymbols/s (100 ns per symbol), this delay spread smears one symbol into the next. This inter-symbol interference is a fundamental challenge for high-data-rate wireless systems and is why technologies like OFDM (used in WiFi and LTE) were developed — they use many narrowband subcarriers that are each longer than the delay spread.

## Multipath Mitigation Techniques

Practical systems use several approaches to cope with multipath:

- **Diversity:** Use multiple antennas spaced apart (spatial diversity) so they experience different fading. If one antenna is in a null, the other probably is not. WiFi MIMO uses this extensively.
- **Equalization:** Digital signal processing that measures the channel response and corrects for it. Requires training sequences or pilot symbols.
- **OFDM:** Divides data across many narrowband subcarriers, each of which sees flat fading even when the overall channel is frequency-selective.
- **Spread spectrum:** Spreads the signal across a wide bandwidth, making it resistant to narrowband fading. Used in GPS, CDMA, and Bluetooth frequency hopping.

## Gotchas

- **Moving the antenna a few centimeters can change everything** — At 2.4 GHz, a half wavelength is 6.25 cm. A deep null and a strong peak can be separated by less than the length of your finger. If a link is marginal, try shifting the antenna position slightly before adding power or gain.
- **Multipath makes coverage prediction unreliable** — Simple path-loss models predict smooth coverage contours. Real environments have pockets of strong and weak signal that can only be found by measurement. Walk testing with a signal strength meter is the only way to know for sure.
- **Reflections are not always bad** — In indoor environments, reflections fill in coverage behind obstacles. A room with metal walls might have better average coverage than one with RF-absorbing walls, even though the metal room has worse multipath variation.
- **Frequency-selective fading is why high data rates are hard** — Wider bandwidth means more susceptibility to frequency-selective fading. This is a fundamental tradeoff: higher data rates require more bandwidth, which makes the channel harder to equalize.
- **People are RF absorbers and reflectors** — A human body absorbs and scatters 2.4 GHz signals significantly. A person standing between transmitter and receiver can cause 10-15 dB of additional loss. Indoor propagation models that ignore people are optimistic.
- **Symmetry is rare in multipath environments** — The path from A to B may have different multipath characteristics than from B to A if the environments around the two antennas differ. Do not assume link quality is symmetric.
