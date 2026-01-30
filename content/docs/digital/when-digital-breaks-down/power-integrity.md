---
title: "Power Integrity"
weight: 20
---

# Power Integrity

Digital logic depends on stable power rails — clean VDD and solid GND — to maintain valid logic levels, meet timing, and avoid corruption. But digital circuits are their own worst enemy: every time a gate switches, it draws a pulse of current from the supply. When thousands or millions of gates switch simultaneously, the cumulative current transients create voltage droops, ground bounce, and high-frequency noise on the power rails. If the supply voltage sags below the minimum operating voltage even briefly, logic levels become unreliable and the design fails.

Power integrity (PI) is the discipline of ensuring that every transistor on a chip or board sees a supply voltage within its specified range, at all times, under all switching conditions.

## Switching Noise

Every CMOS gate draws current from VDD during transitions. The current flows when both the PMOS and NMOS transistors are briefly conducting simultaneously (shoot-through current) and when the output charges or discharges its load capacitance.

**Dynamic current per gate:**

```
I_dynamic = C_load x VDD x f_switch
```

Where C_load is the total capacitance being driven, VDD is the supply voltage, and f_switch is the switching frequency.

**One gate switching is negligible.** But a 32-bit bus with all bits toggling simultaneously draws 32x the single-gate current. A processor with millions of transistors switching at GHz rates draws amps of dynamic current in bursts that last nanoseconds.

**The current waveform is not smooth** — it consists of sharp spikes at each clock edge. These current spikes are rich in harmonics, with spectral content extending to frequencies determined by the edge rate, not the clock frequency.

## Ground Bounce

Ground bounce occurs when large current transients flow through the parasitic inductance of the ground path (package leads, bond wires, PCB traces, and vias).

```
V_bounce = L x dI/dt
```

Where L is the total inductance of the ground path and dI/dt is the rate of current change.

**Example:** 10 output pins switching simultaneously, each driving 10 mA with a 1 ns edge. Total dI/dt = 100 mA / 1 ns = 10^8 A/s. With 5 nH of ground path inductance: V_bounce = 5 x 10^-9 x 10^8 = 0.5 V.

Half a volt of ground bounce on a 3.3 V system means the internal ground is momentarily at 0.5 V relative to the board ground. Every logic level in the chip is shifted by this amount. If the noise margin is 0.4 V, the design is in trouble.

**Ground bounce effects:**
- Outputs that should be stable (not switching) appear to glitch because their reference (internal ground) is moving
- Inputs may be misread because the input threshold moves with the internal ground
- Communication interfaces see corrupted data on transitions when many other pins switch simultaneously
- Analog circuits sharing the same ground see the digital switching noise directly on their reference

## Simultaneous Switching Output (SSO)

SSO is the organized version of ground bounce — the concern about how many output pins can switch at the same clock edge without exceeding the ground/power bounce budget.

**SSO guidelines** are specified by FPGA and IC vendors: "maximum N outputs switching simultaneously per power/ground pair." Exceeding the SSO limit causes ground bounce that violates the output voltage specifications.

**Mitigation:**
- Spread simultaneously switching outputs across multiple I/O banks (each bank has its own power/ground pins)
- Stagger output transitions using programmed delay (skew outputs to avoid simultaneous switching)
- Reduce output drive strength and slew rate (slower edges = lower dI/dt = less bounce)
- Use differential signaling (LVDS) — differential outputs have constant current regardless of data pattern, eliminating the data-dependent current spikes

## The Power Distribution Network (PDN)

The PDN is the complete path from the voltage regulator to the transistor: PCB traces, planes, vias, package leads, bond wires, and on-chip metal layers. Each segment has resistance, inductance, and capacitance.

**Target impedance:** The PDN impedance must be low enough that the switching current doesn't cause excessive voltage drop. For a maximum voltage ripple of delta_V with a maximum transient current I_transient:

```
Z_target = delta_V / I_transient
```

For a 1.0 V core supply with 5% tolerance (50 mV ripple) and 10 A transient current: Z_target = 50 mV / 10 A = 5 milliohm. This impedance must be maintained across the entire frequency range of the current transients — from DC to hundreds of MHz or more.

## Decoupling from the Digital Perspective

Decoupling capacitors are the primary tool for maintaining low PDN impedance at high frequencies. Each capacitor provides a local energy reservoir that supplies transient current before the regulator can respond.

