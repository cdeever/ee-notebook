---
title: "Sourcing & Sinking"
weight: 16
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Sourcing & Sinking

Every current path has two sides: something providing current and something accepting it. "Sourcing" and "sinking" describe which role a terminal plays. These terms appear constantly in datasheets and pin specifications, and misreading them leads to circuits that don't drive loads properly or exceed device ratings.

This distinction comes up repeatedly — in digital output circuits, LED drivers, power supplies, and bus interfaces. The mental model is simple and worth locking in early, because it applies everywhere current flows through a load.

## What Sourcing and Sinking Mean

- **Sourcing** — conventional current flows **out of** the pin or terminal into the external circuit. The pin is supplying current to the load.
- **Sinking** — conventional current flows **into** the pin or terminal from the external circuit. The pin is accepting current from the load.

Both terms describe the same current from different ends. The pin doing the sourcing pushes current out; the pin doing the sinking pulls current in.

## The Two Sides of Every Current Path

One component's sourcing is another component's sinking. The same current flows through the entire path — only the perspective changes.

Consider an LED connected to an output pin (a GPIO pin on a microcontroller, for example):

- **Output sourcing** — the pin drives HIGH, current flows from the pin through the LED to ground. The output sources, the ground pin sinks.
- **Output sinking** — the LED is connected between VCC and the pin, the pin drives LOW, current flows from VCC through the LED into the pin. The VCC rail sources, the output sinks.

The LED lights either way. The difference is which side of the LED connects to the active driver and which connects to the rail. This choice matters because source and sink current limits are often different.

## Where This Applies

The sourcing/sinking distinction appears across many areas of electronics. The examples below are previews — each topic is covered in detail in later sections.

- **Digital output pins** — some output types can both source and sink; others can only sink and rely on an external pull-up resistor for the source path.
- **LED driver circuits** — high-side drive (sourcing through the LED to ground) vs low-side drive (sinking through the LED from VCC). The choice depends on which direction the driver handles more current.
- **Open-drain and open-collector outputs** — output types that can only sink. The pull-up resistor and supply rail provide the source current.
- **Push-pull outputs** — can drive both directions, but source and sink capability may differ in strength and speed.
- **Op-amp outputs** — source current when driving a load toward the positive rail, sink current when driving toward the negative rail.
- **Power supply outputs** — source current in normal operation. A supply that can also sink current (absorb current forced back into it) is specifically noted in its datasheet because this is not the default behavior.

## Asymmetric Drive

Many outputs source and sink at different strengths. This asymmetry is normal and often dramatic.

Some logic families have extreme asymmetry. Standard TTL (a logic family covered in Digital Electronics) sinks up to 16 mA but sources only about 400 uA — a 40:1 ratio, which is why TTL-era designs almost always sink current through loads. CMOS outputs are more symmetric but still not perfectly balanced.

Datasheets specify these limits separately:

- **I_OH** — maximum output current when driving HIGH (source current)
- **I_OL** — maximum output current when driving LOW (sink current)

The weaker direction often determines how the load gets connected. If a device sinks 20 mA but only sources 4 mA, an LED drawing 10 mA must be connected in the sinking configuration.

## Tips

- **Always check both I_OH and I_OL** — they are often dramatically different, and the weaker direction constrains the circuit topology.
- **Sinking LED configurations often allow higher current** — many digital outputs sink better than they source, making low-side LED drive the safer default.
- **Open-drain outputs can only sink** — open-drain is an output type (covered in Digital Electronics) where the pull-up resistor and supply rail provide the source path. Forgetting the pull-up leaves the line floating when the output is off.
- **When multiple loads share one output, sum total source or sink current against the datasheet limit for that direction** — ten LEDs at 2 mA each is 20 mA total, which may exceed the per-pin or per-port limit even if each individual load seems small.

## Caveats

- **"Source" in source/sink is unrelated to "source" as a MOSFET terminal** — context determines meaning. A MOSFET's source terminal can be either sourcing or sinking current depending on the circuit. The naming overlap is unfortunate but universal.
- **Exceeding source/sink limits doesn't always cause immediate failure** — the device may still function, but noise margins (explored in Digital Electronics) degrade silently, leading to intermittent errors that are difficult to diagnose.
- **Some datasheets specify "output current" without clarifying direction** — check the test circuit diagram or the sign convention used. A positive value for I_OL typically means current flowing into the pin (sinking), but conventions vary between manufacturers.

## In Practice

**An output HIGH voltage that sags below the expected level under load** indicates the source current limit has been reached. The voltage drop is visible on a multimeter or oscilloscope as a HIGH level that falls short of the rail voltage, proportional to the excess current demand.

**An output LOW voltage that rises above the expected level** indicates the sink current limit has been reached. If the voltage rises far enough, it enters the undefined region between valid LOW and valid HIGH, where downstream logic may interpret the level unpredictably.

**Asymmetric rise and fall times on a digital output** directly reflect source vs sink drive strength differences — the faster edge corresponds to the stronger driver. Open-drain bus protocols (such as I2C, covered in Digital Electronics) make this especially visible: the falling edge is fast (active transistor sinking current) while the rising edge is slow (passive pull-up resistor sourcing current through the bus capacitance).
