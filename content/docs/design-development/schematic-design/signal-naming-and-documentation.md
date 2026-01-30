---
title: "Signal Naming & Documentation Discipline"
weight: 50
---

# Signal Naming & Documentation Discipline

A well-named signal is a tiny piece of documentation that travels with every instance of that net across every schematic sheet, into the layout, through the BOM, and into the debug notes. A poorly named signal — or worse, an unnamed one — forces everyone who encounters it to trace it back to its source and figure out what it does from context. Over the life of a design, consistent naming and annotation save hours of confusion and prevent connection errors that might otherwise survive all the way to a fabricated board.

## Why Naming Conventions Matter

Signal names are the primary language of schematic communication. When you look at a schematic and see a net called `SPI1_MOSI`, you immediately know what it carries (SPI data), which bus it belongs to (bus 1), and its direction (master out). When you see a net called `NET47`, you know nothing. You have to trace it, find both endpoints, figure out its function, and remember that context every time you encounter it again.

This matters most when you're not the one who named the signals. During a design review, a peer reviewer needs to understand the design quickly. During layout, the PCB designer needs to know which signals are critical. During debug, the engineer probing the board needs to identify signals without constantly referencing the schematic. Clear names make all of these interactions faster and less error-prone.

Even for solo projects, naming discipline matters because future-you is effectively a different person. I've opened schematics I designed six months earlier and been unable to determine what certain signals were for, because I used vague names like `CTRL` or `SIG_IN` that made sense in the moment but carried no lasting meaning.

## Naming Convention Patterns

A consistent convention eliminates ambiguity and makes names predictable. Here are the patterns I've settled on after trying several approaches:

**Power rails include their voltage:** `VCC_3V3`, `VCC_1V8`, `VCC_5V0`, `VIN_12V`. This eliminates any confusion about which supply a component is connected to. For multiple instances of the same voltage (analog and digital 3.3V), add a qualifier: `VCC_3V3_ANALOG`, `VCC_3V3_DIGITAL`.

**Interface signals include the bus name and function:** `SPI1_CLK`, `SPI1_MOSI`, `SPI1_MISO`, `SPI1_nCS`. The bus identifier (`SPI1`) prevents confusion when multiple instances of the same bus type exist. The function (`CLK`, `MOSI`) is standard terminology that any engineer will recognize.

**Active-low signals use an `n` prefix:** `nRESET`, `nCS`, `nIRQ`, `nENABLE`. This is immediately visible and unambiguous. Some conventions use a `_B` suffix (`RESET_B`) or an overbar (which not all tools render correctly). The `n` prefix works universally and is hard to miss.

**Direction indicators from the source's perspective:** `MCU_TX` means the MCU is transmitting on this line. `SENSOR_OUT` means the signal originates from the sensor. This avoids the most common naming ambiguity in electronics: whose TX and whose RX?

**Functional descriptors for analog signals:** `VREF_2V5` (a 2.5V reference), `ISENSE_MOTOR` (motor current sense voltage), `TEMP_NTC` (temperature from an NTC thermistor). These tell you what the signal represents, not just where it comes from.

## The TX/RX Ambiguity

This deserves special attention because it causes real wiring errors on real boards. When a UART connects an MCU to a GPS module, the MCU's TX pin connects to the GPS module's RX pin, and vice versa. If both nets are simply called `TX` and `RX`, which is which?

The clearest approach: name signals from one device's perspective and document that choice. I use the MCU's perspective since it's typically the "center" of the design: `MCU_UART1_TX` is the line carrying data FROM the MCU, which connects to the peripheral's RX pin. Alternatively, name by function: `GPS_DATA_TO_MCU` and `MCU_CMD_TO_GPS`.

Whatever convention you choose, document it once and apply it uniformly. The worst outcome is inconsistency — some signals named from the MCU's perspective and others from the peripheral's perspective, with no way to tell which is which without tracing every connection.

## Schematic Annotations

The schematic itself shows what the circuit is — which components are connected to which. Annotations explain why. These are notes placed directly on the schematic sheet that capture design intent, calculations, and constraints that aren't obvious from the circuit topology.

Useful annotation types:

