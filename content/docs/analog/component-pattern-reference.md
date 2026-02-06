---
title: "Components & Patterns"
weight: 70
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Components & Patterns

A quick reference to components and patterns commonly encountered in analog circuit design, emphasizing biasing, operating regions, transfer functions, and the parameters that matter most: gain, bandwidth, impedance, and noise.

## Passive Components

**Resistor**
Sets bias currents, divides voltages, and defines gain through feedback networks. Found in virtually every analog circuit — from simple voltage dividers to precision instrumentation. Power rating matters when the resistor carries significant current (LEDs, sense resistors, load resistors). Temperature coefficient (tempco) matters in precision paths where drift causes measurement error — use 25 ppm/°C or better for references and gain-setting networks. Metal film types offer low noise and tight tolerance; carbon composition adds noise but handles pulse energy well. Resistor noise (Johnson noise) becomes significant in high-gain, low-level signal chains.

**Capacitor**
AC coupling, filtering, and energy storage. Dielectric type determines behavior under voltage and temperature — C0G/NP0 for precision timing and filters where stability matters, X5R/X7R for bulk decoupling where some capacitance variation is acceptable. ESR matters in power filtering applications; voltage derating is critical in ceramics where capacitance drops significantly as DC bias approaches rated voltage. Film capacitors excel in signal paths where low distortion and no piezoelectric effects are needed. Electrolytic types provide bulk storage but have limited life, polarity requirements, and higher ESR.

**Inductor**
Energy storage and filtering, primarily in power and RF applications. Saturation current is the critical limit — once exceeded, inductance collapses and the inductor becomes a low-value resistor, often causing converter instability or failure. DCR (DC resistance) causes power loss and voltage drop. Core material determines frequency range and losses — ferrite for high frequency, powdered iron for power applications, air core when linearity matters more than size. Shielded inductors reduce EMI coupling to nearby circuits.

## Semiconductors

**Diode**
Rectification, clamping, and voltage references (Zener). Forward drop varies by type — silicon ~0.6 V, Schottky ~0.3 V, germanium ~0.3 V. Junction capacitance matters at high frequencies, limiting switching speed and affecting RF circuits. Reverse recovery time determines suitability for fast switching applications. Zener diodes provide voltage references but have significant temperature coefficients; for precision references, use dedicated reference ICs instead. Schottky diodes excel in low-loss rectification and reverse polarity protection but have higher leakage current.

**BJT**
Current-controlled current amplifier. Key parameters are hFE (current gain), VCE(sat), and fT (transition frequency). Base current is not a free input — it sets the operating point and affects the source impedance. hFE varies widely with collector current, temperature, and between devices of the same type — designs should not depend on a specific hFE value. Used in discrete amplifier stages, current mirrors, and as switches. The VBE temperature coefficient (~-2 mV/°C) enables temperature sensing but causes bias point drift that must be compensated in precision circuits.

**MOSFET**
Voltage-controlled switch or amplifier. Key parameters are Vth (threshold), RDS(on), and gate charge. The gate is capacitive — drive current affects switching speed but not static dissipation. Logic-level vs. standard threshold matters for direct MCU drive; logic-level parts switch fully on at 3.3–5 V gate drive while standard threshold parts need 10 V or more. In linear operation, transconductance (gm) determines gain. Body diode in power MOSFETs affects switching behavior and can conduct during dead time in bridge circuits. Gate oxide is ESD-sensitive — handle with care.

## Integrated Analog

**Op-amp**
The universal analog building block. Key parameters are GBW (gain-bandwidth product), input offset voltage, input bias current, slew rate, and output drive capability. Treated as a primitive when selecting from a catalog; becomes a block when analyzing its internal compensation. Rail-to-rail input/output types maximize dynamic range with single supplies. JFET-input types offer ultra-low bias current for high-impedance sources. CMOS types provide low power but may have higher noise. Compensation determines stability — unity-gain stable parts work in any feedback configuration; decompensated parts offer higher bandwidth but require minimum gain.

