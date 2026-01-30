---
title: "RF Capacitors & Inductors"
weight: 10
---

# RF Capacitors & Inductors

A capacitor is not always a capacitor, and an inductor is not always an inductor. Every real passive component has parasitic elements that become dominant at high frequencies. A 100 nF ceramic capacitor behaves as an inductor above its self-resonant frequency. A 100 nH inductor behaves as a capacitor above its own self-resonant frequency. Understanding where these transitions happen — and what they mean for your circuit — is fundamental to working at RF.

## Q Factor: The Quality of Energy Storage

The quality factor (Q) measures how well a reactive component stores energy versus how much it dissipates per cycle:

**Q = (Energy stored per cycle) / (Energy dissipated per cycle)**

For a capacitor: **Q = 1 / (2 * pi * f * C * ESR)**

For an inductor: **Q = 2 * pi * f * L / R_series**

Higher Q means lower loss. A Q of 100 means the component dissipates 1% of its stored energy per cycle. A Q of 10 means 10% loss per cycle.

Why Q matters at RF:

- **Filters:** A bandpass filter's selectivity (how sharply it rejects out-of-band signals) depends directly on component Q. A filter built with Q=20 inductors will have a much wider passband than the same topology built with Q=100 inductors.
- **Matching networks:** Loss in matching network components reduces the power delivered to the load. In a receiver front end, this loss directly degrades noise figure.
- **Oscillators:** Higher Q in the resonator means lower phase noise. Crystal oscillators have Q values in the tens of thousands, which is why they are so spectrally pure.

## Self-Resonant Frequency (SRF)

Every capacitor has parasitic series inductance (ESL) from its internal electrodes, terminations, and any lead or pad connections. This ESL forms a series LC circuit with the capacitance. The frequency where these resonate is the self-resonant frequency:

**SRF = 1 / (2 * pi * sqrt(ESL * C))**

Below the SRF, the device is capacitive. At the SRF, impedance is minimum (equal to ESR — pure resistance). Above the SRF, the device is inductive.

Similarly, every inductor has parasitic parallel capacitance from inter-winding coupling and termination pads. Above the inductor's SRF, it becomes capacitive and its impedance drops.

## Capacitor Types for RF

| Dielectric | Q at RF | Capacitance Range | Temperature Stability | RF Suitability |
|------------|---------|-------------------|----------------------|----------------|
| C0G / NP0 | Very high (>1000) | 0.1 pF - 10 nF | Excellent (±30 ppm/°C) | Excellent — the first choice for RF |
| X7R | Moderate (50-200) | 100 pF - 100 uF | Poor (±15%) | Acceptable for bypass, not for tuning |
| X5R | Low-moderate | 100 pF - 100 uF | Poor (±15%) | Bypass only |
| Y5V | Low | 1 nF - 100 uF | Very poor (+22/-82%) | Not suitable for RF |
| Porcelain / thin film | Very high (>1000) | 0.1 pF - 1 nF | Excellent | Premium RF, microwave |

**C0G/NP0** is the standard choice for RF tuning, matching, and filtering. Its capacitance does not change with applied voltage (no voltage coefficient), temperature variation is negligible, and Q is high through GHz frequencies. The limitation is capacitance — C0G is not available above about 10 nF in small packages.

**X7R** is acceptable for bypass and decoupling where precise capacitance is not required. Its capacitance varies with voltage (a 1 uF X7R capacitor at its rated voltage might only have 0.5 uF of effective capacitance), temperature, and aging. For RF bypass, this is tolerable because the exact value matters less than the presence of a low-impedance path.

## Inductor Types for RF

| Type | Q Range | SRF Range | Frequency Use | Notes |
|------|---------|-----------|---------------|-------|
| Multilayer chip (ferrite) | 10-30 | 0.5-6 GHz | Below SRF, bypass/choke | Lossy, compact, inexpensive |
| Wirewound chip | 30-80 | 0.2-3 GHz | VHF/UHF matching, filters | Moderate Q, moderate size |
| Air-core (wound wire) | 50-200 | 0.1-2 GHz | HF/VHF tuning, high-Q filters | Larger, hand-wound for prototyping |
| Thin-film chip | 40-100 | 1-10 GHz | Microwave matching, bias tees | Tight tolerance, expensive |
| Conical / broadband | Low-moderate | Very high | Bias tees, broadband chokes | Designed for wide bandwidth, not Q |

