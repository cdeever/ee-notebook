---
title: "Blocks"
weight: 20
---

# Blocks

Blocks are the smallest functional circuit units — a handful of primitives wired together to accomplish one identifiable job. A voltage divider. An RC filter. An amplifier stage. A pull-up network. At this level, reasoning shifts from individual component parameters to transfer functions, gain, impedance, bandwidth, and bias conditions. Blocks are where design intent first becomes visible: someone put these parts together to do something specific.

Most blocks at this level are cross-cutting. A voltage divider works the same way whether it's setting a feedback reference in a power supply or biasing an ADC input. The parameters that matter shift by domain — impedance matching matters more in RF, noise floor matters more in audio — but the underlying circuit topology is the same. Recognizing blocks on an unfamiliar schematic is one of the first steps toward understanding it.

## Voltage and Current Shaping

**Voltage divider.** Two resistors (or impedances) in series that produce a fraction of the input voltage at their junction. Key parameters are the division ratio, output impedance, and power dissipation. Appears in every domain. Composes from resistors; appears inside feedback networks, bias circuits, and level-sensing inputs. The classic mistake is loading the divider output with an impedance comparable to the divider's own — the ratio shifts, and the "calculated" voltage is wrong.

**Current source/sink.** A circuit that maintains a constant current regardless of voltage across the load, typically built from a transistor and a few resistors (or a degenerated MOSFET, or an op-amp with a sense resistor). Key parameters are output current, compliance voltage range, and output impedance. Appears in analog, LED driving, and sensor excitation. Composes from transistors and resistors; appears inside bias networks, active loads, and measurement circuits.

**Current mirror.** A pair of matched transistors (BJT or MOSFET) where one sets the reference current and the other replicates it. Key parameters are mirror ratio, output impedance, and matching accuracy. Appears primarily in analog IC design and discrete precision circuits. Composes from matched transistor pairs; appears inside op-amp input stages, DACs, and bias distribution networks. Matching and temperature tracking between the two transistors determine accuracy — discrete mirrors rarely match as well as integrated ones.

**Level shifter.** A circuit that translates a signal from one voltage domain to another (e.g., 3.3 V logic to 5 V logic, or vice versa). Common implementations include resistor dividers (high-to-low only), MOSFET-based bidirectional shifters, and dedicated ICs. Key parameters are direction (unidirectional or bidirectional), speed, and voltage domains. Appears in digital and mixed-signal systems wherever multiple supply voltages coexist. Composes from MOSFETs or resistors; appears inside interface circuits between subsystems at different voltage levels.

## Filtering

**RC low-pass filter.** A resistor and capacitor forming a first-order low-pass filter with a -3 dB cutoff at 1/(2πRC). Key parameters are cutoff frequency, attenuation slope (20 dB/decade), and output impedance. Appears in every domain — signal conditioning, power filtering, anti-alias pre-filtering, deglitching. Composes from one resistor and one capacitor; appears inside anti-alias filters, DAC output smoothing, and noise reduction networks. Simple and ubiquitous, but the 20 dB/decade slope is often insufficient for serious filtering.

**RC high-pass filter.** A capacitor and resistor forming a first-order high-pass filter — the AC coupling configuration. Key parameters are cutoff frequency, low-frequency rolloff, and the impact on signal baseline. Appears in audio, instrumentation, and anywhere DC offset removal is needed. Composes from one capacitor and one resistor; appears inside AC-coupled amplifier inputs and DC-blocking networks. The settling time after a transient is proportional to RC — a low cutoff frequency means slow settling.

**LC filter.** An inductor and capacitor forming a second-order filter with steeper rolloff (40 dB/decade) and the possibility of resonance. Key parameters are cutoff frequency, Q factor, insertion loss, and resonant frequency. Appears in power (output filtering), RF (matching and selectivity), and EMI suppression. Composes from inductors and capacitors; appears inside switching converter output stages and RF front ends. The Q factor determines whether the filter rings — underdamped LC filters can amplify noise near resonance rather than suppress it.

**Active filter (Sallen-Key / MFB).** An op-amp-based second-order (or higher) filter that avoids inductors and provides gain. Sallen-Key is unity-gain and simpler; MFB (multiple feedback) provides inverting gain and better high-frequency rejection. Key parameters are cutoff frequency, Q, gain, filter type (Butterworth, Bessel, Chebyshev), and op-amp bandwidth requirements. Appears in audio, instrumentation, and sensor conditioning. Composes from an op-amp, resistors, and capacitors; appears inside ADC front ends and audio signal chains.

