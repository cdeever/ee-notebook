---
title: "Clocks"
weight: 10
---

# Clocks

The clock is the heartbeat of every synchronous digital system. It defines the rhythm — when data is captured, when outputs change, when operations advance. Getting a clean clock signal to every flip-flop, at the right time, with enough margin, is one of the hardest practical challenges in digital design. The irony is that the clock itself is an analog signal: a voltage waveform with finite rise times, overshoot, ringing, jitter, and distribution delay.

## Clock Sources

### Crystal Oscillators

The most common clock source for digital systems. A quartz crystal vibrates at a precise mechanical frequency (typically 1 MHz to 200 MHz), and an oscillator circuit converts this into a digital clock signal.

**Types:**
- **Crystal + discrete oscillator circuit** — A quartz crystal with two load capacitors and an inverter gate (often a 74HC04 or a dedicated oscillator IC). Cheap and simple, but frequency accuracy depends on load capacitor values and PCB parasitics
- **Packaged crystal oscillator (XO)** — Complete oscillator in a 4-pin package. Power, ground, output, and sometimes an enable pin. More reliable than discrete circuits because the oscillator is factory-trimmed
- **TCXO (Temperature Compensated)** — Compensates for the crystal's frequency drift with temperature. Accuracy ±1-2 ppm over the operating range. Used when frequency stability matters (communication systems, GPS)
- **VCXO (Voltage Controlled)** — Frequency can be adjusted by a control voltage. Used in PLLs for clock recovery and frequency synthesis
- **OCXO (Oven Controlled)** — The crystal is kept at a constant temperature in a tiny oven. Accuracy ±0.01 ppm. Used in test equipment and precision timing

### PLLs and Clock Synthesis

A Phase-Locked Loop multiplies, divides, or synthesizes frequencies from a reference clock. Most modern FPGAs and microcontrollers include PLL or DLL (Delay-Locked Loop) blocks.

**How a PLL works (simplified):**
1. A phase detector compares the reference clock to a divided-down version of the output
2. A loop filter smooths the error signal
3. A voltage-controlled oscillator (VCO) generates the output clock
4. A feedback divider divides the output back down for comparison

**Practical implications:**
- PLLs have lock time — they take many clock cycles to stabilize after power-up or a frequency change. Designs must account for this
- PLL output jitter depends on the loop bandwidth and the VCO quality. Narrower bandwidth filters more jitter from the reference but makes the PLL slower to respond
- Cascading PLLs (one PLL feeding another) accumulates jitter. Minimize PLL stages where jitter matters

### RC Oscillators

A resistor and capacitor set the frequency (f ≈ 1 / RC). Built into many microcontrollers as an internal oscillator.

**Accuracy:** Typically ±1-5% — far worse than a crystal. Adequate for applications where frequency precision doesn't matter (LED blinking, low-speed serial with auto-baud), but not for USB, Ethernet, or any protocol that requires tight frequency matching.

## Jitter

Jitter is the variation in clock edge timing from cycle to cycle. A perfect clock has edges at exact intervals; a real clock has edges that wander around the ideal position.

**Types of jitter:**
- **Period jitter** — Variation in individual clock periods. Measured as the standard deviation or peak-to-peak variation of the period
- **Cycle-to-cycle jitter** — Difference between adjacent periods. Captures short-term instability
- **Long-term (accumulated) jitter** — Wander over many cycles. Relevant for serial communication where a clock is recovered from data

**Sources of jitter:**
- Oscillator phase noise (inherent to the crystal and oscillator circuit)
- Power supply noise — supply variations modulate the oscillator frequency
- PLL jitter — added by the VCO and charge pump
- Crosstalk — nearby switching signals coupling into the clock trace
- Thermal noise

**Why jitter matters:** Jitter eats into timing margins. If setup time requires data to be stable 2 ns before the clock edge, and the clock edge has ±0.5 ns of jitter, the effective setup margin is only 1.5 ns. For high-speed interfaces (DDR memory, multi-gigabit serial), jitter budgets are the primary design constraint.

## Skew

Skew is the difference in clock arrival time between two points in the system. If the clock reaches flip-flop A 1 ns before flip-flop B, there is 1 ns of skew between them.

