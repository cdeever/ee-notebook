---
title: "I2S"
weight: 65
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# I2S

Synchronous, point-to-point (or daisy-chained), dedicated to audio. I2S (Inter-IC Sound) is a serial bus designed for streaming digital audio data between ICs — typically between an MCU and an audio codec, DAC, ADC, or digital microphone. The audio section covers the [protocol details and variants]({{< relref "/docs/audio-signal/modulation-and-encoding/digital-modulation-and-data-encoding" >}}); this page focuses on what it takes to get I2S working from the MCU side.

{{< graphviz >}}
digraph i2s {
  rankdir=LR
  bgcolor="transparent"
  node [fontname="Helvetica" fontsize=11]
  edge [fontname="Helvetica" fontsize=10]

  mcu [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a2a3a" COLOR="#6666aa">
      <TR><TD><B><FONT COLOR="#cccccc">MCU</FONT></B></TD></TR>
      <TR><TD PORT="mclk" BGCOLOR="#3e3e5a"><FONT COLOR="#cccc88"> MCLK </FONT></TD></TR>
      <TR><TD PORT="bclk" BGCOLOR="#3e3e5a"><FONT COLOR="#cc8888"> BCLK </FONT></TD></TR>
      <TR><TD PORT="ws"   BGCOLOR="#3e3e5a"><FONT COLOR="#88cc88"> WS </FONT></TD></TR>
      <TR><TD PORT="sd"   BGCOLOR="#3e3e5a"><FONT COLOR="#8888cc"> SD </FONT></TD></TR>
    </TABLE>
  >]

  codec [shape=plain label=<
    <TABLE BORDER="1" CELLBORDER="0" CELLSPACING="2" CELLPADDING="6" BGCOLOR="#2a3a2a" COLOR="#66aa66">
      <TR><TD><B><FONT COLOR="#cccccc">Audio Codec</FONT></B></TD></TR>
      <TR><TD PORT="mclk" BGCOLOR="#3e5a3e"><FONT COLOR="#cccc88"> MCLK </FONT></TD></TR>
      <TR><TD PORT="bclk" BGCOLOR="#3e5a3e"><FONT COLOR="#cc8888"> BCLK </FONT></TD></TR>
      <TR><TD PORT="ws"   BGCOLOR="#3e5a3e"><FONT COLOR="#88cc88"> WS / LRCK </FONT></TD></TR>
      <TR><TD PORT="sd"   BGCOLOR="#3e5a3e"><FONT COLOR="#8888cc"> SD </FONT></TD></TR>
    </TABLE>
  >]

  mcu:mclk -> codec:mclk [color="#cccc88" label=" master clock " fontcolor="#cccc88"]
  mcu:bclk -> codec:bclk [color="#cc8888" label=" bit clock " fontcolor="#cc8888"]
  mcu:ws   -> codec:ws   [color="#88cc88" label=" word select " fontcolor="#88cc88"]
  mcu:sd   -> codec:sd   [color="#8888cc" label=" audio data " fontcolor="#8888cc"]
}
{{< /graphviz >}}

The MCU provides MCLK (master clock), BCLK (bit clock), and WS (word select / LRCK) to the codec. Audio sample data flows on SD — the direction depends on whether the MCU is transmitting (playback) or receiving (capture). Some setups use two SD lines for simultaneous transmit and receive.

## Configuration Essentials

I2S configuration involves three interlocking clock decisions:

**Master clock (MCLK).** Many audio codecs require a master clock — typically 256 times the sample rate (256×fs). At 48 kHz, that is 12.288 MHz. Some MCUs have a dedicated MCLK output pin driven from the I2S PLL; others cannot generate MCLK at all, requiring an external oscillator. Whether the codec needs MCLK is the first thing to check in its datasheet — without it, the codec's internal clock synthesizer may not lock, and the device produces silence or noise.

