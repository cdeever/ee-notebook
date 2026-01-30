---
title: "Frequency vs Wavelength"
weight: 10
---

# Frequency vs Wavelength

Everything in RF starts with one equation: wavelength equals the speed of light divided by frequency. At audio frequencies, wavelengths are measured in kilometers and the physical size of a circuit is irrelevant. At RF and microwave frequencies, wavelengths shrink to meters, centimeters, and millimeters — and suddenly the physical dimensions of your board, traces, and wires become a significant fraction of a wavelength. That is when everything changes.

## The Fundamental Relationship

The equation is simple:

**lambda = c / f**

Where lambda is wavelength in meters, c is the speed of light (approximately 3 x 10^8 m/s in free space), and f is frequency in hertz.

This tells you the physical length of one complete cycle of the wave. At 1 MHz, one cycle stretches 300 meters. At 1 GHz, one cycle is 30 centimeters — roughly the length of a ruler. At 10 GHz, one cycle is 3 centimeters — smaller than a credit card.

The inverse relationship means every decade increase in frequency shrinks the wavelength by a factor of 10. This compression is what pulls physical geometry into the design equation.

## Wavelengths at Common Frequencies

| Frequency | Wavelength (free space) | Context |
|-----------|------------------------|---------|
| 60 Hz | 5000 km | Mains power — wavelength is larger than most countries |
| 1 kHz | 300 km | Audio — wavelength vastly exceeds any circuit |
| 1 MHz | 300 m | AM radio — still much larger than circuits |
| 27 MHz | 11.1 m | CB radio — wire antennas are practical |
| 100 MHz | 3 m | FM radio — PCB traces start to matter |
| 433 MHz | 69 cm | ISM band — quarter-wave antenna is 17 cm |
| 915 MHz | 33 cm | ISM band (US) — trace routing becomes critical |
| 1 GHz | 30 cm | UHF — a 3 cm trace is lambda/10 |
| 2.4 GHz | 12.5 cm | WiFi/Bluetooth — PCB antenna territory |
| 5.8 GHz | 5.2 cm | WiFi 5 GHz — component leads are significant |
| 10 GHz | 3 cm | X-band radar — a TO-92 package is a large fraction of a wavelength |
| 24 GHz | 1.25 cm | Automotive radar — everything is electrically large |
| 77 GHz | 3.9 mm | Automotive radar — millimeter wave, waveguide territory |

## The Lambda/10 Rule of Thumb

The most important rule of thumb in RF: when a physical dimension exceeds about one-tenth of the wavelength (lambda/10), you can no longer ignore its electrical behavior. Below lambda/10, lumped element assumptions hold reasonably well — a wire is just a wire, a trace is just a connection, a component is a point device. Above lambda/10, the structure has enough electrical length that phase shifts, standing waves, and distributed effects begin to appear.

At 100 MHz (lambda = 3 m), the lambda/10 boundary is 30 cm. Most PCB traces are shorter than this, so basic circuits still behave roughly as drawn. At 1 GHz (lambda = 30 cm), the boundary drops to 3 cm — and that is shorter than many PCB traces, component leads, and certainly any cable. By 10 GHz (lambda = 3 cm), the boundary is 3 mm. Even a via through a circuit board is electrically significant.

This is not a hard boundary — it is a guideline for when to start worrying. Some designs need to care at lambda/20 for precision work. Others can get away with lambda/8 if tolerances are loose. But lambda/10 is the point at which ignoring wave behavior starts producing real, measurable errors.

## Why This Changes Circuit Design

At low frequencies, a schematic is a complete description of a circuit. The physical layout — where you place parts, how you route wires — is a manufacturing concern, not an electrical one. Every node on the schematic has one voltage at any instant, and that voltage is the same everywhere on that node.

At RF, this breaks down in several ways:

**Traces become transmission lines.** A copper trace on a PCB is no longer just a connection. It has characteristic impedance determined by its width, the dielectric thickness, and the ground plane spacing. Energy propagates along it as a wave. If the trace is not properly terminated, reflections distort the signal. This is covered in detail in the [transmission lines section]({{< relref "/docs/radio-rf/transmission-lines/what-makes-a-transmission-line" >}}).

**Components have parasitic behavior.** A resistor has lead inductance and body capacitance. A capacitor has series inductance that creates a self-resonant frequency — above that frequency, the "capacitor" is actually an inductor. At 1 GHz, a through-hole resistor's 10 nH lead inductance has an impedance of 63 ohm, which may dominate its actual resistance value.

**Layout is part of the circuit.** Two traces running parallel create a capacitor. A trace looping around creates an inductor. A ground plane slot forces return current to detour, creating unexpected inductance. The physical arrangement of the board is not just a manufacturing detail — it is part of the electrical design.

**Return paths matter.** At DC and low frequency, current "finds a way back" and the specific return path rarely matters. At RF, current returns directly beneath the signal trace on the ground plane (the path of least inductance, not least resistance). Any interruption in that return path — a gap in the ground plane, a connector that does not carry ground — creates inductance, radiation, and coupling to other circuits.

## Working in Different Media

The wavelength in the table above is for free space. Inside materials, signals travel slower, and the wavelength is shorter:

**lambda_medium = lambda_free_space / sqrt(epsilon_r)**

For FR4 PCB material (epsilon_r approximately 4.4), the wavelength is roughly half the free-space value. At 1 GHz, the wavelength in FR4 is about 14.3 cm instead of 30 cm. This means the lambda/10 boundary for PCB traces is about 1.4 cm — even more constraining.

For coaxial cable, the dielectric (often PTFE or polyethylene) similarly shortens the wavelength. A cable with a velocity factor of 0.66 has a wavelength that is 66% of the free-space value.

This is an important detail that is easy to forget: the lambda/10 rule applies to the wavelength in the medium you are working in, not the free-space wavelength. A PCB trace needs to be treated as a transmission line at a lower frequency than you might expect from just looking at the free-space numbers.

## Gotchas

- **Free-space wavelength is not the wavelength on your board** — FR4 has an effective dielectric constant around 4.4, which shortens wavelengths by about half. Always calculate with the medium's velocity factor when estimating electrical length on a PCB.
- **Lambda/10 is approximate, not a hard boundary** — Some situations require stricter thresholds (lambda/20 for precision phase-sensitive work), and some tolerate lambda/8. Treat it as a guideline for when to start analyzing, not a pass/fail criterion.
- **Parasitic effects scale with frequency, not just size** — A 1 nH inductance is negligible at 1 MHz (6 milliohm) but significant at 1 GHz (6.3 ohm). The same physical structure becomes a different electrical element at different frequencies.
- **Component self-resonant frequencies hide in datasheets** — A 100 nF ceramic capacitor might self-resonate at 20 MHz. Above that frequency, it behaves as an inductor. Always check the impedance vs. frequency curve, not just the capacitance value.
- **Wavelength thinking applies to digital signals too** — A 1 ns rise time has frequency content above 300 MHz, regardless of the clock rate. Even a 10 MHz clock with fast edges needs RF-aware layout for the edge transitions.
