---
title: "GPIO"
weight: 10
---

# GPIO

General-Purpose Input/Output is the most fundamental peripheral on any microcontroller. Every GPIO pin is a configurable digital interface between firmware and the outside world — a bridge between register writes and voltage levels on a physical pin. Understanding GPIO means understanding not just the software abstraction, but the electrical behavior: what currents flow, what voltage levels appear, and what happens when assumptions are wrong.

## Output Modes

GPIO outputs come in two fundamental configurations, and picking the wrong one is a common source of confusion.

### Push-Pull

The default output mode on most MCUs. A push-pull output has two active transistors: one pulls the pin HIGH (toward VDD), the other pulls it LOW (toward GND). The pin actively drives both states, which means fast transitions and low output impedance in either direction.

Push-pull is the right choice for most digital outputs — driving LEDs, chip select lines, clock signals, and anything where the MCU is the sole driver of the wire. Both edges are fast and symmetric, and the output impedance is low in both states (typically tens of ohms).

### Open-Drain

An open-drain output has only the pull-LOW transistor. When the output is HIGH, the transistor turns off and the pin floats — an external pull-up resistor (to whatever voltage you choose) provides the HIGH level.

Open-drain is essential for two situations: **wired-OR buses** (like I2C, where multiple devices share a line and any device can pull it LOW) and **level shifting** (the pull-up connects to a different voltage than the MCU supply, so a 3.3 V MCU can drive a 5 V bus). The downside is asymmetric edge rates — pulling LOW is fast (active transistor), but the rising edge depends on the pull-up resistor and bus capacitance. Sizing that pull-up is always a tradeoff between rise time and current consumption.

A common mistake is configuring a pin as open-drain and expecting it to drive HIGH without an external pull-up. The pin floats when "high" — it does not source any current. If the receiving device does not have its own pull-up, the line stays at an indeterminate voltage. The STM32 I2C peripheral, for example, requires open-drain mode on its SDA and SCL pins, and the bus needs external pull-up resistors (typically 2.2-4.7 kohm to 3.3 V) to function.

## Input Modes

Configuring a GPIO pin as an input determines what the MCU reads — but also what electrical behavior the pin exhibits when nothing is actively driving it.

### Floating Inputs

A pin configured as input with no pull resistor is "floating" — its voltage is determined entirely by whatever is connected externally. If nothing is connected, the voltage is indeterminate. On a CMOS input, this is genuinely dangerous: the input may sit at mid-supply, where the input buffer's PMOS and NMOS transistors both partially conduct, drawing excessive current and creating noise sensitivity. A floating input can also pick up radiated interference and toggle rapidly, causing unexpected interrupts or peripheral behavior.

### Pull-Up and Pull-Down

Internal pull resistors (typically 20-50 kohm, though the exact value varies and is often poorly specified) bias an undriven input to a known state. Pull-ups bias to VDD, pull-downs bias to GND. These are weak pulls — they define the idle state, but any external driver can easily override them.

Use pull-ups for active-low buttons, open-drain buses, and any input that should default HIGH. Use pull-downs for active-high signals that should default LOW when disconnected.

When in doubt about the pull value, check the datasheet — the tolerance on internal pulls can be wide (30-70 kohm on some STM32 parts), which matters if you are counting on a specific voltage divider ratio. For buttons and switches, internal pulls are usually adequate. For bus termination or precise biasing, external resistors with known values are more reliable.

### Floating vs Pull-Up vs Pull-Down

