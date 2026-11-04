// Context visuals automatically attached to questions that refer to a lecture example,
// so you never need to remember the example: the data is shown with the question.
import { table, grid } from "../js/gen-core.js";

// ---- Romania (Lecture 2 map coordinates; straight-line distances to Bucharest) ----
const C = { Arad: [91, 492], Bucharest: [400, 327], Craiova: [253, 288], Drobeta: [165, 299], Eforie: [562, 293], Fagaras: [305, 449], Giurgiu: [375, 270], Hirsova: [534, 350], Iasi: [473, 506], Lugoj: [165, 379], Mehadia: [168, 339], Neamt: [406, 537], Oradea: [131, 571], Pitesti: [320, 368], Rimnicu: [233, 410], Sibiu: [207, 457], Timisoara: [94, 410], Urziceni: [456, 350], Vaslui: [509, 444], Zerind: [108, 531] };
const H = { Arad: 366, Bucharest: 0, Craiova: 160, Drobeta: 242, Eforie: 161, Fagaras: 176, Giurgiu: 77, Hirsova: 151, Iasi: 226, Lugoj: 244, Mehadia: 241, Neamt: 234, Oradea: 380, Pitesti: 100, Rimnicu: 193, Sibiu: 253, Timisoara: 329, Urziceni: 80, Vaslui: 199, Zerind: 374 };
const E = [["Arad", "Sibiu", 140], ["Arad", "Timisoara", 118], ["Arad", "Zerind", 75], ["Zerind", "Oradea", 71], ["Oradea", "Sibiu", 151], ["Sibiu", "Fagaras", 99], ["Sibiu", "Rimnicu", 80], ["Rimnicu", "Pitesti", 97], ["Rimnicu", "Craiova", 146], ["Pitesti", "Craiova", 138], ["Pitesti", "Bucharest", 101], ["Fagaras", "Bucharest", 211], ["Timisoara", "Lugoj", 111], ["Lugoj", "Mehadia", 70], ["Mehadia", "Drobeta", 75], ["Drobeta", "Craiova", 120], ["Bucharest", "Giurgiu", 90], ["Bucharest", "Urziceni", 85], ["Urziceni", "Hirsova", 98], ["Hirsova", "Eforie", 86], ["Urziceni", "Vaslui", 142], ["Vaslui", "Iasi", 92], ["Iasi", "Neamt", 87]];
const NAME = { Fagaras: "Făgăraș", Rimnicu: "Râmnicu V.", Timisoara: "Timișoara", Pitesti: "Pitești" };
const X = (c) => (c[0] - 70) * 1.0, Y = (c) => (600 - c[1]) * 1.0;
export const romania = (() => {
  let s = `<svg viewBox="0 0 520 360" class="gsvg" style="max-width:640px" role="img" aria-label="Romania road map">`;
  for (const [a, b, w] of E) { const p = C[a], q = C[b]; s += `<line x1="${X(p)}" y1="${Y(p)}" x2="${X(q)}" y2="${Y(q)}" class="ge"/><text x="${(X(p) + X(q)) / 2}" y="${(Y(p) + Y(q)) / 2 - 2}" class="gw" style="fill:var(--accent)">${w}</text>`; }
  for (const [n, c] of Object.entries(C)) { const st = n === "Arad" ? " start" : n === "Bucharest" ? " goal" : ""; s += `<circle cx="${X(c)}" cy="${Y(c)}" r="5" class="gn${st}"/><text x="${X(c)}" y="${Y(c) - 8}" class="gl" style="font-size:10px">${NAME[n] || n}</text><text x="${X(c)}" y="${Y(c) + 15}" class="gh" style="font-size:9px">h=${H[n]}</text>`; }
  return s + `</svg><div class="muted tiny" style="text-align:center">Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.</div>`;
})();

