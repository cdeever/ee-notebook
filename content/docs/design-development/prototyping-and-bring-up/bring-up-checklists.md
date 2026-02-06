---
title: "Bring-Up Checklists"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Bring-Up Checklists

The moment a new board arrives from fabrication and assembly is exciting — and dangerous. The urge to plug it in and see what happens is strong. But applying power without a systematic check risks damaging the board, destroying components, or masking problems that will be harder to find later. A bring-up checklist converts excitement into discipline. It does not slow things down; it prevents the kind of catastrophic failure that costs days of rework.

## Why Checklists Work

Bring-up is cognitively demanding. The operator is thinking about dozens of things simultaneously: power rails, clock signals, firmware, test equipment setup. Under cognitive load, people skip steps — not from laziness, but from distraction. A checklist externalizes the procedure so the brain can focus on interpreting results rather than remembering what to do next.

A checklist also creates a record. When a problem discovered on revision 3 was actually present on revision 1, the bring-up checklist from revision 1 shows whether that condition was tested — and what the result was. Without the record, it is all guesswork.

## Pre-Power Checklist

Before applying any power to the board:

**Visual inspection.** Examine the board under magnification (a stereo microscope is ideal, a loupe or magnifying glass works). The inspection targets:
- Solder bridges between IC pins, especially on fine-pitch packages
- Missing components (compare the board to the BOM or assembly drawing)
- Rotated or reversed components (polarized capacitors, ICs with pin 1 in the wrong corner, diodes backwards)
- Damaged components (cracked ceramic capacitors, bent IC leads, lifted pads)
- Flux residue that might be masking a problem
- Foreign debris (solder balls rolling around, wire clippings, conductive particles)

**Continuity checks.** With a multimeter in continuity mode:
- Check for shorts between power and ground on each supply rail. A short here means either a solder bridge, a reversed component, or a design error. Finding it now costs nothing; finding it after power-up costs a component (or the whole board).
- Check for expected connections: do all ground pins connect to ground? Do all VCC pins connect to VCC? A missing connection here means a bad solder joint or a fabrication defect.

**Short-circuit checks on power rails.** This deserves special emphasis. Every power rail should be checked for shorts to ground before power is applied. The expected resistance between a power rail and ground is typically a few hundred ohms to a few kilohms (from the load). A reading of zero ohms is a dead short — do not apply power. A very low reading (under 10 ohms) deserves investigation before proceeding.

Note: some components (tantalum capacitors, power MOSFETs) can show very low resistance in one direction during a continuity check. If a rail reads low, disconnecting suspicious components and testing again narrows down the cause.

## Power-On Sequence

The moment of first power is where [Safe Smoke Testing]({{< relref "/docs/design-development/prototyping-and-bring-up/safe-smoke-testing" >}}) applies. Assuming the smoke-test procedure has been followed:

1. **Apply power with current limiting.** Use a bench supply with the current limit set to slightly above the expected idle current. Watch the current reading.
2. **Bring up one rail at a time, if possible.** If the design has multiple power domains with independent enables, bring them up sequentially. This isolates problems to specific rails.
3. **Check voltage at the output of each regulator.** Not the input — the output. If the output is missing or wrong, stop and investigate before powering anything downstream.
4. **Check for unexpected heat.** After power is stable, feel every component by hand (if voltages are safe) or use a thermal camera. Anything warm that should not be warm indicates a problem — excess current, a short, or a reversed component.

## First Measurements

Once power is confirmed:

**Supply voltages.** Measure every supply rail at the IC power pins, not at the regulator output. Voltage drop along traces and through vias can cause the actual voltage at the IC to be lower than the regulator output. Record the values — they are useful for comparison on future revisions.

**Clock verification.** If the design includes a crystal oscillator or external clock:
- Is it running? Use an oscilloscope to check the output. A non-running oscillator is one of the most common bring-up failures.
- Is it at the right frequency? A frequency counter or the scope's measurement function confirms this.
- Is the waveform clean? Excessive overshoot, slow rise times, or amplitude that does not reach the expected level all indicate problems with load capacitors, trace layout, or component values.

**Communication check.** Can the MCU or FPGA be reached?
- Does JTAG or SWD connect? If the programmer cannot see the chip, check the debug connector wiring, the power supply to the chip, and whether the chip is held in reset.
- Does UART output appear? If the firmware has a serial console, check for output at the expected baud rate.
- Do I2C or SPI peripherals respond? A quick scan of the I2C bus (if the firmware supports it) confirms that peripherals are present and addressable.

