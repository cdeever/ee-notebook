---
title: "Electronic Load"
weight: 45
---

# Electronic Load

An electronic load is the complement to a bench power supply — while the supply sources current, the load sinks it. This pairing enables testing power supplies, battery packs, regulators, and any circuit that needs to deliver power under controlled conditions. Without an electronic load, you end up with "resistor and hope" testing — fixed resistors that can't sweep load conditions, can't simulate transients, and can't characterize behavior across the full operating range.

## What It Does

An electronic load draws current from a device under test (DUT) in one of several controlled modes:

- **Constant Current (CC):** The load maintains a set current regardless of the voltage applied to it (within its operating range). This is the most common mode — testing a power supply's output at 1A, 2A, 3A to verify regulation and thermal behavior.
- **Constant Resistance (CR):** The load behaves like a fixed resistor, drawing current proportional to applied voltage (I = V/R). Useful for simulating resistive loads and for testing current-limited supplies at various load points.
- **Constant Voltage (CV):** The load draws whatever current is necessary to hold its input at a set voltage. This simulates a shunt regulator or clamp. Less commonly used but valuable for battery testing (discharge to a cutoff voltage) and for testing current-limited sources.
- **Constant Power (CP):** The load maintains a set power dissipation (P = V × I). Useful for battery discharge testing at constant power and for characterizing efficiency across a range of conditions.

The key capability is programmability — sweeping current from zero to rated maximum, stepping through load conditions, or generating transient steps to test dynamic response.

## Key Specs and What They Mean

| Spec | What it means | Why it matters |
|---|---|---|
| Voltage range | Operating voltage range (min to max) | Must accommodate the DUT's output voltage. A 0–150V load handles bench supplies, battery packs, and some offline converters. Minimum operating voltage matters — some loads won't regulate below 2–3V |
| Current range | Maximum continuous current | Must exceed the DUT's maximum output current. 30A covers most bench-scale power supplies; higher-power supplies and battery packs may need 60A+ |
| Power rating | Maximum continuous power dissipation | The hard limit. A 300W load can sink 10A at 30V, or 5A at 60V, or 30A at 10V — but never more than 300W total. Derate for extended operation |
| Minimum operating voltage | Lowest voltage at which the load regulates | Critical for low-voltage work. A load with 3V minimum can't test a 1.8V regulator or fully discharge a lithium cell to 2.5V |
| Transient response | How fast the load can change current | Matters for load transient testing — a slow load can't test a supply's response to fast load steps. Slew rate (A/µs) and minimum pulse width characterize this |
| Resolution | Smallest current/voltage step | Determines how finely you can control the load. 1 mA resolution is adequate for most work; 0.1 mA or better for precision testing |
| Readback accuracy | Accuracy of voltage/current measurements | The load's display shows what's happening. Higher accuracy means fewer external meters needed |
| Dynamic/transient mode | Ability to switch between two current levels at a set frequency | Simulates pulsed loads (microcontroller with radio, motor PWM) and tests supply transient response |

## Feature Tiers

| Tier | Typical specs | Good enough for | Not sufficient for |
|---|---|---|---|
| **Entry** (single channel, basic modes) | 0–30V, 0–10A, 150W, CC/CR modes, 2–3V minimum | Testing bench supplies, basic battery discharge, LED driver testing | Sub-2V regulators, fast transient testing, automated characterization |
| **Mid-range** (all modes, transient capable) | 0–120V, 0–30A, 300W, CC/CR/CV/CP, dynamic mode, 1.5V minimum | Most regulator testing, battery characterization, load transient testing | Very low voltage (<1.5V), high-power (>300W), precision (<0.1% accuracy) |
| **Lab-grade** (high power, low minimum voltage) | 0–500V, 0–60A+, 1000W+, <1V minimum, fast transients, SCPI | High-power supply testing, server PSU validation, production test | Multi-kW loads, specialized battery testing (use dedicated testers) |

## Modes in Detail

### Constant Current (CC)