const node = (x, y, t, s, cls = "tn") => `<rect x="${x - 44}" y="${y}" width="88" height="34" rx="8" class="${cls}"/><text x="${x}" y="${y + 14}" class="tt" style="font-size:11px">${t}</text><text x="${x}" y="${y + 28}" class="ts">${s}</text>`;
const split = (attr, parent, br) => { const W = 380; let s = `<svg viewBox="0 0 ${W} 150" class="tsvg">${node(W / 2, 4, attr + "?", parent, "tn root")}`; br.forEach(([lab, c], i) => { const x = (W / (br.length + 1)) * (i + 1); s += `<line x1="${W / 2}" y1="38" x2="${x}" y2="100" class="te"/><text x="${(W / 2 + x) / 2 + (x < W / 2 ? -10 : 10)}" y="72" class="tlab">${lab}</text>${node(x, 100, "", c)}`; }); return s + "</svg>"; };
export const restaurant = split("Patrons", "[6+, 6−]", [["None", "[0+, 2−]"], ["Some", "[4+, 0−]"], ["Full", "[2+, 4−]"]]) + split("Type", "[6+, 6−]", [["French", "[1+, 1−]"], ["Italian", "[1+, 1−]"], ["Thai", "[2+, 2−]"], ["Burger", "[2+, 2−]"]]) + `<div class="muted tiny" style="text-align:center">Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).</div>`;
export const restaurantTree = `<svg viewBox="0 0 420 170" class="tsvg">${node(210, 4, "Patrons?", "")}<line x1="210" y1="38" x2="70" y2="90" class="te"/><line x1="210" y1="38" x2="210" y2="90" class="te"/><line x1="210" y1="38" x2="350" y2="90" class="te"/><text x="130" y="62" class="tlab">None</text><text x="222" y="70" class="tlab">Some</text><text x="290" y="62" class="tlab">Full</text>${node(70, 90, "No", "")}${node(210, 90, "Yes", "")}${node(350, 90, "WaitEstimate?", "")}<text x="350" y="150" class="ts">>60 No · 30-60 Alternate? · 10-30 Hungry? · 0-10 Yes</text></svg>`;

