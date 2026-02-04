---
title: "WiFi & Networking"
weight: 60
---

# WiFi & Networking

WiFi and Ethernet both provide IP networking — the ability to talk TCP/UDP, serve web pages, send MQTT messages, or connect to cloud services. From the MCU perspective, they share the same upper software layers (TCP/IP stack, sockets, application protocols) but differ completely in hardware: Ethernet is wired, deterministic, and straightforward; WiFi adds radio complexity, association, security handshakes, and power management. Both demand significantly more resources (RAM, flash, CPU time) than the serial buses covered elsewhere in this section.

## Ethernet

### What the Hardware Provides

Ethernet on an MCU is split between two chips: the **MAC** (Media Access Controller) inside the MCU, and the **PHY** (physical layer transceiver) as an external chip. The MAC handles frame assembly, CRC, and media access. The PHY handles the analog signaling on the wire — encoding, link negotiation, and the transformer-coupled interface to the RJ45 jack. The MAC and PHY communicate via MII or RMII (Reduced MII), which is a parallel interface requiring several pins and careful PCB layout.

Some MCUs integrate the PHY (notably certain NXP and Microchip parts), which simplifies the board design but limits flexibility. For most STM32 designs, the PHY is external (common choices: LAN8720, DP83848, KSZ8081).

### The Software Stack

Ethernet's hardware peripheral gets frames on and off the wire. Making those frames useful requires a TCP/IP stack — a substantial software component. lwIP (lightweight IP) is the de facto standard for embedded Ethernet on Cortex-M MCUs, and it handles ARP, IP, ICMP, UDP, TCP, DHCP, and optionally DNS, HTTP, MQTT, and others.

lwIP alone consumes 40-100 KB of flash and 20-40 KB of RAM, depending on configuration. Add an application protocol (HTTP server, MQTT client) and the footprint grows further. This is a fundamentally different resource category than UART or SPI — Ethernet is only viable on MCUs with sufficient memory, which in practice means the upper-mid-range parts and above.

The MAC peripheral uses DMA extensively — both transmit and receive paths use DMA descriptor rings to move frames between the MAC and RAM without CPU involvement for each byte. Understanding DMA is a prerequisite for bringing up Ethernet. See [DMA]({{< relref "dma" >}}) for details.

### PHY Management

The MAC communicates with the PHY for configuration and status via MDIO (Management Data Input/Output), a low-speed serial interface separate from the data path. Through MDIO, firmware can read the link status, negotiate speed and duplex, and configure PHY features. Auto-negotiation (which happens in the PHY hardware) determines whether the link runs at 10 or 100 Mbps, full or half duplex. Firmware needs to detect the negotiated speed and configure the MAC accordingly — a mismatch causes no communication.

## WiFi

### Integration Approaches

WiFi on an MCU comes in two forms, similar to Bluetooth:

**External WiFi module** — The ESP8266 was the module that brought cheap WiFi to embedded. The ESP32 continues this. Other options include ATWINC1500 (Microchip), WizFi360, and various Realtek-based modules. The MCU communicates with the module over UART or SPI using AT commands or a proprietary protocol. The module handles the entire WiFi stack — association, WPA handshake, TCP/IP, DHCP — internally. The MCU just sends "connect to this AP" and "send this data to this IP."

Advantages: works with any MCU, no networking stack needed on the host MCU, radio certification handled by the module vendor. Disadvantages: AT command interfaces are limited and fragile, latency from the serial interface, debugging is difficult (the module is a black box), throughput limited by the UART/SPI link speed.

**Integrated SoC** — The ESP32 is the dominant example: it has WiFi and Bluetooth radios integrated with dual Cortex-level processors. The WiFi stack runs on the same chip as the application. Nordic's nRF7002 is a WiFi companion chip. STM32 doesn't have integrated WiFi but pairs with external modules.

With an integrated SoC, the application has direct access to the network stack (sockets, HTTP client libraries, MQTT). Throughput is higher and latency is lower than the AT command approach. But the firmware is more complex — managing a real-time network stack alongside application code.

### WiFi-Specific Concerns

**Association and authentication** — Before the MCU can send data, it must associate with an access point and complete the WPA2/WPA3 handshake. This takes 1-5 seconds typically. If the AP goes away (power cycle, roaming), the MCU must detect the disconnection and reassociate. Robust WiFi firmware needs a state machine handling: scanning, associating, authenticating, getting DHCP, connected, disconnected/reconnecting. Most example code skips the reconnection handling.

