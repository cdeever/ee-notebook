---
title: "Safe Smoke Testing"
weight: 50
---

# Safe Smoke Testing

"The smoke test" is the first time power is applied to a new board. The name comes from the worst-case outcome: if something is wrong — a short, a reversed component, a design error — the result might be smoke, damaged components, or both. The goal of safe smoke testing is to make this first power-on as controlled and informative as possible, limiting the damage if something is wrong and capturing useful data regardless of the outcome.

## The Current-Limited Power Supply

A current-limited bench power supply is the single most important tool for first power-on. Unlike a wall adapter or battery, a bench supply lets you set a maximum current that the supply will deliver. If the board tries to draw more than this limit, the supply drops its voltage to maintain the current ceiling — the board gets less voltage, but it doesn't get unlimited current to burn through traces and destroy components.

**Setting the current limit:**
- Calculate the expected board current at idle (no load, all regulators running, MCU in reset or low-power mode). This is typically in the tens to hundreds of milliamps for most small designs.
- Set the current limit to 1.5x to 2x the expected idle current. This provides enough margin for normal inrush current (capacitor charging) while limiting fault current.
- If you don't know the expected current, start with a low limit (50-100 mA) and increase gradually.

**What the current reading tells you:**
- Current within expectations: the board is probably OK. Proceed to voltage measurements.
- Current at the limit (voltage sagging): something is drawing too much. Reduce the current limit, investigate.
- Current much lower than expected: something isn't powered. A regulator may not be starting, or a key component may be disconnected.
- Current reading of zero: the board isn't connected, or a fuse has blown, or the input polarity protection is blocking reverse voltage.

## The Ramp-Up Approach

For boards you're uncertain about, or for high-power designs where a fault could be destructive:

1. **Start at zero volts.** Set the bench supply to 0V with the current limit set low.
2. **Increase voltage slowly.** Turn the voltage up in steps — 0.5V, 1V, 2V — pausing at each step to observe the current reading.
3. **Watch for discontinuities.** Current should increase smoothly as voltage rises (capacitors charging, regulator quiescent current increasing). A sudden jump in current at a specific voltage often indicates a component's breakdown voltage being reached — which shouldn't happen during normal ramp-up.
4. **Stop at the operating voltage.** Once the supply voltage reaches the design's nominal input voltage, let the current stabilize and compare it to expectations.

This approach is especially valuable for designs with multiple voltage regulators that cascade (a 12V input feeds a 5V regulator, which feeds a 3.3V regulator). As you ramp the input, each regulator comes online in sequence, and you can observe each one starting up.

## Bench Supply vs Battery vs Wall Adapter

The choice of power source for first power-on matters:

**Bench power supply (preferred):**
- Adjustable voltage and current limit
- Real-time voltage and current display
- Can be turned off instantly
- Provides diagnostic information (current draw) during bring-up

**Battery:**
- No current limiting — a shorted board draws whatever the battery can provide, which for lithium batteries is many amps
- No easy way to ramp up slowly
- Useful after the board has been verified on a bench supply, for testing battery-specific behavior (dropout, battery-level sensing)

**Wall adapter / USB power:**
- Limited current (USB ports provide 500 mA or more; wall adapters vary)
- No voltage adjustment
- No real-time current monitoring
- Acceptable for simple boards after bench supply verification, but not for first power-on

The bench supply is the right tool for first power-on, every time. After the board has been verified, it can be powered from its intended source.

## What to Watch For

During the first few seconds of power-on:

- **Current spike at turn-on.** A brief current spike (milliseconds) as input capacitors charge is normal. The current should then settle to a steady-state value. If the spike doesn't settle — current stays high — something is drawing continuous excess current.
- **Current that keeps climbing.** A slow upward drift in current suggests thermal runaway: a component is heating up, its resistance is dropping, it draws more current, it heats up more. This is most common with BJTs and with components that are marginally within their operating range.
- **Voltage that doesn't reach target.** If the supply is in current limiting (voltage below the set point), the board is trying to draw more current than allowed. This might be a fault, or the current limit might be set too low. Investigate before increasing the limit.
- **Oscillation.** Some regulators oscillate when their output capacitor is wrong or missing. You'll see the voltage and current fluctuating rapidly. This appears on the bench supply as a flickering voltage or current reading. Check with an oscilloscope for confirmation.
- **Audible noise.** Whining, buzzing, or clicking from inductors or capacitors indicates oscillation, unstable regulation, or excessive ripple current. The board may still function, but the power supply isn't operating as designed.

