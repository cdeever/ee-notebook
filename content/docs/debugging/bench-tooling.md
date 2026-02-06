---
title: "Bench Tooling"
weight: 5
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Bench Tooling

Test instruments measure circuits; bench tools physically interact with them. A well-equipped bench has both — the scope and meter tell you what's wrong, but the soldering station, tweezers, and magnifier let you fix it. This page covers the physical tools that make debugging, rework, and repair possible.

For test instruments (oscilloscope, DMM, power supply, etc.), see [Test Instruments]({{< relref "/docs/measurement/test-instruments" >}}).

## Soldering & Rework

### Soldering Station

The soldering station is the core rework tool. A temperature-controlled iron with interchangeable tips handles everything from fine-pitch SMD to through-hole connectors.

**What matters:**

| Feature | Why it matters |
|---------|---------------|
| Temperature control | Consistent tip temperature under load. Uncontrolled irons cool down when touching a large pad and can't recover quickly. Temperature-controlled stations maintain setpoint regardless of thermal demand. |
| Wattage | Higher wattage (60–80W) recovers temperature faster. A 25W iron struggles with ground planes and large pads. |
| Tip variety | Different jobs need different tips. Chisel tips transfer heat faster; fine conical tips access tight spaces. |
| ESD safety | The tip should be grounded to avoid ESD damage to sensitive components. Check with a meter. |
| Standby/sleep | Auto-sleep when the iron is in the stand saves tips and reduces fire risk. |

**Entry level:** A name-brand temperature-controlled station (Hakko FX-888D, Weller WE1010, or similar) covers most bench work. Cheap irons without temperature feedback are frustrating and damage boards.

**Advanced:** High-thermal-mass work (large ground planes, through-hole connectors on multi-layer boards) benefits from higher wattage (100W+) or specialized tips. JBC and Metcal stations offer faster thermal recovery for production environments.

### Hot Air Station

Hot air reflows solder without physical contact — essential for SMD rework, especially QFN, BGA, and multi-pin ICs where an iron can't reach all pins simultaneously.

**Key specs:**

| Spec | What it means |
|------|---------------|
| Temperature range | 100–500°C typical. Lead-free solder needs 250°C+ at the joint (set the station higher to account for losses). |
| Airflow control | Too much air blows small components away; too little doesn't deliver enough heat. Adjustable airflow is essential. |
| Nozzle variety | Round nozzles for general work; shaped nozzles concentrate heat on specific package sizes (SOIC, QFP, BGA). |

**Technique basics:**
- Apply flux before heating — it improves heat transfer and solder wetting
- Keep the nozzle moving in a circular pattern to heat evenly
- Watch for solder reflow (the part "settles" slightly when solder melts)
- Use tweezers to lift the part once all pins are molten — don't pry
- Shield nearby components with kapton tape or aluminum foil; small passives will reflow and shift if exposed to the airflow

### Tips and Tip Geometry

The right tip makes soldering easier and reduces damage risk. No single tip does everything well.

| Tip type | Best for | Limitations |
|----------|----------|-------------|
| **Chisel** (screwdriver) | Through-hole, larger SMD (0805+), drag soldering | Can't reach tight spaces |
| **Conical** (pointed) | Fine-pitch SMD, tight spaces between pins | Poor heat transfer to large pads |
| **Bevel** (knife) | Drag soldering fine-pitch ICs | Orientation-dependent |
| **Hoof** (curved chisel) | Drag soldering with solder feeding | Specialized technique |

**Tip care:**
- Keep tips tinned when hot — a dry tip oxidizes and stops wetting
- Clean on a brass wool pad (better than wet sponge, which thermally shocks the tip)
- Replace tips when they no longer tin properly or show pitting
- Use temperature appropriate for the solder — too hot accelerates oxidation

### Flux

Flux removes oxides from metal surfaces, allowing solder to wet and flow. Solder wire contains flux in the core, but additional flux is often needed for rework.

**Types:**

| Type | Activity | Residue | Use case |
|------|----------|---------|----------|
| **Rosin (R, RMA)** | Mild | Benign, cleanable | General work, especially hand soldering |
| **No-clean** | Low-medium | Designed to be left in place | Production, where cleaning is impractical |
| **Water-soluble (OA)** | High | Must be cleaned — corrosive | Heavy oxidation, quick wetting needed |

**Forms:**
- **Paste/gel:** Apply with syringe or brush. Stays where you put it. Good for targeted rework.
- **Liquid:** Apply with brush or flux pen. Flows into tight spaces. Good for drag soldering and cleaning up bridges.
- **Cored solder:** Built into the solder wire. Adequate for many tasks but not for rework where extra flux helps.

