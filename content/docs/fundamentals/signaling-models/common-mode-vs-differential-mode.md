---
title: "Common-Mode vs Differential-Mode"
weight: 50
---

# Common-Mode vs Differential-Mode

Every voltage on a pair of conductors can be decomposed into two components: the part that's the same on both (common-mode) and the part that's opposite (differential-mode). This is not a special property of balanced cables or differential signaling — it's a mathematical identity that applies to any two-conductor system. Understanding it is the key to noise analysis, filter design, and debugging interference problems.

## The Decomposition

For any two voltages V(A) and V(B) on two conductors:

**Differential-mode voltage: V_dm = V(A) - V(B)**
This is the difference. It's the intended signal in a differential system.

**Common-mode voltage: V_cm = (V(A) + V(B)) / 2**
This is the average. It's the voltage that both conductors share relative to some external reference (usually ground).

Any combination of V(A) and V(B) can be fully described by V_dm and V_cm. The original voltages reconstruct from these components:

- V(A) = V_cm + V_dm/2
- V(B) = V_cm - V_dm/2

{{< graphviz >}}
digraph decomposition {
  rankdir=LR
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]
  nodesep=0.5
  ranksep=0.8

  pair [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a2a3a" COLOR="#6666aa">
      <TR><TD COLSPAN="1"><B><FONT COLOR="#cccccc">Two Conductors</FONT></B></TD></TR>
      <TR><TD PORT="a" BGCOLOR="#3e3e5a"><FONT COLOR="#8888cc"> V(A) </FONT></TD></TR>
      <TR><TD PORT="b" BGCOLOR="#3e3e5a"><FONT COLOR="#8888cc"> V(B) </FONT></TD></TR>
    </TABLE>
  >]

  dm [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a3a2a" COLOR="#66aa66">
      <TR><TD><B><FONT COLOR="#cccccc">Differential-Mode</FONT></B></TD></TR>
      <TR><TD BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> V_dm = V(A) − V(B) </FONT></TD></TR>
      <TR><TD BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> (the signal) </FONT></TD></TR>
    </TABLE>
  >]

  cm [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#3a3a2a" COLOR="#aaaa66">
      <TR><TD><B><FONT COLOR="#cccccc">Common-Mode</FONT></B></TD></TR>
      <TR><TD BGCOLOR="#5a5a3e"><FONT COLOR="#cccc88"> V_cm = (V(A) + V(B)) / 2 </FONT></TD></TR>
      <TR><TD BGCOLOR="#5a5a3e"><FONT COLOR="#cccc88"> (shared by both) </FONT></TD></TR>
    </TABLE>
  >]

  pair:a -> dm [color="#88cc88"]
  pair:b -> dm [color="#88cc88"]
  pair:a -> cm [color="#cccc88"]
  pair:b -> cm [color="#cccc88"]
}
{{< /graphviz >}}

## What Common-Mode Noise Really Is

Common-mode noise is any unwanted voltage that appears equally on both conductors of a pair. It doesn't change the difference between them — it shifts both up or down together.

Sources of common-mode noise:

- **Ground potential differences.** Two devices on different outlets have slightly different ground potentials. This offset appears as a common-mode voltage on any cable connecting them
- **Electromagnetic coupling.** An external field (from a motor, a power line, a switching regulator) induces voltage in both conductors. If the conductors run close together (twisted pair, parallel traces), the induced voltage is nearly identical on both — common-mode
- **Power supply coupling.** Noise on a power rail that feeds both sides of a circuit appears as common-mode noise on any signal referenced to that supply
- **Capacitive coupling to nearby structures.** Both conductors of a pair capacitively couple to a nearby noisy trace or cable, picking up common-mode noise

A differential receiver rejects common-mode noise because it takes the difference: the common-mode component cancels. A single-ended receiver cannot distinguish common-mode noise from signal — it sees both.

## Why CMRR Is Finite

No real receiver has infinite Common-Mode Rejection Ratio. CMRR is limited by asymmetries in the receiver:

**Component mismatch.** A differential amplifier uses matched resistors. If the resistors differ by 0.1%, the CMRR is limited to about 66 dB. Precision instrumentation amps use laser-trimmed resistors to achieve better matching.

**Input impedance imbalance.** If the two inputs have slightly different impedances (from parasitic capacitance, PCB trace mismatch, or connector asymmetry), common-mode current flows unequally, creating a differential voltage from a common-mode source.

