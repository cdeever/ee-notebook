---
title: "Decade Resistance Box"
weight: 70
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

A decade resistance box provides selectable precision resistance using rotary switches. Each switch controls one decade (1Ω, 10Ω, 100Ω, etc.), and the total resistance is the sum of all switch positions. Need 4,730Ω? Set the thousands dial to 4, hundreds to 7, tens to 3, and units to 0. The ability to dial in any resistance value instantly makes decade boxes invaluable for substitution testing, circuit simulation, and calibration.

## Why Substitution Testing Matters

When a circuit misbehaves, you often suspect a component: "Is that resistor actually 10k, or has it drifted? Is the pot dirty? Is the feedback resistor the right value?" You can measure the component, but measuring it in-circuit may give false readings due to parallel paths. Removing it takes time and risks damage.

Substitution sidesteps this: you replace the suspect component with a known-good value from the decade box. If the circuit works correctly with the substituted resistance, the original component was faulty. If the problem persists, look elsewhere.

This is faster than:
1. Desoldering the component
2. Measuring it
3. Finding a replacement
4. Soldering it in
5. Discovering it wasn't the problem
6. Repeating

### Applications

| Use Case | How the Decade Box Helps |
|----------|-------------------------|
| **Verify resistor values** | Substitute to confirm a value is correct |
| **Simulate sensors** | Many sensors are resistive (thermistors, RTDs, strain gauges). Simulate sensor readings |
| **Set bias points** | Dial in the correct bias resistance during circuit development |
| **Test protection circuits** | Simulate fault conditions by varying resistance |
| **Calibrate equipment** | Provide precise resistance standards for meter calibration |
| **Design experiments** | Try different values without stocking every resistor |

## How Decade Boxes Work

Internally, a decade box contains precision resistors and rotary switches. Each decade switch selects 0–9 times its base value:

- **Units switch (×1Ω):** Adds 0, 1, 2, ... 9Ω
- **Tens switch (×10Ω):** Adds 0, 10, 20, ... 90Ω
- **Hundreds switch (×100Ω):** Adds 0, 100, 200, ... 900Ω
- And so on for each decade

A four-decade box (1Ω resolution, 10kΩ maximum) has four switches and can produce any value from 0 to 9,999Ω in 1Ω steps.

**Switch types:**
- Older boxes use individual rotary switches for each decade
- Some designs use a single switch per decade with tapped resistor banks
- High-precision boxes may use Kelvin connections to eliminate contact resistance

## Specifications to Consider

| Specification | What It Means |
|---------------|---------------|
| **Range** | Maximum resistance (sum of all decades at maximum setting) |
| **Resolution** | Smallest step (lowest decade). A 0.1Ω resolution box has a 0.1Ω step |
| **Accuracy/Tolerance** | How close the actual resistance is to the dial setting. 0.1% is excellent; 1% is typical |
| **Power rating** | Maximum power dissipation. Most decade boxes are rated for milliwatts to 1W total. Exceeding this damages internal resistors |
| **Temperature coefficient** | How much resistance changes with temperature. Low TC matters for precision work |

**Common configurations:**
- **4-decade, 1Ω–10kΩ:** General-purpose
- **5-decade, 0.1Ω–100kΩ:** Extended range
- **6-decade, 0.01Ω–1MΩ:** Wide range with fine resolution

## Using a Decade Box

### Basic Substitution

1. **Identify the suspect component** and its nominal value
2. **Power down the circuit**
3. **Disconnect one end of the component** (or remove it entirely)
4. **Connect the decade box** in its place (use clip leads or short jumper wires)
5. **Set the decade box to the nominal value**
6. **Power up and test** — if the circuit works correctly, the original component was suspect
7. **Try varying the value** to see if the circuit's behavior matches expectations

### Finding the Right Value

When you don't know what resistance the circuit needs:

1. Start at a safe value (mid-range or the value you expect)
2. Observe circuit behavior
3. Adjust the decade box and observe changes
4. Dial in the optimal value
5. Replace with a fixed resistor of that value (or the nearest standard value)

This is useful for bias adjustments, feedback networks, and setting quiescent currents.

### Sensor Simulation

Resistive sensors (thermistors, RTDs, photoresistors, strain gauges) produce resistance proportional to their measured quantity. A decade box can simulate any sensor reading:

- Set the box to the resistance corresponding to a known temperature (for RTD testing)
- Step through values to verify alarm thresholds
- Simulate out-of-range conditions to test error handling

**Reference tables:** Keep lookup tables for common sensors (PT100 RTD values, thermistor curves) to translate between physical quantity and resistance.

### Calibration

Decade boxes serve as secondary resistance standards for calibrating ohmmeters. Connect the box, set a known value, and verify the meter reads correctly. Step through multiple values across the meter's range.

**Accuracy matters here:** Use a decade box with better accuracy than the meter you're calibrating (at least 4:1 ratio). A 1% decade box shouldn't calibrate a 1% meter.

## Limitations

**Power handling:** Most decade boxes are designed for signal-level work—milliwatts at most. Passing significant current through the internal resistors will heat them, shift their values, and potentially cause permanent damage. If you need power resistors, use the decade box to find the value, then substitute a properly rated discrete resistor.

**Contact resistance:** Rotary switches add contact resistance (typically 10–100mΩ per switch). This is negligible for kΩ measurements but significant if you're trying to set 1Ω precisely. High-quality boxes minimize this; cheap boxes may have noticeable switch resistance.

**Lead resistance:** The test leads connecting the decade box to the circuit add their own resistance. For low-ohm substitution, use short, heavy leads or Kelvin (4-wire) connections if available.

**Capacitance and inductance:** Decade boxes have some parasitic capacitance and inductance. This usually doesn't matter at DC or low frequencies, but it can affect high-frequency or pulse circuits. Don't use a decade box for RF impedance matching.

## Decade Capacitance and Inductance Boxes

The same principle applies to capacitors and inductors. Decade capacitance boxes provide selectable capacitance; decade inductance boxes (less common) provide selectable inductance. These are useful for:

- Filter tuning
- Resonant circuit adjustment
- Simulating capacitive sensors

Decade capacitance boxes typically use precision film or mica capacitors. They're lower power than resistor boxes and may have voltage limitations.

## Building vs. Buying

**Buying:** Commercial decade boxes are available from electronics distributors and surplus sources. Used units from lab sales are often high quality and affordable. Look for reputable brands (General Radio, ESI, Clarostat, IET Labs) for precision applications.

**Building:** A decade box is a straightforward project:
- Rotary switches (10-position, single-pole recommended)
- Precision resistors (1% or better for practical accuracy)
- Enclosure with labeled panel
- Binding posts or banana jacks for connection

A DIY box is fine for general-purpose substitution but won't match the accuracy and low contact resistance of a quality commercial unit.

## In Practice

- A decade resistance box eliminates the "resistor scavenger hunt"—no more digging through drawers for a 3.3k resistor when you can just dial it in
- Substitution testing is often faster than removing and measuring suspect components, especially in dense PCBs
- When a pot is suspected of being dirty or open, substitute a decade box and rotate through values to simulate pot rotation
- Keep the decade box near your bench with short test leads attached—the faster you can connect it, the more you'll use it
- Label which decades are which if the box has small markings; misreading 1kΩ as 100Ω wastes time
