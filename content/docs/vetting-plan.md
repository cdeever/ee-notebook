---
title: "Content Vetting Plan"
bookHidden: true
bookSearchExclude: true
---

# Content Vetting Plan

This plan defines the methodology for vetting every page in the notebook to publishable quality — meaning the content could withstand scrutiny from working engineers. It covers what activities to perform, in what order, using what resources, for each type of claim.

---

## Phase 1: Tracking System

Every content page carries a `review` frontmatter block:

```yaml
review:
  status: unreviewed    # unreviewed | in-progress | reviewed
  method: []            # book-check, bench-verified, engineer-reviewed, datasheet-confirmed
  notes: ""             # free-text for open questions or caveats found
  date: ""              # date of last review pass
```

A hidden [review progress dashboard](/docs/review-progress/) shows every page, its review status, and method at a glance.

---

## Phase 2: Classify Every Page by Claim Risk Tier

Before reading every page in detail, do a quick triage pass to assign each page a risk tier. This determines how much verification effort it gets.

### Risk Tiers

| Tier | Description | Verification Depth | Examples |
|------|-------------|-------------------|----------|
| **Critical** | Safety-related, mains voltage, could cause injury or equipment damage | Maximum — book + bench + engineer sign-off | Safety & High Energy, Dim Bulb Tester, inrush current, isolation |
| **High** | Quantitative claims (formulas, specific numbers, thresholds) that someone might design against | Book cross-reference + datasheet spot-check | Component pages (MOSFETs, capacitors, diodes), RF impedance formulas, op-amp specs, filter equations |
| **Medium** | Behavioral descriptions, design patterns, rules of thumb | Book cross-reference + engineer gut-check | Amplifier topologies, debugging methodology, RTOS patterns, measurement procedures |
| **Low** | Conceptual frameworks, mental models, organizational/structural content | Self-consistency check + engineer conversation | Architecture & Abstraction pages, design methodology, taxonomy discussions |

**Activity:** Read the title and skim each page (30–60 seconds each). Assign a tier in the frontmatter. This pass covers all pages and should take roughly 15–25 hours spread over several sessions.

---

## Phase 3: Verification Activities by Claim Type

Each page contains multiple claim types. Use the matching verification method for each.

### 3A. Equations and Formulas

**Method:** Book cross-reference

Look up every equation in at least one authoritative source. Confirm variable definitions, units, and boundary conditions match.

**Watch for:** Equations that are correct but missing qualifying conditions ("only valid for small signals," "assumes ideal op-amp," "at frequencies well below SRF").

**Key references by section:**

| Section | Primary Book | Chapter/Section to Cross-Reference |
|---------|-------------|-------------------------------------|
| Fundamentals | Alexander & Sadiku, *Fundamentals of Electric Circuits* | Ohm's law, KVL/KCL, Thevenin/Norton, AC power |
| Fundamentals (semiconductors) | Sedra/Smith, *Microelectronic Circuits* | Diode equation, MOSFET square-law, BJT Ebers-Moll |
| Analog | Horowitz & Hill, *Art of Electronics* (3rd ed.) | Ch. 4–5 (op-amps), Ch. 6 (filters) |
| Analog (op-amps) | TI, *Op Amps for Everyone* | Gain equations, bandwidth, stability criteria |
| Digital | Harris & Harris, *Digital Design and Computer Architecture* | Timing constraints, setup/hold, metastability MTBF |
| Audio & Signal | Oppenheim & Schafer, *Discrete-Time Signal Processing* | Nyquist, sampling theorem, DFT/FFT, filter theory |
| Radio & RF | Pozar, *Microwave Engineering* | Transmission line equations, Smith chart, matching |
| Radio & RF (antennas) | ARRL Handbook | Antenna gain, impedance, radiation patterns |

**Deliverable per page:** Check mark that every formula was found in a reference. Note any formulas that appear in the notebook but NOT in standard references (these need bench verification or engineer review).

### 3B. Numerical Thresholds and Typical Values

**Method:** Datasheet confirmation + reference book spot-check

For every specific number (voltage thresholds, current ranges, temperature coefficients, timing values), find it in at least one manufacturer datasheet or reference table. Flag numbers that are "typical" but presented without that qualifier.

**Watch for:**
- Values that are device-specific but stated as universal (e.g., "MOSFET threshold voltage is 1–4V" — true broadly, but varies enormously)
- Temperature coefficients stated at room temp only
- Worst-case vs. typical confusion
- Round numbers that hide important precision (e.g., "0.7V forward drop" vs. actual range of 0.5–0.85V depending on current and device)

**Key datasheets to pull:**
- General-purpose silicon diodes (1N4148, 1N400x series)
- Schottky diodes (1N5817 series)
- Logic-level MOSFETs (IRLZ44N or similar) and standard MOSFETs (IRF series)
- Common op-amps (LM741, LM358, OPA2134, AD8605)
- Ceramic capacitors (MLCC datasheets showing DC bias curves)
- Standard logic families (74HC, 74HCT, 74LVC datasheets for voltage levels)

