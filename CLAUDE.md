# EE Notebook — Project Conventions

## Purpose

This is a personal engineer learning notebook — not a blog, tutorial site, or project showcase. Entries record concepts, experiments, procedures, patterns, and gotchas encountered while learning electronics and electrical engineering. The tone is exploratory and honest: "what I'm learning," not "what I'm teaching."

## Repository Structure

- **Hugo static site** using the [hugo-book](https://github.com/alex-shpak/hugo-book) theme
- Content lives in `content/docs/` organized into eight sections
- Built with `make html` (runs `hugo --minify`)
- Local dev server with `make server`

## Section Structure

Content is organized into eight sections, each a subdirectory of `content/docs/`:

| Weight | Directory | Title |
|--------|-----------|-------|
| 1 | `fundamentals/` | Fundamentals |
| 2 | `analog/` | Analog Electronics |
| 3 | `digital/` | Digital Electronics |
| 4 | `embedded/` | Microcontrollers & Embedded Systems |
| 5 | `audio-signal/` | Audio & Signal Processing |
| 6 | `radio-rf/` | Radio & RF |
| 7 | `measurement/` | Measurement & Test |
| 8 | `debugging/` | Debugging, Failure & Repair |

## Adding a New Entry

Most sections use a flat structure — create a markdown file directly inside the section directory:

```
content/docs/fundamentals/ohms-law.md
```

Frontmatter pattern:

```yaml
---
title: "Ohm's Law"
weight: 10
---
```

- **title**: Descriptive name for the entry
- **weight**: Controls ordering within the section; use increments of 10 to leave room for future entries

### Measurement & Test: Nested Structure

The `measurement/` section uses a 3-level structure to organize content by measurement situation rather than by instrument:

| Level | What it answers | Hugo structure |
|-------|----------------|----------------|
| **Level 1** — Use Case | "What am I working on?" | Subdirectory with `_index.md` under `measurement/` |
| **Level 2** — Measurement Intent | "What am I trying to learn?" | Pages (`.md` files) inside each L1 subdirectory |
| **Level 3** — Tool + Settings | "How do I measure this, specifically?" | Sections within L2 pages (not separate files) |

L1 subdirectories use `bookCollapseSection: true` in their `_index.md` frontmatter so they appear as collapsible items in the sidebar.

Example path: `content/docs/measurement/power-rails-supplies/ripple-and-noise.md`

L1 sections (in weight order):

| Weight | Directory | Title |
|--------|-----------|-------|
| 10 | `safety-high-energy/` | Safety & High Energy |
| 20 | `probing-technique/` | Probing & Measurement Technique |
| 30 | `continuity-connections/` | Continuity & Connections |
| 40 | `component-testing/` | Component Testing |
| 50 | `power-rails-supplies/` | Power Rails & Supplies |
| 60 | `signals-waveforms/` | Signals & Waveforms |
| 70 | `time-frequency-spectrum/` | Time, Frequency & Spectrum |
| 80 | `digital-logic-protocols/` | Digital Logic & Protocols |
| 85 | `audio-analog/` | Audio & Analog Circuits |
| 90 | `noise-interference-grounding/` | Noise, Interference & Grounding |
| 100 | `calibration-confidence/` | Calibration & Measurement Confidence |

## Content Conventions

- **Evergreen entries**: Entries get revised and expanded over time; they are not dated posts
- **No chronological structure**: No dates in filenames or frontmatter unless documenting a specific experiment with a date-sensitive result
- **Exploratory tone**: Write as someone learning, not lecturing; include uncertainty, questions, and corrections
- **Practical focus**: Prefer bench experience, real measurements, and working circuits over pure theory
- **Entry types**: Concepts, procedures, experiments, patterns, gotchas — no formal taxonomy required, just pick what fits

## Build & Verify

```sh
make html      # Build the site (hugo --minify)
make server    # Local dev server with live reload
make clean     # Remove build artifacts
```
