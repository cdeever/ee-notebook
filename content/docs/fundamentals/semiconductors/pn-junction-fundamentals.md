---
title: "PN Junction Fundamentals"
weight: 10
---

# PN Junction Fundamentals

The PN junction is the foundation of all junction-based semiconductor devices — diodes, BJTs, thyristors, and the body diodes inside MOSFETs. A junction forms where P-type and N-type semiconductor materials meet. The physics at this boundary creates the one-way valve behavior that makes semiconductors useful.

## The Depletion Region

When P and N materials are joined, electrons from the N side diffuse into the P side, and holes from the P side diffuse into the N side. This diffusion leaves behind a region depleted of mobile carriers — the **depletion region**. The uncovered fixed charges (negative acceptor ions on the P side, positive donor ions on the N side) create an electric field that opposes further diffusion.

At equilibrium, the diffusion force and the electric field force balance. The voltage across the depletion region is the **built-in potential** (V_bi), typically 0.6-0.7 V for silicon at room temperature. This voltage exists even with no external bias — it's a consequence of the junction physics.

The depletion region is an insulator: no mobile carriers, no current (except for very small leakage). The width of this region determines the junction's capacitance and breakdown voltage.

## Forward Bias

Applying a positive voltage to the P side relative to the N side (forward bias) shrinks the depletion region. The external voltage opposes the built-in field, reducing the barrier that prevents carrier flow. When the applied voltage approaches V_bi, current begins to flow — electrons from the N side and holes from the P side are injected across the junction.

The forward current follows an exponential relationship:

I = I_S × (e^(V / (n × V_T)) - 1)

Where:
- I_S is the saturation current (device-dependent, typically pA to nA for small-signal diodes)
- V is the applied voltage
- n is the ideality factor (1 to 2 depending on the device and current level)
- V_T is the thermal voltage, kT/q ≈ 26 mV at room temperature

This exponential relationship is why the forward voltage across a conducting junction is relatively constant despite large changes in current. Doubling the current only increases V_f by about 18 mV (at n=1). This is the origin of the "0.7 V diode drop" approximation for silicon — it's close enough for most currents, but the actual value varies with current and temperature.

## Reverse Bias

Applying a negative voltage to the P side relative to the N side (reverse bias) widens the depletion region. The external field adds to the built-in field, pushing mobile carriers further from the junction. The junction acts as an insulator — only a tiny **reverse saturation current** flows, caused by thermally generated minority carriers.

Reverse saturation current is strongly temperature-dependent, roughly doubling every 10°C. It's also device-dependent: large-area power diodes have more leakage than small-signal devices. Schottky diodes have substantially higher reverse leakage than PN junction diodes.

## Breakdown

At high enough reverse voltage, the junction breaks down:

- **Avalanche breakdown** — High-energy carriers collide with atoms and knock loose additional carriers, which gain energy and cause more collisions. This chain reaction produces a rapid increase in current. Avalanche breakdown is non-destructive if current is limited; the device recovers when voltage is reduced. This is the dominant mechanism above about 7 V.

- **Zener breakdown** — In heavily doped junctions, the depletion region is very thin, and the electric field can directly strip electrons from atoms (quantum tunneling). This occurs at lower voltages, typically below 5 V.

- **Between 5-7 V**, both mechanisms contribute. Devices designed to operate in this crossover region have the lowest temperature coefficient — the positive tempco of avalanche and negative tempco of Zener partially cancel.

Breakdown voltage depends on doping levels: heavier doping means a thinner depletion region and lower breakdown voltage. This is a design tradeoff — Zener diodes are heavily doped for low, controlled breakdown voltages; rectifier diodes are lightly doped for high blocking capability.

## Temperature Effects

Junction behavior is strongly temperature-dependent:

- **Forward voltage decreases with temperature** — About -2 mV/°C for silicon. A junction at 100°C drops roughly 150 mV less than at 25°C. This negative tempco can cause thermal runaway in parallel devices: the hotter device drops less voltage, draws more current, gets even hotter.

- **Reverse leakage increases with temperature** — Roughly doubling every 10°C. At high temperatures, leakage current can become significant, especially in Schottky diodes.

- **Breakdown voltage shifts with temperature** — Avalanche breakdown voltage increases with temperature (positive tempco); Zener breakdown voltage decreases (negative tempco). The 5-7 V crossover region is temperature-stable because both effects are present.

## Junction Capacitance

The depletion region acts as a parallel-plate capacitor: the P and N regions are the plates, and the depleted region is the dielectric. This **junction capacitance** varies with reverse voltage — wider depletion (higher reverse bias) means less capacitance.

C_j = C_j0 / (1 + V_R/V_bi)^m

Where:
- C_j0 is the capacitance at zero bias
- V_R is the reverse voltage
- m is a constant (typically 0.3-0.5 for abrupt junctions)

Varactor diodes exploit this voltage-dependent capacitance for tuning circuits. In switching applications, junction capacitance causes charge storage effects that limit switching speed — the capacitor must be charged and discharged each time the device changes state.

## Minority Carrier Storage (Reverse Recovery)

When a forward-biased junction suddenly reverses, the junction doesn't immediately block. During forward conduction, minority carriers are injected and stored on both sides of the junction. These stored carriers must be swept out before the junction can block — during this **reverse recovery time**, the junction conducts in reverse.

Reverse recovery causes:
- Current spikes in switching circuits
- Commutation losses in power electronics
- EMI from the fast current transients

Fast-recovery diodes are designed with reduced carrier lifetime to minimize stored charge. Schottky diodes have essentially no reverse recovery because they use a metal-semiconductor junction with majority carrier conduction only — no minority carrier storage.

## Tips

- Forward voltage is approximately constant for a given device type and temperature — use 0.6-0.7 V for silicon as a first estimate, but check the datasheet for precision work
- Reverse leakage matters at high temperatures and with Schottky diodes — factor it into quiescent current budgets for battery-powered designs
- Junction capacitance at zero bias is maximum — this matters for signal coupling and switching speed

## Caveats

- **The 0.7 V approximation is an approximation** — Forward voltage varies with current, temperature, and device type. For precision circuits, measure it or use the datasheet curves
- **Leakage is not zero** — All junctions leak in reverse. At elevated temperatures or with large-area devices, this leakage can be significant
- **Reverse recovery is real** — A forward-conducting diode cannot instantly block. Switching circuits that ignore reverse recovery will have unexpected current spikes
- **Temperature coefficients add up** — In circuits with multiple junctions (BJTs, thyristors), the -2 mV/°C tempco applies to each junction

## In Practice

- A diode that runs hot may be undersized for the current — check that the forward voltage drop isn't causing excessive dissipation
- A rectifier circuit that works at room temperature but fails when warm often has a Schottky diode whose leakage has become significant
- Switching waveforms that show reverse current spikes are seeing reverse recovery — use faster diodes or add snubbing
- A Zener reference that drifts with temperature may be operating outside the 5-7 V tempco-stable region
