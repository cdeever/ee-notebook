---
title: "Adjustable Load Bank"
weight: 100
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

An adjustable load bank provides a controllable load for testing power supplies, batteries, chargers, and other power sources. Instead of guessing whether a supply can deliver its rated current, you connect a load bank, dial up the current, and measure what actually happens: voltage sag, ripple under load, thermal behavior, and protection circuit response.

Load banks answer the question: "Does this power source actually perform under real-world conditions?"

## Why Load Testing Matters

A power supply's no-load voltage tells you almost nothing. The real questions are:

- **Does it maintain regulation under load?** A supply rated for 12V at 2A might sag to 10V at 2A if the regulation loop is faulty.
- **What's the ripple under load?** No-load ripple is often minimal; load-induced ripple reveals filter capacitor problems.
- **Can it deliver rated current continuously?** Thermal issues, component ratings, and marginal designs show up only under sustained load.
- **Where do the protection circuits kick in?** Overcurrent, thermal shutdown, foldback limiting—you need to trigger these to verify they work.
- **How does battery capacity degrade?** Batteries need constant-current loads for capacity testing.

Without a load, you're testing in the easiest possible conditions. A load bank creates realistic conditions.

## Types of Load Banks

### Resistive Load Bank (Switchable)

The simplest approach: power resistors with switches to select different values.

**Structure:**
- Multiple power resistors (e.g., 10Ω, 20Ω, 50Ω, 100Ω)
- Switches to connect each resistor in parallel
- Heatsinking or fan cooling for thermal management
- Binding posts or banana jacks for connection

**Advantages:**
- Simple, passive, no power required
- Wide voltage range
- Predictable behavior

