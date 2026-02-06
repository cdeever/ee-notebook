---
title: "Warning Signs"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Warning Signs

In software engineering, a "code smell" is a surface indication that something deeper may be wrong — not a definitive bug, but a pattern that warrants investigation. The concept translates directly to hardware abstraction: certain observable patterns in circuits, designs, and debugging sessions suggest that an abstraction is being used incorrectly, relied on beyond its validity, or missing entirely.

These warning signs don't prove that something is wrong. A design with several of them may work perfectly. But warning signs correlate with fragility — a design that exhibits them is more likely to fail under conditions that deviate from nominal, more likely to be difficult to debug when it does fail, and more likely to break when modified.

Recognizing these warning signs during design review, debugging, and integration is a skill that improves with experience. Each one points toward a specific kind of abstraction misuse, and the correction is usually to fix the abstraction — not to add more circuitry.

## "It Works If..."

**Pattern:** A circuit's correct operation depends on a condition that's not part of its specification and not under its control.

**Examples:**
- "It works if the supply ramps up in less than 5 ms" — but the supply ramp rate isn't specified or controlled.
- "It works if the ambient temperature stays below 50°C" — but the enclosure temperature isn't monitored or managed.
- "It works if no other device is transmitting on the bus" — but bus arbitration isn't implemented.
- "It works if the firmware initializes the DAC before the ADC" — but the initialization order isn't enforced.

**What it indicates:** The circuit depends on a condition that exists outside its abstraction boundary. The condition is implicit — assumed but not contractually guaranteed. When the condition inevitably fails to hold (different supply, higher temperature, bus contention, firmware change), the circuit fails in a way that seems unrelated to any change that was made.

**The fix:** Either enforce the condition explicitly (add a sequencing circuit, add temperature monitoring, implement arbitration) or redesign to not require it (tolerate slow ramp rates, derate for high temperature, handle bus contention).

## "Don't Touch That"

**Pattern:** A component, trace, or setting must not be changed despite there being no documented reason why.

**Examples:**
- A resistor that "must be exactly this value" even though the calculation suggests a range would work — the circuit is sensitive to this value in a way that the design documentation doesn't explain, likely because the value was found by experiment to prevent oscillation or maintain a bias point.
- A PCB trace routing that "can't be changed" — the layout is part of the circuit's behavior (impedance, coupling, thermal path) in a way the schematic doesn't capture.
- A firmware configuration register that "should never be modified" — the register controls internal IC behavior that isn't documented in the datasheet and was discovered during debugging.

**What it indicates:** Undocumented dependencies exist between the circuit's behavior and specific implementation details. The abstraction boundary is leaky — the behavior depends on something that's supposed to be below the abstraction level currently in use. The "don't touch" rule is a band-aid for a missing or incorrect abstraction.

**The fix:** Understand why the value, routing, or setting matters and document the dependency. If the dependency is real (this resistor sets the compensation, this trace is a transmission line, this register enables an undocumented feature), the documentation makes it maintainable. If the dependency is imagined (the value was never tested at other settings), testing may reveal more design freedom than assumed.

## "It Only Fails in the System"

**Pattern:** A subsystem works perfectly on the bench and fails in the integrated system, and the failure can't be attributed to any specific difference in operating conditions.

**Examples:**
- An ADC that's accurate on the test bench but noisy in the product — the system's electromagnetic environment differs from the bench.
- A communication interface that works between two boards on the bench but drops packets when installed in the chassis — the cable routing, ground path, or supply conditions in the chassis differ.
- A power supply that's stable with a resistive load but oscillates with the actual digital load — the load impedance characteristic differs from the bench load.

**What it indicates:** The subsystem's abstraction boundary doesn't fully contain its dependencies. The subsystem depends on conditions (supply quality, ground integrity, electromagnetic environment, load characteristics) that the bench provided implicitly but the system doesn't provide. The subsystem's specification is incomplete — it specifies what the subsystem delivers but not everything it requires.

**The fix:** Identify the environmental conditions that differ between bench and system, and either add them to the subsystem's input specification (requiring the system to provide them) or harden the subsystem to tolerate the system's actual conditions.

## "The Simulation Doesn't Match"

**Pattern:** Simulation results and bench measurements disagree, and the disagreement can't be explained by model accuracy.

**Examples:**
- A filter's measured response differs from its simulated response at high frequencies — the simulation doesn't include PCB parasitics.
- A power supply's simulated transient response is faster than measured — the simulation doesn't model the output capacitor's ESR correctly.
- A digital interface simulates clean waveforms but shows ringing on the bench — the simulation doesn't include the connector, cable, and termination impedance.

**What it indicates:** The simulation's abstraction level doesn't include the physical mechanisms that dominate the real circuit's behavior at the conditions being compared. The simulation is correct for its model; the model is wrong for the real circuit. This is an abstraction-level mismatch between the simulation's world (schematic-level) and the real world (PCB-level plus physics).

