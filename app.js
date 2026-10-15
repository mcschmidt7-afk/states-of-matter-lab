import { advanceRun, createRun, preview } from "./model.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  unlocked: false,
  prediction: "",
  seed: seedFromLocation(),
  mainConditions: { activity: "ordinary", material: "water", temperatureC: -90, pressurePreset: "ordinary" },
  pressureConditions: { activity: "pressure", material: "water", temperatureC: 120, pressurePreset: "ordinary" },
  run: null,
};
state.run = createRun(state.seed, state.mainConditions);

const refs = {
  predictionForm: $("#prediction-form"), prediction: $("#prediction-select"), predictionStatus: $("#prediction-status"),
  mainMaterial: $$("input[name='substance']"), temperature: $("#temperature-slider"), temperatureOutput: $("#temperature-output"),
  field: $("#particle-field"), stage: $("#particle-stage"), phaseBadge: $("#phase-badge"), phaseLabel: $("#phase-label"), particleDescription: $("#particle-description"),
  stateSummary: $("#state-summary"), stateDescription: $("#state-description"), transitionCard: $("#transition-card"), transitionSummary: $("#transition-summary"), transitionDescription: $("#transition-description"),
  record: $("#record-observation"), observationList: $("#observation-list"), observationCount: $("#observation-count"), explanation: $("#explanation"), explanationFeedback: $("#explanation-feedback"),
  savedPrediction: $("#saved-prediction"),
  pressureMaterial: $$("input[name='pressure-material']"), pressureOptions: $$("input[name='pressure']"), pressureTemperature: $("#pressure-temperature-slider"), pressureTemperatureOutput: $("#pressure-temperature-output"), pressureResult: $("#pressure-result"), pressureDescription: $("#pressure-description"), pressureStateDescription: $("#pressure-state-description"), pressurePhaseLabel: $("#pressure-phase-label"), pressureField: $("#pressure-particle-field"), pressureParticleDescription: $("#pressure-particle-description"), pressureTransitionCard: $("#pressure-transition-card"), pressureTransitionSummary: $("#pressure-transition-summary"), pressureTransitionDescription: $("#pressure-transition-description"),
  plasmaReveal: $("#plasma-reveal"), plasmaDetail: $("#plasma-detail"),
};

function seedFromLocation() {
  const supplied = new URLSearchParams(location.search).get("seed");
  return supplied && /^\d+$/.test(supplied) ? Number(supplied) >>> 0 : Math.floor(Math.random() * 2 ** 32) >>> 0;
}

function displayTemperature(value) {
  return `${value < 0 ? "−" : ""}${Math.abs(value)} °C`;
}

function materialValue(value) {
  return value === "co2" ? "carbonDioxide" : value;
}

function phaseName(phase) {
  return phase === "mixed" ? "Transition view" : phase[0].toUpperCase() + phase.slice(1);
}

const predictionLabels = {
  "both-melt": "Both substances melt into a liquid first.",
  "water-only": "Water melts; CO₂ changes straight to gas.",
  "both-skip": "Both substances change straight to gas.",
  unsure: "I’m not sure yet.",
};

function particleDescription(observation) {
  const molecule = observation.material === "water" ? "water molecules" : "carbon dioxide molecules";
  if (observation.phase === "solid") return `${capitalize(molecule)} are close together in an ordered arrangement and vibrate in place. Their identity stays ${observation.material === "water" ? "H₂O" : "CO₂"}.`;
  if (observation.phase === "liquid") return `${capitalize(molecule)} stay close together but move past one another. Each particle remains ${observation.material === "water" ? "H₂O" : "CO₂"}.`;
  if (observation.phase === "gas") return `${capitalize(molecule)} are spread farther apart and move freely. They have not turned into another substance.`;
  if (observation.phase === "plasma") return "This separate conceptual view represents ions and free electrons. It is not a molecular transformation shown by the ordinary temperature slider.";
  return `This is an illustrative transition view of the same ${molecule}. At fixed pressure, equilibrium coexistence is at the exact transition temperature.`;
}

function capitalize(text) { return text[0].toUpperCase() + text.slice(1); }

function particleMarkup(particle, material, compact = false) {
  const node = document.createElement("span");
  node.className = material === "carbonDioxide" ? "co2-molecule" : "water-molecule";
  node.setAttribute("aria-hidden", "true");
  node.style.position = "absolute";
  node.style.left = `${particle.x}%`;
  node.style.top = `${particle.y}%`;
  node.style.transform = `translate(-50%, -50%) rotate(${particle.angle}deg) scale(${compact ? 0.72 : 1})`;
  node.style.opacity = particle.phase === "gas" ? "0.82" : "1";
  node.dataset.phase = particle.phase;
  if (material === "carbonDioxide") {
    node.innerHTML = '<i class="oxygen"></i><b class="carbon"></b><i class="oxygen"></i>';
  } else {
    node.innerHTML = "<i></i><b></b><i></i>";
  }
  if (!reducedMotion() && particle.speed > 0.7) {
    node.animate(
      [{ translate: "0 0" }, { translate: `${Math.round((particle.x % 7) - 3)}px ${Math.round((particle.y % 7) - 3)}px` }],
      { duration: Math.max(500, 2300 - particle.speed * 700), iterations: Infinity, direction: "alternate", easing: "ease-in-out" },
    );
  }
  return node;
}

