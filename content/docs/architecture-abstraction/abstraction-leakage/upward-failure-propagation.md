---
title: "Upward Failure Propagation"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Upward Failure Propagation

A resistor in a voltage divider drifts by 2% due to thermal aging. The divider now delivers a slightly different voltage to the error amplifier's feedback pin. The error amplifier adjusts, but the new operating point shifts the regulated output voltage by 15 mV. That 15 mV shift reduces the noise margin of a downstream digital interface. Under certain signal conditions, the interface misreads a bit. The system reports a communication error.

The symptom is "communication error." The cause is a resistor that drifted. Between them lie four abstraction levels — primitive, block, subsystem, device — each of which transformed the failure into something different. At each boundary crossing, the failure changed character: a parameter drift became a voltage shift, which became a margin reduction, which became a bit error, which became a system fault. By the time the failure is visible, it looks nothing like its origin.

This is upward failure propagation: a problem at a low abstraction level surfaces as a symptom at a higher level, with each intervening level translating the failure into its own terms. The translation makes diagnosis difficult because the symptom at the top provides very little information about the cause at the bottom.

## How Failures Transform as They Propagate Upward

Each abstraction level has its own vocabulary for describing behavior. A primitive has voltages, currents, and temperatures. A block has transfer functions and operating points. A subsystem has specifications. A device has functionality. A system has performance. When a failure crosses from one level to the next, it gets re-expressed in the higher level's vocabulary — and information about the original cause is lost in the translation.

### From Primitive to Block

A failed or degraded primitive changes the block's transfer function. A resistor that has drifted shifts the block's gain or bias point. A capacitor with increased ESR changes the block's frequency response. A transistor with degraded beta shifts the block's quiescent current.

At the block level, the failure looks like "the gain is wrong" or "the frequency response has changed" or "the bias point has shifted." The block-level description is accurate — the behavior has changed — but it doesn't point to which primitive caused it, or even whether the cause is a primitive failure versus an external condition change. A gain error could be a drifted resistor, a loaded output, or a supply voltage that's too low. The block-level symptom is ambiguous.

### From Block to Subsystem

A block with a degraded transfer function affects the subsystem's ability to meet its specification. If the error amplifier in a voltage regulator has reduced gain (because a bias resistor drifted), the regulation accuracy degrades — the output voltage deviates further from nominal under load changes. If the compensation network has shifted (because a capacitor aged), the transient response changes — the subsystem rings or overshoots during load steps.

At the subsystem level, the failure looks like "the output voltage is out of spec" or "the transient response doesn't meet requirements." The subsystem specification doesn't describe which block is responsible, much less which primitive inside which block. The information has been compressed: a specific component-level degradation has become a generic specification violation.

### From Subsystem to Device

A subsystem that doesn't meet its specification affects the device's functionality. A power supply that's slightly out of tolerance may cause a processor to operate with reduced timing margins. An ADC whose accuracy has degraded may produce measurement values that are subtly wrong. A clock subsystem with increased jitter may cause communication interfaces to have higher error rates.

At the device level, the failure looks like "the processor crashes occasionally" or "the readings are inaccurate" or "the communication link drops packets." The device-level description is even further from the root cause. The connection between "output capacitor ESR increased" and "processor crashes under heavy load" requires traversing the entire chain: capacitor ESR → regulator transient response → voltage droop on load step → timing margin violation → processor error.

### From Device to System

A device with degraded functionality affects the system's behavior. A sensor module that reports inaccurate readings causes the control system to make wrong decisions. A communication module that drops packets causes coordination failures between system components. A power module that can't handle load transients causes downstream devices to reset.

At the system level, the failure looks like "the system behaves erratically" or "the output is wrong" or "it works sometimes but not always." The system-level description is maximally removed from the root cause. The causal chain is long, and each link in the chain adds ambiguity.

## Why Upward Propagation Makes Diagnosis Hard

