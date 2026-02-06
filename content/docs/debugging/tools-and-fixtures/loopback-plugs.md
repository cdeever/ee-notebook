---
title: "Loopback Plugs"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

A loopback plug connects a device's output back to its input, allowing you to test the interface without external equipment. If you send data out and receive it back correctly, you've verified that the transmitter, receiver, and their supporting circuitry all work. If you don't, you've isolated the problem to the local device rather than the cable, remote endpoint, or protocol stack.

Loopback plugs are essential for answering the question: "Is it my device or the thing I'm connecting to?"

## Why Loopback Testing Works

Most communication interfaces are bidirectional—they have separate transmit and receive paths. A loopback plug creates a short circuit between these paths at the connector. Data sent out immediately returns, bypassing:

- The cable
- The remote device
- Protocol negotiation (in most cases)
- Any intermediate equipment (hubs, switches, adapters)

This reduces a complex system to just the local transmitter and receiver. If loopback works, your hardware is functional. If it fails, the problem is local.

## Common Loopback Plugs

### RS-232 Serial (DB-9)

The most common loopback plug. Connect:

| Pin | Signal | Connect To |
|-----|--------|------------|
| 2 | RX (Receive Data) | Pin 3 |
| 3 | TX (Transmit Data) | Pin 2 |
| 7 | RTS (Request to Send) | Pin 8 |
| 8 | CTS (Clear to Send) | Pin 7 |
| 6 | DSR (Data Set Ready) | Pins 1 and 4 |
| 1 | DCD (Carrier Detect) | Pins 4 and 6 |
| 4 | DTR (Data Terminal Ready) | Pins 1 and 6 |

The TX→RX connection is the essential one. The handshaking lines (RTS/CTS, DTR/DSR/DCD) may or may not matter depending on your software configuration. Looping them satisfies software that expects handshaking to be present.

**Minimal loopback:** For quick tests where handshaking is disabled, just short pins 2 and 3.

### RS-232 Serial (DB-25)

Older equipment uses DB-25 connectors with different pinouts:

| Pin | Signal | Connect To |
|-----|--------|------------|
| 2 | TX | Pin 3 |
| 3 | RX | Pin 2 |
| 4 | RTS | Pin 5 |
| 5 | CTS | Pin 4 |
| 6 | DSR | Pins 8 and 20 |
| 8 | DCD | Pins 6 and 20 |
| 20 | DTR | Pins 6 and 8 |

### UART / TTL Serial (Header Pins)

For 3.3V or 5V logic-level serial on header pins (common on development boards, embedded systems), loop TX to RX directly. There's no handshaking to worry about—just two wires or a jumper connecting the TX and RX pins.

Be aware of voltage levels: a loopback plug doesn't change signal levels, so this only works when TX and RX operate at the same voltage.

### Ethernet (RJ-45)

An Ethernet loopback plug connects the TX pair to the RX pair:

| Pin | Signal (T568B) | Connect To |
|-----|----------------|------------|
| 1 | TX+ | Pin 3 (RX+) |
| 2 | TX- | Pin 6 (RX-) |
| 3 | RX+ | Pin 1 (TX+) |
| 6 | RX- | Pin 2 (TX-) |

This works for 10/100 Mbps Ethernet. Gigabit Ethernet uses all four pairs bidirectionally, so a simple loopback doesn't work the same way—the PHY may not link up, or you may need a more sophisticated test setup.

**Note:** Many Ethernet controllers won't establish a link with a loopback plug because there's no PHY handshake at the other end. Some NICs have a "PHY loopback" mode that can be enabled in software or diagnostics. Check your hardware's capabilities.

### USB

USB loopback is more complex because USB is a host-controlled protocol. You can't simply loop D+ to D-. Instead, USB loopback testing requires:

- **USB loopback devices:** Purpose-built test dongles that enumerate as a device and echo data back
- **USB protocol analyzers:** Hardware that captures and replays traffic
- **Software loopback:** Using a device that supports loopback mode (some USB-to-serial adapters have this)

For basic "does the port work?" testing, plugging in a known-good device (keyboard, flash drive) is often simpler than building a loopback fixture.

### Audio (TRS / 1/4" / 3.5mm)

For line-level audio interfaces:

- **Stereo (TRS):** Connect tip (left) and ring (right) to sleeve (ground) through resistors, or loop tip to ring to test stereo channel routing
- **Balanced (TRS):** Connect tip (hot) to ring (cold), leave sleeve grounded

Audio loopback is commonly used with software that generates a test tone on the output and measures it on the input—useful for testing sound cards, audio interfaces, and mixer channels.

### MIDI

MIDI is unidirectional on each connector, so a loopback means connecting MIDI OUT to MIDI IN with a standard MIDI cable. This tests the entire MIDI path: UART, optoisolator, and driver circuitry.

## Building Loopback Plugs

Most loopback plugs are easy to build:

**Materials:**
- Appropriate connector (DB-9, DB-25, RJ-45, etc.)
- Short pieces of wire or solder bridges
- Heat shrink or enclosure for durability

**Construction tips:**
- Use connectors you can solder or crimp easily—DB-9 solder-cup connectors are common
- Keep the plug compact; long wires can pick up noise or cause signal integrity issues at high speeds
- Label the plug clearly so you don't mistake it for an adapter
- For RJ-45, you can crimp a plug with internally looped wires

**Ready-made options:** Commercial loopback plugs are available for RS-232, Ethernet, and other interfaces. They're inexpensive and worth buying if you test these interfaces frequently.

## Using Loopback Plugs

### Serial Port Testing

1. Connect the loopback plug to the port
2. Open a terminal program (minicom, PuTTY, screen, etc.)
3. Configure the correct baud rate, data bits, parity, and stop bits
4. Type characters—they should echo back and appear on screen
5. If no echo, check: wrong COM port, handshaking misconfigured, hardware fault

**Software matters:** Make sure local echo is disabled in your terminal software, or you'll see double characters (one from local echo, one from loopback).

### Embedded UART Testing

1. Jumper TX to RX on the header
2. Send a known byte sequence from your firmware
3. Check that the receive interrupt fires and the same bytes come back
4. This validates the UART peripheral, baud rate generator, and GPIO pin configuration

### Automated Testing

Loopback tests integrate well into automated test frameworks:

- Send a known pattern, verify exact return
- Vary baud rates, test at each speed
- Stress test with continuous data to find buffer or timing issues

## Limitations

- **Protocol dependencies:** Some protocols require proper handshaking or link negotiation that loopback can't satisfy
- **Doesn't test cables:** That's the point—but remember that if loopback works and the full connection doesn't, the cable or remote end is suspect
- **Doesn't test drivers or protocol stacks:** Loopback tests hardware, not high-level software
- **Speed limitations:** Very high-speed interfaces may have signal integrity issues with loopback plugs—the return path isn't matched like a proper cable would be

## In Practice

- A DB-9 RS-232 loopback plug is the single most useful loopback fixture; build or buy one first
- When serial communication fails, loopback testing takes 30 seconds and immediately tells you whether to debug locally or look at the other end
- Label your loopback plugs clearly—they look like adapters and will confuse you (or colleagues) if unmarked
- Keep loopback plugs with your test cables so they're always available when troubleshooting connectivity issues
