---
title: "Boolean Logic"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
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

The most important simplification rule in digital logic. The core idea: inverting the output of a gate is the same as swapping the gate type (AND ↔ OR) and inverting every input instead. Put another way:

- A **NAND** gate behaves identically to an **OR** gate with inverted inputs.
- A **NOR** gate behaves identically to an **AND** gate with inverted inputs.

{{< graphviz >}}
digraph demorgan {
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]
  nodesep=0.8
  ranksep=0.7

  subgraph {
    rank=same

    nand [shape=plain label=<
      <TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="4">
        <TR><TD COLSPAN="4" ALIGN="CENTER"><FONT COLOR="#777777" POINT-SIZE="9">NAND</FONT></TD></TR>
        <TR>
          <TD ALIGN="RIGHT"><FONT COLOR="#8888cc">A &#8594; </FONT></TD>
          <TD ROWSPAN="2" BGCOLOR="#2a2a3a" BORDER="1" COLOR="#6666aa" CELLPADDING="8"><B><FONT COLOR="#cccccc"> AND </FONT></B></TD>
          <TD ROWSPAN="2"><FONT COLOR="#cc8888"> &#9675; &#8594; </FONT></TD>
          <TD ROWSPAN="2"><FONT COLOR="#cccccc">Q</FONT></TD>
        </TR>
        <TR>
          <TD ALIGN="RIGHT"><FONT COLOR="#8888cc">B &#8594; </FONT></TD>
        </TR>
      </TABLE>
    >]

    eq1 [shape=plaintext label=<<FONT POINT-SIZE="20" COLOR="#cccccc"><B>&#8801;</B></FONT>>]

    bubor [shape=plain label=<
      <TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="4">
        <TR><TD COLSPAN="4" ALIGN="CENTER"><FONT COLOR="#777777" POINT-SIZE="9">bubbled-input OR</FONT></TD></TR>
        <TR>
          <TD ALIGN="RIGHT"><FONT COLOR="#8888cc">A &#8594; </FONT></TD>
          <TD><FONT COLOR="#cc8888">&#9675; &#8594; </FONT></TD>
          <TD ROWSPAN="2" BGCOLOR="#2a3a2a" BORDER="1" COLOR="#66aa66" CELLPADDING="8"><B><FONT COLOR="#cccccc"> OR </FONT></B></TD>
          <TD ROWSPAN="2"><FONT COLOR="#cccccc"> &#8594; Q</FONT></TD>
        </TR>
        <TR>
          <TD ALIGN="RIGHT"><FONT COLOR="#8888cc">B &#8594; </FONT></TD>
          <TD><FONT COLOR="#cc8888">&#9675; &#8594; </FONT></TD>
        </TR>
      </TABLE>
    >]

    nand -> eq1 -> bubor [style=invis]
  }

  subgraph {
    rank=same

    nor [shape=plain label=<
      <TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="4">
        <TR><TD COLSPAN="4" ALIGN="CENTER"><FONT COLOR="#777777" POINT-SIZE="9">NOR</FONT></TD></TR>
        <TR>
          <TD ALIGN="RIGHT"><FONT COLOR="#8888cc">A &#8594; </FONT></TD>
          <TD ROWSPAN="2" BGCOLOR="#2a2a3a" BORDER="1" COLOR="#6666aa" CELLPADDING="8"><B><FONT COLOR="#cccccc"> OR </FONT></B></TD>
          <TD ROWSPAN="2"><FONT COLOR="#cc8888"> &#9675; &#8594; </FONT></TD>
          <TD ROWSPAN="2"><FONT COLOR="#cccccc">Q</FONT></TD>
        </TR>
        <TR>
          <TD ALIGN="RIGHT"><FONT COLOR="#8888cc">B &#8594; </FONT></TD>
        </TR>
      </TABLE>
    >]

    eq2 [shape=plaintext label=<<FONT POINT-SIZE="20" COLOR="#cccccc"><B>&#8801;</B></FONT>>]

    buband [shape=plain label=<
      <TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="4">
        <TR><TD COLSPAN="4" ALIGN="CENTER"><FONT COLOR="#777777" POINT-SIZE="9">bubbled-input AND</FONT></TD></TR>
        <TR>
          <TD ALIGN="RIGHT"><FONT COLOR="#8888cc">A &#8594; </FONT></TD>
          <TD><FONT COLOR="#cc8888">&#9675; &#8594; </FONT></TD>
          <TD ROWSPAN="2" BGCOLOR="#2a3a2a" BORDER="1" COLOR="#66aa66" CELLPADDING="8"><B><FONT COLOR="#cccccc"> AND </FONT></B></TD>
          <TD ROWSPAN="2"><FONT COLOR="#cccccc"> &#8594; Q</FONT></TD>
        </TR>
        <TR>
          <TD ALIGN="RIGHT"><FONT COLOR="#8888cc">B &#8594; </FONT></TD>
          <TD><FONT COLOR="#cc8888">&#9675; &#8594; </FONT></TD>
        </TR>
      </TABLE>
    >]

    nor -> eq2 -> buband [style=invis]
  }

  nand -> nor [style=invis]
  eq1 -> eq2 [style=invis]
  bubor -> buband [style=invis]
}
{{< /graphviz >}}

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

## Tips

- **Mark input combinations that cannot occur as don't-cares in the truth table before simplifying.** Don't-care entries give the simplification algorithm (or Karnaugh map) extra flexibility, often producing significantly fewer gates. Missing this step leads to logic that is correct but unnecessarily complex.
- **Track inversions by matching bubbles at every gate-to-gate connection.** An output bubble should meet an input bubble to cancel. Reading a NAND/NOR-heavy schematic becomes straightforward once each bubble is accounted for — if two bubbles face each other across a wire, the logic at that connection is non-inverting.
- **Use a Karnaugh map for manual simplification up to about 5 variables; beyond that, use a synthesis tool.** K-maps are fast and visual for small functions, but the Gray-code adjacency that makes them work becomes impractical to manage above 5–6 variables. EDA tools apply Quine-McCluskey or heuristic algorithms that scale where maps cannot.
- **When building from discrete gates, prefer NAND-only or NOR-only implementations.** Single-gate-type designs simplify sourcing, reduce board variety, and align with how CMOS implements logic natively. De Morgan's theorem provides the conversion: any AND/OR expression translates systematically to all-NAND or all-NOR.

## Caveats

- **Gate count is not the only metric** — A simpler expression might use fewer gates but more levels of logic, increasing total propagation delay. In timing-critical paths, a less-simplified but flatter implementation (fewer gate levels) may be better.
- **XOR is expensive** — In terms of transistor count, XOR is more complex than AND or OR. Designs that use XOR heavily (arithmetic, parity) consume more area and power per function.
- **Boolean simplification assumes static logic** — The simplified expression gives the correct steady-state output but says nothing about transient behavior. Hazards and glitches (see [Combinational Logic]({{< relref "combinational-logic" >}})) can produce incorrect outputs during transitions even when the Boolean function is correct.

## In Practice

**A digital output that doesn't match the expected truth table for specific input combinations** — re-deriving the Boolean expression from the schematic identifies whether the error is in the logical function itself or in the physical implementation. If the re-derived expression matches the intended truth table, the fault is physical (wiring, stuck pin), not logical.

**Measured behavior that seems to contradict a schematic using mixed NAND, NOR, and OR gate symbols** — often a De Morgan misread rather than a circuit fault. A NAND gate with inverted inputs is electrically identical to an OR gate; missing one of these equivalences when reading the schematic produces a predicted output that differs from the actual (correct) output.

**An FPGA design consuming more LUTs or product terms than the function requires** — unsimplified Boolean expressions map to more logic resources. Fewer product terms after simplification means fewer lookup tables consumed and shorter propagation paths through the fabric.
