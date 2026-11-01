// Ink layer: draw / highlight / erase on top of any page (Apple Pencil friendly) + a scratch sheet.
// Strokes are saved per page (and per question) in localStorage.
const KEY = "aiquest-ink-v1";
const COLORS = ["#ef4444", "#2563eb", "#16a34a", "#111827", "#f59e0b", "#a855f7"];
const HL = ["#fde047", "#86efac", "#93c5fd", "#f9a8d4"];
let store = {}; try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { store = {}; }
const saveStore = () => {
  try {
    const keys = Object.keys(store);
    if (keys.length > 250) keys.sort((a, b) => (store[a].t || 0) - (store[b].t || 0)).slice(0, keys.length - 250).forEach((k) => delete store[k]);
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch { /* storage full: keep in memory */ }
};
const prefs = Object.assign({ tool: "pen", color: COLORS[0], hl: HL[0], size: 3, pencilOnly: true }, (() => { try { return JSON.parse(localStorage.getItem(KEY + "-prefs")) || {}; } catch { return {}; } })());
const savePrefs = () => { try { localStorage.setItem(KEY + "-prefs", JSON.stringify(prefs)); } catch {} };

// ---------- drawing engine (used by overlay and scratch sheet) ----------
function makeSurface(canvas, opts) {
  const ctx = canvas.getContext("2d");
  const s = { canvas, ctx, strokes: [], redo: [], cur: null, offset: opts.offset || (() => ({ x: 0, y: 0 })), onChange: opts.onChange || (() => {}), bg: opts.bg };
  s.resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); const r = canvas.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); s.render();
  };
  const drawStroke = (st) => {
    const o = s.offset(); const p = st.p; if (!p.length) return;
    ctx.save(); ctx.lineCap = st.k === "hl" ? "butt" : "round"; ctx.lineJoin = "round";
    if (st.k === "hl") { ctx.globalAlpha = 0.38; ctx.globalCompositeOperation = "multiply"; }
    ctx.strokeStyle = st.c; ctx.fillStyle = st.c;
    if (p.length === 1) { ctx.beginPath(); ctx.arc(p[0][0] - o.x, p[0][1] - o.y, st.w / 2, 0, 7); ctx.fill(); ctx.restore(); return; }
    if (st.k === "hl") { ctx.lineWidth = st.w; ctx.beginPath(); ctx.moveTo(p[0][0] - o.x, p[0][1] - o.y); for (const q of p) ctx.lineTo(q[0] - o.x, q[1] - o.y); ctx.stroke(); ctx.restore(); return; }
    for (let i = 1; i < p.length; i++) { // pressure-sensitive segments
      const a = p[i - 1], b = p[i]; ctx.lineWidth = st.w * (0.45 + 0.9 * ((a[2] ?? 0.5) + (b[2] ?? 0.5)) / 2);
      ctx.beginPath(); ctx.moveTo(a[0] - o.x, a[1] - o.y); ctx.lineTo(b[0] - o.x, b[1] - o.y); ctx.stroke();
    }
    ctx.restore();
  };
  s.render = () => {
    const r = canvas.getBoundingClientRect(); ctx.clearRect(0, 0, r.width, r.height);
    if (s.bg) s.bg(ctx, r.width, r.height);
    const o = s.offset();
    for (const st of s.strokes) { const b = st.b; if (b && (b[3] < o.y - 40 || b[1] > o.y + r.height + 40)) continue; drawStroke(st); }
    if (s.cur) drawStroke(s.cur);
  };
  const pt = (e) => { const r = canvas.getBoundingClientRect(); const o = s.offset(); return [Math.round((e.clientX - r.left + o.x) * 10) / 10, Math.round((e.clientY - r.top + o.y) * 10) / 10, e.pressure && e.pointerType === "pen" ? +e.pressure.toFixed(2) : 0.5]; };
  const bbox = (st) => { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; for (const [x, y] of st.p) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); } st.b = [a - st.w, b - st.w, c + st.w, d + st.w]; };
  const eraseAt = (x, y) => {
    const n = s.strokes.length;
    s.strokes = s.strokes.filter((st) => { if (st.b && (x < st.b[0] - 8 || x > st.b[2] + 8 || y < st.b[1] - 8 || y > st.b[3] + 8)) return true; return !st.p.some((q) => Math.hypot(q[0] - x, q[1] - y) < Math.max(12, st.w)); });
    if (s.strokes.length !== n) { s.redo = []; s.render(); s.onChange(); }
  };
  s.allow = (e) => !(prefs.pencilOnly && opts.respectPencilOnly && e.pointerType === "touch");
  canvas.addEventListener("pointerdown", (e) => {
    if (!s.allow(e)) return; e.preventDefault(); canvas.setPointerCapture(e.pointerId);
    const p = pt(e);
    if (prefs.tool === "eraser") { s.erasing = true; eraseAt(p[0], p[1]); return; }
    s.cur = prefs.tool === "hl" ? { k: "hl", c: prefs.hl, w: 18, p: [p] } : { k: "pen", c: prefs.color, w: prefs.size, p: [p] };
    s.render();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (s.erasing) { const p = pt(e); eraseAt(p[0], p[1]); return; }
    if (!s.cur) return; e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs.length ? evs : [e]) { const p = pt(ev); const l = s.cur.p[s.cur.p.length - 1]; if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 1.2) s.cur.p.push(p); }
    s.render();
  });
  const end = () => { s.erasing = false; if (!s.cur) return; bbox(s.cur); s.strokes.push(s.cur); s.cur = null; s.redo = []; s.render(); s.onChange(); };
  canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
  s.undo = () => { const st = s.strokes.pop(); if (st) { s.redo.push(st); s.render(); s.onChange(); } };
  s.redoIt = () => { const st = s.redo.pop(); if (st) { s.strokes.push(st); s.render(); s.onChange(); } };
  s.clear = () => { if (!s.strokes.length) return; s.redo = s.strokes.slice().reverse(); s.strokes = []; s.render(); s.onChange(); };
  return s;
}

