---
title: "Components & Patterns"
weight: 110
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Components & Patterns

A quick reference to components and patterns commonly encountered in RF circuit design, emphasizing frequency-dependent behavior, matching, and parasitics. Key parameters include S-parameters, noise figure, IP3, and VSWR.

## RF Passives

**Capacitor**
At RF, a capacitor is a resonant circuit — above its self-resonant frequency (SRF), it becomes inductive and stops acting like a capacitor. Key parameters are SRF, ESR at frequency, and Q factor (reactive energy stored vs. energy dissipated). Choose capacitors where SRF is well above the operating frequency. Smaller packages generally have higher SRF due to lower parasitic inductance. NPO/C0G types offer stable capacitance with voltage and temperature; X5R/X7R vary significantly and are unsuitable for tuned circuits. See [RF Capacitors & Inductors]({{< relref "rf-components" >}}) for detailed SRF behavior and component selection.

**Inductor**
Energy storage, impedance matching, and filtering. Key parameters are SRF, Q factor, and saturation current. Above SRF, the inductor becomes capacitive — its inter-winding capacitance dominates. High Q indicates low loss and is essential for narrow-band filters and oscillators. Saturation current limits maximum operating current — exceeding it collapses inductance. Air-wound coils have highest Q but largest size; multilayer chip inductors are compact but have lower Q. Core material determines frequency range and losses. See [RF Capacitors & Inductors]({{< relref "rf-components" >}}) for frequency-dependent behavior.

**Ferrite bead**
Lossy element that dissipates high-frequency energy as heat. Characterized by impedance at 100 MHz (and often additional frequencies). Used for EMI filtering, not where true inductance is needed — the impedance curve is resistive, not reactive, at RF frequencies. Different ferrite materials have different impedance curves — choose based on the frequency range to be suppressed. Place on supply lines to block RF from entering power planes. Beads in series with signal lines add loss at RF without affecting DC. Saturation at high DC current reduces effectiveness.

## Timing & References

**Crystal/resonator**
Precision frequency reference. Key parameters are frequency, ESR, and temperature stability (ppm/°C). Crystal oscillator phase noise affects receiver sensitivity (phase noise mixes with nearby signals) and measurement accuracy. AT-cut crystals offer good temperature stability around room temperature; SC-cut provides better stability over wider ranges but costs more. Load capacitance affects pulling range and must match oscillator design. Crystal aging slowly shifts frequency over years. See [Oscillators & Phase Noise]({{< relref "rf-components/oscillators-and-phase-noise" >}}) for phase noise considerations.

## RF Infrastructure

**Transformer/balun**
Impedance matching and balun function (balanced-to-unbalanced conversion). Key parameters are frequency range, insertion loss, return loss, and balance. RF transformers are specified very differently from audio or power transformers — frequency response is limited, often only 1-2 decades. Transmission-line transformers (using ferrite-loaded transmission lines) provide wider bandwidth than conventional wound transformers. Turns ratio sets impedance transformation; a 2:1 turns ratio provides 4:1 impedance ratio. Baluns enable matching between unbalanced (coax) and balanced (dipole, differential) circuits while maintaining common-mode rejection.

**Connector**
SMA, N-type, BNC, UFL — each has a frequency range, power handling, and VSWR specification. Connector choice matters at GHz frequencies where reflections from impedance discontinuities cause measurement errors and power loss. SMA works to 18+ GHz for precision work; BNC is limited to ~4 GHz. Torque specifications exist for precision connectors — over-tightening damages them, under-tightening causes poor contact. Poorly terminated connectors cause reflections that distort measurements and reduce power transfer. Cable assemblies have specified insertion loss that increases with frequency.

**PCB**
At RF, the PCB is a circuit element, not just an interconnect. Key parameters are dielectric constant (Er), loss tangent (tan δ), and controlled impedance. Trace geometry defines transmission line behavior — 50 Ω microstrip or stripline requires specific width-to-height ratios calculated from the stackup. FR-4 works to a few GHz; higher frequencies need lower-loss materials (Rogers, Isola). Via transitions add inductance and must be carefully designed for high-frequency signals. Ground plane integrity matters — slots and gaps in the ground cause radiation and impedance discontinuities. Skin effect concentrates current on trace surfaces at high frequencies.

## Power & Integrity

**Decoupling/bypass network**
Multiple capacitors in parallel covering different frequency ranges. ESL (equivalent series inductance) matters — the bypass capacitor's leads form an inductor that limits high-frequency effectiveness. At VHF and above, the PCB via and trace to the capacitor dominate the inductance. Use multiple small capacitors rather than one large one for broadband bypassing. Ferrite beads in supply lines block RF from propagating to other circuits. Ground via placement affects effectiveness — multiple vias reduce inductance. See [RF Capacitors & Inductors]({{< relref "rf-components" >}}) for bypass strategies.

**Snubber**
Suppresses voltage spikes in switching circuits. Key parameters are snubber capacitor value and power dissipation. Design is largely empirical — calculations give a starting point, final values come from observing ringing on a scope. RC snubbers are most common; RCD snubbers recover some energy. The snubber capacitor must handle the switching frequency without excessive heating. Ferrite beads combined with snubber capacitors form more effective suppression networks. Place snubbers close to the switching element to minimize loop inductance.

## Signal Blocks

