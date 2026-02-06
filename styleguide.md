---
title: "Content Style Guide"
weight: 1
---

# Content Style Guide

This document defines the structure, terminology, and intent of pages in the Engineer’s Notebook. Its purpose is consistency — not just in formatting, but in how readers develop **applied reasoning** at the bench.

The goal is that after reading a handful of pages, a reader subconsciously knows:
- where to find practical guidance
- where to look for traps
- how theory connects to real measurements and observed behavior

---

## Page Levels

The notebook is organized into three conceptual levels:

- **L0** — Major domains (e.g. *Fundamentals*)
- **L1** — Topic groupings within a domain (e.g. *Laws & First Principles*)
- **L2** — Individual concepts or techniques (e.g. *Ohm’s Law*)

Each level has a distinct purpose and writing style.

---

## L0 Pages (Domain Overviews)

**Purpose:**  
Orient the reader. Explain *why this domain exists* and *when they should come here*.

**Tone:**  
High-level, conceptual, motivating.

**Characteristics:**
- No equations
- No procedures
- Minimal examples
- Focus on scope and mental framing

**Typical Structure:**
- Short conceptual introduction
- Why this domain matters
- List of child L1 sections with brief descriptions

**Example:**  
⚡ *Fundamentals* — Nature’s rules and universal constraints.

---

## L1 Pages (Concept Groupings)

**Purpose:**  
Define a family of ideas and establish the *non-negotiable constraints* that bind them.

**Tone:**  
Authoritative but explanatory.

**Characteristics:**
- May include equations (sparingly)
- Explains what never fails versus what is commonly misapplied
- No step-by-step procedures
- Very limited numeric examples

**Typical Structure:**
- Conceptual framing
- What this section covers
- Curated list of L2 pages

**Example:**  
*Laws & First Principles* — The constraints every circuit obeys.

---

## L2 Pages (Core Learning Units)

**Purpose:**  
Teach one concept deeply enough to apply it correctly at the bench.

This is where theory meets reality.

**Tone:**  
Practical, grounded, experience-informed.

---

## Standard L2 Section Order

Not every L2 page must contain every section, but **when a section exists, its name and intent are fixed**.

---

### 1. Core Explanation  
(Title varies: *The Relationship*, *How It Works*, *What’s Happening Physically*, etc.)

- Explains the concept itself
- May include equations
- Minimal numeric examples
- Focus on correctness, not application

---

### 2. When It Applies / When It Doesn’t  
(Optional but common)

- Defines scope and limits
- Clarifies assumptions
- Separates ideal behavior from real-world behavior
- Prefer **plain-language limits** (“narrow range of conditions”, “specific situations”) over analysis jargon

---

### 3. Tips

**Purpose:**  
Enable *correct use* of the concept.

**Tips answer:**  
> “What should I do or check to stay on the happy path?”

**What goes here:**
- Rules of thumb
- Safe defaults
- Sanity checks
- Bench techniques
- Numeric guidance that teaches *scale*

**Guidelines:**
- Actionable but not step-by-step
- Forward-looking
- May include specific values or ranges
- Assumes the concept is being applied correctly

**What does NOT go here:**
- Failure symptoms
- Root-cause analysis
- Interpretive diagnosis
- Explanations of why something went wrong

**Example:**
- “500 mA through 100 mΩ drops 50 mV — that matters in low-voltage rails.”

---

### 4. Caveats

**Purpose:**  
Prevent mistakes and false confidence.

**Caveats answer:**  
> “Where does this break, mislead, or quietly fail?”

**What goes here:**
- Common failure modes
- Measurement traps
- Assumption violations
- Situations where intuition breaks
- “This works… until it doesn’t”

**Guidelines:**
- Warning-oriented
- Experience-based
- Numbers only if they explain the trap
- No happy-path examples

**What does NOT go here:**
- How failures appear at the bench
- Diagnostic interpretation
- What to do differently next time

**Example:**
- “A DMM measuring RMS often assumes a sinusoid — non-sinusoidal waveforms can produce misleading readings.”

---

### 5. In Practice

**Purpose:**
Tie theory to **what is observed at the bench**.