function renderParticles(field, observation, compact = false) {
  if (!field) return;
  field.replaceChildren(...observation.particles.map((particle) => particleMarkup(particle, observation.material, compact)));
}

function renderTransition(observation, card, summary, description) {
  if (!card) return;
  const transition = observation.transition;
  card.hidden = !transition;
  if (!transition) return;
  if (summary) summary.textContent = `${observation.phases.map(({ phase }) => phase).join(" + ")} near ${transition.equilibriumAtC} °C`;
  if (description) description.textContent = transition.caution;
}

function renderMain() {
  const observation = preview(state.run, state.mainConditions);
  refs.temperature.value = String(observation.temperatureC);
  refs.temperatureOutput.value = displayTemperature(observation.temperatureC);
  refs.phaseLabel.textContent = phaseName(observation.phase).toUpperCase();
  refs.phaseBadge.dataset.phase = observation.phase;
  refs.stage.dataset.phase = observation.phase;
  refs.stage.setAttribute("aria-label", particleDescription(observation));
  refs.stateSummary.textContent = phaseName(observation.phase);
  refs.stateSummary.setAttribute("aria-live", "polite");
  refs.phaseLabel.setAttribute("aria-live", "polite");
  refs.stateDescription.textContent = observation.explanation;
  refs.particleDescription.textContent = particleDescription(observation);
  renderParticles(refs.field, observation);
  renderTransition(observation, refs.transitionCard, refs.transitionSummary, refs.transitionDescription);
  refs.mainMaterial.forEach((input) => { input.checked = materialValue(input.value) === observation.material; });
  renderObservations();
}

function renderObservations() {
  const records = state.run.history.slice(1);
  refs.observationCount.textContent = `${records.length} saved`;
  if (records.length === 0) {
    refs.observationList.replaceChildren(makeListItem("Move the temperature slider, then save an observation.", ""));
    refs.observationList.firstChild.className = "empty-observation";
    return;
  }
  refs.observationList.replaceChildren(...records.map((item) => makeListItem(
    `${item.material === "water" ? "H₂O" : "CO₂"} · ${displayTemperature(item.temperatureC)}`,
    `${phaseName(item.phase)}`,
  )));
}

function makeListItem(left, right) {
  const item = document.createElement("li");
  const label = document.createElement("span");
  const value = document.createElement("span");
  label.textContent = left;
  value.textContent = right;
  item.append(label, value);
  return item;
}

function pressureHeadline(observation) {
  const substance = observation.material === "water" ? "Water" : "CO₂";
  if (observation.transition) {
    return `${substance} is in a transition view near ${observation.transition.equilibriumAtC} °C.`;
  }
  const thresholds = observation.thresholds;
  const relevantThreshold = observation.phase === "solid"
    ? (thresholds.meltingC ?? thresholds.sublimationC)
    : observation.phase === "liquid"
      ? thresholds.boilingC
      : (thresholds.boilingC ?? thresholds.sublimationC);
  const thresholdText = Number.isFinite(relevantThreshold) ? ` The next modeled transition is near ${relevantThreshold} °C.` : "";
  return `${substance} is shown as ${observation.phase} at ${displayTemperature(observation.temperatureC)} in this ${observation.pressurePreset} preset.${thresholdText}`;
}

function renderPressure() {
  const observation = preview(state.run, state.pressureConditions);
  refs.pressureTemperature && (refs.pressureTemperature.value = String(observation.temperatureC));
  if (refs.pressureTemperatureOutput) refs.pressureTemperatureOutput.value = displayTemperature(observation.temperatureC);
  if (refs.pressureResult) refs.pressureResult.textContent = pressureHeadline(observation);
  if (refs.pressureDescription) refs.pressureDescription.textContent = `${observation.explanation} ${observation.thresholds.note}`;
  if (refs.pressureStateDescription) refs.pressureStateDescription.textContent = particleDescription(observation);
  if (refs.pressurePhaseLabel) refs.pressurePhaseLabel.textContent = phaseName(observation.phase);
  if (refs.pressureParticleDescription) refs.pressureParticleDescription.textContent = particleDescription(observation);
  renderParticles(refs.pressureField, observation, true);
  renderTransition(observation, refs.pressureTransitionCard, refs.pressureTransitionSummary, refs.pressureTransitionDescription);
  refs.pressureMaterial.forEach((input) => { input.checked = materialValue(input.value) === observation.material; });
  refs.pressureOptions.forEach((input) => { input.checked = input.value === observation.pressurePreset; });
}

