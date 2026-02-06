---
title: "Is This Part Dead or Alive?"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is This Part Dead or Alive?

Quick go/no-go checks. Before pulling out the LCR meter or curve tracer, a DMM can tell whether a part is obviously blown. Diodes that read as shorts, transistors with no junction drop, capacitors that don't charge — these fast checks catch catastrophic failures first.

## Diode Test

DMM diode mode applies a small current and displays the forward voltage drop across the junction.

**Expected forward voltages:**

| Component | Forward direction | Reverse direction |
|-----------|------------------|-------------------|
| Silicon diode | 0.5–0.7V | OL |
| Schottky diode | 0.2–0.4V | OL |
| LED (red/green) | 1.5–2.2V | OL |
| LED (blue/white) | 2.8–3.5V | OL |
| Zener diode | 0.5–0.7V forward | OL or zener voltage in reverse |

**Interpreting results:**

| Reading | Meaning |
|---------|---------|
| 0.5–0.7V forward, OL reverse | Normal silicon junction |
| 0.000V both directions | Shorted — part is dead |
| OL both directions | Open — part is dead |
| Low voltage both directions (e.g., 0.3V) | Leaky — junction is degraded |

## Transistor Junction Check

A BJT has two diode junctions; a MOSFET has a body diode and an insulated gate.

**NPN BJT:** Base-Emitter and Base-Collector both show 0.5–0.7V with red lead on Base. Collector-Emitter should read OL both directions.

**PNP BJT:** Same pattern, but with black lead on Base.

**N-channel MOSFET:** Body diode shows 0.4–0.7V with red on Source, black on Drain. Gate to Source and Gate to Drain should both read OL (insulated gate). If Gate shows conductivity, gate oxide is damaged.

## Capacitor Quick Check

**Resistance method:** Discharge the capacitor, set DMM to high-ohm range, connect probes. The reading should start low (cap charging) and climb toward OL over a few seconds.

| Behavior | Meaning |
|----------|---------|
| Starts low, climbs to OL | Normal — capacitor is charging |
| Stays at 0 Ω | Shorted — capacitor is dead |
| Immediately OL, no movement | Open — capacitor is dead (or very small, < 1 nF) |
| Settles at mid-range (kΩ to MΩ) | Leaky — high DC leakage current |

**Capacitance mode:** Discharge the capacitor, read the value directly, compare to marking.

## Inductor Quick Check

Set DMM to continuity or low-ohm mode. A good inductor reads very low resistance — most small inductors read < 10 Ω, many read < 1 Ω. An open reading (OL) means the winding is broken.

| Inductor type | Typical DCR |
|--------------|-------------|
| Small ferrite bead | < 1 Ω |
| SMD power inductor (1–47 µH) | 0.01–1 Ω |
| Through-hole choke (100 µH–10 mH) | 1–50 Ω |

## Tips

- Discharge capacitors before testing — residual charge can damage meters or give false readings
- For in-circuit testing, lift one leg of the component for definitive results — parallel paths mask true readings
- Touch Gate and Source together to discharge a MOSFET before testing — residual gate charge can turn on the channel
- Check both directions for diodes and transistor junctions — asymmetry is the key indicator of a healthy semiconductor

## Caveats

- DMM test voltage (typically 2–3V) may not forward-bias some LEDs (especially blue/white) — OL in forward direction doesn't always mean dead
- In-circuit, parallel paths through other components can mask the true reading
- Zener and TVS diodes are designed to conduct in reverse at their rated voltage — this is normal if DMM open-circuit voltage exceeds the zener voltage
- MOSFET gates can hold charge from previous measurements or static — discharge before testing
- Enhancement-mode MOSFETs may partially turn on from DMM test voltage on gate
- Darlington transistors show ~1.2–1.4V B-E drop (two junctions in series) — this is normal
- Small capacitors (< 1 nF) charge too fast for the resistance method to show movement
- Electrolytic capacitors normally have some leakage — resistance may settle at a few MΩ rather than true OL
- Resistance alone doesn't reveal if an inductor's core is cracked or saturated

## In Practice

- Diode reading 0.000V in both directions indicates shorted junction — part is dead
- Diode reading OL in both directions could be open (dead) or reversed leads on an LED — check twice
- MOSFET with any conductivity Gate-to-Source or Gate-to-Drain has damaged gate oxide
- Capacitor that stays at 0 Ω is shorted — most common failure mode for electrolytics
- Capacitor that immediately reads OL with no charging behavior is open (or too small to see)
- Inductor reading OL has an open winding — most common inductor failure mode
- BJT with OL on all junction measurements has open internal bonds
- BJT with 0V on B-E or B-C has shorted junction
