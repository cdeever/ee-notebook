---
title: "Legacy Signaling and Interfaces"
weight: 50
bookCollapseSection: true
---

# Legacy Signaling and Interfaces

Many "legacy" interface standards are still in daily use — they just aren't the ones you'd pick for a new design. RS-232 serial links run industrial equipment and test instruments. RS-485 multi-drop buses connect sensors across factory floors. 4–20 mA current loops carry analog measurements in process control. Relay logic still runs HVAC systems and older machine tools. Parallel printer ports became ad-hoc digital I/O interfaces for a generation of lab equipment.

These interfaces have electrical characteristics that differ from modern standards in ways that matter at the bench. RS-232 swings ±12 V. Current loops need a loop supply and careful attention to grounding. Relay logic operates at 24 V AC or DC with real contact bounce and arc suppression requirements. Understanding the electrical layer — not just the protocol — is necessary for troubleshooting, tapping into existing systems, or building adapters that bridge legacy equipment to modern controllers.
