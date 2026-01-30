---
title: "Boolean Logic"
weight: 10
---

# Boolean Logic

All digital electronics rests on a small set of logical operations applied to binary values. Boolean algebra provides the mathematical framework — a system where variables take only two values (0 and 1) and a handful of operations combine them. Every digital circuit, from a single gate to a billion-transistor processor, is ultimately an implementation of Boolean functions.

## The Basic Operations

### AND

Output is 1 only when all inputs are 1.

| A | B | A AND B |
|---|---|---------|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

Physical analogy: two switches in series. Current flows only when both are closed. In CMOS, implemented with series NMOS and parallel PMOS transistors (plus an inverter for true AND, since the natural CMOS gate is NAND).

### OR

Output is 1 when any input is 1.

| A | B | A OR B |
|---|---|--------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

Physical analogy: two switches in parallel. Current flows when either is closed. In CMOS, implemented with parallel NMOS and series PMOS (plus an inverter, since the natural gate is NOR).

### NOT (Inverter)

Output is the complement of the input.

| A | NOT A |
|---|-------|
| 0 | 1 |
| 1 | 0 |

The simplest CMOS gate: one PMOS and one NMOS transistor. When the input is LOW, PMOS conducts and pulls the output HIGH. When the input is HIGH, NMOS conducts and pulls the output LOW. The inverter is also the fundamental building block — NAND and NOR gates are just inverters with extra transistors in their pull-up and pull-down networks.

### XOR (Exclusive OR)

Output is 1 when inputs differ.

| A | B | A XOR B |
|---|---|---------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

XOR detects difference. This makes it essential for parity checking, arithmetic (it's the core of a half-adder), comparators, and error detection. XOR also has a useful property: A XOR 0 = A (passes through), A XOR 1 = NOT A (inverts). This makes XOR a programmable inverter, controlled by one input.

## NAND and NOR: The Universal Gates

NAND is AND followed by NOT. NOR is OR followed by NOT. Either one alone can implement any Boolean function — they are "functionally complete."

**Why this matters practically:** CMOS technology naturally produces NAND and NOR gates more efficiently than AND and OR. A 2-input NAND is 4 transistors. A 2-input AND is 6 transistors (NAND + inverter). Most digital logic is built from NAND and NOR at the transistor level, even when the schematic shows AND and OR symbols.

NAND-only implementations are common in ASIC design and standard cell libraries. Any Boolean function can be converted to use only NAND gates, which simplifies manufacturing.

## Truth Tables and Boolean Expressions

A truth table exhaustively lists every input combination and the corresponding output. For n inputs, there are 2^n rows. This is complete but scales poorly — 4 inputs produce 16 rows, 8 inputs produce 256.

Boolean expressions are compact descriptions of the same function:

- **Sum of Products (SOP):** OR together the AND terms for each row where the output is 1. Example: F = A'B + AB' (XOR expressed as SOP)
- **Product of Sums (POS):** AND together the OR terms for each row where the output is 0

SOP is more commonly used because it maps directly to two levels of logic (AND gates feeding an OR gate) and corresponds to how PLDs and PALs are structured.

## Simplification

Boolean expressions can often be simplified to use fewer gates, reducing cost, power, and propagation delay.

### Algebraic Simplification

Key identities:

- **Identity:** A + 0 = A, A x 1 = A
- **Null:** A + 1 = 1, A x 0 = 0
- **Idempotent:** A + A = A, A x A = A
- **Complement:** A + A' = 1, A x A' = 0
- **Absorption:** A + AB = A, A(A + B) = A
- **Distributive:** A(B + C) = AB + AC, A + BC = (A + B)(A + C)

### De Morgan's Theorem

The most important simplification rule in digital logic:

- **(A x B)' = A' + B'** — The complement of AND is OR with complemented inputs (NAND = bubbled OR)
- **(A + B)' = A' x B'** — The complement of OR is AND with complemented inputs (NOR = bubbled AND)

De Morgan's theorem is why NAND and NOR gates can implement any function — by applying inversions (bubbles) at the right places, any gate type converts to any other. It also provides a systematic way to convert between gate types when redesigning for a particular logic family.

**Practical use:** When a design uses all NAND gates, De Morgan's theorem explains why. A NAND gate with inverted inputs acts as an OR gate. Pushing bubbles through a circuit diagram using De Morgan's is a standard technique for converting between representations.

### Karnaugh Maps

A graphical simplification method for functions of up to 5-6 variables. The map arranges truth table entries in a grid where adjacent cells differ by exactly one variable (Gray code ordering). Groups of 1s in the map correspond to simplified product terms — larger groups mean simpler terms.

Karnaugh maps are practical for manual simplification of small functions. For anything larger, synthesis tools use the Quine-McCluskey algorithm or other automated methods.

## From Logic to Gates to Circuits

The path from a Boolean function to a physical circuit:

1. **Specify the function** — Truth table or Boolean expression
2. **Simplify** — Karnaugh map, algebraic manipulation, or tool-based optimization
3. **Map to gates** — Choose gate types based on the target technology (NAND-only for ASIC, mixed for discrete)
4. **Implement** — Wire up physical gate ICs, synthesize into an FPGA, or lay out standard cells

Each step introduces practical considerations: propagation delay through each gate level, fan-out limits on gate outputs, power consumption per gate, and the physical routing of signals on a PCB or within a chip.

## Gotchas

- **Don't-care conditions matter** — If certain input combinations can never occur (or the output doesn't matter for them), marking them as "don't care" in the truth table allows better simplification. Missing this optimization leads to unnecessarily complex logic
- **Gate count is not the only metric** — A simpler expression might use fewer gates but more levels of logic, increasing total propagation delay. In timing-critical paths, a less-simplified but flatter implementation (fewer gate levels) may be better
- **Bubble matching** — When connecting gates from different logic families or mixing NAND/NOR implementations, the inversions (bubbles) must be tracked carefully. An output bubble should connect to an input bubble to cancel. Mismatched bubbles invert the logic
- **XOR is expensive** — In terms of transistor count, XOR is more complex than AND or OR. Designs that use XOR heavily (arithmetic, parity) consume more area and power per function
- **Boolean simplification assumes static logic** — The simplified expression gives the correct steady-state output but says nothing about transient behavior. Hazards and glitches (see [Combinational Logic]({{< relref "combinational-logic" >}})) can produce incorrect outputs during transitions even when the Boolean function is correct
