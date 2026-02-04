---
title: "\"Works Alone\" vs \"Works Integrated\""
weight: 40
---

# "Works Alone" vs "Works Integrated"

A subsystem is tested on the bench. The power supply is clean — a lab supply with milliohm output impedance. The input signals come from a signal generator with defined characteristics. The load is a precision resistor or an electronic load. The ground is a short, heavy wire to the bench instrument. Under these conditions, the subsystem meets every specification: output voltage within tolerance, noise floor below threshold, transient response within limits, timing margins comfortable.

The subsystem is placed on the device board. It now shares a supply rail with a processor and a communication transceiver. Its input signals come from an analog front end that has its own noise and offset. Its load is a real circuit with nonlinear impedance and dynamic current demand. Its ground path goes through vias, traces, and shared planes carrying current from every other subsystem on the board. Under these conditions, the subsystem fails — output is noisier, accuracy is degraded, or it oscillates intermittently.

Nothing about the subsystem has changed. The circuit is identical. Every component is the same. What changed is the environment — and the environment is everything the bench test held ideal.

## Why Integration Changes Everything

The gap between bench testing and integrated operation has specific, identifiable causes. Each cause corresponds to an idealization that bench testing provides and integration removes.

### The Supply Is No Longer Ideal

A lab power supply presents near-zero source impedance across a wide frequency range. It doesn't droop under transient loads, doesn't carry noise from other loads, and doesn't have ground bounce. The device's on-board supply is none of these things:

- The on-board regulator has finite bandwidth and finite output impedance at frequencies above its control loop bandwidth. Load transients from other subsystems create voltage variations that the regulator can't suppress.
- The supply path from the regulator to the subsystem has trace resistance and via inductance. At high frequencies, this path impedance dominates, and the effective supply impedance at the subsystem's pins is higher than the regulator's output impedance.
- Other subsystems on the same rail inject current transients that appear as noise. The subsystem sees supply noise that didn't exist during bench testing because the noise sources weren't present.

### The Ground Is No Longer Quiet

A bench test uses a short, low-impedance ground connection directly between the subsystem and the measurement instrument. The device's ground network is a complex mesh of traces, vias, and planes carrying return current from every subsystem:

- Return currents from high-power or high-frequency subsystems create voltage drops across the shared ground impedance. The subsystem's ground reference shifts by the amount of this voltage drop.
- At high frequencies, ground plane impedance becomes significant. Current crowds toward low-impedance paths, and the effective ground impedance for a given subsystem depends on where all the other currents are flowing.
- Ground connections between boards (through connectors, cables, or chassis) add impedance and create potential differences between the ground references of connected boards.

### The Inputs Are No Longer Clean

A signal generator produces a signal with defined amplitude, frequency, offset, and impedance. Real inputs from other subsystems carry additional baggage:

- Noise from the driving subsystem's supply, ground, and internal coupling adds to the signal.
- Impedance variations with frequency, temperature, and signal level change the interface characteristics dynamically.
- Common-mode voltage shifts — created by ground differences between the driving and receiving subsystems — add a DC or low-frequency offset to the signal.
- Crosstalk from adjacent signal traces adds correlated noise that varies with the activity of neighboring circuits.

### The Load Is No Longer Predictable

A precision resistive load draws constant, linear current. A real load — a downstream amplifier input, a digital IC's input pin, a cable with its characteristic impedance — has dynamic and nonlinear impedance:

- Input capacitance of downstream ICs creates a capacitive load that varies with signal voltage (for CMOS inputs, the gate capacitance is voltage-dependent).
- Cable impedance changes with frequency and termination. An improperly terminated cable creates reflections that the subsystem's output stage sees as a rapidly varying load.
- Multiple downstream loads create a composite impedance that changes as each load's state changes.

### Thermal Conditions Are No Longer Controlled

Bench testing typically happens at room temperature in open air. Integrated operation happens at whatever temperature the enclosure reaches:

- Thermal coupling from adjacent power-dissipating subsystems raises the local temperature.
- The enclosure restricts airflow, raising the ambient temperature inside.
- Thermal cycling during operation (power-up, high-load events, standby) creates temperature gradients and thermal stress that bench testing at constant temperature doesn't reproduce.

## The Integration Test Strategy

