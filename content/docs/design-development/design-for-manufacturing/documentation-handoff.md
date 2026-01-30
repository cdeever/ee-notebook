---
title: "Documentation Handoff"
weight: 50
---

# Documentation Handoff

A design is not complete until someone else can build, test, and maintain it without the original designer standing over their shoulder. This is true even if "someone else" is just future-you, six months from now, trying to remember why a particular capacitor value was chosen or what order the power rails need to come up in. Documentation handoff is the process of assembling all the information needed to take a design from files on a computer to a working product — and then to keep that product working over its lifetime.

## The Manufacturing Package

The manufacturing data package is the set of files that the fabrication and assembly houses need to build the product. An incomplete package generates RFQs (requests for quotation) with questions, delays while you dig up missing files, and errors when the manufacturer guesses at missing information.

A complete manufacturing package includes:

- **Gerber files.** One file per layer: top copper, bottom copper, inner layers, top solder mask, bottom solder mask, top silkscreen, bottom silkscreen, board outline, and any additional mechanical layers. Use RS-274X format (extended Gerber) or a single-file format like ODB++ or IPC-2581 if your fab supports it. Always generate fresh gerbers from the final design revision — never reuse files from an earlier version.
- **Drill files.** Excellon format, with plated and non-plated holes in separate files. Include slot drill data if your board has routed slots. Verify that the drill file origin matches the gerber origin — a mismatch shifts every hole on the board.
- **Bill of materials.** The BOM is the authoritative list of every component on the board. Each line should include: reference designator(s), quantity, value/description, manufacturer name, manufacturer part number, package/footprint, and any approved alternates. Include DNP (Do Not Place) components explicitly — they should appear on the BOM with a DNP flag rather than being silently omitted.
- **Pick-and-place file.** Also called the centroid file or XY data. Lists every component with its reference designator, X and Y coordinates (relative to a defined board origin), rotation angle, and board side (top or bottom). The assembly house uses this to program the pick-and-place machine. Verify the origin and rotation conventions match your assembler's expectations — these vary between EDA tools and between assemblers.
- **Assembly drawing.** A visual document showing component placement on both sides of the board, with reference designator callouts, polarity markings, and any special assembly notes. This is the human-readable companion to the pick-and-place data.
- **Fabrication drawing.** Board dimensions, layer stackup, material specifications (FR-4, Rogers, flex), finished copper weight, surface finish (HASL, ENIG, OSP), impedance requirements, and any special instructions (controlled impedance traces, edge plating, blind/buried vias).

## Assembly Instructions

Beyond the standard manufacturing data, many designs have special assembly requirements that must be communicated explicitly:

- **Soldering order.** If certain components must be placed before others (tall components blocking access to shorter ones, or components that must be soldered before a conformal coating is applied), the sequence must be documented.
- **Programming.** If ICs need firmware loaded during or after assembly, the programming procedure, file, and tools must be specified. Include the firmware version and checksum.
- **Mechanical assembly.** Heat sinks, thermal interface materials, standoffs, gaskets, and other mechanical components that are installed during or after PCB assembly. These often fall through the cracks because they're not on the PCB BOM.
- **Conformal coating.** If the board receives conformal coating, specify the material, the areas to be coated, and the areas to be masked (connectors, test points, buttons, switches).
- **Potting or encapsulation.** Any areas requiring potting compound, and the keep-out zones that must remain accessible.

## Test Procedures

A production test procedure defines exactly how to verify that each assembled unit works correctly. This is distinct from the engineering validation performed during development — production testing needs to be fast, repeatable, and performable by someone who didn't design the product.

A good production test procedure includes:

- **Test setup.** What equipment is needed, how to connect it, what test fixtures are required.
- **Step-by-step instructions.** Each test step with the action to perform, the expected result, and the pass/fail criteria. "Apply 12V to J1. Measure voltage at TP3. Expected: 3.30V +/- 0.05V."
- **Test sequence.** The order of tests, typically progressing from basic (power supply, no smoke) to detailed (functional tests, calibration). A failing early test should abort the sequence — don't test communication if the power supply isn't working.
- **Failure handling.** What to do when a test fails: retry, rework, scrap, or quarantine for engineering review.
- **Record keeping.** What data to record for each unit — serial number, test results, calibration values. This data becomes essential for warranty analysis and field troubleshooting.

If the project justifies it, a test fixture — a jig that makes electrical contact with the board's test points — dramatically speeds up production testing. The fixture design is part of the documentation handoff, including fixture drawings, pogo pin specifications, and wiring.