**Comparator**
High-speed differential amplifier designed for switching, not linear operation. Key parameters are propagation delay, input offset voltage, and output type (push-pull, open-drain, open-collector). Using an op-amp as a comparator fails at speed and may oscillate due to internal compensation; using a comparator as an op-amp fails immediately because comparators have no compensation. Hysteresis (via positive feedback) prevents output chatter when input signals cross slowly or with noise. Open-drain outputs allow wired-OR and level translation but require pull-up resistors.

**Voltage reference**
Precision voltage source for ADC references, bias networks, and calibration. Key parameters are initial accuracy, temperature coefficient (tempco), noise, and load regulation. Bandgap references (~1.25 V) offer good tempco with moderate accuracy; buried Zener references achieve best accuracy and stability but cost more. Load regulation and line regulation indicate how much the output voltage changes with load current and input voltage variations. Noise matters in ADC reference applications — the reference noise floor limits ADC effective resolution.

## Magnetics & Adjustments

**Transformer**
Transfers energy and provides galvanic isolation. Key parameters are turns ratio, inductance, leakage inductance, and isolation voltage. Frequency-dependent behavior makes RF and audio transformers very different devices — audio transformers need low-frequency response and handle DC bias, while RF transformers are optimized for narrow frequency bands and impedance matching. Leakage inductance causes voltage spikes in switching applications. Isolation voltage rating is a safety parameter — exceeding it can cause arcing and failure.

**Potentiometer/trimmer**
Variable resistor for adjustable bias, calibration, or user controls. Linear vs. logarithmic taper matters for the application — logarithmic (audio) taper matches perceived loudness for volume controls, linear for most other adjustments. Wiper contact resistance adds noise, especially in dirty or worn pots. Multi-turn trimmers provide fine adjustment resolution for calibration. Cermet trimmers offer good stability and long life; carbon types are cheaper but less stable. End resistance (the resistance that remains at minimum and maximum settings) affects circuit behavior at extreme positions.

## Power & Regulation

**Linear regulator**
Drops input voltage to a lower, regulated output by dissipating excess as heat. Key parameters are dropout voltage, PSRR (power supply rejection ratio), line/load regulation, and thermal limits. Efficiency is limited to Vout/Vin — large input-output differentials waste significant power as heat. LDO (low dropout) types minimize input headroom requirements. Excellent PSRR makes linear regulators preferred for noise-sensitive analog supplies even when efficiency suffers. Thermal protection usually shuts down the regulator rather than allowing failure. Output capacitor ESR affects stability in many designs — check the datasheet requirements.

**Decoupling/bypass network**
Capacitors near IC power pins for local charge storage and high-frequency noise suppression. ESR, ESL, and placement matter more than raw capacitance value — a well-placed 100 nF capacitor outperforms a poorly-placed 10 µF. Use multiple capacitor values in parallel to cover a wide frequency range (bulk electrolytic for low frequency, ceramic for high frequency). Place as close as possible to power/ground pins — trace inductance between capacitor and IC degrades effectiveness. Via placement and loop area also affect performance at high frequencies.

## Amplifier Topologies

**Inverting amplifier**
Op-amp configuration with gain = -Rf/Rin. Input impedance equals Rin, which can be inconveniently low for high gain settings. The virtual ground at the inverting input means signal sources see a constant load impedance regardless of gain. Output phase is inverted. Summing multiple signals is natural — additional input resistors to the virtual ground add without interaction. Gain accuracy depends on resistor matching rather than op-amp open-loop gain. Bandwidth is gain-dependent — GBW divided by closed-loop gain gives the -3 dB bandwidth.

**Non-inverting amplifier**
Op-amp configuration with gain = 1 + Rf/Rg. Very high input impedance makes it the default for buffering high-impedance sources. Output is in phase with input. Cannot achieve gain less than unity (use voltage follower for unity gain). More susceptible to common-mode errors at the input than inverting configurations. Input common-mode range must accommodate the signal — some op-amps have limited range near the rails. Gain accuracy depends on resistor ratio matching; for low gains, feedback resistor tolerance dominates error.

