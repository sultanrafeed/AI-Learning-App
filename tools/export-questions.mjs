// Export every question in the app to plain-text Markdown, with answers and explanations.
import fs from "fs";
const root = new URL("../", import.meta.url).pathname;
const idx = JSON.parse(fs.readFileSync(root + "data/index.json"));
const L = "ABCDEF";
const ent = (s) => s.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
function tableText(html) {
  // tables → pipe rows; captions kept
  return html.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (_, t) => {
    const rows = [...t.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((c) => clean(c[1]).trim()).join(" | "));
    return "\n" + rows.map((r) => "    " + r).join("\n") + "\n";
  });
}
function svgText(svg) {
  const num = (a, k) => parseFloat((a.match(new RegExp(k + '="([-\\d.]+)"')) || [])[1]);
  const texts = [...svg.matchAll(/<text([^>]*)>([\s\S]*?)<\/text>/g)].map((m) => ({ x: num(m[1], "x"), y: num(m[1], "y"), cls: (m[1].match(/class="([^"]*)"/) || [])[1] || "", t: ent(m[2].replace(/<[^>]+>/g, "")).trim() })).filter((t) => t.t);
  const shapes = [...svg.matchAll(/<(circle|ellipse)([^>]*)\/?>/g)].map((m) => ({ x: num(m[2], "cx"), y: num(m[2], "cy") }));
  const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const labels = texts.filter((t) => /\bgl\b/.test(t.cls));
  if (shapes.length >= 2 && labels.length) {
    const nodes = shapes.map((c) => { const l = labels.slice().sort((a, b) => d(a, c) - d(b, c))[0]; return { ...c, name: l && d(l, c) < 40 ? l.t : "?" }; });
    const near = (p) => nodes.slice().sort((a, b) => d(a, p) - d(b, p))[0];
    const wts = texts.filter((t) => /\bgw\b/.test(t.cls));
    const used = new Set(); const edges = [];
    for (const m of svg.matchAll(/<line([^>]*)\/?>/g)) {
      const a = near({ x: num(m[1], "x1"), y: num(m[1], "y1") }), b = near({ x: num(m[1], "x2"), y: num(m[1], "y2") }); if (!a || !b || a === b) continue;
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; const w = wts.filter((t) => !used.has(t)).sort((p, q) => d(p, mid) - d(q, mid))[0];
      let lab = ""; if (w && d(w, mid) < 45) { used.add(w); lab = " (" + w.t + ")"; }
      edges.push(a.name + " — " + b.name + lab);
    }
    const hs = texts.filter((t) => /\bgh\b/.test(t.cls));
    const hl = hs.length ? "\n    Heuristic values: " + nodes.map((n) => { const h = hs.slice().sort((a, b) => d(a, n) - d(b, n))[0]; return h && d(h, n) < 40 ? n.name + " " + h.t : null; }).filter(Boolean).join(", ") : "";
    const other = wts.filter((t) => !used.has(t)).map((t) => t.t);
    return "    [Diagram as text] Edges (label in brackets): " + edges.join("; ") + hl + (other.length ? "\n    Other labels: " + other.join(", ") : "");
  }
  return texts.length ? "    [Diagram as text] Labels: " + texts.map((t) => t.t).join(" · ") : "    [diagram in the app]";
}
function clean(s) {
  if (s == null) return "";
  s = String(s);
  s = s.replace(/<svg[\s\S]*?<\/svg>/g, (m) => "\n" + svgText(m) + "\n");
  s = tableText(s);
  s = s.replace(/<br\s*\/?>/g, "\n").replace(/<\/(div|p|li)>/g, "\n").replace(/<sub>(.*?)<\/sub>/g, "_$1").replace(/<sup>(.*?)<\/sup>/g, "^$1");
  s = s.replace(/<[^>]+>/g, "");
  return ent(s).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
const fmtAns = (q) => {
  if (q.type === "MCQ") return `${q.answer}. ${clean(q.options[L.indexOf(q.answer)])}`;
  if (q.type === "MULTI") return q.answer.map((a) => `${a}. ${clean(q.options[L.indexOf(a)])}`).join("; ");
  if (q.type === "TF") return q.answer ? "True" : "False";
  if (q.type === "BLANK") return String(q.answer);
  if (q.type === "BLANKS") return q.answer.map((a, i) => `${q.blanks ? clean(q.blanks[i]) : "Blank " + (i + 1)} = ${a}`).join("; ");
  if (q.type === "MATCH") return Object.entries(q.answer).map(([k, v]) => `${k} → ${v}`).join(", ");
  return JSON.stringify(q.answer);
};
function fmtQ(q, label) {
  let body = "";
      body += `\n### ${label}. [${q.type} · ${q.difficulty}${q.isCalculation ? " · calculation" : ""}]\n`;
      if (q.visual) { const v = clean(q.visual); if (v) body += `\n${v}\n`; }
      body += `\n${clean(q.stem)}\n`;
      if (q.type === "MCQ" || q.type === "MULTI") body += "\n" + q.options.map((o, i) => `  ${L[i]}. ${clean(o)}`).join("\n") + "\n";
      if (q.type === "BLANKS" && q.blanks) body += "\n" + q.blanks.map((b, i) => `  (${i + 1}) ${clean(b)} = ____`).join("\n") + "\n";
      if (q.type === "MATCH") body += "\n" + q.left.map((l, i) => `  ${i + 1}. ${clean(l)}`).join("\n") + "\n\n" + q.right.map((r, i) => `  ${L[i]}. ${clean(r)}`).join("\n") + "\n";
      body += `\n**Answer:** ${fmtAns(q)}\n`;
      if (q.acceptedAnswers && q.type === "BLANK" && q.acceptedAnswers.length > 1) body += `(Also accepted: ${q.acceptedAnswers.filter((a) => a !== q.answer).map(String).join(", ")})\n`;
      const why = q.type === "TF" && q.why ? [clean(q.why)] : [];
      const steps = (q.solutionSteps || []).map(clean).filter((s) => s && !why.includes(s));
      if (why.length) body += `\n**Why:** ${why[0]}\n`;
      if (steps.length) body += `\n**Working:**\n` + steps.map((s) => `  - ${s}`).join("\n") + "\n";
      if (q.whyWrong && Object.keys(q.whyWrong).length) {
        const ww = Object.entries(q.whyWrong).filter(([, v]) => v).map(([k2, v]) => `  - ${k2}: ${clean(v)}`);
        if (ww.length) body += `\n**Option notes:**\n${ww.join("\n")}\n`;
      }
      if (q.takeaway) body += `\n**Takeaway:** ${clean(q.takeaway)}\n`;
      body += `\n*Source: ${clean(q.source)}*\n`;
  return body;
}
const isGen = (q) => /-\d{4,}$/.test(q.id);
const ARG = process.argv[3] || ""; // optional: a difficulty ("Exam+") or "ids:<file.json>" (list of question ids)
const IDS = ARG.startsWith("ids:") ? new Set(JSON.parse(fs.readFileSync(ARG.slice(4)))) : null;
const ONLY = IDS ? "" : ARG;
const TITLE = process.argv[4] || "";
let out = `# AI Quest: ${TITLE || (ONLY ? ONLY + " questions only" : "every question in the app")} (42172 Introduction to AI)\n\nGenerated ${new Date().toISOString().slice(0, 10)} from the app's question bank. Each question shows its type, difficulty and source, then the answer and the worked solution.\nTypes: MCQ (one answer), MULTI (select all that apply), TF (true/false), BLANK (fill one blank), BLANKS (fill several), MATCH (matching).\nPart A of each topic = hand-written questions (lectures, workshops, key-points sheets, class exercises, Books 1-3, AIMA). Part B = computer-generated calculation drills (fresh numbers for every skill).\n\n## Contents\n\n`;
const counts = [];
let body = "";
let n = 0;
for (const t of idx.topics) {
  const qs = JSON.parse(fs.readFileSync(root + `data/questions/${t.id}.json`)).filter((q) => (!ONLY || q.difficulty === ONLY) && (!IDS || IDS.has(q.id)));
  if (!qs.length) continue;
  const hand = qs.filter((q) => !isGen(q)), gen = qs.filter(isGen);
  counts.push(`- ${t.icon} ${t.name} (${t.lecture}): ${hand.length} hand-written + ${gen.length} calculation drills`);
  body += `\n\n---\n\n# ${t.icon} ${t.name} (${t.lecture})\n`;
  for (const [title, list] of [["Part A: hand-written questions", hand], ["Part B: calculation drills", gen]]) {
    if (!list.length) continue;
    body += `\n## ${title} (${list.length})\n`;
    let k = 0;
    for (const q of list) {
      k++; n++;
      body += fmtQ(q, `${t.id.toUpperCase()} ${title[5]}${k}`);
    }
  }
}
// Book 2 paper section (order)
const all = {}; for (const t of idx.topics) for (const q of JSON.parse(fs.readFileSync(root + `data/questions/${t.id}.json`))) all[q.id] = q;
let paper = `\n\n---\n\n# 📘 Book 2 mixed practice paper (40 questions, 100 minutes): answer key\n\n`;
idx.paper.forEach((id, i) => { const q = all[id]; paper += `${i + 1}. ${clean(q.stem).replace(/\n+/g, " ")}\n   **Answer:** ${fmtAns(q)}\n`; });
out += counts.join("\n") + (ONLY || IDS ? "\n" : `\n- 📘 Book 2 mixed practice paper: answer key at the end\n`) + `\n**Total: ${n} questions.**\n` + body + (ONLY || IDS ? "" : paper);
if (ARG.startsWith("pack:")) {
  // Ordered study pack: [{title, intro, ids:[...]} | {title, md}]
  const all2 = {}; for (const t of idx.topics) for (const q of JSON.parse(fs.readFileSync(root + `data/questions/${t.id}.json`))) all2[q.id] = q;
  const P = JSON.parse(fs.readFileSync(ARG.slice(5)));
  let o2 = `# ${P.title}\n\n${P.intro}\n\n## Contents\n\n` + P.sections.map((x, i) => `${i + 1}. ${x.title}${x.ids ? ` (${x.ids.length} questions)` : ""}`).join("\n") + "\n";
  let m = 0;
  P.sections.forEach((x, i) => {
    o2 += `\n\n---\n\n# ${i + 1}. ${x.title}\n\n${x.intro || ""}\n`;
    if (x.md) o2 += "\n" + x.md + "\n";
    (x.ids || []).forEach((id, k) => { const q = all2[id]; if (!q) throw new Error("missing " + id); m++; o2 += fmtQ(q, `${i + 1}.${k + 1}`); });
  });
  out = o2; n = m;
}
fs.writeFileSync(process.argv[2], out);
console.log(n, (out.length / 1e6).toFixed(2) + " MB");
