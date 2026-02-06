---
title: "Balanced vs Unbalanced"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Balanced vs Unbalanced

Every signal needs a go path and a return path. How those two paths are arranged — one conductor referenced to ground, or two conductors carrying equal and opposite voltages — determines how much noise the link picks up, how far the signal can travel, and what it costs. This is one of the most fundamental structural decisions in any signal chain.

## Unbalanced (Single-Ended)

One conductor carries the signal voltage, referenced to a shared ground or return path. The receiver measures the voltage between the signal conductor and ground.

{{< graphviz >}}
digraph unbalanced {
  rankdir=LR
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]
  nodesep=0.6
  ranksep=1.4

  src [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a2a3a" COLOR="#6666aa">
      <TR><TD COLSPAN="1"><B><FONT COLOR="#cccccc">Source</FONT></B></TD></TR>
      <TR><TD PORT="sig" BGCOLOR="#3e3e5a"><FONT COLOR="#8888cc"> Signal Out </FONT></TD></TR>
      <TR><TD PORT="gnd" BGCOLOR="#3a3a3a"><FONT COLOR="#999999"> GND </FONT></TD></TR>
    </TABLE>
  >]

  rcv [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a3a2a" COLOR="#66aa66">
      <TR><TD COLSPAN="1"><B><FONT COLOR="#cccccc">Receiver</FONT></B></TD></TR>
      <TR><TD PORT="sig" BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> Signal In </FONT></TD></TR>
      <TR><TD PORT="gnd" BGCOLOR="#3a3a3a"><FONT COLOR="#999999"> GND </FONT></TD></TR>
    </TABLE>
  >]

  noise [label="Noise" shape=diamond style="filled" fillcolor="#884444" fontcolor="#e8e8e8" color="#aa4444" width=0.7 height=0.5]

  src:sig -> rcv:sig [color="#8888cc" label="signal conductor" fontcolor="#8888cc"]
  src:gnd -> rcv:gnd [color="#666666" style=dashed label="ground return" fontcolor="#999999"]
  noise -> rcv:gnd [label="couples to\nground path" style=dashed color="#aa6666" fontcolor="#cc8888"]
}
{{< /graphviz >}}

Simple, cheap, and only requires one conductor plus a ground return. This is what most short-range, low-frequency connections use — a wire or trace carrying the signal, with ground as the reference.

The vulnerability: any noise voltage on the ground return path adds directly to the signal. The receiver cannot tell the difference between the intended signal and noise riding on the ground. Ground loops, magnetic pickup, and currents from other circuits sharing the same ground all become part of the signal.

## Balanced (Differential)

The signal is split across two conductors as equal and opposite voltages. The receiver measures the difference between them, ignoring anything that appears equally on both.

{{< graphviz >}}
digraph balanced {
  rankdir=LR
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]
  nodesep=0.6
  ranksep=1.4

  src [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a2a3a" COLOR="#6666aa">
      <TR><TD COLSPAN="1"><B><FONT COLOR="#cccccc">Source</FONT></B></TD></TR>
      <TR><TD PORT="pos" BGCOLOR="#3e3e5a"><FONT COLOR="#8888cc"> + </FONT></TD></TR>
      <TR><TD PORT="neg" BGCOLOR="#3e3e5a"><FONT COLOR="#8888cc"> &minus; </FONT></TD></TR>
      <TR><TD PORT="shd" BGCOLOR="#3a3a3a"><FONT COLOR="#999999"> Shield/GND </FONT></TD></TR>
    </TABLE>
  >]

  rcv [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a3a2a" COLOR="#66aa66">
      <TR><TD COLSPAN="1"><B><FONT COLOR="#cccccc">Differential Receiver</FONT></B></TD></TR>
      <TR><TD PORT="pos" BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> + </FONT></TD></TR>
      <TR><TD PORT="neg" BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> &minus; </FONT></TD></TR>
      <TR><TD PORT="shd" BGCOLOR="#3a3a3a"><FONT COLOR="#999999"> Shield/GND </FONT></TD></TR>
    </TABLE>
  >]

  noise [label="Noise" shape=diamond style="filled" fillcolor="#884444" fontcolor="#e8e8e8" color="#aa4444" width=0.7 height=0.5]

  src:pos -> rcv:pos [color="#8888cc" label="  +V signal  " fontcolor="#8888cc"]
  src:neg -> rcv:neg [color="#cc88cc" label="  &minus;V signal  " fontcolor="#cc88cc"]
  src:shd -> rcv:shd [color="#666666" style=dashed label="shield (not signal path)" fontcolor="#999999"]
  noise -> rcv:pos [style=dashed color="#aa6666" fontcolor="#cc8888" label="  "]
  noise -> rcv:neg [style=dashed color="#aa6666" fontcolor="#cc8888" label="couples equally\nto both  "]
}
{{< /graphviz >}}

