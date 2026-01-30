---
title: "State Machines & Event Loops"
weight: 30
---

# State Machines & Event Loops

Embedded systems are inherently stateful. A UART driver is idle, receiving, or in error. A motor controller is stopped, accelerating, running, or faulting. Without explicit structure to represent these states and transitions, firmware degenerates into nested if/else chains with hidden state in global variables. State machines and event loops impose discipline — they make behavior visible in the code structure itself.

## Why Explicit State Machines

The alternative is implicit state: a combination of boolean flags, counters, and control flow that together determine what the system is "doing." Implicit state works until the system grows. Then certain flag combinations were never anticipated, transitions happen in wrong orders, and debugging requires mentally simulating every possible interleaving. I have spent hours tracing through firmware that had no state machine — just layers of conditionals — trying to reconstruct what state the system was actually in when it failed. An explicit state machine replaces that mental model with code. The current state is a variable. The transitions are visible. The structure is the documentation.

## Switch-Case State Machines

The simplest implementation: an enum for states, a switch statement in the main loop.

```c
typedef enum {
    STATE_IDLE,
    STATE_SAMPLING,
    STATE_PROCESSING,
    STATE_TRANSMITTING,
    STATE_ERROR
} system_state_t;

static system_state_t state = STATE_IDLE;

void run_state_machine(void) {
    switch (state) {
    case STATE_IDLE:
        if (trigger_received()) {
            start_adc();
            state = STATE_SAMPLING;
        }
        break;
    case STATE_SAMPLING:
        if (adc_complete()) {
            state = STATE_PROCESSING;
        }
        break;
    case STATE_PROCESSING:
        compute_result();
        state = STATE_TRANSMITTING;
        break;
    case STATE_TRANSMITTING:
        if (uart_send_complete()) {
            state = STATE_IDLE;
        }
        break;
    case STATE_ERROR:
        handle_error();
        state = STATE_IDLE;
        break;
    }
}
```

This is clear, debuggable, and works well for linear sequences and simple protocols. The state variable tells you exactly where the system is. A transition is a single assignment. Adding a new state means adding a case.

The limitation: when the number of states and events grows, the switch becomes unwieldy. Transitions are scattered across cases, making it hard to see the full picture. And if multiple independent behaviors need their own state (one for communication, one for sensor management, one for UI), nesting switch-case machines or running them in parallel gets messy fast.

## Table-Driven State Machines

A table-driven approach separates the state machine's structure from its behavior. You define a table where each row specifies: current state, event, next state, and an action function to call during the transition.

```c
typedef struct {
    system_state_t current;
    event_t        event;
    system_state_t next;
    void           (*action)(void);
} transition_t;

static const transition_t table[] = {
    { STATE_IDLE,         EVT_TRIGGER,    STATE_SAMPLING,     start_adc       },
    { STATE_SAMPLING,     EVT_ADC_DONE,   STATE_PROCESSING,   NULL            },
    { STATE_PROCESSING,   EVT_DONE,       STATE_TRANSMITTING, begin_transmit  },
    { STATE_TRANSMITTING, EVT_TX_DONE,    STATE_IDLE,         NULL            },
    { STATE_ANY,          EVT_FAULT,      STATE_ERROR,        handle_error    },
};
```

The dispatch function walks the table looking for a matching (state, event) pair, calls the action, and updates the state. This scales better than switch-case: adding a transition is adding a row, not modifying control flow. The tradeoff is indirection — debugging means looking up which table entry matched, not reading sequential code. For small machines (under 10 states), switch-case is usually clearer. For protocol handlers or command parsers with more than a dozen states, the table pays for itself.

## Event-Driven Design

Instead of polling for conditions inside each state, peripherals and ISRs post events to a queue. The main loop dequeues events and feeds them to the state machine. This decouples event producers (hardware, timers, communication) from the consumer (the state machine).

```c
while (1) {
    event_t evt = event_queue_get();  // blocks or returns EVT_NONE
    dispatch_event(evt);
}
```

The event queue is typically a ring buffer — ISRs push events, the main loop pops them. This gives ordered processing, decouples event sources from handlers, and makes the system testable (inject events in a harness without real hardware). The queue must be interrupt-safe: separate read and write indices, sized as a power of two for bitmask wrapping. If the ISR writes and the main loop reads, and indices are aligned 32-bit values on Cortex-M, no further locking is needed. See {{< relref "interrupts" >}} for more on shared data between ISR and main contexts.

## The Superloop Pattern

The superloop is the simplest main loop: `while(1) { poll_sensors(); update_state(); drive_outputs(); }`. Every task runs once per iteration in fixed order. No preemption, no scheduling, no priority. Superloops are underrated for simple systems — execution order is completely deterministic, there are no concurrency bugs, and debugging is straightforward.

