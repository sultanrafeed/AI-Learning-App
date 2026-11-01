// Generators: probability & Bayesian networks; propositional logic.
import { rng, Q, fx, nf, rnd, numericOptions, textOptions, table } from "./gen-core.js";

const SRC_BN = "Lecture 11 (Bayesian network & probabilistic reasoning) + Lec11 quiz + class exercises";
export const BURGLARY = { B: 0.001, E: 0.002, A: { tt: 0.95, tf: 0.94, ft: 0.29, ff: 0.001 }, J: { t: 0.9, f: 0.05 }, M: { t: 0.7, f: 0.01 } };
const pr = (p, v) => (v ? p : 1 - p);
export function bnJoint(cpt, b, e, a, j, m) {
  return pr(cpt.B, b) * pr(cpt.E, e) * pr(cpt.A[(b ? "t" : "f") + (e ? "t" : "f")], a) * pr(cpt.J[a ? "t" : "f"], j) * pr(cpt.M[a ? "t" : "f"], m);
}
export function enumerateB(cpt, j, m) {
  const s = (b) => [true, false].reduce((S, e) => S + [true, false].reduce((T, a) => T + bnJoint(cpt, b, e, a, j, m), 0), 0);
  const sb = s(true), snb = s(false); return { sb, snb, p: sb / (sb + snb) };
}
function cptTables(c) {
  return table(["P(B)", "P(E)"], [[c.B, c.E]]) + table(["B", "E", "P(A=true|B,E)"], [["t", "t", c.A.tt], ["t", "f", c.A.tf], ["f", "t", c.A.ft], ["f", "f", c.A.ff]]) + table(["A", "P(J=true|A)", "P(M=true|A)"], [["t", c.J.t, c.M.t], ["f", c.J.f, c.M.f]]);
}
function randCPT(R) {
  return { B: R.pick([0.001, 0.01, 0.02, 0.05, 0.1]), E: R.pick([0.002, 0.01, 0.02, 0.05]), A: { tt: R.pick([0.95, 0.9, 0.98]), tf: R.pick([0.94, 0.9, 0.85]), ft: R.pick([0.29, 0.3, 0.2, 0.4]), ff: R.pick([0.001, 0.01, 0.005]) }, J: { t: R.pick([0.9, 0.8, 0.95]), f: R.pick([0.05, 0.1, 0.02]) }, M: { t: R.pick([0.7, 0.6, 0.8]), f: R.pick([0.01, 0.02, 0.05]) } };
}
const tf = (v, s) => (v ? s : "¬" + s);

