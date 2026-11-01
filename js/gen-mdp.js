// Generators: MDPs and reinforcement learning; CNNs; object detection.
import { rng, Q, fx, nf, rnd, numericOptions, textOptions, table, grid } from "./gen-core.js";

const SRC_MDP = "Workshop 6 (MDP, Bellman equation, value/policy iteration, TD, Q-learning)";
export function mdpQuestion(seed, kind) {
  const R = rng(seed); const id = `mdp-${kind}-${seed}`; const base = { topic: "mdp", calc: true, src: SRC_MDP };
  const g = R.pick([0.9, 0.8, 0.5, 0.95, 1]);
  if (kind === "return") {
    const n = R.int(3, 5); const rs = Array.from({ length: n }, () => R.pick([-1, -0.04, 0, 1, 2, 5, 10, -5])); const G = rs.reduce((s, r, k) => s + Math.pow(g, k) * r, 0);
    const o = numericOptions(R, G, [[rs.reduce((a, b) => a + b, 0), "Ignored the discount (that is the additive reward, γ = 1)."], [rs.reduce((s, r, k) => s + Math.pow(g, k + 1) * r, 0), "Discounted the first reward too; the first reward gets γ⁰ = 1."], [rs.reduce((s, r) => s + g * r, 0), "Used γ for every reward instead of γᵏ."]], 3);
    return Q({ ...base, id, sub: "Discounted return", type: "MCQ", diff: "Easy", ...o,
      stem: `An agent receives rewards R₁, R₂, … = ${rs.join(", ")} (in order). With discount γ = ${g}, what is the discounted return G = R₁ + γR₂ + γ²R₃ + …?`,
      steps: [rs.map((r, k) => `${g}^${k}×${r}`).join(" + ") + ` = ${fx(G, 4)}.`], take: "Discounting: later rewards count less; γ close to 1 = far-sighted.", tags: ["discount", "utility"], cov: ["mdp-utility"] });
  }
  if (kind === "meu") {
    const acts = ["A", "B", "C"].map((a) => { const p = R.pick([0.5, 0.6, 0.7, 0.8, 0.9]); const u1 = R.int(2, 12), u2 = R.int(-10, 4); return { a, p, u1, u2, eu: p * u1 + (1 - p) * u2 }; });
    if (Math.abs(acts[0].eu - acts[1].eu) < 0.05 || Math.abs(acts[2].eu - Math.max(acts[0].eu, acts[1].eu)) < 0.05) return mdpQuestion(seed + 31, kind);
    const best = acts.reduce((b, x) => (x.eu > b.eu ? x : b));
    const bestCase = acts.reduce((b, x) => (x.u1 > b.u1 ? x : b));
    const o = textOptions(R, `Action ${best.a} (EU = ${nf(best.eu, 2)})`, acts.filter((x) => x !== best).map((x) => [`Action ${x.a} (EU = ${nf(x.eu, 2)})`, `EU(${x.a}) = ${nf(x.eu, 2)} is lower.`]).concat([[`Action ${bestCase.a}, because it has the best possible outcome (${bestCase.u1})`, "MEU uses expected utility, not the best case."]]));
    return Q({ ...base, id, sub: "Maximum expected utility", type: "MCQ", diff: "Medium", ...o,
      visual: table(["Action", "P(success)", "U(success)", "U(failure)"], acts.map((x) => [x.a, x.p, x.u1, x.u2])),
      stem: "A rational agent follows the MEU principle. Which action does it choose?",
      steps: acts.map((x) => `EU(${x.a}) = ${x.p}×${x.u1} + ${nf(1 - x.p, 2)}×(${x.u2}) = ${nf(x.eu, 3)}.`).concat([`Choose argmax → ${best.a}.`]),
      take: "MEU: action = argmaxₐ Σ P(s′|a,s)·U(s′). Like Route B (EU 7) beating Route A (EU 6).", tags: ["meu"], cov: ["mdp-meu"] });
  }
  if (kind === "q-value" || kind === "bellman") {
    const mk = () => { const k = R.int(2, 3); let ps = k === 2 ? R.pick([[0.8, 0.2], [0.7, 0.3], [0.9, 0.1], [0.5, 0.5]]) : R.pick([[0.8, 0.1, 0.1], [0.6, 0.2, 0.2], [0.7, 0.2, 0.1]]); return ps.map((p, i) => ({ s: "s" + R.int(1, 9), p, r: R.pick([-1, 0, 0, 1, 2, -0.04, 5]), u: R.int(-5, 20) })); };
    const A = mk(), B = mk(); const q = (L) => L.reduce((s, o) => s + o.p * (o.r + g * o.u), 0); const qa = q(A), qb = q(B);
    const tb = (nm, L) => table(["Action " + nm + ": next state", "P(s′|s,a)", "R(s,a,s′)", "U(s′)"], L.map((o) => [o.s, o.p, o.r, o.u]));
    const stepsFor = (nm, L, v) => `Q(s,${nm}) = ${L.map((o) => `${o.p}×(${o.r} + ${g}×${o.u})`).join(" + ")} = ${fx(v, 4)}.`;
    if (kind === "q-value") {
      const o = numericOptions(R, qa, [[A.reduce((s, x) => s + x.p * x.u, 0) * g, "Left out the immediate rewards R(s,a,s′)."], [A.reduce((s, x) => s + x.r + g * x.u, 0), "Forgot to weight by transition probabilities."], [A.reduce((s, x) => s + x.p * (x.r + x.u), 0), "Forgot the discount γ."]], 3);
      return Q({ ...base, id, sub: "Q-value (one-step Bellman)", type: "MCQ", diff: "Medium", visual: tb("a", A), ...o,
        stem: `With γ = ${g}, compute Q(s, a) = Σₛ′ P(s′|s,a)[R(s,a,s′) + γU(s′)] for the outcomes in the table.`, steps: [stepsFor("a", A, qa)],
        take: "Q(s,a) = expected [reward + discounted value of where you land].", tags: ["q-function", "bellman"], cov: ["mdp-bellman"] });
    }
    const U = Math.max(qa, qb); const best = qa >= qb ? "a" : "b";
    return Q({ ...base, id, sub: "Bellman update and best action", type: "BLANKS", diff: "Hard", visual: tb("a", A) + tb("b", B),
      stem: `State s has two actions a and b (tables). With γ = ${g}, give Q(s,a), Q(s,b), U(s) = maxₐ Q(s,a) (3 dp) and the optimal action (a or b).`,
      blanks: ["Q(s,a)", "Q(s,b)", "U(s)", "best action"], answer: [fx(qa, 3), fx(qb, 3), fx(U, 3), best], tol: 0.0015,
      steps: [stepsFor("a", A, qa), stepsFor("b", B, qb), `U(s) = max(${fx(qa, 3)}, ${fx(qb, 3)}) = ${fx(U, 3)} → π*(s) = argmax = ${best}.`],
      take: "U(s) = maxₐ Q(s,a); π*(s) = argmaxₐ Q(s,a).", tags: ["bellman", "policy"], cov: ["mdp-bellman"] });
  }
  if (kind === "grid") {
    // 4x3 grid action "Up" from a cell: 0.8 intended, 0.1 left, 0.1 right; bump into wall = stay
    const r = -0.04; const g1 = 1; const Uu = rnd(R() * 0.8 + 0.1, 2), Ul = rnd(R() * 0.8 + 0.1, 2), Ur = rnd(R() * 0.8 + 0.1, 2), Us = rnd(R() * 0.8 + 0.1, 2);
    const wall = R.pick(["none", "left", "right"]);
    const uL = wall === "left" ? Us : Ul, uR = wall === "right" ? Us : Ur;
    const q = 0.8 * (r + g1 * Uu) + 0.1 * (r + g1 * uL) + 0.1 * (r + g1 * uR);
    return Q({ ...base, id, sub: "Grid-world Q-value", type: "BLANK", diff: "Exam+", answer: fx(q, 4), tol: 0.00051, format: "4 decimal places",
      visual: grid([["", `U=${Uu}`, ""], [wall === "left" ? "wall" : `U=${Ul}`, `s (U=${Us})`, wall === "right" ? "wall" : `U=${Ur}`]], { hl: [[1, 1]] }),
      stem: `Grid world of Workshop 6: action <b>Up</b> moves up with probability 0.8 and slips left or right with probability 0.1 each; bumping into a wall leaves the agent in s. Every move has reward R = −0.04 and γ = 1. Using the current utilities shown, compute Q(s, Up).`,
      steps: [`Up: 0.8×(−0.04 + ${Uu})`, `Left slip: 0.1×(−0.04 + ${uL})${wall === "left" ? " (wall: stays in s)" : ""}`, `Right slip: 0.1×(−0.04 + ${uR})${wall === "right" ? " (wall: stays in s)" : ""}`, `Q = ${fx(q, 4)}.`],
      take: "Slips go perpendicular to the intended move; bumping a wall means staying put.", tags: ["grid-world", "bellman"], cov: ["mdp-bellman", "mdp-grid"] });
  }
  if (kind === "q-learning") {
    const Q0 = rnd(R() * 4 - 1, 2), a = R.pick([0.1, 0.2, 0.5]), r = R.pick([-1, 0, 1, 2, 5, -0.04]); const qs = [rnd(R() * 5 - 1, 1), rnd(R() * 5 - 1, 1), rnd(R() * 5 - 1, 1)];
    const mx = Math.max(...qs); const target = r + g * mx; const nq = Q0 + a * (target - Q0);
    const o = numericOptions(R, nq, [[Q0 + a * (r + g * (qs.reduce((x, y) => x + y, 0) / 3) - Q0), "Used the average Q(s′,·); Q-learning uses the MAX."], [target, "That is the TD target; you still need Q + α(target − Q)."], [Q0 + a * (r + mx - Q0), "Forgot the discount γ on max Q(s′,a′)."]], 3);
    return Q({ ...base, id, sub: "Q-learning update", type: "MCQ", diff: "Medium", ...o,
      stem: `Q-learning: Q(s,a) = ${Q0}, α = ${a}, γ = ${g}. The agent takes a, receives r = ${r}, lands in s′ where Q(s′,·) = [${qs.join(", ")}]. New Q(s,a) = Q + α[r + γ maxₐ′ Q(s′,a′) − Q]?`,
      steps: [`max Q(s′,·) = ${mx}.`, `TD target = ${r} + ${g}×${mx} = ${fx(target, 4)}.`, `TD error = ${fx(target, 4)} − ${Q0} = ${fx(target - Q0, 4)}.`, `New Q = ${Q0} + ${a}×${fx(target - Q0, 4)} = ${fx(nq, 4)}.`],
      take: "Q-learning is model-free: no P(s′|s,a) needed, just the observed (s, a, r, s′).", tags: ["q-learning"], cov: ["mdp-qlearning"] });
  }
  if (kind === "td") {
    const U = rnd(R() * 1.5 - 0.3, 2), Up = rnd(R() * 1.5 - 0.3, 2), a = R.pick([0.1, 0.2, 0.5]), r = R.pick([-0.04, 0, 1, -1]); const nu = U + a * (r + g * Up - U);
    return Q({ ...base, id, sub: "TD utility update", type: "BLANK", diff: "Medium", answer: fx(nu, 4), tol: 0.00051, format: "4 decimal places",
      stem: `Passive TD learning: Uπ(s) = ${U}, observed transition s → s′ with reward ${r}, Uπ(s′) = ${Up}, α = ${a}, γ = ${g}. Apply Uπ(s) ← Uπ(s) + α[R + γUπ(s′) − Uπ(s)].`,
      steps: [`TD target = ${r} + ${g}×${Up} = ${fx(r + g * Up, 4)}.`, `TD error = ${fx(r + g * Up, 4)} − ${U} = ${fx(r + g * Up - U, 4)}.`, `U(s) = ${U} + ${a}×${fx(r + g * Up - U, 4)} = ${fx(nu, 4)}.`],
      take: "TD adjusts U(s) toward its OBSERVED successor; ADP toward ALL successors weighted by P.", tags: ["td"], cov: ["mdp-td"] });
  }
  if (kind === "reward-to-go") {
    const L = R.int(3, 6); const term = R.pick([1, -1]); const steps = L; const rtg = -0.04 * (steps - 1) + term;
    return Q({ ...base, id, sub: "Direct utility estimation", type: "BLANK", diff: "Medium", answer: fx(rtg, 2), tol: 0.006, format: "2 decimal places",
      stem: `Direct utility estimation, γ = 1, reward −0.04 for each transition into a non-terminal state and ${term > 0 ? "+1" : "−1"} for entering the terminal state. In a trial, state s is followed by ${steps - 1} transitions into non-terminal states and then 1 transition into the terminal state. What is the observed reward-to-go of s?`,
      steps: [`Reward-to-go = (−0.04)×${steps - 1} + (${term}) = ${fx(rtg, 2)}.`, "(Workshop 6 example: U(0,0) = (−0.04)×4 + 1 = 0.84.)"],
      take: "Direct utility estimation averages observed reward-to-go; it learns nothing until the trial ends.", tags: ["direct-utility"], cov: ["mdp-passive"] });
  }
  if (kind === "adp") {
    const n1 = R.int(1, 6), n2 = R.int(1, 6), n3 = R.int(0, 4); const tot = n1 + n2 + n3;
    return Q({ ...base, id, sub: "ADP: learning the transition model", type: "BLANK", diff: "Easy", answer: fx(n1 / tot, 3), tol: 0.0015, accepted: [`${n1}/${tot}`], format: "3 decimal places or a fraction",
      visual: table(["s", "a", "s′", "times"], [["(3,3)", "Right", "(4,3)", n1], ["(3,3)", "Right", "(3,2)", n2], ["(3,3)", "Right", "(2,3)", n3]]),
      stem: "An ADP agent counts observed transitions (table). Estimate P((4,3) | (3,3), Right).",
      steps: [`Right was executed ${tot} times in (3,3).`, `P = ${n1}/${tot} = ${fx(n1 / tot, 3)}.`], take: "ADP: estimate P(s′|s,a) from counts, then solve the (linear, policy-fixed) Bellman equations.", tags: ["adp"], cov: ["mdp-passive"] });
  }
  throw new Error(kind);
}
export const MDP_KINDS = ["return", "meu", "q-value", "bellman", "grid", "q-learning", "td", "reward-to-go", "adp"];

