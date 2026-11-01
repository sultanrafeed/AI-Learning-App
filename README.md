# AI Quest: 42172 Introduction to AI exam coach

AI Quest is a game-based study app for the UTS 42172 *Introduction to Artificial Intelligence* final exam (100 minutes; question types MCQ, multiple answer, True/False, single blank, multiple blanks and matching). It runs as a static iPhone/iPad web app on GitHub Pages. It installs to the home screen, works offline and saves your progress on the device.

- **14 worlds** cover every examinable lecture and workshop: search, local search, supervised learning, decision trees, neural networks, MDPs/RL, CNNs, detection, sequence models, attention, generative AI, logic, Bayesian networks and knowledge representation. Module 1 is not examined, so it is not quizzed.
- **2,077 questions** with full worked solutions, why-each-option-is-wrong explanations and a source tag.
- **Unlimited fresh calculation variants**: 97 calculation generators (UCS/GBFS/A*, entropy/IG/Gini, losses, gradient descent, Bellman/Q-learning/TD, Bayes/BN enumeration, convolution, pooling, output size, parameters, receptive field, IoU, NMS, RNN, attention and more). Answers are computed, never typed by hand.
- **70 Learn Cards** (hook → visual → formula → worked example → memory hook → exam trap → check question), plus a cheat sheet per topic, a formula sheet, a glossary and a coverage map.
- **Game layer**: XP, levels and ranks (Novice Node → Exam Legend), streaks with combos at 5 and 10, 3 hearts with a 60-second respawn lesson, per-topic mastery (last 10 answers), a Mistake Graveyard (mistakes come back in a new form until you get them right twice), adaptive difficulty, and a mini report every 10 questions.
- **Draw on anything (iPad + Apple Pencil)**: tap ✏️ to pen, highlight or erase over any Learn Card, question or diagram; ink is saved per page and per question. "Pencil only" (on by default) lets fingers scroll and tap while the Pencil draws. 📝 opens a grid scratch sheet for working out calculations.
- **Modes**: MAP, LEARN, PLAY, CALC, TRAPS, TYPE, SPEED, GRAVEYARD, WEAK, BOSS, MOCK (100 min), HALF (50 min), STATUS and CHEAT.

## Deploy to GitHub Pages (beginner steps)

1. Create a **public** repository on GitHub (or use this one).
2. Upload **every file and folder in this repository** to the repository root: `index.html`, `app.js`, `styles.css`, `sw.js`, `sw-assets.js`, `manifest.webmanifest`, `.nojekyll`, and the `js/`, `data/`, `icons/` folders. (`content/`, `tools/` and `docs/` are only needed to rebuild content; uploading them does no harm.)
3. On GitHub go to **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**. (If you deploy from another branch, pick that branch.)
4. Wait 1–2 minutes. GitHub shows the link: `https://<username>.github.io/<repo>/`.
5. On your iPhone/iPad open that link in **Safari** → tap **Share** → **Add to Home Screen** → **Add**. Open it once while online so the service worker caches everything for offline use.

All paths are relative (`./data/...`), so the app works under the `/<repo>/` sub-path.

## Updating content later

1. Edit the hand-written content in `content/<topic>.mjs` (questions, Learn Cards, cheat sheets, coverage items, glossary, formulas) or the generators in `js/gen-*.js`.
2. Run `node tools/build.mjs` (Node 18+). This rebuilds `data/*.json`, re-audits coverage (`docs/COVERAGE_AUDIT.md`) and writes a new `CACHE_VERSION` into `sw-assets.js`. That version bump makes every installed copy download the new content.
3. Upload the changed files (at least `data/`, `sw-assets.js` and anything you edited).
4. On the phone, open the app online once, then close and reopen it to pick up the new version.

If you edit `data/*.json` by hand instead, bump `self.CACHE_VERSION` in `sw-assets.js` yourself.

## Test checklist

- [ ] Opens from the `github.io` link in Safari and shows the Home world map.
- [ ] **Add to Home Screen** works; the app opens full screen (no Safari bars) with the AI Quest icon.
- [ ] **Offline**: open once online, switch to Airplane Mode, reopen. Home, Learn and Practice still work.
- [ ] **Progress survives**: answer a few questions, fully close the app, reopen. XP, streak and mastery remain.
- [ ] **Export/Import** (Profile → Backup): export a JSON file, reset, import it, and progress returns.
- [ ] Each question type renders and grades: MCQ (single choice), MULTI (select several, all-or-nothing with per-option marks), T/F (with "Why? +1 XP" on traps), BLANK (accepts 0.5 = 1/2 = 50%, warns about rounding), BLANKS (partial score), MATCH (partial score).
- [ ] Losing 3 hearts triggers the 60-second Respawn lesson, then a retry.
- [ ] A 5-answer streak shows the COMBO toast; the next question is marked ×2 XP.
- [ ] Mock: countdown timer, question grid, flags, submit, then a review by topic and by type, slowest questions and a revision plan.
- [ ] Light and dark mode both look right (iOS Settings → Display).

## File tree

```
index.html              App shell (iOS meta tags, manifest link)
app.js                  Game engine, screens, modes, mock exams, storage
styles.css              iOS-style UI, light/dark, safe areas, 44pt targets
sw.js                   Service worker (offline cache)
sw-assets.js            Generated: asset list + CACHE_VERSION
manifest.webmanifest    PWA manifest
.nojekyll               Serve files as-is on GitHub Pages
icons/                  192, 512 and 180 (apple-touch) PNG icons
js/
  gen-core.js           Shared helpers (seeded RNG, maths, option builders)
  gen-search.js         UCS / Greedy / A* / admissibility / consistency + SVG graphs
  gen-ml.js             Decision trees, ML metrics & losses, local search, neural nets
  gen-mdp.js            MDP & RL, CNN calculations, IoU / NMS / YOLO
  gen-seq.js            RNN, Naive Bayes, n-grams, attention, generative AI
  gen-prob.js           Probability, Bayesian networks & enumeration, logic
  generators.js         Registry of all generators
  grade.js              Answer grading for all six question types
data/
  index.json            Worlds + counts
  questions/<topic>.json  Question bank (schema below)
  learn/<topic>.json    Learn Cards + cheat sheet
  coverage.json         Coverage map (every concept, source, question counts)
  glossary.json, formulas.json
content/                Source of the hand-written content (one file per topic + extras)
tools/build.mjs         Builds data/, audits coverage, writes sw-assets.js
docs/COVERAGE_AUDIT.md  Coverage audit report
docs/SOURCE_NOTES.md    Notes on source discrepancies and extras
```

### Question schema

```json
{ "id": "search-astar-012", "topic": "search", "subtopic": "A* evaluation function", "type": "MCQ|MULTI|TF|BLANK|BLANKS|MATCH",
  "difficulty": "Easy|Medium|Hard|Exam+", "isCalculation": true, "targetSeconds": 120, "stem": "…", "visual": "<svg>…",
  "options": ["…"], "answer": "B", "acceptedAnswers": ["…"], "tol": 0.0005, "solutionSteps": ["…"], "whyWrong": {"A": "…"},
  "takeaway": "…", "source": "Lecture 2, slide 48", "tags": ["…"], "cov": ["search-astar"] }
```
Answer formats: MCQ `"B"`; MULTI `["A","C"]`; TF `true`/`false`; BLANK `"0.971"`; BLANKS `["14","1792","64"]`; MATCH `{"1":"C","2":"A"}` (with `left`/`right` lists).
