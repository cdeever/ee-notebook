---
title: "Early Design Reviews"
weight: 60
---

# Early Design Reviews

Finding a problem on a schematic printout costs nothing — a few minutes of discussion, a few clicks to fix. Finding the same problem on a fabricated, assembled PCB costs a board respin: new fabrication, new assembly, new lead time, often hundreds or thousands of dollars and weeks of schedule. The economics of design review are stark and unambiguous. Yet reviews are frequently skipped or performed superficially, especially on personal projects or small teams where "I'll just be careful" feels like enough.

## Why Reviews Work

Design reviews work because of a simple psychological reality: the designer who created a circuit has become blind to certain classes of errors. After staring at a schematic for days or weeks, your brain fills in what it expects to see rather than what's actually there. A missing connection, a wrong pin assignment, an incorrect resistor value — these become invisible to the person who drew them because the mental model says "it's right" and the brain obligingly sees it that way.

A fresh pair of eyes doesn't have that mental model. A reviewer sees what's actually on the page, not what was intended. This is why even a brief review by someone less experienced than the designer catches real bugs. The reviewer doesn't need to be a better engineer — they just need to be a different engineer.

Even self-review is valuable if you approach it systematically, with a checklist, after stepping away from the design for at least a day. The goal is to break the familiarity that makes errors invisible.

## The Self-Review Checklist

Before showing the design to anyone else, walk through it yourself with a structured checklist. This catches the most common classes of errors and ensures you're not wasting a reviewer's time on obvious mistakes.

**Power supply and distribution:**
- Is every IC's power pin connected to the correct supply rail?
- Are decoupling capacitors present on every IC power pin, placed as close as possible in the schematic (with layout notes for physical proximity)?
- Is the power-on sequence correct? Do any ICs require that one rail come up before another?
- Are power-good signals monitored where needed?
- Do voltage regulators have the correct input/output capacitors per their datasheets?
- Are reverse polarity protections or input fuses present where required?

**Signal integrity and connectivity:**
- Does every signal that crosses a sheet boundary have an explicit net name?
- Are pull-up and pull-down resistors present where required (I2C buses, reset pins, chip selects, open-drain outputs)?
- Are unused inputs on logic ICs tied to appropriate levels (not left floating)?
- Are analog inputs properly biased and protected against out-of-range voltages?
- Do differential pairs have correct termination?

**Protection and robustness:**
- Is ESD protection present on every connector that connects to the outside world?
- Are TVS diodes or clamps protecting sensitive inputs?
- Are current-limiting resistors present on LED drives and other current-sensitive loads?
- Is there over-voltage, over-current, or reverse-voltage protection on power inputs?
- Are thermal shutdown or thermal management provisions adequate?

**Test and debug access:**
- Are test points present on all power rails and key signals (as discussed in [Design for Test]({{< relref "/docs/design-development/schematic-design/design-for-test" >}}))?
- Is a debug interface (JTAG/SWD, UART console) accessible?
- Are status LEDs present for power and firmware activity?

**Mechanical and connector interface:**
- Do connector pinouts match the mating connector or cable?
- Are connector pin 1 designations consistent between schematic and physical connector?
- Are mounting holes, standoffs, and mechanical constraints accounted for?

This checklist isn't exhaustive — every project type has additional domain-specific checks. But it covers the categories that account for the majority of schematic errors across all types of designs.

## Peer Review

Peer review is the most effective form of design review, and it works best as a conversation, not an inspection. The designer walks the reviewer through the design, explaining the intent of each section. The reviewer asks questions, challenges assumptions, and notes anything that isn't clear.

The walkthrough format works because it forces the designer to articulate their reasoning. Many bugs are caught by the designer during the explanation, not by the reviewer — the act of explaining reveals gaps in logic that are invisible when the reasoning stays internal. "This resistor sets the current to..." (pause, recalculate) "...wait, that's not right" is a common pattern.

Effective review practices:

- **Review the block diagram first.** Before diving into schematic details, confirm that the system architecture makes sense. Missing blocks or incorrect interfaces at the architecture level are the most expensive errors.
- **Follow signal paths from input to output.** Trace each major signal from its source to its destination, checking level translation, filtering, protection, and termination along the way.
- **Check power distribution as a complete system.** Verify that the power tree makes sense: input protection, regulation stages, distribution to loads, sequencing, and monitoring.
- **Question every "obvious" component.** "Why is that pull-up 10k and not 4.7k?" If the designer can answer confidently, it's fine. If there's hesitation, it's worth investigating.
- **Look at the design from the layout perspective.** Are there components that will be difficult to route? Thermal challenges? Signal integrity concerns that need attention in layout?

