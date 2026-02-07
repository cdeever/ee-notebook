---
title: "Formula Reference"
weight: 99
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Formula Reference

A catalog of the key equations used throughout this notebook, organized by domain. Each entry gives the formula, its variables, and the practical insight it encodes. The main notebook pages describe these relationships in behavioral terms — this page collects the math in one place for quick reference.

---

## Circuit Fundamentals

**Ohm's law**
V = IR — voltage equals current times resistance. The most-used relationship in electronics.

**Kirchhoff's voltage law (KVL)**
The sum of all voltages around any closed loop is zero.

**Kirchhoff's current law (KCL)**
The sum of all currents entering a node equals the sum leaving it.

**Power dissipation**
P = IV = I²R = V²/R — power dissipated in a resistive element, in three equivalent forms.

**Voltage divider**
V_out = V_in × R₂ / (R₁ + R₂) — unloaded output voltage of a resistive divider.

**Voltage divider loading**
V_out = V_source × Z_in / (Z_out + Z_in) — actual signal voltage at a stage's input, accounting for the output impedance of the driving stage and the input impedance of the receiving stage. When Z_in >> Z_out (bridging), nearly all the voltage transfers. When Z_in = Z_out (matching), half the voltage transfers but maximum power transfers.

**Thevenin equivalent output**
V_out = V_th × R_load / (R_th + R_load) — loaded output voltage of any linear source reduced to its Thevenin equivalent. Small R_th/R_load ratio means stiff regulation.

**Norton equivalent**
I_n = V_th / R_th — Norton current source equivalent. Thevenin and Norton representations are interchangeable.

**Maximum power transfer**
P_max = V_th² / (4 × R_th) — occurs when R_load = R_th. Important in RF (50 ohm matching) and audio, but NOT the goal in power delivery where efficiency (R_load >> R_th) matters more.

**Output impedance measurement**
R_out = R_load × (V_oc - V_loaded) / V_loaded — bench method: measure open-circuit voltage, measure with a known load, calculate. Non-destructive way to characterize any source.

---

## Passive Components

**Inductor voltage-current relationship**
V = L × (dI/dt) — voltage is proportional to the rate of current change. Constant current means zero voltage; sudden current interruption means very large voltage.

**Transformer voltage scaling**
V_secondary = V_primary × (N_secondary / N_primary) — voltage scales with turns ratio. A 10:1 step-down converts 120 V to 12 V.

**Transformer current scaling**
I_secondary = I_primary × (N_primary / N_secondary) — current scales inversely. Step down voltage and available current goes up proportionally. Power in equals power out minus losses.

**Impedance reflection through a transformer**
Z_reflected = Z_load × (N_primary / N_secondary)² — impedance transforms by the square of the turns ratio. A 4:1 ratio transforms 50 ohm to 800 ohm as seen from the primary.

**RC filter cutoff frequency**
f = 1 / (2 pi R C) — the -3 dB frequency where output drops to 70.7% of input.

---

## Magnetics

**Copper loss (DC)**
P_copper = I² × DCR — basic resistive loss in a winding. At 100 C, DCR is roughly 30% higher than the 25 C datasheet spec.

**Copper loss (AC + DC)**
P_copper = I_dc² × R_dc + I_ac_rms² × R_ac — total copper loss includes both DC and AC components. At switching frequencies, R_ac can be 5-50x higher than R_dc due to skin effect and proximity effect.

**Core loss (Steinmetz equation)**
P_core = k × f^a × B_peak^b × Volume — where k, a, b are material constants from the datasheet (typically a = 1.1-1.8, b = 2.0-2.8). Core loss scales aggressively with both frequency and flux density; doubling either more than doubles the loss.

**Leakage inductance**
L_leakage = L_winding × (1 - k) — where k is the coupling coefficient (0.95-0.999 for real transformers). Even small leakage inductance causes serious voltage spikes during fast current transitions.