## Functional Smoke Test

Once power and communication are confirmed, a basic functional test verifies that the major subsystems work:

- Toggle a GPIO and verify it on the scope.
- Read an ADC channel connected to a known voltage (or a voltage divider).
- Write to and read from external memory (EEPROM, flash, SRAM).
- Drive an output (LED, speaker, motor) and confirm the expected behavior.
- Exercise each communication interface with a loopback test or a known-good peripheral.

The functional smoke test is not a full validation — it is a quick pass to confirm that the major blocks are alive. Detailed characterization comes later, during [validation and verification]({{< relref "/docs/design-development/validation-and-verification" >}}).

## Recording Results

Every measurement and observation during bring-up should be recorded. The format does not matter — a lab notebook, a text file, a spreadsheet, even annotated photos. What matters is that the data exists and can be referenced later.

What to record:
- **Date and board identifier** (revision, serial number, or just "board 1 of 3").
- **Supply voltage measurements** at each rail, with load conditions.
- **Current consumption** (total and per-rail if sense resistors are present).
- **Clock frequency and waveform quality.**
- **Communication test results** (what connected, what did not).
- **Functional test results** (what passed, what failed, what was unexpected).
- **Anomalies** — anything surprising, even if it seems unimportant. "U3 is warmer than expected" might explain a failure discovered later.
- **Scope screenshots and photos.** Capture waveforms and board photos during bring-up. They are invaluable for comparison when things change on future revisions.

The bring-up record feeds directly into the [rev 2 list]({{< relref "/docs/design-development/prototyping-and-bring-up/capturing-early-lessons" >}}) — the running list of changes for the next board revision.

## A Template Checklist

Here is a starting checklist that can be adapted to any board:

**Pre-power:**
- [ ] Visual inspection under magnification — no solder bridges, missing parts, or reversed components
- [ ] Power rail to ground resistance: Rail 1 ____, Rail 2 ____, Rail 3 ____
- [ ] No unexpected shorts between any power rail and ground

**Power-on (current-limited):**
- [ ] Rail 1 voltage: expected ____ V, measured ____ V, current ____ mA
- [ ] Rail 2 voltage: expected ____ V, measured ____ V, current ____ mA
- [ ] Rail 3 voltage: expected ____ V, measured ____ V, current ____ mA
- [ ] Thermal check: all components at expected temperature

**First measurements:**
- [ ] Clock running: yes/no, frequency: ____
- [ ] Debug connection (JTAG/SWD): connected/not connected
- [ ] UART output: present/absent
- [ ] I2C/SPI peripherals responding: list ____

**Functional smoke test:**
- [ ] GPIO toggle verified
- [ ] ADC reading: expected ____, measured ____
- [ ] External memory read/write: pass/fail
- [ ] Output drive test: pass/fail

Customize this for each design. Add checks specific to the board's function — if it is an audio board, add a quick audio output test. If it is a motor controller, add a low-power motor spin test. The point is to have a list before starting, not to invent one on the fly.

## Tips

- Always check power rail-to-ground resistance before first power-on — this single step catches the majority of catastrophic bring-up failures
- Print the checklist on paper and fill it in by hand during bring-up; the physical act of checking a box prevents skipped steps under cognitive load
- Photograph the completed checklist alongside the board for a timestamped record of the bring-up session
- Start the rev 2 list during bring-up, not after — observations captured in the moment are far more accurate than those reconstructed from memory

## Caveats

- **Skipping visual inspection is the most expensive shortcut.** A reversed tantalum capacitor caught during visual inspection costs 5 minutes to fix — the same capacitor caught after power-up costs a replacement cap, possible trace damage, and an hour of investigation
- **"It worked on the last board" is not a checklist.** Each board is a new physical artifact with its own potential defects — run the checklist every time, even on boards from the same batch
- **Low-resistance readings on power rails are not always shorts.** Large capacitor banks, LED strings, and MOSFET gate charge can all show low resistance when measured with a multimeter — understanding the circuit before declaring a fault is essential
- **Non-running oscillators are extremely common.** Wrong load capacitors, excessive trace length, moisture absorption, or simply a defective crystal can all prevent startup — if the clock is not running, check the crystal circuit first
- **Communication failures are often power failures.** If JTAG will not connect, the most common cause is that the MCU does not have power — not that the JTAG wiring is wrong — check power first, always
