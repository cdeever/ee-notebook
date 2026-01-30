---
title: "Registers & Counters"
weight: 20
---

# Registers & Counters

Flip-flops store individual bits. Registers group flip-flops to store multi-bit values. Counters are registers that increment or decrement on each clock cycle. Together, these are the workhorses of sequential digital systems — holding data, shifting it, counting events, generating sequences, and dividing clocks.

## Registers

A register is a group of flip-flops sharing a common clock, storing a multi-bit word.

### Parallel Load Register

All bits load simultaneously on a clock edge when the load enable is active. This is the most common register type — it's how data is captured from a bus, stored in a pipeline stage, or held at the output of an ALU.

**Practical considerations:**
- All data inputs must meet setup and hold timing relative to the clock edge
- An output enable (active-LOW OE) allows the register to drive a bus when selected and float when not — implemented with tri-state output buffers
- Registers with both load enable and output enable are the building blocks of register files in processors

### Shift Register

Bits move one position per clock cycle — each flip-flop's output connects to the next flip-flop's input.

**Types by data movement:**
- **SISO (Serial In, Serial Out):** Data enters one bit at a time and exits one bit at a time. Used for delay lines and serial data buffering
- **SIPO (Serial In, Parallel Out):** Data enters serially and is available at all outputs simultaneously after n clocks. This is how SPI and UART receivers deserialize incoming data
- **PISO (Parallel In, Serial Out):** All bits load simultaneously, then shift out one at a time. This is how SPI and UART transmitters serialize data
- **PIPO (Parallel In, Parallel Out):** Parallel load and parallel output — essentially a standard register with shift capability

**Practical uses:**
- Serial-to-parallel and parallel-to-serial conversion (the hardware basis for UART, SPI, and many other serial protocols)
- Delay lines — a shift register delays a signal by n clock cycles
- Pseudo-random number generation — a shift register with XOR feedback (Linear Feedback Shift Register, LFSR) produces a pseudo-random sequence of maximum length 2^n - 1
- LED drivers and display scanning — shift registers expand the number of outputs controllable from a few pins (e.g., 74HC595)

### Bidirectional Shift Register

Can shift left or right, controlled by a direction input. Combined with parallel load capability, this creates a versatile building block for arithmetic operations (shift left = multiply by 2, shift right = divide by 2) and data routing.

## Counters

A counter is a register that increments (or decrements) its stored value on each clock cycle.

### Asynchronous (Ripple) Counter

The simplest counter: each flip-flop's output clocks the next flip-flop. Built from T flip-flops (or JK flip-flops with J=K=1), each stage toggles at half the frequency of the previous stage.

**Structure:** The first flip-flop is clocked by the external clock. Its output clocks the second flip-flop. The second's output clocks the third, and so on. The result is a binary counter.

**Problem — ripple delay:** Each stage adds one flip-flop propagation delay. An 8-bit ripple counter has up to 8 x t_cq delay from the clock edge to the MSB settling. During this ripple period, intermediate bits are changing at different times, and the counter output passes through invalid states.

**When ripple counters are acceptable:**
- Low-speed applications where the ripple delay is negligible compared to the clock period
- Frequency dividers where only the final stage's output matters (and intermediate states aren't observed)
- Simple LED counters or event counters without tight timing requirements

**When they are not:** Any synchronous system that reads the counter value — if the counter is rippling while being read, the captured value may be incorrect. This is the fundamental reason synchronous counters exist.

### Synchronous Counter

All flip-flops are clocked simultaneously by the same clock edge. The count logic (which flip-flops should toggle on this cycle) is implemented as combinational logic feeding each flip-flop's input.

**Advantages over ripple:**
- All outputs change simultaneously (within clock-to-Q delay), eliminating intermediate invalid states
- The counter value is valid and stable for timing analysis
- Can be combined with other synchronous logic without special precautions

**Trade-off:** More complex combinational logic, especially for wider counters. The carry chain (detecting when all lower bits are 1, meaning the next bit should toggle) limits the maximum frequency for wide counters.

### Up/Down Counters

Count in either direction, controlled by an up/down input. Useful for position tracking (quadrature encoders), bidirectional measurement, and stack pointer implementations.

### Modulo-N Counters

Count from 0 to N-1, then wrap. A mod-10 (decade) counter counts 0-9 and is the basis for BCD counting and display drivers. Implemented by detecting the terminal count (9 for mod-10) and resetting to 0.

**Caution with asynchronous reset:** Detecting count 9 and asynchronously resetting to 0 creates a brief glitch where the counter shows the value after 9 (10, or 1010 in binary) before the reset takes effect. Synchronous reset (resetting on the next clock edge after detecting 9) avoids this glitch but requires the reset to be fast enough to meet timing.

### Prescalers and Clock Dividers

A counter used purely to divide a clock frequency. An n-bit counter divides the clock by 2^n. A mod-N counter divides by N. Used to derive slower clocks from a fast system clock.

**Duty cycle note:** A simple binary counter's MSB output has a 50% duty cycle, but intermediate taps may not. For a clean 50% duty cycle at a non-power-of-2 division ratio, toggle a flip-flop at the half-count point.

## Ring Counters and Johnson Counters

**Ring counter:** A shift register with the serial output fed back to the serial input. One bit is set (the others are 0), and this single 1 circulates through the register. An n-bit ring counter has n states, producing a one-hot sequence. Simple decoding (each output is already one-hot) but inefficient use of flip-flops (n flip-flops for n states, vs. log2(n) for a binary counter).

**Johnson counter (twisted ring):** The inverted output feeds back to the input. An n-bit Johnson counter has 2n states. Decoding requires 2-input AND gates (one per state), which is simpler than decoding a binary counter. Used in timing generators and decade counters.

## Gotchas

- **Ripple counters produce invalid intermediate states** — Never use a ripple counter's output as input to combinational logic in a synchronous system without first registering (re-clocking) it. The intermediate states can trigger incorrect behavior
- **Synchronous counter carry chains limit speed** — For a 32-bit synchronous counter at high clock frequencies, the carry chain propagation delay may exceed the clock period. Carry-lookahead techniques (similar to adder design) or pipelining the counter solve this
- **Overflow and underflow** — A counter that wraps from its maximum to 0 (or 0 to maximum for down-counting) must be handled correctly in the surrounding logic. If the counter value is compared against a threshold, the comparison must account for wraparound
- **Gray code counters avoid multi-bit transitions** — A binary counter can change multiple bits simultaneously (e.g., 0111 to 1000 changes all 4 bits). In a Gray code counter, only one bit changes per count. This is essential for counters whose outputs cross clock domains (FIFO read/write pointers). See [Clock Domain Crossing]({{< relref "/docs/digital/timing-and-synchronization/clock-domain-crossing" >}})
- **Shift register initial state** — Like flip-flops, shift registers power up in an indeterminate state. A ring counter with no guaranteed initial state may have zero bits set (stuck at all-0) or multiple bits set (invalid one-hot). Always include reset logic to initialize the correct starting pattern