**The fix:** Don't abandon simulation — refine the model. Add the physical mechanism that explains the discrepancy: parasitic capacitance, trace inductance, connector impedance, thermal coupling. If the mechanism can't be modeled, note the simulation's limitation and rely on bench measurement for that aspect.

## "It Used to Work"

**Pattern:** A circuit that worked stops working without any deliberate change.

**Examples:**
- A circuit that worked with the previous batch of components fails with the new batch — component variation within the specified tolerance pushes a marginal parameter past a threshold.
- A circuit that worked before a firmware update fails after — the update changed a timing relationship, a configuration setting, or a resource usage pattern that the hardware depended on.
- A circuit that worked in the old enclosure fails in the new enclosure — the thermal environment, electromagnetic shielding, or mechanical stress changed.

**What it indicates:** The circuit depended on conditions that were present by accident rather than by design. The old batch of components happened to have values that fell on the right side of a threshold. The old firmware happened to initialize peripherals in a compatible order. The old enclosure happened to provide adequate shielding. The circuit's abstraction boundary didn't include these conditions as requirements, so they weren't preserved when things changed.

**The fix:** Identify what changed and why the circuit is sensitive to it. Then either widen the circuit's tolerance (redesign to be less sensitive to the parameter that changed) or narrow the input specification (require the condition that changed to be controlled).

## "More Filtering Didn't Help"

**Pattern:** Adding filtering, decoupling, or shielding to address a noise or interference problem doesn't reduce the symptom.

**Examples:**
- Adding more bypass capacitors to a supply rail doesn't reduce noise on a sensitive signal — the noise isn't coming through the supply.
- Adding shielding to a cable doesn't reduce interference — the interference is conducted through the ground, not radiated through the cable.
- Adding a low-pass filter to an input doesn't reduce signal corruption — the corruption is from a different mechanism than the filter addresses (ground bounce, power supply rejection, common-mode violation).

**What it indicates:** The diagnosis is at the wrong abstraction level or addressing the wrong coupling mechanism. The filter is addressing a symptom model (noise enters through this path) that doesn't match the actual mechanism (noise enters through a different path). The abstraction that says "noise comes from here" is wrong, and adding more of the wrong fix doesn't help.

**The fix:** Before adding more filtering, verify the coupling mechanism. Remove the existing filter and measure whether the noise changes — if it doesn't, the filter never addressed the actual path. Identify the actual coupling mechanism through systematic measurement (change one condition at a time) and address that mechanism specifically.

## "It's Sensitive to Layout"

**Pattern:** The circuit's behavior depends heavily on PCB layout details that the schematic doesn't describe.

**Examples:**
- Moving a component by 5 mm on the board changes the circuit's performance significantly.
- Rerouting a trace changes whether the circuit oscillates.
- Changing the via pattern under a component affects the noise floor.

**What it indicates:** The schematic abstraction is incomplete — the circuit's behavior depends on physical properties (parasitic inductance, capacitance, mutual coupling, thermal path) that exist at the layout level but aren't represented in the schematic. The schematic says what's connected; the layout determines how it performs.

**The fix:** Identify which layout properties matter and document them as design constraints: controlled impedance requirements, component placement rules, routing constraints, ground plane requirements. These constraints become part of the design specification, not just layout "guidelines." For critical circuits, the layout is part of the circuit design, not a downstream step.

## Tips

- Treat warning signs as diagnostic signals, not as problems to fix directly. The warning sign points to an underlying issue — fixing the symptom without fixing the issue (removing the "don't touch" label without understanding the dependency) creates a worse situation than leaving it in place.
- During design reviews, ask: "What conditions does this circuit depend on that aren't in its specification?" Every unspecified dependency is a potential "it works if..." situation waiting to manifest.
- When debugging, ask: "Am I adding more of a fix that already didn't work?" Repeated application of the same class of fix (more filtering, more decoupling, more delay) without improvement is a strong signal that the mechanism is different from what's being addressed.

## Caveats

- **Not every warning sign indicates a real problem** — Some circuits legitimately require specific layout, specific component values, or specific operating conditions. The issue is the lack of documentation and understanding, not the requirement itself. A circuit that requires a specific compensation resistor and has that requirement documented and justified is fine.
- **Warning signs can compound** — A circuit with one warning sign is probably fine. A circuit with three or four is fragile. The interaction between them — an undocumented dependency that only matters at temperature, which only matters in the system — creates failure modes that are very difficult to predict or debug.
- **Eliminating warning signs during debugging can introduce new problems** — Changing a "don't touch" component to a more robust value may fix one sensitivity but introduce another. The correct approach is to understand the full dependency before making changes.
