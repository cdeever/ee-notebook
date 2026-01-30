---
title: "Real-Time Concepts"
weight: 50
bookCollapseSection: true
---

# Real-Time Concepts

Why timing is everything. In embedded systems, correct output at the wrong time is a wrong answer. A motor control loop that runs 2 ms late produces a visible glitch. A communication protocol that misses a timing window drops a packet. A safety interlock that responds too slowly is not safe. Real-time behavior is not about speed — it's about predictability.

Real-time concepts sit at the intersection of hardware capability and software design: how fast the CPU can execute, how interrupts affect worst-case timing, whether an RTOS helps or hurts determinism, and how shared resources create hidden timing dependencies. Understanding these concepts is what separates firmware that meets its timing requirements by design from firmware that meets them by accident.

## What This Section Covers

- **[Determinism & Timing]({{< relref "determinism-and-timing" >}})** — Worst-case execution time, timing guarantees vs averages, jitter budgets: what "real-time" actually means.
- **[RTOS Fundamentals]({{< relref "rtos-fundamentals" >}})** — Tasks, scheduling, context switching: when an RTOS helps and when it hurts.
- **[Concurrency & Shared Resources]({{< relref "concurrency-and-shared-resources" >}})** — Critical sections, mutexes, volatile, atomics, and priority inversion: the hard problems of concurrent firmware.
