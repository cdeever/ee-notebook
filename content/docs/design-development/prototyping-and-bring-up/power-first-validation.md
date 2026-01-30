---
title: "Power-First Validation"
weight: 40
---

# Power-First Validation

Every measurement you make on a board is meaningless if the power is wrong. An ADC that reads 10% low might have a gain error — or it might be running on 2.9V instead of 3.3V. An oscillator that won't start might have wrong load caps — or its supply might be too noisy to sustain oscillation. Power is the foundation. Validate it first, validate it completely, and validate it before testing anything else.

## Check Each Supply Rail

Most designs have multiple power rails: a main input, one or more regulated outputs, possibly an analog supply separate from a digital supply, and sometimes specialty rails for specific peripherals. Each one must be verified independently.

For each rail, measure:

**Voltage.** Use a multimeter for the DC value and an oscilloscope for the full picture. A multimeter tells you the average voltage; a scope tells you the peak-to-peak ripple and any transients.

- **Expected vs actual.** A 3.3V rail that reads 3.28V is within normal tolerance (1 oz copper traces, regulator tolerance, reference accuracy all contribute small drops). A rail that reads 2.8V or 3.7V is a problem.
- **Under load.** Measure the voltage with the board operating normally. Some regulators look fine at no load but droop under the actual load current. If the MCU is sleeping and drawing 10 uA, wake it up and measure the supply under active current draw.

**Ripple and noise.** Switch to the oscilloscope, AC-coupled, with appropriate bandwidth limiting:
- DC-DC converters will show switching ripple at the switching frequency (typically 100 kHz to 2 MHz). The amplitude should match the datasheet's expected ripple for the output capacitance and load current. If it's significantly larger, check the output capacitors — wrong value, wrong type, or missing capacitors are common assembly defects.
- Linear regulators should show very low ripple. If you see significant noise on a linear regulator's output, check the input bypassing and ensure the regulator isn't oscillating (some LDOs oscillate with certain output capacitor ESR values).
- See the [Power Rails & Supplies]({{< relref "/docs/measurement/power-rails-supplies" >}}) measurement section for detailed guidance on measuring ripple and noise correctly.

**Current draw.** The total current drawn from each rail is a powerful diagnostic:
- If the current is much higher than expected, something is drawing excess current — possibly a short, a reversed component, or an I/O pin driving into a fault.
- If the current is much lower than expected, something isn't powered — possibly a bad solder joint, a missing component, or a regulator that hasn't started.
- Record the current values. They form a baseline for future comparison. If revision 2 draws 20% more current than revision 1, the difference needs investigation.

## Per-Rail Current Measurement

If the design includes current sense resistors (small-value resistors in series with each power rail), you can measure individual rail currents without breaking the circuit. Measure the voltage across the sense resistor and calculate I = V / R.

If sense resistors aren't present (common on first prototypes), you can:
- **Measure at the power supply.** A bench supply with a current readout gives you the total board current.
- **Insert a multimeter in series** by breaking the power path at a convenient point (a jumper, a header, or by removing a 0-ohm resistor and clipping in the meter).
- **Use a current probe** on a wire supplying the rail. Current probes are less common than voltage probes but invaluable for non-invasive measurements.

For future revisions, consider adding current sense resistors or current measurement test points to critical rails. The cost is negligible, and the diagnostic value during bring-up is high.

## Power Sequencing

Many designs require power rails to come up in a specific order. Common sequencing requirements:

- **Core voltage before I/O voltage.** Many ICs require the core supply to be stable before the I/O supply is applied. Reverse sequencing can cause latchup — a destructive condition where internal parasitic structures conduct excessive current.
- **FPGA power sequencing.** FPGAs typically have strict sequencing requirements documented in the datasheet. VCCINT before VCCAUX before VCCO is a common pattern, though it varies by family.
- **Analog before digital.** In mixed-signal designs, bringing up the analog supply before the digital supply prevents digital switching noise from appearing on the analog supply during its startup transient.

To verify sequencing:
1. Place oscilloscope probes on each power rail.
2. Apply input power and capture the startup waveforms on all channels simultaneously.
3. Verify that each rail reaches its target voltage in the correct order, with adequate timing margins.

If sequencing is wrong, the consequences range from "nothing noticeable" to "instant component damage." The datasheet will specify which failure mode to expect.

