---
title: "Problem Definition vs Solution Bias"
weight: 10
---

# Problem Definition vs Solution Bias

The single most common failure mode in electronics projects isn't a bad solder joint or a wrong footprint — it's building the wrong thing. Solution bias is the tendency to jump to a specific circuit, component, or architecture before the problem is clearly understood. It feels productive because you're "making progress," but the progress is in a direction you haven't verified.

## The Pull Toward Solutions

Solution bias is natural. If you've just learned about a new microcontroller, every project looks like an MCU application. If you recently built a successful buck converter, the next power supply design starts with a buck topology before you've even characterized the load. The brain pattern-matches from experience, and experience creates preferences that feel like analysis.

The symptoms are recognizable once you know what to look for:

- **Choosing an MCU before defining the task.** "I'll use an ESP32" before asking what processing, I/O count, or power budget the project actually requires.
- **Designing a power supply before knowing the load.** Selecting a regulator topology without understanding the current profile, transient requirements, or input voltage range.
- **Picking a communication protocol before defining the data.** Deciding on I2C or SPI before knowing data rates, cable lengths, or noise environment.
- **Selecting an enclosure before defining the electronics.** Committing to a form factor before understanding thermal, connector, or assembly requirements.

Each of these represents a decision made in the absence of the information needed to make it well.

## Problem Statements vs Solution Statements

A useful test: can you describe your project without naming any components, protocols, or specific technologies? If not, you may be defining the solution, not the problem.

| Solution statement | Problem statement |
|---|---|
| "I need an ESP32 with a BME280 sensor" | "I need to monitor temperature and humidity in a greenhouse and alert me when conditions drift" |
| "I'll build a Class D amplifier" | "I need to drive a small speaker from a battery with minimal heat" |
| "I want to use LoRa for communication" | "I need to send sensor data 500 meters across a farm with no available power or network" |
| "I'll design a 5V buck converter" | "I need a stable low-noise supply for an ADC, sourced from a 12V battery" |

The problem statements leave room for exploration. The solution statements foreclose options before they've been evaluated.

## Techniques for Staying in the Problem Space

Staying in the problem space takes deliberate effort. A few practices I've found helpful:

- **Write the requirements before opening the schematic editor.** Even a rough bulleted list forces you to articulate what the system must do. It's surprisingly hard, and the difficulty is the point — it reveals what you don't yet understand.
- **Ask "what does success look like?" before "how do I build it?"** Define the acceptance criteria first. What measurements would confirm the project works? What would cause you to declare it a failure?
- **Sketch use cases, not circuits.** Before drawing a block diagram, describe how the device will be used. Who interacts with it? What happens when it's powered on? What happens when it fails?
- **Challenge your first instinct.** If your immediate reaction is "I'll use component X," ask what led to that choice. Is it the best fit, or just the most familiar?
- **Talk to someone who doesn't know electronics.** Explaining the project to a non-engineer forces you to describe the problem in terms of needs, not solutions.

## When Solution Bias Is Actually OK

Solution bias isn't always wrong. There are situations where jumping to a known solution is efficient and appropriate:

- **Proven reference designs.** If a chip vendor provides a reference design that matches your requirements, using it isn't bias — it's engineering. The evaluation has been done by the vendor's application engineers.
- **Well-established patterns.** Using a linear regulator for a low-current, low-dropout application isn't bias; it's applying a well-understood solution to a well-understood problem.
- **Learning projects.** If the purpose of the project is to learn how a specific component or topology works, then choosing that component first is the point. The "problem" is education, and the "solution" is the thing you want to learn about.
- **Time-critical projects.** Sometimes you need something working by Friday. In that case, reaching for a known-good solution is pragmatic, not lazy.

The key distinction is awareness. Solution bias is harmful when it's unconscious — when you think you're making an informed decision but you're actually just defaulting to familiarity.

## Real Examples of Requirement Failures

A few patterns I've seen or experienced where poor problem definition led to wasted effort:

**The over-specified sensor node.** A project to monitor soil moisture started with the selection of a 32-bit ARM Cortex-M4 MCU with Bluetooth, Wi-Fi, and a full LCD display. The actual requirement was to read one analog sensor once per hour and transmit the value to a base station. An ATtiny with a simple radio module would have met every requirement at a fraction of the cost, power, and complexity. The problem was never stated — only a solution was imagined.

**The unnecessary custom board.** A team spent three months designing a custom data acquisition board when an off-the-shelf USB DAQ would have met every requirement. The "need" for a custom board was never questioned — it was simply assumed because the team had PCB design capability.

**The wrong power architecture.** A portable instrument was designed around a switching regulator for efficiency, but the noise it introduced into the analog measurement path made the instrument fail its accuracy specification. The actual requirement — low-noise power for a sensitive analog front end — pointed toward a linear regulator or a filtered switching topology, but the solution was chosen before the noise requirement was examined.

Each of these could have been avoided by spending more time in the problem space before moving to the solution space.

## Gotchas

- **Familiarity masquerades as analysis.** The component you know best will always feel like the right choice. Recognizing this bias is the first step; counteracting it requires deliberately evaluating alternatives.
- **Problem definition feels like "not working."** Sitting with requirements instead of drawing schematics can feel unproductive, especially on personal projects. It's not — it's the highest-leverage phase of the entire project.
- **Requirements evolve, and that's normal.** The first version of a requirements list is always incomplete. The goal isn't perfection; it's making implicit assumptions explicit so they can be tested and revised.
- **Stakeholders often describe solutions, not problems.** When someone says "I need a Bluetooth widget," they usually mean "I need a wireless way to get data to my phone." Always dig past the stated solution to find the underlying need.
- **Premature specificity locks you in.** Specifying "12-bit ADC with SPI interface" too early eliminates options that might be better. Start with "need to digitize a 0-5V signal to 1mV resolution" and let the spec guide the component choice.
