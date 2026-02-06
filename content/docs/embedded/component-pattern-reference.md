---
title: "Components & Patterns"
weight: 80
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Components & Patterns

A quick reference to components and patterns commonly encountered in embedded system design, emphasizing integration, power budget, and peripheral interaction. Key parameters include current consumption and interface compatibility.

## Passive Components

**Resistor**
Pull-ups, current limiting, voltage dividers. Power rating matters when driving LEDs at high brightness (20 mA × VF drop can dissipate notable power) or sensing current (P = I²R adds up at high currents). Pull-up values trade power against edge speed — 4.7 kΩ is common for I2C, 10 kΩ for general GPIO pull-ups where speed doesn't matter. Precision voltage dividers for ADC reference scaling need tight tolerance (1% or better) to maintain accuracy. For current sensing, use low-tempco resistors to avoid measurement drift with temperature.

**Capacitor**
Decoupling near every IC, bulk storage on power rails, timing with RC circuits. Ceramic X5R/X7R for decoupling — 100 nF is the standard starting point per power pin, with larger values (10 µF) for bulk. Electrolytic or tantalum for bulk storage on input rails. Voltage derating significantly affects actual capacitance in ceramics — a 10 µF X5R capacitor at half its rated voltage may have lost 30-40% of its capacitance. C0G/NP0 types maintain capacitance across voltage and temperature but are limited to smaller values. Place decoupling capacitors as close to power pins as possible.

## Active Components

**MOSFET**
Load switching, level shifting, and reverse polarity protection. Logic-level threshold essential for direct MCU drive at 3.3 V — standard threshold MOSFETs won't fully turn on and will dissipate excessive power. For high-side switching, P-channel MOSFETs or dedicated load switch ICs simplify gate drive. RDS(on) determines heat dissipation at a given current; gate charge determines switching speed. SOA (safe operating area) matters for inductive loads and hot-swap applications where the MOSFET operates in the linear region during transitions.

**Fuse**
Overcurrent protection. Key parameters are current rating, voltage rating, breaking capacity, and speed (fast-blow vs. slow-blow). Slow-blow fuses tolerate inrush current from motor starting and capacitor charging; fast-blow fuses protect semiconductors that can't handle sustained overcurrent. Resettable PTCs (polyfuses) are convenient for USB and development applications but have higher resistance and may not protect against all fault types. Fuse rating should be above maximum normal current but below what the protected circuit can safely handle. Consider I²t rating for pulsed loads.

## Timing & Clock

**Crystal/resonator**
Clock source for MCU and communication peripherals. Key parameters are frequency, load capacitance, and startup time. Wrong load capacitors cause frequency error (typically pulling the oscillator a few hundred ppm off) or failure to oscillate at all. Most MCUs specify load capacitance requirements — calculate external capacitor values accounting for stray capacitance (usually 3-5 pF). Ceramic resonators are cheaper and more tolerant of layout issues but have looser frequency tolerance (0.5% vs. 0.005%). For UART communication, crystal accuracy matters — too much frequency error causes bit errors at higher baud rates.

**Crystal oscillator circuit**
MCU crystal plus load capacitors. Most MCUs specify load capacitance — get it wrong and the clock runs off-frequency or fails to start. External capacitor value depends on crystal's specified load capacitance and estimated stray capacitance. Too little capacitance causes startup failures or marginal oscillation; too much capacitance slows startup and increases power consumption. Oscillator layout matters — keep traces short, avoid routing signals near the crystal, and use a ground plane beneath. Some MCUs have internal load capacitors that must be accounted for.

## Power Management

**Linear regulator**
Drops input voltage with low noise but wastes power as heat. Key parameters are dropout voltage, quiescent current, and PSRR (power supply rejection ratio). Good for analog and noise-sensitive supplies where PSRR matters; inefficient for large voltage drops (e.g., 12 V to 3.3 V wastes 72% of input power as heat). LDO (low dropout) types minimize headroom requirements, important when running from batteries or when the input voltage is close to output. Thermal limits often determine usable current — calculate power dissipation and ensure adequate heat sinking.

**Buck converter**
Steps down voltage efficiently (typically 85-95%). Key parameters are input/output voltage range, output current, switching frequency, and quiescent current. Layout is critical — poor layout causes noise, instability, EMI, and reduced efficiency. Keep the switching loop (input cap, high-side switch, low-side switch/diode, output cap) tight and minimize loop area. Inductor selection affects ripple and efficiency; output capacitance affects transient response and ripple. Switching noise can couple into analog circuits — place converters away from sensitive analog sections and filter their outputs. Some applications need additional LC filtering for clean analog supplies.