For RF matching networks below 3 GHz, wirewound chip inductors (such as Coilcraft 0402HP series) offer a good balance of Q, size, and availability. For narrow bandpass filters where Q directly affects selectivity, air-core inductors or high-Q wirewound parts are worth the larger footprint.

## Typical SRF Values by Package Size

Smaller packages have shorter internal connections, which means lower parasitic inductance (for capacitors) or lower parasitic capacitance (for inductors) — and therefore higher SRF.

**Capacitors — approximate SRF:**

| Package | 1 pF | 10 pF | 100 pF | 1 nF | 10 nF | 100 nF |
|---------|------|-------|--------|------|-------|--------|
| 0201 | >15 GHz | >8 GHz | 3-5 GHz | 1.5-2.5 GHz | 0.5-1 GHz | 200-400 MHz |
| 0402 | >10 GHz | 5-8 GHz | 2-4 GHz | 0.8-1.5 GHz | 300-600 MHz | 100-250 MHz |
| 0603 | 8-12 GHz | 3-6 GHz | 1-3 GHz | 0.5-1 GHz | 150-400 MHz | 50-150 MHz |
| 0805 | 5-8 GHz | 2-4 GHz | 0.5-2 GHz | 200-600 MHz | 80-200 MHz | 30-80 MHz |

These values are approximate and vary by manufacturer. Always check the specific part's impedance vs. frequency plot from the datasheet or manufacturer's simulation tool (Murata SimSurfing, TDK SEAT, etc.).

## Parasitic Models

A more accurate model of a real capacitor includes:

- **C** — the nominal capacitance
- **ESR** — equivalent series resistance (dielectric and conductor loss)
- **ESL** — equivalent series inductance (internal structure and terminations)

This series RLC circuit explains all the frequency-dependent behavior: capacitive below SRF, resistive at SRF, inductive above SRF.

A real inductor model includes:

- **L** — the nominal inductance
- **R_series** — winding and core resistance (frequency-dependent due to skin effect)
- **C_parallel** — inter-winding and termination capacitance

This parallel RLC model shows the inductor becoming capacitive above its SRF, with impedance peaking at the SRF and dropping above it.

## Component Selection by Frequency

The right component depends on the operating frequency:

| Frequency Range | Capacitor Choice | Inductor Choice |
|----------------|-----------------|-----------------|
| 1-30 MHz (HF) | C0G, 0603-0805 adequate | Wirewound chip or air-core |
| 30-300 MHz (VHF) | C0G, 0402-0603 preferred | Wirewound chip, SRF must exceed operating freq |
| 300 MHz - 3 GHz (UHF) | C0G, 0402 or 0201 | Thin-film or high-SRF wirewound |
| 3-10 GHz (SHF) | C0G or thin film, 0201 | Thin-film, printed traces as inductors |
| >10 GHz | Thin film, MIM capacitors | Transmission line stubs replace discrete inductors |

Above approximately 5-10 GHz, discrete inductors become impractical (SRF too low, Q too poor). Instead, short transmission line sections — stubs, quarter-wave transformers, and coupled lines — serve as distributed inductors and capacitors. The PCB trace itself becomes the component.

## Gotchas

- **A "100 nF" capacitor is not 100 nF at RF** — The impedance vs. frequency curve, not the marked capacitance value, determines what the component does at your frequency. Use manufacturer impedance tools to verify behavior.
- **Voltage coefficient makes X7R capacitors unpredictable for tuning** — A 10 nF X7R capacitor across a 3.3V rail might effectively be 6 nF. For anything that depends on precise capacitance (filters, matching), use C0G.
- **Inductor Q varies dramatically with frequency** — A wirewound inductor might have Q of 50 at 100 MHz but Q of 10 at 900 MHz. Check Q at your actual operating frequency, not the peak Q.
- **Package size limits SRF, which limits usable frequency** — An 0805 100 pF capacitor might self-resonate at 800 MHz. The same value in 0402 resonates at 2 GHz. Moving to a smaller package buys higher usable frequency.
- **Component placement orientation affects parasitic coupling** — Two 0402 capacitors placed parallel and close together couple more than the same two placed perpendicular. Orient components to minimize coupling in sensitive circuits.
- **Manufacturer simulation tools are more reliable than generic models** — Murata SimSurfing, TDK SEAT, and Coilcraft design tools use measured S-parameter data for each specific part number. Generic parasitic estimates are much less accurate.