**Key point:** More flux almost always helps. When solder isn't flowing well, the answer is usually flux, not more heat.

### Wick vs Pump

Both remove solder. They work differently and excel in different situations.

**Solder wick (desoldering braid):**
- Copper braid that absorbs molten solder by capillary action
- Best for: cleaning pads, removing bridges, fine-pitch work
- Technique: Press wick onto joint with iron on top; lift both together when solder is absorbed
- Add flux to the wick for better absorption
- Use fresh wick — the saturated portion doesn't absorb

**Solder sucker (desoldering pump):**
- Spring-loaded vacuum that sucks molten solder into a tube
- Best for: through-hole work, clearing plated-through holes
- Technique: Heat joint until molten, position tip adjacent, release pump
- Some holes require multiple passes
- Clean the tip regularly; a worn seal reduces suction

**Powered desoldering:** Desoldering guns combine a heated tip with continuous vacuum. Expensive but much faster for through-hole work if you do a lot of it.

### Reflow Basics

Reflow soldering melts solder paste to attach components. It's how production boards are assembled, and understanding it helps with rework.

**Temperature profile:** Reflow follows a profile: preheat (ramp up slowly), soak (stabilize temperature), reflow (peak above solder melting point), cool (ramp down).

**Hot air reflow (bench scale):**
- Apply solder paste to pads (syringe or stencil)
- Place components (tweezers, vacuum pen)
- Preheat the board with hot air at lower temperature
- Increase to reflow temperature; watch for solder to melt and parts to settle
- Remove heat and let cool

**Toaster oven / hot plate reflow:** Hobbyist approach for small boards. Works but requires temperature monitoring (thermocouple) and practice. Not recommended for boards with temperature-sensitive components (electrolytic capacitors, connectors, LEDs).

**Lead-free vs leaded:** Lead-free solder melts ~30–40°C higher than leaded. Most commercial boards are lead-free; hobby boards often use leaded for easier rework. Don't mix — lead-free joints reworked with leaded solder have unreliable metallurgy.

## Handling & Precision Tools

### Tweezers

Tweezers are the primary manipulator for SMD work. The cheap ones from variety packs bend, don't align, and magnetize.

**Types that matter:**

| Type | Description | Use |
|------|-------------|-----|
| **Fine point (straight)** | Sharp tips meet precisely | Placing small components (0402, 0603), holding wires |
| **Fine point (curved)** | Bent tips for angled approach | Reaching into assemblies, holding parts during soldering |
| **Blunt / flat** | Wider tips, more grip | Larger components, through-hole leads |
| **Reverse action** | Normally closed, squeeze to open | Holding components hands-free during soldering |
| **Ceramic tip** | Non-conductive, heat-resistant | Working near live circuits, holding during hot air |

**Materials:**
- **Stainless steel:** Standard choice. Get anti-magnetic (non-magnetic stainless) to avoid magnetizing and picking up stray components.
- **Titanium:** Lighter, non-magnetic, corrosion-resistant. More expensive.
- **ESD-safe coated:** Dissipative coating for static-sensitive work.
- **Ceramic:** For high heat and electrical isolation.

**Quality indicators:** Tips align precisely when closed. Spring tension is consistent. Material doesn't magnetize.

### Flush Cutters

Cut component leads and wire cleanly without leaving sharp stubs.

**Features:**
- **Flush face:** One side of the blade is flat, leaving a flush cut
- **Spring return:** Opens automatically after each cut
- **Cutting capacity:** Rated for wire gauge and hardness (copper vs steel leads)

**Don't use flush cutters on:** Piano wire, spring steel, hardened pins. These damage the cutting edge.

### Precision Screwdrivers

Electronics fasteners are small and easily damaged by wrong-size drivers.

**What you need:**
- Phillips #00, #0, #1
- Slotted (various small sizes)
- Torx T5, T6, T8, T10
- Hex 1.5mm, 2mm, 2.5mm
- Pentalobe (Apple products)
- Tri-wing, Y-type (game consoles, some consumer electronics)

**Quality matters:** Cheap drivers round fasteners and strip easily. Wiha, Wera, and iFixit are reliable. Magnetic tips help but can be a nuisance around sensitive components.

### PCB Holders and Vises

Holding the board stable while working on it prevents damage and improves precision.

**Options:**

