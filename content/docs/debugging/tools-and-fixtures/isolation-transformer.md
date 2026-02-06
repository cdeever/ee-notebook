---
title: "Isolation Transformer"
weight: 50
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

An isolation transformer provides galvanic isolation between the mains power line and your equipment under test. The primary and secondary windings are electrically separate—there's no direct conductive path from line to load. This isolation is essential for safely probing mains-referenced circuits and for eliminating ground loops that can damage equipment or cause measurement errors.

If you work on mains-connected equipment—power supplies, amplifiers, appliances, industrial controls—an isolation transformer is a fundamental safety fixture.

## Why Isolation Matters

In a normal mains outlet, the neutral conductor is bonded to earth ground at the service panel. Equipment plugged into the outlet has its circuit ground referenced to mains neutral. This creates hazards:

**Shock hazard from ground-referenced test equipment:**
When you connect an oscilloscope's ground clip to a point in a non-isolated circuit, you're connecting that point to earth ground through the scope's grounding system. If that point isn't already at ground potential, you create a short circuit—potentially through yourself.

For example: probing the "low side" of a half-wave rectifier that's referenced to neutral, not ground. Connecting a scope ground there creates a direct short across the line.

**Ground loops:**
When multiple pieces of equipment share ground connections through both mains wiring and signal cables, ground currents can flow through signal paths. This causes hum, noise, and measurement errors.

**Equipment damage:**
A misplaced ground connection in non-isolated equipment can create large fault currents that damage both the DUT and your test equipment.

An isolation transformer breaks these paths. The secondary floats with respect to earth ground, so:
- No single point on the secondary is inherently "hot"—a single touch won't cause current flow through earth ground
- Ground clips can be connected to any point without creating a short to mains
- Ground loops through the mains are eliminated

## What Isolation Doesn't Do

**It doesn't reduce voltage.** A 1:1 isolation transformer provides the same voltage on the secondary as the primary—120V in, 120V out (or 240V for 240V countries). The full mains voltage still exists between the two secondary conductors; only the reference to earth ground is removed.

**It doesn't make anything "safe to touch."** You can still receive a shock from contact with both secondary conductors, or from one conductor if you're grounded through another path. Isolation reduces certain categories of hazard—it doesn't eliminate all of them.

**It doesn't provide current limiting.** Unlike a dim bulb tester, an isolation transformer can deliver the full current rating of its secondary. Faults still blow fuses and cause damage.

## Choosing an Isolation Transformer

| Specification | What to Look For |
|---------------|------------------|
| **VA rating** | Must exceed the maximum load you'll power. 500VA handles most bench work; 1000VA or more for larger equipment |
| **Voltage ratio** | 1:1 for same voltage in and out. Some units include taps or are adjustable |
| **Isolation voltage** | Specifies the voltage withstand between primary and secondary. 4kV is common and adequate for mains work |
| **Faraday shield** | An electrostatic shield between windings reduces capacitive coupling and common-mode noise. Useful for sensitive measurements |
| **Construction quality** | Mains equipment should be UL/CE listed or built to equivalent standards. Avoid no-name imports for safety-critical equipment |

**Variable isolation transformers:** Some units combine a variac (variable autotransformer) with an isolation transformer, allowing you to adjust the output voltage. This is useful for slowly bringing up equipment or testing at reduced voltages, but the variable output section is not isolated—only the isolation transformer portion provides the safety benefit.

## Building vs. Buying

You can build an isolation transformer from two identical power transformers wired back-to-back:

1. **Transformer A:** Primary connected to mains, secondary outputs (say) 24VAC
2. **Transformer B:** "Primary" connected to Transformer A's secondary, "secondary" outputs 120VAC

This works because transformers are reversible. Two 120V:24V transformers in series provide 120V:120V isolation.

**Cautions with DIY:**
- The transformers must have identical voltage ratings or you'll get a non-1:1 ratio
- Power handling is limited by the smaller of the two transformers
- Efficiency is lower than a purpose-built isolation transformer (losses compound)
- Ensure proper insulation and enclosure for mains voltages

For regular use, a commercial isolation transformer is a better investment. They're available from surplus sources, electrical supply houses, and scientific equipment dealers.

## Using an Isolation Transformer

### Basic Setup

1. **Plug the isolation transformer into the wall outlet**
2. **Plug the DUT into the isolation transformer's secondary outlet**
3. **Now the DUT floats with respect to earth ground**

### Safe Probing

With the DUT isolated, you can connect your oscilloscope's ground clip to any single point in the circuit without creating a short to mains. The scope ground becomes the reference for your measurements, not the mains neutral.

**Example:** To measure across a current-sense resistor on the low side of a rectifier:
- Connect scope ground to one side of the resistor
- Connect the probe tip to the other side
- You're measuring the voltage drop without shorting anything to mains ground

**Important:** You still can't connect the scope ground to two different points in the circuit (that would short them together through the scope's ground). The isolation eliminates ground-to-mains shorts, not ground-to-ground shorts through your test equipment.

### Multiple Ground Connections

When using multiple pieces of test equipment with an isolated DUT, all equipment grounds connect to the same floating reference point. This is usually the DUT's chassis or circuit ground. Choose this point deliberately and connect all grounds there.

### Measuring True Differential Signals

For measurements where neither side is near ground, use differential probes rather than relying on isolation. Isolation lets you place your reference anywhere; differential probes let you measure without placing a reference at all.

## Limitations

- **Capacitive coupling:** Some high-frequency noise passes through inter-winding capacitance. Faraday-shielded transformers reduce this, but don't eliminate it.
- **Power handling:** You need enough VA capacity for the load. Undersized transformers run hot, saturate, or fail.
- **Not intrinsically safe:** The secondary still carries full mains voltage potential between its conductors. Two-hand contact is still dangerous.
- **Ground loops through signal cables:** If your isolated DUT connects to non-isolated equipment via signal cables (audio, video, data), you may recreate ground loop problems. Consider the entire system.

## Safety

- **An isolation transformer is a safety tool—but only when used correctly.** Understand what it does and doesn't provide.
- **Never assume isolated means safe.** You can still be electrocuted by the secondary voltage.
- **Use only with one piece of equipment at a time** unless you understand the grounding implications.
- **Verify isolation with a meter** if you're unsure whether your transformer is actually providing isolation (some "isolation transformers" are mislabeled autotransformers, which don't isolate).
- **Don't bypass the isolation** by connecting the secondary ground to earth (this defeats the purpose).
- **Keep the transformer and its connections in good condition.** Damaged insulation on a mains-rated device is a shock and fire hazard.

## In Practice

- An isolation transformer is the difference between safely measuring a switching power supply and a dramatic short circuit when the scope ground clip makes contact
- For vintage tube equipment work, isolation is essential—these designs often have "hot chassis" configurations where the chassis is connected directly to mains
- Keep the isolation transformer at your bench, not stored away—you'll use it more if it's always connected and ready
- Mark isolated outlets clearly so you know which outlets provide isolation and which don't
