// Maths Toolkit world: Book 3 Part I (the maths you need), explained from zero.
// Not a lecture topic itself, but every exam calculation uses it.
import { makeAuthor } from "./helpers.mjs";
import { table } from "../js/gen-core.js";
import { b3, b3c, B3CH } from "./bookmap.mjs";

const A = makeAuthor("math", "Book 3 (AI from zero), Part I");
const pg = (ch, extra = 0) => [`B3/${B3CH[ch] + extra}`];
export const coverage = [
  { id: "math-symbols", text: "Reading maths: variables, ŷ, ȳ, subscripts vs powers, Greek letters (α, γ, ε, σ, μ, θ, π, Δ), operators (≈, ∝, ←, |x|, ‖x‖, ⌊x⌋, ∈, ⊆, ∀, ∃, ⊨, ⊙), max vs argmax, order of operations, calculator skills", src: b3c(1) },
  { id: "math-functions", text: "Functions, straight lines (slope, intercept), quadratics and their minimum x = −b/2a, global vs local optima, piecewise functions (ReLU, step)", src: b3c(2) },
  { id: "math-explog", text: "Powers, e and the exponential, logarithms (log₂, ln, log₁₀), log rules, change of base, 0 log 0 = 0, why logs turn products into sums", src: b3c(3) },
  { id: "math-sums", text: "Σ and Π notation, double sums, means and weighted averages (expected value, weighted entropy, attention)", src: b3c(4) },
  { id: "math-vectors", text: "Vectors, dot product, norm, Euclidean and Manhattan distance, cosine similarity, matrices, matrix × vector, shapes, transpose, elementwise ⊙, one-hot × matrix, tensors", src: b3c(5) },
  { id: "math-calculus", text: "Slope, derivative, derivative rules (incl. σ′ = σ(1 − σ)), chain rule, partial derivatives, gradient, gradient descent and the learning rate", src: b3c(6) },
  { id: "math-prob", text: "Probability from scratch: outcomes, events, five rules (NOT, OR, AND, GIVEN, general OR), independence, joint tables, marginalisation, Bayes' rule, expected value, distributions (Bernoulli, categorical, Gaussian), estimating by counting", src: b3c(7) },
];
export const formulas = [
  { name: "Change of base", f: "log₂x = ln x / ln 2", note: "log₂(1/3) = −1.585" }, { name: "Quadratic minimum", f: "x = −b/(2a)", note: "x² − 4x + 7 → x = 2" },
  { name: "Dot product", f: "w·x = Σ wᵢxᵢ", note: "" }, { name: "Cosine similarity", f: "x·y / (‖x‖‖y‖)", note: "" },
  { name: "Chain rule", f: "dy/dx = dy/du · du/dx", note: "backprop" }, { name: "Gradient descent", f: "w ← w − α ∂L/∂w", note: "" },
  { name: "General OR", f: "P(A∨B) = P(A) + P(B) − P(A∧B)", note: "" }, { name: "Expected value", f: "E[X] = Σ x P(X = x)", note: "" },
];
export const glossary = [
  { term: "argmax", def: "The input that gives the largest value (an action), not the value itself (that is max)." },
  { term: "Logarithm", def: "log_b(x) answers: to what power must b be raised to give x?" },
  { term: "Dot product", def: "Multiply matching entries and add; measures how much two vectors point the same way." },
  { term: "Derivative", def: "Slope of a curve at one point: how fast the output changes when the input is nudged." },
  { term: "Chain rule", def: "Effects along a chain multiply: dy/dx = dy/du · du/dx. The heart of backpropagation." },
  { term: "Gradient", def: "Vector of all partial derivatives; points uphill. Gradient descent steps the other way." },
  { term: "Marginalisation", def: "Summing a joint distribution over the variables you don't care about." },
  { term: "Expected value", def: "Probability-weighted average outcome." },
  { term: "Tensor", def: "General name for a number, vector, matrix or stack of matrices (e.g. [batch, channels, H, W])." },
];

