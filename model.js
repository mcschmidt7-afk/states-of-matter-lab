export const PARTICLE_COUNT = 48;

export const MATERIALS = {
  water: { label: "Water", formula: "H₂O" },
  carbonDioxide: { label: "Carbon dioxide", formula: "CO₂" },
};

export const ACTIVITIES = {
  ordinary: "ordinary",
  pressure: "pressure",
  plasma: "plasma",
};

export const PRESSURE_PRESETS = {
  ordinary: { label: "Ordinary pressure (about 1 atm)", atmospheres: 1 },
  elevated: { label: "Elevated pressure (about 8 atm)", atmospheres: 8 },
};

const TEMPERATURE_LIMITS = { min: -120, max: 200 };
// The UI uses this narrow interpolation region only to make a slider's
// approach to a threshold legible. It is not an equilibrium coexistence range.
const TRANSITION_HALF_WIDTH_C = 2;

/**
 * A deterministic state model for the visual simulation. It is deliberately
 * not a scientific phase-diagram calculator: the pressure activity has two
 * bounded presets and the mixed regions are visual teaching bands.
 */
export function createRun(seed, options = {}) {
  const conditions = normalizeConditions(options);
  const observation = makeObservation(seed, 0, conditions);
  return {
    seed: Number(seed) >>> 0,
    step: 0,
    conditions,
    observation,
    history: [toEvidence(observation)],
  };
}

/** Return an observation for prospective controls without changing a run. */
export function preview(run, updates = {}) {
  return makeObservation(run.seed, run.step, normalizeConditions({ ...run.conditions, ...updates }));
}

/** Apply conditions as one recorded observation. Identical inputs replay exactly. */
export function advanceRun(run, updates = {}) {
  const conditions = normalizeConditions({ ...run.conditions, ...updates });
  const step = run.step + 1;
  const observation = makeObservation(run.seed, step, conditions);
  return {
    ...run,
    step,
    conditions,
    observation,
    history: [...run.history, toEvidence(observation)],
  };
}

export function normalizeConditions(input = {}) {
  const activity = Object.values(ACTIVITIES).includes(input.activity) ? input.activity : ACTIVITIES.ordinary;
  const material = Object.hasOwn(MATERIALS, input.material) ? input.material : "water";
  const requestedPressure = Object.hasOwn(PRESSURE_PRESETS, input.pressurePreset) ? input.pressurePreset : "ordinary";
  return {
    activity,
    material,
    temperatureC: clamp(Number(input.temperatureC ?? 20), TEMPERATURE_LIMITS.min, TEMPERATURE_LIMITS.max),
    // Ordinary and plasma activities intentionally do not expose pressure as a changing variable.
    pressurePreset: activity === ACTIVITIES.pressure ? requestedPressure : "ordinary",
  };
}

export function phaseFor(conditions) {
  const normalized = normalizeConditions(conditions);
  if (normalized.activity === ACTIVITIES.plasma) return plasmaProfile(normalized);

  const thresholds = thresholdsFor(normalized);
  const phases = blendPhases(normalized.temperatureC, thresholds);
  const phase = phases.length === 1 ? phases[0].phase : "mixed";
  const pressureText = PRESSURE_PRESETS[normalized.pressurePreset].label;
  const carbonDioxideAtOrdinaryPressure = normalized.material === "carbonDioxide" && normalized.pressurePreset === "ordinary";
  return {
    phase,
    phases,
    transition: transitionMetadata(phases, thresholds),
    thresholds,
    pressureText,
    conceptualOnly: false,
    explanation: carbonDioxideAtOrdinaryPressure
      ? "At ordinary pressure, carbon dioxide changes directly between solid and gas. This model does not show stable liquid CO₂ there."
      : explanationFor(phases, normalized.material, normalized.pressurePreset, thresholds),
  };
}

function thresholdsFor({ material, pressurePreset }) {
  if (material === "water") {
    return pressurePreset === "elevated"
      ? { meltingC: 0, boilingC: 170, note: "Approximate water thresholds for about 8 atm; real boiling temperature changes continuously with pressure." }
      : { meltingC: 0, boilingC: 100, note: "Simplified water thresholds at ordinary pressure." };
  }
  if (pressurePreset === "elevated") {
    return { meltingC: -56.6, boilingC: -48, note: "Approximate CO₂ thresholds for about 8 atm; real values vary continuously with pressure." };
  }
  return { sublimationC: -78.5, note: "CO₂ sublimation point near ordinary pressure; liquid CO₂ is not stable here." };
}

function blendPhases(temperatureC, thresholds) {
  if ("sublimationC" in thresholds) return blendAtBoundary(temperatureC, thresholds.sublimationC, "solid", "gas");
  const nearMelting = blendAtBoundary(temperatureC, thresholds.meltingC, "solid", "liquid");
  if (temperatureC <= thresholds.meltingC + TRANSITION_HALF_WIDTH_C) return nearMelting;
  return blendAtBoundary(temperatureC, thresholds.boilingC, "liquid", "gas");
}

