---
title: "Free-Space Path Loss"
weight: 10
---

# Free-Space Path Loss

When you transmit RF energy into open space, the power spreads out over an ever-growing sphere. By the time it reaches a distant receiver, only a tiny fraction of the original power is intercepted by the receiving antenna. This geometric spreading is called free-space path loss (FSPL), and it is the absolute minimum loss you will ever see between two antennas — real environments always add more.

## The Inverse Square Law

Electromagnetic waves radiate outward from a source. At distance d, the power is spread over the surface of a sphere with area 4*pi*d^2. Double the distance and the sphere's surface area quadruples, so the power density drops to one quarter. This is the inverse square law, and it applies to all radiation — light, sound, and radio.

In decibels, doubling the distance costs 6 dB. Every factor of 10 in distance costs 20 dB. This is a fundamental geometric reality, not something you can engineer around — you can only compensate for it with more transmit power, higher antenna gain, or better receiver sensitivity.

## The FSPL Formula

The standard formula for free-space path loss in decibels:

**FSPL (dB) = 20 * log10(d) + 20 * log10(f) + 32.44**

Where d is distance in kilometers and f is frequency in megahertz. This formula assumes isotropic (omnidirectional) antennas at both ends.

The frequency dependence sometimes confuses people. Space itself does not attenuate higher frequencies more — the frequency term comes from the effective aperture of an isotropic antenna, which shrinks with wavelength. A higher-frequency signal requires a proportionally larger antenna to capture the same fraction of the passing energy.

## FSPL at Common Frequencies and Distances

| Distance | 433 MHz | 915 MHz | 2.4 GHz | 5.8 GHz |
|----------|---------|---------|---------|---------|
| 1 m | 25.2 dB | 31.7 dB | 40.0 dB | 47.7 dB |
| 10 m | 45.2 dB | 51.7 dB | 60.0 dB | 67.7 dB |
| 100 m | 65.2 dB | 71.7 dB | 80.0 dB | 87.7 dB |
| 1 km | 85.2 dB | 91.7 dB | 100.0 dB | 107.7 dB |
| 10 km | 105.2 dB | 111.7 dB | 120.0 dB | 127.7 dB |

At 2.4 GHz across a 100-meter line-of-sight link, you lose 80 dB just from geometric spreading. That is a factor of 10^8 — one hundred million — in power. The signal still gets through because transmitters output milliwatts to watts, and receivers can detect signals down to roughly -90 to -100 dBm.

## Link Budget Basics

A link budget is the accounting of all gains and losses between transmitter and receiver. The basic equation:

**Received power (dBm) = Tx power (dBm) + Tx antenna gain (dBi) - Path loss (dB) + Rx antenna gain (dBi)**

For example, a WiFi access point at 2.4 GHz:
- Transmit power: +20 dBm (100 mW)
- Transmit antenna gain: +3 dBi
- Path loss at 50 m: -74 dB (FSPL)
- Receive antenna gain: +2 dBi
- **Received power: +20 + 3 - 74 + 2 = -49 dBm**

A typical WiFi receiver can decode at -70 to -80 dBm, so this link has 21-31 dB of margin. That margin is what keeps the link working when real-world losses pile on top of FSPL.

## Link Margin

Link margin is the difference between the received signal level and the minimum required signal level (receiver sensitivity). It is your safety cushion against real-world impairments that FSPL does not account for:

- Multipath fading (5-20 dB variations)
- Body absorption (3-10 dB when a person is in the path)
- Wall penetration (3-15 dB per wall)
- Antenna misalignment (1-10 dB depending on directivity)
- Component aging and cable losses (1-3 dB)

For indoor consumer links (WiFi, Bluetooth), 10-15 dB of margin is reasonable. For outdoor point-to-point links or mission-critical systems, 15-20 dB is typical. For satellite links or systems where reliability is critical, 3-6 dB may be all that physics allows, but every fraction of a dB is carefully managed.

## Why Higher Frequencies Need More Help

The FSPL table shows that moving from 433 MHz to 2.4 GHz adds about 15 dB of path loss at every distance. Moving to 5.8 GHz adds another 7.7 dB. This is a significant penalty — 15 dB means you need 30 times more transmit power or 30 times more antenna gain to achieve the same received signal level.

In practice, higher frequencies compensate with directional antennas. Because antenna gain scales with frequency for a given physical size, a small dish or patch array at 5.8 GHz can deliver substantial gain. A 30 cm dish at 5.8 GHz has roughly 23 dBi of gain, which more than compensates for the additional path loss compared to 433 MHz with an omnidirectional antenna.

This is the fundamental tradeoff: lower frequencies propagate farther with simple antennas, but higher frequencies can focus energy more tightly with compact antennas. The right choice depends on whether you need omnidirectional coverage or a directed link.

## Receiver Sensitivity Sets the Limit

The link budget ends at the receiver. Receiver sensitivity is the weakest signal the receiver can detect with acceptable performance (usually defined as a specific bit error rate or signal-to-noise ratio).

Typical receiver sensitivities:
- FM broadcast radio: -90 dBm
- WiFi (802.11n, low data rate): -82 dBm
- WiFi (802.11ac, high data rate): -62 dBm
- Bluetooth Low Energy: -95 dBm
- LoRa (long range IoT): -137 dBm
- GPS: -130 dBm

The difference between WiFi's -82 dBm and LoRa's -137 dBm is 55 dB — a factor of over 300,000 in power. LoRa achieves this by using very narrow bandwidth and spread-spectrum techniques, trading data rate for sensitivity. GPS is even more extreme, using spreading codes and very long integration times. These numbers explain why LoRa and GPS can work over vastly greater distances than WiFi for the same transmit power.

## Gotchas

- **FSPL is the best case, never the real case** — Real environments add reflection loss, absorption, diffraction, and multipath fading on top of free-space spreading. Use FSPL as a baseline and add margin for everything else.
- **The frequency term is not atmospheric absorption** — Higher FSPL at higher frequencies comes from the shrinking effective aperture of an isotropic antenna, not from the air absorbing more. Atmospheric effects are separate and additional.
- **Antenna gain compensates path loss, but narrows coverage** — A 15 dBi antenna adds 15 dB to your link budget, but it concentrates the signal into a narrow beam. If the receiver moves out of that beam, the link fails. Gain is not free — it comes from directionality.
- **Cable loss eats your link budget before the signal leaves** — A 3-meter run of RG-174 at 2.4 GHz loses about 3 dB. That is half your transmit power gone before it reaches the antenna. Use low-loss cable or mount the radio close to the antenna.
- **dBm and dBi are not the same thing** — dBm is absolute power referenced to 1 milliwatt. dBi is antenna gain referenced to an isotropic radiator. Mixing them up in a link budget produces nonsense. Keep units straight.
- **Link budgets assume clear line of sight** — If there is no direct line of sight between antennas, the actual loss can be 20-40 dB worse than FSPL. Always check whether the path is actually clear, including Fresnel zone clearance (see [Antenna Height & Placement Effects]({{< relref "/docs/radio-rf/propagation/antenna-height-and-placement" >}})).