**Provisioning** — How does the MCU learn the SSID and password? Hardcoding works for development but not for products. Common approaches: BLE provisioning (use Bluetooth to configure WiFi credentials — ESP32 supports this), WPS, SmartConfig (phone app encodes credentials in WiFi packet timing), SoftAP mode (MCU creates its own AP, user connects and enters credentials via a web page). Each has tradeoffs in user experience, security, and implementation complexity.

**Power consumption** — WiFi radios draw 80-200 mA when transmitting. For battery-powered devices, WiFi must be duty-cycled aggressively or used only for periodic bursts of communication. WiFi modem-sleep and light-sleep modes help but add reconnection latency. Deep sleep with WiFi off is the lowest power option but requires full reassociation on wake (1-5 seconds). For always-connected low-power applications, BLE is usually a better choice.

**TLS/SSL** — Connecting to cloud services (AWS IoT, MQTT brokers, HTTPS APIs) requires TLS encryption. This needs a TLS library (mbedTLS is common in embedded), certificate storage, and significant RAM for the TLS session (10-40 KB). The TLS handshake itself is CPU-intensive and can take seconds on a slower MCU. Certificate management (expiration, root CA updates) is an ongoing operational concern that firmware developers often underestimate.

## Common Ground: The Network Stack

Whether using Ethernet or WiFi, the software layers above the link are the same:

**lwIP** is the most common embedded TCP/IP stack. It provides raw API (callback-based, single-threaded, lowest overhead), netconn API (sequential, requires RTOS), and socket API (BSD-like, requires RTOS, easiest to use). Choosing the right API depends on whether an RTOS is present and how complex the networking is.

**Application protocols** built on TCP/UDP:
- **MQTT** — Lightweight publish/subscribe messaging. The default for IoT cloud connectivity. Small overhead, well-suited to embedded. Libraries: Paho, mosquitto, lwMQTT.
- **HTTP/HTTPS** — Web servers on the MCU for configuration pages, REST API clients for cloud services. More overhead than MQTT.
- **mDNS/DNS-SD** — Zero-configuration networking. Lets the MCU advertise a hostname (e.g., "mydevice.local") without DNS infrastructure. Useful for local access.
- **CoAP** — Like HTTP but over UDP, designed for constrained devices. Less common than MQTT in practice.

## Tips

- Add proper delays and check PHY status after reset before attempting MDIO communication
- Implement robust WiFi reconnection with exponential backoff — example code rarely includes this
- Pin and document the ESP-AT firmware version when using AT command-based WiFi modules
- Wait for PHY link-up status after Ethernet initialization before sending any traffic
- Handle DNS failure explicitly rather than relying on TCP timeout
- Follow lwIP thread-safety requirements carefully when integrating with an RTOS

## Caveats

- **Ethernet PHY reset and initialization timing matters** — The PHY needs a proper reset sequence before MDIO communication works. Attempting configuration too early returns garbage from MDIO reads
- **lwIP is not thread-safe by default** — Calling lwIP functions from multiple threads or interrupt contexts without proper locking causes memory corruption and crashes
- **WiFi reconnection is an application responsibility** — The WiFi stack reports disconnection, but reassociation, DHCP, and re-establishing application connections are firmware's job
- **ESP32 AT firmware version mismatches** — AT command sets change between versions. A command may not exist or have different parameters on different firmware
- **DNS can fail silently** — If DHCP provides an unreachable DNS server, hostname resolution fails and TCP connections time out
- **Ethernet cable detection is not instant** — Auto-negotiation takes 1-3 seconds after power-on. Sending immediately after initialization fails
- **WiFi throughput depends on conditions** — Real throughput (1-5 Mbps typical for ESP32) is far below theoretical maximums due to signal strength, interference, and processing overhead

## Bench Relevance

- Ethernet that fails after reset but works after a delay has PHY initialization timing issues
- Random crashes or memory corruption in networked RTOS applications often trace to lwIP thread-safety violations
- WiFi devices that work initially but fail to reconnect after AP restart lack proper reconnection handling
- TCP connections to cloud services that time out while UDP works suggest DNS resolution failure
- WiFi throughput that is much lower than expected may be limited by signal strength, interference, or MCU processing — not the radio
