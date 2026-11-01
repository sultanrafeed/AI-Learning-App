// Compact authoring helpers for hand-written questions and learn cards.
import { rng, Q, LETTERS } from "../js/gen-core.js";

const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

export function makeAuthor(topic, defaultSrc) {
  const out = [];
  const meta = (o) => ({ topic, src: o.src || defaultSrc, tags: o.tags || [], cov: o.cov || [], calc: !!o.calc, visual: o.visual, t: o.t });
  return {
    out,
    // mcq(id, diff, stem, correct, [[wrong, why],...], take, {src,cov,tags,trap,visual})
    mcq(id, diff, stem, correct, wrongs, take, o = {}) {
      const R = rng(hash(id)); const opts = R.shuffle([{ v: correct, ok: true }, ...wrongs.map(([v, why]) => ({ v, why }))]);
      const whyWrong = {}; opts.forEach((x, i) => { if (!x.ok) whyWrong[LETTERS[i]] = x.why; });
      out.push(Q({ ...meta(o), id: `${topic}-${id}`, sub: o.sub || "", type: "MCQ", diff, stem, options: opts.map((x) => x.v), answer: LETTERS[opts.findIndex((x) => x.ok)], whyWrong, take, steps: o.steps || [], trap: o.trap }));
    },
    // multi(id, diff, stem, [[text, isCorrect, why],...], take, o)
    multi(id, diff, stem, items, take, o = {}) {
      const R = rng(hash(id)); const opts = R.shuffle(items);
      const ans = []; const whyWrong = {};
      opts.forEach(([, ok, why], i) => { if (ok) ans.push(LETTERS[i]); whyWrong[LETTERS[i]] = (ok ? "Correct: " : "Incorrect: ") + why; });
      out.push(Q({ ...meta(o), id: `${topic}-${id}`, sub: o.sub || "", type: "MULTI", diff, stem: stem + " <i>(Select ALL that apply.)</i>", options: opts.map((x) => x[0]), answer: ans, whyWrong, take, steps: o.steps || [], trap: o.trap }));
    },
    tf(id, diff, stem, ans, why, take, o = {}) {
      out.push(Q({ ...meta(o), id: `${topic}-${id}`, sub: o.sub || "", type: "TF", diff, stem, answer: ans, why, take, steps: o.steps || [why], trap: o.trap !== false }));
    },
    blank(id, diff, stem, ans, accepted, take, o = {}) {
      out.push(Q({ ...meta(o), id: `${topic}-${id}`, sub: o.sub || "", type: "BLANK", diff, stem, answer: ans, accepted: [ans, ...(accepted || [])], take, steps: o.steps || [], format: o.format || "one word or number", tol: o.tol }));
    },
    blanks(id, diff, stem, labels, answers, accepted, take, o = {}) {
      out.push(Q({ ...meta(o), id: `${topic}-${id}`, sub: o.sub || "", type: "BLANKS", diff, stem, blanks: labels, answer: answers, accepted: accepted || answers.map((a) => [a]), take, steps: o.steps || [], format: o.format, tol: o.tol }));
    },
    // match(id, diff, stem, [[left, right],...], [decoyRight...], take, o)
    match(id, diff, stem, pairs, decoys, take, o = {}) {
      const R = rng(hash(id)); const right = R.shuffle([...pairs.map((p) => p[1]), ...(decoys || [])]);
      const answer = {}; pairs.forEach(([, r], i) => { answer[String(i + 1)] = LETTERS[right.indexOf(r)]; });
      out.push(Q({ ...meta(o), id: `${topic}-${id}`, sub: o.sub || "", type: "MATCH", diff, stem, left: pairs.map((p) => p[0]), right, answer, take, steps: o.steps || pairs.map(([l, r]) => `${l} → ${r}`) }));
    },
  };
}
