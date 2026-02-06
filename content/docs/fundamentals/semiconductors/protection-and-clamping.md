---
title: "Protection & Clamping Devices"
weight: 60
---

# Protection & Clamping Devices

Protection devices exist to absorb transient energy before it reaches sensitive circuits. Clamping devices limit voltage excursions to safe levels. Both use semiconductor junctions to create a voltage-dependent current path — conducting heavily when the voltage exceeds a threshold, appearing as nearly open circuits otherwise.

The key difference from simple diodes: protection and clamping devices are designed for their behavior in breakdown or avalanche, not for forward conduction. They're specified by their clamping voltage, energy absorption, and response time — parameters that matter when the transient arrives.

## TVS Diodes (Transient Voltage Suppressors)

TVS diodes are Zener-like devices optimized for absorbing high-energy transients. When the voltage exceeds the breakdown threshold, the TVS clamps it to a defined level by conducting the surge current to ground.

### Key Parameters

- **V_BR (breakdown voltage)** — The voltage at which the TVS begins to conduct (typically measured at 1 mA). The TVS is essentially non-conducting below this voltage.

- **V_WM (working voltage, standby voltage)** — The maximum continuous DC voltage for normal operation. The TVS should not conduct in normal circuit operation. Typically V_WM ≈ 0.85 × V_BR.

- **V_C (clamping voltage)** — The voltage across the TVS while it's conducting the rated peak pulse current. This is higher than V_BR because the TVS has finite dynamic impedance. The clamping voltage at I_PP determines what the protected circuit actually sees during a transient.

- **I_PP (peak pulse current)** — The maximum current the TVS can handle for a specified pulse shape (often 8/20 μs or 10/1000 μs waveforms from surge standards).

- **P_PPM (peak pulse power)** — V_C × I_PP. This is the instantaneous power during clamping, not continuous power capability.

### Unidirectional vs. Bidirectional

- **Unidirectional TVS** — Clamps positive transients to V_C; conducts like a forward diode for negative transients (drops ~0.7 V). Use when the signal is always positive with respect to ground.

- **Bidirectional TVS** — Clamps both polarities symmetrically. Essentially two back-to-back Zener structures. Use for AC signals or signals that swing both positive and negative.

### Selection Tradeoffs

The clamping voltage is always higher than the breakdown voltage because the TVS has dynamic resistance. Lower-voltage TVS devices tend to have higher capacitance. Faster clamping requires lower inductance — TVS devices in larger packages may not protect against the fastest transients because lead inductance slows the response.

For ESD protection, TVS devices are available in tiny packages with low capacitance (for high-speed data lines) but limited energy handling. For industrial surge protection, larger TVS devices handle more energy but have higher capacitance and slower response.

## Zener Diodes as Protection

Standard Zener diodes can provide protection, but they're designed for voltage regulation, not surge absorption. Key differences from TVS diodes:

- **Lower surge current capability** — Zeners are rated for continuous power dissipation, not pulse energy
- **Slower response** — General-purpose Zeners may not clamp fast transients effectively
- **Tighter voltage tolerance** — Zeners are specified for accurate breakdown voltage; TVS devices tolerate wider ranges

Zeners work for protection in low-energy applications or as secondary protection after a TVS has absorbed the initial surge. They're not suitable as primary protection against lightning, ESD, or inductive kickback.

### Using Zeners for Clamping

For signal clamping (limiting analog signal excursion), Zeners work well:

- A single Zener to ground clamps positive excursions to V_Z (plus some dynamic rise with current)
- Back-to-back Zeners clamp both polarities symmetrically
- A Zener in series with a forward diode clamps at V_Z + 0.7 V

The soft knee of the Zener I-V curve means clamping isn't perfectly sharp — current begins to flow before the full clamping voltage is reached. For precision clamping, this matters.

## Schottky Diodes as Clamps

Standard signal diodes and Schottky diodes provide clamping to supply rails:

- **To VCC** — Anode to signal, cathode to VCC. Clamps the signal to VCC + V_f.
- **To ground** — Anode to ground, cathode to signal. Clamps the signal to -V_f.

Schottky diodes are preferred for input protection because:
- Lower forward voltage (0.2-0.4 V vs. 0.6-0.7 V) means less overshoot before clamping
- Faster switching — no minority carrier storage
- Lower series resistance

Many IC inputs have internal clamping diodes to the supply rails. These handle incidental overvoltage but are not rated for high-energy transients. External diodes (with series resistance to limit current) add robust protection.