{{< graphviz >}}
digraph gpio_input_modes {
  rankdir=TB
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]
  graph [fontname="Helvetica" fontsize=12]

  subgraph cluster_floating {
    label="Floating Input"
    labeljust=c
    style="rounded,dashed"
    color="#888888"
    fontcolor="#cccccc"

    vdd_f [label="VDD" shape=none fontcolor="#999999"]
    pin_f [label="MCU Pin" shape=box style="rounded,filled" fillcolor="#5a3e3e" fontcolor="#e8e8e8" color="#aa6666"]
    gnd_f [label="GND" shape=none fontcolor="#999999"]
    noise_f [label="?" shape=diamond style="filled" fillcolor="#884444" fontcolor="#e8e8e8" color="#aa4444" width=0.5 height=0.5]

    vdd_f -> pin_f [style=invis]
    pin_f -> gnd_f [style=invis]
    noise_f -> pin_f [label="noise\npickup" style=dashed color="#aa6666" fontcolor="#cc8888"]
  }

  subgraph cluster_pullup {
    label="Pull-Up (Default HIGH)"
    labeljust=c
    style="rounded"
    color="#888888"
    fontcolor="#cccccc"

    vdd_pu [label="VDD" shape=none fontcolor="#999999"]
    r_pu [label="R" shape=box style="filled" fillcolor="#3e5a3e" fontcolor="#e8e8e8" color="#66aa66" width=0.5 height=0.4]
    pin_pu [label="MCU Pin\n= HIGH" shape=box style="rounded,filled" fillcolor="#3e5a3e" fontcolor="#e8e8e8" color="#66aa66"]
    gnd_pu [label="GND" shape=none fontcolor="#999999"]

    vdd_pu -> r_pu [label="  " color="#66aa66"]
    r_pu -> pin_pu [label="weak pull\nto VDD  " color="#66aa66" fontcolor="#88cc88"]
    pin_pu -> gnd_pu [style=invis]
  }

  subgraph cluster_pulldown {
    label="Pull-Down (Default LOW)"
    labeljust=c
    style="rounded"
    color="#888888"
    fontcolor="#cccccc"

    vdd_pd [label="VDD" shape=none fontcolor="#999999"]
    pin_pd [label="MCU Pin\n= LOW" shape=box style="rounded,filled" fillcolor="#3e3e5a" fontcolor="#e8e8e8" color="#6666aa"]
    r_pd [label="R" shape=box style="filled" fillcolor="#3e3e5a" fontcolor="#e8e8e8" color="#6666aa" width=0.5 height=0.4]
    gnd_pd [label="GND" shape=none fontcolor="#999999"]

    vdd_pd -> pin_pd [style=invis]
    pin_pd -> r_pd [label="weak pull\nto GND  " color="#6666aa" fontcolor="#8888cc"]
    r_pd -> gnd_pd [label="  " color="#6666aa"]
  }
}
{{< /graphviz >}}

The floating input (left) has no defined path to either rail — noise and coupling determine the pin voltage. With a pull-up (center), the resistor biases the pin to VDD when nothing else drives it. With a pull-down (right), the resistor biases to GND. An external driver can easily override either pull resistor because the pull is weak (high resistance, low current).

### When Do You Need a Pull Resistor?

The core question is: **is there ever a moment when nothing actively drives the pin?** If yes, you need a pull resistor to define the voltage during that moment. If the pin is always driven by a push-pull output, you don't.

**Buttons and switches.** A mechanical switch connects the pin to a rail when pressed, but when released, nothing drives the pin. You need a pull resistor to define the unpressed state. A pull-up to VDD with the switch connecting to GND is the most common arrangement (active-low button). The MCU reads HIGH when idle, LOW when pressed.

**Open-drain and open-collector buses.** I2C is the classic example. The bus drivers can only pull the line LOW — nothing actively drives it HIGH. A pull-up resistor provides the HIGH level. Without it, the bus never goes HIGH and communication fails. The same applies to any open-drain interrupt output, wire-OR signal, or 1-Wire bus.

**Unused inputs.** Any MCU input pin that isn't connected to anything needs to be tied to a defined state. Either enable an internal pull or connect an external resistor. Leaving it floating wastes power and can cause erratic behavior.

**Signals with tri-state or high-impedance intervals.** A shared data bus where multiple devices take turns driving has moments when no device is driving. Pull resistors (or bus holders) keep the lines at a defined level during the transition between drivers.

**When you don't need one:** If a push-pull output drives the pin continuously — like an MCU's push-pull GPIO driving an LED, or an SPI MOSI line connected to a single peripheral — the output actively drives both HIGH and LOW. Adding a pull resistor to a push-pull driven line wastes current and serves no purpose.

### Internal vs External Pull Resistors

Most modern MCUs have configurable internal pull-up and pull-down resistors on GPIO pins. Whether to use them or add external resistors depends on the situation.