**Decoupling/bypass network.** One or more capacitors placed close to an IC's power pins to provide local charge storage and suppress high-frequency noise on the supply. Key parameters are capacitor values, ESR, ESL, placement distance, and the frequency range covered. Appears in every domain with active ICs. Composes from capacitors (often multiple values in parallel); appears inside every subsystem with digital or high-speed analog ICs. The most common layout mistake is routing the decoupling cap's ground through a long trace instead of connecting it directly to the IC's ground pin.

## Amplification

**Inverting amplifier.** An op-amp configuration with the input applied to the inverting terminal through a resistor, feedback from output to inverting input, and gain set by the ratio of feedback to input resistor (-Rf/Rin). Key parameters are gain, bandwidth, input impedance (set by Rin, which can be inconveniently low for high gain), and noise. Appears in analog and audio domains. Composes from an op-amp and resistors; appears inside signal conditioning chains and active filters.

**Non-inverting amplifier.** An op-amp configuration with the input applied to the non-inverting terminal and feedback from output to inverting input through a resistor divider. Gain is 1 + Rf/Rg. Key parameters are gain, bandwidth, input impedance (very high, set by the op-amp), and noise. Appears in analog, audio, and instrumentation domains. Composes from an op-amp and resistors; appears inside buffer stages and sensor interfaces. The high input impedance makes it the default choice for buffering high-impedance sources.

**Differential amplifier / instrumentation amplifier.** A differential amplifier rejects common-mode signals and amplifies only the difference between two inputs. A discrete diff amp uses one op-amp and four resistors; an instrumentation amp adds input buffer stages for high input impedance and precise gain setting from a single resistor. Key parameters are CMRR, gain accuracy, input impedance, and noise. Appears in measurement, sensor, and industrial domains. Composes from op-amps and precision resistors; appears inside bridge sensor interfaces, current-sense circuits, and data acquisition front ends.

**Common-emitter / common-source stage.** A single-transistor amplifier stage (BJT or MOSFET) with the input at the base/gate, output at the collector/drain, and the emitter/source at AC ground (or degenerated with a resistor). Key parameters are voltage gain, input impedance, output impedance, bandwidth, and bias point stability. Appears in analog, audio, and RF domains. Composes from a transistor, bias resistors, and coupling/bypass capacitors; appears inside multi-stage amplifiers and RF front ends. Biasing is the hard part — the gain depends on the operating point, which drifts with temperature.

**Emitter follower / source follower.** A transistor stage with the output at the emitter/source, providing near-unity voltage gain but significant current gain (impedance transformation). Key parameters are output impedance, voltage offset (one VBE or VGS drop), linearity, and bandwidth. Appears in analog and buffer applications. Composes from a transistor and a bias resistor; appears inside output stages, cable drivers, and impedance-matching networks. The voltage offset is predictable but not zero — it shifts with temperature and current.

## Switching and Drive

**Gate driver.** A circuit that translates a logic-level control signal into the high-current, precisely-timed drive needed to switch a power MOSFET or IGBT. Key parameters are peak source/sink current, propagation delay, rise/fall time, and voltage rating. Appears in power conversion and motor drive domains. Composes from driver ICs (or discrete transistor push-pull stages), bootstrap capacitors, and sometimes isolation barriers; appears inside H-bridges, half-bridges, and switching converter power stages. Dead-time control is the critical detail — shoot-through from overlapping on-times can destroy a bridge in microseconds.

**H-bridge (as a block).** Four switches (MOSFETs or transistors) arranged to drive a load in both directions, typically controlled by a gate driver and logic. Key parameters are voltage rating, current capacity, RDS(on) losses, and switching frequency capability. Appears in motor drive and power conversion domains. Composes from four MOSFETs, gate drivers, and current-sense elements; appears inside motor driver subsystems and full-bridge converters. The "as a block" qualifier matters — when integrated into an IC with protection and control logic, it becomes a subsystem.

**Pull-up / pull-down network.** A resistor (or active device) that holds a signal line at a defined logic level when nothing else is driving it. Key parameters are resistance value (trade-off between static power and transition speed), voltage level, and bus capacitance. Appears in digital and communication domains. Composes from resistors; appears inside I2C buses, SPI chip-select lines, reset circuits, and any open-drain/open-collector output network. Too strong wastes power and can overdrive; too weak causes slow transitions and noise susceptibility.

**Snubber.** An RC or RCD network placed across a switch or diode to suppress voltage spikes caused by parasitic inductance during switching transitions. Key parameters are snubber capacitor value, resistor value, voltage rating, and power dissipation in the resistor. Appears in power conversion and relay driving domains. Composes from resistors, capacitors, and sometimes diodes; appears across switching elements in converters, relay contacts, and inductive loads. Designing a snubber is largely empirical — calculations give a starting point, but the final values come from observing the actual ringing on a scope.

## Timing