const tx = (t, where) => ({ t, where });
export const learn = [
  { id: "math-c-symbols", title: "How to read maths (symbol dictionary)", cov: ["math-symbols"], src: b3c(1), slides: pg(1).concat(pg(1, 1)),
    hook: "Every formula is a sentence. Read it aloud, then translate each symbol.",
    visual: table(["Symbol", "Say", "Course example"], [["ŷ", "y-hat: a prediction", "ŷ = h(x)"], ["ȳ", "y-bar: the mean", "R² uses ȳ"], ["x₂ vs x²", "label vs power", "x₂ = second input"], ["α", "learning rate", "w ← w − α∂L/∂w"], ["γ", "discount", "G = R₁ + γR₂"], ["π", "a policy (not 3.14)", "π(s)"], ["←", "is updated to", "Q ← Q + α(...)"], ["∝", "proportional to", "P(c|x) ∝ P(c)P(x|c)"], ["⌊x⌋", "round down", "conv output size"], ["⊙", "elementwise multiply", "LSTM gates"], ["⊨", "entails", "KB ⊨ Q"]]),
    formula: [["f(n) = g(n) + h(n)", "guessed total trip length through node n"]],
    example: ["Values of three actions: 4, 9, 7. max = 9 (a value); argmax = action 2 (which one).", "Order of operations: 2 + 3 × 4² = 2 + 3 × 16 = 50."],
    memory: "max answers HOW GOOD, argmax answers WHICH ONE.", trap: "Policies use argmax; utilities use max. Writing the value when the action is asked loses the mark.", check: "math-b3-maxarg",
    explain: ["Maths is a language: each symbol is a short way to write a phrase. f(n) = g(n) + h(n) reads 'f of n equals g of n plus h of n', meaning the distance already travelled plus a guess of the distance still to go.", "A hat means 'estimate' (ŷ), a bar means 'average' (ȳ). A small lowered number is a label (x₂ = the second x); a raised number is a power (x² = x × x).", "Calculator skills for the exam: ln, log, eˣ, xʸ and √. Check yourself: log₂8 = 3, ln 2 = 0.693, e⁻¹ = 0.368, 0.8³⁰ = 0.00124, 1/(1 + e^−0.6) = 0.646."],
    tex: [tx(String.raw`\max_a f(a)=9 \qquad \arg\max_a f(a)=a_2`, [["max", "the largest value"], ["argmax", "the input that gives it"]])] },
  { id: "math-c-functions", title: "Functions, lines, curves and optima", cov: ["math-functions"], src: b3c(2), slides: pg(2).concat(pg(2, 1)),
    hook: "A model, a loss, a heuristic and a policy are all functions: input in, one output out.",
    visual: table(["Function", "Input → output"], [["model h", "data → prediction ŷ"], ["loss L", "weights → how wrong"], ["heuristic h(n)", "node → guessed distance"], ["policy π", "state → action"], ["ReLU", "z → max(0, z)"]]),
    formula: [["Line", "y = w₁x + w₀ (slope w₁, intercept w₀)"], ["Quadratic minimum", "x = −b/(2a)"]],
    example: ["y = x² − 4x + 7 = (x − 2)² + 3: minimum at x = 2, y = 3 (Lecture 3's continuous problem).", "Lecture 4's data y = 4x + 5: at x = −4, y = −11."],
    memory: "Minimise f = maximise −f (that is why hill climbing maximises −cost).", trap: "A local minimum is lowest only among its neighbours; hill climbing can stop there.", check: "math-b3-2.3",
    explain: ["A function takes an input and gives exactly one output, like a vending machine.", "A straight line y = w₁x + w₀ has slope w₁ (rise per unit of x) and intercept w₀ (value at x = 0). Linear regression learns these two numbers.", "A U-shaped quadratic ax² + bx + c (a > 0) has its lowest point at x = −b/(2a). Completing the square shows why: x² − 4x + 7 = (x − 2)² + 3, and a square is never negative.", "Piecewise functions use different rules on different inputs: ReLU(z) = z if z > 0 else 0; the perceptron step is 1 if z ≥ 0 else 0."],
    tex: [tx(String.raw`y=x^2-4x+7=(x-2)^2+3 \;\Rightarrow\; x^*=-\tfrac{b}{2a}=2,\; y^*=3`, [["a, b, c", "coefficients 1, −4, 7"], ["x*", "position of the minimum"]])] },
  { id: "math-c-explog", title: "Powers, e and logarithms", cov: ["math-explog"], src: b3c(3), slides: pg(3).concat(pg(3, 1)),
    hook: "Logs appear in entropy, cross-entropy and Naive Bayes; exponentials in sigmoid, softmax, SA and discounting.",
    visual: table(["Quantity", "Value"], [["log₂8", "3"], ["log₂0.5", "−1"], ["log₂(1/3)", "−1.585"], ["ln 2", "0.693"], ["e⁰", "1"], ["e⁻¹", "0.368"], ["0.8³⁰", "0.0012"]]),
    formula: [["Change of base", "log₂x = ln x / ln 2"], ["Rules", "log(ab) = log a + log b; log(aⁿ) = n log a"]],
    example: ["log₂(1/3) = ln(1/3)/ln 2 = −1.0986/0.6931 = −1.585.", "0.8³⁰ = (0.8¹⁰)³ = 0.107³ ≈ 0.0012: the vanishing gradient in the Lecture 8 poll."],
    memory: "Entropy has a minus sign because every log₂p is negative for p < 1.", trap: "Entropy uses log₂; cross-entropy, KL and GAN loss use ln. Using log₁₀ is the classic slip.", check: "math-b3-3.2",
    explain: ["aⁿ means a multiplied by itself n times. The full joint table has 2ⁿ rows; BFS visits about bᵈ nodes; discount weights are γᵏ.", "e ≈ 2.718. eˣ is always positive, equals 1 at x = 0, grows fast for positive x and shrinks to 0 for negative x. That is why sigmoid is 0.5 at z = 0 and softmax makes every score positive.", "A logarithm undoes a power: log₂8 = 3 because 2³ = 8. Logs of numbers between 0 and 1 are negative, log 1 = 0, and in entropy 0 log 0 = 0.", "Logs turn products into sums: Naive Bayes can add log-probabilities instead of multiplying tiny numbers, and the winning class stays the same."],
    tex: [tx(String.raw`\log_2 x=\frac{\ln x}{\ln 2}=\frac{\log_{10}x}{\log_{10}2}`, [["ln", "natural log (base e)"], ["log₁₀", "the calculator's 'log' key"]]), tx(String.raw`\sigma(z)=\frac{1}{1+e^{-z}}`, [["σ(0)", "0.5"], ["σ(2)", "0.881"]])] },
  { id: "math-c-sums", title: "Σ, Π and weighted averages", cov: ["math-sums"], src: b3c(4), slides: pg(4),
    hook: "Σ adds a list, Π multiplies it. A weighted average is behind expected utility, weighted entropy and attention.",
    visual: table(["Where", "Formula"], [["neuron", "in = Σ wᵢaᵢ"], ["entropy", "−Σ pₖ log₂pₖ"], ["Bellman", "Σ P(s′|s,a)[...]"], ["Naive Bayes", "P(c) Π P(xᵢ|c)"], ["BN joint", "Π P(xᵢ|parents)"], ["attention", "Σ αⱼvⱼ"]]),
    formula: [["Σ", "a₁ + a₂ + ... + aₙ"], ["Π", "a₁ × a₂ × ... × aₙ"], ["weighted average", "Σ wᵢxᵢ, weights ≥ 0 adding to 1"]],
    example: ["Σᵢ₌₁⁴ i = 10; Σᵢ₌₁³ i² = 14.", "Neuron: weights (0.1, 0.4, −0.3), inputs (1, 2, 1) → 0.1 + 0.8 − 0.3 = 0.6.", "Expected utility: 0.8 × 10 + 0.2 × (−10) = 6."],
    memory: "Σ = Sum, Π = Product (P for Product).", trap: "Weighted child entropy uses the branch SHARES |Sₖ|/|S| as weights, not a plain average.", check: "math-b3-4.2",
    explain: ["The counter i under Σ says where to start, the number on top where to stop. A double sum ΣᵢΣⱼ runs over every pair, like every cell of a convolution kernel.", "A weighted average multiplies each value by a weight and adds. When the weights are probabilities it is an expected value."],
    tex: [tx(String.raw`\sum_{i=1}^{n} a_i \qquad \prod_{i=1}^{n} a_i \qquad \bar{x}=\tfrac{1}{n}\sum_i x_i`, [["i", "counter"], ["n", "last index"]])] },
  { id: "math-c-vectors", title: "Vectors, dot products and matrices", cov: ["math-vectors"], src: b3c(5), slides: pg(5).concat(pg(5, 1)),
    hook: "Data points, images and word embeddings are vectors. Attention scores and neurons are dot products.",
    visual: table(["Operation", "Example"], [["dot product", "(0.5, 0.5)·(3, 3) = 3"], ["norm", "‖(3, 4)‖ = 5"], ["Euclidean", "(1,1)→(2,2): 1.414"], ["Manhattan", "(4,4)→(2,2): 4"], ["matrix × vector", "[[1,2],[3,4]]·(5,6) = (17, 39)"], ["shapes", "(8×4)(4×3) = 8×3"], ["⊙", "(0.8,0.5,−0.6)⊙(1,0.1,0.7) = (0.8,0.05,−0.42)"]]),
    formula: [["Dot", "w·x = Σwᵢxᵢ"], ["Norm", "‖x‖ = √(Σxᵢ²)"], ["Cosine", "x·y/(‖x‖‖y‖)"]],
    example: ["SVM check: (0.5, 0.5)·(3, 3) − 2 = 1.", "Embedding lookup: one-hot (0,0,1,0,0,0) × E = row 2 of E."],
    memory: "Big dot product = same direction; zero = unrelated; negative = opposite.", trap: "(m × n)(n × p) = m × p: inner sizes must match.", check: "math-b3-5.1",
    explain: ["A vector is an ordered list of numbers. Add or scale entry by entry.", "The dot product multiplies matching entries and adds; the result is one number measuring alignment. Attention uses q·k to score relevance.", "A matrix times a vector gives one dot product per row. Matrix × matrix needs the inner sizes to match.", "A tensor is the general shape: a PyTorch image batch is [batch, channels, height, width]. Printing shapes is the best debugging habit."],
    tex: [tx(String.raw`\mathbf{w}\cdot\mathbf{x}=\sum_i w_i x_i,\quad \lVert\mathbf{x}\rVert=\sqrt{\textstyle\sum_i x_i^2},\quad \cos\theta=\frac{\mathbf{x}\cdot\mathbf{y}}{\lVert\mathbf{x}\rVert\,\lVert\mathbf{y}\rVert}`, [["‖x‖", "length"], ["cos θ", "1 = same direction"]])] },
  { id: "math-c-calculus", title: "Derivatives, chain rule, gradient descent", cov: ["math-calculus"], src: b3c(6), slides: pg(6).concat(pg(6, 1), pg(6, 2)),
    hook: "Every learning algorithm: measure the error, find which way reduces it (the derivative), take a small step.",
    visual: table(["Function", "Derivative"], [["c", "0"], ["xⁿ", "nxⁿ⁻¹"], ["eˣ", "eˣ"], ["ln x", "1/x"], ["σ(x)", "σ(x)(1 − σ(x))"], ["tanh x", "1 − tanh²x"], ["ReLU", "1 if x > 0, 0 if x < 0"]]),
    formula: [["Chain rule", "dy/dx = dy/du · du/dx"], ["Update", "w ← w − α ∂L/∂w"]],
    example: ["y = x² − 4x + 7: y′ = 2x − 4; at x = 4 slope 4; at x = 2 slope 0 (minimum).", "Gradient descent from x = −1.5, α = 0.3: −1.5 → 0.6 → 1.44 → 1.776 → ... → 2.", "Neuron loss L = (y − h)², h = σ(z): ∂L/∂w₁ = −2(y − h)h(1 − h)x₁."],
    memory: "Gears: effects along a chain MULTIPLY. Many factors below 1 → vanishing gradient.", trap: "Too large α overshoots and can diverge; too small is slow.", check: "math-b3-6.3",
    explain: ["The derivative f′(x) is the slope of the tangent at x: positive = uphill to the right, zero = possible minimum or maximum.", "Chain rule: if y depends on u and u on x, multiply the two slopes. Backpropagation applies it layer by layer.", "The sigmoid's slope peaks at 0.25 (at z = 0). Ten sigmoid layers give at most 0.25¹⁰ ≈ 10⁻⁶: vanishing gradients.", "With several inputs, a partial derivative holds the others fixed. The gradient (all partials) points uphill, so gradient descent steps against it."],
    tex: [tx(String.raw`\frac{\partial L}{\partial w_1}=\underbrace{-2(y-h)}_{\partial L/\partial h}\cdot\underbrace{h(1-h)}_{\partial h/\partial z}\cdot\underbrace{x_1}_{\partial z/\partial w_1}`, [["h", "σ(z)"], ["z", "w₀ + w₁x₁"]]), tx(String.raw`w \leftarrow w-\alpha\,\frac{\partial L}{\partial w}`, [["α", "learning rate"]])] },
  { id: "math-c-prob", title: "Probability from scratch", cov: ["math-prob"], src: b3c(7), slides: pg(7).concat(pg(7, 1)),
    hook: "Probability is the maths of uncertainty: MDPs, Naive Bayes, generative models and Bayesian networks all rest on it.",
    visual: table(["Rule", "Formula", "Example"], [["NOT", "1 − P(A)", "rain 0.3 → 0.7"], ["OR (exclusive)", "P(A) + P(B)", "die 1 or 6: 2/6"], ["OR (general)", "P(A) + P(B) − P(A∧B)", "0.3 + 0.5 − 0.15 = 0.65"], ["AND (indep.)", "P(A)P(B)", "head and 6: 1/12"], ["AND (general)", "P(A|B)P(B)", "product rule"], ["GIVEN", "P(A∧B)/P(B)", "King | face = 4/12"]]),
    formula: [["Bayes", "P(H|E) = P(E|H)P(H)/P(E)"], ["Expected value", "E[X] = Σ x P(X = x)"]],
    example: ["Medical test (prior 1%, sensitivity 90%, false positive 5%): P(+) = 0.0585; P(sick|+) = 0.154.", "Joint table: P(x1) = 0.06 + 0.09 + 0.14 + 0.11 = 0.40; P(x1|y1) = 0.15/0.45 = 0.333."],
    memory: "GIVEN = shrink the world to where B happened, then ask how often A happens.", trap: "Add only for mutually exclusive events; otherwise subtract the overlap.", check: "math-b3-7.4",
    explain: ["With equally likely outcomes, P(A) = favourable/total. A random variable is a quantity whose value is uncertain (Burglary: true/false).", "Independence: knowing B tells you nothing about A, P(A|B) = P(A). Conditional independence: once C is known, B adds nothing.", "Marginalising ('summing out') a joint table gives the probability of one variable; dividing gives conditionals.", "Bayes' rule flips a conditional. The normalising α just makes the answers add to 1, which is why Naive Bayes can compare scores directly.", "Gaussians N(μ, σ²) appear in VAEs (the N(0, I) prior) and diffusion (added noise). Probabilities are usually estimated by counting: ADP, n-grams and Naive Bayes all do this."],
    tex: [tx(String.raw`P(H\mid E)=\frac{P(E\mid H)P(H)}{P(E\mid H)P(H)+P(E\mid\neg H)P(\neg H)}`, [["P(H)", "prior"], ["P(E|H)", "likelihood"], ["P(H|E)", "posterior"]])] },
];

