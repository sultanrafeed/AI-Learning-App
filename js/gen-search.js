// Classical search generators: UCS, Greedy Best-First, A*, admissibility, consistency.
import { rng, Q, textOptions, numericOptions, table } from "./gen-core.js";

const TOPIC = "search";
const CONV = "Conventions (as in Lecture 2 pseudocode): graph search; the goal test is applied when a node is <b>selected for expansion</b>; ties are broken <b>alphabetically</b>; a frontier entry is replaced if a cheaper path to it is found (UCS/A*); edges are two-way.";

export function makeGraph(seed) {
  const R = rng(seed);
  const cols = [["S"], ["A", "B"], ["C", "D", "E"], ["F", "H"], ["G"]];
  if (R.chance(0.4)) cols[3] = ["F"];
  const pos = {}; const W = 380, H = 230;
  cols.forEach((col, ci) => col.forEach((n, ri) => {
    pos[n] = [30 + ci * ((W - 60) / (cols.length - 1)), (H / (col.length + 1)) * (ri + 1) + (R() - 0.5) * 18];
  }));
  const edges = []; const has = (a, b) => edges.some((e) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a));
  const add = (a, b) => { if (a !== b && !has(a, b)) edges.push([a, b, R.int(1, 9)]); };
  for (let c = 0; c < cols.length - 1; c++) {
    for (const n of cols[c]) { const targets = R.shuffle(cols[c + 1]); add(n, targets[0]); if (R.chance(0.55) && targets[1]) add(n, targets[1]); }
    for (const m of cols[c + 1]) if (!edges.some((e) => e.includes(m) && cols[c].includes(e[0] === m ? e[1] : e[0]))) add(R.pick(cols[c]), m);
  }
  if (R.chance(0.6)) add(R.pick(cols[1]), R.pick(cols[3])); // a long jump
  R(); // (same-column edges removed: they collide with the h labels)
  const nodes = cols.flat();
  const adj = {}; nodes.forEach((n) => (adj[n] = []));
  edges.forEach(([a, b, w]) => { adj[a].push([b, w]); adj[b].push([a, w]); });
  // true cost to goal h*
  const hstar = dijkstra(adj, "G");
  return { nodes, edges, adj, pos, hstar, W, H, R };
}

export function dijkstra(adj, src) {
  const d = {}; Object.keys(adj).forEach((n) => (d[n] = Infinity)); d[src] = 0;
  const done = new Set();
  while (done.size < Object.keys(adj).length) {
    let u = null; for (const n in d) if (!done.has(n) && (u === null || d[n] < d[u])) u = n;
    if (u === null || d[u] === Infinity) break; done.add(u);
    for (const [v, w] of adj[u]) if (d[u] + w < d[v]) d[v] = d[u] + w;
  }
  return d;
}

export function heuristics(g, R, mode = "admissible") {
  const h = {};
  for (const n of g.nodes) h[n] = n === "G" ? 0 : Math.max(0, Math.floor(g.hstar[n] * (0.55 + R() * 0.45)));
  if (mode === "inadmissible") { const cand = g.nodes.filter((n) => n !== "G" && n !== "S"); const n = R.pick(cand); h[n] = g.hstar[n] + R.int(1, 4); h.__bad = n; }
  return h;
}

export function isAdmissible(g, h) { return g.nodes.every((n) => h[n] <= g.hstar[n]); }
export function consistencyViolations(g, h) {
  const v = [];
  for (const [a, b, w] of g.edges) {
    if (h[a] > w + h[b]) v.push([a, b, w]);
    if (h[b] > w + h[a]) v.push([b, a, w]);
  }
  return v;
}

