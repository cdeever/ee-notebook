---
title: "Decoupling & Bypassing"
weight: 40
---

# Decoupling & Bypassing

Local energy storage and noise suppression at the source. Decoupling capacitors are the most frequently placed components on a PCB, and probably the most frequently misunderstood. They serve a simple purpose — provide instantaneous current when the supply can't respond fast enough — but doing it well requires understanding impedance, frequency, and layout.

## Why Decoupling Exists

Every IC draws current that changes rapidly — digital logic switches, op-amps slew, ADCs sample. The power supply is connected through trace inductance and resistance that can't deliver current instantaneously. The decoupling capacitor, placed right at the IC's power pins, acts as a local energy reservoir that handles the fast current demands.

Without adequate decoupling:
- Supply voltage droops during current spikes (ground bounce, rail collapse)
- High-frequency noise on the supply couples into signal paths
- Digital switching noise contaminates analog circuits
- Circuits may oscillate, produce glitches, or fail intermittently

## The Impedance Perspective

A decoupling capacitor's job is to provide low impedance at the frequencies where the supply has high impedance. The power supply regulates well at DC and low frequencies (where its feedback loop has gain), but its output impedance rises at higher frequencies. The capacitor takes over where the supply leaves off.

**The goal:** Keep the impedance at each IC's power pins below some target value across the frequency range of interest.

A single capacitor has:
- Capacitive impedance that decreases with frequency: Z = 1/(2 pi f C)
- ESR (series resistance) that provides a flat impedance floor
- ESL (series inductance) that increases impedance above the self-resonant frequency

Above the self-resonant frequency, the capacitor behaves as an inductor. A single "0.1 uF decoupling cap" stops being a useful capacitor somewhere around 10-50 MHz depending on the package.

## Multi-Cap Strategy

To maintain low impedance across a wide frequency range, use multiple capacitors with different values:

- **Bulk capacitor (10-100 uF electrolytic or ceramic)** — Handles low-frequency demands. Energy storage for slow transients. Placed per power rail, not necessarily per IC
- **Mid-range ceramic (1-10 uF MLCC)** — Handles mid-frequency demands. Placed near groups of ICs
- **Local bypass (100 nF ceramic)** — Handles high-frequency demands. Placed at each IC power pin, as close as physically possible
- **High-frequency bypass (10-100 nF or smaller, low-ESL package)** — For very high-speed digital or RF. 0402 or 0201 packages minimize ESL

The capacitors' impedance curves overlap, creating a continuously low impedance from DC through the highest frequency of interest.

## Placement and Layout

**This is where most decoupling problems live.** A perfectly chosen capacitor placed poorly performs worse than a mediocre capacitor placed correctly.

### Key Rules

- **Place the cap as close to the IC power pins as possible.** Every millimeter of trace adds inductance that defeats the purpose
- **Connect with short, wide traces** (or use a direct via to a ground plane). The trace inductance between the cap and the pin is in series with the cap — it adds to the effective ESL
- **Via placement matters.** A via to the ground plane from the cap's ground pad should be directly at the pad, not at the end of a trace
- **Capacitor orientation matters.** Place the cap so the current loop (power pin → cap → ground → IC ground pin) is as small as possible. This minimizes the loop inductance

### Why Ground Planes Help

A solid ground plane provides a low-inductance return path for current. Without a ground plane, the return current must travel through traces, creating large current loops that radiate and have high inductance. The ground plane makes the return path directly under the signal trace, minimizing loop area.

## Bypassing vs. Decoupling

The terms are often used interchangeably, but there's a subtle distinction:

- **Decoupling** — Providing local energy storage to prevent supply voltage droops during fast current demands. The cap supplies current that the remote power supply can't deliver fast enough
- **Bypassing** — Providing a low-impedance AC path to ground to shunt noise away from the supply pin. The cap shorts high-frequency noise to ground before it enters the IC

In practice, the same capacitor does both jobs simultaneously. The distinction matters more when thinking about which frequency range you're targeting.

## Gotchas

- **100 nF is a convention, not a rule** — 100 nF (0.1 uF) is the standard bypass cap because it provides reasonable impedance across a useful frequency range in a common package size. But it's not always the right value. High-speed digital may need smaller caps (lower ESL). High-current analog may need larger caps (more energy storage)
- **Ceramic capacitor DC bias derating** — A "10 uF" X5R cap at its rated voltage might only have 3-5 uF. This means your bulk decoupling has less capacitance than you think. Oversize the voltage rating or the capacitance value
- **Too many capacitors can cause problems** — At certain frequencies, the parallel combination of caps can create anti-resonances (impedance peaks). This is rare in practice with good layout, but it can matter in sensitive designs
- **Don't forget the input side** — Power supply ICs (especially switching regulators) need input decoupling too. The pulsating input current of a buck converter needs a low-impedance path right at the converter
- **Test point access** — When debugging power integrity, you need to probe between the IC's power pin and its ground pin — not between the supply rail and a distant ground point. The voltage you care about is what the IC sees at its pins
- **Ferrite beads** — A ferrite bead in series with the supply trace acts as a frequency-dependent resistor that attenuates high-frequency noise. Combined with a bypass cap on the IC side, it forms a low-pass filter. Useful for isolating noisy digital supplies from sensitive analog supplies