export const cheat = { title: "Maths toolkit cheat sheet", rows: [["log₂x", "ln x / ln 2"], ["0 log 0", "0 (entropy convention)"], ["σ(0), σ′max", "0.5, 0.25"], ["quadratic min", "x = −b/2a"], ["dot / norm", "Σwᵢxᵢ / √Σxᵢ²"], ["shapes", "(m×n)(n×p) = m×p"], ["chain rule", "multiply slopes along the path"], ["GD", "w ← w − α∂L/∂w"], ["P(A∨B)", "P(A) + P(B) − P(A∧B)"], ["Bayes", "likelihood × prior / evidence"]], traps: ["max (value) vs argmax (action)", "log₂ for entropy, ln for cross-entropy/KL", "Subscript is a label, superscript is a power", "Weighted average, not plain average"] };

// ---------- questions (Book 3 practice + more) ----------
const S = (id, cov, x = {}) => ({ src: b3(id), cov: [cov], tags: ["book3"], ...x });
const Sc = (ch, cov, x = {}) => ({ src: b3c(ch), cov: [cov], tags: ["book3"], ...x });
// symbols
A.mcq("b3-maxarg", "Easy", "Three actions have values 4, 9 and 7. What is argmax over the actions?", "action 2 (the one worth 9)", [["9", "That is the max (a value)."], ["7", "Neither max nor argmax."], ["20", "That is the sum."]], "argmax returns the input; max returns the value.", Sc(1, "math-symbols", { trap: true }));
A.blank("b3-order", "Easy", "Order of operations: 2 + 3 × 4² = ___.", "50", [], "Powers, then multiply, then add.", Sc(1, "math-symbols", { calc: true }));
A.match("b3-greek", "Easy", "Match the symbol to its usual meaning in this course.", [["α", "learning rate"], ["γ", "discount factor"], ["π", "a policy"], ["μ", "a mean"]], ["the number 3.14"], "π is a policy here, not 3.14.", Sc(1, "math-symbols"));
A.tf("b3-sub", "Easy", "x₂ means x squared.", false, "A subscript is a label (the second x); x² is the power.", "Low = label, high = power.", Sc(1, "math-symbols"));
A.blanks("b3-calc", "Medium", "Calculator check (3 s.f.): ln 2 = ___; e⁻¹ = ___; 1/(1 + e^−0.6) = ___.", ["ln 2", "e⁻¹", "σ(0.6)"], ["0.693", "0.368", "0.646"], null, "Practise on your own calculator.", Sc(1, "math-symbols", { calc: true }));
// functions
A.blanks("b3-2.1", "Easy", "If f(x) = 3x − 2, find f(4) and f(0).", ["f(4)", "f(0)"], ["10", "-2"], null, "Substitute.", S("2.1", "math-functions", { calc: true }));
A.blanks("b3-2.2", "Easy", "Slope and intercept of y = −2x + 6?", ["slope", "intercept"], ["-2", "6"], null, "y = w₁x + w₀.", S("2.2", "math-functions"));
A.blanks("b3-2.3", "Medium", "Where is the minimum of y = x² − 6x + 10, and its value?", ["x", "y"], ["3", "1"], null, "x = −b/2a = 3.", S("2.3", "math-functions", { calc: true }));
A.blanks("b3-2.4", "Easy", "ReLU(−0.5) = ___, ReLU(0.5) = ___.", ["ReLU(−0.5)", "ReLU(0.5)"], ["0", "0.5"], null, "max(0, z).", S("2.4", "math-functions", { calc: true }));
A.tf("b3-localmin", "Medium", "A local minimum is the lowest point of the whole function.", false, "Only lowest compared with its neighbours; the global minimum is lowest overall.", "Hill climbing can stop at a local one.", Sc(2, "math-functions"));
A.mcq("b3-maxneg", "Medium", "Why does hill climbing on 8-queens maximise −cost?", "minimising f is the same as maximising −f", [["cost is always negative", "Cost ≥ 0."], ["hill climbing cannot minimise anything", "It can, via −f."], ["−cost is the number of queens", "No."]], "min f = max(−f).", Sc(2, "math-functions"));
// exp/log
A.blanks("b3-3.1", "Easy", "log₂16 = ___, log₂1 = ___, log₂0.5 = ___, log₂0.25 = ___.", ["log₂16", "log₂1", "log₂0.5", "log₂0.25"], ["4", "0", "-1", "-2"], null, "Powers of 2.", S("3.1", "math-explog", { calc: true }));
A.blank("b3-3.2", "Medium", "log₂(2/3) using a calculator = ___ (3 d.p.).", "-0.585", [], "ln(0.6667)/ln 2.", S("3.2", "math-explog", { calc: true }));
A.blanks("b3-3.3", "Medium", "σ(2) = ___ and σ(−2) = ___ (3 d.p.).", ["σ(2)", "σ(−2)"], ["0.881", "0.119"], null, "They add to 1.", S("3.3", "math-explog", { calc: true }));
A.blank("b3-3.4", "Easy", "e^−0.5 (SA with Δ = 10, T = 20) = ___ (3 d.p.).", "0.607", [], "Exponential.", S("3.4", "math-explog", { calc: true }));
A.blank("b3-3.5", "Easy", "Simplify log₂(8 × 4) using the log rules.", "5", [], "3 + 2.", S("3.5", "math-explog", { calc: true }));
A.mcq("b3-whyminus", "Medium", "Why does entropy H = −Σ p log₂p have a minus sign?", "every log₂p is negative for 0 < p < 1, so the minus makes H positive", [["to make it a probability", "Entropy can exceed 1 with many classes."], ["because log₂ is base 2", "Base does not set the sign."], ["it is a convention with no reason", "There is a reason."]], "Logs of fractions are negative.", Sc(3, "math-explog"));
A.tf("b3-logsum", "Medium", "Naive Bayes can add log-probabilities instead of multiplying, and the predicted class does not change.", true, "log is increasing, and log(abc) = log a + log b + log c.", "Logs avoid underflow.", Sc(3, "math-explog", { trap: false }));
A.blank("b3-08", "Medium", "0.8³⁰ ≈ ___ (2 s.f., e.g. 0.0034).", "0.0012", ["1.2e-3"], "Multiplying by < 1 again and again shrinks fast.", Sc(3, "math-explog", { calc: true, tol: 0.00006 }));
// sums
A.blank("b3-4.1", "Easy", "Σᵢ₌₁⁵ 2i = ___.", "30", [], "2 + 4 + 6 + 8 + 10.", S("4.1", "math-sums", { calc: true }));
A.blank("b3-4.2", "Easy", "Σₖ₌₀³ 0.9ᵏ = ___.", "3.439", [], "1 + 0.9 + 0.81 + 0.729.", S("4.2", "math-sums", { calc: true }));
A.blank("b3-4.3", "Easy", "Πᵢ₌₁⁴ i = ___.", "24", [], "4!.", S("4.3", "math-sums", { calc: true }));
A.blank("b3-4.4", "Easy", "Weighted average of 10 and 20 with weights 0.3 and 0.7 = ___.", "17", [], "3 + 14.", S("4.4", "math-sums", { calc: true }));
A.match("b3-sumuse", "Medium", "Match the formula to the operator it uses.", [["Naive Bayes score", "Π (product)"], ["weighted child entropy", "Σ with branch shares as weights"], ["attention output", "Σ with attention weights"]], ["⌊·⌋ floor"], "Σ adds, Π multiplies.", Sc(4, "math-sums"));
A.tf("b3-plainavg", "Medium", "Weighted child entropy is the plain average of the children's entropies.", false, "Each child is weighted by its share |Sₖ|/|S|.", "Weighted, not plain.", Sc(4, "math-sums"));
// vectors
A.blank("b3-5.1", "Easy", "(2, −1, 3)·(1, 4, 0) = ___.", "-2", [], "2 − 4 + 0.", S("5.1", "math-vectors", { calc: true }));
A.blank("b3-5.2", "Easy", "‖(1, 2, 2)‖ = ___.", "3", [], "√9.", S("5.2", "math-vectors", { calc: true }));
A.mcq("b3-5.3", "Easy", "Shape of (5 × 2)(2 × 7)?", "5 × 7", [["2 × 2", "Inner sizes vanish."], ["5 × 2", "Outer sizes remain."], ["not defined", "Inner sizes match (2)."]], "(m×n)(n×p) = m×p.", S("5.3", "math-vectors"));
A.blanks("b3-5.4", "Medium", "[[0, 1], [1, 0]] × (3, 8) = (___, ___).", ["1st", "2nd"], ["8", "3"], null, "It swaps the entries.", S("5.4", "math-vectors", { calc: true }));
A.tf("b3-dotsign", "Easy", "A negative dot product means the two vectors point in roughly opposite directions.", true, "Positive = similar, zero = perpendicular, negative = opposite.", "Sign of alignment.", Sc(5, "math-vectors", { trap: false }));
A.blank("b3-cos", "Medium", "Cosine similarity of (1, 0) and (1, 1) = ___ (3 d.p.).", "0.707", [], "1/(1 × 1.414).", Sc(5, "math-vectors", { calc: true }));
// calculus
A.blank("b3-6.1", "Easy", "Derivative of 3x² + 2x = ___ (write in terms of x, e.g. 4x+1).", "6x+2", ["6x + 2"], "Power rule.", S("6.1", "math-calculus"));
A.blank("b3-6.2", "Easy", "If σ(z) = 0.8, σ′(z) = ___.", "0.16", [], "σ(1 − σ).", S("6.2", "math-calculus", { calc: true }));
A.blank("b3-6.3", "Medium", "L = (w − 5)², w = 1, α = 0.1. After one gradient step w = ___.", "1.8", [], "L′ = 2(w − 5) = −8.", S("6.3", "math-calculus", { calc: true, steps: ["L′(1) = −8", "1 − 0.1(−8) = 1.8"] }));
A.blank("b3-6.4", "Medium", "Chain rule: y = u², u = 3x. dy/dx = ___ (in terms of x).", "18x", ["18 x"], "2u · 3 = 6u = 18x.", S("6.4", "math-calculus"));
A.mcq("b3-gdlarge", "Medium", "What happens if the learning rate α is too large?", "steps overshoot the minimum and can diverge", [["training is just slower", "That is α too small."], ["the loss becomes convex", "α does not change the loss shape."], ["the gradient becomes zero", "No."]], "Pick α carefully.", Sc(6, "math-calculus"));
A.tf("b3-sigmax", "Medium", "The sigmoid's derivative is largest at z = 0, where it equals 0.25.", true, "0.5 × 0.5.", "Max slope 0.25.", Sc(6, "math-calculus", { trap: false }));
A.blank("b3-gdq", "Hard", "Minimise y = x² − 4x + 7 by gradient descent from x = −1.5 with α = 0.3. After one step x = ___.", "0.6", [], "y′ = 2x − 4 = −7.", Sc(6, "math-calculus", { calc: true, steps: ["x ← −1.5 − 0.3(−7) = 0.6"] }));
// probability
A.blank("b3-7.1", "Easy", "Two dice: P(sum = 7) = ___.", "1/6", ["0.167", "6/36"], "6 of 36 outcomes.", S("7.1", "math-prob", { calc: true }));
A.blanks("b3-7.2", "Medium", "P(A) = 0.3, P(B) = 0.5, independent. P(A ∧ B) = ___; P(A ∨ B) = ___.", ["AND", "OR"], ["0.15", "0.65"], null, "Subtract the overlap.", S("7.2", "math-prob", { calc: true }));
A.blank("b3-7.3", "Easy", "From the Lecture 11 joint table (rows 0.06, 0.09, 0.14, 0.11, 0.18, 0.12, 0.16, 0.14 for x1y1z1, x1y1z2, x1y2z1, x1y2z2, x2y1z1, ...), P(z1) = ___.", "0.54", [], "0.06 + 0.14 + 0.18 + 0.16.", S("7.3", "math-prob", { calc: true }));
A.blank("b3-7.4", "Hard", "Prior 5%, sensitivity 80%, false-positive rate 10%. P(condition | +) = ___ (3 d.p.).", "0.296", [], "0.04/(0.04 + 0.095).", S("7.4", "math-prob", { calc: true }));
A.blank("b3-7.5", "Easy", "A bet pays $10 with probability 0.2, else $0. Expected value = $___.", "2", [], "0.2 × 10.", S("7.5", "math-prob", { calc: true }));
A.tf("b3-orexcl", "Medium", "P(A ∨ B) = P(A) + P(B) always.", false, "Only when A and B cannot both happen; otherwise subtract P(A ∧ B).", "General OR.", Sc(7, "math-prob"));
A.match("b3-dists", "Medium", "Match the distribution.", [["Bernoulli", "one yes/no outcome"], ["categorical", "one of k classes (softmax output)"], ["Gaussian N(μ, σ²)", "bell curve: VAE prior, diffusion noise"]], ["uniform over pixels"], "Distributions you will meet.", Sc(7, "math-prob"));
export const questions = A.out;