const burglary = `<svg viewBox="0 0 360 190" class="gsvg"><line x1="80" y1="35" x2="170" y2="95" class="ge"/><line x1="280" y1="35" x2="190" y2="95" class="ge"/><line x1="170" y1="110" x2="90" y2="160" class="ge"/><line x1="190" y1="110" x2="270" y2="160" class="ge"/>
<ellipse cx="80" cy="28" rx="46" ry="15" class="gn"/><text x="80" y="32" class="gl">Burglary</text><ellipse cx="280" cy="28" rx="52" ry="15" class="gn"/><text x="280" y="32" class="gl">Earthquake</text><ellipse cx="180" cy="102" rx="38" ry="15" class="gn"/><text x="180" y="106" class="gl">Alarm</text><ellipse cx="80" cy="168" rx="50" ry="15" class="gn"/><text x="80" y="172" class="gl">JohnCalls</text><ellipse cx="280" cy="168" rx="50" ry="15" class="gn"/><text x="280" y="172" class="gl">MaryCalls</text></svg>`;
export const burglaryBN = burglary + table(["P(B)", "P(E)"], [[".001", ".002"]]) + table(["B", "E", "P(A=t | B,E)"], [["t", "t", ".95"], ["t", "f", ".94"], ["f", "t", ".29"], ["f", "f", ".001"]]) + table(["A", "P(J=t | A)", "P(M=t | A)"], [["t", ".90", ".70"], ["f", ".05", ".01"]]);
export const birdNet = `<svg viewBox="0 0 380 210" class="gsvg"><line x1="190" y1="30" x2="190" y2="82" class="ge"/><line x1="190" y1="92" x2="95" y2="132" class="ge"/><line x1="190" y1="92" x2="285" y2="132" class="ge"/><line x1="95" y1="142" x2="95" y2="178" class="ge"/><line x1="285" y1="142" x2="285" y2="178" class="ge"/><line x1="160" y1="88" x2="64" y2="88" class="ge"/><line x1="220" y1="88" x2="312" y2="88" class="ge"/><line x1="320" y1="140" x2="345" y2="178" class="ge"/>
<ellipse cx="190" cy="22" rx="38" ry="12" class="gn"/><text x="190" y="26" class="gl">Animal</text><ellipse cx="190" cy="88" rx="30" ry="12" class="gn"/><text x="190" y="92" class="gl">Bird</text><ellipse cx="40" cy="88" rx="24" ry="11" class="gn"/><text x="40" y="92" class="gl">Fly</text><ellipse cx="340" cy="88" rx="32" ry="11" class="gn"/><text x="340" y="92" class="gl">Wings</text>
<ellipse cx="95" cy="137" rx="38" ry="12" class="gn"/><text x="95" y="141" class="gl">Penguin</text><ellipse cx="285" cy="137" rx="38" ry="12" class="gn"/><text x="285" y="141" class="gl">Canary</text><ellipse cx="95" cy="188" rx="30" ry="11" class="gn goal"/><text x="95" y="192" class="gl">Pingu</text><ellipse cx="270" cy="188" rx="32" ry="11" class="gn goal"/><text x="270" y="192" class="gl">Tweety</text><ellipse cx="350" cy="188" rx="28" ry="11" class="gn"/><text x="350" y="192" class="gl">Yellow</text>
<text x="112" y="82" class="gw">can</text><text x="262" y="82" class="gw">has part</text><text x="52" y="116" class="gw">cannot (fly)</text><text x="225" y="55" class="gw">subclass of</text><text x="140" y="118" class="gw">subclass of</text><text x="132" y="165" class="gw">member of</text><text x="232" y="165" class="gw">member of</text><text x="352" y="160" class="gw">has colour</text></svg>`;
export const personsNet = `<svg viewBox="0 0 400 210" class="gsvg"><line x1="200" y1="30" x2="200" y2="70" class="ge"/><line x1="200" y1="92" x2="100" y2="128" class="ge"/><line x1="200" y1="92" x2="300" y2="128" class="ge"/><line x1="100" y1="150" x2="100" y2="178" class="ge"/><line x1="300" y1="150" x2="300" y2="178" class="ge"/><line x1="130" y1="188" x2="270" y2="188" class="ge"/>
<ellipse cx="200" cy="20" rx="44" ry="13" class="gn"/><text x="200" y="24" class="gl">Mammals</text><ellipse cx="200" cy="82" rx="42" ry="13" class="gn"/><text x="200" y="86" class="gl">Persons</text><ellipse cx="100" cy="139" rx="60" ry="13" class="gn"/><text x="100" y="143" class="gl">Female Persons</text><ellipse cx="300" cy="139" rx="56" ry="13" class="gn"/><text x="300" y="143" class="gl">Male Persons</text><ellipse cx="100" cy="190" rx="32" ry="12" class="gn goal"/><text x="100" y="194" class="gl">Mary</text><ellipse cx="300" cy="190" rx="32" ry="12" class="gn goal"/><text x="300" y="194" class="gl">John</text>
<text x="222" y="52" class="gw">SubsetOf</text><text x="140" y="108" class="gw">SubsetOf</text><text x="262" y="108" class="gw">SubsetOf</text><text x="62" y="166" class="gw">MemberOf</text><text x="338" y="166" class="gw">MemberOf</text><text x="200" y="182" class="gw">SisterOf</text><text x="270" y="78" class="gw">Legs = 2</text><text x="360" y="196" class="gw">Legs = 1</text><text x="110" y="72" class="gw">HasMother → Female Persons</text></svg>`;
export const gridWorld = grid([["", "", "", "+1"], ["", "▓ wall", "", "−1"], ["START", "", "", ""]], { caption: "Workshop 6 grid world: columns 1-4, rows 3 (top) to 1; START (1,1), wall (2,2), +1 (4,3), −1 (4,2). Up = 0.8 up, 0.1 left, 0.1 right; −0.04 per step" });
const tree15 = (() => { const L = "ABCDEFGHIJKLMNO".split(""); let s = `<svg viewBox="0 0 400 170" class="gsvg">`; const pos = {}; L.forEach((n, i) => { const d = Math.floor(Math.log2(i + 1)), k = i + 1 - 2 ** d, cnt = 2 ** d; pos[n] = [(400 / (cnt + 1)) * (k + 1), 20 + d * 45]; }); L.forEach((n, i) => { if (i) { const p = pos[L[Math.floor((i - 1) / 2)]]; s += `<line x1="${p[0]}" y1="${p[1]}" x2="${pos[n][0]}" y2="${pos[n][1]}" class="ge"/>`; } }); L.forEach((n) => (s += `<circle cx="${pos[n][0]}" cy="${pos[n][1]}" r="11" class="gn${n === "M" ? " goal" : n === "A" ? " start" : ""}"/><text x="${pos[n][0]}" y="${pos[n][1] + 4}" class="gl">${n}</text>`)); return s + "</svg>"; })();
const tree7 = `<svg viewBox="0 0 300 120" class="gsvg"><line x1="150" y1="20" x2="80" y2="60" class="ge"/><line x1="150" y1="20" x2="220" y2="60" class="ge"/><line x1="80" y1="60" x2="45" y2="100" class="ge"/><line x1="80" y1="60" x2="115" y2="100" class="ge"/><line x1="220" y1="60" x2="185" y2="100" class="ge"/><line x1="220" y1="60" x2="255" y2="100" class="ge"/>${[["A", 150, 20], ["B", 80, 60], ["C", 220, 60], ["D", 45, 100], ["E", 115, 100], ["F", 185, 100], ["G", 255, 100]].map(([n, x, y]) => `<circle cx="${x}" cy="${y}" r="12" class="gn"/><text x="${x}" y="${y + 4}" class="gl">${n}</text>`).join("")}</svg>`;
const ontology = table(["Relation", "Subject → Object"], [["subclass of", "Student → Person; Academic → Person"], ["enrols in", "Student → Course (e.g. Alice : Student enrols in Data Analytics : Course)"], ["includes", "Course → Subject (Data Analytics includes AI Foundations)"], ["owned by", "Subject → Department (AI Foundations owned by School of CS)"], ["scheduled in", "Subject → Room (e.g. CB11.07)"]]);
const nbWords = table(["word", "count in + (T₊ = 20)", "count in − (T₋ = 18)", "P_s(w|+)", "P_s(w|−)"], [["heartwarming", 6, 2, "7/26 ≈ 0.27", "3/24 ≈ 0.13"], ["delightful", 5, 2, "6/26 ≈ 0.23", "3/24 ≈ 0.13"], ["slow", 2, 6, "3/26 ≈ 0.12", "7/24 ≈ 0.29"], ["repetitive", 1, 6, "2/26 ≈ 0.08", "7/24 ≈ 0.29"], ["charming", 6, 1, "7/26 ≈ 0.27", "2/24 ≈ 0.08"], ["dull", 0, 1, "1/26 ≈ 0.04", "2/24 ≈ 0.08"]]) + `<div class="muted tiny">Lecture 8: 11 positive and 9 negative reviews → P(+) = 0.55, P(−) = 0.45; |V| = 6.</div>`;
const svmPts = table(["Point", "x₁", "x₂", "y"], [["P1", 3, 3, "+1"], ["P2", 4, 3, "+1"], ["P3", 1, 1, "−1"]]) + `<div class="muted tiny">Lecture 4 slide 71: separator w = (0.5, 0.5), b = −2.</div>`;
const house = table(["Point", "area", "bedrooms", "price ($1000)", "distance to (90, 2)"], [["3", 80, 2, 220, "10.00"], ["4", 100, 3, 260, "10.05"], ["2", 60, 2, 180, "30.00"], ["5", 120, 3, 300, "30.02"], ["1", 50, 1, 150, "40.01"], ["6", 150, 4, 360, "60.03"], ["7", 200, 5, 450, "110.04"]]);
const roulette = table(["Individual", "Fitness", "P = f/78", "Wheel segment (x4, x3, x2, x1 order)"], [["x1", 24, "0.31", "[0.69, 1.0]"], ["x2", 23, "0.29", "[0.40, 0.69)"], ["x3", 20, "0.26", "[0.14, 0.40)"], ["x4", 11, "0.14", "[0, 0.14)"]]);
const seven = grid([[1, 1, 1, 1, 1], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [0, 1, 0, 0, 0]], { caption: "Input '7' (5×5)" }) + grid([[-1, -1, 1], [-1, 1, -1], [1, -1, -1]], { caption: "Diagonal kernel" });
const cnnShapes = table(["Block", "Output shape"], [["Input", "1×28×28"], ["Conv2d(1,16,3,stride=2,padding=1)", "16×14×14"], ["MaxPool2d(2)", "16×7×7"], ["Conv2d(16,32,3,padding=1)", "32×7×7"], ["MaxPool2d(2)", "32×3×3"], ["Flatten", "288"], ["Linear(288, 10)", "10 logits"]]);
const astarFrontier = table(["Node", "g", "h", "f = g + h"], [["Sibiu", 140, 253, 393], ["Timișoara", 118, 329, 447], ["Zerind", 75, 374, 449], ["Râmnicu Vâlcea (via S)", 220, 193, 413], ["Făgăraș (via S)", 239, 176, 415], ["Pitești (via RV)", 317, 100, 417], ["Bucharest (via F)", 450, 0, 450], ["Bucharest (via P)", 418, 0, 418]]);

