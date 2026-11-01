// AI Quest: shared helpers for question generators (works in browser and Node).
export function rng(seed) {
  let a = seed >>> 0;
  const f = () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  f.int = (lo, hi) => lo + Math.floor(f() * (hi - lo + 1));
  f.pick = (arr) => arr[Math.floor(f() * arr.length)];
  f.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  f.chance = (p) => f() < p;
  return f;
}

export const LETTERS = ["A", "B", "C", "D", "E", "F"];

// Round half away from zero at dp places, return Number
export function rnd(x, dp = 3) {
  const m = Math.pow(10, dp);
  const v = Math.round((Math.abs(x) + 1e-12) * m) / m;
  return x < 0 ? -v : v;
}
// Format a number with exactly dp decimals (or integer if dp = 0)
export function fx(x, dp = 3) {
  const v = rnd(x, dp);
  return dp === 0 ? String(Math.round(v)) : v.toFixed(dp);
}
// Format "nicely": strip trailing zeros
export function nf(x, dp = 4) {
  if (Number.isInteger(x)) return String(x);
  return String(parseFloat(rnd(x, dp).toFixed(dp)));
}
export const log2 = (x) => Math.log(x) / Math.LN2;
export const sigmoid = (z) => 1 / (1 + Math.exp(-z));

// Entropy of a count vector (base 2), 0 log 0 = 0
export function entropy(counts) {
  const n = counts.reduce((a, b) => a + b, 0);
  if (n === 0) return 0;
  let h = 0;
  for (const c of counts) if (c > 0) { const p = c / n; h -= p * log2(p); }
  return h;
}
export function gini(counts) {
  const n = counts.reduce((a, b) => a + b, 0);
  if (n === 0) return 0;
  return 1 - counts.reduce((s, c) => s + (c / n) ** 2, 0);
}
export function softmax(arr) {
  const m = Math.max(...arr);
  const e = arr.map((x) => Math.exp(x - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / s);
}
export function dot(a, b) { return a.reduce((s, x, i) => s + x * b[i], 0); }

// Build a numeric MCQ: correct value + list of [value, reason] distractors.
export function numericOptions(R, correct, distractors, dp = 3, unit = "") {
  const seen = new Set([fx(correct, dp)]);
  const opts = [{ v: fx(correct, dp), ok: true }];
  for (const [v, why] of distractors) {
    if (v === undefined || v === null || !isFinite(v)) continue;
    const s = fx(v, dp);
    if (seen.has(s)) continue;
    seen.add(s); opts.push({ v: s, ok: false, why });
    if (opts.length === 4) break;
  }
  // pad with near misses if needed
  let k = 1;
  while (opts.length < 4) {
    const v = correct + (k % 2 ? 1 : -1) * Math.max(Math.abs(correct) * 0.15 * Math.ceil(k / 2), Math.pow(10, -dp) * 7 * k);
    const s = fx(v, dp);
    if (!seen.has(s)) { seen.add(s); opts.push({ v: s, ok: false, why: "Arithmetic slip: recompute each step carefully." }); }
    k++;
  }
  const sh = R.shuffle(opts);
  const options = sh.map((o) => o.v + unit);
  const answer = LETTERS[sh.findIndex((o) => o.ok)];
  const whyWrong = {};
  sh.forEach((o, i) => { if (!o.ok) whyWrong[LETTERS[i]] = o.why; });
  return { options, answer, whyWrong };
}

// Text MCQ: correct string + [[wrong, why]...]
export function textOptions(R, correct, wrongs) {
  const seen = new Set([String(correct)]); const ws = [];
  for (const [v, why] of wrongs) { if (seen.has(String(v))) continue; seen.add(String(v)); ws.push({ v, ok: false, why }); if (ws.length === 3) break; }
  const opts = [{ v: correct, ok: true }, ...ws];
  const sh = R.shuffle(opts);
  const whyWrong = {};
  sh.forEach((o, i) => { if (!o.ok) whyWrong[LETTERS[i]] = o.why; });
  return { options: sh.map((o) => o.v), answer: LETTERS[sh.findIndex((o) => o.ok)], whyWrong };
}

export function tolFor(dp) { return 0.5 * Math.pow(10, -dp) + 1e-9; }

// Question factory with defaults
export function Q(o) {
  const typeTime = { MCQ: 90, MULTI: 120, TF: 30, BLANK: 150, BLANKS: 210, MATCH: 120 };
  const q = {
    id: o.id, topic: o.topic, subtopic: o.sub || "", type: o.type,
    difficulty: o.diff || "Medium", isCalculation: !!o.calc,
    targetSeconds: o.t || (o.calc && (o.type === "BLANK" || o.type === "BLANKS") ? 210 : typeTime[o.type] || 90),
    stem: o.stem, answer: o.answer,
    solutionSteps: o.steps || [], takeaway: o.take || "", source: o.src || "", tags: o.tags || [],
  };
  if (o.visual) q.visual = o.visual;
  if (o.options) q.options = o.options;
  if (o.left) { q.left = o.left; q.right = o.right; }
  if (o.accepted) q.acceptedAnswers = o.accepted;
  if (o.tol !== undefined) q.tol = o.tol;
  if (o.format) q.format = o.format;
  if (o.whyWrong) q.whyWrong = o.whyWrong;
  if (o.why) q.why = o.why; // for TF
  if (o.trap) q.trap = true;
  if (o.cov) q.cov = o.cov;
  if (o.blanks) q.blanks = o.blanks; // labels for BLANKS
  return q;
}

// HTML table helper
export function table(headers, rows, cls = "") {
  const th = headers.map((h) => `<th>${h}</th>`).join("");
  const tr = rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");
  return `<div class="tbl-wrap"><table class="qt ${cls}"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
}
export function grid(mat, opts = {}) {
  const hl = opts.hl || [];
  const rows = mat.map((r, i) => `<tr>${r.map((c, j) => `<td class="${hl.some(([a, b]) => a === i && b === j) ? "hl" : ""}">${c}</td>`).join("")}</tr>`).join("");
  return `<table class="gridm${opts.small ? " sm" : ""}">${opts.caption ? `<caption>${opts.caption}</caption>` : ""}<tbody>${rows}</tbody></table>`;
}
export const vec = (a, dp = 3) => "[" + a.map((x) => nf(x, dp)).join(", ") + "]";
