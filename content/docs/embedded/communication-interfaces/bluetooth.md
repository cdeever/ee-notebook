---
title: "Bluetooth"
weight: 50
---

# Bluetooth

Bluetooth in embedded systems comes in two very different flavors: Classic Bluetooth (BR/EDR) and Bluetooth Low Energy (BLE). For most MCU-based projects, BLE is what matters — it's lower power, simpler to implement, and supported by every modern phone and computer. Classic Bluetooth still exists for audio streaming (A2DP) and serial port emulation (SPP), but BLE dominates sensor, IoT, and peripheral applications.

This page covers Bluetooth from the MCU/firmware perspective — what the hardware and stack provide, what firmware must handle, and the practical realities of getting a Bluetooth device working on an embedded system.

## BLE vs Classic Bluetooth

These are essentially two different protocols that share a name and a radio band (2.4 GHz ISM). They are not interoperable — a BLE-only device cannot talk to a Classic-only device.

**Classic Bluetooth (BR/EDR)** — Data rates up to 3 Mbps, connection-oriented, built around profiles like SPP (serial port), A2DP (audio streaming), HFP (hands-free). Higher power consumption, more complex stack. This is what Bluetooth speakers, headsets, and older keyboards/mice use. The stack is substantial — implementing Classic Bluetooth from scratch is not something you casually do on a small MCU. For audio applications specifically, dedicated audio modules that handle the Classic Bluetooth stack internally are more practical than trying to run A2DP on a general-purpose MCU.

**BLE (Bluetooth Low Energy, introduced in Bluetooth 4.0)** — Designed from the ground up for low duty cycle operation and small data packets. Connection intervals can be tens to hundreds of milliseconds. Typical data throughput is much lower than the headline rate would suggest — you might see 10-100 KB/s in practice depending on connection parameters and MTU. BLE dominates for sensors, beacons, wearables, and IoT devices. The stack is simpler than Classic, though "simpler" is relative — it is still a complex protocol.

**Dual-mode** devices support both Classic and BLE. Most phone and laptop Bluetooth chips are dual-mode, which is why they can talk to both your BLE fitness tracker and your Classic Bluetooth headphones. Many MCU-targeted modules and SoCs are BLE-only, which is fine for most embedded applications and keeps the firmware simpler.

## Integration Approaches

There are two fundamentally different ways to add Bluetooth to an MCU project, and the choice affects everything from firmware complexity to BOM cost to how much control you have over the radio.

### External Module (UART/SPI-based)

Modules like HC-05/HC-06 (Classic, old but still everywhere in tutorials), RN4870/RN4678 (Microchip, BLE/dual), and ESP32 (WiFi + BLE combo) contain their own Bluetooth stack and radio. The MCU talks to the module over [UART]({{< relref "serial-interfaces" >}}) (most common) or SPI using AT commands or a proprietary command API.

Advantages:
- No Bluetooth stack needed on the MCU — the module handles everything
- Works with any MCU that has a UART, even an 8-bit part with limited RAM
- Radio certification (FCC, CE) is handled by the module vendor, which is a significant cost and effort savings for a product
- Fastest path to "Bluetooth working" — flash your MCU, wire up the module, send AT commands

Disadvantages:
- Limited control over Bluetooth behavior — you are constrained to what the module firmware exposes
- Latency from the UART interface adds up, especially at lower baud rates
- Module firmware updates can be difficult or impossible
- AT command interfaces can be clunky and poorly documented
- Higher BOM cost than an integrated SoC (you are paying for two microcontrollers)

For prototyping and learning, an external module is hard to beat. For a product, the BOM cost and limited control often push toward an integrated SoC.

### Integrated SoC

Chips like nRF52840 (Nordic), ESP32 (Espressif), STM32WB (ST), and CC2640 (TI) integrate the MCU and Bluetooth radio on the same die (or in the same package with a dedicated radio co-processor, as in the STM32WB).

The Bluetooth stack runs as firmware on the same processor — or in some architectures, on a dedicated co-processor that communicates with the application processor through shared memory and inter-processor communication (IPC). Nordic's SoftDevice, for example, runs as a binary blob that occupies the top of the interrupt priority space and a reserved region of flash and RAM.

Advantages:
- Full control over Bluetooth behavior — advertising data, connection parameters, GATT structure, security
- Lower BOM cost (one chip instead of two)
- Lower latency between application logic and the radio
- Better power optimization — the application can coordinate sleep states with the radio schedule