// Generic best-first graph search. kind: ucs | gbfs | astar
export function bestFirst(g, h, kind) {
  const f = (gc, n) => (kind === "ucs" ? gc : kind === "gbfs" ? h[n] : gc + h[n]);
  let frontier = [{ n: "S", g: 0, f: f(0, "S"), path: ["S"] }];
  const explored = new Set(); const trace = [];
  while (frontier.length) {
    frontier.sort((a, b) => a.f - b.f || (a.n < b.n ? -1 : 1));
    const snap = frontier.map((x) => `${x.n}:${x.f}`).join(", ");
    const cur = frontier.shift();
    trace.push({ expanded: cur.n, f: cur.f, g: cur.g, frontierBefore: snap, explored: [...explored].join(",") });
    if (cur.n === "G") return { path: cur.path, cost: cur.g, order: trace.map((t) => t.expanded), trace };
    explored.add(cur.n);
    for (const [m, w] of g.adj[cur.n].slice().sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
      if (explored.has(m)) continue;
      const gc = cur.g + w; const node = { n: m, g: gc, f: f(gc, m), path: [...cur.path, m] };
      const idx = frontier.findIndex((x) => x.n === m);
      if (idx === -1) frontier.push(node);
      else if (kind !== "gbfs" && node.f < frontier[idx].f) frontier[idx] = node;
    }
  }
  return { path: null, cost: Infinity, order: trace.map((t) => t.expanded), trace };
}

export function graphSVG(g, h, opts = {}) {
  const { pos, edges, nodes, W, H } = g;
  let s = ""; let lines = "";
  edges.forEach(([a, b, w], i) => {
    const [x1, y1] = pos[a], [x2, y2] = pos[b];
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, t = i % 3 === 0 ? 0.5 : i % 3 === 1 ? 0.38 : 0.62;
    const side = i % 2 ? 7 : -7; const mx = x1 + dx * t + (-dy / L) * side, my = y1 + dy * t + (dx / L) * side;
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ge"/>`;
    s += `<rect x="${mx - 8}" y="${my - 9}" width="16" height="15" rx="4" class="gwbg"/><text x="${mx}" y="${my + 3}" class="gw">${w}</text>`;
  });
  s = `<svg viewBox="0 0 ${W} ${H + 10}" class="gsvg" role="img" aria-label="search graph">` + lines + s;
  for (const n of nodes) {
    const [x, y] = pos[n];
    const cls = n === "S" ? "gn start" : n === "G" ? "gn goal" : "gn";
    s += `<circle cx="${x}" cy="${y}" r="13" class="${cls}"/><text x="${x}" y="${y + 4}" class="gl">${n}</text>`;
    if (h && opts.showH !== false) s += `<text x="${x}" y="${y + 26}" class="gh">h=${h[n]}</text>`;
  }
  return s + "</svg>";
}

function traceTable(res, kind) {
  const lab = kind === "ucs" ? "g" : kind === "gbfs" ? "h" : "f=g+h";
  return table(["Step", "Frontier before pop (node:" + lab + ")", "Expanded"], res.trace.map((t, i) => [i + 1, t.frontierBefore, t.expanded]));
}

const NAMES = { ucs: "Uniform-Cost Search", gbfs: "Greedy Best-First Search", astar: "A* search" };
const FN = { ucs: "f(n) = g(n)", gbfs: "f(n) = h(n)", astar: "f(n) = g(n) + h(n)" };