## Thermal Check

After the power rails are verified and stable, leave the board powered for five minutes, then check the temperature of every component — or at least every power component, every voltage regulator, and every IC.

**Methods:**
- **Finger test.** If all voltages are safe to touch (below ~50V), carefully touch each component. Anything too hot to touch (above ~60C) is running hotter than it should for most applications. This is crude but effective for catching gross problems.
- **IR thermometer (non-contact).** A spot pyrometer gives a temperature reading without touching the component. Good for quick surveys but not accurate for small components (the measurement spot may be larger than the part).
- **Thermal camera.** The best tool for thermal assessment. An IR camera shows the temperature distribution across the entire board in a single image, making it immediately obvious which components are hot and which are normal. Even an inexpensive USB thermal camera (like the FLIR ONE or Seek Thermal) is useful.

What you're looking for:
- **Components that are unexpectedly hot.** A voltage regulator running at 80C might be normal (check the thermal design). A bypass capacitor running at 80C is not normal — it indicates either excess current through the capacitor or proximity to a heat source.
- **Asymmetric heating.** If a board has two identical regulators for two identical loads, they should run at similar temperatures. If one is significantly hotter, the loads are unequal, or one regulator has a fault.
- **Heat spreading patterns.** Good thermal via design shows up as heat spreading away from the source. If a hot component's heat stays concentrated directly under it, the thermal via connection to inner planes may be poor.

## Load Testing

The initial power validation is typically at idle or light load. Before declaring the power design working, test it at the expected maximum load:

- **Increase MCU activity** — run a compute-intensive task, enable all peripherals, toggle all I/Os.
- **Enable high-current outputs** — motors, LEDs, RF transmitters, heaters, actuators.
- **Simulate worst-case conditions** — all subsystems active simultaneously, maximum data rate, maximum output power.

Under full load:
- Do any voltage rails droop below their minimum specification?
- Does the ripple amplitude increase significantly?
- Do any regulators enter thermal shutdown (output drops to zero, then recovers, then drops again)?
- Does the total current draw match the predicted power budget?

If the design includes a battery, test the power system across the full battery voltage range — from fully charged to the minimum operating voltage. Regulator behavior (especially dropout voltage and efficiency) changes with input voltage.

## Power Supply Rejection

A subtle but important test: does the circuit's behavior change when you vary the supply voltage?

This test reveals circuits that are sensitive to supply noise or supply variation:
- **Vary the input voltage by +/-10%** from the nominal value. If the circuit uses a regulated supply, the output should be independent of the input (within the regulator's line regulation specification). If behavior changes, the regulator may not be providing adequate rejection, or the circuit may be sensitive to a rail that isn't regulated.
- **Add noise to the supply.** A function generator in series with the supply (using a coupling capacitor or a series resistor) can inject known disturbances. Measuring the output while sweeping the injection frequency reveals the power supply rejection ratio (PSRR) at each frequency.

This test is especially important for analog circuits, precision measurement systems, and audio equipment — anywhere that power supply contamination affects the output.

## Gotchas

- **Multimeter readings hide ripple.** A multimeter shows the average DC voltage. A supply rail with 3.3V average and 500 mV peak-to-peak ripple reads "3.3V" on the meter but is far from a clean 3.3V. Always check with a scope.
- **Probe ground lead inductance distorts ripple measurements.** The standard 6-inch scope probe ground lead adds enough inductance to ring at the switching frequency, making ripple look worse than it is. Use the probe's ground spring (tip-and-barrel measurement) for accurate ripple readings.
- **Current limiting can mask startup problems.** If the bench supply's current limit is set too low, a regulator may not start up properly — it needs a brief inrush current to charge the output capacitors. If a rail won't come up, try increasing the current limit temporarily.
- **Sequencing violations don't always cause immediate damage.** A device that survives incorrect power sequencing today may develop latent damage that causes failure later. Just because the board seems to work doesn't mean the sequencing is correct.
- **Cold solder joints on power pads cause intermittent behavior.** A regulator with a poorly soldered input or output pad may work at low current and fail under load. If a rail droops under load, check the solder joints before suspecting the component.
- **Enable pins left floating cause random power-up behavior.** Many regulators and power switches have enable pins that must be actively driven or tied to a defined state. A floating enable pin can cause the rail to come up sometimes and not other times.