// Rules: [regex on stem/source, visual]
export const RULES = [
  [/Romania|Arad|Bucharest|Sibiu|Râmnicu|Făgăraș|Pitești|Timișoara|Zerind|straight-line distance \(SLD\)/i, romania],
  [/frontier contains Făgăraș 415|A\* run, when Făgăraș/i, astarFrontier],
  [/restaurant tree|Patrons = Some leads|Restaurant tree/i, restaurantTree],
  [/Restaurant data|Patrons|Type gives IG|every Type branch|WillWait/i, restaurant],
  [/burglary|JohnCalls|MaryCalls|P\(B \| j, m\)|s_B|s_¬B|P\(A \| ¬B, E\)|enumeration tree|Σₑ P\(E\)|P\(B \| event\)|E = true and E = false/i, burglaryBN],
  [/Pingu|Tweety|Canary|Penguin/i, birdNet],
  [/Persons|Mary|Susan|John has an explicit/i, personsNet],
  [/grid world|4×3/i, gridWorld],
  [/depth-3 binary tree A\.\.O/i, tree15],
  [/Binary tree A has children B, C/i, tree7],
  [/Alice|university ontology|enrols in|scheduledIn|CB11\.07/i, ontology],
  [/heartwarming|Poll 3/i, nbWords],
  [/w = \(0\.5, 0\.5\), b = −2/i, svmPts],
  [/House example/i, house],
  [/wheel order x4|fitness 24, 23, 20, 11/i, roulette],
  [/Lecture 7 '7' example|'7' example/i, seven],
  [/Custom CNN|FashionCNN/i, cnnShapes],
];