function setUnlocked(unlocked) {
  state.unlocked = unlocked;
  refs.mainMaterial.forEach((input) => { input.disabled = !unlocked; });
  refs.temperature.disabled = !unlocked;
  refs.record.disabled = !unlocked;
  refs.explanation.disabled = !unlocked;
  refs.pressureMaterial.forEach((input) => { input.disabled = !unlocked; });
  refs.pressureOptions.forEach((input) => { input.disabled = !unlocked; });
  if (refs.pressureTemperature) refs.pressureTemperature.disabled = !unlocked;
  $("#reset-trial") && ($("#reset-trial").disabled = !unlocked);
  $("#new-trial") && ($("#new-trial").disabled = !unlocked);
  if (!unlocked && refs.savedPrediction) refs.savedPrediction.hidden = true;
}

function recordObservation() {
  state.run = advanceRun(state.run, state.mainConditions);
  refs.record.textContent = "✓ Observation saved";
  window.setTimeout(() => { refs.record.textContent = "＋ Save this observation"; }, 900);
  renderMain();
  refs.explanationFeedback.textContent = `Saved evidence. Your prediction: ${predictionLabels[state.prediction] ?? "not saved"} Use it to explain what changed in particle motion or arrangement; the substance itself stayed the same.`;
}

function resetSameSeed() {
  state.run = createRun(state.seed, state.mainConditions);
  refs.explanation.value = "";
  refs.explanationFeedback.textContent = "The same seed has been reset. Record a new series of observations to compare.";
  renderMain();
}

function newTrial() {
  state.seed = Math.floor(Math.random() * 2 ** 32) >>> 0;
  state.run = createRun(state.seed, state.mainConditions);
  state.prediction = "";
  refs.prediction.value = "";
  setUnlocked(false);
  refs.explanation.value = "";
  refs.predictionStatus.textContent = "New trial started. Make a prediction for this trial to unlock the controls.";
  history.replaceState({}, "", `${location.pathname}?seed=${state.seed}`);
  refs.explanationFeedback.textContent = "New trial started. The particle arrangement will replay consistently for this seed.";
  renderMain();
}

function addReplayControls() {
  if (!refs.record || $("#reset-trial")) return;
  const controls = document.createElement("div");
  controls.className = "replay-controls";
  const reset = document.createElement("button");
  reset.id = "reset-trial";
  reset.type = "button";
  reset.className = "button button-outline";
  reset.textContent = "Reset same seed";
  const trial = document.createElement("button");
  trial.id = "new-trial";
  trial.type = "button";
  trial.className = "button button-outline";
  trial.textContent = "New trial";
  reset.addEventListener("click", resetSameSeed);
  trial.addEventListener("click", newTrial);
  controls.append(reset, trial);
  refs.record.after(controls);
}

refs.predictionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!refs.prediction.value) {
    refs.predictionStatus.textContent = "Choose a prediction first, or choose “I’m not sure yet.”";
    refs.prediction.focus();
    return;
  }
  state.prediction = refs.prediction.value;
  setUnlocked(true);
  if (refs.savedPrediction) {
    refs.savedPrediction.hidden = false;
    refs.savedPrediction.textContent = `Saved prediction: ${predictionLabels[state.prediction]}`;
  }
  refs.predictionStatus.textContent = "Prediction saved. Explore, save observations, and return here to revise your thinking.";
  refs.temperature.focus();
});

refs.mainMaterial.forEach((input) => input.addEventListener("change", () => {
  state.mainConditions.material = materialValue(input.value);
  renderMain();
}));
refs.temperature.addEventListener("input", () => {
  state.mainConditions.temperatureC = Number(refs.temperature.value);
  renderMain();
});
refs.record.addEventListener("click", recordObservation);

refs.pressureMaterial.forEach((input) => input.addEventListener("change", () => {
  state.pressureConditions.material = materialValue(input.value);
  renderPressure();
}));
refs.pressureOptions.forEach((input) => input.addEventListener("change", () => {
  state.pressureConditions.pressurePreset = input.value;
  renderPressure();
}));
refs.pressureTemperature?.addEventListener("input", () => {
  state.pressureConditions.temperatureC = Number(refs.pressureTemperature.value);
  renderPressure();
});

refs.plasmaReveal.addEventListener("click", () => {
  const expanded = refs.plasmaDetail.hidden;
  refs.plasmaDetail.hidden = !expanded;
  refs.plasmaReveal.setAttribute("aria-expanded", String(expanded));
  refs.plasmaReveal.firstChild.textContent = expanded ? "Hide the particle change " : "Explore the particle change ";
  if (expanded) {
    const plasma = preview(state.run, { activity: "plasma", material: state.mainConditions.material });
    refs.plasmaDetail.querySelector("p").textContent = `${plasma.explanation} ${plasma.thresholds.note}`;
  }
});

refs.explanation.addEventListener("input", () => {
  const enoughDetail = refs.explanation.value.trim().length >= 30;
  refs.explanationFeedback.textContent = enoughDetail
    ? "Check that your explanation names evidence and says the particles stayed the same substance."
    : "Add evidence from a saved observation: temperature, phase, spacing, order, or motion.";
});

addReplayControls();
setUnlocked(false);
renderMain();
renderPressure();
