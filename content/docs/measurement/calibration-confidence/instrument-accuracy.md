---
title: "Is My Instrument Accurate Enough for This?"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is My Instrument Accurate Enough for This?

Matching instrument specs to measurement needs. A 3½-digit DMM is perfect for checking a 5V power rail and useless for measuring a 1.000V reference to four digits. Knowing when the instrument is the limiting factor — and when it's more than adequate — prevents both false confidence and unnecessary upgrades.

## DMM Resolution and Accuracy

Resolution is the smallest increment the display can show. Accuracy is how close the reading is to the true value. They're different things.

| DMM type | Display counts | Resolution (on 4V range) |
|----------|---------------|-------------------------|
| 3½-digit | 2000 | 1 mV |
| 4½-digit | 20,000 | 0.1 mV |
| 5½-digit | 200,000 | 0.01 mV |
| 6½-digit | 2,000,000 | 0.001 mV |

**Accuracy specification:** Typically stated as ±(% of reading + counts)

Example: ±(0.5% + 3 counts) measuring 5.000V = ±(0.025V + 0.003V) = ±0.028V

So the true voltage is somewhere between 4.972V and 5.028V.

| Measurement | Required accuracy | 3½-digit DMM sufficient? |
|------------|-------------------|-------------------------|
| Is 5V rail present? (±10%) | ±0.5V | Yes |
| Is 3.3V rail within spec? (±5%) | ±0.165V | Yes |
| Matching 1% resistors | ±0.5% or better | Marginal |
| Checking 2.500V reference to ±0.1% | ±2.5 mV | No — need 4½ digits |

## Oscilloscope Accuracy

Most bench oscilloscopes have 3–5% vertical accuracy — vastly worse than a DMM. The scope shows waveshape; the DMM tells the actual voltage.

| Measurement | Use scope? | Use DMM? |
|------------|-----------|----------|
| DC voltage to ±1% | No | Yes |
| Waveform shape, edges, ringing | Yes | No |
| Peak-to-peak on a fast signal | Yes (only option) | N/A |

**Sample rate:** Nyquist rule requires at least 2× the highest frequency component. For accurate waveform reconstruction, 5–10× is needed.

| Signal type | Minimum sample rate | Recommended |
|------------|--------------------|-----------------------|
| 1 MHz square wave (~3 ns edges) | 600 MS/s | 2 GS/s |
| 1 ns rise time | 2 GS/s | 5–10 GS/s |

## When the Instrument Isn't Enough

**Signs of hitting instrument limits:**
- Reading fluctuates in last digit more than expected from signal
- Trying to see a difference smaller than accuracy spec
- Scope displays clean square wave but ringing is suspected below bandwidth
- FFT noise floor higher than signal being sought

**Options:**
- DMM accuracy insufficient → use 4½/5½-digit DMM or check against known reference
- Scope bandwidth too low → higher-bandwidth probe/scope or infer from slower measurements
- Noise floor too high → average, use bandwidth limiting, improve probe grounding

## Tips

- DMM accuracy degrades at extremes of each range — measuring 0.5V on a 40V range wastes most resolution
- Use the lowest range that accommodates expected voltage
- Scope timing accuracy (~50 ppm) is much better than amplitude accuracy (~3–5%)

## Caveats

- Accuracy specs assume 23°C ±5°C and within calibration period — outside these, accuracy degrades
- AC accuracy is much worse than DC accuracy on most DMMs, and degrades with frequency
- Sample rate per channel may be lower than headline rate when using multiple channels
- Memory depth limits effective sample rate at long timebases
- Averaging reduces random noise but hides intermittent events

## In Practice

- Measurement that fluctuates in last two digits when signal should be stable indicates instrument resolution/accuracy limit
- Two instruments disagreeing on same measurement indicates at least one is at its accuracy limit — trust the one with better specs
- Reading that seems wrong but is within accuracy spec may actually be correct — the spec defines expected uncertainty
- Attempt to measure smaller difference than accuracy spec is meaningless — get a better instrument
