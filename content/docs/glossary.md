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


<a id="1-wire"></a>
**1-Wire** — Dallas/Maxim single-wire protocol for temperature sensors and device identification with parasitic power option.
<a id="3db-point"></a>
**3 dB point** — The frequency at which a filter's output drops to 70.7% of its passband value, corresponding to half power. Defines the boundary between passband and stopband.

<a id="10x-probe"></a>
**10× probe** — Oscilloscope probe with 10:1 attenuation. Presents roughly 10 MΩ ∥ 10 pF at the tip, significantly reducing probe loading compared to a 1× probe. The standard choice for most measurements.

<a id="4-20-ma-loop"></a>
**4-20 mA loop** — An industrial signaling standard where sensor readings are encoded as current between 4 mA (zero) and 20 mA (full scale), immune to wire resistance errors.

---

<a id="4000-series-cmos"></a>
**4000-series CMOS (CD4000)** — Family of CMOS logic ICs operating from 3-18 V, offering low power and wide supply range; common in industrial and legacy designs.

<a id="7400-series-logic"></a>
**7400-series logic** — Family of TTL and CMOS digital ICs providing basic gates, flip-flops, counters, and other building blocks, introduced in 1966.

<a id="74hc"></a>
**74HC** — High-speed CMOS logic family, pin-compatible with 7400-series TTL but with CMOS power and threshold characteristics.

<a id="74hct"></a>
**74HCT** — High-speed CMOS logic with TTL-compatible input thresholds; accepts 3.3 V inputs when powered from 5 V.

<a id="78xx-regulator"></a>
**78xx regulator** — Family of fixed positive linear voltage regulators (7805 = 5 V, 7812 = 12 V, etc.); standard in legacy power supplies.

<a id="79xx-regulator"></a>
**79xx regulator** — Family of fixed negative linear voltage regulators (7905, 7912, 7915); complement to the 78xx positive regulators.



<a id="8b10b-encoding"></a>
**8b/10b encoding** — Line code mapping 8-bit data to 10-bit symbols for DC balance and clock recovery; 25% bandwidth overhead.
<a id="sae-j1939"></a>
**SAE J1939 (J1939)** — Heavy-duty vehicle CAN protocol using 29-bit extended IDs at 250 kbps with standardized parameter groups.
<a id="scada"></a>
**SCADA** — Supervisory Control and Data Acquisition; system for remote monitoring and control of industrial processes and infrastructure.


<a id="sched-fifo"></a>
**SCHED_FIFO** — Linux real-time scheduling policy where the highest-priority runnable thread always gets the CPU with no time-slicing.


<a id="second-sourcing"></a>
**Second-sourcing** — Practice of qualifying at least two interchangeable component options from different manufacturers to reduce supply chain risk.

<a id="selective-soldering"></a>
**Selective soldering** — Automated soldering process targeting individual through-hole joints on an otherwise SMD-assembled board.


<a id="shape-factor"></a>
**Shape factor** — Ratio of a filter's bandwidth at high attenuation to its 3 dB bandwidth, indicating transition sharpness.

<a id="shielding-effectiveness"></a>
**Shielding effectiveness** — Attenuation in dB that an enclosure provides against electromagnetic fields passing through its walls.
<a id="shmoo-plot"></a>
**Shmoo plot** — Two-dimensional pass/fail map testing a circuit across two variables simultaneously to visualize operating region boundaries.
<a id="sideband"></a>
**Sideband** — New frequency component created by modulation, offset from the carrier by the modulating frequency.


<a id="sigmf"></a>
**SigMF** — Signal Metadata Format; a standard for describing recorded I/Q data including sample rate, frequency, and type.
<a id="signal-flow-diagram"></a>
**Signal flow diagram** — Block diagram showing each processing stage, its gain, and the signal level at each point in a multistage chain.

<a id="simultaneous-masking"></a>
**Simultaneous masking** — Psychoacoustic effect where a loud tone makes quieter tones at nearby frequencies inaudible.

<a id="sinc-droop"></a>
**Sinc droop** — High-frequency rolloff in a DAC's zero-order hold output caused by the sinc-shaped frequency response.

<a id="sinc-function"></a>
**Sinc function** — sin(pi*t)/(pi*t); the ideal interpolation kernel for reconstructing a bandlimited signal from its samples.
<a id="single-sided-pcb"></a>
**Single-sided PCB** — Printed circuit board with copper traces on one side only, using jumper wires where traces must cross; standard in older designs.



<a id="skin-depth"></a>
**Skin depth** — Depth at which current density falls to 1/e (37%) of the surface value in a conductor carrying AC.

<a id="skywave-propagation"></a>
**Skywave propagation** — Long-distance HF radio propagation via ionospheric reflection, enabling beyond-line-of-sight communication.

<a id="slot-antenna"></a>
**Slot antenna** — Antenna formed by a narrow slot cut in a ground plane; the complementary of a dipole via Babinet's principle.
<a id="smbus"></a>
**SMBus** — System Management Bus; I2C variant with stricter timing, clock timeout, and optional CRC for power management ICs.


<a id="smoke-test"></a>
**Smoke test** — First controlled power application to a new board using current-limited supply to detect shorts and faults.
<a id="soft-real-time"></a>
**Soft real-time** — System where a missed deadline degrades quality but does not cause failure; the system keeps running.

<a id="softdevice"></a>
**SoftDevice** — Nordic's pre-compiled BLE stack binary running as a privileged layer on nRF52 SoCs alongside application firmware.

<a id="software-breakpoint"></a>
**Software breakpoint** — Debug breakpoint replacing an instruction with BKPT; requires writable memory, rarely usable in flash.


<a id="solder-mask-dam"></a>
**Solder mask dam** — Strip of solder mask between adjacent PCB pads preventing solder paste from bridging during reflow assembly.

<a id="solder-paste-stencil"></a>
**Solder paste stencil** — Thin metal sheet with laser-cut apertures used to deposit precise solder paste volumes onto PCB pads before reflow.

<a id="solt-calibration"></a>
**SOLT calibration** — Short-Open-Load-Through VNA calibration procedure that removes cable and connector effects from measurements.
<a id="spectral-bin"></a>
**Spectral bin** — A single frequency slot in a DFT/FFT output, representing energy at a specific frequency with resolution f_s / N.
<a id="speed-up-capacitor"></a>
**Speed-up capacitor** — Small capacitor across a base resistor that improves switching speed by providing extra base charge during transitions.

<a id="spl"></a>
**SPL** — Secondary Program Loader; first-stage bootloader running from internal SRAM that initializes DRAM before loading U-Boot.


<a id="ssb"></a>
**SSB** — Single Sideband; AM variant transmitting only one sideband for half the bandwidth; used in HF radio communications.
<a id="st-link"></a>
**ST-Link** — STMicroelectronics debug probe bundled on STM32 Nucleo and Discovery boards for SWD programming and debugging.


<a id="stability-circle"></a>
**Stability circle** — Locus on the Smith chart showing source or load impedances that cause an RF device to oscillate.
<a id="stack-painting"></a>
**Stack painting** — Debug technique filling the stack with a known pattern at startup and checking for overwrites to detect overflow.


<a id="standing-wave"></a>
**Standing wave** — A stationary pattern of voltage maxima and minima on a transmission line caused by interference between forward and reflected waves.
<a id="startup-race"></a>
**Startup race** — Timing conflict where the MCU attempts to communicate with external peripherals before they finish initializing.



<a id="stepped-stencil"></a>
**Stepped stencil** — Solder paste stencil with different thicknesses in different areas to accommodate both fine-pitch and large-pad components.
<a id="stopband"></a>
**Stopband** — The frequency range where a filter provides its specified minimum attenuation, rejecting unwanted signals.
<a id="supervisor-ic"></a>
**Supervisor IC** — Dedicated chip monitoring VCC and holding the MCU in reset until supply voltage is stable above a defined threshold.

<a id="sysfs"></a>
**sysfs** — Linux virtual filesystem at /sys exposing device attributes as simple files for shell-level hardware control.

<a id="system-call"></a>
**System call** — Controlled transition from user space to kernel space for requesting OS services like file I/O or device access.

## A

<a id="a-weighting"></a>
**A-weighting** — Frequency-weighting curve approximating human hearing sensitivity, attenuating low and high frequencies while emphasizing 1–6 kHz.


<a id="ac-analysis"></a>
**AC analysis (.AC)** — SPICE frequency-sweep simulation showing gain and phase response across a range of frequencies.
<a id="ac-coupling"></a>
**AC coupling** — Signal path that blocks DC and passes only the time-varying component. Implemented with a series capacitor. The low-frequency cutoff depends on the capacitor value and load impedance. See [Measurement Basics]({{< relref "/docs/fundamentals/units-notation-measurement/measurement-basics" >}}).

<a id="ac-termination"></a>
**AC termination** — Transmission line termination using a series capacitor and resistor, providing correct impedance at signal frequencies while blocking DC current draw.



<a id="acars"></a>
**ACARS** — Aircraft Communications Addressing and Reporting System; text messaging protocol between aircraft and ground stations.
<a id="accelerated-life-testing"></a>
**Accelerated life testing (ALT)** — Running a product at elevated stress levels to simulate years of aging in weeks.
<a id="accumulated-jitter"></a>
**Accumulated jitter** — The timing error that builds up over many clock cycles, measured as the deviation of the Nth edge from its ideal position.

<a id="accuracy"></a>
**Accuracy** — How close a measurement reading is to the true value. Distinct from precision, which describes repeatability. A meter can be precise (consistent readings) but inaccurate (consistently wrong).


<a id="acid-trap"></a>
**Acid trap** — Acute-angle copper feature on a PCB where etchant can pool during fabrication, potentially under-etching the copper.
<a id="active-filter"></a>
**Active filter** — A filter using op-amps or other active devices to shape frequency response without inductors. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="active-probe"></a>
**Active probe** — Oscilloscope probe with a built-in amplifier at the tip, presenting very low capacitance (~1 pF) and high impedance. Necessary for measuring fast signals where passive probe loading would distort the waveform.



<a id="ads-b"></a>
**ADS-B** — Automatic Dependent Surveillance-Broadcast; system where aircraft transmit position and identification on 1090 MHz.
<a id="aes-ebu"></a>
**AES/EBU (AES3)** — Professional balanced digital audio interface using 110-ohm twisted pair with biphase mark encoding.
<a id="agc"></a>
**AGC (Automatic Gain Control)** — A feedback loop that adjusts gain to maintain constant output amplitude despite varying input levels. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).

<a id="aging"></a>
**Aging** — Logarithmic capacitance loss over time in Class II and III ceramic capacitors. Most of the change occurs shortly after manufacturing; the rate slows but never stops.

<a id="ahb-bus"></a>
**AHB bus** — Primary bus interconnect on ARM Cortex-M MCUs connecting the CPU, memory, and high-speed peripherals. Performance and contention on AHB affects CPU and DMA access timing.


<a id="ais"></a>
**AIS** — Automatic Identification System; maritime protocol where ships broadcast identification and position on VHF.
<a id="aliasing"></a>
**Aliasing** — Unwanted lower-frequency components appearing in a sampled signal when it contains frequencies above the Nyquist frequency; irreversible once it occurs.

<a id="ampere"></a>
**Ampere (A)** — SI unit of electric current. One ampere equals one coulomb of charge per second.

<a id="and-gate"></a>
**AND gate** — A logic gate that outputs 1 only when all inputs are 1.

<a id="angular-frequency"></a>
**Angular frequency (ω)** — Frequency expressed in radians per second: ω = 2πf. Appears in impedance formulas and transfer functions.


<a id="annular-ring"></a>
**Annular ring** — Width of copper pad surrounding a drilled PCB via hole, critical for reliable electrical connection.
<a id="antenna-efficiency"></a>
**Antenna efficiency** — Ratio of radiated power to input power; determined by radiation resistance divided by total resistance.

<a id="antenna-gain"></a>
**Antenna gain** — Directivity of an antenna multiplied by its efficiency; measured in dBi (relative to isotropic) or dBd (relative to dipole).

<a id="anti-aliasing-filter"></a>
**Anti-aliasing filter** — A low-pass filter placed before an ADC to prevent frequencies above half the sample rate from folding back as false signals. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).



<a id="antipad"></a>
**Antipad** — The clearance hole in a ground or power plane around a via that is not connected to that plane.
<a id="aoi"></a>
**AOI** — Automated Optical Inspection; machine vision system comparing assembled PCB images to a reference to detect defects.
<a id="aperture-jitter"></a>
**Aperture jitter** — Variation in the exact sampling moment of an ADC, introducing timing errors that translate to amplitude errors for changing signals.

<a id="apb-bus"></a>
**APB bus** — Secondary peripheral buses (APB1, APB2) on ARM Cortex-M MCUs connecting lower-speed peripherals like UART, SPI, I2C, and timers. Clock prescalers divide the system clock for each APB domain.



<a id="aperture-reduction"></a>
**Aperture reduction** — Making stencil openings smaller than pad size to reduce solder paste volume and prevent bridging on fine-pitch components.
<a id="aperture-time"></a>
**Aperture time** — The finite time a sample-and-hold circuit takes to acquire the signal; introduces error proportional to signal slew rate.
<a id="apparent-power"></a>
**Apparent power (S)** — The product of RMS voltage and RMS current, measured in volt-amperes (VA). Equals real power only when power factor is unity.



<a id="application-note"></a>
**Application note** — Vendor document explaining design methodology for a component family, including equations and tradeoff guidance.

<a id="apt"></a>
**APT** — Automatic Picture Transmission; analog image format broadcast by NOAA weather satellites at 137 MHz.
<a id="arm-none-eabi-gcc"></a>
**arm-none-eabi-gcc** — GCC cross-compiler for ARM bare-metal targets using the Embedded ABI, the standard Cortex-M toolchain.
<a id="asynchronous-fifo"></a>
**Asynchronous FIFO** — A FIFO buffer with independent read and write clocks for transferring data between clock domains.


<a id="asynchronous-sample-rate-converter"></a>
**Asynchronous sample rate converter (ASRC)** — Circuit that resamples digital audio from one clock domain to another, decoupling source and destination clocks to reject jitter.
<a id="atomicity"></a>
**Atomicity** — Property of an operation that completes in a single uninterruptible step at the hardware level. On 32-bit Cortex-M, aligned 32-bit loads and stores are atomic; 64-bit operations and read-modify-write sequences are not.

<a id="audio-analyzer"></a>
**Audio analyzer** — A dedicated test instrument for measuring audio performance metrics including THD, THD+N, SNR, frequency response, and crosstalk.



<a id="audio-dropout"></a>
**Audio dropout** — Audible click, pop, or silence caused by a DSP block missing its real-time processing deadline.
<a id="audio-taper"></a>
**Audio taper** — Logarithmic potentiometer resistance curve that matches human loudness perception; required for volume controls.
<a id="auto-ranging"></a>
**Auto-ranging** — Instrument feature that automatically selects the measurement range. Convenient but can be slow when the signal crosses range boundaries.

<a id="avalanche-breakdown"></a>
**Avalanche breakdown** — Non-destructive reverse breakdown in a diode where carrier multiplication occurs at high electric field. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="axial-ratio"></a>
**Axial ratio** — For circularly polarized antennas, the ratio of major to minor axis of the polarization ellipse; values closer to 1.0 indicate better circular polarization.

---

## B



<a id="babinets-principle"></a>
**Babinet's principle** — Electromagnetic principle stating that a slot in a conducting surface is the complement of a strip conductor of the same shape.
<a id="back-drilling"></a>
**Back-drilling** — Removing unused via stub portions on thick PCBs by drilling from the opposite side, reducing signal reflections.
<a id="backed-out-terminal"></a>
**Backed-out terminal** — A wire terminal that has slipped partially out of its connector housing, appearing connected but making intermittent or no electrical contact.


<a id="bacnet-mstp"></a>
**BACnet MSTP** — Building automation protocol using RS-485 for HVAC, lighting, and access control communication between controllers.
<a id="balun"></a>
**Balun** — Transformer converting between balanced and unbalanced impedances; used to interface balanced antennas to unbalanced transmission lines.

<a id="band-pass-filter"></a>
**Band-pass filter** — A filter that passes a range of frequencies between low and high cutoff points and attenuates outside that range. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="band-stop-filter"></a>
**Band-stop filter** — A filter that attenuates a specific range of frequencies while passing those above and below. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="bandgap-reference"></a>
**Bandgap reference** — A reference circuit exploiting complementary temperature coefficients to produce a temperature-stable output near 1.25 V. See [Reference Voltages]({{< relref "/docs/analog/power-and-regulation/reference-voltages" >}}).


<a id="bandpass-sampling"></a>
**Bandpass sampling** — Intentional undersampling of a narrowband signal to alias it to a lower frequency; requires a bandpass anti-alias filter.
<a id="bandwidth-limit"></a>
**Bandwidth limit** — An oscilloscope setting that engages a low-pass filter (typically 20 MHz) to reduce high-frequency noise on the displayed waveform.

<a id="bandwidth-shrinkage"></a>
**Bandwidth shrinkage** — The reduction in overall bandwidth when identical amplifier stages are cascaded. See [Multistage Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/multistage-amplifiers" >}}).

<a id="bare-metal"></a>
**Bare-metal** — Embedded firmware that runs without an operating system, managing all scheduling, resource allocation, and error recovery directly.

<a id="barkhausen-criterion"></a>
**Barkhausen criterion** — The condition for sustained oscillation: loop gain magnitude ≥ 1 and total phase shift = 360°. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}).


<a id="baseband"></a>
**Baseband** — The original frequency range of a signal before modulation; contrasted with the modulated carrier frequency.
<a id="basepri-register"></a>
**BASEPRI** — Cortex-M register that selectively disables interrupts below a configured priority level while allowing higher-priority interrupts to proceed.

<a id="baud-rate"></a>
**Baud rate** — The data rate of a serial interface, specified in bits per second.


<a id="baw-filter"></a>
**BAW filter** — Bulk acoustic wave filter using piezoelectric resonators, providing sharp selectivity at GHz frequencies.
<a id="beamforming"></a>
**Beamforming** — Controlling phase and amplitude of signals to multiple antenna elements to steer the radiation pattern electronically.

<a id="beamwidth"></a>
**Beamwidth** — Angular width of an antenna's main lobe, typically measured at the -3 dB half-power points.


<a id="bed-of-nails-fixture"></a>
**Bed-of-nails fixture** — Production test fixture using spring-loaded pogo pins contacting PCB test pads for automated electrical verification.
<a id="bessel-response"></a>
**Bessel response** — Filter response with the best phase linearity and minimal step-response overshoot. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="beta"></a>
**Beta (β)** — The DC current gain of a BJT, defined as I_C / I_B. Varies widely between devices even of the same type. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="bga"></a>
**BGA (Ball Grid Array)** — IC package with solder balls on the bottom surface instead of pins on the perimeter. High pin density but impossible to hand-solder and susceptible to thermal cycling fatigue.


<a id="bilinear-transform"></a>
**Bilinear transform** — Method for converting an analog filter design to a digital IIR filter, preserving magnitude response but warping the frequency axis.

<a id="biphase-mark-encoding"></a>
**Biphase mark encoding (BMC)** — Self-clocking line code with a transition at every bit boundary and a mid-bit transition for 1s; used in AES/EBU and S/PDIF.
<a id="bipolar-rails"></a>
**Bipolar rails** — Symmetrical positive and negative supply voltages (e.g., +/-35 V) used to power audio amplifier output stages.

<a id="biquad"></a>
**Biquad** — Second-order IIR filter section with 5 coefficients, commonly cascaded to build complex digital filters.


<a id="bit-clock"></a>
**Bit clock (BCLK)** — Serial clock in I2S/TDM that clocks each individual bit; rate equals sample rate times bits per sample times channels.
<a id="bit-banding"></a>
**Bit-banding** — Memory access technique on Cortex-M3 and M4 where each bit in a peripheral or SRAM region is aliased to a full 32-bit word, enabling atomic single-bit manipulation without read-modify-write.

<a id="bitstream"></a>
**Bitstream** — The binary configuration file that programs an FPGA's logic and routing.

<a id="bjt"></a>
**BJT (Bipolar Junction Transistor)** — A current-controlled semiconductor device with three terminals (base, collector, emitter) where small base current controls large collector current. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).



<a id="blackman-window"></a>
**Blackman window** — Window function with -58 dB sidelobes and wide main lobe; used when spectral dynamic range matters more than frequency resolution.
<a id="ble"></a>
**BLE** — Bluetooth Low Energy; low-duty-cycle wireless protocol for sensors, beacons, and IoT, introduced in Bluetooth 4.0.

<a id="ble-advertising"></a>
**BLE advertising** — BLE broadcast mode where a device transmits presence packets at configurable intervals before connection.
<a id="bleeder-resistor"></a>
**Bleeder resistor** — A resistor placed across a capacitor to safely discharge stored energy when power is removed.


<a id="block-processing"></a>
**Block processing** — DSP approach where samples are collected into fixed-size frames and processed as a group, trading latency for efficiency.
<a id="block-ram"></a>
**Block RAM (BRAM)** — Dedicated dual-port SRAM blocks in FPGAs, typically 18-36 kbit each.

<a id="bode-plot"></a>
**Bode plot** — A standard two-panel graph showing magnitude (dB) and phase (degrees) versus frequency on a logarithmic scale. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).

<a id="bodge-wire"></a>
**Bodge wire** — A jumper wire added to a PCB after assembly to correct a design error, add a missing connection, or repair a broken trace.

<a id="body-diode"></a>
**Body diode** — The parasitic diode between source and drain in a MOSFET, conducting when drain voltage goes below source. See [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}).

<a id="bom"></a>
**BOM** — Bill of Materials — the list of every component, quantity, and reference designator needed to build a PCB assembly.

<a id="boost-converter"></a>
**Boost converter** — Switching power supply topology that produces an output voltage higher than its input. Uses an inductor, switch, diode, and output capacitor.


<a id="boot-rom"></a>
**Boot ROM** — Immutable mask ROM in an SoC that runs first at power-on, loading the initial bootloader from boot media.
<a id="bootloader"></a>
**Bootloader** — Small program stored in protected flash that receives, validates, and installs new firmware images. Critical for field updates without physically accessing the device.


<a id="bootstrapping"></a>
**Bootstrapping** — Technique using a capacitor to raise the effective impedance of a bias network by feeding back the output signal, increasing gain.

<a id="boundary-scan"></a>
**Boundary scan** — JTAG-based test method (IEEE 1149.1) that verifies IC solder connections by toggling and reading I/O pins through the scan chain.
<a id="branch"></a>
**Branch** — A path between two nodes in a circuit, carrying a single current.