**Disadvantages:**
- Fixed current steps (not continuously adjustable)
- Load current varies with voltage (ohm's law)
- Large for high-power testing

### Resistive Load Bank (Decade-Style)

Like a decade resistance box but rated for power:

- Rotary switches select resistance in decade steps
- Power resistors rated for the expected dissipation
- Often includes ammeter and voltmeter

This is more convenient than individual switches but still follows ohm's law—current depends on applied voltage.

### Electronic Load

An active circuit that sinks a constant, adjustable current regardless of voltage:

**Operating modes:**
- **Constant current (CC):** Load sinks a set current; voltage can vary
- **Constant resistance (CR):** Load simulates a resistor of set value
- **Constant power (CP):** Load sinks a set power; current varies with voltage
- **Constant voltage (CV):** Load maintains a set voltage across its terminals

**Advantages:**
- Precise current control
- Constant current regardless of voltage changes
- Multiple operating modes
- Built-in metering
- Dynamic load capability (for transient testing)

**Disadvantages:**
- Requires power to operate (active device)
- More complex, more expensive
- Maximum voltage and current ratings must be respected
- Generates significant heat requiring cooling

### DIY Electronic Load

A power MOSFET or transistor controlled by an op-amp feedback loop creates a simple electronic load:

**Basic circuit:**
- Power MOSFET (e.g., IRFP150, IRFZ44) as the load element
- Current sense resistor in the source lead
- Op-amp comparing sense voltage to a reference
- Reference set by potentiometer for current adjustment
- Heatsink on the MOSFET

The op-amp drives the gate to maintain constant current through the sense resistor. Simple and effective for moderate power levels.

## Sizing a Load Bank

Consider the power sources you need to test:

| Power Source Type | Typical Test Range | Load Bank Requirements |
|-------------------|-------------------|----------------------|
| USB chargers | 5V, 0–3A | 15W capacity, CC mode preferred |
| 12V bench supplies | 12V, 0–10A | 120W capacity |
| ATX PC supplies | 3.3V, 5V, 12V, 20A+ per rail | 300W+ capacity, multi-channel |
| Battery packs | Various voltages, capacity testing | CC mode essential, timed discharge |
| Audio amplifiers | Various, rated power | Match amp power rating |

**Overhead:** Size the load bank for at least 1.5× the maximum power you expect to test, to allow for margin and continuous operation without thermal stress.

## Using a Load Bank

### Basic Power Supply Test

1. **Connect the load bank** to the power supply output (observe polarity)
2. **Set the load to minimum** (zero current or highest resistance)
3. **Turn on the power supply**
4. **Measure no-load voltage** — should be at or near rated value
5. **Gradually increase load** while monitoring:
   - Output voltage (should remain within regulation spec)
   - Output current (confirms load setting)
   - Ripple (with oscilloscope or AC-coupled meter)
   - Supply temperature
6. **Test at rated load** — verify voltage, ripple, temperature
7. **Test beyond rated load** — verify overcurrent protection activates

### Battery Capacity Test

1. **Fully charge the battery**
2. **Connect electronic load in constant-current mode**
3. **Set current to rated discharge rate** (e.g., 0.2C for 5-hour test)
4. **Monitor voltage over time**
5. **Stop when voltage reaches cutoff** (typically 3.0V/cell for Li-ion)
6. **Calculate capacity:** Current × Time = Amp-hours

### Transient Response Testing

For switching supplies and voltage regulators:

1. Set a baseline load (e.g., 50% of rated)
2. Step the load quickly (electronic loads have transient mode)
3. Observe output voltage with oscilloscope
4. Measure overshoot, undershoot, and recovery time
5. Compare to specifications

### Finding the Regulation Limit

1. Start at no load
2. Increase load gradually
3. Plot output voltage vs. current
4. The regulation limit is where voltage starts to drop significantly
5. This reveals actual capability vs. rated capability

## Thermal Management

Load banks convert electrical energy to heat. Managing this heat is critical:

**Resistor-based loads:**
- Mount resistors on heatsinks or use chassis-mount types
- Use forced-air cooling for sustained high-power testing
- Derate for continuous operation (50% of burst rating is common)

**Electronic loads:**
- Active cooling (fans) often required
- Monitor MOSFET/transistor temperature
- Thermal shutdown protection recommended
- Ensure airflow isn't blocked

**Enclosure considerations:**
- Ventilation openings essential
- Metal enclosures help with heat dissipation
- Don't place on flammable surfaces during high-power tests

## Building a Simple Resistive Load

**Parts:**
- Power resistors (25W–100W chassis-mount types)
- Heatsink or aluminum plate
- Toggle switches (rated for expected current)
- Binding posts or banana jacks
- Ammeter (optional but useful)
- Enclosure with ventilation

**Example: 12V Load Bank**
- 4Ω at 50W: Draws 3A at 12V (36W dissipation)
- 8Ω at 50W: Draws 1.5A at 12V (18W dissipation)
- 12Ω at 50W: Draws 1A at 12V (12W dissipation)

Switch combinations in parallel give you 0.5A, 1A, 1.5A, 2.5A, 3A, 4A, 4.5A, and 5.5A steps (with some non-linearity due to parallel resistance).

## Commercial Options

**Electronic loads:**
- Entry-level: Inexpensive single-channel DC loads (150W range)
- Mid-range: Multi-mode loads with built-in metering (300–500W)
- Professional: High-power programmable loads with PC interface

**Resistor decades:**
- Power decade boxes rated for watts instead of milliwatts
- Often built with wirewound resistors and robust switches

**USB testers with load:**
- Convenient for USB power source testing
- Built-in current adjustment and voltage/current display

## Limitations

**Power dissipation:** All that power becomes heat. Sustained high-power tests require adequate cooling and safety precautions.

**Voltage limits:** Electronic loads have maximum voltage ratings. Exceeding these damages the load (and potentially you).

**Minimum operating voltage:** Many electronic loads need a minimum voltage to operate (often 2–3V). Testing very low voltage sources may not work.

**Dynamic response:** Resistor-based loads can't do fast transients. Electronic loads vary in their transient capability.

## In Practice

- No power supply is really tested until you've loaded it to rated current and verified it delivers rated voltage with acceptable ripple
- For battery testing, a constant-current electronic load is essential—resistive loads give varying current as battery voltage drops
- A simple resistive load with a few switched resistors covers most bench needs; save the electronic load for precision work or automated testing
- Watch the heat—a 100W load bank at full power is a 100W heater. Don't ignore ventilation.
- When a "12V 2A" supply fails at 1.5A, you've found the problem without ever opening the case
