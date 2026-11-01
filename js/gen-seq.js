// Generators: sequence models (RNN, NB sentiment, n-grams), attention, generative AI.
import { rng, Q, fx, nf, rnd, softmax, sigmoid, dot, numericOptions, textOptions, table, vec } from "./gen-core.js";

const SRC_SEQ = "Lecture 8 (Sequence modelling) + Key points about a simple RNN hidden-state update";
export function seqQuestion(seed, kind) {
  const R = rng(seed); const id = `seq-${kind}-${seed}`; const base = { topic: "seq", calc: true, src: SRC_SEQ };
  if (kind === "rnn") {
    const x = R.pick([1, 2, 3, -1, 0.5]), wx = R.pick([0.5, 0.2, 0.4, -0.3, 0.1]), h = rnd(R() * 1.2 - 0.4, 1), wh = R.pick([0.25, 0.5, 0.8, -0.5]), b = R.chance(0.4) ? R.pick([0.1, -0.2, 0.3]) : 0;
    const s = wx * x + wh * h + b; const t = Math.tanh(s);
    const o = numericOptions(R, t, [[s, "That is the pre-activation sum; apply tanh (use the supplied lookup)."], [Math.tanh(wx * x), "Ignored the previous hidden state."], [Math.tanh(wx * h + wh * x + b), "Swapped input and previous state (multiplied by the wrong weights)."]], 3);
    return Q({ ...base, id, sub: "RNN hidden-state update", type: "MCQ", diff: "Medium", ...o,
      stem: `Simple RNN: hₜ = tanh(wₓ·xₜ + wₕ·hₜ₋₁${b ? " + b" : ""}). Current input xₜ = ${x}, input weight wₓ = ${wx}, previous state hₜ₋₁ = ${h}, recurrent weight wₕ = ${wh}${b ? `, bias b = ${b}` : ", no bias"}. Lookup: tanh(${fx(s, 3)}) = ${fx(t, 3)}. What is hₜ?`,
      steps: [`Sum = ${wx}×${x} + ${wh}×${h}${b ? ` + ${b}` : ""} = ${fx(s, 3)}.`, `hₜ = tanh(${fx(s, 3)}) = ${fx(t, 3)} (from the lookup).`],
      take: "The sum before activation is NOT the hidden state. Keep xₜ and hₜ₋₁ (and their weights) distinct.", tags: ["rnn"], cov: ["seq-rnn"] });
  }
  if (kind === "rnn2") {
    const wx = R.pick([0.5, 0.3, 0.8]), wh = R.pick([0.5, -0.4, 0.6]), x1 = R.pick([1, 2, -1]), x2 = R.pick([0, 1, 2]); const h1 = Math.tanh(wx * x1), h2 = Math.tanh(wx * x2 + wh * h1);
    return Q({ ...base, id, sub: "Unrolled RNN (2 steps)", type: "BLANKS", diff: "Hard",
      stem: `Scalar RNN hₜ = tanh(wₓxₜ + wₕhₜ₋₁), h₀ = 0, wₓ = ${wx}, wₕ = ${wh}. Inputs x₁ = ${x1}, x₂ = ${x2}. Give h₁ and h₂ (3 dp; use a calculator for tanh).`,
      blanks: ["h₁", "h₂"], answer: [fx(h1, 3), fx(h2, 3)], tol: 0.0015,
      steps: [`h₁ = tanh(${wx}×${x1} + ${wh}×0) = tanh(${nf(wx * x1)}) = ${fx(h1, 4)}.`, `h₂ = tanh(${wx}×${x2} + ${wh}×${fx(h1, 4)}) = tanh(${fx(wx * x2 + wh * h1, 4)}) = ${fx(h2, 4)}.`],
      take: "The SAME weights are reused at every step; only xₜ and hₜ change.", tags: ["rnn", "unrolled"], cov: ["seq-rnn"] });
  }
  if (kind === "vanish") {
    const f = R.pick([0.5, 0.8, 0.9, 1.1, 1.2, 0.7]), n = R.pick([10, 20, 30, 50]); const v = Math.pow(f, n);
    const ans = f < 1 ? "vanishing" : "exploding";
    return Q({ ...base, id, sub: "Vanishing / exploding gradients", type: "BLANKS", diff: "Medium",
      stem: `A dependency crosses ${n} recurrent steps and the gradient is multiplied by ${f} at each step. Give ${f}^${n} (scientific notation or decimal, 3 significant figures) and the behaviour (vanishing or exploding).`,
      blanks: ["factor", "behaviour"], answer: [Number(v.toPrecision(3)).toString(), ans], tol: Math.abs(v) * 0.01 + 1e-12, accepted: [[v.toPrecision(3), v.toExponential(2)], [ans]],
      steps: [`${f}^${n} = ${v.toPrecision(4)}.`, f < 1 ? "Repeated factors < 1 → gradient shrinks → vanishing. Fix: LSTM/GRU, better activation, initialisation." : "Factors > 1 → gradient grows → exploding. Fix: gradient clipping."],
      take: "Lecture 8 poll: 0.8³⁰ ≈ 0.001 → vanishing → use an LSTM or GRU.", tags: ["vanishing-gradient"], cov: ["seq-gradients"] });
  }
  if (kind === "gate") {
    const c = [rnd(R() * 2 - 1, 1), rnd(R() * 2 - 1, 1), rnd(R() * 2 - 1, 1)], g = [rnd(R(), 1), rnd(R(), 1), rnd(R(), 1)]; const h = c.map((v, i) => v * g[i]);
    return Q({ ...base, id, sub: "Gated recurrent cell", type: "BLANKS", diff: "Easy",
      stem: `A learned gate scales the candidate hidden state element-wise: hₜ = gₜ ⊙ h̃ₜ. Candidate h̃ₜ = ${vec(c)}, gate gₜ = ${vec(g)}. Give hₜ.`,
      blanks: ["h[1]", "h[2]", "h[3]"], answer: h.map((v) => nf(v, 3)), tol: 0.0015,
      steps: h.map((v, i) => `${c[i]} × ${g[i]} = ${nf(v, 3)}`).concat(["(Lecture 8 example: [0.8, 0.5, −0.6] ⊙ [1.0, 0.1, 0.7] = [0.8, 0.05, −0.42].)"]),
      take: "Gate values lie in [0, 1] (sigmoid): 1 lets information through, 0 blocks it.", tags: ["gating", "lstm"], cov: ["seq-gating"] });
  }
  if (kind === "nb") {
    const words = ["heartwarming", "delightful", "slow", "repetitive", "charming", "dull"];
    const cp = words.map(() => R.int(0, 8)), cn = words.map(() => R.int(0, 8)); const Tp = cp.reduce((a, b) => a + b, 0), Tn = cn.reduce((a, b) => a + b, 0); const V = words.length;
    const np = R.int(5, 15), nn = R.int(5, 15); const pp = np / (np + nn), pn = nn / (np + nn);
    const review = R.shuffle([0, 1, 2, 3, 4, 5]).slice(0, R.int(2, 4)).sort();
    const lp = (i) => (cp[i] + 1) / (Tp + V), ln = (i) => (cn[i] + 1) / (Tn + V);
    const Sp = review.reduce((s, i) => s * lp(i), pp), Sn = review.reduce((s, i) => s * ln(i), pn); const post = Sp / (Sp + Sn);
    return Q({ ...base, id, sub: "Naive Bayes sentiment with add-one smoothing", type: "BLANKS", diff: "Exam+",
      visual: table(["word", "count in + reviews", "count in − reviews"], words.map((w, i) => [w, cp[i], cn[i]])),
      stem: `Training data: ${np} positive and ${nn} negative reviews (priors from these counts); vocabulary |V| = ${V}; total word occurrences T₊ = ${Tp}, T₋ = ${Tn}. Using add-one smoothing P(w|c) = (count + 1)/(T_c + |V|), classify a review containing: <b>${review.map((i) => words[i]).join(", ")}</b>. Give P(+|text) (3 dp) and the predicted class (positive/negative).`,
      blanks: ["P(+|text)", "class"], answer: [fx(post, 3), post > 0.5 ? "positive" : "negative"], tol: 0.0015, accepted: [[fx(post, 3)], [post > 0.5 ? "positive" : "negative", post > 0.5 ? "+" : "-", post > 0.5 ? "pos" : "neg"]],
      steps: [`Priors: P(+) = ${np}/${np + nn} = ${fx(pp, 4)}, P(−) = ${fx(pn, 4)}.`, ...review.map((i) => `${words[i]}: P(w|+) = (${cp[i]}+1)/(${Tp}+${V}) = ${fx(lp(i), 4)}; P(w|−) = (${cn[i]}+1)/(${Tn}+${V}) = ${fx(ln(i), 4)}`),
        `S₊ = ${fx(pp, 4)} × ${review.map((i) => fx(lp(i), 4)).join(" × ")} = ${Sp.toExponential(4)}.`, `S₋ = ${fx(pn, 4)} × ${review.map((i) => fx(ln(i), 4)).join(" × ")} = ${Sn.toExponential(4)}.`, `P(+|text) = S₊/(S₊ + S₋) = ${fx(post, 4)} → ${post > 0.5 ? "positive" : "negative"}.`],
      take: "Naive Bayes: P(c|text) ∝ P(c)·Πᵢ P(xᵢ|c). Smoothing stops a zero count wiping out the product.", tags: ["naive-bayes", "smoothing"], cov: ["seq-nb"] });
  }
  if (kind === "smooth") {
    const c = R.int(0, 9), T = R.int(15, 40), V = R.int(5, 12); const p0 = c / T, p1 = (c + 1) / (T + V);
    return Q({ ...base, id, sub: "Add-one smoothing", type: "BLANKS", diff: "Easy",
      stem: `A word appears ${c} times among T = ${T} word occurrences of the positive class; |V| = ${V}. Give P(word|+) without smoothing and with add-one smoothing (3 dp).`,
      blanks: ["unsmoothed", "add-one"], answer: [fx(p0, 3), fx(p1, 3)], tol: 0.0015,
      steps: [`Unsmoothed = ${c}/${T} = ${fx(p0, 4)}.`, `Add-one = (${c}+1)/(${T}+${V}) = ${fx(p1, 4)}. (Lecture 8: heartwarming 6/20 = 0.30 vs 7/26 ≈ 0.27.)`],
      take: "Add-one adds 1 to the numerator and |V| to the denominator.", tags: ["smoothing"], cov: ["seq-nb"] });
  }
  if (kind === "ngram") {
    const nexts = ["Grogu", "villagers", "civilians", "the", "Din"]; const counts = nexts.map(() => R.int(0, 5)); if (counts[0] === 0) counts[0] = 2; const C = counts.reduce((a, b) => a + b, 0);
    const k = R.int(0, 4);
    return Q({ ...base, id, sub: "Trigram probability", type: "BLANK", diff: "Easy", answer: fx(counts[k] / C, 3), tol: 0.0015, accepted: [`${counts[k]}/${C}`], format: "3 decimal places or a fraction",
      visual: table(["next word after 'Mando protects'", "count"], nexts.map((w, i) => [w, counts[i]])),
      stem: `In a training corpus, the history h = "Mando protects" is followed by the words in the table. Using P(w|h) = C(h, w)/C(h), what is P(${nexts[k]} | "Mando protects")?`,
      steps: [`C(h) = ${counts.join(" + ")} = ${C}.`, `P = ${counts[k]}/${C} = ${fx(counts[k] / C, 4)}.`], take: "N-grams only see a fixed short context and treat words as unrelated symbols.", tags: ["n-gram"], cov: ["seq-ngram"] });
  }
  if (kind === "embedding") {
    const V = ["Jedi", "Sith", "droid", "ship", "Luke", "Leia"]; const d = 3; const E = V.map(() => Array.from({ length: d }, () => rnd(R() * 2 - 1, 2))); const k = R.int(0, 5);
    return Q({ ...base, id, sub: "One-hot and embedding lookup", type: "BLANKS", diff: "Easy",
      visual: table(["ID", "token", "e₁", "e₂", "e₃"], V.map((w, i) => [i, w, ...E[i]])),
      stem: `Token IDs are 0–5 as shown, |V| = 6. Give the one-hot vector for "${V[k]}" (6 digits separated by commas) and the result of onehot(${V[k]}) × E (3 values separated by commas).`,
      blanks: ["one-hot", "embedding"], answer: [V.map((_, i) => (i === k ? 1 : 0)).join(","), E[k].join(",")],
      accepted: [[V.map((_, i) => (i === k ? 1 : 0)).join(","), V.map((_, i) => (i === k ? 1 : 0)).join(", ")], [E[k].join(","), E[k].join(", ")]],
      steps: [`ID of ${V[k]} = ${k} → 1 at position ${k}.`, `onehot × E selects row ${k} of E: [${E[k].join(", ")}].`], take: "One-hot vectors are all equally distant; learned embeddings put similar words close together.", tags: ["embedding"], cov: ["seq-encoding"] });
  }
  throw new Error(kind);
}
export const SEQ_KINDS = ["rnn", "rnn2", "vanish", "gate", "nb", "smooth", "ngram", "embedding"];

