---
title: "RF Components & Building Blocks"
weight: 60
bookCollapseSection: true
---

# RF Components & Building Blocks

The real behavior behind ideal symbols.

Every passive and active component behaves differently at RF than its schematic symbol suggests. Capacitors become inductors, inductors become capacitors, resistors develop reactive impedance, and amplifiers oscillate. Understanding the real high-frequency behavior of components is essential for building circuits that work above a few MHz.

This section covers the building blocks of RF systems — from passive components with frequency-dependent behavior to active devices like amplifiers, mixers, and oscillators. The emphasis is on what datasheets reveal (and hide) about RF performance.

## What This Section Covers

- **[RF Capacitors & Inductors]({{< relref "rf-capacitors-and-inductors" >}})** — How passive components behave when frequency pushes them past their self-resonant limits.
- **[RF Amplifiers & Gain Blocks]({{< relref "rf-amplifiers-and-gain-blocks" >}})** — Gain, noise figure, compression, and why RF amplifiers are specified differently than audio amplifiers.
- **[Mixers & Frequency Translation]({{< relref "mixers-and-frequency-translation" >}})** — Signal multiplication, sum and difference frequencies, and the building block of every receiver.
- **[RF Filters]({{< relref "filters" >}})** — LC, crystal, SAW, ceramic, and BAW filters compared by Q, frequency range, and practical application.
- **[Oscillators & Phase Noise]({{< relref "oscillators-and-phase-noise" >}})** — Signal generation, spectral purity, and why phase noise limits receiver performance.
- **[Switches, Attenuators & Couplers]({{< relref "switches-attenuators-and-couplers" >}})** — Routing, level control, and signal sampling in RF signal chains.
- **[Reading RF Datasheets]({{< relref "reading-rf-datasheets" >}})** — S-parameters, noise figure, compression points, and the specs that matter for RF component selection.
