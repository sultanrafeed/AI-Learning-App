// AI Quest: exam coach & game for UTS 42172 Introduction to AI.
import { grade, answerText } from "./js/grade.js";
import { GEN, freshQuestion } from "./js/generators.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $("#app");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const LET = "ABCDEF";
const TYPES = ["MCQ", "MULTI", "TF", "BLANK", "BLANKS", "MATCH"];
const TYPE_NAMES = { MCQ: "Multiple choice", MULTI: "Multiple answer", TF: "True / False", BLANK: "Fill in a blank", BLANKS: "Fill in multiple blanks", MATCH: "Matching" };
const DIFFS = ["Easy", "Medium", "Hard", "Exam+"];
const RANKS = [[1, "Novice Node"], [3, "Frontier Explorer"], [5, "Heuristic Hunter"], [8, "Gradient Climber"], [11, "Bellman Knight"], [15, "Attention Master"], [20, "Exam Legend"]];
const TIME_TIPS = {
  search: "Draw a frontier table (node : f) and update it every step: it stops tie-break and re-expansion slips.",
  trees: "Write [p+, n−] counts on every branch and the weights |Sᵥ|/|S| before touching any logs.",
  ml: "Write the formula, then a column of errors; divide by n last.",
  mdp: "Make a row per outcome: P × (R + γU′). Sum, then take the max over actions.",
  bayes: "List the factors on one line, put 1 − p for every false value, multiply, then normalise once.",
  cnn: "Compute ⌊(N + 2P − K)/S⌋ + 1 and (K·K·C_in + 1)·C_out before reading the options.",
  detect: "Compute intersection width and height first; union = A + B − I.",
  seq: "Separate the two products (input term, recurrent term), add, then apply the lookup.",
  attn: "Table it: score → scaled → exp → weight → weight × value.",
  nn: "Compute the weighted sum (with bias) first; then the activation; then the update.",
  local: "For SA, compute Δ/T first, then e^(−Δ/T). For roulette, write cumulative bounds.",
  genai: "Write each term separately (e.g. μ², σ², ln σ²) before combining.",
  logic: "Build a quick truth table; check only the rows where the KB is true.",
  kr: "Follow member/subclass links upward and stop at the first (most specific) value.",
};

// ---------------- data ----------------
const DATA = { index: null, q: {}, learn: {}, glossary: null, formulas: null, coverage: null };
async function getJSON(p) { const r = await fetch(p); if (!r.ok) throw new Error(p); return r.json(); }
async function loadIndex() { if (!DATA.index) DATA.index = await getJSON("./data/index.json"); return DATA.index; }
async function loadQs(t) { if (!DATA.q[t]) DATA.q[t] = await getJSON(`./data/questions/${t}.json`); return DATA.q[t]; }
async function loadAllQs() { const idx = await loadIndex(); await Promise.all(idx.topics.map((t) => loadQs(t.id))); return idx.topics.flatMap((t) => DATA.q[t.id]); }
async function loadLearn(t) { if (!DATA.learn[t]) DATA.learn[t] = await getJSON(`./data/learn/${t}.json`); return DATA.learn[t]; }
const topicMeta = (id) => DATA.index.topics.find((t) => t.id === id);

// ---------------- state ----------------
const KEY = "aiquest-v1";
const DEF = { xp: 0, streak: 0, best: 0, hearts: 3, answered: 0, hist: [], grave: {}, lvl: {}, run: {}, seen: {}, read: {}, cleared: {}, settings: { mockCount: 40, halfCount: 20 }, mocks: [], diag: false, combo: 0, sinceReport: 0, activeMock: null, session: 0, created: Date.now() };
let S = load();
function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); return s ? { ...structuredClone(DEF), ...s, settings: { ...DEF.settings, ...(s.settings || {}) } } : structuredClone(DEF); } catch { return structuredClone(DEF); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { toast("Storage unavailable: export your progress regularly."); } }
S.session = (S.session || 0) + 1; save();

const level = () => Math.floor(S.xp / 100) + 1;
const rank = (l = level()) => RANKS.filter(([m]) => l >= m).pop()[1];
function mastery(t) { const h = S.hist.filter((x) => x.topic === t).slice(-10); if (!h.length) return null; return Math.round((100 * h.reduce((s, x) => s + x.score, 0)) / h.length); }
function statusLine() {
  const ms = DATA.index ? DATA.index.topics.map((t) => [t, mastery(t.id)]).filter(([, m]) => m !== null).slice(0, 4) : [];
  return `<div class="status"><span class="chip">Lvl ${level()}</span><span class="chip">XP ${S.xp}</span><span class="chip">🔥 ${S.streak}</span><span class="chip">${"❤️".repeat(S.hearts)}${"🤍".repeat(3 - S.hearts)} ${S.hearts}/3</span>${ms.map(([t, m]) => `<span class="chip">${t.icon} ${m}%</span>`).join("")}</div>`;
}
function toast(msg, ms = 2200) { const d = document.createElement("div"); d.className = "toast"; d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), ms); }
function xpFly(t) { const d = document.createElement("div"); d.className = "xpfly"; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1000); }
function modal(html, onclose) { const m = document.createElement("div"); m.className = "modal"; m.innerHTML = `<div class="sheet">${html}</div>`; document.body.appendChild(m); m.addEventListener("click", (e) => { if (e.target === m || e.target.closest("[data-close]")) { m.remove(); onclose && onclose(); } }); return m; }

// ---------------- router ----------------
const TABS = [["home", "🏠", "Home"], ["learn", "📚", "Learn"], ["practice", "⚔️", "Practice"], ["mock", "⏱️", "Mock"], ["profile", "👤", "Profile"]];
function tabbar(cur) { return `<nav class="tabbar">${TABS.map(([h, i, n]) => `<a href="#${h}" class="${cur === h ? "on" : ""}"><span class="ic">${i}</span>${n}</a>`).join("")}</nav>`; }
let SESSION = null; let timerInt = null;
async function route() {
  clearInterval(timerInt); clearInterval(mockTick);
  $$(".modal").forEach((m) => m.remove());
  await loadIndex();
  const [r, a, b] = (location.hash.slice(1) || "home").split("/");
  const tab = { home: "home", world: "home", learn: "learn", card: "learn", cheat: "learn", formulas: "learn", glossary: "learn", coverage: "learn", practice: "practice", quiz: "practice", mock: "mock", mockrun: "mock", mockreview: "mock", profile: "profile" }[r] || "home";
  let html = "";
  try {
    if (r === "home") html = await viewHome();
    else if (r === "world") html = await viewWorld(a);
    else if (r === "learn") html = a ? await viewLearnTopic(a) : await viewLearn();
    else if (r === "card") html = await viewCard(a, +b);
    else if (r === "cheat") html = await viewCheat(a);
    else if (r === "formulas") html = await viewFormulas();
    else if (r === "glossary") html = await viewGlossary();
    else if (r === "coverage") html = await viewCoverage();
    else if (r === "practice") html = viewPractice();
    else if (r === "quiz") { if (!SESSION) { location.hash = "#practice"; return; } html = ""; }
    else if (r === "mock") html = viewMock();
    else if (r === "mockrun") html = "";
    else if (r === "mockreview") html = viewMockReview(+a);
    else if (r === "profile") html = viewProfile();
  } catch (e) { html = `<div class="card">Could not load content (${esc(e.message)}). If you are offline, open the app once online first.</div>`; }
  app.innerHTML = (r === "quiz" || r === "mockrun" ? "" : statusLine()) + html + tabbar(tab);
  window.scrollTo(0, 0);
  bind(r, a, b);
  if (r === "quiz") renderQuizStep();
  if (r === "mockrun") renderMock();
}
window.addEventListener("hashchange", route);

function bind(r, a) {
  $$("[data-go]").forEach((el) => el.addEventListener("click", () => (location.hash = el.dataset.go)));
  $$("[data-start]").forEach((el) => el.addEventListener("click", () => startSession(JSON.parse(el.dataset.start))));
  if (r === "profile") bindProfile();
  if (r === "mock") $$("[data-mock]").forEach((el) => el.addEventListener("click", () => startMock(el.dataset.mock)));
  if (r === "glossary") { const inp = $("#gsearch"); inp && inp.addEventListener("input", () => { const v = inp.value.toLowerCase(); $$(".gitem").forEach((d) => (d.style.display = d.textContent.toLowerCase().includes(v) ? "" : "none")); }); }
}

