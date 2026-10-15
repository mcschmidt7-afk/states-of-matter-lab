import assert from "node:assert/strict";
import { PARTICLE_COUNT, advanceRun, createRun, phaseFor, preview } from "./model.js";

const sameA = advanceRun(createRun(72391, { material: "water", temperatureC: 100 }), { temperatureC: 20 });
const sameB = advanceRun(createRun(72391, { material: "water", temperatureC: 100 }), { temperatureC: 20 });
assert.deepEqual(sameA, sameB, "same seed and inputs replay exactly");
assert.equal(sameA.history.length, 2, "a recorded change adds evidence");

const waterIce = phaseFor({ material: "water", temperatureC: -4 });
const waterMelt = phaseFor({ material: "water", temperatureC: 0 });
const waterSteam = phaseFor({ material: "water", temperatureC: 104 });
assert.equal(waterIce.phase, "solid");
assert.equal(waterMelt.phase, "mixed");
assert.deepEqual(waterMelt.phases.map(({ phase }) => phase), ["solid", "liquid"]);
assert.equal(waterMelt.transition.equilibriumAtC, 0);
assert.match(waterMelt.transition.caution, /equilibrium coexistence/);
assert.equal(waterSteam.phase, "gas");

const dryIce = phaseFor({ material: "carbonDioxide", temperatureC: -90 });
const sublimingCo2 = phaseFor({ material: "carbonDioxide", temperatureC: -78.5 });
const ordinaryCo2 = phaseFor({ material: "carbonDioxide", temperatureC: -40 });
assert.equal(dryIce.phase, "solid");
assert.deepEqual(sublimingCo2.phases.map(({ phase }) => phase), ["solid", "gas"], "ordinary-pressure CO₂ transitions by sublimation");
assert.equal(ordinaryCo2.phase, "gas");
assert.ok(!ordinaryCo2.phases.some(({ phase }) => phase === "liquid"), "ordinary-pressure CO₂ has no stable liquid state");

const liquidCo2 = phaseFor({ activity: "pressure", material: "carbonDioxide", pressurePreset: "elevated", temperatureC: -52 });
assert.equal(liquidCo2.phase, "liquid", "elevated-pressure preset can demonstrate liquid CO₂");
assert.match(liquidCo2.thresholds.note, /Approximate CO₂ thresholds/);

const highPressureWater = phaseFor({ activity: "pressure", material: "water", pressurePreset: "elevated", temperatureC: 120 });
assert.equal(highPressureWater.phase, "liquid", "the bounded elevated-pressure preset shifts water's boiling threshold");

const plasma = phaseFor({ activity: "plasma", material: "water", temperatureC: 20 });
assert.equal(plasma.phase, "plasma");
assert.equal(plasma.conceptualOnly, true);
assert.match(plasma.explanation, /conceptual comparison/);

for (const conditions of [
  { material: "water", temperatureC: -120 },
  { material: "water", temperatureC: 100 },
  { material: "carbonDioxide", temperatureC: -78.5 },
  { activity: "pressure", material: "carbonDioxide", pressurePreset: "elevated", temperatureC: -52 },
  { activity: "plasma", material: "carbonDioxide", temperatureC: 20 },
]) {
  const observation = preview(createRun(1), conditions);
  assert.equal(observation.particles.length, PARTICLE_COUNT);
  assert.equal(Object.values(observation.particleCounts).reduce((sum, count) => sum + count, 0), PARTICLE_COUNT);
  assert.ok(observation.particles.every(({ x, y, speed }) => x >= 0 && x <= 100 && y >= 0 && y <= 100 && speed > 0), "particle visual data stays bounded");
  assert.equal(observation.history, undefined, "observations remain small, plain visual data");
}

const ordinaryWithElevatedRequest = createRun(4, { material: "water", pressurePreset: "elevated" });
assert.equal(ordinaryWithElevatedRequest.conditions.pressurePreset, "ordinary", "pressure only changes in the dedicated pressure activity");
console.log("model tests passed");
