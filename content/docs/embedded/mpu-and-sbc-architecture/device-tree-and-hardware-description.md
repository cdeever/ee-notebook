---
title: "Device Tree & Hardware Description"
weight: 50
---

# Device Tree & Hardware Description

On an MCU, firmware knows what peripherals exist because the datasheet says so and the memory map is fixed. On an MPU running Linux, the kernel needs to be told what hardware is present — which I2C buses exist, what GPIO controller is at what address, how interrupts are wired. The device tree is how that description is provided: a data structure that tells the kernel what the board looks like, without recompiling the kernel itself.

## The Problem: Hardware Is Not Discoverable

Some buses have built-in discovery mechanisms. PCI and USB devices identify themselves through standardized descriptors, and the kernel matches them to drivers automatically. SoC peripherals have no such mechanism. An I2C controller mapped at a specific address does not broadcast its existence. A GPIO controller has no way to announce itself or describe its register layout. These blocks sit silently on the internal bus, waiting for software that already knows they are there.

Before device trees, Linux solved this with board files — C source files compiled directly into the kernel, one per supported board. The approach worked but scaled horribly, requiring kernel recompilation for even trivial changes. Device tree moved the hardware description out of the kernel into a separate data file. One kernel binary can boot on many different boards, as long as each supplies a device tree blob (DTB) describing its hardware. ARM adopted the mechanism around 2011-2012, and it was the single biggest cleanup in the ARM kernel's history. See [Boot Chain: ROM to Bootloader to Kernel]({{< relref "boot-chain" >}}) for how the DTB gets loaded and passed to the kernel during the boot process.

The practical impact is significant even without ever writing a device tree from scratch. Vendor-supplied DTBs describe the board's hardware. Overlays patch the DTB for add-on hardware. And when something does not work, understanding that the device tree is the kernel's only source of hardware knowledge points to where to look. The kernel does not probe the bus to see what is there — it reads the device tree and trusts it.

## How Device Trees Work

The most important property in any device node is `compatible`. This is a string (or list of strings) that tells the kernel which driver to use. When the kernel walks the device tree at boot, it matches each node's `compatible` string against the `of_match_table` in registered drivers. If a match is found, the kernel calls that driver's probe function. The convention is `"vendor,device"` — for example, `compatible = "brcm,bcm2711-gpio"` tells the kernel to look for the BCM2711 GPIO driver.

The `compatible` property often contains a list of strings, from most specific to most generic: `compatible = "brcm,bcm2711-uart0", "arm,pl011", "arm,primecell";`. The kernel tries each in order, falling back to more generic drivers if no specific one exists. This fallback mechanism is how a single generic driver can support dozens of SoC variants.

Device trees use include files (.dtsi) to separate SoC-level definitions from board-level customizations. A .dtsi file for the SoC defines all peripherals with most set to `status = "disabled"`. A board-level .dts file includes the SoC .dtsi and overrides specific nodes to enable the peripherals that are actually wired up. The `status` property is either `"okay"` (device should be probed) or `"disabled"` (device exists in the SoC but is not used on this board).

## Device Tree Overlays

The base device tree describes the board as it ships from the factory. Overlays modify the device tree for add-on hardware — HATs, capes, I2C sensors wired to the expansion header — without replacing the entire DTB.

Raspberry Pi uses overlays extensively. The `config.txt` file accepts `dtoverlay=` directives that load overlay files from `/boot/overlays/`. The Pi's firmware applies overlays to the DTB before passing it to the kernel, so changes require a reboot. BeagleBone capes use a similar concept through U-Boot overlay merging at boot time.

A common source of confusion is the interaction between overlays and pin muxing. An overlay that enables an SPI peripheral also needs to configure the pins for SPI function. If two overlays try to claim the same pins, the conflict may not produce an obvious error — the pin mux ends up in whatever state the last overlay set, and one peripheral silently fails or both drivers contend for the same pin.

## Bindings: Connecting Hardware to Drivers

Bindings are the contract between the device tree and drivers — a specification of what properties a device tree node must contain for a given driver to work correctly. Binding documents live in the kernel source under `Documentation/devicetree/bindings/`, and the kernel community has been migrating to YAML-based schemas that can be machine-validated.

The critical insight is what happens when the matching process fails. If a node's `compatible` string does not match any loaded driver, the kernel silently ignores it. There is no warning in `dmesg`, no error message, nothing. The device simply does not exist from the kernel's perspective. This is by design, but it makes debugging painful. If a device tree node is added and the device does not appear, the first thing to check is whether the `compatible` string exactly matches what the driver registers. A single typo means no match.

## Tips

- Verify the `compatible` string exactly matches the driver source's `of_match_table` — a single typo means no match and no error
- Explicitly set `status = "okay"` for each peripheral used on the board — SoC-level .dtsi files often default to `status = "disabled"`
- Check for pin mux conflicts when using multiple overlays — not all pin controllers detect conflicts
- Test device tree changes by rebooting — no practical hot-reload mechanism exists

## Caveats

- **Wrong `compatible` string means no driver binds, silently** — No error, no warning, nothing in `dmesg`. The kernel ignores unmatched nodes
- **`status = "disabled"` is the default for many SoC-level nodes** — Forgetting to set `status = "okay"` is one of the most common reasons a device tree node exists but nothing happens
- **Pin mux conflicts are not always caught at boot** — Two device tree nodes claiming the same pin can result in electrical contention
- **Overlay load order matters** — Later overlays override earlier ones. If two overlays modify the same property, the last one wins
- **The device tree is not validated against actual hardware** — A device tree can describe hardware that does not physically exist. The kernel will try to probe it
- **Device tree changes require a reboot** — The kernel consumes the device tree at boot. No practical hot-reload mechanism exists

## Bench Relevance

- A device that does not appear in `/dev/` despite having a device tree node likely has a wrong `compatible` string or is `status = "disabled"`
- An overlay that "does nothing" may be overridden by a later overlay or may conflict with the base device tree
- A peripheral that fails to probe with errors about missing resources may have pin mux conflicts with another device
- Adding a node for hardware that is not populated causes probe failures, not boot failures — the kernel tries anyway
