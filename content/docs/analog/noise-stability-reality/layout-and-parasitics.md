---
title: "Layout & Parasitics"
weight: 30
---

# Layout & Parasitics

When schematics stop being the truth. A schematic shows ideal connections — zero-resistance wires, zero-inductance traces, zero-capacitance between nodes. A real PCB has resistance in every trace, inductance in every loop, and capacitance between every pair of conductors. At some point — a frequency, a gain, a speed, a precision level — these parasitics start to dominate the circuit's behavior.

This is where analog design gets humbling. The schematic is correct, the simulation works, and the board doesn't — because the board has physics the schematic doesn't capture.

## The Parasitics That Matter

### Trace Resistance

Every PCB trace has resistance: R = rho x L / (W x t), where L is length, W is width, and t is copper thickness.

**Rule of thumb:** 1 oz copper (35 um thick), 10 mil (0.25 mm) wide trace ≈ 1 ohm per inch.

**When it matters:**
- High-current paths (power supply traces, motor drives). A 200 milliohm trace carrying 5 A drops 1 V and dissipates 5 W
- Precision measurement circuits. A 10 milliohm trace resistance in a current sense path introduces a measurement error proportional to the current flowing through it
- Ground paths. Return current flowing through trace resistance creates voltage differences between "ground" points. This is ground bounce in digital circuits and ground noise in analog circuits

### Trace and Via Inductance

Every conductor has inductance. A PCB trace has roughly 1 nH per mm of length (varying with geometry and ground plane proximity).

**When it matters:**
- High-frequency decoupling. 1 nH at 100 MHz has an impedance of 0.6 ohm — significant when the decoupling cap's impedance is supposed to be milliohms
- Fast-switching circuits. V = L x dI/dt. 1 nH with a 1 A/ns switching transient produces a 1 V spike. This is the origin of ground bounce in digital circuits
- Power supply trace routing. Inductance between the supply pin and the decoupling cap limits the cap's effectiveness at high frequencies

**Vias add inductance:** A single via is roughly 0.5-1 nH depending on the board stackup. Multiple vias in parallel reduce the effective inductance.

### Stray Capacitance

Every pair of conductors separated by a dielectric has capacitance. PCB traces have capacitance to the ground plane (~0.5-1 pF per cm for typical stackups) and to adjacent traces.

**When it matters:**
- High-impedance nodes. A 10 Mohm node with 2 pF of stray capacitance has a time constant of 20 us — enough to turn fast signals into slow ramps
- Feedback paths. Stray capacitance from output to input creates unintended feedback that can cause oscillation in high-gain amplifiers
- High-frequency circuits. At 100 MHz, 1 pF has an impedance of 1.6 kohm. Two "isolated" traces with 0.5 pF between them are significantly coupled at that frequency

### Mutual Inductance and Magnetic Coupling

Current-carrying loops create magnetic fields that induce voltage in nearby loops. The induced voltage is proportional to dI/dt and the mutual inductance (which depends on loop area, distance, and orientation).

**When it matters:**
- Switching regulators. The switching loop radiates magnetic fields that couple into nearby analog circuits
- High-current paths near sensitive signal paths
- Transformer-coupled circuits and any situation where intentional or unintentional magnetics are present

## Ground Planes and Why They Help

A solid ground plane under signal traces:

- Provides a low-inductance return path (the return current flows directly under the signal trace, minimizing loop area)
- Reduces crosstalk (the ground plane shields traces from each other)
- Provides a low-resistance return path for power current
- Creates a controlled impedance environment for high-speed signals

**Splitting the ground plane** is a common but often misguided practice. The idea is to separate analog and digital grounds to prevent digital noise from contaminating analog circuits. But a split creates a gap that forces return currents to detour around it — increasing loop area and often making the problem worse.

**Better approach:** Use a solid, unbroken ground plane. Partition the layout so digital circuits are in one area and analog in another, with the ground plane continuous beneath both. Connect analog and digital grounds at a single point if required, or just keep the plane solid.

## Layout Rules That Actually Matter

### Signal Path Routing

- Keep analog signal traces short, especially high-impedance ones
- Route sensitive traces away from noisy traces (switching nodes, clock lines, power traces)
- Don't route analog signals through connectors if you can avoid it (connector pins add capacitance, inductance, and potential contamination)

### Component Placement

- Place decoupling caps as close to the IC power pins as physically possible. Every millimeter counts
- Place precision components (reference resistors, feedback networks) away from heat sources
- Keep high-frequency components (switching regulators, clock generators) on the opposite side of the board from sensitive analog circuits if possible

### Return Path Awareness

- Every signal has a return path. If the return path is interrupted (by a split plane, a missing via, or a routing bottleneck), the current finds another way — usually a longer, higher-inductance path that creates noise
- Don't route signals across ground plane breaks or splits
- For multi-layer boards, use via stitching to maintain low-impedance ground connections between layers

### Guard Rings and Shielding

- Guard rings (a driven shield at the same potential as the sensitive node) reduce leakage current and capacitive coupling on high-impedance nodes
- Copper pours connected to ground around sensitive circuits provide local shielding
- Physical shields (metal cans) are the ultimate defense for extremely sensitive circuits

## Gotchas

- **The schematic doesn't show parasitics** — This is the fundamental problem. The layout designer must understand the circuit's sensitivities and route accordingly. Schematic review and layout review are equally important
- **Autorouters don't understand analog** — Automatic PCB routers optimize for connectivity and density, not for parasitic minimization or noise isolation. Analog sections should always be routed by hand or at minimum reviewed and corrected manually
- **Component packages have parasitics** — A 0603 resistor has less parasitic inductance than a 0805. A through-hole component has more lead inductance than SMD. Package selection affects high-frequency behavior
- **Solder joints are connections** — Cold solder joints, cracked joints, and corroded joints add resistance and create intermittent connections. A circuit that works with new solder may fail after thermal cycling
- **"It worked on the breadboard" means nothing** — Breadboards have terrible parasitic capacitance (often 5-10 pF between adjacent rows), high trace inductance, and long ground paths. A circuit that works on a breadboard despite these parasitics is robust. A circuit that only works on a breadboard is relying on parasitics that won't exist on the PCB (and vice versa)
