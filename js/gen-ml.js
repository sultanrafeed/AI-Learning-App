// Generators: decision trees, supervised ML, local search, neural networks.
import { rng, Q, fx, nf, rnd, entropy, gini, sigmoid, numericOptions, textOptions, table, tolFor, log2 } from "./gen-core.js";

const SRC_DT = "Lecture 4 (Decision trees) + 'Step-by-step process of comparing two attributes to split'";
const pc = (c) => `[${c[0]}+, ${c[1]}−]`;
function entSteps(c, name = "S") {
  const n = c[0] + c[1];
  const parts = c.map((x) => (x === 0 ? `0 (pure part: 0·log₂0 = 0)` : `−(${x}/${n})·log₂(${x}/${n}) = ${fx(-(x / n) * log2(x / n), 4)}`));
  return `H(${name} ${pc(c)}) = ${parts.join(" + ")} = <b>${fx(entropy(c), 4)}</b>`;
}
function giniSteps(c, name = "S") {
  const n = c.reduce((a, b) => a + b, 0);
  return `Gini(${name}) = 1 − ${c.map((x) => `(${x}/${n})²`).join(" − ")} = <b>${fx(gini(c), 4)}</b>`;
}
function splitCounts(R, p, n, k) {
  for (let tries = 0; tries < 50; tries++) {
    const cuts = (tot) => { const a = Array(k).fill(0); for (let i = 0; i < tot; i++) a[R.int(0, k - 1)]++; return a; };
    const P = cuts(p), N = cuts(n);
    if (P.every((x, i) => x + N[i] > 0)) return P.map((x, i) => [x, N[i]]);
  }
  return Array.from({ length: k }, (_, i) => [i === 0 ? p : 0, i === 0 ? n : 0]);
}
function treeSVG(attr, parent, branches, names) {
  const W = 360, H = 150; const n = branches.length;
  let s = `<svg viewBox="0 0 ${W} ${H}" class="tsvg"><rect x="${W / 2 - 70}" y="6" width="140" height="34" rx="8" class="tn root"/><text x="${W / 2}" y="22" class="tt">${attr}?</text><text x="${W / 2}" y="35" class="ts">${pc(parent)}</text>`;
  branches.forEach((b, i) => {
    const x = (W / (n + 1)) * (i + 1);
    s += `<line x1="${W / 2}" y1="40" x2="${x}" y2="100" class="te"/><text x="${(W / 2 + x) / 2 + (x < W / 2 ? -14 : 14)}" y="74" class="tlab">${names[i]}</text>`;
    s += `<rect x="${x - 42}" y="100" width="84" height="34" rx="8" class="tn"/><text x="${x}" y="121" class="ts">${pc(b)}</text>`;
  });
  return s + "</svg>";
}
const VALS = [["Sunny", "Overcast", "Rain"], ["Low", "Medium", "High"], ["Yes", "No"], ["Some", "Full", "None"], ["Red", "Green", "Blue"], ["Small", "Large"]];
const ATTRS = ["Outlook", "Income", "Student", "Patrons", "Colour", "Size", "Hungry", "Price"];