| Type | Description | Best for |
|------|-------------|----------|
| **Helping hands / third hand** | Alligator clips on articulated arms | Light soldering, holding wires |
| **PCB holder (adjustable)** | Clamps board edges, rotates | General SMD and through-hole rework |
| **Vacuum chuck** | Suction holds board flat | Sensitive boards, production |
| **Vise with soft jaws** | Traditional vise with padded jaws | Sturdy holding, mechanical work |
| **Magnetic mat with clips** | Keeps small parts organized while holding board | Complex disassembly |

**Tip:** The cheap helping-hands with alligator clips on ball joints are frustrating — they don't hold position. A proper PCB holder with screw-adjustable clamps is worth the upgrade.

## Inspection & Visibility

### Magnification

SMD components and solder joints are too small to inspect reliably with the naked eye. Magnification is not optional for modern electronics.

**Options:**

| Type | Magnification | Working distance | Best for |
|------|---------------|------------------|----------|
| **Magnifying lamp** | 2–5× | 8–12 inches | General work with hands underneath |
| **Headset magnifier** | 2–10× | 6–8 inches | Hands-free, mobile |
| **Stereo microscope** | 7–45× | 3–6 inches | Fine-pitch inspection, BGA, post-rework QC |
| **USB microscope** | 20–200× (digital) | 1–3 inches | Quick inspection, documentation, sharing images |

**Magnifying lamp:** A diopter rating indicates optical power (3 diopter ≈ 1.75×, 5 diopter ≈ 2.25×). An LED ring light around the lens provides shadow-free illumination. This is the baseline for any bench.

**Stereo microscope:** Shows depth (both eyes see different angles). Essential for inspecting solder joints on fine-pitch ICs, checking for bridges, and verifying paste deposition. Boom stands offer more flexibility than fixed stands.

**USB microscope:** Good enough for many inspections and great for documentation. No depth perception. Quality varies wildly — get one with manual focus and decent sensor.

### Lighting

Good lighting matters as much as magnification. Shadows hide defects; glare obscures detail.

**Principles:**
- **Diffuse light** (ring light, light tent) reduces shadows and glare
- **Adjustable angle** lets you position light to reveal specific features
- **High CRI (color rendering index)** shows true colors — important for identifying components and checking for discoloration
- **Adequate intensity** — dim lighting causes eye strain; too bright causes glare

**Typical setup:** LED ring light on the magnifier plus an adjustable desk lamp for fill. Natural daylight is excellent but not always available.

### Inspection Mirrors

A small mirror on a handle lets you see underneath components, behind connectors, and into blind spots without disassembly.

Dental mirrors work well. Articulated models adjust to different angles. A light source (small flashlight) complements the mirror.

## Cleaning & Recovery

### IPA and Brushes

Isopropyl alcohol (IPA) is the standard solvent for flux residue. 90% or higher concentration; 70% has too much water.

**Technique:**
1. Apply IPA to the work area (squeeze bottle, brush, or swab)
2. Scrub with a stiff brush (ESD-safe brush, acid brush, or dedicated flux brush)
3. Wipe with lint-free cloth or let air dry
4. Repeat if residue remains

**Brushes:**
- Acid brushes (cheap, disposable) work fine for most cleaning
- ESD-safe brushes reduce static risk on sensitive boards
- Toothbrushes work in a pinch but may be too soft for stubborn residue

### Flux Remover

Commercial flux removers are formulated to dissolve specific flux chemistries and may work better than IPA alone, especially for no-clean and rosin fluxes.

**Types:**
- **Aerosol spray:** Fast, convenient, blows residue away
- **Liquid (brush-on):** More controlled application
- **Flux remover pens:** Targeted cleaning of small areas

**Note:** Some flux removers attack plastics. Test on an inconspicuous area before using near connectors or plastic housings.

### Contact Cleaner

Different from flux remover — contact cleaner is for switches, potentiometers, and connectors where contamination causes intermittent connections.

**Use:**
- Spray into switch or potentiometer, work the mechanism to distribute
- Cleans oxidation and contamination from contacts
- Usually leaves a light lubricating residue (some are "residue-free")

**Not for:** Cleaning PCBs (use flux remover). Not a substitute for replacing worn-out components.

**Example:** DeoxIT is the standard for contact cleaning. Different formulations for different applications (D-series for cleaning, F-series with lubricant for faders and pots).

### Conformal Coating Removal

Conformal coating protects boards from moisture and contamination. It also prevents rework. Removing it is necessary before modifying or repairing coated boards.

**Methods:**