**RC oscillator.** A relaxation oscillator built from a resistor-capacitor timing network and a switching element (comparator, Schmitt trigger, or 555 timer). Key parameters are frequency, frequency stability (generally poor), duty cycle, and output waveform shape. Appears in simple timing, LED blinking, and low-cost clock generation. Composes from resistors, capacitors, and a switching element; appears inside non-critical timing circuits and cheap clock sources. Frequency stability is poor compared to crystal-based oscillators — RC tolerances and temperature drift make precision timing impractical.

**Crystal oscillator circuit.** A crystal combined with an amplifier (inverter gate, Pierce topology, or Colpitts) and load capacitors to form a stable frequency source. Key parameters are frequency, frequency accuracy (ppm), startup time, and phase noise. Appears in digital, communication, and RF domains. Composes from a crystal, an amplifier, and load capacitors; appears inside clock generation subsystems and PLL reference inputs. The load capacitors must match the crystal's specified load capacitance — wrong values cause frequency error or failure to start.

**Monostable (one-shot).** A circuit that produces a single output pulse of defined duration in response to a trigger edge. Classic implementation uses a 555 timer or a retriggerable monostable IC. Key parameters are pulse width, trigger sensitivity, and retriggerable vs. non-retriggerable behavior. Appears in digital interfacing, debounce, and timing generation. Composes from timing components and a switching element; appears inside debounce circuits, pulse stretchers, and timeout generators.

## Protection

**ESD/TVS clamp.** A transient voltage suppressor (TVS diode or dedicated ESD protection device) that clamps voltage spikes to a safe level by absorbing transient energy. Key parameters are standoff voltage, clamping voltage, peak pulse current, and capacitance (which matters for high-speed data lines). Appears in every domain at interfaces exposed to the outside world. Composes from TVS diodes or dedicated ESD structures; appears at connectors, user-accessible ports, and antenna inputs. The clamping voltage under actual pulse conditions is always higher than the standoff voltage — checking the V-I curve, not just the headline spec, matters.

**Reverse polarity protection.** A circuit that prevents damage when the power supply is connected backwards, typically implemented as a series diode (simple but lossy), a P-channel MOSFET (low loss), or a fuse-based approach. Key parameters are voltage drop, current rating, and response time. Appears in any battery-powered or field-connected application. Composes from a diode or MOSFET; appears at the power input of devices and subsystems. The series-diode approach drops 0.3–0.7 V continuously, which matters in low-voltage battery systems — the MOSFET approach drops millivolts but adds complexity.

**Voltage clamp.** A circuit (typically diodes to supply rails, or a Zener) that limits a signal's voltage excursion to a safe range. Key parameters are clamp voltage, clamping impedance, and the current the clamp must sink during overvoltage. Appears in analog input protection, op-amp input limiting, and ADC front ends. Composes from diodes or Zeners; appears at the inputs of sensitive circuits like op-amps and ADCs. The clamping current flows through the source impedance — if the source can deliver unlimited current, the clamp needs to handle it or a series resistor is required upstream.

## Digital

**Logic gate (AND / OR / NOT / XOR).** The elementary combinational logic function, implemented in a specific logic family (74HC, 74LVC, CMOS, etc.). Key parameters are propagation delay, input/output voltage thresholds, fanout, and supply voltage range. Appears in digital design, glue logic, and signal conditioning. Composes from transistors internally; appears inside decoders, multiplexers, and custom logic networks. Discrete logic gates are increasingly rare in new designs — most logic lives inside FPGAs or microcontrollers — but they remain essential for level translation, signal gating, and small glue-logic tasks on mixed-signal boards.

## Tips

- When analyzing an unfamiliar schematic, circling the blocks first — before tracing individual signals — reveals the designer's intent and makes the signal flow legible.
- Block-level parameters (gain, cutoff frequency, impedance) are the right abstraction for most design calculations. Drop to primitive-level reasoning only when a block isn't meeting its spec.
- The interaction between blocks matters as much as the blocks themselves. An amplifier stage that works perfectly in isolation may oscillate when connected to a capacitive load, or lose bandwidth when driven from a high-impedance source.
- Simulation is most useful at the block level — it's detailed enough to capture real behavior but small enough to run quickly and interpret easily.

## Caveats

- The same topology can serve different functions depending on component values and context. An RC network is a filter, a delay element, or a snubber depending on where it sits and what problem it solves.
- Block boundaries are defined by function, not by physical grouping on the board. Two resistors on opposite sides of the PCB can form a single block if they work together functionally.
- Many IC datasheets describe "application circuits" that are really blocks. The 555 timer's monostable circuit, an LM317's adjustable regulator circuit, or an NE5532's inverting amplifier circuit are all blocks composed from a primitive IC plus external components.