<a id="bridge-rectifier"></a>
**Bridge rectifier** — A four-diode configuration that converts AC to DC by conducting both polarities through two diodes each. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="bridged-mode"></a>
**Bridged mode** — Amplifier configuration where two channels drive opposite ends of a load, doubling the voltage swing and quadrupling the power into the load.

<a id="brownout-detection"></a>
**Brownout detection** — Hardware circuit that monitors supply voltage during operation and asserts reset if it drops below a configured threshold, preventing the MCU from executing corrupted instructions.



<a id="bsp"></a>
**BSP** — Board Support Package; vendor-supplied software bundle including bootloader, kernel, drivers, and configuration for a specific board.
<a id="bss138-level-shifter"></a>
**BSS138 level shifter** — Standard bidirectional level-translation circuit using a BSS138 N-channel MOSFET with pull-ups on both voltage domains.
<a id="buck-boost-converter"></a>
**Buck-boost converter** — Switching topology that can produce an output voltage either higher or lower than the input, with inverted polarity in the basic form.

<a id="buck-converter"></a>
**Buck converter** — Switching power supply topology that produces an output voltage lower than its input. The most common switching regulator topology.


<a id="buildroot"></a>
**Buildroot** — Build system generating minimal embedded Linux images from source for custom hardware.

<a id="bulk-transfer"></a>
**Bulk transfer** — USB transfer type for large non-time-critical data with error recovery; used by CDC serial and mass storage.
<a id="burden-voltage"></a>
**Burden voltage** — Voltage drop across an ammeter's internal shunt resistor. Inserted into the circuit being measured, which means the measurement itself affects the circuit. Lower burden voltage means less measurement error.

<a id="bus-contention"></a>
**Bus contention** — A fault condition where two or more drivers simultaneously assert conflicting levels on a shared bus, causing excess current and indeterminate logic levels.



<a id="bus-off"></a>
**Bus-off** — CAN error state where accumulated errors exceed 255, completely disconnecting the node from the bus.
<a id="busfault"></a>
**BusFault** — Cortex-M exception on failed bus transactions: unclocked peripherals, unmapped memory, or invalid DMA addresses.
<a id="butterworth-filter"></a>
**Butterworth filter** — Analog filter with maximally flat passband response; the default choice when predictable amplitude behavior is desired.

<a id="butterworth-response"></a>
**Butterworth response** — Filter response with maximally flat passband and monotonic roll-off, the most common general-purpose choice. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="bypass-capacitor"></a>
**Bypass capacitor** — Capacitor placed near an IC's power pins to supply instantaneous current demands and shunt high-frequency noise to ground. Functionally identical to a decoupling capacitor.

---

## C

<a id="c0g"></a>
**C0G / NP0** — Class I ceramic dielectric. The most stable ceramic capacitor type: negligible voltage coefficient, minimal temperature drift, no aging. Limited to small capacitance values. Use wherever stability matters.


<a id="calibration-plane"></a>
**Calibration plane** — The physical location where VNA calibration standards are connected, defining the measurement reference point.
<a id="can-bus"></a>
**CAN bus** — Message-based differential bus protocol designed for reliable multi-node communication in noisy environments. Uses CRC and automatic retransmission; requires an external transceiver.

<a id="can-fd"></a>
**CAN FD** — Extension of classic CAN allowing higher data-phase bit rates (up to 8 Mbps) and larger payloads (up to 64 bytes). Requires CAN FD-capable transceivers.


<a id="can-mailbox"></a>
**CAN mailbox** — Hardware transmit or receive buffer in the CAN peripheral, with priority-based arbitration by message ID.

<a id="can-transceiver"></a>
**CAN transceiver** — IC converting MCU-level CAN_TX/CAN_RX signals to differential CAN_H/CAN_L bus levels and vice versa.

<a id="canopen"></a>
**CANopen** — Industrial CAN application protocol defining PDOs, SDOs, NMT, and standard device profiles for automation equipment.

<a id="capacitance-hat"></a>
**Capacitance hat** — Horizontal conductor at an antenna tip that increases end capacitance, improving radiation resistance and efficiency.
<a id="capacitor-dry-out"></a>
**Capacitor dry-out** — Gradual evaporation of the liquid electrolyte in an electrolytic capacitor, causing ESR to rise and capacitance to drop over time, especially at elevated temperatures.

<a id="capacitor-reforming"></a>
**Capacitor reforming** — Gradually applying voltage to an old or long-stored electrolytic capacitor to rebuild its oxide dielectric layer before full operation.

<a id="carbon-composition"></a>
**Carbon composition resistor** — Vintage resistor type made from a solid slug of carbon and binder. Loose tolerance, high noise, poor stability — but handles surges well. Rarely used in new designs.

<a id="carry-lookahead"></a>
**Carry lookahead** — A fast adder technique that computes all carries in parallel instead of rippling through stages.

<a id="carsons-rule"></a>
**Carson's rule** — FM bandwidth approximation: BW ≈ 2 × (Δf + f_m), capturing about 98% of the FM signal power.

<a id="cascode"></a>
**Cascode** — A two-transistor configuration combining common-emitter with common-base to improve bandwidth and output impedance. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="cat-rating"></a>
**CAT rating** — IEC 61010 measurement category indicating the transient voltage environment an instrument is rated for, from CAT I (low energy) to CAT IV (utility entrance).


<a id="cavity-resonance"></a>
**Cavity resonance** — Resonant mode inside an enclosed conductive volume, with frequency determined by the cavity dimensions.
<a id="ccm-memory"></a>
**CCM memory** — Core Coupled Memory on some STM32 MCUs connected directly to the CPU and not accessible by DMA. Used for placing time-critical code and data.



<a id="centroid-file"></a>
**Centroid file** — Assembly data file listing each component's reference designator, X/Y coordinates, rotation, and board side for pick-and-place.

<a id="ceramic-filter"></a>
**Ceramic filter** — Piezoelectric bandpass filter using ceramic resonators, common at IF frequencies in consumer receivers.
<a id="cfsr"></a>
**CFSR** — Configurable Fault Status Register on Cortex-M3+, combining MemManage, BusFault, and UsageFault status bits.
<a id="characteristic-impedance"></a>
**Characteristic impedance (Z0)** — The impedance of a transmission line determined by its geometry and dielectric, typically 50 Ω or 100 Ω differential.

<a id="charge-injection"></a>
**Charge injection** — Transient voltage disturbance caused by capacitive coupling from the gate when a MOSFET switch toggles. See [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}).

<a id="charge-pump"></a>
**Charge pump** — A voltage converter using switched capacitors instead of inductors for energy transfer, simpler but lower power than inductor-based converters. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="chassis-ground"></a>
**Chassis ground** — Electrical connection to the equipment's metal chassis or frame. May or may not be connected to earth ground. Distinct from signal ground.

<a id="chebyshev-response"></a>
**Chebyshev response** — Filter response with steeper roll-off than Butterworth at the cost of passband ripple. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).



<a id="chip-antenna"></a>
**Chip antenna** — Miniature ceramic surface-mount antenna for PCB integration, trading efficiency for size.
<a id="chopper-amplifier"></a>
**Chopper amplifier** — Amplifier that modulates a DC signal to AC, amplifies in a 1/f-noise-free region, then demodulates; achieves microvolt offset.
<a id="chu-harrington-limit"></a>
**Chu-Harrington limit** — Fundamental physical limit stating that antenna size, bandwidth, and efficiency cannot all be maximized simultaneously; smaller antennas must sacrifice bandwidth or efficiency.


<a id="cic-filter"></a>
**CIC filter (CIC)** — Cascaded Integrator-Comb filter; efficient decimation/interpolation filter using only additions and subtractions, no multipliers.

<a id="circular-convolution"></a>
**Circular convolution** — Periodic convolution computed by the FFT; differs from linear convolution and causes wrap-around artifacts unless zero-padded.
<a id="circulator"></a>
**Circulator** — Three-port device directing RF energy from one port to the next in sequence; used for transmit/receive isolation.

<a id="clamp"></a>
**Clamp** — Protection component (typically a diode or TVS) that limits voltage excursions by conducting when a threshold is exceeded. Prevents overvoltage damage.

<a id="clamping"></a>
**Clamping** — Using a diode and capacitor to shift the DC level of an AC signal without changing its shape. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).



<a id="clapp-oscillator"></a>
**Clapp oscillator** — Variant of the Colpitts oscillator with improved frequency stability via an additional series capacitor in the tank.
<a id="class-ab-bias"></a>
**Class AB bias** — Bias scheme for push-pull output stages that keeps a small idle current flowing to eliminate crossover distortion.

<a id="class-d-amplifier"></a>
**Class-D amplifier** — Switching audio amplifier using PWM or PDM output stage at 85-95% efficiency; transistors operate fully on or off.
<a id="clipping"></a>
**Clipping** — Using diodes or other components to limit signal excursion by conducting when a threshold is exceeded. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).


<a id="clock-distribution-ic"></a>
**Clock distribution IC** — Dedicated chip that generates multiple synchronized clock outputs from a single reference with low added jitter.
<a id="clock-domain-crossing"></a>
**Clock domain crossing (CDC)** — A signal passing between circuits driven by different clocks.

<a id="clock-skew"></a>
**Clock skew** — The difference in clock arrival time between two points in a system.

<a id="clock-stretching"></a>
**Clock stretching** — An I2C feature where a slave device holds the clock line (SCL) low to pause communication while it processes data.

<a id="clock-tree"></a>
**Clock tree** — A balanced distribution network of buffers ensuring equal clock delay to all flip-flops.

<a id="clock-to-q-delay"></a>
**Clock-to-Q delay** — The propagation delay from a clock edge to when the flip-flop output changes.

<a id="closed-loop-gain"></a>
**Closed-loop gain** — The gain of a circuit with feedback applied, approximately 1/β when loop gain is large. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).


<a id="cma"></a>
**CMA** — Contiguous Memory Allocator; Linux kernel mechanism reserving physically contiguous RAM at boot for DMA buffers.
<a id="cmsis"></a>
**CMSIS** — ARM standard providing unified header files and runtime libraries for Cortex-M peripherals across different vendors.

<a id="cmos"></a>
**CMOS (Complementary Metal-Oxide-Semiconductor)** — A logic family built from complementary NMOS and PMOS transistor pairs, now dominant in digital design.


<a id="cmsis-dap"></a>
**CMSIS-DAP** — ARM's open-standard debug probe protocol; any vendor can implement it for SWD/JTAG debugging.

<a id="coefficient-quantization"></a>
**Coefficient quantization** — Rounding of digital filter coefficients to fixed-point representation; can shift poles and zeros, degrading IIR filters.

<a id="coherent-sampling"></a>
**Coherent sampling** — Setting a test signal frequency to fall exactly on an FFT bin center to eliminate spectral leakage without windowing.
<a id="cold-junction-compensation"></a>
**Cold junction compensation** — Correction applied to thermocouple measurements to account for the temperature of the measurement junction (cold junction) not being at 0 degrees C.

<a id="cold-solder-joint"></a>
**Cold solder joint** — A solder joint with poor wetting or incomplete reflow, often dull or grainy in appearance, causing intermittent or high-resistance connections.


<a id="collector-to-base-feedback"></a>
**Collector-to-base feedback** — Negative feedback resistor from collector to base that stabilizes the DC operating point against transistor beta variations.

<a id="collinear-antenna"></a>
**Collinear antenna** — Vertically stacked half-wave elements fed in phase to increase gain in the horizontal plane.

<a id="colpitts-oscillator"></a>
**Colpitts oscillator** — LC oscillator using a capacitive voltage divider for feedback, common in VHF/UHF applications.
<a id="common-base"></a>
**Common base** — A BJT amplifier with input at the emitter and output at the collector, providing current gain and high bandwidth. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="common-emitter"></a>
**Common emitter** — A BJT amplifier configuration with input at the base and output at the collector, providing voltage gain with phase inversion. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="common-gate"></a>
**Common gate** — A MOSFET amplifier with input at the source and output at the drain, analogous to common base. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="common-mode-noise"></a>
**Common-mode noise** — Noise voltage that appears equally on both signal conductors relative to ground, often from ground loops or radiated pickup.

<a id="common-mode-rejection"></a>
**Common-mode rejection** — An instrument's or amplifier's ability to ignore voltage that appears equally on both inputs. Measured as CMRR in decibels.

<a id="common-source"></a>
**Common source** — A MOSFET amplifier configuration with input at the gate and output at the drain, analogous to common emitter. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="comparator"></a>
**Comparator** — A circuit that compares two voltages and outputs a binary high or low result. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="composite-core"></a>
**Composite core** — Inductor core made from magnetic particles suspended in resin. Exhibits soft saturation — inductance decreases gradually with current rather than collapsing suddenly.

<a id="compression-point"></a>
**Compression point** — Input power level at which device gain drops 1 dB from linear; indicates onset of nonlinear behavior. Also called P1dB.


<a id="compute-module"></a>
**Compute module** — SoC + DRAM on a small board with edge connector, designed to plug into a custom carrier board for production use.

<a id="condenser-microphone"></a>
**Condenser microphone** — Microphone using a charged capacitive element; requires bias voltage or phantom power, typically higher output than dynamic mics.
<a id="conducted-emission"></a>
**Conducted emission** — Electromagnetic interference that travels along wires and cables rather than through the air.


<a id="conductive-gasket"></a>
**Conductive gasket** — Resilient conductive material used at enclosure seams to maintain RF shielding while allowing mechanical assembly.
<a id="conformal-coating"></a>
**Conformal coating** — Protective polymer layer applied over assembled PCBs to guard against moisture, dust, and contamination.


<a id="conjugate-match"></a>
**Conjugate match** — Impedance match where source and load impedances are complex conjugates, maximizing power transfer.
<a id="contact-cleaner"></a>
**Contact cleaner** — Solvent spray that removes oxidation and contamination from electrical contacts and connector pins to restore reliable connections.


<a id="contact-erosion"></a>
**Contact erosion** — Gradual wear of relay or switch contact surfaces from arcing and mechanical abrasion, leading to increased resistance or welding.

<a id="contactor"></a>
**Contactor** — Heavy-duty relay rated for switching high-power loads such as motors and heaters, with arc suppression contacts.
<a id="context-switching"></a>
**Context switching** — Saving one task's CPU registers and stack pointer and loading another task's context. Essential for RTOS multitasking; costs 2–10 microseconds on Cortex-M.

<a id="controlled-impedance"></a>
**Controlled impedance** — PCB traces designed with specific width and spacing relative to the ground plane to achieve a target characteristic impedance. See [Layout & Parasitics]({{< relref "/docs/analog/noise-stability-reality/layout-and-parasitics" >}}).

<a id="conventional-current"></a>
**Conventional current** — The standard engineering convention: current flows from positive to negative. Opposite to actual electron flow but universally used in circuit analysis and schematics.

<a id="conversion-loss"></a>
**Conversion loss** — Power loss through a passive mixer, typically 5-8 dB for diode ring mixers.


<a id="cooperative-scheduling"></a>
**Cooperative scheduling** — Task scheduling where each task voluntarily yields by returning; no preemption, requires disciplined task design.
<a id="copper-pour"></a>
**Copper pour** — Large area of copper on a PCB layer, typically connected to ground or power. Serves as a heatsink, improves return current paths, and reduces EMI.

<a id="coplanar-waveguide"></a>
**Coplanar waveguide** — Transmission line with signal trace and ground conductors on the same PCB plane; allows easy grounding of surface-mount components.


<a id="copper-weight"></a>
**Copper weight** — PCB copper thickness specified in oz/ft-squared; 1 oz equals 35 um, determining current capacity and trace width limits.

<a id="copper-clad-board"></a>
**Copper-clad board** — FR4 laminate with a copper layer bonded to one or both sides, used as substrate for PCBs and prototyping ground planes.
<a id="corner-frequency-noise"></a>
**Corner frequency (noise)** — The frequency below which flicker noise exceeds white noise in a device's noise spectrum. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="cortex-m"></a>
**Cortex-M** — ARM's family of 32-bit processor cores designed for microcontroller use. Includes M0, M0+, M3, M4, M4F, and M7 variants with progressively higher performance and features.

<a id="coulomb"></a>
**Coulomb (C)** — SI unit of electric charge. One coulomb equals one ampere flowing for one second.

<a id="counter"></a>
**Counter** — A register that increments or decrements its value on each clock cycle.


<a id="counterpoise"></a>
**Counterpoise** — A set of conductors beneath or around an antenna serving as a ground reference, typically radial wires.
<a id="coupling-capacitor"></a>
**Coupling capacitor** — Capacitor in series with a signal path that passes AC while blocking DC. Sets the low-frequency cutoff of the coupled path.

<a id="coupling-factor"></a>
**Coupling factor** — In a directional coupler, the ratio of coupled port power to input power in dB.

<a id="cpha"></a>
**CPHA** — SPI Clock Phase — determines whether data is sampled on the leading (0) or trailing (1) clock edge.

<a id="cpld"></a>
**CPLD (Complex Programmable Logic Device)** — Multiple PLD blocks on a single chip connected by a programmable routing matrix.

<a id="cpol"></a>
**CPOL** — SPI Clock Polarity — determines the idle state of the SPI clock line (0 = idle low, 1 = idle high).

<a id="crc-check"></a>
**CRC** — Cyclic Redundancy Check — error detection code computed over data to verify integrity in communication, firmware images, and stored configuration.


<a id="creepage-and-clearance"></a>
**Creepage and clearance** — Minimum PCB distances required for safety isolation; creepage is along surfaces, clearance is through air.
<a id="crest-factor"></a>
**Crest factor** — Ratio of peak to RMS amplitude; varies by waveform and determines headroom requirements.

<a id="critical-path"></a>
**Critical path** — The longest propagation delay path between any two flip-flops, limiting maximum clock frequency.


<a id="cross-compilation"></a>
**Cross-compilation** — Compiling code on a host machine that produces binaries for a different target architecture.

<a id="cross-polarization-loss"></a>
**Cross-polarization loss** — Signal loss when the transmit and receive antennas have different polarization orientations.
<a id="crossover-distortion"></a>
**Crossover distortion** — Distortion in push-pull output stages caused by both transistors being off near the zero-crossing of the signal. See [Operating Regions]({{< relref "/docs/analog/biasing-operating-points/operating-regions" >}}).

<a id="crosstalk"></a>
**Crosstalk** — Unintended signal coupling between adjacent conductors through parasitic capacitance or mutual inductance. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="crystal-oscillator"></a>
**Crystal oscillator** — A quartz crystal vibrating at a precise mechanical frequency, used as a clock source.


<a id="cte"></a>
**CTE** — Coefficient of thermal expansion; rate at which a material's dimensions change with temperature, measured in ppm/°C.
<a id="curie-temperature"></a>
**Curie temperature** — Temperature above which a ferroelectric ceramic's dielectric properties degrade sharply. Relevant to Class II/III ceramic capacitors.

<a id="current-clamp-probe"></a>
**Current clamp probe** — A probe that measures current by sensing the magnetic field around a conductor without breaking the circuit.


<a id="current-transfer-ratio"></a>
**Current transfer ratio (CTR)** — Ratio of optocoupler output current to input LED current; degrades over time as the internal LED dims from aging.
<a id="current-limited-power-up"></a>
**Current-limited power-up** — First applying power through a current-limited bench supply after repair, so that a remaining short draws only the set limit instead of causing cascading damage.


<a id="current-sense-amplifier"></a>
**Current-sense amplifier** — Dedicated IC that measures voltage across a shunt resistor and outputs a ground-referenced signal proportional to current flow.

<a id="current-steering-dac"></a>
**Current-steering DAC** — High-speed DAC using matched current sources steered to output or dummy load by differential switches.
<a id="cut-trace"></a>
**Cut trace** — A PCB trace intentionally severed, usually as a rework modification. Should be documented on the schematic and in revision notes.

<a id="cutoff-frequency"></a>
**Cutoff frequency (f_c)** — The frequency at which a filter's response is 3 dB below the passband level. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="cycle-to-cycle-jitter"></a>
**Cycle-to-cycle jitter** — The difference in duration between two adjacent clock periods, capturing short-term timing variation.

---

## D

<a id="d-flip-flop"></a>
**D flip-flop** — An edge-triggered memory element that captures the D input on a clock edge and holds it until the next edge.

<a id="d-latch"></a>
**D latch** — A latch controlled by a data input and enable signal, transparent when enable is active.

<a id="danl"></a>
**DANL (Displayed Average Noise Level)** — Noise floor of a spectrum analyzer at a given resolution bandwidth and reference level.


<a id="darlington-pair"></a>
**Darlington pair** — Two cascaded transistors giving very high current gain; trades voltage headroom (two V_BE drops) for input sensitivity.



<a id="data-dependent-jitter"></a>
**Data-dependent jitter (DDJ)** — Deterministic jitter caused by bandwidth limitations and intersymbol interference on clock/data paths.
<a id="db-25-connector"></a>
**DB-25 connector (DB-25)** — 25-pin D-subminiature connector used for RS-232 serial and PC parallel ports in legacy systems.
<a id="db-9-connector"></a>
**DB-9 connector (DB-9)** — 9-pin D-subminiature connector commonly used for RS-232 serial ports on PCs and test equipment.

<a id="dbc-file"></a>
**DBC file** — De facto standard file format describing CAN message layouts: signal positions, scaling factors, and units.


<a id="dbd"></a>
**dBd** — Decibels relative to a half-wave dipole, a common reference for antenna gain measurements.

<a id="dbi"></a>
**dBi** — Decibels relative to an isotropic radiator, the standard reference for absolute antenna gain.
<a id="dc-bias-derating"></a>
**DC bias derating** — Reduction in ceramic capacitor effective capacitance when DC voltage is applied, especially severe in X7R and Y5V.
<a id="dc-bias-effect"></a>
**DC bias effect** — Loss of capacitance in ceramic capacitors when DC voltage is applied. Class II ceramics (X5R, X7R) can lose 50% or more of their rated capacitance at rated voltage. Widely underappreciated.

<a id="dc-biasing"></a>
**DC biasing** — The process of setting the DC operating point of an active device to ensure it operates in the correct region for signal amplification. See [DC Biasing]({{< relref "/docs/analog/biasing-operating-points/dc-biasing" >}}).

<a id="dc-coupling"></a>
**DC coupling** — Signal path that passes all frequencies including DC. The default coupling mode on oscilloscopes.


<a id="dc-operating-point"></a>
**DC operating point** — SPICE analysis solving for steady-state voltages and currents at every node with specified supply voltages applied.
<a id="dc-restoration"></a>
**DC restoration** — Another term for clamping, used especially in video circuits. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="dc-offset"></a>
**DC offset** — Unwanted DC voltage present at an amplifier output that should be at zero volts with no signal applied; excessive DC offset can damage speakers or downstream loads.


