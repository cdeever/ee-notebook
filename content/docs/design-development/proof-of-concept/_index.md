---
title: "Proof of Concept"
weight: 15
bookCollapseSection: true
---

# Proof of Concept

Test the hard parts before committing to a design.

A proof of concept sits between defining what you want to build and deciding how to architect it. The goal is to answer the riskiest questions — will this sensor work at the required distance, does this topology meet the noise floor, can this link sustain the data rate — before investing weeks in schematic capture and PCB layout. The answers feed directly into architecture decisions.

Proof-of-concept work takes many forms: breadboarding a circuit, wiring up a dev board, running a SPICE simulation, or lashing modules together with jumper cables. What matters isn't polish — it's whether you get a clear answer to a specific question. A messy breadboard that proves a sensor has adequate sensitivity is more valuable than a beautiful schematic based on an untested assumption.

## What This Section Covers

- **[Breadboarding Strategies]({{< relref "breadboarding-strategies" >}})** — When breadboards are the right tool, how to get reliable results from them, and when their limitations make them misleading.
- **[Dead-Bug & Manhattan Construction]({{< relref "dead-bug-and-manhattan-construction" >}})** — Higher-fidelity prototyping techniques for circuits where breadboard parasitics lie.
- **[Dev Boards & Modules as POC Tools]({{< relref "dev-boards-and-modules" >}})** — Using evaluation boards, breakout boards, and modules to test components and subsystems before designing custom hardware.
- **[Simulation as Proof of Concept]({{< relref "simulation-as-proof-of-concept" >}})** — Using SPICE, signal chain analysis, and other simulation tools to answer design questions without building anything.
- **[Structuring Experiments to Get Answers]({{< relref "structuring-experiments" >}})** — Defining what you're testing, what success looks like, and how to capture results that inform the next phase.
- **[Knowing When the POC Is Done]({{< relref "knowing-when-the-poc-is-done" >}})** — Recognizing when you've answered the question and it's time to move on to architecture.
