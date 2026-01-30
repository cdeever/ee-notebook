---
title: "Analog Peripherals"
weight: 30
---

# Analog Peripherals

Microcontrollers are digital devices, but the physical world is analog. On-chip analog peripherals — ADCs, DACs, comparators, and voltage references — bridge that boundary, converting between continuous voltages and discrete digital values. Understanding these peripherals means understanding both the digital configuration (registers, channels, triggers) and the analog reality (noise, impedance, settling time) that governs their actual performance.

## ADC Fundamentals

The most common on-chip ADC topology is the **successive approximation register (SAR)** converter. A SAR ADC works by binary search: it compares the input voltage against a DAC-generated reference, adjusting one bit at a time from MSB to LSB. A 12-bit conversion takes 12 comparison cycles, making SAR converters fast enough for most embedded applications (conversion times in the low microseconds at typical clock rates).

**Resolution** is stated in bits — 10, 12, or 16 bits are common. A 12-bit ADC divides the reference voltage into 4096 steps. At a 3.3 V reference, each step (LSB) is about 0.8 mV. But stated resolution is not the same as actual accuracy — that depends on noise, nonlinearity, and reference quality.

**Sampling rate** depends on the ADC clock, the number of conversion cycles, and the sample-and-hold time. Typical on-chip SAR ADCs achieve 1-5 Msps at full resolution, with some trading resolution for speed. For audio-rate signals (up to 20 kHz), even modest ADCs are far more than adequate. For RF or high-speed data acquisition, an external ADC is usually necessary.

## ADC Configuration

On-chip ADCs are more configurable than most beginners expect, and getting the configuration wrong accounts for a large share of "my ADC readings are noisy" complaints.

### Channel Selection

Most MCUs have one or two physical ADC cores, but many analog input pins multiplexed to them. A channel selection register or sequence defines which pin(s) to convert. Many ADCs support scan mode — converting a sequence of channels automatically — and some can interleave multiple ADC cores on the same input for higher effective sampling rates.

A subtlety: when switching channels on a multiplexed ADC, the S&H capacitor retains charge from the previous channel. If the previous channel was at 3.3 V and the new channel is at 0.1 V, the first conversion after switching may be inaccurate because the capacitor must discharge through the new source. Discarding the first sample after a channel switch, or inserting an extra dummy conversion, is a common workaround.

### Reference Voltage

The ADC measures the input as a ratio of the reference voltage. The reference can be:
- **Internal bandgap reference** — typically 1.2 V, stable but limits input range
- **Supply voltage (VDDA)** — convenient but only as clean and stable as your supply
- **External reference pin** — a dedicated VREF pin driven by a precision reference IC

The choice of reference directly affects accuracy. Using VDDA as the reference means any supply noise modulates the conversion result. For ratiometric measurements (like a potentiometer divider powered from the same supply), VDDA as reference is actually ideal because supply variations cancel. For absolute voltage measurements, an external reference is worth the extra component. See [Reference Voltages]({{< relref "/docs/analog/power-and-regulation/reference-voltages" >}}) for more on precision references.

### Sample-and-Hold Time

Before each conversion, the ADC's internal sample-and-hold (S&H) capacitor must charge to the input voltage. The charging time constant depends on the S&H capacitor (typically a few picofarads) and the total source resistance (external source impedance plus internal mux resistance, often 1-10 kohm).

**High-impedance sources are the most common ADC configuration mistake.** If the source impedance is too high, the S&H capacitor does not fully charge during the sampling window, and the conversion result is low. The datasheet specifies maximum source impedance for a given sample time — exceed it and accuracy degrades silently. Solutions: increase sample time (if the ADC supports it), or add an external op-amp buffer between the sensor and the ADC input. A buffer also prevents the ADC sampling from loading the sensor circuit, which matters for high-impedance sources like pH probes or piezoelectric sensors.

## ADC Noise and Effective Resolution