function blendAtBoundary(temperatureC, boundaryC, coolerPhase, warmerPhase) {
  const low = boundaryC - TRANSITION_HALF_WIDTH_C;
  const high = boundaryC + TRANSITION_HALF_WIDTH_C;
  if (temperatureC <= low) return [{ phase: coolerPhase, fraction: 1 }];
  if (temperatureC >= high) return [{ phase: warmerPhase, fraction: 1 }];
  const warmerFraction = (temperatureC - low) / (high - low);
  return [
    { phase: coolerPhase, fraction: round(1 - warmerFraction) },
    { phase: warmerPhase, fraction: round(warmerFraction) },
  ];
}

function transitionMetadata(phases, thresholds) {
  if (phases.length === 1) return null;
  const boundaryC = "sublimationC" in thresholds
    ? thresholds.sublimationC
    : phases.some(({ phase }) => phase === "solid") && phases.some(({ phase }) => phase === "liquid")
      ? thresholds.meltingC
      : thresholds.boilingC;
  return {
    equilibriumAtC: boundaryC,
    visualWindowC: { from: boundaryC - TRANSITION_HALF_WIDTH_C, to: boundaryC + TRANSITION_HALF_WIDTH_C },
    label: `Transition view around ${boundaryC}°C`,
    caution: "At a fixed pressure, equilibrium coexistence occurs at the transition temperature. The nearby blend is only a visual interpolation for a temperature slider.",
  };
}

function plasmaProfile({ material }) {
  return {
    phase: "plasma",
    phases: [{ phase: "plasma", fraction: 1 }],
    thresholds: { conceptualTemperatureC: 10000, note: "Conceptual activity only; real ionization depends on material, temperature, density, and other conditions." },
    pressureText: "Not modeled in this conceptual activity",
    conceptualOnly: true,
    explanation: `${MATERIALS[material].label} is represented as ions and free electrons. This is a conceptual comparison, not a reachable setting on the ordinary temperature slider.`,
  };
}

function explanationFor(phases, material, pressurePreset, thresholds) {
  const names = phases.map(({ phase }) => phase).join(" and ");
  const pressure = PRESSURE_PRESETS[pressurePreset].label.toLowerCase();
  if (phases.length > 1) {
    const boundaryC = "sublimationC" in thresholds ? thresholds.sublimationC : phases.some(({ phase }) => phase === "solid") ? thresholds.meltingC : thresholds.boilingC;
    return `${MATERIALS[material].label} is near its ${boundaryC}°C transition at ${pressure}. The blend helps show the change, while fixed-pressure equilibrium coexistence belongs at the transition temperature itself.`;
  }
  return `${MATERIALS[material].label} is shown as ${names} at ${pressure}.`;
}

function makeObservation(seed, step, conditions) {
  const profile = phaseFor(conditions);
  const particles = particleFrame(seed, step, conditions, profile.phases);
  return {
    step,
    ...conditions,
    ...profile,
    particleCounts: countParticles(profile.phases),
    particles,
  };
}

function toEvidence(observation) {
  const { particles, ...evidence } = observation;
  return evidence;
}

function countParticles(phases) {
  const counts = {};
  let assigned = 0;
  phases.forEach(({ phase, fraction }, index) => {
    const count = index === phases.length - 1 ? PARTICLE_COUNT - assigned : Math.round(PARTICLE_COUNT * fraction);
    counts[phase] = count;
    assigned += count;
  });
  return counts;
}

function particleFrame(seed, step, conditions, phases) {
  const counts = countParticles(phases);
  const rng = makeRng((Number(seed) >>> 0) + step * 7919 + materialCode(conditions.material) + activityCode(conditions.activity));
  const particles = [];
  let id = 0;
  for (const { phase } of phases) {
    for (let index = 0; index < counts[phase]; index += 1) {
      const position = positionFor(phase, index, counts[phase], rng);
      particles.push({ id: id++, phase, ...position, angle: Math.round(rng() * 360), speed: speedFor(phase, conditions.temperatureC, rng) });
    }
  }
  return particles;
}

function positionFor(phase, index, count, rng) {
  if (phase === "solid") {
    const columns = Math.ceil(Math.sqrt(count));
    return { x: round(12 + (index % columns) * (76 / Math.max(1, columns - 1))), y: round(18 + Math.floor(index / columns) * 12 + (rng() - 0.5) * 2) };
  }
  if (phase === "liquid") return { x: round(10 + rng() * 80), y: round(52 + rng() * 35) };
  if (phase === "gas") return { x: round(6 + rng() * 88), y: round(8 + rng() * 84) };
  return { x: round(6 + rng() * 88), y: round(8 + rng() * 84) };
}

function speedFor(phase, temperatureC, rng) {
  const base = phase === "solid" ? 0.15 : phase === "liquid" ? 0.65 : phase === "gas" ? 1.4 : 2.1;
  return round(base + Math.max(0, temperatureC + 120) / 420 + rng() * 0.15);
}

export function makeRng(seed) {
  let value = (Number(seed) >>> 0) || 1;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let next = Math.imul(value ^ (value >>> 15), 1 | value);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function materialCode(material) { return material === "water" ? 17 : 43; }
function activityCode(activity) { return activity === "ordinary" ? 0 : activity === "pressure" ? 101 : 307; }
function clamp(value, min, max) { return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : 20; }
function round(value) { return Math.round(value * 1000) / 1000; }