**LC filter**
Second-order filter with steep rolloff. Key parameters are cutoff frequency, Q factor (determines selectivity), and insertion loss (power lost in the filter). Resonance can amplify rather than suppress signals near the cutoff if Q is too high — useful for band-pass but problematic for band-stop. Component Q directly affects filter performance — high-Q inductors and capacitors are essential for narrow-band filters. Multiple sections provide steeper rolloff. Design tools (like RF filter synthesis calculators) generate component values from specifications. Temperature stability depends on component tempcos.

**Common-emitter / common-source stage**
RF amplifier building block. Key parameters are gain (S21), noise figure (NF), and stability factor (K). Unconditionally stable amplifiers don't oscillate regardless of source/load impedance; conditionally stable amplifiers require careful matching to avoid oscillation. Input and output matching networks transform impedances for maximum gain or minimum noise figure — these goals often conflict, requiring design trade-offs. Bias point affects gain, noise, linearity, and stability. S-parameters characterize small-signal behavior and are measured (not calculated) for accurate modeling.

**Crystal oscillator circuit**
Crystal plus oscillator circuit for stable frequency generation. Key parameters are frequency accuracy, phase noise, startup time, and output waveform. Pierce and Colpitts topologies are common; each has different load capacitance requirements. Negative resistance must exceed crystal ESR for reliable startup — margin of 5× or more is recommended. Drive level affects accuracy and crystal aging — excessive drive damages crystals over time. Buffer stages isolate the oscillator from load variations that would pull the frequency. See [Oscillators & Phase Noise]({{< relref "rf-components/oscillators-and-phase-noise" >}}) for phase noise considerations.

## Protection

**ESD/TVS clamp**
Protects antenna inputs and RF ports. Key parameters are capacitance (which affects RF performance), clamping voltage, and surge current capability. Low-capacitance parts (sub-picofarad) are essential for high-frequency ports — even 1 pF significantly affects matching at GHz frequencies. Place at the connector before any other circuitry. Antenna surge protectors for outdoor installations must handle both ESD and lightning-induced surges. TVS diodes respond faster than varistors but handle less energy.

## Subsystems

**PLL**
Phase-locked loop for frequency synthesis. Key parameters are lock range, lock time, phase noise, and spurious output levels. Loop bandwidth trades reference tracking against output phase noise — wider bandwidth tracks input variations (good for clock recovery) but passes through reference spurs. Charge pump PLLs dominate modern frequency synthesis. Fractional-N PLLs provide fine frequency resolution but have increased spurious outputs near the carrier. VCO selection determines tuning range and phase noise floor. Loop filter design determines stability and transient response.

**Receiver front end**
Antenna to baseband: band-pass filter, LNA, mixer, IF filter. Key parameters are noise figure (sensitivity), selectivity (ability to reject adjacent channels), and dynamic range (handling strong and weak signals simultaneously). The LNA's noise figure dominates — Friis' formula shows subsequent stages contribute decreasingly to total noise figure when each stage has gain. But high LNA gain can overload the mixer with strong signals, so AGC or gain reduction improves dynamic range at the cost of sensitivity. Image rejection matters in superheterodyne receivers — the image filter or image-reject mixer suppresses signals at the image frequency. See [RF Amplifiers & Gain Blocks]({{< relref "rf-components/rf-amplifiers-and-gain-blocks" >}}).

**Transmitter output stage**
Baseband to antenna: upconversion, driver amp, power amp, output filter, matching network. Key parameters are output power, efficiency, linearity (important for non-constant-envelope modulations like QAM), and harmonic suppression. Impedance mismatch reflects power back into the PA, reducing efficiency and potentially damaging the output transistor — the antenna must present the expected load. Output filters suppress harmonics that would violate regulatory limits and interfere with other systems. PA bias class (A, AB, B, C, D, E, F) trades efficiency against linearity. Thermal management dominates PA design at power levels above a few watts.

## Modules

**Wireless module**
RF transceiver (often with integrated MCU) for Wi-Fi, Bluetooth, LoRa, or other protocols. Key parameters are protocol, frequency band, output power, receiver sensitivity, and antenna type. Antenna selection and placement have outsized effect on real-world range — keep antennas away from ground planes, metal enclosures, and user's body during operation. Pre-certified modules transfer regulatory compliance burden to the module vendor. Power consumption varies dramatically between idle, receive, and transmit states — LoRa's long range comes from high link budget, not from low power (transmit current can exceed 100 mA).

**GPS/GNSS module**
Satellite receiver with serial output. Key parameters are constellation support (GPS, GLONASS, Galileo, BeiDou — more constellations improve accuracy and acquisition), position accuracy, and time-to-first-fix. Needs clear sky view — the RF signal is extremely weak (-130 dBm typical), and buildings, trees, and even car roofs significantly attenuate it. Active antennas with built-in LNA improve sensitivity but require DC power through the RF line. Multipath (reflections from buildings) degrades accuracy in urban environments. Timing applications use the PPS (pulse-per-second) output for nanosecond-accurate time synchronization.

## System Patterns

**SDR system**
Software-defined radio where signal processing happens in software or FPGA rather than analog hardware. Key parameters are frequency range, instantaneous bandwidth, dynamic range, and processing latency. The SDR front end's noise figure and dynamic range set hard limits — no software processing recovers signals below the hardware noise floor or handles interferers beyond the ADC's range. Direct-sampling SDRs digitize RF directly; superheterodyne SDRs mix down to IF first. Sample rate determines instantaneous bandwidth; ADC resolution determines dynamic range. Software flexibility enables rapid protocol development but demands significant processing power for real-time operation.