export function searchQuestion(seed, kind) {
  const g = makeGraph(seed); const R = g.R;
  const mode = kind === "admissible" || kind === "consistent" ? (R.chance(0.5) ? "inadmissible" : "admissible") : "admissible";
  const h = heuristics(g, R, mode);
  const vis = graphSVG(g, h);
  const id = `search-${kind}-${seed}`;
  const base = { topic: TOPIC, calc: true, visual: vis, src: "Lecture 2 (Classic search) + UCS/GBFS/A* Romania examples" };
  const ucs = bestFirst(g, h, "ucs"), gb = bestFirst(g, h, "gbfs"), as = bestFirst(g, h, "astar");
  const pathStr = (p) => p.join("-");

  if (kind === "ucs-order" || kind === "gbfs-order" || kind === "astar-order") {
    const k = kind.split("-")[0]; const res = { ucs, gbfs: gb, astar: as }[k];
    const ans = res.order.join(",");
    return Q({ ...base, id, sub: NAMES[k] + " expansion order", type: "BLANK", diff: k === "astar" ? "Hard" : "Medium",
      stem: `Run <b>${NAMES[k]}</b> (${FN[k]}) from S to G on the graph below (edge costs on edges, h under each node). ${CONV}<br><br>List the nodes in the order they are <b>selected for expansion</b>, including G, as letters separated by commas (e.g. S,A,C,G).`,
      answer: ans, accepted: [ans, ans.replace(/,/g, ", "), ans.replace(/,/g, "")], format: "letters separated by commas",
      steps: [`Evaluation function: ${FN[k]}.`, ...res.trace.map((t, i) => `Step ${i + 1}: frontier {${t.frontierBefore}} → pop lowest = ${t.expanded}${t.expanded === "G" ? " (goal test passes when selected, stop)" : ""}.`), `Expansion order: ${ans}. Path found: ${pathStr(res.path)} with cost ${res.cost}.`],
      take: k === "ucs" ? "UCS looks Back: always pop the smallest g." : k === "gbfs" ? "Greedy looks Forward: always pop the smallest h, ignoring g." : "A* looks Both ways: pop the smallest g + h.",
      tags: [k, "expansion-order"], cov: [`search-${k}`] });
  }
  if (kind === "astar-path" || kind === "ucs-path") {
    const k = kind.split("-")[0]; const res = k === "ucs" ? ucs : as;
    return Q({ ...base, id, sub: NAMES[k] + " final path and cost", type: "BLANKS", diff: "Medium",
      stem: `Run <b>${NAMES[k]}</b> from S to G. ${CONV}<br><br>Give (1) the path returned, as letters joined with hyphens (e.g. S-A-G), and (2) its total path cost (integer).`,
      blanks: ["Path", "Cost"], answer: [pathStr(res.path), String(res.cost)], accepted: [[pathStr(res.path), res.path.join(""), res.path.join(",")], [String(res.cost)]],
      steps: [...res.trace.map((t, i) => `Step ${i + 1}: frontier {${t.frontierBefore}} → expand ${t.expanded}.`), `G is selected with g = ${res.cost}. Follow parent pointers: ${pathStr(res.path)}.`, `Cost check: ${res.path.slice(1).map((n, i) => g.adj[res.path[i]].find((e) => e[0] === n)[1]).join(" + ")} = ${res.cost}.`],
      take: "With an admissible h, A* returns the same optimal cost as UCS, usually expanding fewer nodes.", tags: [k, "path-cost"], cov: [`search-${k}`] });
  }
  if (kind === "gbfs-path") {
    const opts = new Map();
    opts.set(pathStr(gb.path), null);
    const wrong = [[pathStr(ucs.path) + ` (cost ${ucs.cost})`, "This is the cheapest path (UCS/A*). Greedy ignores g, so it can return a different path."], [pathStr(as.path) + ` (cost ${as.cost})`, "A* result, not greedy."]];
    const alt = g.adj.S.map((e) => e[0]).filter((n) => n !== gb.path[1]);
    if (alt.length) wrong.push([`S-${alt[0]}-...-G found by following the lowest edge cost`, "Choosing by edge cost is not the greedy rule; greedy uses h only."]);
    wrong.push(["No path: greedy gets stuck", "On a finite graph with explored-set checking, greedy graph search still reaches G here."]);
    const correct = pathStr(gb.path) + ` (cost ${gb.cost})`;
    const ws = wrong.filter((w) => !w[0].startsWith(pathStr(gb.path) + " "));
    const o = textOptions(R, correct, ws);
    return Q({ ...base, id, sub: "Greedy best-first path", type: "MCQ", diff: "Medium", ...o,
      stem: `Run <b>Greedy Best-First Search</b> (f(n) = h(n)) from S to G. ${CONV}<br>Which path does it return?`,
      steps: gb.trace.map((t, i) => `Step ${i + 1}: frontier {${t.frontierBefore}} → expand ${t.expanded} (smallest h).`).concat([`Greedy returns ${correct}. Optimal cost (UCS) is ${ucs.cost}${gb.cost > ucs.cost ? ", so greedy is NOT optimal here" : ""}.`]),
      take: "Greedy is fast but not cost-optimal: it never looks at g.", tags: ["gbfs", "optimality"], cov: ["search-gbfs"] });
  }
  if (kind === "astar-step") {
    const k = Math.min(as.trace.length - 1, R.int(1, 3)); const t = as.trace[k];
    const frontierVals = t.frontierBefore.split(", ").map((s) => s.split(":"));
    const wrongs = frontierVals.filter(([n]) => n !== t.expanded).map(([n, v]) => [`${n} with f = ${v}`, `${n} has f = ${v}, which is not the smallest (or loses the alphabetical tie-break).`]);
    // add a classic mistake: smallest h only
    const minH = frontierVals.slice().sort((a, b) => h[a[0]] - h[b[0]])[0];
    if (minH[0] !== t.expanded) wrongs.unshift([`${minH[0]} because it has the smallest h = ${h[minH[0]]}`, "That is the greedy choice (f = h). A* uses f = g + h."]);
    while (wrongs.length < 3) wrongs.push([`G immediately, since G is in the frontier`, "A goal in the frontier is only returned when it is selected (smallest f)."]);
    const o = textOptions(R, `${t.expanded} with f = ${t.f}`, wrongs);
    return Q({ ...base, id, sub: "A* next node", type: "MCQ", diff: "Hard", ...o,
      stem: `During <b>A*</b> from S, after ${k} expansion(s) (${as.order.slice(0, k).join(", ")}), the frontier is {${t.frontierBefore}} (values are f = g + h). ${CONV}<br>Which node is expanded next, and with what f?`,
      steps: [`List f = g + h for every frontier node: ${t.frontierBefore}.`, `Smallest f = ${t.f} → expand ${t.expanded}.`],
      take: "Always compute f = g + h for EVERY frontier node, not just the newest children.", tags: ["astar", "frontier"], cov: ["search-astar"] });
  }
  if (kind === "astar-f") {
    const cand = g.nodes.filter((n) => n !== "S");
    const n = R.pick(cand);
    // g via the path A* found to n (best g when first expanded) -> use true shortest g from S
    const gs = dijkstra(g.adj, "S")[n];
    const fval = gs + h[n];
    const o = numericOptions(R, fval, [[gs, "That is g(n) only (UCS value)."], [h[n], "That is h(n) only (greedy value)."], [gs + g.hstar[n], "Used the true remaining cost h*(n) instead of the given h(n)."], [Math.abs(gs - h[n]), "f adds g and h, it does not subtract."]], 0);
    return Q({ ...base, id, sub: "A* evaluation function", type: "MCQ", diff: "Easy", ...o,
      stem: `Using the cheapest path from S to <b>${n}</b>, what is the A* evaluation f(${n})?`,
      steps: [`Cheapest g(${n}) from S = ${gs}.`, `h(${n}) = ${h[n]} (read from the graph).`, `f(${n}) = g + h = ${gs} + ${h[n]} = ${fval}.`],
      take: "A*: f = g + h. UCS: f = g. Greedy: f = h.", tags: ["astar", "f=g+h"], cov: ["search-astar"] });
  }
  if (kind === "admissible") {
    const adm = isAdmissible(g, h);
    const rows = g.nodes.map((nn) => [nn, h[nn], g.hstar[nn], h[nn] <= g.hstar[nn] ? "OK" : "OVER"]);
    return Q({ ...base, id, sub: "Admissibility", type: "TF", diff: "Hard", trap: true,
      stem: `True or False: the heuristic h shown on the graph is <b>admissible</b> for reaching G.`,
      answer: adm, why: adm ? "Every h(n) ≤ h*(n), the true cheapest cost to G." : `h(${h.__bad}) = ${h[h.__bad]} > h*(${h.__bad}) = ${g.hstar[h.__bad]}: it overestimates.`,
      steps: ["Admissible means h(n) ≤ h*(n) for every node (never overestimates).", "Compute the true cost-to-goal h*(n) for every node (shortest path to G):", table(["Node", "h(n)", "h*(n)", "Check"], rows), adm ? "No node overestimates → admissible." : `${h.__bad} overestimates → NOT admissible.`],
      take: "Admissible = never overestimates the true remaining cost.", tags: ["admissible"], cov: ["search-admissible"] });
  }
  if (kind === "consistent") {
    const v = consistencyViolations(g, h);
    const cons = v.length === 0;
    return Q({ ...base, id, sub: "Consistency", type: "TF", diff: "Exam+", trap: true,
      stem: `True or False: the heuristic h on the graph is <b>consistent</b>, i.e. h(n) ≤ c(n, n′) + h(n′) for every edge (both directions).`,
      answer: cons, why: cons ? "Every edge satisfies the triangle inequality." : `Edge ${v[0][0]}→${v[0][1]}: h(${v[0][0]}) = ${h[v[0][0]]} > ${v[0][2]} + h(${v[0][1]}) = ${v[0][2] + h[v[0][1]]}.`,
      steps: ["Check h(n) ≤ c(n,n′) + h(n′) on every edge, in both directions.", ...g.edges.map(([a, b, w]) => `${a}–${b} (c=${w}): ${h[a]} ≤ ${w}+${h[b]}=${w + h[b]} ${h[a] <= w + h[b] ? "✓" : "✗"}; ${h[b]} ≤ ${w}+${h[a]}=${w + h[a]} ${h[b] <= w + h[a] ? "✓" : "✗"}`), cons ? "All pass → consistent (and therefore also admissible)." : "At least one edge fails → NOT consistent."],
      take: "Consistent ⇒ admissible, but admissible does not imply consistent. Graph-search A* is optimal with a consistent h.", tags: ["consistent"], cov: ["search-consistent"] });
  }
  if (kind === "compare") {
    const rows = [["UCS", ucs.order.length, ucs.cost], ["Greedy", gb.order.length, gb.cost], ["A*", as.order.length, as.cost]];
    const ans = [String(ucs.cost), String(gb.cost), String(as.cost)];
    return Q({ ...base, id, sub: "Compare UCS / Greedy / A*", type: "BLANKS", diff: "Exam+",
      stem: `Run UCS, Greedy Best-First and A* from S to G. ${CONV}<br>Give the path cost returned by each, in the order UCS, Greedy, A* (integers).`,
      blanks: ["UCS cost", "Greedy cost", "A* cost"], answer: ans,
      steps: [`UCS order ${ucs.order.join(",")} → path ${pathStr(ucs.path)}, cost ${ucs.cost}.`, `Greedy order ${gb.order.join(",")} → path ${pathStr(gb.path)}, cost ${gb.cost}.`, `A* order ${as.order.join(",")} → path ${pathStr(as.path)}, cost ${as.cost}.`, table(["Algorithm", "Nodes expanded", "Cost"], rows)],
      take: "UCS and A* (admissible h) are optimal; Greedy is not guaranteed to be.", tags: ["compare"], cov: ["search-ucs", "search-gbfs", "search-astar"] });
  }
  throw new Error("unknown search kind " + kind);
}

export const SEARCH_KINDS = ["ucs-order", "gbfs-order", "astar-order", "astar-path", "ucs-path", "gbfs-path", "astar-step", "astar-f", "admissible", "consistent", "compare"];
