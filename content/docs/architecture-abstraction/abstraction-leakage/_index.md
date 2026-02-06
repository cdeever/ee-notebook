---
title: "Abstraction Leakage & Failure Propagation"
weight: 40
bookCollapseSection: true
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Abstraction Leakage & Failure Propagation

Abstractions promise containment: what happens inside a block stays inside the block, and the outside world sees only the contracted behavior. This promise is never perfectly kept. Internal switching currents modulate the supply. Internal power dissipation raises the temperature of nearby components. Internal oscillation radiates energy into adjacent signal paths. The abstraction boundary is leaky, and the leaks carry consequences.

Failures are even less respectful of boundaries. A drifted component deep inside a subsystem produces a symptom at the system's output. A misconfigured register at the device level overstresses a transistor at the primitive level. The cause and the symptom occupy different abstraction levels, connected by propagation paths that cross every boundary between them. Understanding how failures move — upward from cause to symptom, downward from decision to damage — is essential for diagnosis, because the alternative is searching at the wrong level and finding plausible but incorrect explanations.

## What This Section Covers

- **[How Internal Behavior Leaks Out of ICs]({{< relref "how-internal-behavior-leaks" >}})** — The mechanisms by which behavior that should stay inside a package becomes visible and consequential outside it.

- **[Upward Failure Propagation]({{< relref "upward-failure-propagation" >}})** — How failures at lower abstraction levels surface as symptoms at higher levels, and why the symptom rarely points directly to the cause.

- **[Downward Failure Propagation]({{< relref "downward-failure-propagation" >}})** — How problems at higher levels — wrong configurations, violated operating conditions, bad system-level decisions — damage or stress lower-level components.

- **[Misdiagnosis from Reasoning at the Wrong Layer]({{< relref "misdiagnosis-wrong-layer" >}})** — How choosing the wrong abstraction level leads to plausible but incorrect explanations, and how to recognize when it's happening.
