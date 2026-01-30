---
title: "Distributor Realities"
weight: 50
---

# Distributor Realities

Understanding the electronics distribution ecosystem is a practical skill that most engineering curricula never teach. Where you buy components matters — it affects pricing, lead time, authenticity, and your ability to get technical support when something goes wrong. The distribution landscape ranges from major authorized distributors with millions of parts in stock to gray-market brokers selling pulls from used boards. Navigating this landscape effectively saves money, reduces risk, and keeps projects on schedule.

## Authorized vs Unauthorized Distributors

The most fundamental distinction in component distribution is authorization. An authorized distributor has a direct relationship with the component manufacturer — they buy directly from the factory, handle the parts according to the manufacturer's quality requirements, and can provide full traceability from production to your bench.

**Authorized distributors** offer:
- Guaranteed genuine parts, directly from the manufacturer's production line
- Full manufacturer warranty coverage
- Access to technical support through the distributor's field application engineers
- Product Change Notifications forwarded from the manufacturer
- Proper handling, storage, and moisture sensitivity management
- Traceability through lot codes and date codes

**Unauthorized distributors and brokers** operate outside the manufacturer's distribution channel. They source parts from excess inventory, cancelled orders, liquidated stock, or other non-standard channels. Some are reputable and provide legitimate parts. Others are the primary channel through which counterfeit components enter the supply chain.

For new designs and production, always use authorized distributors. The cost difference is usually small (authorized distributors are competitive on pricing), and the risk reduction is enormous. A single counterfeit IC in a production run can cause field failures, recalls, and liability that dwarfs any cost savings.

The exception: obsolete parts that are no longer available through authorized channels. In this case, brokers may be the only source. If you must use a broker, require certificates of conformance, lot traceability, and consider independent testing (X-ray inspection, decapsulation, electrical testing) for critical components.

## Major Distributor Landscape

The major global authorized distributors each have different strengths:

**Digi-Key** has the widest catalog and is the go-to for prototype and small-quantity purchases. Their website is fast, their parametric search is thorough, and they stock an enormous range of parts in cut-tape quantities. They ship from a single massive warehouse in Minnesota, with same-day shipping for orders placed before the cutoff. For North American designers working on prototypes, Digi-Key is often the first stop.

**Mouser** is similar in scope to Digi-Key, with a large catalog and strong prototype-quantity availability. Based in Texas, they offer competitive pricing and a good website experience. In my experience, Mouser sometimes has stock on parts that Digi-Key doesn't, and vice versa, making it worth checking both.

