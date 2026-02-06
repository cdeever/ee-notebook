---
title: "Post-Mortems & Lessons Learned"
weight: 70
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Post-Mortems & Lessons Learned

A debug session teaches something — but only if it gets captured. The post-mortem is where a painful debugging experience becomes a pattern that's instantly recognizable next time.

## Why Bother

Writing up what happened after the fix feels like extra work when the temptation is to move on. Here's why it's worth doing:

- **Details fade fast.** The details that seem obvious now — the exact symptom, the misleading first hypothesis, the measurement that finally revealed the root cause — will fade in weeks. Write them down while they're fresh
- **Pattern recognition compounds.** The more failures documented, the faster the next one gets recognized. A post-mortem library is a personal debugging accelerator
- **"What fooled me" is the most valuable part.** The root cause is interesting. The hour wasted before finding it is *instructive*. Recording wrong turns builds the instinct to avoid them

## Post-Mortem Template

A lightweight structure that captures the essential information. Not every field applies to every failure — skip what isn't relevant.

```
## [Short descriptive title]

**Date:** [when the debug session happened]
**Board/Circuit:** [what you were working on]

### Symptom
What was observed. Be specific — "doesn't work" is not a symptom.
"Output voltage reads 2.1 V instead of 3.3 V under load" is.

### Category
Never worked / Stopped working / Works sometimes

### Root Cause
What was actually wrong. Component, connection, design error, etc.

### How Found
The sequence of steps that led to identifying the root cause.
This is often the most useful section for pattern matching later.

### What Fooled Me
Wrong hypotheses, misleading measurements, red herrings,
and assumptions that turned out to be incorrect.

### Fix
What you did to repair it.

### Verification
What tests confirmed the fix.

### Lesson
The one thing you'd do differently next time — or the one thing
you'll check first if you see this symptom again.
```

### Example

```
## LDO output low under load

**Date:** 2025-03-15
**Board/Circuit:** Custom sensor board, 3.3 V rail (AMS1117-3.3)

### Symptom
3.3 V rail reads 2.1 V when processor and sensors are powered.
Rail reads 3.3 V with processor held in reset.

### Category
Stopped working (board was functional for ~6 months)

### Root Cause
C12 (22 µF electrolytic on LDO output) had ESR of 15 Ω.
LDO requires < 0.5 Ω ESR for stability. LDO was oscillating,
causing effective voltage drop and excessive current draw.

### How Found
1. Measured rail voltage — 2.1 V. Suspected overcurrent
2. Measured current — 180 mA (expected ~90 mA). Confirmed overcurrent
3. Scoped the rail — saw 800 mVpp oscillation at ~45 kHz
4. Checked LDO datasheet — output cap ESR requirement: 0.1–0.5 Ω
5. Measured C12 ESR — 15 Ω. Bad cap

### What Fooled Me
Initially suspected the processor was latched up and drawing
excess current. Spent 20 minutes investigating the processor
before scoping the rail. Should have scoped first.

### Fix
Replaced C12 with new 22 µF electrolytic. ESR measured 0.15 Ω.

### Verification
Rail stable at 3.28 V under load. No oscillation visible on scope.
Current draw 92 mA (matches expected). Ran for 4 hours on bench.

### Lesson
When a rail is low under load, scope it before investigating
downstream. Oscillation from bad output caps is common on LDOs
and always presents as "voltage too low."
```

## Building a Pattern Library

Organize post-mortems by **symptom**, not by root cause. A new failure presents as a symptom first, and the cause needs to be found — so the lookup path should match the diagnostic path.

**Useful categories:**
- Board dead / no power
- Voltage wrong (high, low, absent, noisy)
- Signal wrong (distorted, missing, intermittent)
- Communication failure (I2C, SPI, UART)
- Thermal failure (works cold, fails hot)
- Mechanical intermittent
- "Works on bench, fails in the field"

Over time, patterns emerge. The same handful of root causes appear over and over — bad caps, bad connections, power problems — and instinct for where to look first sharpens naturally.

## "What Fooled Me" — A Growing List

This section is intended to be expanded over time with actual debugging experiences. Seed entries based on common traps:

- **Assumed the power was fine because the board "mostly worked."** Partially-degraded power looks like everything except a power problem
- **Measured voltage at the regulator output, not at the IC supply pin.** A 200 mV drop across a trace was the entire problem
- **Trusted the schematic when the board had been reworked.** A hand modification wasn't documented
- **Replaced a component without checking what killed it.** The replacement died the same way because the root cause was upstream
- **Blamed firmware because the symptom was data-dependent.** The data pattern just happened to correlate with the load pattern that triggered a hardware marginal

## "What to Check First Next Time"

A personal checklist built from experience. Start with the universal items and add entries as post-mortems accumulate.

1. **All power rails correct?** Measure at the point of use, not at the source
2. **Any visual damage?** Look before probing
3. **What changed?** If it was working before, something changed — find it
4. **Current draw normal?** Abnormal current is the fastest indicator of many faults
5. **Scope the supply rail** — Ripple, oscillation, and transient dips hide from DMMs
6. **Check connectors and cables** — The most likely mechanical failure point
7. **Check the obvious things that seem fine** — They often aren't

This list should grow with every post-mortem. Whenever a post-mortem concludes with "next time I'll check X first," add X here.
