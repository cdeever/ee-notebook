---
title: "Kirchhoff's Laws"
weight: 20
---

# Kirchhoff's Laws

KCL and KVL. These two constraints — conservation of charge at a node and conservation of energy around a loop — are the foundation of every circuit analysis technique. They never fail, and when your numbers don't add up, it's always your model or measurement that's off, not Kirchhoff.

## Kirchhoff's Current Law (KCL)

**The sum of all currents entering a node equals the sum of all currents leaving it.** Or equivalently: the algebraic sum of all currents at a node is zero.

This is conservation of charge. Charge doesn't pile up at a node — whatever flows in must flow out.

### Using KCL

1. Pick a node (any junction where two or more branches meet)
2. Assign a reference direction for each branch current (the direction is arbitrary — if you guess wrong, the math gives you a negative number)
3. Write the equation: currents in = currents out

At a node with three branches: I1 = I2 + I3 (assuming I1 flows in, I2 and I3 flow out).

### KCL Gotchas

- **Reference directions matter** — Pick directions consistently and let the algebra handle the signs. Flipping a direction mid-analysis creates errors
- **Applies to any closed boundary, not just a single node** — You can draw a boundary around a whole subcircuit and say "total current in = total current out." This is sometimes called the generalized KCL and it's useful for sanity-checking power supply current budgets
- **Stray capacitance** — At high frequencies, current can "leak" through parasitic capacitances that aren't on the schematic. KCL still holds; your model is just incomplete

## Kirchhoff's Voltage Law (KVL)

**The sum of all voltages around any closed loop is zero.** Energy gained (sources) equals energy lost (drops) as you go around the loop.

This is conservation of energy. A charge that travels around a complete loop returns to its starting potential.

### Using KVL

1. Pick a closed loop in the circuit
2. Choose a direction to traverse the loop (clockwise or counterclockwise — doesn't matter)
3. Sum the voltage rises and drops as you walk around the loop
4. Set the total equal to zero

Convention: If you enter the + terminal of an element, it's a voltage drop (positive term going toward zero). If you enter the - terminal, it's a rise.

### KVL Gotchas

- **Sign errors are the #1 source of mistakes** — Be systematic about polarity. Walk the loop in one direction and don't change convention halfway through
- **You can pick any loop** — In a complex circuit there are many possible loops. Independent loops give independent equations; redundant loops give equations that are algebraically dependent (still true, but not new information)
- **Inductive loops and changing magnetic flux** — In circuits with mutual inductance or time-varying magnetic fields, the simple "sum of voltages = 0" needs to account for induced EMF. For lumped-element circuits at reasonable frequencies, this doesn't come up often, but it's worth knowing the limitation

## Why These Never Fail

KCL and KVL are statements about conservation laws — charge and energy. They're always true in lumped-element circuits. When a circuit analysis doesn't work:

- Check your reference directions
- Check that your model includes all relevant elements (parasitic resistance, stray capacitance, etc.)
- Check your measurements (probe loading, ground loops, etc.)

The laws aren't wrong. The model or the measurement is.

## Bench Relevance

- **Current budget check** — KCL says the current drawn from a supply must equal the sum of currents into each branch. If the total doesn't add up, there's a path you're not accounting for (leakage, a shorted component, a floating pin drawing current)
- **Voltage accounting** — KVL says voltages in a series path must sum to the supply. If you measure every drop in a series chain and they don't add up, you're missing a drop somewhere (trace resistance, connector drop, wire resistance)
- **Ground path debugging** — "Ground" is a node like any other. KCL applies to the ground node too. Current returning through the ground plane must equal current sourced into the circuit. Ground bounce and voltage differences between "ground" points are KVL telling you about resistive and inductive drops in the return path