<a id="dce"></a>
**DCE** — Data Communications Equipment; in RS-232, the device that transmits on pin 2 and receives on pin 3.
<a id="dcr"></a>
**DCR (DC Resistance)** — The resistance of an inductor's winding measured at DC. Determines I²R power loss and heat generation.

<a id="dbfs"></a>
**dBFS** — Decibels Full Scale — reference scale in digital audio where 0 dBFS represents the maximum representable digital value.

<a id="dbm"></a>
**dBm** — Power measured in decibels referenced to 1 milliwatt. 0 dBm = 1 mW. Used extensively in RF and communication systems.

<a id="dbu"></a>
**dBu** — Voltage in decibels referenced to 0.775 V (the voltage that produces 1 mW into 600 Ω). Standard in professional audio.

<a id="dbv"></a>
**dBV** — Voltage in decibels referenced to 1 volt.

<a id="dct"></a>
**DCT (Discrete Cosine Transform)** — Real-valued transform used in audio and image compression, more energy-compacting than DFT for typical signals.



<a id="de-emphasis"></a>
**De-emphasis** — Receiver-side high-frequency attenuation that complements transmitter pre-emphasis, equalizing FM noise spectrum for improved SNR.
<a id="dead-code-elimination"></a>
**Dead code elimination** — Linker optimization that discards unreferenced functions and data sections, saving flash space.
<a id="dead-time"></a>
**Dead time** — The interval between turning off one MOSFET and turning on the complementary MOSFET in a bridge circuit to prevent shoot-through. See [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}).


<a id="dead-bug-construction"></a>
**Dead-bug construction** — Prototyping method where ICs are soldered upside-down on a copper ground plane with point-to-point wire connections.
<a id="dead-time-insertion"></a>
**Dead-time insertion** — Hardware delay between one half-bridge output turning off and the complementary output turning on. Prevents shoot-through in motor drivers and power converters.

<a id="de-embedding"></a>
**De-embedding** — Mathematically removing cable, connector, and fixture effects from a measurement to isolate the device under test.



<a id="deadlock"></a>
**Deadlock** — Condition where two or more tasks each hold a resource the other needs, causing all to block permanently.
<a id="death-cap"></a>
**Death cap** — Capacitor in hot-chassis equipment between mains and chassis that, if it shorts, puts lethal mains voltage on the enclosure.
<a id="debounce"></a>
**Debounce** — Technique for stabilizing noisy digital inputs by sampling multiple times and recognizing a transition only after a consistent state duration.

<a id="debug-access-port"></a>
**Debug Access Port** — ARM CoreSight interface providing halt, inspect, and modify access to CPU state through JTAG or SWD connections.

<a id="decimation"></a>
**Decimation** — Reducing sample rate by filtering and downsampling; removes high-frequency content and reduces data rate.

<a id="decoder"></a>
**Decoder** — A combinational circuit that activates one of 2^n outputs based on an n-bit input code.

<a id="decoupling"></a>
**Decoupling** — Placing capacitors near IC power pins to supply instantaneous switching current and prevent noise from propagating through the power distribution network.

<a id="delay-spread"></a>
**Delay spread** — Difference in propagation time between first-arriving and last significant signal component; causes frequency-selective fading.

<a id="delamination"></a>
**Delamination** — Separation of PCB laminate layers caused by excessive heat, moisture absorption, or mechanical stress, compromising board structural and electrical integrity.


<a id="delta-sigma-adc"></a>
**Delta-sigma ADC** — Oversampling converter using a noise-shaping feedback loop and digital decimation to achieve high resolution at moderate output rates.
<a id="delta-wye"></a>
**Delta-wye (Δ-Y) transformation** — Mathematical technique for converting between triangle (delta) and star (wye) resistor network topologies. Necessary for analyzing circuits that aren't purely series or parallel.

<a id="de-morgans-theorem"></a>
**De Morgan's Theorem** — The complement of AND is OR with complemented inputs, and vice versa.


<a id="demand-paging"></a>
**Demand paging** — Virtual memory technique where physical pages are allocated only when first accessed, triggering a page fault.
<a id="dependent-source"></a>
**Dependent source** — A voltage or current source whose value is controlled by another voltage or current elsewhere in the circuit. Models transistors and op-amps in circuit analysis.

<a id="depletion-mode-mosfet"></a>
**Depletion-mode MOSFET** — A MOSFET that is normally on, conducting with zero gate voltage. See [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}).

<a id="derating"></a>
**Derating** — Reducing a component's maximum allowable power, voltage, or current as operating conditions (typically temperature) move away from the rated conditions. Essential for reliable designs.

<a id="desoldering-pump"></a>
**Desoldering pump** — Spring-loaded vacuum tool that sucks molten solder from through-hole joints, used for component removal.

<a id="determinism"></a>
**Determinism** — Property that execution meets timing deadlines predictably. Hard real-time systems require deterministic behavior under worst-case conditions.

<a id="deterministic-jitter"></a>
**Deterministic jitter** — Jitter with identifiable causes and bounded amplitude, including data-dependent, periodic, and duty-cycle distortion components.


<a id="device-tree-blob"></a>
**Device tree blob** — Compiled binary describing SoC and board hardware, passed to the Linux kernel at boot for device discovery.

<a id="device-tree-overlay"></a>
**Device tree overlay** — Patch modifying the base device tree at boot to enable add-on hardware like HATs or capes.


<a id="dfa"></a>
**DFA** — Design for Assembly; layout practices that simplify and improve component placement and soldering reliability.

<a id="dfm"></a>
**DFM** — Design for Manufacturing; practice of making layout decisions that satisfy PCB fabrication process constraints and improve yield.
<a id="dft"></a>
**DFT** — Discrete Fourier Transform; converts N time-domain samples into N frequency-domain values; the FFT is an efficient algorithm for computing it.

<a id="dft-design"></a>
**DFT (design)** — Design for Test; building measurement access points and debug features into a circuit from the start of schematic design.
<a id="di-box"></a>
**DI box** — Direct Injection box — an audio device using a transformer or active circuit to convert unbalanced high-impedance signals to balanced low-impedance, breaking ground loops.

<a id="dielectric"></a>
**Dielectric** — Insulating material between capacitor plates that determines capacitance, voltage rating, stability, and loss characteristics.

<a id="dielectric-absorption"></a>
**Dielectric absorption** — The tendency of a capacitor to recover a portion of its charge after being briefly discharged, also called soakback.

<a id="dielectric-constant"></a>
**Dielectric constant** — Property of an insulating material affecting electromagnetic wave speed and impedance; also called relative permittivity.



<a id="dielectric-loading"></a>
**Dielectric loading** — Shift in resonant frequency caused by nearby dielectric material slowing electromagnetic wave velocity.
<a id="difference-amplifier"></a>
**Difference amplifier** — Op-amp circuit that outputs the amplified difference between two input voltages; converts differential signals to single-ended.
<a id="differential-pair"></a>
**Differential pair** — Two matched transistors with tied emitters or sources driven by a common current source, the fundamental building block of analog ICs. See [Multistage Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/multistage-amplifiers" >}}).

<a id="differential-probe"></a>
**Differential probe** — An oscilloscope probe that measures the voltage difference between two points, neither of which needs to be ground.

<a id="differential-mode-noise"></a>
**Differential-mode noise** — Noise voltage that appears between the two signal conductors, indistinguishable from the wanted signal and harder to filter without affecting the signal.

<a id="diffraction"></a>
**Diffraction** — Bending of electromagnetic waves around obstacles or edges; more pronounced at lower frequencies where wavelength is larger.



<a id="digital-clipping"></a>
**Digital clipping** — Hard distortion when a digital signal reaches 0 dBFS; samples clamp with no gradual onset, producing harsh odd harmonics.

<a id="digital-ground"></a>
**Digital ground (DGND)** — Return path for digital logic circuits, separated from analog ground to prevent switching noise coupling.
<a id="digital-isolator"></a>
**Digital isolator** — IC using capacitive or magnetic coupling to transfer digital signals across a galvanic isolation barrier without LED degradation.
<a id="dim-bulb-tester"></a>
**Dim bulb tester** — A series incandescent light bulb wired inline with a power input that limits fault current and provides a visual indicator — glows brightly if the DUT is shorted.

<a id="diode-check"></a>
**Diode check** — DMM test mode that forward-biases a junction and displays the voltage drop, used to verify transistor junctions and identify shorted or open semiconductor devices.


<a id="diode-ring-mixer"></a>
**Diode ring mixer** — Passive mixer using four matched diodes in a ring, providing good linearity and no DC power requirement.
<a id="diode-test-mode"></a>
**Diode test mode** — DMM mode that forces a small current through a semiconductor junction and displays the forward voltage drop, useful for checking diodes and BJT junctions.

<a id="diplexer"></a>
**Diplexer** — Device separating or combining signals of different frequency ranges into shared ports.


<a id="direct-sampling"></a>
**Direct sampling** — SDR architecture that digitizes the RF signal directly without analog frequency conversion.
<a id="directional-coupler"></a>
**Directional coupler** — Transmission line component sampling a fraction of signal power from the main path for monitoring or measurement.

<a id="directivity"></a>
**Directivity** — Ratio of antenna radiation intensity in the maximum direction to that of an isotropic source.


<a id="discone-antenna"></a>
**Discone antenna** — Wideband omnidirectional antenna shaped like a disc over a cone, commonly used for scanning receivers.
<a id="display-counts"></a>
**Display counts** — The maximum number a DMM can show on its display (e.g., 6000 counts for a 3 3/4-digit meter), determining resolution on each range.


<a id="distributed-element"></a>
**Distributed element** — A circuit element whose physical dimensions are significant relative to a wavelength, requiring transmission line analysis.
<a id="dither"></a>
**Dither** — Intentionally added noise before quantization that randomizes quantization error, converting distortion into perceptually preferable noise.


<a id="dithering"></a>
**Dithering** — Adding small noise before quantization to randomize rounding error, converting audible distortion into benign broadband noise.
<a id="divide-and-conquer"></a>
**Divide and conquer** — Fault isolation strategy that splits the signal chain at a midpoint and tests each half, halving the search space with each measurement.

<a id="dma"></a>
**DMA** — Direct Memory Access — hardware engine that moves data between peripherals and memory without CPU intervention, essential for high-throughput and continuous data streams.


<a id="dmamux"></a>
**DMAMUX** — DMA request multiplexer allowing flexible mapping of any peripheral DMA request to any DMA channel.
<a id="dmm"></a>
**DMM (Digital Multimeter)** — The fundamental bench instrument for measuring voltage, current, and resistance. Quality varies enormously — input impedance, accuracy, and safety ratings all matter.



<a id="dmsms"></a>
**DMSMS** — Diminishing Manufacturing Sources and Material Shortages; formal discipline for managing component obsolescence in long-life systems.
<a id="dmx512"></a>
**DMX512 (DMX)** — Serial lighting control protocol using RS-485 physical layer to address up to 512 dimmer or fixture channels.
<a id="dnl"></a>
**DNL (Differential Non-Linearity)** — Variation in ADC/DAC step size between adjacent codes; DNL > 1 LSB means missing codes.

<a id="dominant-pole-compensation"></a>
**Dominant pole compensation** — Adding a low-frequency pole (usually a capacitor) to ensure gain drops below unity before phase accumulates to 360°. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}).

<a id="doppler-shift"></a>
**Doppler shift** — Change in signal frequency due to relative motion between transmitter and receiver.

<a id="dot-convention"></a>
**Dot convention** — Dots placed on transformer winding symbols to indicate which terminals have the same instantaneous polarity. Essential for understanding phase relationships.


<a id="double-buffering"></a>
**Double buffering** — Technique using two alternating buffers so one fills with new data while the other is processed, enabling continuous real-time streaming.

<a id="double-balanced-mixer"></a>
**Double-balanced mixer** — Mixer topology rejecting both LO and RF feedthrough, providing superior port isolation.
<a id="drag-soldering"></a>
**Drag soldering** — Technique for soldering fine-pitch IC pins by dragging a fluxed, lightly tinned iron tip across the row of pins, relying on surface tension to keep solder on the pads.

<a id="drive-strength"></a>
**Drive strength** — The amount of current a logic output can source or sink.

<a id="dropout-voltage"></a>
**Dropout voltage** — The minimum difference between input and output voltage required for a regulator to maintain regulation. See [Linear Regulators]({{< relref "/docs/analog/power-and-regulation/linear-regulators" >}}).


<a id="dsb-sc"></a>
**DSB-SC** — Double Sideband Suppressed Carrier; AM variant transmitting both sidebands but no carrier, requiring coherent demodulation.
<a id="dsp-block"></a>
**DSP block** — Dedicated multiply-accumulate hardware units in FPGAs for signal processing operations.


<a id="dte"></a>
**DTE** — Data Terminal Equipment; in RS-232, the device that transmits on pin 3 and receives on pin 2.


<a id="dual-footprint"></a>
**Dual footprint** — PCB layout technique placing overlapping or adjacent pads for two package options at the same component position.
<a id="dual-bank-flash"></a>
**Dual-bank flash** — MCU flash organized as two independent banks, enabling firmware update of one bank while executing from the other.
<a id="dummy-load"></a>
**Dummy load** — A resistive load that substitutes for the real load (such as a speaker) during bench testing, providing a known, stable impedance for repeatable measurements.

<a id="duplexer"></a>
**Duplexer** — Device allowing simultaneous transmission and reception on the same antenna by separating transmit and receive frequency bands.

<a id="dut"></a>
**DUT** — Device Under Test — the circuit, board, or component being debugged, measured, or verified.

<a id="duty-cycle"></a>
**Duty cycle** — The fraction of time the main switch is on in a switching regulator, determining the input-to-output voltage ratio. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).



<a id="duty-cycle-distortion"></a>
**Duty-cycle distortion (DCD)** — Clock jitter from asymmetry between rising and falling edge timing, causing unequal high and low periods.
<a id="dwt"></a>
**DWT** — Data Watchpoint and Trace unit on Cortex-M providing watchpoints and cycle counting for debug and profiling.

<a id="dynamic-microphone"></a>
**Dynamic microphone** — Microphone generating signal through electromagnetic induction; needs 40-60 dB of clean gain, no phantom power.
<a id="dynamic-range"></a>
**Dynamic range** — Ratio between the largest undistorted signal and the smallest detectable signal, accounting for noise floor and clipping.

<a id="dynamic-resistance"></a>
**Dynamic resistance** — The slope of the I-V curve at a specific operating point (dV/dI). Describes the small-signal behavior of nonlinear devices like diodes and LEDs.

---

## E

<a id="early-effect"></a>
**Early effect** — The slight increase in collector current with higher V_CE caused by base-width modulation. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="early-voltage"></a>
**Early voltage** — A transistor parameter (V_A) that represents the extrapolated voltage at which collector current would become zero. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="earth-ground"></a>
**Earth ground** — Physical connection to the earth, typically through the building's grounding system. Provides a safety reference and a path for fault current.


<a id="eco"></a>
**ECO** — Engineering Change Order; formal process for proposing, reviewing, approving, and documenting a design modification.
<a id="eddy-current-loss"></a>
**Eddy current loss** — Power dissipated by circulating currents induced in a conductive core by the changing magnetic field. Increases with frequency. Reduced by using laminated or ferrite core materials.

<a id="eeprom"></a>
**EEPROM** — Electrically Erasable Programmable Read-Only Memory — non-volatile byte-addressable memory with high endurance (100k–1M cycles), used for configuration storage.

<a id="effective-aperture"></a>
**Effective aperture** — Equivalent area of a receiving antenna that captures incoming wave power; relates to gain via A_e = Gλ²/4π.

<a id="eirp"></a>
**EIRP (Effective Isotropic Radiated Power)** — Equivalent power an isotropic radiator would need to produce the same field strength as the actual antenna.


<a id="electrical-length"></a>
**Electrical length** — Length of a conductor expressed in wavelengths or degrees of phase shift at a given frequency.
<a id="electrolytic-capacitor"></a>
**Electrolytic capacitor** — Polarized capacitor using a liquid or polymer electrolyte to achieve high capacitance density. Limited lifetime — the electrolyte dries out over time, especially at elevated temperature.

<a id="electron-flow"></a>
**Electron flow** — The physical movement of electrons from negative to positive. Opposite to conventional current direction. Used in some educational contexts but not in standard engineering practice.


<a id="elf"></a>
**ELF** — Executable and Linkable Format; standard binary format containing code, debug symbols, and section metadata.
<a id="elliptic-filter"></a>
**Elliptic filter** — Analog filter with steepest rolloff for a given order, but with ripple in both passband and stopband. Also called Cauer filter.


<a id="em-simulation"></a>
**EM simulation** — Electromagnetic field simulation that solves Maxwell's equations on physical geometry to predict RF behavior.
<a id="emc"></a>
**EMC (Electromagnetic Compatibility)** — Ability of a device to function without causing or being affected by electromagnetic interference.

<a id="emi"></a>
**EMI (Electromagnetic Interference)** — Unwanted electromagnetic energy disrupting electronic equipment operation.

<a id="emitter-degeneration"></a>
**Emitter degeneration** — An unbypassed emitter resistor that provides negative feedback, stabilizing gain at the cost of reduced voltage gain. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="emitter-follower"></a>
**Emitter follower** — A BJT buffer configuration (common collector) with unity voltage gain and low output impedance. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).


<a id="emitter-coupled-logic"></a>
**Emitter-coupled logic (ECL)** — Very fast bipolar logic family using differential pairs with non-saturating transistors; used in high-speed computing and RF.
<a id="encoder"></a>
**Encoder** — A combinational circuit that converts one-hot inputs to a binary code.


<a id="end-effect"></a>
**End effect** — Charge accumulation at antenna element tips that makes the antenna electrically longer than its physical length.
<a id="endianness"></a>
**Endianness** — Byte ordering in multi-byte values. ARM Cortex-M is configurable but almost always little-endian; AVR is inherently little-endian.

<a id="enhancement-mode-mosfet"></a>
**Enhancement-mode MOSFET** — A MOSFET that is normally off, requiring gate voltage above threshold to conduct. See [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}).

<a id="enob"></a>
**ENOB** — Effective Number of Bits — actual useful resolution of an ADC after accounting for noise, typically 1–2 bits less than the stated resolution.


<a id="envelope-detector"></a>
**Envelope detector** — Simple AM demodulator using a diode and capacitor to follow the carrier's amplitude envelope; no frequency reference needed.

<a id="eol"></a>
**EOL** — End of Life; manufacturer status indicating a last-time-buy date after which a component will no longer be produced.
<a id="equal-loudness-contour"></a>
**Equal-loudness contour** — Graph showing how human hearing sensitivity varies with frequency at different listening levels.

<a id="equalization"></a>
**Equalization** — Compensation for frequency-dependent channel loss using transmitter and/or receiver techniques.

<a id="equivalent-resistance"></a>
**Equivalent resistance** — A single resistance value that replaces a series, parallel, or complex combination of resistors for analysis purposes.


<a id="ethernet-mac"></a>
**Ethernet MAC** — Media Access Controller handling Ethernet frame assembly, CRC, and media access; connects to an external PHY.

<a id="ethernet-phy"></a>
**Ethernet PHY** — Physical layer transceiver handling analog signaling, link negotiation, and transformer-coupled Ethernet interface.


<a id="evaluation-board"></a>
**Evaluation board (EVB)** — Vendor-built PCB demonstrating a specific IC in a tested configuration, used for prototyping and characterization.
<a id="even-harmonics"></a>
**Even harmonics** — Distortion products at 2nd, 4th, 6th multiples of the fundamental; perceived as warm, characteristic of tube amplifier clipping.
<a id="error-vector-magnitude"></a>
**EVM (Error Vector Magnitude)** — Measure of modulated signal quality by distance between ideal and actual symbol positions in the constellation.

<a id="esd-protection"></a>
**ESD protection** — Using clamping diodes to steer electrostatic discharge current away from sensitive inputs. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="esl"></a>
**ESL (Equivalent Series Inductance)** — Parasitic inductance in a capacitor from its leads, internal connections, and plate geometry. Determines the self-resonant frequency.

<a id="esr"></a>
**ESR (Equivalent Series Resistance)** — The effective series resistance inside a capacitor, representing all resistive losses. Causes real power dissipation and limits the capacitor's ability to supply fast transients.

<a id="esr-meter"></a>
**ESR meter** — Test instrument that measures equivalent series resistance of capacitors, essential for detecting dried-out electrolytics that a basic capacitance meter would miss.

<a id="etm-trace"></a>
**ETM** — Embedded Trace Macrocell — ARM CoreSight feature recording every instruction the CPU executes. Requires an expensive trace-capable debug probe and board design support.

<a id="event-queue"></a>
**Event queue** — Ring buffer where ISRs push events and the main loop dequeues and processes them, decoupling interrupt timing from application logic.


<a id="excellon-drill-file"></a>
**Excellon drill file** — Standard format file specifying PCB hole locations, sizes, and plating requirements for CNC drilling.
<a id="eye-diagram"></a>
**Eye diagram** — A visual representation of signal quality at the receiver, showing timing and voltage margins.

---

## F

<a id="f-knee"></a>
**f_knee** — The frequency below which a signal's spectral content is negligible, approximated as 0.5 / rise_time for digital signals.


<a id="falstad-simulator"></a>
**Falstad simulator** — Browser-based circuit simulator with animated current flow and real-time waveforms, useful for learning and quick experiments.
<a id="farad"></a>
**Farad (F)** — SI unit of capacitance. One farad stores one coulomb at one volt. Practical capacitors range from picofarads to millifarads.

<a id="fan-out"></a>
**Fan-out** — The number of inputs a logic output can drive while maintaining valid logic levels.

<a id="far-field"></a>
**Far-field region** — Region beyond 2D²/λ from an antenna where the radiation pattern is stable and free-space propagation models apply.


<a id="faraday-rotation"></a>
**Faraday rotation** — Rotation of a linearly polarized wave's plane as it passes through a magnetized medium like the ionosphere.
<a id="fast-recovery-diode"></a>
**Fast-recovery diode** — A diode optimized for low reverse recovery time, suitable for switching power supply applications. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="feedback-fraction"></a>
**Feedback fraction (β)** — The portion of the output signal returned to the input through the feedback network. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).

<a id="feedthrough-capacitor"></a>
**Feedthrough capacitor** — A capacitor designed to mount through a shielding wall, filtering signals as they pass between shielded compartments.

<a id="ferrite-bead"></a>
**Ferrite bead** — A frequency-dependent resistive component used in series with supply traces to attenuate high-frequency noise while passing DC. See [Decoupling & Bypassing]({{< relref "/docs/analog/power-and-regulation/decoupling-and-bypassing" >}}).

