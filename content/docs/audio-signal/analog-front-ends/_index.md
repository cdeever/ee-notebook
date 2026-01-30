---
title: "Analog Front Ends"
weight: 20
bookCollapseSection: true
---

# Analog Front Ends

Everything that happens to a signal before it reaches the converter. The analog front end captures a real-world signal — from a microphone, sensor, antenna, or test point — and conditions it for digitization. This means amplification, filtering, level shifting, and protection. Get this stage wrong and no amount of digital processing can recover what was lost or corrupted.

Front-end design is where [Analog Electronics]({{< relref "/docs/analog" >}}) meets signal processing directly. Op-amp topologies, filter theory, and impedance matching all converge here, applied to the specific demands of signal acquisition.

## What This Section Covers

- **[Microphone & Sensor Preamps]({{< relref "microphone-and-sensor-preamps" >}})** — Gain staging for SNR, impedance considerations, and preamp topologies for different source types.
- **[Analog Filtering]({{< relref "analog-filtering" >}})** — Anti-aliasing requirements, filter placement and order, and oversampling as a strategy.
- **[Level Shifting & Conditioning]({{< relref "level-shifting-and-conditioning" >}})** — DC biasing for single-supply ADCs, scaling and attenuation, and input protection.