export function bayesQuestion(seed, kind) {
  const R = rng(seed); const id = `bayes-${kind}-${seed}`; const base = { topic: "bayes", calc: true, src: SRC_BN };
  if (kind === "experiments") {
    const N = R.pick([5000, 2000, 10000, 8000]), c = R.int(15, 400); const v = (100 * c) / N;
    return Q({ ...base, id, sub: "Probability from experiments", type: "BLANK", diff: "Easy", answer: fx(v, 2), tol: 0.0051, format: "percentage, 2 decimal places",
      stem: `To build a full joint probability table for three binary variables, ${N} experiments were run. The event Val1 = False, Val2 = True, Val3 = True occurred ${c} times. What is its probability, as a % with 2 decimal places? (Lec11 class quiz style.)`,
      steps: [`P(event) = occurrences / total = ${c}/${N} = ${fx(c / N, 5)} = ${fx(v, 2)}%.`], take: "Full joint table: P(eventᵢ) = count(eventᵢ)/N. 3 binary variables → 2³ = 8 rows.", tags: ["full-joint"], cov: ["bayes-joint-table"] });
  }
  if (kind === "cpt-lookup") {
    const c = R.chance(0.5) ? BURGLARY : randCPT(R); const b = R.chance(0.5), e = R.chance(0.5); const key = (b ? "t" : "f") + (e ? "t" : "f"); const v = c.A[key];
    return Q({ ...base, id, sub: "Reading a CPT", type: "BLANK", diff: "Easy", visual: cptTables(c), answer: fx(v, 3), tol: 0.0006, format: "3 decimal places",
      stem: `Using the burglary network's tables, what is the probability of the alarm sounding when there is ${e ? "an earthquake" : "no earthquake"} and ${b ? "a burglary" : "no burglary"}?`,
      steps: [`Look up P(A = true | B = ${b}, E = ${e}) = ${v}.`], take: "Each node stores P(node | its parents). Read the row that matches the parents' values.", tags: ["cpt"], cov: ["bayes-bn"] });
  }
  if (kind === "bn-joint") {
    const c = R.chance(0.5) ? BURGLARY : randCPT(R); const [b, e, a, j, m] = [R.chance(0.3), R.chance(0.3), R.chance(0.6), R.chance(0.6), R.chance(0.5)]; const v = bnJoint(c, b, e, a, j, m);
    const fs = [`P(${tf(b, "b")}) = ${nf(pr(c.B, b), 4)}`, `P(${tf(e, "e")}) = ${nf(pr(c.E, e), 4)}`, `P(${tf(a, "a")}|${tf(b, "b")},${tf(e, "e")}) = ${nf(pr(c.A[(b ? "t" : "f") + (e ? "t" : "f")], a), 4)}`, `P(${tf(j, "j")}|${tf(a, "a")}) = ${nf(pr(c.J[a ? "t" : "f"], j), 4)}`, `P(${tf(m, "m")}|${tf(a, "a")}) = ${nf(pr(c.M[a ? "t" : "f"], m), 4)}`];
    return Q({ ...base, id, sub: "Joint probability from a Bayesian network", type: "BLANK", diff: "Medium", visual: cptTables(c), answer: v.toExponential(3), tol: v * 0.002, format: "scientific notation, e.g. 6.281e-4, or a decimal",
      stem: `Compute P(${[tf(j, "j"), tf(m, "m"), tf(a, "a"), tf(b, "b"), tf(e, "e")].join(", ")}) = P(B)P(E)P(A|B,E)P(J|A)P(M|A).`,
      steps: [...fs, `Product = ${v.toExponential(4)}.`], take: "BN joint = product of each node given its parents. Use 1 − p for 'false' values.", tags: ["bn-joint"], cov: ["bayes-bn-joint"] });
  }
  if (kind === "enumeration") {
    const c = R.chance(0.4) ? BURGLARY : randCPT(R); const j = R.chance(0.7), m = R.chance(0.6); const r = enumerateB(c, j, m);
    const branch = (b) => [true, false].map((e) => `P(${tf(e, "e")})[${[true, false].map((a) => `${nf(pr(c.A[(b ? "t" : "f") + (e ? "t" : "f")], a), 4)}·${nf(pr(c.J[a ? "t" : "f"], j), 3)}·${nf(pr(c.M[a ? "t" : "f"], m), 3)}`).join(" + ")}]`).join(" + ");
    return Q({ ...base, id, sub: "Inference by enumeration", type: "BLANKS", diff: "Exam+", visual: cptTables(c),
      stem: `Compute P(B | ${tf(j, "j")}, ${tf(m, "m")}) by enumeration: s_B = P(b)Σₑ P(e)Σₐ P(a|b,e)P(${tf(j, "j")}|a)P(${tf(m, "m")}|a), likewise s_¬B, then normalise. Give s_B, s_¬B (scientific notation, 4 significant figures) and P(b | evidence) (4 dp).`,
      blanks: ["s_B", "s_¬B", "P(b|evidence)"], answer: [r.sb.toExponential(3), r.snb.toExponential(3), fx(r.p, 4)], tol: [r.sb * 0.003, r.snb * 0.003, 0.0006],
      steps: [`s_B = ${c.B}×{${branch(true)}} = ${r.sb.toExponential(5)}.`, `s_¬B = ${nf(1 - c.B, 4)}×{${branch(false)}} = ${r.snb.toExponential(5)}.`, `P(b|e) = s_B/(s_B + s_¬B) = ${fx(r.p, 4)}.`, "(Lecture 11 with j, m: s_B = 0.00059224, s_¬B = 0.00149186 → 0.2842.)"],
      take: "Enumeration: multiply along each path, add the hidden-variable branches (E, A), then normalise with α.", tags: ["enumeration"], cov: ["bayes-enumeration"] });
  }
  if (kind === "marginal") {
    const vals = Array.from({ length: 8 }, () => R.int(2, 20)); const tot = vals.reduce((a, b) => a + b, 0); const P = vals.map((v) => v / tot);
    const rows = []; let k = 0; for (const x of ["x₁", "x₂"]) for (const y of ["y₁", "y₂"]) for (const z of ["z₁", "z₂"]) { rows.push([x, y, z, fx(P[k], 4)]); k++; }
    const px1 = P.slice(0, 4).reduce((a, b) => a + b, 0); const px1y1 = P[0] + P[1]; const py1 = P[0] + P[1] + P[4] + P[5];
    const cond = R.chance(0.5);
    return Q({ ...base, id, sub: cond ? "Conditional probability from a joint table" : "Marginalisation", type: "BLANK", diff: cond ? "Medium" : "Easy",
      visual: table(["X", "Y", "Z", "P(X,Y,Z)"], rows), answer: fx(cond ? px1y1 / py1 : px1, 3), tol: 0.0015, format: "3 decimal places (use the 4-dp table values)",
      stem: cond ? "Using the full joint table, compute P(X = x₁ | Y = y₁)." : "Using the full joint table, compute P(X = x₁) by summing out Y and Z.",
      steps: cond ? [`P(x₁, y₁) = ${fx(P[0], 4)} + ${fx(P[1], 4)} = ${fx(px1y1, 4)}.`, `P(y₁) = ${[0, 1, 4, 5].map((i) => fx(P[i], 4)).join(" + ")} = ${fx(py1, 4)}.`, `P(x₁|y₁) = ${fx(px1y1, 4)}/${fx(py1, 4)} = ${fx(px1y1 / py1, 4)}.`] : [`Keep rows with X = x₁ and add: ${P.slice(0, 4).map((p) => fx(p, 4)).join(" + ")} = ${fx(px1, 4)}.`, "(Lecture 11 example: 0.06 + 0.09 + 0.14 + 0.11 = 0.40.)"],
      take: "Marginalise = sum out. Condition = (joint of both) / (marginal of the evidence).", tags: ["marginalisation"], cov: ["bayes-marginal"] });
  }
  if (kind === "bayes-rule") {
    const prior = R.pick([0.01, 0.02, 0.05, 0.001, 0.1]), sens = R.pick([0.9, 0.95, 0.99, 0.8]), fpr = R.pick([0.05, 0.1, 0.02, 0.01]);
    const ps = sens * prior + fpr * (1 - prior); const post = (sens * prior) / ps;
    const o = numericOptions(R, post, [[sens, "That is P(S|D), the likelihood; Bayes' rule reverses it."], [sens * prior, "Forgot to divide by the evidence P(S)."], [prior, "That is the prior; the evidence should update it."]], 4);
    return Q({ ...base, id, sub: "Bayes' rule (diagnosis)", type: "MCQ", diff: "Hard", ...o,
      stem: `P(Disease) = ${prior}. A test detects the disease with P(Positive | D) = ${sens} and gives false positives P(Positive | ¬D) = ${fpr}. What is P(D | Positive)?`,
      steps: [`P(Pos) = ${sens}×${prior} + ${fpr}×${nf(1 - prior)} = ${fx(ps, 5)}.`, `P(D|Pos) = P(Pos|D)P(D)/P(Pos) = ${fx(sens * prior, 5)}/${fx(ps, 5)} = ${fx(post, 4)}.`],
      take: "posterior = likelihood × prior ÷ evidence. Diagnostic P(cause|effect) from causal P(effect|cause).", tags: ["bayes-rule"], cov: ["bayes-rule"] });
  }
  if (kind === "naive") {
    const fA = [R.pick([0.2, 0.3, 0.6, 0.7, 0.8]), R.pick([0.1, 0.4, 0.5, 0.9])], fB = [R.pick([0.2, 0.3, 0.5, 0.6]), R.pick([0.3, 0.6, 0.7, 0.2])]; const pc = R.pick([0.4, 0.5, 0.6, 0.3]);
    const sY = pc * fA[0] * fB[0], sN = (1 - pc) * fA[1] * fB[1]; const p = sY / (sY + sN);
    return Q({ ...base, id, sub: "Naive Bayes classification", type: "BLANKS", diff: "Medium",
      visual: table(["", "Class = Yes", "Class = No"], [["Prior", pc, nf(1 - pc)], ["P(Windy = T | class)", fA[0], fA[1]], ["P(Humid = T | class)", fB[0], fB[1]]]),
      stem: "A new day has Windy = T and Humid = T. Using Naive Bayes (features independent given the class), give the unnormalised score for Yes, for No (4 dp) and P(Yes | evidence) (3 dp).",
      blanks: ["score Yes", "score No", "P(Yes|e)"], answer: [fx(sY, 4), fx(sN, 4), fx(p, 3)], tol: [0.00006, 0.00006, 0.0015],
      steps: [`Yes: ${pc}×${fA[0]}×${fB[0]} = ${fx(sY, 5)}.`, `No: ${nf(1 - pc)}×${fA[1]}×${fB[1]} = ${fx(sN, 5)}.`, `Normalise: ${fx(sY, 5)}/(${fx(sY, 5)} + ${fx(sN, 5)}) = ${fx(p, 4)}.`],
      take: "Compare unnormalised scores to classify; normalise only if you need the probability.", tags: ["naive-bayes"], cov: ["bayes-naive"] });
  }
  if (kind === "rows") {
    const n = R.int(3, 20); const v = Math.pow(2, n);
    const o = numericOptions(R, v, [[2 * n, "Rows double with each variable: 2ⁿ, not 2n."], [n * n, "It is exponential, not quadratic."], [Math.pow(2, n - 1), "Off by one in the exponent."]], 0);
    return Q({ ...base, id, sub: "Size of a full joint table", type: "MCQ", diff: "Easy", ...o, stem: `How many rows does the full joint probability table have for ${n} binary random variables?`,
      steps: [`2^${n} = ${v}. (Lecture 11: 5 → 32, 10 → 1,024, 20 → 1,048,576.)`], take: "Full joint tables explode as 2ⁿ: Bayesian networks factorise to stay compact.", tags: ["full-joint"], cov: ["bayes-joint-table"] });
  }
  if (kind === "prob-rules") {
    const t = R.int(0, 3);
    if (t === 0) { const p = rnd(R() * 0.8 + 0.1, 2); return Q({ ...base, id, sub: "Complement rule", type: "BLANK", diff: "Easy", answer: nf(1 - p, 2), tol: 0.0051, stem: `P(rain) = ${p}. What is P(no rain)?`, steps: [`1 − ${p} = ${nf(1 - p, 2)}.`], take: "NOT → 1 − P.", tags: ["probability-rules"], cov: ["bayes-rules"] }); }
    if (t === 1) { const a = R.int(1, 3); return Q({ ...base, id, sub: "Addition rule", type: "BLANK", diff: "Easy", answer: fx(a / 6 + 1 / 6, 3), tol: 0.0015, accepted: [`${a + 1}/6`], stem: `A fair die is rolled. What is the probability of rolling a number ≤ ${a} or a 6 (mutually exclusive)?`, steps: [`${a}/6 + 1/6 = ${a + 1}/6 = ${fx((a + 1) / 6, 3)}.`], take: "OR (mutually exclusive) → add.", tags: ["probability-rules"], cov: ["bayes-rules"] }); }
    if (t === 2) { const s = R.pick([2, 4, 6]); return Q({ ...base, id, sub: "Multiplication rule", type: "BLANK", diff: "Easy", answer: fx(1 / (2 * s), 4), tol: 0.00006, accepted: [`1/${2 * s}`], stem: `A coin is tossed and a fair ${s}-sided die is rolled. P(Head and ${s})?`, steps: [`Independent: 1/2 × 1/${s} = 1/${2 * s}.`], take: "AND (independent) → multiply.", tags: ["probability-rules"], cov: ["bayes-rules"] }); }
    return Q({ ...base, id, sub: "Conditional probability", type: "BLANK", diff: "Easy", answer: fx(4 / 12, 3), tol: 0.0015, accepted: ["1/3"], stem: "A card is known to be a face card (J, Q, K). What is the probability that it is a King?", steps: ["P(King | face) = P(King ∩ face)/P(face) = (4/52)/(12/52) = 4/12 = 1/3."], take: "GIVEN → P(A|B) = P(A ∩ B)/P(B).", tags: ["probability-rules"], cov: ["bayes-rules"] });
  }
  throw new Error(kind);
}
export const BAYES_KINDS = ["experiments", "cpt-lookup", "bn-joint", "enumeration", "marginal", "bayes-rule", "naive", "rows", "prob-rules"];