## Common Review Findings

Certain errors appear so frequently in design reviews that they're worth calling out explicitly:

**Missing pull-up or pull-down resistors.** I2C buses without pull-ups are the most common, but open-drain interrupt outputs, chip select lines that should default to inactive, and reset pins that need a defined state at power-on all require explicit resistors. The symptom varies: a bus that doesn't communicate, a chip that stays in reset, or an output that floats and causes erratic behavior.

**Wrong pin assignments.** The MCU pin map says PA5 is the SPI clock, but the schematic connects it to PA4. Or the UART TX and RX are swapped. Or an ADC input is assigned to a pin that doesn't have an analog function. Pin assignment errors are easy to make and easy to catch in review — they require methodically checking each pin against the MCU datasheet.

**Inadequate decoupling.** A single 100nF capacitor per IC was sufficient for slow logic, but modern high-speed digital ICs often need multiple capacitors of different values (100nF + 10uF, or 100nF + 1uF + 10uF) to provide decoupling across a range of frequencies. Missing bulk capacitance causes voltage droops during transient loads; missing high-frequency capacitance causes noise and EMI.

**Incorrect voltage levels.** Connecting a 5V output to a 3.3V-only input. Driving an LED at 2V from a 1.8V GPIO. Feeding an ADC with a signal that exceeds its reference voltage. Level mismatch errors require checking that every signal's voltage range is compatible with the input range of the receiving device.

**Missing protection on external interfaces.** Every connector that goes to the outside world — USB, Ethernet, GPIO headers, sensor cables — is an ESD event waiting to happen. TVS diodes, series resistors, or dedicated ESD protection ICs are needed on these interfaces and are frequently omitted in initial designs.

## Schematic Review vs Layout Review

These are separate reviews that check different things. A schematic review verifies that the circuit is electrically correct — right topology, right values, right connections. A layout review verifies that the physical implementation preserves the electrical intent — proper grounding, controlled impedance, thermal management, manufacturing feasibility.

Schematic review happens first, before layout begins. It's cheaper and faster because changes are just edits to a drawing. Layout review happens after placement and routing are substantially complete, and changes at this stage are more expensive (requiring re-routing or re-placement).

Some things can only be checked at the layout stage: trace lengths, parasitic inductance, thermal via placement, component placement clearances, and manufacturing design rules. But many layout problems originate from schematic omissions — a missing ground connection, an undefined power plane partition, or a signal that needs differential routing but wasn't marked as a pair.

The ideal workflow: complete schematic review, resolve all findings, then start layout. Conduct layout review at a point where the major placement is done but routing isn't finalized, so changes are still relatively affordable.

## Design Review Culture

The most important aspect of design review is culture: reviews should be collaborative investigations, not adversarial examinations. The goal is to find problems and improve the design, not to prove the designer wrong or demonstrate the reviewer's superiority.

Practical principles that support good review culture:

- **The design, not the designer, is being reviewed.** Findings are about the circuit, not the person who drew it. "This pull-up might need to be lower for reliable communication at this bus speed" is constructive. "You forgot the pull-up" is accusatory.
- **Questions are more effective than declarations.** "What happens to this node during power-up?" often leads to a productive discussion that reveals edge cases. "This is wrong" shuts down dialogue.
- **Document findings, don't just discuss them.** Every issue identified in a review should be recorded (even informally — a shared document or issue list). Verbal-only reviews produce a pleasant conversation but unreliable follow-through.
- **Close the loop.** After the review, the designer resolves each finding and the reviewer confirms resolution. Findings that are acknowledged but never resolved are the hallmark of ineffective reviews.

## Gotchas

- **Self-review after a break is surprisingly effective.** Reviewing your own schematic after two or three days away from it, using a printed copy, catches a remarkable number of errors. Print it, use a red pen, and check systematically.
- **Review scope creep wastes everyone's time.** A schematic review should focus on the schematic, not redesign the system architecture. If the reviewer questions the architecture, that's a separate discussion.
- **Checklists prevent the "I'll remember to check that" failure.** Under time pressure, reviewers skip steps they intend to return to but don't. A written checklist, physically checked off, is the countermeasure.
- **Reviewing too early wastes effort; reviewing too late wastes money.** The sweet spot is when the schematic is substantially complete but before layout has started. Reviewing a half-finished schematic produces findings that the designer was already planning to address.
- **The most expensive review finding is the one nobody raises.** If something looks suspicious but you don't mention it because you assume the designer considered it, that's a review failure. Always ask — the worst case is a brief explanation; the best case is catching a real bug.
