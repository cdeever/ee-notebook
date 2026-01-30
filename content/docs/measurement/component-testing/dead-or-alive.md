---
title: "Is This Part Dead or Alive?"
weight: 10
---

# Is This Part Dead or Alive?

Quick go/no-go checks. Before pulling out the LCR meter or curve tracer, a DMM can tell you whether a part is obviously blown. Diodes that read as shorts, transistors with no junction drop, capacitors that don't charge — these are the fast checks that catch the catastrophic failures first.

## DMM: Diode Test

**Tool:** DMM, diode test mode
**When:** Checking any semiconductor — diodes, LEDs, transistor junctions, body diodes in MOSFETs

### Procedure

1. Set DMM to diode mode (diode symbol)
2. Place red lead on the anode, black on the cathode (forward bias)
3. Read the forward voltage drop
4. Reverse the leads — should read OL (open)

### Expected Forward Voltages

| Component | Forward direction | Reverse direction |
|-----------|------------------|-------------------|
| Silicon diode | 0.5–0.7V | OL |
| Schottky diode | 0.2–0.4V | OL |
| LED (red/green) | 1.5–2.2V | OL |
| LED (blue/white) | 2.8–3.5V | OL |
| Zener diode | 0.5–0.7V forward; zener voltage may or may not show in reverse (depends on Vz vs. DMM test voltage) | OL or zener voltage |

### Interpreting Results

| Reading | Meaning |
|---------|---------|
| 0.5–0.7V forward, OL reverse | Normal silicon junction |
| 0.000V both directions | Shorted — part is dead |
| OL both directions | Open — part is dead (or leads are reversed on an LED, check twice) |
| Low voltage both directions (e.g., 0.3V) | Leaky — junction is degraded |

### Gotchas

- The DMM's test voltage (typically 2–3V) may not be enough to forward-bias some LEDs (especially blue/white). OL on a blue LED in forward direction doesn't always mean it's dead
- In-circuit, parallel paths through other components can mask the diode's true reading. For definitive results, lift one leg of the diode
- Some diodes (TVS, Zener) are designed to conduct in reverse at their rated voltage. If the DMM's open-circuit voltage exceeds the Zener voltage, you'll see conduction in reverse — this is normal

## DMM: Transistor Junction Check

**Tool:** DMM, diode test mode
**When:** Quick check on BJTs, MOSFETs, and other multi-junction semiconductors

### BJT (NPN) Procedure

An NPN transistor has two diode junctions: Base-Emitter and Base-Collector, both with the anode at the base.

1. Red on Base, Black on Emitter → 0.5–0.7V (B-E junction forward)
2. Red on Base, Black on Collector → 0.5–0.7V (B-C junction forward)
3. Red on Emitter, Black on Base → OL (B-E reverse)
4. Red on Collector, Black on Base → OL (B-C reverse)
5. Between Collector and Emitter → OL both directions (unless transistor is on or damaged)

For PNP, reverse the polarity expectations — junctions are forward-biased with black on base.

### MOSFET Check

MOSFETs have a body diode from Source to Drain (for N-channel: anode at Source, cathode at Drain).

1. Red on Source, Black on Drain → 0.4–0.7V (body diode forward)
2. Red on Drain, Black on Source → OL (body diode reverse)
3. Gate to Source, Gate to Drain → OL both directions (insulated gate)

If Gate-to-Source or Gate-to-Drain reads low or short, the gate oxide is damaged — MOSFET is dead.

### Gotchas

- MOSFET gates can hold charge. A previous measurement or static charge can leave the gate charged, turning on the channel and making Drain-Source look shorted. Touch Gate and Source together to discharge before testing
- Enhancement-mode MOSFETs may partially turn on from the DMM's test voltage on the gate. If Drain-Source reads oddly low, discharge the gate and retest
- Darlington transistors show ~1.2–1.4V B-E drop (two junctions in series). This is normal, not a fault
- Some power transistors have internal protection diodes, resistors, or Zener clamps. Check the datasheet if readings don't match a simple junction model

## DMM: Capacitor Quick Check

**Tool:** DMM, Ohm mode or capacitance mode
**When:** Quick check whether a capacitor is shorted, open, or roughly functional

### Resistance Method (Ohm Mode)

1. Discharge the capacitor first (short the leads briefly with a resistor)
2. Set DMM to high resistance range (MOhm)
3. Connect probes to the capacitor
4. Watch the reading: it should start low (cap charging from DMM test current) and climb toward OL over a few seconds

| Behavior | Meaning |
|----------|---------|
| Starts low, climbs to OL | Normal — capacitor is charging |
| Stays at 0 Ohm | Shorted — capacitor is dead |
| Immediately OL, no movement | Open — capacitor is dead (or very small, < 1 nF, charges too fast to see) |
| Settles at a mid-range value (kOhm to MOhm) | Leaky — high DC leakage current |

### Capacitance Mode

Many DMMs have a dedicated capacitance mode that reads the value directly in nF or uF.

1. Discharge the capacitor
2. Set DMM to capacitance mode
3. Connect the capacitor (observing polarity for electrolytics)
4. Read the value and compare to the marking

### What You Learn

- Whether the capacitor is shorted (most common failure mode for electrolytics)
- Whether it has roughly the right capacitance
- Whether it has excessive leakage (resistance method)

### Gotchas

- Small capacitors (< 1 nF) charge too quickly for the resistance method to show any movement. Use capacitance mode or an LCR meter
- Electrolytic capacitors normally have some leakage — the resistance reading may settle at a few MOhm rather than true OL. This is normal for large electrolytics. True OL is typical for film and ceramic caps
- DMM capacitance mode measures at low frequency (often 100 Hz–1 kHz) and low voltage. This doesn't reveal ESR or high-frequency performance — a capacitor can measure correct capacitance and still be bad due to high ESR

## DMM: Inductor Quick Check

**Tool:** DMM, continuity or Ohm mode
**When:** Quick check whether an inductor is open (most common failure)

### Procedure

1. Set DMM to continuity or low-ohm mode
2. Measure across the inductor
3. A good inductor reads very low resistance — most small inductors read < 10 Ohm, many read < 1 Ohm
4. An open reading (OL) means the winding is broken

### Expected Resistances

| Inductor type | Typical DCR |
|--------------|-------------|
| Small ferrite bead | < 1 Ohm |
| SMD power inductor (1–47 uH) | 0.01–1 Ohm |
| Through-hole choke (100 uH–10 mH) | 1–50 Ohm |
| Transformer winding | Varies widely — check datasheet |

### What You Learn

- Whether the winding is intact (not open)
- Rough DCR value — useful for comparison to datasheet

### Gotchas

- Resistance alone doesn't tell you if an inductor's core is cracked or saturated. A ferrite inductor with a cracked core reads normal DCR but has reduced inductance. You need an LCR meter or inductance mode for that
- In-circuit, the inductor may read low because it's in parallel with other components. Lift one leg for definitive out-of-circuit testing
- Some inductors (common-mode chokes) have multiple windings. Test each winding separately and verify isolation between windings
