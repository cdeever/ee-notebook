---
title: "📖 Glossary"
weight: 100
---

# Glossary

A working reference of terms, abbreviations, and phrases used throughout this notebook. Organized alphabetically.

---

## Symbols & Numbers

<a id="0-ohm-resistor"></a>
**0 Ω resistor** — SMD jumper wire in resistor form. Used for routing convenience on PCBs, selectable configurations, and bridging traces. Resistance is extremely low but not zero.

<a id="3db-point"></a>
**3 dB point** — The frequency at which a filter's output drops to 70.7% of its passband value, corresponding to half power. Defines the boundary between passband and stopband.

<a id="10x-probe"></a>
**10× probe** — Oscilloscope probe with 10:1 attenuation. Presents roughly 10 MΩ ∥ 10 pF at the tip, significantly reducing probe loading compared to a 1× probe. The standard choice for most measurements.

---

## A

<a id="ac-coupling"></a>
**AC coupling** — Signal path that blocks DC and passes only the time-varying component. Implemented with a series capacitor. The low-frequency cutoff depends on the capacitor value and load impedance. See [Measurement Basics]({{< relref "/docs/fundamentals/units-notation-measurement/measurement-basics" >}}).

<a id="accuracy"></a>
**Accuracy** — How close a measurement reading is to the true value. Distinct from precision, which describes repeatability. A meter can be precise (consistent readings) but inaccurate (consistently wrong).

<a id="active-filter"></a>
**Active filter** — A filter using op-amps or other active devices to shape frequency response without inductors. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="active-probe"></a>
**Active probe** — Oscilloscope probe with a built-in amplifier at the tip, presenting very low capacitance (~1 pF) and high impedance. Necessary for measuring fast signals where passive probe loading would distort the waveform.

<a id="agc"></a>
**AGC (Automatic Gain Control)** — A feedback loop that adjusts gain to maintain constant output amplitude despite varying input levels. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).

<a id="aging"></a>
**Aging** — Logarithmic capacitance loss over time in Class II and III ceramic capacitors. Most of the change occurs shortly after manufacturing; the rate slows but never stops.

<a id="ampere"></a>
**Ampere (A)** — SI unit of electric current. One ampere equals one coulomb of charge per second.

<a id="and-gate"></a>
**AND gate** — A logic gate that outputs 1 only when all inputs are 1.

<a id="angular-frequency"></a>
**Angular frequency (ω)** — Frequency expressed in radians per second: ω = 2πf. Appears in impedance formulas and transfer functions.

<a id="anti-aliasing-filter"></a>
**Anti-aliasing filter** — A low-pass filter placed before an ADC to prevent frequencies above half the sample rate from folding back as false signals. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="apparent-power"></a>
**Apparent power (S)** — The product of RMS voltage and RMS current, measured in volt-amperes (VA). Equals real power only when power factor is unity.

<a id="asynchronous-fifo"></a>
**Asynchronous FIFO** — A FIFO buffer with independent read and write clocks for transferring data between clock domains.

<a id="auto-ranging"></a>
**Auto-ranging** — Instrument feature that automatically selects the measurement range. Convenient but can be slow when the signal crosses range boundaries.

<a id="avalanche-breakdown"></a>
**Avalanche breakdown** — Non-destructive reverse breakdown in a diode where carrier multiplication occurs at high electric field. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

---

## B

<a id="band-pass-filter"></a>
**Band-pass filter** — A filter that passes a range of frequencies between low and high cutoff points and attenuates outside that range. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="band-stop-filter"></a>
**Band-stop filter** — A filter that attenuates a specific range of frequencies while passing those above and below. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="bandgap-reference"></a>
**Bandgap reference** — A reference circuit exploiting complementary temperature coefficients to produce a temperature-stable output near 1.25 V. See [Reference Voltages]({{< relref "/docs/analog/power-and-regulation/reference-voltages" >}}).

<a id="bandwidth-shrinkage"></a>
**Bandwidth shrinkage** — The reduction in overall bandwidth when identical amplifier stages are cascaded. See [Multistage Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/multistage-amplifiers" >}}).

<a id="baud-rate"></a>
**Baud rate** — The data rate of a serial interface, specified in bits per second.

<a id="barkhausen-criterion"></a>
**Barkhausen criterion** — The condition for sustained oscillation: loop gain magnitude ≥ 1 and total phase shift = 360°. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}).

<a id="bessel-response"></a>
**Bessel response** — Filter response with the best phase linearity and minimal step-response overshoot. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="beta"></a>
**Beta (β)** — The DC current gain of a BJT, defined as I_C / I_B. Varies widely between devices even of the same type. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="bga"></a>
**BGA (Ball Grid Array)** — IC package with solder balls on the bottom surface instead of pins on the perimeter. High pin density but impossible to hand-solder and susceptible to thermal cycling fatigue.

<a id="bitstream"></a>
**Bitstream** — The binary configuration file that programs an FPGA's logic and routing.

<a id="bjt"></a>
**BJT (Bipolar Junction Transistor)** — A current-controlled semiconductor device with three terminals (base, collector, emitter) where small base current controls large collector current. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="block-ram"></a>
**Block RAM (BRAM)** — Dedicated dual-port SRAM blocks in FPGAs, typically 18-36 kbit each.

<a id="bode-plot"></a>
**Bode plot** — A standard two-panel graph showing magnitude (dB) and phase (degrees) versus frequency on a logarithmic scale. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).

<a id="body-diode"></a>
**Body diode** — The parasitic diode between source and drain in a MOSFET, conducting when drain voltage goes below source. See [MOSFETs]({{< relref "/docs/analog/active-devices/mosfets" >}}).

<a id="boost-converter"></a>
**Boost converter** — Switching power supply topology that produces an output voltage higher than its input. Uses an inductor, switch, diode, and output capacitor.

<a id="branch"></a>
**Branch** — A path between two nodes in a circuit, carrying a single current.

<a id="bridge-rectifier"></a>
**Bridge rectifier** — A four-diode configuration that converts AC to DC by conducting both polarities through two diodes each. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="buck-boost-converter"></a>
**Buck-boost converter** — Switching topology that can produce an output voltage either higher or lower than the input, with inverted polarity in the basic form.

<a id="buck-converter"></a>
**Buck converter** — Switching power supply topology that produces an output voltage lower than its input. The most common switching regulator topology.

<a id="burden-voltage"></a>
**Burden voltage** — Voltage drop across an ammeter's internal shunt resistor. Inserted into the circuit being measured, which means the measurement itself affects the circuit. Lower burden voltage means less measurement error.

<a id="butterworth-response"></a>
**Butterworth response** — Filter response with maximally flat passband and monotonic roll-off, the most common general-purpose choice. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="bypass-capacitor"></a>
**Bypass capacitor** — Capacitor placed near an IC's power pins to supply instantaneous current demands and shunt high-frequency noise to ground. Functionally identical to a decoupling capacitor.

---

## C

<a id="c0g"></a>
**C0G / NP0** — Class I ceramic dielectric. The most stable ceramic capacitor type: negligible voltage coefficient, minimal temperature drift, no aging. Limited to small capacitance values. Use wherever stability matters.

<a id="carbon-composition"></a>
**Carbon composition resistor** — Vintage resistor type made from a solid slug of carbon and binder. Loose tolerance, high noise, poor stability — but handles surges well. Rarely used in new designs.

<a id="carry-lookahead"></a>
**Carry lookahead** — A fast adder technique that computes all carries in parallel instead of rippling through stages.

<a id="cascode"></a>
**Cascode** — A two-transistor configuration combining common-emitter with common-base to improve bandwidth and output impedance. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="characteristic-impedance"></a>
**Characteristic impedance (Z0)** — The impedance of a transmission line determined by its geometry and dielectric, typically 50 Ω or 100 Ω differential.

<a id="charge-injection"></a>
**Charge injection** — Transient voltage disturbance caused by capacitive coupling from the gate when a MOSFET switch toggles. See [MOSFETs]({{< relref "/docs/analog/active-devices/mosfets" >}}).

<a id="charge-pump"></a>
**Charge pump** — A voltage converter using switched capacitors instead of inductors for energy transfer, simpler but lower power than inductor-based converters. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="chassis-ground"></a>
**Chassis ground** — Electrical connection to the equipment's metal chassis or frame. May or may not be connected to earth ground. Distinct from signal ground.

<a id="chebyshev-response"></a>
**Chebyshev response** — Filter response with steeper roll-off than Butterworth at the cost of passband ripple. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="clamp"></a>
**Clamp** — Protection component (typically a diode or TVS) that limits voltage excursions by conducting when a threshold is exceeded. Prevents overvoltage damage.