// ---------------- views: home ----------------
async function viewHome() {
  const idx = DATA.index; const l = level();
  const due = Object.values(S.grave).filter((g) => g.due <= S.answered).length;
  const weak = idx.topics.map((t) => ({ t, m: mastery(t.id) })).sort((x, y) => (x.m ?? -1) - (y.m ?? -1));
  const rec = weak.find((w) => w.m === null || w.m < 85) || weak[0];
  return `<div class="hero"><div class="small" style="opacity:.85">AI QUEST · 42172 Final Exam</div><h1>${rank()}</h1>
  <div class="row small"><span>Level ${l}</span><span class="grow"></span><span>${S.xp % 100}/100 XP</span></div><div class="bar"><i style="width:${S.xp % 100}%"></i></div>
  <div class="row small" style="margin-top:8px"><span>🔥 Streak ${S.streak} (best ${S.best})</span><span class="grow"></span><span>🪦 ${Object.keys(S.grave).length} in graveyard</span></div></div>
  ${!S.diag ? `<div class="card"><h2 style="margin-top:0">🧪 Start here: 6-question diagnostic</h2><p class="muted">One question each on search, decision trees, probability, CNNs, IoU/NMS and MDPs, each in a different exam question type. It sets your starting mastery.</p><button class="btn block" data-start='{"mode":"diag"}'>Start diagnostic</button></div>` : ""}
  <div class="card"><div class="row"><div class="grow"><b>Recommended next</b><div class="muted small">${rec.t.icon} ${rec.t.world}: ${rec.t.name} (${rec.m === null ? "not started" : rec.m + "% mastery"})</div></div><button class="btn" data-go="#world/${rec.t.id}">Enter</button></div></div>
  <div class="grid">
    <button class="world" data-start='{"mode":"calc"}'><span class="ic">🧮</span><span class="nm">CALC</span><span class="sub">Random hand calculations</span></button>
    <button class="world" data-start='{"mode":"traps"}'><span class="ic">🪤</span><span class="nm">TRAPS</span><span class="sub">Common-mistake questions</span></button>
    <button class="world" data-start='{"mode":"speed"}'><span class="ic">⚡</span><span class="nm">SPEED</span><span class="sub">10 rapid questions, 45 s each</span></button>
    <button class="world" data-start='{"mode":"grave"}'><span class="ic">🪦</span><span class="nm">GRAVEYARD</span><span class="sub">${due} due · ${Object.keys(S.grave).length} total</span></button>
    <button class="world" data-start='{"mode":"weak"}'><span class="ic">🎯</span><span class="nm">WEAK</span><span class="sub">Fix your weakest concepts</span></button>
    <button class="world" data-go="#mock"><span class="ic">⏱️</span><span class="nm">MOCK EXAM</span><span class="sub">100-min simulation</span></button>
  </div>
  <div class="section-title">World map</div>
  <div class="grid">${idx.topics.map((t) => { const m = mastery(t.id); return `<button class="world ${m >= 85 ? "mastered" : ""}" data-go="#world/${t.id}" style="text-align:left"><span class="ic">${t.icon}${S.cleared[t.id] ? " 👑" : ""}</span><span class="nm">${t.world}</span><span class="sub">${t.name} · ${t.lecture}</span><div class="bar"><i style="width:${m ?? 0}%;background:${t.color}"></i></div><span class="sub">${m === null ? "Not started" : m + "% mastery"}${m >= 85 ? " · Mastered" : ""}</span></button>`; }).join("")}</div>
  <p class="muted small" style="text-align:center;margin-top:18px">${idx.total} questions in the bank + unlimited generated variations. Module 1 is not examined and not quizzed.</p>`;
}

async function viewWorld(t) {
  const meta = topicMeta(t); const L = await loadLearn(t); const qs = await loadQs(t); const m = mastery(t);
  const cnt = (f) => qs.filter(f).length;
  return `<button class="btn ghost" data-go="#home">‹ Map</button>
  <div class="hero" style="background:linear-gradient(135deg,${meta.color},var(--accent2))"><div class="small">${meta.lecture}</div><h1>${meta.icon} ${meta.world}</h1><div>${meta.name}</div><div class="bar" style="margin-top:8px"><i style="width:${m ?? 0}%"></i></div><div class="small" style="margin-top:4px">${m === null ? "Not started" : m + "% mastery (last 10 answers)"}${S.cleared[t] ? " · 👑 Boss cleared" : ""} · ${qs.length} questions</div></div>
  <div class="card list">
    <div class="item" data-go="#learn/${t}"><span class="ic">📖</span><div class="grow"><b>1. Learn Cards</b><div class="muted small">${L.cards.filter((c) => S.read[c.id]).length}/${L.cards.length} read · cheat sheet · formulas</div></div>›</div>
    <div class="item" data-start='{"mode":"stage","stage":"training","topic":"${t}"}'><span class="ic">🎯</span><div class="grow"><b>2. Training Ground</b><div class="muted small">5 easy/medium concept questions (${cnt((q) => !q.isCalculation)})</div></div>›</div>
    <div class="item" data-start='{"mode":"stage","stage":"calc","topic":"${t}"}'><span class="ic">🧮</span><div class="grow"><b>3. Calc Arena</b><div class="muted small">5 hand-calculation questions${GEN[t] ? " (fresh numbers every time)" : ""}</div></div>›</div>
    <div class="item" data-start='{"mode":"stage","stage":"traps","topic":"${t}"}'><span class="ic">🪤</span><div class="grow"><b>4. Trap Room</b><div class="muted small">5 classic-mistake questions</div></div>›</div>
    <div class="item" data-start='{"mode":"boss","topic":"${t}"}'><span class="ic">🐉</span><div class="grow"><b>5. Boss Battle</b><div class="muted small">5 hard mixed questions; pass with 4/5</div></div>›</div>
    <div class="item" data-start='{"mode":"play","topic":"${t}"}'><span class="ic">♾️</span><div class="grow"><b>Endless practice (adaptive)</b><div class="muted small">Difficulty now: ${DIFFS[S.lvl[t] || 0]}</div></div>›</div>
  </div>`;
}