**Decoupling hierarchy:**
- **Bulk capacitors (10-100 uF, electrolytic or tantalum)** — Low-frequency energy storage. Respond at kHz to low MHz. Placed near the voltage regulator
- **Ceramic capacitors (0.1-10 uF, MLCC)** — Mid-frequency decoupling. Respond at MHz to tens of MHz. Placed close to the IC power pins
- **Small ceramic capacitors (1-100 nF)** — High-frequency decoupling. Respond at tens to hundreds of MHz. Placed as close as physically possible to the power pins — every millimeter matters
- **On-chip capacitance** — Inherent capacitance of the IC's internal power distribution. Provides the highest-frequency decoupling

**Placement is critical:**
- The inductance of the trace between the decoupling cap and the IC pin limits the cap's effectiveness at high frequencies. A 0.1 uF cap 1 inch from the pin is far less effective than a 0.01 uF cap directly under the pin (connected through the shortest possible via path)
- Via inductance dominates at high frequencies — use multiple vias in parallel from the cap pads to the power/ground planes

**Common mistake:** Specifying decoupling capacitors by value alone (e.g., "one 0.1 uF per power pin") without considering the mounting inductance, ESR, and frequency range. The capacitor's effective frequency range depends on its physical size, package, and connection geometry as much as its capacitance value.

For the analog perspective on decoupling, see [Decoupling & Bypassing]({{< relref "/docs/analog/power-and-regulation/decoupling-and-bypassing" >}}).

## Power Plane Design

In multi-layer PCBs, dedicated power and ground planes provide low-impedance distribution and serve as decoupling capacitors themselves (the plane-to-plane capacitance is significant at high frequencies).

**Key principles:**
- **Solid, unbroken ground plane** — The most important single design rule. Gaps, slots, and splits in the ground plane force return currents to detour, increasing inductance and creating noise. See [Layout & Parasitics]({{< relref "/docs/analog/noise-stability-reality/layout-and-parasitics" >}})
- **Adjacent power and ground planes** — A thin dielectric between power and ground planes creates distributed capacitance (typically 50-100 pF per square inch for standard FR4 stackups). This provides high-frequency decoupling that discrete capacitors cannot match
- **Separate analog and digital supplies** — Run separate power planes (or at least separate traces) from the regulator to analog and digital sections. They can share a ground plane (kept solid and continuous)
- **Via stitching** — Connect ground planes on different layers with multiple vias to reduce the impedance between layers

## Voltage Regulator Response

The voltage regulator maintains the DC supply voltage, but it has a finite bandwidth — it can only respond to load changes up to a certain frequency (typically kHz to low MHz for switching regulators, MHz for LDOs).

**The response gap:** Between the regulator's bandwidth limit and the frequency range where decoupling capacitors are effective, there can be a gap where the PDN impedance is high. This gap is often in the 1-10 MHz range and is a common source of power integrity problems.

**Solution:** Overlap the frequency ranges. Use enough bulk capacitance that the capacitors are still effective at the regulator's bandwidth limit, and enough ceramic capacitance that the high-frequency range is covered. PDN impedance analysis (using simulation tools or impedance measurements) identifies gaps.

## Gotchas

- **Power integrity problems look like signal integrity problems** — A design with excessive ground bounce shows signal ringing, jitter, and intermittent bit errors. The root cause is the power rail, not the signal path. Probing the power pins (with a proper technique — short ground lead, close to the pin) is the first diagnostic step
- **Decoupling cap placement matters more than value** — A 100 nF cap with 0.5 nH of mounting inductance resonates at ~22 MHz and is ineffective above ~50 MHz. The same cap with 0.1 nH mounting inductance (shorter vias, smaller pad spacing) resonates at ~50 MHz and is effective to ~100 MHz
- **Oscilloscope probing technique affects measurements** — The standard 6-inch ground lead on a scope probe has ~10 nH of inductance, which rings at high frequencies and obscures the actual power rail noise. Use a ground spring, tip-and-barrel technique, or dedicated power integrity probes to measure PDN noise accurately. See the [Measurement & Test]({{< relref "/docs/measurement" >}}) section
- **More capacitors don't always help** — Adding capacitors of the same value in parallel reduces ESR and increases capacitance, but the mounting inductance of each cap in parallel also adds up. At some point, additional caps have diminishing returns. A mix of values (for different frequency ranges) is more effective than many identical caps
- **Core voltage tolerance is tight** — Modern FPGAs and processors use core voltages of 0.8-1.0 V with ±3-5% tolerance. A 3% tolerance on 0.85 V is ±25 mV. The total PDN noise budget (regulator accuracy + ripple + transient droop + ground bounce) must fit within this margin. There is no room for sloppy power design at these voltages