// ---------- overlay on the page ----------
let overlay, surface, bar, fab, pageKey = "home", active = false;
function pageStrokes() { return (store[pageKey] && store[pageKey].s) || []; }
function persist() {
  if (surface.strokes.length) store[pageKey] = { s: surface.strokes, t: Date.now() }; else delete store[pageKey];
  saveStore(); updateFab();
}
function updateFab() { if (fab) fab.classList.toggle("has", !!pageStrokes().length && !active); }
function toolbarHTML() {
  return `<div class="ink-row">
    <button data-t="pen" title="Pen">✏️</button><button data-t="hl" title="Highlighter">🖍️</button><button data-t="eraser" title="Eraser">🩹</button>
    <span class="ink-sep"></span>
    ${COLORS.map((c) => `<button class="ink-col" data-c="${c}" style="--c:${c}"></button>`).join("")}
    ${HL.map((c) => `<button class="ink-col hl" data-h="${c}" style="--c:${c}"></button>`).join("")}
    <span class="ink-sep"></span>
    <button data-s="2" title="Thin">•</button><button data-s="4" title="Medium">●</button><button data-s="7" title="Thick">⬤</button>
    <span class="ink-sep"></span>
    <button data-a="undo" title="Undo">↶</button><button data-a="redo" title="Redo">↷</button><button data-a="clear" title="Clear page">🗑️</button>
    <button data-a="pencil" title="Pencil only: fingers scroll and tap">✍️</button><button data-a="scratch" title="Scratch sheet">📝</button>
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
  overlay.style.pointerEvents = on ? "auto" : "none";
  overlay.style.touchAction = on && !prefs.pencilOnly ? "none" : "auto";
  bar.style.display = on ? "block" : "none"; fab.style.display = on ? "none" : "flex";
  surface.render(); updateFab();
}
export function initInk() {
  overlay = document.createElement("canvas"); overlay.className = "ink-layer"; document.body.appendChild(overlay);
  surface = makeSurface(overlay, { offset: () => ({ x: window.scrollX, y: window.scrollY }), onChange: persist, respectPencilOnly: true });
  bar = document.createElement("div"); bar.className = "ink-bar"; bar.innerHTML = toolbarHTML(); document.body.appendChild(bar);
  fab = document.createElement("button"); fab.className = "ink-fab"; fab.setAttribute("aria-label", "Draw and highlight"); fab.innerHTML = "✏️"; document.body.appendChild(fab);
  fab.onclick = () => setActive(true);
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.t) prefs.tool = b.dataset.t;
    if (b.dataset.c) { prefs.color = b.dataset.c; prefs.tool = "pen"; }
    if (b.dataset.h) { prefs.hl = b.dataset.h; prefs.tool = "hl"; }
    if (b.dataset.s) { prefs.size = +b.dataset.s; if (prefs.tool !== "pen") prefs.tool = "pen"; }
    const a = b.dataset.a;
    if (a === "undo") surface.undo(); if (a === "redo") surface.redoIt();
    if (a === "clear" && confirm("Clear all ink on this page?")) surface.clear();
    if (a === "pencil") { prefs.pencilOnly = !prefs.pencilOnly; overlay.style.touchAction = prefs.pencilOnly ? "auto" : "none"; toastInk(prefs.pencilOnly ? "Pencil only: fingers scroll and tap buttons" : "Finger drawing on"); }
    if (a === "scratch") openScratch();
    if (a === "done") setActive(false);
    savePrefs(); syncBar();
  });
  syncBar();
  // Pencil-only: stop Apple Pencil from scrolling, let fingers scroll; finger taps go to the page underneath.
  overlay.addEventListener("touchstart", (e) => { if (!active) return; const t = e.touches[0]; if (t && (t.touchType === "stylus" || !prefs.pencilOnly)) e.preventDefault(); }, { passive: false });
  overlay.addEventListener("touchmove", (e) => { if (!active) return; const t = e.touches[0]; if (t && (t.touchType === "stylus" || !prefs.pencilOnly)) e.preventDefault(); }, { passive: false });
  let tap = null;
  overlay.addEventListener("pointerdown", (e) => { if (active && prefs.pencilOnly && e.pointerType === "touch") tap = { x: e.clientX, y: e.clientY, t: Date.now() }; });
  overlay.addEventListener("pointerup", (e) => {
    if (!tap || e.pointerType !== "touch") return; const moved = Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 10 || Date.now() - tap.t > 500; tap = null; if (moved) return;
    overlay.style.pointerEvents = "none"; const el = document.elementFromPoint(e.clientX, e.clientY); overlay.style.pointerEvents = "auto";
    if (el) { el.focus && el.focus(); el.click(); }
  });
  const fit = () => surface.resize();
  window.addEventListener("resize", fit); fit();
  let raf = 0; window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; surface.render(); }); }, { passive: true });
  setActive(false);
}
// Called by the app whenever the visible page (or the question) changes.
export function inkPage(key) {
  if (!surface) return; pageKey = key; surface.strokes = pageStrokes().map((s) => ({ ...s })); surface.redo = []; surface.cur = null;
  requestAnimationFrame(() => surface.render()); updateFab();
}
export function inkEnabled() { return active; }

// ---------- scratch sheet ----------
function openScratch() {
  const m = document.createElement("div"); m.className = "ink-scratch";
  m.innerHTML = `<div class="ink-scratch-head"><b>📝 Scratch sheet</b><span class="muted small">for working out (saved with this page)</span><span style="flex:1"></span><button data-sa="pen" class="on">✏️</button><button data-sa="eraser">🩹</button><button data-sa="undo">↶</button><button data-sa="clear">🗑️</button><button data-sa="close" class="ink-done">Close</button></div><canvas></canvas>`;
  document.body.appendChild(m);
  const prevTool = prefs.tool; prefs.tool = "pen";
  const cv = m.querySelector("canvas"); const k = pageKey + "#scratch";
  const grid = (ctx, w, h) => { const dark = matchMedia("(prefers-color-scheme: dark)").matches; ctx.fillStyle = dark ? "#1c1c1e" : "#fffef7"; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = dark ? "#2c2c2e" : "#e5e7eb"; ctx.lineWidth = 1; for (let x = 0; x < w; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } for (let y = 0; y < h; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } };
  const sf = makeSurface(cv, { bg: grid, onChange: () => { if (sf.strokes.length) store[k] = { s: sf.strokes, t: Date.now() }; else delete store[k]; saveStore(); } });
  cv.style.touchAction = "none";
  sf.strokes = ((store[k] && store[k].s) || []).map((s) => ({ ...s }));
  requestAnimationFrame(() => sf.resize());
  const onR = () => sf.resize(); window.addEventListener("resize", onR);
  m.querySelector(".ink-scratch-head").addEventListener("click", (e) => {
    const a = e.target.closest("button")?.dataset.sa; if (!a) return;
    if (a === "pen" || a === "eraser") { prefs.tool = a; m.querySelectorAll('[data-sa="pen"],[data-sa="eraser"]').forEach((b) => b.classList.toggle("on", b.dataset.sa === a)); }
    if (a === "undo") sf.undo(); if (a === "clear" && confirm("Clear the scratch sheet?")) sf.clear();
    if (a === "close") { window.removeEventListener("resize", onR); prefs.tool = prevTool; syncBar(); m.remove(); }
  });
}
export { openScratch };
function toastInk(msg) { const d = document.createElement("div"); d.className = "toast"; d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), 1800); }
