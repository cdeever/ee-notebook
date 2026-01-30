---
title: "Mixers & Frequency Translation"
weight: 30
---

# Mixers & Frequency Translation

A mixer multiplies two signals, producing output frequencies at the sum and difference of the inputs. This is how a receiver converts a high RF frequency down to a lower intermediate frequency (IF) where filtering and digitization are easier, and how a transmitter converts a baseband or IF signal up to the RF transmission frequency. Mixers are at the heart of virtually every radio architecture.

## The Fundamental Operation

When two sinusoidal signals are multiplied:

**cos(f_RF) * cos(f_LO) = 0.5 * [cos(f_RF - f_LO) + cos(f_RF + f_LO)]**

The output contains two new frequencies: the difference (f_RF - f_LO) and the sum (f_RF + f_LO). In a receiver, the desired output is usually the difference frequency — the intermediate frequency (IF). In a transmitter (upconversion), the desired output is the sum frequency.

Example: A receiver tunes to 915 MHz. The local oscillator (LO) is set to 904.3 MHz. The mixer output contains:
- Difference: 915 - 904.3 = 10.7 MHz (the IF — this is what we want)
- Sum: 915 + 904.3 = 1819.3 MHz (filtered out)

The mixer also produces harmonics and intermodulation products of the input signals, which must be filtered.

## Mixer Types

### Passive Diode Ring Mixer

The classic double-balanced mixer uses four Schottky diodes arranged in a ring with two transformers. It has no DC power requirement.

- **Conversion loss:** 5-8 dB (the output is weaker than the input by this amount)
- **Port isolation:** 30-50 dB (LO to RF, LO to IF)
- **IP3:** Typically 1-10 dB above the LO drive level
- **LO drive level:** +7 dBm, +13 dBm, or +17 dBm (higher LO = better linearity)
- **Bandwidth:** Extremely wide, often 1 MHz to 5+ GHz

Passive diode mixers are robust, linear, and broadband. Their main disadvantage is conversion loss — you lose 6-7 dB of signal power through the mixer, which must be compensated with gain elsewhere. Level 7 (+7 dBm LO) mixers are the most common for general use. Level 17 (+17 dBm LO) mixers offer better linearity but require more LO power.

### Active Mixer (Gilbert Cell)

Active mixers use transistor pairs (typically a Gilbert cell topology) to perform the multiplication. They require DC power but can provide conversion gain instead of loss.

- **Conversion gain:** 0 to +15 dB (gain rather than loss)
- **Noise figure:** 8-15 dB (higher than passive mixers at low NF but offset by conversion gain)
- **IP3:** Generally lower than passive mixers for a given LO drive
- **Power consumption:** 10-100 mA typical
- **Integration:** Often integrated into receiver/transmitter ICs

Active mixers are common in integrated radio chips where conversion gain simplifies the gain distribution and reduces the number of amplifier stages needed.

## Key Mixer Specifications

**Conversion loss (passive) or conversion gain (active):** The ratio of IF output power to RF input power. For a passive mixer, this is typically 5-8 dB of loss. For an active mixer, it is 0-15 dB of gain.

**Port isolation:** How well the LO, RF, and IF ports are isolated from each other. The most critical is LO-to-RF isolation — LO leakage out the RF port can radiate through the antenna. Typical values are 30-50 dB for a double-balanced mixer.

**IP3 (Third-Order Intercept Point):** Linearity measure. For a passive mixer, IP3 is roughly equal to the LO drive level (a +7 dBm LO mixer has IIP3 around +7 dBm). Higher IP3 means less distortion from strong signals.

**LO drive level:** The required LO power. Insufficient LO drive degrades conversion loss and linearity. Too much LO drive can damage the mixer. The datasheet specifies a nominal drive level — stick to it within +/- 1 dB.

**Spurious products:** Real mixers produce outputs at m * f_LO +/- n * f_RF for various integer values of m and n. These spurious responses ("spurs") must be filtered. Mixer manufacturers provide spur charts showing the relative levels of these products.