The source drives two conductors with equal and opposite voltages: when one is +1 V, the other is -1 V. The signal information is entirely in the difference between them. Noise from external sources — electromagnetic interference, ground potential differences, capacitive coupling — tends to affect both conductors equally, because they run physically close together (twisted pair, parallel traces, or conductors in the same cable).

The receiver takes the difference: (+V + noise) - (-V + noise) = 2V. The noise cancels.

## Why Balanced Works: Common-Mode Rejection

The noise that appears equally on both conductors is called common-mode noise. The receiver's ability to reject it is quantified as Common-Mode Rejection Ratio (CMRR):

**CMRR (dB) = 20 log₁₀(differential gain / common-mode gain)**

{{< graphviz >}}
digraph cmrr {
  rankdir=LR
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]
  nodesep=0.5
  ranksep=1.0

  subgraph cluster_cable {
    label="Balanced Cable"
    labeljust=c
    style="rounded,dashed"
    color="#888888"
    fontcolor="#cccccc"
    fontname="Helvetica"
    fontsize=12

    wp [label="+V + Vnoise" shape=box style="rounded,filled" fillcolor="#3e3e5a" fontcolor="#e8e8e8" color="#6666aa"]
    wn [label="&minus;V + Vnoise" shape=box style="rounded,filled" fillcolor="#3e3e5a" fontcolor="#e8e8e8" color="#6666aa"]
  }

  noise [label="External\nNoise\n(Vnoise)" shape=diamond style="filled" fillcolor="#884444" fontcolor="#e8e8e8" color="#aa4444" width=0.9 height=0.7]

  diff [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a3a2a" COLOR="#66aa66">
      <TR><TD COLSPAN="1"><B><FONT COLOR="#cccccc">Differential Receiver</FONT></B></TD></TR>
      <TR><TD BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> Out = (+V + Vnoise) </FONT></TD></TR>
      <TR><TD BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> &minus; (&minus;V + Vnoise) </FONT></TD></TR>
      <TR><TD BGCOLOR="#3a5a3a"><FONT COLOR="#aaddaa"><B> = 2V  (noise cancelled) </B></FONT></TD></TR>
    </TABLE>
  >]

  noise -> wp [style=dashed color="#aa6666" label="equal\ncoupling" fontcolor="#cc8888"]
  noise -> wn [style=dashed color="#aa6666"]
  wp -> diff [color="#8888cc"]
  wn -> diff [color="#cc88cc"]
}
{{< /graphviz >}}

If the balance were perfect — identical impedance, identical length, identical coupling — CMRR would be infinite and all common-mode noise would vanish. Real circuits achieve 60 to 100+ dB of CMRR, meaning common-mode noise is attenuated by a factor of 1,000 to 100,000 compared to the differential signal.

| CMRR | Noise attenuation factor | Practical meaning |
|------|--------------------------|-------------------|
| 40 dB | 100× | Basic rejection, adequate for many applications |
| 60 dB | 1,000× | Good — typical of quality differential receivers |
| 80 dB | 10,000× | Excellent — instrumentation amplifiers |
| 100 dB | 100,000× | Precision instrumentation, high-end audio |
| 120 dB | 1,000,000× | Best-in-class instrumentation amps |