## Protective Measures on the Board

Safe smoke testing is easier when the board itself has been designed with protection in mind:

- **Polarity protection.** A series diode or reverse-polarity MOSFET on the power input prevents damage from reversed connections. The voltage drop of a diode (0.3-0.7V) is worth the protection during development.
- **Fuses.** A fuse on the power input limits fault current to the fuse rating. Fuses are slow (they take time to blow), so they don't protect against short transients, but they prevent sustained high-current faults from destroying traces. PTC (resettable) fuses are useful during development because they reset after the fault is removed.
- **Current sense resistors.** Small-value resistors in series with power rails allow current measurement without breaking the circuit. Monitoring the voltage across these resistors during bring-up provides per-rail current data.
- **Load switches with enable control.** Power distribution through load switches or enable-controlled regulators lets you bring up sections of the board independently. This isolates faults to specific subsystems.

See [Design for Test]({{< relref "/docs/design-development/schematic-design/design-for-test" >}}) for guidance on building these features into the design from the start.

## When Something Does Smoke

Despite precautions, sometimes a component fails. The response procedure:

1. **Disconnect power immediately.** Turn off the bench supply. Don't try to diagnose while the board is still powered.
2. **Identify the failed component.** Look for visual damage: charred marks, cracked packages, discolored PCB. Smell can also be diagnostic — burnt resin smells different from burnt silicon.
3. **Analyze why.** Was the component reversed? Was it overloaded? Did a design error put the wrong voltage on it? Is the footprint wrong, connecting the wrong pins? Understanding the cause is more important than replacing the component — if you don't understand the failure, the replacement will fail too.
4. **Check for collateral damage.** A failed component may have stressed others. If a regulator shorted, the downstream ICs may have been exposed to the unregulated input voltage. If a capacitor failed short, the components sharing its power rail may have been current-starved.
5. **Fix and retest.** Replace the failed component (if possible — some PCB damage is not repairable), fix the root cause, and start the smoke test procedure from the beginning.

Do not apply power again until you understand what failed and why. "Maybe it was just a bad component" is rarely the correct explanation.

## The "Leave It On Overnight" Test

After the initial bring-up validates basic functionality, a thermal soak test reveals marginal issues:

- Power the board at its normal operating conditions.
- Leave it running for 8-24 hours.
- Check it periodically (or continuously, with data logging) for: voltage drift, increased current draw, increased temperature, communication errors, or output degradation.

Components that are marginally within their operating range — a regulator running near its thermal limit, a capacitor with too little voltage margin, a solder joint that's barely making contact — will fail during an extended test. Finding these issues in a controlled test is far better than finding them in the field.

A simple version of this test is to leave the board running on your bench while you do other work, glancing at it occasionally. A more rigorous version uses automated monitoring: log supply current, board temperature, and key output parameters over time.

## Gotchas

- **Current limit set too low prevents startup.** Switching regulators and MCUs with large decoupling capacitance need a brief inrush current that may exceed the idle current by 5-10x. If the current limit is too aggressive, the board will never start. Increase the limit and watch the transient.
- **Wall adapters can deliver destructive fault current.** A 12V / 2A wall adapter will happily deliver 2A into a shorted board, which is enough to vaporize a thin trace. Never use a wall adapter for first power-on.
- **Smoke doesn't always mean the board is dead.** Sometimes only one component fails, and the rest of the board is fine. A careful diagnosis before declaring the board dead can save a week of waiting for a new PCB.
- **Not all failures produce smoke.** A reversed zener diode might quietly clamp a signal to the wrong voltage. A misplaced feedback resistor might set a regulator to 4.2V instead of 3.3V. Silent failures are harder to find than dramatic ones.
- **Current-limited supplies can cause confusing behavior.** If the supply is in current limiting during operation, the board is getting less voltage than expected, which can cause erratic behavior that looks like a firmware bug or a design error. Always check whether the supply is in regulation before investigating other issues.
- **First power-on anxiety is normal.** Every experienced engineer feels it. The checklist is what converts anxiety into a productive procedure.