<a id="clamping"></a>
**Clamping** — Using a diode and capacitor to shift the DC level of an AC signal without changing its shape. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="clipping"></a>
**Clipping** — Using diodes or other components to limit signal excursion by conducting when a threshold is exceeded. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="clock-domain-crossing"></a>
**Clock domain crossing (CDC)** — A signal passing between circuits driven by different clocks.

<a id="clock-skew"></a>
**Clock skew** — The difference in clock arrival time between two points in a system.

<a id="clock-tree"></a>
**Clock tree** — A balanced distribution network of buffers ensuring equal clock delay to all flip-flops.

<a id="clock-to-q-delay"></a>
**Clock-to-Q delay** — The propagation delay from a clock edge to when the flip-flop output changes.

<a id="closed-loop-gain"></a>
**Closed-loop gain** — The gain of a circuit with feedback applied, approximately 1/β when loop gain is large. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).

<a id="cmos"></a>
**CMOS (Complementary Metal-Oxide-Semiconductor)** — A logic family built from complementary NMOS and PMOS transistor pairs, now dominant in digital design.

<a id="common-base"></a>
**Common base** — A BJT amplifier with input at the emitter and output at the collector, providing current gain and high bandwidth. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="common-emitter"></a>
**Common emitter** — A BJT amplifier configuration with input at the base and output at the collector, providing voltage gain with phase inversion. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="common-gate"></a>
**Common gate** — A MOSFET amplifier with input at the source and output at the drain, analogous to common base. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="common-mode-rejection"></a>
**Common-mode rejection** — An instrument's or amplifier's ability to ignore voltage that appears equally on both inputs. Measured as CMRR in decibels.

<a id="common-source"></a>
**Common source** — A MOSFET amplifier configuration with input at the gate and output at the drain, analogous to common emitter. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="comparator"></a>
**Comparator** — A circuit that compares two voltages and outputs a binary high or low result. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="composite-core"></a>
**Composite core** — Inductor core made from magnetic particles suspended in resin. Exhibits soft saturation — inductance decreases gradually with current rather than collapsing suddenly.

<a id="controlled-impedance"></a>
**Controlled impedance** — PCB traces designed with specific width and spacing relative to the ground plane to achieve a target characteristic impedance. See [Layout & Parasitics]({{< relref "/docs/analog/noise-stability-reality/layout-and-parasitics" >}}).

<a id="conventional-current"></a>
**Conventional current** — The standard engineering convention: current flows from positive to negative. Opposite to actual electron flow but universally used in circuit analysis and schematics.

<a id="copper-pour"></a>
**Copper pour** — Large area of copper on a PCB layer, typically connected to ground or power. Serves as a heatsink, improves return current paths, and reduces EMI.

<a id="corner-frequency-noise"></a>
**Corner frequency (noise)** — The frequency below which flicker noise exceeds white noise in a device's noise spectrum. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="coulomb"></a>
**Coulomb (C)** — SI unit of electric charge. One coulomb equals one ampere flowing for one second.

<a id="counter"></a>
**Counter** — A register that increments or decrements its value on each clock cycle.

<a id="coupling-capacitor"></a>
**Coupling capacitor** — Capacitor in series with a signal path that passes AC while blocking DC. Sets the low-frequency cutoff of the coupled path.

<a id="cpld"></a>
**CPLD (Complex Programmable Logic Device)** — Multiple PLD blocks on a single chip connected by a programmable routing matrix.

<a id="critical-path"></a>
**Critical path** — The longest propagation delay path between any two flip-flops, limiting maximum clock frequency.

<a id="crossover-distortion"></a>
**Crossover distortion** — Distortion in push-pull output stages caused by both transistors being off near the zero-crossing of the signal. See [Operating Regions]({{< relref "/docs/analog/biasing-operating-points/operating-regions" >}}).

<a id="crosstalk"></a>
**Crosstalk** — Unintended signal coupling between adjacent conductors through parasitic capacitance or mutual inductance. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="crystal-oscillator"></a>
**Crystal oscillator** — A quartz crystal vibrating at a precise mechanical frequency, used as a clock source.

<a id="curie-temperature"></a>
**Curie temperature** — Temperature above which a ferroelectric ceramic's dielectric properties degrade sharply. Relevant to Class II/III ceramic capacitors.

<a id="cut-trace"></a>
**Cut trace** — A PCB trace intentionally severed, usually as a rework modification. Should be documented on the schematic and in revision notes.

<a id="cutoff-frequency"></a>
**Cutoff frequency (f_c)** — The frequency at which a filter's response is 3 dB below the passband level. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

---

## D

<a id="d-flip-flop"></a>
**D flip-flop** — An edge-triggered memory element that captures the D input on a clock edge and holds it until the next edge.

<a id="d-latch"></a>
**D latch** — A latch controlled by a data input and enable signal, transparent when enable is active.

<a id="dc-bias-effect"></a>
**DC bias effect** — Loss of capacitance in ceramic capacitors when DC voltage is applied. Class II ceramics (X5R, X7R) can lose 50% or more of their rated capacitance at rated voltage. Widely underappreciated.

<a id="dc-biasing"></a>
**DC biasing** — The process of setting the DC operating point of an active device to ensure it operates in the correct region for signal amplification. See [DC Biasing]({{< relref "/docs/analog/biasing-operating-points/dc-biasing" >}}).

<a id="dc-coupling"></a>
**DC coupling** — Signal path that passes all frequencies including DC. The default coupling mode on oscilloscopes.

<a id="dc-restoration"></a>
**DC restoration** — Another term for clamping, used especially in video circuits. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="dcr"></a>
**DCR (DC Resistance)** — The resistance of an inductor's winding measured at DC. Determines I²R power loss and heat generation.

<a id="dbm"></a>
**dBm** — Power measured in decibels referenced to 1 milliwatt. 0 dBm = 1 mW. Used extensively in RF and communication systems.

<a id="dbu"></a>
**dBu** — Voltage in decibels referenced to 0.775 V (the voltage that produces 1 mW into 600 Ω). Standard in professional audio.

<a id="dbv"></a>
**dBV** — Voltage in decibels referenced to 1 volt.

<a id="dead-time"></a>
**Dead time** — The interval between turning off one MOSFET and turning on the complementary MOSFET in a bridge circuit to prevent shoot-through. See [MOSFETs]({{< relref "/docs/analog/active-devices/mosfets" >}}).

<a id="decoder"></a>
**Decoder** — A combinational circuit that activates one of 2^n outputs based on an n-bit input code.

<a id="decoupling"></a>
**Decoupling** — Placing capacitors near IC power pins to supply instantaneous switching current and prevent noise from propagating through the power distribution network.

<a id="delta-wye"></a>
**Delta-wye (Δ-Y) transformation** — Mathematical technique for converting between triangle (delta) and star (wye) resistor network topologies. Necessary for analyzing circuits that aren't purely series or parallel.

<a id="de-morgans-theorem"></a>
**De Morgan's Theorem** — The complement of AND is OR with complemented inputs, and vice versa.

<a id="dependent-source"></a>
**Dependent source** — A voltage or current source whose value is controlled by another voltage or current elsewhere in the circuit. Models transistors and op-amps in circuit analysis.

<a id="depletion-mode-mosfet"></a>
**Depletion-mode MOSFET** — A MOSFET that is normally on, conducting with zero gate voltage. See [MOSFETs]({{< relref "/docs/analog/active-devices/mosfets" >}}).

<a id="derating"></a>
**Derating** — Reducing a component's maximum allowable power, voltage, or current as operating conditions (typically temperature) move away from the rated conditions. Essential for reliable designs.

<a id="dielectric"></a>
**Dielectric** — Insulating material between capacitor plates that determines capacitance, voltage rating, stability, and loss characteristics.

<a id="differential-pair"></a>
**Differential pair** — Two matched transistors with tied emitters or sources driven by a common current source, the fundamental building block of analog ICs. See [Multistage Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/multistage-amplifiers" >}}).

<a id="dmm"></a>
**DMM (Digital Multimeter)** — The fundamental bench instrument for measuring voltage, current, and resistance. Quality varies enormously — input impedance, accuracy, and safety ratings all matter.

<a id="dominant-pole-compensation"></a>
**Dominant pole compensation** — Adding a low-frequency pole (usually a capacitor) to ensure gain drops below unity before phase accumulates to 360°. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}).

<a id="dot-convention"></a>
**Dot convention** — Dots placed on transformer winding symbols to indicate which terminals have the same instantaneous polarity. Essential for understanding phase relationships.

<a id="drive-strength"></a>
**Drive strength** — The amount of current a logic output can source or sink.

