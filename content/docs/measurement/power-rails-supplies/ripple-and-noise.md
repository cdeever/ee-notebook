---
title: "Ripple & Noise on the Rail"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Ripple & Noise on the Rail

AC on top of DC. Every power rail has some ripple and noise — the question is whether it's acceptable for downstream circuits. Switching converters are the usual suspects, but LDOs have noise too, and external interference can ride on rails.

## Oscilloscope Ripple Measurement

AC-couple the channel to reject DC and zoom in on AC content. Set vertical scale to see the ripple — start at 10 mV/div for a clean rail, 50–100 mV/div for a switcher. Set timebase based on expected switching frequency (1 µs/div for 500 kHz switcher, 5 ms/div for 50/60 Hz mains ripple).

**Use 20 MHz bandwidth limit** to reject high-frequency probe artifacts and noise — this is standard practice for ripple measurement per most DC-DC converter datasheets.

**Tip-and-barrel technique** for most accurate measurement: remove the ground clip and touch probe tip to the rail pad and ground barrel to the ground pad, right at a decoupling cap. This minimizes ground loop area and eliminates probe-induced ringing.

Measure peak-to-peak ripple and compare to downstream IC requirements.

## DMM AC Voltage Check

For quick go/no-go without waveform detail, measure with AC Volts mode. This gives a rough RMS indication of total ripple/noise energy — useful for comparing "is this rail noisier than that one?"

## Tips

- Start with 20 MHz bandwidth limit for standard ripple measurement, then try full bandwidth if debugging noise coupling into sensitive analog
- Use 1x probe for better low-voltage sensitivity when ripple is small and bandwidth isn't critical
- Measure right at a decoupling cap with tip-and-barrel for the cleanest reading

## Caveats

- Long ground leads pick up switching noise and radiated EMI — the measurement adds noise; tip-and-barrel fixes this
- AC coupling has a high-pass corner — very low-frequency noise (< 10 Hz) gets attenuated; use DC coupling with vertical offset if slow drift is suspected
- 20 MHz bandwidth limit hides high-frequency noise — remove the limit when debugging sensitive analog circuits
- Most DMMs measure AC with limited bandwidth (few hundred Hz to ~100 kHz) — switching ripple at 500 kHz may be partially or fully rejected
- DMM shows RMS, not peak-to-peak — a 50 mVpp triangle reads as ~14 mV RMS, which can mislead when comparing to peak-to-peak specs

## In Practice

- Ripple at the switching frequency confirms the switcher is the source — compare amplitude to datasheet limits
- Ripple frequency that doesn't match expected switching frequency indicates something else is modulating the supply
- Noise spikes separate from fundamental ripple indicate fast switching edge transients — may couple into sensitive circuits
- Ripple that decreases dramatically when using tip-and-barrel vs ground clip indicates probe-induced artifact, not actual ripple
- Rail that looks clean on scope with bandwidth limit but shows noise without it has high-frequency content — check if downstream circuits are sensitive to those frequencies
- AC voltage reading on DMM that seems too low compared to scope measurement suggests the ripple frequency exceeds DMM bandwidth
- **Supply noise that appears only when a specific subsystem is active** indicates a power interface failure — the supply's impedance at the frequencies the subsystem draws current is too high, and the load transients are coupling through the power channel.
- **A subsystem whose noise floor increases when other board subsystems are activated** is showing supply or ground coupling from the newly active subsystem — the noise floor at the bench (with quiet supply and ground) represents the subsystem's intrinsic noise, while the noise floor during integration includes the coupled contributions from other subsystems.
- **Oscillation or ringing on the output of a regulator IC that matches the datasheet's application circuit** often indicates that the PCB layout introduces parasitic inductance or capacitance that the IC's internal compensation wasn't designed to handle — the internal loop was compensated for a specific range of external parasitics, and the layout has pushed the actual values outside that range.
- **An IC that works in one circuit but not another, despite identical connections,** often indicates that the IC is being treated at the wrong abstraction level — the second circuit has different operating conditions (load, temperature, input range) that violate assumptions invisible when the IC is treated as a simple component.
- **Unexpected oscillation or instability in a circuit using a subsystem-level IC** often shows up when the external components don't match the datasheet's recommendations — a different output capacitor ESR, a different feedback network impedance, or a layout that adds parasitic inductance the IC's internal compensation wasn't designed for.
- **Oscillation that appears only under specific load conditions** commonly appears when the output capacitor's effective characteristics (capacitance, ESR) at the operating voltage and temperature push the loop compensation out of its stable region — the same circuit may be perfectly stable with a different capacitor value or type that maintains its characteristics under load.
- **A regulator whose output voltage doesn't match the calculated value from the feedback resistor ratio** often shows up when the feedback divider's resistor values have drifted, when leakage current into the IC's feedback pin is significant relative to the divider current, or when the PCB has a parasitic resistance in the feedback path — the IC is regulating to the voltage it sees at its feedback pin, which differs from the voltage at the output.
