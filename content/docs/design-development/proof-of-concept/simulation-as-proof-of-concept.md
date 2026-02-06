---
title: "Simulation as Proof of Concept"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Simulation as Proof of Concept

Some questions are faster to answer in simulation than on a breadboard. Whether a filter topology meets the rolloff spec, whether an amplifier's gain margin is adequate, whether a power supply's transient response settles within tolerance — these can be explored in SPICE before buying a single component. Simulation does not replace physical testing, but it narrows the design space so that when something is built, it tests a refined idea rather than a guess.

## What Simulation Answers Well

Simulation is strongest where the component models are good and the question is about circuit behavior rather than physical construction:

- **Filter response** — frequency response, phase, group delay. Active and passive filters simulate accurately because resistors, capacitors, and op-amps are well-modeled.
- **Amplifier gain, bandwidth, and stability** — AC analysis shows gain and phase margin; transient analysis reveals ringing, oscillation, and settling time.
- **Power supply steady-state and transient behavior** — SPICE models for voltage regulators (especially from TI, Analog Devices, and LT/ADI) are often very accurate, including feedback loop dynamics.
- **Signal integrity** — transmission line effects, impedance discontinuities, crosstalk. These simulate well when accurate models of the interconnect are available.
- **Worst-case tolerance analysis** — sweep component values across their tolerance ranges to see how the output varies. This is tedious by hand and trivial in simulation.

## What Simulation Does Not Answer

Simulation has blind spots that matter:

- **Parasitic effects not in the model.** Simulation only includes what is in the schematic. Board parasitics, trace inductance, stray capacitance, ground bounce — these are absent unless explicitly added. A simulation that says "stable" may oscillate on the bench because of a 2 pF capacitance the model did not include.
- **Component behavior outside the model's valid range.** SPICE models are curve fits, not physics simulations. Pushing a component beyond the range the model was fitted for produces meaningless results. Thermal effects, saturation behavior, and high-frequency parasitics are commonly oversimplified.
- **Mechanical and thermal reality.** Simulation does not know that two components are close together and thermally coupled. It does not know that a capacitor gets hot and its value shifts. Physical construction effects are not in the netlist.
- **Manufacturing variation.** A simulation with nominal component values shows what one specific instance of the circuit does. Real production circuits have components scattered across their tolerance ranges.

The right mindset: simulation results are predictions based on the model's assumptions. They are useful for comparing alternatives, finding sensitivities, and checking stability — not for guaranteeing that the physical circuit will work.

## Tools

**LTspice** (free, from Analog Devices) is the most commonly used SPICE simulator for analog and power circuit design. It includes models for most ADI/Linear Technology parts and supports third-party models.

- Good for: power supply design, filter design, amplifier analysis, transient analysis
- Limitations: the interface is dated, schematic entry is clunky, and it does not handle mixed-signal (analog + digital) simulation well
- Getting models: ADI parts are built in. For other manufacturers, download SPICE models from the manufacturer's website and import them. TI, Microchip, Onsemi, and most major vendors provide free models.

**QUCS-S / Ngspice** — open-source alternatives. Less polished than LTspice but fully capable. QUCS-S provides a modern schematic interface driving Ngspice as the simulation engine.

**KiCad + Ngspice integration** — KiCad 7+ includes built-in simulation capabilities through Ngspice. Useful for simulating portions of a design directly from the schematic being captured, rather than maintaining a separate simulation schematic.

**Manufacturer web tools** — TI's WEBENCH, Analog Devices' LTpowerCAD, Microchip's various design tools. These are specialized simulators for specific product families (mostly power supplies and signal chains). These are less flexible than general-purpose SPICE but faster for their specific domain and use validated, manufacturer-maintained models.

**Signal chain analysis tools** — for RF and communication systems, tools that model gain, noise figure, IP3, and dynamic range through a cascade of blocks (amplifiers, filters, mixers) answer system-level questions that component-level SPICE cannot. These can be as simple as a spreadsheet implementing the Friis noise equation.

## Simulation Workflow for POC

A focused simulation workflow for proof-of-concept questions:

**1. Define the question.** "Will this filter topology achieve 60 dB of stopband rejection at 1 MHz?" is a good simulation question. "Will the design work?" is not — it is too broad and simulation cannot answer it.

**2. Build the minimum schematic.** Include only the components relevant to the question. Simulating an entire system to answer a question about one stage wastes time and adds complexity that obscures the result.

**3. Use realistic models.** Download the manufacturer's SPICE model for the specific part planned for the design. Generic op-amp models answer generic questions — when evaluating a specific part, use its specific model.

**4. Sweep the sensitive parameters.** Run a parameter sweep (or Monte Carlo analysis) on the components whose tolerance most affects the output. This is where simulation pays for itself — a 30-second sweep reveals sensitivities that would take days to characterize on the bench.

**5. Compare alternatives.** The biggest leverage of simulation is comparing two or three candidate topologies or component choices quickly. Run the same analysis on each and compare. This is faster, cheaper, and more informative than breadboarding all three.

**6. Record and communicate results.** Export plots, note the conditions, and save the simulation file. When moving from POC to [schematic design]({{< relref "../schematic-design" >}}), the simulation results serve as the design justification.

## Simulation vs Breadboard

These are not competing approaches — they answer different questions and are most powerful when used together:

| Question type | Better tool | Why |
|---------------|------------|-----|
| Does this topology meet the spec? | Simulation | Fast parameter sweeps, easy to compare alternatives |
| Does this physical component work in the target environment? | Breadboard | Environmental factors are not in the model |
| What are the sensitivities? | Simulation | Monte Carlo and parameter sweeps |
| Does the complete system integrate? | Breadboard / dev board | System interactions are hard to simulate fully |
| What happens at the tolerance extremes? | Simulation | Sweep component tolerances systematically |
| Does the UI/UX work? | Breadboard / dev board | Physical interaction cannot be simulated |

A common effective pattern: simulate first to select the topology and estimate component values, then breadboard to verify the simulation's predictions and catch what the model missed.

## Tips

- Use simulation to compare two or three candidate topologies side by side — this is where simulation provides the most leverage over breadboarding
- Run parameter sweeps on tolerance-sensitive components early; a 30-second Monte Carlo run reveals sensitivities that would take days to characterize on the bench
- Always download the manufacturer's SPICE model for the specific part rather than relying on generic models — accuracy depends on model fidelity
- Simulate first, then breadboard to verify — this sequence narrows the design space and catches model-vs-reality gaps efficiently

## Caveats

- **SPICE convergence failures are not physics failures.** When a simulation fails to converge, it means the numerical solver could not find a solution — not that the circuit cannot work; convergence issues are usually caused by abrupt nonlinearities in the model, so try adjusting simulation options (tighter tolerances, smaller timesteps) or simplifying the circuit
- **Op-amp models vary wildly in accuracy.** A basic 3-terminal op-amp model captures gain and bandwidth but misses output current limits, slew rate, input offset, and noise — check what the model includes before trusting its predictions for those parameters
- **Transient initial conditions matter.** A power supply simulation that starts with all voltages at zero may show startup behavior that does not match reality (where voltages ramp at different rates) — set realistic initial conditions or simulate from power-on with realistic ramp rates
- **Temperature simulation is only as good as the model's temperature coefficients.** Many SPICE models were characterized at 25 degrees C only — when simulating at temperature extremes, verify that the model includes temperature behavior
- **Simulating long time spans is slow.** A simulation of 1 millisecond of switching regulator behavior at 1 MHz is fine, but a simulation of 10 seconds of thermal settling is likely impractical — know the simulation tool's sweet spot
