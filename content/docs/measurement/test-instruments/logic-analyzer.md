---
title: "Logic Analyzer"
weight: 70
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Logic Analyzer

A logic analyzer captures digital signals as sequences of highs and lows — logic 1 and logic 0 — across many channels simultaneously. It trades the oscilloscope's analog voltage detail for channel count and protocol awareness. When a bus transaction fails, an SPI transfer returns garbage, or an I²C device NAKs unexpectedly, the logic analyzer shows exactly what happened at the bit level across every signal in the bus.

## What It Does

The logic analyzer samples each input channel at a fixed rate and records the logic state (above or below a threshold voltage) over time. The captured data is displayed as a timing diagram showing all channels aligned to the same timebase. Protocol decoders overlay the raw timing with interpreted data — bytes, addresses, read/write bits, ACK/NAK, error flags — making bus transactions human-readable.

Unlike an oscilloscope, a logic analyzer does not show voltage levels, noise, ringing, or analog signal quality. It sees only "high" and "low." This is a strength for protocol debugging (you see exactly what the bus controller and peripherals are exchanging) and a limitation when the problem is analog (slow rise times, marginal logic levels, glitches below the threshold).

## Key Specs and What They Mean

| Spec | What it means | Why it matters |
|---|---|---|
| Channel count | Number of digital inputs captured simultaneously | Must cover all signals in the bus plus control/enable lines. SPI needs 4 channels minimum; a 16-bit parallel bus plus control signals needs 20+ |
| Sample rate | How fast each channel is sampled (in Sa/s or MHz) | Must be ≥4× the data rate for reliable capture. A 1 MHz SPI clock needs ≥4 MSa/s; a 100 MHz bus needs ≥400 MSa/s |
| Memory depth | Total samples stored across all channels | Deeper memory captures longer transactions. A bus initialization sequence may last seconds at a slow data rate but require millions of samples at a fast one |
| Threshold voltage | Logic level threshold, often adjustable per channel group | Must match the logic family. 1.4V for 3.3V LVCMOS, 0.8V/2.0V for 5V TTL, 0.9V for 1.8V logic. Wrong threshold misreads data |
| Protocol decoders | Available protocol interpreters (SPI, I²C, UART, 1-Wire, CAN, etc.) | Good decoders save hours of manual bit counting. Check that the specific protocols you use are supported |
| Trigger types | Edge, pattern, protocol-level triggers | Pattern triggers capture specific bus states. Protocol triggers capture specific transactions (e.g., "trigger on I²C address 0x68 with NAK"). More trigger options = finding the problem faster |
| Input impedance | Loading on the signal being measured | High impedance (100 kΩ+) and low input capacitance (<5 pF) minimize disturbance to the circuit. Excessive loading changes timing and may cause failures |

## USB Logic Analyzers vs MSO vs Benchtop

Three form factors serve different needs:

**USB logic analyzers** connect to a PC and use software for display and analysis. They are compact, affordable, and have excellent protocol decode capabilities (the software is often better than embedded scope firmware). Popular options like Saleae and sigrok-compatible devices cover 8–16 channels at 100–500 MSa/s and handle most embedded debugging well. The trade-off: they depend on a PC and cannot observe analog signal quality.

**MSO (Mixed Signal Oscilloscope)** adds digital channels (typically 8–16) to a standard oscilloscope. The advantage is seeing analog and digital signals correlated in time on the same display — watching the SPI clock's analog rise time alongside the decoded byte values. MSO channels usually have lower sample rate and fewer protocol decode features than a dedicated logic analyzer, but the analog+digital correlation is powerful.

**Benchtop logic analyzers** are standalone instruments with deep memory, high channel counts (32–128+), and fast sample rates. They are expensive and primarily found in labs working with parallel buses, FPGA verification, and high-speed digital design. For most embedded work, USB analyzers and MSOs have displaced them.

## Feature Tiers