**Boost converter**
Steps up voltage from batteries or low-voltage sources. Input current exceeds output current (Pin ≈ Pout/efficiency) — size input capacitors and traces accordingly. Boost converters cannot regulate when the output voltage is below the input (no soft-start protection without additional circuitry). True shutdown requires a load switch to disconnect the output. Useful for generating 5 V or higher from single lithium cells (3.0–4.2 V) or USB power (5 V). Inrush current at startup can be substantial and may trigger upstream protection.

**Battery management**
Charging, protection (over-voltage, under-voltage, over-current, over-temperature), and cell balancing for multi-cell packs. Getting lithium charge termination wrong is a safety issue — overcharging causes thermal runaway and potential fire. Dedicated battery management ICs handle the charge profile (CC-CV for lithium) and protection functions. Single-cell lithium systems are simpler; multi-cell systems need balancing to prevent individual cells from over/under charging. Fuel gauging (coulomb counting or voltage-based) provides remaining capacity estimates. Consider shipping mode to minimize battery drain before first use.

**Power sequencer**
Ensures multiple rails come up in the correct order. Key parameters are sequencing delay between rails and fault response. Required for complex devices like FPGAs where incorrect sequencing can cause latch-up, excess current draw, or I/O damage. Typical sequence: core voltage first, then I/O voltage, then peripherals. Some sequencers monitor all rails and provide a combined power-good signal. Sequencing requirements are specified in device datasheets — violating them voids reliability guarantees even if the device appears to work.

## Protection

**ESD/TVS clamp**
Protects external interfaces (USB, Ethernet, GPIO headers) from static discharge. Capacitance matters for high-speed signals — USB 2.0 HS can tolerate a few picofarads but USB 3.0 and HDMI need sub-picofarad devices. Place as close as possible to the connector, before any series resistors or other protection. ESD protection is essential for anything a user might touch or connect. Some MCUs have internal ESD protection but it may not meet IEC 61000-4-2 requirements for reliable system-level protection.

**Reverse polarity protection**
Prevents damage when power is connected backwards. Series diode is simple but lossy (0.3–0.7 V drop, plus power loss = Idrop × Vdrop); P-channel MOSFET drops millivolts when on but adds complexity and cost. MOSFET protection requires proper gate drive — the gate ties to input ground through a resistor and to input power through a Zener, causing the MOSFET to turn off if input polarity reverses. Consider fuse or PTC in series for crowbar protection against shorts. In battery-powered systems, every millivolt of protection circuit drop reduces usable battery life.

**Reset/supervisor**
Holds MCU in reset during power-up and brown-out. Key parameters are threshold voltage (should be above MCU minimum operating voltage), reset delay (hold time after voltage stabilizes), and output polarity. Essential for reliable operation — without it, the MCU may execute random instructions during unstable supply conditions, corrupting EEPROM or setting outputs incorrectly. Simple RC reset circuits are unreliable because they depend on power-supply rise time. Supervisors with manual reset inputs and watchdog timers combine multiple protection functions.

## Interfaces & Glue

**Level shifter**
Connects 3.3 V MCU to 5 V peripherals or legacy devices. Bidirectional MOSFET-based shifters work well for I2C (open-drain protocol) and other moderate-speed applications; SPI and faster protocols may need dedicated ICs with push-pull drivers. Resistor dividers work for high-to-low conversion only (5 V to 3.3 V) and are simple and fast but unidirectional. Direction-sensing auto-level-shifters have limitations on current and speed. For 1.8 V MCUs talking to 3.3 V devices, the same principles apply but voltage margins are tighter.

**Connector**
Board-to-board, wire-to-board, and programming/debug interfaces. Key parameters are current rating, mating cycles, and pin pitch. Connector failures cause the most frustrating intermittent bugs — symptoms include random resets, corrupted data, and power glitches that seem impossible to reproduce. Vibration and thermal cycling stress connectors over time. Polarization prevents reverse insertion. Programming connectors (SWD, JTAG, UART) are essential for development — design them in even if they won't be populated in production. Consider test points for debug access.

## Communication Interfaces

**UART/serial**
The universal debug interface. Key parameters are baud rate, voltage level (3.3 V TTL, 5 V TTL, RS-232), and flow control. Clock mismatch causes garbled data — both ends must agree on baud rate within about ±3%. Standard rates (9600, 115200) are widely supported; non-standard rates may not work with all USB-serial adapters. Debug UART is often the first thing to bring up when developing new hardware — design it in even if it won't be used in production. Consider TX-only logging to save a pin if bidirectional communication isn't needed.

