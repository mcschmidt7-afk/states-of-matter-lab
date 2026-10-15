# Learning brief: States of Matter

## Purpose and audience

A self-guided browser inquiry for middle-school learners (grades 6–8), designed around NGSS MS-PS1-4. Learners use qualitative particle models to predict and describe how adding or removing thermal energy relates to particle motion, temperature, and state. The model uses water and carbon dioxide (CO₂) so learners can compare a familiar solid–liquid–gas sequence with a substance that skips the liquid phase at ordinary atmospheric pressure.

The main activity holds pressure at approximately 1 atmosphere. Its temperature control spans −120 °C to 200 °C and starts at −90 °C so both selected materials begin as solids. The pressure investigation is separate and compares two bounded presets: ordinary pressure (about 1 atm) and elevated pressure (about 8 atm). The plasma activity is a separate conceptual mode. The simulation is a teaching model; it is not a molecular-dynamics calculation or a substitute for safety guidance about real materials.

## Anchor phenomenon and model

Launch with a comparison question: **When warmed at ordinary pressure, why does ice become liquid water while dry ice changes directly from solid to gas?** Invite a prediction before revealing the phase sequence. In the main activity, learners select water or CO₂, adjust a temperature slider, and inspect a particle view, state label, and concise evidence readout.

At about 1 atmosphere, water melts near 0 °C and boils near 100 °C. Solid CO₂ (dry ice) sublimes near −78.5 °C; liquid CO₂ is not stable at 1 atmosphere. Its triple point is about 216.58 K (−56.57 °C) and roughly 5.18 bar, so a model at ordinary pressure must not show CO₂ melting into a liquid. These are reference values for pure substances; real transition values depend on pressure and conditions. Cite [NIST water reference temperatures](https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir85-3133.pdf), [NIST Chemistry WebBook: CO₂](https://webbook.nist.gov/cgi/cbook.cgi?ID=C124389&Mask=8004), and the [NIST CO₂ equation-of-state review](https://srd.nist.gov/jpcrdreprint/1.555812.pdf).

The particle view should communicate these qualitative distinctions:

- Solid particles are close together and vibrate around relatively fixed positions.
- Liquid particles stay close and move past one another.
- Gas particles are widely spaced and move freely through the container.
- Heating generally increases average particle motion; cooling generally decreases it. A phase change changes the arrangement and motion pattern, not the substance's molecular identity: water remains H₂O and carbon dioxide remains CO₂.
- The model uses a narrow ±2 °C visual transition window to interpolate between particle arrangements as a learner moves the temperature slider. Label this a **visual transition view near the threshold**, not a band of equilibrium coexistence. At a fixed pressure, equilibrium coexistence belongs at the exact transition temperature. Make clear the slider selects temperature; it does not model the amount of energy transferred or a heating curve.

Do not imply that all phases occur in every substance at the same pressure. In particular, the default CO₂ path at ordinary pressure is solid → gas by sublimation; the interface's nearby mixed-particle display is only visual interpolation. Water's default path is solid → liquid by melting → gas by boiling, with the same kind of illustrative display near each transition.

## Learning goals

By the end, learners can:

1. Describe how particle spacing, arrangement, and motion differ in a solid, liquid, and gas.
2. Use the temperature and particle display as evidence to explain a heating or cooling transition.
3. Explain that H₂O molecules remain H₂O and CO₂ molecules remain CO₂ during a physical state change.
4. Compare water and CO₂ at ordinary pressure, identifying water melting/boiling and CO₂ sublimation without inserting a liquid CO₂ phase.
5. Use the separate pressure activity to predict qualitatively how pressure changes a phase boundary, especially water's boiling temperature.
6. Identify plasma as an ionized state with charged particles and explain why the plasma activity is a separate high-energy concept rather than the next household-temperature setting.

## Learner flow and UI requirements

1. **Notice and predict.** Present the dry-ice/ice comparison and ask learners to predict what warming does to each substance. Capture a short choice or sentence before controls become active.
2. **Explore temperature.** Let learners select Water or CO₂ and move one temperature slider across a labeled Celsius range. Pair the slider with a clear heating/cooling cue, a phase label, and particle motion that changes gradually. Keep pressure explicitly labeled as about 1 atm in this activity.
3. **Inspect transitions.** Near a threshold, show a changing mixed-particle display as a clearly labeled visual interpolation window. For water, show melting and boiling; for CO₂ at 1 atm, show sublimation. Explain that equilibrium coexistence at fixed pressure is at the exact threshold, and the slider does not model energy transfer. A checkpoint should ask learners to describe what changes in the particle view and what remains the same.
4. **Collect evidence.** Keep the current temperature, named phase(s), and a brief particle-state description visible as text. Provide a small run history or labeled sequence of learner-selected observations so students can compare before, during, and after a transition. Do not make color the only way to distinguish substances or phases.
5. **Explain and transfer.** Prompt learners to compare the two substances and use the displayed observations to support their explanation. Ask what changing pressure might do, then direct them to the distinct pressure activity.
6. **Pressure activity.** Provide its own material selector (water or CO₂), temperature slider, and bounded comparison between ordinary pressure (about 1 atm) and elevated pressure (about 8 atm); do not present a continuous pressure slider. Hold temperature fixed while learners switch pressure, and show phase state plus a compact particle view with text equivalent. For water, a useful comparison point is 120 °C: the model shows gas at ordinary pressure and liquid at elevated pressure, where its approximate boiling threshold is 170 °C. For CO₂, learners can explore around −52 °C: the model shows gas at ordinary pressure and liquid at elevated pressure (between the simplified −56.6 °C melting and −48 °C boiling thresholds). Label these as approximate teaching presets, not a phase-diagram calculator; real boundaries change continuously with pressure.
7. **Plasma activity.** Provide a separate conceptual scene explaining that plasma contains ions and free electrons. Use a star, aurora, or abstract high-energy environment as context. Do not extend the household temperature slider into plasma or present an attainable room/oven/stove temperature as sufficient to create this high-energy plasma. Plasma is not a phase change of H₂O or CO₂ in the main activity.

## Visual direction and interaction principles

Use a fresh visual identity separate from the marsh/beetle reference: a bright, compact science-observatory interface with dark ink-blue framing, warm neutral panels, and crisp luminous particle diagrams. The main stage can resemble a transparent instrument chamber, with temperature as a prominent vertical or horizontal control and a compact state ribbon for water and CO₂. Use shape and labels as well as color to differentiate H₂O and linear O=C=O molecules. Keep the molecule geometry recognizable and unchanged across states; animation should communicate motion, spacing, and ordering rather than changing molecule size or shape.

Keep each activity focused on one main question. Use short, answer-neutral prompts, visible units, keyboard-operable controls, clear focus, reduced-motion support, and textual equivalents for all particle and phase information. Avoid decorative motion that competes with the scientific model. A reset should return the selected activity to its documented starting condition.

## Model limits and assumptions

- The default main activity assumes pure substances and approximately 1 atmosphere; it does not cover mixtures, humidity, dissolved gases, supercritical fluids, or detailed phase diagrams.
- Main-activity rounded thresholds are water 0 °C (melting) and 100 °C (boiling), and CO₂ −78.5 °C (sublimation) at ordinary pressure. In the pressure activity, the model's about-8-atm preset uses approximate water boiling at 170 °C and CO₂ melting at −56.6 °C / boiling at −48 °C. These are simplified teaching values, not a continuous phase diagram.
- The ±2 °C mixed particle display is a visual interpolation window only. Equilibrium coexistence at fixed pressure is at the exact transition temperature; the model does not simulate heat transfer or latent heat.
- Particle drawings are schematic, not to scale. Motion is illustrative; do not imply the simulation calculates real molecular trajectories.
- Mixed-phase visuals stand for coexistence at a transition, not water molecules becoming different molecules or all particles switching simultaneously.
- Temperature represents the model's thermal condition. It should not be labeled as “heat”; heat is energy transferred because of a temperature difference.
- Plasma is presented as a separate conceptual extension. Plasma behavior is complex, and high-temperature plasma is not represented as a simple continuation of ordinary solid/liquid/gas spacing rules. DOE describes plasma as ions and free electrons and distinguishes high-temperature plasmas from low-temperature plasma cases.
- The initial instructional assumption is grades 6–8 learners have seen particle diagrams and Celsius temperatures. Confirm local standards and learner prerequisites before classroom use.
- No worksheet, teacher guide, accounts, saved work, translation, or offline distribution is included in this scope.

## Assessment prompts

- “Predict what happens as you warm ice and dry ice at about 1 atmosphere. What makes you think so?”
- “Choose one transition. What changed in particle motion, spacing, or arrangement? What stayed the same?”
- “Use the observations before, during, and after the transition to explain what happened.”
- “Why does the CO₂ path not show a liquid at ordinary pressure?”
- “How would raising or lowering pressure change water's boiling temperature in the pressure activity?”
- “What makes plasma different from a neutral gas, and why does it have its own high-energy activity?”

A strong explanation connects thermal condition to particle motion and arrangement, describes the illustrative mixed-particle view and its limit, preserves molecular identity, distinguishes CO₂ sublimation at ordinary pressure from water's melting and boiling, and uses pressure appropriately in the separate activity.

## Sources

- [NGSS MS-PS1-4: Matter and its Interactions](https://www.nextgenscience.org/pe/ms-ps1-4-matter-and-its-interactions) — middle-school expectation, examples of water and CO₂, and qualitative particle-model scope.
- [NIST: Thermometry](https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir85-3133.pdf) — water's normal boiling point and its pressure dependence.
- [NIST Chemistry WebBook, SRD 69: Carbon dioxide phase-change data](https://webbook.nist.gov/cgi/cbook.cgi?ID=C124389&Mask=8004) — CO₂ triple-point temperature.
- [NIST Journal of Physical and Chemical Reference Data: Equation of State for Carbon Dioxide](https://srd.nist.gov/jpcrdreprint/1.555812.pdf) — evaluated CO₂ phase-boundary data, including normal-pressure sublimation temperature and triple-point behavior.
- [U.S. Department of Energy: DOE Explains… Plasma](https://www.energy.gov/science/doe-explainsplasma) — ions and free electrons; high- and low-temperature plasma distinctions.