| Method | Description | Notes |
|--------|-------------|-------|
| **Solvent** | Commercial conformal coating remover dissolves the coating | Match solvent to coating type (acrylic, silicone, urethane). Takes time. |
| **Thermal** | Soldering iron burns through coating | Works for spot rework. Produces fumes — use fume extraction. |
| **Mechanical** | Scrape with a blade | Risk of trace damage. Good for small areas. |
| **Abrasive** | Pencil eraser, fiberglass scratch pen | Removes coating and some copper. Careful. |

**Recoating:** After rework, the exposed area should be recoated. Brush-on or spray conformal coating is available for field repair.

## Safety & Protection

### ESD Handling

Electrostatic discharge damages sensitive components — MOSFETs, ICs, and anything with thin oxide gates. The damage may not be visible or immediately apparent; weakened components fail later in the field.

**Practical ESD control:**

| Element | Purpose | Notes |
|---------|---------|-------|
| **ESD mat** | Provides a grounded, dissipative work surface | Connect to ground through a 1 MΩ resistor (safety). Don't use as a ground reference for circuits. |
| **Wrist strap** | Keeps you at the same potential as the mat and circuit | Must be connected to ground. Check with a wrist strap tester. |
| **Grounded iron tip** | Prevents ESD from the iron | Most modern stations are grounded. Verify with a meter. |
| **ESD-safe packaging** | Protects components in storage and transit | Pink poly bags dissipate charge; black conductive bags for higher sensitivity. |

**Common mistakes:**
- Wearing a wrist strap connected to nothing (does nothing)
- Grounding to a different reference than the circuit (can cause discharge when touching)
- Ignoring ESD for "just a quick fix" (the damage you don't see today shows up as field failures)

**Reality check:** Not every component is ESD-sensitive. Through-hole resistors and power semiconductors are robust. CMOS logic, microcontrollers, and MOSFETs are sensitive. RF front-ends and precision analog can be damaged by very small discharges. When in doubt, handle as sensitive.

### Fume Extraction

Solder fumes contain flux decomposition products, not lead vapor (lead doesn't vaporize at soldering temperatures, though lead solder does create particulate). The fumes are irritating and potentially harmful with prolonged exposure.

**Options:**

| Type | Description | Best for |
|------|-------------|----------|
| **Bench-top extractor** | Fan draws fumes through activated carbon filter | Personal protection, occasional soldering |
| **Fume arm** | Articulated duct to overhead or external ventilation | Heavier use, shared bench spaces |
| **Filtered solder station** | Built-in extraction at the iron tip | Portable, all-in-one solution |

**Placement:** Position the intake near the soldering point, downstream of the airflow (not between you and the work — you shouldn't breathe the fumes that blow past the board toward the extractor).

**Filter maintenance:** Activated carbon filters absorb fumes until saturated. Replace per manufacturer schedule or when you smell fumes that should be filtered.

### Isolation Transformer

An isolation transformer breaks the direct connection between mains power and the equipment under test. This is a safety device for specific situations, not standard bench equipment.

**When it matters:**
- Testing equipment with a hot chassis (older equipment where the chassis is connected to one side of the mains)
- Probing mains-connected circuits (the oscilloscope ground clip would otherwise short to mains neutral or hot)
- Reducing shock hazard when working inside powered mains equipment

**What it does:**
- The secondary is isolated from mains earth — neither side is "hot" relative to earth ground
- Does not reduce voltage or limit current — full mains voltage and current are available at the output
- Does not protect against shock between the two output terminals — only against shock relative to earth ground

**What it doesn't do:**
- Doesn't make it safe to probe mains circuits casually — the voltages are still lethal
- Doesn't replace proper lockout/tagout when service requires it
- Doesn't provide surge protection or power conditioning

**Proper use:** Plug the equipment under test into the isolation transformer. Use insulated tools. Keep one hand in your pocket when probing live circuits (reduces the chance of current across the heart). Understand what you're doing — this is not a get-out-of-safety-free card.

**Differential probes:** For routine probing of mains-referenced circuits, a differential probe is often safer than an isolation transformer because it doesn't change the circuit's ground reference. The isolation transformer is for when you need to power the equipment while probing with a ground-referenced scope.

## In Practice

- A soldering iron that can't maintain temperature on a ground plane is frustrating and causes bad joints — upgrade to a higher-wattage station before fighting the tool
- Magnification pays for itself in rework time saved and bridges caught before they cause failures
- ESD damage is cumulative and often latent — a component that "works" after careless handling may fail in the field weeks later
- Flux is the most underused consumable — when in doubt, add more flux
- The right tweezers make SMD work feel controlled; the wrong tweezers make it feel like a struggle
- Fume extraction is easy to skip until you notice the headache at the end of a long session — set it up once and use it always
