---
title: "Power Transfer vs Voltage Transfer"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Power Transfer vs Voltage Transfer

One of the first things that surprised me about RF is that the rules are different from what I learned in basic circuit analysis. In low-frequency circuits, the typical goal is to deliver the most voltage to a load — high input impedance, low output impedance, done. In RF, the usual goal is to deliver the most power instead, and that leads to a completely different design philosophy. Understanding which game is being played explains a lot about why RF systems look the way they do.

## The Maximum Power Transfer Theorem

The maximum power transfer theorem says that a source delivers the most power to a load when the load impedance equals the conjugate of the source impedance. For a source with impedance Z_s = R_s + jX_s, the ideal load is Z_L = R_s - jX_s. If the source is purely resistive (50 ohms, say), the optimal load is also 50 ohms resistive.

This is a foundational result, but it comes with a cost that's easy to overlook: at maximum power transfer, exactly half the power is dissipated in the source impedance. The system efficiency is 50%. That sounds terrible — and for a power utility, it would be. But for RF systems where signal integrity matters more than energy efficiency, it's the right tradeoff.

The math is straightforward. For a source with voltage V_s and source resistance R_s driving a load R_L:

- Power delivered to load: P_L = V_s^2 * R_L / (R_s + R_L)^2
- Maximum when R_L = R_s: P_L_max = V_s^2 / (4 * R_s)
- At that point, P_source = P_load = V_s^2 / (4 * R_s), so efficiency = 50%

Increasing R_L above R_s yields more efficient power delivery (less wasted in the source) but less total power to the load. This is the voltage transfer regime.

## Voltage Transfer: A Different Optimization

Voltage transfer maximizes the voltage appearing across the load. This happens when the load impedance is much larger than the source impedance — ideally infinite. Think of an oscilloscope input (1 Mohm or 10 Mohm) connected to a signal source with 50 ohms output impedance. Nearly all the source voltage appears across the load, and almost no current flows.

This is efficient in the sense that very little power is wasted, but the total power delivered is small. It's the right approach when the goal is to sense or measure a signal without disturbing it, or when driving a chain of high-impedance inputs (like audio line-level signals into preamps).

## Comparing the Two Paradigms

| Characteristic | Power Transfer | Voltage Transfer |
|---|---|---|
| Load impedance goal | Z_L = Z_s* (conjugate match) | Z_L >> Z_s |
| Efficiency at optimum | 50% | Approaching 100% |
| Power to load | Maximum possible | Small |
| Voltage across load | V_s / 2 (for resistive case) | Approaching V_s |
| Reflections | Minimized | Not a concern (short lines) |
| Typical domain | RF, microwave, long transmission lines | Audio, video, instrumentation |
| System impedance | 50 ohms (or 75 ohms) | Varies; often high-Z in, low-Z out |

## Why 50 Ohms?

The 50-ohm standard didn't fall from the sky. It comes from a practical compromise in coaxial cable design. For air-dielectric coax, minimum attenuation occurs around 77 ohms and maximum power handling occurs around 30 ohms. The geometric mean is about 50 ohms — a reasonable compromise between loss and power handling.

The 75-ohm standard used in video and cable TV optimizes more toward low loss (important for long cable runs carrying receive-only signals where power handling isn't critical). The 50-ohm standard is dominant in transmitter systems, test equipment, and general RF work.

Once a standard impedance exists, everything is designed around it: connectors, cables, test equipment, amplifier input/output impedances. This makes interconnection straightforward — every interface is 50 ohms to 50 ohms, and the system works without custom matching at every junction.

## When Power Transfer Rules Apply

Power transfer matters whenever the transmission line is a significant fraction of a wavelength. At RF frequencies, even short cables are electrically long. A 1-meter cable at 300 MHz is a full wavelength — reflections from impedance mismatches create standing waves, and power bounces back and forth rather than being delivered to the load.

At audio frequencies, a 1-meter cable is a tiny fraction of a wavelength (the wavelength of a 20 kHz signal in cable is about 10 km). Reflections don't have time to develop, and the voltage transfer paradigm works fine.

The crossover depends on the application, but as a rough guide: once the cable length exceeds about 1/10 of a wavelength, impedance matching becomes important. For 50-ohm coax, that's about 20 cm at 150 MHz, 7 cm at 430 MHz, and 1.5 cm at 2.4 GHz.

## The Hybrid Cases

Some systems blend both paradigms. A receive-only antenna system, for instance, is technically a power transfer problem (the goal is to capture maximum power from the antenna), but the power levels are so low that efficiency losses in a slight mismatch are negligible compared to the noise floor. Practical receive systems sometimes tolerate significant mismatch if it simplifies the design.

Conversely, a transmitter feeding an antenna through a long cable is firmly in power transfer territory. A mismatch here means power reflected back to the transmitter, heating in the feedline, and potential damage to the PA transistors.

Audio systems operating at RF carrier frequencies (like in audio-over-fiber or digital audio interfaces with long cables) sometimes need RF-style impedance matching even though they're carrying audio content. The physical medium doesn't care what the signal represents — it cares about frequency and cable length.

## Tips

- Start any interface design by determining whether the system is power-transfer or voltage-transfer dominated — this single decision drives topology choices for the entire signal chain
- When working with unfamiliar RF connectors or cables, check whether the system impedance is 50 or 75 ohms before assuming the standard 50-ohm convention
- Use the 1/10-wavelength rule as a quick mental check: if the cable is shorter than lambda/10, voltage-transfer rules apply and matching is unnecessary
- For receive-only systems, relax the matching requirements — a VSWR of 3:1 costs only about 1.25 dB and can save significant design complexity

## Caveats

- **50% efficiency sounds wasteful, but it's the point** — Maximum power transfer inherently sacrifices half the power in the source. In RF, the alternative (mismatch) is worse because reflected power damages transmitters and creates interference
- **"Matched" doesn't mean "same impedance" in general** — Conjugate matching means the reactive parts cancel. If a source has 50 + j25 ohms output impedance, the ideal load is 50 - j25 ohms, not 50 + j25
- **Power transfer rules do not apply to DC power supplies** — A bench supply with 0.01-ohm output impedance driving a 10-ohm load is not "mismatched." It's doing exactly what a voltage source should do. The maximum power transfer theorem describes an optimization, not a requirement
- **The 50-ohm standard is a convention, not physics** — Some systems use 75, 93, 100, 150, or 300 ohms. The matching principle is the same regardless of the characteristic impedance
- **Receive systems can tolerate more mismatch than transmit systems** — A 3:1 VSWR on a receive antenna wastes about 25% of available signal power, which is only about 1.25 dB. The same mismatch on a transmitter wastes real watts and generates heat
- **Mixing paradigms at an interface causes problems** — Driving a 50-ohm transmission line from a high-impedance audio output creates reflections. The cable doesn't know it's carrying audio — it only knows the impedances are wrong for its characteristic impedance

## In Practice

- A transmitter into a mismatched antenna shows elevated reflected power on an SWR meter and the PA may fold back or shut down — this is the power transfer problem made visible
- Connecting a 75-ohm video cable to a 50-ohm instrument input produces a small but measurable amplitude ripple across frequency on a VNA sweep, confirming the impedance mismatch
- An oscilloscope probe set to 1x (low impedance) loading a high-impedance node visibly attenuates the signal compared to 10x mode — a direct demonstration of voltage transfer vs power transfer tradeoffs
- Terminating a long coax run in its characteristic impedance eliminates ringing on a time-domain reflectometer (TDR) trace, showing clean power absorption at the load
