---
title: "Logic Families"
weight: 20
---

# Logic Families

The same Boolean function can be implemented in many different circuit technologies, each with different voltage levels, speed, power consumption, noise immunity, and drive strength. A "logic family" defines the electrical characteristics that a set of compatible devices share. Choosing the right family — and knowing how to interface between them — is a fundamental practical skill.

## TTL: Transistor-Transistor Logic

The original workhorse of digital electronics, built from bipolar junction transistors (BJTs).

**Standard TTL (74xx series):**
- Supply voltage: 5 V
- Output LOW: 0 to 0.4 V (guaranteed), typically 0.2 V
- Output HIGH: 2.4 to 5.0 V (guaranteed), typically 3.4 V
- Input LOW threshold: 0.8 V
- Input HIGH threshold: 2.0 V

**Key characteristics:**
- Fast switching (for its era) — propagation delay in the 10-30 ns range for standard TTL
- Relatively high power consumption — each gate draws milliamps of supply current
- Outputs actively source and sink current — good drive capability, especially sinking (LOW state)
- Inputs that are left floating tend to act as HIGH (because the input is an emitter, and the base-emitter junction needs current to turn on). This is convenient but unreliable — always tie unused inputs to a defined level

**TTL subfamilies** improved the original design: LS (Low-power Schottky), ALS (Advanced Low-power Schottky), F (Fast), and others. Each trades speed, power, and cost differently. The 74LS series became the dominant TTL variant for decades.

## CMOS: Complementary Metal-Oxide-Semiconductor

Built from complementary pairs of NMOS and PMOS transistors. CMOS has largely replaced TTL for almost all applications.

**Traditional CMOS (4000 series, 74HC series):**
- Supply voltage: 3 to 15 V (4000 series), 2 to 6 V (74HC)
- Output swings rail-to-rail — within millivolts of VDD and GND under light loads
- Input thresholds at approximately VDD/2
- Near-zero static power consumption — current flows only during switching

**Key characteristics:**
- Extremely low static power — CMOS gates draw essentially zero current when not switching, because one of the two transistors (PMOS or NMOS) is always off, blocking the supply-to-ground path
- Dynamic power proportional to frequency: P = C x V^2 x f. Each transition charges and discharges the load capacitance. Higher frequency means higher power
- Equal source and sink drive capability (unlike TTL, which sinks better than it sources)
- Slower than TTL at equivalent process nodes (historically), but modern CMOS is far faster than any TTL ever was
- **Unused inputs must NEVER be left floating.** The gate input is essentially a capacitor (the MOSFET gate oxide). A floating input can sit at any voltage, including mid-supply, where both transistors conduct simultaneously, causing excessive current draw and potential damage. Always tie unused inputs to VDD or GND

**Common CMOS families:**
- **74HC** — High-speed CMOS, 5 V compatible, replaces 74LS in most applications
- **74HCT** — HC with TTL-compatible input thresholds (0.8 V / 2.0 V). Drop-in replacement for TTL in mixed systems
- **74AC / 74ACT** — Advanced CMOS. Faster than HC, with very fast edges (which can cause signal integrity problems)
- **74LVC** — Low-voltage CMOS, 1.65-3.6 V. 5 V tolerant inputs on many devices
- **74AUC** — Ultra-low voltage, down to 0.8 V supply. Sub-nanosecond propagation delays

## Voltage Levels and Noise Margins

The gap between output levels and input thresholds defines the noise margin — the amount of noise a signal can tolerate and still be interpreted correctly.

**TTL noise margins:**
- LOW noise margin: V_IL - V_OL = 0.8 V - 0.4 V = 0.4 V
- HIGH noise margin: V_OH - V_IH = 2.4 V - 2.0 V = 0.4 V

**CMOS noise margins (at 5 V):**
- LOW noise margin: V_IL - V_OL ≈ 2.5 V - 0.0 V = 2.5 V
- HIGH noise margin: V_OH - V_IH ≈ 5.0 V - 2.5 V = 2.5 V

CMOS has far better noise margins because its outputs swing rail-to-rail and its thresholds are at mid-supply. This is a major reason CMOS dominates in noisy environments and low-voltage designs.

## Fan-Out

Fan-out is how many inputs one output can drive. It is limited by two factors:

**DC fan-out (steady state):** The output must source or sink enough current to satisfy all connected inputs. TTL inputs draw significant current (up to 1.6 mA per input for standard TTL in the LOW state). A standard TTL output can sink 16 mA, so fan-out is about 10. CMOS inputs draw essentially no DC current (picoamps of gate leakage), so DC fan-out is very high.

