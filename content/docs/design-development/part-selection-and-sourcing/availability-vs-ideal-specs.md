---
title: "Availability vs Ideal Specs"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Availability vs Ideal Specs

The perfect component that cannot be bought is useless. This is one of the hardest lessons in electronics design, especially for engineers who approach part selection as a purely technical exercise. Days can disappear finding the op-amp with the ideal noise floor, bandwidth, and power consumption, only to discover it has a 30-week lead time or is only available in quantities of 2,500. Availability is a design constraint, not a procurement inconvenience, and it should be considered from the very beginning of part selection.

## Starting with Availability

The traditional part selection workflow goes: define requirements, search for parts that meet them, then check if those parts are available. This feels logical but leads to frustration and schedule delays because the "perfect" part often turns out to be unobtainable.

A more practical workflow flips the order for initial exploration: check what is available in the general category, then filter for requirements within the available options. This does not mean accepting any part that is in stock — it means understanding the landscape of what is actually buyable before narrowing down on specifications.

In practice, this looks like: open a distributor's parametric search (Digi-Key, Mouser, or similar), filter by the general component type (e.g., LDO voltage regulators), then filter for "in stock" before applying any electrical parameters. This immediately shows the universe of options that can actually be obtained. Then apply specifications (output voltage, current, dropout voltage, package) within that available set.

A useful personal rule: never spend more than 15 minutes evaluating a part before checking its stock status and lead time. It sounds crude, but it prevents falling in love with components that exist only in datasheets and distributor archives.

## Distributor Stock as a Design Input

Stock levels at major distributors reveal more than just whether a part can be bought today. They also signal how widely the part is used, how healthy its supply chain is, and how likely it is to remain available.

**High stock across multiple distributors** (thousands of units at Digi-Key AND Mouser AND Arrow) suggests a popular, actively manufactured part. Supply disruptions are less likely, and even if one distributor runs out, others will have stock. This is the ideal situation for a design-in.

**Low stock at one distributor only** could mean the part is niche, near end-of-life, or recovering from an allocation event. It warrants investigation — check the manufacturer's website for lifecycle status, check other distributors, and look for Product Change Notifications (PCNs).

**"Factory lead time" with zero stock everywhere** means the part is either allocated (demand exceeds supply) or being produced in limited quantities. Unless there is willingness to wait months and place a large order, this part is not a viable design choice for near-term projects.

**Minimum order quantities** are another availability constraint. A part that is "in stock" but only sold in reels of 3,000 is not available for a prototype run of five boards. Check whether cut tape or individual quantities are offered. Most major distributors sell from cut tape for standard passives and common semiconductors, but less common parts may require full reel purchases.

## When to Compromise on Specs

Not every specification is equally important. Understanding which parameters are critical and which have margin allows for intelligent compromises when availability is limited.

**Compromise candidates:** power dissipation (if there is thermal margin), package size (if the board has space), quiescent current (if power budget has margin), bandwidth (if the design operates well below the signal frequency), input offset voltage (if the signal is large relative to the offset).

**Non-negotiable specifications:** supply voltage range (the part must work with the rail), output current capability (must supply the load), logic level compatibility (must interface with other ICs), operating temperature range (must survive the environment), safety-critical ratings (insulation voltage, current limits for protection devices).

A useful framework: for each specification, ask "what happens if this parameter is 2x worse than ideal?" If the answer is "nothing noticeable," it is a compromise candidate. If the answer is "the circuit fails" or "the product does not meet its spec," it is non-negotiable.

## When Specs Are Non-Negotiable

Sometimes there is no acceptable compromise, and the only options are to wait for the right part or redesign around its unavailability:

- **Precision analog applications** where noise, offset, or linearity directly determine the product's measurement accuracy. A 10x worse noise floor may make the product unfit for purpose.
- **Safety-critical components** where the rating provides a required safety margin. Using a 50V capacitor where a 100V rating is required to meet safety standards is not a valid compromise.
- **Interface compatibility** where the part must match an existing connector pinout, communication protocol, or voltage level. An I2C sensor cannot be substituted with an SPI sensor if the bus is already defined.
- **Form factor constraints** where only one package size fits the available board space. If the design requires a SOT-23-5 and the alternate is only available in SOIC-8, there may not be room.