export function treeQuestion(seed, kind) {
  const R = rng(seed); const id = `trees-${kind}-${seed}`;
  const base = { topic: "trees", calc: true, src: SRC_DT };
  const p = R.int(3, 9), n = R.int(3, 9);
  if (kind === "entropy") {
    const c = [p, n]; const H = entropy(c); const dp = R.pick([3, 4]);
    const o = numericOptions(R, H, [[1 - Math.abs(p - n) / (p + n), "Not a valid shortcut; entropy uses −Σ p log₂ p."], [-(p / (p + n)) * Math.log(p / (p + n)) - (n / (p + n)) * Math.log(n / (p + n)), "Used natural log (ln). Entropy here is in bits: use log₂."], [gini(c), "That is the Gini index, not entropy."]], dp);
    const asMCQ = R.chance(0.5);
    return Q({ ...base, id, sub: "Entropy", type: asMCQ ? "MCQ" : "BLANK", diff: "Easy", ...(asMCQ ? o : { answer: fx(H, dp), tol: tolFor(dp), format: `${dp} decimal places` }),
      stem: `A node has <b>${p} positive</b> and <b>${n} negative</b> examples. What is its entropy H(S) in bits${asMCQ ? "" : ` (${dp} decimal places)`}?`,
      steps: [`p(+) = ${p}/${p + n}, p(−) = ${n}/${p + n}.`, entSteps(c)], take: "Entropy: 0 for a pure node, 1 bit at 50/50 (binary).", tags: ["entropy"], cov: ["trees-entropy"] });
  }
  if (kind === "gini") {
    const k = R.chance(0.3) ? 3 : 2; const c = k === 3 ? [p, n, R.int(1, 6)] : [p, n]; const G = gini(c);
    const o = numericOptions(R, G, [[entropy(c), "That is entropy, not Gini."], [1 - c.reduce((s, x) => s + x / c.reduce((a, b) => a + b, 0), 0) ** 2, "You squared the sum instead of summing the squares."], [c.reduce((s, x) => s + (x / c.reduce((a, b) => a + b, 0)) ** 2, 0), "Forgot the '1 −'."]], 4);
    return Q({ ...base, id, sub: "Gini index", type: "MCQ", diff: "Easy", ...o,
      stem: `A node contains class counts ${c.join(", ")}. What is its Gini index?`, steps: [giniSteps(c)],
      take: "Gini = 1 − Σ pᵢ². Pure node = 0; binary maximum = 0.5.", tags: ["gini"], cov: ["trees-gini"] });
  }
  const k = R.chance(0.5) ? 2 : 3;
  const vi = R.int(0, VALS.length - 1); const names = VALS[vi].length >= k ? VALS[vi].slice(0, k) : ["v1", "v2", "v3"].slice(0, k);
  const attr = R.pick(ATTRS);
  const br = splitCounts(R, p, n, k); const N = p + n; const Hp = entropy([p, n]);
  const wH = br.reduce((s, b) => s + ((b[0] + b[1]) / N) * entropy(b), 0); const IG = Hp - wH;
  const wG = br.reduce((s, b) => s + ((b[0] + b[1]) / N) * gini(b), 0); const GR = gini([p, n]) - wG;
  const vis = treeSVG(attr, [p, n], br, names);
  const igSteps = [entSteps([p, n], "parent"), ...br.map((b, i) => entSteps(b, names[i])),
    `Weighted child entropy = ${br.map((b) => `(${b[0] + b[1]}/${N})·${fx(entropy(b), 4)}`).join(" + ")} = ${fx(wH, 4)}`,
    `IG(${attr}) = ${fx(Hp, 4)} − ${fx(wH, 4)} = <b>${fx(IG, 4)}</b>`];
  if (kind === "ig") {
    const unweighted = Hp - br.reduce((s, b) => s + entropy(b), 0) / k;
    const asMCQ = R.chance(0.5);
    const o = numericOptions(R, IG, [[unweighted, "Took a plain average of child entropies; you must weight by |Sᵥ|/|S|."], [wH, "That is the weighted child entropy; IG = H(parent) − weighted child entropy."], [GR, "That is the Gini reduction, not information gain."], [IG * Math.LN2, "Mixed log bases."]], 3);
    return Q({ ...base, id, sub: "Information gain", type: asMCQ ? "MCQ" : "BLANK", diff: "Medium", visual: vis, ...(asMCQ ? o : { answer: fx(IG, 3), tol: 0.0015, format: "3 decimal places" }),
      stem: `Splitting a node ${pc([p, n])} on <b>${attr}</b> gives the branches shown. What is the information gain${asMCQ ? "" : " (3 decimal places)"}?`,
      steps: igSteps, take: "IG = H(parent) − Σ (|Sᵥ|/|S|)·H(Sᵥ). Always weight by branch size.", tags: ["information-gain"], cov: ["trees-ig"] });
  }
  if (kind === "gini-red") {
    return Q({ ...base, id, sub: "Weighted Gini and Gini reduction", type: "BLANKS", diff: "Medium", visual: vis,
      stem: `For the split of ${pc([p, n])} on <b>${attr}</b> shown, give (1) Gini(parent), (2) the weighted child Gini after the split, (3) the Gini reduction. Use 4 decimal places.`,
      blanks: ["Gini(parent)", "Weighted child Gini", "Gini reduction"], answer: [fx(gini([p, n]), 4), fx(wG, 4), fx(GR, 4)], tol: 0.00051,
      steps: [giniSteps([p, n], "parent"), ...br.map((b, i) => giniSteps(b, names[i])), `Weighted child Gini = ${br.map((b) => `(${b[0] + b[1]}/${N})·${fx(gini(b), 4)}`).join(" + ")} = ${fx(wG, 4)}`, `Gini reduction = ${fx(gini([p, n]), 4)} − ${fx(wG, 4)} = <b>${fx(GR, 4)}</b>`],
      take: "Choose the split with the LOWEST weighted Gini (= highest Gini reduction).", tags: ["gini", "gini-reduction"], cov: ["trees-gini"] });
  }
  if (kind === "compare") {
    const k2 = k === 2 ? 3 : 2; const br2 = splitCounts(R, p, n, k2);
    const names2 = ["a", "b", "c"].slice(0, k2); const attr2 = ATTRS.filter((a) => a !== attr)[R.int(0, ATTRS.length - 2)];
    const wH2 = br2.reduce((s, b) => s + ((b[0] + b[1]) / N) * entropy(b), 0); const IG2 = Hp - wH2;
    const wG2 = br2.reduce((s, b) => s + ((b[0] + b[1]) / N) * gini(b), 0);
    if (Math.abs(IG - IG2) < 0.002) return treeQuestion(seed + 7919, kind);
    const bestIG = IG > IG2 ? attr : attr2; const bestG = wG < wG2 ? attr : attr2;
    const vis2 = vis + treeSVG(attr2, [p, n], br2, names2);
    return Q({ ...base, id, sub: "Compare two attributes", type: "BLANKS", diff: "Exam+", visual: vis2,
      stem: `Two candidate splits of ${pc([p, n])} are shown: <b>${attr}</b> and <b>${attr2}</b>. Give IG(${attr}), IG(${attr2}) (3 dp) and the attribute chosen by information gain (one word).`,
      blanks: [`IG(${attr})`, `IG(${attr2})`, "Chosen attribute"], answer: [fx(IG, 3), fx(IG2, 3), bestIG], tol: 0.0015,
      steps: [...igSteps, ...br2.map((b, i) => entSteps(b, attr2 + "=" + names2[i])), `Weighted child entropy (${attr2}) = ${fx(wH2, 4)} → IG(${attr2}) = ${fx(Hp, 4)} − ${fx(wH2, 4)} = ${fx(IG2, 4)}`,
        `Highest IG → split on <b>${bestIG}</b>.`, `Gini check: weighted Gini ${attr} = ${fx(wG, 4)}, ${attr2} = ${fx(wG2, 4)} → Gini prefers ${bestG}${bestG === bestIG ? " (same choice)" : " (Gini and IG can disagree!)"}.`],
      take: "IG: pick the highest. Weighted Gini: pick the lowest.", tags: ["compare-split"], cov: ["trees-compare"] });
  }
  throw new Error(kind);
}
export const TREE_KINDS = ["entropy", "gini", "ig", "gini-red", "compare"];