// ---------------- Attention ----------------
const SRC_ATT = "Lecture 8 (Self-attention) + Key points about Attention";
export function attnQuestion(seed, kind) {
  const R = rng(seed); const id = `attn-${kind}-${seed}`; const base = { topic: "attn", calc: true, src: SRC_ATT };
  const n = R.int(2, 3), d = 2;
  const q = Array.from({ length: d }, () => R.int(-2, 3)); const K = Array.from({ length: n }, () => Array.from({ length: d }, () => R.int(-2, 3)));
  const V = Array.from({ length: n }, () => Array.from({ length: d }, () => R.int(-1, 4)));
  if (kind === "weighted") {
    const w = n === 2 ? R.pick([[0.3, 0.7], [0.6, 0.4], [0.25, 0.75], [0.9, 0.1]]) : R.pick([[0.2, 0.5, 0.3], [0.1, 0.6, 0.3], [0.5, 0.25, 0.25]]);
    const out = [0, 1].map((j) => w.reduce((s, wi, i) => s + wi * V[i][j], 0));
    return Q({ ...base, id, sub: "Weighted value aggregation", type: "BLANKS", diff: "Easy",
      stem: `For one query, the attention weights are [${w.join(", ")}] and the value vectors are ${V.map((v) => vec(v)).join(", ")}. Give the output vector (2 components).`,
      blanks: ["out[1]", "out[2]"], answer: out.map((v) => nf(v, 3)), tol: 0.0015,
      steps: [0, 1].map((j) => `Component ${j + 1}: ${w.map((wi, i) => `${wi}×${V[i][j]}`).join(" + ")} = ${nf(out[j], 3)}`).concat(["(Key points example: [0.3, 0.7] with [2,0],[0,2] → [0.6, 1.4].)"]),
      take: "Output = Σ weightᵢ·valueᵢ, component by component. Don't just pick the biggest-weight value.", tags: ["attention", "weighted-sum"], cov: ["attn-aggregate"] });
  }
  const scores = K.map((k) => dot(q, k)); const scaled = scores.map((s) => s / Math.sqrt(d)); const w = softmax(scaled);
  const out = [0, 1].map((j) => w.reduce((s, wi, i) => s + wi * V[i][j], 0));
  const vis = table(["Key", "kᵢ", "vᵢ", "score q·kᵢ", "scaled /√2", "exp", "weight"], K.map((k, i) => ["k" + (i + 1), vec(k), vec(V[i]), scores[i], fx(scaled[i], 3), fx(Math.exp(scaled[i]), 3), fx(w[i], 3)]));
  if (kind === "scores") {
    return Q({ ...base, id, sub: "Query–key scores", type: "BLANKS", diff: "Easy",
      stem: `Query q = ${vec(q)}. Keys: ${K.map((k, i) => `k${i + 1} = ${vec(k)}`).join(", ")}. Give the raw dot-product scores q·kᵢ.`,
      blanks: K.map((_, i) => `q·k${i + 1}`), answer: scores.map(String),
      steps: K.map((k, i) => `q·k${i + 1} = ${q[0]}×${k[0]} + ${q[1]}×${k[1]} = ${scores[i]}`), take: "More aligned query and key → larger score.", tags: ["attention", "scores"], cov: ["attn-scores"] });
  }
  if (kind === "softmax") {
    const s = Array.from({ length: R.int(2, 4) }, () => rnd(R() * 3 - 0.5, 1)); const ws = softmax(s); const k = R.int(0, s.length - 1);
    const o = numericOptions(R, ws[k], [[s[k] / s.reduce((a, b) => a + b, 0), "Divided raw scores by their sum; softmax exponentiates first."], [Math.exp(s[k]), "Forgot to normalise by Σ exp."], [1 / s.length, "Softmax is not uniform unless all scores are equal."]], 3);
    return Q({ ...base, id, sub: "Softmax weights", type: "MCQ", diff: "Medium", ...o,
      stem: `Scaled scores are [${s.join(", ")}]. What is the softmax weight of score #${k + 1}?`,
      steps: [`exp: ${s.map((x) => fx(Math.exp(x), 4)).join(", ")}; sum = ${fx(s.reduce((a, b) => a + Math.exp(b), 0), 4)}.`, `weight = ${fx(Math.exp(s[k]), 4)}/${fx(s.reduce((a, b) => a + Math.exp(b), 0), 4)} = ${fx(ws[k], 4)}.`],
      take: "softmax(sᵢ) = e^{sᵢ}/Σⱼe^{sⱼ}; weights are positive and sum to 1. (Warm-up: [2, 1, 0.1] → [0.659, 0.242, 0.099].)", tags: ["softmax"], cov: ["attn-softmax"] });
  }
  if (kind === "full") {
    return Q({ ...base, id, sub: "Scaled dot-product attention (full)", type: "BLANKS", diff: "Exam+",
      stem: `Query q = ${vec(q)}; keys ${K.map((k, i) => `k${i + 1} = ${vec(k)}`).join(", ")}; values ${V.map((v, i) => `v${i + 1} = ${vec(v)}`).join(", ")}; d_k = 2. Compute softmax(q·Kᵀ/√d_k)·V. Give the weight on key 1 (3 dp) and the 2 output components (3 dp).`,
      blanks: ["weight₁", "out[1]", "out[2]"], answer: [fx(w[0], 3), fx(out[0], 3), fx(out[1], 3)], tol: 0.0015,
      steps: [vis, `Output = Σ wᵢvᵢ = [${out.map((x) => fx(x, 4)).join(", ")}].`], take: "Scores → scale by √d_k → row softmax → weighted sum of values.", tags: ["attention"], cov: ["attn-full"] });
  }
  if (kind === "scaled") {
    const dk = R.pick([4, 9, 16, 64]); const s = R.int(2, 24); const v = s / Math.sqrt(dk);
    const o = numericOptions(R, v, [[s / dk, "Divide by √d_k, not d_k."], [s * Math.sqrt(dk), "Divide, don't multiply."], [s, "Forgot the scaling."]], 3);
    return Q({ ...base, id, sub: "Scaling by √d_k", type: "MCQ", diff: "Easy", ...o, stem: `A raw dot-product score is ${s} with key dimension d_k = ${dk}. What is the scaled score used in scaled dot-product attention?`,
      steps: [`${s}/√${dk} = ${s}/${nf(Math.sqrt(dk))} = ${fx(v, 3)}.`], take: "Scaling keeps large-dimension dot products from saturating the softmax.", tags: ["scaling"], cov: ["attn-scores"] });
  }
  if (kind === "shapes") {
    const T = R.pick([5, 8, 10, 12]), dm = R.pick([4, 16, 64, 512]), dk = R.pick([3, 8, 64]), h = R.pick([2, 4, 8]);
    return Q({ ...base, id, sub: "Q/K/V and score-matrix shapes", type: "BLANKS", diff: "Medium",
      stem: `X has ${T} tokens of dimension ${dm} (X is ${T}×${dm}); W_Q, W_K, W_V are ${dm}×${dk}. With ${h} heads concatenated, give: the shape of Q, the shape of S = QKᵀ/√d_k, and the width of Concat(head₁…head_${h}) before W^O.`,
      blanks: ["Q shape", "S shape", "concat width"], answer: [`${T}x${dk}`, `${T}x${T}`, String(h * dk)], accepted: [[`${T}x${dk}`, `${T}×${dk}`, `${T} x ${dk}`], [`${T}x${T}`, `${T}×${T}`, `${T} x ${T}`], [String(h * dk)]],
      steps: [`Q = XW_Q: (${T}×${dm})(${dm}×${dk}) = ${T}×${dk}.`, `S = QKᵀ: (${T}×${dk})(${dk}×${T}) = ${T}×${T} (one score per query–key pair; Lecture 8: 8×3 × 3×8 = 8×8).`, `Concat of ${h} heads of width ${dk} = ${h * dk}.`],
      take: "Each ROW of A = row-softmax(S) sums to 1; Z = AV has one row per token.", tags: ["shapes", "multi-head"], cov: ["attn-matrix", "attn-multihead"] });
  }
  if (kind === "posenc") {
    const pos = R.int(0, 6), i = R.pick([0, 1]), dmodel = R.pick([4, 8, 16]); const even = R.chance(0.5);
    const ang = pos / Math.pow(10000, (2 * i) / dmodel); const v = even ? Math.sin(ang) : Math.cos(ang);
    return Q({ ...base, id, sub: "Sinusoidal positional encoding", type: "BLANK", diff: "Hard", answer: fx(v, 4), tol: 0.00051, format: "4 decimal places (radians)",
      stem: `Using PE(pos, 2i) = sin(pos/10000^{2i/d_model}) and PE(pos, 2i+1) = cos(pos/10000^{2i/d_model}) with d_model = ${dmodel}, compute PE(${pos}, ${2 * i + (even ? 0 : 1)}).`,
      steps: [`i = ${i}; exponent 2i/d_model = ${nf((2 * i) / dmodel, 4)}; angle = ${pos}/10000^${nf((2 * i) / dmodel, 4)} = ${fx(ang, 5)}.`, `${even ? "sin" : "cos"}(${fx(ang, 5)}) = ${fx(v, 4)}.`],
      take: "Positional encodings are ADDED to token embeddings so attention knows word order.", tags: ["positional-encoding"], cov: ["attn-position"] });
  }
  throw new Error(kind);
}
export const ATTN_KINDS = ["weighted", "scores", "softmax", "full", "scaled", "shapes", "posenc"];

