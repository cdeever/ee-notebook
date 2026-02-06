---
title: "Is Voltage Present?"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is Voltage Present?

First check at power-up. Before anything else, confirm the rail exists. A missing rail explains a lot of downstream weirdness, and it takes ten seconds to check.

## DMM DC Voltage Check

Set DMM to DC Volts, probe the rail test point versus ground, compare reading to schematic expected value.

- **Rail present and approximately correct** → move on to downstream checks
- **Rail is zero** → supply isn't running, trace is open, or fuse is blown
- **Rail is low but nonzero** → possible short loading it down, or regulator not regulating

## Oscilloscope Quick DC Check

Use a scope instead of DMM when:
- Startup behavior needs to be visible (does the rail come up clean or oscillate?)
- Intermittent dropout is suspected
- AC content on the DC needs to be seen (ripple, noise, oscillation)
- Multiple rails need simultaneous monitoring

DC-couple the channel, set vertical scale to show the expected voltage, set timebase based on what's being observed (100 ms/div for startup, 1 ms/div for steady-state). The scope shows DC level plus any visible AC content and startup waveform shape.

## Tips

- Check at the load, not just at the regulator output — trace and connector resistance can drop voltage
- Use the DMM for accurate DC value, scope for waveform shape — scope vertical accuracy is typically 3–5%
- If a reading seems wrong on a high-impedance node, try loading it lightly or switching to LoZ mode to reject ghost voltages

## Caveats

- DMM averages the reading — transient dropout or brief power cycling won't be revealed
- High-impedance nodes can show ghost voltages from capacitive coupling
- Auto-range can be slow on unstable or oscillating rails — manual range is faster if the expected value is known
- Verify the ground reference is correct — checking a 3.3V rail against the wrong ground gives a meaningless number
- At 10x probe attenuation, small voltages can be hard to read on a scope — consider 1x for low-voltage rails
- Scope ground clips are earth-referenced — connecting to a signal pin instead of ground creates a short

## In Practice

- Rail reading zero when it should be present indicates supply not running, open trace, or blown fuse — check upstream
- Rail reading low but nonzero suggests excessive load (possible short) or regulator in current limit
- Rail that measures correctly on DMM but circuit doesn't work suggests the problem is downstream, not the supply
- Rail that shows oscillation or ringing on scope during startup indicates possible instability — check compensation
- Multiple rails where one is missing and others are present suggests sequencing issue or fault on that specific supply
- **A regulator whose output voltage doesn't match the calculated value from the feedback resistor ratio** often shows up when the feedback divider's resistor values have drifted, when leakage current into the IC's feedback pin is significant relative to the divider current, or when the PCB has a parasitic resistance in the feedback path — the IC is regulating to the voltage it sees at its feedback pin, which differs from the voltage at the output.
