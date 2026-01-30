---
title: "Diodes"
weight: 10
---

# Diodes

A diode is the simplest active device — one junction, two terminals, and behavior that depends on which way current wants to flow. The ideal model (conducts forward, blocks reverse) is useful for first-pass understanding, but real diodes have forward voltage drops, reverse leakage, breakdown behavior, and dynamic characteristics that matter in practice.

## The Ideal vs. Real Gap

The ideal diode is a perfect one-way valve: zero resistance forward, infinite resistance reverse, instant switching. No real diode does any of this.

**Forward bias reality:**

- Silicon diodes drop about 0.6-0.7 V forward (not zero). Schottky diodes drop 0.2-0.4 V. LEDs drop 1.8-3.3 V depending on color
- The forward voltage varies with current — higher current means higher V_f. The datasheet V_f is specified at a particular test current
- Forward voltage has a negative temperature coefficient (about -2 mV/C for silicon). Hotter diodes drop less voltage. This matters in precision circuits and can cause thermal runaway in parallel diodes

**Reverse bias reality:**

- Real diodes have reverse leakage current — nanoamps to microamps for silicon, more for Schottky. Leakage increases with temperature, roughly doubling every 10 C
- At high enough reverse voltage, the diode breaks down. Avalanche breakdown is usually non-destructive (if current is limited); exceeding rated reverse voltage without current limiting is destructive

## Rectification

Converting AC to DC. The most basic diode application.

**Half-wave rectifier:** One diode passes one polarity and blocks the other. Simple but wastes half the input cycle. Output has large ripple at the input frequency.

**Full-wave rectifier (bridge):** Four diodes in a bridge configuration pass both polarities. Two diode drops in the current path (1.2-1.4 V for silicon). Output ripple is at twice the input frequency, which is easier to filter.

Rectifier design considerations:

- Forward voltage drop means lost power: P_loss = V_f x I_load. At 10 A with a silicon bridge, that's 14 W of heat in the diodes alone. Schottky bridges cut this significantly
- Reverse recovery time matters at higher frequencies. Standard rectifiers are fine at 50/60 Hz. Fast-recovery or Schottky diodes are needed in switching power supplies
- Surge current rating — inrush into a discharged capacitor can momentarily exceed the steady-state current by 10x or more

## Clamping and Clipping

**Clamping (DC restoration):** A diode plus a capacitor shifts the DC level of an AC signal without changing its shape. Used in video circuits, power supplies, and level-shifting applications.

**Clipping:** Diodes limit signal excursion by conducting when the signal exceeds a threshold. Used to protect inputs from overvoltage. Back-to-back diodes clip both polarities.

The clipping threshold is the diode's forward voltage — soft for silicon (~0.6 V), sharper for Schottky (~0.3 V). This is not a hard wall; the transition from non-conducting to conducting is exponential, so clipping introduces distortion before the signal reaches the full V_f.

## Protection

Diodes are the first line of defense for many protection schemes:

- **Reverse polarity protection** — A series diode blocks current if the supply is connected backwards. Costs one V_f drop. A parallel reverse-biased diode (with a fuse) shorts a reversed supply and blows the fuse
- **ESD protection** — Clamping diodes to VCC and ground steer ESD current away from sensitive inputs. Most IC inputs have these built in, but external diodes handle higher energy
- **Flyback protection** — A diode across an inductive load (relay, motor, solenoid) provides a current path when the drive transistor turns off. Without it, the inductive voltage spike can destroy the transistor. The diode clamps the spike to one V_f above the supply
- **TVS (Transient Voltage Suppressor)** — A specialized Zener-like device designed to absorb large transient energy pulses. Faster than MOVs, with well-defined clamping voltages

## Zener Behavior

Zener diodes are designed to operate in reverse breakdown at a specific voltage. This makes them useful as voltage references and simple regulators.

- Below about 5 V, the mechanism is true Zener effect (quantum tunneling). Above about 7 V, it's avalanche breakdown. Between 5-7 V, both contribute — and this crossover region has the best temperature stability
- A Zener "regulator" is just a resistor feeding a Zener. Load regulation is poor (output impedance is the Zener's dynamic impedance, typically 5-50 ohm). For anything beyond a rough reference, use a proper regulator
- Zener diodes are noisy. The breakdown process generates broadband noise. This is actually exploited in noise generators, but it's a problem in precision reference circuits

## Gotchas

- **Forward voltage is not constant** — It varies with current, temperature, and device type. Don't assume 0.7 V for everything
- **Reverse recovery** — When a diode switches from forward to reverse, it conducts in reverse briefly while stored charge is swept out. This causes current spikes in switching circuits. Fast-recovery and Schottky diodes minimize this
- **Schottky leakage** — Schottky diodes have much higher reverse leakage than silicon junction diodes. At elevated temperatures, leakage can become significant, especially in battery-powered circuits where quiescent current matters
- **Capacitance** — Diodes have junction capacitance that varies with reverse voltage. This matters in high-frequency and tuning circuits (varactors exploit this deliberately)
- **Thermal runaway in parallel diodes** — The hotter diode drops less voltage, draws more current, gets hotter. Parallel diodes need current-sharing resistors or matched thermal coupling
