// Answer grading for all six question types. Pure functions (testable in Node).
export function norm(s) {
  return String(s ?? "").trim().toLowerCase()
    .replace(/[−–—]/g, "-").replace(/×/g, "x").replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ",").replace(/\s*-\s*/g, "-").replace(/[’']/g, "'")
    .replace(/ă|â/g, "a").replace(/ș|ş/g, "s").replace(/ț|ţ/g, "t").replace(/î/g, "i").replace(/[.]$/, "");
}
// Parse numbers including fractions "3/5", percentages "1.76%", scientific "6.28e-4", "6.28 × 10^-4"
export function parseNum(s) {
  if (s === null || s === undefined) return NaN;
  let t = String(s).trim().replace(/[−–—]/g, "-").replace(/,/g, "").replace(/\s+/g, "");
  t = t.replace(/[x×]10\^?(-?\d+)/i, "e$1");
  if (/^-?\d*\.?\d+%$/.test(t)) t = t.slice(0, -1);
  const fr = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (fr) return parseFloat(fr[1]) / parseFloat(fr[2]);
  if (/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return parseFloat(t);
  return NaN;
}
function dpOf(s) { const m = String(s).match(/\.(\d+)/); return m ? m[1].length : 0; }

// Check one free-text value against an expected answer + accepted list + tolerance
export function checkValue(given, expected, accepted = [], tol) {
  const g = norm(given);
  if (!g) return { ok: false };
  const cands = [expected, ...(accepted || [])].map(norm);
  if (cands.includes(g)) return { ok: true };
  // letters list compare ignoring spaces/order-insensitive? keep order for sequences
  const gn = parseNum(given), en = parseNum(expected);
  if (!isNaN(gn) && !isNaN(en)) {
    const t = tol !== undefined && tol !== null ? tol : Math.max(Math.abs(en) * 1e-6, 1e-9) + (dpOf(expected) ? 0.5 * Math.pow(10, -dpOf(expected)) : 1e-9);
    if (Math.abs(gn - en) <= t + 1e-12) {
      let note = "";
      const want = dpOf(expected);
      if (want && dpOf(String(given)) < want && !String(given).includes("/") && !/e/i.test(String(given))) note = `Accepted, but give ${want} decimal places in the exam to be safe (${expected}).`;
      return { ok: true, note };
    }
    // also accept percentage vs fraction mismatch e.g. 0.0176 vs 1.76 when expected is a %
    for (const a of accepted || []) { const an = parseNum(a); if (!isNaN(an) && Math.abs(gn - an) <= (tol ?? 1e-9) + 1e-12) return { ok: true }; }
    const close = Math.abs(gn - en) <= Math.max(Math.abs(en) * 0.02, 0.006);
    return { ok: false, note: close ? "Very close: check your rounding (round only at the end)." : "" };
  }
  // sequence answers: accept without spaces/commas variations
  const strip = (x) => x.replace(/[ ,]/g, "");
  if (cands.map(strip).includes(strip(g))) return { ok: true };
  return { ok: false };
}

export function grade(q, resp) {
  const r = { ok: false, score: 0, parts: [], notes: [] };
  if (q.type === "MCQ") { r.ok = resp === q.answer; r.score = r.ok ? 1 : 0; return r; }
  if (q.type === "TF") { r.ok = resp === q.answer; r.score = r.ok ? 1 : 0; return r; }
  if (q.type === "MULTI") {
    const want = new Set(q.answer), got = new Set(resp || []);
    const letters = q.options.map((_, i) => "ABCDEF"[i]);
    letters.forEach((L) => r.parts.push({ key: L, ok: want.has(L) === got.has(L), chosen: got.has(L), correct: want.has(L) }));
    r.ok = r.parts.every((p) => p.ok); r.score = r.ok ? 1 : 0; r.partial = r.parts.filter((p) => p.ok).length + "/" + r.parts.length; return r;
  }
  if (q.type === "BLANK") {
    const c = checkValue(resp, q.answer, q.acceptedAnswers, q.tol);
    r.ok = c.ok; r.score = c.ok ? 1 : 0; if (c.note) r.notes.push(c.note); return r;
  }
  if (q.type === "BLANKS") {
    const vals = resp || [];
    q.answer.forEach((exp, i) => {
      const acc = q.acceptedAnswers ? (Array.isArray(q.acceptedAnswers[i]) ? q.acceptedAnswers[i] : [q.acceptedAnswers[i]]) : [];
      const tol = Array.isArray(q.tol) ? q.tol[i] : q.tol;
      const c = checkValue(vals[i], exp, acc, tol);
      r.parts.push({ ok: c.ok }); if (c.note) r.notes.push(`Blank ${i + 1}: ${c.note}`);
    });
    const n = r.parts.filter((p) => p.ok).length; r.ok = n === q.answer.length; r.score = n / q.answer.length; r.partial = `${n}/${q.answer.length} blanks correct`; return r;
  }
  if (q.type === "MATCH") {
    const keys = Object.keys(q.answer);
    keys.forEach((k) => r.parts.push({ ok: (resp || {})[k] === q.answer[k] }));
    const n = r.parts.filter((p) => p.ok).length; r.ok = n === keys.length; r.score = n / keys.length; r.partial = `${n}/${keys.length} matches correct`; return r;
  }
  return r;
}

export function answerText(q) {
  if (q.type === "MCQ") return `${q.answer}. ${q.options["ABCDEF".indexOf(q.answer)]}`;
  if (q.type === "TF") return q.answer ? "True" : "False";
  if (q.type === "MULTI") return q.answer.join(", ");
  if (q.type === "BLANK") return String(q.answer);
  if (q.type === "BLANKS") return q.answer.map((a, i) => `${q.blanks ? q.blanks[i] : i + 1}: ${a}`).join(" · ");
  if (q.type === "MATCH") return Object.entries(q.answer).map(([k, v]) => `${k}-${v}`).join(", ");
  return "";
}