**Arrow** and **Avnet** are larger in terms of total revenue but oriented more toward production volumes. They offer design-win support (application engineers who help you design in their manufacturers' parts), better pricing at volume, and supply chain management services. For production orders, Arrow or Avnet pricing often beats Digi-Key and Mouser significantly.

**Newark (element14)** is another general-purpose distributor with strong European presence (as Farnell in Europe). They carry a broad range and sometimes have stock on European-origin parts that U.S.-focused distributors don't.

**LCSC** is based in China and affiliated with JLCPCB. They specialize in parts from Asian manufacturers and offer very low pricing, especially for parts from companies like Yageo, Samsung, and various Chinese semiconductor firms. Stock is held in China, so lead times to North America are longer (7-14 days typical). LCSC is excellent for production sourcing of common passives and Asian-brand ICs, but less useful for Western semiconductor brands.

## Minimum Order Quantities

Not all parts are sold in single-unit quantities. Some components, especially those from smaller manufacturers or in specialized packages, have minimum order quantities (MOQ) that can be barriers for prototype work.

**Cut tape** is the prototype designer's friend. Most major distributors will cut standard-length tape (typically 7-inch reels hold 5,000 0402 resistors) into shorter strips, selling as few as 1 or 10 pieces. The per-unit price is higher than reel quantity, but the total cost is manageable.

**Full reels only.** Some parts are available only in full reels — 1,000, 3,000, 5,000, or more units. This is common for less popular parts, newer parts with limited distribution, and parts from manufacturers who don't support small-quantity distribution. If you need 10 pieces and the MOQ is 3,000, your options are: buy the full reel (expensive for a prototype), find a different part, or check if a different distributor offers cut tape.

**Tubes and trays.** IC packages like QFP and BGA are shipped in tubes or trays. A tray might contain 90 parts, and the MOQ might be one tray. At $5 per IC, that's $450 for a prototype that needs two parts. Some distributors will sell individual pieces from open trays; others won't.

## Lead Times

The time between placing an order and receiving the parts varies enormously, and understanding lead time terminology prevents schedule surprises:

**In stock** means the parts are physically in the distributor's warehouse and can ship within their standard processing time (usually same-day or next-day). This is the ideal situation for prototype orders.

**On order / due in** means the distributor has placed an order with the manufacturer but the parts haven't arrived yet. The expected arrival date is shown, but it's an estimate and can slip. Don't count on this for a hard deadline.

**Factory lead time** is the time the manufacturer quotes for producing new parts from the point of order placement. Standard factory lead times range from 4 to 16 weeks for most semiconductors, but during allocation periods they can extend to 30, 40, or even 52+ weeks.

**Back-ordered** means demand exceeds supply and orders are being filled in sequence. Your order will ship when inventory becomes available, but there's no guaranteed date.

For prototype work, "in stock" parts are the only reliable option. For production, planning ahead by 3-6 months and placing orders against factory lead times is standard practice.

## Pricing Tiers

Component pricing is not fixed — it varies dramatically with quantity. Most distributors show tiered pricing:

| Quantity | Example price per unit |
|----------|----------------------|
| 1 | $2.50 |
| 10 | $2.10 |
| 100 | $1.45 |
| 1,000 | $0.85 |
| 10,000 | $0.52 |

The first tier (1-9 units) is prototype pricing and represents the worst value. The price drops rapidly through the first few tiers and more gradually at higher volumes. For BOM cost estimation on a production product, use the pricing at your expected order quantity, not the prototype price.

Price breaks can also influence design decisions. If a component costs $3 at quantity 1 but $0.30 at quantity 1,000, and your production volume is 500, it might be worth ordering 1,000 units to hit the price break — the total cost is lower for 1,000 units at $0.30 ($300) than 500 units at some intermediate price.

For critical budget-sensitive projects, get formal quotes from Arrow, Avnet, or the manufacturer's direct sales team. Distributor website prices are catalog prices; negotiated pricing for volume purchases can be 20-40% lower.

## The Broker Market

When authorized distributors can't supply a part — due to allocation, obsolescence, or simply not stocking it — the broker market becomes relevant. Brokers buy and sell excess inventory, connecting buyers who need parts with sellers who have surplus.

**Legitimate excess inventory** does exist. A company cancels a product and has 10,000 unused regulators sitting in their warehouse. A broker buys this stock and resells it. The parts are genuine, though their handling history may not meet the manufacturer's standards.

**The counterfeit risk** is real and well-documented. Counterfeit components — parts that are remarked, recycled, out-of-spec, or entirely fake — enter the supply chain primarily through brokers and unauthorized channels. Counterfeit ICs have caused failures in military, aerospace, medical, and consumer applications. The risk increases for popular parts that command high prices when scarce.

If you must use a broker:
- Request a Certificate of Conformance (CoC) documenting the parts' origin
- Require lot and date code traceability
- Consider independent testing by a third-party lab (visual inspection, X-ray, decapsulation, electrical test)
- Use only reputable brokers who are members of industry associations (ERAI, GIDEP)
- For high-reliability applications, perform incoming inspection on every lot

## Gotchas

- **Digi-Key and Mouser prices include handling for small orders, which disappears at volume.** Don't use prototype pricing to estimate production BOM cost. Get formal quotes from volume distributors for any serious cost analysis.
- **"In stock" can change between when you search and when you order.** For critical parts, order promptly after confirming availability. Some distributors allow cart reservation for a limited time.
- **International shipping adds lead time and customs complexity.** If ordering from LCSC or other overseas distributors, account for 1-3 weeks of shipping time plus potential customs delays. Duties and taxes may apply.
- **Return policies vary significantly.** Some distributors accept returns on standard parts; others consider all sales final for semiconductors. Check the return policy before ordering large quantities of an uncertain part.
- **Free samples from manufacturers are real and useful.** Most major semiconductor manufacturers (TI, Analog Devices, Microchip, STMicroelectronics) offer free samples of their ICs for evaluation. The quantities are small (2-5 units), but they're genuine parts delivered quickly. Use this for initial prototype evaluation before placing a paid order.
- **Distributor-specific part numbers are not manufacturer part numbers.** Digi-Key and Mouser assign their own ordering codes (e.g., "296-12345-1-ND"). Always record the manufacturer's part number as the canonical reference, not the distributor's catalog number.