**Differential amplifier / instrumentation amplifier**
Rejects common-mode signals and amplifies the difference. Key parameters are CMRR (common-mode rejection ratio), gain accuracy, and noise. A simple differential amplifier uses one op-amp with four matched resistors — matching determines CMRR. Instrumentation amplifiers add input buffers for very high input impedance and better CMRR; three op-amp or dedicated IC versions dominate. Essential for bridge sensor interfaces, biopotential measurements, and any signal contaminated with common-mode interference. Avoid routing differential inputs near noisy traces.

**Common-emitter / common-source stage**
Single-transistor amplifier with moderate gain. Key parameters are voltage gain, input/output impedance, and bias stability. Biasing is the hard part — gain depends on the operating point, which drifts with temperature. Four-resistor bias networks provide reasonable stability. Degeneration (unbypassed emitter/source resistor) trades gain for linearity and stability. The Miller effect multiplies effective input capacitance by voltage gain, limiting bandwidth. A workhorse building block that appears in countless discrete designs; understanding this stage is foundational to reading vintage schematics.

**Emitter follower / source follower**
Unity voltage gain, current gain, and impedance transformation. Output sits one VBE or VGS below the input (level shift). Input impedance is high (beta times the load impedance for BJT); output impedance is low (source impedance divided by beta plus the emitter resistor). Cannot source or sink arbitrarily — push-pull configurations overcome this limitation. Used between stages to prevent loading and to drive low-impedance loads. The follower's input capacitance is low because there's no Miller multiplication.

## Bias & Current Control

**Voltage divider**
Two resistors producing a fraction of the input voltage. Key parameters are division ratio, output impedance, and power dissipation. Loading the output with an impedance comparable to the divider shifts the ratio — the load appears in parallel with the lower resistor. Output impedance equals the parallel combination of both resistors, limiting how much current can be drawn without affecting the division ratio. High-value dividers minimize power consumption but increase noise and susceptibility to leakage currents. Use when the load impedance is at least 10× higher than the divider's output impedance; otherwise, buffer with an op-amp follower.

**Current source/sink**
Maintains constant current regardless of load voltage. Key parameters are output current, compliance range (the voltage range over which current stays constant), and output impedance (higher is better). Built from a transistor and sense resistor (simple but temperature-dependent), or an op-amp with a sense resistor (more accurate and temperature-stable). The sense resistor value trades off between accuracy and compliance voltage. Wilson and cascode configurations improve output impedance for better performance as active loads in amplifiers.

**Current mirror**
Matched transistor pair where one sets the reference current and the other replicates it. Key parameters are mirror ratio, output impedance, and matching accuracy. Discrete mirrors rarely match as well as integrated ones because thermal gradients and process variations affect the two transistors differently. Improved mirrors (Wilson, cascode) increase output impedance. Base current error in BJT mirrors causes ratio error that increases with low beta devices; MOSFET mirrors avoid this issue. Thermal coupling between the two transistors improves matching — mount them close together.

## Filtering & Protection

**RC low-pass filter**
First-order filter with -3 dB cutoff at 1/(2πRC). 20 dB/decade rolloff is often insufficient for serious filtering but adequate for deglitching, basic signal conditioning, and anti-alias pre-filtering before an active filter. Capacitor choice affects performance — use C0G/NP0 for precision applications, film for signal path integrity. The filter's impedance changes with frequency, which affects source and load interactions. Multiple RC stages can be cascaded for steeper rolloff, but each stage loads the previous one and introduces additional phase shift.

**RC high-pass filter**
AC coupling configuration that blocks DC while passing AC signals. Key parameters are cutoff frequency and settling time. Low cutoff means slow settling after transients — a 10 Hz cutoff takes about 160 ms to settle to 1% after a step. The filter introduces phase shift at frequencies near cutoff, which matters in multi-channel applications where phase matching is important. Large coupling capacitors (for low cutoff) may need film types to avoid electrolytic polarity issues and leakage. In audio, determines low-frequency rolloff and affects perceived "warmth."

