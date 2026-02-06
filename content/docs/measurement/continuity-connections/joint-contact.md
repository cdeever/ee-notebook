---
title: "Is This Joint Making Contact?"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is This Joint Making Contact?

Solder joints, crimp connections, header pins, socket contacts — any place two conductors are supposed to be electrically connected. A joint can look fine and still be open or resistive. This is the most basic electrical test, and it catches the most faults on newly built or aging boards.

## Continuity Testing

Continuity mode applies a small test current and beeps when resistance is below a threshold (typically < 30–50 Ω). Fast go/no-go for checking dozens of joints in sequence.

The beep threshold varies by meter — a 40 Ω cold solder joint might beep. Continuity mode tells "not open," not "good joint."

## Resistance Measurement

For quantitative assessment, measure in Ohm mode. A good joint reads near zero.

| Connection type | Expected resistance | Suspect if |
|----------------|-------------------|------------|
| Solder joint (through-hole) | < 0.1 Ω | > 1 Ω |
| Solder joint (SMD) | < 0.1 Ω | > 1 Ω |
| Crimp terminal | < 0.05 Ω | > 0.5 Ω |
| IC socket contact | < 0.1 Ω | > 1 Ω, or varies when wiggled |
| Header pin connection | < 0.1 Ω | > 0.5 Ω |
| PCB trace (short run) | < 0.5 Ω | Depends on trace width and length |

## Visual + Electrical Assessment

Combine magnification with electrical testing for suspect joints:

1. Visual inspection under magnification — look for cold joints (grainy, dull surface), insufficient wetting (solder ball sitting on pad), cracks, voids, or bridged pins
2. Measure resistance across the joint
3. Compare to adjacent known-good joints
4. Gently press on the joint while measuring — if resistance changes, the joint is cracked or cold

## Tips

- Use continuity mode for fast screening of many joints, then switch to resistance mode for suspect ones
- Null DMM lead resistance first (short probes together and note reading) — leads contribute 0.1–0.5 Ω
- For true milliohm measurements (trace resistance, contact resistance), use 4-wire (Kelvin) measurement
- Press or wiggle suspect joints while measuring — cracked and cold joints reveal themselves under mechanical stress

## Caveats

- The beep threshold varies by meter — most beep below 30–50 Ω, so a marginal joint may still beep
- Lead resistance matters below ~1 Ω — use relative/delta mode if available
- In-circuit measurements include parallel paths through components — isolate the joint if possible
- Capacitors in the circuit cause slowly rising resistance readings as the DMM's test voltage charges them
- A joint can look good visually and still be bad electrically — internal voids, cold joints under smooth exteriors (common with lead-free)
- A joint can look ugly (rough, dull) and be electrically perfect — common with lead-free solder
- BGA and QFN joints are invisible — assess only electrically or with X-ray

## In Practice

- Beep that cuts out momentarily when pressing on a joint indicates a cracked or cold solder connection
- Resistance that varies when wiggling a component indicates the joint is not mechanically sound
- Resistance reading that slowly rises instead of staying stable indicates a capacitor in the measurement path, not a joint problem
- Joint measuring > 1 Ω when similar joints measure < 0.1 Ω has excessive resistance — reflow or rework needed
- IC socket contact that measures differently after reseating was making poor contact — oxidation or bent pin likely