## Design Documentation

The manufacturing package tells the assembler how to build the product. Design documentation tells the engineer how the product works — and more importantly, why it works the way it does.

- **Schematic.** The complete, current schematic with clear net names, component values, and annotations. The schematic is the primary design document. It should be readable without referring to the layout.
- **Layout files.** The PCB layout in the native EDA format, fully synchronized with the schematic. Include the design rule settings and the library of custom footprints used.
- **Block diagram.** A system-level view showing the major functional blocks and their interconnections. This is the entry point for anyone trying to understand the design.
- **Design rationale.** The most commonly missing and most valuable piece of documentation. Why was this topology chosen? Why this component instead of the alternative? What trade-offs were made and what drove the decision? This information lives in the designer's head and vanishes when they move on to the next project unless it's written down.
- **Simulation files.** If simulations were performed (power supply loop stability, signal integrity, thermal), include the simulation models and results. They capture the analysis that justified design decisions.
- **Test reports.** Results from engineering validation — what was tested, how, and what the results were. These provide the baseline for comparison when production units behave differently.

## The Bus Factor

The "bus factor" is the number of people who would need to be hit by a bus before the project is unable to proceed. For many engineering projects, the bus factor is one — only the designer fully understands the design. This is a project risk that documentation directly mitigates.

Even on a personal project, the bus factor matters. You are a different person in six months than you are today. The context you hold in your head — why this value, why this topology, why this routing decision — will be gone. Writing documentation is a conversation with your future self, and your future self will be grateful.

For team projects, the bus factor is critical. A design that only one person can modify, debug, or maintain is a liability. Documentation makes the design transferable, and that transfers the risk from a single person to the organization.

## Templates and Checklists

Standardized templates reduce the chance of omitting something from the handoff package. A handoff checklist might include:

- [ ] Gerbers generated from final design revision
- [ ] Drill files with correct origin and format
- [ ] BOM with manufacturer part numbers and alternates
- [ ] Pick-and-place file with correct origin and rotation convention
- [ ] Assembly drawing with polarity markings
- [ ] Fabrication drawing with stackup and material specs
- [ ] Special assembly instructions documented
- [ ] Programming file and procedure documented
- [ ] Production test procedure written and verified
- [ ] Schematic PDF exported from final revision
- [ ] Design rationale document completed
- [ ] All files version-controlled and tagged with release revision

The checklist should be reviewed and updated after each project — items that were forgotten and caused problems get added for next time. Over time, the checklist becomes a comprehensive specification of what a complete handoff looks like. See also [turning mistakes into patterns]({{< relref "/docs/design-development/project-retrospectives/turning-mistakes-into-patterns" >}}) for how accumulated lessons become reusable tools.

## What to Include and What to Leave Out

Documentation completeness is a spectrum. Too little documentation and the design is opaque. Too much and the documentation itself becomes a maintenance burden — inaccurate documentation is worse than no documentation because it misleads.

The guiding principle: include enough detail for a competent engineer to build, test, modify, and maintain the product without contacting the original designer. Assume the reader has general electronics knowledge but no specific knowledge of this design.

What to include:

- Everything listed above in the manufacturing package and design documentation.
- Any information that is not obvious from reading the schematic — design intent, constraints, known issues, planned improvements.
- Contact information for key suppliers, assembly houses, and test equipment vendors.

What to leave out:

- General electronics knowledge (how op-amps work, what decoupling is for).
- Step-by-step EDA tool instructions (how to open the schematic, how to generate gerbers).
- Early design iterations and abandoned approaches, unless they explain why the current approach was chosen.

## Gotchas

- **The handoff package is never done until it's been used.** The first person who tries to build from your documentation will find gaps. Plan for a review cycle where someone other than the designer attempts to use the package and reports what's missing.
- **Gerber and drill file origin mismatches are invisible until assembly.** The board looks fine, but every component is offset by 2mm. Always verify that gerbers and drill files share the same origin by loading them in a gerber viewer.
- **BOM alternates need to be validated, not assumed.** Just because a part has the same value and package doesn't mean it's a drop-in replacement. Verify that alternates meet all requirements — tolerance, voltage rating, temperature range, footprint compatibility.
- **Design rationale has a half-life.** If you don't write it down within a week of making the decision, you probably won't remember why. Capture rationale in real time, not at the end of the project.
- **Documentation stored only on a local machine is one disk failure from oblivion.** Use version control, cloud storage, or both. The design files and documentation should be backed up independently of any single computer.
