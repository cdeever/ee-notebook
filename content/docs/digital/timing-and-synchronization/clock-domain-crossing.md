---
title: "Clock Domain Crossing"
weight: 30
---

# Clock Domain Crossing

When a signal passes from one clock domain to another, there is no guarantee that it will meet setup and hold timing at the destination — the two clocks are, in general, asynchronous to each other. This creates the possibility of metastability: the destination flip-flop captures the signal during a transition and its output is indeterminate for some time. Managing clock domain crossings (CDCs) is one of the most important reliability challenges in digital design.

Every multi-clock system must handle CDCs explicitly. Ignoring them doesn't make the problem go away — it makes it a production reliability issue.

## Why CDCs Are Dangerous

Two clocks that are not derived from the same source (or are derived from the same source but through independent PLLs) are asynchronous. Their edges are not aligned, and the phase relationship between them drifts continuously.

**The consequence:** Any flip-flop receiving data from a different clock domain will, statistically, sample that data during a transition at some point. When this happens:

- The flip-flop enters a metastable state
- The output may oscillate, sit at an intermediate voltage, or take an abnormally long time to resolve
- Downstream logic that depends on this output can malfunction — latching incorrect values, generating glitches, or propagating metastable states further

The probability of metastability per clock edge is small. But over millions of clock cycles per second, even a tiny probability produces failures. The mean time between failures (MTBF) depends on the clock frequencies, the signal's transition rate, and the flip-flop's metastability characteristics.

## The Two-Flip-Flop Synchronizer

The standard technique for synchronizing a single-bit signal between clock domains.

**Structure:** Two flip-flops in series, both clocked by the destination clock. The source signal connects to the D input of the first flip-flop. The output of the second flip-flop is the synchronized signal.

**How it works:**
1. The first flip-flop may go metastable when sampling the asynchronous input
2. The metastable state has one full destination clock period to resolve before the second flip-flop samples it
3. If the resolution time is shorter than the clock period (which it almost always is for modern flip-flops), the second flip-flop captures a clean, valid logic level

**MTBF calculation (intuition):**
- MTBF increases exponentially with the resolution time available (the destination clock period)
- Modern flip-flops in current process nodes typically achieve MTBF > 100 years with a two-stage synchronizer at clock frequencies up to several hundred MHz
- At very high frequencies (GHz+), three-stage synchronizers may be needed to maintain adequate MTBF

**Limitations:**
- Adds latency: the synchronized signal is delayed by 2 destination clock cycles
- Only works for single-bit signals. Multi-bit signals (buses) cannot be safely synchronized bit-by-bit because each bit may resolve differently, producing a corrupted value

## Synchronizing Multi-Bit Signals

### Gray Code Encoding

For counters and pointers (like FIFO read/write pointers), Gray code encoding ensures that only one bit changes between adjacent values. This means that if the destination clock samples during a transition, the captured value is either the old value or the new value — never a corrupted intermediate.

**Application:** FIFO pointer synchronization. The write pointer (in the write clock domain) is Gray-code encoded, then synchronized through a two-flip-flop synchronizer into the read clock domain. Because only one bit changes at a time, the synchronized pointer is always a valid value (though it may be one cycle behind the actual pointer).

**Limitation:** Only works for signals that change by exactly one count per cycle. General multi-bit buses need other techniques.

### Handshake Protocols

For arbitrary multi-bit data that changes infrequently:

1. The source places data on a bus and asserts a "request" signal
2. The "request" is synchronized into the destination domain via a two-flip-flop synchronizer
3. The destination captures the data bus (which has been stable since before the request was asserted)
4. The destination asserts an "acknowledge" signal
5. The "acknowledge" is synchronized back to the source domain
6. The source sees the acknowledge and is free to change the data bus

**Key requirement:** The data bus must be stable before the request is asserted and must remain stable until the acknowledge returns. The synchronizers handle only the control signals (request and acknowledge), not the data.

**Throughput:** Limited by the round-trip latency of the handshake (at least 4 synchronizer delays). Suitable for configuration registers and infrequent transfers, not for streaming data.

### Asynchronous FIFOs

The standard mechanism for transferring streaming data between clock domains.

