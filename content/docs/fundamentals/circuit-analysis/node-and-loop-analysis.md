---
title: "Node & Loop Analysis"
weight: 30
---

# Node & Loop Analysis

When series/parallel simplification can't reduce a circuit to something obvious, you need systematic methods. Node analysis (nodal analysis) and loop analysis (mesh analysis) are the two workhorses. Both are mechanical — follow the procedure, get the answer. The skill is choosing the right one and interpreting the results.

## Node Analysis (Nodal Analysis)

Write KCL at each unknown node. Express all currents in terms of node voltages using Ohm's law (I = V/R or I = V x Y where Y = 1/R). Solve the resulting system of equations.

### Procedure

1. **Choose a reference node (ground)** — Pick the node with the most connections. This simplifies the equations by giving one node a voltage of zero
2. **Label the remaining node voltages** — V1, V2, etc. These are the unknowns
3. **Write KCL at each unknown node** — Sum of currents leaving the node = 0 (or sum of currents in = sum of currents out)
4. **Express each current in terms of node voltages** — Current through a resistor from node A to node B is (V_A - V_B) / R
5. **Include known voltages** — Voltage sources fix relationships between nodes. A voltage source between nodes sets V_A - V_B = V_source
6. **Solve the system** — Algebra, substitution, or matrices

### When to Use Node Analysis

- Circuits with many parallel branches
- When you need node voltages (which is most of the time)
- Circuits with current sources (they directly give you a current entering a node)

### Dealing with Voltage Sources

A voltage source between two nodes constrains their voltages but doesn't directly tell you the current through it. Use the **supernode** technique: draw a boundary around the voltage source and its two nodes, write KCL for the boundary, and add the constraint equation V_A - V_B = V_source.

## Loop Analysis (Mesh Analysis)

Write KVL around each independent loop. Express all voltages in terms of loop (mesh) currents using Ohm's law (V = IR). Solve the resulting system of equations.

### Procedure

1. **Identify independent loops (meshes)** — In a planar circuit, meshes are the "windowpanes" — the loops that don't contain other loops inside them
2. **Assign a mesh current to each mesh** — All clockwise (or all counterclockwise) by convention
3. **Write KVL around each mesh** — Sum of voltage drops = sum of voltage rises
4. **Express each voltage drop in terms of mesh currents** — A resistor shared by two meshes carries the difference of their mesh currents
5. **Include known currents** — Current sources fix mesh currents or differences between them
6. **Solve the system**

### When to Use Loop Analysis

- Circuits with many series elements
- When you need branch currents
- Circuits with voltage sources (they directly give you a voltage in a loop equation)

### Dealing with Current Sources

A current source in a mesh fixes that mesh current (if it's in only one mesh) or constrains the difference between two mesh currents. Use the **supermesh** technique: combine the two meshes sharing the current source into one KVL equation, and add the constraint that the current source current equals the difference of the two mesh currents.

## Choosing Between Them

| Situation | Prefer |
|-----------|--------|
| Need node voltages | Node analysis |
| Need branch currents | Loop analysis |
| Many parallel branches | Node analysis |
| Many series elements | Loop analysis |
| Current sources present | Node analysis (simpler) |
| Voltage sources present | Loop analysis (simpler) |
| Fewer unknown nodes than loops | Node analysis |
| Fewer loops than unknown nodes | Loop analysis |

In practice, node analysis is more commonly used because voltages are what we usually need and what we can directly measure with probes.

## Sanity-Checking Results

After solving:

- **Check units** — Voltages in volts, currents in amps. If a node voltage comes out in milliamps, you've made an error
- **Check sign** — A negative voltage just means your assumed polarity was opposite. But check that it makes physical sense
- **Check power balance** — Total power delivered by sources should equal total power absorbed by resistances. P_delivered = V_source x I_source (watch the sign convention). P_absorbed = sum of I^2 R for all resistors
- **Check limiting cases** — What happens if a resistance goes to zero or infinity? Does your answer reduce to something obvious?
- **Verify with a simple measurement** — On the bench, measure one or two node voltages and compare to your calculated values

## Gotchas

- **Reference direction consistency** — The most common source of errors. Pick a convention and stick with it through the entire analysis. If you write I flowing left to right, the voltage drop across R is IR with the + on the left
- **Dependent sources** — Transistor models and op-amp models include dependent sources (voltage or current controlled by another voltage or current). These add equations but don't add unknowns. Include their controlling variable in your equations
- **Non-planar circuits** — Mesh analysis only works directly for planar circuits (circuits you can draw without crossing wires). Non-planar circuits need node analysis or generalized loop analysis
- **Overcounting or undercounting equations** — For node analysis: you need (N-1) equations for N nodes. For mesh analysis: you need M equations for M independent meshes. Getting the count wrong means an unsolvable or redundant system
