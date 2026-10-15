# States of Matter

A static browser inquiry simulation for middle-school learners. It follows a **predict → explore → evidence → explain** flow and uses particle views to compare water and carbon dioxide during heating and cooling.

## Run locally

Serve this directory with a static file server and open its local URL. For example, Python's built-in server can use port 4173. The project has no build step or external runtime dependency.

## Learning design

See [LEARNING_BRIEF.md](LEARNING_BRIEF.md) for the audience, learning goals, interaction requirements, model limits, and science sources. The main activity uses a −120 °C to 200 °C temperature slider at about 1 atmosphere: water melts and boils; solid CO₂ sublimes directly to gas. Mixed particle views appear in a narrow ±2 °C visual transition window and are labeled as interpolation, since equilibrium coexistence at fixed pressure occurs at the exact transition temperature. The separate pressure activity has its own water/CO₂ selector and temperature slider, plus ordinary (~1 atm) and elevated (~8 atm) pressure presets; it is not a continuous pressure calculator. A separate conceptual plasma activity describes ions and free electrons in a high-energy context.

## Scope

This project is a browser-based teaching model. It does not calculate molecular dynamics or provide a laboratory procedure. No worksheet or teacher guide is included.