<a id="ferrite-core"></a>
**Ferrite core** — Ceramic magnetic core material made from iron oxide compounds. Low eddy current loss at high frequencies but exhibits hard saturation — inductance drops abruptly when the current limit is exceeded.

<a id="fft"></a>
**FFT (Fast Fourier Transform)** — Efficient algorithm computing the Discrete Fourier Transform in O(N log N) operations instead of O(N²).

<a id="fhss"></a>
**FHSS (Frequency Hopping Spread Spectrum)** — Technique where the carrier frequency changes pseudorandomly within a band for anti-jamming and coexistence.


<a id="fiducial"></a>
**Fiducial** — Small copper mark on a PCB used by pick-and-place machines to establish board position and alignment during assembly.
<a id="fifo-buffer"></a>
**FIFO buffer** — First-In-First-Out hardware buffer on peripherals (UART, SPI, I2C) that stores data temporarily, reducing interrupt frequency during bursts.

<a id="film-capacitor"></a>
**Film capacitor** — Capacitor using plastic film as the dielectric. Excellent stability, low losses, self-healing under minor breakdown. Larger than ceramics for equivalent capacitance.

<a id="filter-order"></a>
**Filter order** — The number of poles in a filter, determining the asymptotic roll-off rate at 20 dB/decade per pole. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).


<a id="filter-tap"></a>
**Filter tap** — A single delay-and-multiply element in an FIR filter; the number of taps determines the filter length and computational cost.
<a id="fir-filter"></a>
**FIR filter (Finite Impulse Response)** — Digital filter computing each output as a weighted sum of current and past input samples; always stable with potential for linear phase.

<a id="firmware"></a>
**Firmware** — Software program running on an embedded device, stored in flash memory and executed from power-on.


<a id="first-article-inspection"></a>
**First-article inspection (FAI)** — Thorough verification of the first assembled unit in a production run to confirm correct component placement.
<a id="five-senses-check"></a>
**Five senses check** — Pre-measurement triage step using sight, smell, hearing, touch, and context to identify obvious faults before powering up or probing.


<a id="flash-adc"></a>
**Flash ADC** — Parallel-comparator converter resolving all bits simultaneously; fastest architecture but limited to 6-8 bits by exponential comparator count.
<a id="flash-memory"></a>
**Flash memory** — Non-volatile memory where firmware code and read-only data are stored. Requires erase-then-program cycles for modification; access time typically 20–30 ns.

<a id="flash-wait-states"></a>
**Flash wait states** — Stall cycles inserted by the flash controller when the CPU clock exceeds flash access speed. Must be configured before increasing clock frequency.

<a id="flat-schematic"></a>
**Flat schematic** — Multi-sheet schematic where all sheets exist at the same hierarchy level, connected by net names. Simpler than hierarchical schematics but harder to navigate in large designs.

<a id="flat-top-window"></a>
**Flat-top window** — Windowing function optimized for accurate amplitude measurement in spectral analysis at the cost of poor frequency resolution.

<a id="fletcher-munson-curves"></a>
**Fletcher-Munson curves** — Equal-loudness contours showing that human hearing is most sensitive in the 2–5 kHz range and less sensitive at very low and high frequencies.

<a id="flicker-noise"></a>
**Flicker noise (1/f noise)** — Noise whose power spectral density increases at lower frequencies, dominant below the corner frequency. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="floating"></a>
**Floating** — A node or pin with no defined connection to a voltage source, ground, or driven signal. Floating inputs are susceptible to noise pickup and undefined logic states. Unused IC inputs should be tied to a defined level per the datasheet.

<a id="flux-residue"></a>
**Flux residue** — Corrosive or conductive residue left on a PCB after soldering that can cause leakage currents, corrosion, and unreliable measurements if not cleaned.

<a id="flyback"></a>
**Flyback** — The voltage spike produced when current through an inductor is suddenly interrupted. The inductor's stored energy must go somewhere — without a defined path (flyback diode, snubber), it creates destructive voltage spikes.

<a id="flyback-diode"></a>
**Flyback diode** — Diode placed across an inductive load to provide a safe current path when the driving switch opens. Prevents voltage spikes from damaging the switch. Also called a freewheeling or snubber diode.

<a id="forward-active"></a>
**Forward active** — The operating region of a BJT where the base-emitter junction is forward biased and the base-collector junction is reverse biased. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="forward-voltage"></a>
**Forward voltage** — The voltage drop across a diode when current flows in the forward direction, typically 0.6-0.7 V for silicon and 0.2-0.4 V for Schottky diodes. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).


<a id="fpb"></a>
**FPB** — Flash Patch and Breakpoint unit on Cortex-M providing hardware breakpoint comparators for debug halting.
<a id="fpga"></a>
**FPGA (Field-Programmable Gate Array)** — A programmable chip with configurable logic blocks, routing, and I/O cells for implementing digital designs.

<a id="fpu"></a>
**FPU** — Floating-Point Unit — hardware accelerator for floating-point math on Cortex-M4F, M7, and others. Disabled by default after reset; requires CPACR configuration.

<a id="framing-error"></a>
**Framing error** — A UART error where the receiver does not find a valid stop bit at the expected position, typically caused by baud rate mismatch.


<a id="free-space-path-loss"></a>
**Free-space path loss (FSPL)** — Signal attenuation due to geometric spreading as a wave propagates through free space, proportional to distance squared.
<a id="freertos"></a>
**FreeRTOS** — Most widely used open-source RTOS for embedded systems, running on virtually every MCU with 4 KB or more SRAM.

<a id="freeze-spray"></a>
**Freeze spray** — Aerosol coolant used to rapidly chill individual components during debugging to isolate temperature-dependent faults.

<a id="frequency-counter"></a>
**Frequency counter** — A test instrument that precisely measures signal frequency by counting cycles over a gated time interval.


<a id="frequency-deviation"></a>
**Frequency deviation** — The maximum swing of an FM carrier's frequency from its center value, proportional to the modulating signal amplitude.

<a id="frequency-division-multiplexing"></a>
**Frequency division multiplexing (FDM)** — Sharing a channel by assigning different carrier frequencies to different signals; each occupies a distinct frequency band.

<a id="frequency-prewarping"></a>
**Frequency prewarping** — Adjusting an analog filter prototype's critical frequencies before the bilinear transform to compensate for frequency-axis warping.

<a id="frequency-resolution"></a>
**Frequency resolution** — The minimum frequency separation distinguishable by a DFT; equals f_s / N, determined by signal duration.
<a id="fresnel-zone"></a>
**Fresnel zone** — Concentric circular regions between transmitter and receiver used to predict clearance requirements for unobstructed propagation.


<a id="friis-equation"></a>
**Friis equation** — Formula relating system noise figure to individual stage noise figures and gains in a cascaded amplifier chain.
<a id="full-adder"></a>
**Full adder** — A circuit that adds two 1-bit inputs plus a carry-in to produce a sum and carry-out.

<a id="full-wave-rectifier"></a>
**Full-wave rectifier** — A rectifier circuit using four diodes in a bridge configuration to convert both polarities of AC to DC. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

---

## G

<a id="gain-bandwidth-product"></a>
**Gain-bandwidth product (GBW)** — The product of closed-loop gain and bandwidth, approximately constant for a given op-amp. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="gain-compression"></a>
**Gain compression** — Reduction in amplifier output gain at high input power due to saturation; characterized by the compression point.

<a id="gain-margin"></a>
**Gain margin** — The difference in dB between actual loop gain and 0 dB at the frequency where phase shift equals 360°. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}).

<a id="gain-peaking"></a>
**Gain peaking** — An unintended rise in gain near a cutoff frequency, indicating underdamped response or insufficient phase margin. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).

<a id="gain-staging"></a>
**Gain staging** — Distributing amplification across a signal chain to maintain optimal signal levels above noise floor and below clipping.



<a id="gamma-match"></a>
**Gamma match** — Impedance matching method using a rod parallel to one arm of a dipole, adjusting length and spacing.
<a id="gap"></a>
**GAP** — Generic Access Profile; BLE layer controlling advertising, scanning, and connection parameter negotiation.
<a id="gate-oxide-breakdown"></a>
**Gate oxide breakdown** — Irreversible damage to a MOSFET's thin gate insulator caused by excessive gate-to-source voltage or ESD, resulting in a shorted or leaky gate.


<a id="gatt"></a>
**GATT** — Generic Attribute Profile; BLE data model organizing communication into services and characteristics after connection.
<a id="gauge-factor"></a>
**Gauge factor** — The sensitivity of a strain gauge, defined as the ratio of fractional resistance change to fractional length change (strain).



<a id="gerber-file"></a>
**Gerber file** — Industry-standard file format describing each PCB layer's copper, mask, and silkscreen artwork for fabrication.
<a id="germanium-transistor"></a>
**Germanium transistor** — Early semiconductor using germanium instead of silicon; higher leakage current and lower max temperature than silicon devices.
<a id="ghost-voltage"></a>
**Ghost voltage** — False voltage reading caused by capacitive coupling to nearby live conductors, eliminated by using LoZ mode on a DMM.

<a id="gilbert-cell"></a>
**Gilbert cell** — Transistor configuration that multiplies two signals; forms the basis of most integrated RF mixers.


<a id="glitch-energy"></a>
**Glitch energy** — Area of a DAC's output transient glitch during code transitions; lower means less distortion.
<a id="global-net"></a>
**Global net** — A named electrical connection that spans multiple schematic sheets without explicit wiring. Power nets (VCC, GND) are the most common example.

<a id="glitch"></a>
**Glitch** — A momentary incorrect output caused by different propagation delays through logic paths.


<a id="gnu-radio"></a>
**GNU Radio** — Open-source signal processing framework for building software-defined radio flowgraphs.
<a id="goertzel-algorithm"></a>
**Goertzel algorithm** — Efficient algorithm computing a single DFT bin in O(N) operations; useful for single-frequency detection like DTMF.



<a id="golden-image"></a>
**Golden image** — Minimal known-good firmware stored in protected flash, used as fallback if the main firmware is corrupt or crashes.

<a id="golden-unit"></a>
**Golden unit** — A known-good reference unit used as a baseline for comparing test results and verifying measurement setups.
<a id="gpib"></a>
**GPIB (HPIB)** — IEEE-488 parallel instrument bus for automated test equipment; 8-bit data, up to 15 devices, common on older bench instruments.
<a id="gpio"></a>
**GPIO** — General-Purpose Input/Output — configurable digital pins that firmware can read or write, the fundamental peripheral for external interfacing.

<a id="gray-code"></a>
**Gray code** — A binary encoding where only one bit changes per count, avoiding multi-bit transition glitches.

<a id="ground-bounce"></a>
**Ground bounce** — Voltage spike on the ground network caused by fast-changing currents flowing through resistive and inductive ground paths. Can cause false logic transitions and measurement errors.


<a id="ground-domain"></a>
**Ground domain** — Region of a circuit sharing a common return path, defined at schematic level to control noise coupling between subsystems.
<a id="ground-loop"></a>
**Ground loop** — A condition where multiple ground paths create a closed loop that picks up interference, causing hum, noise, or measurement errors.

<a id="ground-plane"></a>
**Ground plane** — A continuous copper layer on a PCB dedicated to ground. Provides low-impedance return current paths, reduces EMI, and improves signal integrity.

<a id="group-delay"></a>
**Group delay** — The derivative of phase with respect to frequency, representing the time delay experienced by signal components. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).


<a id="guanella-balun"></a>
**Guanella balun** — Transmission-line balun using parallel-connected lines, providing wideband impedance transformation.
<a id="guard-ring"></a>
**Guard ring** — A driven shield trace at the same potential as a sensitive node, reducing capacitive leakage and coupling. See [Layout & Parasitics]({{< relref "/docs/analog/noise-stability-reality/layout-and-parasitics" >}}).

---

<a id="guard-trace"></a>
**Guard trace** — Grounded trace running alongside a sensitive signal trace to reduce coupling from adjacent signals.

## H

<a id="h_fe"></a>
**h_FE** — The hybrid parameter symbol for BJT current gain, equivalent to beta. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).


<a id="hairpin-match"></a>
**Hairpin match** — Shorted stub across a split dipole feedpoint providing shunt inductance for impedance matching.
<a id="hal"></a>
**HAL** — Hardware Abstraction Layer — software layer abstracting vendor-specific register interfaces behind common function calls for portability between MCU families.

<a id="half-adder"></a>
**Half adder** — A circuit that adds two 1-bit inputs to produce a sum and carry.

<a id="half-wave-dipole"></a>
**Half-wave dipole** — Antenna with two quarter-wavelength conductors fed at the center; reference antenna with 0 dBd gain and approximately 73 Ω impedance.

<a id="half-wave-rectifier"></a>
**Half-wave rectifier** — A rectifier circuit using one diode to convert one polarity of an AC signal to DC. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="hamming-window"></a>
**Hamming window** — Windowing function for spectral analysis with moderate main lobe width and -43 dB sidelobe level.

<a id="hann-window"></a>
**Hann window** — General-purpose windowing function for spectral analysis with moderate main lobe width and -31 dB sidelobe level. Also called Hanning window.



<a id="hard-real-time"></a>
**Hard real-time** — System where a missed deadline is a failure; no graceful degradation is acceptable.

<a id="hardfault"></a>
**HardFault** — Cortex-M catch-all fault exception triggered when a more specific fault handler is disabled or itself faults.

<a id="hardware-breakpoint"></a>
**Hardware breakpoint** — Debug breakpoint using FPB comparator hardware; works in flash but limited to 4-8 per Cortex-M core.
<a id="hart-protocol"></a>
**HART protocol (HART)** — Highway Addressable Remote Transducer; FSK digital signal superimposed on a 4-20 mA current loop for device configuration.

<a id="hartley-oscillator"></a>
**Hartley oscillator** — LC oscillator using a tapped inductor for feedback, providing robust oscillation at RF frequencies.
<a id="harvard-architecture"></a>
**Harvard architecture** — CPU architecture with separate buses for instructions and data, allowing simultaneous fetch and data access. AVR uses true Harvard; Cortex-M uses modified Harvard.

<a id="headroom"></a>
**Headroom** — Margin between current signal level and the maximum level a stage can handle before clipping, measured in dB.


<a id="heartbeat-led"></a>
**Heartbeat LED** — Status LED toggled by firmware at a fixed rate to indicate the processor is alive and the main loop is executing.

<a id="helical-antenna"></a>
**Helical antenna** — Antenna wound in a helix, producing circular polarization in axial mode or omnidirectional coverage in normal mode.
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


<a id="high-side-sensing"></a>
**High-side sensing** — Current measurement using a shunt resistor in the supply rail; requires a current-sense or instrumentation amp.
<a id="hold-time"></a>
**Hold time** — The minimum time data must remain stable after the clock edge for reliable capture.

<a id="holdup-time"></a>
**Holdup time** — Duration that a capacitor can sustain a load after the input power is removed. Determined by capacitance, load current, and allowable voltage droop.


<a id="hot-chassis"></a>
**Hot chassis** — Dangerous legacy design where one side of the AC mains connects directly to the metal chassis, separated only by a capacitor.
<a id="hrc-fuse"></a>
**HRC fuse** — High Rupturing Capacity fuse rated to safely interrupt high fault currents, required in DMMs rated for high-energy circuits.



<a id="hybrid-coupler"></a>
**Hybrid coupler** — Four-port device splitting a signal into two equal outputs with a fixed phase relationship.
<a id="hybrid-stackup"></a>
**Hybrid stackup** — PCB construction mixing different substrate materials to balance performance and cost.
<a id="hysteresis-loss"></a>
**Hysteresis loss** — Energy dissipated in a magnetic core each AC cycle as magnetic domains reverse direction. Proportional to frequency and the area of the B-H loop.

---

## I

<a id="i2c"></a>
**I2C (Inter-Integrated Circuit)** — A synchronous, half-duplex, multi-master serial bus using two open-drain lines (SCL, SDA) with pull-ups.

<a id="i2c-bus"></a>
**I2C** — Inter-Integrated Circuit — synchronous half-duplex 2-wire bus for connecting slow peripherals (sensors, EEPROMs, RTCs). Uses open-drain signaling with external pull-ups.

<a id="i2s-bus"></a>
**I2S** — Inter-IC Sound — synchronous 3–4 wire bus for high-quality audio data transfer between ICs.

<a id="if"></a>
**IF (Intermediate Frequency)** — Lower frequency to which an RF signal is converted in a superheterodyne receiver for easier filtering and amplification.

<a id="iip3"></a>
**IIP3 (Input Third-Order Intercept Point)** — Theoretical input level where third-order intermodulation product power equals the fundamental signal power.

<a id="iir-filter"></a>
**IIR filter (Infinite Impulse Response)** — Digital filter using feedback whose output depends on both current/past inputs and past outputs; efficient but potentially unstable.

<a id="image-frequency"></a>
**Image frequency** — RF frequency that produces the same intermediate frequency as the desired signal when mixed with the local oscillator; causes unwanted reception.



<a id="image-theory"></a>
**Image theory** — Analytical method modeling a ground plane as a mirror, replacing it with a virtual image of the antenna below it.
<a id="imd"></a>
**IMD** — Intermodulation Distortion; non-harmonic distortion products from two or more tones interacting in a nonlinear device.
<a id="impedance"></a>
**Impedance (Z)** — Generalized resistance for AC circuits, including both resistive (real) and reactive (imaginary) components. Measured in ohms. Varies with frequency.

<a id="impedance-matching"></a>
**Impedance matching** — Selecting load impedance to maximize power transfer from a source. Critical in RF and audio systems. Maximum power transfer occurs when load impedance equals the complex conjugate of the source impedance.


<a id="impedance-test-coupon"></a>
**Impedance test coupon** — PCB panel feature with traces fabricated alongside the board, measured to verify controlled impedance meets design targets.
<a id="inductance"></a>
**Inductance (L)** — The property of a component that resists changes in current by storing energy in a magnetic field. V = L × (dI/dt).


<a id="initramfs"></a>
**initramfs** — Temporary in-memory filesystem loaded at boot containing modules needed to mount the real root filesystem.
<a id="inl"></a>
**INL (Integral Non-Linearity)** — Maximum deviation of an ADC/DAC transfer function from an ideal straight line.

<a id="input-bias-current"></a>
**Input bias current** — Small current drawn by an op-amp's input terminals, typically nanoamps for BJT inputs and picoamps for FET inputs. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="input-impedance"></a>
**Input impedance (Z_in)** — The impedance presented by a circuit or instrument at its input terminals. High input impedance means less loading of the signal source.

<a id="input-offset-voltage"></a>
**Input offset voltage** — A small DC voltage difference between the inputs of a real op-amp that must be accounted for in precision circuits. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).


<a id="input-referred-noise"></a>
**Input-referred noise** — A stage's output noise divided by its gain, expressing total noise as if it appeared at the input.
<a id="inrush-current"></a>
**Inrush current** — The large transient current drawn when power is first applied to a circuit, typically caused by charging initially discharged capacitors. Can be many times the steady-state current.

<a id="insertion-loss"></a>
**Insertion loss** — Signal power loss when passing through a component like a filter, cable, or connector; expressed in dB.

<a id="instantaneous-power"></a>
**Instantaneous power** — The product of voltage and current at any specific moment: P(t) = V(t) × I(t).

<a id="insulation-breakdown"></a>
**Insulation breakdown** — Degradation of a dielectric material leading to increased leakage current or catastrophic short circuit. Accelerated by temperature, voltage stress, and contamination.

<a id="insulation-resistance"></a>
**Insulation resistance** — The resistance of an insulating material or component's dielectric, typically measured with a megohmmeter at elevated voltage.


<a id="intel-hex"></a>
**Intel HEX** — ASCII file format encoding binary data with target addresses, used for flash programming embedded devices.
<a id="intermodulation"></a>
**Intermodulation** — New frequency components generated when multiple signals mix nonlinearly in a circuit; third-order products are typically strongest.

<a id="interpolation"></a>
**Interpolation** — Increasing sample rate by inserting new samples and filtering; the inverse of decimation.