// ---------------- views: learn ----------------
async function viewLearn() {
  return `<h1>Learn</h1><div class="card list">${DATA.index.topics.map((t) => `<div class="item" data-go="#learn/${t.id}"><span class="ic">${t.icon}</span><div class="grow"><b>${t.name}</b><div class="muted small">${t.lecture} · ${t.world}</div></div>›</div>`).join("")}</div>
  <div class="card list"><div class="item" data-go="#formulas"><span class="ic">∑</span><div class="grow"><b>Full formula sheet</b></div>›</div><div class="item" data-go="#glossary"><span class="ic">🔤</span><div class="grow"><b>Glossary</b></div>›</div><div class="item" data-go="#coverage"><span class="ic">🗺️</span><div class="grow"><b>Coverage map & audit</b><div class="muted small">Every concept, its source and how many questions train it</div></div>›</div></div>`;
}
async function viewLearnTopic(t) {
  const meta = topicMeta(t); const L = await loadLearn(t);
  return `<button class="btn ghost" data-go="#learn">‹ Learn</button><h1>${meta.icon} ${meta.name}</h1><p class="muted">${meta.lecture} · ${meta.world}</p>
  <div class="card list">${L.cards.map((c, i) => `<div class="item" data-go="#card/${t}/${i}"><span class="ic">${S.read[c.id] ? "✅" : "📄"}</span><div class="grow"><b>${c.title}</b><div class="muted small">${c.src}</div></div>›</div>`).join("")}</div>
  <div class="row"><button class="btn sec grow" data-go="#cheat/${t}">📝 Cheat sheet</button><button class="btn grow" data-go="#world/${t}">⚔️ Practise</button></div>`;
}
function cardHTML(c) {
  return `<div class="card lc"><h2 style="margin-top:0">${c.title}</h2><div class="muted small">[${esc(c.src)}]</div>
  <div class="lab">1 · What it solves</div><p><b>${c.hook}</b></p>
  <div class="lab">2 · Visual</div><div class="qvis">${c.visual || ""}</div>
  <div class="lab">3 · Formula</div><div class="kv">${(c.formula || []).map(([a, b]) => `<b>${a}</b><span>${b}</span>`).join("")}</div>
  <div class="lab">4 · Worked example</div><ol class="steps">${(c.example || []).map((s) => `<li>${s}</li>`).join("")}</ol>
  <div class="lab">5 · Memory hook</div><div class="mem">💡 ${c.memory}</div>
  <div class="lab">6 · Exam trap</div><div class="trap">⚠️ ${c.trap}</div></div>`;
}
async function viewCard(t, i) {
  const L = await loadLearn(t); const c = L.cards[i]; if (!c) return "";
  S.read[c.id] = true; save();
  return `<button class="btn ghost" data-go="#learn/${t}">‹ ${topicMeta(t).name}</button>${cardHTML(c)}
  <button class="btn block" data-start='{"mode":"ids","ids":["${c.check}"],"topic":"${t}","title":"Check question"}'>7 · Check question ✔︎</button>
  <div class="row" style="margin-top:10px">${i > 0 ? `<button class="btn sec grow" data-go="#card/${t}/${i - 1}">‹ Prev</button>` : ""}${i < L.cards.length - 1 ? `<button class="btn sec grow" data-go="#card/${t}/${i + 1}">Next ›</button>` : `<button class="btn sec grow" data-go="#cheat/${t}">Cheat sheet ›</button>`}</div>`;
}
async function viewCheat(t) {
  const L = await loadLearn(t); const ch = L.cheat; const F = DATA.formulas || (DATA.formulas = await getJSON("./data/formulas.json"));
  return `<button class="btn ghost" data-go="#learn/${t}">‹ Back</button><h1>📝 ${ch.title}</h1>
  <div class="card"><div class="tbl-wrap"><table class="qt"><tbody>${ch.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>
  <div class="card"><h3 style="margin-top:0">Formulas</h3><div class="kv">${F.filter((f) => f.topic === t).map((f) => `<b>${f.name}</b><span>${f.f}${f.note ? ` <span class="muted small">(${f.note})</span>` : ""}</span>`).join("")}</div></div>
  <div class="card"><h3 style="margin-top:0">⚠️ Traps</h3><ul class="steps">${ch.traps.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
}
async function viewFormulas() {
  const F = DATA.formulas || (DATA.formulas = await getJSON("./data/formulas.json"));
  return `<button class="btn ghost" data-go="#learn">‹ Learn</button><h1>∑ Formula sheet</h1>${DATA.index.topics.map((t) => { const fs = F.filter((f) => f.topic === t.id); return fs.length ? `<div class="card"><h3 style="margin-top:0">${t.icon} ${t.name}</h3><div class="kv">${fs.map((f) => `<b>${f.name}</b><span>${f.f}${f.note ? ` <span class="muted small">(${f.note})</span>` : ""}</span>`).join("")}</div></div>` : ""; }).join("")}`;
}
async function viewGlossary() {
  const G = DATA.glossary || (DATA.glossary = await getJSON("./data/glossary.json"));
  return `<button class="btn ghost" data-go="#learn">‹ Learn</button><h1>🔤 Glossary</h1><div class="field"><input id="gsearch" placeholder="Search terms" autocapitalize="off" autocorrect="off"></div>
  <div class="card list">${G.map((g) => `<div class="item gitem" style="display:block"><b>${g.term}</b> <span class="chip">${topicMeta(g.topic).icon}</span><div class="muted small">${g.def}</div></div>`).join("")}</div>`;
}
async function viewCoverage() {
  const C = DATA.coverage || (DATA.coverage = await getJSON("./data/coverage.json"));
  return `<button class="btn ghost" data-go="#learn">‹ Learn</button><h1>🗺️ Coverage map</h1><p class="muted small">Every concept extracted from your uploaded lectures, workshops, key-points notes, worked examples and quizzes, with its source and the number of questions that train it (target: ≥ 5 questions, ≥ 3 types, ≥ 2 difficulty levels, plus a Learn Card).</p>
  ${DATA.index.topics.map((t) => `<div class="card"><h3 style="margin-top:0">${t.icon} ${t.name}</h3>${C.filter((c) => c.topic === t.id).map((c) => `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><div>${c.text}</div><div class="muted small">[${esc(c.src)}] · ${c.questions} questions · ${c.types} types · ${c.difficulties} levels · ${c.learnCard ? "Learn Card ✓" : "no card"}</div></div>`).join("")}</div>`).join("")}`;
}

// ---------------- practice menu ----------------
function viewPractice() {
  const tp = DATA.index.topics;
  const sel = (id) => `<select id="${id}">${tp.map((t) => `<option value="${t.id}">${t.icon} ${t.name}</option>`).join("")}</select>`;
  setTimeout(() => {
    $("#go-play")?.addEventListener("click", () => startSession({ mode: "play", topic: $("#pt").value }));
    $("#go-boss")?.addEventListener("click", () => startSession({ mode: "boss", topic: $("#bt").value }));
    $("#go-type")?.addEventListener("click", () => startSession({ mode: "type", type: $("#tt").value }));
  });
  return `<h1>Practice</h1>
  <div class="card"><h3 style="margin-top:0">♾️ PLAY a topic (adaptive)</h3><div class="field">${sel("pt")}</div><button class="btn block" id="go-play">Play</button></div>
  <div class="card list">
   <div class="item" data-start='{"mode":"calc"}'><span class="ic">🧮</span><div class="grow"><b>CALC</b><div class="muted small">Random hand calculations from every calculation topic</div></div>›</div>
   <div class="item" data-start='{"mode":"traps"}'><span class="ic">🪤</span><div class="grow"><b>TRAPS</b><div class="muted small">Only trick / common-mistake questions</div></div>›</div>
   <div class="item" data-start='{"mode":"speed"}'><span class="ic">⚡</span><div class="grow"><b>SPEED</b><div class="muted small">10 rapid T/F and short MCQs, 45 s target</div></div>›</div>
   <div class="item" data-start='{"mode":"grave"}'><span class="ic">🪦</span><div class="grow"><b>GRAVEYARD</b><div class="muted small">Replay past mistakes in a new form</div></div>›</div>
   <div class="item" data-start='{"mode":"weak"}'><span class="ic">🎯</span><div class="grow"><b>WEAK</b><div class="muted small">Your weakest concepts, fixed now</div></div>›</div>
   <div class="item" data-start='{"mode":"mixed"}'><span class="ic">🎲</span><div class="grow"><b>Mixed review</b><div class="muted small">70% weakest topics, 30% spaced review</div></div>›</div>
  </div>
  <div class="card"><h3 style="margin-top:0">🔤 TYPE: practise one question type</h3><div class="field"><select id="tt">${TYPES.map((t) => `<option value="${t}">[${t}] ${TYPE_NAMES[t]}</option>`).join("")}</select></div><button class="btn block" id="go-type">Practise this type</button></div>
  <div class="card"><h3 style="margin-top:0">🐉 BOSS battle</h3><div class="field">${sel("bt")}</div><button class="btn block bad" id="go-boss">Fight the boss</button></div>`;
}

// ---------------- question selection ----------------
const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function weightedTopic(weakBias = 0.7) {
  const tp = DATA.index.topics;
  if (Math.random() < weakBias) { const sorted = tp.map((t) => ({ t, m: mastery(t.id) ?? 0 })).sort((a, b) => a.m - b.m).slice(0, 5); return rnd(sorted).t.id; }
  const tot = tp.reduce((s, t) => s + t.weight, 0); let r = Math.random() * tot; for (const t of tp) { r -= t.weight; if (r <= 0) return t.id; } return tp[0].id;
}
function preferUnseen(list) { const un = list.filter((q) => !S.seen[q.id]); return un.length ? un : list; }
function kindOf(q) { const g = GEN[q.topic]; if (!g) return null; return g.kinds.filter((k) => q.id.startsWith(`${q.topic}-${k}-`)).sort((a, b) => b.length - a.length)[0] || null; }
async function pick(topic, filter = () => true, opts = {}) {
  const qs = (await loadQs(topic)).filter(filter);
  if (opts.fresh && GEN[topic] && Math.random() < opts.fresh) {
    const kinds = GEN[topic].kinds; const q = freshQuestion(topic, rnd(kinds)); if (filter(q)) return q;
  }
  if (!qs.length) return null;
  const lv = S.lvl[topic] || 0;
  let pool = preferUnseen(qs);
  if (opts.adaptive) { const near = pool.filter((q) => Math.abs(DIFFS.indexOf(q.difficulty) - lv) <= (lv === 0 ? 0 : 1)); if (near.length) pool = near; }
  return rnd(pool);
}
async function graveQuestion(g) {
  if (g.kind && GEN[g.topic]) { const q = freshQuestion(g.topic, g.kind); q.graveOf = g.id; return q; }
  const q = (await loadQs(g.topic)).find((x) => x.id === g.id); if (q) return { ...q, graveOf: g.id }; return null;
}
async function nextQ() {
  const s = SESSION; s.n++;
  if (s.inject) { const q = s.inject; s.inject = null; return q; }
  if (s.fixed) return s.fixed.shift() || null;
  if (s.limit && s.n > s.limit) return null;
  // graveyard re-injection (in a new form) after 3-5 other questions
  if (!["grave", "boss", "diag", "ids", "stage", "speed"].includes(s.mode)) {
    const due = Object.values(S.grave).filter((g) => g.due <= S.answered && (!s.topic || g.topic === s.topic));
    if (due.length && Math.random() < 0.35) { const q = await graveQuestion(rnd(due)); if (q) return q; }
  }
  if (S.combo > 0 && !["diag", "ids", "boss"].includes(s.mode)) {
    const t = s.topic || weightedTopic(); const q = await pick(t, (q) => ["Hard", "Exam+"].includes(q.difficulty)); if (q) { S.combo--; q.combo = true; return q; }
  }
  switch (s.mode) {
    case "play": return pick(s.topic, () => true, { adaptive: true, fresh: 0.35 });
    case "mixed": { const t = weightedTopic(0.7); return pick(t, () => true, { adaptive: true, fresh: 0.3 }); }
    case "calc": { const calcTopics = DATA.index.topics.filter((t) => GEN[t.id]).map((t) => t.id); const t = Math.random() < 0.7 ? rnd(calcTopics.filter((x) => (mastery(x) ?? 0) < 85).concat(calcTopics).slice(0, 8)) : rnd(calcTopics); return pick(t, (q) => q.isCalculation, { fresh: 0.5 }); }
    case "traps": { const t = weightedTopic(0.6); return pick(t, (q) => q.trap || q.type === "TF"); }
    case "type": { const t = weightedTopic(0.5); const q = await pick(t, (q) => q.type === s.type); return q || pick(rnd(DATA.index.topics).id, (q) => q.type === s.type); }
    case "speed": { const t = weightedTopic(0.5); const q = await pick(t, (q) => q.type === "TF" || (q.type === "MCQ" && q.difficulty === "Easy")); if (q) q.targetSeconds = 45; return q; }
    case "grave": { const g = s.graveList[s.n - 1]; return g ? graveQuestion(g) : null; }
    case "weak": { const subs = weakConcepts(); if (!subs.length) return pick(weightedTopic(1), () => true, { adaptive: true }); const w = subs[(s.n - 1) % Math.min(subs.length, 5)]; const wq = await pick(w.topic, (q) => q.subtopic === w.sub || (q.cov || []).some((c) => w.cov.includes(c))); return wq || pick(w.topic); }
    default: return null;
  }
}
function weakConcepts() {
  const by = {};
  for (const h of S.hist.slice(-300)) { const k = h.topic + "|" + (h.sub || "general"); (by[k] = by[k] || { topic: h.topic, sub: h.sub, cov: h.cov || [], n: 0, s: 0 }); by[k].n++; by[k].s += h.score; }
  return Object.values(by).filter((x) => x.n >= 1 && x.s / x.n < 0.85).sort((a, b) => a.s / a.n - b.s / b.n);
}

async function startSession(o) {
  await loadIndex();
  SESSION = { ...o, n: 0, correct: 0, total: 0, log: [] };
  if (o.mode === "ids") { const qs = await loadQs(o.topic); SESSION.fixed = o.ids.map((id) => qs.find((q) => q.id === id)).filter(Boolean); }
  if (o.mode === "diag") SESSION.fixed = await diagnosticSet();
  if (o.mode === "stage") {
    const qs = await loadQs(o.topic); let pool;
    if (o.stage === "training") pool = qs.filter((q) => !q.isCalculation && ["Easy", "Medium"].includes(q.difficulty));
    else if (o.stage === "calc") pool = qs.filter((q) => q.isCalculation);
    else pool = qs.filter((q) => q.trap || q.type === "TF");
    if (pool.length < 5) pool = qs;
    let set = shuffle(preferUnseen(pool)).slice(0, 5);
    if (o.stage === "calc" && GEN[o.topic]) set = set.map((q, i) => (i % 2 ? freshQuestion(o.topic, rnd(GEN[o.topic].kinds)) : q));
    SESSION.fixed = set; SESSION.title = { training: "Training Ground", calc: "Calc Arena", traps: "Trap Room" }[o.stage];
  }
  if (o.mode === "boss") { const qs = await loadQs(o.topic); let hard = shuffle(qs.filter((q) => ["Hard", "Exam+"].includes(q.difficulty))); const types = new Set(); const set = []; for (const q of hard) { if (set.length < 5 && (!types.has(q.type) || hard.length < 12)) { set.push(q); types.add(q.type); } } while (set.length < 5) set.push(rnd(qs)); SESSION.fixed = set; SESSION.title = "🐉 Boss Battle"; }
  if (o.mode === "speed") SESSION.limit = 10;
  if (o.mode === "grave") { if (!Object.keys(S.grave).length) { toast("Your graveyard is empty. Nice!"); return; } SESSION.graveList = Object.values(S.grave).sort((a, b) => a.due - b.due); SESSION.limit = SESSION.graveList.length; }
  if (o.mode === "weak" && !weakConcepts().length && S.hist.length) toast("No weak concepts yet: training your lowest-mastery topics.");
  S.hearts = 3; save();
  if (location.hash === "#quiz") route(); else location.hash = "#quiz";
}
async function diagnosticSet() {
  const want = [["search", "MCQ"], ["trees", "BLANK"], ["bayes", "MATCH"], ["cnn", "BLANKS"], ["detect", "TF"], ["mdp", "MULTI"]];
  const out = [];
  for (const [t, ty] of want) { const qs = await loadQs(t); const c = qs.filter((q) => q.type === ty && ["Easy", "Medium"].includes(q.difficulty)); out.push(rnd(c.length ? c : qs.filter((q) => q.type === ty))); }
  return out;
}

// ---------------- quiz rendering ----------------
let CUR = null; // {q, resp, start, done}
async function renderQuizStep() {
  const q = await nextQ();
  if (!q) return finishSession();
  CUR = { q, resp: initResp(q), start: Date.now(), done: false };
  S.seen[q.id] = (S.seen[q.id] || 0) + 1;
  drawQuestion();
}
function initResp(q) { if (q.type === "MULTI") return []; if (q.type === "BLANKS") return q.answer.map(() => ""); if (q.type === "MATCH") return {}; return null; }
function header() {
  const s = SESSION; const t = topicMeta(CUR.q.topic);
  const title = s.title || { play: "PLAY", calc: "CALC", traps: "TRAPS", speed: "SPEED", grave: "GRAVEYARD", weak: "WEAK", mixed: "MIXED", type: "TYPE " + s.type, diag: "Diagnostic", ids: "Check", boss: "Boss" }[s.mode] || "Practice";
  const of = s.fixed ? ` ${s.n}/${s.n + s.fixed.length}` : s.limit ? ` ${s.n}/${s.limit}` : ` #${s.n}`;
  return `${statusLine()}<div class="row"><button class="btn ghost" id="quit">✕</button><b class="grow">${title}${of}</b><span class="timer" id="timer">0s / ${CUR.q.targetSeconds}s</span></div>`;
}
function drawQuestion() {
  const q = CUR.q; const t = topicMeta(q.topic);
  const numeric = (a) => /^[-−]?\d|^\d*\.\d/.test(String(a));
  let body = "";
  if (q.type === "MCQ" || q.type === "MULTI") body = q.options.map((o, i) => `<button class="opt" data-opt="${LET[i]}"><span class="l">${LET[i]}</span><span>${o}</span></button>`).join("");
  else if (q.type === "TF") body = `<div class="tf"><button class="opt" data-tf="true">True</button><button class="opt" data-tf="false">False</button></div>`;
  else if (q.type === "BLANK") body = `<div class="field"><label>Your answer${q.format ? ` (${esc(q.format)})` : ""}</label><input id="b0" ${numeric(q.answer) ? 'inputmode="decimal"' : ""} autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done"></div>`;
  else if (q.type === "BLANKS") body = q.answer.map((a, i) => `<div class="field"><label>${i + 1}. ${esc(q.blanks ? q.blanks[i] : "Blank " + (i + 1))}</label><input id="b${i}" ${numeric(a) ? 'inputmode="decimal"' : ""} autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></div>`).join("") + (q.format ? `<div class="muted small">Format: ${esc(q.format)}</div>` : "");
  else if (q.type === "MATCH") body = `<div class="match-right">${q.right.map((r, i) => `<div><b>${LET[i]}.</b> ${r}</div>`).join("")}</div>` + q.left.map((l, i) => `<div class="field"><label>${i + 1}. ${l}</label><select id="m${i}"><option value="">Choose…</option>${q.right.map((r, j) => `<option value="${LET[j]}">${LET[j]}. ${esc(r.replace(/<[^>]+>/g, ""))}</option>`).join("")}</select></div>`).join("");
  app.innerHTML = header() + `<div class="card pop" id="qcard"><div class="row wrap" style="gap:6px;margin-bottom:8px"><span class="chip type">[${q.type}]</span><span class="chip diff-${q.difficulty}">${q.difficulty}</span><span class="chip">${t.icon} ${t.name}</span>${q.isCalculation ? '<span class="chip">🧮 calc</span>' : ""}${q.combo ? '<span class="chip" style="background:#fde68a">⚡ COMBO ×2 XP</span>' : ""}${q.graveOf ? '<span class="chip">🪦 revenge</span>' : ""}</div>
    <div class="muted small" style="margin-bottom:6px">${TYPE_NAMES[q.type]}${q.type === "MULTI" ? ": select all that apply" : ""} · target ${q.targetSeconds}s${q.subtopic ? " · " + esc(q.subtopic) : ""}</div>
    <div class="qstem">${q.stem}</div>${q.visual ? `<div class="qvis">${q.visual}</div>` : ""}<div id="ans">${body}</div>
    <button class="btn block" id="check" style="margin-top:12px">Check answer</button></div><div id="fb"></div>` + tabbar("practice");
  $("#quit").onclick = () => { if (SESSION.total) finishSession(); else location.hash = "#practice"; };
  $$("[data-opt]").forEach((b) => b.onclick = () => { if (CUR.done) return; const L = b.dataset.opt;
    if (q.type === "MCQ") { CUR.resp = L; $$("[data-opt]").forEach((x) => x.classList.toggle("sel", x === b)); }
    else { const i = CUR.resp.indexOf(L); if (i >= 0) CUR.resp.splice(i, 1); else CUR.resp.push(L); b.classList.toggle("sel"); } });
  $$("[data-tf]").forEach((b) => b.onclick = () => { if (CUR.done) return; CUR.resp = b.dataset.tf === "true"; $$("[data-tf]").forEach((x) => x.classList.toggle("sel", x === b)); });
  $$("#ans input").forEach((inp) => inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); const nxt = inp.closest(".field").nextElementSibling?.querySelector("input"); if (nxt) nxt.focus(); else $("#check").click(); } }));
  $("#check").onclick = check;
  clearInterval(timerInt); timerInt = setInterval(() => { const el = $("#timer"); if (!el) return clearInterval(timerInt); const s = Math.round((Date.now() - CUR.start) / 1000); el.textContent = `${s}s / ${q.targetSeconds}s`; el.classList.toggle("over", s > q.targetSeconds); }, 1000);
}
function collect() {
  const q = CUR.q;
  if (q.type === "BLANK") CUR.resp = $("#b0").value;
  if (q.type === "BLANKS") CUR.resp = q.answer.map((_, i) => $("#b" + i).value);
  if (q.type === "MATCH") { CUR.resp = {}; q.left.forEach((_, i) => (CUR.resp[String(i + 1)] = $("#m" + i).value)); }
}
function check() {
  if (CUR.done) return; collect(); const q = CUR.q;
  const empty = CUR.resp === null || CUR.resp === "" || (Array.isArray(CUR.resp) && (q.type === "MULTI" ? CUR.resp.length === 0 : CUR.resp.every((x) => !String(x).trim()))) || (q.type === "MATCH" && Object.values(CUR.resp).every((v) => !v));
  if (empty) { toast("Commit to an answer first."); return; }
  CUR.done = true; clearInterval(timerInt);
  const secs = Math.round((Date.now() - CUR.start) / 1000);
  const r = grade(q, CUR.resp); const s = SESSION;
  s.total++; if (r.ok) s.correct++;
  // XP
  let xp = 0; const parts = [];
  if (r.ok) { xp += q.isCalculation ? 20 : 10; parts.push(q.isCalculation ? "+20 calc" : "+10"); if (secs <= q.targetSeconds) { xp += 5; parts.push("+5 speed"); } if (q.graveOf) { xp += 15; parts.push("+15 fixed a past mistake"); } if (q.combo) { xp *= 2; parts.push("×2 combo"); } }
  const prevLevel = level(); S.xp += xp;
  // streak, hearts, combo
  if (r.ok) { S.streak++; S.best = Math.max(S.best, S.streak); if (S.streak === 5 || S.streak === 10 || (S.streak > 10 && S.streak % 10 === 0)) { S.combo = 1; setTimeout(() => toast(`🔥 ${S.streak} streak! COMBO unlocked: next question is a harder bonus worth double XP.`, 3000), 400); } }
  else { S.streak = 0; if (!["diag", "ids"].includes(s.mode)) S.hearts = Math.max(0, S.hearts - 1); }
  // adaptive level per topic
  const run = (S.run[q.topic] = S.run[q.topic] || { c: 0, w: 0 });
  if (r.ok) { run.c++; run.w = 0; if (run.c >= 3) { S.lvl[q.topic] = Math.min(3, (S.lvl[q.topic] || 0) + 1); run.c = 0; } } else { run.w++; run.c = 0; if (run.w >= 2) { S.lvl[q.topic] = Math.max(0, (S.lvl[q.topic] || 0) - 1); run.w = 0; } }
  // graveyard
  const gid = q.graveOf || q.id; const kind = kindOf(q);
  if (!r.ok) { const g = S.grave[gid] || { id: gid, topic: q.topic, kind, right: 0, sub: q.subtopic }; g.right = 0; g.due = S.answered + 3 + Math.floor(Math.random() * 3); g.when = Date.now(); S.grave[gid] = g; }
  else if (q.graveOf && S.grave[gid]) { const g = S.grave[gid]; g.right++; if (g.right >= 2) { delete S.grave[gid]; setTimeout(() => toast("🪦 → ✨ Mistake removed from the graveyard (right twice)!"), 600); } else g.due = S.answered + 8; }
  S.answered++; S.sinceReport++;
  S.hist.push({ id: q.id, topic: q.topic, sub: q.subtopic, cov: q.cov, type: q.type, score: r.score, ok: r.ok, secs, target: q.targetSeconds, ts: Date.now(), mode: s.mode });
  if (S.hist.length > 3000) S.hist = S.hist.slice(-3000);
  s.log.push({ q, ok: r.ok, secs });
  save();
  if (xp) xpFly(`+${xp} XP`);
  $("#qcard").classList.add(r.ok ? "pop" : "shake");
  markAnswers(q, r);
  $("#fb").innerHTML = feedbackHTML(q, r, xp, parts, secs) + `<button class="btn block" id="next">${S.hearts === 0 ? "💀 Respawn" : "Next question ›"}</button>`;
  $("#check").remove();
  const why = $("#whybtn"); if (why) why.onclick = () => { $("#whybox").style.display = "block"; why.remove(); S.xp += 1; save(); xpFly("+1 XP"); };
  $("#next").onclick = () => afterAnswer(r.ok);
  if (level() > prevLevel) setTimeout(() => modal(`<h2>🎉 Level ${level()}!</h2><p>New rank: <b>${rank()}</b></p><button class="btn block" data-close>Keep going</button>`), 500);
}
function markAnswers(q, r) {
  if (q.type === "MCQ") $$("[data-opt]").forEach((b) => { if (b.dataset.opt === q.answer) b.classList.add("right"); else if (b.dataset.opt === CUR.resp) b.classList.add("wrong"); });
  if (q.type === "MULTI") $$("[data-opt]").forEach((b) => { const L = b.dataset.opt; const want = q.answer.includes(L), got = CUR.resp.includes(L); if (want) b.classList.add("right"); else if (got) b.classList.add("wrong"); });
  if (q.type === "TF") $$("[data-tf]").forEach((b) => { const v = b.dataset.tf === "true"; if (v === q.answer) b.classList.add("right"); else if (v === CUR.resp) b.classList.add("wrong"); });
  if (q.type === "BLANK") $("#b0").closest(".field").classList.add(r.ok ? "right" : "wrong");
  if (q.type === "BLANKS") r.parts.forEach((p, i) => $("#b" + i).closest(".field").classList.add(p.ok ? "right" : "wrong"));
  if (q.type === "MATCH") r.parts.forEach((p, i) => $("#m" + i).closest(".field").classList.add(p.ok ? "right" : "wrong"));
  $$("#ans input, #ans select").forEach((x) => (x.disabled = true));
}
function feedbackHTML(q, r, xp, parts, secs) {
  const cls = r.ok ? "ok" : r.score > 0 ? "part" : "bad";
  const head = r.ok ? "✅ Correct" : r.score > 0 ? `🟡 Partly right (${r.partial})` : "❌ Incorrect";
  let why = "";
  if (q.whyWrong && (q.type === "MCQ" || q.type === "MULTI")) why = `<h3>Why each option is right or wrong</h3><ul class="steps">${Object.entries(q.whyWrong).map(([k, v]) => `<li><b>${k}.</b> ${v}</li>`).join("")}</ul>`;
  if (q.type === "TF") why = q.trap && r.ok ? `<button class="btn sec" id="whybtn">Why? (+1 XP)</button><div id="whybox" style="display:none" class="take">${q.why}</div>` : `<div class="take">${q.why || ""}</div>`;
  if (q.type === "MATCH") why = `<h3>Correct matches</h3><ul class="steps">${q.left.map((l, i) => `<li>${l} → <b>${q.answer[String(i + 1)]}</b>. ${q.right[LET.indexOf(q.answer[String(i + 1)])]}</li>`).join("")}</ul>`;
  const slow = secs > q.targetSeconds ? `<div class="muted small">⏱️ ${secs}s (target ${q.targetSeconds}s). Time tip: ${TIME_TIPS[q.topic] || "Write the formula first, then substitute."}</div>` : `<div class="muted small">⏱️ ${secs}s (target ${q.targetSeconds}s)</div>`;
  return `<div class="fb ${cls} pop"><h3>${head} ${xp ? `· +${xp} XP` : ""}</h3><div class="small">${parts.join(" · ")}</div>${statusLine()}
   ${!r.ok ? `<div><b>Answer:</b> ${answerText(q)}</div>` : ""}${r.notes.map((n) => `<div class="small">⚠️ ${n}</div>`).join("")}</div>
   <div class="card"><h3 style="margin-top:0">Full solution</h3><ol class="steps">${(q.solutionSteps || []).map((s) => `<li>${s}</li>`).join("") || `<li>${answerText(q)}</li>`}</ol>${why}
   ${q.takeaway ? `<div class="take">🔒 ${q.takeaway}</div>` : ""}${slow}<div class="muted tiny">Source: [${esc(q.source)}]</div></div>`;
}
async function afterAnswer(ok) {
  const s = SESSION;
  if (S.hearts === 0) return respawn();
  if (s.mode === "boss" && s.fixed && !s.fixed.length) return finishSession();
  if (S.sinceReport >= 10 && !["diag", "ids"].includes(s.mode)) { S.sinceReport = 0; save(); return miniReport(() => renderQuizStep()); }
  renderQuizStep();
}
async function respawn() {
  const q = CUR.q; const L = await loadLearn(q.topic); const card = L.cards.find((c) => (c.cov || []).some((x) => (q.cov || []).includes(x))) || L.cards[0];
  const m = modal(`<h2>💀 Out of hearts: Respawn</h2><p class="muted">60-second mini-lesson on what you keep missing. Read it, then retry.</p>${cardHTML(card)}<div class="bar"><i id="rbar" style="width:0%"></i></div><button class="btn block" id="rbtn" disabled style="margin-top:10px">Retry (60)</button>`);
  let t = 60; const iv = setInterval(() => { t--; const b = $("#rbtn", m); if (!b) return clearInterval(iv); $("#rbar", m).style.width = ((60 - t) / 60) * 100 + "%"; b.textContent = t > 0 ? `Retry (${t})` : "Retry ↻"; if (t <= 0) { clearInterval(iv); b.disabled = false; } }, 1000);
  $("#rbtn", m).onclick = async () => { m.remove(); S.hearts = 3; save(); const g = S.grave[q.graveOf || q.id]; const rq = g ? await graveQuestion(g) : q; SESSION.inject = rq; SESSION.n--; renderQuizStep(); };
}
function miniReport(cont) {
  const last = S.hist.slice(-10); const sc = last.filter((h) => h.ok).length;
  const weak = weakConcepts()[0]; const missed = SESSION.log.filter((l) => !l.ok).pop();
  modal(`<h2>📊 Mini report (last 10)</h2><p><b>${sc}/10</b> correct · Level ${level()} · ${rank()}</p>
   ${DATA.index.topics.filter((t) => mastery(t.id) !== null).map((t) => `<div class="mastery-row"><span>${t.icon}</span><div class="bar"><i style="width:${mastery(t.id)}%;background:${t.color}"></i></div><span class="small">${mastery(t.id)}%</span></div>`).join("")}
   <p><b>Weakest concept:</b> ${weak ? `${topicMeta(weak.topic).icon} ${esc(weak.sub || weak.topic)} (${Math.round((100 * weak.s) / weak.n)}%)` : "none yet"}</p>
   <div class="take">💡 Tip: ${missed ? missed.q.takeaway : "Keep the streak going: mix calculation and concept questions."}</div><button class="btn block" data-close>Continue</button>`, cont);
}
function finishSession() {
  clearInterval(timerInt); const s = SESSION; if (!s) { location.hash = "#practice"; return; }
  let extra = "";
  if (s.mode === "boss") { const pass = s.correct >= 4; if (pass) { S.cleared[s.topic] = true; S.xp += 50; } extra = pass ? `<h2>👑 Boss defeated! +50 XP</h2><p>${topicMeta(s.topic).world} cleared.</p>` : `<h2>🐉 The boss survived</h2><p>You need 4/5. Review the Learn Cards and the Trap Room, then try again.</p>`; }
  if (s.mode === "diag") { S.diag = true; const idx = DATA.index; const wrong = s.log.filter((l) => !l.ok).map((l) => l.q.topic); const rec = wrong[0] || "search"; extra = `<h2>🧪 Diagnostic complete</h2><p>Recommended first world: <b>${topicMeta(rec).icon} ${topicMeta(rec).world}</b> (${topicMeta(rec).name}).</p><button class="btn block" data-go="#world/${rec}">Enter ${topicMeta(rec).world}</button>`; }
  save();
  const acc = s.total ? Math.round((100 * s.correct) / s.total) : 0;
  app.innerHTML = statusLine() + `<div class="card pop"><h1>Session complete</h1><p><b>${s.correct}/${s.total}</b> correct (${acc}%)</p>${extra}
   <div class="list">${s.log.map((l) => `<div class="item" style="cursor:default"><span class="ic">${l.ok ? "✅" : "❌"}</span><div class="grow small">${l.q.stem.replace(/<[^>]+>/g, "").slice(0, 110)}…</div><span class="small muted">${l.secs}s</span></div>`).join("")}</div>
   <div class="row" style="margin-top:12px"><button class="btn sec grow" data-go="#home">Home</button><button class="btn grow" id="again">Play again</button></div></div>` + tabbar("practice");
  $$("[data-go]").forEach((el) => el.addEventListener("click", () => (location.hash = el.dataset.go)));
  $("#again").onclick = () => startSession({ mode: s.mode, topic: s.topic, type: s.type, stage: s.stage, ids: s.ids });
  SESSION = null;
}