**Bit clock (BCLK / SCK).** The clock that shifts each audio bit. The rate is sample rate × bit depth × number of channels. For 48 kHz, 16-bit stereo: 48000 × 16 × 2 = 1.536 MHz. For 32-bit: 3.072 MHz. The MCU's I2S peripheral derives BCLK from its PLL or peripheral clock, and the divisors must produce an exact frequency — audio is unforgiving of clock error. Even small fractional errors cause audible artifacts (clicks, drift, pitch shift). STM32 parts with a dedicated I2S PLL can hit exact audio rates; parts without one may struggle with certain sample rate / bit depth combinations.

**Word select (WS / LRCK).** Toggles at the sample rate to indicate left or right channel. In standard I2S format, the data is delayed by one BCLK cycle after the WS transition. In left-justified or right-justified formats, the alignment is different. The MCU and codec must agree on the format — a mismatch produces audio in the wrong channel, shifted by one sample, or completely garbled depending on how far off the alignment is.

## Master vs Slave

Either the MCU or the codec can be the clock master. When the MCU is master, it generates BCLK and WS (and usually MCLK). When the codec is master — common with high-end audio codecs that have their own crystal oscillator — the MCU's I2S peripheral receives BCLK and WS and synchronizes to them.

MCU-as-master is simpler for firmware but puts the clock accuracy burden on the MCU's PLL. Codec-as-master often produces better audio clock quality (lower jitter) because audio codecs are designed around precise clock generation, while MCU PLLs are general-purpose and may not hit exact audio frequencies.

## DMA Is Not Optional

Unlike [UART]({{< relref "uart" >}}) or low-speed [I2C]({{< relref "spi-and-i2c" >}}), I2S generates a continuous stream of data at a fixed rate. At 48 kHz, 16-bit stereo, that is 192 KB/s — a new sample pair every 20.8 microseconds. If the CPU misses a sample, the result is an audible glitch. Polling is out of the question. Interrupts per sample are feasible but create high overhead.

DMA with double-buffering (ping-pong) is the standard approach: while DMA fills one buffer, firmware processes the other. The DMA half-transfer and transfer-complete interrupts signal buffer swaps. This decouples audio processing from the sample clock entirely — firmware runs at buffer-rate (every few milliseconds), not sample-rate. See [DMA]({{< relref "dma" >}}) for the mechanics.

## Tips

- Verify the codec datasheet for MCLK requirements before selecting an MCU — some codecs cannot function without a master clock
- Use DMA with double-buffering for I2S — the continuous data rate makes polling and even per-sample interrupts impractical
- Check that the MCU's I2S PLL can produce exact audio frequencies for the desired sample rate before committing to a design
- Match the I2S format (standard, left-justified, right-justified) exactly between MCU and codec

## Caveats

- **I2S format mismatch produces shifted or swapped audio** — Standard I2S delays data by one BCLK after the WS edge; left-justified does not. Both sides must use exactly the same format
- **Missing MCLK causes silent failure** — Many codecs need a master clock to run their internal PLLs. If MCLK is absent or the wrong frequency, the codec may respond on its control interface but produce no audio output
- **I2S clock accuracy matters audibly** — A PLL that cannot produce an exact audio bit clock introduces periodic phase errors that manifest as clicks, pops, or pitch drift
- **I2S DMA underrun causes audible glitches** — If DMA does not deliver the next buffer in time, the I2S peripheral repeats the last sample or outputs zeros, producing clicks or dropouts

## In Practice

- Audio in the wrong channel or shifted by one sample indicates I2S format mismatch — verify standard vs. left-justified vs. right-justified setting
- A codec that configures correctly (I2C responds, registers read back as expected) but produces no audio likely lacks MCLK or has the wrong frequency
- Clicks or pops that occur at regular intervals suggest I2S clock inaccuracy — verify the bit clock frequency with a scope
- Dropouts during playback that correlate with other system activity indicate DMA underrun from interrupt latency — reduce other interrupt priorities or increase buffer size