A 12-bit ADC does not deliver 12 bits of useful information. Noise from the analog input, the reference, the ADC itself, and digital switching on the same die all reduce the effective number of bits (ENOB). A typical on-chip 12-bit ADC might deliver 10-11 ENOB under good conditions. Under poor conditions (noisy supply, long analog traces, high-impedance source), ENOB can drop to 8-9 bits.

**Improving effective resolution:**
- **Averaging:** Convert the same channel multiple times and average. Averaging N samples improves SNR by sqrt(N), so 16 averages gain about 2 bits of effective resolution — but only if the noise is random and uncorrelated
- **Oversampling and decimation:** Sample at a higher rate than needed, then digitally filter and decimate. This is a well-established technique that genuinely adds resolution beyond the ADC's native capability, provided the input contains sufficient noise to dither the LSBs
- **Hardware filtering:** A simple RC low-pass filter on the ADC input attenuates high-frequency noise before it reaches the converter. A cutoff frequency just above the signal bandwidth is usually appropriate
- **Layout and decoupling:** Keep analog input traces short, away from digital signals, and decouple the VDDA supply with 100 nF ceramic plus 1-10 uF bulk capacitors close to the MCU pins. See [Decoupling & Bypassing]({{< relref "/docs/analog/power-and-regulation/decoupling-and-bypassing" >}}) for placement guidance

## DAC Basics

A digital-to-analog converter generates an analog output voltage from a digital code. On-chip DACs are typically 8-12 bits and much simpler than ADCs — they are essentially R-2R ladders or current-steering arrays driven by a register.

**Output buffering:** Most on-chip DACs include an optional output buffer amplifier. Without the buffer, the DAC output has high impedance and can only drive very light loads (a few microamps). With the buffer enabled, the output can drive moderate loads (a few milliamps into capacitive loads), but the buffer introduces its own offset and noise. For precision applications, an external op-amp buffer with better specifications is often the right answer.

**Settling time** is how long the output takes to reach the final value after a new code is written. For audio waveform generation (driving a speaker through an amplifier), the DAC must settle within one sample period — at 44.1 kHz, that is about 22.7 us, easily achievable for most on-chip DACs. For fast waveform generation or signal synthesis, settling time becomes the limiting factor.

**Common uses:** Audio output, bias voltage generation, threshold setting for comparators, and control voltage for analog circuits (loop filters, variable gain stages). The DAC is often the simplest analog peripheral to configure, but its usefulness is limited by its resolution and output drive capability.

## Comparators

An analog comparator compares two voltages and outputs a digital HIGH or LOW depending on which input is larger. No conversion, no clock, no latency in the traditional sense — the comparator output responds as fast as its propagation delay (typically tens of nanoseconds for on-chip comparators).

**Applications:**
- **Threshold detection:** Triggering when a signal crosses a voltage level — overvoltage, undervoltage, or overcurrent detection for protection circuits
- **Zero-crossing detection:** Detecting when an AC signal crosses ground, useful for phase measurement and TRIAC control timing
- **Wake-up from low-power modes:** Some MCUs allow a comparator event to wake the CPU from sleep without keeping the ADC running, saving significant power

**Hysteresis** is critical for comparator applications. Without hysteresis, a slowly changing input near the threshold causes the output to oscillate rapidly as noise pushes the signal back and forth across the threshold. On-chip comparators usually offer configurable hysteresis (5-50 mV typical), or you can implement external hysteresis with a resistor from the output to the non-inverting input. See [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}) for more on feedback and oscillation in analog circuits.

**Comparator output routing:** On many MCUs, the comparator output can be routed internally to timer capture inputs, interrupt lines, or even used as a blanking signal for PWM outputs — all without leaving the chip. This makes comparators very useful for real-time protection in motor control and power converter designs, where an overcurrent condition must shut down PWM outputs within nanoseconds, far faster than any software path.

## Internal Voltage References

Most MCUs include a bandgap voltage reference, typically producing around 1.2 V (the bandgap voltage of silicon). This reference can serve as the ADC reference, the comparator reference, or as a known voltage for calibration.

