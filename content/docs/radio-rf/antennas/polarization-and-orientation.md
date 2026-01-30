---
title: "Polarization & Orientation"
weight: 40
---

# Polarization & Orientation

Polarization is one of those topics that seems academic until you lose 20 dB of signal because your antennas are cross-polarized. The polarization of an electromagnetic wave describes the orientation and behavior of the electric field vector as the wave propagates. Getting it right is straightforward. Getting it wrong is expensive — and it happens more often than you'd expect in practice.

## What Polarization Means

An electromagnetic wave has electric and magnetic field components perpendicular to each other and to the direction of travel. The polarization is defined by the direction of the electric field vector.

For a simple linearly polarized wave, the electric field oscillates along a single line. If that line is vertical, the wave is vertically polarized. If horizontal, it's horizontally polarized. If tilted at some angle, it's slant-polarized.

The polarization of a radiated wave is determined by the antenna structure:
- A vertical dipole or monopole produces vertically polarized waves
- A horizontal dipole produces horizontally polarized waves
- A dipole tilted at 45 degrees produces slant-polarized waves at 45 degrees

This is one of those cases where the physical layout of the antenna directly maps to the physics of the wave.

## Circular Polarization

Circular polarization occurs when the electric field vector rotates as the wave propagates, tracing a circle (or more precisely, a helix) in space. This requires two orthogonal linear components of equal amplitude with a 90-degree phase difference.

There are two senses of rotation:
- **Right-hand circular polarization (RHCP)**: the field rotates clockwise when viewed from behind the wave (looking in the direction of propagation)
- **Left-hand circular polarization (LHCP)**: the field rotates counter-clockwise

Circular polarization is produced by:
- Helical antennas in axial mode (helix winding direction determines RHCP vs LHCP)
- Crossed dipoles fed with a 90-degree phase shift
- Patch antennas with truncated corners or dual feeds
- Turnstile antennas (two crossed dipoles)

**Why circular polarization matters for satellite communication:** A satellite in orbit has no fixed orientation relative to a ground station. If both antennas were linearly polarized, the relative rotation between them would cause the received signal to fade in and out as the satellite tumbles or moves. Circular polarization eliminates this problem because RHCP received by an RHCP antenna gives full signal regardless of the physical orientation of either antenna.

The tradeoff is a 3 dB loss when a circularly polarized antenna receives a linearly polarized signal (or vice versa). The circularly polarized wave has its power split equally between two orthogonal linear components, and the linear antenna only captures one.

## Elliptical Polarization

In practice, most "circularly polarized" antennas produce elliptical polarization — the electric field traces an ellipse rather than a perfect circle. The **axial ratio** measures how circular the polarization actually is:

- Axial ratio = 1 (0 dB): perfect circular polarization
- Axial ratio = infinity: linear polarization
- Typical "circular" antenna: axial ratio 1-3 dB across the main beam

An axial ratio of 3 dB means the major axis of the ellipse has twice the power of the minor axis. This is often the limit specification for a "circularly polarized" antenna — anything beyond 3 dB is considered elliptical.

Axial ratio typically degrades off-boresight. A patch antenna might have 1 dB axial ratio on-axis but 6 dB at 45 degrees off-axis. For satellite communication where the satellite moves across the sky, this means polarization quality varies with elevation angle.

## Cross-Polarization Loss

When the transmit and receive antenna polarizations don't match, signal is lost. The polarization loss factor (PLF) quantifies this:

| TX Polarization | RX Polarization | Loss |
|---|---|---|
| Vertical | Vertical | 0 dB (matched) |
| Horizontal | Horizontal | 0 dB (matched) |
| Vertical | Horizontal | Infinite (complete null in theory) |
| Vertical | 45-degree slant | 3 dB |
| RHCP | RHCP | 0 dB (matched) |
| LHCP | LHCP | 0 dB (matched) |
| RHCP | LHCP | Infinite (complete null in theory) |
| RHCP | Vertical (linear) | 3 dB |
| Vertical | RHCP | 3 dB |

The "infinite loss" for cross-polarized cases is theoretical. In practice, reflections, diffraction, and imperfect antenna polarization purity mean you typically see 20-30 dB of cross-polarization isolation rather than true infinity.

