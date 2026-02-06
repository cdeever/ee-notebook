---
title: "Systems as Coordination Problems"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Systems as Coordination Problems

A system of five devices, each with a 99.9% individual reliability, does not have a 99.9% system reliability. If the devices must all function simultaneously and any single failure stops the system, the system reliability is 0.999⁵ ≈ 99.5%. But this calculation only accounts for independent hardware failures. The more common system-level failures aren't independent — they're coordination failures where every device is functioning correctly, but the devices aren't working together correctly.

A sensor module reads data accurately. A processor module processes data correctly. A communication module transmits data reliably. But the sensor sends data in a format the processor doesn't expect, or the processor finishes computation after the communication window has closed, or the communication module transmits old data because the processor's update didn't propagate in time. Every device passes its individual test. The system fails because the interactions between devices weren't specified, tested, or maintained with the same rigor as the devices themselves.

## What Coordination Means

Coordination in an electronic system means that multiple devices agree — about voltage levels, data formats, timing relationships, protocol states, and resource ownership — well enough for the intended function to proceed. This agreement requires shared contracts across several dimensions:

**Electrical agreement.** Devices must agree about what constitutes a valid signal. A 3.3 V CMOS output driving a 5 V TTL input works because the TTL input threshold (typically 1.4 V) is below the CMOS output high level (typically 3.0 V or higher). But a 3.3 V CMOS output driving a 5 V CMOS input may fail because the 5 V CMOS threshold (typically 2.5 V) may be close to or above the 3.3 V output level, leaving no noise margin. The devices are both functioning correctly at their own voltage levels; the system fails because the voltage levels don't coordinate across the interface.

**Temporal agreement.** Devices must agree about when events happen. A processor must read a sensor before the sensor's data goes stale. A communication transmitter must send a response within the receiver's timeout window. A control signal must arrive before the controlled action's deadline. Temporal coordination is the most fragile dimension because delays accumulate, jitter varies, and timing margins shrink under load and temperature.

**Semantic agreement.** Devices must agree about what signals mean. A big-endian processor talking to a little-endian peripheral swaps every byte pair. A sensor that outputs raw ADC counts communicating with a processor that expects calibrated engineering units produces wrong results. An interrupt that means "data ready" to the sender but triggers a "fault handler" in the receiver creates a systematic misinterpretation. The signals are electrically and temporally correct; the meaning is wrong.

**State agreement.** Devices must agree about the current operating mode. If a master device switches from high-speed mode to low-speed mode but the slave doesn't receive (or doesn't acknowledge) the mode-change command, the two devices proceed with incompatible assumptions about the communication parameters. The master sends at the new baud rate; the slave expects the old one. Both devices are executing their protocols correctly — for different protocols.

## Why Coordination Fails

Coordination failures have different mechanisms than component failures. Components fail because of physics — wear, overstress, defects. Coordination fails because of assumptions — mismatched expectations, incomplete specifications, unhandled corner cases.

### Implicit Contracts

Many coordination requirements are never written down. The datasheet for each device specifies its own behavior, but the requirements for successful inter-device coordination live in the gap between the datasheets. One device's output capacitance combined with another device's input capacitance creates an RC time constant that neither datasheet mentions. One device's power-on time combined with another device's startup sequence creates a timing dependency that exists only in the combination.

Implicit contracts are discovered when they're violated — typically during integration testing, during environmental testing, or in the field. They're the "should have been obvious in hindsight" requirements that no one documented because each device's specification was self-consistent.

### Timing Races

A timing race occurs when two events must happen in a specific order, but the system doesn't guarantee the order. A master device sends a command and expects a response within 10 ms. The slave device processes the command in 8 ms under nominal conditions but 12 ms under heavy load. The race between the master's timeout and the slave's processing time produces intermittent failures that depend on the slave's load — a condition the master has no knowledge of.

Timing races are coordination failures because neither device is wrong individually. The master's timeout is reasonable. The slave's processing time is within its individual capability. The failure is in the coordination — the timing contract between them is incompletely specified.

### Resource Contention

