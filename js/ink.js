// Ink layer: draw / highlight / erase on top of any page (Apple Pencil first) + docked scratch panel.
// Strokes are saved per page key in localStorage. Coordinates are stored relative to the centred
// #app column, so ink stays on the right words when the iPad rotates.
const KEY = "aiquest-ink-v1";
const PEN = ["auto", "#ef4444", "#2563eb", "#16a34a", "#f59e0b", "#a855f7"];
const HL = ["#fde047", "#86efac", "#93c5fd", "#f9a8d4"];
const SIZES = [1.5, 3, 5, 9];
let store = {}; try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { store = {}; }
const saveStore = () => {
  try {
    const keys = Object.keys(store);
    if (keys.length > 400) keys.sort((a, b) => (store[a].t || 0) - (store[b].t || 0)).slice(0, keys.length - 400).forEach((k) => delete store[k]);
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch { toastInk("Storage is full: clear some old ink to keep saving."); }
};
const prefs = Object.assign({ tool: "pen", color: "auto", hl: HL[0], size: 3, pencilOnly: true, scratchSize: 0.42 }, (() => { try { return JSON.parse(localStorage.getItem(KEY + "-prefs")) || {}; } catch { return {}; } })());
if (!PEN.includes(prefs.color)) prefs.color = "auto";
const savePrefs = () => { try { localStorage.setItem(KEY + "-prefs", JSON.stringify(prefs)); } catch {} };
const dark = () => matchMedia("(prefers-color-scheme: dark)").matches;
const resolve = (c) => (c === "auto" ? (dark() ? "#f5f5f7" : "#111827") : c);

// ---------- drawing engine ----------
function makeSurface(base, live, opts) {
  const bctx = base.getContext("2d"), lctx = live.getContext("2d");
  const s = { strokes: [], redo: [], cur: null, offset: opts.offset || (() => ({ x: 0, y: 0 })), onChange: opts.onChange || (() => {}), bg: opts.bg };
  let W = 0, Hh = 0;
  s.resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); const r = base.getBoundingClientRect(); W = r.width; Hh = r.height;
    for (const [cv, cx] of [[base, bctx], [live, lctx]]) { cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr); cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    s.render();
  };
  const width = (st, pr) => (st.k === "hl" ? st.w : st.w * (0.35 + 1.1 * (pr ?? 0.5)));
  const drawStroke = (ctx, st) => {
    const o = s.offset(); const p = st.p; if (!p.length) return;
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; const col = resolve(st.c); ctx.strokeStyle = col; ctx.fillStyle = col;
    if (st.k === "hl") { ctx.globalAlpha = dark() ? 0.42 : 0.38; ctx.globalCompositeOperation = dark() ? "screen" : "multiply"; ctx.lineCap = "butt"; }
    const P = (q) => [q[0] - o.x, q[1] - o.y];
    if (p.length === 1) { const [x, y] = P(p[0]); ctx.beginPath(); ctx.arc(x, y, width(st, p[0][2]) / 2, 0, 7); ctx.fill(); ctx.restore(); return; }
    if (st.k === "hl" || st.line) { // uniform width, single smooth path (no darker overlaps)
      ctx.lineWidth = width(st, 0.5); ctx.beginPath(); let [x0, y0] = P(p[0]); ctx.moveTo(x0, y0);
      for (let i = 1; i < p.length - 1; i++) { const [x1, y1] = P(p[i]), [x2, y2] = P(p[i + 1]); ctx.quadraticCurveTo(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2); }
      const [xe, ye] = P(p[p.length - 1]); ctx.lineTo(xe, ye); ctx.stroke(); ctx.restore(); return;
    }
    // pressure-sensitive smoothed pen: quadratic segments between midpoints
    let prev = P(p[0]);
    for (let i = 1; i < p.length; i++) {
      const a = P(p[i - 1]), b = P(p[i]); const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      ctx.lineWidth = width(st, (p[i - 1][2] + p[i][2]) / 2);
      ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.quadraticCurveTo(a[0], a[1], mid[0], mid[1]); ctx.stroke(); prev = mid;
    }
    const last = P(p[p.length - 1]); ctx.lineWidth = width(st, p[p.length - 1][2]); ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(last[0], last[1]); ctx.stroke();
    ctx.restore();
  };
  s.render = () => {
    bctx.clearRect(0, 0, W, Hh); if (s.bg) s.bg(bctx, W, Hh);
    const o = s.offset();
    for (const st of s.strokes) { const b = st.b; if (b && (b[3] < o.y - 60 || b[1] > o.y + Hh + 60)) continue; drawStroke(bctx, st); }
    s.renderLive();
  };
  s.renderLive = () => { lctx.clearRect(0, 0, W, Hh); if (s.cur) drawStroke(lctx, s.cur); };
  const pt = (e) => { const r = base.getBoundingClientRect(); const o = s.offset(); return [Math.round((e.clientX - r.left + o.x) * 10) / 10, Math.round((e.clientY - r.top + o.y) * 10) / 10, e.pointerType === "pen" && e.pressure ? +Math.min(1, e.pressure).toFixed(2) : 0.5]; };
  const bbox = (st) => { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; for (const [x, y] of st.p) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); } st.b = [a - st.w, b - st.w, c + st.w, d + st.w]; };
  const eraseAt = (x, y) => {
    const n = s.strokes.length;
    s.strokes = s.strokes.filter((st) => { if (st.b && (x < st.b[0] - 10 || x > st.b[2] + 10 || y < st.b[1] - 10 || y > st.b[3] + 10)) return true; return !st.p.some((q) => Math.hypot(q[0] - x, q[1] - y) < Math.max(14, st.w)); });
    if (s.strokes.length !== n) { s.redo = []; s.render(); s.onChange(); }
  };
  s.allow = (e) => !(prefs.pencilOnly && opts.respectPencilOnly && e.pointerType === "touch");
  let holdT = null;
  const armHold = () => { clearTimeout(holdT); holdT = setTimeout(() => { // hold still → straight line (like Apple Notes)
    const c = s.cur; if (!c || c.k === "eraser" || c.p.length < 4) return; const a = c.p[0], z = c.p[c.p.length - 1];
    if (Math.hypot(z[0] - a[0], z[1] - a[1]) < 25) return; c.p = [a, z]; c.line = true; s.renderLive(); }, 550); };
  live.addEventListener("pointerdown", (e) => {
    if (!s.allow(e) || (e.button && e.button !== 0)) return; e.preventDefault(); live.setPointerCapture(e.pointerId);
    const p = pt(e);
    if (prefs.tool === "eraser") { s.erasing = true; eraseAt(p[0], p[1]); return; }
    s.cur = prefs.tool === "hl" ? { k: "hl", c: prefs.hl, w: 18, p: [p] } : { k: "pen", c: prefs.color, w: prefs.size, p: [p] };
    s.renderLive(); armHold();
  });
  live.addEventListener("pointermove", (e) => {
    if (s.erasing) { const p = pt(e); eraseAt(p[0], p[1]); return; }
    if (!s.cur) return; e.preventDefault();
    if (s.cur.line) { const p = pt(e); s.cur.p[1] = p; s.renderLive(); return; } // straightened line follows the pen
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    let moved = false;
    for (const ev of evs.length ? evs : [e]) { const p = pt(ev); const l = s.cur.p[s.cur.p.length - 1]; if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 0.9) { s.cur.p.push(p); moved = true; } }
    if (moved) { s.renderLive(); armHold(); }
  });
  const end = () => { clearTimeout(holdT); s.erasing = false; if (!s.cur) return; bbox(s.cur); s.strokes.push(s.cur); s.cur = null; s.redo = []; s.render(); s.onChange(); };
  live.addEventListener("pointerup", end); live.addEventListener("pointercancel", end);
  s.undo = () => { const st = s.strokes.pop(); if (st) { s.redo.push(st); s.render(); s.onChange(); } };
  s.redoIt = () => { const st = s.redo.pop(); if (st) { s.strokes.push(st); s.render(); s.onChange(); } };
  s.clear = () => { if (!s.strokes.length) return; s.redo = s.strokes.slice().reverse(); s.strokes = []; s.render(); s.onChange(); };
  s.load = (arr) => { s.strokes = (arr || []).map((x) => ({ ...x })); s.redo = []; s.cur = null; s.render(); };
  return s;
}
function layer(cls, parent = document.body) { const base = document.createElement("canvas"), live = document.createElement("canvas"); base.className = cls + " ink-base"; live.className = cls + " ink-live"; parent.appendChild(base); parent.appendChild(live); return [base, live]; }