**SPI**
Fast synchronous peripheral interface. Key parameters are clock frequency, clock mode (CPOL/CPHA), and chip-select polarity. Mode mismatch produces almost-valid-looking garbage — data shifts by one bit or appears inverted. Most peripherals use mode 0 (CPOL=0, CPHA=0) or mode 3 (CPOL=1, CPHA=1). SPI can run at tens of MHz, much faster than I2C, but requires more pins (minimum 3 plus one CS per device). DMA transfers free the CPU for other tasks during long transfers. Some devices have specific timing requirements for CS assertion-to-clock delays.

**I2C**
Two-wire peripheral bus with addressing. Key parameters are clock speed (100/400/1000 kHz) and bus capacitance. Many devices on long traces slow rising edges — reduce pull-up resistance (limited by device sink current, typically 3 mA) or reduce device count. Maximum bus capacitance of 400 pF limits trace length and device count. Address conflicts happen when two devices have the same address — some devices have configurable addresses via pins or registers. Multi-master buses are possible but add complexity. Clock stretching by slow devices can hang the bus if the master doesn't handle it correctly.

**USB interface**
Standard connectivity to computers. Key parameters are speed class (Full Speed 12 Mbps, High Speed 480 Mbps, SuperSpeed 5+ Gbps), device class (CDC for virtual COM port, HID for keyboards/mice, MSC for mass storage), and power capability. Implementation is mostly in silicon — the concern is choosing the right device class and handling enumeration. CDC class provides a simple serial interface but requires drivers on some operating systems. HID class works without drivers but has lower throughput. ESD protection on D+/D- lines is essential. USB-C adds connector orientation detection and power delivery complexity.

## Common Patterns

**Decoupling/bypass network**
Every IC needs local decoupling — 100 nF ceramic per power pin is the starting point. Place as close as possible; trace inductance matters more than capacitor ESR at high frequencies. Use multiple capacitors in parallel for wide frequency coverage (bulk electrolytic for low frequency, small ceramics for high frequency). Some MCUs have multiple VDD pins that must each have their own decoupling capacitor. Analog supplies (AVDD) often need separate decoupling with additional filtering to prevent digital noise from contaminating analog measurements.

**Pull-up/pull-down network**
Defines default states for I2C bus, chip selects, and reset lines. 4.7 kΩ typical for I2C; lower values for faster edges at the cost of power and bus drive requirements. Pull-ups on chip selects ensure peripherals are deselected during MCU reset/boot. Pull-ups or pull-downs on configuration pins set boot options. Unused GPIO pins should typically be configured as outputs or pulled to a known state to avoid floating inputs drawing unpredictable current. Consider current draw during sleep — a 3.3 V signal through a 4.7 kΩ pull-up to an active-low input draws 0.7 mA continuously.

**ADC front end**
Signal conditioning between sensor and MCU's ADC: filtering, buffering, level shifting. Anti-alias filter must be designed for the actual sample rate — any frequency above Nyquist aliases into the signal band and cannot be removed digitally. Buffer amplifiers isolate the sensor from ADC's sampling transients and provide low source impedance for accurate conversion. Level shifting matches sensor output range to ADC input range. For slow-moving signals (temperature, etc.), simple RC filtering may suffice; for audio or faster signals, active anti-alias filters are needed.

## Modules

**MCU development board**
MCU plus power regulation, debug interface, and headers. Key parameters are MCU family, peripheral set, and toolchain support. Use for prototyping; design custom boards for production. Built-in debugger/programmer (ST-Link, CMSIS-DAP, J-Link OB) simplifies development but may have limitations compared to full external debuggers. Watch for voltage differences between board power (often 5 V USB) and MCU signals (often 3.3 V). Arduino ecosystem provides extensive libraries and examples; professional boards (Nucleo, Launchpad) offer more debug features.

**Wireless module**
RF transceiver (often with integrated MCU) for Wi-Fi, Bluetooth, LoRa, Zigbee, or other protocols. Key parameters are protocol, range, power consumption (especially sleep current), and host interface. Antenna placement dramatically affects real-world range — keep the antenna away from ground planes, batteries, and metal enclosures. Certification (FCC, CE) is complex and expensive for custom RF designs; using pre-certified modules transfers that burden to the module vendor. Power consumption varies greatly between protocols and operating modes — Wi-Fi active transmit can exceed 200 mA while BLE advertising might be under 10 mA average.

