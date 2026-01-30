---
title: "Is Voltage Present?"
weight: 10
---

# Is Voltage Present?

First check at power-up. Before anything else, confirm the rail exists. A missing rail explains a lot of downstream weirdness, and it takes ten seconds to check.

## DMM: DC Voltage Check

**Tool:** DMM (any general-purpose multimeter)
**Mode:** V⎓ (DC Volts)
**Probes:** Red to rail, black to GND (parallel measurement)

### Procedure

1. Set DMM to V⎓, auto-range
2. Probe the rail test point (or component lead) vs. ground
3. Compare reading to schematic expected value

### What You Learn

- Rail is present and approximately correct → move on to downstream checks
- Rail is zero → supply isn't running, trace is open, or fuse is blown
- Rail is low but nonzero → possible short loading it down, or regulator not regulating

### Gotchas

- DMM averages the reading — it won't reveal transient dropout or brief power cycling
- High-impedance nodes can show "ghost voltages" from capacitive coupling. If the reading seems wrong, try loading the node lightly or switching to a lower impedance range
- Auto-range can be slow on unstable or oscillating rails; manual range is faster if you know what to expect
- Make sure you're on the right ground — checking a 3.3V rail against the wrong ground reference gives a meaningless number

## Oscilloscope: Quick DC Check

**Tool:** Oscilloscope, DC-coupled, 1x or 10x probe
**Trigger:** Auto (free-running), DC coupling

### When to Use Instead of DMM

- You need to see startup behavior (does the rail come up clean or oscillate?)
- You suspect intermittent dropout
- You want to see AC riding on the DC (ripple, noise, oscillation)
- Multiple rails and you want to watch them simultaneously on different channels

### Procedure

1. DC-couple the channel, set vertical scale to show the expected voltage (e.g., 1V/div for a 3.3V rail)
2. Set timebase depending on what you're looking for:
   - Startup: 100 ms/div or slower
   - Steady-state presence: 1 ms/div is fine
3. Probe the rail vs. ground
4. Confirm the DC level matches expectations

### What You Learn

- DC level plus any visible AC content
- Startup waveform shape — does it ramp up cleanly or ring?
- Whether the rail is truly stable or wobbling

### Gotchas

- At 10x probe attenuation, small voltages can be hard to read — consider 1x if the rail is low-voltage and low-frequency content is all you need
- Scope vertical accuracy is typically 3–5%, worse than a DMM for absolute voltage. Use the scope for waveform shape and the DMM for accurate DC value
- Make sure the probe ground clip is on a solid ground point, not a signal pin — scope grounds are earth-referenced and will short things out if connected wrong