// Map a source string to slide image references (DECK/page)
const DECK = { "Lecture 2": "L2", "Lecture 3": "L3", "Lecture 4": "L4", "Workshop 5": "W5", "Workshop 6": "W6", "Lecture 7": "L7", "Lecture 8": "L8", "Lecture 9": "L9", "Lecture 10": "L10", "Lecture 11": "L11", "Lecture 12": "L12" };
export function slidesFor(src = "") {
  const out = [];
  const re = /(Lecture \d+|Workshop \d)[^;]*?slides? ([\d,\s\-–]+)/g; let m;
  while ((m = re.exec(src))) {
    const d = DECK[m[1]]; if (!d) continue;
    for (const part of m[2].split(",")) { const [a, b] = part.trim().split(/[-–]/).map((x) => parseInt(x)); if (isNaN(a)) continue; for (let p = a; p <= (b || a) && p < a + 4; p++) out.push(`${d}/${p}`); }
  }
  const fib = src.match(/(A\*|GBFS|UCS) Romania fill-in-blanks Q(\d)/); if (fib) out.push(`${{ "A*": "ASTAR", GBFS: "GBFS", UCS: "UCS" }[fib[1]]}/${+fib[2] + 1}`);
  if (/Key points about IoU/.test(src)) out.push("KPIOU/1");
  if (/Key points about Attention/.test(src)) out.push("KPATT/1");
  if (/Key points about convolution/.test(src)) out.push("KPCONV/1");
  if (/Key points about a simple RNN/.test(src)) out.push("KPRNN/1");
  if (/Comparing two attributes|step-by-step/i.test(src)) out.push("DT/5", "DT/7");
  const ex = [[/Enumeration Reasoning MCQ Q(\d)/, "EX1"], [/No_Burglary_Expansion MCQ Q(\d)/, "EX2"], [/Marginalisation fill-in-blanks Q(\d)/, "EX3", (q) => (q <= 3 ? 1 : 2)], [/Inference Calculation MCQs Q(\d)/, "EX4"], [/Reasoning Process Multiple Answer Quiz 3/, "EX5"], [/Bayesian_Network_Reasoning_Process_Quiz Q(\d)/, "EX6"], [/Causal and Diagnostic Directions MCQ Q(\d)/, "EX7"], [/Reasoning Process Matching Quiz Q(\d)/, "EX8"], [/Reasoning Process Multiple Answer Quiz 1/, "EX9"]];
  for (const [r, d, f] of ex) { const mm = src.match(r); if (mm) out.push(`${d}/${mm[1] ? (f ? f(+mm[1]) : +mm[1]) : 1}`); }
  return [...new Set(out)].slice(0, 4);
}