**GPS/GNSS module**
Satellite receiver outputting position and time over serial. Key parameters are constellation support (GPS, GLONASS, Galileo, BeiDou), position accuracy, and time-to-first-fix (TTFF). Needs clear sky view — indoor or obstructed antenna causes long fix times or no fix at all. Cold start (no prior position info) takes longest; warm/hot starts are faster. Backup battery maintains ephemeris data for faster subsequent fixes. GPS modules can also provide accurate time synchronization (PPS output). Active antennas have built-in LNA for better sensitivity but require power.

**Display module**
Character LCD, OLED, or TFT with integrated controller. Key parameters are resolution, interface (I2C, SPI, parallel), power consumption, and viewing angle. I2C interfaces are simpler (fewer pins) but slower — adequate for character displays and small OLEDs, too slow for large TFT refresh. SPI handles faster updates for graphics. OLED displays offer high contrast and wide viewing angles but burn-in is a concern for static content. Backlit LCDs consume significant power, especially with high brightness. E-paper displays maintain image without power but have very slow refresh.

**USB-to-serial adapter**
Bridges USB to TTL UART for debug and programming. Key parameters are supported baud rates, voltage levels (3.3 V vs. 5 V), and driver compatibility. Driver issues with cheap clones remain common — FTDI, Silicon Labs CP210x, and genuine CH340 chips are reliable choices. Some adapters support additional signals (RTS, DTR) used for bootloader reset. Watch voltage levels — connecting a 5 V adapter to a 3.3 V MCU can cause damage. Most adapters provide some power from USB — enough for small MCUs but not for power-hungry peripherals.

**Sensor module/breakout board**
Sensor IC plus minimal support circuitry for prototyping. Convenient but layout may not match production requirements — long wires add noise pickup and capacitance, and prototyping grounding is usually poor. Good for learning and experimenting with new sensors before designing them into a product. Interface options vary (I2C, SPI, analog); check voltage compatibility. Documentation quality varies widely between vendors. Consider that production design may need different form factor, better EMI performance, or different packaging.

**Battery pack/holder**
Cells plus mechanical connection and possibly protection BMS. Key parameters are chemistry (Li-ion, LiFePO4, NiMH, alkaline), voltage, capacity, and protection features. Unprotected lithium cells need external protection — over-discharge damages cells permanently and over-charge creates fire risk. Battery holders add contact resistance that drops voltage under load. Consider cold-weather performance — lithium capacity drops significantly below 0°C. Shelf life matters for products that may sit unused — alkaline cells self-discharge slower than NiMH.

## System Patterns

**Battery-powered embedded system**
MCU, sensors, wireless, and power management designed for field deployment. Power budget dominates — every subsystem's sleep current matters. A single device that fails to enter low-power mode cuts battery life from months to days. Sleep current budget: 1 µA target for years of standby on coin cell, 10-100 µA acceptable for months on larger batteries. Wake-on-event (interrupt-driven) design minimizes active time. Consider power consumed by protection circuits, pull-ups, and voltage regulators in sleep. Energy harvesting (solar, vibration) can supplement or replace batteries in some applications.

**Wireless sensor network**
Multiple nodes communicating with a gateway. Key parameters are node count, topology (star for simplicity, mesh for range extension), protocol, and per-node power budget. Reliability challenges multiply with node count — a 1% packet loss rate becomes 10% of nodes failing to report each cycle when you have 10 nodes. Time synchronization matters for coordinated measurements. Mesh networks self-heal but add latency and complexity. Security (encryption, authentication) prevents unauthorized access and data tampering. Plan for field firmware updates.

**Sensor-to-display chain**
Complete path from physical quantity through sensing, processing, and display. The error budget exercise allocates allowable error across each stage — sensor accuracy, conditioning chain accuracy, ADC quantization, and display resolution must all be considered together. Calibration can remove systematic errors (offset, gain) but not random errors (noise). Display resolution should match actual measurement accuracy — displaying 4 significant digits when only 2 are meaningful is misleading and unprofessional.

**Environmental monitoring system**
Multi-sensor data collection, logging, and optionally alerting. Key parameters are sensor count, sample interval, storage capacity, and power budget. Sample rate trades directly against battery life — sampling temperature once per minute versus once per second changes battery life by 60×. Data logging requires non-volatile storage (SD card, flash) and consideration of write endurance. Time-stamping requires accurate RTC, often battery-backed. Remote alerting requires communication (cellular, LoRa) which dominates power budget when active.