<a id="interstage-coupling"></a>
**Interstage coupling** — The method of connecting amplifier stages, either AC-coupled (capacitive) or DC-coupled (direct). See [Multistage Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/multistage-amplifiers" >}}).


<a id="inverted-f-antenna"></a>
**Inverted-F antenna (IFA)** — Low-profile PCB antenna resembling the letter F, widely used in compact wireless devices.
<a id="inverting-amplifier"></a>
**Inverting amplifier** — An op-amp configuration where input connects through a resistor to the inverting terminal, with gain set by the feedback resistor ratio. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="ip3"></a>
**IP3 (Third-Order Intercept Point)** — Output level where third-order intermodulation product power equals the fundamental; key measure of receiver linearity.

<a id="iq-signals"></a>
**I/Q signals** — Two signals 90° apart in phase representing the in-phase and quadrature components; fundamental to SDR and digital communications.



<a id="ipc-7351"></a>
**IPC-7351** — IPC standard defining recommended land patterns for surface-mount components to ensure reliable solder joints.
<a id="ipc-a-610"></a>
**IPC-A-610** — IPC standard defining acceptability criteria for electronic assemblies including solder joint quality across three reliability classes.
<a id="ir-thermometer"></a>
**IR thermometer** — Non-contact temperature measurement tool that reads infrared radiation from a surface. Quick for spot checks but accuracy depends on the emissivity of the target surface.

<a id="ism-band"></a>
**ISM band** — Unlicensed frequency bands for Industrial, Scientific, and Medical use; includes 915 MHz and 2.4 GHz used for WiFi and Bluetooth.



<a id="isochronous-transfer"></a>
**Isochronous transfer** — USB transfer type with guaranteed bandwidth and timing but no error recovery; used for audio and video streaming.
<a id="isolated-dc-dc-converter"></a>
**Isolated DC-DC converter** — Power converter providing galvanic isolation between input and output, used to create separate power domains for isolated interfaces.
<a id="isolation-transformer"></a>
**Isolation transformer** — A 1:1 transformer that breaks the galvanic path between mains and the device under test, allowing safe measurement of mains-referenced circuits.

<a id="isolator"></a>
**Isolator** — Passive device allowing signal flow in one direction while blocking the reverse; prevents reflections from affecting a source.

<a id="isr"></a>
**ISR** — Interrupt Service Routine — handler function that executes when an interrupt fires. Must be short, non-blocking, and clear the interrupt source.

<a id="itm-trace"></a>
**ITM** — Instrumentation Trace Macrocell — ARM CoreSight hardware sending trace data through the SWO pin. Faster than UART logging for debug output.

---

## J


<a id="j-link"></a>
**J-Link** — Segger's professional debug probe supporting SWD, JTAG, SWO, and RTT; the industry standard for ARM debugging.
<a id="jitter"></a>
**Jitter** — Variation in clock edge timing from cycle to cycle, degrading timing margins.

<a id="jk-flip-flop"></a>
**JK flip-flop** — A flip-flop with J and K inputs that can set, reset, hold, or toggle based on the input combination.

<a id="johnson-noise"></a>
**Johnson noise (thermal noise)** — Random voltage noise generated by thermal motion of electrons in any resistor. Proportional to resistance, temperature, and bandwidth. Present in all resistors regardless of construction.

<a id="joule"></a>
**Joule (J)** — SI unit of energy. One joule equals one watt for one second. One watt-hour equals 3,600 joules.

<a id="jtag-debug"></a>
**JTAG** — Joint Test Action Group — 4–5 wire debug and test interface predating SWD, still used on larger processors and FPGAs.

<a id="junction-capacitance"></a>
**Junction capacitance** — The capacitance of a reverse-biased diode that varies with the applied reverse voltage. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

---

## K

<a id="kaiser-window"></a>
**Kaiser window** — Windowing function with adjustable parameter β to tune the tradeoff between main lobe width and sidelobe level.

<a id="kapton-tape"></a>
**Kapton tape** — Heat-resistant polyimide adhesive tape used to shield nearby components during hot-air rework and to secure jumper wires on reworked boards.

<a id="karnaugh-map"></a>
**Karnaugh map** — A graphical method for simplifying Boolean functions by grouping adjacent truth table entries.

<a id="kcl"></a>
**KCL (Kirchhoff's Current Law)** — The sum of currents entering a node equals the sum of currents leaving. A direct consequence of conservation of charge. See [Kirchhoff's Laws]({{< relref "/docs/fundamentals/laws-first-principles/kirchhoffs-laws" >}}).


<a id="keep-out-zone"></a>
**Keep-out zone** — Area on a PCB near an antenna that must be free of copper, components, or ground fill to avoid detuning.
<a id="kelvin-measurement"></a>
**Kelvin measurement** — A 4-wire measurement technique that eliminates lead resistance error by using separate force and sense connections.


<a id="kernel-space"></a>
**Kernel space** — Privileged execution environment with full hardware access, where the OS kernel and drivers run.
<a id="known-good-substitution"></a>
**Known-good substitution** — Debugging technique of swapping a suspected component or module with a verified working one to determine if the original is faulty.

<a id="kvl"></a>
**KVL (Kirchhoff's Voltage Law)** — The sum of voltage drops around any closed loop equals zero. A direct consequence of conservation of energy. See [Kirchhoff's Laws]({{< relref "/docs/fundamentals/laws-first-principles/kirchhoffs-laws" >}}).

---

## L



<a id="l-network"></a>
**L-network** — Two-element impedance matching network using one series and one shunt reactive component.
<a id="ladder-diagram"></a>
**Ladder diagram** — Schematic format for relay logic showing horizontal rungs between two power rails; contacts in series = AND, in parallel = OR.
<a id="lambda"></a>
**Lambda (λ)** — Wavelength — physical distance of one complete electromagnetic oscillation; λ = c / f.



<a id="lambda-10-rule"></a>
**Lambda/10 rule** — Guideline that distributed effects matter when a conductor exceeds one-tenth of a wavelength.
<a id="last-time-buy"></a>
**Last-time buy (LTB)** — Final purchasing opportunity before a manufacturer discontinues a component.
<a id="latch-up"></a>
**Latch-up** — A parasitic thyristor condition in CMOS ICs where a trigger event locks the device into a low-impedance state, drawing excessive current until power is removed.

<a id="latency"></a>
**Latency** — Time delay between when a signal enters a system and when the corresponding output appears.



<a id="layout-extraction"></a>
**Layout extraction** — Process of generating parasitic models from a PCB layout for insertion into schematic-level simulation.
<a id="lazy-stacking"></a>
**Lazy stacking** — FPU context-save optimization that defers saving floating-point registers until a second exception actually uses them.
<a id="lcr-meter"></a>
**LCR meter** — An instrument that measures inductance, capacitance, and resistance of components at a specified test frequency.

<a id="ldo"></a>
**LDO (Low-Dropout Regulator)** — A linear regulator designed to operate with very small input-to-output voltage difference, typically 100-500 mV. See [Linear Regulators]({{< relref "/docs/analog/power-and-regulation/linear-regulators" >}}).


<a id="ldrex-strex"></a>
**LDREX/STREX** — ARM exclusive load/store instructions enabling lock-free atomic read-modify-write on Cortex-M3 and above.
<a id="leakage-current"></a>
**Leakage current** — Small, undesired current flowing through a nominally insulating path. Present in capacitor dielectrics, semiconductor junctions, and PCB surface contamination.

<a id="level-diagram"></a>
**Level diagram** — A block diagram showing signal levels in dBu or dBV at each stage of an audio signal chain, used to verify proper gain structure.

<a id="level-shifting"></a>
**Level shifting** — Converting a signal from one voltage level to another when interfacing between different logic families.

<a id="lfsr"></a>
**LFSR (Linear Feedback Shift Register)** — A shift register with XOR feedback generating pseudo-random sequences of maximum length 2^n - 1.



<a id="lhcp"></a>
**LHCP** — Left-hand circular polarization; the electric field vector rotates counterclockwise as viewed from behind the wave.
<a id="libgpiod"></a>
**libgpiod** — Linux user-space GPIO library replacing the deprecated sysfs GPIO interface with a character device API.
<a id="lifted-pad"></a>
**Lifted pad** — A PCB copper pad that has separated from the substrate due to excessive heat or mechanical force during soldering or rework.



<a id="lin-bus"></a>
**LIN bus (LIN)** — Single-wire master-slave serial bus for low-cost automotive subsystems, running up to 20 kbps over a UART.
<a id="line-level"></a>
**Line level** — Standard audio signal voltage for interconnecting equipment; roughly 1 V RMS (+4 dBu professional, -10 dBV consumer).
<a id="line-regulation"></a>
**Line regulation** — How much a regulator's or reference's output changes per volt of input change, measured in mV/V or ppm/V. See [Reference Voltages]({{< relref "/docs/analog/power-and-regulation/reference-voltages" >}}).

<a id="linear-circuit"></a>
**Linear circuit** — A circuit that obeys the superposition principle: the response to a sum of inputs equals the sum of the individual responses. Resistors, capacitors, and inductors are linear; diodes and transistors are not.

<a id="linear-phase"></a>
**Linear phase** — Filter property where all frequencies are delayed by the same amount, preserving waveform shape.

<a id="linear-regulator"></a>
**Linear regulator** — A voltage regulator that maintains constant output by dissipating excess voltage as heat across a series pass element. See [Linear Regulators]({{< relref "/docs/analog/power-and-regulation/linear-regulators" >}}).

<a id="link-budget"></a>
**Link budget** — Accounting of all gains and losses in a communication path from transmitter to receiver; determines whether a link will close.


<a id="link-margin"></a>
**Link margin** — The difference between received signal power and receiver sensitivity; the safety factor in a link budget.
<a id="linker-script"></a>
**Linker script** — Configuration file defining the memory layout and section placement for firmware — where flash, SRAM, .text, .data, and .bss sections reside.


<a id="litz-wire"></a>
**Litz wire** — Multi-strand wire with individually insulated strands woven to equalize current distribution and reduce skin effect losses.
<a id="load-regulation"></a>
**Load regulation** — How much a voltage source's output changes per unit of load current change. See [Reference Voltages]({{< relref "/docs/analog/power-and-regulation/reference-voltages" >}}).

<a id="load-transient-response"></a>
**Load transient response** — How quickly and cleanly a power supply recovers its output voltage after a sudden change in load current.

<a id="loading"></a>
**Loading** — The effect of connecting a load to a circuit, which draws current and may change the operating voltage. Voltage dividers and high-impedance signal sources are particularly susceptible.

<a id="lna"></a>
**LNA (Low-Noise Amplifier)** — High-gain, low-noise amplifier placed immediately after the antenna to amplify weak signals before further processing.


<a id="loading-coil"></a>
**Loading coil** — Series inductor added to a short antenna to cancel capacitive reactance and lower the resonant frequency.
<a id="local-oscillator"></a>
**Local oscillator** — Signal generator providing the frequency reference for a mixer in superheterodyne receivers and transmitters.

<a id="lock-in-amplifier"></a>
**Lock-in amplifier** — Measurement technique that demodulates a signal at a known reference frequency, detecting signals buried far below the noise floor.

<a id="logic-analyzer"></a>
**Logic analyzer** — Test instrument that captures multiple digital signals simultaneously and displays decoded protocol information for SPI, I2C, UART, and other buses.

<a id="logic-level-mosfet"></a>
**Logic-level MOSFET** — A MOSFET designed to be fully on with 3.3 V or 5 V gate drive, without needing higher voltage. See [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}).


<a id="long-tailed-pair"></a>
**Long-tailed pair** — Differential amplifier built from two transistors with a shared emitter current source; the input stage of most op-amps.
<a id="lookup-table"></a>
**Lookup table (LUT)** — A small memory implementing arbitrary Boolean functions, the basic building block of FPGAs.

<a id="loop"></a>
**Loop** — Any closed path through a circuit, traversing one or more branches and returning to the starting node.

<a id="loop-compensation"></a>
**Loop compensation** — Design of the feedback network in a switching regulator to ensure stability across all operating conditions. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="loop-gain"></a>
**Loop gain** — The product of forward gain and feedback fraction (T = A × β), determining how effectively feedback controls the circuit. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).


<a id="loopback-test"></a>
**Loopback test** — Sending a signal out of a system and recording it on return to measure round-trip latency and verify signal chain integrity.
<a id="loss-tangent"></a>
**Loss tangent** — Measure of dielectric material loss at RF; higher values mean more energy absorption. Also written as tan(δ).

<a id="low-pass-filter"></a>
**Low-pass filter** — A filter that passes frequencies below a cutoff frequency and attenuates frequencies above it. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="low-pass-filter-mode"></a>
**Low-pass filter mode** — A DMM feature that filters out high-frequency content from AC voltage measurements, giving accurate fundamental-frequency readings on VFD or PWM-driven circuits.


<a id="low-side-sensing"></a>
**Low-side sensing** — Current measurement using a shunt resistor in the ground return path; simpler than high-side but disrupts the ground reference.
<a id="loz-mode"></a>
**LoZ mode** — Low-impedance DMM input mode that collapses ghost voltages by presenting a low resistance to the circuit under test.


<a id="ltspice"></a>
**LTspice** — Free SPICE simulator from Analog Devices with built-in component models, widely used for analog and power design.
<a id="lufs"></a>
**LUFS (Loudness Units Relative to Full Scale)** — Perceptual loudness measurement used in audio mastering and broadcast.


<a id="lumped-element"></a>
**Lumped element** — A component modeled as having a single value at a point, valid when physically much smaller than a wavelength.
<a id="lvds"></a>
**LVDS (Low-Voltage Differential Signaling)** — A differential signaling standard for high-speed data and clock distribution with low noise emission.

---

<a id="lwip"></a>
**lwIP** — Lightweight IP; the de facto embedded TCP/IP stack for Cortex-M MCUs, providing TCP, UDP, DHCP, and DNS.

## M


<a id="mac"></a>
**MAC** — Multiply-accumulate operation; the fundamental DSP instruction combining multiplication and addition in one cycle.
<a id="magnetic-field"></a>
**Magnetic field** — The energy storage medium in inductors and transformers. Created by current flow through a conductor and concentrated by magnetic core materials.

<a id="magnetostriction"></a>
**Magnetostriction** — Physical deformation of a magnetic core material caused by the changing magnetic field. Produces audible buzzing or humming in inductors and transformers, especially at power-line frequencies.




<a id="manhattan-construction"></a>
**Manhattan construction** — Prototyping technique using small copper pads glued to a ground plane as connection islands for component mounting.
<a id="map-file"></a>
**Map file** — Linker output showing where every function and variable is placed in memory and total flash/SRAM usage.
<a id="max232"></a>
**MAX232** — RS-232 line driver/receiver IC that generates bipolar RS-232 voltages from a single 5 V supply using internal charge pumps.

<a id="mclk"></a>
**MCLK** — Master clock for audio codecs, typically 256 times the sample rate, required for codec internal PLL lock.

<a id="mdio"></a>
**MDIO** — Management Data Input/Output; low-speed serial interface for configuring and reading status from an Ethernet PHY.
<a id="measurement-uncertainty"></a>
**Measurement uncertainty** — The range within which the true value of a measurement is expected to lie, combining accuracy, resolution, repeatability, and environmental effects.



<a id="memmanage-fault"></a>
**MemManage fault** — Cortex-M exception triggered by MPU access violations such as stack guard hits or NULL dereference traps.
<a id="midi"></a>
**MIDI** — Musical Instrument Digital Interface; 31.25 kbaud serial protocol using opto-isolated current loop for music device communication.
<a id="mah"></a>
**Milliamp-hour (mAh)** — Unit of electric charge commonly used to rate battery capacity. To estimate energy in watt-hours: mAh × nominal voltage ÷ 1000.

<a id="manchester-encoding"></a>
**Manchester encoding** — Line code where every bit has a mid-bit transition for guaranteed clock recovery; 1 and 0 differ by transition direction.

<a id="masking"></a>
**Masking** — Phenomenon where a loud signal makes quieter signals inaudible; includes simultaneous (frequency-dependent) and temporal masking.

<a id="matched-components"></a>
**Matched components** — Components selected or designed to track each other's temperature coefficient for ratiometric stability. See [Temperature & Drift]({{< relref "/docs/analog/biasing-operating-points/temperature-and-drift" >}}).

<a id="matching-network"></a>
**Matching network** — Circuit of inductors, capacitors, or transmission lines that transforms impedance for maximum power transfer between stages.

<a id="maximum-power-transfer"></a>
**Maximum power transfer** — Occurs when load resistance equals the source's Thevenin resistance. Transfers maximum power to the load but at only 50% efficiency.

<a id="mealy-machine"></a>
**Mealy machine** — A state machine where outputs depend on both current state and current inputs.

<a id="memory-map"></a>
**Memory map** — Definition of what exists at each address in the MCU's address space: flash, SRAM, peripherals, and reserved regions.

<a id="memory-mapped-io"></a>
**Memory-mapped I/O** — Accessing peripherals through normal memory read/write instructions to specific addresses rather than special I/O instructions. Standard on Cortex-M.

<a id="mems-microphone"></a>
**MEMS microphone** — Microelectromechanical systems microphone, often with PDM output, requiring decimation to produce PCM audio.

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
**Miller effect** — The multiplication of gate-drain capacitance by the voltage gain, slowing switching transitions and potentially causing oscillation. See [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}).

<a id="mimo"></a>
**MIMO (Multiple-Input Multiple-Output)** — Antenna system using multiple antennas at both transmitter and receiver to increase capacity through spatial multiplexing.

<a id="minimum-detectable-signal"></a>
**Minimum detectable signal** — Weakest signal a receiver can detect with acceptable performance; determined by noise floor and required SNR.


<a id="missing-codes"></a>
**Missing codes** — ADC defect where some output values never appear because differential nonlinearity exceeds 1 LSB.
<a id="mixer-spur"></a>
**Mixer spur** — Unwanted output frequency produced by a mixer due to intermodulation or harmonic products; must be filtered.


<a id="mlockall"></a>
**mlockall** — Linux system call that locks all current and future memory pages into RAM, preventing page faults in RT code.
<a id="mmic"></a>
**MMIC (Monolithic Microwave Integrated Circuit)** — RF integrated circuit containing amplifiers, mixers, and passives on a semiconductor substrate.


<a id="modbus-rtu"></a>
**Modbus RTU** — Industrial serial communication protocol running on RS-485, using binary-encoded registers for reading and writing device data.
<a id="modulation"></a>
**Modulation** — Varying the amplitude, frequency, or phase of a carrier signal to encode information for transmission.


<a id="modulation-index"></a>
**Modulation index** — Ratio characterizing modulation depth: peak deviation / modulating frequency for FM, or peak-to-carrier ratio for AM.
<a id="monotonicity"></a>
**Monotonicity** — DAC property that increasing digital codes always produce equal or increasing output levels.

<a id="monopole-antenna"></a>
**Monopole antenna** — Single conductor perpendicular to a ground plane; electrically equivalent to half a dipole with the ground plane providing the mirror image.


<a id="monte-carlo-analysis"></a>
**Monte Carlo analysis** — Statistical simulation method using random component value sampling to predict yield and output distributions.
<a id="moore-machine"></a>
**Moore machine** — A state machine where outputs depend only on the current state.

<a id="mosfet"></a>
**MOSFET (Metal-Oxide-Semiconductor FET)** — A voltage-controlled transistor where gate voltage controls drain current through an insulated gate. See [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}).



<a id="mouse-bites"></a>
**Mouse bites** — Row of small drilled holes forming a perforated break-away line in a PCB panel tab for board separation.
<a id="mqtt"></a>
**MQTT** — Lightweight publish/subscribe messaging protocol for IoT cloud connectivity over TCP, minimal overhead.
<a id="mso"></a>
**MSO** — Mixed Signal Oscilloscope — an oscilloscope with both analog and digital (logic analyzer) input channels for correlating analog waveforms with digital bus activity.

<a id="mtbf"></a>
**MTBF (Mean Time Between Failures)** — The average time between metastability-induced failures in a synchronizer.


<a id="mtu"></a>
**MTU** — Maximum Transmission Unit; the largest payload size in a single network packet.
<a id="mu-metal"></a>
**Mu-metal** — A high-permeability nickel-iron alloy used for shielding against low-frequency magnetic fields.



<a id="multi-point-ground"></a>
**Multi-point ground** — Grounding topology connecting circuits to the nearest low-impedance ground plane via short vias, minimizing inductance.
<a id="multi-rail-sequencing"></a>
**Multi-rail sequencing** — Controlled power-up order for separate MCU supply pins to prevent latch-up or damage.
<a id="multipath-fading"></a>
**Multipath fading** — Signal fading from multiple propagation paths arriving with different amplitudes and phases; common in indoor and urban environments.

<a id="multiplexer"></a>
**Multiplexer** — A combinational circuit that selects one of several data inputs and routes it to a single output.

<a id="mutual-inductance"></a>
**Mutual inductance** — Magnetic coupling between adjacent inductors or windings. The mechanism behind transformer operation and also a source of unwanted crosstalk.

<a id="mute-relay"></a>
**Mute relay** — A relay in an audio amplifier that disconnects the speaker outputs during power-up and power-down to suppress audible transient thumps.

<a id="mutex"></a>
**Mutex** — RTOS synchronization primitive allowing only one task to hold a resource at a time, supporting priority inheritance to prevent inversion.

---

## N

<a id="nand-gate"></a>
**NAND gate** — AND followed by NOT; a universal gate capable of implementing any Boolean function.

<a id="nanoVNA"></a>
**NanoVNA** — Affordable vector network analyzer covering typically 50 kHz to 1.5 GHz; enables hobbyists and students to perform antenna and circuit measurements.

<a id="ncv"></a>
**NCV** — Non-Contact Voltage detection — a DMM mode that senses AC voltage presence near a conductor without touching it.

<a id="near-field-probe"></a>
**Near-field probe** — A small loop or stub probe held close to a PCB to sniff magnetic (H-field) or electric (E-field) emissions for EMI troubleshooting.

<a id="near-field-region"></a>
**Near-field region** — Region close to an antenna where electromagnetic fields are complex, reactive, and not yet separated into propagating E and H components.

<a id="negative-feedback"></a>
**Negative feedback** — Feedback where the returned signal opposes the input, creating self-correction that stabilizes gain and reduces distortion. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).

<a id="net-name"></a>
**Net name** — A label applied to a wire or connection in a schematic that replaces physical wire drawings. All points sharing the same net name are electrically connected.

<a id="network-analyzer"></a>
**Network analyzer** — An instrument that measures the frequency response of a circuit with both amplitude and phase information. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).


<a id="new-old-stock"></a>
**New-old-stock (NOS)** — Original-manufacture components that were never installed; available from surplus dealers for legacy repair work.

<a id="newlib"></a>
**Newlib** — Embedded C standard library for arm-none-eabi-gcc; newlib-nano is its reduced-size variant.

<a id="ngspice"></a>
**Ngspice** — Open-source SPICE simulation engine descended from Berkeley SPICE, usable standalone or integrated with KiCad.
<a id="nmi"></a>
**NMI** — Non-Maskable Interrupt — highest-priority exception on Cortex-M that cannot be disabled, reserved for critical system faults.

<a id="no-connect"></a>
**No connect (NC)** — An explicit marker on a schematic indicating that an IC pin is intentionally left unconnected. Distinguishes deliberate non-connection from a wiring error.

<a id="no-clean-flux"></a>
**No-clean flux** — Soldering flux formulated to leave benign residue that does not require post-solder cleaning, though cleaning is still recommended for precision or high-impedance circuits.

<a id="node"></a>
**Node** — A junction where two or more branches meet in a circuit. All points connected by zero-resistance conductors form a single node.

<a id="nodal-analysis"></a>
**Nodal analysis** — Systematic circuit analysis method that applies KCL at each node and solves for node voltages. Generally preferred over mesh analysis for circuits with many parallel branches.


<a id="noise-factor"></a>
**Noise factor** — Linear ratio of a device's output SNR to its input SNR; the linear form of noise figure used in Friis cascade calculations.
<a id="noise-figure"></a>
**Noise figure (NF)** — A measure of how much noise a circuit adds beyond the thermal noise of its source impedance, in dB. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="noise-floor"></a>
**Noise floor** — The minimum detectable signal level in a circuit, limited by the sum of all noise sources. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="noise-gain"></a>
**Noise gain** — The gain that applies to noise and offset voltage in an op-amp circuit, which may differ from signal gain. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="noise-margin"></a>
**Noise margin** — The voltage difference between guaranteed output levels and required input thresholds, representing noise immunity.


<a id="noise-parameters"></a>
**Noise parameters** — Set of values (Fmin, Rn, Gamma_opt) characterizing an RF device's noise performance versus source impedance.
<a id="noise-shaping"></a>
**Noise shaping** — Feedback technique in delta-sigma converters pushing quantization noise to high frequencies where it can be filtered out.

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



<a id="nrnd"></a>
**NRND** — Not Recommended for New Designs; manufacturer lifecycle status indicating a component is being phased out.
<a id="nrz-encoding"></a>
**NRZ encoding (NRZ)** — Non-Return-to-Zero line code mapping 1=HIGH, 0=LOW; simple but lacks clock transitions during long runs of identical bits.