**Leakage spike voltage**
V_spike = L_leak × dI/dt — when current through a transformer is interrupted, leakage inductance produces a voltage spike. 10 uH leakage with 2 A interrupted in 50 ns produces a 400 V spike.

**Parasitic ringing frequency**
f_ring = 1 / (2 pi sqrt(L_leak × C_stray)) — leakage inductance and stray capacitance form an LC tank that rings at this frequency whenever excited by a fast transition. Typical range: 1-50 MHz.

---

## Semiconductors & Amplifiers

**MOSFET transconductance**
g_m = delta_I_D / delta_V_GS — how much drain current changes per volt of gate voltage change. In saturation: g_m = 2 × I_D / (V_GS - V_th). Higher bias current increases g_m but increases power dissipation.

**BJT voltage divider bias**
I_E = (V_B - V_BE) / R_E — the workhorse biasing topology. Two resistors set V_B, emitter resistor R_E converts it to stable current independent of beta. Design rule: divider current should be at least 10x expected base current.

**Loaded amplifier gain**
A_loaded = A_v × Z_load / (Z_out + Z_load) — actual gain after accounting for loading by the next stage. If Z_load is comparable to Z_out, significant gain is lost.

---

## Noise & Signal Quality

**Thermal noise voltage (Johnson-Nyquist)**
V_noise = sqrt(4 k T R B) — where k = Boltzmann's constant (1.38e-23 J/K), T = temperature in Kelvin, R = resistance in ohms, B = bandwidth in Hz. Every resistor generates this white noise from random electron motion. Proportional to sqrt(R) and sqrt(B); narrowing bandwidth helps significantly.

**Shot noise current**
I_noise = sqrt(2 q I_DC B) — where q = electron charge (1.6e-19 C), I_DC = DC current, B = bandwidth. Caused by the discrete nature of charge carriers crossing a junction. Dominates in photodiode and low-current circuits.

**Signal-to-noise ratio**
SNR = 10 × log10(P_signal / P_noise) dB, or equivalently for voltage across the same impedance: SNR = 20 × log10(V_signal / V_noise) dB. Always measured over a defined bandwidth — wider bandwidth means more observed noise.

**Friis noise figure (cascaded stages)**
F_total = F_1 + (F_2 - 1)/G_1 + (F_3 - 1)/(G_1 × G_2) + ... — where F is noise factor (linear, not dB) and G is power gain. Shows why the first stage dominates: if G_1 is large, all subsequent noise contributions are divided by it. A noisy stage after high gain is harmless; a noisy stage with no preceding gain is catastrophic.

**Total harmonic distortion**
THD = sqrt(V_2² + V_3² + V_4² + ...) / V_1 — ratio of harmonic content to fundamental. Below 0.001% is state-of-the-art audio; above 1% is clearly audible. THD alone doesn't capture character (even harmonics sound warm, odd harmonics sound harsh).

**Signal-to-noise-and-distortion ratio**
SINAD = Signal / (Noise + Distortion), in dB — the most comprehensive single-number metric for converter performance. Combines noise and distortion into one figure.

**Effective number of bits**
ENOB = (SINAD - 1.76) / 6.02 — actual resolution achieved by an ADC accounting for noise and distortion. A 16-bit ADC with 84 dB SINAD has ENOB of ~13.7 bits, wasting more than 2 bits on real-world impairments.

**Jitter-limited SNR**
SNR_jitter = -20 × log10(2 pi f × delta_t_rms) — where f = signal frequency, delta_t_rms = RMS jitter. Jitter matters more at higher signal frequencies. A DC signal is unaffected. For 20 kHz audio at 16-bit quality (96 dB SNR), the clock needs less than 1 ns RMS jitter.

**dBFS spectral level**
Level_dBFS = 20 × log10(|X[k]| / (N/2)) — for a single tone at bin center. In digital audio, spectral levels are referenced to full scale; a full-scale sine reads 0 dBFS, everything else reads negative. Different FFT implementations normalize differently — always verify with a known signal.

