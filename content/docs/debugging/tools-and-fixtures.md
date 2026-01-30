---
title: "Tools & Fixtures for Debugging"
weight: 45
---

# Tools & Fixtures for Debugging

This page is about what you set up *before* the debug session begins — the physical fixtures, accessories, and habits that make debugging possible and safe. For how to actually use instruments and interpret readings, see the [Measurement & Test](/docs/measurement/) section.

## Current-Limited Power Supply

The single most important debugging fixture. A bench supply with adjustable current limiting catches shorts before they cascade into secondary damage.

**Basic procedure:** Set the voltage to the DUT's expected rail, then set the current limit to something reasonable — maybe 100–200 mA for a low-power board, or whatever the design's expected draw is plus a modest margin. Power on and watch the current reading *before you start probing*.

What the current reading tells you immediately:

- **Near zero** — board might not be drawing at all (open connection, protection circuit tripping, bad solder joint on power input)
- **Expected range** — good sign, proceed with debugging
- **Slammed against the current limit** — something is pulling hard. The supply is protecting the board. Don't raise the limit — investigate first
- **Slowly climbing** — thermal issue, latch-up in progress, or a component heating up and drawing more current as it warms

The current-limited supply turns a potential smoke event into useful diagnostic information. It's the difference between "I plugged it in and something popped" and "I plugged it in and it immediately drew 1.2 A on a board that should pull 80 mA."

## Inline Fuses & Sacrificial Protection

Even with a current-limited supply, there are situations where additional protection matters — especially when powering from wall adapters, batteries, or anything that can source serious current.

**Inline fuse holders** — A fuse holder in series with the power lead. Fast-blow fuses for sensitive circuits, slow-blow for anything with inrush (motors, big capacitors). Keep a few common values on hand (250 mA, 500 mA, 1 A, 2 A).

**Resettable polyfuses (PTCs)** — Useful for semi-permanent protection during development. They increase resistance when current exceeds the trip point, then reset when power is removed. Slower than a real fuse, but you don't have to replace them every time. Good for development boards; not a substitute for proper fusing in a final design.

**Sacrificial adapters** — A fused banana-to-barrel adapter, or a breakout cable with a fuse inline, protects both the DUT and the bench supply's output. Especially useful when you're powering something unfamiliar for the first time.

The goal is always the same: blow something cheap and replaceable instead of something expensive and soldered down.

## Series Resistor Tricks

A 10–100 Ω resistor in series with a power rail during first power-up of a new or repaired board. Simple, effective, and underused.

**What it does:**

- **Limits inrush current** — even if there's a dead short, the resistor caps the current to V/R. A 47 Ω resistor on a 5 V rail limits a hard short to about 100 mA
- **Provides a current-sense point** — measure the voltage drop across the resistor. Divide by resistance to get current. No need for a current clamp or breaking the circuit for a DMM
- **Buys time to react** — instead of instant damage, you get a warm resistor and a sagging rail. Plenty of time to notice and power down

**When to remove it:** Once you've confirmed the board powers up without excessive current draw and the basic functions work. The voltage drop across the resistor will sag the rail and may cause brownout resets or unreliable behavior in normal operation.

**When to leave it in:** If you're doing repeated power cycles during rework — keep it in until the repair is verified. The annoyance of a slightly sagging rail is nothing compared to burning a second component.

A ¼ W or ½ W resistor is usually fine for initial bring-up. If you need to pass more current through it, use a beefier resistor or reduce the resistance — but at that point you're probably past the "is it shorted?" phase.

**Dim bulb tester — the same idea at higher power:** For mains-powered equipment (home amplifiers, power supplies, tube gear), wire an incandescent light bulb in series with the AC input. If the circuit is healthy, the bulb glows dimly or not at all — the load draws normally and most of the voltage drops across the circuit. If there's a short, the bulb lights up fully and absorbs the fault current instead of the circuit. A 60–100 W bulb is typical for mains work. For 12 V car amplifiers, a 12 V automotive tail light or headlamp bulb does the same job. Same principle as the series resistor — a filament bulb is just a power resistor that gives you a visible indicator for free.