**Active filter (Sallen-Key / MFB)**
Op-amp-based second-order filter avoiding inductors. Key parameters are cutoff frequency, Q, gain, and filter type (Butterworth for maximally flat passband, Bessel for linear phase and minimal overshoot, Chebyshev for steep rolloff with passband ripple). Op-amp GBW must be well above the filter frequency — typically 10× or more for accurate response. Sallen-Key provides non-inverting gain with good input impedance; MFB (multiple feedback) provides inverting gain with better high-frequency rejection and less sensitivity to op-amp GBW. Component sensitivity to Q varies by topology — high-Q filters require tight tolerance components.

**Voltage clamp**
Limits signal excursion using diodes to supply rails or a Zener. Key parameters are clamp voltage and clamping current capacity. Protects inputs from overvoltage conditions that could damage ICs or cause latch-up. Clamp diodes must handle the fault current without damage — use Schottky types for lower forward drop and faster response. Active clamps using op-amps provide precise clamping levels. Consider that the clamp path becomes low-impedance when conducting, which can load the source circuit.

## Conversion & Interface

**ADC front end**
Signal conditioning chain between sensor and ADC: anti-alias filter, buffer, level shifting. Key parameters are bandwidth, noise floor, THD (total harmonic distortion), and settling time. The anti-alias filter must attenuate signals above Nyquist — any aliased content cannot be removed digitally. Bandwidth must accommodate the signal but not extend unnecessarily (which admits more noise). Settling time matters for multiplexed inputs. Match the driver amplifier's output impedance and settling to the ADC's sample-and-hold requirements.

**DAC output stage**
Conditioning after DAC: reconstruction filter, buffer, possibly voltage-to-current conversion. Key parameters are output impedance, settling time, and glitch energy. The reconstruction filter removes images at multiples of the sample rate. Glitch energy (voltage-time product during code transitions) affects output cleanliness — deglitching sample-and-holds or oversampling reduce visible glitches. Output buffer must handle the load requirements including capacitive loads (cables, filters).

**Sensor interface**
Signal chain from raw sensor to usable signal: excitation, amplification, linearization. Each sensor type has specific interface requirements — thermocouples need cold-junction compensation and high-gain low-drift amplifiers, bridges need stable excitation and differential input, RTDs need precise current excitation and lead compensation. Signal levels range from microvolts (thermocouples) to volts (some pressure sensors), requiring appropriate amplifier selection. Shielding and filtering are usually necessary to achieve specified accuracy in real environments.

**PLL**
Phase-locked loop for frequency synthesis, clock multiplication, and jitter reduction. Key parameters are lock range, lock time, phase noise, and loop bandwidth. Loop bandwidth determines tracking behavior — wider bandwidth tracks input phase variations, narrower bandwidth filters input jitter. Lock time matters in applications that must acquire quickly. Phase noise affects receiver sensitivity and measurement accuracy. The loop filter (usually an RC network) determines dynamics and stability — component values are not arbitrary.

## System Patterns

**Sensor-to-display chain**
Complete path from physical quantity through sensing, conditioning, digitization, processing, and display. The error budget exercise — allocating allowable error across each stage — is the system-level discipline. Each stage contributes offset, gain error, noise, and nonlinearity. Calibration can remove systematic errors (offset, gain) but not random errors (noise). The display resolution should match the actual measurement accuracy — displaying 4 digits when only 2 are meaningful is misleading.

**Closed-loop control system**
Sensor measures process variable, controller computes correction, actuator acts on the process. Key parameters are loop bandwidth, stability margins (gain and phase margin), and disturbance response. Stability is the fundamental concern — an unstable loop oscillates or saturates. Loop bandwidth determines response speed and noise rejection; faster is not always better because fast loops amplify high-frequency noise. PID tuning methods (Ziegler-Nichols, Cohen-Coon) provide starting points but often require adjustment. Saturation and integrator windup cause problems when the actuator reaches its limits.