// ---------------- Generative AI ----------------
const SRC_GEN = "Lecture 9 (Generative AI: autoencoders, VAE, GAN, autoregressive, diffusion)";
export function genaiQuestion(seed, kind) {
  const R = rng(seed); const id = `genai-${kind}-${seed}`; const base = { topic: "genai", calc: true, src: SRC_GEN };
  if (kind === "kl") {
    const k = R.int(1, 2); const mu = Array.from({ length: k }, () => rnd(R() * 2 - 1, 1)), sg = Array.from({ length: k }, () => R.pick([0.5, 1, 2, 0.8]));
    const kl = 0.5 * mu.reduce((s, m, j) => s + m * m + sg[j] ** 2 - 1 - Math.log(sg[j] ** 2), 0);
    return Q({ ...base, id, sub: "VAE KL regulariser", type: "BLANK", diff: "Hard", answer: fx(kl, 3), tol: 0.0015, format: "3 decimal places (natural log)",
      stem: `A VAE encoder outputs μ = ${vec(mu)} and σ = ${vec(sg)}. Compute D_KL(q(z|x) ‖ N(0, I)) = ½ Σⱼ (μⱼ² + σⱼ² − 1 − log σⱼ²) using natural logs.`,
      steps: mu.map((m, j) => `j=${j}: ${m}² + ${sg[j]}² − 1 − ln(${sg[j]}²) = ${fx(m * m + sg[j] ** 2 - 1 - Math.log(sg[j] ** 2), 4)}`).concat([`KL = ½ × sum = ${fx(kl, 4)}.`]),
      take: "KL is 0 only when μ = 0 and σ = 1: it pulls encodings toward the standard normal prior.", tags: ["vae", "kl"], cov: ["genai-vae"] });
  }
  if (kind === "reparam") {
    const mu = rnd(R() * 2 - 1, 1), sg = R.pick([0.5, 1.5, 2, 0.2]), e = rnd(R() * 2 - 1, 2); const z = mu + sg * e;
    const o = numericOptions(R, z, [[mu + sg * sg * e, "Used the variance σ² instead of σ."], [mu * sg + e, "Mixed up the roles of μ and σ."], [sg + mu * e, "z = μ + σ·ε."]], 3);
    return Q({ ...base, id, sub: "Reparameterisation trick", type: "MCQ", diff: "Easy", ...o, stem: `A VAE predicts μ = ${mu}, σ = ${sg}. A draw from N(0, 1) gives ε = ${e}. What sampled latent z does the reparameterisation trick produce?`,
      steps: [`z = μ + σ·ε = ${mu} + ${sg}×${e} = ${fx(z, 3)}.`], take: "Reparameterisation moves randomness into ε so gradients can flow through μ and σ.", tags: ["vae", "reparameterisation"], cov: ["genai-vae"] });
  }
  if (kind === "diffusion") {
    const ab = R.pick([0.81, 0.64, 0.36, 0.25, 0.9, 0.5]), x0 = rnd(R() * 2 - 1, 1), e = rnd(R() * 2 - 1, 1); const xt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * e;
    return Q({ ...base, id, sub: "Forward noising step", type: "BLANK", diff: "Medium", answer: fx(xt, 3), tol: 0.0015, format: "3 decimal places",
      stem: `Diffusion forward process: xₜ = √ᾱₜ·x₀ + √(1 − ᾱₜ)·ε. With ᾱₜ = ${ab}, pixel x₀ = ${x0} and noise ε = ${e}, what is xₜ?`,
      steps: [`√${ab} = ${fx(Math.sqrt(ab), 4)}; √${nf(1 - ab)} = ${fx(Math.sqrt(1 - ab), 4)}.`, `xₜ = ${fx(Math.sqrt(ab), 4)}×${x0} + ${fx(Math.sqrt(1 - ab), 4)}×${e} = ${fx(xt, 4)}.`],
      take: "Small ᾱ (late step) → mostly noise. The network is trained to predict ε with MSE ‖ε̂ − ε‖².", tags: ["diffusion"], cov: ["genai-diffusion"] });
  }
  if (kind === "gan") {
    const dx = R.pick([0.9, 0.8, 0.6, 0.5]), dg = R.pick([0.1, 0.2, 0.4, 0.5]); const v = Math.log(dx) + Math.log(1 - dg);
    return Q({ ...base, id, sub: "GAN value function", type: "BLANK", diff: "Medium", answer: fx(v, 3), tol: 0.0015, format: "3 decimal places (natural log)",
      stem: `For one real sample and one fake sample, the discriminator outputs D(x) = ${dx} and D(G(z)) = ${dg}. Evaluate log D(x) + log(1 − D(G(z))) (natural logs). D wants this large; G wants it small.`,
      steps: [`ln(${dx}) = ${fx(Math.log(dx), 4)}; ln(1 − ${dg}) = ln(${nf(1 - dg)}) = ${fx(Math.log(1 - dg), 4)}.`, `Sum = ${fx(v, 4)}.`, "At equilibrium p_G = p_data and D(x) ≈ 0.5 everywhere: value = 2 ln 0.5 ≈ −1.386."],
      take: "min over G, max over D of E[log D(x)] + E[log(1 − D(G(z)))].", tags: ["gan"], cov: ["genai-gan"] });
  }
  if (kind === "fvsbn") {
    const b = rnd(R() * 2 - 1, 1), w = [rnd(R() * 2 - 1, 1), rnd(R() * 2 - 1, 1), rnd(R() * 2 - 1, 1)], x = [R.int(0, 1), R.int(0, 1), R.int(0, 1)]; const z = b + dot(w, x); const p = sigmoid(z);
    return Q({ ...base, id, sub: "FVSBN autoregressive unit", type: "BLANK", diff: "Medium", answer: fx(p, 3), tol: 0.0015, format: "3 decimal places",
      stem: `FVSBN: x̂₄ = P(x₄ = 1 | x₁, x₂, x₃) = σ(b₄ + w₄₁x₁ + w₄₂x₂ + w₄₃x₃). With b₄ = ${b}, w = (${w.join(", ")}) and x₁, x₂, x₃ = ${x.join(", ")}, compute x̂₄.`,
      steps: [`z = ${b} + ${w.map((wi, i) => `${wi}×${x[i]}`).join(" + ")} = ${fx(z, 3)}.`, `σ(${fx(z, 3)}) = ${fx(p, 4)}.`],
      take: "Autoregressive: p(x₁…xₙ) = Π p(xᵢ | x₁…xᵢ₋₁); each unit only sees EARLIER variables.", tags: ["autoregressive"], cov: ["genai-autoregressive"] });
  }
  if (kind === "ae-loss") {
    const n = 3; const x = Array.from({ length: n }, () => rnd(R(), 1)), xh = x.map((v) => rnd(v + (R() - 0.5) * 0.6, 1)); const L = x.reduce((s, v, i) => s + (v - xh[i]) ** 2, 0);
    return Q({ ...base, id, sub: "Autoencoder reconstruction loss", type: "BLANK", diff: "Easy", answer: fx(L, 3), tol: 0.0015, format: "3 decimal places",
      stem: `An autoencoder reconstructs x = ${vec(x)} as x̂ = ${vec(xh)}. Compute L(x, x̂) = ‖x − x̂‖² (sum of squared differences).`,
      steps: [`Differences: ${x.map((v, i) => nf(v - xh[i], 2)).join(", ")}.`, `Squares sum = ${fx(L, 4)}.`], take: "Autoencoder loss uses NO labels: the input is its own target.", tags: ["autoencoder"], cov: ["genai-ae"] });
  }
  throw new Error(kind);
}
export const GENAI_KINDS = ["kl", "reparam", "diffusion", "gan", "fvsbn", "ae-loss"];