Because bench testing and integrated operation differ in systematic ways, the transition from "works alone" to "works integrated" can be managed by testing for the specific conditions that integration introduces:

**Supply sensitivity testing.** Before integrating, test the subsystem with a supply that has noise and transients representative of the actual device supply. Inject switching noise at the expected frequencies and amplitudes. Apply load transients that simulate the other subsystems' current demand. This reveals supply sensitivity that clean bench testing hides.

**Ground impedance testing.** Add representative ground impedance between the subsystem and its return path — a small series inductor or a length of trace — and observe the effect on performance. If performance degrades significantly with a few nanohenries of ground impedance, the subsystem is sensitive to ground coupling and will likely show problems in the integrated device.

**Margin testing.** Test the subsystem at the edges of its operating conditions simultaneously — worst-case supply voltage, maximum temperature, maximum load, maximum input signal level — to determine how much margin exists between the specification and the actual performance. If the margin is thin, integration noise will likely push it over the edge.

**Observation during integration.** When integrating, don't just check whether the subsystem still works — measure the actual conditions it experiences. Measure the supply at the subsystem's pins (not at the regulator output). Measure the ground potential at the subsystem relative to the ground reference of its signal source. Measure the temperature of the subsystem after thermal equilibrium. These measurements reveal the gap between bench conditions and integrated conditions.

## Tips

- The most common integration surprise is supply noise. Before integrating a sensitive subsystem, measure the actual supply rail on the device with the other subsystems active. If the noise is higher than the subsystem's datasheet requires, the subsystem will not perform to spec — regardless of how well it worked on the bench with a clean supply.
- When a subsystem fails at integration, don't redesign the subsystem first. Instead, identify which environmental condition changed from the bench test: supply noise, ground shift, temperature, loading, or input quality. Fixing the environment is often simpler and more robust than hardening the subsystem.
- Bench testing with "realistic" conditions — noisy supply, representative load, elevated temperature — catches most integration problems before the subsystem reaches the device board. The effort of building a representative bench test environment pays for itself by avoiding integration cycles.
- At integration time, enable only one subsystem at a time and verify its behavior before enabling the next. This incremental integration reveals which subsystem's activity triggers which interaction, making the coupling path identifiable.

## Caveats

- **A subsystem that works in integration today may fail tomorrow** — Conditions change as the device ages, as the environment changes, or as production variation puts different component values on the next build. A subsystem that works with thin margins at integration is a latent failure.
- **"Passing" an integration test doesn't mean "no interaction"** — A subsystem may have degraded performance at integration (higher noise, reduced accuracy, smaller timing margins) that still technically passes the specification. The degradation is real even if it doesn't cause a test failure, and it reduces the headroom available for other stress conditions.
- **The order of integration can affect results** — Enabling subsystem A before subsystem B may work, while enabling B before A may not, because of power sequencing, bus contention, or configuration dependencies. The integration order is itself a variable that needs to be documented and controlled.
- **Bench instruments can mask integration problems** — An oscilloscope probe's ground clip provides a low-impedance ground path that may reduce the ground coupling the subsystem experiences. The act of measuring with bench instruments can improve the conditions enough to hide the problem.

## Bench Relevance

- **A subsystem whose noise floor increases when other board subsystems are activated** is showing supply or ground coupling from the newly active subsystem — the noise floor at the bench (with quiet supply and ground) represents the subsystem's intrinsic noise, while the noise floor during integration includes the coupled contributions from other subsystems.
- **An analog circuit that develops a DC offset only when integrated** commonly appears when the ground potential at the subsystem's input differs from the ground potential at the subsystem's output — the ground shift, caused by return current from other subsystems flowing through the shared ground, appears as a differential-mode signal that the circuit amplifies.
- **A clock-dependent subsystem that works at room temperature on the bench but fails at temperature in the integrated device** often indicates that thermal coupling from an adjacent power subsystem is shifting a timing-sensitive parameter — the bench test at room temperature had no thermal coupling, and the integrated device at elevated temperature has less timing margin.
- **A subsystem that oscillates only when its output is connected to the real load on the device** frequently reveals a stability margin issue — the real load's impedance (capacitive, inductive, or complex) differs from the bench test load, and the subsystem's control loop becomes unstable with the actual load impedance.
