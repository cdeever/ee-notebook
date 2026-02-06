---
title: "Variac"
weight: 80
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

A variac (variable autotransformer) provides adjustable AC voltage from zero to line voltage—and often above. Turn the dial and the output voltage changes smoothly. This makes variacs essential for slowly bringing up repaired equipment, testing behavior at reduced or elevated voltages, and simulating brownout or overvoltage conditions.

Unlike a dimmer or resistive voltage dropper, a variac maintains good voltage regulation under load and doesn't waste power as heat. The output is still a clean sine wave (assuming the input is), just at a different amplitude.

## Why Variable Voltage Matters

**Slow bring-up after repair:** When you've replaced components in a power supply or amplifier, you don't know if your repair introduced new problems. Applying full voltage immediately risks blowing the new parts or causing secondary damage. With a variac, you can start at 0V and slowly increase, watching for excessive current draw, smoke, or unexpected behavior. If something is wrong, you catch it at 30V instead of 120V.

**Testing voltage tolerance:** Specifications often list operating ranges like "100–240VAC." A variac lets you verify behavior across that range—and beyond. Does the device actually work at 90V? Does it overheat at 130V? You can find out safely.

**Simulating real-world conditions:** Line voltage isn't always nominal. Brownouts, sags during heavy loads, and high-voltage conditions from lightly loaded transformers all occur. A variac simulates these conditions on demand.

**Motor and transformer testing:** Inrush current on motors and transformers can be extreme. Slowly ramping voltage with a variac reduces inrush and lets you observe behavior as the device energizes.

## How a Variac Works

An autotransformer has a single winding with a tap that moves along the coil. Unlike a two-winding transformer, there's no isolation—the output shares a common conductor with the input. A carbon brush rides on exposed turns of the winding, selecting the output voltage.

| Dial Position | Output Voltage (120V input) |
|---------------|----------------------------|
| 0% | 0V |
| 50% | ~60V |
| 100% | ~120V |
| 120% (if equipped) | ~140V |

Many variacs can output above line voltage because the tap can access more turns than the input uses. This is useful for overvoltage testing but requires caution—you can apply damaging voltage to equipment.

**Key characteristics:**
- **No isolation:** Input and output share a ground/neutral connection. Use with an isolation transformer if you need isolation.
- **Good regulation:** Output voltage stays relatively constant as load changes (within the VA rating).
- **Clean waveform:** The output is the same waveform as the input, just scaled.
- **Efficient:** Minimal power loss—what you put in comes out (minus small core and brush losses).

## Choosing a Variac

| Specification | What to Look For |
|---------------|------------------|
| **VA rating** | Must exceed your maximum load. 500VA handles most bench work; 1kVA or more for larger equipment |
| **Input voltage** | Match your mains: 120V or 240V (some are dual-voltage) |
| **Output range** | Typically 0–100% of input, sometimes 0–120% or higher |
| **Metering** | Built-in voltmeter and ammeter are convenient but not essential |
| **Enclosure** | Bench-mount enclosed units are safer; open-frame units need external mounting |

**Common sizes:**
- **3A / 350VA:** Small loads, electronics bench work
- **10A / 1kVA:** General-purpose, handles most equipment
- **20A+ / 2kVA+:** Large motors, high-power equipment

## Variac with Isolation Transformer

A variac alone doesn't provide isolation from mains. For safe probing of mains-referenced circuits, combine the variac with an isolation transformer:

**Option 1: Variac before isolation transformer**
- Mains → Variac → Isolation transformer → DUT
- Variable voltage, isolated output
- The isolation transformer must handle the full VA

**Option 2: Isolation transformer before variac**
- Mains → Isolation transformer → Variac → DUT
- Same result, different order
- May be physically more convenient depending on your setup

Some commercial units combine both in one enclosure—these are ideal for electronics repair work.

## Variac with Dim Bulb Tester

For maximum protection during first power-up:

- Mains → Dim bulb tester → Variac → DUT

The dim bulb limits current if there's a fault; the variac lets you control voltage. Start at 0V, slowly increase while watching the bulb and monitoring the DUT. If the bulb glows brightly at any point, stop and investigate.

Alternatively:

- Mains → Variac → Dim bulb tester → DUT

This order lets you see bulb behavior as you increase voltage—sometimes useful for observing how inrush current changes with applied voltage.

## Using a Variac

### Slow Bring-Up Procedure

1. **Connect the DUT** to the variac output (DUT is off)
2. **Set the variac to 0V**
3. **Plug the variac into mains power**
4. **Turn on the DUT**
5. **Slowly increase voltage** while monitoring:
   - Output voltage (on the variac meter or external meter)
   - Current draw (if you have an inline meter)
   - DUT behavior (lights, sounds, heat)
6. **Pause at 25%, 50%, 75%** and let things stabilize
7. **If anything seems wrong** (excessive current, smoke, strange sounds), reduce voltage immediately
8. **At full voltage,** verify normal operation

### Voltage Tolerance Testing

1. Start at nominal voltage, verify normal operation
2. Slowly reduce voltage and note when the device stops working correctly (lower limit)
3. Return to nominal, then slowly increase voltage
4. Note any overheating, stress, or malfunction at elevated voltage
5. Compare against specifications

### Motor Starting

1. Set variac to ~30% voltage
2. Apply power—motor should hum but rotate slowly or not at all
3. Slowly increase voltage, allowing motor to spin up gradually
4. This reduces inrush current and mechanical stress
5. Useful for large motors or old motors with uncertain bearings

## Limitations

**No isolation:** The variac is an autotransformer. Output is galvanically connected to input. You can still be shocked, and scope ground clips can still cause shorts. Add an isolation transformer for safe probing.

**VA rating limits:** Exceeding the VA rating causes overheating. The variac may have a thermal breaker, or it may just get dangerously hot. Know your load.

**Brush wear:** The carbon brush wears over time, especially if adjusted frequently under load. Inspect periodically and replace when worn.

**Not for DC:** Variacs are AC devices. They won't work for DC voltage adjustment—use a bench power supply instead.

**Inrush on reactive loads:** Even with a variac, transformers and motors draw inrush current when first energized at any voltage. The variac reduces but doesn't eliminate this.

## Safety

- **No isolation:** Treat the output as mains-connected at all times. Use proper mains safety practices.
- **Overvoltage capability:** If your variac goes above 100%, you can apply damaging voltage to equipment. Know what you're outputting.
- **Hot when loaded:** Variacs dissipate some heat in normal operation and run warm. Don't cover or enclose tightly.
- **Brush arcing:** Adjusting under heavy load can cause brush arcing. Reduce load before making large adjustments.
- **Grounding:** Enclose the variac in a grounded enclosure or use a properly grounded commercial unit.

## In Practice

- The variac + dim bulb + isolation transformer combination is the gold standard for safely powering up unknown or repaired mains equipment
- For vintage tube equipment, slow bring-up with a variac is essential—old electrolytics reform better with gradually applied voltage
- Keep the variac set to 0V before plugging in the DUT; this prevents surprise full-voltage application
- If you do a lot of mains-connected repair work, a metered variac with built-in ammeter pays for itself in convenience—watching current draw as you increase voltage is extremely informative
