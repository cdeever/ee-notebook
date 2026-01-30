---
title: "Functional vs Non-Functional Requirements"
weight: 20
---

# Functional vs Non-Functional Requirements

Every electronics project has two kinds of requirements, and the ones most people skip are the ones that cause the most failures. Functional requirements describe what the system must do. Non-functional requirements describe how well it must do it. A circuit that "works" on the bench but can't survive a hot car or draws too much current for its battery has met its functional requirements and failed its non-functional ones.

## Functional Requirements: What the System Must Do

Functional requirements are the capabilities the system must provide. They're the easiest to identify because they directly answer the question "what does this thing do?"

Examples of functional requirements:

- Measure temperature with a thermistor and display the value on an LCD
- Transmit sensor data wirelessly to a base station every 60 seconds
- Amplify an audio signal from a microphone to line level
- Convert 12V DC input to 3.3V DC output
- Detect a button press and toggle an LED

These are binary — the system either does them or it doesn't. They form the checklist for basic functionality, and they're what most hobbyists and learners focus on. Which is understandable, because a circuit that doesn't perform its basic function is obviously broken.

The problem is that functional requirements alone are not enough to describe a working system.

## Non-Functional Requirements: How Well It Must Behave

Non-functional requirements specify the quality attributes of the system's behavior. They're harder to identify, harder to test, and almost always the reason a "working" prototype fails in real use.

| Category | Example requirement | Why it matters |
|---|---|---|
| Accuracy | Temperature measurement within +/- 0.5 degrees C | Determines sensor choice, calibration approach, and ADC resolution |
| Power consumption | Average current below 50 uA for 2-year battery life | Dictates MCU choice, sleep strategy, and regulator efficiency |
| Latency | Sensor reading available within 10 ms of trigger | Affects sampling strategy, communication protocol, and processing architecture |
| Temperature range | Operate from -20 C to +60 C | Constrains component selection, derating, and thermal design |
| EMC | Meet FCC Part 15 Class B limits | Impacts layout, filtering, shielding, and clock frequency choices |
| Reliability | MTBF greater than 50,000 hours | Drives component derating, redundancy, and environmental protection |
| Size | PCB fits within 50 mm x 30 mm | Constrains component packages, routing density, and layer count |
| Cost | BOM under $15 at 1000 units | Limits component choices and drives integration decisions |

Non-functional requirements are where the real design tradeoffs live. A temperature sensor project is straightforward if you just need to "read temperature." It becomes a design challenge when you need to read temperature to 0.1 degree accuracy, in an environment from -40 C to +85 C, running from a coin cell for two years, fitting in a 20 mm diameter enclosure.

## Where Most Designs Fail

I've noticed a pattern: the circuit "works on the bench" but fails in deployment. The bench is a controlled environment — stable temperature, clean power, short wires, no vibration, no EMI. The real world is none of those things.

Common non-functional failures:

- **Power consumption too high.** The prototype runs from a USB port, so nobody notices it draws 15 mA continuously. In the field, that kills a CR2032 in days instead of months.
- **Noise sensitivity.** The ADC reads clean values on the bench, but in an enclosure near a motor driver, the readings jump around by 20 counts.
- **Temperature drift.** The voltage reference is stable at 25 C but drifts 50 ppm/C, which at 60 C puts the measurement outside its accuracy spec.
- **Startup behavior.** The system works after a clean power-on, but brown-outs in the field cause the MCU to hang in an undefined state.

These failures are invisible if you only test functional requirements.

## Capturing Requirements

Requirements don't have to be formal documents. For personal projects, a simple table or bulleted list is enough — the point is to make implicit assumptions explicit.

A useful format for each requirement:

| Field | Purpose |
|---|---|
| ID | Short identifier (FR-01, NFR-03) for reference |
| Description | What the system must do or how it must behave |
| Priority | Must have, should have, or nice to have |
| Verification | How you'll test whether this requirement is met |
| Source | Why this requirement exists (use case, standard, physical constraint) |

The verification column is especially valuable. If you can't describe how you'd test a requirement, it's probably too vague to be useful. "The system must be reliable" is not testable. "The system must operate continuously for 30 days without reset in a 40 C environment" is testable.

## Must Have vs Nice to Have

Not all requirements are equal, and treating them as equal leads to over-design or analysis paralysis. A simple priority scheme helps:

- **Must have.** The project fails without this. Non-negotiable. These define the minimum viable product.
- **Should have.** Important and expected, but the system is still useful without it. These are included if they don't compromise must-have requirements.
- **Nice to have.** Would be good, but not worth significant cost, complexity, or schedule impact.

This prioritization is especially important when requirements conflict — and they will. "Low power" and "fast response" often pull in opposite directions. "Small size" and "low cost" compete when you need expensive tiny packages. Knowing which requirement wins the conflict requires knowing which is "must have" and which is "nice to have."

## Requirements That Look Non-Functional but Are Actually Functional

Some requirements appear to be quality attributes but are actually hard functional requirements in disguise:

- **Safety.** "The system must not present a shock hazard" isn't a quality attribute — it's a binary pass/fail requirement that drives specific design features (isolation, fusing, creepage distances).
- **EMC compliance.** Meeting radiated emission limits isn't optional if you plan to sell or deploy the device. It's a functional requirement with specific, measurable criteria.
- **Regulatory compliance.** UL listing, CE marking, RoHS compliance — these are not soft preferences. They determine whether the product can legally be used.
- **Data integrity.** "The system must not lose stored measurements during power loss" is a functional requirement that demands specific implementation (non-volatile storage, write completion detection, journaling).

Misclassifying these as "nice to have" non-functional attributes leads to late-stage surprises when the design can't meet them without fundamental changes.

## Gotchas

- **Unstated requirements are still requirements.** If the project will live outdoors, temperature and humidity tolerance are requirements whether you wrote them down or not. The environment doesn't care about your documentation habits.
- **"It works" is not a requirement.** Without defined acceptance criteria, you'll never know when to stop tweaking. Define what "works" means quantitatively before starting.
- **Non-functional requirements dominate cost.** A temperature sensor that works at room temperature costs $0.50. One that works from -40 C to +125 C with 0.1 degree accuracy costs $5.00. The functional requirement is identical; the non-functional requirements drive a 10x cost difference.
- **Requirements change — track the changes.** As you learn more, requirements will evolve. That's healthy. What's not healthy is changing requirements without re-evaluating their impact on the design. Keep a record of what changed and why.
- **Don't copy requirements from similar projects blindly.** Every project has different constraints. A requirement that was critical for a previous project (like -40 C operation) might be irrelevant for this one but still drive unnecessary cost and complexity if copied without examination.
- **Test your requirements, not just your circuit.** A requirement that can't be verified is just a wish. For each requirement, define how you'll measure compliance — ideally before you start designing.