<a id="dropout-voltage"></a>
**Dropout voltage** — The minimum difference between input and output voltage required for a regulator to maintain regulation. See [Linear Regulators]({{< relref "/docs/analog/power-and-regulation/linear-regulators" >}}).

<a id="dsp-block"></a>
**DSP block** — Dedicated multiply-accumulate hardware units in FPGAs for signal processing operations.

<a id="duty-cycle"></a>
**Duty cycle** — The fraction of time the main switch is on in a switching regulator, determining the input-to-output voltage ratio. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="dynamic-resistance"></a>
**Dynamic resistance** — The slope of the I-V curve at a specific operating point (dV/dI). Describes the small-signal behavior of nonlinear devices like diodes and LEDs.

---

## E

<a id="early-effect"></a>
**Early effect** — The slight increase in collector current with higher V_CE caused by base-width modulation. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="early-voltage"></a>
**Early voltage** — A transistor parameter (V_A) that represents the extrapolated voltage at which collector current would become zero. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="earth-ground"></a>
**Earth ground** — Physical connection to the earth, typically through the building's grounding system. Provides a safety reference and a path for fault current.

<a id="eddy-current-loss"></a>
**Eddy current loss** — Power dissipated by circulating currents induced in a conductive core by the changing magnetic field. Increases with frequency. Reduced by using laminated or ferrite core materials.

<a id="electrolytic-capacitor"></a>
**Electrolytic capacitor** — Polarized capacitor using a liquid or polymer electrolyte to achieve high capacitance density. Limited lifetime — the electrolyte dries out over time, especially at elevated temperature.

<a id="electron-flow"></a>
**Electron flow** — The physical movement of electrons from negative to positive. Opposite to conventional current direction. Used in some educational contexts but not in standard engineering practice.

<a id="emitter-degeneration"></a>
**Emitter degeneration** — An unbypassed emitter resistor that provides negative feedback, stabilizing gain at the cost of reduced voltage gain. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="emitter-follower"></a>
**Emitter follower** — A BJT buffer configuration (common collector) with unity voltage gain and low output impedance. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="encoder"></a>
**Encoder** — A combinational circuit that converts one-hot inputs to a binary code.

<a id="enhancement-mode-mosfet"></a>
**Enhancement-mode MOSFET** — A MOSFET that is normally off, requiring gate voltage above threshold to conduct. See [MOSFETs]({{< relref "/docs/analog/active-devices/mosfets" >}}).

<a id="equalization"></a>
**Equalization** — Compensation for frequency-dependent channel loss using transmitter and/or receiver techniques.

<a id="equivalent-resistance"></a>
**Equivalent resistance** — A single resistance value that replaces a series, parallel, or complex combination of resistors for analysis purposes.

<a id="esd-protection"></a>
**ESD protection** — Using clamping diodes to steer electrostatic discharge current away from sensitive inputs. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="esl"></a>
**ESL (Equivalent Series Inductance)** — Parasitic inductance in a capacitor from its leads, internal connections, and plate geometry. Determines the self-resonant frequency.

<a id="esr"></a>
**ESR (Equivalent Series Resistance)** — The effective series resistance inside a capacitor, representing all resistive losses. Causes real power dissipation and limits the capacitor's ability to supply fast transients.

<a id="eye-diagram"></a>
**Eye diagram** — A visual representation of signal quality at the receiver, showing timing and voltage margins.

---

## F

<a id="farad"></a>
**Farad (F)** — SI unit of capacitance. One farad stores one coulomb at one volt. Practical capacitors range from picofarads to millifarads.

<a id="fan-out"></a>
**Fan-out** — The number of inputs a logic output can drive while maintaining valid logic levels.

<a id="fast-recovery-diode"></a>
**Fast-recovery diode** — A diode optimized for low reverse recovery time, suitable for switching power supply applications. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="feedback-fraction"></a>
**Feedback fraction (β)** — The portion of the output signal returned to the input through the feedback network. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).

<a id="ferrite-bead"></a>
**Ferrite bead** — A frequency-dependent resistive component used in series with supply traces to attenuate high-frequency noise while passing DC. See [Decoupling & Bypassing]({{< relref "/docs/analog/power-and-regulation/decoupling-and-bypassing" >}}).

<a id="ferrite-core"></a>
**Ferrite core** — Ceramic magnetic core material made from iron oxide compounds. Low eddy current loss at high frequencies but exhibits hard saturation — inductance drops abruptly when the current limit is exceeded.

<a id="film-capacitor"></a>
**Film capacitor** — Capacitor using plastic film as the dielectric. Excellent stability, low losses, self-healing under minor breakdown. Larger than ceramics for equivalent capacitance.

<a id="filter-order"></a>
**Filter order** — The number of poles in a filter, determining the asymptotic roll-off rate at 20 dB/decade per pole. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="flat-schematic"></a>
**Flat schematic** — Multi-sheet schematic where all sheets exist at the same hierarchy level, connected by net names. Simpler than hierarchical schematics but harder to navigate in large designs.

<a id="flicker-noise"></a>
**Flicker noise (1/f noise)** — Noise whose power spectral density increases at lower frequencies, dominant below the corner frequency. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="flyback"></a>
**Flyback** — The voltage spike produced when current through an inductor is suddenly interrupted. The inductor's stored energy must go somewhere — without a defined path (flyback diode, snubber), it creates destructive voltage spikes.

<a id="flyback-diode"></a>
**Flyback diode** — Diode placed across an inductive load to provide a safe current path when the driving switch opens. Prevents voltage spikes from damaging the switch. Also called a freewheeling or snubber diode.

<a id="forward-active"></a>
**Forward active** — The operating region of a BJT where the base-emitter junction is forward biased and the base-collector junction is reverse biased. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="forward-voltage"></a>
**Forward voltage** — The voltage drop across a diode when current flows in the forward direction, typically 0.6-0.7 V for silicon and 0.2-0.4 V for Schottky diodes. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="fpga"></a>
**FPGA (Field-Programmable Gate Array)** — A programmable chip with configurable logic blocks, routing, and I/O cells for implementing digital designs.

<a id="full-adder"></a>
**Full adder** — A circuit that adds two 1-bit inputs plus a carry-in to produce a sum and carry-out.

<a id="full-wave-rectifier"></a>
**Full-wave rectifier** — A rectifier circuit using four diodes in a bridge configuration to convert both polarities of AC to DC. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

---

## G

<a id="gain-bandwidth-product"></a>
**Gain-bandwidth product (GBW)** — The product of closed-loop gain and bandwidth, approximately constant for a given op-amp. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="gain-margin"></a>
**Gain margin** — The difference in dB between actual loop gain and 0 dB at the frequency where phase shift equals 360°. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}).

<a id="gain-peaking"></a>
**Gain peaking** — An unintended rise in gain near a cutoff frequency, indicating underdamped response or insufficient phase margin. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).

<a id="global-net"></a>
**Global net** — A named electrical connection that spans multiple schematic sheets without explicit wiring. Power nets (VCC, GND) are the most common example.

<a id="glitch"></a>
**Glitch** — A momentary incorrect output caused by different propagation delays through logic paths.

<a id="gray-code"></a>
**Gray code** — A binary encoding where only one bit changes per count, avoiding multi-bit transition glitches.

<a id="ground-bounce"></a>
**Ground bounce** — Voltage spike on the ground network caused by fast-changing currents flowing through resistive and inductive ground paths. Can cause false logic transitions and measurement errors.

<a id="ground-plane"></a>
**Ground plane** — A continuous copper layer on a PCB dedicated to ground. Provides low-impedance return current paths, reduces EMI, and improves signal integrity.

<a id="group-delay"></a>
**Group delay** — The derivative of phase with respect to frequency, representing the time delay experienced by signal components. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).

<a id="guard-ring"></a>
**Guard ring** — A driven shield trace at the same potential as a sensitive node, reducing capacitive leakage and coupling. See [Layout & Parasitics]({{< relref "/docs/analog/noise-stability-reality/layout-and-parasitics" >}}).

---

## H

<a id="h_fe"></a>
**h_FE** — The hybrid parameter symbol for BJT current gain, equivalent to beta. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="half-adder"></a>
**Half adder** — A circuit that adds two 1-bit inputs to produce a sum and carry.

<a id="half-wave-rectifier"></a>
**Half-wave rectifier** — A rectifier circuit using one diode to convert one polarity of an AC signal to DC. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="henry"></a>
**Henry (H)** — SI unit of inductance. One henry produces one volt when current changes at one ampere per second. Practical inductors range from nanohenries to millihenries.