<a id="nrzi-encoding"></a>
**NRZI encoding (NRZI)** — Non-Return-to-Zero Inverted line code where a 1 is a transition and 0 is no transition; better clock recovery than NRZ.
<a id="ntc-thermistor"></a>
**NTC thermistor** — Negative Temperature Coefficient resistor whose resistance decreases with temperature. Used for temperature sensing and soft-start inrush current limiting.


<a id="nte-cross-reference"></a>
**NTE cross-reference (NTE)** — Semiconductor replacement guide that maps discontinued part numbers to currently available NTE equivalents by parameter range.

<a id="null-modem"></a>
**Null modem** — RS-232 cable wiring that swaps TX and RX lines to connect two DTE devices directly without a modem in between.
<a id="nvic"></a>
**NVIC** — Nested Vectored Interrupt Controller — ARM Cortex-M interrupt controller providing configurable priorities, nesting, and hardware-vectored handler entry.

<a id="nyquist-frequency"></a>
**Nyquist frequency** — Half the sampling rate (f_s/2); the highest frequency representable in a sampled signal.

<a id="nyquist-rate"></a>
**Nyquist rate** — Minimum sampling rate required to represent a bandlimited signal: 2 × f_max.

---

<a id="nyquist-shannon-sampling-theorem"></a>
**Nyquist-Shannon sampling theorem** — A bandlimited signal can be perfectly reconstructed from samples taken at greater than twice its maximum frequency.

## O


<a id="obd-ii"></a>
**OBD-II (OBD2)** — Standardized automotive diagnostic interface mandating CAN at 500 kbps since 2008 for vehicle fault scanning.
<a id="octave"></a>
**Octave** — Factor of 2 in frequency; on logarithmic frequency plots, octaves appear as equal widths.

<a id="ocxo"></a>
**OCXO (Oven-Controlled Crystal Oscillator)** — Crystal oscillator in a temperature-controlled oven achieving excellent frequency stability and low phase noise.


<a id="odd-harmonics"></a>
**Odd harmonics** — Distortion products at 3rd, 5th, 7th multiples of the fundamental; sound harsher, characteristic of semiconductor clipping.
<a id="ohm"></a>
**Ohm (Ω)** — SI unit of electrical resistance. One ohm passes one ampere under one volt of potential difference.

<a id="ohms-law"></a>
**Ohm's Law (V = IR)** — The fundamental relationship between voltage, current, and resistance. Applies directly to resistive elements and as an approximation for many practical calculations. See [Ohm's Law]({{< relref "/docs/fundamentals/laws-first-principles/ohms-law" >}}).

<a id="oip3"></a>
**OIP3 (Output Third-Order Intercept Point)** — Theoretical output level where third-order intermodulation product power equals the fundamental signal power.



<a id="ook"></a>
**OOK** — On-off keying; the simplest digital modulation where the carrier is switched on and off to represent binary data.
<a id="oom-killer"></a>
**OOM killer** — Linux kernel mechanism that terminates processes when physical memory is exhausted and no swap is available.
<a id="op-amp"></a>
**Op-amp (operational amplifier)** — A high-gain differential amplifier used as a universal analog building block with external feedback networks. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="open-circuit-voltage"></a>
**Open-circuit voltage (V_oc)** — The voltage measured across a source's terminals when no load is connected. Equal to the Thevenin voltage.

<a id="open-drain"></a>
**Open-drain** — A logic output with only a pull-down transistor, requiring an external pull-up resistor for the HIGH level.

<a id="open-drain-output"></a>
**Open-drain output** — GPIO mode where the pin can only pull LOW actively and floats HIGH, requiring an external pull-up. Used for I2C, multi-master buses, and level shifting.

<a id="open-loop-gain"></a>
**Open-loop gain** — The gain of an op-amp without feedback, typically 100,000 V/V or more at DC. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).


<a id="operating-level"></a>
**Operating level** — The nominal signal level a stage is designed to handle, balancing SNR above the noise floor and headroom below clipping.
<a id="option-bytes"></a>
**Option bytes** — Non-volatile configuration bits controlling MCU behavior such as brownout threshold, debug access protection, and flash read protection.

<a id="or-gate"></a>
**OR gate** — A logic gate that outputs 1 when any input is 1.

<a id="oscilloscope-probe"></a>
**Oscilloscope probe** — Coupling device between the circuit under test and the oscilloscope input. Passive probes (1× and 10×) are most common; active probes provide lower loading.

<a id="ota-update"></a>
**OTA update** — Over-The-Air wireless firmware update mechanism allowing field devices to receive new firmware without physical connection.

<a id="output-impedance"></a>
**Output impedance (Z_out)** — The impedance a circuit presents at its output terminals. Determines how much the output voltage droops under load. Lower output impedance means stiffer voltage regulation.

<a id="output-ripple"></a>
**Output ripple** — The AC voltage variation superimposed on the DC output of a switching regulator, typically 10-50 mV. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="overcurrent"></a>
**Overcurrent** — Current flow exceeding a component's or circuit's rated maximum, typically caused by a short circuit, excessive load, or failed protection device.



<a id="overlap-add"></a>
**Overlap-add** — Block processing method that sums zero-padded, convolved segments to produce continuous output from overlapping blocks.

<a id="overlap-save"></a>
**Overlap-save** — Block processing method that discards corrupted edge samples from circular convolution to produce correct linear convolution output.
<a id="overrun-error"></a>
**Overrun error** — UART/SPI error when new data arrives before firmware reads the previous byte, silently losing data.
<a id="oversampling"></a>
**Oversampling** — Sampling at a rate much higher than Nyquist; spreads quantization noise across wider bandwidth and enables noise shaping.

---

<a id="oversampling-ratio"></a>
**Oversampling ratio (OSR)** — Ratio of actual sample rate to the minimum Nyquist rate; higher OSR relaxes analog filter requirements and enables noise shaping.

<a id="oxygen-absorption"></a>
**Oxygen absorption** — RF signal attenuation near 60 GHz caused by molecular oxygen resonance in the atmosphere.

## P


<a id="paper-in-oil-capacitor"></a>
**Paper-in-oil capacitor** — Vintage capacitor using paper dielectric impregnated with oil; absorbs moisture over decades and develops DC leakage.

<a id="parallel-port"></a>
**Parallel port** — PC I/O interface (DB-25/LPT) repurposed for digital control; provides 8 data, 5 status, and 4 control TTL-level lines.
<a id="parallel-termination"></a>
**Parallel termination** — Transmission line termination with a resistor matching the line impedance at the receiver end, absorbing the signal to prevent reflections.

<a id="parametric-failure"></a>
**Parametric failure** — A component degradation where the part still functions but operates outside its specified parameters, often caused by ESD or thermal stress.

<a id="parasitic-capacitance"></a>
**Parasitic capacitance** — Unintended capacitance present between conductors, component leads, PCB traces, and other structures. Negligible at low frequencies but dominates behavior at high frequencies.

<a id="parasitic-inductance"></a>
**Parasitic inductance** — Unintended inductance in component leads, wires, and PCB traces. Causes ringing on fast edges and limits high-frequency performance.



<a id="parasitic-power"></a>
**Parasitic power** — Technique where a 1-Wire device draws operating power from the data line via an internal diode and capacitor.
<a id="parasitic-power-up"></a>
**Parasitic power-up** — Unintended partial powering of an IC through its ESD clamp diodes when an external signal is applied while the supply is off.
<a id="parks-mcclellan"></a>
**Parks-McClellan algorithm** — Optimal equiripple method for FIR filter design minimizing maximum error in passband and stopband. Also called Remez algorithm.

<a id="pass-element"></a>
**Pass element** — The series transistor in a linear regulator whose resistance is continuously adjusted to maintain constant output voltage. See [Linear Regulators]({{< relref "/docs/analog/power-and-regulation/linear-regulators" >}}).


<a id="passband"></a>
**Passband** — The frequency range where a filter passes signals with minimal attenuation, ideally with flat response.

<a id="passband-ripple"></a>
**Passband ripple** — Amplitude variation within a filter's passband, characteristic of Chebyshev and elliptic designs; measured in dB.
<a id="patch-antenna"></a>
**Patch antenna** — Planar antenna with a rectangular or circular conductor on a dielectric substrate over a ground plane; compact and easy to fabricate on PCBs.

<a id="path-loss"></a>
**Path loss** — Signal attenuation during propagation from transmitter to receiver; includes free-space spreading, absorption, and scattering.


<a id="pcb-stackup"></a>
**PCB stackup** — The arrangement of copper layers, dielectric materials, and thicknesses defining a printed circuit board's electrical and physical properties.
<a id="pcm"></a>
**PCM (Pulse Code Modulation)** — Standard digital audio encoding where samples are quantized to discrete levels; the basis for CD, DAT, and most digital audio.

<a id="pdm"></a>
**PDM (Pulse Density Modulation)** — Encoding analog information as the density of pulses in a bitstream; output of 1-bit delta-sigma modulators.


<a id="pec"></a>
**PEC** — Packet Error Checking; optional CRC-8 byte appended to SMBus transactions for data integrity verification.
<a id="pendsv-exception"></a>
**PendSV** — Cortex-M exception used for deferring processing to lower priority, commonly used by RTOS for task context switching.

<a id="period-jitter"></a>
**Period jitter** — The deviation of any single clock period from the ideal period, measured as a standard deviation or peak-to-peak value.


<a id="periodic-jitter"></a>
**Periodic jitter (PJ)** — Deterministic jitter from supply noise or crosstalk at specific frequencies; appears as discrete sidebands in phase noise plots.
<a id="peripheral-clock-gating"></a>
**Peripheral clock gating** — Mechanism enabling or disabling individual peripheral clocks to save power; peripheral registers are inaccessible while the clock is gated.

<a id="phantom-power"></a>
**Phantom power** — 48 V DC supplied to condenser microphones through balanced audio cables; not needed for dynamic microphones.

<a id="phase-margin"></a>
**Phase margin** — The difference between actual phase shift and 360° at the frequency where loop gain equals unity, indicating stability margin. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}).

<a id="phase-noise"></a>
**Phase noise** — Random fluctuations in oscillator phase; expressed in dBc/Hz at a specific offset frequency from the carrier.

<a id="phased-array"></a>
**Phased array** — Antenna array with electronically controlled phase per element to steer the beam without mechanical movement.



<a id="pi-network"></a>
**Pi-network** — Three-element matching network with two shunt and one series reactive component, offering adjustable Q.
<a id="pick-and-place"></a>
**Pick-and-place** — Automated machine that picks components from reels or trays and places them onto solder-paste-coated PCB pads before reflow.

<a id="pierce-oscillator"></a>
**Pierce oscillator** — Crystal oscillator circuit commonly used in digital ICs, using a crystal between inverter input and output.
<a id="piezoelectric-effect"></a>
**Piezoelectric effect** — Generation of voltage from mechanical stress in certain materials. The mechanism behind microphonic noise in ceramic capacitors and the operating principle of crystal oscillators.

<a id="pin-diode"></a>
**PIN diode** — Diode with a thick intrinsic region between P and N layers that behaves as a variable resistor controlled by bias current; used in RF switches and attenuators.

<a id="pin-name"></a>
**Pin name** — The functional label of an IC pin (e.g., CLK, RESET, VCC). Describes what the pin does.

<a id="pin-number"></a>
**Pin number** — The physical location identifier of an IC pin on the package. Needed for PCB layout and manual probing.



<a id="pin-compatible"></a>
**Pin-compatible** — Components sharing identical package outline and pinout, allowing PCB-level substitution without layout changes.

<a id="pin-in-paste"></a>
**Pin-in-paste** — Assembly technique printing solder paste into through-hole component holes and reflowing to eliminate a separate wave-solder step.
<a id="pipeline-adc"></a>
**Pipeline ADC** — Multi-stage converter where each stage resolves a few bits and passes the residue; achieves high throughput with pipeline latency.
<a id="place-and-route"></a>
**Place and Route** — The FPGA design step that assigns logic to physical locations and connects them with routing resources.


<a id="plc"></a>
**PLC** — Programmable Logic Controller; industrial computer that replaced relay logic for machine control and process automation.
<a id="pll"></a>
**PLL (Phase-Locked Loop)** — A feedback circuit that synchronizes an output frequency with a reference frequency.

<a id="polarity"></a>
**Polarity** — The directional convention for voltage measurement. The terminal marked + is assumed to be at higher potential. Critical for electrolytic capacitors, which can be damaged by reverse polarity.

<a id="polarization"></a>
**Polarization** — Orientation of the electric field vector in an electromagnetic wave; can be linear (vertical, horizontal), circular, or elliptical.

<a id="pole"></a>
**Pole** — A frequency in a transfer function that contributes -20 dB/decade roll-off and -90 degrees of phase shift. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).

<a id="polyfuse"></a>
**Polyfuse** — A resettable overcurrent protection device (PTC thermistor) that increases resistance when tripped and resets when power is removed.

<a id="port"></a>
**Port** — A connection point in a hierarchical schematic that links a sub-sheet to the level above. Analogous to a function parameter in software.

<a id="positive-feedback"></a>
**Positive feedback** — Feedback where the returned signal reinforces the input, causing the output to diverge. Used deliberately in oscillators and latches. See [Feedback & Loop Intuition]({{< relref "/docs/analog/noise-stability-reality/feedback-and-loop-intuition" >}}).


<a id="post-layout-simulation"></a>
**Post-layout simulation** — Circuit simulation incorporating parasitic elements extracted from the actual PCB layout for improved accuracy.
<a id="post-mortem"></a>
**Post-mortem** — A structured write-up documenting a debugging session's symptom, root cause, misleading hypotheses, fix, and lessons learned for future pattern recognition.

<a id="post-mortem-debugging"></a>
**Post-mortem debugging** — Capturing crash data (faulting PC, fault status, stack contents) in non-volatile memory so fault information survives reset for later analysis.

<a id="potentiometer"></a>
**Potentiometer** — A three-terminal variable resistor with an adjustable wiper contact. Acts as an adjustable voltage divider.

<a id="powdered-iron-core"></a>
**Powdered iron core** — Inductor core made from iron particles with insulating gaps between them. Exhibits soft saturation and lower permeability than ferrite, useful for power inductors.

<a id="power-amplifier"></a>
**Power amplifier** — High-output-power RF amplifier; often operates nonlinearly (Class C, D, E) for efficiency at the expense of linearity.

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


<a id="power-ground"></a>
**Power ground (PGND)** — Return path for high-current circuits such as switching regulators and motor drivers.
<a id="power-rating"></a>
**Power rating** — The maximum continuous power a component can dissipate at a specified ambient temperature without exceeding its maximum operating temperature.

<a id="power-sequencing"></a>
**Power sequencing** — The required order and timing of multiple supply rails powering up and down, critical for multi-rail systems to avoid latchup or damage.

<a id="power-spectral-density"></a>
**Power spectral density** — Normalized spectral power per unit bandwidth (V²/Hz); independent of FFT length.

<a id="power-good-signal"></a>
**Power-good signal** — A digital output from a voltage regulator indicating that its output has reached and is within regulation limits.

<a id="ppm"></a>
**ppm (Parts Per Million)** — A measure of ratio. 1% = 10,000 ppm. Used for specifying temperature coefficients (e.g., 25 ppm/°C) and precision tolerances.

<a id="precision"></a>
**Precision (Repeatability)** — The consistency of repeated measurements. A precise instrument gives the same reading each time, though that reading may not be accurate.

<a id="pre-emphasis"></a>
**Pre-emphasis** — High-frequency signal boost at the transmitter to compensate for channel attenuation.

<a id="preamp"></a>
**Preamp** — First active amplification stage in a signal chain, critical for establishing system noise performance via the Friis formula.

<a id="prescaler"></a>
**Prescaler** — A counter used to divide a clock frequency by a fixed amount.

<a id="preselector"></a>
**Preselector** — Bandpass filter placed before an RF amplifier to reject out-of-band signals and reduce intermodulation from strong nearby signals.

<a id="primask-register"></a>
**PRIMASK** — Cortex-M register that disables all configurable interrupts when set. Blunt tool; BASEPRI is more selective.


<a id="priority-ceiling-protocol"></a>
**Priority ceiling protocol** — Concurrency protocol where a mutex is assigned the priority of its highest-priority potential user, preventing nested inversion.
<a id="priority-encoder"></a>
**Priority encoder** — An encoder that outputs the binary code of the highest-priority active input.


<a id="priority-inheritance"></a>
**Priority inheritance** — RTOS mechanism that temporarily raises a mutex holder's priority to match the highest-priority blocked waiter.
<a id="priority-inversion"></a>
**Priority inversion** — RTOS pathology where a low-priority task holding a resource blocks a high-priority task while medium-priority tasks run freely.

<a id="probe-compensation"></a>
**Probe compensation** — Adjusting a passive oscilloscope probe's trimmer capacitor so its RC time constant matches the scope input, producing a flat frequency response.

<a id="probe-loading"></a>
**Probe loading** — The distortion introduced by a measurement probe's input impedance (resistive and capacitive) on the circuit being measured. Most significant on high-impedance and high-frequency nodes.



<a id="product-change-notification"></a>
**Product Change Notification (PCN)** — Formal manufacturer document announcing changes to a component including discontinuation or process changes.
<a id="profibus"></a>
**Profibus** — Fieldbus protocol for industrial automation running on RS-485, widely used in European process control and factory automation.
<a id="propagation-delay"></a>
**Propagation delay** — The time for a signal to travel from one point to another, approximately 6-7 ns per meter on FR4 PCB traces.


<a id="propagation-velocity"></a>
**Propagation velocity** — Speed at which an electromagnetic wave travels through a medium, always less than or equal to c.
<a id="protect-mode"></a>
**Protect mode** — A self-protection state in power amplifiers triggered by DC offset, overcurrent, short circuit, or overtemperature, shutting down outputs to prevent damage.

<a id="protocol-decode"></a>
**Protocol decode** — Oscilloscope or logic analyzer feature that interprets captured waveforms as bus transactions (I2C addresses, SPI bytes, UART frames, etc.).


<a id="proximity-effect"></a>
**Proximity effect** — Redistribution of current in adjacent conductors due to mutual magnetic fields, increasing effective resistance at high frequencies.
<a id="ptc"></a>
**PTC (Positive Temperature Coefficient)** — A component whose resistance increases with temperature. Used as resettable fuses (polyfuses) and in self-regulating heater elements.

<a id="pull-up-resistor"></a>
**Pull-up resistor** — A resistor connected to a supply voltage to establish the HIGH level for open-drain or open-collector outputs.

<a id="pulse-frequency-modulation"></a>
**Pulse frequency modulation (PFM)** — A light-load operating mode where the switching frequency reduces to maintain efficiency. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).



<a id="pulse-position-modulation"></a>
**Pulse-position modulation** — Encoding technique where information is carried in the timing of pulse edges rather than pulse width or density.
<a id="push-pull-output-stage"></a>
**Push-pull output stage** — Complementary transistor pair that alternately sources and sinks current to the load, used in most power amplifier outputs.
<a id="pwm"></a>
**PWM** — Pulse-Width Modulation — generating analog-like output by toggling a digital pin at fixed frequency with variable duty cycle. Generated by timer hardware on MCUs.

---

## Q

<a id="q-point"></a>
**Q-point (quiescent point)** — The DC operating point of a transistor determined by the bias circuit. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).


<a id="qfh-antenna"></a>
**QFH antenna** — Quadrifilar helix antenna producing circular polarization, commonly used for weather satellite reception.
<a id="qfn"></a>
**QFN** — Quad Flat No-lead — an IC package with exposed pads on the bottom instead of visible side leads, requiring hot air or reflow for rework.

<a id="qfp"></a>
**QFP** — Quad Flat Package — an IC package with fine-pitch leads on all four sides, common for microcontrollers and interface chips.


<a id="quadrature-mixing"></a>
**Quadrature mixing** — Frequency conversion using two mixers with 90-degree LO phase offset to produce I and Q signal components.
<a id="quality-factor"></a>
**Quality factor (Q)** — A measure of how selective a resonant circuit or filter is, with higher Q meaning narrower bandwidth. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).


<a id="quantization-distortion"></a>
**Quantization distortion** — Signal-correlated error at small amplitudes where quantization error is no longer random; sounds harsh and metallic.
<a id="quantization-error"></a>
**Quantization error** — Difference between the actual analog value and the nearest quantized level.

<a id="quantization-noise"></a>
**Quantization noise** — Quantization error treated as additive noise when signals are large enough to randomize the error.


<a id="quarter-wave-transformer"></a>
**Quarter-wave transformer** — Transmission line section of specific impedance and quarter-wavelength used to transform impedance between two values.
<a id="quiescent-current"></a>
**Quiescent current** — The current drawn by a circuit when no signal is applied and no load is driven. Represents the standing power consumption of the circuit.

---

## R


<a id="r-2r-ladder"></a>
**R-2R ladder** — DAC resistor network using only two resistor values to produce binary-weighted output currents; simple, monotonic by design.
<a id="r_ds_on"></a>
**R_DS(on)** — The on-resistance of a MOSFET when fully enhanced, a key parameter for switching efficiency. See [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}).

<a id="race-condition"></a>
**Race condition** — Concurrency bug where the outcome depends on the timing of access to shared data across different execution contexts.

<a id="radiated-emission"></a>
**Radiated emission** — Electromagnetic interference that propagates through the air as electromagnetic waves from a circuit or cable.

<a id="radiation-pattern"></a>
**Radiation pattern** — Plot of relative field strength or power radiated by an antenna as a function of direction; usually shown as 2D slices.

<a id="radiation-resistance"></a>
**Radiation resistance** — Equivalent resistance representing the power radiated by an antenna; antenna efficiency equals R_rad / (R_rad + R_loss).


<a id="radio-horizon"></a>
**Radio horizon** — Maximum line-of-sight distance for radio propagation, slightly beyond the geometric horizon due to atmospheric refraction.
<a id="rail-sag"></a>
**Rail sag** — Drop in a power supply rail voltage under heavy load, caused by the supply's limited current capacity or resistive losses in the distribution path.

<a id="rail-to-rail"></a>
**Rail-to-rail** — An op-amp whose output can swing close to both supply rails, typically within 50-200 mV. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).


<a id="rain-fade"></a>
**Rain fade** — Signal attenuation at microwave and mmWave frequencies caused by absorption and scattering from raindrops.
<a id="random-jitter"></a>
**Random jitter** — Jitter with a Gaussian distribution caused by thermal noise and shot noise, unbounded in theory and characterized by RMS value.



<a id="rate-monotonic-scheduling"></a>
**Rate monotonic scheduling** — Priority assignment where tasks with shorter periods get higher priority; well-studied for periodic task sets.
<a id="rc-snubber"></a>
**RC snubber** — Series resistor-capacitor network placed across relay contacts or switches to suppress arcing and conducted EMI transients.
<a id="reactive-power"></a>
**Reactive power (Q)** — Power that cycles back and forth between source and reactive components (capacitors, inductors) without performing net work. Measured in VAR (volt-amperes reactive).