// ---------------- Supervised ML ----------------
const SRC_ML = "Lecture 4 (Supervised learning: metrics, regression, gradient descent, KNN, SVM)";
export function mlQuestion(seed, kind) {
  const R = rng(seed); const id = `ml-${kind}-${seed}`; const base = { topic: "ml", calc: true, src: SRC_ML };
  const n = R.int(3, 5);
  const ys = Array.from({ length: n }, () => R.int(1, 12)); const yh = ys.map((y) => y + R.pick([-3, -2, -1, 0, 1, 2, 3]));
  const err = ys.map((y, i) => y - yh[i]);
  const mse = err.reduce((s, e) => s + e * e, 0) / n, mae = err.reduce((s, e) => s + Math.abs(e), 0) / n;
  const tbl = table(["i", "y (actual)", "ŷ (predicted)", "y − ŷ"], ys.map((y, i) => [i + 1, y, yh[i], err[i]]));
  if (kind === "mse" || kind === "mae" || kind === "rmse") {
    const val = kind === "mse" ? mse : kind === "mae" ? mae : Math.sqrt(mse);
    const ds = kind === "mse" ? [[err.reduce((s, e) => s + e * e, 0), "Forgot to divide by n."], [mae, "That is MAE."], [err.reduce((s, e) => s + e, 0) ** 2 / n, "Squared the sum instead of summing squares."]]
      : kind === "mae" ? [[Math.abs(err.reduce((s, e) => s + e, 0)) / n, "Signed errors cancel; take |y − ŷ| first."], [mse, "That is MSE."], [err.reduce((s, e) => s + Math.abs(e), 0), "Forgot to divide by n."]]
      : [[mse, "That is MSE; RMSE takes the square root."], [mae, "That is MAE."], [Math.sqrt(err.reduce((s, e) => s + e * e, 0)), "Forgot to divide by n inside the root."]];
    const o = numericOptions(R, val, ds, 3);
    const nm = { mse: "MSE", mae: "MAE", rmse: "RMSE" }[kind];
    return Q({ ...base, id, sub: nm, type: "MCQ", diff: "Easy", visual: tbl, ...o,
      stem: `Compute the <b>${nm}</b> of these predictions.`,
      steps: [`Errors y − ŷ: ${err.join(", ")}.`, kind === "mae" ? `|errors|: ${err.map(Math.abs).join(", ")}; sum = ${err.reduce((s, e) => s + Math.abs(e), 0)}; MAE = sum / ${n} = ${fx(mae, 3)}.` : `Squares: ${err.map((e) => e * e).join(", ")}; sum = ${err.reduce((s, e) => s + e * e, 0)}; MSE = sum / ${n} = ${fx(mse, 3)}.`, ...(kind === "rmse" ? [`RMSE = √${fx(mse, 3)} = ${fx(val, 3)}.`] : [])],
      take: "MSE punishes large errors (squares); MAE treats all errors linearly; RMSE is in the target's units.", tags: [kind, "loss"], cov: ["ml-regression-metrics"] });
  }
  if (kind === "r2") {
    const ybar = ys.reduce((a, b) => a + b, 0) / n; const sst = ys.reduce((s, y) => s + (y - ybar) ** 2, 0);
    if (sst === 0) return mlQuestion(seed + 101, kind);
    const sse = err.reduce((s, e) => s + e * e, 0); const r2 = 1 - sse / sst;
    return Q({ ...base, id, sub: "R² score", type: "BLANK", diff: "Hard", visual: tbl, answer: fx(r2, 3), tol: 0.0015, format: "3 decimal places (can be negative)",
      stem: "Compute R² = 1 − Σ(y − ŷ)² / Σ(y − ȳ)² for these predictions.",
      steps: [`ȳ = ${ys.join("+")} / ${n} = ${fx(ybar, 4)}.`, `Σ(y − ŷ)² = ${sse}.`, `Σ(y − ȳ)² = ${ys.map((y) => `(${y}−${fx(ybar, 3)})²`).join(" + ")} = ${fx(sst, 4)}.`, `R² = 1 − ${sse}/${fx(sst, 4)} = ${fx(r2, 4)}.`],
      take: "R² = 1 is perfect; R² < 0 means worse than always predicting the mean.", tags: ["r2"], cov: ["ml-regression-metrics"] });
  }
  if (kind === "mape") {
    const mape = (100 / n) * ys.reduce((s, y, i) => s + Math.abs((y - yh[i]) / y), 0);
    return Q({ ...base, id, sub: "MAPE", type: "BLANK", diff: "Medium", visual: tbl, answer: fx(mape, 2), tol: 0.006, format: "percentage, 2 decimal places (no % sign)",
      stem: "Compute the MAPE (%) of these predictions.", steps: [`|(y − ŷ)/y|: ${ys.map((y, i) => fx(Math.abs((y - yh[i]) / y), 4)).join(", ")}.`, `MAPE = (100/${n}) × sum = ${fx(mape, 2)}%.`],
      take: "MAPE is scale-independent but breaks when actual values are 0 or near 0.", tags: ["mape"], cov: ["ml-regression-metrics"] });
  }
  if (kind === "bce") {
    const y = R.int(0, 1); const p = R.pick([0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9, 0.95]);
    const L = -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
    const o = numericOptions(R, L, [[-(y * log2(p) + (1 - y) * log2(1 - p)), "Used log₂; the lecture's cross-entropy uses the natural log here."], [-(y * Math.log(1 - p) + (1 - y) * Math.log(p)), "Swapped p and 1 − p."], [(y - p) ** 2, "That is squared error, not cross-entropy."]], 3);
    return Q({ ...base, id, sub: "Binary cross-entropy", type: "MCQ", diff: "Medium", ...o,
      stem: `A logistic regression model outputs p = P(y=1|x) = ${p} for an example whose true label is y = ${y}. Using natural logs, what is the binary cross-entropy loss L = −[y·ln p + (1−y)·ln(1−p)]?`,
      steps: [y === 1 ? `y = 1 → L = −ln p = −ln(${p}) = ${fx(L, 4)}.` : `y = 0 → L = −ln(1 − p) = −ln(${fx(1 - p, 2)}) = ${fx(L, 4)}.`],
      take: "Confident and wrong → huge loss. Confident and right → loss near 0.", tags: ["cross-entropy"], cov: ["ml-logistic"] });
  }
  if (kind === "gd-linear") {
    const w0 = R.int(-3, 3) / 2, w1 = R.int(-4, 4) / 2, a = R.pick([0.1, 0.05, 0.01, 0.2]); const x = R.int(1, 5), y = R.int(-2, 12);
    const h = w1 * x + w0, e = y - h; const nw0 = w0 + a * e, nw1 = w1 + a * e * x;
    return Q({ ...base, id, sub: "Gradient descent (linear regression)", type: "BLANKS", diff: "Medium",
      stem: `Linear regression h<sub>w</sub>(x) = w₁x + w₀ with w₀ = ${w0}, w₁ = ${w1}, learning rate α = ${a}. One training example (x, y) = (${x}, ${y}). Apply the per-example update from the lecture: w₀ ← w₀ + α(y − h(x)), w₁ ← w₁ + α(y − h(x))·x. Give h(x), new w₀ and new w₁ (3 dp).`,
      blanks: ["h(x)", "new w₀", "new w₁"], answer: [fx(h, 3), fx(nw0, 3), fx(nw1, 3)], tol: 0.0015,
      steps: [`h(x) = ${w1}×${x} + ${w0} = ${nf(h)}.`, `Error y − h = ${y} − ${nf(h)} = ${nf(e)}.`, `w₀ ← ${w0} + ${a}×${nf(e)} = ${nf(nw0, 4)}.`, `w₁ ← ${w1} + ${a}×${nf(e)}×${x} = ${nf(nw1, 4)}.`],
      take: "Gradient descent: step AGAINST the gradient; w ← w − α ∂L/∂w (here written as + α·error).", tags: ["gradient-descent"], cov: ["ml-gd"] });
  }
  if (kind === "gd-generic") {
    const w = R.int(-20, 20) / 10, g = R.int(-30, 30) / 10 || 1.5, a = R.pick([0.1, 0.01, 0.5, 0.05]); const nw = w - a * g;
    const o = numericOptions(R, nw, [[w + a * g, "Moved WITH the gradient (gradient ascent). Descent subtracts."], [w - g, "Forgot the learning rate."], [a * g, "That is just the step size, not the new weight."]], 3);
    return Q({ ...base, id, sub: "Gradient descent update", type: "MCQ", diff: "Easy", ...o,
      stem: `A weight w = ${w} has gradient ∂L/∂w = ${g}. With learning rate α = ${a}, what is w after one gradient-descent step?`,
      steps: [`w_new = w − α·∂L/∂w = ${w} − ${a}×(${g}) = ${nf(nw, 4)}.`], take: "Positive gradient → decrease w; negative gradient → increase w.", tags: ["gradient-descent"], cov: ["ml-gd"] });
  }
  if (kind === "logistic") {
    const w = [R.int(-4, 4) / 2, R.int(-4, 4) / 2], b = R.int(-2, 2) / 2, x = [R.int(0, 3), R.int(0, 3)], y = R.int(0, 1), a = R.pick([0.1, 0.5]);
    const z = w[0] * x[0] + w[1] * x[1] + b; const p = sigmoid(z); const g1 = (p - y) * x[0]; const nw1 = w[0] - a * g1;
    return Q({ ...base, id, sub: "Logistic regression step", type: "BLANKS", diff: "Hard",
      stem: `Logistic regression: p = σ(w·x + b) with w = (${w.join(", ")}), b = ${b}, x = (${x.join(", ")}), true y = ${y}, α = ${a}. Using gradient ∂L/∂w₁ = (p − y)·x₁, give z, p (4 dp) and the updated w₁ (4 dp).`,
      blanks: ["z", "p", "new w₁"], answer: [nf(z, 4), fx(p, 4), fx(nw1, 4)], tol: 0.0006,
      steps: [`z = ${w[0]}×${x[0]} + ${w[1]}×${x[1]} + ${b} = ${nf(z)}.`, `p = 1/(1 + e^(−${nf(z)})) = ${fx(p, 4)}.`, `∂L/∂w₁ = (${fx(p, 4)} − ${y})×${x[0]} = ${fx(g1, 4)}.`, `w₁ ← ${w[0]} − ${a}×${fx(g1, 4)} = ${fx(nw1, 4)}.`],
      take: "Logistic regression = linear score passed through a sigmoid; trained with cross-entropy.", tags: ["logistic"], cov: ["ml-logistic"] });
  }
  if (kind === "metrics") {
    const TP = R.int(5, 60), FP = R.int(2, 30), FN = R.int(2, 30), TN = R.int(10, 90);
    const P = TP / (TP + FP), Rc = TP / (TP + FN), F1 = (2 * P * Rc) / (P + Rc), acc = (TP + TN) / (TP + FP + FN + TN), spec = TN / (TN + FP);
    const cm = table(["", "Actual +", "Actual −"], [["Predicted +", `TP = ${TP}`, `FP = ${FP}`], ["Predicted −", `FN = ${FN}`, `TN = ${TN}`]]);
    const which = R.int(0, 2);
    if (which === 0) return Q({ ...base, id, sub: "Precision, recall, F1", type: "BLANKS", diff: "Medium", visual: cm,
      stem: "From the confusion matrix (rows = predicted, columns = actual, as in Lecture 4), give precision, recall and F1 (3 dp).",
      blanks: ["Precision", "Recall", "F1"], answer: [fx(P, 3), fx(Rc, 3), fx(F1, 3)], tol: 0.0015,
      steps: [`Precision = TP/(TP+FP) = ${TP}/${TP + FP} = ${fx(P, 4)}.`, `Recall = TP/(TP+FN) = ${TP}/${TP + FN} = ${fx(Rc, 4)}.`, `F1 = 2PR/(P+R) = 2×${fx(P, 4)}×${fx(Rc, 4)}/(${fx(P, 4)}+${fx(Rc, 4)}) = ${fx(F1, 4)}.`],
      take: "Precision looks along the PREDICTED-positive row; recall looks down the ACTUAL-positive column.", tags: ["precision", "recall", "f1"], cov: ["ml-classification-metrics"] });
    if (which === 1) { const o = numericOptions(R, acc, [[P, "That is precision."], [(TP + TN) / (TP + FP), "Wrong denominator: accuracy divides by ALL examples."], [Rc, "That is recall."]], 3);
      return Q({ ...base, id, sub: "Accuracy", type: "MCQ", diff: "Easy", visual: cm, ...o, stem: "What is the accuracy of this classifier?", steps: [`Accuracy = (TP+TN)/All = (${TP}+${TN})/${TP + FP + FN + TN} = ${fx(acc, 4)}.`], take: "Accuracy can mislead with imbalanced classes.", tags: ["accuracy"], cov: ["ml-classification-metrics"] }); }
    return Q({ ...base, id, sub: "Specificity and balanced accuracy", type: "BLANKS", diff: "Hard", visual: cm, stem: "Give specificity (TNR) and balanced accuracy = (TPR + TNR)/2 (3 dp).",
      blanks: ["Specificity", "Balanced accuracy"], answer: [fx(spec, 3), fx((Rc + spec) / 2, 3)], tol: 0.0015,
      steps: [`Specificity = TN/(TN+FP) = ${TN}/${TN + FP} = ${fx(spec, 4)}.`, `TPR (recall) = ${fx(Rc, 4)}.`, `Balanced accuracy = (${fx(Rc, 4)} + ${fx(spec, 4)})/2 = ${fx((Rc + spec) / 2, 4)}.`], take: "FPR = 1 − specificity is the x-axis of the ROC curve.", tags: ["specificity"], cov: ["ml-classification-metrics"] });
  }
  if (kind === "knn") {
    const q = [R.int(2, 8), R.int(2, 8)]; const labs = ["Red", "Blue"]; const pts = [];
    while (pts.length < 7) { const p = [R.int(0, 10), R.int(0, 10)]; if (!pts.some((o) => o[0] === p[0] && o[1] === p[1]) && !(p[0] === q[0] && p[1] === q[1])) pts.push(p); }
    const data = pts.map((p, i) => ({ id: "P" + (i + 1), x: p, lab: R.pick(labs), val: R.int(100, 400), d: Math.hypot(p[0] - q[0], p[1] - q[1]) }));
    const sorted = data.slice().sort((a, b) => a.d - b.d);
    if (Math.abs(sorted[2].d - sorted[3].d) < 1e-9) return mlQuestion(seed + 13, kind);
    const k3 = sorted.slice(0, 3); const votes = {}; k3.forEach((d) => (votes[d.lab] = (votes[d.lab] || 0) + 1));
    const pred = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
    const reg = R.chance(0.5);
    const tbl2 = table(["Point", "x₁", "x₂", reg ? "Target value" : "Class"], data.map((d) => [d.id, d.x[0], d.x[1], reg ? d.val : d.lab]));
    const steps = [`Euclidean distances to the query (${q.join(", ")}):`, table(["Point", "distance"], sorted.map((d) => [d.id, fx(d.d, 3)])), `3 nearest: ${k3.map((d) => d.id).join(", ")}.`];
    if (reg) { const avg = k3.reduce((s, d) => s + d.val, 0) / 3; return Q({ ...base, id, sub: "KNN regression", type: "BLANK", diff: "Medium", visual: tbl2, answer: fx(avg, 2), tol: 0.006, format: "2 decimal places",
      stem: `KNN regression with k = 3 and Euclidean distance. Predict the target for the query point (${q.join(", ")}).`, steps: [...steps, `Prediction = average of their targets = (${k3.map((d) => d.val).join(" + ")})/3 = ${fx(avg, 2)}.`], take: "KNN regressor: average (or distance-weighted average) of the k nearest targets.", tags: ["knn"], cov: ["ml-knn"] }); }
    const o = textOptions(R, pred, labs.filter((l) => l !== pred).map((l) => [l, "Count the votes among the 3 nearest only."]).concat([["Cannot decide (tie)", "With k = 3 and two classes there is always a majority."], ["The class of the single nearest point only", "That is 1-NN, not 3-NN."]]));
    return Q({ ...base, id, sub: "KNN classification", type: "MCQ", diff: "Medium", visual: tbl2, ...o, stem: `KNN classification with k = 3 and Euclidean distance. What class is predicted for the query (${q.join(", ")})?`,
      steps: [...steps, `Votes: ${JSON.stringify(votes)} → <b>${pred}</b>.`], take: "Scale features before KNN: distances are dominated by large-range features.", tags: ["knn"], cov: ["ml-knn"] });
  }
  if (kind === "svm") {
    const w = [R.pick([0.5, 1, -0.5, 2]), R.pick([0.5, 1, 1.5])], b = R.int(-4, 2); const x = [R.int(-2, 5), R.int(-2, 5)];
    const s = w[0] * x[0] + w[1] * x[1] + b; const norm = Math.hypot(w[0], w[1]); const y = s >= 0 ? 1 : -1;
    return Q({ ...base, id, sub: "SVM decision function and margin", type: "BLANKS", diff: "Hard",
      stem: `A linear SVM has w = (${w.join(", ")}) and b = ${b}. For x = (${x.join(", ")}) give (1) w·x + b, (2) the predicted class sign(w·x + b) as 1 or -1, (3) the margin width 2/‖w‖ (3 dp).`,
      blanks: ["w·x + b", "class", "margin 2/‖w‖"], answer: [nf(s, 3), String(y), fx(2 / norm, 3)], tol: 0.0015, accepted: [[nf(s, 3)], [String(y), y > 0 ? "+1" : "-1"], [fx(2 / norm, 3)]],
      steps: [`w·x + b = ${w[0]}×${x[0]} + ${w[1]}×${x[1]} + ${b} = ${nf(s)}.`, `sign → ${y}.`, `‖w‖ = √(${w[0]}² + ${w[1]}²) = ${fx(norm, 4)}; margin = 2/‖w‖ = ${fx(2 / norm, 4)}.`],
      take: "SVM maximises the margin 2/‖w‖ by minimising ½‖w‖². Support vectors sit on the margin.", tags: ["svm"], cov: ["ml-svm"] });
  }
  throw new Error(kind);
}
export const ML_KINDS = ["mse", "mae", "rmse", "r2", "mape", "bce", "gd-linear", "gd-generic", "logistic", "metrics", "knn", "svm"];

