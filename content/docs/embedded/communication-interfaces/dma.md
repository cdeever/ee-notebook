---
title: "DMA Fundamentals"
weight: 20
---

# DMA Fundamentals

Direct Memory Access is a hardware engine that moves data between memory and peripherals — or between memory locations — without the CPU executing instructions for each byte. On paper, DMA is simple: configure a source, a destination, a count, and a trigger, and the hardware handles the rest. In practice, DMA configuration is one of the most error-prone parts of embedded development because there are many parameters, most failures are silent, and debugging requires understanding both the peripheral and the memory system.

## What DMA Actually Does

Without DMA, every byte transferred between a peripheral and memory requires CPU instructions: read a status register, read or write the data register, increment a pointer, check if the transfer is done. For a UART at 9600 baud, this overhead is negligible. For SPI at 10 MHz, or an ADC sampling at 1 MSPS, the CPU spends most of its time shuffling data and has little left for actual application work.

DMA offloads this data movement to a dedicated hardware engine. The CPU sets up the transfer — source address, destination address, number of items, transfer width, triggers — and then the DMA controller executes it autonomously. When the transfer completes (or reaches a halfway point), the DMA controller raises an interrupt so firmware can process the data.

This is essential for any high-throughput data path: continuous ADC sampling, SPI communication with flash memory or displays, [I2S]({{< relref "i2s" >}}) audio streaming, and [UART]({{< relref "uart" >}}) reception where data arrives unpredictably and must not be lost.

## Channels, Requests, and Mapping

DMA controllers have a fixed number of channels (sometimes called streams) — typically 4 to 16 depending on the MCU. Each channel can be configured for a different transfer. Peripherals generate DMA request signals when they have data ready (for reception) or when they can accept data (for transmission).

The mapping between peripherals and DMA channels is MCU-specific and often not flexible. On many STM32 parts, for example, USART1_RX can only use DMA channel 5 — it cannot be reassigned. This means DMA channel allocation is a system-level resource planning problem: if two peripherals need DMA and both are mapped to the same channel, there is a conflict. Some newer MCUs (STM32G4, STM32H7) include a DMA request multiplexer (DMAMUX) that allows arbitrary mapping, which is significantly more convenient.

Failing to check the channel-to-peripheral mapping in the reference manual is a classic mistake. The DMA will simply not trigger, and there is no error indication — just silence.

## Transfer Modes

### Direction

- **Peripheral-to-memory** — The most common mode. The DMA reads from a peripheral data register and writes to a RAM buffer. Used for ADC results, UART receive, SPI receive.
- **Memory-to-peripheral** — DMA reads from a RAM buffer and writes to a peripheral data register. Used for UART transmit, SPI transmit, DAC output.
- **Memory-to-memory** — DMA copies data between RAM locations. Useful for framebuffer operations or bulk data moves, but not triggered by a peripheral — it runs as fast as the bus allows.

### Increment Modes

The source and destination addresses can independently be configured to increment after each transfer or stay fixed. For peripheral-to-memory, the peripheral address is fixed (it is always the same data register) and the memory address increments. Getting this backward — incrementing the peripheral address or failing to increment the memory address — produces corrupted data or writes to the wrong memory locations.

### Transfer Width

DMA transfers can be byte (8-bit), half-word (16-bit), or word (32-bit). The transfer width must match what the peripheral expects. An ADC with a 12-bit result in a 16-bit data register needs half-word transfers. Using byte transfers reads only half the data register. Using word transfers may read into an adjacent register, depending on the peripheral's memory map.

## Circular Mode and Double Buffering

For continuous data streams — ADC sampling, audio I/O — the DMA needs to run indefinitely without firmware intervention for each buffer. Circular mode makes this possible: when the DMA reaches the end of the buffer, it wraps back to the beginning and keeps going.

The firmware problem is then: how to process data that is being actively overwritten? The standard approach is **double buffering** (sometimes called ping-pong buffering). The DMA buffer is divided into two halves. The DMA controller generates a half-transfer interrupt when it finishes the first half, and a transfer-complete interrupt when it finishes the second half (and wraps). Firmware processes one half while DMA fills the other.

This works, but the timing constraint is real: firmware must finish processing one half before DMA comes back around and overwrites it. If processing takes too long, data is silently corrupted. There is no hardware guard — the DMA does not stop or raise an error if it overwrites data the CPU has not read yet.

Some MCUs (STM32F4/F7/H7) offer true double-buffer mode, where the DMA hardware switches between two separate buffers automatically. This is cleaner than the split-buffer approach and makes the timing easier to reason about.