## What Breaks the Balance

Common-mode rejection depends on symmetry. Anything that makes the two signal paths different degrades CMRR:

**Asymmetric impedance.** If one conductor has different resistance, capacitance, or inductance than the other, noise couples unequally and doesn't fully cancel. This is why twisted pair uses a controlled twist rate — each twist reverses the conductors' positions relative to external fields, averaging out asymmetry.

**Length mismatch.** Different electrical lengths mean the noise arrives at different times on the two conductors. At low frequencies this doesn't matter much, but at high frequencies even small mismatches degrade rejection. PCB differential pairs are length-matched for this reason.

**Connector and termination issues.** A corroded pin, a bad solder joint, or an incorrect termination on one leg breaks symmetry. Connectors designed for balanced signals (XLR, RJ-45) maintain symmetry by design; adapters and improvised connections often don't.

**Frequency limits.** CMRR degrades with frequency in all real receivers. An instrumentation amp with 100 dB CMRR at DC might have only 60 dB at 10 kHz and 40 dB at 100 kHz. Datasheets specify CMRR vs frequency.

**Common-mode voltage exceeding receiver range.** Every differential receiver has a maximum common-mode input voltage. If the noise or ground offset pushes the common-mode voltage beyond this range, the receiver clips or behaves nonlinearly, and CMRR collapses.

## Converting Between Them

Converting between balanced and unbalanced signals is common and requires a device that handles the structural difference:

**Balun (balanced-to-unbalanced).** The name literally describes the function. Baluns come in transformer and active forms:

- **Transformer balun** — A winding with a center tap (or two separate windings) converts between a single-ended signal referenced to ground and a differential signal on two conductors. Provides galvanic isolation. Common in RF (antenna feedpoints) and audio (DI boxes).
- **Active balun** — An op-amp or dedicated IC splits a single-ended signal into differential, or combines differential into single-ended. No isolation, but can provide gain and wider bandwidth. Common in high-speed digital and video.

**DI box (Direct Injection)** — An audio-specific balun, typically transformer-based, that converts a high-impedance unbalanced source (guitar, keyboard) to a low-impedance balanced output for a mixing console. Often includes a ground lift switch.

**Differential amplifier / instrumentation amp** — Converts a balanced signal to single-ended by taking the difference. The single-ended output is referenced to the local ground.

{{< graphviz >}}
digraph balun {
  rankdir=LR
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]
  nodesep=0.5
  ranksep=1.0

  unbal [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a2a3a" COLOR="#6666aa">
      <TR><TD><B><FONT COLOR="#cccccc">Unbalanced</FONT></B></TD></TR>
      <TR><TD PORT="sig" BGCOLOR="#3e3e5a"><FONT COLOR="#8888cc"> Signal </FONT></TD></TR>
      <TR><TD PORT="gnd" BGCOLOR="#3a3a3a"><FONT COLOR="#999999"> GND </FONT></TD></TR>
    </TABLE>
  >]

  balun [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#3a3a2a" COLOR="#aaaa66">
      <TR><TD COLSPAN="1"><B><FONT COLOR="#cccccc">Balun</FONT></B></TD></TR>
      <TR><TD BGCOLOR="#5a5a3e"><FONT COLOR="#cccc88"> Transformer </FONT></TD></TR>
      <TR><TD BGCOLOR="#5a5a3e"><FONT COLOR="#cccc88"> or Active </FONT></TD></TR>
    </TABLE>
  >]

  bal [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a3a2a" COLOR="#66aa66">
      <TR><TD><B><FONT COLOR="#cccccc">Balanced</FONT></B></TD></TR>
      <TR><TD PORT="pos" BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> + </FONT></TD></TR>
      <TR><TD PORT="neg" BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> &minus; </FONT></TD></TR>
    </TABLE>
  >]

  unbal:sig -> balun [color="#8888cc" label="single-ended" fontcolor="#8888cc"]
  balun -> bal:pos [color="#88cc88" label="+V" fontcolor="#88cc88"]
  balun -> bal:neg [color="#cc88cc" label="&minus;V" fontcolor="#cc88cc"]

  note [shape=none label=<
    <FONT COLOR="#999999" POINT-SIZE="10">Direction is reversible —<BR/>same device works both ways</FONT>
  >]
  balun -> note [style=invis]
}
{{< /graphviz >}}