// ---------- page overlay ----------
let base, live, surface, bar, fab, pageKey = "home", active = false;
const appLeft = () => { const a = document.getElementById("app"); return a ? a.getBoundingClientRect().left : 0; };
function pageStrokes() { return (store[pageKey] && store[pageKey].s) || []; }
function persist() { if (surface.strokes.length) store[pageKey] = { s: surface.strokes, t: Date.now() }; else delete store[pageKey]; saveStore(); updateFab(); }
function updateFab() { if (fab) fab.classList.toggle("has", !!pageStrokes().length && !active); }
function toolbarHTML() {
  return `<div class="ink-row">
    <button data-t="pen" title="Pen">✏️</button><button data-t="hl" title="Highlighter">🖍️</button><button data-t="eraser" title="Eraser (whole stroke)">🩹</button>
    <span class="ink-sep"></span>
    ${PEN.map((c) => `<button class="ink-col ${c === "auto" ? "auto" : ""}" data-c="${c}" style="--c:${c === "auto" ? "var(--text)" : c}" title="${c === "auto" ? "Black / white (follows light/dark mode)" : c}"></button>`).join("")}
    <span class="ink-sep"></span>
    ${HL.map((c) => `<button class="ink-col hl" data-h="${c}" style="--c:${c}" title="Highlighter colour"></button>`).join("")}
    <span class="ink-sep"></span>
    ${SIZES.map((w) => `<button data-s="${w}" title="Pen size"><i class="ink-dot" style="width:${Math.max(4, w * 2.2)}px;height:${Math.max(4, w * 2.2)}px"></i></button>`).join("")}
    <span class="ink-sep"></span>
    <button data-a="undo" title="Undo">↶</button><button data-a="redo" title="Redo">↷</button><button data-a="clear" title="Clear this page">🗑️</button>
    <button data-a="pencil" title="Pencil only: fingers scroll and tap, the Pencil draws">✍️</button><button data-a="scratch" title="Scratch panel">📝</button>
    <button data-a="done" class="ink-done">Done</button></div>`;
}
function syncBar() {
  if (!bar) return;
  bar.querySelectorAll("[data-t]").forEach((b) => b.classList.toggle("on", b.dataset.t === prefs.tool));
  bar.querySelectorAll("[data-c]").forEach((b) => b.classList.toggle("on", prefs.tool === "pen" && b.dataset.c === prefs.color));
  bar.querySelectorAll("[data-h]").forEach((b) => b.classList.toggle("on", prefs.tool === "hl" && b.dataset.h === prefs.hl));
  bar.querySelectorAll("[data-s]").forEach((b) => b.classList.toggle("on", +b.dataset.s === prefs.size));
  bar.querySelector('[data-a="pencil"]').classList.toggle("on", prefs.pencilOnly);
}
function setActive(on) {
  active = on; document.body.classList.toggle("inking", on);
  live.style.pointerEvents = on ? "auto" : "none";
  live.style.touchAction = on && !prefs.pencilOnly ? "none" : "auto";
  bar.style.display = on ? "block" : "none"; fab.style.display = on ? "none" : "flex";
  surface.render(); updateFab();
}
export function initInk() {
  [base, live] = layer("ink-layer");
  surface = makeSurface(base, live, { offset: () => ({ x: -appLeft(), y: window.scrollY }), onChange: persist, respectPencilOnly: true });
  bar = document.createElement("div"); bar.className = "ink-bar"; bar.innerHTML = toolbarHTML(); document.body.appendChild(bar);
  fab = document.createElement("button"); fab.className = "ink-fab"; fab.setAttribute("aria-label", "Draw and highlight"); fab.innerHTML = "✏️"; document.body.appendChild(fab);
  fab.onclick = () => { setActive(true); if (!prefs.hinted) { prefs.hinted = true; savePrefs(); toastInk("Tip: hold the Pencil still at the end of a stroke to snap it into a straight line."); } };
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.t) prefs.tool = b.dataset.t;
    if (b.dataset.c) { prefs.color = b.dataset.c; prefs.tool = "pen"; }
    if (b.dataset.h) { prefs.hl = b.dataset.h; prefs.tool = "hl"; }
    if (b.dataset.s) { prefs.size = +b.dataset.s; prefs.tool = "pen"; }
    const a = b.dataset.a;
    if (a === "undo") surface.undo(); if (a === "redo") surface.redoIt();
    if (a === "clear" && confirm("Clear all ink on this page?")) surface.clear();
    if (a === "pencil") { prefs.pencilOnly = !prefs.pencilOnly; live.style.touchAction = prefs.pencilOnly ? "auto" : "none"; toastInk(prefs.pencilOnly ? "Pencil only: fingers scroll and tap" : "Finger drawing on"); }
    if (a === "scratch") openScratch();
    if (a === "done") setActive(false);
    savePrefs(); syncBar();
  });
  syncBar();
  // Pencil never scrolls the page while inking; fingers still scroll (pencil-only mode).
  const block = (e) => { if (!active) return; const t = e.touches[0]; if (t && (t.touchType === "stylus" || !prefs.pencilOnly)) e.preventDefault(); };
  live.addEventListener("touchstart", block, { passive: false }); live.addEventListener("touchmove", block, { passive: false });
  // Finger taps pass through to the page underneath (buttons, options, links).
  let tap = null;
  live.addEventListener("pointerdown", (e) => { if (active && prefs.pencilOnly && e.pointerType === "touch") tap = { x: e.clientX, y: e.clientY, t: Date.now() }; });
  live.addEventListener("pointerup", (e) => {
    if (!tap || e.pointerType !== "touch") return; const moved = Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 10 || Date.now() - tap.t > 500; tap = null; if (moved) return;
    live.style.pointerEvents = "none"; const el = document.elementFromPoint(e.clientX, e.clientY); live.style.pointerEvents = "auto";
    if (el) { if (el.matches("input,select,textarea")) el.focus(); else el.click(); }
  });
  const fit = () => surface.resize();
  window.addEventListener("resize", fit); window.addEventListener("orientationchange", () => setTimeout(fit, 300)); fit();
  let raf = 0; window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; surface.render(); }); }, { passive: true });
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => surface.render());
  setActive(false);
}
// The app calls this whenever the visible page (or question) changes.
export function inkPage(key) {
  if (!surface) return; pageKey = key; surface.load(pageStrokes());
  requestAnimationFrame(() => surface.render()); updateFab();
  if (scratch) scratch.switchTo(key);
}
// Re-render after page content changes height (images loading etc.)
export function inkRefresh() { if (surface) surface.render(); }