<a id="hertz"></a>
**Hertz (Hz)** — SI unit of frequency. One hertz equals one cycle per second.

<a id="hidden-power-pin"></a>
**Hidden power pin** — IC power connection that exists in the component model but is not explicitly shown on the schematic symbol. Can cause confusion if the pin isn't properly connected in the netlist.

<a id="hierarchical-schematic"></a>
**Hierarchical schematic** — Schematic organized as a top-level block diagram with each block implemented as a separate sheet. Scales better than flat schematics for complex designs.

<a id="high-pass-filter"></a>
**High-pass filter** — A filter that passes frequencies above a cutoff frequency and attenuates frequencies below it. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="hold-time"></a>
**Hold time** — The minimum time data must remain stable after the clock edge for reliable capture.

<a id="holdup-time"></a>
**Holdup time** — Duration that a capacitor can sustain a load after the input power is removed. Determined by capacitance, load current, and allowable voltage droop.

<a id="hysteresis-loss"></a>
**Hysteresis loss** — Energy dissipated in a magnetic core each AC cycle as magnetic domains reverse direction. Proportional to frequency and the area of the B-H loop.

---

## I

<a id="i2c"></a>
**I2C (Inter-Integrated Circuit)** — A synchronous, half-duplex, multi-master serial bus using two open-drain lines (SCL, SDA) with pull-ups.

<a id="impedance"></a>
**Impedance (Z)** — Generalized resistance for AC circuits, including both resistive (real) and reactive (imaginary) components. Measured in ohms. Varies with frequency.

<a id="impedance-matching"></a>
**Impedance matching** — Selecting load impedance to maximize power transfer from a source. Critical in RF and audio systems. Maximum power transfer occurs when load impedance equals the complex conjugate of the source impedance.

<a id="inductance"></a>
**Inductance (L)** — The property of a component that resists changes in current by storing energy in a magnetic field. V = L × (dI/dt).

<a id="input-bias-current"></a>
**Input bias current** — Small current drawn by an op-amp's input terminals, typically nanoamps for BJT inputs and picoamps for FET inputs. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="input-impedance"></a>
**Input impedance (Z_in)** — The impedance presented by a circuit or instrument at its input terminals. High input impedance means less loading of the signal source.

<a id="input-offset-voltage"></a>
**Input offset voltage** — A small DC voltage difference between the inputs of a real op-amp that must be accounted for in precision circuits. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="inrush-current"></a>
**Inrush current** — The large transient current drawn when power is first applied to a circuit, typically caused by charging initially discharged capacitors. Can be many times the steady-state current.

<a id="instantaneous-power"></a>
**Instantaneous power** — The product of voltage and current at any specific moment: P(t) = V(t) × I(t).

<a id="insulation-breakdown"></a>
**Insulation breakdown** — Degradation of a dielectric material leading to increased leakage current or catastrophic short circuit. Accelerated by temperature, voltage stress, and contamination.

<a id="interstage-coupling"></a>
**Interstage coupling** — The method of connecting amplifier stages, either AC-coupled (capacitive) or DC-coupled (direct). See [Multistage Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/multistage-amplifiers" >}}).

<a id="inverting-amplifier"></a>
**Inverting amplifier** — An op-amp configuration where input connects through a resistor to the inverting terminal, with gain set by the feedback resistor ratio. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="ir-thermometer"></a>
**IR thermometer** — Non-contact temperature measurement tool that reads infrared radiation from a surface. Quick for spot checks but accuracy depends on the emissivity of the target surface.

---

## J

<a id="jitter"></a>
**Jitter** — Variation in clock edge timing from cycle to cycle, degrading timing margins.

<a id="jk-flip-flop"></a>
**JK flip-flop** — A flip-flop with J and K inputs that can set, reset, hold, or toggle based on the input combination.

<a id="johnson-noise"></a>
**Johnson noise (thermal noise)** — Random voltage noise generated by thermal motion of electrons in any resistor. Proportional to resistance, temperature, and bandwidth. Present in all resistors regardless of construction.

<a id="joule"></a>
**Joule (J)** — SI unit of energy. One joule equals one watt for one second. One watt-hour equals 3,600 joules.

<a id="junction-capacitance"></a>
**Junction capacitance** — The capacitance of a reverse-biased diode that varies with the applied reverse voltage. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

---

## K

<a id="karnaugh-map"></a>
**Karnaugh map** — A graphical method for simplifying Boolean functions by grouping adjacent truth table entries.

<a id="kcl"></a>
**KCL (Kirchhoff's Current Law)** — The sum of currents entering a node equals the sum of currents leaving. A direct consequence of conservation of charge. See [Kirchhoff's Laws]({{< relref "/docs/fundamentals/laws-first-principles/kirchhoffs-laws" >}}).

<a id="kvl"></a>
**KVL (Kirchhoff's Voltage Law)** — The sum of voltage drops around any closed loop equals zero. A direct consequence of conservation of energy. See [Kirchhoff's Laws]({{< relref "/docs/fundamentals/laws-first-principles/kirchhoffs-laws" >}}).

---

## L

<a id="ldo"></a>
**LDO (Low-Dropout Regulator)** — A linear regulator designed to operate with very small input-to-output voltage difference, typically 100-500 mV. See [Linear Regulators]({{< relref "/docs/analog/power-and-regulation/linear-regulators" >}}).

<a id="leakage-current"></a>
**Leakage current** — Small, undesired current flowing through a nominally insulating path. Present in capacitor dielectrics, semiconductor junctions, and PCB surface contamination.

<a id="level-shifting"></a>
**Level shifting** — Converting a signal from one voltage level to another when interfacing between different logic families.

<a id="lfsr"></a>
**LFSR (Linear Feedback Shift Register)** — A shift register with XOR feedback generating pseudo-random sequences of maximum length 2^n - 1.

<a id="line-regulation"></a>
**Line regulation** — How much a regulator's or reference's output changes per volt of input change, measured in mV/V or ppm/V. See [Reference Voltages]({{< relref "/docs/analog/power-and-regulation/reference-voltages" >}}).

<a id="linear-circuit"></a>
**Linear circuit** — A circuit that obeys the superposition principle: the response to a sum of inputs equals the sum of the individual responses. Resistors, capacitors, and inductors are linear; diodes and transistors are not.

<a id="linear-regulator"></a>
**Linear regulator** — A voltage regulator that maintains constant output by dissipating excess voltage as heat across a series pass element. See [Linear Regulators]({{< relref "/docs/analog/power-and-regulation/linear-regulators" >}}).

<a id="load-regulation"></a>
**Load regulation** — How much a voltage source's output changes per unit of load current change. See [Reference Voltages]({{< relref "/docs/analog/power-and-regulation/reference-voltages" >}}).

<a id="loading"></a>
**Loading** — The effect of connecting a load to a circuit, which draws current and may change the operating voltage. Voltage dividers and high-impedance signal sources are particularly susceptible.

<a id="logic-level-mosfet"></a>
**Logic-level MOSFET** — A MOSFET designed to be fully on with 3.3 V or 5 V gate drive, without needing higher voltage. See [MOSFETs]({{< relref "/docs/analog/active-devices/mosfets" >}}).

<a id="lookup-table"></a>
**Lookup table (LUT)** — A small memory implementing arbitrary Boolean functions, the basic building block of FPGAs.

<a id="loop"></a>
**Loop** — Any closed path through a circuit, traversing one or more branches and returning to the starting node.

<a id="loop-compensation"></a>
**Loop compensation** — Design of the feedback network in a switching regulator to ensure stability across all operating conditions. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="loop-gain"></a>
**Loop gain** — The product of forward gain and feedback fraction (T = A × β), determining how effectively feedback controls the circuit. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).

<a id="low-pass-filter"></a>
**Low-pass filter** — A filter that passes frequencies below a cutoff frequency and attenuates frequencies above it. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="lvds"></a>
**LVDS (Low-Voltage Differential Signaling)** — A differential signaling standard for high-speed data and clock distribution with low noise emission.

---

## M

<a id="magnetic-field"></a>
**Magnetic field** — The energy storage medium in inductors and transformers. Created by current flow through a conductor and concentrated by magnetic core materials.

<a id="magnetostriction"></a>
**Magnetostriction** — Physical deformation of a magnetic core material caused by the changing magnetic field. Produces audible buzzing or humming in inductors and transformers, especially at power-line frequencies.

<a id="mah"></a>
**Milliamp-hour (mAh)** — Unit of electric charge commonly used to rate battery capacity. To estimate energy in watt-hours: mAh × nominal voltage ÷ 1000.

<a id="matched-components"></a>
**Matched components** — Components selected or designed to track each other's temperature coefficient for ratiometric stability. See [Temperature & Drift]({{< relref "/docs/analog/biasing-operating-points/temperature-and-drift" >}}).

