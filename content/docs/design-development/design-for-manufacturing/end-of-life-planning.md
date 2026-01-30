---
title: "End-of-Life Planning"
weight: 60
---

# End-of-Life Planning

Every product eventually reaches end-of-life — the point where it's no longer manufactured, supported, or viable. Planning for this isn't pessimism; it's engineering discipline. A product designed without end-of-life awareness will eventually surprise its creators with an urgent crisis: a critical component goes obsolete with no replacement, a supplier exits the market, or the installed base needs support long after anyone remembers how the product works. Thinking about end-of-life during the design phase — when you still have options — prevents these crises from becoming emergencies.

## Component End-of-Life

Components have lifecycles. A chip that's in full production today will eventually move to "not recommended for new designs" (NRND), then to "last-time buy" (LTB), then to obsolete. The timeline varies wildly: a popular 555 timer may be in production for fifty years, while a specialized RF transceiver might last five. Understanding where your key components sit in their lifecycle affects the longevity of your entire product.

Signs a component is approaching EOL:

- **NRND status.** The manufacturer is still making it but actively discouraging new designs from using it. This is the early warning — the factory is winding down, and production will end within a few years.
- **Single fab location.** If the component is made in only one facility, any disruption (natural disaster, political event, equipment failure) can end availability abruptly.
- **Declining distributor stock.** When multiple distributors show declining inventory with no restocking, the supply chain is emptying out.
- **Manufacturer acquisition or restructuring.** When a semiconductor company is acquired, product lines are often rationalized. Parts from the acquired company's portfolio may be discontinued.
- **No new package options.** If the manufacturer is offering the chip only in legacy packages (DIP, SOIC) and not investing in modern packages (QFN, WLCSP), it's a maintenance product, not a growth product.

Mitigation strategies during design:

- **Choose components with long expected lifetimes.** Automotive-qualified parts and industrial-grade components tend to have longer production runs than consumer-grade parts.
- **Design for second sources.** If two manufacturers make functionally equivalent parts with compatible pinouts and specifications, your design survives the loss of either one.
- **Identify critical single-source components.** Any component where no substitute exists is a risk. Document the risk and the contingency plan during design, not after the last-time-buy notice arrives.
- **Use industry-standard interfaces.** SPI, I2C, UART, and standard power regulator topologies have broad component ecosystems. Proprietary interfaces lock you into a single vendor's roadmap.

## Last-Time Buys

When a manufacturer announces end-of-life for a component, they typically offer a last-time buy (LTB) window — a final opportunity to purchase parts before production ceases. The LTB decision requires balancing several factors:

- **Remaining product lifetime.** How many more years will the product be manufactured? How many units per year?
- **Field support requirement.** How many spare components are needed for warranty repairs and field maintenance?
- **Storage limitations.** Some components degrade in storage — moisture-sensitive devices, electrolytic capacitors, batteries. A twenty-year supply of components that expire in five years is worthless.
- **Financial commitment.** Buying a large stock of components ties up capital and creates inventory management overhead. If the product is subsequently redesigned to eliminate the part, the stock becomes waste.
- **Broker market.** After a component goes obsolete, it often remains available through brokers and aftermarket distributors — at significantly higher prices and with counterfeit risk. Relying on the broker market is a gamble, not a strategy.

The LTB calculation is fundamentally a bet on the future: how many units will you build, how many will fail in the field, and how long until a redesign makes the component unnecessary? Conservative estimates are safer than optimistic ones. Running out of a critical component with no alternative halts production entirely.

## Redesign Triggers

At some point, maintaining the current design becomes more expensive than redesigning. Common triggers:

- **Component obsolescence.** A critical part goes EOL and no pin-compatible replacement exists. The board must be redesigned to accommodate a different component.
- **Cost escalation.** As components become scarce, prices rise. When the BOM cost of the existing design exceeds the amortized cost of a redesign, it's time to redesign.
- **Regulatory changes.** New environmental regulations (RoHS updates, REACH additions), safety standards, or wireless certification requirements may force design changes regardless of component availability.
- **Performance obsolescence.** The market has moved on — a 10-year-old product's performance no longer meets customer expectations, even if the hardware still functions correctly.
- **Tooling and process changes.** If your assembly house upgrades their equipment and no longer supports the component packages or board technology used in your design, you may be forced to find a new assembler or redesign.

The redesign decision should consider total lifecycle cost: the cost of redesigning, requalifying, and transitioning production versus the cost of continuing to maintain the current design with diminishing component availability and rising part costs.

## Product Lifetime vs Component Lifetime

A fundamental design constraint that's often overlooked: the product's intended service life must be compatible with the expected availability of its components. A medical device designed for a 15-year service life that uses a consumer-grade microcontroller with a 5-year expected production run has a built-in lifecycle crisis.

Alignment strategies:

- **Match component grade to product lifetime.** Automotive and industrial components have longer production commitments than consumer parts. The premium is often modest relative to the cost of a forced redesign.
- **Design for upgradability.** If a module or sub-assembly can be replaced with a newer version without redesigning the entire product, the product can outlive individual components.
- **Plan revision cadence.** Some manufacturers plan regular refreshes — perhaps every 3-5 years — where the product is redesigned to use current components while maintaining the same external interface and functionality.
- **Contractual production commitments.** Some component manufacturers offer long-term supply agreements, guaranteeing availability for a defined period. These agreements have costs and limitations, but they provide planning certainty.

## Sustainability and Environmental Considerations

End-of-life isn't just about when you stop making the product — it's about what happens to the product after its useful life is over.

- **RoHS compliance.** The Restriction of Hazardous Substances directive limits the use of lead, mercury, cadmium, and other hazardous materials in electronic equipment. Designing for RoHS compliance from the start avoids costly transitions later. Lead-free solder, compliant components, and proper documentation of exemptions where they apply.
- **WEEE (Waste Electrical and Electronic Equipment).** Regulations requiring manufacturers to take responsibility for the collection and recycling of electronic waste. Product design affects recyclability — how easily can materials be separated? Are hazardous materials contained and labeled?
- **Material selection.** Choosing materials that are recyclable or biodegradable where possible. Minimizing the variety of plastics in enclosures (mixed plastics are harder to recycle). Avoiding potting compounds that prevent component recovery.
- **Battery disposal.** Products containing batteries need clearly labeled battery types and accessible battery removal. Some jurisdictions require battery take-back programs.

Sustainability isn't just regulatory compliance — it's also a design constraint that affects material choices, assembly methods, and product architecture. Considering it during design is far easier than retrofitting it after production begins.

## Documentation Archival

Design files must be retrievable years — sometimes decades — after the product was designed. This is a surprisingly difficult problem:

- **File format longevity.** Will your EDA tool's native format be readable in 20 years? Proprietary formats become inaccessible when tools are discontinued. Exporting to open or widely-supported formats (PDF for schematics, Gerber/ODB++ for fabrication, CSV for BOMs) creates insurance against tool obsolescence. See also [documentation handoff]({{< relref "/docs/design-development/design-for-manufacturing/documentation-handoff" >}}) for assembling the complete package.
- **Storage media.** The CD-ROM you burned in 2005 may be unreadable today. USB drives fail. Hard drives crash. Cloud services shut down. Critical design archives need redundant storage on current media, with periodic verification that the files are still readable.
- **Institutional knowledge.** Design rationale, component selection reasoning, and manufacturing lessons live in people's heads and in informal communications (emails, chat messages) that may not be archived. Capturing this knowledge in formal design documentation before it's lost is essential for long-term maintainability.
- **Tool versions.** The design file may be readable but not editable if the tool version that created it is no longer available. Archiving the tool installation (or at minimum, noting the tool version and build number) ensures that files can be reopened if needed.
- **Regulatory documentation.** Certification test reports, compliance declarations, and regulatory submissions must be retained for the life of the product and often beyond. These documents have legal significance and must be retrievable on demand.

## Transition Planning

When a product is replaced by a successor, the transition affects more than just the manufacturing line:

- **Installed base support.** Existing customers with deployed units need continued access to spare parts, firmware updates, and service documentation. A transition plan defines how long the old product will be supported and what support means (parts availability, repair service, documentation access).
- **Overlap period.** Ideally, the new product and the old product are both available for a period, allowing customers to transition on their schedule rather than being forced.
- **Backward compatibility.** If the new product must interface with existing systems, backward compatibility constraints may drive design decisions. Understanding these constraints early prevents last-minute compatibility crises.
- **Knowledge transfer.** The engineering team supporting the old product may not be the team designing the new one. Design documentation, test procedures, and field failure data must transfer from the old team to the new one.
- **Customer communication.** End-of-life notices, transition timelines, and migration guides help customers plan their own transitions. Surprising customers with abrupt discontinuations damages trust and creates support crises.

## Gotchas

- **"This part will always be available" is never true.** Every component has a finite production life. The question is whether the product's life will exceed the component's life, and the answer is more often "yes" than most designers expect.
- **Last-time buy quantities are hard to estimate.** Overestimate and you waste money on inventory you'll never use. Underestimate and you run out before the redesign is ready. Build in margin and revisit the estimate as conditions change.
- **Broker-sourced components carry counterfeit risk.** After a component goes obsolete, the aftermarket fills with counterfeits — parts that test correctly at incoming inspection but fail in the field. Independent testing of broker-sourced parts is essential but adds cost and time.
- **File formats are more fragile than you think.** A design file that can't be opened is a design that doesn't exist. Export to multiple formats and verify the exports periodically.
- **End-of-life planning feels premature during design.** It's not. The design choices that enable graceful end-of-life — second sources, standard interfaces, modular architecture — are easiest to implement at the beginning and hardest to retrofit later.
- **Sustainability regulations are tightening.** Designing for current regulations is the minimum. Designing with an eye toward anticipated future regulations avoids forced redesigns when rules change.