- **Design calculations.** "R3/R4 set output to 3.3V: Vout = 0.8V * (1 + R3/R4) = 0.8 * (1 + 31.6k/10k) = 3.33V." This lets any reviewer verify the design without deriving the formula themselves.
- **Constraint notes.** "Place C12 within 5mm of U3 pin 7" or "Route this differential pair with 100-ohm impedance." These communicate layout-critical requirements to the PCB designer.
- **Rationale for unusual choices.** "R7 is 4.7k instead of the datasheet-recommended 10k to source sufficient base current at low beta (worst-case hFE = 80)." Without this note, a future reviewer might "fix" R7 back to 10k.
- **Reference to external documents.** "See app note AN-1234 section 3.2 for compensation network design" gives the reader a path to deeper understanding.
- **Configuration notes.** "J3 pin 2-3 shorted for I2C address 0x48; open for 0x49." These capture jumper or solder-bridge configurations.

The rule of thumb: annotate anything that isn't obvious from the circuit itself. If a reviewer would need to consult the datasheet to understand why a particular value was chosen, that's a candidate for annotation.

## BOM Notes and Documentation

The Bill of Materials is more than a list of parts — it's a manufacturing document. Well-annotated BOM entries prevent procurement errors and assembly problems.

**Tolerance specifications.** If a resistor must be 1% instead of the default 5%, the BOM should say so explicitly. If a capacitor must be C0G dielectric, not X7R, that's a BOM note. These specifications are invisible on the schematic but critical for ordering.

**Alternate parts.** For each critical component, list approved alternates with their manufacturer part numbers. Include any design adjustments needed for the alternate (different pinout orientation, different feedback resistor value for a different regulator). This information is invaluable when the primary part goes out of stock, as discussed in [Designing for Substitution]({{< relref "/docs/design-development/part-selection-and-sourcing/designing-for-substitution" >}}).

**Assembly instructions.** Some components have orientation requirements that aren't obvious from the package (certain LEDs, specific connector orientations, polarized components without standard polarity markings). BOM notes can call these out.

**DNP (Do Not Populate) designators.** Components that are present on the board but not assembled for a particular configuration. This is common for test points, debug components, and option resistors. The BOM should clearly mark these and explain the configuration.

## Version Control for Schematics

Schematics are design files, and they benefit from the same version control discipline as source code. Meaningful commit messages, tagged releases, and a reviewable history make it possible to understand how and why the design evolved.

Most modern EDA tools (KiCad, Altium, Eagle) store schematics in text-based formats that work with git, though the diffs are hard to read. Some tools (KiCad in particular) generate relatively clean text diffs. For binary-format tools, at minimum export PDF snapshots with each committed revision so that visual diffs are possible.

**Meaningful commit messages** describe what changed and why: "Increased R7 from 4.7k to 10k to reduce quiescent current on VBAT rail" is useful. "Updated schematic" is not. The commit message is your design journal, recording the stream of decisions that shaped the final design.

**Tagged releases** mark significant milestones: "schematic-review-v1", "sent-to-fab-rev-A", "post-bring-up-fixes". These let you return to any point in the design history and understand what was fabricated.

## The Design Log

Beyond version control, a design log (or design journal) captures the reasoning behind decisions in a way that commit messages can't fully express. This might be a separate document, a text file in the repository, or entries in a lab notebook.

The design log answers questions like: "Why did we choose the TPS54302 instead of the LM3671?" or "Why is the ADC reference voltage 2.048V instead of the full 3.3V supply?" These decisions involve tradeoffs that are difficult to reconstruct months later without a written record.

The format matters less than the habit. A simple text file with dated entries works. The critical practice is writing down the decision and its rationale at the time you make it, not trying to reconstruct the reasoning later.

## Gotchas

- **Inconsistent naming creates false connections.** If one sheet calls a net `SPI_CLK` and another calls it `SPI1_CLK`, they're not connected — but a reader might assume they are. Decide on names early and enforce them through the entire design.
- **Unnamed nets are invisible bugs.** A net with no name that happens to connect two things through a coincidental tool-assigned identifier will break silently if the schematic is reorganized. Name every net that crosses a sheet boundary.
- **Signal names that describe the implementation instead of the function become wrong when the implementation changes.** Calling a net `I2C_SDA` is fine. Calling it `U3_PIN12` is fragile — it breaks the moment you change the IC or the pin assignment.
- **Over-annotation clutters the schematic.** Not every component needs a paragraph of explanation. Annotate the non-obvious choices; trust that standard practices (like 100nF decoupling on every IC power pin) don't need explanation.
- **Documentation without maintenance becomes misinformation.** If you change R7 from 4.7k to 10k but don't update the annotation explaining the original 4.7k choice, the annotation is now actively misleading. Update notes whenever you change the thing they describe.
- **The TX/RX swap is the most common wiring error in UART connections.** It appears on amateur and professional boards alike. Document the convention explicitly on the schematic, and verify it during design review.
