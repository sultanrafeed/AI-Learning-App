import { makeAuthor } from "./helpers.mjs";
import { table } from "../js/gen-core.js";
const A = makeAuthor("attn", "Lecture 8 (Self-attention)");
const L = (p) => `Lecture 8, slide ${p}`;
const KP = "Key points about Attention";
export const coverage = [
  { id: "attn-intro", text: "RNN limits (encoding bottleneck, slow sequential computation, weak long-range memory); dense alternative fails; each token retrieves the context it needs ([CLS] example)", src: L("62-64") },
  { id: "attn-qkv", text: "Attention as search: Query (information need), Key (compact description for matching), Value (full information returned); Poll 4 Q/K/V assignment", src: L("65-70") },
  { id: "attn-scores", text: "Query-key dot-product scores, scaled by √d_k (control query, d_k = 3)", src: L(74) },
  { id: "attn-softmax", text: "Row-wise softmax turns scores into weights that sum to 1", src: L(76) + "; Python warm-up softmax" },
  { id: "attn-aggregate", text: "Weighted value aggregation: output = Σ wᵢvᵢ component by component ([0.3, 0.7] → [0.6, 1.4]); Z = AV", src: KP + "; " + L(77) },
  { id: "attn-full", text: "Full scaled dot-product attention softmax(QKᵀ/√d_k)V for one query", src: L("73-78") },
  { id: "attn-matrix", text: "Matrix form: Q = XW_Q, K = XW_K, V = XW_V; S = QKᵀ/√d_k (8×8); A = row-softmax(S); Z = AV (8×3)", src: L("73-77") },
  { id: "attn-position", text: "Positional encoding added to token embeddings; sinusoidal PE(pos, 2i) = sin, PE(pos, 2i + 1) = cos", src: L(72) },
  { id: "attn-multihead", text: "Self-attention head steps; multi-head attention Concat(head₁…head_h)W^O; transformer encoder block (Add & Norm, feed-forward, N×); applications (Llama 3, AlphaFold 3, SAM 2, RT-2)", src: L("78-80") },
];
export const formulas = [
  { name: "Score", f: "scoreᵢ = q · kᵢ / √d_k", note: "scaled dot product" }, { name: "Softmax", f: "wᵢ = e^{scoreᵢ} / Σⱼ e^{scoreⱼ}", note: "weights sum to 1" },
  { name: "Output", f: "z = Σᵢ wᵢ vᵢ", note: "same length as each value" }, { name: "Self-attention", f: "Attention(Q, K, V) = softmax(QKᵀ/√d_k) V", note: "Q = XW_Q, K = XW_K, V = XW_V" },
  { name: "Multi-head", f: "MultiHead(Q,K,V) = Concat(head₁,…,head_h) W^O", note: "" }, { name: "Positional encoding", f: "PE(pos,2i) = sin(pos/10000^{2i/d}), PE(pos,2i+1) = cos(…)", note: "" },
];
export const glossary = [
  { term: "Query", def: "Vector expressing what a token is looking for (the information need)." }, { term: "Key", def: "Compact description of each token used for matching against queries." },
  { term: "Value", def: "The information a token contributes once matched." }, { term: "Attention weight", def: "Softmax-normalised relevance of a key to a query." },
  { term: "Self-attention", def: "Attention where queries, keys and values all come from the same sequence." }, { term: "Positional encoding", def: "Position information added to token embeddings so order is known." },
  { term: "Multi-head attention", def: "Several attention heads in parallel, each learning different patterns, concatenated and projected by W^O." },
  { term: "Transformer encoder block", def: "Multi-head self-attention + Add & Norm + feed-forward + Add & Norm, repeated N times." },
];
export const learn = [
  { id: "attn-intro", title: "Why attention?", cov: ["attn-intro", "attn-qkv"], src: L("62-70"),
    hook: "Instead of squeezing everything through one memory, let every token look up what it needs.",
    visual: table(["Role", "Search analogy (online shop)"], [["Query (Q)", "what you type: the information need"], ["Key (K)", "product titles: compact descriptions to match"], ["Value (V)", "the full product info returned"], ["Score", "query-key relevance (0.67, 0.58, 0.83, …)"], ["Weight", "normalised relevance → highest-weight value"]]),
    formula: [["RNN limits", "bottleneck, slow sequential, weak long-range memory"], ["Poll 4 answer", "Q = question projection; K = log-token keys for matching; V = separate log-token values"]],
    example: ["[CLS] review query: 'heartwarming' gets 38% of the attention → POSITIVE."],
    memory: "Q asks, K answers 'is it me?', V hands over the goods.", trap: "Keys are for MATCHING; values are what gets AGGREGATED. Don't swap them.", check: "attn-c-intro-1" },
  { id: "attn-calc", title: "Scores → softmax → weighted sum", cov: ["attn-scores", "attn-softmax", "attn-aggregate", "attn-full"], src: L("74-77") + "; " + KP,
    hook: "Three steps: compare, normalise, blend.",
    visual: table(["Key", "score q·k", "exp", "weight", "weight × value"], [["k₁", "1", "2.718", "0.269", "0.269·v₁"], ["k₂", "2", "7.389", "0.731", "0.731·v₂"], ["Σ", "", "10.107", "1.000", "output"]]),
    formula: [["score = q·k / √d_k", "dot product, scaled"], ["w = softmax(score)", "positive, sum to 1"], ["out = Σ wᵢvᵢ", "component by component"]],
    example: ["Key points: weights [0.3, 0.7], values [2, 0], [0, 2] → [0.3×2 + 0.7×0, 0.3×0 + 0.7×2] = [0.6, 1.4]."],
    memory: "Dot, Divide, Softmax, Sum.", trap: "Do not just pick the highest-weight value, and do not add the values unweighted.", check: "attn-c-calc-1" },
  { id: "attn-matrix", title: "Self-attention in matrix form", cov: ["attn-matrix", "attn-position", "attn-multihead"], src: L("72-80"),
    hook: "Do it for every token at once with matrix multiplications.",
    visual: table(["Step", "Shape (8 tokens, d = 4, d_k = 3)"], [["X (position-aware)", "8×4"], ["Q = XW_Q, K, V", "8×3"], ["S = QKᵀ/√d_k", "8×8"], ["A = row-softmax(S)", "8×8, each row sums to 1"], ["Z = AV", "8×3"]]),
    formula: [["PE(pos, 2i)", "sin(pos/10000^{2i/d_model})"], ["Multi-head", "Concat(head₁…head_h)W^O"], ["Encoder block", "MHSA → Add & Norm → FFN → Add & Norm (×N)"]],
    example: ["'control' query row of A: 0.08 0.07 0.12 0.08 0.09 0.16 0.17 0.22 → most attention on 'knob'."],
    memory: "Rows are queries, columns are keys.", trap: "Without positional encoding, self-attention can't tell word order.", check: "attn-c-mat-1" },
];
export const cheat = { title: "Attention cheat sheet",
  rows: [["Score", "q·k/√d_k", "dot product", ""], ["Weights", "softmax(scores)", "sum to 1", ""], ["Output", "Σ wᵢvᵢ", "[0.3,0.7] → [0.6, 1.4]", ""], ["Matrix", "softmax(QKᵀ/√d_k)V", "S is T×T", ""], ["Multi-head", "Concat·W^O", "different patterns", ""]],
  traps: ["Divide by √d_k, not d_k.", "Exponentiate before normalising.", "Keys match; values are aggregated.", "Each ROW of A sums to 1.", "Add positional encoding to embeddings."] };