**Internal pulls are fine for:**
- Buttons and switches (the exact pull value doesn't matter much)
- Unused pins (just need a defined state)
- Low-speed signals where pull strength isn't critical

**Use external resistors when:**
- The protocol specifies a pull value — I2C requires pull-ups sized for the bus capacitance and speed (typically 2.2-4.7 kohm). Internal pulls at 30-50 kohm are far too weak for I2C and will cause communication failures or slow, rounded edges.
- You need a known, precise value — internal pull tolerances are wide (sometimes 30-70 kohm range). If you're forming a voltage divider or need a specific time constant, use a discrete resistor.
- The pin must be defined before the MCU boots — internal pulls are only active after firmware configures them. Between power-on and GPIO initialization, pins are floating. If a floating pin during startup could cause harm (enabling a power FET, activating a relay, driving a motor), an external pull resistor is the only safe option.
- You need a stronger pull — internal pulls are intentionally weak. For noisy environments, long traces, or high-capacitance lines, a stronger external pull (1-10 kohm) provides better noise immunity and faster edges.

**How to find out if a device has internal pulls:** The GPIO chapter of the MCU's reference manual will describe the input configuration options. Look for register fields named PUPD, PUE/PDE, or similar. The electrical characteristics table lists the pull resistance range. Not every MCU has both pull-up and pull-down — some only offer pull-ups. Some older MCUs have no configurable pulls at all.

For external devices (sensors, transceivers, EEPROMs), check the datasheet's application circuit. If it shows a resistor on a signal line, that's a pull resistor you need to provide. The datasheet may also specify whether the device has an internal pull enabled by default — but relying on undocumented internal pulls in external ICs is risky; when in doubt, add the resistor.

## Drive Strength

GPIO pins have limited current capability. Typical MCU pins can source or sink 2-20 mA, depending on the device and the pin. The absolute maximum rating in the datasheet is not a design target — it is the point beyond which damage may occur. Design to stay well below it.

Exceeding drive strength does not immediately destroy the pin (usually). What happens first is that the output voltage sags: a pin trying to source 20 mA into a heavy load may only reach 2.5 V instead of 3.3 V, which may not register as a valid HIGH at the receiving end. The datasheet specifies V_OH at a given load current — that is the guaranteed output level under rated conditions.

Some MCUs (STM32, nRF52, many others) allow configuring drive strength per pin, typically in two or four steps. Higher drive strength means faster edges into capacitive loads, but also more supply noise and higher EMI. Only increase drive strength when you actually need it.

There is also a total port current limit — the sum of all pin currents on a given GPIO port (or across the entire MCU) must not exceed a specified maximum. Sourcing 10 mA per pin on 16 pins simultaneously may exceed the chip's package thermal limit, even if each individual pin is within its rated current. The "absolute maximum" table in the datasheet lists both per-pin and total device limits.

## Alternate Functions and Pin Multiplexing

MCU pins are multiplexed — each physical pin can serve as GPIO or as a peripheral function (UART TX, SPI clock, timer output, ADC input). The selection is made through multiplexer registers, often called "alternate function" or "pin mux" configuration.

**Only one function at a time.** If a pin is assigned to UART TX, it is no longer available as GPIO. The mux is configured in registers, and getting it wrong is one of the most common bring-up mistakes: everything compiles, the peripheral is configured correctly, but nothing appears on the pin because the mux is still set to GPIO. On STM32, the alternate function is selected through GPIOx_AFRL and GPIOx_AFRH registers, with each pin mapped to one of 16 alternate functions (AF0-AF15). Other MCU families use similar mechanisms with different naming.

**Not every peripheral can use every pin.** The pin assignment table in the datasheet (or reference manual) is essential. On many MCUs, UART1 TX can only appear on two or three specific pins, and one of those might conflict with SPI2 CLK. Planning the pinout before writing firmware saves painful rework. Some modern MCUs (like the RP2040) have more flexible muxing, but even they have constraints.

## Speed and Slew Rate

Edge rate matters more than most firmware engineers realize. Many MCUs let you configure the slew rate — how quickly the output transitions between LOW and HIGH. Faster edges mean sharper timing margins and cleaner digital signals, but they also radiate more electromagnetic energy and couple more noise into adjacent traces.

The practical impact: on a board with sensitive analog signals nearby, setting every GPIO to maximum speed is asking for noise trouble. Use the slowest slew rate that meets your timing requirements. For an LED toggle at human-visible rates, the slowest setting is more than adequate. For an SPI clock at 10 MHz, you need faster edges to produce clean transitions within the bit period. The STM32 documentation labels these as "low," "medium," "high," and "very high" speed settings, but what they actually control is the output driver's slew rate. Other MCU families use similar concepts with different naming. The connection between slew rate and EMI is covered in more detail in [Signal Integrity Basics]({{< relref "/docs/digital/data-transfer-and-buses/signal-integrity-basics" >}}).

## Read-Modify-Write Hazards

GPIO port registers are typically shared across multiple pins — one 32-bit register controls all 16 or 32 pins of a port. A read-modify-write (RMW) sequence to change one pin's state involves reading the whole register, modifying the target bit, and writing the whole register back.

If an interrupt fires between the read and the write, and the ISR modifies a different pin on the same port, the main code's write will overwrite the ISR's change. This is a classic concurrency bug, and it is subtle because it happens only when the interrupt timing aligns with the RMW window.

**Solutions:**
- **Bit-banding** (Cortex-M3/M4): Maps each bit to a unique word address, making single-bit writes atomic
- **Set/Clear registers** (BSRR on STM32, SET/CLR on many others): Writing a 1 to the SET register sets that pin; writing to the CLR register clears it. No read needed, so no race condition
- **Critical sections**: Disabling interrupts around the RMW sequence works but adds latency

Always prefer set/clear registers or bit-banding when available. The RMW pattern with port registers is a trap that works fine in testing and fails intermittently in the field.

## Electrical Reality

GPIO pins operate in a physical world of voltage levels, capacitance, and protection structures. The datasheet's electrical characteristics table is where the real pin behavior is defined — not the register description.

**Voltage tolerance:** A 3.3 V MCU pin driven to 5 V will forward-bias the internal ESD protection diode to VDD, injecting current into the supply rail. Some pins are explicitly 5 V tolerant (the ESD diode is clamped differently), but many are not. Check the datasheet — "5V tolerant" is a specific, per-pin specification, not a general property of the MCU. See [Logic Families]({{< relref "/docs/digital/logic-foundations/logic-families" >}}) for more on voltage level compatibility between devices.

**Input impedance and parasitic capacitance:** CMOS inputs draw essentially no DC current (picoamps), but each pin has a few picofarads of capacitance to ground. At high frequencies, this capacitance matters — it slows edges and adds loading to buses. When multiple MCU pins connect to a shared bus, the total parasitic capacitance can become significant.

**ESD protection:** Every MCU pin has internal ESD protection diodes, typically clamping to VDD and GND. These protect against brief static discharge events (the Human Body Model specifies a 2 kV pulse through 1500 ohm — a few amps for a few nanoseconds) but are not designed to handle sustained overvoltage or significant current. External protection (TVS diodes, series resistors) is needed for pins exposed to the outside world — connectors, cables, and anything a human might touch.

**GPIO after reset:** On most MCUs, all GPIO pins default to input mode with no pull resistors after reset. This means every pin is floating until firmware configures it. During the brief window between reset and initialization, external circuits must tolerate floating MCU pins. If a pin drives a power FET gate, for example, a floating input could turn the FET on uncontrollably during startup. External pull resistors on critical pins solve this — do not rely on firmware reaching the GPIO init code quickly enough.

## Gotchas

- **Floating inputs cause real problems** — An unconfigured or disconnected CMOS input does not just read an undefined value. It can oscillate, draw excess current, trigger spurious interrupts, and inject noise into adjacent pins. Always configure unused pins as outputs driven LOW, or as inputs with a pull resistor enabled
- **Read-modify-write races are silent** — The RMW hazard on port registers produces intermittent glitches that are nearly impossible to catch in testing. The bug manifests as a pin briefly flickering to the wrong state under heavy interrupt load. Use set/clear registers from the start, not after debugging for three days
- **Alternate function conflicts are a design-time problem** — Two peripherals that need the same pin cannot coexist. This is not a firmware bug — it is a pinout planning failure. Check the pin mux table before committing to a schematic, not after the board is fabricated
- **Drive strength affects signal integrity** — Setting all pins to maximum drive strength creates fast edges that ring on long traces and couple into adjacent signals. Use the minimum drive strength that meets your timing requirements, especially on dense boards with mixed analog and digital signals
- **Internal pull resistors have wide tolerances** — The datasheet may specify a pull-up of "20-50 kohm." If your circuit depends on a precise pull value (for instance, forming a voltage divider with a sensor output), use an external resistor with a known value instead
- **ESD protection diodes are not voltage clamps** — The internal diodes protect against brief transients, not sustained overvoltage. Connecting a 5 V signal to a non-tolerant 3.3 V pin will forward-bias the ESD diode continuously, injecting current into VDD and potentially damaging the MCU or corrupting other peripherals sharing that supply rail
