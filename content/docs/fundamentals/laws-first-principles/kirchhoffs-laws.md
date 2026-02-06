---
title: "Kirchhoff's Laws"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Kirchhoff's Laws

KCL and KVL. These two constraints — conservation of charge at a node and conservation of energy around a loop — are the foundation of every circuit analysis technique. They never fail, and when the numbers don't add up, it's always the model or the measurement that's off, not Kirchhoff.

## Kirchhoff's Current Law (KCL)

**The sum of all currents entering a node equals the sum of all currents leaving it.** Or equivalently: the algebraic sum of all currents at a node is zero.

This is conservation of charge. Charge doesn't pile up at a node — whatever flows in must flow out.

### Using KCL

1. Pick a node (any junction where two or more branches meet)
2. Assign a reference direction for each branch current (the direction is arbitrary — if the initial guess is wrong, the math produces a negative number)
3. Write the equation: currents in = currents out

At a node with three branches: I1 = I2 + I3 (assuming I1 flows in, I2 and I3 flow out).

## Kirchhoff's Voltage Law (KVL)

**The sum of all voltages around any closed loop is zero.** Energy gained (sources) equals energy lost (drops) going around the loop.

This is conservation of energy. A charge that travels around a complete loop returns to its starting potential.

### Using KVL

1. Pick a closed loop in the circuit
2. Choose a direction to traverse the loop (clockwise or counterclockwise — doesn't matter)
3. Sum the voltage rises and drops walking around the loop
4. Set the total equal to zero

Convention: Entering the + terminal of an element means a voltage drop (positive term going toward zero). Entering the − terminal means a rise.

## When They Apply

KCL and KVL are statements about conservation laws — charge and energy. They're always true in lumped-element circuits. When a circuit analysis doesn't work:

- Check reference directions
- Check that the model includes all relevant elements (parasitic resistance, stray capacitance, etc.)
- Check the measurements (probe loading, ground loops, etc.)

The laws aren't wrong. The model or the measurement is.

## Tips

- **Current budget check** — KCL says supply current must equal the sum of branch currents. If the total doesn't add up, there's an unaccounted path (leakage, a shorted component, a floating pin drawing current)
- **Voltage accounting** — KVL says drops in a series path must sum to the supply. If measured drops don't add up, there's a missing drop somewhere (trace resistance, connector drop, wire resistance)
- **Ground path debugging** — "Ground" is a node like any other. KCL applies to the ground node too. Current returning through the ground plane must equal current sourced into the circuit
- **Generalized KCL for current budgets** — KCL applies to any closed boundary, not just a single node. Drawing a boundary around a whole subcircuit means total current in = total current out — a useful sanity check for power supply current budgets

## Caveats

**KCL:**

- **Reference directions matter** — Pick directions consistently and let the algebra handle the signs. Flipping a direction mid-analysis creates errors
- **Stray capacitance** — At high frequencies, current can "leak" through parasitic capacitances that aren't on the schematic. KCL still holds; the model is just incomplete

**KVL:**

- **Sign errors are the #1 source of mistakes** — Be systematic about polarity. Walk the loop in one direction and don't change convention halfway through
- **Any loop works** — In a complex circuit there are many possible loops. Independent loops give independent equations; redundant loops give equations that are algebraically dependent (still true, but not new information)
- **Inductive loops and changing magnetic flux** — In circuits with mutual inductance or time-varying magnetic fields, the simple "sum of voltages = 0" needs to account for induced EMF. For lumped-element circuits at reasonable frequencies, this doesn't come up often, but it's worth knowing the limitation

## In Practice

**A voltage drop in a series path that doesn't add up to the source voltage** means KVL is pointing to a drop missing from the model — trace resistance, a connector, or wire not on the schematic. The gap between the expected sum and the measured sum equals the unaccounted drop.

**A supply sourcing more current than the load should draw** means KCL is pointing to an unaccounted path. The excess current is leaving through a route not in the model — leakage, a shorted component, or a floating pin drawing current.

**Voltage differences between ground points on a board** are KVL applied to the return path. Current flowing through the finite impedance of the ground plane or trace drops voltage across it, and the difference between two "ground" probing points quantifies that drop.