### 3C. Component Behavior Descriptions

**Method:** Book cross-reference + bench verification for key claims

For each behavioral claim ("capacitors become inductive above SRF," "MOSFETs have a body diode," "op-amps oscillate with capacitive loads"), confirm in Art of Electronics or domain-specific reference book. For surprising or counterintuitive claims, verify on the bench.

**Bench experiments worth running:**

1. **Capacitor DC bias derating** — Measure actual capacitance of a 10uF X5R MLCC at 0V, 5V, 10V using an LCR meter or impedance measurement. Compare to the notebook's claim about capacitance loss at rated voltage.
2. **Capacitor self-resonant frequency** — Sweep frequency across a ceramic cap and observe impedance dip at SRF. Confirm it becomes inductive above SRF.
3. **Op-amp oscillation with capacitive load** — Build a unity-gain buffer, add 1nF load capacitance, observe ringing/oscillation. Confirm the "series output resistor fixes it" claim.
4. **MOSFET body diode** — Forward-bias a MOSFET drain-source with gate grounded. Measure forward voltage. Confirm body diode behavior matches description.
5. **Diode forward voltage vs. current** — Sweep current through a 1N4148 and log forward voltage. Compare to the "0.6–0.7V" claim and note the range.
6. **Thermal noise floor** — Measure noise across a 10k resistor with no signal. Compare to Johnson-Nyquist prediction.
7. **Inrush current on a toroidal transformer** — Use a current probe and capture the first-cycle inrush at power-on. Compare to worst-case claim.

Document each bench result with scope screenshots, measured values, and comparison to the notebook's claim.

### 3D. Procedures and Methodologies

**Method:** Execute the procedure + engineer review

For every measurement or debugging procedure described, actually perform it on the bench. Does the procedure work as written? Are steps missing? Is the sequence correct?

**Watch for:**
- Missing safety steps (especially in mains-voltage procedures)
- Assumed knowledge that isn't stated
- Steps that only work with specific equipment configurations
- Procedures that are correct but fragile (break if you skip a step)

**Key procedures to bench-test:**
- Dim bulb tester construction and use
- Oscilloscope probe compensation procedure
- Power supply ripple measurement technique
- UART debugging with logic analyzer
- Metastability observation (if possible with available equipment)

### 3E. Safety-Critical Claims

**Method:** Standards cross-reference + experienced engineer sign-off

Every claim related to safety requires triple verification:

1. Cross-reference against relevant standards (IEC 61010 for measurement equipment, IEC 61140 for protection against electric shock, NFPA 70E for workplace electrical safety)
2. Confirm against a reliable published source (e.g., *Electrical Safety* by David Holt, or OSHA technical references)
3. Have an experienced engineer with hands-on high-voltage/mains experience read and approve

**Pages requiring safety review (prioritize first):**
- `measurement/safety-high-energy/` — entire subdirectory
- Any page discussing mains voltage, isolation, or CAT ratings
- Dim bulb tester page in debugging
- Inrush current page in fundamentals
- Any procedure involving live circuit measurement

**Non-negotiable rule:** No safety-related page ships without at least one working engineer having read and approved it.

### 3F. Rules of Thumb and "Always/Never" Statements

**Method:** Engineer interviews

Extract every rule of thumb and absolute statement. Present them to 2–3 experienced engineers and ask: "Is this always true? When does it break down? What would you add?"

**Watch for:**
- Rules that are 95% correct but have important exceptions
- Rules that are field-specific (true in power electronics, false in RF)
- Oversimplifications that are fine for learning but misleading for design

**Interview format suggestion:**
- Group rules of thumb by topic area (10–15 per session)
- Present each rule and ask: "Agree, disagree, or 'it depends'?"
- For "it depends" answers, capture the conditions
- Record the conversation (with permission) for later reference

### 3G. Historical and Contextual Claims

**Method:** Literature search

For each historical claim (invention attributions, "this was designed because…," era-specific design constraints), find a published source. Wikipedia is fine as a starting point but follow its citations to primary sources.

**Priority:** Low — historical inaccuracies are embarrassing but not dangerous. Handle these last.

---

## Section Priority Order

Work through sections in this order, based on risk and impact:

| Priority | Section | Reason |
|----------|---------|--------|
| 1 | **Measurement & Test** (safety subdirectory first) | Safety-critical content; people will follow these procedures |
| 2 | **Debugging, Failure & Repair** | Procedures involving mains voltage and live circuits |
| 3 | **Fundamentals** | Foundation for everything else; errors here propagate |
| 4 | **Analog Electronics** | Dense with equations and numerical claims; design-critical |
| 5 | **Radio & RF** | Largest section; formulas and impedance values people will use |
| 6 | **Digital Electronics** | Timing claims and metastability numbers |
| 7 | **Embedded Systems** | Mix of verifiable specs and experiential knowledge |
| 8 | **Audio & Signal Processing** | Sampling/DSP theory is well-established; lower risk |
| 9 | **Design & Development** | Mostly methodology; harder to be "wrong" but benefits from engineer review |
| 10 | **Retro & Legacy Systems** | Niche; lower readership impact |
| 11 | **Architecture & Abstraction** | Conceptual frameworks; verify internal consistency rather than external facts |

