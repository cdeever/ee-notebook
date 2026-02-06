---
title: "Audio & Analog Circuits"
weight: 85
bookCollapseSection: true
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Audio & Analog Circuits

Audio-specific and analog measurement: THD, SNR, frequency response, gain structure, sensor interfaces. Where the signal is the product, not just a means of communication.

- **[What's the THD / noise floor?]({{< relref "thd-noise-floor" >}})** — Distortion and noise measurements. Audio analyzers, FFT-based THD, and understanding what the numbers mean in practice.
- **[Is the frequency response flat where it should be?]({{< relref "frequency-response" >}})** — Swept or stepped frequency response measurements. Filters, EQ stages, speaker crossovers, and amplifier bandwidth.
- **[Is the gain structure correct through the signal chain?]({{< relref "gain-structure" >}})** — Level at each stage. Headroom, clipping points, and making sure no stage is running too hot or too cold.
- **[Is this sensor outputting the expected voltage/current?]({{< relref "sensor-output" >}})** — Analog sensor interfaces: thermocouples, strain gauges, photodiodes, microphones. Verifying the transducer output before blaming the signal conditioning.
