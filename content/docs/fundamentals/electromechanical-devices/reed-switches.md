---
title: "Reed Switches"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Reed Switches

Two ferromagnetic metal reeds sealed inside a glass envelope, with their free ends overlapping but not touching. Apply a magnetic field (from a permanent magnet or an external coil) and the reeds magnetize, attract each other, and make contact. Remove the field and the spring tension of the reeds pulls them apart.

Reed switches are simpler, faster, and smaller than conventional relays. They're used primarily for position sensing and low-level signal switching — not power switching.

## How They Work

The glass envelope serves two purposes: it holds the reeds in alignment and seals them in an inert atmosphere (usually nitrogen or a vacuum). The sealed environment prevents contact oxidation and contamination, which is why reed switches can reliably switch microvolt/microamp-level signals that would be unreliable with conventional relay contacts.

**Actuation methods:**

- **Permanent magnet** — The most common approach for sensing. A magnet on a moving part (door, float, shaft) actuates the reed switch as it passes nearby. No wiring to the moving part. No power consumption for the sensor itself
- **Coil (reed relay)** — A wire coil wound around the glass envelope. Energizing the coil creates the magnetic field. This is a reed relay — faster, smaller, and longer-lived than conventional relays, but limited to lower currents

## Sensing Applications

Reed switches are everywhere in sensing because they're cheap, passive, and reliable:

- **Door and window sensors** — Security systems, alarm contacts. Magnet on the door, reed switch on the frame. When the door opens, the magnet moves away and the switch opens
- **Liquid level sensing** — A float with an embedded magnet rides up and down a tube containing reed switches at specific levels. Simple, no electronics in contact with the fluid
- **Speed and position sensing** — A magnet on a rotating shaft triggers a reed switch once per revolution. Bicycle speedometers, flow meters, RPM counters
- **Proximity detection** — Any application where detection of something in a particular position is needed without physical contact or electrical connection to the moving part

## Reed Relays

A reed switch inside a coil, packaged as a small relay. Reed relays switch faster (sub-millisecond) and last longer (billions of cycles mechanical) than conventional relays. They're standard in:

- **Test and measurement equipment** — Switching between measurement channels, calibration paths, and signal routing. The sealed contacts and low contact resistance make them reliable for precision measurements
- **Telecommunications** — Signal routing in switching equipment
- **ATE (Automatic Test Equipment)** — High channel-count switching matrices where thousands of reed relays route signals to different test points

Reed relays are available with coil voltages from 3 V to 24 V and contact ratings up to about 1 A. Beyond that, a conventional relay is needed.

## Contact Characteristics

### Low-Level Switching

Reed switch contacts are typically plated with rhodium or ruthenium for hardness and wear resistance. For low-level signal switching (microvolts, nanoamps), mercury-wetted reed switches use a thin film of mercury on the contacts to ensure consistent, low-resistance connection with zero bounce.

Mercury-wetted reeds are orientation-sensitive — they must be mounted within a specified angle of vertical so the mercury stays on the contacts. They're also increasingly restricted due to mercury toxicity, but nothing else matches their performance for low-level DC switching.

### Bounce

Standard (dry) reed switches do bounce, but much less than conventional relays — typically 0.1-0.5 ms versus 1-10 ms. Mercury-wetted reeds have zero bounce because the mercury film bridges the contact gap as the reeds approach each other.

For digital sensing applications, the short bounce duration of dry reeds often means a simple RC debounce filter is sufficient.

## Limitations

Reed switches are not power-handling devices. Their limitations are important to understand:

- **Low current rating** — Typically 0.5-1 A maximum for switching, 1-3 A maximum carry current. The thin reeds can't handle high current without overheating or welding
- **Low voltage rating** — Typically 100-200 V maximum. The small contact gap in the sealed envelope limits breakdown voltage
- **Fragile glass envelope** — Mechanical shock can crack the seal. Once the seal is broken, the inert atmosphere is lost and contact reliability degrades rapidly due to oxidation
- **Magnetic interference** — External magnetic fields (nearby magnets, solenoids, motors, or even magnetized tools) can inadvertently actuate or hold the reed switch. In magnetically noisy environments, shielding may be needed
- **Contact resistance drift** — Over millions of cycles, the contact plating wears and resistance increases. For precision measurement applications, this drift needs to be monitored and the relays replaced on a maintenance schedule

## Tips

- Prototype the magnet geometry before committing to a PCB layout — actuation distance and orientation matter
- Use mercury-wetted reeds for low-level DC switching where bounce cannot be tolerated
- Shield reed switches from external magnetic fields in noisy environments

## Caveats

- Magnet orientation and field shape matter — The reed switch responds to the axial component of the magnetic field (along the length of the reeds). A magnet approaching from the side actuates differently than one approaching end-on. Prototype and test the geometry before committing to a PCB layout
- Sticking with high-current loads — Exceeding the rated switching current causes arcing that can weld the reed contacts. Unlike a conventional relay where welded contacts can sometimes be physically freed, a welded reed switch is permanently failed
- Demagnetization — The ferromagnetic reeds can become permanently magnetized over time, especially with high-current switching. This residual magnetization can cause the switch to stick closed or change the actuation threshold. Degaussing can sometimes restore normal operation
- No flyback diode needed for the switch itself — Reed switches are just contacts. But if the reed switch is switching an inductive load, the inductive kickback still needs suppression — just as with any switch
- Mounting stress — Soldering too close to the glass envelope or applying mechanical stress to the leads can crack the seal. Follow the datasheet's recommended lead bending and soldering distances

## In Practice

- A reed switch that doesn't actuate when a magnet approaches may have the wrong field orientation — try rotating the magnet
- A reed switch that stays closed with no magnet nearby may have become permanently magnetized — try degaussing
- Erratic switching in an otherwise working reed switch suggests contact contamination from a cracked seal
- Contact resistance that increases over time indicates contact wear — plan for replacement in precision applications