In these cases, the options are: wait for supply, find a true drop-in alternate from another manufacturer, or redesign the circuit to accommodate a different part. The redesign option is more expensive but sometimes faster than waiting for a component with an uncertain delivery date.

## The Shopping List Approach

Before committing to any critical component, a good practice is to identify at least two or three candidates that could work. This is not just a supply chain strategy — it is a design strategy that forces a clear understanding of what is truly required versus what is merely preferred.

The process:

1. **Define the hard requirements.** What parameters must the part absolutely satisfy? Write these down explicitly.
2. **Search broadly.** Look for all parts that meet the hard requirements, without applying soft preferences (preferred manufacturer, preferred package, lowest cost) yet.
3. **Shortlist two or three candidates.** Select parts that are available, from different manufacturers if possible, with different strengths (one optimized for performance, one for cost, one for availability).
4. **Evaluate the shortlist.** Read the full datasheet for each candidate. Compare on the parameters that matter for the application. Check application notes and errata.
5. **Select a primary and document the alternates.** Choose the best option for the primary design, but record the alternates in the BOM with notes on any design adjustments needed to use them.

This approach connects directly to [Second-Source Strategies]({{< relref "/docs/design-development/part-selection-and-sourcing/second-source-strategies" >}}) and ensures that supply chain flexibility is built into the design from the start, not retrofitted during a crisis.

## Real-World Examples

**The unavailable regulator.** A power supply was designed around a specific low-noise LDO that had excellent PSRR and was available in a tiny DFN package. By the time the design was ready for prototyping, the part had gone to a 26-week lead time. The redesign took a week: different LDO, different footprint, different output capacitor requirements. Had an alternate been identified during the initial design, the switch would have taken an afternoon.

**The over-specified op-amp.** A sensor interface design called for a "precision, low-noise, rail-to-rail, low-power" op-amp. Searching with all those parameters as hard requirements returned exactly two parts — one from a single manufacturer with mediocre stock. Relaxing the "rail-to-rail output" requirement (which analysis showed was not actually needed because the output range was well within the supply rails) opened up dozens of readily available alternatives.

**The passive that was not passive.** A design called for a 10uF X7R ceramic capacitor in a 0402 package. This combination is physically limited — 10uF in 0402 requires aggressive dielectric formulations that have severe voltage derating. The "available" parts had only 2-3uF of actual capacitance at the operating voltage. Switching to an 0603 package provided the actual capacitance needed and was available from multiple vendors.

## Tips

- Always filter parametric searches for "in stock" before applying electrical parameters — this immediately narrows the field to parts that can actually be obtained
- For each specification, apply the "2x worse" test: if the parameter degrades by 2x, does the circuit still work? If so, that spec is a compromise candidate
- Shortlist at least two or three candidates from different manufacturers for every critical component before committing to one
- Check stock status and lead time within the first 15 minutes of evaluating any new part — this prevents wasted effort on unobtainable components

## Caveats

- **"In stock" does not mean "available at the needed quantity."** A distributor may show 50,000 units in stock, but those could be allocated to existing orders — always check the available-to-ship number, not just the total stock
- **Stock levels change fast.** The 10,000 units in stock today could be zero tomorrow if a large customer places an order — for critical components on longer-timeline projects, consider placing an early order to secure inventory
- **Distributor parametric searches miss parts.** Not every manufacturer's part is in every distributor's database, and parametric fields may be incomplete — if the search returns no results, try different distributors, check manufacturer websites directly, or broaden the search parameters
- **Sample availability is not production availability.** Getting 10 free samples from a manufacturer does not mean 1,000 units can be purchased at a reasonable price on a reasonable timeline — verify production pricing and availability before designing in a sample part
- **Pricing at prototype quantities is misleading.** A part that costs $5 in single quantities might cost $0.50 at 1,000 units, and vice versa — check pricing at the volume actually needed
- **Geographic availability varies.** A part readily available from U.S. distributors may be hard to source in other regions, and vice versa — if manufacturing is overseas, check availability at distributors that serve that region
