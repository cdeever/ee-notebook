---
title: "Digital Modulation & Data Encoding"
weight: 30
---

# Digital Modulation & Data Encoding

Where DSP meets communications. Digital audio data — PCM samples — must be transmitted between chips, boards, and devices. The way bits are encoded on the wire determines clock recovery, error resilience, bandwidth efficiency, and EMI characteristics. This topic bridges audio signal processing with [serial communication protocols]({{< relref "/docs/embedded" >}}) and [digital bus design]({{< relref "/docs/digital/data-transfer-and-buses" >}}).

## Line Codes

A line code defines how binary data maps to voltage levels or transitions on a physical link. The choice of line code affects DC balance, clock recovery, bandwidth, and error detection.

**NRZ (Non-Return-to-Zero)** — The simplest encoding: 1 = HIGH, 0 = LOW. Straightforward but problematic for long runs of identical bits — the receiver has no transitions to synchronize its clock to, and DC wander can shift the decision threshold.

**NRZI (Non-Return-to-Zero Inverted)** — A 1 is encoded as a transition; a 0 is no transition (or vice versa). Better than NRZ for clock recovery on data with many 1s, but long runs of 0s still produce no transitions.

**Manchester** — Every bit has a transition in the middle of the bit period. 1 = low-to-high transition; 0 = high-to-low (or vice versa by convention). Guaranteed clock recovery because every bit has an edge. The price: double the bandwidth requirement (the symbol rate is 2× the bit rate). Used in Ethernet (10BASE-T) and some sensor interfaces.

**8b/10b** — Maps 8-bit data words to 10-bit symbols chosen to maintain DC balance (roughly equal numbers of 1s and 0s) and provide sufficient transitions for clock recovery. The 25% overhead is the cost. Used in S/PDIF (biphase mark encoding is similar), USB 3.0, SATA, and PCIe (older versions). Special control symbols provide framing.

**Biphase Mark / Differential Manchester** — Used in AES/EBU and S/PDIF digital audio. A transition occurs at every bit boundary. A 1 also has a transition in the mid-bit; a 0 does not. Self-clocking with guaranteed transition density.

## Audio Interface Protocols

### I2S (Inter-IC Sound)

The standard for inter-chip digital audio. Three signals:
- **SCK (Serial Clock / Bit Clock)** — Clocks each bit
- **WS (Word Select / LRCK)** — Selects left or right channel (toggles at the sample rate)
- **SD (Serial Data)** — Audio data, MSB first

I2S is simple, synchronous, and widely supported by MCUs, codecs, and DSP chips. Clock rates: bit clock = sample rate × bits per sample × 2 channels. For 48 kHz, 32-bit, stereo: 3.072 MHz bit clock.

**Variants:** Left-justified, right-justified, DSP/TDM mode. The data alignment and WS timing differ slightly. Check both transmitter and receiver configurations — mismatched formats produce garbled audio at the correct sample rate (a signature debugging clue).

### TDM (Time Division Multiplexing)

An extension of I2S for multiple channels. Multiple audio channels share a single serial data line, with each channel assigned a time slot within each sample period. A frame sync signal marks the beginning of each sample frame.

- **TDM4, TDM8, TDM16, TDM32** — The number indicates channels per frame
- **Bit clock:** Sample rate × bits per slot × number of slots (can be very fast for many channels)
- Used in pro audio, mixing consoles, and multi-channel codec chips

### S/PDIF (Sony/Philips Digital Interface)

A consumer digital audio interface carrying PCM audio on a single coaxial (75 Ω) or optical (TOSLINK) connection. The data is self-clocking (biphase mark encoding) and includes channel status, user data, and error-detection bits.

- **Sample rates:** 32, 44.1, 48, 88.2, 96, 176.4, 192 kHz
- **Resolution:** Up to 24 bits
- **No separate clock** — The receiver recovers the clock from the data stream using a PLL. Clock recovery quality directly affects jitter and, consequently, audio performance

**AES/EBU (AES3)** is the professional version: balanced (110 Ω), higher voltage levels, same encoding. More robust in electrically noisy environments.

## Signal Integrity on Digital Audio Links

Digital audio links carry multi-megahertz signals with timing precision requirements that rival RF design:

**I2S and TDM:** Point-to-point connections on a PCB. At 48 kHz, 32-bit, stereo, the 3.072 MHz bit clock has edges that must be clean and properly timed. At higher sample rates (192 kHz) or more channels, bit clocks reach 24+ MHz. Trace length matching, impedance control, and termination start to matter.

**S/PDIF coaxial:** 75 Ω impedance must be maintained throughout the cable and connectors. Impedance discontinuities cause reflections that can corrupt data at high sample rates. Cable length is limited (typically <10 m for reliable 192 kHz operation) by attenuation and jitter accumulation.

**S/PDIF optical (TOSLINK):** Immune to ground loops and EMI (galvanic isolation). But the LED/photodiode bandwidth limits the data rate — cheap TOSLINK modules struggle above 96 kHz. Jitter is typically higher than coaxial because the LED switching is slower.

**Clock integrity** is the most critical aspect of digital audio interconnects. Jitter on the recovered clock translates directly into noise and distortion in the analog output — see [Clocking & Jitter]({{< relref "/docs/audio-signal/practical-signal-reality/clocking-and-jitter" >}}).

## Gotchas

- **I2S format mismatches produce recognizable artifacts** — Left/right swapped, bit-shifted data (sounds like loud distortion at the correct pitch), or garbled noise all indicate format configuration errors, not hardware failures. Check I2S mode, word length, and alignment first
- **Clock master confusion** — In I2S systems, exactly one device must be the clock master (generating SCK and WS). If both transmitter and receiver try to generate clocks, the link won't work. If neither generates clocks, there's no data. Always explicitly configure master/slave roles
- **S/PDIF receiver PLL bandwidth affects jitter** — A wide PLL bandwidth tracks source frequency quickly but passes jitter. A narrow PLL bandwidth rejects jitter but takes longer to lock and may unlock on frequency variations. Audio-grade S/PDIF receivers use carefully tuned PLLs, and some high-end DACs reclock the data entirely
- **TOSLINK adds jitter** — The optical transmitter and receiver introduce ~2-5 ns of jitter. For 16-bit audio at 44.1 kHz, this is acceptable. For high-resolution playback (24-bit, 96+ kHz), coaxial or I2S connections are preferred
- **TDM slot alignment is unforgiving** — A one-clock-cycle offset in TDM alignment shifts all channels by one slot. The audio sounds correct on each channel but is assigned to the wrong output. This is a common integration bug with multi-channel codecs
- **8b/10b and biphase encoding double the bandwidth** — A 192 kHz, 24-bit stereo S/PDIF link requires about 12 MHz of signal bandwidth due to the encoding overhead. The cable, connectors, and optical link must support this