The workhorse mode. Set 2A and the load draws 2A whether the source is at 5V, 12V, or 24V (within the load's voltage range). Use this for:

- Verifying a supply's load regulation (how much output voltage drops from no-load to full-load)
- Thermal testing (run at rated current and monitor temperature rise)
- Current limit verification (increase load current until the supply drops into CC or foldback mode)
- Battery discharge at constant current

### Constant Resistance (CR)

The load behaves like a power resistor. At 10Ω, it draws 1.2A at 12V, 2.4A at 24V. Use this for:

- Simulating resistive loads (heaters, incandescent lamps)
- Testing startup behavior (current starts low and rises as the supply comes up)
- Soft-start verification

### Constant Voltage (CV)

The load clamps its input to a set voltage by drawing whatever current is necessary. Use this for:

- Battery discharge to a cutoff voltage (set CV to 3.0V and let the load run until current drops to zero)
- Testing current-limited sources (the load tries to pull voltage down; the source limits current)
- Simulating a shunt load or voltage clamp

### Constant Power (CP)

The load maintains P = V × I = constant. As voltage drops, current rises to compensate. Use this for:

- Battery discharge at constant power (more representative of real-world electronics loads than constant current)
- Efficiency testing across a range of conditions

## Transient / Dynamic Mode

Dynamic mode switches between two current levels (I_high and I_low) at a set frequency and duty cycle. This simulates:

- Microcontroller waking from sleep and transmitting (low current → high current → low current)
- PWM-driven loads like motors and LEDs
- Any pulsed current profile

The supply's response to these transients — voltage droop, recovery time, ringing — reveals stability margins that steady-state testing misses. Connect an oscilloscope to the supply output during transient testing to see the actual response.

## Gotchas and Limits

- **Minimum operating voltage:** Many loads can't regulate below 2–3V. For testing 1.8V or 1.2V rails, you need a load with a lower minimum operating voltage, or add a series resistance and account for it in your calculations.
- **Power derating:** The rated power assumes adequate cooling. Continuous operation at full power in a warm environment may require derating. Watch for thermal shutdown during extended tests.
- **Cable resistance:** At high currents, voltage drop in the cables between DUT and load affects the voltage the load sees. Use sense leads (4-wire connection) if the load supports it, or measure voltage directly at the DUT.
- **Inrush when connecting:** Connecting a load set to high current to a supply that's already running can cause transients. Best practice: set load to minimum (or disable), connect, then ramp up.
- **Fan noise:** High-power loads have fans that run continuously or spin up under load. This is normal but can be distracting in a quiet lab.

## Tips

- Start with CC mode at low current and increase gradually — this catches supply issues without immediately stressing the DUT
- Use dynamic mode with an oscilloscope to characterize transient response — steady-state testing misses stability margins
- For battery testing, log voltage vs. time at constant current to generate discharge curves
- When testing a supply's current limit, increase load current slowly and watch the supply's output voltage — the point where voltage starts to drop indicates the supply entering current limit
- Verify cable gauge is adequate for the current — a 10A test through 22 AWG wire has significant voltage drop and power dissipation in the cable itself

## Caveats

- **The load is not a precision current meter** — readback accuracy is typically ±(0.5% + offset). For precision measurements, use a calibrated DMM or shunt.
- **CV mode with a stiff voltage source can oscillate** — if both the load and the source are trying to control voltage, the loop may not be stable. Use CC mode when testing stiff voltage sources.
- **Transient specifications require careful interpretation** — a load's slew rate may only apply under specific conditions. The actual transient shape depends on cabling, DUT impedance, and the load's internal control loop.
- **Battery testing requires appropriate safety precautions** — high-capacity lithium cells can deliver dangerous currents into a fault. Use the load's voltage limits and current limits as safety backstops.

## In Practice

- A supply that holds regulation at DC but droops during load transients has inadequate output capacitance or bandwidth — the electronic load's dynamic mode finds this
- Current limit testing: increase load until the supply drops out of CV mode. The current at which this happens is the actual current limit (which may differ from the setpoint)
- Battery state of health: discharge at a constant current (e.g., C/5 rate) and measure total capacity. Compare to rated capacity to assess degradation
- A power supply that shuts down under load but works open-circuit may have a current limit set too low, or the load cables may have enough resistance to trigger undervoltage lockout at the DUT
- Thermal testing: run at rated load for 30+ minutes and measure hotspot temperatures. A supply that works for 5 minutes but fails at 20 minutes has inadequate thermal design for continuous operation