<a id="maximum-power-transfer"></a>
**Maximum power transfer** — Occurs when load resistance equals the source's Thevenin resistance. Transfers maximum power to the load but at only 50% efficiency.

<a id="mealy-machine"></a>
**Mealy machine** — A state machine where outputs depend on both current state and current inputs.

<a id="mesh-analysis"></a>
**Mesh analysis** — Systematic circuit analysis method that applies KVL around independent loops (meshes) and solves for loop currents. Complementary to nodal analysis.

<a id="metal-film-resistor"></a>
**Metal-film resistor** — Through-hole resistor type with low noise, tight tolerance, and good temperature stability. A solid general-purpose choice when precision matters.

<a id="metastability"></a>
**Metastability** — A state where a flip-flop output is indeterminate between HIGH and LOW for an uncertain duration.

<a id="microphonic"></a>
**Microphonic** — The property of some components (especially ceramic capacitors) to generate voltage when subjected to mechanical vibration, due to the piezoelectric effect.

<a id="microstrip"></a>
**Microstrip** — A PCB trace on an outer layer with a ground plane beneath, the most common controlled-impedance structure.

<a id="miller-effect"></a>
**Miller effect** — The multiplication of gate-drain capacitance by the voltage gain, slowing switching transitions and potentially causing oscillation. See [MOSFETs]({{< relref "/docs/analog/active-devices/mosfets" >}}).

<a id="moore-machine"></a>
**Moore machine** — A state machine where outputs depend only on the current state.

<a id="mosfet"></a>
**MOSFET (Metal-Oxide-Semiconductor FET)** — A voltage-controlled transistor where gate voltage controls drain current through an insulated gate. See [MOSFETs]({{< relref "/docs/analog/active-devices/mosfets" >}}).

<a id="mtbf"></a>
**MTBF (Mean Time Between Failures)** — The average time between metastability-induced failures in a synchronizer.

<a id="multiplexer"></a>
**Multiplexer** — A combinational circuit that selects one of several data inputs and routes it to a single output.

<a id="mutual-inductance"></a>
**Mutual inductance** — Magnetic coupling between adjacent inductors or windings. The mechanism behind transformer operation and also a source of unwanted crosstalk.

---

## N

<a id="nand-gate"></a>
**NAND gate** — AND followed by NOT; a universal gate capable of implementing any Boolean function.

<a id="negative-feedback"></a>
**Negative feedback** — Feedback where the returned signal opposes the input, creating self-correction that stabilizes gain and reduces distortion. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).

<a id="net-name"></a>
**Net name** — A label applied to a wire or connection in a schematic that replaces physical wire drawings. All points sharing the same net name are electrically connected.

<a id="network-analyzer"></a>
**Network analyzer** — An instrument that measures the frequency response of a circuit with both amplitude and phase information. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).

<a id="no-connect"></a>
**No connect (NC)** — An explicit marker on a schematic indicating that an IC pin is intentionally left unconnected. Distinguishes deliberate non-connection from a wiring error.

<a id="node"></a>
**Node** — A junction where two or more branches meet in a circuit. All points connected by zero-resistance conductors form a single node.

<a id="nodal-analysis"></a>
**Nodal analysis** — Systematic circuit analysis method that applies KCL at each node and solves for node voltages. Generally preferred over mesh analysis for circuits with many parallel branches.

<a id="noise-figure"></a>
**Noise figure (NF)** — A measure of how much noise a circuit adds beyond the thermal noise of its source impedance, in dB. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="noise-floor"></a>
**Noise floor** — The minimum detectable signal level in a circuit, limited by the sum of all noise sources. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="noise-gain"></a>
**Noise gain** — The gain that applies to noise and offset voltage in an op-amp circuit, which may differ from signal gain. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="noise-margin"></a>
**Noise margin** — The voltage difference between guaranteed output levels and required input thresholds, representing noise immunity.

<a id="noise-spectral-density"></a>
**Noise spectral density** — Noise voltage or current per unit bandwidth, typically expressed in nV/√Hz or pA/√Hz. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="nominal-voltage"></a>
**Nominal voltage** — The approximate or stated voltage under no-load or standard conditions. Actual voltage varies with load and source regulation.

<a id="non-inverting-amplifier"></a>
**Non-inverting amplifier** — An op-amp configuration where input connects to the non-inverting terminal, with gain set by 1 + R_f/R_in. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="nor-gate"></a>
**NOR gate** — OR followed by NOT; a universal gate capable of implementing any Boolean function.

<a id="norton-equivalent"></a>
**Norton equivalent** — Any linear circuit reduced to a current source (I_n) in parallel with a resistance (R_n). Mathematically equivalent to the Thevenin equivalent. See [Thévenin & Norton]({{< relref "/docs/fundamentals/circuit-analysis/thevenin-norton" >}}).

<a id="not-gate"></a>
**NOT gate** — A logic gate that outputs the complement of its input. Also called an inverter.

<a id="ntc-thermistor"></a>
**NTC thermistor** — Negative Temperature Coefficient resistor whose resistance decreases with temperature. Used for temperature sensing and soft-start inrush current limiting.

---

## O

<a id="ohm"></a>
**Ohm (Ω)** — SI unit of electrical resistance. One ohm passes one ampere under one volt of potential difference.

<a id="ohms-law"></a>
**Ohm's Law (V = IR)** — The fundamental relationship between voltage, current, and resistance. Applies directly to resistive elements and as an approximation for many practical calculations. See [Ohm's Law]({{< relref "/docs/fundamentals/laws-first-principles/ohms-law" >}}).

<a id="op-amp"></a>
**Op-amp (operational amplifier)** — A high-gain differential amplifier used as a universal analog building block with external feedback networks. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="open-circuit-voltage"></a>
**Open-circuit voltage (V_oc)** — The voltage measured across a source's terminals when no load is connected. Equal to the Thevenin voltage.

<a id="open-drain"></a>
**Open-drain** — A logic output with only a pull-down transistor, requiring an external pull-up resistor for the HIGH level.

<a id="open-loop-gain"></a>
**Open-loop gain** — The gain of an op-amp without feedback, typically 100,000 V/V or more at DC. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="or-gate"></a>
**OR gate** — A logic gate that outputs 1 when any input is 1.

<a id="oscilloscope-probe"></a>
**Oscilloscope probe** — Coupling device between the circuit under test and the oscilloscope input. Passive probes (1× and 10×) are most common; active probes provide lower loading.

<a id="output-impedance"></a>
**Output impedance (Z_out)** — The impedance a circuit presents at its output terminals. Determines how much the output voltage droops under load. Lower output impedance means stiffer voltage regulation.

<a id="output-ripple"></a>
**Output ripple** — The AC voltage variation superimposed on the DC output of a switching regulator, typically 10-50 mV. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

---

## P

<a id="parasitic-capacitance"></a>
**Parasitic capacitance** — Unintended capacitance present between conductors, component leads, PCB traces, and other structures. Negligible at low frequencies but dominates behavior at high frequencies.

<a id="parasitic-inductance"></a>
**Parasitic inductance** — Unintended inductance in component leads, wires, and PCB traces. Causes ringing on fast edges and limits high-frequency performance.

<a id="pass-element"></a>
**Pass element** — The series transistor in a linear regulator whose resistance is continuously adjusted to maintain constant output voltage. See [Linear Regulators]({{< relref "/docs/analog/power-and-regulation/linear-regulators" >}}).

<a id="phase-margin"></a>
**Phase margin** — The difference between actual phase shift and 360° at the frequency where loop gain equals unity, indicating stability margin. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}).

<a id="piezoelectric-effect"></a>
**Piezoelectric effect** — Generation of voltage from mechanical stress in certain materials. The mechanism behind microphonic noise in ceramic capacitors and the operating principle of crystal oscillators.

<a id="pin-name"></a>
**Pin name** — The functional label of an IC pin (e.g., CLK, RESET, VCC). Describes what the pin does.

<a id="pin-number"></a>
**Pin number** — The physical location identifier of an IC pin on the package. Needed for PCB layout and manual probing.

<a id="place-and-route"></a>
**Place and Route** — The FPGA design step that assigns logic to physical locations and connects them with routing resources.

<a id="pll"></a>
**PLL (Phase-Locked Loop)** — A feedback circuit that synchronizes an output frequency with a reference frequency.

<a id="polarity"></a>
**Polarity** — The directional convention for voltage measurement. The terminal marked + is assumed to be at higher potential. Critical for electrolytic capacitors, which can be damaged by reverse polarity.