**AC fan-out (dynamic):** Every input adds capacitance (typically 3-10 pF). More inputs mean more capacitance, which slows down transitions. At some point, the signal rises too slowly to meet timing requirements. AC fan-out is the practical limit in high-speed designs, even with CMOS.

**Rule of thumb:** In modern CMOS designs, fan-out of 4-6 is reasonable without buffering. Higher fan-out needs a buffer or a driver with stronger output.

## Drive Strength

How much current an output can source (pull HIGH) or sink (pull LOW).

- Standard CMOS (74HC): 4-8 mA source/sink
- Bus drivers (74HCT245): 24 mA
- Dedicated buffers: 50+ mA

Exceeding drive strength causes the output voltage to sag (for HIGH) or rise (for LOW), reducing noise margin. At extremes, the output may not reach a valid logic level at all.

**When more drive is needed:**
- Add a buffer IC between the logic output and the load
- Use an open-drain/open-collector output with an external pull-up sized for the load
- Use a dedicated line driver or bus transceiver

## Level Shifting

When two parts of a system operate at different voltages (3.3 V and 5 V being the most common pairing), signals must be level-shifted to avoid damage or misinterpretation.

**5 V to 3.3 V (stepping down):**
- Resistor voltage divider — simple, but slow (adds an RC time constant with input capacitance) and wastes current
- Series resistor with clamping diode to 3.3 V rail — protects the 3.3 V input from overvoltage
- Dedicated level shifter IC — cleanest solution, handles bidirectional signals
- Some 3.3 V CMOS inputs are 5 V tolerant (check the datasheet for the "5 V tolerant" specification)

**3.3 V to 5 V (stepping up):**
- A 3.3 V CMOS output driving a 5 V TTL-threshold input (74HCT) often works — the 3.3 V HIGH (3.0 V minimum) exceeds the TTL V_IH threshold of 2.0 V. But it does NOT meet 5 V CMOS thresholds (2.5 V would be marginal at best)
- MOSFET level shifter — a BSS138 N-channel MOSFET with pull-ups on both sides. Works bidirectionally and handles open-drain protocols (I2C) naturally
- Dedicated level shifter ICs with direction control for push-pull signals

**Bidirectional level shifting** is needed for buses like I2C and SPI (MISO/MOSI during full-duplex). The MOSFET technique handles I2C elegantly. For SPI and other push-pull interfaces, direction-aware level shifters (like TXB0108) are common but have quirks — they rely on drive strength sensing, which can malfunction with weak signals or open-drain outputs.

## Open-Drain and Open-Collector Outputs

Some outputs have only a pull-down transistor (NMOS for open-drain, NPN for open-collector). There is no internal pull-up — an external resistor to the desired voltage provides the HIGH level.

**Advantages:**
- Multiple open-drain outputs can share a single pull-up (wired-OR / wired-AND, depending on active polarity). This is how I2C works — any device can pull the bus LOW
- The pull-up can connect to a different voltage than the IC's supply, providing inherent level shifting
- No bus contention — since the output can only pull LOW or float, two devices driving the same wire never fight

**Disadvantages:**
- Asymmetric rise/fall times. Pulling LOW is fast (active transistor). Pulling HIGH is slow (passive pull-up resistor charging the bus capacitance). The pull-up resistor value is a compromise: smaller = faster rise but more current; larger = lower current but slower rise

## Gotchas

- **Floating CMOS inputs are dangerous** — A floating CMOS input can sit at mid-supply, causing both transistors to conduct, drawing excessive current and potentially destroying the gate. Always tie unused inputs HIGH or LOW. TTL inputs are more forgiving (they float HIGH) but should still be tied off for reliability
- **HCT solves most TTL-to-CMOS problems** — The 74HCT family accepts TTL voltage levels on its inputs and produces CMOS output levels. It's the standard bridge between old TTL systems and modern CMOS
- **Fast edges cause problems** — Advanced CMOS families (74AC, 74AUC) have sub-nanosecond edges that cause ringing, reflections, and crosstalk. Series termination resistors (22-47 ohm) at the output are often needed. Slower families (74HC) rarely need this
- **Supply voltage determines speed and power** — A 74HC gate at 2 V is much slower and has much less drive strength than the same gate at 5 V. The datasheet specifies performance at multiple supply voltages. Operating at lower voltage saves power but costs speed and noise margin
- **Mixed-voltage systems need careful power sequencing** — If a 3.3 V chip powers up before its 5 V neighbor, its inputs may see 5 V signals while its supply is still ramping. Clamping diodes in the input protection circuit can latch up or be damaged. Power-up sequence matters in mixed-voltage designs