A.mcq("c-intro-1", "Medium", "Poll 4: 'What was Mando searching for?' attends to mission-log tokens. Which Q/K/V assignment is correct?", "Q = question projection; K = log-token key projections for matching; V = separate log-token value projections for aggregation", [["Q = log-token projections; K = question projection; V = question projection repeated", "Direction of retrieval reversed."], ["Q = question projection; K = log-token value projections; V = log-token key projections", "Keys and values swapped."], ["Q = question projection; K = log-token keys; V = attention scores over log tokens", "Scores are not values."]], "The question asks; the log tokens answer.", { cov: ["attn-qkv"], src: L(70) });
A.multi("c-intro-2", "Medium", "Which are limitations of RNNs named in Lecture 8?", [["Encoding bottleneck", true, ""], ["Slow sequential computation", true, ""], ["Weak long-range memory", true, ""], ["They cannot use non-linear activations", false, "They use tanh."]], "Three limits motivate attention.", { cov: ["attn-intro"], src: L(62) });
A.match("c-intro-3", "Easy", "Match each attention component to its role.", [["Query", "the information need"], ["Key", "compact description used for matching"], ["Value", "full information returned after a match"]], ["the loss function"], "Attention as a search process.", { cov: ["attn-qkv"], src: L("65-67") });
A.tf("c-intro-4", "Medium", "Feeding every position into one fixed dense block is a good alternative to recurrence because it is scalable and keeps order.", false, "It has no flexible input, is not scalable and has no explicit sequence order.", "Next idea: attend to what matters.", { cov: ["attn-intro"], src: L(63) });
A.mcq("c-calc-1", "Easy", "Key points: weights [0.3, 0.7], values [2, 0] and [0, 2]. Output?", "[0.6, 1.4]", [["[0, 2]", "Picked only the largest-weight value."], ["[2, 2]", "Added unweighted values."], ["[1.4, 0.6]", "Components swapped."]], "Weight each value, then add per component.", { cov: ["attn-aggregate"], calc: true, src: KP });
A.tf("c-calc-2", "Easy", "Normalised attention weights for one query sum to 1.", true, "Softmax output.", "Row of A sums to 1.", { cov: ["attn-softmax"], trap: false });
A.tf("c-calc-3", "Medium", "In scaled dot-product attention, scores are divided by d_k.", false, "Divided by √d_k.", "√d_k keeps softmax from saturating.", { cov: ["attn-scores"] });
A.mcq("c-calc-4", "Medium", "Scores [2, 1, 0.1] → softmax weights?", "[0.659, 0.242, 0.099]", [["[0.645, 0.323, 0.032]", "Divided raw scores by their sum."], ["[0.333, 0.333, 0.333]", "Uniform only if scores are equal."], ["[7.389, 2.718, 1.105]", "Forgot to normalise."]], "Python warm-up 2 expected output.", { cov: ["attn-softmax"], calc: true, src: "Python additional warm-up 2 (softmax)" });
A.blanks("c-calc-5", "Medium", "q = [1, 2], k₁ = [1, 0], k₂ = [0, 1]. Raw scores q·k₁ = ___, q·k₂ = ___.", ["q·k₁", "q·k₂"], ["1", "2"], null, "Dot products.", { cov: ["attn-scores"], calc: true });
A.blank("c-calc-6", "Hard", "Scores 1 and 2 (already scaled). Softmax weight on the second key (3 dp)?", "0.731", ["0.73"], "e²/(e¹ + e²) = 7.389/10.107.", { cov: ["attn-softmax", "attn-full"], calc: true, tol: 0.0015 });
A.mcq("c-calc-7", "Medium", "Dot product measures query-key compatibility. More aligned vectors give…", "a larger score", [["a smaller score", "Opposite."], ["a score of exactly 1", "Not normalised."], ["a negative score", "Aligned → positive."]], "Lecture 8 slide 74.", { cov: ["attn-scores"], src: L(74) });
A.mcq("c-mat-1", "Medium", "With 8 tokens, the score matrix S = QKᵀ/√d_k has shape…", "8×8", [["8×3", "That's Q, K, V or Z."], ["3×3", "d_k × d_k is not the score matrix."], ["8×4", "That's X."]], "One score per query-key pair.", { cov: ["attn-matrix"], calc: true, src: L(75) });
A.match("c-mat-2", "Medium", "Match each matrix in the Lecture 8 example to its shape (8 tokens, d = 4, d_k = 3).", [["X", "8×4"], ["W_Q", "4×3"], ["S = QKᵀ/√d_k", "8×8"], ["Z = AV", "8×3"]], ["3×8 output"], "Track the shapes.", { cov: ["attn-matrix"], src: L("73-77") });
A.tf("c-mat-3", "Medium", "Each COLUMN of the attention matrix A = row-softmax(S) sums to 1.", false, "Each ROW (one query's distribution over keys) sums to 1.", "Row-softmax.", { cov: ["attn-matrix"], src: L(76) });
A.multi("c-mat-4", "Medium", "Select ALL steps of one self-attention head (Lecture 8).", [["Add position information", true, ""], ["Project tokens into query, key and value spaces", true, ""], ["Compute and normalise query-key scores", true, ""], ["Combine value vectors using attention weights", true, ""], ["Pass tokens through an RNN first", false, "No recurrence needed."]], "Four steps.", { cov: ["attn-matrix", "attn-multihead"], src: L(78) });
A.mcq("c-pos-1", "Medium", "Why is positional encoding needed in self-attention?", "Self-attention by itself has no notion of token order", [["To reduce the vocabulary size", "No."], ["To normalise the attention weights", "Softmax does that."], ["To replace the value vectors", "It's added to embeddings."]], "Order must be injected.", { cov: ["attn-position"], src: L(72) });
A.blank("c-pos-2", "Medium", "PE(pos, 2i) uses ______ and PE(pos, 2i + 1) uses cos.", "sin", ["sine"], "Even dims sin, odd dims cos.", { cov: ["attn-position"], src: L(72) });
A.blank("c-pos-3", "Hard", "PE(1, 0) with any d_model (pos = 1, i = 0) = sin(1) = ______ (3 dp, radians).", "0.841", ["0.84"], "10000⁰ = 1, sin(1 rad).", { cov: ["attn-position"], calc: true, tol: 0.0015 });
A.tf("c-pos-4", "Easy", "Positional encodings are added to the token embeddings to give position-aware encodings.", true, "Lecture 8 slide 72.", "Embedding + p_i.", { cov: ["attn-position"], trap: false });
A.mcq("c-mh-1", "Medium", "In multi-head attention, why use several heads?", "Different heads can learn different attention patterns and relationships", [["To reduce the number of parameters to zero", "Heads add parameters."], ["To make attention sequential", "Heads run in parallel."], ["To replace positional encoding", "Unrelated."]], "Face / cookie / cookie box heads.", { cov: ["attn-multihead"], src: L(79) });
A.match("c-mh-2", "Medium", "Match each Lecture 8 application to its tokens.", [["Llama 3", "text"], ["AlphaFold 3", "molecular entities"], ["SAM 2", "image patches"], ["RT-2", "observations and actions"]], ["audio waveforms"], "Attention connects many modalities.", { cov: ["attn-multihead"], src: L(80) });
A.multi("c-mh-3", "Hard", "Select ALL parts of the transformer encoder block in Lecture 8.", [["Multi-head self-attention", true, ""], ["Add & Norm with residual paths", true, ""], ["Feed-forward layer", true, ""], ["Repeated N times", true, ""], ["A recurrent hidden state", false, "No recurrence."]], "MHSA → Add & Norm → FFN → Add & Norm.", { cov: ["attn-multihead"], src: L(79) });
A.blank("c-mh-4", "Medium", "MultiHead(Q, K, V) = Concat(head₁, …, head_h)·______.", "W^O", ["WO", "W_O", "Wo"], "Output projection.", { cov: ["attn-multihead"], src: L(79) });
A.match("c-cmp-1", "Hard", "Compare models: match each to its key property.", [["CNN", "local filters with shared weights over space"], ["RNN", "hidden state carried step by step through time"], ["Self-attention", "every token attends to every token in parallel"], ["N-gram", "counts of a fixed short history"]], ["random forest of trees"], "Cross-topic comparison.", { cov: ["attn-intro"] });

export const questions = A.out;