The failure mode is latency. If `poll_sensors()` takes 5 ms waiting for an ADC, nothing else runs for at least 5 ms. If a UART byte arrives during that window and the buffer overflows before the next poll, data is lost. This is where interrupts and event queues start earning their complexity.

## Cooperative Scheduling

Cooperative scheduling is a step up from the superloop. Each "task" is a function that does a small amount of work and returns. A scheduler calls tasks in sequence, optionally with timing control (e.g., run this task every 10 ms, that task every 100 ms).

```c
void scheduler_run(void) {
    uint32_t now = get_tick_ms();
    for (int i = 0; i < NUM_TASKS; i++) {
        if (now - tasks[i].last_run >= tasks[i].period) {
            tasks[i].function();
            tasks[i].last_run = now;
        }
    }
}
```

"Cooperative" because tasks voluntarily yield by returning. No task is forcibly preempted. This is simpler than an RTOS but requires discipline: every task must return quickly, and there is no mechanism to enforce the contract. I have found cooperative schedulers useful for organizing firmware with several periodic activities at different rates — reading sensors at 100 Hz, updating a display at 10 Hz, checking input at 50 Hz. The scheduler makes timing requirements explicit.

## When Cooperative Breaks Down

The cooperative model fails when any task cannot guarantee a short execution time. Examples:

- **Flash writes** — Erasing or programming internal flash can take milliseconds, during which the CPU is stalled
- **Cryptographic operations** — Hashing or encryption on a resource-constrained MCU can take significant time
- **Complex calculations** — Filtering, FFT, or control-loop math that exceeds the scheduling period

When one task overruns, every other task's timing slips. There is no recovery mechanism. If the timing requirements are hard (motor commutation, audio sample rate), this is unacceptable — and the motivation for preemptive scheduling with an RTOS, covered in {{< relref "/docs/embedded/real-time-concepts" >}}. The intermediate solution is to break long operations into smaller chunks that fit within the cooperative time budget, but this adds complexity and only works if you know the worst-case chunk time.

## Avoiding Spaghetti

Without structure, firmware grows into nested if/else chains with hidden state in global flags. State machines and event queues are the antidote — they do not eliminate complexity, but they make it visible. States are named (you can grep for `STATE_ERROR`). Transitions are explicit (the compiler warns about unhandled enum values with `-Wswitch`). Events flow through a single dispatch function, which is a natural place for logging, validation, and breakpoints.

## Debugging State Machines

Logging state transitions is one of the most effective embedded debugging techniques. If the system misbehaves, knowing the sequence of states it passed through narrows the problem dramatically. A simple approach:

```c
void set_state(system_state_t new_state) {
    log_transition(state, new_state);
    state = new_state;
}
```

Where `log_transition` writes to a circular buffer in SRAM, outputs on a debug UART, or toggles trace pins. Even in production firmware, a small transition log in RAM costs almost nothing and is invaluable when diagnosing field failures. On the bench, adding the state variable to the debugger's watch window gives you a live view of the machine. For complex machines, drawing the state diagram on paper and tracing actual transitions against it helps — sometimes the code does not match the intended design, and the diagram makes the discrepancy obvious.

## Gotchas

- **Implicit state hidden in global flags is a maintenance trap** — Every boolean flag is a hidden two-state machine. Three flags create eight possible combinations, most of which are probably invalid but never checked. Consolidate related flags into an explicit state enum.
- **Forgetting a default case in the switch means unhandled states execute no code silently** — Always include a default case that logs or asserts. In production, transitioning to an error/safe state from default is better than doing nothing.
- **Event queue overflow drops events with no indication** — If the ISR posts events faster than the main loop processes them, the ring buffer wraps and overwrites unread events. Size the queue conservatively, and consider adding an overflow counter or assertion.
- **Cooperative tasks that exceed their time budget break all other tasks' timing** — There is no enforcement in a cooperative scheduler. One slow task cascades into system-wide timing violations. Measure task execution time on the bench and add a watchdog or assertion if a task overruns.
- **State machine transitions from ISR context introduce race conditions** — If both the ISR and the main loop can modify the state variable, you have a classic data race. Either limit transitions to one context (main loop reads events, only main loop changes state) or protect the state variable with an interrupt-disable guard.
- **Testing state machines in isolation requires decoupling hardware** — If state transition logic is tangled with direct register access, you cannot test it off-target. Passing events and reading outputs through function pointers or abstraction layers makes the state machine testable on a PC, which dramatically speeds up development.