**Frequency dependence.** At DC, CMRR can be very high (120+ dB for precision instrumentation amps). As frequency increases, parasitic capacitances create asymmetric paths and CMRR degrades — often at 20 dB per decade. An amp with 100 dB CMRR at DC might have only 60 dB at 1 kHz and 40 dB at 100 kHz.

| Frequency | Typical CMRR (instrumentation amp) | Common-mode attenuation |
|-----------|-----------------------------------|------------------------|
| DC | 100-120 dB | 100,000-1,000,000× |
| 100 Hz | 90-110 dB | 30,000-300,000× |
| 1 kHz | 70-90 dB | 3,000-30,000× |
| 10 kHz | 50-70 dB | 300-3,000× |
| 100 kHz | 30-50 dB | 30-300× |

**Practical consequence:** CMRR is excellent at 60 Hz, making it reliable for rejecting ground loop hum. At 1 MHz switching-noise frequencies, rejection may be 40–60 dB lower — the CMRR vs frequency curve in the datasheet is the relevant specification.

## How Imbalance Converts Common-Mode to Differential-Mode

This is the mechanism by which common-mode noise becomes a real problem — even in differential systems. When the two signal paths are not perfectly symmetric, common-mode noise partially converts to differential-mode noise, which the receiver cannot reject.

{{< graphviz >}}
digraph conversion {
  rankdir=LR
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]
  nodesep=0.5
  ranksep=1.0

  cm_noise [label="Common-Mode\nNoise" shape=diamond style="filled" fillcolor="#884444" fontcolor="#e8e8e8" color="#aa4444" width=0.9 height=0.7]

  subgraph cluster_pair {
    label="Conductor Pair"
    labeljust=c
    style="rounded,dashed"
    color="#888888"
    fontcolor="#cccccc"
    fontname="Helvetica"
    fontsize=12

    a [label="A  (Z₁)" shape=box style="rounded,filled" fillcolor="#3e3e5a" fontcolor="#8888cc" color="#6666aa"]
    b [label="B  (Z₂ ≠ Z₁)" shape=box style="rounded,filled" fillcolor="#5a3e3e" fontcolor="#cc8888" color="#aa6666"]
  }

  rcv [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a3a2a" COLOR="#66aa66">
      <TR><TD><B><FONT COLOR="#cccccc">Receiver sees:</FONT></B></TD></TR>
      <TR><TD BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> V_dm = Vcm × (Z₁−Z₂)/(Z₁+Z₂) </FONT></TD></TR>
      <TR><TD BGCOLOR="#5a3e3e"><FONT COLOR="#cc8888"> (noise became signal!) </FONT></TD></TR>
    </TABLE>
  >]

  cm_noise -> a [label="Vcm" color="#aa6666" fontcolor="#cc8888"]
  cm_noise -> b [label="Vcm" color="#aa6666" fontcolor="#cc8888"]
  a -> rcv [color="#8888cc"]
  b -> rcv [color="#cc8888"]
}
{{< /graphviz >}}

Sources of asymmetry that cause conversion:

- **Different conductor lengths** (in a cable, or as PCB trace length mismatch)
- **Different impedances** to ground on each conductor (connector pins, PCB pad sizes, cable routing)
- **Asymmetric coupling** to nearby structures (one conductor closer to a noise source than the other)
- **Connector contact resistance** differing between pins
- **Mismatched termination** on the two lines

The conversion is described by the Longitudinal Conversion Loss (LCL) in telecommunications or the balance ratio in audio. A well-constructed twisted pair cable might achieve 40-60 dB of balance, meaning common-mode noise is converted to differential-mode noise 100-1000× weaker than the original common-mode level.

## Differential-Mode Noise

Not all noise is common-mode. Differential-mode noise appears as a voltage difference between the two conductors — it looks exactly like signal to a differential receiver.

Sources of differential-mode noise:

- **Common-mode to differential-mode conversion** (the mechanism above — the most common source)
- **Crosstalk from adjacent differential pairs** (capacitive or inductive coupling that's inherently asymmetric)
- **Noise generated within the signal source itself** (thermal noise, shot noise, oscillator phase noise)
- **Impedance discontinuities** that cause reflections on one conductor but not the other

Differential-mode noise cannot be rejected by CMRR. It requires filtering, shielding, or reducing it at the source.

## Filtering: Common-Mode and Differential-Mode Are Filtered Differently

Because the two noise modes have different sources and different behaviors, they require different filtering approaches:

| | Common-mode noise | Differential-mode noise |
|-|-------------------|------------------------|
| **What it is** | Same on both conductors | Opposite on the two conductors |
| **Rejected by** | Differential receiver (CMRR) | Nothing — it looks like signal |
| **Filtered by** | Common-mode choke, Y-capacitors (line to ground) | Series inductor + capacitor across the line (X-capacitor) |
| **Ferrite on cable** | Effective (ferrite acts on common-mode current) | No effect (differential currents cancel in the ferrite core) |

A common-mode choke is an inductor wound on a single core with two windings carrying the two signal conductors. Differential-mode current creates opposing magnetic fields that cancel — the choke is invisible to the signal. Common-mode current creates reinforcing fields — the choke presents high impedance and blocks it. This makes common-mode chokes an elegant filter: they suppress common-mode noise without affecting the differential signal.

## Why "Fixes" Often Just Move the Problem

A common pattern in noise debugging:

1. Common-mode noise appears on a cable
2. A common-mode choke is added — the common-mode noise drops
3. But differential-mode noise at the receiver increases

What happened? The common-mode choke reduced the common-mode noise on the cable, but the asymmetry that was converting common-mode to differential-mode noise is still there. With less common-mode noise, less converts — but other noise sources (now unmasked) may become visible. Or the choke itself introduced a small asymmetry.

The real fix for this situation is to address the root cause: improve the balance of the cable or connection (fix the asymmetry), or reduce the noise at its source. Filtering is a symptom-level treatment. It works — but understanding the conversion mechanism reveals where the deeper fix is.

Similarly: adding shielding to a cable might reduce noise pickup, but if the shield creates a ground loop (shield connected to ground at both ends with a potential difference), it can introduce new common-mode noise that converts to differential at the receiver. The fix introduces a new problem. Understanding the modes of noise and their conversion mechanisms prevents this whack-a-mole pattern.

## Tips

- **If adding a ferrite clamp to a cable has no effect, the noise is likely differential-mode.** Ferrites only attenuate common-mode current; differential currents cancel in the core and pass through unimpeded. A ferrite that does nothing is diagnostic information, not a failed fix
- **Separating conducted emissions into common-mode and differential-mode components identifies which filter topology is needed.** A LISN measures total conducted emissions; separating them into CM and DM prevents wasting effort with the wrong filter type — CM chokes for common-mode, X-capacitors and series inductors for differential-mode
- **A current probe clamped around both conductors of a pair reads only common-mode current.** Differential currents flow in opposite directions and cancel in the probe. Any current the probe registers is common-mode — a fast way to quantify CM noise without breaking into the circuit
- **When selecting a common-mode choke, check its impedance at the noise frequency, not just its DC or low-frequency rating.** A choke rated at 1 kΩ at 100 MHz may present only 10 Ω at 1 MHz. The impedance-vs-frequency curve determines whether the choke actually attenuates the noise that matters

## Caveats

- **Common-mode noise is invisible to a standard oscilloscope measurement.** Connecting a scope probe between the two conductors of a differential pair measures differential-mode voltage only. To see common-mode voltage, measure each conductor individually against earth ground, or use a current probe clamped around both conductors (any current the probe reads is common-mode)
- **CMRR specifications at DC are misleading.** Many amplifiers and receivers are specified at DC or low frequency where CMRR is highest. Always check the CMRR vs frequency curve for the frequencies where the noise exists
- **A "balanced" cable with poor balance is worse than advertised.** The cable's balance (symmetry) determines how much common-mode noise converts to differential-mode. A damaged cable, a cable with a broken twist lay, or a cable with mismatched connectors may have 20 dB worse balance than specification — converting 10× more common-mode noise into signal
- **Common-mode range limits are hard limits.** A differential receiver with a ±10 V common-mode range will clip, distort, or be damaged if the common-mode voltage exceeds that range. CMRR only applies within the specified common-mode range. Ground offsets, noise peaks, and transients must all stay within bounds

## Bench Relevance

The CM/DM decomposition is the first analytical step when diagnosing noise on any differential signal path. The symptom often indicates the mode: noise that disappears when switching from single-ended to differential measurement is common-mode; noise that persists is differential-mode. A two-channel oscilloscope can approximate the decomposition using math mode — (Ch1 + Ch2)/2 for the common-mode component, Ch1 − Ch2 for the differential-mode component. Most "mysterious" noise on balanced cables traces to CM-to-DM conversion from asymmetry rather than from the noise amplitude itself; once the mode is identified, the correct filter topology and the location of the imbalance both become clear.