// ---------------- Local search ----------------
const SRC_LS = "Lecture 3 (Local search: hill climbing, simulated annealing, genetic algorithm)";
export function queensCost(state) {
  let c = 0; const n = state.length;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (state[i] === state[j] || Math.abs(state[i] - state[j]) === j - i) c++;
  return c;
}
export function localQuestion(seed, kind) {
  const R = rng(seed); const id = `local-${kind}-${seed}`; const base = { topic: "local", calc: true, src: SRC_LS };
  if (kind === "roulette") {
    const f = [R.int(5, 30), R.int(5, 30), R.int(5, 30), R.int(5, 30)]; const tot = f.reduce((a, b) => a + b, 0);
    const P = f.map((x) => x / tot); const order = [3, 2, 1, 0]; // slide lays out x4, x3, x2, x1
    let cum = 0; const bounds = order.map((i) => { const lo = cum; cum += P[i]; return [i, lo, cum]; });
    const r = rnd(R() * 0.98 + 0.01, 4); const hit = bounds.find(([, lo, hi]) => r >= lo && r < hi) || bounds[3];
    const tb = table(["Individual", "Fitness"], f.map((x, i) => ["x" + (i + 1), x]));
    return Q({ ...base, id, sub: "Roulette-wheel selection", type: "BLANKS", diff: "Medium", visual: tb,
      stem: `Roulette-wheel selection (Lecture 3 layout: segments placed in the order x4, x3, x2, x1 starting at 0). Give (1) P(x1) = f1/Σf (3 dp) and (2) which individual is selected by the random number r = ${r}.`,
      blanks: ["P(x1)", "Selected individual"], answer: [fx(P[0], 3), "x" + (hit[0] + 1)], tol: 0.0015, accepted: [[fx(P[0], 3)], ["x" + (hit[0] + 1), "X" + (hit[0] + 1)]],
      steps: [`Σf = ${f.join(" + ")} = ${tot}.`, `P(x1) = ${f[0]}/${tot} = ${fx(P[0], 4)}.`, ...bounds.map(([i, lo, hi]) => `x${i + 1}: [${fx(lo, 4)}, ${fx(hi, 4)})`), `r = ${r} falls in x${hit[0] + 1}'s segment.`],
      take: "Roulette: P(i) = fᵢ / Σf. Fitter individuals get bigger slices, but anyone with f > 0 can be picked.", tags: ["roulette", "ga"], cov: ["local-ga"] });
  }
  if (kind === "sa") {
    const d = R.int(1, 12), T = R.pick([1, 2, 5, 10, 20, 50]); const p = Math.exp(-d / T); const r = rnd(R(), 3);
    return Q({ ...base, id, sub: "Simulated annealing acceptance", type: "BLANKS", diff: "Medium",
      stem: `Simulated annealing (minimising energy). A neighbour is <b>worse</b> by Δ = ${d} at temperature T = ${T}. Give (1) the acceptance probability p = exp(−Δ/T) (4 dp) and (2) whether the move is accepted if the random number is r = ${r} (accept if r < p): answer Yes or No.`,
      blanks: ["p", "Accepted?"], answer: [fx(p, 4), r < p ? "Yes" : "No"], tol: 0.00051, accepted: [[fx(p, 4)], [r < p ? "Yes" : "No", r < p ? "yes" : "no", r < p ? "Y" : "N"]],
      steps: [`p = e^(−${d}/${T}) = e^(${fx(-d / T, 4)}) = ${fx(p, 4)}.`, `r = ${r} ${r < p ? "<" : "≥"} p → ${r < p ? "accept the worse move" : "reject"}.`],
      take: "High T → p near 1 (explore). Low T → p near 0 (behaves like hill climbing). Better moves are always accepted.", tags: ["simulated-annealing"], cov: ["local-sa"] });
  }
  if (kind === "queens") {
    const n = R.chance(0.6) ? 8 : 4; const s = Array.from({ length: n }, () => R.int(1, n)); const c = queensCost(s);
    const pairs = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (s[i] === s[j] || Math.abs(s[i] - s[j]) === j - i) pairs.push(`(${i + 1},${j + 1}) ${s[i] === s[j] ? "same row" : "diagonal"}`);
    return Q({ ...base, id, sub: `${n}-queens cost`, type: "BLANK", diff: "Hard", answer: String(c), format: "integer",
      stem: `In the ${n}-queens formulation (Lecture 3), state x = (${s.join(", ")}) gives the row of the queen in each column 1..${n}. The cost is the number of pairs of queens attacking each other (same row or same diagonal). What is the cost?`,
      steps: [`Check every pair of columns (i, j): attack if xᵢ = xⱼ or |xᵢ − xⱼ| = j − i.`, pairs.length ? `Attacking pairs: ${pairs.join("; ")}.` : "No attacking pairs.", `Cost = ${c}.`],
      take: `Each 8-queens state has 8×7 = 56 successors (move one queen within its column).`, tags: ["8-queens"], cov: ["local-problem"] });
  }
  if (kind === "tournament") {
    const names = ["A", "B", "C", "D", "E", "F"]; const fit = names.map(() => R.int(5, 95)); const k = 3;
    const ts = [0, 1, 2].map(() => R.shuffle([0, 1, 2, 3, 4, 5]).slice(0, k));
    const win = ts.map((t) => names[t.reduce((b, i) => (fit[i] > fit[b] ? i : b), t[0])]);
    return Q({ ...base, id, sub: "Tournament selection", type: "BLANKS", diff: "Easy", visual: table(["Individual", ...names], [["Fitness", ...fit]]),
      stem: `Tournament selection with k = 3 (higher fitness is better). The three tournaments draw {${ts.map((t) => t.map((i) => names[i]).join(",")).join("}, {")}}. Which individual wins each tournament?`,
      blanks: ["T1", "T2", "T3"], answer: win, steps: ts.map((t, j) => `T${j + 1}: ${t.map((i) => `${names[i]}=${fit[i]}`).join(", ")} → ${win[j]}.`),
      take: "Tournament selection needs no probabilities; larger k = more selection pressure, less diversity.", tags: ["tournament", "ga"], cov: ["local-ga"] });
  }
  if (kind === "hc") {
    const cur = R.int(5, 15); const nb = Array.from({ length: 4 }, () => cur + R.int(-6, 4)); const best = Math.max(...nb);
    const stop = best <= cur; const names = ["N1", "N2", "N3", "N4"];
    const o = textOptions(R, stop ? `Stop and return the current state (value ${cur})` : `Move to ${names[nb.indexOf(best)]} (value ${best})`, [
      [stop ? `Move to ${names[nb.indexOf(best)]} (value ${best})` : `Stop and return the current state (value ${cur})`, stop ? "Hill climbing only moves if the best neighbour is strictly better." : "A better neighbour exists, so it keeps climbing."],
      [`Move to a random neighbour`, "That is stochastic behaviour (like SA), not steepest-ascent hill climbing."],
      [`Move to ${names[nb.indexOf(Math.min(...nb))]} (value ${Math.min(...nb)})`, "That is the worst neighbour (maximising objective)."]]);
    return Q({ ...base, id, sub: "Steepest-ascent hill climbing", type: "MCQ", diff: "Easy", ...o,
      stem: `Hill climbing (maximise VALUE). Current state value = ${cur}. Neighbour values: ${names.map((n2, i) => `${n2} = ${nb[i]}`).join(", ")}. What happens next?`,
      steps: [`Highest-valued neighbour = ${best}.`, `If VALUE(neighbor) ≤ VALUE(current) return current; else move. ${best} ${stop ? "≤" : ">"} ${cur}.`],
      take: "Hill climbing stops at a peak, which may only be a LOCAL maximum.", tags: ["hill-climbing"], cov: ["local-hc"] });
  }
  throw new Error(kind);
}
export const LOCAL_KINDS = ["roulette", "sa", "queens", "tournament", "hc"];