// ---------------- Propositional logic ----------------
const SRC_LOG = "Lecture 10 (Logical knowledge representation and inference)";
const OPS = {
  and: (a, b) => a && b, or: (a, b) => a || b, imp: (a, b) => !a || b, iff: (a, b) => a === b,
};
const SYM = { and: "∧", or: "∨", imp: "⇒", iff: "⇔" };
function randFormula(R, depth = 2) {
  if (depth === 0 || R.chance(0.25)) { const v = R.pick(["P", "Q", "R"]); return R.chance(0.25) ? { neg: true, v } : { v }; }
  return { op: R.pick(["and", "or", "imp", "iff", "imp"]), l: randFormula(R, depth - 1), r: randFormula(R, depth - 1) };
}
export function evalF(f, m) { if (f.v) return f.neg ? !m[f.v] : m[f.v]; return OPS[f.op](evalF(f.l, m), evalF(f.r, m)); }
export function showF(f, top = true) { if (f.v) return (f.neg ? "¬" : "") + f.v; const s = `${showF(f.l, false)} ${SYM[f.op]} ${showF(f.r, false)}`; return top ? s : `(${s})`; }
const MODELS = []; for (const P of [true, false]) for (const Qv of [true, false]) for (const Rv of [true, false]) MODELS.push({ P, Q: Qv, R: Rv });
const T = (b) => (b ? "T" : "F");