| Tier | Typical specs | Good enough for | Not sufficient for |
|---|---|---|---|
| **Entry** (8 ch USB, basic decode) | 8 channels, 24 MSa/s, SPI/I²C/UART decode, edge trigger | Low-speed serial debugging (UART at 115200, I²C at 100–400 kHz, SPI at <1 MHz), GPIO timing | Fast SPI (>10 MHz), parallel buses, protocol-level triggers, long captures at high speed |
| **Mid-range** (16 ch USB or MSO, pattern trigger) | 16 channels, 100–500 MSa/s, extensive protocol decode, pattern/protocol triggers | Most embedded serial buses (SPI to ~25 MHz, I²C to 1 MHz, CAN, 1-Wire), moderate-speed parallel interfaces | DDR, LVDS, high-speed SerDes, very deep captures at high speed |
| **High-end** (32+ ch, deep memory, high speed) | 32–128 channels, 1+ GSa/s, gigabytes of memory, state/timing modes, advanced triggers | FPGA verification, wide parallel buses, high-speed protocols (JTAG chains, DDR), long automated captures | Very high-speed serial (multi-Gbps) — those use dedicated protocol-specific analyzers |

## Gotchas and Limits

- **No analog information:** A logic analyzer sees only high and low. A signal with slow rise time, excessive ringing, or marginal voltage levels may read correctly on the logic analyzer while causing errors in the actual circuit. If the logic analyzer capture looks clean but the circuit misbehaves, switch to an oscilloscope to check analog signal quality.
- **Threshold selection matters:** Setting the threshold wrong silently corrupts the capture. If the logic analyzer is set for 5V logic (1.4V threshold) but the circuit uses 1.8V logic (0.9V threshold), signals that are valid 1.8V logic levels will read as random noise or stuck-high.
- **Sample rate vs data rate:** Capturing a 10 MHz SPI clock at 12 MSa/s (barely above Nyquist) produces aliasing — the captured clock may appear to have irregular timing or missing edges. Use at least 4× the clock rate for reliable timing and 10× for accurate pulse width measurement.
- **Channel grouping and timing skew:** On some analyzers, channels within a group share a clock, but different groups may have slight timing skew. When analyzing timing between channels across groups, check the skew spec.
- **Protocol decode errors are not always bus errors:** The decoder depends on correct configuration — clock polarity, data phase, bit order, address width. A decode error may mean the decoder settings are wrong, not that the bus transaction failed. Verify decoder settings against the device's datasheet.

## Tips

- Name your channels before starting a capture — "SCK," "MOSI," "MISO," "CS" is much more readable than "D0," "D1," "D2," "D3" when you come back to the capture later
- Use protocol-level triggers when available to capture the specific transaction you are debugging instead of scrolling through thousands of transactions to find it
- Save interesting captures to disk for comparison — when you fix a bug, having the "before" capture alongside the "after" shows exactly what changed
- For intermittent protocol errors, set up a long capture with a trigger on the error condition (NAK, framing error, protocol violation) and let it run until the error occurs
- When the logic analyzer and the oscilloscope disagree about whether a signal is correct, the oscilloscope is right — the logic analyzer may be seeing a "valid" logic level that is actually in the undefined region

## Caveats

- **Compression can hide timing detail** — Some logic analyzers use run-length encoding (RLE) or transitional storage to extend effective capture depth. This works well for signals with long idle periods but may miss closely spaced edges during burst activity if the compression buffer fills
- **USB bandwidth limits real-time streaming** — USB-based analyzers have a maximum sustained throughput. Capturing 16 channels at 500 MSa/s produces 1 GB/s of data — more than USB 2.0 can sustain. The analyzer captures into internal buffer and transfers afterward, limiting the continuous capture time
- **Probing adds capacitance** — Even "high impedance" logic analyzer probes add 3–10 pF per channel. On a fast bus with tight timing margins, connecting 16 probes adds significant capacitive load. Use proper probe connections (short ground leads, minimal wire length) and check that the circuit still works correctly with the probes attached
- **Not all protocol decoders are equal** — Some decoders handle only the basic case (standard-mode I²C, 8-bit SPI). Edge cases (10-bit I²C addressing, multi-byte SPI with chip-select management, CAN FD) may require specific decoder versions or manual interpretation

## In Practice

- When an SPI peripheral returns 0xFF or 0x00 for all reads, the logic analyzer instantly shows whether the clock is running, the chip select is asserted, and the peripheral is actually responding — or whether the firmware is talking to itself
- An I²C device that intermittently NAKs may have an address conflict, be busy with an internal operation, or be seeing a bus condition it interprets as an error. The logic analyzer capture shows the exact byte where the NAK occurs and the bus state leading up to it
- UART garbage (wrong baud rate, inverted logic, or framing errors) looks the same on a terminal. The logic analyzer shows the actual bit timing, making it easy to calculate the real baud rate and determine if the polarity is inverted
- When firmware reports a successful transaction but the hardware does not respond, the logic analyzer shows whether the firmware actually generated the bus transaction it claims to have sent
