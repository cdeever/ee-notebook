---
title: "Audible Noise: Whine, Hum & Buzz"
weight: 40
---

# Audible Noise: Whine, Hum & Buzz

Magnetic components make noise. Sometimes it's a 60 Hz hum from a power transformer, sometimes it's a high-pitched whine from a switching inductor, sometimes it's an intermittent buzz that correlates with load changes. The mechanisms are physical — magnetics convert electrical energy into mechanical vibration — and understanding the source is the first step to fixing it.

## Magnetostriction

The primary mechanism behind transformer hum and inductor noise. When a magnetic field is applied to a ferromagnetic core material, the material physically changes dimension — it expands or contracts by a small amount (parts per million) depending on the flux density and the material's magnetostrictive coefficient.

As the flux swings back and forth at the operating frequency, the core physically vibrates at twice the electrical frequency (because the dimensional change depends on the magnitude of flux, not its direction — positive and negative flux both cause the same strain). A 60 Hz power transformer hums at 120 Hz. A 50 Hz transformer hums at 100 Hz.

The amplitude of vibration is tiny (microns), but it's enough to produce audible sound, especially in large cores with large surface areas. The sound radiates directly from the core surface and also transmits through the mounting structure into the enclosure, which can amplify it.

### Material Dependence

Different core materials have different magnetostriction:
- **Laminated silicon steel:** Moderate to high magnetostriction. The dominant source of hum in power transformers and mains-frequency magnetics
- **Ferrite:** Low magnetostriction. Ferrite-core inductors rarely produce significant magnetostrictive noise
- **Nickel-iron alloys (Permalloy, Mu-metal):** Variable; some compositions are near-zero magnetostriction by design
- **Amorphous and nanocrystalline metals:** Typically very low magnetostriction — one reason they're used in low-noise audio and measurement transformers

## Coil Whine in Switching Power Supplies

The high-pitched whine or chirp from laptop chargers, LED drivers, and DC-DC converters is the most commonly encountered magnetic noise. It has several sources:

### Magnetostriction at Audible Frequencies

If the switching frequency or any of its subharmonics falls in the audible range (20 Hz to 20 kHz), the core vibrates at that frequency. Most modern switching converters operate at 100 kHz to 2 MHz — well above audible — but:

- **Pulse-skipping and burst mode:** At light load, many converters skip switching cycles to maintain efficiency. The burst pattern repeats at an audible rate (often 1–10 kHz), creating intermittent magnetostriction that the ear is very sensitive to
- **Variable frequency converters:** Some control topologies (like constant-on-time) change switching frequency with load. At certain load points, the frequency can dip into or pass through the audible range
- **Spread-spectrum modulation:** Some converters deliberately modulate the switching frequency for EMI reduction. If the modulation rate is audible, the inductor sings

### Loose Windings

If the winding wire isn't firmly bonded to the core or to adjacent turns, the magnetic force between turns (Lorentz force from current-carrying conductors in a magnetic field) causes the wire to vibrate. This is a mechanical rattle, distinct from magnetostriction:

- It's often intermittent and load-dependent (higher current = stronger force)
- It can be fixed by re-varnishing, potting, or mechanically constraining the winding
- It's more common in hand-wound or loosely wound components than in precision machine-wound inductors

### PCB-Transmitted Vibration

Even if the inductor itself doesn't vibrate much, the mechanical force it exerts on the PCB can excite PCB resonances. The PCB acts as a sounding board, amplifying a vibration that would be inaudible from the inductor alone. This is especially noticeable with:

- Thin PCBs (0.8 mm or thinner)
- Large, heavy inductors on flexible board sections
- Components near board edges or unsupported areas

Stiffening the board, adding mechanical support, or changing the inductor's mounting position can fix PCB-amplified noise even without changing the inductor.

### Ceramic Capacitor Contribution

This isn't a magnetics issue, but it's commonly misattributed to the inductor. Class II ceramic capacitors (X5R, X7R, Y5V) exhibit piezoelectric behavior — they mechanically flex when voltage is applied. In a switching converter, the voltage ripple on ceramic caps causes audible vibration that sounds exactly like inductor whine.

The giveaway: if the inductor has been replaced and the noise persists, suspect the ceramics. The fix is to use a different capacitor type (polymer or film) or to change the ceramic's mounting to reduce PCB excitation.

## Transformer Hum in Mains Equipment

The classic 120 Hz (or 100 Hz in 50 Hz countries) hum from power transformers, fluorescent lighting ballasts, and other mains-frequency magnetics.

### Normal Hum

All mains transformers hum to some degree. The question is how loud. Factors that increase hum:

- **Higher flux density:** Running a core closer to saturation increases magnetostriction amplitude. An undersized or overloaded transformer hums louder
- **Loose laminations:** Over time, the varnish or clamping that holds laminations together can loosen. Individual laminations vibrate against each other, adding a buzzing quality to the hum
- **DC on the mains:** Even a small DC offset in the mains voltage (from half-wave rectifier loads in the neighborhood, or from geomagnetic events) pushes the core asymmetrically up the B-H curve, increasing the flux swing on one half-cycle. This makes the hum louder and adds even-harmonic frequency components that sound harsher
- **Mounting:** A transformer bolted rigidly to a metal chassis transmits vibration into the chassis. Rubber grommets or resilient mounts reduce transmitted noise

### Abnormal Hum

A sudden increase in transformer hum indicates a problem:

- **Shorted turns:** A winding short increases the current in the remaining turns and changes the flux distribution, often increasing core vibration
- **Loose hardware:** Lamination clamps, mounting bolts, or core screws working loose
- **Core damage:** Cracked ferrite, burned laminations, or saturated core from a DC bias fault
- **Overload:** The transformer is being asked to deliver more current than designed for, pushing the core harder

## Tips

- Choose core materials with low magnetostriction for noise-sensitive applications
- Don't skimp on core size — running at lower flux density reduces magnetostrictive vibration
- Use switching frequencies well above 20 kHz, and keep burst-mode or pulse-skipping frequencies above 20 kHz too
- Varnish or pot windings to eliminate loose-winding vibration

## Caveats

- "Coil whine" is not always the coil — Ceramic capacitors, ferrite beads, and even some MOSFET packages can produce audible noise in switching circuits. Isolate the source by touching components with a non-conductive probe (wooden stick, plastic pen) while listening — damping the vibration of the actual source reduces the noise
- Hum at 60 Hz (not 120 Hz) from a transformer suggests DC magnetization — Normal magnetostrictive hum is at twice the line frequency. If the fundamental frequency is heard, the core is being magnetized asymmetrically, often by DC on the mains or by a rectifier fault that's half-wave loading the transformer
- Switching frequency is not the only frequency that matters — Intermodulation between the switching frequency and its subharmonics, PWM dimming frequencies (in LED drivers), and control loop bandwidth can all create audio-frequency beat tones
- Enclosures can amplify or attenuate noise — A plastic enclosure with flat panels can resonate like a drum. A metal enclosure with damping material inside can attenuate. The same circuit may be silent in one enclosure and noisy in another
- Audible noise can change with temperature — Magnetostriction coefficient varies with temperature for some materials, and mechanical resonance frequencies shift as the PCB and enclosure expand. A product that's quiet at room temperature may whine when warm

## Bench Relevance

- Touching an inductor with a non-conductive probe that reduces the noise confirms it as the source
- Noise that correlates with load changes suggests burst-mode or variable-frequency operation
- Replacing ceramic capacitors with film or polymer types that eliminate noise confirms piezoelectric capacitor vibration
- A transformer that suddenly becomes louder indicates a developing fault — investigate before it fails completely