That 20 dB figure is important: it means a vertically polarized signal received on a horizontal antenna is attenuated by about 20 dB in a real environment. That's the difference between a strong signal and a barely detectable one.

## Polarization in Real Environments

The clean theory above assumes free space. In real environments, things get messier:

**Multipath and polarization scrambling.** When signals bounce off buildings, terrain, and other objects, each reflection can rotate the polarization. After multiple reflections, the received signal is a jumble of different polarizations. In dense urban environments or indoors, the original polarization is largely destroyed, and the received signal is quasi-random in polarization.

This is actually one reason why circular polarization is less advantageous indoors than it is for satellite links. If multipath scrambles the polarization anyway, the 3 dB penalty of using circular with a linear source is wasted — you'd be better off with the full linear match.

**Ground reflections.** A signal bouncing off the ground changes polarization. Horizontal polarization reflects with a phase reversal at low angles (which can cancel the direct path signal near the ground). Vertical polarization reflects without reversal at angles above the Brewster angle. These effects influence propagation and are why VHF/UHF broadcast antennas use specific polarizations depending on terrain and coverage goals.

**Faraday rotation.** Radio waves passing through the ionosphere experience Faraday rotation — the polarization plane rotates due to the Earth's magnetic field and ionospheric electron density. At HF frequencies, this rotation can be many complete turns, making the received polarization essentially random. This is why HF communication systems typically use circular polarization or accept the 3 dB statistical average loss from using linear.

## Orientation Effects on Signal Strength

Even without cross-polarization, the orientation of an antenna relative to the incoming signal affects signal strength through the radiation pattern:

- A dipole has maximum gain broadside and nulls off the ends. Rotating the dipole so its end points at the transmitter drops the signal into the null.
- A vertically-oriented monopole in a car works well for signals coming from the horizon. A signal from directly overhead (like a satellite at zenith) falls in the monopole's null.
- A Yagi pointed at the transmitter versus 90 degrees off-axis might differ by 15-20 dB.

In mobile and handheld applications, the antenna orientation is constantly changing. A handheld radio held vertically, tilted, or horizontal gives different signal strengths to a vertically polarized base station. The orientation effect combines with the polarization effect to produce signal variations of 10-20 dB during normal use.

## When Polarization Matters and When It Doesn't

**Polarization matters most:**
- Satellite communication (no multipath, orientation varies)
- Point-to-point links in free space or low-clutter environments
- Radar systems (cross-pol returns reveal target characteristics)
- EMC testing (different polarizations excite different modes)

**Polarization matters less:**
- Indoor WiFi and Bluetooth (multipath dominates)
- Dense urban cellular (scattering randomizes polarization)
- HF communication (ionospheric Faraday rotation)
- Handheld devices (user orientation is unpredictable)

For the "matters less" cases, diversity techniques (using two orthogonally polarized antennas and selecting the stronger signal) often provide more benefit than trying to optimize polarization alignment.

## Gotchas

- **Cross-polarization loss is 20 dB in practice, not infinite** — Real environments, imperfect antennas, and mounting errors ensure some cross-pol coupling. But 20 dB is still devastating for a marginal link budget.
- **Circular polarization sense is reversed on reflection** — An RHCP wave bouncing off a flat surface becomes LHCP. A circularly polarized radar transmitting RHCP and listening for RHCP will reject single-bounce returns (used for rain clutter rejection).
- **"Vertical" polarization on a tilted antenna isn't vertical** — If a mobile radio is tilted 30 degrees, the "vertically polarized" signal is actually slant-polarized. This causes a 1.25 dB polarization loss against a true vertical receive antenna.
- **Axial ratio degrades off-boresight** — A circularly polarized patch antenna might have excellent axial ratio at broadside but behave nearly linearly at 60 degrees off-axis. If the satellite is low on the horizon, the polarization match may be poor.
- **Multipath can occasionally help with polarization** — In a rich scattering environment, signals arrive from many angles and polarizations. A cross-polarized antenna might still receive adequate signal through reflected paths, masking the cross-pol problem.
- **RHCP and LHCP are defined from the transmitter's perspective** — Some references define them from the receiver's perspective, which reverses the sense. Always check the convention being used, especially when specifying satellite antennas.