### Catch Diodes and Flyback Protection

When current through an inductor is interrupted (relay coil, solenoid, motor), the inductor generates a voltage spike proportional to L × di/dt. Without protection, this spike can reach hundreds of volts and destroy the switching device.

A **flyback diode** (also called a catch diode or freewheeling diode) across the inductor provides a current path when the switch opens. The diode clamps the spike to one V_f above the supply.

- Place the diode directly across the inductive load, not at the driver
- The diode must handle the steady-state load current (when clamping) and the forward surge current
- Fast-recovery diodes aren't required at relay switching speeds; standard diodes work fine

The tradeoff: the flyback diode slows the release of the relay or solenoid because the stored energy must dissipate through the diode's forward resistance instead of instantly collapsing. For faster release, a Zener in series with the flyback diode allows a higher clamp voltage (V_Z + V_f) and faster energy dissipation — at the cost of higher voltage stress on the switch.

## MOVs (Metal Oxide Varistors)

MOVs are voltage-dependent resistors, not junction devices. Above the clamping voltage, their resistance drops dramatically. They're commonly used for AC line protection.

MOVs differ from TVS diodes:

- **Higher energy absorption** — MOVs can absorb joules, not just millijoules
- **Slower response** — Nanoseconds vs. picoseconds for TVS
- **Degradation** — MOV clamping voltage creeps upward with each surge; they wear out
- **Higher leakage** — MOV leakage current increases with age and surge history

For repetitive transients or when long-term reliability matters, TVS diodes are preferred. For single high-energy events (lightning), MOVs provide more raw absorption capacity.

## Gas Discharge Tubes (GDTs)

GDTs are arc-gap devices that fire (ionize) when voltage exceeds their threshold, creating a low-impedance path. They handle very high surge currents but:

- Fire slowly (microseconds to ionize the gas)
- Have high arc voltage (60-90 V once conducting)
- Require the surge current to drop below a holding value before extinguishing

GDTs are typically used as the first stage of protection, absorbing the bulk of a surge. A TVS behind the GDT handles the faster, lower-energy residual that gets through before the GDT fires.

## Selection by Application

**ESD protection on data lines:**
- Low-capacitance TVS (≤ 0.5 pF for high-speed)
- Schottky clamps to rails with series resistance
- Fast response is critical; energy levels are low

**Industrial I/O protection:**
- Higher-energy TVS (≥ 400 W peak power rating)
- May need series resistance to limit let-through current
- Consider the protection of both differential and common-mode transients

**AC mains protection:**
- MOV as primary (high energy capacity)
- TVS as secondary (faster, tighter clamping)
- GDT for extreme surge environments (lightning)

**Inductive load switching:**
- Flyback diode (standard rectifier is fine)
- Zener + diode for faster release at cost of higher clamp voltage
- TVS across the switch for additional protection

## Tips

- Select TVS working voltage to be above normal operating voltage with margin for tolerance and temperature
- For high-speed signals, capacitance matters as much as protection — check both
- Place protection devices close to the entry point of the transient (connector, cable)
- Use series resistance to limit current through clamping diodes to safe levels

## Caveats

- **Clamping voltage is not breakdown voltage** — During a surge, the voltage across the TVS is V_C, which is higher than V_BR. Ensure the protected circuit tolerates V_C, not just V_BR
- **Protection devices have limits** — Exceeding the rated surge energy destroys the protection device (and leaves the circuit unprotected for subsequent surges)
- **Capacitance affects signal integrity** — Protection on high-speed lines must be low-capacitance; verify the bandwidth impact
- **MOVs wear out** — Each surge degrades the MOV. For repetitive events, replace MOVs periodically or use TVS instead
- **Internal IC protection is limited** — Built-in ESD diodes are designed for handling and assembly, not operational transients. External protection is still needed

## In Practice

- A protection device that runs warm during normal operation is seeing too much leakage — check that the working voltage isn't too close to the actual signal voltage
- A TVS that fails shorted typically saw a surge beyond its rated energy — increase the rating or add upstream protection (MOV, GDT)
- A TVS that fails open is often a sign of repetitive lower-energy surges that fatigued the device
- An input that fails in the field but works on the bench often has inadequate transient protection — the bench doesn't have the same surge environment
- Inductive load switching that destroys the driver despite a flyback diode may have the diode placed at the wrong location (at the driver instead of across the load)
