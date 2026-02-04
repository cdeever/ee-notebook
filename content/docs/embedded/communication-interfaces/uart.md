---
title: "UART"
weight: 5
---

# UART

Asynchronous, point-to-point, no shared clock. UART is the simplest serial interface conceptually, and it plays a dual role in embedded systems: it connects peripherals (GPS modules, Bluetooth modules, cellular modems) and it serves as the primary debug and console interface. Most embedded projects end up with at least one UART dedicated to a debug shell or log output. The digital electronics section covers the [bus-level protocol and timing]({{< relref "/docs/digital/data-transfer-and-buses/common-bus-protocols" >}}); this page focuses on the MCU side.

{{< graphviz >}}
digraph uart {
  rankdir=LR
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]

  mcu [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a2a3a" COLOR="#6666aa">
      <TR><TD><B><FONT COLOR="#cccccc">MCU</FONT></B></TD></TR>
      <TR><TD PORT="tx" BGCOLOR="#3e3e5a"><FONT COLOR="#e8e8e8"> TX </FONT></TD></TR>
      <TR><TD PORT="rx" BGCOLOR="#3e3e5a"><FONT COLOR="#e8e8e8"> RX </FONT></TD></TR>
      <TR><TD PORT="gnd" BGCOLOR="#3a3a3a"><FONT COLOR="#999999"> GND </FONT></TD></TR>
    </TABLE>
  >]

  dev [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a3a2a" COLOR="#66aa66">
      <TR><TD><B><FONT COLOR="#cccccc">Peripheral</FONT></B></TD></TR>
      <TR><TD PORT="rx" BGCOLOR="#3e5a3e"><FONT COLOR="#e8e8e8"> RX </FONT></TD></TR>
      <TR><TD PORT="tx" BGCOLOR="#3e5a3e"><FONT COLOR="#e8e8e8"> TX </FONT></TD></TR>
      <TR><TD PORT="gnd" BGCOLOR="#3a3a3a"><FONT COLOR="#999999"> GND </FONT></TD></TR>
    </TABLE>
  >]

  mcu:tx -> dev:rx [color="#8888cc" label=" data " fontcolor="#8888cc"]
  dev:tx -> mcu:rx [color="#88cc88" label=" data " fontcolor="#88cc88"]
  mcu:gnd -> dev:gnd [color="#666666" style=dashed]
}
{{< /graphviz >}}

TX and RX cross over — each device transmits on its TX and the other receives on its RX. There is no clock line; both sides must agree on baud rate independently. The common ground connection is required for the voltage levels to be referenced correctly.

## Configuration Essentials

The MCU's UART peripheral needs a baud rate, a frame format (almost always 8N1), and a clock source. The baud rate generator divides the peripheral clock to produce the bit timing. This is where things get quietly wrong: if the peripheral clock and the desired baud rate do not divide evenly, the actual baud rate deviates from the target. The receiver can tolerate roughly plus or minus 2% mismatch before bits get sampled at the wrong time. At 115200 baud with a 48 MHz peripheral clock, the divisor works out cleanly. At 9600 baud from a 72 MHz clock, check the actual error — the datasheet or reference manual usually has a table.

TX and RX are independent. Transmitting without receiving is fine, and vice versa. Each direction has its own buffer — sometimes a single register, sometimes a small hardware FIFO (4 to 16 bytes is common). FIFO depth matters for burst handling: if the CPU is busy when data arrives and the FIFO overflows, bytes are lost silently. There is no error interrupt for "the CPU was too slow" on most parts — the overrun flag is there, but easy to miss.

## When UART Fits

UART is the default for debug consoles, GPS modules, Bluetooth modules (which often present a UART interface), and any point-to-point link where simplicity matters more than speed. The lack of a clock line means fewer wires, but it also means both sides must agree on timing before they start talking — there is no discovery or negotiation.

For debugging and log output, UART is nearly universal. A USB-to-UART adapter (FTDI, CP2102, CH340) provides a serial terminal on a PC for the cost of a few dollars and two wires. Many development boards include this bridge on-board. Printf-style debug output over UART is the embedded equivalent of console.log — not elegant, but immediately useful and always available.

UART also serves as the control interface for many external modules. Bluetooth modules (HC-05, RN4870), WiFi modules, cellular modems, and GPS receivers all commonly expose a UART interface with AT commands or a proprietary protocol. In these cases, UART is not just a debug channel — it is the primary data path between the MCU and the module.

## Data Handling

**Polling** is simplest: check a status register, read or write the data register, repeat. For UART at 9600 baud, polling is usually acceptable — bytes arrive slowly enough that the CPU has time between them. At 115200 baud, polling still works for short bursts but becomes wasteful if the CPU has other work to do.

**Interrupts** are the standard approach for UART. The peripheral raises an interrupt when data is ready (RX) or when the transmit buffer is empty (TX). The ISR moves data between the peripheral and a software ring buffer. This lets the main loop process complete messages rather than individual bytes.

**DMA** is worth setting up for UART when data arrives in bursts or at high rates — for example, receiving NMEA sentences from a GPS module or streaming data from a cellular modem. DMA frees the CPU from byte-by-byte interrupt handling — more on how DMA works in [DMA Fundamentals]({{< relref "dma" >}}).

## Debugging UART

A logic analyzer with protocol decoding is the most useful tool for UART problems. Seeing the actual waveforms — start bits, data bits, stop bits — reveals whether the issue is baud rate mismatch, wrong frame format, or a wiring problem. Even a cheap 8-channel logic analyzer changes UART debugging from guesswork to direct observation.

Common failure patterns visible on a logic analyzer:
- **Garbled data**: baud rate mismatch — the bit boundaries do not align with what the receiver expects
- **Framing errors**: wrong stop bit count or parity setting
- **One direction works, the other does not**: TX/RX swapped, or the non-working side is not configured

See [Probing & Measurement Technique]({{< relref "/docs/measurement/probing-technique" >}}) for connection details.

## Tips

- Use DMA with a ring buffer for UART receive to avoid losing bytes during CPU-busy periods
- Check the UART error flags (overrun, framing, noise) when debugging intermittent data loss
- Calculate the actual baud rate error from the peripheral clock divider and verify it is within 2% of the target
- Use a logic analyzer with protocol decoding to diagnose UART problems — it shows whether issues are baud rate, wiring, or configuration
- When UART does not work at all, swap TX and RX wires before changing anything else

## Caveats

- **UART overrun errors are silent unless checked** — If the receive FIFO overflows because firmware was too slow, the UART peripheral sets an overrun flag, but most code never checks it. Data is quietly lost
- **Baud rate error accumulates across the frame** — A UART with 1.5% baud rate error might work at 8N1 (10 bits per frame) but fail at 8N2 (11 bits) or with 9-bit data. The sampling error compounds with each bit
- **TX/RX crossover is the most common wiring mistake** — TX on one side connects to RX on the other. Some boards label pins from their own perspective, others from the perspective of what they connect to

## Bench Relevance

- Garbled received data at specific intervals suggests baud rate mismatch — verify the clock divider produces acceptable error
- Missing bytes in bursts indicates FIFO overflow — check the overrun flag and consider DMA or larger buffers
- UART that works in one direction but not the other often has TX/RX swapped — try swapping wires before debugging configuration
- Framing errors visible on a logic analyzer indicate wrong stop bit count or parity setting