**Sources of skew:**
- Different trace lengths from the clock source to different flip-flops
- Different buffer delays in the clock path
- Temperature gradients across the chip or board (propagation delay varies with temperature)
- Process variation in clock buffer transistors (within a chip)

**Why skew matters:**
- Positive skew (clock arrives later at the destination flip-flop) helps setup time but hurts hold time
- Negative skew (clock arrives earlier at the destination) hurts setup time but helps hold time
- Zero skew is ideal but impossible to achieve perfectly

The relationship between skew and timing constraints is covered in [Timing Constraints]({{< relref "/docs/digital/timing-and-synchronization/timing-constraints" >}}).

## Clock Distribution

Getting the clock from its source to every flip-flop with minimum skew and jitter.

### Clock Trees

A clock tree is a balanced distribution network — typically a tree of buffers arranged so that every leaf (flip-flop clock input) has approximately the same delay from the root (clock source).

**H-tree topology:** The classic balanced clock tree layout. The clock enters at the center and branches symmetrically in an H-shaped pattern, ensuring equal trace length to every endpoint. Used in ASIC and FPGA clock distribution.

**Clock tree synthesis (CTS)** is an automated step in ASIC design tools. The tool inserts buffers and adjusts trace lengths to minimize skew across the entire chip. In FPGAs, the clock tree is built into the fabric (dedicated clock routing resources).

### Clock Buffers and Fanout

A single clock source cannot drive thousands of flip-flops directly — the capacitive load would slow the edges and increase skew. Clock buffers amplify and distribute the clock.

**Fan-out buffer ICs** (e.g., CDCLVP1208, SI5338) take one clock input and produce multiple low-skew outputs for board-level distribution. Skew between outputs is typically 10-50 ps.

### Differential Clocks

High-speed systems use differential clock signaling (LVDS, LVPECL, HCSL) to reduce jitter sensitivity to noise. A differential signal carries the clock on two complementary wires — the receiver compares them, rejecting common-mode noise.

**When to use differential clocks:**
- Clock frequencies above ~100 MHz on a PCB
- Any system where jitter budget is tight (DDR, SerDes, high-speed ADC/DAC)
- Long clock traces (more than a few inches at high frequency)

## Clocks Are Analog

A clock signal has a frequency, duty cycle, rise time, overshoot, ringing, and amplitude — all analog characteristics. The digital abstraction (a perfect square wave) is never real.

- **Rise time** matters because slow edges increase the window where the signal is between HIGH and LOW thresholds, making the flip-flop susceptible to noise. Typical rise times for modern clocks: 0.5-2 ns
- **Duty cycle** matters because setup and hold timing are referenced to the active edge. If the duty cycle drifts from 50%, one half-cycle gets shorter and the other longer, asymmetrically affecting timing margins
- **Overshoot and ringing** can cause double-clocking — the flip-flop triggers on the overshoot as a second edge. Proper termination and controlled impedance traces prevent this
- **Amplitude** must stay within the input threshold range. A clock attenuated by a long trace or poor termination may not reach valid logic levels at the receiver

## Gotchas

- **Clock signals need controlled impedance traces** — Treat clock traces like transmission lines even at moderate frequencies. Impedance mismatch causes reflections that distort the clock waveform. See [Signal Integrity Basics]({{< relref "/docs/digital/data-transfer-and-buses/signal-integrity-basics" >}})
- **Don't route clocks through logic gates** — Passing a clock through an AND gate (for gating) or a mux (for selection) adds uncontrolled delay and jitter. Use dedicated clock gating cells (in ASICs) or clock mux primitives (in FPGAs)
- **Clock crosstalk is insidious** — A noisy signal coupling into a clock trace adds jitter that affects the entire system. Keep clock traces away from high-speed data signals, switching regulators, and I/O traces. Use guard traces or ground planes to shield clock routes
- **PLL lock time matters at power-up** — If logic starts running before the PLL locks, the clock is unstable and behavior is undefined. Use the PLL's lock indicator to hold the system in reset until the clock is stable
- **Multiple clock domains create synchronization challenges** — Using more than one clock requires explicit synchronization at every boundary. See [Clock Domain Crossing]({{< relref "/docs/digital/timing-and-synchronization/clock-domain-crossing" >}})