// ---------- docked scratch panel ----------
let scratch = null;
function openScratch() {
  if (scratch) { scratch.close(); return; }
  const m = document.createElement("div"); m.className = "ink-scratch";
  m.innerHTML = `<div class="ink-grip" title="Drag to resize"></div><div class="ink-scratch-head"><b style="white-space:nowrap">📝</b><span class="muted small sh-page" style="white-space:nowrap"></span><span style="flex:1"></span>
   <button data-sa="pen" class="on" title="Pen">✏️</button><button data-sa="eraser" title="Eraser">🩹</button><button data-sa="undo" title="Undo">↶</button>
   <button data-sa="prev" title="Previous sheet">‹</button><button data-sa="add" title="New sheet">＋</button><button data-sa="next" title="Next sheet">›</button>
   <button data-sa="clear" title="Clear sheet">🗑️</button><button data-sa="full" title="Full screen">⤢</button><button data-sa="close" class="ink-done">Close</button></div><div class="ink-scratch-body"></div>`;
  document.body.appendChild(m); document.body.classList.add("scratch-open");
  const body = m.querySelector(".ink-scratch-body"); const [b2, l2] = layer("ink-sheet", body);
  let sheet = 0, k = pageKey;
  const sheets = () => { const e = store[k + "#scratch"]; return (e && (e.pages || (e.s ? [e.s] : null))) || [[]]; };
  const grid = (ctx, w, h) => { const d = dark(); ctx.fillStyle = d ? "#1c1c1e" : "#fffef7"; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = d ? "#2c2c2e" : "#e5e7eb"; ctx.lineWidth = 1; for (let x = 0; x < w; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } for (let y = 0; y < h; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } };
  const save = () => { const pg = sheets().map((x) => x); pg[sheet] = sf.strokes; const nonEmpty = pg.some((x) => x && x.length); if (nonEmpty) store[k + "#scratch"] = { pages: pg, t: Date.now() }; else delete store[k + "#scratch"]; saveStore(); };
  const sf = makeSurface(b2, l2, { bg: grid, onChange: save });
  l2.style.touchAction = "none";
  const show = () => { const pg = sheets(); sheet = Math.min(sheet, pg.length - 1); sf.load(pg[sheet] || []); m.querySelector(".sh-page").textContent = `sheet ${sheet + 1}/${pg.length}`; };
  const prevTool = prefs.tool; prefs.tool = "pen";
  const layout = () => { const land = innerWidth > innerHeight; m.classList.toggle("side", land && !m.classList.contains("full")); m.classList.toggle("bottom", !land && !m.classList.contains("full"));
    const sz = prefs.scratchSize; if (m.classList.contains("full")) { m.style.width = m.style.height = ""; document.body.style.setProperty("--scratch-w", "0px"); document.body.style.setProperty("--scratch-h", "0px"); }
    else if (land) { m.style.width = Math.round(innerWidth * sz) + "px"; m.style.height = ""; document.body.style.setProperty("--scratch-w", Math.round(innerWidth * sz) + "px"); document.body.style.setProperty("--scratch-h", "0px"); }
    else { m.style.height = Math.round(innerHeight * sz) + "px"; m.style.width = ""; document.body.style.setProperty("--scratch-h", Math.round(innerHeight * sz) + "px"); document.body.style.setProperty("--scratch-w", "0px"); }
    requestAnimationFrame(() => { sf.resize(); surface && surface.resize(); }); };
  layout(); show();
  const onR = () => layout(); addEventListener("resize", onR);
  // drag the grip to resize
  const grip = m.querySelector(".ink-grip"); let drag = null;
  grip.addEventListener("pointerdown", (e) => { drag = true; grip.setPointerCapture(e.pointerId); e.preventDefault(); });
  grip.addEventListener("pointermove", (e) => { if (!drag) return; const land = innerWidth > innerHeight; prefs.scratchSize = Math.min(0.8, Math.max(0.25, land ? (innerWidth - e.clientX) / innerWidth : (innerHeight - e.clientY) / innerHeight)); layout(); });
  grip.addEventListener("pointerup", () => { drag = false; savePrefs(); });
  m.querySelector(".ink-scratch-head").addEventListener("click", (e) => {
    const a = e.target.closest("button")?.dataset.sa; if (!a) return;
    if (a === "pen" || a === "eraser") { prefs.tool = a; m.querySelectorAll('[data-sa="pen"],[data-sa="eraser"]').forEach((b) => b.classList.toggle("on", b.dataset.sa === a)); }
    if (a === "undo") sf.undo(); if (a === "clear" && confirm("Clear this sheet?")) sf.clear();
    if (a === "add") { const pg = sheets(); pg[sheet] = sf.strokes; pg.push([]); store[k + "#scratch"] = { pages: pg, t: Date.now() }; sheet = pg.length - 1; saveStore(); show(); }
    if (a === "prev" && sheet > 0) { sheet--; show(); } if (a === "next" && sheet < sheets().length - 1) { sheet++; show(); }
    if (a === "full") { m.classList.toggle("full"); layout(); }
    if (a === "close") scratch.close();
  });
  scratch = {
    close() { removeEventListener("resize", onR); prefs.tool = prevTool; syncBar(); m.remove(); document.body.classList.remove("scratch-open"); document.body.style.removeProperty("--scratch-w"); document.body.style.removeProperty("--scratch-h"); scratch = null; requestAnimationFrame(() => surface && surface.resize()); },
    switchTo(nk) { if (nk === k) return; k = nk; sheet = 0; show(); },
  };
}
export { openScratch };
function toastInk(msg) { const d = document.createElement("div"); d.className = "toast"; d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), 2000); }