<a id="pole"></a>
**Pole** — A frequency in a transfer function that contributes -20 dB/decade roll-off and -90 degrees of phase shift. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).

<a id="port"></a>
**Port** — A connection point in a hierarchical schematic that links a sub-sheet to the level above. Analogous to a function parameter in software.

<a id="positive-feedback"></a>
**Positive feedback** — Feedback where the returned signal reinforces the input, causing the output to diverge. Used deliberately in oscillators and latches. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).

<a id="potentiometer"></a>
**Potentiometer** — A three-terminal variable resistor with an adjustable wiper contact. Acts as an adjustable voltage divider.

<a id="powdered-iron-core"></a>
**Powdered iron core** — Inductor core made from iron particles with insulating gaps between them. Exhibits soft saturation and lower permeability than ferrite, useful for power inductors.

<a id="power-budget"></a>
**Power budget** — An accounting of all power sources, conversions, and dissipation in a system. Reveals whether the power supply can support the design and where heat will be generated.

<a id="power-derating"></a>
**Power derating** — Reduction in a component's maximum allowable power dissipation at temperatures above a specified threshold. Defined on datasheets as a derating curve or factor.

<a id="power-distribution-network"></a>
**Power Distribution Network (PDN)** — The complete power delivery path from regulator to every transistor on a chip or board.

<a id="power-factor"></a>
**Power factor (PF)** — The ratio of real power to apparent power. Ranges from 0 to 1. A power factor of 1 (unity) means voltage and current are perfectly in phase.

<a id="power-flag"></a>
**Power flag / symbol** — Schematic symbols (VCC, VDD, 3V3, 5V, GND) representing global power connections. Connected by net name rather than by drawn wires.

<a id="power-rating"></a>
**Power rating** — The maximum continuous power a component can dissipate at a specified ambient temperature without exceeding its maximum operating temperature.

<a id="ppm"></a>
**ppm (Parts Per Million)** — A measure of ratio. 1% = 10,000 ppm. Used for specifying temperature coefficients (e.g., 25 ppm/°C) and precision tolerances.

<a id="precision"></a>
**Precision (Repeatability)** — The consistency of repeated measurements. A precise instrument gives the same reading each time, though that reading may not be accurate.

<a id="pre-emphasis"></a>
**Pre-emphasis** — High-frequency signal boost at the transmitter to compensate for channel attenuation.

<a id="prescaler"></a>
**Prescaler** — A counter used to divide a clock frequency by a fixed amount.

<a id="priority-encoder"></a>
**Priority encoder** — An encoder that outputs the binary code of the highest-priority active input.

<a id="probe-loading"></a>
**Probe loading** — The distortion introduced by a measurement probe's input impedance (resistive and capacitive) on the circuit being measured. Most significant on high-impedance and high-frequency nodes.

<a id="ptc"></a>
**PTC (Positive Temperature Coefficient)** — A component whose resistance increases with temperature. Used as resettable fuses (polyfuses) and in self-regulating heater elements.

<a id="pull-up-resistor"></a>
**Pull-up resistor** — A resistor connected to a supply voltage to establish the HIGH level for open-drain or open-collector outputs.

<a id="pulse-frequency-modulation"></a>
**Pulse frequency modulation (PFM)** — A light-load operating mode where the switching frequency reduces to maintain efficiency. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

---

## Q

<a id="q-point"></a>
**Q-point (quiescent point)** — The DC operating point of a transistor determined by the bias circuit. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="quality-factor"></a>
**Quality factor (Q)** — A measure of how selective a resonant circuit or filter is, with higher Q meaning narrower bandwidth. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="quiescent-current"></a>
**Quiescent current** — The current drawn by a circuit when no signal is applied and no load is driven. Represents the standing power consumption of the circuit.

---

## R

<a id="r_ds_on"></a>
**R_DS(on)** — The on-resistance of a MOSFET when fully enhanced, a key parameter for switching efficiency. See [MOSFETs]({{< relref "/docs/analog/active-devices/mosfets" >}}).

<a id="rail-to-rail"></a>
**Rail-to-rail** — An op-amp whose output can swing close to both supply rails, typically within 50-200 mV. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="reactive-power"></a>
**Reactive power (Q)** — Power that cycles back and forth between source and reactive components (capacitors, inductors) without performing net work. Measured in VAR (volt-amperes reactive).

<a id="real-power"></a>
**Real power (P)** — The power actually dissipated as heat or converted to useful work, measured in watts. The only component of power that shows up on your electricity bill.

<a id="reference-designator"></a>
**Reference designator** — The unique identifier for each component on a schematic and PCB: R1, C2, U3, Q4, etc. The letter indicates the component type; the number distinguishes instances.

<a id="reference-direction"></a>
**Reference direction** — The assumed direction of current flow or voltage polarity assigned during circuit analysis. If the calculated value is negative, the actual direction is opposite to the assumed reference.

<a id="reference-node"></a>
**Reference node (ground)** — The node assigned zero volts in nodal analysis. All other node voltages are measured relative to this reference.

<a id="register"></a>
**Register** — A group of flip-flops sharing a common clock, storing a multi-bit word.

<a id="regulation"></a>
**Regulation** — How well a voltage source maintains its output under varying load conditions. Expressed as a percentage change from no-load to full-load.

<a id="resolution"></a>
**Resolution** — The smallest change in a measured quantity that an instrument can display. A 4.5-digit DMM has finer resolution than a 3.5-digit DMM, but resolution is not the same as accuracy.

<a id="resonant-frequency"></a>
**Resonant frequency (f_0)** — The frequency at which an LC circuit oscillates with maximum amplitude. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="reverse-polarity-protection"></a>
**Reverse polarity protection** — Using a series or parallel diode to block current if the supply is connected backwards. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="reverse-recovery-time"></a>
**Reverse recovery time** — The time during which a forward-conducting diode continues to conduct briefly in reverse while stored charge is swept out. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="rework"></a>
**Rework** — Manual modifications to a PCB after assembly: bodge wires, component swaps, cut traces. A normal part of prototype development but should be documented and incorporated into the next revision.

<a id="ringing"></a>
**Ringing** — Damped oscillation in a circuit's step response, indicating marginal stability or underdamped poles. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}).

<a id="ripple-current"></a>
**Ripple current** — AC current superimposed on DC current flowing through a capacitor. Causes heating through ESR dissipation. Capacitor lifetime depends on keeping ripple current within ratings.

<a id="rise-time"></a>
**Rise time** — The time for an output to transition from 10% to 90% of its final value in response to a step input. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).

<a id="rms"></a>
**RMS (Root Mean Square)** — The effective value of a time-varying signal. The RMS voltage of an AC waveform produces the same heating in a resistor as a DC voltage of the same value.

<a id="rs-232"></a>
**RS-232** — A UART electrical standard using ±3 to ±15 V signal levels for point-to-point communication.

<a id="rs-485"></a>
**RS-485** — A differential serial standard supporting multi-drop networks over long distances.

<a id="rtl"></a>
**RTL (Register Transfer Level)** — The abstraction level describing digital design in terms of data storage and movement between registers.

---

## S

<a id="safe-operating-area"></a>
**Safe Operating Area (SOA)** — The region in the I-V characteristic space where a transistor can safely operate without damage. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="sallen-key-filter"></a>
**Sallen-Key filter** — The most common active filter topology using a single op-amp in non-inverting configuration with two reactive elements. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="saturation-current"></a>
**Saturation current** — The current at which an inductor's core can no longer store additional magnetic energy, causing inductance to drop. Exceeding saturation current in a switching converter causes current to ramp uncontrollably.

<a id="saturation-region-bjt"></a>
**Saturation region (BJT)** — The operating region where both junctions are forward biased and the transistor acts as a low-impedance switch. See [Operating Regions]({{< relref "/docs/analog/biasing-operating-points/operating-regions" >}}).

<a id="schottky-diode"></a>
**Schottky diode** — A diode with a metal-semiconductor junction that exhibits lower forward voltage drop and faster switching compared to conventional junction diodes. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="second-breakdown"></a>
**Second breakdown** — A failure mode where localized heating causes destructive current focusing in high-voltage, high-current BJTs. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="self-heating"></a>
**Self-heating** — Power dissipation within a component raising its own temperature, changing its electrical parameters. See [Temperature & Drift]({{< relref "/docs/analog/biasing-operating-points/temperature-and-drift" >}}).

<a id="self-resonant-frequency"></a>
**Self-resonant frequency (SRF)** — The frequency at which a capacitor's ESL resonates with its capacitance, causing impedance to reach a minimum. Above the SRF, the capacitor behaves as an inductor.