export const DECKS = [
  ["L2", "Lecture 2 · Classic search", "search"], ["UCS", "UCS Romania fill-in-blanks", "search"], ["GBFS", "Greedy best-first Romania fill-in-blanks", "search"], ["ASTAR", "A* Romania fill-in-blanks", "search"],
  ["L3", "Lecture 3 · Local search", "local"], ["L4", "Lecture 4 · Supervised learning", "ml"], ["DT", "Comparing two attributes to split (Type vs Patrons)", "trees"],
  ["W5", "Workshop 5 · Neural network models", "nn"], ["W6", "Workshop 6 · Reinforcement learning", "mdp"], ["L7", "Lecture 7 · Computer vision", "cnn"], ["KPCONV", "Key points: convolution filters & parameters", "cnn"], ["KPIOU", "Key points: IoU & NMS", "detect"],
  ["L8", "Lecture 8 · Sequence modelling & attention", "seq"], ["KPRNN", "Key points: RNN hidden-state update", "seq"], ["KPATT", "Key points: attention", "attn"], ["L9", "Lecture 9 · Generative AI", "genai"],
  ["L10", "Lecture 10 · Logic & inference", "logic"], ["L11", "Lecture 11 · Bayesian networks", "bayes"], ["EX1", "Lec11 exercise: enumeration reasoning", "bayes"], ["EX2", "Lec11 exercise: no-burglary expansion", "bayes"], ["EX3", "Lec11 exercise: marginalisation", "bayes"], ["EX4", "Lec11 exercise: inference calculation", "bayes"], ["EX5", "Lec11 exercise: multiple answer 3", "bayes"], ["EX6", "Lec11 exercise: BN reasoning process", "bayes"], ["EX7", "Lec11 exercise: causal vs diagnostic", "bayes"], ["EX8", "Lec11 exercise: matching", "bayes"], ["EX9", "Lec11 exercise: multiple answer 1", "bayes"],
  ["L12", "Lecture 12 · Knowledge representation", "kr"],
];