// ---------------- CNN ----------------
const SRC_CNN = "Lecture 7 (Computer vision) + Key points about convolution filters and parameter counts";
export const outSize = (N, P, K, S) => Math.floor((N + 2 * P - K) / S) + 1;
export function conv2d(X, Kr, S = 1) {
  const n = X.length, k = Kr.length, o = Math.floor((n - k) / S) + 1; const Y = [];
  for (let i = 0; i < o; i++) { Y.push([]); for (let j = 0; j < o; j++) { let s = 0; for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) s += X[i * S + a][j * S + b] * Kr[a][b]; Y[i].push(s); } }
  return Y;
}
export function cnnQuestion(seed, kind) {
  const R = rng(seed); const id = `cnn-${kind}-${seed}`; const base = { topic: "cnn", calc: true, src: SRC_CNN };
  if (kind === "outsize") {
    const N = R.pick([5, 7, 28, 32, 64, 128, 224, 227, 13]), K = R.pick([1, 3, 5, 7, 11]), S = R.pick([1, 1, 2, 2, 4]), P = R.pick([0, 0, 1, 2, 3]);
    if (N + 2 * P < K) return cnnQuestion(seed + 1, kind);
    const o = outSize(N, P, K, S);
    const op = numericOptions(R, o, [[(N + 2 * P - K) / S, "Forgot the + 1."], [Math.floor((N - K) / S) + 1, "Forgot the padding (2P)."], [Math.floor((N + P - K) / S) + 1, "Padding is added on both sides: 2P."], [N - K + 1, "Ignored stride/padding."]], 0);
    return Q({ ...base, id, sub: "Conv output size", type: "MCQ", diff: "Easy", ...op,
      stem: `Input ${N}×${N}, kernel ${K}×${K}, stride ${S}, padding ${P}. What is the output width?`,
      steps: [`N_out = ⌊(N + 2P − K)/S⌋ + 1 = ⌊(${N} + ${2 * P} − ${K})/${S}⌋ + 1 = ⌊${nf((N + 2 * P - K) / S, 3)}⌋ + 1 = ${o}.`],
      take: "Output size = ⌊(N + 2P − K)/S⌋ + 1. Floor BEFORE adding 1.", tags: ["output-size"], cov: ["cnn-outsize"] });
  }
  if (kind === "params") {
    const K = R.pick([1, 3, 5, 7]), Cin = R.pick([1, 3, 16, 32, 64]), Cout = R.pick([2, 8, 16, 32, 64, 128]), bias = R.chance(0.8);
    const p = (K * K * Cin + (bias ? 1 : 0)) * Cout;
    const op = numericOptions(R, p, [[K * K * Cout + (bias ? Cout : 0), "Forgot that each filter spans ALL input channels (× Cin)."], [(K * K * Cin) * Cout + (bias ? 1 : 0), "One bias per FILTER, not one in total."], [bias ? K * K * Cin * Cout : (K * K * Cin + 1) * Cout, bias ? "Forgot the biases." : "No bias was specified, so don't add one."]], 0);
    return Q({ ...base, id, sub: "Conv parameter count", type: "MCQ", diff: "Medium", ...op,
      stem: `A convolutional layer applies ${Cout} filters of size ${K}×${K} to an input with ${Cin} channel(s)${bias ? ", one bias per filter" : ", with no bias"}. How many trainable parameters? (Image size does not matter.)`,
      steps: [`Weights per filter = ${K}×${K}×${Cin} = ${K * K * Cin}.`, bias ? `+1 bias → ${K * K * Cin + 1} per filter.` : "No bias.", `× ${Cout} filters = ${p}.`],
      take: "Params = (K·K·C_in + 1)·C_out. Weight sharing: image size never appears.", tags: ["parameters"], cov: ["cnn-params"] });
  }
  if (kind === "layer") {
    const N = R.pick([28, 32, 64, 224]), Cin = R.pick([1, 3]), K = R.pick([3, 5]), S = R.pick([1, 2]), P = R.pick([0, 1, 2]), F = R.pick([8, 16, 32]);
    const o = outSize(N, P, K, S);
    return Q({ ...base, id, sub: "Conv layer: size, params, channels", type: "BLANKS", diff: "Medium",
      stem: `Input ${N}×${N}×${Cin}. Conv layer: ${F} filters, ${K}×${K}, stride ${S}, padding ${P}, one bias per filter. Give output height/width, number of parameters, number of output channels.`,
      blanks: ["output size", "parameters", "channels"], answer: [String(o), String((K * K * Cin + 1) * F), String(F)],
      steps: [`Size = ⌊(${N} + ${2 * P} − ${K})/${S}⌋ + 1 = ${o}.`, `Params = (${K}×${K}×${Cin} + 1)×${F} = ${(K * K * Cin + 1) * F}.`, `Channels = number of filters = ${F}. Output volume ${o}×${o}×${F}.`],
      take: "Output depth = number of filters (e.g. 64×64×3 with 8 filters of 3×3 → 62×62×8).", tags: ["output-size", "parameters"], cov: ["cnn-outsize", "cnn-params"] });
  }
  if (kind === "conv") {
    const n = R.pick([4, 5]); const X = Array.from({ length: n }, () => Array.from({ length: n }, () => R.int(0, 3)));
    const Kr = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => R.int(-1, 1)));
    const S = n === 5 && R.chance(0.4) ? 2 : 1; const Y = conv2d(X, Kr, S);
    const i = R.int(0, Y.length - 1), j = R.int(0, Y.length - 1);
    const terms = []; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) terms.push(`${X[i * S + a][j * S + b]}×${Kr[a][b]}`);
    const hl = []; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) hl.push([i * S + a, j * S + b]);
    const full = R.chance(0.35);
    if (full && Y.length === 2) {
      return Q({ ...base, id, sub: "Convolution (full feature map)", type: "BLANKS", diff: "Hard", visual: grid(X, { caption: "Input" }) + grid(Kr, { caption: "Kernel" }),
        stem: `Convolve the input with the 3×3 kernel (stride ${S}, no padding, no kernel flip, as in Lecture 7). Give the 2×2 output in row order.`,
        blanks: ["out[0,0]", "out[0,1]", "out[1,0]", "out[1,1]"], answer: Y.flat().map(String),
        steps: Y.flat().map((v, idx) => { const a0 = Math.floor(idx / 2), b0 = idx % 2; const t = []; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) t.push(`${X[a0 * S + a][b0 * S + b]}×${Kr[a][b]}`); return `out[${a0},${b0}] = ${t.join(" + ")} = ${v}`; }),
        take: "Slide, multiply element-wise, sum. Output size = (N − K)/S + 1.", tags: ["convolution"], cov: ["cnn-conv"] });
    }
    return Q({ ...base, id, sub: "Convolution operation", type: "BLANK", diff: "Medium", visual: grid(X, { caption: "Input", hl }) + grid(Kr, { caption: "Kernel" }), answer: String(Y[i][j]), format: "integer",
      stem: `Convolve the ${n}×${n} input with the 3×3 kernel (stride ${S}, no padding, no flip). What is output[${i},${j}] (0-indexed; the highlighted window)?`,
      steps: [`Window starts at input row ${i * S}, col ${j * S}.`, `Sum = ${terms.join(" + ")} = ${Y[i][j]}.`, `(Full output is ${Y.length}×${Y.length}.)`],
      take: "Each output value = sum of (window ⊙ kernel), plus bias if given.", tags: ["convolution"], cov: ["cnn-conv"] });
  }
  if (kind === "pool") {
    const X = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => R.int(0, 9))); const avg = R.chance(0.35);
    const Y = [[0, 0], [0, 0]].map((r, i) => r.map((_, j) => { const w = [X[2 * i][2 * j], X[2 * i][2 * j + 1], X[2 * i + 1][2 * j], X[2 * i + 1][2 * j + 1]]; return avg ? w.reduce((a, b) => a + b, 0) / 4 : Math.max(...w); }));
    return Q({ ...base, id, sub: avg ? "Average pooling" : "Max pooling", type: "BLANKS", diff: "Easy", visual: grid(X, { caption: "Input 4×4" }),
      stem: `Apply 2×2 ${avg ? "average" : "max"} pooling with stride 2. Give the 2×2 output in row order.`,
      blanks: ["[0,0]", "[0,1]", "[1,0]", "[1,1]"], answer: Y.flat().map((v) => nf(v, 2)), tol: 0.006,
      steps: Y.flat().map((v, idx) => { const i = Math.floor(idx / 2), j = idx % 2; const w = [X[2 * i][2 * j], X[2 * i][2 * j + 1], X[2 * i + 1][2 * j], X[2 * i + 1][2 * j + 1]]; return `${avg ? "mean" : "max"}(${w.join(", ")}) = ${nf(v, 2)}`; }),
      take: "Pooling has NO learnable parameters and keeps the number of channels; it halves H and W here.", tags: ["pooling"], cov: ["cnn-pool"] });
  }
  if (kind === "pipeline") {
    const N = R.pick([28, 32, 64]); const C1 = R.pick([8, 16]), C2 = R.pick([16, 32]); const s1 = R.pick([1, 2]);
    const h1 = outSize(N, 1, 3, s1), h2 = Math.floor(h1 / 2), h3 = outSize(h2, 1, 3, 1), h4 = Math.floor(h3 / 2); const flat = h4 * h4 * C2;
    const p = (9 * 1 + 1) * C1 + (9 * C1 + 1) * C2 + (flat + 1) * 10;
    return Q({ ...base, id, sub: "Track the tensor shape", type: "BLANKS", diff: "Exam+",
      stem: `Input 1×${N}×${N}. Conv2d(1, ${C1}, 3, stride=${s1}, padding=1) → ReLU → MaxPool2d(2) → Conv2d(${C1}, ${C2}, 3, padding=1) → ReLU → MaxPool2d(2) → Flatten → Linear(·, 10). Give the spatial size after the first pool, the flattened length, and the total number of trainable parameters.`,
      blanks: ["size after pool 1", "flatten length", "total params"], answer: [String(h2), String(flat), String(p)],
      steps: [`Conv1: ⌊(${N} + 2 − 3)/${s1}⌋ + 1 = ${h1} → ${C1}×${h1}×${h1}.`, `Pool: ⌊${h1}/2⌋ = ${h2}.`, `Conv2 (padding 1, stride 1): ${h3}; Pool: ${h4} → ${C2}×${h4}×${h4}.`, `Flatten: ${C2}×${h4}×${h4} = ${flat}.`, `Params: conv1 (9×1+1)×${C1} = ${10 * C1}; conv2 (9×${C1}+1)×${C2} = ${(9 * C1 + 1) * C2}; linear (${flat}+1)×10 = ${(flat + 1) * 10}; total ${p}.`],
      take: "Lab habit from Lecture 7: print x.shape after every block (e.g. 1×28×28 → 16×14×14 → … → 288 → 10).", tags: ["shapes", "parameters"], cov: ["cnn-arch"] });
  }
  if (kind === "rf") {
    const L = R.int(2, 4); const layers = Array.from({ length: L }, () => ({ k: R.pick([3, 3, 5, 2]), s: R.pick([1, 1, 2]) }));
    let rf = 1, jump = 1; const st = [];
    layers.forEach((l, i) => { rf = rf + (l.k - 1) * jump; st.push(`Layer ${i + 1} (k=${l.k}, s=${l.s}): RF = prev + (${l.k} − 1)×${jump} = ${rf}`); jump *= l.s; });
    return Q({ ...base, id, sub: "Receptive field (Extra)", type: "BLANK", diff: "Hard", answer: String(rf), format: "integer",
      stem: `(Extra, not in your slides: Lecture 7 only states that deeper layers have larger receptive fields.) Layers stacked: ${layers.map((l, i) => `L${i + 1}: ${l.k}×${l.k}, stride ${l.s}`).join("; ")}. What is the receptive field (in input pixels, one side) of one unit in the last layer? Use RF_l = RF_(l−1) + (k_l − 1) × (product of earlier strides), RF_0 = 1.`,
      steps: [...st, `Receptive field = ${rf}×${rf}.`], take: "Stacking small kernels grows the receptive field; strides multiply the growth of later layers.", tags: ["receptive-field", "extra"], cov: ["cnn-rf"] });
  }
  if (kind === "fc") {
    const N = R.pick([28, 32, 64, 224]), C = R.pick([1, 3]), U = R.pick([100, 500, 1000]);
    const inp = N * N * C;
    return Q({ ...base, id, sub: "Why not fully connected?", type: "BLANKS", diff: "Easy",
      stem: `An image ${N}×${N}×${C} is flattened and fed to a dense layer of ${U} units (ignore biases). Give the number of inputs and the number of weights.`,
      blanks: ["inputs", "weights"], answer: [String(inp), String(inp * U)],
      steps: [`Inputs = ${N}×${N}×${C} = ${inp}.`, `Weights = ${inp}×${U} = ${inp * U}.`, "(Lecture 7: 224×224×3 = 150,528 inputs; ×1,000 = 150,528,000 weights.)"],
      take: "Dense layers explode parameters and destroy 2D neighbourhoods; convolution fixes both (local connections + shared weights).", tags: ["fully-connected"], cov: ["cnn-why"] });
  }
  throw new Error(kind);
}
export const CNN_KINDS = ["outsize", "params", "layer", "conv", "pool", "pipeline", "rf", "fc"];