<a id="sense-resistor"></a>
**Sense resistor** — A low-value precision resistor placed in a current path so that the voltage drop across it indicates the current flowing. Also called a current shunt.

<a id="sepic-converter"></a>
**SEPIC converter** — A non-inverting buck-boost topology that can produce output voltage above or below input with same polarity. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="serdes"></a>
**SerDes** — Dedicated high-speed serializer-deserializer transceiver blocks for multi-gigabit communication.

<a id="series"></a>
**Series** — Components connected end-to-end so that the same current flows through each. Voltages add; resistances add.

<a id="parallel"></a>
**Parallel** — Components connected across the same two nodes so that they share the same voltage. Currents add; conductances add.

<a id="series-termination"></a>
**Series termination** — A resistor at the driver output matching the transmission line impedance to prevent reflections.

<a id="setup-time"></a>
**Setup time** — The minimum time data must be stable before the clock edge for reliable capture.

<a id="shielded-inductor"></a>
**Shielded inductor** — Inductor with a magnetic structure that contains the magnetic field, reducing radiated interference and susceptibility to external fields.

<a id="shift-register"></a>
**Shift register** — A register where data moves one position per clock cycle through cascaded flip-flops.

<a id="short-circuit-current"></a>
**Short-circuit current (I_sc)** — The current that flows when a source's output terminals are connected together. Equal to the Norton current.

<a id="shot-noise"></a>
**Shot noise** — Random noise caused by the discrete nature of charge carriers crossing a barrier, proportional to DC current. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="shunt-reference"></a>
**Shunt reference** — A two-terminal voltage reference that sinks current to maintain a fixed voltage, operating in parallel with the load. See [Reference Voltages]({{< relref "/docs/analog/power-and-regulation/reference-voltages" >}}).

<a id="shunt-resistor"></a>
**Shunt resistor** — Low-value resistor used inside ammeters and current-sense circuits to convert current into a measurable voltage. Same as sense resistor.

<a id="si-prefixes"></a>
**SI prefixes** — Standard multipliers for units: tera (10¹²), giga (10⁹), mega (10⁶), kilo (10³), milli (10⁻³), micro (10⁻⁶), nano (10⁻⁹), pico (10⁻¹²), femto (10⁻¹⁵).

<a id="signal-ground"></a>
**Signal ground** — The reference point for signal voltages in a circuit. May or may not be connected to earth ground or chassis ground.

<a id="skin-effect"></a>
**Skin effect** — The phenomenon at high frequencies where current flows only in a thin surface layer of a conductor.

<a id="slack"></a>
**Slack** — The difference between required and actual signal arrival time; positive slack means the timing constraint is met.

<a id="slew-rate"></a>
**Slew rate** — The maximum rate at which an op-amp output can change voltage, typically expressed in V/µs. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="small-signal-analysis"></a>
**Small-signal analysis** — Linear circuit analysis describing how a device responds to small AC signals around a DC operating point. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="smd-resistor-marking"></a>
**SMD resistor marking** — Three or four digit code: for a 3-digit code, the first two digits are significant and the third is the exponent (e.g., "472" = 47 × 10² = 4,700 Ω).

<a id="snr"></a>
**SNR (Signal-to-Noise Ratio)** — The ratio of signal power to noise power, usually expressed in decibels. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="snubber"></a>
**Snubber** — An RC or RCD network that absorbs energy from switching transients, reducing voltage spikes and ringing. Placed across switches, relays, and inductive loads.

<a id="soft-start"></a>
**Soft-start** — A circuit feature that gradually ramps the output voltage during startup to limit inrush current. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="source-deactivation"></a>
**Source deactivation** — The process of "turning off" independent sources to find equivalent resistance: voltage sources become short circuits; current sources become open circuits.

<a id="source-degeneration"></a>
**Source degeneration** — A source resistor in a MOSFET amplifier providing the same stabilizing feedback as emitter degeneration. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="source-follower"></a>
**Source follower** — A MOSFET buffer configuration (common drain) with unity voltage gain and low output impedance. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="spi"></a>
**SPI (Serial Peripheral Interface)** — A synchronous, full-duplex, master-slave serial bus using clock, data out, data in, and chip select lines.

<a id="sr-latch"></a>
**SR latch** — The simplest memory element made from two cross-coupled gates with Set and Reset inputs.

<a id="sso"></a>
**SSO (Simultaneous Switching Output)** — The number of output pins switching at the same clock edge, affecting power integrity.

<a id="state-diagram"></a>
**State diagram** — A directed graph representing the states and transitions of a finite state machine.

<a id="state-machine"></a>
**State machine (FSM)** — A sequential circuit that moves through defined states according to inputs and current state.

<a id="static-hazard"></a>
**Static hazard** — A condition where the output should remain constant but momentarily produces the opposite value during an input transition.

<a id="static-timing-analysis"></a>
**Static timing analysis (STA)** — Automated verification of timing by analyzing all paths without simulation.

<a id="stiff-source"></a>
**Stiff source** — A voltage source with low output impedance, meaning its voltage barely changes when load current varies. The opposite of a high-impedance source.

<a id="storage-time"></a>
**Storage time** — The delay caused by excess base charge that must be removed before a saturated BJT can turn off. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="stripline"></a>
**Stripline** — A PCB trace between two ground planes providing excellent field containment and controlled impedance.

<a id="sub-threshold-conduction"></a>
**Sub-threshold conduction** — Exponential drain current below threshold voltage, exploited in ultra-low-power design. See [MOSFETs]({{< relref "/docs/analog/active-devices/mosfets" >}}).

<a id="supercapacitor"></a>
**Supercapacitor** — Very high-capacitance component (farads to hundreds of farads) used for energy storage and extended holdup time. Much lower energy density than batteries but can charge and discharge rapidly.

<a id="supernode"></a>
**Supernode** — In nodal analysis, a boundary drawn around a voltage source and its two adjacent nodes, allowing KCL to be applied to the combined region.

<a id="supermesh"></a>
**Supermesh** — In mesh analysis, a combined loop formed when a current source appears in a branch shared by two meshes. Allows KVL to be applied to the combined path.

<a id="superposition"></a>
**Superposition** — The principle that in a linear circuit, the total response equals the sum of the responses due to each independent source acting alone. Valid only for linear circuits.

<a id="switch-node"></a>
**Switch node** — The highest-noise node in a switching regulator, at the junction of the switch and inductor. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="synchronous-counter"></a>
**Synchronous counter** — A counter where all flip-flops are clocked simultaneously by the same clock edge.

<a id="synthesis"></a>
**Synthesis** — The process of converting an HDL description into a netlist of logic elements.

---

## T

<a id="t-flip-flop"></a>
**T flip-flop** — A flip-flop that toggles its output on each clock edge when T input is 1.

<a id="tantalum-capacitor"></a>
**Tantalum capacitor** — Polarized capacitor with high volumetric efficiency. Failure mode can be a low-impedance short circuit, potentially violent. Derate voltage significantly or use polymer tantalum types.

<a id="tank-circuit"></a>
**Tank circuit** — A resonant LC circuit that stores energy by oscillating between the electric field of the capacitor and the magnetic field of the inductor. Used in RF tuning and impedance matching.

<a id="temperature-coefficient"></a>
**Temperature coefficient (tempco)** — The change in a component's value per degree Celsius, usually expressed in ppm/°C. A 100 ppm/°C resistor changes 0.01% per degree.

<a id="testbench"></a>
**Testbench** — Non-synthesizable HDL code that drives a design under test with stimulus and checks outputs.

<a id="thermal-camera"></a>
**Thermal camera** — Imaging device that maps surface temperatures across a PCB or system. Reveals hot spots, thermal gradients, and components operating near their limits.

<a id="thermal-coupling"></a>
**Thermal coupling** — Heat transfer between physically adjacent components. Can cause unintended parameter shifts when one component's dissipation heats a neighbor.

<a id="thermal-gradient"></a>
**Thermal gradient** — Temperature variation across a PCB causing different components to operate at different temperatures. See [Temperature & Drift]({{< relref "/docs/analog/biasing-operating-points/temperature-and-drift" >}}).

<a id="thermal-paste"></a>
**Thermal paste** — Interface material applied between a component and heatsink to fill microscopic air gaps and reduce thermal resistance.

<a id="thermal-resistance"></a>
**Thermal resistance (θ)** — Resistance to heat flow, analogous to electrical resistance. Temperature rise equals power times thermal resistance: ΔT = P × θ. Measured in °C/W.

<a id="thermal-runaway"></a>
**Thermal runaway** — A positive feedback loop where increased temperature causes increased current (or power), which further increases temperature. Destructive if not interrupted.

