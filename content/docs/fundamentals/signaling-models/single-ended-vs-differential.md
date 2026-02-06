---
title: "Single-Ended vs Differential"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Single-Ended vs Differential

Every voltage measurement is a difference between two points. The question is whether the system treats one of those points as an implicit shared reference (single-ended) or explicitly measures between two dedicated signal conductors (differential). This distinction is mathematical before it's physical — and understanding the math clarifies everything about noise rejection, dynamic range, and why differential signaling dominates high-speed and high-precision design.

## Signal = V(A) - V(B)

A signal is not a voltage at a point. It's the voltage difference between two points. Always.

When someone says "the signal is 1 V," what they mean is "the voltage difference between the signal conductor and some reference is 1 V." That reference might be a ground plane, a dedicated return wire, or the second conductor of a differential pair. But it's always there.

{{< graphviz >}}
digraph signal_def {
  rankdir=TB
  bgcolor="transparent"
  splines=line
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]
  graph [fontname="Helvetica" fontsize=12]
  nodesep=0.8

  subgraph cluster_se {
    label="Single-Ended"
    labeljust=c
    style="rounded,dashed"
    color="#888888"
    fontcolor="#cccccc"

    a_se [label="A (signal)" shape=box style="rounded,filled" fillcolor="#3e3e5a" fontcolor="#8888cc" color="#6666aa"]
    b_se [label="B (ground — shared reference)" shape=box style="rounded,filled" fillcolor="#3a3a3a" fontcolor="#999999" color="#666666"]

    a_se -> b_se [label="V_signal = V(A) − V(ground)" color="#8888cc" fontcolor="#8888cc"]
  }

  subgraph cluster_diff {
    label="Differential"
    labeljust=c
    style="rounded,dashed"
    color="#888888"
    fontcolor="#cccccc"

    a_diff [label="A (+)" shape=box style="rounded,filled" fillcolor="#3e3e5a" fontcolor="#8888cc" color="#6666aa"]
    b_diff [label="B (−)" shape=box style="rounded,filled" fillcolor="#3e5a3e" fontcolor="#88cc88" color="#66aa66"]

    a_diff -> b_diff [label="V_signal = V(A) − V(B)" color="#cccc88" fontcolor="#cccc88"]
  }
}
{{< /graphviz >}}

This framing makes it clear that single-ended signaling is just a special case of differential signaling — the one where B is "ground" and shared with everyone else.

## Single-Ended: B Is Ground

In a single-ended system, one conductor carries the signal and the reference is the shared ground. The receiver measures the voltage between the signal conductor and ground.

**What makes it simple:**
- One signal conductor per signal — minimum wiring, minimum pins
- The ground is already there (power return, chassis, earth) — no extra infrastructure
- Easy to generate and receive — a voltage source referenced to ground, a single-input amplifier

**What makes it vulnerable:**
- Any noise on the ground reference is indistinguishable from signal. If ground rises by 10 mV due to switching currents elsewhere in the system, the receiver sees that 10 mV as part of the signal
- The quality of the ground — its impedance, its noise, how many other circuits share it — directly limits signal quality
- As cable length increases, the ground conductor picks up more noise from external fields, and the voltage drop along the ground conductor grows

Single-ended signaling works when the ground is clean, the distances are short, and the precision requirements are modest. For a 3.3 V logic signal on a PCB with a solid ground plane and 5 cm traces, ground noise is negligible. For a 1 mV sensor signal on a 10-meter cable in an industrial environment, it's hopeless.

## Differential: Both A and B Are Dedicated

In a differential system, the signal is carried on two dedicated conductors. The source drives them with equal and opposite voltages: when A is +V, B is -V. The receiver takes the difference.

**The key property:** noise that couples equally to both conductors cancels when the receiver takes the difference. This is common-mode rejection, and it's the main reason differential signaling exists (see [Common-Mode vs Differential-Mode]({{< relref "common-mode-vs-differential-mode" >}})).

**What makes it powerful:**
- The signal is defined by the relationship between A and B, not by the relationship to ground. Ground noise is irrelevant (up to the receiver's common-mode input range)
- The two conductors can be routed as a tightly coupled pair (twisted pair, parallel PCB traces), so external noise affects both equally and cancels
- Voltage swings can be smaller — a ±200 mV differential signal has 400 mV of information, while the individual conductors only swing 200 mV from their common-mode level. Smaller swings mean less power, less radiation, and faster switching

**What makes it cost more:**
- Two conductors per signal instead of one
- Differential drivers and receivers are more complex than single-ended ones
- PCB routing requires paired traces with matched length and spacing
- Connectors need more pins or dedicated differential-pair contacts

## What a Differential Receiver Actually Measures

A real differential receiver has two characteristics:

**Differential gain (A_d):** The gain applied to the difference signal V(A) - V(B). This is the intended signal path.

**Common-mode gain (A_cm):** The gain applied to the average of the two inputs, (V(A) + V(B)) / 2. Ideally this is zero — the receiver should ignore the common-mode voltage entirely. In practice it's small but not zero.

The output is:

**V_out = A_d × (V(A) - V(B)) + A_cm × (V(A) + V(B)) / 2**

The first term is the signal. The second term is the leakage of common-mode noise into the output. The ratio A_d / A_cm is the CMRR (see [Common-Mode vs Differential-Mode]({{< relref "common-mode-vs-differential-mode" >}})).

{{< graphviz >}}
digraph diff_receiver {
  rankdir=LR
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]
  nodesep=0.5
  ranksep=1.2

  inputs [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a2a3a" COLOR="#6666aa">
      <TR><TD COLSPAN="1"><B><FONT COLOR="#cccccc">Inputs</FONT></B></TD></TR>
      <TR><TD PORT="a" BGCOLOR="#3e3e5a"><FONT COLOR="#8888cc"> A = +V + Vcm </FONT></TD></TR>
      <TR><TD PORT="b" BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> B = −V + Vcm </FONT></TD></TR>
    </TABLE>
  >]

  rcv [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#3a3a2a" COLOR="#aaaa66">
      <TR><TD COLSPAN="1"><B><FONT COLOR="#cccccc">Differential Receiver</FONT></B></TD></TR>
      <TR><TD BGCOLOR="#5a5a3e"><FONT COLOR="#cccc88"> A − B = 2V </FONT></TD></TR>
      <TR><TD BGCOLOR="#5a5a3e"><FONT COLOR="#999999"> (Vcm rejected) </FONT></TD></TR>
    </TABLE>
  >]

  out [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a3a2a" COLOR="#66aa66">
      <TR><TD><B><FONT COLOR="#cccccc">Output</FONT></B></TD></TR>
      <TR><TD BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> V_out = Ad × 2V </FONT></TD></TR>
    </TABLE>
  >]

  inputs:a -> rcv [color="#8888cc"]
  inputs:b -> rcv [color="#88cc88"]
  rcv -> out [color="#cccc88" label="signal only" fontcolor="#cccc88"]
}
{{< /graphviz >}}

