# EE Notebook — Project Conventions

## Purpose

This is a personal engineer learning notebook — not a blog, tutorial site, or project showcase. Entries record concepts, experiments, procedures, patterns, and gotchas encountered while learning electronics and electrical engineering. The tone is exploratory and honest: "what I'm learning," not "what I'm teaching."

## Repository Structure

- **Hugo static site** using the [hugo-book](https://github.com/alex-shpak/hugo-book) theme
- Content lives in `content/docs/` organized into eight volumes
- Built with `make html` (runs `hugo --minify`)
- Local dev server with `make server`

## Volume Structure

Content is organized into eight volumes, each a subdirectory of `content/docs/`:

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

Create a markdown file directly inside the appropriate volume directory (flat structure, no subdirectories within volumes):

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
- **weight**: Controls ordering within the volume; use increments of 10 to leave room for future entries

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