<a id="thermal-shutdown"></a>
**Thermal shutdown** — A protection circuit that disables a regulator or power device if junction temperature exceeds a safe limit. See [Linear Regulators]({{< relref "/docs/analog/power-and-regulation/linear-regulators" >}}).

<a id="thermal-voltage"></a>
**Thermal voltage (V_T)** — kT/q, approximately 26 mV at room temperature. Appears throughout semiconductor device equations. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="thevenin-equivalent"></a>
**Thévenin equivalent** — Any linear circuit reduced to a voltage source (V_th) in series with a resistance (R_th). Simplifies analysis of how the circuit interacts with different loads. See [Thévenin & Norton]({{< relref "/docs/fundamentals/circuit-analysis/thevenin-norton" >}}).

<a id="thick-film-resistor"></a>
**Thick-film resistor** — The most common SMD resistor type. Moderate tolerance (1–5%), moderate tempco. Adequate for most applications; specify thin-film when precision is needed.

<a id="thin-film-resistor"></a>
**Thin-film resistor** — Precision SMD resistor with tight tolerance (0.1% or better), excellent tempco, and low noise. Costs more than thick-film. Use for instrumentation, precision voltage references, and sensor signal conditioning.

<a id="three-digit-cap-code"></a>
**Three-digit capacitor code** — Marking system where the first two digits are significant and the third is a power-of-ten multiplier in picofarads. E.g., "104" = 10 × 10⁴ pF = 100 nF.

<a id="time-constant"></a>
**Time constant (τ)** — The characteristic response time of an RC or RL circuit. τ = RC for capacitive circuits; τ = L/R for inductive circuits. After one time constant, the circuit reaches 63% of its final value.

<a id="timing-closure"></a>
**Timing closure** — The iterative process of modifying a design until all timing constraints are met.

<a id="tolerance"></a>
**Tolerance** — The allowable deviation of a component's actual value from its nominal value, expressed as a percentage. A 10 kΩ ±1% resistor can range from 9,900 Ω to 10,100 Ω.

<a id="tolerance-stacking"></a>
**Tolerance stacking** — The accumulated uncertainty when multiple components' tolerances combine in a circuit. Worst-case analysis adds tolerances; statistical analysis uses root-sum-square.

<a id="transconductance"></a>
**Transconductance (g_m)** — The ratio of output current change to input voltage change, equal to I_C / V_T for BJTs. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="transfer-function"></a>
**Transfer function** — The mathematical ratio of output to input as a function of frequency, fully describing a linear circuit's frequency behavior. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="transient"></a>
**Transient** — A brief, fast-changing voltage or current event. Switching events, power-on surges, and ESD are common transient sources.

<a id="transmission-line"></a>
**Transmission line** — A conductor pair whose distributed inductance and capacitance cause reflection and wave propagation effects at high frequencies.

<a id="trigger"></a>
**Trigger** — Oscilloscope feature that synchronizes the display to a specific event on the waveform, producing a stable, readable display.

<a id="triode-region"></a>
**Triode region** — The MOSFET operating region where it behaves as a voltage-controlled resistor, analogous to BJT saturation. See [Operating Regions]({{< relref "/docs/analog/biasing-operating-points/operating-regions" >}}).

<a id="truth-table"></a>
**Truth table** — A table listing every input combination and corresponding output for a logic function.

<a id="ttl"></a>
**TTL (Transistor-Transistor Logic)** — A logic family built from bipolar transistors, historically the dominant digital logic technology.

<a id="tvs"></a>
**TVS (Transient Voltage Suppressor)** — A specialized diode designed to absorb large transient energy pulses with well-defined clamping voltage. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="two-flip-flop-synchronizer"></a>
**Two-flip-flop synchronizer** — Two flip-flops in series used to safely synchronize signals between clock domains.

---

## U

<a id="uart"></a>
**UART (Universal Asynchronous Receiver-Transmitter)** — An asynchronous, full-duplex, point-to-point serial interface without a dedicated clock line.

<a id="unity-power-factor"></a>
**Unity power factor** — Power factor of 1, meaning voltage and current are perfectly in phase. All power delivered is real power; no reactive power is present.

<a id="unshielded-inductor"></a>
**Unshielded inductor** — Inductor with an open magnetic path that allows the magnetic field to radiate. Can couple interference to nearby circuits and is susceptible to external fields.

---

## V

<a id="varactor"></a>
**Varactor** — A diode whose junction capacitance varies with reverse voltage, used for frequency tuning and modulation. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="vco"></a>
**VCO (Voltage Controlled Oscillator)** — An oscillator whose output frequency is controlled by an input voltage.

<a id="verilog"></a>
**Verilog** — A hardware description language for designing and simulating digital circuits.

<a id="vhdl"></a>
**VHDL** — A hardware description language for designing and simulating digital circuits, more verbose than Verilog.

<a id="via-stitching"></a>
**Via stitching** — Multiple vias connecting ground planes between PCB layers to maintain low-impedance ground connections. See [Decoupling & Bypassing]({{< relref "/docs/analog/power-and-regulation/decoupling-and-bypassing" >}}).

<a id="virtual-ground"></a>
**Virtual ground** — The condition in a negative-feedback op-amp circuit where both inputs are at effectively the same voltage. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="volt"></a>
**Volt (V)** — SI unit of electric potential difference. One volt drives one ampere through one ohm of resistance.

<a id="voltage-coefficient"></a>
**Voltage coefficient** — The change in a component's value with applied voltage. Most significant in ceramic capacitors (DC bias effect) and carbon composition resistors.

<a id="voltage-divider"></a>
**Voltage divider** — A network (typically two resistors in series) that produces an output voltage proportional to the input voltage. Output depends on the ratio of the resistances and is affected by load current. See [Voltage Dividers & Loading]({{< relref "/docs/fundamentals/circuit-analysis/voltage-dividers-and-loading" >}}).

<a id="voltage-divider-bias"></a>
**Voltage divider bias** — The standard BJT biasing topology using a voltage divider to set the base voltage and an emitter resistor to stabilize collector current. See [BJTs]({{< relref "/docs/analog/active-devices/bjts" >}}).

<a id="voltage-headroom"></a>
**Voltage headroom** — The available voltage range for signal swing between the supply rails and the device's saturation or cutoff limits. See [DC Biasing]({{< relref "/docs/analog/biasing-operating-points/dc-biasing" >}}).

<a id="voltage-reference"></a>
**Voltage reference** — A circuit producing a precise, stable voltage used as a comparison standard in regulators, ADCs, and measurement circuits. See [Reference Voltages]({{< relref "/docs/analog/power-and-regulation/reference-voltages" >}}).

---

## W

<a id="watt"></a>
**Watt (W)** — SI unit of power. One watt equals one joule per second. One watt equals one volt times one ampere in a DC circuit.

<a id="watt-hour"></a>
**Watt-hour (Wh)** — Unit of energy. One watt-hour equals 3,600 joules. Used to rate battery capacity alongside milliamp-hours.

<a id="watchdog-timer"></a>
**Watchdog timer** — A timer that resets a system if software or hardware fails to complete a sequence within bounded time.

<a id="wiper"></a>
**Wiper** — The moving contact in a potentiometer that slides along the resistive element, creating a variable voltage divider.

<a id="wirewound-resistor"></a>
**Wirewound resistor** — Precision resistor made by winding resistance wire on a form. Excellent tolerance and tempco but significant parasitic inductance. Not suitable for high-frequency circuits.

---

## X

<a id="x5r"></a>
**X5R** — Class II ceramic dielectric rated for -55°C to +85°C with ±15% capacitance variation over temperature. Common in decoupling applications but susceptible to DC bias and aging effects.

<a id="x7r"></a>
**X7R** — Class II ceramic dielectric rated for -55°C to +125°C with ±15% capacitance variation over temperature. The most common general-purpose ceramic for applications where C0G/NP0 values are insufficient.

<a id="xor-gate"></a>
**XOR gate** — A logic gate that outputs 1 when inputs differ.

---

## Y

<a id="y5v"></a>
**Y5V** — Class III ceramic dielectric with very high capacitance density but terrible stability: +22% / -82% over temperature range. Avoid for anything where the actual capacitance matters.

---

## Z

<a id="zener-diode"></a>
**Zener diode** — A diode designed to operate in reverse breakdown at a specific voltage, used for voltage references and simple regulators. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="zener-regulator"></a>
**Zener regulator** — A simple voltage regulator consisting of a Zener diode fed through a current-limiting resistor. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

<a id="zero"></a>
**Zero** — A frequency in a transfer function that contributes +20 dB/decade gain and +90 degrees of phase advance. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).
