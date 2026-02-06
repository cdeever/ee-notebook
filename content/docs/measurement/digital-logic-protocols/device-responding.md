---
title: "Is the Device ACKing / Responding?"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is the Device ACKing / Responding?

Protocol-level verification. Bus activity is visible, but is the device actually responding? I2C ACK/NACK, SPI response bytes, UART framing — using protocol decode to see what's actually on the wire, not just that something is toggling.

## Protocol Decode

Most modern scopes have I2C, SPI, and UART decode. The scope overlays decoded bytes on the waveform: address, R/W bit, ACK/NACK, data bytes.

**I2C decode:** Connect CH1 to SCL, CH2 to SDA. Enable I2C decode with correct channel assignments. Set threshold voltage (typically VCC/2).

| Decoded element | Meaning |
|----------------|---------|
| Address byte + ACK | Device is present and responding at that address |
| Address byte + NACK | No device at that address, or device is busy/stuck |
| Data bytes with ACK | Successful data transfer |
| Repeated START | Master is chaining transactions |
| STOP | Transaction complete |

**SPI decode:** Connect channels to SCK, MOSI, MISO, and CS. Set clock polarity (CPOL), clock phase (CPHA), bit order, and word size.

| Decoded element | Meaning |
|----------------|---------|
| MOSI shows command bytes, MISO shows 0x00 or 0xFF | Device isn't responding (MISO idle) |
| MOSI shows command, MISO shows data | Device is responding — check if data makes sense |
| MISO always returns same value | Device may be stuck, in reset, or in wrong mode |
| CS never goes low | Master isn't selecting the device |

**UART decode:** Connect a channel to TX or RX. Set baud rate, data bits (8), parity (usually none), stop bits (1).

| Decoded element | Meaning |
|----------------|---------|
| Readable ASCII or expected hex | Communication working at correct baud rate |
| Garbled or random characters | Baud rate mismatch |
| Framing errors | Wrong baud rate, wrong data/stop bits, or noise |

## Logic Analyzer for Extended Capture

When long captures, many channels, or detailed protocol analysis is needed beyond what the scope provides, use a logic analyzer. Logic analyzers capture and decode entire transaction sequences over seconds or minutes.

| Scenario | Better tool |
|----------|------------|
| Quick check: is the bus active? | Scope |
| Check voltage levels and signal quality | Scope |
| Capture entire transaction sequence | Logic analyzer |
| Monitor bus activity over long periods | Logic analyzer |
| Check timing margins with voltage detail | Scope |

Logic analyzers have fixed voltage thresholds — they don't show analog signal quality. A marginal signal that barely crosses the threshold looks the same as a clean one.

## Debugging Common Protocol Issues

**I2C: Device not ACKing**
1. Verify correct 7-bit address (not shifted — some datasheets show 8-bit address)
2. Check pull-up resistors — too high value gives slow rise times
3. Verify device has power and is out of reset
4. Check for address conflicts

**SPI: No response on MISO**
1. Verify CS is actually going low
2. Check CPOL and CPHA settings — wrong phase means device samples at wrong time
3. Verify MISO is connected and not tri-stated
4. Some devices need dummy bytes before responding

**UART: Garbled data**
1. Confirm baud rate matches on both ends
2. Check voltage levels — RS-232 (±12V) differs from TTL/CMOS UART (0/3.3V or 0/5V)
3. Verify TX connects to RX (crossover)
4. Check data format agreement: 8N1 is most common

## Tips

- Protocol decode settings must match device configuration exactly — wrong CPOL/CPHA on SPI, wrong baud on UART, or wrong threshold on I2C gives garbled or missing decode
- Seeing "ACK" on I2C means the device acknowledged the address byte, but doesn't mean the data that follows is correct
- Sample rate for logic analyzers must be at least 4× the clock frequency (10× preferred)

## Caveats

- Some scopes have limited decode depth — they may only decode what's visible on screen
- Protocol decode doesn't replace understanding the protocol — it shows what's on the wire, not whether it's correct for the application
- Cheap logic analyzers may have limited sample rate or buffer depth — check specs for the bus speed needed
- Logic analyzers can't show if a signal is marginal — use scope for signal quality assessment

## In Practice

- I2C NACK on every transaction indicates wrong address, missing device, or device not powered
- I2C ACK on address but NACK on data bytes indicates device communication but register access problem
- SPI MISO always returning 0x00 or 0xFF indicates device not responding — check CS and CPOL/CPHA
- UART framing errors at one baud rate that clear at another indicate baud rate mismatch
- Intermittent NACKs or framing errors indicate marginal signal quality or timing issues