---

## Digital & Signal Integrity

**Dynamic switching current (CMOS)**
I_dynamic = C_load × VDD × f_switch — every gate draws current during transitions. Thousands switching simultaneously create cumulative current transients with high-frequency harmonics determined by edge rate, not clock frequency.

**Ground bounce**
V_bounce = L × dI/dt — current transients through parasitic ground inductance shift all logic levels. 10 pins switching 10 mA each in 1 ns through 5 nH gives 0.5 V of bounce — serious on a 3.3 V system with 0.4 V noise margin.

**PDN target impedance**
Z_target = delta_V / I_transient — the power distribution network impedance must stay below this from DC to hundreds of MHz. For 1.0 V core with 5% tolerance and 10 A transient: Z_target = 5 milliohm.

**Reflection coefficient**
Gamma = (Z_L - Z0) / (Z_L + Z0) — ranges from -1 to +1. Gamma = 0 means matched (no reflection). Gamma = +1 means open circuit (voltage doubles). Gamma = -1 means short circuit (voltage cancels). Applies to both PCB signal integrity and RF transmission lines.

**Metastability MTBF**
MTBF = 1 / (f_clk × f_data × T_w × e^(-t_r / tau)) — where f_clk = destination clock frequency, f_data = asynchronous data transition rate, T_w = metastability vulnerability window, t_r = available resolution time (clock period minus setup time), tau = flip-flop resolution time constant. Higher clock frequencies dramatically reduce MTBF. A two-stage synchronizer in modern 28 nm at 200 MHz easily achieves MTBF >> 10^15 years; at 1 GHz the same synchronizer might yield MTBF of only months.

---

## Radio & RF

**VSWR from reflection coefficient**
VSWR = (1 + |Gamma|) / (1 - |Gamma|) — ratio of voltage maximum to minimum on a standing wave. VSWR 1:1 is perfect; 2:1 is acceptable for many systems (~11% reflected power); 3:1 indicates poor match (~25% reflected).

**Return loss**
Return loss (dB) = -20 × log10(|Gamma|) — reflected power in decibels. Higher is better. 20 dB means 1% reflected; 10 dB means 10%.

**Power delivered to load**
P_load = P_forward × (1 - |Gamma|²) — forward power minus reflected power.

**Bandwidth from loaded Q**
BW = f_center / Q_loaded — bandwidth over which a matching network stays acceptable. Higher Q means sharper resonance and narrower usable bandwidth.

**Antenna radiation efficiency**
eta = R_rad / (R_rad + R_loss) — where R_rad is radiation resistance and R_loss is ohmic loss. Half-wave dipoles achieve ~98%; electrically small antennas can drop to 0.5%. Loading coils add loss resistance that further reduces efficiency.

**Antenna effective aperture**
A_e = G × lambda² / (4 pi) — where G = antenna gain (linear), lambda = wavelength. Describes how much area the antenna captures from incoming radiation. Larger than physical size at low frequencies, which is why satellite dishes must be physically larger at lower frequencies for the same gain.

**Half-wave dipole length (with end-effect correction)**
L = (0.95 × c) / (2 × f) = 142.5 / f_MHz (meters, for each arm) — the 0.95 factor accounts for charge accumulation at wire tips making the antenna electrically longer than its physical length. Thicker wires have stronger end effects and need to be shorter.

**Characteristic impedance from velocity and capacitance**
Z0 = 1 / (v × C_per_length) — bench technique for estimating Z0 when TDR or VNA is not available.

**TDR initial voltage step**
V_initial = V_source × Z0 / (Z_source + Z0) — the voltage that first appears on the line before reflections return.

---

## DSP & Sampling

**DFT frequency bin**
f_k = k × f_s / N — where k = bin index (0 to N-1), f_s = sample rate, N = transform length. Bin spacing (frequency resolution) is f_s / N. Higher frequency resolution requires longer FFT, trading off against time resolution.