Direction matters: a balun designed for a specific impedance transformation (e.g., 50 ohm unbalanced to 200 ohm balanced) only presents the correct impedances when used in the intended direction.

## Where Each Shows Up

| Domain | Unbalanced | Balanced |
|--------|------------|----------|
| Audio | TS (tip-sleeve), RCA | XLR, TRS (tip-ring-sleeve), AES/EBU |
| RF | Coax (single-ended) | Twin-lead, ladder line |
| Digital | Single-ended CMOS/TTL, SPI, I2C | LVDS, USB, Ethernet, RS-485 |
| Instrumentation | Single-ended oscilloscope input | Differential probe, instrumentation amp |

The choice is almost always a noise-vs-cost tradeoff. Unbalanced is simpler, cheaper, and fine for short runs in low-noise environments. Balanced costs more (two conductors, differential drivers and receivers) but rejects noise over long runs and in harsh environments. As cable length or interference increases, balanced becomes worth the extra cost quickly.

## Tips

- **Ground the shield at one end for audio, both ends for RF.** Audio practice grounds one end to avoid ground loops. RF practice grounds both ends for continuous high-frequency shielding. Using the wrong convention in either domain degrades performance
- **Check that the expected common-mode voltage stays within the receiver's rated range.** A differential receiver rated for ±10 V common-mode will saturate or sustain damage beyond that limit — including ground potential differences and noise peaks
- **Use a proper balun when converting between balanced and unbalanced, rather than floating or grounding one leg.** Improvised connections break the symmetry that makes common-mode rejection work. A transformer balun also provides galvanic isolation, which eliminates ground loops entirely
- **Test balance by comparing impedance to ground on each leg.** A significant difference indicates asymmetry that will degrade CMRR — a fast diagnostic before looking at the signal itself

## Caveats

- **Balanced is not the same as shielded.** A balanced cable can be unshielded (like Cat5e Ethernet UTP), and an unbalanced cable can be shielded (like coax). The shield provides electrostatic screening; balance provides common-mode rejection. They address different noise mechanisms and are often used together, but one does not imply the other
- **The shield on a balanced cable is not a signal conductor.** In a shielded balanced cable (like XLR audio cable), the shield is separate from the two signal conductors. The signal is the difference between the two inner conductors; the shield handles electrostatic interference. Connecting the shield as a signal return defeats the balanced topology
- **Driving a balanced input with an unbalanced source loses CMRR.** Connecting a single-ended source to one leg of a differential input and grounding the other leg removes the balance — noise on the ground appears on one input but not the other, and CMRR drops to near zero. A balun or proper differential drive is needed to maintain rejection
- **"Balanced" in RF mixer terminology is related but distinct.** A "balanced mixer" or "double-balanced mixer" refers to the internal topology of the mixer (how the diodes or transistors are arranged for port-to-port isolation), not to balanced signal transmission. The concepts share the idea of symmetry and cancellation, but the context is different

## In Practice

**Hum, buzz, or a DC offset that disappears when a DI box or isolation transformer is inserted** points to a balanced/unbalanced topology mismatch. The DI box or transformer converts between the two topologies, and the symptom's disappearance confirms that the noise was entering through the ground path that the balanced topology eliminates.

**Noise that appears when measuring a balanced signal with single-ended equipment** results from the measurement itself breaking the balance. A standard oscilloscope input ties one conductor to earth through the scope's ground, destroying the symmetry that provides common-mode rejection. A differential probe preserves the balance and shows the actual signal.

**A noise floor that changes when cables or connectors are swapped between balanced and unbalanced types** indicates that the signaling topology is the dominant factor. In many signal chains, the balanced-vs-unbalanced choice sets the noise floor before any other parameter matters.