## Priority and Arbitration

When multiple DMA channels request the bus simultaneously, the DMA controller must decide who goes first. Most controllers offer a configurable priority per channel (low, medium, high, very high) with tie-breaking by channel number. Some support round-robin arbitration instead.

Getting priority wrong usually does not cause data loss — it causes latency. A low-priority ADC DMA that gets preempted by a high-priority SPI DMA may see its transfer delayed by a few microseconds. For most applications, this does not matter. For hard real-time audio or control loops, it can. The DMA priority scheme interacts with the rest of the bus arbitration, including the CPU, so the actual worst-case latency is not always obvious from the DMA settings alone.

## Bus Contention

DMA and the CPU share the bus fabric. On Cortex-M MCUs, the AHB bus matrix provides some concurrency — the CPU can fetch instructions from flash while the DMA accesses RAM — but conflicts are possible. Heavy DMA traffic on SRAM can stall CPU data accesses, increasing interrupt latency and making execution timing less predictable.

On simpler MCUs with a single bus (or on Cortex-M0 devices with a simpler bus matrix), DMA and CPU accesses are strictly interleaved. This means every DMA transfer cycle steals a bus cycle from the CPU. If DMA is moving data continuously, the CPU runs at a fraction of its normal speed. The reference manual usually documents the bus architecture, but the practical impact depends on the specific memory layout — placing DMA buffers in a different SRAM bank than the code's stack and variables can help, if the MCU has multiple banks.

## Configuration Complexity

A typical DMA channel setup requires:
- Source address
- Destination address
- Number of data items
- Transfer width (byte, half-word, word)
- Source increment (yes/no)
- Destination increment (yes/no)
- Transfer direction
- Trigger source (which peripheral request)
- Priority level
- Circular mode (yes/no)
- Interrupts to enable (transfer complete, half transfer, error)

Getting any one of these wrong produces behavior that ranges from "nothing happens" to "data is silently corrupted" to "hard fault." DMA writes to the wrong memory address because the increment mode was wrong, or DMA transfers the wrong number of bytes because the width did not match the count, or DMA never starts because the trigger source was misconfigured. These failures are difficult to debug because the CPU is not directly involved — it is not possible to single-step through a DMA transfer.

The most reliable debugging approach is to start with the simplest possible configuration (memory-to-memory, known data pattern, check the destination after transfer completes), verify that works, and then add complexity one parameter at a time. Using a debugger to inspect the DMA controller registers after setup — before triggering the transfer — catches many configuration errors.

## Tips

- Start with the simplest DMA configuration (memory-to-memory with known pattern) and add complexity one parameter at a time
- Check the DMA request mapping table in the reference manual early — channel conflicts are fixed in hardware on most MCUs
- On Cortex-M7, place DMA buffers in non-cacheable memory or invalidate cache before reading DMA results
- Use the half-transfer interrupt with double buffering to process data while DMA fills the other half
- Verify DMA error flags after transfers — silent failures cause symptoms that appear unrelated to data movement

## Caveats

- **DMA does not know about caches** — On Cortex-M7 and other MCUs with data caches, DMA writes to memory bypass the cache. The CPU may read stale data from cache instead of fresh DMA data
- **Transfer count units depend on transfer width** — Configuring DMA for half-word (16-bit) transfers with count 100 moves 200 bytes. Mixing up "number of bytes" and "number of transfers" causes buffer overruns
- **DMA to peripheral registers requires fixed address** — Accidentally enabling address increment when pointing at a peripheral data register causes the DMA to hit adjacent registers
- **Circular mode overwrites without warning** — If firmware does not process data before the DMA wraps around, data is silently overwritten. There is no overflow flag for this condition
- **Channel mapping conflicts are a system design problem** — Two peripherals mapped to the same DMA channel cannot both use DMA simultaneously. This constraint is fixed in hardware on many MCUs
- **DMA errors are easy to ignore** — Most DMA controllers have error flags that go unchecked. DMA failures produce symptoms that seem unrelated to data transfer

## Bench Relevance

- DMA that appears to complete but produces stale or corrupted data on Cortex-M7 likely has cache coherency issues — check buffer placement and cache invalidation
- Buffer overruns or short transfers often trace to confusion between byte count and transfer count — verify the width setting matches the count
- A DMA that never triggers despite correct peripheral configuration may have the wrong channel assignment — check the request mapping table
- Audio glitches or ADC sample gaps in circular mode indicate processing is too slow — measure processing time against the buffer fill rate
- Corrupted peripheral registers after DMA suggest increment mode is enabled on the peripheral address — verify fixed address mode