---

## Phase 4: Engineer Review Strategy

### Who to Ask for What

| Engineer Profile | Sections to Review | What to Ask |
|-----------------|-------------------|-------------|
| Power electronics / industrial | Fundamentals (magnetics, inrush, power), Measurement (safety), Debugging (mains-related) | Safety procedures, thermal claims, magnetics behavior, worst-case numbers |
| Analog / mixed-signal designer | Analog, Fundamentals (semiconductors), Audio & Signal | Op-amp claims, filter design, noise analysis, stability |
| RF / antenna engineer | Radio & RF (all), Measurement (spectrum/frequency) | Impedance matching, transmission line claims, antenna behavior, Smith chart usage |
| Embedded / firmware engineer | Embedded, Digital | RTOS claims, timing specs, protocol details, real-time constraints |
| PCB / manufacturing engineer | Design & Development (layout, DFM sections) | Layout rules, manufacturing claims, stackup guidance |
| Test / calibration engineer | Measurement (all non-safety) | Instrument specs, measurement technique, calibration claims |

### Review Format

Give each reviewer:
1. A printed/PDF copy of the relevant pages
2. A simple rubric: for each claim, mark it **Correct** / **Mostly correct (add qualifier)** / **Incorrect** / **Can't assess**
3. Permission to write in the margins
4. A 30–60 minute follow-up conversation to discuss findings

**Target:** Each section reviewed by at least one domain-appropriate engineer. Safety sections reviewed by at least two.

---

## Phase 5: Reference Book Cross-Reference Sessions

Block dedicated time for systematic book cross-referencing.

| Session | Book | Sections to Cross-Check | Est. Time |
|---------|------|------------------------|-----------|
| 1–3 | Art of Electronics (3rd ed.) | All sections — primary cross-reference for the entire notebook | 15–20 hrs |
| 4 | Alexander & Sadiku | Fundamentals (circuit analysis, passive components) | 3–4 hrs |
| 5 | Sedra/Smith | Fundamentals (semiconductors), Analog (amplifiers) | 4–5 hrs |
| 6 | Op Amps for Everyone | Analog (op-amp pages) | 2–3 hrs |
| 7 | Harris & Harris | Digital (timing, metastability, state machines) | 3–4 hrs |
| 8 | ARRL Handbook | Radio & RF (antennas, transmission lines, practical RF) | 4–5 hrs |
| 9 | Pozar | Radio & RF (microwave theory, impedance matching, Smith chart) | 3–4 hrs |
| 10 | Johnson & Graham | Digital (signal integrity), Measurement (high-speed probing) | 3–4 hrs |
| 11 | Making Embedded Systems | Embedded, Architecture & Abstraction | 2–3 hrs |
| 12 | Troubleshooting Analog Circuits (Pease) | Debugging, Measurement (diagnostic techniques) | 2–3 hrs |

### How to Run a Cross-Reference Session

1. Open the notebook section and the reference book side by side
2. For each page in the notebook, find the corresponding topic in the book
3. Compare: Are the equations the same? Do the descriptions match? Does the book add important caveats the notebook misses?
4. Mark discrepancies in the page's `review.notes` frontmatter field
5. If the notebook covers something the book doesn't, flag it for bench verification or engineer review

---

## Phase 6: Resolve Findings and Update Content

After each section is vetted:

1. **Fix clear errors** — wrong formulas, incorrect numbers, missing safety warnings
2. **Add qualifiers** — where claims are correct but missing context ("typical," "at room temperature," "for small signals")
3. **Flag unresolvable items** — claims that can't be verified from available sources get a visible note in the content (e.g., an admonition block: "This value is from bench experience and hasn't been cross-referenced against a published source")
4. **Update frontmatter** — mark the page as `reviewed`, record the method(s) used, add the date
5. **Re-read for tone** — after technical corrections, re-read to make sure the exploratory learning tone is preserved (don't accidentally turn it into a textbook)

---

## Estimated Total Effort

| Activity | Estimated Hours |
|----------|----------------|
| Phase 1: Build tracking system | 2–4 |
| Phase 2: Triage pass | 15–25 |
| Phase 3: Bench experiments (7–10 key experiments) | 10–15 |
| Phase 3: Procedure bench-testing | 8–12 |
| Phase 4: Engineer reviews (5–6 reviewers) | 15–25 (scheduling + sessions) |
| Phase 5: Book cross-reference sessions | 45–55 |
| Phase 6: Content updates | 30–50 |
| **Total** | **~125–185 hours** |

This is roughly equivalent to a part-time project over 2–4 months. The section priority ordering means the most critical sections gain confidence first, with the rest progressing steadily behind.