Multiple devices sharing a resource — a communication bus, a power supply, a cooling system, a shared memory region — must coordinate their access. If two devices transmit on a shared bus simultaneously, the data is corrupted. If three devices draw maximum current simultaneously, the shared supply may exceed its capacity. If two devices write to the same memory location without synchronization, the stored value is unpredictable.

Resource contention is a pure coordination failure: each device is using the resource correctly by its own rules, but the devices haven't agreed about sharing. Bus protocols include arbitration mechanisms to handle contention, but contention for resources that lack formal arbitration (power budget, thermal budget, electromagnetic spectrum) is managed only by design analysis and hope.

### Failure Cascade

In a tightly coordinated system, one device's failure can trigger failures in devices that depend on it, which trigger failures in devices that depend on them. A power module's transient response degrades. A downstream processor experiences a supply dip and resets. The reset interrupts a communication transaction. The communication partner detects a timeout and enters a fault state. The fault state disables a safety interlock. The system shuts down.

Each step in the cascade is a correct response to the condition it observes. The processor is correct to reset when its supply dips below the minimum. The communication partner is correct to timeout when the transaction is interrupted. The safety system is correct to shut down when the interlock is lost. The cascade is a coordination failure because the system's response to a minor disturbance (a supply transient) is disproportionate (complete shutdown), amplified by the coupling between coordination mechanisms.

## Designing for Coordination

Robust coordination requires making the contracts between devices explicit, testable, and resilient to variation:

**Define interface specifications, not just device specifications.** The interface between two devices should have its own specification: voltage levels, timing requirements, protocol parameters, error handling behavior, and recovery procedures. This specification exists at the system level, not the device level.

**Budget for variation.** Every timing parameter has a range. Every voltage level has a tolerance. Every current draw has a peak. Coordination must work at the worst-case combination of all contributing devices' variations. A timing margin that's comfortable with typical values may disappear when all devices are at their worst-case limits.

**Define and test recovery.** Coordination will be disrupted — by noise, by transients, by software bugs, by environmental conditions. The system's response to disrupted coordination (retransmit, reset, degrade gracefully, shut down safely) is as important as the coordination itself. Testing should deliberately inject coordination failures (delayed responses, corrupted messages, out-of-sequence events) and verify that the system recovers.

**Minimize implicit dependencies.** Every shared resource, every assumed timing relationship, and every unspecified interface is an implicit dependency. Making dependencies explicit — through documentation, through specifications, through test procedures — transforms them from latent failure modes into managed risks.

## Tips

- When integrating multiple devices, test the interfaces between devices before testing the full system function. A communication link that works between two devices on the bench may fail when the system adds a third device that creates bus contention or supply noise. Interface testing under realistic conditions catches coordination problems before they compound.
- Specify and measure timing margins, not just timing. A communication interface that works with 2 ms of margin under nominal conditions but only 0.1 ms under worst-case conditions is marginally coordinated — any additional stress (temperature, supply variation, bus loading) can push it past the margin.
- When a system-level failure is intermittent, look for timing races. Identify every pair of events that must be ordered and verify that the ordering is guaranteed by design, not by accident of typical timing. A consistent failure usually has a consistent mechanism; an intermittent failure usually has a timing race at its root.

## Caveats

- **Correct individual device behavior does not guarantee correct system behavior** — This principle cannot be overstated. Every device in the system can pass every device-level test, and the system can still fail if the coordination contracts are violated. Device testing verifies devices; system testing verifies coordination.
- **Adding redundancy doesn't fix coordination problems** — A second communication channel doesn't help if the coordination protocol is wrong — both channels will exhibit the same coordination failure. Redundancy addresses hardware reliability (component failures), not coordination robustness (interaction failures).
- **Coordination failures are often blamed on specific devices** — When a system fails, the investigation typically focuses on the device that exhibited the symptom — the processor that crashed, the communication module that timed out, the sensor that reported wrong data. But in a coordination failure, the symptomatic device may be the victim, not the cause. The cause may be another device's timing, another device's power draw, or a missing specification between them.