In Practice answers:
> “How does this concept explain the measurements or symptoms I’m seeing right now?”

**What goes here:**
- Observable symptoms (resets, distortion, lockups, thermal behavior)
- Measurements that don’t match expectations
- How correct theory explains confusing or misleading observations
- Interpretation that links multiple observations together

**Guidelines:**
- Interpretive, not procedural
- No new techniques (those belong in Tips)
- No new warnings (those belong in Caveats)
- May reference later topics only as explanatory anchors
- Organize by **observable behavior**, not by component or subsystem

**Preferred framing:**
- “often shows up as…”
- “commonly appears when…”
- “a frequent cause of this symptom is…”
- “this measurement usually indicates…”

**In Practice is not a summary — it is a bridge between laws and observations.**

---

## Section Exceptions by Domain

Not every domain benefits equally from all standard sections. The following exceptions apply:

| Domain | Tips | Caveats | In Practice |
|--------|------|---------|-------------|
| Most sections | ✓ | ✓ | ✓ |
| **Design & Development** | ✓ | ✓ | — |

Design & Development pages cover process, methodology, and decision-making rather than circuit behavior. In Practice — which ties theory to observable measurements and symptoms — does not apply. Tips and Caveats remain required.

---

## Section Boundary Rule (L2 Pages)

Each L2 section has a single job:

- **Tips** — how to succeed
- **Caveats** — how things fail
- **In Practice** — how behavior and failures *appear in measurements or symptoms*. Make sure to add distinction to unrelated items and add bold for the main symptom

If a paragraph contains:
- advice **and** diagnosis → split it
- warnings **and** interpretation → split it
- techniques **and** symptoms → move techniques to Tips

**If it explains *why something looks wrong*, it belongs in In Practice.**
**If it explains *how to avoid it*, it belongs in Tips or Caveats.**

---

## Narrative Voice

Use a neutral, tool-centric voice.

Avoid first-person and second-person phrasing (*I*, *we*, *you*, *your*).  
The goal is to describe how laws, models, and measurements behave — not to tell the reader what they personally do.

**Preferred framing:**
- “In practice…”
- “At the bench…”
- “This shows up as…”
- “A common sanity check is…”
- “When a measurement doesn’t line up…”

**Avoid:**
- “When you see…”
- “The first thing you reach for…”
- “If you do this…”
- “We can tell that…”

Also avoid:
- Long multi-symptom paragraphs — prefer one observable behavior per paragraph

This keeps the text readable without projecting habits, authority, or assumptions onto the reader.

---

## Consistent Terminology (Canonical)

Use these terms verbatim across all pages:

- **Tips**
- **Caveats**
- **In Practice**

Avoid:
- "Practical Considerations"
- "Why This Matters"
- "Practice Notes" (unless a special callout)

Consistency beats cleverness.

---

## Examples and Numbers

> **If an example uses realistic values and teaches scale, keep it.  
> If it only restates the equation, generalize it.**

- Concrete numbers are encouraged at L2
- Especially valuable for:
  - Power
  - Voltage drops
  - Currents
  - Thermal effects
- Avoid contrived algebra-only examples

This is an engineer’s notebook, not a textbook.

---

## Tone Contract

Across all levels:

- Prefer clarity over elegance
- Prefer physical intuition over math gymnastics
- Avoid analysis-native jargon unless it is explicitly being taught
- Treat mismatches as clues, not failures
- Assume the reader will test this on a real circuit

If something doesn’t add up, the law isn’t wrong — the application is.

---

## Taxonomy Principle

Content is organized by **how engineers reason about behavior** — not by textbook classification.

- **Fundamentals** = device understanding (what it is, how it behaves)
- **Analog/Digital/Power** = usage depth (circuit techniques, design patterns)

The traditional "active vs passive" split is avoided because it doesn't match how engineers think at the bench. A diode isn't "active" (no gain), but it's not passive like a resistor either. Organizing by behavioral reasoning resolves these ambiguities.

---

## Final Principle

This notebook is not about memorizing laws.

It's about building **applied reasoning**:
- knowing when a law applies
- knowing when it doesn't
- understanding what real measurements and symptoms are telling you when the numbers don't match

That skill is what turns theory into working hardware.