**Temperature coefficient:** Bandgap references are designed to be temperature-stable, but "stable" is relative. On-chip references typically have a temperature coefficient of 10-100 ppm/C. Over a 50 C temperature range, that is 0.05-0.5% drift — negligible for some applications, unacceptable for precision measurement. External references (like the LM4040 or REF3030) offer 5-50 ppm/C and tighter initial accuracy.

**Calibration:** Many MCUs store factory-calibrated reference values in flash memory. Using the calibration data improves absolute accuracy. For the highest accuracy, self-calibration against an external known voltage at operating temperature is best, but this requires a reference more accurate than the one being calibrated.

**Startup time:** Internal references often need tens to hundreds of microseconds to stabilize after being enabled. If the ADC converts before the reference is ready, the result is meaningless. The datasheet specifies the reference startup time — firmware must either wait or use a startup delay flag before triggering the first conversion.

## DMA with Analog Peripherals

Direct Memory Access (DMA) allows the ADC to stream conversion results directly into memory without CPU intervention. This is essential for continuous data acquisition — audio sampling, sensor logging, or any application that needs to capture analog data at a steady rate without firmware jitter.

**Typical setup:** Configure the ADC to trigger conversions at a fixed rate (using a timer trigger), and configure DMA to transfer each result to a buffer in RAM. Circular DMA mode wraps the buffer pointer automatically, creating a continuously updating ring buffer. Firmware processes completed buffers (or half-buffers, using the half-transfer interrupt) while DMA fills the other half.

**Why DMA matters:** Without DMA, every ADC conversion requires an interrupt to read the result register. At 10 ksps, that is 10,000 interrupts per second — manageable but wasteful. At 1 Msps, that is a million interrupts per second, which dominates CPU time and may not even be feasible depending on interrupt latency. DMA eliminates this overhead entirely, allowing the CPU to process data in bulk at its own pace.

The same DMA pattern works for DAC output — filling a buffer with waveform samples and letting DMA feed them to the DAC at a timer-triggered rate produces clean, jitter-free analog output. This is how most MCU-based audio output and signal generation works.

## Gotchas

- **Source impedance kills ADC accuracy silently** — A 100 kohm source impedance with a 1 us sample time and a 5 pF S&H capacitor gives a time constant of 0.5 us — the capacitor only charges to 86% of the true voltage in one time constant. The reading is consistently low, and nothing in the digital domain explains why. Always check source impedance against the datasheet's maximum specification for your chosen sample time
- **VDDA noise is ADC noise** — If the analog supply is shared with digital circuitry (or worse, connected directly to VDD without filtering), every digital switching event appears in the ADC result. On boards where ADC accuracy matters, VDDA needs its own LC or ferrite-bead filter, even if the MCU datasheet shows VDDA connected directly to VDD in the reference schematic
- **Averaging does not fix systematic errors** — Averaging reduces random noise but does nothing for offset errors, gain errors, or errors caused by insufficient sample time. If the ADC consistently reads 5 LSBs low because the S&H capacitor is not fully charged, averaging 1000 samples still reads 5 LSBs low
- **Comparator hysteresis must be configured explicitly** — The default hysteresis on many MCUs is zero or very small. A comparator watching a slowly changing signal with no hysteresis will chatter at the threshold, firing dozens of interrupts per crossing. Always enable hysteresis, and verify the threshold behavior with a slow ramp on the bench
- **DAC output buffers add offset** — Enabling the on-chip DAC output buffer adds a few millivolts of offset and limits the output swing to slightly less than rail-to-rail. For precision applications, measure the actual output against the intended code and apply a correction — or use an external buffer with known specifications
- **DMA buffer alignment and volatility matter** — DMA writes to memory bypassing the CPU cache (on MCUs with cache). The buffer must be in a non-cacheable region or the cache must be invalidated before reading. Also, the buffer variable must be declared `volatile` or accessed with appropriate barriers, or the compiler may optimize away reads of "unchanged" memory that DMA has actually updated