**Structure:**
- A dual-port RAM with independent write and read ports
- A write pointer in the write clock domain
- A read pointer in the read clock domain
- Gray-coded pointers synchronized between domains for full/empty detection

**How it works:**
1. The writer writes data at the write pointer's address and increments the write pointer
2. The reader reads data at the read pointer's address and increments the read pointer
3. The write pointer is Gray-code encoded and synchronized into the read domain to detect "full" (write pointer equals read pointer after wrapping)
4. The read pointer is Gray-code encoded and synchronized into the write domain to detect "empty" (read pointer equals write pointer)

**Design considerations:**
- FIFO depth must be large enough to absorb the rate difference between producer and consumer, plus the synchronization latency
- The full/empty flags are conservative — due to synchronization delay, the FIFO may appear full when it has one or two slots available (and similarly for empty). This is safe but slightly reduces usable depth
- Power-of-2 depths simplify Gray code encoding and pointer comparison

## Pulse Synchronization

A single-clock-cycle pulse in the source domain may be missed entirely by the destination domain if the destination clock is slower (the pulse disappears between destination clock edges).

**Solution — pulse-to-toggle-to-pulse:**
1. In the source domain, toggle a flip-flop on each pulse (converting a pulse to a level change)
2. Synchronize the level change through a two-flip-flop synchronizer into the destination domain
3. In the destination domain, detect the level change (edge detector) and convert it back to a pulse

This guarantees that every source pulse produces exactly one destination pulse, regardless of the frequency relationship. However, if source pulses arrive faster than the synchronization latency can handle, pulses will be lost. A counter or FIFO is needed for reliable high-rate transfer.

## Reset Synchronization

Asynchronous resets that span multiple clock domains must be synchronized into each domain independently.

**Standard pattern — asynchronous assert, synchronous deassert:**
1. The asynchronous reset immediately asserts reset in all domains (this is safe because asserting reset is not timing-critical)
2. When the reset source deasserts, a two-flip-flop synchronizer in each clock domain captures the deassertion synchronously
3. Each domain releases from reset on a clean clock edge, preventing metastability

This is critical because releasing from reset near a clock edge can cause some flip-flops to see the reset and others not — creating an inconsistent initial state.

## CDC Verification

Clock domain crossings are notoriously difficult to verify by simulation alone, because metastability is a probabilistic phenomenon that doesn't appear in RTL simulation.

**CDC analysis tools** (e.g., Synopsys SpyGlass CDC, Cadence Conformal CDC, Mentor Questa CDC) statically analyze the design to:
- Identify all signals crossing clock domain boundaries
- Check that every crossing uses a proper synchronization structure
- Flag unsynchronized crossings, multi-bit crossings without proper encoding, and other common errors

**Best practice:** Run CDC analysis early and often during design. CDC bugs are extremely difficult to find in lab testing because they manifest as rare, intermittent failures that depend on the exact phase relationship between clocks.

## Gotchas

- **Multi-bit signals cannot be synchronized with parallel two-flip-flop synchronizers** — Each bit may resolve independently, producing a value that was never present in the source domain. Always use Gray code, handshake, or FIFO for multi-bit crossings
- **Synchronizers work on level changes, not edges** — A pulse that is shorter than the destination clock period may be missed entirely. Use toggle-based pulse synchronizers for single-cycle pulses
- **"Same frequency" does not mean "same clock"** — Two 100 MHz clocks from different sources are asynchronous, even though they have the same nominal frequency. They require CDC synchronization
- **Related clocks have deterministic phase relationships** — Two clocks derived from the same PLL output (e.g., 100 MHz and 50 MHz from the same reference) are synchronous. Their phase relationship is known, and synchronizers may be unnecessary — but only if the tools can verify the timing path. When in doubt, synchronize
- **CDC failures are intermittent and environment-dependent** — A CDC bug might produce failures once per hour, once per day, or once per month. The failure rate depends on clock frequency, temperature (which affects metastability resolution time), and the exact phase relationship at the moment of crossing. Board-level testing may not find the bug; only analysis tools can guarantee correctness
- **Over-synchronizing wastes latency** — Adding synchronizers where they aren't needed (e.g., between flip-flops in the same clock domain) adds unnecessary pipeline delay. CDC analysis should identify exactly which crossings need synchronization