Several properties of upward propagation conspire to make the symptom-to-cause connection difficult:

**Information loss at each boundary.** Each abstraction level compresses the detail of the level below. A specific component degradation becomes a generic block-level parameter shift, which becomes a generic specification violation, which becomes a generic functionality problem. By the time the failure reaches the system level, the symptom is consistent with dozens of possible root causes.

**Amplification and attenuation.** Failures don't propagate linearly. A 2% resistor drift might produce a 0.5% voltage error in one configuration (attenuated by loop gain) or a 100% functional failure in another (if the drift pushes an operating point across a threshold). The severity of the symptom at the top doesn't reliably indicate the severity of the cause at the bottom.

**Intermittency from threshold crossings.** A gradually degrading primitive may produce a symptom that appears intermittent at higher levels. The degradation crosses a threshold only under specific conditions — high temperature, heavy load, fast signal transitions — and the symptom appears and disappears as conditions change. The intermittency makes the failure look like a timing or noise problem at the higher level, obscuring the gradual degradation at the lower level.

**Multiple propagation paths.** A single primitive failure can propagate upward through multiple paths simultaneously. A degraded bypass capacitor affects both the supply voltage (power path) and the ground reference (signal path). The symptoms at the higher level — supply noise and signal distortion — appear to be two separate problems, when they have a single root cause.

## Structural Patterns of Upward Propagation

Certain circuit structures create characteristic propagation patterns:

**Feedback loops compress failures.** A failure inside a feedback loop is partially corrected by the loop until the loop runs out of gain. A drifted reference inside a voltage regulator is compensated by the loop — the output stays correct until the loop gain is insufficient to absorb the drift, at which point the output error suddenly becomes large. The loop masks the failure at first and then amplifies it.

**Signal chains accumulate errors.** In a signal chain (sensor → amplifier → filter → ADC → processor), a failure at any point propagates forward through every subsequent stage. Each stage may add its own degradation, making it difficult to determine which stage introduced the error. The accumulated error at the end is the sum of all contributions, not a clear signature of any single one.

**Protection circuits truncate propagation.** Overcurrent protection, voltage clamping, and thermal shutdown prevent failures from propagating further upward by shutting down the affected subsystem. This stops the damage but also stops the diagnostic information — the system sees "subsystem shut down" rather than the original failure. The protection circuit has replaced the informative symptom with a binary one.

## Tips

- When a system-level symptom doesn't respond to system-level fixes, the cause is likely propagating from a lower level. Move down the abstraction hierarchy systematically: verify subsystem specifications, then block-level behavior, then component-level parameters.
- The most efficient diagnostic approach is often to find the level where the failure first becomes visible. If the subsystem's output is out of spec, check whether the individual blocks are behaving correctly. If one block is wrong, check whether its components have the expected values. The level where "everything below looks right but this level looks wrong" is the level where the failure originates.
- Intermittent system-level failures that correlate with environmental conditions (temperature, load, input voltage) are strong indicators of a lower-level failure that crosses a threshold only under stress. Testing under stress conditions — elevated temperature, maximum load, minimum supply voltage — can make the failure consistent and therefore diagnosable.

## Caveats

- **The obvious fix at the symptom level may mask the real problem** — Adding a larger bypass capacitor to reduce supply noise may eliminate the symptom without addressing the root cause (a failed regulator, an overloaded supply, a ground path with too much impedance). The symptom returns when conditions change or when the added capacitor ages.
- **Multiple simultaneous degradations can produce a single symptom** — If two components have both drifted, but in opposite directions, they may partially cancel at one operating point and compound at another. Replacing only one component may shift the symptom rather than fix it.
- **Upward propagation can skip levels** — A failed primitive doesn't always propagate through every intermediate level in an orderly fashion. A shorted capacitor can simultaneously affect the block's frequency response, the subsystem's stability, and the device's functionality. The failure appears at multiple levels at once, not in a neat bottom-up sequence.