## Why Symmetry Matters More Than Shielding

A shielded cable blocks external electric fields from reaching the signal conductors. A differential pair with good symmetry rejects external noise by cancellation. These are complementary but different mechanisms.

Symmetry is often more effective than shielding because:

- Shielding has gaps (connectors, seams, cable ends) where fields leak in. Symmetry works as long as the two conductors see the same environment, regardless of imperfect shielding
- Shielding requires a continuous conductive enclosure connected to ground. Symmetry just requires matched conductors
- Shielding effectiveness degrades with frequency (skin depth, apertures). Good differential balance can maintain high CMRR across a wide bandwidth
- Shielding adds cost, weight, and cable diameter. A simple twisted pair (no shield) achieves excellent noise rejection through symmetry alone

Cat5e Ethernet cable is unshielded twisted pair — no shield at all — and reliably carries 1 Gbps signals in electrically noisy office environments. The noise rejection comes entirely from the differential signaling and the symmetry of the twisted pair.

That said, shielding and differential signaling are even more effective in combination. Shielded differential pairs (like STP Ethernet, or twinax for high-speed serial links) are used in the most demanding environments.

## Where Each Approach Fits

| Parameter | Single-ended | Differential |
|-----------|-------------|--------------|
| Conductors per signal | 1 + shared ground | 2 (+ optional ground/shield) |
| Noise rejection | Limited by ground quality | Common-mode rejection (60-120+ dB) |
| Voltage swing | Full signal amplitude on one wire | Half amplitude on each wire |
| Speed | Limited by ground bounce and crosstalk | Scales to multi-GHz (LVDS, USB, PCIe) |
| Power | Signal power in one driver | Divided between two drivers, but lower swing compensates |
| Routing complexity | One trace | Matched pair, length-matched |
| Best for | Short, low-speed, low-noise environments | Long runs, high speed, noisy environments, precision measurement |

## Tips

- **Match trace lengths, impedances, and spacing on differential pairs.** Symmetry is what makes common-mode rejection work — matched routing preserves the balance that rejects noise
- **Use a true differential probe for differential measurements.** Scope math (Ch1 − Ch2) has poor CMRR because both channels share a ground through the scope chassis. A differential probe takes the difference at the tip, before the ground path matters
- **Twisted pair without shielding provides effective noise rejection through symmetry alone.** Adding a shield helps in demanding environments, but the primary rejection mechanism is the differential cancellation, not the shielding
- **Check that the common-mode voltage stays within the receiver's input range.** Differential receivers reject common-mode noise only up to a specified limit — beyond that, the output saturates or distorts regardless of the differential signal quality
- **Check pair symmetry by comparing amplitude and timing on the two lines.** Unequal amplitude or skewed timing between the + and − conductors indicates asymmetry that degrades common-mode rejection — often the fastest diagnostic for differential signal integrity problems

## Caveats

- **"Differential" does not mean "balanced."** Differential describes how the signal is defined (as a difference). Balanced describes a physical property of the transmission path (equal impedance to ground on both conductors). A differential signal can be sent on an unbalanced path, and vice versa. In practice they often go together, but they're separate concepts (see [Balanced vs Unbalanced]({{< relref "balanced-vs-unbalanced" >}}))
- **Single-ended signals don't have zero common-mode noise — they have uncontrolled common-mode noise.** The ground reference in a single-ended system carries the common-mode noise, but there's no cancellation mechanism. The receiver sees all of it
- **Converting between single-ended and differential requires active circuitry or a transformer.** Connecting one wire to ground does not make a signal differential. A proper single-ended to differential converter (balun, differential amplifier, or dedicated driver IC) generates the complementary signal

## In Practice

**Noise appearing equally on both lines of a differential pair** is common-mode — the receiver rejects it, and it does not degrade the signal unless it exceeds the receiver's common-mode input range or converts to differential-mode through path asymmetry.

**Noise present on one line of a differential pair but not the other** is differential-mode noise. The receiver cannot distinguish it from the intended signal, so it passes through and degrades signal quality directly.

**Amplitude or timing mismatch between the two lines of a differential pair** indicates asymmetry that degrades common-mode rejection. Mismatched trace lengths, unequal termination, or a damaged conductor shifts the balance point and converts common-mode noise into differential-mode noise that the receiver cannot reject.