// ---------------- mock exams ----------------
function viewMock() {
  const a = S.activeMock;
  return `<h1>Mock exam</h1>
  ${a ? `<div class="card"><b>Exam in progress</b><div class="muted small">${a.kind} · started ${new Date(a.start).toLocaleTimeString()}</div><button class="btn block" style="margin-top:8px" data-go="#mockrun">Resume</button></div>` : ""}
  <div class="card"><h2 style="margin-top:0">⏱️ MOCK: full exam</h2><p class="muted">100 minutes · ${S.settings.mockCount} questions (change in Profile) · all six question types in the exam mix · topics weighted toward the hand-calculation topics. No feedback until you submit.</p><button class="btn block" data-mock="full">Start 100-minute mock</button></div>
  <div class="card"><h2 style="margin-top:0">⏱️ HALF mock</h2><p class="muted">50 minutes · ${S.settings.halfCount} questions · same rules.</p><button class="btn block sec" data-mock="half">Start 50-minute half mock</button></div>
  <div class="card"><b>Before you start</b><ul class="steps small"><li>Note your start time (it is also recorded automatically).</li><li>Use only what the real exam allows (calculator if permitted).</li><li>The real question count is not confirmed: change it in Profile → Settings if you learn it.</li></ul></div>
  ${S.mocks.length ? `<h2>History</h2><div class="card list">${S.mocks.map((m, i) => `<div class="item" data-go="#mockreview/${i}"><span class="ic">📄</span><div class="grow"><b>${m.kind} · ${m.pct}%</b><div class="muted small">${new Date(m.start).toLocaleString()} · ${m.used} min used</div></div>›</div>`).reverse().join("")}</div>` : ""}`;
}
async function startMock(kind) {
  if (S.activeMock && !confirm("Replace the mock in progress?")) return;
  const all = await loadAllQs(); const N = kind === "full" ? S.settings.mockCount : S.settings.halfCount; const mins = kind === "full" ? 100 : 50;
  const mix = { MCQ: 0.4, MULTI: 0.15, TF: 0.15, BLANK: 0.1, BLANKS: 0.1, MATCH: 0.1 };
  const types = []; for (const [t, p] of Object.entries(mix)) for (let i = 0; i < Math.round(p * N); i++) types.push(t);
  while (types.length < N) types.push("MCQ"); types.length = N;
  const used = new Set(); const qs = [];
  for (const ty of shuffle(types)) {
    for (let tries = 0; tries < 30; tries++) {
      const t = weightedTopic(0); const pool = all.filter((q) => q.topic === t && q.type === ty && !used.has(q.id) && q.difficulty !== "Easy");
      if (pool.length) { const q = rnd(preferUnseen(pool)); used.add(q.id); qs.push(q); break; }
      if (tries === 29) { const p2 = all.filter((q) => q.type === ty && !used.has(q.id)); const q = rnd(p2); used.add(q.id); qs.push(q); }
    }
  }
  S.activeMock = { kind: kind === "full" ? "MOCK (100 min)" : "HALF (50 min)", start: Date.now(), mins, qs, resp: qs.map(initResp), time: qs.map(() => 0), flag: qs.map(() => false), cur: 0 };
  save(); location.hash = "#mockrun";
}
let mockTick = null;
function renderMock() {
  const M = S.activeMock; if (!M) { location.hash = "#mock"; return; }
  const q = M.qs[M.cur]; const t = topicMeta(q.topic); const resp = M.resp[M.cur];
  const left = Math.max(0, M.start + M.mins * 60000 - Date.now());
  let body = "";
  if (q.type === "MCQ" || q.type === "MULTI") body = q.options.map((o, i) => `<button class="opt ${(q.type === "MCQ" ? resp === LET[i] : (resp || []).includes(LET[i])) ? "sel" : ""}" data-mopt="${LET[i]}"><span class="l">${LET[i]}</span><span>${o}</span></button>`).join("");
  else if (q.type === "TF") body = `<div class="tf"><button class="opt ${resp === true ? "sel" : ""}" data-mtf="true">True</button><button class="opt ${resp === false ? "sel" : ""}" data-mtf="false">False</button></div>`;
  else if (q.type === "BLANK") body = `<div class="field"><label>Answer${q.format ? ` (${esc(q.format)})` : ""}</label><input id="mb0" value="${esc(resp || "")}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="${/^[-−]?\d|^\d*\.\d/.test(q.answer) ? "decimal" : "text"}"></div>`;
  else if (q.type === "BLANKS") body = q.answer.map((a, i) => `<div class="field"><label>${i + 1}. ${esc(q.blanks ? q.blanks[i] : "Blank " + (i + 1))}</label><input id="mb${i}" value="${esc((resp || [])[i] || "")}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></div>`).join("");
  else if (q.type === "MATCH") body = `<div class="match-right">${q.right.map((r, i) => `<div><b>${LET[i]}.</b> ${r}</div>`).join("")}</div>` + q.left.map((l, i) => `<div class="field"><label>${i + 1}. ${l}</label><select id="mm${i}"><option value="">Choose…</option>${q.right.map((r, j) => `<option value="${LET[j]}" ${(resp || {})[String(i + 1)] === LET[j] ? "selected" : ""}>${LET[j]}. ${esc(r.replace(/<[^>]+>/g, ""))}</option>`).join("")}</select></div>`).join("");
  app.innerHTML = `<div class="status" style="justify-content:space-between"><span class="chip">${M.kind}</span><span class="bigtime" id="mclock">${fmtT(left)}</span></div>
  <div class="qnav">${M.qs.map((_, i) => `<button data-jump="${i}" class="${answered(M.resp[i], M.qs[i]) ? "ans" : ""} ${i === M.cur ? "cur" : ""} ${M.flag[i] ? "flag" : ""}">${i + 1}</button>`).join("")}</div>
  <div class="card"><div class="row wrap" style="gap:6px;margin-bottom:8px"><span class="chip type">[${q.type}]</span><span class="chip">${t.icon} ${t.name}</span><span class="chip">Q${M.cur + 1}/${M.qs.length}</span></div><div class="muted small">${TYPE_NAMES[q.type]}${q.type === "MULTI" ? ": select all that apply" : ""}</div>
  <div class="qstem">${q.stem}</div>${q.visual ? `<div class="qvis">${q.visual}</div>` : ""}<div>${body}</div></div>
  <div class="row"><button class="btn sec" id="mprev">‹</button><button class="btn sec grow" id="mflag">${M.flag[M.cur] ? "Unflag" : "🚩 Flag"}</button><button class="btn sec" id="mnext">›</button></div>
  <button class="btn block bad" id="msubmit" style="margin-top:10px">Submit exam</button>` + tabbar("mock");
  const enter = Date.now();
  const store = () => { M.time[M.cur] += Math.round((Date.now() - enter) / 1000);
    if (q.type === "BLANK") M.resp[M.cur] = $("#mb0").value;
    if (q.type === "BLANKS") M.resp[M.cur] = q.answer.map((_, i) => $("#mb" + i).value);
    if (q.type === "MATCH") { const o = {}; q.left.forEach((_, i) => (o[String(i + 1)] = $("#mm" + i).value)); M.resp[M.cur] = o; } save(); };
  const go = (i) => { store(); M.cur = Math.max(0, Math.min(M.qs.length - 1, i)); save(); renderMock(); window.scrollTo(0, 0); };
  $$("[data-mopt]").forEach((b) => b.onclick = () => { const L = b.dataset.mopt; if (q.type === "MCQ") M.resp[M.cur] = L; else { const a = M.resp[M.cur] || []; const i = a.indexOf(L); i >= 0 ? a.splice(i, 1) : a.push(L); M.resp[M.cur] = a; } go(M.cur); });
  $$("[data-mtf]").forEach((b) => b.onclick = () => { M.resp[M.cur] = b.dataset.mtf === "true"; go(M.cur); });
  $$("[data-jump]").forEach((b) => b.onclick = () => go(+b.dataset.jump));
  $("#mprev").onclick = () => go(M.cur - 1); $("#mnext").onclick = () => go(M.cur + 1);
  $("#mflag").onclick = () => { M.flag[M.cur] = !M.flag[M.cur]; go(M.cur); };
  $("#msubmit").onclick = () => { store(); const un = M.qs.filter((qq, i) => !answered(M.resp[i], qq)).length; if (!confirm(un ? `${un} unanswered. Submit anyway?` : "Submit the exam?")) return; submitMock(); };
  $$(".tabbar a").forEach((a) => a.addEventListener("click", store));
  clearInterval(mockTick); mockTick = setInterval(() => { const el = $("#mclock"); if (!el) return clearInterval(mockTick); const l = M.start + M.mins * 60000 - Date.now(); el.textContent = fmtT(Math.max(0, l)); if (l <= 0) { clearInterval(mockTick); store(); toast("⏰ Time is up: submitting."); submitMock(); } }, 1000);
}
const fmtT = (ms) => { const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
function answered(r, q) { if (r === null || r === undefined || r === "") return false; if (Array.isArray(r)) return q.type === "MULTI" ? r.length > 0 : r.some((x) => String(x).trim()); if (typeof r === "object") return Object.values(r).some((v) => v); return true; }
function submitMock() {
  clearInterval(mockTick); const M = S.activeMock; if (!M) return;
  const res = M.qs.map((q, i) => ({ q, resp: M.resp[i], r: grade(q, M.resp[i]), secs: M.time[i] }));
  const score = res.reduce((s, x) => s + x.r.score, 0); const pct = Math.round((100 * score) / res.length);
  for (const x of res) { S.hist.push({ id: x.q.id, topic: x.q.topic, sub: x.q.subtopic, cov: x.q.cov, type: x.q.type, score: x.r.score, ok: x.r.ok, secs: x.secs, ts: Date.now(), mode: "mock" }); if (!x.r.ok) S.grave[x.q.id] = { id: x.q.id, topic: x.q.topic, kind: kindOf(x.q), right: 0, due: S.answered + 3, sub: x.q.subtopic }; }
  S.answered += res.length;
  S.mocks.push({ kind: M.kind, start: M.start, end: Date.now(), used: Math.round((Date.now() - M.start) / 60000), pct, score: +score.toFixed(2), n: res.length, items: res.map((x) => ({ id: x.q.id, topic: x.q.topic, type: x.q.type, sub: x.q.subtopic, resp: x.resp, score: x.r.score, secs: x.secs })), qs: M.qs });
  if (S.mocks.length > 10) S.mocks.shift();
  S.xp += Math.round(score * 10); S.activeMock = null; save();
  location.hash = `#mockreview/${S.mocks.length - 1}`;
}
function viewMockReview(i) {
  const m = S.mocks[i]; if (!m) return `<div class="card">Not found.</div>`;
  const by = (key) => { const o = {}; m.items.forEach((x) => { const k = x[key]; (o[k] = o[k] || { n: 0, s: 0 }); o[k].n++; o[k].s += x.score; }); return o; };
  const bt = by("topic"), bty = by("type");
  const slow = m.items.map((x, j) => ({ ...x, j })).sort((a, b) => b.secs - a.secs).slice(0, 5);
  const weakT = Object.entries(bt).sort((a, b) => a[1].s / a[1].n - b[1].s / b[1].n).slice(0, 3);
  return `<button class="btn ghost" data-go="#mock">‹ Mock</button><h1>${m.kind} review</h1>
  <div class="hero"><h1>${m.pct}%</h1><div>${m.score}/${m.n} marks · started ${new Date(m.start).toLocaleTimeString()} · finished ${new Date(m.end).toLocaleTimeString()} · ${m.used} min</div></div>
  <div class="card"><h3 style="margin-top:0">By topic</h3>${Object.entries(bt).map(([k, v]) => `<div class="mastery-row"><span>${topicMeta(k).icon}</span><div class="bar"><i style="width:${(100 * v.s) / v.n}%;background:${topicMeta(k).color}"></i></div><span class="small">${v.s.toFixed(1)}/${v.n}</span></div>`).join("")}</div>
  <div class="card"><h3 style="margin-top:0">By question type</h3>${Object.entries(bty).map(([k, v]) => `<div class="mastery-row"><span class="tiny" style="font-size:9px">${k}</span><div class="bar"><i style="width:${(100 * v.s) / v.n}%"></i></div><span class="small">${v.s.toFixed(1)}/${v.n}</span></div>`).join("")}</div>
  <div class="card"><h3 style="margin-top:0">Slowest questions</h3><ol class="steps">${slow.map((x) => `<li>Q${x.j + 1} (${topicMeta(x.topic).icon} ${x.type}): ${x.secs}s ${x.score === 1 ? "✅" : "❌"}</li>`).join("")}</ol></div>
  <div class="card"><h3 style="margin-top:0">Revision plan for next session</h3><ol class="steps">${weakT.map(([k, v]) => `<li>${topicMeta(k).icon} <b>${topicMeta(k).name}</b> (${Math.round((100 * v.s) / v.n)}%): reread its Learn Cards and cheat sheet, then run its Trap Room and Calc Arena. <a href="#world/${k}">Go ›</a></li>`).join("")}<li>Replay the GRAVEYARD (every wrong answer was added).</li><li>Then one SPEED round to rebuild pace.</li></ol></div>
  <h2>All questions</h2>${m.qs.map((q, j) => { const it = m.items[j]; const r = grade(q, it.resp); return `<details class="card"><summary><b>Q${j + 1}</b> ${r.ok ? "✅" : r.score > 0 ? "🟡" : "❌"} <span class="chip type">[${q.type}]</span> ${topicMeta(q.topic).icon} ${it.secs}s</summary><div class="qstem" style="margin-top:8px">${q.stem}</div>${q.visual ? `<div class="qvis">${q.visual}</div>` : ""}${q.options ? `<ol type="A" class="small">${q.options.map((o) => `<li>${o}</li>`).join("")}</ol>` : ""}${q.left ? `<div class="small">${q.left.map((l, i) => `${i + 1}. ${l}`).join("<br>")}<br>${q.right.map((r2, i) => `${LET[i]}. ${r2}`).join("<br>")}</div>` : ""}<p><b>Your answer:</b> ${esc(fmtResp(q, it.resp))}<br><b>Correct:</b> ${answerText(q)}</p><ol class="steps">${(q.solutionSteps || []).map((s) => `<li>${s}</li>`).join("")}</ol>${q.whyWrong ? `<ul class="steps small">${Object.entries(q.whyWrong).map(([k, v]) => `<li><b>${k}.</b> ${v}</li>`).join("")}</ul>` : ""}${q.why ? `<div class="take">${q.why}</div>` : ""}${q.takeaway ? `<div class="take">🔒 ${q.takeaway}</div>` : ""}</details>`; }).join("")}`;
}
function fmtResp(q, r) { if (r === null || r === undefined || r === "") return "(blank)"; if (q.type === "TF") return r ? "True" : "False"; if (Array.isArray(r)) return r.join(q.type === "MULTI" ? ", " : " · "); if (typeof r === "object") return Object.entries(r).map(([k, v]) => `${k}-${v || "?"}`).join(", "); return String(r); }

// ---------------- profile ----------------
function viewProfile() {
  const idx = DATA.index; const l = level();
  const acc = S.hist.length ? Math.round((100 * S.hist.filter((h) => h.ok).length) / S.hist.length) : 0;
  const g = Object.values(S.grave);
  return `<h1>Profile</h1>
  <div class="hero"><div class="small">STATUS</div><h1>${rank()} · Lvl ${l}</h1><div>${S.xp} XP · 🔥 ${S.streak} (best ${S.best}) · ${S.answered} answered · ${acc}% accuracy</div></div>
  <div class="card"><h3 style="margin-top:0">Ranks</h3>${RANKS.map(([m, n]) => `<div class="small">${l >= m ? "✅" : "⬜️"} Lvl ${m}+ · ${n}</div>`).join("")}</div>
  <div class="card"><h3 style="margin-top:0">Mastery (last 10 answers per topic; 85% = mastered)</h3>${idx.topics.map((t) => { const m = mastery(t.id); return `<div class="mastery-row"><span>${t.icon}</span><div><div class="small">${t.name} · ${DIFFS[S.lvl[t.id] || 0]}${S.cleared[t.id] ? " · 👑" : ""}</div><div class="bar"><i style="width:${m ?? 0}%;background:${t.color}"></i></div></div><span class="small">${m === null ? "–" : m + "%"}</span></div>`; }).join("")}</div>
  <div class="card"><h3 style="margin-top:0">🪦 Mistake Graveyard (${g.length})</h3>${g.length ? `<div class="small">${g.slice(-12).map((x) => `${topicMeta(x.topic).icon} ${esc(x.sub || x.id)} · right ${x.right}/2`).join("<br>")}</div><button class="btn block" style="margin-top:8px" data-start='{"mode":"grave"}'>Replay graveyard</button>` : `<p class="muted">Empty. Wrong answers land here and come back in a new form until you get them right twice.</p>`}</div>
  <div class="card"><h3 style="margin-top:0">⚙️ Settings</h3><div class="field"><label>Full mock: number of questions (100 min)</label><input id="smc" inputmode="numeric" value="${S.settings.mockCount}"></div><div class="field"><label>Half mock: number of questions (50 min)</label><input id="shc" inputmode="numeric" value="${S.settings.halfCount}"></div><button class="btn sec block" id="ssave">Save settings</button></div>
  <div class="card"><h3 style="margin-top:0">💾 Backup</h3><p class="muted small">iOS can clear website storage. Export regularly and import to restore.</p><div class="row"><button class="btn grow" id="exp">Export progress</button><label class="btn sec grow" style="position:relative">Import<input type="file" id="imp" accept="application/json,.json" style="position:absolute;inset:0;opacity:0"></label></div><button class="btn ghost block" id="reset" style="color:var(--bad)">Reset all progress</button></div>
  <p class="muted tiny" style="text-align:center">AI Quest · content v${idx.version} · ${idx.total} questions</p>`;
}
function bindProfile() {
  $("#ssave").onclick = () => { S.settings.mockCount = Math.max(5, Math.min(120, parseInt($("#smc").value) || 40)); S.settings.halfCount = Math.max(5, Math.min(80, parseInt($("#shc").value) || 20)); save(); toast("Saved"); };
  $("#exp").onclick = () => { const blob = new Blob([JSON.stringify(S)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `ai-quest-progress-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove(); };
  $("#imp").onchange = async (e) => { const f = e.target.files[0]; if (!f) return; try { const o = JSON.parse(await f.text()); if (typeof o.xp !== "number") throw 0; S = { ...structuredClone(DEF), ...o }; save(); toast("Progress imported"); route(); } catch { toast("That file is not an AI Quest backup."); } };
  $("#reset").onclick = () => { if (confirm("Reset ALL progress? Export first if unsure.")) { S = structuredClone(DEF); save(); route(); } };
}

// ---------------- boot ----------------
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
route();
