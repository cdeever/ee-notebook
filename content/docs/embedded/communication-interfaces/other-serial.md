---
title: "Other Serial Interfaces"
weight: 80
---

# Other Serial Interfaces

The [serial interfaces]({{< relref "serial-interfaces" >}}) page covers UART, SPI, I2C, and I2S — the buses you encounter on most embedded projects. But MCU work eventually leads to a couple of interfaces that sit outside that core set: a quirky single-wire protocol with a devoted following, and I2C's stricter cousin used in power management.

## 1-Wire

1-Wire is a Dallas/Maxim protocol that lives up to its name: one data wire plus ground. Power can even be derived parasitically from the data line, so in some configurations you literally need only two conductors to talk to a device and power it.

### Common Uses

The most widely used 1-Wire device is the DS18B20 temperature sensor. iButtons (authentication tokens and data loggers) also use 1-Wire. The protocol is niche compared to I2C or SPI, but it has a loyal following in applications where you need many temperature sensors on a single wire — home automation, industrial monitoring, aquarium controllers.

### MCU Implementation

There is no hardware 1-Wire peripheral on most MCUs. The protocol is bit-banged on a single GPIO pin configured as open-drain with an external pull-up resistor (typically 4.7k ohm to VCC).

The protocol is timing-critical. Communication is organized into time slots of 60-120 microseconds, with specific timing windows for read and write operations that require roughly 1 microsecond resolution. The master initiates every transaction by pulling the line low for a precise duration — different durations signal different operations (reset pulse, write-0, write-1, read slot). The timing is tight enough that running a 1-Wire driver with interrupts disabled during bit operations is common practice.

This is one of those protocols where a working library saves a lot of pain. Getting the timing right by hand, across different MCU clock speeds and compiler optimization levels, is tedious. Most embedded frameworks (Arduino, STM32 HAL community libraries, etc.) have a 1-Wire driver that handles the bit-level timing.

### Parasitic Power

1-Wire devices can steal power from the data line through an internal diode, charging a small capacitor that supplies the device between communication pulses. This is genuinely clever — the DS18B20, for example, can run with only a data line and ground, no VCC connection.

