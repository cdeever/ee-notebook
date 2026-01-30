---
title: "Simulation Before Commitment"
weight: 35
---

# Simulation Before Commitment

Simulation lets you make mistakes in software instead of in copper. A few hours with a SPICE model can reveal instability, incorrect operating points, or insufficient margin that would otherwise show up as a mystery during board bring-up — after you've spent money on PCB fabrication, component procurement, and assembly. Simulation isn't a substitute for hardware testing, but it's an extraordinarily cost-effective way to reduce the number of surprises.

## What SPICE Simulation Offers

SPICE (Simulation Program with Integrated Circuit Emphasis) is the workhorse of analog circuit simulation. Originally developed at UC Berkeley in the 1970s, it has evolved through dozens of implementations, but the core idea remains: describe a circuit as a netlist of components with mathematical models, and solve the circuit equations numerically.

**DC operating point analysis** answers the most basic question: with the specified supply voltages, what are the voltages and currents at every node? This is where you catch biasing errors — a transistor in saturation when it should be in the active region, an op-amp output railed because the input offset drives it into the supply, or a regulator that can't achieve its target output voltage with the given load.

**AC analysis** sweeps frequency and shows gain and phase response. This is essential for filter design (is the cutoff frequency where you expect it?), amplifier characterization (what's the bandwidth and phase margin?), and feedback loop stability (does the regulator loop have adequate phase margin under all load conditions?).

**Transient analysis** simulates the circuit's time-domain behavior: startup sequencing, response to step changes, oscillation behavior, switching waveforms. For power supplies, transient analysis reveals output voltage ripple, load step response, and startup overshoot. For analog circuits, it shows settling time, slew rate limiting, and nonlinear behavior that AC analysis misses.

**Noise analysis** calculates the noise contribution of each component and the total output noise. This is critical for low-noise amplifier design, ADC front ends, and sensor interfaces where the signal-to-noise ratio determines system performance.

## What SPICE Cannot Tell You

Understanding SPICE's limitations is as important as understanding its capabilities. Simulation creates confidence, but misplaced confidence is worse than no confidence at all.

**Layout parasitics are absent unless explicitly modeled.** SPICE doesn't know about your PCB. The 2 inches of trace between the op-amp output and the feedback resistor adds inductance and capacitance that can affect high-frequency behavior. Ground plane impedance, via inductance, and inter-trace coupling are all invisible to a schematic-level simulation. For high-speed or high-frequency designs, you need to extract parasitic models from the layout (post-layout simulation) or at least add estimated parasitics manually.

**Thermal effects require explicit modeling.** Components heat up during operation, and their parameters change with temperature. A MOSFET's on-resistance increases with temperature, which increases power dissipation, which increases temperature — a positive feedback loop that SPICE won't capture unless you build a thermal model into the simulation. Most simulations are run at a single temperature (usually 27 degrees Celsius), which may not represent the worst case.

**Component aging and manufacturing variation** are only captured if you explicitly run Monte Carlo or worst-case simulations with appropriate tolerance models. A single simulation with nominal component values tells you how one idealized instance of your circuit behaves — not how the production population will behave.

**Model accuracy varies enormously.** Manufacturer-provided SPICE models range from excellent (accurately capturing behavior across a wide range of conditions) to crude (matching the datasheet's typical values but failing at extremes). Some models are detailed subcircuit representations; others are simplified macromodels that capture only the most basic behavior. Always verify that the model's behavior matches the datasheet before trusting it for design decisions. If the model shows a bandwidth of 10 MHz but the datasheet says 8 MHz, someone's wrong — investigate before proceeding.

## Digital Simulation

For digital circuits, the simulation landscape is different. Logic simulation verifies functional correctness: does the state machine reach the right states? Do the combinational logic outputs match the truth table? Timing simulation adds propagation delays and setup/hold times to check whether the circuit meets its timing requirements.

For FPGA and complex digital designs, hardware description language (HDL) simulation in tools like ModelSim, Icarus Verilog, or Verilator is the standard approach. For simpler logic with discrete components (gates, flip-flops, counters), schematic-level simulation with timing models may suffice.

Mixed-signal simulation — digital and analog together — is the most demanding but also the most realistic for systems that combine both domains. Most free SPICE tools handle this poorly; commercial tools like Cadence or the analog simulation features within FPGA vendor tools are better but expensive.

## When to Simulate vs When to Just Build

Simulation takes time, and not every circuit justifies the investment. Some guidelines for when simulation earns its keep:

**Simulate when the cost of failure is high.** A 6-layer PCB with BGA components costs hundreds of dollars per revision. Spending a day in SPICE to verify the power supply stability before committing to fabrication is obviously worthwhile. A quick breakout board for a through-hole prototype? Just build it.

**Simulate when you're doing something new.** If you've built a dozen LM317 linear regulator circuits and this one is the same topology with different values, you don't need to simulate it. If you're designing your first current-mode buck converter, simulation will teach you things you wouldn't learn until the board oscillates on the bench.

**Simulate when the behavior isn't intuitive.** Feedback loop stability, filter response with real component parasitics, transmission line effects, oscillator startup — these are situations where intuition is unreliable and simulation provides genuine insight.

**Don't simulate what you can calculate.** A voltage divider ratio, an RC time constant, a simple bias point — these are straightforward calculations that don't need simulation overhead. Save simulation for the problems that can't be solved on the back of an envelope.

**Don't simulate what only a prototype can answer.** If the critical uncertainty is about mechanical fit, thermal behavior in an enclosure, or real-world EMI susceptibility, no amount of SPICE simulation will resolve it. Build the prototype and measure.

## Free Simulation Tools

The barrier to entry for circuit simulation has never been lower:

**LTspice** (from Analog Devices, formerly Linear Technology) is the most widely used free SPICE simulator. It has an excellent library of Analog Devices components, a capable schematic editor, and fast simulation engine. Its limitations: the user interface is dated, it runs natively only on Windows (though it works under Wine on Linux and macOS), and models for non-ADI components must be imported manually.

**ngspice** is the open-source successor to Berkeley SPICE. It's purely a simulation engine (no built-in schematic editor), which makes it powerful for automated or scripted simulations but less convenient for interactive use. It integrates with KiCad for schematic-driven simulation.

**KiCad's SPICE integration** connects the schematic editor to ngspice, allowing you to assign SPICE models to schematic symbols and run simulations directly from your design tool. The integration is improving with each KiCad release, and for many purposes it provides a complete simulation workflow without leaving the design environment.

**Falstad Circuit Simulator** is a browser-based tool that's excellent for quick experiments and intuition-building. It shows animated current flow and real-time waveforms. It's not suitable for serious design verification, but it's invaluable for learning and quick "what if" explorations.

## The Simulation-to-Reality Gap

Every simulation is a model, and every model is an approximation. The gap between simulation and reality is smallest for well-characterized, low-frequency analog circuits with accurate component models. It's largest for high-frequency designs, mixed-signal systems, and circuits sensitive to layout parasitics.

Bridging this gap is a skill that develops with experience: simulate, build, measure, then compare the simulation to the measurement. Where they disagree, investigate why. Often the discrepancy reveals a parasitic effect, a model inaccuracy, or a layout issue that improves both your simulation technique and your design practice.

The goal isn't perfect simulation — it's useful simulation. A simulation that correctly predicts "the regulator is stable with 20 degrees of phase margin" or "the amplifier gain is 20 dB plus or minus 1 dB" is valuable even if it doesn't capture every detail of the real circuit's behavior.

## Gotchas

- **Default SPICE models are often ideal.** If you don't assign a specific model, many SPICE tools use an ideal component (zero ESR capacitors, perfect op-amps). The simulation "works" but tells you nothing about real behavior. Always use manufacturer models for critical components.
- **Convergence failures aren't bugs — they're information.** When SPICE fails to converge, it often means the circuit has numerical problems that correspond to real design issues: startup sequencing problems, latch-up conditions, or bistable states. Investigate before adjusting simulator tolerances.
- **Simulation can create false confidence.** A beautiful Bode plot that shows 45 degrees of phase margin means nothing if the model doesn't include the output capacitor's ESR, the PCB trace inductance, or the load capacitance. Always ask "what is this simulation NOT modeling?"
- **Vendor models optimize for typical behavior.** Most SPICE models represent the "typical" device, not the worst case. A design that's marginal in simulation may fail with worst-case parts. Run simulations with min/max parameter values for critical components.
- **Simulation setup takes longer than you think.** Finding models, building the testbench, defining stimulus waveforms, and interpreting results all take time. Budget for this in your project schedule — it's not a five-minute task for any meaningful circuit.
