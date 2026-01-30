---
title: "Termination Strategies"
weight: 50
---

# Termination Strategies

Termination is the act of placing an impedance at the end of a transmission line to absorb the traveling wave and prevent reflections. Without termination, energy bounces back and forth on the line, creating standing waves, ringing, and signal degradation. The choice of termination strategy depends on the application — whether you are building an RF system or a digital bus, whether DC power consumption matters, and whether you need to terminate at the source, the load, or both.

## Why Terminate

A transmission line must be terminated because of what happens when a wave reaches an impedance discontinuity: it [reflects]({{< relref "/docs/radio-rf/transmission-lines/reflections-standing-waves-and-vswr" >}}). If the load impedance equals the characteristic impedance (Z_L = Z0), the wave is fully absorbed and no reflection occurs. If Z_L differs from Z0, part of the wave reflects, creating signal integrity problems.

In RF systems, reflections waste power (reflected energy does not reach the receiver or antenna), create standing waves that stress components, and produce interference. In digital systems, reflections cause ringing, overshoot, and potential false clock or data transitions.

The goal of every termination strategy is to present an impedance equal to Z0 at the point where the wave arrives, so it is absorbed cleanly.

## Parallel Termination

The most straightforward approach: place a resistor equal to Z0 from the signal line to ground (or the return conductor) at the far end of the line. The incident wave sees the resistor as its load, the impedance matches Z0, and the wave is absorbed.

**How it works:** The resistor is placed at the receiver end of the line. The incident wave travels down the line and is fully absorbed by the resistor. The signal at the receiver is the full incident voltage (divided across the source impedance and the line, which together form a 2:1 voltage divider for a matched source).

**Advantages:**
- Simple and effective
- Absorbs the wave at the load — clean signal at the receiver
- Works for continuous RF signals and single-ended digital

**Disadvantages:**
- DC current flows continuously through the termination resistor (P = V^2 / R). For a 3.3 V signal into 50 ohm, that is 218 mW per line — significant for buses with many signals
- The signal at the receiver is half the source voltage (in a matched system), which reduces noise margin in digital applications

**When to use:** RF systems (50 ohm loads are standard), test equipment connections, any situation where continuous absorption and clean signal quality are priorities.

## Series Termination

Place a resistor at the source end of the line, in series with the driver output. The resistor value is chosen so that the driver's output impedance plus the series resistor equals Z0.

**How it works:** The driver launches a half-amplitude step into the line (because the series resistor and Z0 form a voltage divider). This half-amplitude wave travels to the unterminated far end, where it fully reflects (Gamma = +1 for a high-impedance CMOS input). The reflected wave travels back to the source, where it encounters the matched source impedance (driver + series resistor = Z0) and is absorbed. At the load end, the incident and reflected waves add to produce the full signal voltage.

**Advantages:**
- No DC current through the termination — minimal static power
- The full signal amplitude appears at the load (after the reflection arrives)
- Only one resistor per line

**Disadvantages:**
- The waveform at the load is a two-step staircase: half voltage when the incident wave arrives, full voltage when the reflection from the source returns. This is fine for point-to-point connections where only the far end receives the signal, but problematic for tapped buses
- Any receiver tapped along the middle of the line sees an ugly stepped waveform
- The settling time equals one round-trip delay

**When to use:** Point-to-point digital signals (clock lines, data between two ICs), where low power consumption matters and only the far-end receiver reads the signal.

## AC Termination

A capacitor in series with the termination resistor. The RC combination provides termination at signal frequencies while blocking DC.

**How it works:** At frequencies where the capacitor's impedance is low (well above 1 / (2 pi R C)), the termination looks like a pure resistor equal to R. At DC, the capacitor blocks current, so there is no static power dissipation.

**Design choices:**
- R = Z0 (typically 50 ohm for RF, or matched to the line impedance)
- C is chosen so the RC time constant is much longer than the signal period but short enough to track the signal's envelope
- For a 100 MHz digital signal on a 50 ohm line, C = 100-200 pF gives an RC time constant of 5-10 ns, which passes the signal frequencies while blocking DC

**Advantages:**
- Saves DC power compared to parallel termination
- Good for AC-coupled or digital signals where DC bias is provided separately

**Disadvantages:**
- The capacitor must be large enough to maintain termination at the lowest signal frequency (including the fundamental of a digital clock)
- At low frequencies or during long idle periods, the capacitor charges up and the termination becomes ineffective until the next signal edge discharges it
- Additional component (capacitor) adds parasitic inductance and takes board space