The catch is that during temperature conversion (which takes up to 750ms at 12-bit resolution), the device draws significantly more current than the pull-up resistor can supply. The bus master must provide a "strong pull-up" — actively driving the data line high through a low-impedance path — during the conversion period. Some MCU implementations handle this by switching the GPIO from open-drain to push-pull temporarily. If the strong pull-up is missing or too weak, conversions return incorrect values (often 85.0 degrees C, which is the DS18B20's power-on default — a recognizable symptom).

External VCC power avoids this issue entirely and is the simpler option when wiring allows it.

### Device Discovery

Every 1-Wire device has a factory-programmed 64-bit ROM code (8-bit family code, 48-bit serial number, 8-bit CRC). The protocol includes a ROM search algorithm that discovers all devices on the bus by walking a binary tree of ROM codes. This is elegant but slow — each search pass takes hundreds of bit operations, and you need multiple passes to find all devices.

In practice, you often know which devices are on the bus and can skip discovery, addressing them directly by ROM code.

### Performance

1-Wire is slow — about 16 kbps in standard speed mode (there is an overdrive mode at roughly 140 kbps, but few devices support it). For temperature sensors that report a value every second, this is fine. For anything requiring throughput, 1-Wire is not the right tool.

## SMBus

The System Management Bus (SMBus) is based on I2C with additional constraints that make it more predictable for system management tasks. If I2C is the general-purpose slow bus, SMBus is I2C with a tighter spec sheet.

### Relationship to I2C

SMBus and I2C share the same physical layer — two-wire, open-drain, pull-up resistors, 7-bit addressing. An SMBus device will electrically connect to an I2C bus. The differences are in the protocol rules:

- **Clock low timeout**: SMBus requires that any device release SCL within 35ms. This prevents a hung device from locking up the bus indefinitely. I2C has no such requirement — a device can hold the clock low forever (clock stretching), and the spec says that is fine.
- **Packet Error Checking (PEC)**: SMBus defines an optional CRC-8 byte appended to transactions. This catches data corruption on the bus, which I2C has no mechanism to detect.
- **SMBALERT# line**: An out-of-band interrupt signal that allows slave devices to signal the host without waiting to be polled.
- **Voltage and timing ranges**: SMBus defines tighter voltage thresholds and timing limits than I2C. For example, the logic-low threshold for SMBus is 0.8V fixed, while I2C defines it as a fraction of VDD.
- **Address reservation**: SMBus reserves certain addresses for specific functions (ARP protocol, alert response, host address).

### Common Uses

SMBus is the standard interface for laptop battery packs (the "smart battery" protocol), power supply monitoring (PMBus, which is a superset of SMBus), board management controllers, and temperature monitoring ICs in servers and PCs. If you are working with power management ICs or battery fuel gauges, you will encounter SMBus.

### MCU Perspective

Most MCU I2C peripherals can communicate with SMBus devices without modification at the electrical level. The I2C hardware handles start/stop conditions, addressing, and ACK/NACK the same way. What the firmware needs to handle varies by device:

**PEC**: If the SMBus device requires PEC on certain commands (check the datasheet — some make it optional, some mandate it), firmware must compute and append the CRC-8 byte for writes, and verify it for reads. Some MCU I2C peripherals (STM32, for example) have hardware PEC calculation built into the I2C block — you enable it in a register and the hardware appends or checks the CRC automatically. On MCUs without hardware PEC, it is a simple software CRC.

**Timeouts**: SMBus's 35ms clock-low timeout means firmware should configure an I2C timeout to detect and recover from a stuck bus. Many I2C peripherals have a configurable timeout, but it is often disabled by default. Without it, a misbehaving SMBus device can hang the I2C driver indefinitely.

**Alert handling**: If the system uses SMBALERT#, firmware needs to monitor that GPIO line and initiate the alert response protocol (a special I2C read to the alert response address) when it goes low.

### Practical Notes

If a device datasheet says "SMBus compatible," your I2C peripheral will almost certainly communicate with it. Start with a normal I2C read/write and see if it responds. Then check whether the specific commands you need require PEC — many devices accept commands with or without PEC, but a few refuse commands that lack it. The PMBus specification is particularly strict about PEC for certain write operations.

The clock low timeout is worth implementing in firmware regardless of SMBus — it protects against [I2C bus lockup]({{< relref "serial-interfaces" >}}), which is a real failure mode on any I2C bus.

## Gotchas

- **1-Wire timing breaks with interrupts enabled** — If an interrupt fires in the middle of a 1-Wire bit operation, the timing violation can corrupt the transaction. Disabling interrupts during bit-level operations is the standard workaround, but this increases interrupt latency elsewhere. On an RTOS, this is a tradeoff worth thinking about.
- **1-Wire reads 85.0 degrees C from DS18B20** — This is the power-on reset value. If you read it, the device either has not completed its conversion (you did not wait long enough or parasitic power was insufficient) or has been reset mid-operation. It is *not* a valid temperature reading, though it is a plausible one, which makes it easy to miss.
- **1-Wire bus length affects reliability** — The protocol's tight timing means long wires (more than a few meters) add capacitance that slows the rising edge. The pull-up resistor may need to be decreased (2.2k or lower) to compensate, and parasitic power becomes less reliable over distance.
- **SMBus PEC failures are silent if you don't check** — The device sends the PEC byte at the end of a read, but if your I2C driver does not compute and compare it, corrupted data passes through undetected. This is the whole point of PEC — but you have to actually use it.
- **SMBus timeout recovery is not free** — When the 35ms clock-low timeout fires, the bus needs to be reset. Some I2C peripherals handle this automatically; others require firmware to toggle the clock manually to release a stuck slave, similar to the [I2C bus lockup recovery]({{< relref "serial-interfaces" >}}) described on the serial interfaces page.