export function logicQuestion(seed, kind) {
  const R = rng(seed); const id = `logic-${kind}-${seed}`; const base = { topic: "logic", calc: true, src: SRC_LOG };
  if (kind === "eval") {
    const f = randFormula(R, 2); const m = R.pick(MODELS); const v = evalF(f, m);
    return Q({ ...base, id, sub: "Evaluate a sentence in a model", type: "TF", diff: "Medium", answer: v,
      stem: `In the model P = ${T(m.P)}, Q = ${T(m.Q)}, R = ${T(m.R)}, the sentence <b>${showF(f)}</b> is true.`,
      why: `It evaluates to ${T(v)}.`, steps: [`Evaluate innermost brackets first, then the main connective. Remember: A ⇒ B is false only when A = T and B = F; A ⇔ B is true when both sides match.`, `Result: ${T(v)}.`],
      take: "Implication with a false premise is vacuously TRUE.", tags: ["semantics"], cov: ["logic-semantics"] });
  }
  if (kind === "entail") {
    let kb, q, kbm, ent; let tries = 0;
    do { kb = [randFormula(R, 1), randFormula(R, 1)]; q = randFormula(R, 1); kbm = MODELS.filter((m) => kb.every((s) => evalF(s, m))); ent = kbm.length > 0 && kbm.every((m) => evalF(q, m)); tries++; } while ((kbm.length === 0 || (tries < 20 && !ent && R.chance(0.5))) && tries < 60);
    const rows = MODELS.map((m) => [T(m.P), T(m.Q), T(m.R), ...kb.map((s) => T(evalF(s, m))), T(kb.every((s) => evalF(s, m))), T(evalF(q, m))]);
    return Q({ ...base, id, sub: "Model checking", type: "BLANKS", diff: "Hard",
      stem: `KB = { ${kb.map((s) => showF(s)).join(" , ")} }. Query γ = <b>${showF(q)}</b>. By model checking over P, Q, R: (1) in how many of the 8 models is KB true? (2) Does KB ⊨ γ? (Yes/No)`,
      blanks: ["# KB-true models", "KB ⊨ γ?"], answer: [String(kbm.length), ent ? "Yes" : "No"], accepted: [[String(kbm.length)], [ent ? "Yes" : "No", ent ? "yes" : "no", ent ? "Y" : "N"]],
      steps: [table(["P", "Q", "R", ...kb.map((s) => showF(s)), "KB", "γ"], rows), `KB is true in ${kbm.length} model(s).`, ent ? "γ is true in every one of them → KB ⊨ γ." : "Some KB-true model makes γ false → KB does not entail γ."],
      take: "KB ⊨ γ iff M(KB) ⊆ M(γ): no model where KB is true and γ is false.", tags: ["model-checking", "entailment"], cov: ["logic-model-checking"] });
  }
  if (kind === "resolve") {
    const lits = ["P", "Q", "R", "S"]; const c = R.pick(lits); const others = R.shuffle(lits.filter((x) => x !== c));
    const a1 = others[0], b1 = others[1]; const n1 = R.chance(0.5), n2 = R.chance(0.5);
    const C1 = `${c} ∨ ${n1 ? "¬" : ""}${a1}`, C2 = `¬${c} ∨ ${n2 ? "¬" : ""}${b1}`; const res = `${n1 ? "¬" : ""}${a1} ∨ ${n2 ? "¬" : ""}${b1}`;
    const o = textOptions(R, res, [[`${c} ∨ ¬${c}`, "Resolution REMOVES the complementary pair, it doesn't keep it."], [`${C1} ∧ ${C2}`, "That's just the conjunction of the inputs."], [`${n1 ? "" : "¬"}${a1} ∨ ${n2 ? "" : "¬"}${b1}`, "Don't negate the remaining literals."], ["□ (empty clause)", "The empty clause only appears when two complementary UNIT clauses resolve."]]);
    return Q({ ...base, id, sub: "Full resolution", type: "MCQ", diff: "Medium", ...o, calc: false,
      stem: `Resolve the clauses (${C1}) and (${C2}). What is the resolvent?`, steps: [`Complementary pair: ${c} and ¬${c}.`, `Keep every other literal: ${res}.`],
      take: "Full resolution: drop the complementary pair, OR together everything that's left.", tags: ["resolution"], cov: ["logic-resolution"] });
  }
  if (kind === "equiv") {
    const cases = [
      ["P ⇒ Q", "¬P ∨ Q", "implication elimination"], ["¬(P ∧ Q)", "¬P ∨ ¬Q", "De Morgan"], ["¬(P ∨ Q)", "¬P ∧ ¬Q", "De Morgan"], ["P ⇒ Q", "¬Q ⇒ ¬P", "contraposition"],
      ["P ⇔ Q", "(P ⇒ Q) ∧ (Q ⇒ P)", "biconditional elimination"], ["P ∧ (Q ∨ R)", "(P ∧ Q) ∨ (P ∧ R)", "distributivity of ∧ over ∨"], ["P ∨ (Q ∧ R)", "(P ∨ Q) ∧ (P ∨ R)", "distributivity of ∨ over ∧"], ["¬(¬P)", "P", "double-negation elimination"],
    ];
    const [a, b, name] = R.pick(cases);
    const wrong = { "implication elimination": [["P ∨ ¬Q", "Negate the PREMISE: P ⇒ Q ≡ ¬P ∨ Q."], ["Q ⇒ P", "That's the converse, not equivalent."], ["¬P ⇒ ¬Q", "That's the inverse, not equivalent."]], "De Morgan": [[a.includes("∧") ? "¬P ∧ ¬Q" : "¬P ∨ ¬Q", "De Morgan flips ∧ ↔ ∨."], ["P ∨ Q", "Negations can't just disappear."], ["¬P ∧ Q", "Every literal must be negated."]] };
    const ws = wrong[name] || [["Q ⇒ P", "The converse is not equivalent."], ["¬P ⇒ ¬Q", "The inverse is not equivalent."], ["P ∧ Q", "Not equivalent: check a truth table."]];
    const o = textOptions(R, b, ws);
    return Q({ ...base, id, sub: "Logical equivalences", type: "MCQ", diff: "Easy", ...o, calc: false, stem: `Which sentence is logically equivalent to <b>${a}</b>?`, steps: [`${a} ≡ ${b} (${name}).`], take: "Learn the equivalence table: it is the toolkit for CNF conversion.", tags: ["equivalence"], cov: ["logic-equivalence"] });
  }
  if (kind === "precedence") {
    const s = R.pick([["¬P ∨ Q ∧ R ⇒ S", "((¬P) ∨ (Q ∧ R)) ⇒ S"], ["P ∧ Q ∨ R", "(P ∧ Q) ∨ R"], ["¬P ∧ Q ⇒ R", "((¬P) ∧ Q) ⇒ R"], ["P ∨ Q ⇒ R ⇔ S", "((P ∨ Q) ⇒ R) ⇔ S"]]);
    const o = textOptions(R, s[1], [[s[0].replace(/ ∧ /, " ∧ (").concat(")"), "∧ binds tighter than ∨ and ⇒."], ["¬(" + s[0].slice(1) + ")", "¬ applies only to the symbol right after it."], [s[0].split(" ").reverse().join(" "), "Order of symbols cannot change."]]);
    return Q({ ...base, id, sub: "Operator precedence", type: "MCQ", diff: "Medium", ...o, calc: false, stem: `Using precedence ¬, ∧, ∨, ⇒, ⇔ (highest to lowest), how is <b>${s[0]}</b> bracketed?`, steps: [`${s[0]} = ${s[1]}.`], take: "¬ first, then ∧, ∨, ⇒, ⇔.", tags: ["precedence"], cov: ["logic-syntax"] });
  }
  throw new Error(kind);
}
export const LOGIC_KINDS = ["eval", "entail", "resolve", "equiv", "precedence"];