// ---------------- Neural networks ----------------
const SRC_NN = "Workshop 5 (Neural network models: perceptron, backpropagation, LSTM)";
export function nnQuestion(seed, kind) {
  const R = rng(seed); const id = `nn-${kind}-${seed}`; const base = { topic: "nn", calc: true, src: SRC_NN };
  const w = [R.int(-4, 4) / 2, R.int(-4, 4) / 2]; const w0 = R.int(-4, 4) / 2; const x = [R.int(0, 3), R.int(-2, 3)];
  const ws = w0 + w[0] * x[0] + w[1] * x[1];
  if (kind === "perceptron") {
    const out = ws >= 0 ? 1 : 0;
    return Q({ ...base, id, sub: "Perceptron output", type: "BLANKS", diff: "Easy",
      stem: `A perceptron has bias weight w₀ = ${w0} (input x₀ = 1), w₁ = ${w[0]}, w₂ = ${w[1]} and a hard threshold g(ws) = 1 if ws ≥ 0 else 0. For x = (${x.join(", ")}) give the weighted sum ws and the output.`,
      blanks: ["ws", "output"], answer: [nf(ws), String(out)], steps: [`ws = 1×${w0} + ${w[0]}×${x[0]} + ${w[1]}×${x[1]} = ${nf(ws)}.`, `${nf(ws)} ${ws >= 0 ? "≥" : "<"} 0 → output ${out}.`],
      take: "The bias w₀ shifts the threshold. ws = 0 gives output 1 with g(ws ≥ 0) = 1.", tags: ["perceptron"], cov: ["nn-perceptron"] });
  }
  if (kind === "perceptron-learn") {
    const h = ws >= 0 ? 1 : 0; let y = 1 - h; const a = R.pick([0.1, 0.5, 1]);
    const nw = [w0 + a * (y - h) * 1, w[0] + a * (y - h) * x[0], w[1] + a * (y - h) * x[1]];
    return Q({ ...base, id, sub: "Perceptron learning rule", type: "BLANKS", diff: "Medium",
      stem: `Perceptron with w₀ = ${w0}, w₁ = ${w[0]}, w₂ = ${w[1]}, hard threshold (1 if ws ≥ 0). Example x = (${x.join(", ")}) has true label y = ${y}; α = ${a}. Apply wᵢ ← wᵢ + α(y − h)xᵢ (x₀ = 1). Give new w₀, w₁, w₂.`,
      blanks: ["w₀", "w₁", "w₂"], answer: nw.map((v) => nf(v, 3)), tol: 0.0015,
      steps: [`ws = ${nf(ws)} → h = ${h}. Error y − h = ${y - h}.`, `w₀ ← ${w0} + ${a}×${y - h}×1 = ${nf(nw[0], 3)}.`, `w₁ ← ${w[0]} + ${a}×${y - h}×${x[0]} = ${nf(nw[1], 3)}.`, `w₂ ← ${w[1]} + ${a}×${y - h}×${x[1]} = ${nf(nw[2], 3)}.`],
      take: "If the perceptron is already right (y = h), the weights do not change.", tags: ["perceptron-rule"], cov: ["nn-perceptron"] });
  }
  if (kind === "sigmoid") {
    const h = sigmoid(ws); const y = R.int(0, 1); const a = R.pick([0.1, 0.5, 1]); const d = (y - h) * h * (1 - h);
    const nw1 = w[0] + a * d * x[0];
    return Q({ ...base, id, sub: "Sigmoid unit + gradient descent", type: "BLANKS", diff: "Hard",
      stem: `A sigmoid unit h = σ(w₀ + w₁x₁ + w₂x₂) has w₀ = ${w0}, w₁ = ${w[0]}, w₂ = ${w[1]}. For x = (${x.join(", ")}), y = ${y}, α = ${a}, use the Workshop 5 rule wᵢ ← wᵢ + α(y − h)·h(1 − h)·xᵢ. Give h (4 dp) and new w₁ (4 dp).`,
      blanks: ["h", "new w₁"], answer: [fx(h, 4), fx(nw1, 4)], tol: 0.0006,
      steps: [`in = ${nf(ws)}; h = 1/(1 + e^(−${nf(ws)})) = ${fx(h, 4)}.`, `(y − h)·h(1 − h) = (${y} − ${fx(h, 4)})×${fx(h, 4)}×${fx(1 - h, 4)} = ${fx(d, 5)}.`, `w₁ ← ${w[0]} + ${a}×${fx(d, 5)}×${x[0]} = ${fx(nw1, 4)}.`],
      take: "σ′(z) = σ(z)(1 − σ(z)), at most 0.25: one reason gradients vanish in deep sigmoid nets.", tags: ["sigmoid", "gradient-descent"], cov: ["nn-gd"] });
  }
  if (kind === "activations") {
    const z = R.pick([-3, -2, -1.5, -0.5, 0.5, 1, 2, 3]); const leaky = Math.max(0.1 * z, z);
    return Q({ ...base, id, sub: "Activation functions", type: "BLANKS", diff: "Easy",
      stem: `For input z = ${z}, give ReLU(z), Leaky ReLU(z) with α = 0.1 (f = max(αz, z)), the step output (1 if z ≥ 0 else 0), and σ(z) (3 dp).`,
      blanks: ["ReLU", "Leaky ReLU", "Step", "Sigmoid"], answer: [nf(Math.max(0, z)), nf(leaky, 3), String(z >= 0 ? 1 : 0), fx(sigmoid(z), 3)], tol: 0.0015,
      steps: [`ReLU = max(0, ${z}) = ${nf(Math.max(0, z))}.`, `Leaky = max(0.1×${z}, ${z}) = ${nf(leaky, 3)}.`, `Step = ${z >= 0 ? 1 : 0}.`, `σ(${z}) = 1/(1 + e^(${-z})) = ${fx(sigmoid(z), 4)}.`],
      take: "ReLU kills negatives; Leaky ReLU keeps a small slope α for negatives.", tags: ["activation"], cov: ["nn-activation"] });
  }
  if (kind === "backprop") {
    const a3 = rnd(R() * 0.6 + 0.2, 2), a4 = rnd(R() * 0.6 + 0.2, 2), w35 = R.int(-4, 4) / 2 || 0.5, w45 = R.int(-4, 4) / 2 || -0.5, w05 = R.int(-2, 2) / 2; const y = R.int(0, 1);
    const in5 = w35 * a3 + w45 * a4 + w05; const yh = sigmoid(in5); const D5 = 2 * (yh - y) * yh * (1 - yh); const g35 = D5 * a3; const D3 = D5 * w35 * a3 * (1 - a3);
    return Q({ ...base, id, sub: "Backpropagation perceived error", type: "BLANKS", diff: "Exam+",
      stem: `Network of Workshop 5 (inputs 1,2 → sigmoid hidden 3,4 → sigmoid output 5), loss (y − ŷ)². Hidden activations a₃ = ${a3}, a₄ = ${a4}; w₃,₅ = ${w35}, w₄,₅ = ${w45}, w₀,₅ = ${w05}; target y = ${y}. Using Δ₅ = 2(ŷ − y)·g′(in₅) and Δ₃ = Δ₅·w₃,₅·g′(in₃) with g′ = a(1 − a), give ŷ, Δ₅ and ∂L/∂w₃,₅ = Δ₅·a₃ (4 dp each).`,
      blanks: ["ŷ", "Δ₅", "∂L/∂w₃,₅"], answer: [fx(yh, 4), fx(D5, 4), fx(g35, 4)], tol: 0.0006,
      steps: [`in₅ = ${w35}×${a3} + ${w45}×${a4} + ${w05} = ${fx(in5, 4)}; ŷ = σ(in₅) = ${fx(yh, 4)}.`, `Δ₅ = 2(${fx(yh, 4)} − ${y})×${fx(yh, 4)}×(1 − ${fx(yh, 4)}) = ${fx(D5, 4)}.`, `∂L/∂w₃,₅ = Δ₅·a₃ = ${fx(D5, 4)}×${a3} = ${fx(g35, 4)}.`, `(Further back: Δ₃ = Δ₅·w₃,₅·a₃(1−a₃) = ${fx(D3, 4)}, and ∂L/∂w₁,₃ = Δ₃·x₁.)`],
      take: "Gradient for weight wᵢ,ⱼ = (activation coming in, aᵢ) × (perceived error at the receiving unit, Δⱼ).", tags: ["backprop"], cov: ["nn-backprop"] });
  }
  if (kind === "dense-params") {
    const nin = R.pick([3, 4, 10, 64, 128, 784]), nh = R.pick([4, 8, 16, 32, 64]), no = R.pick([1, 2, 3, 10]);
    const p = (nin + 1) * nh + (nh + 1) * no;
    const o = numericOptions(R, p, [[nin * nh + nh * no, "Forgot the bias of each neuron (+1 per unit)."], [(nin + 1) * nh, "Counted only the first layer."], [nin * nh * no, "Weights are added layer by layer, not multiplied."]], 0);
    return Q({ ...base, id, sub: "Parameter count of an MLP", type: "MCQ", diff: "Medium", ...o,
      stem: `A fully connected network has ${nin} inputs, one hidden layer of ${nh} units and ${no} output unit(s); every unit has a bias. How many trainable parameters?`,
      steps: [`Hidden layer: (${nin} + 1)×${nh} = ${(nin + 1) * nh}.`, `Output layer: (${nh} + 1)×${no} = ${(nh + 1) * no}.`, `Total = ${p}.`], take: "Dense layer params = (inputs + 1) × units.", tags: ["parameters"], cov: ["nn-structure"] });
  }
  if (kind === "lstm") {
    const cp = [rnd(R() * 2 - 1, 1), rnd(R() * 2 - 1, 1)], f = [rnd(R(), 1), rnd(R(), 1)], i = [rnd(R(), 1), rnd(R(), 1)], cand = [rnd(R() * 2 - 1, 1), rnd(R() * 2 - 1, 1)];
    const c = cp.map((v, k) => v * f[k] + i[k] * cand[k]);
    return Q({ ...base, id, sub: "LSTM cell-state update", type: "BLANKS", diff: "Hard",
      stem: `LSTM cell update cₜ = cₜ₋₁ ⊙ fₜ + iₜ ⊙ c̃ₜ (⊙ = elementwise). cₜ₋₁ = [${cp}], fₜ = [${f}], iₜ = [${i}], candidate c̃ₜ = tanh(…) = [${cand}]. Give both components of cₜ (2 dp).`,
      blanks: ["cₜ[1]", "cₜ[2]"], answer: c.map((v) => fx(v, 2)), tol: 0.006,
      steps: c.map((v, k) => `cₜ[${k + 1}] = ${cp[k]}×${f[k]} + ${i[k]}×${cand[k]} = ${fx(v, 3)}.`),
      take: "Forget gate f keeps (≈1) or erases (≈0) memory; input gate i adds new info ADDITIVELY, so gradients don't shrink multiplicatively.", tags: ["lstm"], cov: ["nn-lstm"] });
  }
  throw new Error(kind);
}
export const NN_KINDS = ["perceptron", "perceptron-learn", "sigmoid", "activations", "backprop", "dense-params", "lstm"];