// ---------------- Object detection ----------------
const SRC_DET = "Lecture 7 (Object detection) + Key points about IoU and non-max suppression";
export function iou(a, b) {
  const ix = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])), iy = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
  const I = ix * iy, A = (a[2] - a[0]) * (a[3] - a[1]), B = (b[2] - b[0]) * (b[3] - b[1]);
  return { I, A, B, U: A + B - I, v: I / (A + B - I), ix, iy };
}
function boxSVG(boxes, labels) {
  const mx = Math.max(...boxes.flat()) + 1; const sc = 300 / mx;
  let s = `<svg viewBox="-10 -10 ${mx * sc + 20} ${mx * sc + 20}" class="bsvg">`;
  for (let i = 0; i <= mx; i++) s += `<line x1="${i * sc}" y1="0" x2="${i * sc}" y2="${mx * sc}" class="bg"/><line x1="0" y1="${i * sc}" x2="${mx * sc}" y2="${i * sc}" class="bg"/>`;
  const cols = ["#6366f1", "#f97316", "#10b981", "#ec4899", "#eab308"];
  boxes.forEach((b, i) => { s += `<rect x="${b[0] * sc}" y="${(mx - b[3]) * sc}" width="${(b[2] - b[0]) * sc}" height="${(b[3] - b[1]) * sc}" fill="${cols[i % 5]}" fill-opacity="0.18" stroke="${cols[i % 5]}" stroke-width="2"/><text x="${b[0] * sc + 4}" y="${(mx - b[3]) * sc + 14}" class="bl" fill="${cols[i % 5]}">${labels[i]}</text>`; });
  return s + "</svg>";
}
export function detectQuestion(seed, kind) {
  const R = rng(seed); const id = `detect-${kind}-${seed}`; const base = { topic: "detect", calc: true, src: SRC_DET };
  const box = () => { const x1 = R.int(0, 6), y1 = R.int(0, 6); return [x1, y1, x1 + R.int(2, 5), y1 + R.int(2, 5)]; };
  if (kind === "iou" || kind === "iou-mcq") {
    let a, b, r; do { a = box(); b = box(); r = iou(a, b); } while (r.I === 0 && R() < 0.85);
    const vis = boxSVG([a, b], ["A", "B"]);
    if (kind === "iou-mcq") {
      const o = numericOptions(R, r.v, [[r.I / (r.A + r.B), "Union must subtract the intersection: A + B − I."], [r.I / Math.min(r.A, r.B), "Divided by the smaller box, not the union."], [(r.A + r.B - r.I) ? r.I / Math.max(r.A, r.B) : 0, "Divided by the larger box, not the union."]], 3);
      return Q({ ...base, id, sub: "IoU", type: "MCQ", diff: "Easy", visual: vis, ...o, stem: `Box A has corners (${a[0]},${a[1]}) and (${a[2]},${a[3]}); box B has corners (${b[0]},${b[1]}) and (${b[2]},${b[3]}). What is IoU(A, B)?`,
        steps: [`Area A = ${a[2] - a[0]}×${a[3] - a[1]} = ${r.A}; Area B = ${b[2] - b[0]}×${b[3] - b[1]} = ${r.B}.`, `Overlap width = min(${a[2]},${b[2]}) − max(${a[0]},${b[0]}) = ${r.ix}; height = ${r.iy}; I = ${r.I}.`, `Union = ${r.A} + ${r.B} − ${r.I} = ${r.U}.`, `IoU = ${r.I}/${r.U} = ${fx(r.v, 4)}.`],
        take: "IoU = I / (A + B − I). No overlap → IoU = 0; identical boxes → 1.", tags: ["iou"], cov: ["detect-iou"] });
    }
    return Q({ ...base, id, sub: "IoU from corners", type: "BLANKS", diff: "Medium", visual: vis,
      stem: `Box A: (${a[0]},${a[1]})–(${a[2]},${a[3]}); box B: (${b[0]},${b[1]})–(${b[2]},${b[3]}). Give intersection area, union area and IoU (3 dp).`,
      blanks: ["Intersection", "Union", "IoU"], answer: [String(r.I), String(r.U), fx(r.v, 3)], tol: 0.0015,
      steps: [`Areas: A = ${r.A}, B = ${r.B}.`, `Overlap = ${r.ix} × ${r.iy} = ${r.I}.`, `Union = ${r.A} + ${r.B} − ${r.I} = ${r.U}.`, `IoU = ${fx(r.v, 4)}.`], take: "Use the SHARED width and height for the intersection.", tags: ["iou"], cov: ["detect-iou"] });
  }
  if (kind === "nms") {
    const n = R.int(4, 5); const boxes = []; const base0 = box();
    for (let i = 0; i < n; i++) { const jit = () => R.int(-2, 2); if (i < 3) boxes.push([base0[0] + jit(), base0[1] + jit(), base0[2] + jit() + 1, base0[3] + jit() + 1].map((v) => Math.max(0, v))); else boxes.push(box()); }
    boxes.forEach((b) => { if (b[2] <= b[0]) b[2] = b[0] + 2; if (b[3] <= b[1]) b[3] = b[1] + 2; });
    const scores = R.shuffle([0.95, 0.9, 0.82, 0.74, 0.66, 0.58]).slice(0, n); const names = ["B1", "B2", "B3", "B4", "B5"].slice(0, n);
    const thr = R.pick([0.3, 0.4, 0.5]);
    const order = names.map((nm, i) => i).sort((x, y) => scores[y] - scores[x]);
    const kept = []; const removed = new Set(); const st = [`Threshold: suppress if IoU > ${thr} (strictly greater) with a kept box (all boxes same class).`, `Sort by score: ${order.map((i) => `${names[i]}(${scores[i]})`).join(", ")}.`];
    for (const i of order) {
      if (removed.has(i)) continue; kept.push(i); st.push(`Keep ${names[i]}.`);
      for (const j of order) { if (j === i || removed.has(j) || kept.includes(j)) continue; const v = iou(boxes[i], boxes[j]).v; st.push(`  IoU(${names[i]}, ${names[j]}) = ${fx(v, 3)} ${v > thr ? "> thr → suppress " + names[j] : "≤ thr → keep for now"}`); if (v > thr) removed.add(j); }
    }
    const ans = kept.map((i) => names[i]).sort().join(",");
    return Q({ ...base, id, sub: "Non-max suppression", type: "BLANK", diff: "Exam+", visual: boxSVG(boxes, names) + table(["Box", "Corners", "Score"], boxes.map((b, i) => [names[i], `(${b[0]},${b[1]})–(${b[2]},${b[3]})`, scores[i]])),
      answer: ans, accepted: [ans, ans.replace(/,/g, ", "), kept.map((i) => names[i]).join(",")], format: "box names separated by commas (any order)",
      stem: `Apply non-max suppression to these same-class detections with IoU threshold ${thr} (suppress when IoU is strictly greater than ${thr}). Which boxes remain?`,
      steps: st.concat([`Remaining: ${ans}.`]), take: "NMS: keep the top-scoring box, delete its heavy overlaps, repeat. Read whether the rule is > or ≥.", tags: ["nms"], cov: ["detect-nms"] });
  }
  if (kind === "yolo") {
    const S = R.pick([7, 13, 20]), C = R.pick([3, 10, 20, 80]); const per = 5 + C;
    return Q({ ...base, id, sub: "YOLO output tensor", type: "BLANKS", diff: "Medium",
      stem: `A YOLO-style head (Lecture 7) predicts on a ${S}×${S} feature map with one box per location, each with x, y, w, h, objectness and ${C} class scores. Give the number of values per location and the total number of predicted values.`,
      blanks: ["per location", "total"], answer: [String(per), String(S * S * per)],
      steps: [`Per location = 4 box + 1 objectness + ${C} classes = ${per}.`, `Total = ${S}×${S}×${per} = ${S * S * per}. (Lecture 7: 20×20×(5 + C), 400 locations in one pass.)`],
      take: "YOLO runs the CNN once and predicts densely on the shared feature map.", tags: ["yolo"], cov: ["detect-yolo"] });
  }
  if (kind === "crops") {
    const L = R.pick([40, 60, 80, 100]), sc = R.int(2, 4), ar = R.int(2, 4);
    return Q({ ...base, id, sub: "Sliding-window search space", type: "BLANK", diff: "Easy", answer: String(L * L * sc * ar), format: "integer",
      stem: `Naive detection classifies crops at ${L}×${L} locations × ${sc} window scales × ${ar} aspect ratios. How many candidate crops per image?`,
      steps: [`${L}×${L}×${sc}×${ar} = ${L * L * sc * ar}. (Lecture 7: 80×80×3×3 = 57,600.)`], take: "The crop search space explodes, and nearby crops repeat computation: share one feature map instead.", tags: ["sliding-window"], cov: ["detect-naive"] });
  }
  throw new Error(kind);
}
export const DETECT_KINDS = ["iou", "iou-mcq", "nms", "yolo", "crops"];