<a id="rayleigh-fading"></a>
**Rayleigh fading** — Small-scale fading where multipath components of comparable amplitude cause rapid signal variation following a Rayleigh distribution.

<a id="read-modify-write"></a>
**Read-modify-write** — Register access sequence of reading, modifying bits, and writing back. Not atomic on shared registers; can lose updates if interrupted.

<a id="real-power"></a>
**Real power (P)** — The power actually dissipated as heat or converted to useful work, measured in watts. The only component of power that shows up on your electricity bill.

<a id="real-time"></a>
**Real-time** — Meeting timing deadlines predictably — not necessarily fast, but deterministic and bounded-latency.

<a id="re-balling"></a>
**Re-balling** — Process of removing old solder balls from a BGA package and attaching new ones using solder paste or preforms before re-mounting the IC.


<a id="recapping"></a>
**Recapping** — Wholesale replacement of all electrolytic capacitors in vintage equipment to restore reliability after age-related degradation.

<a id="receiver-sensitivity"></a>
**Receiver sensitivity** — The minimum input signal power at which a receiver can achieve a specified performance level.

<a id="reciprocity"></a>
**Reciprocity** — Principle that an antenna's radiation pattern and impedance are the same whether transmitting or receiving.
<a id="reconstruction-filter"></a>
**Reconstruction filter** — Analog low-pass filter removing spectral images in DAC output, converting the staircase to smooth analog.

<a id="rectangular-window"></a>
**Rectangular window** — The implicit window when no windowing function is applied, providing the best frequency resolution but the worst spectral leakage.


<a id="reference-design"></a>
**Reference design** — Vendor-provided schematic and layout demonstrating tested component usage, intended as a starting point for custom designs.
<a id="reference-designator"></a>
**Reference designator** — The unique identifier for each component on a schematic and PCB: R1, C2, U3, Q4, etc. The letter indicates the component type; the number distinguishes instances.

<a id="reference-direction"></a>
**Reference direction** — The assumed direction of current flow or voltage polarity assigned during circuit analysis. If the calculated value is negative, the actual direction is opposite to the assumed reference.

<a id="reference-node"></a>
**Reference node (ground)** — The node assigned zero volts in nodal analysis. All other node voltages are measured relative to this reference.

<a id="reflection-coefficient"></a>
**Reflection coefficient** — Complex number (Γ) describing reflected wave magnitude and phase compared to the incident wave; Γ = (Z_L - Z₀) / (Z_L + Z₀).


<a id="reflow-profile"></a>
**Reflow profile** — Temperature-versus-time curve a PCB follows through a reflow oven, with preheat, soak, peak reflow, and cooling phases.

<a id="reflow-soldering"></a>
**Reflow soldering** — Assembly process where solder paste is heated through a controlled temperature profile to form joints on all pads simultaneously.
<a id="register"></a>
**Register** — A group of flip-flops sharing a common clock, storing a multi-bit word.

<a id="regression-testing"></a>
**Regression testing** — Verifying that a repair or change did not introduce new faults in previously working functions or adjacent circuits.

<a id="regulation"></a>
**Regulation** — How well a voltage source maintains its output under varying load conditions. Expressed as a percentage change from no-load to full-load.

<a id="relative-mode"></a>
**Relative mode** — A DMM mode that stores a reference reading and displays subsequent measurements as the difference from that reference, useful for zeroing out lead resistance.


<a id="relay-logic"></a>
**Relay logic** — Control system built from electromechanical relays wired to implement AND, OR, latching, and timing functions; precursor to PLCs.
<a id="reset-vector"></a>
**Reset vector** — Address in the vector table where the CPU begins execution after reset.

<a id="resolution"></a>
**Resolution** — The smallest change in a measured quantity that an instrument can display. A 4.5-digit DMM has finer resolution than a 3.5-digit DMM, but resolution is not the same as accuracy.


<a id="resolution-bandwidth"></a>
**Resolution bandwidth (RBW)** — Width of the IF filter in a spectrum analyzer that determines the minimum frequency separation between resolved signals.
<a id="resonant-frequency"></a>
**Resonant frequency (f_0)** — The frequency at which an LC circuit oscillates with maximum amplitude. See [RC & RL Filters]({{< relref "/docs/analog/filters-frequency-behavior/rc-and-rl-filters" >}}).

<a id="return-loss"></a>
**Return loss** — Loss in dB of reflected signal power; higher return loss indicates better impedance matching. Return loss = -20 log₁₀|Γ|.


<a id="return-loss-bridge"></a>
**Return loss bridge** — RF Wheatstone bridge circuit that measures scalar return loss by comparing a DUT to a 50-ohm reference.
<a id="reverse-polarity-protection"></a>
**Reverse polarity protection** — Using a series or parallel diode to block current if the supply is connected backwards. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="reverse-recovery-time"></a>
**Reverse recovery time** — The time during which a forward-conducting diode continues to conduct briefly in reverse while stored charge is swept out. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="rework"></a>
**Rework** — Manual modifications to a PCB after assembly: bodge wires, component swaps, cut traces. A normal part of prototype development but should be documented and incorporated into the next revision.


<a id="rf-absorber"></a>
**RF absorber** — Lossy material placed inside enclosures to damp cavity resonances.

<a id="rhcp"></a>
**RHCP** — Right-hand circular polarization; the electric field vector rotates clockwise as viewed from behind the wave.
<a id="ringing"></a>
**Ringing** — Damped oscillation in a circuit's step response, indicating marginal stability or underdamped poles. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}).

<a id="ripple-current"></a>
**Ripple current** — AC current superimposed on DC current flowing through a capacitor. Causes heating through ESR dissipation. Capacitor lifetime depends on keeping ripple current within ratings.

<a id="risc-v"></a>
**RISC-V** — Open instruction set architecture with modular extensions, growing rapidly as an alternative to ARM in the embedded space.

<a id="rise-time"></a>
**Rise time** — The time for an output to transition from 10% to 90% of its final value in response to a step input. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).


<a id="rmii"></a>
**RMII** — Reduced Media Independent Interface; pin-reduced parallel bus connecting an Ethernet MAC to a PHY on MCU boards.
<a id="rms"></a>
**RMS (Root Mean Square)** — The effective value of a time-varying signal. The RMS voltage of an AC waveform produces the same heating in a resistor as a DC voltage of the same value.



<a id="rogers-laminate"></a>
**Rogers laminate** — Low-loss PCB substrate with tightly controlled dielectric constant, standard for RF designs above a few gigahertz.

<a id="rollett-stability-factor"></a>
**Rollett stability factor** — Parameter K used to assess unconditional stability of a two-port RF device; K > 1 indicates stability.
<a id="rpmsg"></a>
**RPMsg** — Remote Processor Messaging framework for inter-processor communication between Linux A-cores and bare-metal M-cores.
<a id="rs-232"></a>
**RS-232** — A UART electrical standard using ±3 to ±15 V signal levels for point-to-point communication.

<a id="rs-485"></a>
**RS-485** — A differential serial standard supporting multi-drop networks over long distances.

<a id="rtl"></a>
**RTL (Register Transfer Level)** — The abstraction level describing digital design in terms of data storage and movement between registers.

<a id="rtl-sdr"></a>
**RTL-SDR** — Inexpensive software-defined radio dongle based on RTL2832U chip covering 24 MHz to 1.8 GHz; widely used for learning and experimentation.

<a id="rtos"></a>
**RTOS** — Real-Time Operating System — software layer providing preemptive multitasking, task scheduling, and synchronization primitives for embedded systems.

---

<a id="rtt"></a>
**RTT** — Real-Time Transfer; Segger protocol for high-speed logging via shared SRAM buffer and debug probe, without halting the CPU.

<a id="ruthroff-balun"></a>
**Ruthroff balun** — Transmission-line balun with a single winding, providing narrower bandwidth but simpler construction than Guanella.

## S

<a id="scope-tap"></a>
**Scope tap** — A permanent test point (often a BNC jack) wired across a circuit node to allow easy, repeatable oscilloscope connection without clip leads.

<a id="s-parameters"></a>
**S-parameters** — Scattering parameters measured by network analyzers describing how RF energy reflects and transmits at a device's ports.

<a id="safe-operating-area"></a>
**Safe Operating Area (SOA)** — The region in the I-V characteristic space where a transistor can safely operate without damage. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="sallen-key-filter"></a>
**Sallen-Key filter** — The most common active filter topology using a single op-amp in non-inverting configuration with two reactive elements. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="sample-and-hold"></a>
**Sample-and-hold** — Circuit that samples an analog signal and holds the value during conversion; fundamental ADC operation.

<a id="sar-adc"></a>
**SAR ADC** — Successive Approximation Register ADC — uses binary search to converge on input voltage. Fast (microseconds) and the most common ADC topology in MCUs.

<a id="saw-filter"></a>
**SAW filter (Surface Acoustic Wave)** — Filter using acoustic waves on a piezoelectric substrate; compact and commonly used in RF front-ends up to 3 GHz.

<a id="saturation-current"></a>
**Saturation current** — The current at which an inductor's core can no longer store additional magnetic energy, causing inductance to drop. Exceeding saturation current in a switching converter causes current to ramp uncontrollably.

<a id="saturation-region-bjt"></a>
**Saturation region (BJT)** — The operating region where both junctions are forward biased and the transistor acts as a low-impedance switch. See [Operating Regions]({{< relref "/docs/analog/biasing-operating-points/operating-regions" >}}).

<a id="schottky-diode"></a>
**Schottky diode** — A diode with a metal-semiconductor junction that exhibits lower forward voltage drop and faster switching compared to conventional junction diodes. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="scpi"></a>
**SCPI** — Standard Commands for Programmable Instruments — an ASCII command syntax for remote control of test equipment over GPIB, USB, or LAN.

<a id="sdr"></a>
**SDR (Software-Defined Radio)** — Radio system where filtering, demodulation, and signal processing traditionally done in hardware is performed in software.

<a id="second-breakdown"></a>
**Second breakdown** — A failure mode where localized heating causes destructive current focusing in high-voltage, high-current BJTs. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="selectivity"></a>
**Selectivity** — Receiver's ability to reject signals outside the desired frequency range; determined by filter sharpness.

<a id="self-calibration"></a>
**Self-calibration** — An automated internal calibration routine in an instrument that corrects for drift using built-in references, distinct from traceable external calibration.

<a id="self-heating"></a>
**Self-heating** — Power dissipation within a component raising its own temperature, changing its electrical parameters. See [Temperature & Drift]({{< relref "/docs/analog/biasing-operating-points/temperature-and-drift" >}}).

<a id="self-resonant-frequency"></a>
**Self-resonant frequency (SRF)** — The frequency at which a capacitor's ESL resonates with its capacitance, causing impedance to reach a minimum. Above the SRF, the capacitor behaves as an inductor.

<a id="semaphore"></a>
**Semaphore** — RTOS synchronization primitive — binary semaphores signal events; counting semaphores track available resources.

<a id="semihosting"></a>
**Semihosting** — Debug mechanism allowing target MCU to call host-side functions (printf, file I/O) via breakpoint. Slow (milliseconds per call); development use only.

<a id="sense-resistor"></a>
**Sense resistor** — A low-value precision resistor placed in a current path so that the voltage drop across it indicates the current flowing. Also called a current shunt.

<a id="sensitivity"></a>
**Sensitivity** — Minimum signal level a receiver can detect and process with acceptable performance; related to noise figure and bandwidth.

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

<a id="sfdr"></a>
**SFDR (Spurious-Free Dynamic Range)** — Ratio between the signal and the largest single spurious component.

<a id="shield-can"></a>
**Shield can** — A metal enclosure soldered to a PCB ground plane that contains or excludes electromagnetic fields around sensitive circuitry.

<a id="shielded-inductor"></a>
**Shielded inductor** — Inductor with a magnetic structure that contains the magnetic field, reducing radiated interference and susceptibility to external fields.

<a id="shift-register"></a>
**Shift register** — A register where data moves one position per clock cycle through cascaded flip-flops.

<a id="shoot-through"></a>
**Shoot-through** — Bridge driver fault where both upper and lower switches are ON simultaneously, shorting the supply rail. Prevented by dead-time insertion.

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

<a id="signal-injection"></a>
**Signal injection** — Introducing a known test signal at a point in the circuit and checking whether it appears correctly at subsequent stages.

<a id="signal-integrity"></a>
**Signal integrity** — The quality of an electrical signal on a transmission path, encompassing reflections, crosstalk, attenuation, and timing degradation.

<a id="signal-tracing"></a>
**Signal tracing** — Following a signal through successive stages of a circuit with an oscilloscope or probe to locate where it is lost, distorted, or stuck.

<a id="sinad"></a>
**SINAD (Signal-to-Noise-and-Distortion)** — The most comprehensive single metric for converter performance.

<a id="skin-effect"></a>
**Skin effect** — The phenomenon at high frequencies where current flows only in a thin surface layer of a conductor.

<a id="slack"></a>
**Slack** — The difference between required and actual signal arrival time; positive slack means the timing constraint is met.

<a id="slew-rate"></a>
**Slew rate** — The maximum rate at which an op-amp output can change voltage, typically expressed in V/µs. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="small-signal-analysis"></a>
**Small-signal analysis** — Linear circuit analysis describing how a device responds to small AC signals around a DC operating point. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="smd-resistor-marking"></a>
**SMD resistor marking** — Three or four digit code: for a 3-digit code, the first two digits are significant and the third is the exponent (e.g., "472" = 47 × 10² = 4,700 Ω).

<a id="smith-chart"></a>
**Smith chart** — Graphical tool mapping complex impedance to reflection coefficient; used for impedance matching network design and transmission line analysis.

<a id="snr"></a>
**SNR (Signal-to-Noise Ratio)** — The ratio of signal power to noise power, usually expressed in decibels. See [Noise Sources]({{< relref "/docs/analog/noise-stability-reality/noise-sources" >}}).

<a id="snubber"></a>
**Snubber** — An RC or RCD network that absorbs energy from switching transients, reducing voltage spikes and ringing. Placed across switches, relays, and inductive loads.

<a id="soft-start"></a>
**Soft-start** — A circuit feature that gradually ramps the output voltage during startup to limit inrush current. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="soic"></a>
**SOIC** — Small Outline Integrated Circuit — a surface-mount IC package with gull-wing leads on two sides, common for 8- to 28-pin devices.

<a id="solder-bridge"></a>
**Solder bridge** — An unintended blob of solder shorting two adjacent pads or pins, commonly occurring during hand soldering of fine-pitch components.

<a id="solder-wick"></a>
**Solder wick** — Braided copper strip that removes solder from pads and joints by capillary action when heated with a soldering iron.

<a id="source-deactivation"></a>
**Source deactivation** — The process of "turning off" independent sources to find equivalent resistance: voltage sources become short circuits; current sources become open circuits.

<a id="source-degeneration"></a>
**Source degeneration** — A source resistor in a MOSFET amplifier providing the same stabilizing feedback as emitter degeneration. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="source-follower"></a>
**Source follower** — A MOSFET buffer configuration (common drain) with unity voltage gain and low output impedance. See [Single-Transistor Amplifiers]({{< relref "/docs/analog/amplifiers-gain-stages/single-transistor-amplifiers" >}}).

<a id="spdif"></a>
**S/PDIF (Sony/Philips Digital Interface)** — Consumer digital audio interface carrying PCM on coaxial or optical connection with self-clocking.

<a id="spectral-leakage"></a>
**Spectral leakage** — Energy spread across frequency bins when a signal's frequency doesn't fall exactly on a bin center; artifact of finite-length analysis.

<a id="spectrogram"></a>
**Spectrogram** — Time-frequency representation showing how spectral content changes over time; trades off time and frequency resolution.

<a id="spectrum-analyzer"></a>
**Spectrum analyzer** — Test instrument displaying signal power versus frequency; essential for RF troubleshooting, spurious detection, and characterization.

<a id="spi"></a>
**SPI (Serial Peripheral Interface)** — A synchronous, full-duplex, master-slave serial bus using clock, data out, data in, and chip select lines.

<a id="spi-bus"></a>
**SPI** — Serial Peripheral Interface — synchronous full-duplex bus where master drives clock. CPOL and CPHA settings must match between master and slave.

<a id="sr-latch"></a>
**SR latch** — The simplest memory element made from two cross-coupled gates with Set and Reset inputs.

<a id="sram"></a>
**SRAM** — Static RAM — volatile memory used for runtime variables, stack, and heap on MCUs. No refresh required; typical sizes 4–256 KB.

<a id="sso"></a>
**SSO (Simultaneous Switching Output)** — The number of output pins switching at the same clock edge, affecting power integrity.

<a id="stack-overflow"></a>
**Stack overflow** — Condition where the stack grows past its allocated region into adjacent memory, causing silent corruption. No default fault on Cortex-M without MPU.

<a id="star-grounding"></a>
**Star grounding** — A grounding topology where all ground connections meet at a single point to avoid ground loops and shared-impedance coupling.

<a id="startup-code"></a>
**Startup code** — Assembly routine running before main() that loads the vector table, copies initialized data, zeros BSS, enables FPU, and configures clocks.

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
**Storage time** — The delay caused by excess base charge that must be removed before a saturated BJT can turn off. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="stripline"></a>
**Stripline** — A PCB trace between two ground planes providing excellent field containment and controlled impedance.

<a id="substitution-test"></a>
**Substitution test** — Replacing a suspect component with a known-good equivalent to determine if the original was faulty — a quick but destructive-to-undo test for soldered parts.

<a id="sub-threshold-conduction"></a>
**Sub-threshold conduction** — Exponential drain current below threshold voltage, exploited in ultra-low-power design. See [MOSFETs]({{< relref "/docs/fundamentals/semiconductors/mosfets" >}}).

<a id="superloop-pattern"></a>
**Superloop** — Simple main loop that polls sensors, updates state, and drives outputs in fixed sequence without interrupts or RTOS.

<a id="supercapacitor"></a>
**Supercapacitor** — Very high-capacitance component (farads to hundreds of farads) used for energy storage and extended holdup time. Much lower energy density than batteries but can charge and discharge rapidly.

<a id="superheterodyne"></a>
**Superheterodyne** — Receiver architecture using one or more mixers to downconvert RF to intermediate frequencies for easier filtering and amplification.

<a id="supernode"></a>
**Supernode** — In nodal analysis, a boundary drawn around a voltage source and its two adjacent nodes, allowing KCL to be applied to the combined region.

<a id="supermesh"></a>
**Supermesh** — In mesh analysis, a combined loop formed when a current source appears in a branch shared by two meshes. Allows KVL to be applied to the combined path.

<a id="superposition"></a>
**Superposition** — The principle that in a linear circuit, the total response equals the sum of the responses due to each independent source acting alone. Valid only for linear circuits.

<a id="swd-debug"></a>
**SWD** — Serial Wire Debug — 2-wire debug interface replacing JTAG on Cortex-M with same functionality and fewer pins.

<a id="switch-node"></a>
**Switch node** — The highest-noise node in a switching regulator, at the junction of the switch and inductor. See [Switching Regulators]({{< relref "/docs/analog/power-and-regulation/switching-regulators" >}}).

<a id="swo-trace"></a>
**SWO** — Serial Wire Output — optional third SWD wire carrying trace output from ITM and ETM.

<a id="synchronous-counter"></a>
**Synchronous counter** — A counter where all flip-flops are clocked simultaneously by the same clock edge.

<a id="synthesis"></a>
**Synthesis** — The process of converting an HDL description into a netlist of logic elements.

<a id="systematic-error"></a>
**Systematic error** — A consistent, repeatable measurement error in the same direction that does not reduce with averaging, caused by calibration offset or method bias.

<a id="systick-timer"></a>
**SysTick** — Built-in 24-bit Cortex-M down-counter generating periodic interrupts. Standard RTOS tick source requiring no peripheral clock configuration.

---

## T

<a id="t-flip-flop"></a>
**T flip-flop** — A flip-flop that toggles its output on each clock edge when T input is 1.



<a id="t-network"></a>
**T-network** — Three-element matching network with two series and one shunt reactive component.
<a id="table-driven-state-machine"></a>
**Table-driven state machine** — State machine where transitions are defined in a data table of (state, event, next-state, action) tuples.

<a id="tag-connect"></a>
**Tag-Connect** — Pogo-pin debug connector system requiring only PCB pads with no through-hole header, saving board space.
<a id="tantalum-capacitor"></a>
**Tantalum capacitor** — Polarized capacitor with high volumetric efficiency. Failure mode can be a low-impedance short circuit, potentially violent. Derate voltage significantly or use polymer tantalum types.

<a id="tank-circuit"></a>
**Tank circuit** — A resonant LC circuit that stores energy by oscillating between the electric field of the capacitor and the magnetic field of the inductor. Used in RF tuning and impedance matching.


<a id="task-control-block"></a>
**Task control block (TCB)** — RTOS data structure storing a task's state, priority, stack pointer, and scheduling metadata.
<a id="tcxo"></a>
**TCXO** — Temperature-Compensated Crystal Oscillator — a crystal oscillator with active compensation circuitry achieving frequency stability around 1-2 ppm.

<a id="tdm"></a>
**TDM (Time Division Multiplexing)** — Extension of I2S for multiple audio channels sharing a single serial data line with assigned time slots.

<a id="tdr"></a>
**TDR (Time Domain Reflectometry)** — Measurement technique using short pulses to characterize transmission lines and locate impedance discontinuities.

<a id="telegraphers-equations"></a>
**Telegrapher's equations** — Coupled differential equations describing voltage and current on a transmission line; the foundation of transmission line theory.

<a id="temperature-coefficient"></a>
**Temperature coefficient (tempco)** — The change in a component's value per degree Celsius, usually expressed in ppm/°C. A 100 ppm/°C resistor changes 0.01% per degree.


<a id="temporal-masking"></a>
**Temporal masking** — Psychoacoustic effect where a loud sound masks quieter sounds occurring just before and after it.

<a id="test-point"></a>
**Test point (TP)** — Dedicated accessible pad or loop on a PCB for probing a signal during debug and production testing.
<a id="testbench"></a>
**Testbench** — Non-synthesizable HDL code that drives a design under test with stimulus and checks outputs.

<a id="thd"></a>
**THD (Total Harmonic Distortion)** — Ratio of harmonic distortion power to fundamental signal power; measured with single-frequency sine wave.

<a id="thd-n"></a>
**THD+N (Total Harmonic Distortion plus Noise)** — Combined measure of all signal degradations (distortion and noise); more practical than THD alone.