Disadvantages:
- More complex firmware — the Bluetooth stack competes for CPU time and RAM
- Vendor-specific SDK required (Nordic's nRF5 SDK or nRF Connect SDK, Espressif's ESP-IDF, ST's STM32Cube)
- Radio certification is your responsibility (though using a certified module based on the SoC helps)
- Debugging is harder — the Bluetooth stack is often a binary blob you cannot step through

The nRF52 series with Nordic's SoftDevice stack and the ESP32 with ESP-IDF are the two most popular approaches in the hobbyist/maker/product space. The nRF52840 in particular has become something of a default choice for BLE products — good power consumption, well-documented SDK, and a large community.

## BLE Concepts for Firmware

BLE has its own vocabulary and data model that firmware developers need to internalize. This is the part that feels most unfamiliar if you are coming from UART-based communication where you just send and receive byte streams.

### GAP (Generic Access Profile)

GAP controls advertising and connections. A BLE device is either advertising (broadcasting its presence and waiting for someone to connect) or scanning (listening for advertisers). After a connection is established, GAP manages the connection parameters — interval, latency, and timeout.

In firmware terms, GAP is what you configure to control how your device appears to the world: its name, whether it is connectable, what services it advertises, and how aggressively it broadcasts.

### GATT (Generic Attribute Profile)

GATT is the data model for all BLE communication after a connection is established. If GAP is about finding and connecting to devices, GATT is about exchanging data with them.

Everything is organized into **services** and **characteristics**:
- A **service** groups related data — for example, a "Heart Rate Service" or an "Environmental Sensing Service"
- A **characteristic** is a single data value within a service — the heart rate measurement, the temperature reading, the battery level
- Each characteristic has a **UUID** (either a standard 16-bit UUID from the Bluetooth SIG or a custom 128-bit UUID), a **value**, and optional **descriptors** that provide metadata

Standard services and characteristics have assigned UUIDs (0x180D for Heart Rate Service, 0x2A37 for Heart Rate Measurement, etc.). Using standard UUIDs means phone apps and generic BLE tools automatically know how to interpret the data. Custom services use 128-bit UUIDs that you define.

The GATT model feels over-engineered for simple applications — if you just want to send a few bytes back and forth, wrapping them in services and characteristics with UUIDs and descriptors feels like a lot of ceremony. But the structure is what makes BLE interoperable across devices and platforms, and once you have set it up once, the pattern is straightforward to reuse.

### Advertising

Before any connection happens, the device advertises. Advertising packets are broadcast at a configurable interval (20 ms to 10.24 s) and contain a small amount of data — up to 31 bytes in legacy advertising, more with extended advertising introduced in BLE 5.0.

Advertising data is structured as a sequence of type-length-value fields. Common fields include:
- Device name (or shortened name)
- TX power level
- Service UUIDs (so scanners know what services the device offers before connecting)
- Manufacturer-specific data (for custom beacon payloads)

After the flags field and device name, there is very little room for custom data in a 31-byte advertisement. This is a real constraint for beacon-style applications where you want to broadcast sensor data without requiring a connection.

Scan response data provides an additional 31 bytes that the scanner can request, but this requires an active scan (the scanner sends a request, the advertiser responds), which uses more power on both sides.

### Connection Parameters

Once connected, the central (typically the phone) and peripheral (your device) communicate at a regular interval. The key parameters:

- **Connection interval** — How often the central and peripheral exchange data. Range is 7.5 ms to 4 s. Shorter intervals mean lower latency and higher throughput but more power consumption.
- **Slave latency** — How many connection intervals the peripheral can skip if it has nothing to send. A slave latency of 4 means the peripheral can sleep through 4 intervals before it must respond. This saves power when data is infrequent.
- **Supervision timeout** — How long without communication before the connection is considered lost. Must be longer than (1 + slave latency) times the connection interval.

These parameters directly and significantly affect power consumption and responsiveness. Getting them wrong means either excessive power drain (interval too short) or sluggish, unresponsive behavior (interval too long).

### MTU (Maximum Transmission Unit)

The default BLE MTU is 23 bytes, which means 20 bytes of usable payload per ATT packet after the 3-byte ATT header. This is surprisingly small.

BLE 4.2 introduced Data Length Extension, which allows the MTU to be negotiated up to 512 bytes. After connection, either side can request a larger MTU, and both sides agree on the smaller of their supported values.

Larger MTU dramatically improves throughput for bulk data transfer because you send more data per connection event and reduce protocol overhead. Many BLE throughput problems — "why am I only getting 2 KB/s?" — come from not negotiating a larger MTU. The negotiation should happen immediately after connection, before any application data is exchanged.

## Practical BLE: Nordic UART Service (NUS)

The most common "first BLE project" pattern is creating a BLE serial port equivalent using the Nordic UART Service (NUS), or the equivalent from other vendors. The concept is simple: the MCU exposes a GATT service with TX and RX characteristics. A phone app (like Nordic's nRF Connect, which is excellent for BLE development and debugging) connects and sends/receives data as if it were a serial terminal.

This is conceptually similar to [USB]({{< relref "usb" >}}) CDC — wrapping serial communication in a higher-level protocol. The data flows through GATT characteristics instead of USB endpoints, but the application-level pattern is the same: bytes in, bytes out.

Almost every vendor SDK includes an example for this pattern. It is the right starting point for learning BLE firmware development because it lets you verify the entire chain — advertising, connection, service discovery, data exchange — with a standard phone app before you build any custom host-side software.

One thing to note: NUS uses custom 128-bit UUIDs (Nordic defined them, but they are not part of the Bluetooth SIG standard). This means generic BLE tools will show the service but will not automatically know what to do with it. nRF Connect specifically recognizes these UUIDs and presents a terminal interface.

## Power Considerations

BLE's power advantage over Classic Bluetooth comes entirely from sleeping most of the time. The radio itself draws significant current when active (typically 5-15 mA depending on TX power and the SoC), but if the device only turns the radio on briefly and infrequently, average power consumption can be in the microamp range.

A sensor that wakes up, takes a reading, sends a BLE notification, and goes back to sleep can run for months or years on a coin cell battery. This is the use case BLE was designed for.

But BLE can also be "not low energy" if used carelessly:
- A continuous connection with a 7.5 ms interval keeps the radio active frequently — this is not meaningfully different from Classic Bluetooth in terms of power
- Advertising every 20 ms for fast discovery burns power much faster than advertising every 1000 ms
- Scanning (looking for other devices) is even more power-hungry than advertising, because the radio must listen continuously or nearly so

Most products use an adaptive strategy: advertise at a fast interval (20-100 ms) for the first 30-60 seconds to allow quick discovery, then slow down to a much longer interval (1000-2000 ms) if no connection is established. After connection, negotiate the longest connection interval that still meets the application's latency requirements.

The radio is by far the largest power consumer on a BLE SoC. Minimizing radio-on time is the core of BLE power optimization. Everything else — CPU sleep modes, peripheral clock gating, voltage scaling — matters, but the radio dominates.

## Gotchas

- **BLE is not Bluetooth serial** — People coming from Classic Bluetooth (or from using HC-05 modules with AT commands) expect BLE to work like a serial port. It does not. Data is structured in services and characteristics, connections are managed by the central, and throughput is much lower than the headline data rate suggests. The Nordic UART Service creates a serial-like abstraction, but the underlying model is fundamentally different, and that difference leaks through in latency, throughput, and connection management.

- **Phone OS Bluetooth stacks have quirks** — Android and iOS handle BLE differently, and these differences matter for product firmware. iOS aggressively caches GATT services — if you change your service structure during development, the phone keeps using the cached version, and nothing works until the user goes into Settings and "forgets" the device. Android has connection parameter negotiation bugs on older versions, and both platforms impose background BLE limitations that affect reliability for apps that need to maintain connections when not in the foreground. Testing on actual phones, not just nRF Connect on a development machine, is essential before shipping.

- **Advertising data size is limited** — 31 bytes for legacy advertising. After the mandatory flags field (3 bytes) and a reasonable device name, there is very little room for custom data. If you need to broadcast sensor readings without a connection (beacon-style), plan the advertising data structure carefully and consider whether you really need a human-readable name in the advertisement, or whether you can put it in the scan response instead.

- **Connection parameter negotiation can fail** — The peripheral can request specific connection parameters, but the central (phone) ultimately decides. iOS in particular may override your requested parameters with values it considers more appropriate. Design firmware to work acceptably across a range of connection intervals, not just the one you requested in your parameter update.

- **Pairing and bonding are different things** — Pairing establishes a temporary security context (encryption keys for the current session). Bonding stores those keys persistently so that future connections can be encrypted without re-pairing. Getting bonding wrong means users have to re-pair every time they reconnect, or worse, the device refuses to connect because of stale bonding information on one side but not the other. When bonding state gets out of sync, the fix is usually to delete the bond on both sides and start over — but your firmware needs to handle this gracefully.

- **SoftDevice and stack memory requirements** — BLE stacks consume significant RAM. Nordic's SoftDevice uses 8-20 KB of RAM depending on the configuration (number of connections, MTU size, number of services). On a 32 KB RAM MCU like the nRF52810, the Bluetooth stack takes a substantial fraction of available memory. ESP-IDF's Bluetooth stack is similarly hungry. Plan memory allocation and choose your MCU before committing to a feature set — running out of RAM after building half the firmware is not a pleasant discovery.

- **Interference in the 2.4 GHz band** — BLE shares the 2.4 GHz ISM band with WiFi, microwave ovens, Zigbee, and countless other devices. BLE uses frequency hopping across 40 channels (37 data channels, 3 advertising channels) to mitigate interference, but in a noisy environment (trade show floor, apartment building with dozens of WiFi networks), connection quality can degrade. Advertising on all three advertising channels provides redundancy, but data connections on a single channel are more vulnerable. This is mostly invisible during bench testing and shows up in the field.

- **[DMA]({{< relref "dma" >}}) interaction with BLE stacks** — On SoCs with integrated BLE, the radio peripheral often uses DMA internally to move packets between radio memory and the packet buffer. The BLE stack manages this, and application firmware generally does not interact with radio DMA directly. But if you are also using DMA for other peripherals ([UART]({{< relref "serial-interfaces" >}}), SPI, ADC), be aware that DMA channels are a shared resource and the BLE stack's DMA usage may constrain what is available for your application.
