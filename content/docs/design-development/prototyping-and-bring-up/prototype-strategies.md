---
title: "Prototype Strategies: Fast vs Faithful"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Prototype Strategies: Fast vs Faithful

Not every prototype serves the same purpose, and confusing the purpose leads to wasted time and money. By this stage, [proof-of-concept work]({{< relref "../proof-of-concept" >}}) has already answered the riskiest questions using breadboards, dev boards, and simulation. Now the question shifts from "can this idea work?" to "does this design work as a system on a real PCB?" Choosing the right prototype strategy means understanding what question needs answering — and building only enough hardware to answer it.

## The Prototype Spectrum

With proof-of-concept questions answered, PCB prototypes exist on a spectrum from first functional board to production-representative. Each level answers different questions and demands different investment.

**Functional prototype.** A custom PCB that implements the complete design, intended for testing and iteration. This is the first board where the layout matters, where component placement is deliberate, and where the design is expected to function as a system. It will have bugs — that's the point. The goal is to find them.

A functional prototype should include:
- All major circuit blocks, even if some are populated with placeholder values
- Test points on critical signals and power rails
- Debug connectors (JTAG, UART, etc.)
- Generous component spacing for rework access
- Extra I/O or expansion headers for flexibility

What it teaches:
- Whether the power supply design works under real load
- Whether signal integrity is acceptable on the actual PCB
- Whether the firmware can drive all the hardware
- Whether thermal behavior matches predictions

**Pre-production prototype.** A manufacturing-representative build intended for qualification and validation. The board is identical (or very nearly so) to what production will be. Components are final, assembly is done using production processes (pick-and-place, reflow), and the enclosure is the real one (or a close approximation). Pre-production prototypes are expensive and slow — they exist to verify that the design can be manufactured reliably, not to find design bugs (those should have been found on the functional prototype).

## When to Skip the Pre-Production Stage

Not every project needs both stages. The decision depends on risk, cost, and schedule:

- **Simple, low-risk designs** (an LED driver, a sensor breakout board) can often go straight from schematic to a single functional prototype that serves as the final product.
- **Production-bound designs** need a pre-production stage. Shipping a product that hasn't been built with production processes is a gamble.
- **Learning projects** rarely need pre-production prototypes. The functional prototype is the end product.

## Choosing the Right Strategy

A useful framework for choosing the appropriate PCB prototype stage:

| Question | Strategy |
|----------|----------|
| "Does this system work as designed?" | Functional prototype PCB |
| "Can this be manufactured reliably?" | Pre-production prototype |
| "Will this survive the field?" | Pre-production + environmental testing |

For earlier-stage questions — "does this physics work?" or "does this component do what we need?" — those belong in the [proof-of-concept]({{< relref "../proof-of-concept" >}}) phase before committing to a PCB.

## Tips

- Include generous test infrastructure on functional prototypes — test points, debug headers, and jumper-selectable options cost nothing on the schematic and pay for themselves during bring-up
- Order extra bare boards (5 instead of 3); the marginal cost is negligible and spares prevent a full re-order when rework damages the original
- Clearly define the question the prototype must answer before committing to fabrication — this prevents over-building or under-building for the current project stage

## Caveats

- **PCB prototypes take longer than expected.** Even with fast-turn PCB services (2-3 days for bare boards), the total turnaround — order boards, receive them, order components, assemble, test — is typically 1-2 weeks
- **Order extra boards.** The marginal cost of 5 boards vs 3 is negligible with most fabricators; extra boards provide insurance when the first one gets damaged during rework or when a modification needs testing without destroying the original
- **Functional prototypes should include test infrastructure.** Test points, debug headers, jumper-selectable options, and unpopulated footprints for alternate components all cost nothing on the schematic and pay dividends during bring-up
- **Don't optimize the functional prototype for cost.** The functional prototype exists to find bugs and validate the design — use larger footprints than production, add extra decoupling, and include debug features; cost optimization belongs on the pre-production revision
- **Pre-production prototypes must be built with production processes.** A pre-production board assembled by hand doesn't validate manufacturing; use the same assembly house and process planned for production