**When to use:** Digital buses where power savings over parallel termination are needed, AC-coupled signals, and situations where the signal has frequent transitions (clocks, data with guaranteed transition density).

## Thevenin Termination

Two resistors forming a voltage divider between VCC and ground, with the midpoint connected to the signal line at the receiver end. The parallel combination of the two resistors equals Z0, and the divider sets a DC bias point.

**Design:**
For a 50 ohm termination biased at VCC/2:
- R1 (to VCC) = 100 ohm
- R2 (to ground) = 100 ohm
- Parallel combination = 50 ohm

For asymmetric bias points, adjust the ratio while maintaining the parallel impedance equal to Z0.

**Advantages:**
- Sets a defined DC level on the line (useful for terminated logic families like ECL, or for biasing AC-coupled receivers)
- Effective termination at all frequencies including DC

**Disadvantages:**
- Draws continuous DC current through the divider: I = VCC / (R1 + R2). For VCC = 3.3 V with 100/100 ohm, that is 16.5 mA — 54 mW per line
- Two resistors per line, doubling the component count
- The bias voltage depends on VCC, so power supply noise appears on the line

**When to use:** Terminated logic (PECL, LVPECL), any signal that needs a specific DC bias at the receiver, and differential pairs where common-mode voltage must be controlled.

## Diode Termination (Clamping)

Not a true impedance termination — diode clamps limit overshoot and undershoot by clamping the signal to VCC and ground through Schottky diodes. They do not absorb the incident wave or prevent reflections; they only limit the voltage excursion caused by reflections.

**When to use:** As supplementary protection, not as a primary termination strategy. Useful when proper termination is not feasible (legacy designs, cost constraints) and the goal is to prevent damage rather than achieve signal integrity.

## Choosing a Strategy

| Strategy | DC power | Signal at load | Multi-drop? | Best for |
|----------|----------|---------------|-------------|----------|
| Parallel | High | Full (V/2 in matched system) | Yes | RF, continuous signals |
| Series | None | Full (after round trip) | No | Point-to-point digital |
| AC | Low | Full (AC coupled) | Yes | Digital with transition density |
| Thevenin | Moderate | Full (with DC bias) | Yes | Terminated logic, bias control |
| Diode clamp | None | Clamped but not clean | Yes | Protection only |

## What Happens Without Termination

Leaving a transmission line unterminated is the most common signal integrity mistake:

**In digital systems:** A fast-edge signal on an unterminated line reflects from the open end (Gamma = +1), doubling the voltage at the receiver. The reflected wave then travels back to the source, where it may re-reflect if the source is not matched. The result is ringing — the signal oscillates above and below the intended levels. The ringing frequency is set by the line round-trip time (typically hundreds of MHz for PCB traces), and can cause double-clocking, setup/hold violations, and increased EMI radiation.

**In RF systems:** Standing waves develop on the line, with voltage maxima up to twice the source voltage and current maxima up to twice the source current. Power delivery to the load is reduced. At high power, standing wave maxima can exceed the voltage or current ratings of cables and connectors. Transmitter protection circuits may fold back power or shut down.

**In both cases:** EMI increases because the standing waves on the line create localized high-current or high-voltage points that radiate more efficiently than a properly terminated line. Unterminated lines are often the root cause of unexpected EMC failures.

## Gotchas

- **Series termination only works for point-to-point** — If there are receivers tapped along the middle of the line (like a bus), they see the half-amplitude intermediate state. Only the far end sees the clean, full-amplitude signal after reflection return.
- **Termination resistor tolerance matters at RF** — A 5% tolerance on a 50 ohm resistor gives 47.5-52.5 ohm. At 50 ohm nominal, 52.5 ohm gives Gamma = 0.024 (return loss = 32 dB), which is fine. But a 10% tolerance gives 45-55 ohm, and at 55 ohm, Gamma = 0.048 (return loss = 26 dB). Use 1% resistors for RF terminations.
- **Parasitic inductance in termination resistors degrades performance** — A through-hole resistor with 5 mm leads is useless as an RF termination above 100 MHz. Use 0402 or 0201 chip resistors placed close to the load with short, direct ground connections.
- **Do not forget the return path** — A termination resistor to "ground" must have a low-impedance path to the actual ground plane. A via to the ground plane directly under the resistor pad is ideal. A long trace to a distant ground point adds inductance that defeats the termination.
- **Differential termination needs a resistor between the pair, not just to ground** — A 100 ohm differential pair is terminated with a 100 ohm resistor between the two lines, not with two 50 ohm resistors to ground (which would be common-mode termination only).