## The Image Frequency Problem

A mixer that produces f_IF = f_RF - f_LO will also produce the same f_IF from a different input frequency: the image frequency, located at f_LO - f_IF (on the opposite side of the LO from the desired RF).

Example: If f_LO = 904.3 MHz and f_IF = 10.7 MHz:
- Desired RF: 915 MHz (above LO)
- Image frequency: 893.6 MHz (below LO)

A signal at 893.6 MHz will also produce 10.7 MHz IF output and will be indistinguishable from the desired signal. If there is a strong transmitter at 893.6 MHz, it will appear as interference.

Solutions:
- **Image-reject filter:** A bandpass filter before the mixer that passes the desired RF band and rejects the image frequency. This works when the IF is high enough that the image is well-separated from the desired band.
- **Image-reject mixer:** A topology using two mixers with quadrature LO signals and a phase-combining network that cancels the image. Provides 20-30 dB of image rejection without a filter.
- **High IF:** Choosing a higher IF pushes the image frequency further from the desired band, making it easier to filter. But higher IF makes IF filtering harder.
- **Zero-IF (direct conversion):** Setting f_LO = f_RF eliminates the image problem but introduces DC offset and 1/f noise issues.

## Single-Balanced vs Double-Balanced

**Single-balanced mixer:** Uses two diodes and one transformer. Provides cancellation of either the LO or RF signal at the IF port, but not both. Simpler, lower LO drive requirement, but less isolation and more spurious products.

**Double-balanced mixer:** Uses four diodes and two transformers. Provides cancellation of both LO and RF at the IF port, plus suppression of even-order spurious products. Better isolation, better spur performance, but requires more LO drive. The double-balanced mixer is the standard choice for most applications.

**Triple-balanced (termination-insensitive) mixer:** Two double-balanced mixers combined. Provides good performance even with poorly matched port impedances. More tolerant of load variations but larger and requiring more LO drive.

## Practical Considerations

**LO leakage:** Even a double-balanced mixer with 40 dB of LO-to-RF isolation leaks some LO power to the RF port. If the LO is +7 dBm and isolation is 40 dB, the leaked LO at the antenna is -33 dBm. Depending on the application, this may need additional filtering.

**Port termination:** Mixer ports that are not properly terminated at 50 ohms degrade conversion loss, isolation, and spur performance. This includes the IF port — if the IF filter does not present 50 ohms at frequencies outside its passband, the mixer's spur performance can worsen significantly.

**Spurious filtering:** The mixer output contains many unwanted products. An IF filter immediately after the mixer selects the desired IF and rejects spurs. Filter design must account for the full spectrum of mixer output products.

**DC blocking:** Passive diode mixers need DC blocking capacitors on RF and LO ports if the connected circuits have DC bias. The IF port may need DC blocking as well, depending on the circuit topology.

## Gotchas

- **Insufficient LO drive is the most common mixer problem** — If the LO signal is 3 dB below the specified drive level, conversion loss increases by 1-3 dB and linearity degrades. Use a dedicated LO amplifier if needed.
- **Image frequency rejection is your responsibility** — The mixer does not reject the image. You must filter it out before the mixer or use an image-reject architecture.
- **Port impedance matters at all frequencies, not just the operating band** — A mixer port that sees a reactive impedance at a spur frequency will re-reflect that spur back into the mixer, potentially creating higher-level products. Terminate ports broadband.
- **Passive mixer conversion loss directly adds to receiver noise figure** — 7 dB of conversion loss is equivalent to 7 dB of noise figure from the mixer stage. This is why the LNA before the mixer needs enough gain to swamp the mixer's noise contribution.
- **LO phase noise transfers directly to the IF output** — The mixer multiplies the RF signal by the LO, including the LO's phase noise. A noisy LO degrades the signal-to-noise ratio of the converted signal.
- **Do not exceed the maximum RF input power** — Strong RF signals can forward-bias the mixer diodes, causing compression, intermodulation, and potentially damage. The maximum safe RF input is typically 5-10 dB below the LO drive level.