## Probing Fixtures

Hands-free access to circuit nodes makes debugging dramatically easier. Holding a probe in each hand while also trying to press a button or read a screen is a recipe for frustration and unreliable measurements.

**Clip leads and IC grabbers** — Alligator clips for larger connections, IC test clips (grabbers) for DIP and SOIC pins. Not great for high-frequency work, but fine for DC, low-speed logic, and power rails.

**Micro-hooks** — Smaller and more precise than IC grabbers. Good for individual pins, test points, and component leads. Can stay attached while you do other things.

**Scope ground springs** — The short ground spring that replaces the alligator clip ground lead on an oscilloscope probe. This matters for signal fidelity: the long ground lead forms a loop antenna that picks up noise and rings on fast edges. For anything above a few MHz, use the ground spring. The difference in measurement quality is dramatic.

**PCBite-style probing arms** — Magnetic-base articulating arms with spring-loaded probe tips. Set them on the board and walk away — they hold contact without your hands. Invaluable for monitoring multiple points simultaneously or for measurements that take a while to set up.

The common thread: anything that frees your hands and maintains stable contact with the circuit improves both measurement quality and your ability to think about what you're seeing.

## UART / Debug Header Habits

For embedded work, the cheapest and most reliable debug interface is a serial console. It works when JTAG won't connect, when the debugger is confused, and when you just need to see what the firmware is doing.

**Always break out UART TX/RX/GND** — On any custom board, bring these signals to a header or test pads. Even if you don't need them now, future-you will. Three signals, three pads — minimal board space.

**Header patterns:**

- **0.1" pin header** — The default. Easy to connect with Dupont jumper wires. 3-pin or 4-pin (add VCC if you want to power the adapter from the board)
- **Tag-Connect** — Pogo-pin footprint with no installed header. Saves board space, especially on small or dense designs. Needs the matching cable, but worth it for production and tight layouts

**USB-serial adapters** — Keep a few on hand. CP2102 or CH340-based adapters are cheap and well-supported. Know which one works with your OS without driver hassles. Label them if you have several (especially if some are 3.3 V and some are 5 V — connecting a 5 V adapter to a 3.3 V target is a bad day).

**Why serial console wins:** It's asynchronous, requires no special host software beyond a terminal emulator, survives firmware crashes (you see the last output before the crash), and works across every microcontroller family. When everything else is broken, serial still works.

## Known-Good Cables & Spares Box

A cable you haven't verified is a suspect, not a tool.

**Known-good cables** — Test your USB cables, barrel jack cables, SPI/I2C jumper wires, and scope probe cables. Label the ones that pass. When debugging, always reach for a known-good cable first. An intermittent cable will waste more of your time than almost any circuit fault.

**What to keep on hand:**

- USB cables (A-to-B, A-to-C, A-to-micro) — verified for both power and data
- Dupont jumper wires — a set of M-M, M-F, F-F in a few lengths
- Barrel jack adapters in common sizes (2.1 mm, 2.5 mm)
- Breadboard and a few common passives (resistors: 100 Ω, 1 kΩ, 10 kΩ, 100 kΩ; caps: 100 nF, 10 µF, 100 µF)
- Spare LEDs and current-limiting resistors for quick indicators
- A few spare voltage regulators (LM7805, AMS1117-3.3, or whatever you commonly use)

**Labeling matters** — A drawer full of unlabeled cables is a drawer full of suspects. Mark known-good cables with a bit of tape or a cable tag. Mark known-bad cables by throwing them away — a flaky cable in the spares box will eventually get used by accident.

The goal is to eliminate the test setup itself as a variable. When you trust your cables, adapters, and fixtures, you can focus on the actual circuit.
