---
title: "Designing for Debuggability"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Designing for Debuggability

Every circuit will be debugged. A prototype that works perfectly on the first power-up is a fantasy — and even if the prototype works, production units will eventually fail, field conditions will expose margins, and future modifications will introduce regressions. The question is not whether debugging will happen, but whether the design makes debugging efficient or makes it a prolonged exercise in inference with insufficient information.

Debuggability is an architectural property. It's determined by decisions made during design — where boundaries are placed, which signals are observable, how faults propagate, and whether the design can be decomposed into independently testable units. Adding debug features after the design is complete (probe wires, bodge components, diagnostic firmware) is always more expensive and less effective than designing for observability and decomposition from the start.

## Observability

The fundamental requirement for debugging is the ability to see what's happening. A circuit that hides its internal state behind collapsed subsystems, inaccessible PCB layers, and BGA packages cannot be debugged efficiently without forethought.

### Test Points

Test points are the cheapest and most effective debug feature available. A 1 mm pad on the PCB, connected to a critical signal, adds negligible cost during design and manufacturing but can save hours during debugging.

Critical signals that warrant test points:

- **Every power rail**, at the point of use (not just at the regulator output). Supply voltage at the regulator confirms the regulator is working. Supply voltage at the IC confirms the IC is getting the power it needs. These can differ significantly, and the difference is diagnostic.
- **Key references and bias voltages** — bandgap reference outputs, DAC reference outputs, bias network outputs. These set the operating points of downstream circuits; if they're wrong, everything downstream is wrong.
- **Clock signals** — at the oscillator output and at the point of use. A clock that's clean at the source but degraded at the destination has a distribution problem. A clock that's wrong at the source has a different problem entirely.
- **Status and control signals** — reset, enable, power-good, fault, lock-detect. These binary signals report subsystem state and can be observed with a logic probe or a single oscilloscope channel.
- **Communication buses** — at both ends of each bus segment. A clean signal at the transmitter and a corrupted signal at the receiver localizes the problem to the interconnect.

Test points should be placed on the top side of the PCB where they're physically accessible after assembly. Test points on the bottom side, under other boards, or behind connectors are functionally useless.

### Isolation Points

The ability to disconnect one part of the circuit from another without soldering is invaluable during debugging. Common isolation mechanisms:

**Zero-ohm resistors and solder jumpers** in series with signal paths allow a connection to be broken by removing a component. Placing a zero-ohm resistor between a clock source and its destination allows the clock to be measured (or replaced) without modifying the circuit.

**Unpopulated component pads** for optional filtering, termination, or configuration. A footprint for a series resistor that's normally populated with a zero-ohm jumper can accept a real resistor if additional filtering or impedance matching is needed during debug.

**Enable pins brought to accessible headers.** If a subsystem has an enable pin, connecting it to a header (with appropriate pull-up or pull-down default) allows the subsystem to be disabled manually, simplifying the process of isolating interactions between subsystems.

### Diagnostic Interfaces

Beyond physical test points, digital systems benefit from software-accessible diagnostic paths:

**Debug communication ports** — UART, SPI, or JTAG connections brought to headers or connectors. A UART console that reports system state, error counters, and sensor readings during operation provides a window into the digital domain that oscilloscope probes can't offer.

**Status registers** — internal registers that report subsystem health: error counts, temperature readings, voltage measurements, state machine status. These are readable through the debug port and provide information about conditions that aren't externally observable.

**Diagnostic firmware modes** — firmware that can isolate and exercise individual subsystems, run self-tests, and generate known output patterns. A diagnostic mode that drives a DAC output at a known frequency and amplitude verifies the analog output path without requiring an external signal source.

## Decomposability

A circuit that can be decomposed into independently testable units is dramatically easier to debug than a monolithic design where everything must work together for anything to be testable.

### Functional Partitioning

Design subsystem boundaries so that each subsystem can be verified independently:

- **Power subsystems** should be testable before any downstream subsystem is powered. A power supply that requires its load to be present before it regulates correctly is harder to debug than one that regulates into any load (or no load) within its rated range.
- **Clock subsystems** should be verifiable with a frequency counter or oscilloscope before any dependent logic is operating. A clock source that depends on a running processor (for configuration or enable) creates a chicken-and-egg problem during bring-up.
- **Analog signal chains** should be testable at each stage boundary. An amplifier → filter → ADC chain is easiest to debug when the signal can be injected and observed at each stage's input and output, allowing each stage to be verified independently.

### Stage Boundaries

The ability to break a signal chain at defined points allows bisection — testing each half independently to determine which half contains the fault:

- Between a sensor and its conditioning circuit
- Between a conditioning circuit and its ADC
- Between a DAC and its output driver
- Between a processor and its communication interface
- Between a power source and its regulation stage