<a id="thermal-camera"></a>
**Thermal camera** — Imaging device that maps surface temperatures across a PCB or system. Reveals hot spots, thermal gradients, and components operating near their limits.

<a id="thermal-coupling"></a>
**Thermal coupling** — Heat transfer between physically adjacent components. Can cause unintended parameter shifts when one component's dissipation heats a neighbor.


<a id="thermal-cycling-crack"></a>
**Thermal cycling crack** — Solder joint fracture caused by repeated expansion and contraction from temperature changes in power components.
<a id="thermal-gradient"></a>
**Thermal gradient** — Temperature variation across a PCB causing different components to operate at different temperatures. See [Temperature & Drift]({{< relref "/docs/analog/biasing-operating-points/temperature-and-drift" >}}).


<a id="thermal-interface-material"></a>
**Thermal interface material (TIM)** — Material filling the air gap between a heat-generating component and its heatsink to reduce thermal resistance.
<a id="thermal-paste"></a>
**Thermal paste** — Interface material applied between a component and heatsink to fill microscopic air gaps and reduce thermal resistance.


<a id="thermal-relief"></a>
**Thermal relief** — Spoke-pattern pad connection to a copper plane reducing heat sinking during soldering while maintaining electrical contact.
<a id="thermal-resistance"></a>
**Thermal resistance (θ)** — Resistance to heat flow, analogous to electrical resistance. Temperature rise equals power times thermal resistance: ΔT = P × θ. Measured in °C/W.

<a id="thermal-runaway"></a>
**Thermal runaway** — A positive feedback loop where increased temperature causes increased current (or power), which further increases temperature. Destructive if not interrupted.

<a id="thermal-shutdown"></a>
**Thermal shutdown** — A protection circuit that disables a regulator or power device if junction temperature exceeds a safe limit. See [Linear Regulators]({{< relref "/docs/analog/power-and-regulation/linear-regulators" >}}).

<a id="thermal-soak"></a>
**Thermal soak** — Extended-duration test running a circuit in a warm environment to reveal marginal solder joints, failing capacitors, or components that degrade when hot.



<a id="thermal-soak-test"></a>
**Thermal soak test** — Extended-duration powered test revealing marginal thermal, electrical, or mechanical issues that short tests miss.
<a id="thermal-throttling"></a>
**Thermal throttling** — Automatic clock speed reduction when an SoC reaches its thermal limit, silently lowering sustained performance.

<a id="thermal-via"></a>
**Thermal via** — PCB via placed under a component thermal pad to conduct heat from the surface to inner copper planes for spreading.
<a id="thermal-voltage"></a>
**Thermal voltage (V_T)** — kT/q, approximately 26 mV at room temperature. Appears throughout semiconductor device equations. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="thermoelectric-voltage"></a>
**Thermoelectric voltage** — A small DC voltage generated at junctions of dissimilar metals (Seebeck effect), creating microvolt-level offsets in precision DC measurements.


<a id="thermometer-coding"></a>
**Thermometer coding** — Encoding where each increasing value activates one additional element; reduces glitch energy in segmented DACs.

<a id="theta-ja"></a>
**Theta-JA** — Total thermal resistance from IC junction to ambient air, used to estimate operating junction temperature.

<a id="theta-jc"></a>
**Theta-JC** — Thermal resistance from IC junction to case or exposed thermal pad; a fixed package property.
<a id="thevenin-termination"></a>
**Thevenin termination** — Transmission line termination using a voltage divider (pull-up and pull-down resistors) to bias the line to a mid-level voltage while providing the correct impedance.

<a id="thevenin-equivalent"></a>
**Thévenin equivalent** — Any linear circuit reduced to a voltage source (V_th) in series with a resistance (R_th). Simplifies analysis of how the circuit interacts with different loads. See [Thévenin & Norton]({{< relref "/docs/fundamentals/circuit-analysis/thevenin-norton" >}}).

<a id="thick-film-resistor"></a>
**Thick-film resistor** — The most common SMD resistor type. Moderate tolerance (1–5%), moderate tempco. Adequate for most applications; specify thin-film when precision is needed.

<a id="thin-film-resistor"></a>
**Thin-film resistor** — Precision SMD resistor with tight tolerance (0.1% or better), excellent tempco, and low noise. Costs more than thick-film. Use for instrumentation, precision voltage references, and sensor signal conditioning.

<a id="three-digit-cap-code"></a>
**Three-digit capacitor code** — Marking system where the first two digits are significant and the third is a power-of-ten multiplier in picofarads. E.g., "104" = 10 × 10⁴ pF = 100 nF.


<a id="tightly-coupled-memory"></a>
**Tightly-coupled memory (TCM)** — On-chip SRAM with single-cycle, deterministic access on Cortex-M7, bypassing caches for predictable timing.
<a id="time-constant"></a>
**Time constant (τ)** — The characteristic response time of an RC or RL circuit. τ = RC for capacitive circuits; τ = L/R for inductive circuits. After one time constant, the circuit reaches 63% of its final value.


<a id="timer-relay"></a>
**Timer relay** — Relay with a built-in time delay; on-delay and off-delay variants provide sequencing in relay logic control circuits.
<a id="timing-closure"></a>
**Timing closure** — The iterative process of modifying a design until all timing constraints are met.


<a id="tin-whisker"></a>
**Tin whisker** — Conductive crystalline filament that grows from pure tin surfaces over time, capable of shorting adjacent pins or traces.

<a id="tinyusb"></a>
**TinyUSB** — Portable open-source USB device and host stack supporting many MCU families and device classes.
<a id="tip-and-barrel-technique"></a>
**Tip-and-barrel technique** — Oscilloscope probing method using the probe tip and barrel ground spring instead of the long ground clip, minimizing ground loop area for high-frequency measurements.

<a id="tolerance"></a>
**Tolerance** — The allowable deviation of a component's actual value from its nominal value, expressed as a percentage. A 10 kΩ ±1% resistor can range from 9,900 Ω to 10,100 Ω.

<a id="tolerance-stacking"></a>
**Tolerance stacking** — The accumulated uncertainty when multiple components' tolerances combine in a circuit. Worst-case analysis adds tolerances; statistical analysis uses root-sum-square.

<a id="tombstoning"></a>
**Tombstoning** — SMD soldering defect where a two-terminal component stands up on one end due to uneven solder paste reflow, leaving one pad unconnected.


<a id="torn-read"></a>
**Torn read** — Reading a multi-byte value that was partially updated by another context, yielding a half-old, half-new result.
<a id="toslink"></a>
**TOSLINK** — Optical digital audio interface using LED/photodiode coupling; immune to ground loops but with higher inherent jitter than coaxial.


<a id="touchstone-file"></a>
**Touchstone file** — Standard file format (.s1p, .s2p) for exchanging S-parameter data between simulation and measurement tools.
<a id="tpdf-dither"></a>
**TPDF dither** — Triangular Probability Density Function dither with ±1 LSB peak amplitude; completely eliminates quantization distortion.


<a id="tpiu"></a>
**TPIU** — Trace Port Interface Unit; serializes ITM and ETM trace data for output through SWO or a parallel trace port.
<a id="traceable-calibration"></a>
**Traceable calibration** — Calibration performed against standards with documented accuracy linked back to a national metrology institute through an unbroken chain of comparisons.

<a id="transconductance"></a>
**Transconductance (g_m)** — The ratio of output current change to input voltage change, equal to I_C / V_T for BJTs. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="transfer-curve"></a>
**Transfer curve** — A plot of output versus input (often displayed using XY mode on an oscilloscope) showing the gain and linearity of an amplifier or circuit.

<a id="transfer-function"></a>
**Transfer function** — The mathematical ratio of output to input as a function of frequency, fully describing a linear circuit's frequency behavior. See [Active Filters]({{< relref "/docs/analog/filters-frequency-behavior/active-filters" >}}).

<a id="transient"></a>
**Transient** — A brief, fast-changing voltage or current event. Switching events, power-on surges, and ESD are common transient sources.




<a id="transient-analysis"></a>
**Transient analysis (.TRAN)** — SPICE time-domain simulation showing circuit response to changing inputs, startup behavior, and switching waveforms.
<a id="transition-band"></a>
**Transition band** — Frequency range between a filter's passband edge and stopband edge where attenuation increases.
<a id="transition-frequency"></a>
**Transition frequency** — Frequency at which a transistor's current gain drops to unity; key parameter for determining amplifier bandwidth.
<a id="transmission-line"></a>
**Transmission line** — A conductor pair whose distributed inductance and capacitance cause reflection and wave propagation effects at high frequencies.

<a id="trigger"></a>
**Trigger** — Oscilloscope feature that synchronizes the display to a specific event on the waveform, producing a stable, readable display.


<a id="trimmer-potentiometer"></a>
**Trimmer potentiometer** — Small adjustable resistor mounted on a PCB for calibration or bias adjustment; common in legacy circuits needing precision.
<a id="triode-region"></a>
**Triode region** — The MOSFET operating region where it behaves as a voltage-controlled resistor, analogous to BJT saturation. See [Operating Regions]({{< relref "/docs/analog/biasing-operating-points/operating-regions" >}}).

<a id="true-rms"></a>
**True RMS** — A measurement method that computes the actual root-mean-square value of an AC waveform, giving correct readings for non-sinusoidal signals unlike average-responding meters.


<a id="truncation"></a>
**Truncation** — Rounding toward zero when reducing bit depth; creates a DC offset in quantization error unlike symmetric rounding.
<a id="truth-table"></a>
**Truth table** — A table listing every input combination and corresponding output for a logic function.

<a id="tssop"></a>
**TSSOP** — Thin-Shrink Small Outline Package — a narrower, thinner variant of SOIC with finer lead pitch.

<a id="ttl"></a>
**TTL (Transistor-Transistor Logic)** — A logic family built from bipolar transistors, historically the dominant digital logic technology.

<a id="tvs"></a>
**TVS (Transient Voltage Suppressor)** — A specialized diode designed to absorb large transient energy pulses with well-defined clamping voltage. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="two-flip-flop-synchronizer"></a>
**Two-flip-flop synchronizer** — Two flip-flops in series used to safely synchronize signals between clock domains.

<a id="type-k-thermocouple"></a>
**Type K thermocouple** — A chromel-alumel thermocouple covering -200 to +1260 degrees C, the most common general-purpose thermocouple type.

---

## U


<a id="ua741"></a>
**uA741 (LM741)** — Early monolithic op-amp IC (1968) that made operational amplifiers cheap enough for widespread use in analog design.
<a id="uart"></a>
**UART (Universal Asynchronous Receiver-Transmitter)** — An asynchronous, full-duplex, point-to-point serial interface without a dedicated clock line.

<a id="uart-serial"></a>
**UART** — Universal Asynchronous Receiver/Transmitter — point-to-point serial interface with no shared clock. Standard for debug consoles and simple communication.


<a id="unit-circle"></a>
**Unit circle** — The boundary of stability in the z-plane; IIR filter poles inside are stable, poles on or outside cause oscillation.
<a id="unity-power-factor"></a>
**Unity power factor** — Power factor of 1, meaning voltage and current are perfectly in phase. All power delivered is real power; no reactive power is present.

<a id="unshielded-inductor"></a>
**Unshielded inductor** — Inductor with an open magnetic path that allows the magnetic field to radiate. Can couple interference to nearby circuits and is susceptible to external fields.


<a id="usagefault"></a>
**UsageFault** — Cortex-M exception for illegal instructions, unaligned access, division by zero, or disabled coprocessor use.
<a id="usb-cdc"></a>
**USB CDC** — USB Communications Device Class making an MCU appear as a virtual serial port to the host computer. Simplest way to add USB console functionality.


<a id="usb-descriptor"></a>
**USB descriptor** — Structured data table describing a USB device's identity, class, endpoints, and capabilities to the host.

<a id="usb-endpoint"></a>
**USB endpoint** — Addressable data buffer in the USB peripheral for sending or receiving packets in a specific transfer direction.
<a id="usb-enumeration"></a>
**USB enumeration** — Host-driven process of discovering and configuring a USB device through control transfers and descriptor exchange.

<a id="usb-hid"></a>
**USB HID** — USB Human Interface Device class for keyboards, mice, and custom reports. Requires no driver installation on major operating systems.

---

<a id="usb-isolator"></a>
**USB isolator** — Module that provides galvanic isolation on the USB data and power lines to break ground loops between host and device.

<a id="usb-otg"></a>
**USB OTG (OTG)** — On-The-Go; USB mode where a single peripheral can operate as either host or device, negotiating role at connection.

<a id="usb-phy"></a>
**USB PHY (ULPI)** — Physical layer transceiver handling USB electrical signaling; on-chip for full speed, often external for high speed.

<a id="user-space"></a>
**User space** — Unprivileged execution environment where applications run, accessing hardware only through system calls.

## V



<a id="v-score"></a>
**V-score** — V-shaped groove partially cut through a PCB panel, allowing individual boards to be snapped apart after assembly.
<a id="vce-sat"></a>
**V_CE(sat)** — Collector-emitter saturation voltage of a BJT when fully on; determines conduction loss in switching applications.
<a id="varactor"></a>
**Varactor** — A diode whose junction capacitance varies with reverse voltage, used for frequency tuning and modulation. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="vco"></a>
**VCO (Voltage Controlled Oscillator)** — An oscillator whose output frequency is controlled by an input voltage.


<a id="vcxo"></a>
**VCXO** — Voltage-controlled crystal oscillator that allows small frequency adjustments via an applied voltage.
<a id="vector-table"></a>
**Vector table** — Array of 32-bit addresses at the start of flash containing the initial stack pointer value and all interrupt handler addresses.

<a id="velocity-factor"></a>
**Velocity factor** — Ratio of signal propagation velocity in a cable or transmission line to the speed of light in free space; typically 0.66 to 0.85.

<a id="verilog"></a>
**Verilog** — A hardware description language for designing and simulating digital circuits.

<a id="vhdl"></a>
**VHDL** — A hardware description language for designing and simulating digital circuits, more verbose than Verilog.


<a id="via-aspect-ratio"></a>
**Via aspect ratio** — Ratio of via depth to diameter; standard mechanical drills are limited to about 10:1.

<a id="via-fence"></a>
**Via fence** — Row of closely spaced vias along a trace or boundary, confining fields and improving isolation between sections.
<a id="via-stitching"></a>
**Via stitching** — Multiple vias connecting ground planes between PCB layers to maintain low-impedance ground connections. See [Decoupling & Bypassing]({{< relref "/docs/analog/power-and-regulation/decoupling-and-bypassing" >}}).


<a id="via-in-pad"></a>
**Via-in-pad** — PCB technique placing a via directly in a component pad, requiring via fill and planarization to prevent solder wicking.
<a id="vih"></a>
**VIH** — Voltage Input High — the minimum voltage a logic input recognizes as a valid HIGH.

<a id="vil"></a>
**VIL** — Voltage Input Low — the maximum voltage a logic input recognizes as a valid LOW.

<a id="virtual-ground"></a>
**Virtual ground** — The condition in a negative-feedback op-amp circuit where both inputs are at effectively the same voltage. See [Op-Amps]({{< relref "/docs/analog/amplifiers-gain-stages/op-amps" >}}).

<a id="vna"></a>
**VNA (Vector Network Analyzer)** — Instrument measuring both magnitude and phase of S-parameters; essential for impedance and filter characterization.

<a id="voh"></a>
**VOH** — Voltage Output High — the minimum voltage a logic output guarantees when driving a logic HIGH.

<a id="vol"></a>
**VOL** — Voltage Output Low — the maximum voltage a logic output guarantees when driving a logic LOW.

<a id="volt"></a>
**Volt (V)** — SI unit of electric potential difference. One volt drives one ampere through one ohm of resistance.

<a id="volatile-keyword"></a>
**Volatile keyword** — C qualifier preventing the compiler from caching a variable in registers. Required for ISR-shared and hardware-mapped variables but does not provide atomicity.

<a id="voltage-coefficient"></a>
**Voltage coefficient** — The change in a component's value with applied voltage. Most significant in ceramic capacitors (DC bias effect) and carbon composition resistors.

<a id="voltage-divider"></a>
**Voltage divider** — A network (typically two resistors in series) that produces an output voltage proportional to the input voltage. Output depends on the ratio of the resistances and is affected by load current. See [Voltage Dividers & Loading]({{< relref "/docs/fundamentals/circuit-analysis/voltage-dividers-and-loading" >}}).

<a id="voltage-divider-bias"></a>
**Voltage divider bias** — The standard BJT biasing topology using a voltage divider to set the base voltage and an emitter resistor to stabilize collector current. See [BJTs]({{< relref "/docs/fundamentals/semiconductors/bjts" >}}).

<a id="voltage-headroom"></a>
**Voltage headroom** — The available voltage range for signal swing between the supply rails and the device's saturation or cutoff limits. See [DC Biasing]({{< relref "/docs/analog/biasing-operating-points/dc-biasing" >}}).

<a id="voltage-injection-method"></a>
**Voltage injection method** — Technique for locating shorts on a PCB by injecting current through the short and measuring the voltage gradient to find the fault location.

<a id="voltage-reference"></a>
**Voltage reference** — A circuit producing a precise, stable voltage used as a comparison standard in regulators, ADCs, and measurement circuits. See [Reference Voltages]({{< relref "/docs/analog/power-and-regulation/reference-voltages" >}}).

<a id="vswr"></a>
**VSWR (Voltage Standing Wave Ratio)** — Ratio of voltage maximum to minimum on a transmission line; indicates impedance match quality. VSWR = (1 + |Γ|) / (1 - |Γ|).

---

<a id="vswr-circle"></a>
**VSWR circle** — Circle on the Smith chart representing all impedances with the same VSWR.

## W

<a id="wander"></a>
**Wander** — Very low-frequency phase variation (below 10 Hz) in a clock or data signal, distinct from jitter.


<a id="watchpoint"></a>
**Watchpoint** — Data breakpoint that halts the CPU when a specific memory address is read or written; uses DWT hardware.
<a id="watt"></a>
**Watt (W)** — SI unit of power. One watt equals one joule per second. One watt equals one volt times one ampere in a DC circuit.

<a id="watt-hour"></a>
**Watt-hour (Wh)** — Unit of energy. One watt-hour equals 3,600 joules. Used to rate battery capacity alongside milliamp-hours.

<a id="watchdog-timer"></a>
**Watchdog timer** — A timer that resets a system if software or hardware fails to complete a sequence within bounded time.


<a id="wave-soldering"></a>
**Wave soldering** — Mass soldering process where a PCB passes over a standing wave of molten solder, connecting all through-hole joints at once.
<a id="waveguide"></a>
**Waveguide** — Metallic pipe structure for guiding electromagnetic waves at microwave and millimeter-wave frequencies; supports higher power than coax.

<a id="wavelet-transform"></a>
**Wavelet transform** — Variable time-frequency transform with good time resolution at high frequencies and good frequency resolution at low frequencies.

<a id="wcet"></a>
**WCET** — Worst-Case Execution Time — the maximum time a code path can take including all delays. The only execution time that matters for real-time guarantees.


<a id="webench"></a>
**WEBENCH** — TI online design tool that generates customized power supply schematics and component selections from user requirements.
<a id="wheatstone-bridge"></a>
**Wheatstone bridge** — A four-resistor bridge circuit used for precise measurement of resistance changes, commonly used with strain gauges and RTDs.



<a id="wheeler-cap-method"></a>
**Wheeler cap method** — Technique for measuring antenna radiation efficiency by comparing impedance with and without a conductive enclosure.
<a id="widlar-current-source"></a>
**Widlar current source** — Modified current mirror using an emitter resistor on the output transistor to produce a much smaller reference current.
<a id="wiggle-test"></a>
**Wiggle test** — Gently flexing cables, pressing connectors, or tapping components while monitoring for intermittent behavior to localize mechanical connection faults.

<a id="wilkinson-divider"></a>
**Wilkinson divider** — Broadband power divider using quarter-wave transmission lines and a termination resistor; provides good isolation between output ports.


<a id="wilson-mirror"></a>
**Wilson mirror** — Three-transistor current mirror that cancels base-current error, giving higher output impedance than a simple mirror.

<a id="windowed-sinc"></a>
**Windowed sinc** — FIR filter design method: truncate the ideal sinc impulse response to finite length and apply a window function to control sidelobes.
<a id="windowing-function"></a>
**Windowing function** — Taper applied to finite-length signal blocks to reduce spectral leakage at the cost of slightly worse frequency resolution.

<a id="wiper"></a>
**Wiper** — The moving contact in a potentiometer that slides along the resistive element, creating a variable voltage divider.

<a id="wirewound-resistor"></a>
**Wirewound resistor** — Precision resistor made by winding resistance wire on a form. Excellent tolerance and tempco but significant parasitic inductance. Not suitable for high-frequency circuits.

---

<a id="word-select"></a>
**Word select (WS)** — I2S signal toggling at the sample rate to indicate left or right audio channel; also called LRCK.

<a id="worst-case-analysis"></a>
**Worst-case analysis (WCA)** — Tolerance method assuming all components are simultaneously at their extreme values to guarantee circuit operation.

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

<a id="yagi-uda-antenna"></a>
**Yagi-Uda antenna** — Directional antenna with a driven element, reflector, and one or more directors; provides high gain in a compact form. Commonly called a Yagi.

---

<a id="yocto"></a>
**Yocto** — Embedded Linux build framework producing custom distributions with layer-based configuration and long-term maintenance support.

## Z

<a id="zener-diode"></a>
**Zener diode** — A diode designed to operate in reverse breakdown at a specific voltage, used for voltage references and simple regulators. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="zener-regulator"></a>
**Zener regulator** — A simple voltage regulator consisting of a Zener diode fed through a current-limiting resistor. See [Diodes]({{< relref "/docs/fundamentals/semiconductors/diodes" >}}).

<a id="zephyr-os"></a>
**Zephyr** — Modern embedded RTOS with device tree, driver framework, networking stacks, and Bluetooth support.

<a id="zero"></a>
**Zero** — A frequency in a transfer function that contributes +20 dB/decade gain and +90 degrees of phase advance. See [Frequency Response]({{< relref "/docs/analog/filters-frequency-behavior/frequency-response" >}}).

<a id="zero-if-receiver"></a>
**Zero-IF receiver** — Receiver that downconverts directly to baseband using a mixer driven at the RF frequency; eliminates image problems but introduces DC offset issues.

<a id="zero-order-hold"></a>
**Zero-order hold** — Simplest DAC reconstruction holding each sample value until the next; produces staircase with sinc-shaped frequency response.

<a id="zero-padding"></a>
**Zero-padding** — Appending zeros to a signal block before FFT to interpolate the spectrum; improves display smoothness but not true resolution.