Each break point should include a test point on each side and, ideally, an isolation mechanism (zero-ohm resistor, solder jumper, or DNP option). With these in place, the signal chain can be verified stage by stage — injecting a known signal at one stage's input and verifying the expected output — without relying on all upstream and downstream stages being functional.

### Ground Isolation

Separate ground regions for analog and digital circuits, connected at a defined single point, allow ground coupling to be diagnosed. If the analog ground and digital ground have separate test points, the voltage difference between them can be measured — directly revealing ground shift that would otherwise appear as mysterious noise on the analog signals.

## Fault Containment

A design where a single failure cascades through the entire system is harder to debug than one where faults are contained within subsystem boundaries:

**Protection circuits at subsystem boundaries** prevent a fault in one subsystem from damaging others. A short circuit on one subsystem's output should trigger that subsystem's protection (current limit, fuse, polyfuse) without pulling down the shared supply rail hard enough to reset other subsystems. Without protection, a single fault becomes a system-wide event that obscures the original cause.

**Supply isolation between sensitive subsystems** prevents power-related fault propagation. Separate regulators for analog, digital, and high-power subsystems ensure that a fault in the high-power subsystem (causing a supply droop) doesn't corrupt the analog measurements or reset the digital processor.

**Defined reset domains** allow targeted recovery. If a communication peripheral malfunctions, the ability to reset just that peripheral (without resetting the entire processor) allows recovery while preserving diagnostic information in the processor's memory.

## Design Decisions That Hurt Debuggability

Certain design choices, often made for cost or space reasons, make debugging significantly more difficult:

**Combining multiple functions into a single IC.** A system-on-chip that integrates processor, ADC, DAC, communication, and power management eliminates the boundaries between subsystems. A failure inside the SoC can't be isolated by disconnecting subsystems — they're all on the same die. The SoC's internal diagnostic registers and test modes become the only debug tools available.

**Using minimum-pin-count packages.** A microcontroller in a QFN-16 package with no unused pins has no room for diagnostic outputs. The same microcontroller in a QFN-32 package with spare pins can bring out internal clock, status, and debug signals — dramatically improving observability during debug.

**Eliminating test points for production cost.** Removing test points to reduce PCB size or assembly cost saves pennies per unit and costs hours per debug session. In low-volume designs, the math almost always favors keeping test points. In high-volume designs, consider a debug variant of the board with test points that production units omit.

**Routing critical signals on inner layers only.** A signal that's entirely on inner PCB layers can't be probed without destructive access (via probing or drilling). Routing critical signals to surface layers at strategic points (even if the main routing is internal) provides probe access without compromising the routing.

## Tips

- During schematic design, mark every signal that would be needed for debugging with a "TP" (test point) symbol. Review the list before layout to ensure test points are physically accessible. The cost of adding test points during schematic capture is zero; the cost of adding them after PCB fabrication is substantial.
- For digital systems, allocate at least two spare GPIO pins for diagnostic output. A pin that toggles at the beginning of an interrupt service routine reveals interrupt timing. A pin that toggles at each task boundary reveals task scheduling. These signals are invisible to software debugging tools but instantly visible on an oscilloscope.
- In production designs where test point cost matters, consider using a debug header — a single connector that brings out all diagnostic signals. The header can be populated on debug units and left unpopulated (just pads) on production units, adding almost no cost while preserving full debuggability.
- When reviewing a design for debuggability, imagine that a specific subsystem has failed and walk through the debugging process. Can the subsystem's inputs and outputs be measured? Can the subsystem be isolated from its neighbors? Can a known-good signal be injected? If any answer is "no," the design is missing a debug feature.

## Caveats

- **Debug features can affect the circuit they're meant to observe** — A test point on a high-impedance node adds parasitic capacitance. A debug header connector adds stub impedance to signal traces. An LED on a status signal draws current. The debug features must be designed to not degrade the circuit's performance during normal operation.
- **Software diagnostic modes can mask hardware failures** — A firmware self-test that passes doesn't mean the hardware is healthy — it means the hardware is healthy under the self-test conditions. A marginal timing problem may not appear during a self-test that runs at reduced speed. A noise problem may not appear during a self-test that processes a known signal.
- **Over-instrumenting creates its own problems** — A board with hundreds of test points is physically cluttered and may have reliability issues (test point pads can act as solder trap, pick up contamination, or create EMI coupling points). The goal is strategic observability, not exhaustive instrumentation.
- **Debug infrastructure must survive the failures it's meant to diagnose** — A debug UART that shares a power rail with the subsystem being debugged goes down when the subsystem fails. A diagnostic LED driven by the processor that has crashed doesn't report the crash. Debug infrastructure should be powered and managed independently from the circuits it monitors.
