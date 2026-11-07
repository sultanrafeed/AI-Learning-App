// Book 3 (AI from zero) practice questions + worked examples for every examined chapter,
// Book 1 (compiled lecture notes) facts not yet in the bank, and new Learn Cards from both books.
import { makeAuthor } from "./helpers.mjs";
import { table } from "../js/gen-core.js";
import { b3, b3c, b1c, B3CH, B1CH } from "./bookmap.mjs";

const T = {}; const au = (t) => (T[t] = T[t] || makeAuthor(t, "Book 3"));
const S = (id, cov, x = {}) => ({ src: b3(id), cov: [].concat(cov), tags: ["book3"], ...x });
const Sc = (ch, cov, x = {}) => ({ src: b3c(ch), cov: [].concat(cov), tags: ["book3"], ...x });
const B1 = (ch, cov, x = {}) => ({ src: b1c(ch), cov: [].concat(cov), tags: ["book1"], ...x });
const c = (x) => ({ calc: true, ...x });

// ---------------- SEARCH (Book 3 ch 9; Book 1 ch 2) ----------------
{ const A = au("search");
  A.blank("b3-9.1", "Easy", "What does A* become if h(n) = 0 everywhere?", "UCS", ["uniform-cost search", "uniform cost search"], "f = g.", S("9.1", "search-astar"));
  A.blanks("b3-9.2", "Medium", "Frontier: P (g = 50, h = 40), Q (g = 70, h = 10). Which node does each algorithm expand?", ["UCS", "Greedy", "A*"], ["P", "Q", "Q"], null, "UCS g; greedy h; A* g + h (P 90, Q 80).", S("9.2", ["search-ucs", "search-gbfs", "search-astar"], { calc: true }));
  A.tf("b3-9.3", "Medium", "h = twice the straight-line distance is admissible.", false, "It can overestimate the true road distance.", "Admissible = never overestimates.", S("9.3", "search-admissible"));
  A.mcq("b3-9.4", "Medium", "Why does UCS test for the goal when a node is popped?", "a cheaper path to the goal may still be found after the goal is first generated", [["popping is faster than generating", "Speed is not the reason."], ["the goal has h = 0", "UCS uses no h."], ["to save memory", "Not the reason."]], "Romania: 450 first, then 418.", S("9.4", "search-ucs"));
  A.blank("b3-9.5", "Medium", "BFS memory with b = 3, d = 10 is about ___ nodes.", "59049", ["59,049", "3^10"], "bᵈ.", S("9.5", "search-performance", { calc: true }));
  A.mcq("b3-bfsrom", "Medium", "BFS on Romania (successors alphabetical, goal test when generated) returns which path?", "Arad–Sibiu–Fagaras–Bucharest (3 actions, cost 450)", [["Arad–Sibiu–Rimnicu–Pitesti–Bucharest (418)", "That is the cheapest, found by UCS/A*."], ["Arad–Timisoara–Lugoj–Mehadia–Drobeta–Craiova–Pitesti–Bucharest", "Too many actions for BFS."], ["Arad–Zerind–Oradea–Sibiu–Fagaras–Bucharest", "BFS finds a 3-action path first."]], "BFS = fewest actions.", Sc(9, "search-bfs-dfs", { steps: ["Queue [A] → pop A: add S, T, Z.", "Pop S: add F, O, R. Pop T: add L. Pop Z.", "Pop F: generates Bucharest → stop. Cost 140 + 99 + 211 = 450."] }));
  A.blank("b1-paths", "Medium", "Romania: the slide lists seven Arad→Bucharest paths. A–Z–O–S–R–P–B costs 75 + 71 + 151 + 80 + 97 + 101 = ___.", "575", [], "Add every road.", B1(2, "search-problem", { calc: true }));
  A.blank("b1-ucsorder", "Hard", "UCS on Romania expands in order of g: Arad 0, Zerind 75, Timisoara 118, Sibiu 140, Oradea 146, Rimnicu 220, Lugoj 229, Fagaras 239, Mehadia ___, Pitesti 317, Craiova 366, Drobeta 374, Bucharest 418.", "299", [], "Lugoj 229 + 70 = 299.", B1(2, "search-ucs", { calc: true }));
  A.match("b1-perf", "Hard", "Match the algorithm to its time complexity (b branching, d shallowest goal depth, m max depth).", [["BFS", "O(b^d)"], ["DFS", "O(b^m)"], ["UCS", "O(b^(1 + ⌊C*/ε⌋))"]], ["O(log n)"], "UCS depends on C*/ε.", B1(2, "search-performance"));
  A.tf("b3-consproof", "Hard", "Consistency implies admissibility because applying h(n) ≤ c + h(n′) along the optimal path sums to h(n) ≤ h*(n).", true, "Telescoping: h(n₀) ≤ c₁ + ... + cₖ + h(G) = h*(n).", "Consistent ⇒ admissible.", Sc(9, "search-consistent", { trap: false }));
}
// ---------------- LOCAL (ch 10) ----------------
{ const A = au("local");
  A.blanks("b3-10.1", "Easy", "Fitness 10, 30, 60. Roulette probabilities?", ["P1", "P2", "P3"], ["0.1", "0.3", "0.6"], null, "fᵢ/Σf.", S("10.1", "local-ga", { calc: true }));
  A.blank("b3-10.2", "Easy", "SA, minimising: Δ = 3, T = 3. Acceptance probability = ___ (3 d.p.).", "0.368", [], "e⁻¹.", S("10.2", "local-sa", { calc: true }));
  A.match("b3-10.3", "Medium", "What does SA behave like at extreme temperatures?", [["T always huge", "a random walk"], ["T always near 0", "hill climbing"]], ["a genetic algorithm"], "Hot explores, cold exploits.", S("10.3", "local-sa"));
  A.blank("b3-10.4", "Easy", "How many neighbours does an 8-queens state have?", "56", [], "8 × 7.", S("10.4", "local-problem", { calc: true }));
  A.tf("b3-10.5", "Easy", "Local search returns a path.", false, "It returns a state.", "State, not path.", S("10.5", "local-problem"));
  A.blanks("b3-satemps", "Medium", "SA, a move 2 worse (Δ = 2). p at T = 10 = ___; at T = 1 = ___ (3 d.p.).", ["T = 10", "T = 1"], ["0.819", "0.135"], null, "Cooling makes SA picky.", Sc(10, "local-sa", { calc: true }));
  A.blank("b3-hcint", "Medium", "Hill climbing on y = −x² + 4x over integers, start x = 0, neighbours x ± 1. It stops at x = ___.", "2", [], "y(2) = 4 beats y(1) = y(3) = 3.", Sc(10, "local-hc", { calc: true, steps: ["y(0) = 0 → y(1) = 3", "y(1) = 3 → y(2) = 4", "neighbours 3, 3 → stop"] }));
  A.blanks("b3-cross", "Medium", "One-point crossover after position 3: parents 11001 and 00111. Children ___ and ___.", ["child 1", "child 2"], ["11011", "00101"], null, "Swap the tails.", Sc(10, "local-ga", { steps: ["110|01 + 001|11 → 110|11 and 001|01"] }));
  A.mcq("b3-sign", "Hard", "Two SA conventions: maximising value uses e^(ΔE/T) with ΔE < 0; minimising cost uses e^(−Δ/T) with Δ > 0. Which is true?", "both give the same probability between 0 and 1", [["only the first is a probability", "Both are."], ["they give opposite decisions", "Same decision."], ["the second can exceed 1", "Δ > 0 keeps it below 1."]], "Same rule, different sign convention.", Sc(10, "local-sa"));
  A.blank("b1-fund", "Medium", "8-queens: how many of the 92 solutions are fundamental (e.g. 24683175, 17468253, ...)?", "12", [], "The rest are reflections/rotations.", B1(3, "local-problem"));
}
// ---------------- ML (ch 11, 13, 14, 15) ----------------
{ const A = au("ml");
  A.blanks("b3-11.1", "Medium", "TP = 30, FP = 20, FN = 10, TN = 40. Precision, recall, F1 (3 d.p.)?", ["precision", "recall", "F1"], ["0.600", "0.750", "0.667"], null, "F1 = 0.9/1.35.", S("11.1", "ml-classification-metrics", { calc: true }));
  A.mcq("b3-11.3", "Medium", "AUC = 0.3 means:", "worse than random: predictions are inverted", [["fair", "Fair is about 0.6."], ["perfect", "1 is perfect."], ["30% accuracy", "AUC is not accuracy."]], "Flip its answers.", S("11.3", "ml-classification-metrics"));
  A.mcq("b3-11.5", "Easy", "Where is the test set used in the 10-step workflow?", "once, at the end", [["in every CV fold", "CV uses the training set."], ["to pick hyperparameters", "That is leakage."], ["to scale features", "Also leakage."]], "Test once.", S("11.5", "ml-workflow"));
  A.tf("b3-f1harm", "Hard", "With precision 1 and recall 0.01, F1 ≈ 0.505.", false, "F1 = 2(1)(0.01)/1.01 = 0.0198; the plain average would be 0.505.", "Harmonic mean stays low unless both are good.", Sc(11, "ml-classification-metrics", { calc: true }));
  A.match("b1-roc", "Medium", "Slide ROC threshold table: match each threshold to its (FPR, TPR).", [["0.9", "(0.01, 0.10)"], ["0.5", "(0.10, 0.60)"], ["0.1", "(0.60, 0.95)"]], ["(0.50, 0.50)"], "Lower threshold: more positives caught, more false alarms.", B1(4, "ml-classification-metrics"));
  A.mcq("b3-paramhyper", "Easy", "Which is a hyperparameter (chosen before training)?", "k in kNN", [["a learned weight w₁", "Parameters are learned."], ["the bias of a neuron", "Learned."], ["a support vector's α", "Learned by the solver."]], "Depth, k, learning rate, C are hyperparameters.", Sc(11, "ml-workflow"));
  A.blanks("b3-13.1", "Easy", "h(x) = 2x + 1. Predict x = 4; residual if y = 10?", ["ŷ", "residual"], ["9", "1"], null, "residual = y − ŷ.", S("13.1", "ml-gd", { calc: true }));
  A.blank("b3-13.2", "Easy", "z = 0. Logistic output = ___.", "0.5", [], "σ(0).", S("13.2", "ml-logistic", { calc: true }));
  A.blank("b3-13.3", "Medium", "h = 0.8, y = 0. Cross-entropy (natural log) = ___ (3 d.p.).", "1.609", [], "−ln(1 − 0.8).", S("13.3", "ml-logistic", { calc: true }));
  A.blank("b3-13.4", "Medium", "h = 0.8, y = 0, x₁ = 2, α = 0.1, w₁ = 1. New w₁ = ___.", "0.84", [], "w − α(h − y)x.", S("13.4", "ml-logistic", { calc: true }));
  A.blanks("b3-logstep", "Hard", "Logistic step: w = (0.5, −1, 2), x = (1, 1, 0.5), y = 1, h = 0.622, α = 1. New weights (3 d.p.)?", ["w0", "w1", "w2"], ["0.878", "-0.622", "2.189"], null, "Gradient (h − y)x = (−0.378, −0.378, −0.189).", Sc(13, "ml-logistic", { calc: true }));
  A.mcq("b3-whysq", "Medium", "Why is the linear-regression loss squared?", "errors become positive, big errors count more, and the loss is a smooth convex bowl", [["to make it a probability", "It is not."], ["so gradients are zero", "No."], ["because MAE is undefined", "MAE is defined."]], "Convex = one minimum.", Sc(13, "ml-gd"));
  A.blanks("b3-14.1", "Easy", "Manhattan distance (1, 5) to (4, 1) = ___; Euclidean = ___.", ["Manhattan", "Euclidean"], ["7", "5"], null, "3 + 4; √(9 + 16).", S("14.1", "ml-knn", { calc: true }));
  A.blanks("b3-14.2", "Medium", "w = (1, −1), b = 0, point (2, 5) with label −1. Functional and geometric margin (3 d.p.)?", ["functional", "geometric"], ["3", "2.121"], null, "−1(2 − 5) = 3; 3/√2.", S("14.2", "ml-svm", { calc: true }));
  A.blank("b3-14.3", "Easy", "‖w‖ = 0.5. Street (margin) width = ___.", "4", [], "2/‖w‖.", S("14.3", "ml-svm", { calc: true }));
  A.mcq("b3-14.4", "Medium", "Effect of increasing C in a soft-margin SVM:", "fewer training errors allowed, narrower margin", [["wider margin", "Smaller C widens."], ["more support vectors always", "Not necessarily."], ["switches to RBF", "C is not the kernel."]], "Large C = strict.", S("14.4", "ml-svm"));
  A.blank("b3-svmnew", "Medium", "SVM w = (0.5, 0.5), b = −2. New point (2, 3): w·x + b = ___ → class +1.", "0.5", [], "1 + 1.5 − 2.", Sc(14, "ml-svm", { calc: true }));
  A.mcq("b3-kernel", "Hard", "1-D points −2, −1 (+), 0 (−), 1, 2 (+). Which mapping makes them linearly separable?", "x ↦ (x, x²), separated by x² = 0.5", [["x ↦ 2x", "Still 1-D, still not separable."], ["x ↦ x + 1", "A shift does not help."], ["no mapping can", "x² works."]], "Kernels bend the street.", Sc(14, "ml-svm"));
  A.mcq("b3-oddk", "Easy", "For two classes, why choose an odd k in kNN?", "to avoid tied votes", [["odd k is faster", "No."], ["even k overfits", "Not the reason."], ["the distance needs it", "No."]], "Odd k, no ties.", Sc(14, "ml-knn"));
  A.mcq("b3-15.1", "Easy", "Is Random Forest bagging or boosting?", "bagging (plus random feature subsets)", [["boosting", "Trees are independent."], ["neither", "It is bagging."], ["stacking", "No learned combiner."]], "Bootstrap + vote.", S("15.1", "ml-ensembles"));
  A.mcq("b3-15.2", "Easy", "Which builds models sequentially?", "boosting", [["bagging", "Parallel."], ["random forest", "Parallel."], ["kNN", "Not an ensemble."]], "Each fixes the last.", S("15.2", "ml-ensembles"));
  A.blank("b3-15.3", "Easy", "Three bagged regressors output 4, 6, 8. Prediction = ___.", "6", [], "Average.", S("15.3", "ml-ensembles", { calc: true }));
  A.blanks("b3-gbhand", "Medium", "Gradient boosting by hand (learning rate 1): true y = 10. Model 1 predicts 7; tree 2 predicts the residual as 2.5; tree 3 predicts 0.4. Prediction after tree 2 = ___; after tree 3 = ___.", ["after tree 2", "after tree 3"], ["9.5", "9.9"], null, "Each tree fits the remaining residual.", Sc(15, "ml-ensembles", { calc: true }));
  A.blank("b3-oob", "Hard", "A bootstrap sample of N from N examples leaves out about ___ % of them (the out-of-bag examples).", "37", ["36.8", "37%"], "(1 − 1/N)ᴺ → e⁻¹ ≈ 0.368.", Sc(15, "ml-ensembles", { calc: true, tol: 0.5 }));
  A.blank("b3-vote", "Easy", "Five trees vote Yes, No, Yes, Yes, No. Random-forest prediction: ___.", "Yes", [], "Majority 3–2.", Sc(15, "ml-ensembles"));
}
// ---------------- TREES (ch 12) ----------------
{ const A = au("trees");
  A.blanks("b3-12.1", "Easy", "Node with 3 yes, 1 no. Entropy and Gini (3 d.p.)?", ["entropy", "Gini"], ["0.811", "0.375"], null, "B(0.25), 1 − 0.5625 − 0.0625.", S("12.1", ["trees-entropy", "trees-gini"], { calc: true }));
  A.blank("b3-12.4", "Medium", "Maximum entropy for 4 equally likely classes = ___ bits.", "2", [], "log₂4.", S("12.4", "trees-entropy", { calc: true }));
  A.mcq("b3-ginimean", "Medium", "Gini impurity is the probability that:", "two examples drawn at random (with replacement) have different labels", [["a random example is positive", "That is p."], ["the tree overfits", "No."], ["two examples have the same label", "That is 1 − Gini."]], "0 pure, 0.5 worst for two classes.", Sc(12, "trees-gini"));
  A.mcq("b3-c45", "Hard", "Why does C4.5 use gain ratio instead of plain information gain?", "IG is biased towards attributes with many values", [["gain ratio is faster", "Not the reason."], ["IG can be negative", "IG ≥ 0."], ["gain ratio uses Gini", "It uses IG / split info."]], "Many-valued attributes look good under IG.", Sc(12, "trees-algos"));
  A.tf("b3-regtree", "Medium", "A regression-tree leaf predicts the average of its examples, and splits are chosen to reduce variance/MSE.", true, "CART regression.", "Leaves store a constant.", Sc(12, "trees-algos", { trap: false }));
  A.blank("b3-surprise", "Medium", "An event with probability 1/8 carries ___ bits of surprise (log₂(1/p)).", "3", [], "Like 3 coin flips.", Sc(12, "trees-entropy", { calc: true }));
}
// ---------------- NN (ch 16, 17) ----------------
{ const A = au("nn");
  A.blank("b3-16.1", "Easy", "Inputs (2, −1), weights (0.5, 1), bias 0.5, ReLU. Output = ___.", "0.5", [], "1 − 1 + 0.5.", S("16.1", "nn-activation", { calc: true }));
  A.blank("b3-16.2", "Easy", "Same neuron with sigmoid: output = ___ (3 d.p.).", "0.622", [], "σ(0.5).", S("16.2", "nn-activation", { calc: true }));
  A.blank("b3-16.3", "Medium", "Parameters in a 10–20–1 fully connected network (with biases) = ___.", "241", [], "220 + 21.", S("16.3", "nn-structure", { calc: true }));
  A.mcq("b3-16.4", "Medium", "Why can't a single perceptron learn XOR?", "the classes are not separable by one straight line", [["it has no bias", "Bias does not fix it."], ["XOR has three inputs", "Two inputs."], ["the learning rate is too small", "No α helps."]], "Needs a hidden layer.", S("16.4", "nn-perceptron"));
  A.blank("b3-16.5", "Hard", "Backprop: Δ5 = 0.2, w3,5 = −1, a3 = 0.5 (sigmoid). Δ3 = g′(in3) w3,5 Δ5 = ___.", "-0.05", [], "g′ = 0.5 × 0.5 = 0.25.", S("16.5", "nn-backprop", { calc: true }));
  A.blanks("b3-and", "Medium", "AND neuron: w0 = −1.5, w1 = w2 = 1, step activation. Outputs for (1,1), (1,0), (0,0):", ["(1,1)", "(1,0)", "(0,0)"], ["1", "0", "0"], null, "0.5 ≥ 0; −0.5; −1.5.", Sc(16, "nn-perceptron", { calc: true }));
  A.blanks("b3-percy1", "Medium", "Perceptron w = (−0.5, 0.2, 0.4), x = (1, 0, 1), α = 0.1, output 0, but target y = 1. New weights?", ["w0", "w1", "w2"], ["-0.4", "0.2", "0.5"], null, "w + 0.1(1)x.", Sc(16, "nn-perceptron", { calc: true }));
  const bp = { visual: table(["Weight", "Value"], [["w1,3 / w2,3 / b3", "0.4 / −0.2 / 0.1"], ["w1,4 / w2,4 / b4", "0.3 / 0.6 / −0.1"], ["w3,5 / w4,5 / b5", "0.7 / −0.5 / 0.2"]]) + `<div class="muted tiny">x = (1, 0.5), y = 1, α = 0.5, sigmoid everywhere, squared loss.</div>` };
  A.blanks("b3-bpfwd", "Hard", "Full backprop example (table shown). Forward pass: a3 = ___, a4 = ___, ŷ = ___ (4 d.p.).", ["a3", "a4", "ŷ"], ["0.5987", "0.6225", "0.5764"], null, "in3 = 0.4, in4 = 0.5, in5 = 0.3079.", Sc(16, "nn-backprop", { ...bp, calc: true, tol: 0.0002 }));
  A.blanks("b3-bpbwd", "Hard", "Same example. Δ5 = 2(y − ŷ)ŷ(1 − ŷ) = ___; Δ3 = ___; Δ4 = ___ (4 d.p.).", ["Δ5", "Δ3", "Δ4"], ["0.2069", "0.0348", "-0.0243"], null, "Δj = g′(inj) wj,5 Δ5.", Sc(16, "nn-backprop", { ...bp, calc: true, tol: 0.0003 }));
  A.blanks("b3-bpupd", "Hard", "Same example, updates wi,j ← wi,j + α ai Δj: new w3,5 = ___; new w1,3 = ___ (3 d.p.).", ["w3,5", "w1,3"], ["0.762", "0.417"], null, "0.7 + 0.5(0.5987)(0.2069); 0.4 + 0.5(1)(0.0348).", Sc(16, "nn-backprop", { ...bp, calc: true }));
  A.tf("b3-noact", "Medium", "Without activation functions, a deep network of weighted sums collapses into one weighted sum (a linear model).", true, "Non-linearity lets networks learn curves.", "Activations add non-linearity.", Sc(16, "nn-activation", { trap: false }));
  A.match("b3-epoch", "Easy", "Match the training term.", [["epoch", "one pass through all training data"], ["batch", "the chunk used for one gradient step"], ["Adam", "a variant of stochastic gradient descent"]], ["a hidden layer"], "Lab 4 vocabulary.", Sc(16, "nn-structure"));
  A.blank("b3-17.1", "Medium", "x_t = 2, w_x = 0.5, h_(t−1) = −1, w_h = 0.5, b = 0, tanh. h_t = ___ (3 d.p.).", "0.462", [], "tanh(1 − 0.5).", S("17.1", "nn-lstm", { calc: true }));
  A.mcq("b3-17.2", "Easy", "Which LSTM gate erases memory?", "forget gate", [["input gate", "Writes new info."], ["output gate", "Exposes the cell."], ["candidate", "Proposes new content."]], "f near 0 wipes.", S("17.2", "nn-lstm"));
  A.blank("b3-17.3", "Medium", "c_(t−1) = 2, f = 0.5, i = 1, candidate −0.4. c_t = ___.", "0.6", [], "2(0.5) + 1(−0.4).", S("17.3", "nn-lstm", { calc: true }));
  A.mcq("b3-17.4", "Easy", "|w_zz| > 1 in a simple RNN risks:", "exploding gradients", [["vanishing gradients", "That is < 1."], ["overfitting only", "Not the issue."], ["no effect", "It matters."]], "Repeated multiplication.", S("17.4", "nn-lstm"));
  A.blanks("b3-lstmstep", "Hard", "LSTM step: c_(t−1) = 0.8, f = 0.9, i = 0.5, o = 0.7, candidate 0.6. c_t = ___; z_t = tanh(c_t) × o = ___ (3 d.p.).", ["c_t", "z_t"], ["1.02", "0.539"], null, "0.72 + 0.30; tanh(1.02) = 0.770.", Sc(17, "nn-lstm", { calc: true }));
  A.mcq("b3-gru", "Medium", "(Extra, not in your slides) A GRU differs from an LSTM by:", "merging forget and input gates into one update gate, with no separate cell state", [["having no gates", "It has gates."], ["using ReLU only", "No."], ["needing labels per step", "No."]], "Fewer parameters, similar performance.", Sc(17, "nn-lstm"));
}
// ---------------- MDP (ch 18, 19) ----------------
{ const A = au("mdp");
  A.blanks("b3-18.1", "Easy", "Action X gives +20 with probability 0.5 else 0; Y gives 8 for sure. EU(X) = ___; MEU choice ___.", ["EU(X)", "choice"], ["10", "X"], null, "10 > 8.", S("18.1", "mdp-meu", { calc: true }));
  A.blank("b3-18.2", "Easy", "Rewards 0, 0, 10, γ = 0.5. Return = ___.", "2.5", [], "0.25 × 10.", S("18.2", "mdp-utility", { calc: true }));
  A.blank("b3-18.3", "Easy", "Constant reward −1 forever, γ = 0.9. Return = ___.", "-10", [], "−1/(1 − 0.9).", S("18.3", "mdp-utility", { calc: true }));
  A.blank("b3-18.4", "Medium", "From s, a goes to s1 (0.7, U = 10) or s2 (0.3, U = 0); R = −1, γ = 0.9. Q(s, a) = ___.", "5.3", [], "0.7(−1 + 9) + 0.3(−1).", S("18.4", "mdp-bellman", { calc: true }));
  A.blanks("b3-q11all", "Hard", "4×3 grid world utilities U(1,1) = 0.705, U(1,2) = 0.762, U(2,1) = 0.655, R = −0.04, γ = 1. Q((1,1), Left) = ___; Q((1,1), Down) = ___ (3 d.p.).", ["Left", "Down"], ["0.671", "0.660"], null, "Wall bumps mean staying at (1,1).", Sc(18, "mdp-bellman", { calc: true, steps: ["Left: 0.8 bump (stay 0.705), 0.1 up (0.762), 0.1 down bump (0.705): −0.04 + 0.564 + 0.0762 + 0.0705 = 0.671", "Down: 0.8 bump (0.705), 0.1 left bump (0.705), 0.1 right (0.655): −0.04 + 0.564 + 0.0705 + 0.0655 = 0.660"] }));
  A.blank("b3-vi2", "Hard", "Value iteration at (3,3), γ = 1, R = −0.04. Iteration 1 gives 0.76; with U1(3,3) = 0.76 and U1(3,2) = −0.04, iteration 2 Right = −0.04 + 0.8(1) + 0.1(0.76) + 0.1(−0.04) = ___.", "0.832", [], "Values spread back from the goal.", Sc(18, "mdp-vi-pi", { calc: true }));
  A.blanks("b3-poleval", "Hard", "Policy evaluation: from A the policy always goes to B (reward −1). From B: 50% to the terminal (reward +10), 50% back to A (reward −1). γ = 1. U(A) = ___; U(B) = ___.", ["U(A)", "U(B)"], ["7", "8"], null, "Linear equations: U(A) = −1 + U(B); U(B) = 0.5(10) + 0.5(−1 + U(A)).", Sc(18, "mdp-vi-pi", { calc: true, steps: ["U(B) = 5 + 0.5(−2 + U(B)) = 4 + 0.5U(B)", "U(B) = 8, U(A) = 7"] }));
  A.blank("b3-19.1", "Medium", "Q(s, a) = 4, R = −1, γ = 0.5, max Q(s′, ·) = 6, α = 0.25. New Q = ___.", "3.5", [], "Target 2.", S("19.1", "mdp-qlearning", { calc: true }));
  A.blank("b3-19.2", "Medium", "TD: U(s) = 1, R = 0, U(s′) = 2, γ = 0.9, α = 0.5. New U(s) = ___.", "1.4", [], "1 + 0.5(1.8 − 1).", S("19.2", "mdp-td", { calc: true }));
  A.tf("b3-19.3", "Easy", "Q-learning is model-based.", false, "Model-free.", "No P(s′|s,a).", S("19.3", "mdp-qlearning"));
  A.blank("b3-19.4", "Easy", "An action was taken 20 times and landed in s′ 5 times. P̂(s′|s, a) = ___.", "0.25", [], "5/20.", S("19.4", "mdp-passive", { calc: true }));
  A.blanks("b3-qtable", "Hard", "Tiny Q-table: A → B (reward 0), B → G terminal (reward 10); α = 0.5, γ = 0.9, all Q start at 0. After episode 1: Q(B) = ___. After episode 2: Q(A) = ___, Q(B) = ___.", ["Q(B) ep1", "Q(A) ep2", "Q(B) ep2"], ["5", "2.25", "7.5"], null, "Value flows back one step per episode.", Sc(19, "mdp-qlearning", { calc: true, steps: ["Ep1: Q(A) = 0; Q(B) = 0.5(10) = 5", "Ep2: Q(A) = 0.5(0 + 0.9 × 5) = 2.25; Q(B) = 5 + 0.5(10 − 5) = 7.5"] }));
  A.multi("b3-dqn", "Medium", "Deep Q-networks (DQN):", [["approximate Q(s, a) with a neural network", true, ""], ["use experience replay", true, "train on random stored mini-batches"], ["use a slowly updated target network", true, "for stability"], ["need the transition model", false, "still model-free"]], "Atari from raw pixels.", Sc(19, "mdp-qlearning"));
  A.mcq("b3-egreedy", "Easy", "ε-greedy exploration means:", "with probability ε pick a random action, otherwise the best-known action", [["always the best action", "No exploration."], ["always random", "No exploitation."], ["decrease γ over time", "γ is the discount."]], "Common alternative to the exploration function.", Sc(19, "mdp-rl"));
  A.mcq("b3-mdpvsrl", "Easy", "MDP planning vs reinforcement learning:", "planning knows P and R and computes; RL does not and learns from trials", [["both need the model", "RL does not."], ["RL needs the model, planning does not", "Reversed."], ["they are identical", "No."]], "MDP defines the task; RL learns to act.", Sc(19, "mdp-rl"));
}
// ---------------- CNN (ch 20) ----------------
{ const A = au("cnn");
  A.blank("b3-20.1", "Easy", "Output size: N = 64, K = 5, P = 2, S = 1 → ___.", "64", [], "'Same' padding.", S("20.1", "cnn-outsize", { calc: true }));
  A.blank("b3-20.2", "Medium", "Output size: N = 13, K = 3, P = 1, S = 2 → ___.", "7", [], "⌊12/2⌋ + 1.", S("20.2", "cnn-outsize", { calc: true }));
  A.blank("b3-20.3", "Easy", "Parameters: 3 × 3 filters, 3 in, 10 out, no bias = ___.", "270", [], "27 × 10.", S("20.3", "cnn-params", { calc: true }));
  A.blank("b3-20.4", "Easy", "Patch [[1,0],[2,3]], filter [[1,−1],[0,2]]. Output = ___.", "7", [], "1 + 0 + 0 + 6.", S("20.4", "cnn-conv", { calc: true }));
  A.blank("b3-20.5", "Easy", "Max pool of [[2,7],[5,1]] = ___.", "7", [], "Largest value.", S("20.5", "cnn-pool", { calc: true }));
  A.blank("b3-10out", "Medium", "Output size: N = 10, K = 3, P = 0, S = 2 → ___.", "4", [], "⌊7/2⌋ + 1.", Sc(20, "cnn-outsize", { calc: true }));
  A.blanks("b3-pool2", "Medium", "M = [[1,3,2,4],[6,4,1,0],[2,8,3,9],[5,3,2,2]], 2 × 2 average pooling, stride 2:", ["avg[0,0]", "avg[0,1]", "avg[1,0]", "avg[1,1]"], ["3.5", "1.75", "4.5", "4"], null, "Mean of each window. (Max pooling gives [[6,4],[8,9]].)", Sc(20, "cnn-pool", { calc: true }));
  A.blanks("b3-softmax", "Medium", "softmax of scores (2, 1, 0) = (___, ___, ___) (3 d.p.).", ["1st", "2nd", "3rd"], ["0.665", "0.245", "0.090"], null, "e^z/Σe^z.", Sc(20, "cnn-arch", { calc: true }));
  A.tf("b3-xcorr", "Hard", "Deep-learning 'convolution' flips the filter before sliding it.", false, "It does not flip: technically it is cross-correlation.", "No flip in CNNs.", Sc(20, "cnn-conv"));
  A.blank("b3-dense378", "Hard", "A dense layer from 64 × 64 × 3 inputs to a 62 × 62 × 8 output would need about 12,288 × 30,752 ≈ ___ million weights (nearest million), versus 224 for the conv layer.", "378", [], "Why convolution.", Sc(20, "cnn-why", { calc: true, tol: 1 }));
  A.blank("b1-leaky", "Easy", "Leaky ReLU in the slides is f(x) = max(αx, x) with α = ___.", "0.1", [], "Small slope for negatives.", B1(7, "cnn-pool"));
  A.mcq("b1-labcnn", "Hard", "Lab custom CNN: 1 × 28 × 28 → BatchNorm → Conv16 stride 2 → ReLU → MaxPool → Conv32 → MaxPool → Dropout → Flatten → Linear → 10. What is the flattened length?", "288", [["1568", "That is the stride-1 version (32 × 7 × 7)."], ["512", "No."], ["3136", "64 × 7 × 7."]], "32 × 3 × 3 = 288.", B1(7, "cnn-arch", { calc: true }));
}
// ---------------- DETECT (ch 21) ----------------
{ const A = au("detect");
  A.blank("b3-21.1", "Easy", "IoU of (0, 0)–(2, 2) and (1, 1)–(3, 3) = ___ (3 d.p.).", "0.143", [], "1/7.", S("21.1", "detect-iou", { calc: true }));
  A.blank("b3-21.2", "Easy", "Two boxes don't touch. IoU = ___.", "0", [], "max(0, ·) handles it.", S("21.2", "detect-iou", { calc: true }));
  A.tf("b3-21.3", "Medium", "After NMS with threshold 0.5, two kept boxes can still overlap with IoU 0.4.", true, "Only overlaps above 0.5 are suppressed.", "Threshold, not zero overlap.", S("21.3", "detect-nms", { trap: false }));
  A.blanks("b3-21.4", "Medium", "Segmentation of one 256 × 256 image with 5 classes: logits shape ___; mask shape ___.", ["logits", "mask"], ["5x256x256", "256x256"], [["5x256x256", "5 x 256 x 256", "5×256×256"], ["256x256", "256 x 256", "256×256"]], "argmax over classes.", S("21.4", "detect-seg"));
  A.multi("b3-nmsex", "Medium", "NMS (threshold 0.5): boxes P 0.95, Q 0.90, R 0.80, S 0.60; IoUs P–Q 0.70, P–R 0.10, P–S 0.20, R–S 0.65. Which are kept?", [["P", true, "highest"], ["Q", false, "0.70 > 0.5 with P"], ["R", true, "0.10 with P"], ["S", false, "0.65 > 0.5 with R"]], "Keep best, delete its duplicates, repeat.", Sc(21, "detect-nms", { calc: true }));
  A.mcq("b3-centre", "Medium", "A box is given as centre (x, y) = (5, 4), w = 4, h = 2. Its corners are:", "(3, 3)–(7, 5)", [["(5, 4)–(9, 6)", "That treats the centre as a corner."], ["(1, 2)–(9, 6)", "Used full w and h on each side."], ["(4, 3)–(6, 5)", "Halved twice."]], "x₁ = x − w/2.", Sc(21, "detect-iou", { calc: true, trap: true }));
  A.match("b3-thresh", "Medium", "NMS threshold trade-off.", [["threshold too low", "neighbouring real objects get suppressed (missed detections)"], ["threshold too high", "duplicates survive (false detections)"]], [], "Tune it.", Sc(21, "detect-nms"));
}
// ---------------- SEQ (ch 22) ----------------
{ const A = au("seq");
  A.blank("b3-22.1", "Easy", "Corpus 'I like AI. I like cats. You like AI.' P(AI | like) = ___.", "2/3", ["0.667", "0.67"], "C(like AI)/C(like).", S("22.1", "seq-ngram", { calc: true }));
  A.blanks("b3-22.2", "Medium", "A word is seen 3 times in a class with T = 10, |V| = 5. Laplace P = ___; an unseen word gets ___ (3 d.p.).", ["seen", "unseen"], ["0.267", "0.067"], null, "4/15; 1/15.", S("22.2", "seq-nb", { calc: true }));
  A.blank("b3-22.3", "Medium", "Priors 0.4 spam / 0.6 ham; P(free|spam) = 0.3, P(free|ham) = 0.05. Email 'free'. P(spam) = ___.", "0.8", [], "0.12/(0.12 + 0.03).", S("22.3", "seq-nb", { calc: true }));
  A.blank("b3-22.4", "Easy", "A trigram model is a Markov chain of order ___.", "2", [], "n − 1.", S("22.4", "seq-ngram"));
  A.mcq("b3-22.5", "Easy", "Speech-to-text is which structure?", "many-to-many", [["many-to-one", "Output is a sequence."], ["one-to-many", "Input is a sequence."], ["one-to-one", "No."]], "Sequence in, sequence out.", S("22.5", "seq-structures"));
  A.blank("b3-excellence", "Medium", "Character-trigram probability of 'excellence' is a product of how many factors?", "10", [], "One per character.", Sc(22, "seq-ngram", { calc: true }));
  A.multi("b3-smooth", "Medium", "Ways to avoid zero n-gram probabilities:", [["add-one smoothing", true, ""], ["back-off to a shorter n-gram", true, ""], ["linear interpolation λ₃P_tri + λ₂P_bi + λ₁P_uni (λ's sum to 1)", true, ""], ["delete unseen words from the test text", false, "use <UNK> instead"]], "Smoothing.", Sc(22, "seq-ngram"));
  A.mcq("b3-ids", "Easy", "Indexing gives Jedi→0, Sith→1, droid→2. Which is true?", "IDs name words; Sith is not 'less than' droid", [["Sith is half of droid", "IDs are not magnitudes."], ["IDs are learned embeddings", "Embeddings are learned vectors."], ["IDs measure similarity", "No."]], "Names, not sizes.", Sc(22, "seq-encoding"));
  A.blanks("b1-tokens", "Medium", "'Luke and Leia board the ship with a droid. ... a Jedi warns them about the Sith.' gives ___ tokens, ___ unique.", ["tokens", "unique"], ["16", "14"], null, "'a' and 'the' repeat.", B1(8, "seq-encoding"));
  A.blank("b1-cos2", "Medium", "v(woman) − v(man) + v(uncle) ≈ v(___).", "aunt", [], "Cosine 0.824.", B1(8, "seq-word2vec"));
  A.mcq("b1-cbowsteps", "Hard", "CBOW forward pass, in order:", "look up context embeddings → average into h → s = W_out h → softmax → loss −log p_c", [["softmax → average → look up → loss", "Order wrong."], ["centre embedding → s = W_out v_c → softmax → loss −log p_o", "That is skip-gram."], ["one-hot → loss → softmax", "No."]], "Context in, centre out.", B1(8, "seq-word2vec"));
}
// ---------------- ATTN (ch 23) ----------------
{ const A = au("attn");
  A.blanks("b3-23.1", "Easy", "Weights (0.5, 0.5), values (4, 0) and (0, 2). Output = (___, ___).", ["1st", "2nd"], ["2", "1"], null, "Weighted sum.", S("23.1", "attn-aggregate", { calc: true }));
  A.blank("b3-23.3", "Easy", "Q is 10 × 64, K is 10 × 64. Shape of QKᵀ = ___.", "10x10", ["10 x 10", "10×10"], "Every query with every key.", S("23.3", "attn-matrix"));
  A.mcq("b3-23.4", "Medium", "In 'What was Mando searching for?', which vectors are matched against the query?", "the keys of the log tokens (values are aggregated)", [["the values", "Values are mixed, not matched."], ["the query itself", "No."], ["the positional encodings", "They are added to embeddings."]], "Keys match, values answer.", S("23.4", "attn-qkv"));
  A.blanks("b3-fullq", "Hard", "q = (1, 0); keys (1, 1), (0, 1), (1, 0); values (2, 0), (0, 2), (1, 1); d_k = 2. Weights (3 d.p.) and output (3 d.p.).", ["α1", "α2", "α3", "out1", "out2"], ["0.401", "0.198", "0.401", "1.203", "0.797"], null, "Scores 0.707, 0, 0.707.", Sc(23, "attn-full", { calc: true, tol: 0.0015 }));
  A.blanks("b3-pe", "Medium", "Positional encoding, dimension pair i = 0: PE at position 1 = (sin 1, cos 1) = (___, ___) (3 d.p.).", ["sin 1", "cos 1"], ["0.841", "0.540"], null, "Position 0 gives (0, 1).", Sc(23, "attn-position", { calc: true }));
  A.mcq("b3-sqrt", "Hard", "Why divide scores by √d_k?", "dot products of d_k random terms have variance d_k; scaling keeps softmax from becoming too peaky", [["to make weights sum to 1", "Softmax does that."], ["to reduce parameters", "No parameters change."], ["because keys are unit vectors", "Not assumed."]], "Healthy gradients.", Sc(23, "attn-scores"));
  A.multi("b3-transformer", "Medium", "A transformer block contains:", [["multi-head attention", true, ""], ["a feed-forward network", true, ""], ["residual connections and layer normalisation", true, ""], ["a recurrent hidden state", false, "no recurrence"]], "GPT adds a causal mask.", Sc(23, "attn-multihead"));
  A.mcq("b3-multihead", "Medium", "Multi-head attention:", "runs several heads with their own W_Q, W_K, W_V in parallel, then concatenates", [["runs one head several times in sequence", "Parallel, separate weights."], ["shares one W_Q across heads", "Each head has its own."], ["averages the heads' inputs", "Concatenates outputs."]], "One head for grammar, another for meaning.", Sc(23, "attn-multihead"));
}
// ---------------- GENAI (ch 24) ----------------
{ const A = au("genai");
  A.blank("b3-24.1", "Easy", "KL for μ = 0, σ = 1 = ___.", "0", [], "Matches the prior.", S("24.1", "genai-vae", { calc: true }));
  A.blank("b3-24.2", "Easy", "Reparameterise: μ = −1, σ = 2, ε = 0.5. z = ___.", "0", [], "−1 + 1.", S("24.2", "genai-vae", { calc: true }));
  A.blank("b3-24.3", "Medium", "D(real) = 0.9, D(fake) = 0.1. Objective log D(x) + log(1 − D(G(z))) = ___ (3 d.p.).", "-0.211", [], "2 ln 0.9.", S("24.3", "genai-gan", { calc: true }));
  A.blank("b3-24.4", "Medium", "ᾱ_t = 0.64, x0 = 1, ε = −1. x_t = ___.", "0.2", [], "0.8 − 0.6.", S("24.4", "genai-diffusion", { calc: true }));
  A.mcq("b3-24.5", "Easy", "Which model can't easily generate from random codes?", "the plain autoencoder", [["VAE", "Regularised latent."], ["GAN", "Samples noise."], ["diffusion", "Starts from noise."]], "Gaps in the latent space.", S("24.5", "genai-ae"));
  A.blank("b3-aeloss", "Easy", "x = (1, 0, 1), x̂ = (0.9, 0.2, 0.7): loss ‖x − x̂‖² = ___.", "0.14", [], "0.01 + 0.04 + 0.09.", Sc(24, "genai-ae", { calc: true }));
  A.blank("b3-kl2d", "Medium", "KL for two dimensions μ = (0.5, −0.5), σ = (1, 1) = ___.", "0.25", [], "½(0.25 + 0.25).", Sc(24, "genai-vae", { calc: true }));
  A.blank("b3-arprob", "Medium", "p(May) = 0.1, p(the|May) = 0.5, p(Force|May the) = 0.4. p(May the Force) = ___.", "0.02", [], "Chain rule product.", Sc(24, "genai-autoregressive", { calc: true }));
  A.match("b3-gencmp", "Hard", "Match the model to its weakness.", [["VAE", "blurry samples"], ["GAN", "unstable training, mode collapse"], ["autoregressive", "slow sequential generation"], ["diffusion", "many denoising steps"]], [], "Strengths: smooth latent, sharp, exact likelihood, quality.", Sc(24, "genai-intro"));
  A.tf("b3-pyth", "Medium", "In the diffusion step with ᾱ_t = 0.36 the signal and noise weights are 0.6 and 0.8, and 0.6² + 0.8² = 1.", true, "√ᾱ and √(1 − ᾱ).", "Variance preserved.", Sc(24, "genai-diffusion", { trap: false }));
}
// ---------------- LOGIC (ch 25) ----------------
{ const A = au("logic");
  A.blanks("b3-25.1", "Easy", "P = F, Q = T: P ⇒ Q = ___; Q ⇒ P = ___ (T/F).", ["P ⇒ Q", "Q ⇒ P"], ["T", "F"], [["T", "true"], ["F", "false"]], "Only T ⇒ F is false.", S("25.1", "logic-semantics"));
  A.mcq("b3-25.2", "Medium", "CNF of ¬(P ∧ Q) ∨ R:", "¬P ∨ ¬Q ∨ R", [["(¬P ∧ ¬Q) ∨ R", "De Morgan on ∧ gives ∨."], ["P ∨ Q ∨ R", "Negations lost."], ["¬P ∧ ¬Q ∧ R", "Wrong connectives."]], "One clause.", S("25.2", "logic-resolution"));
  A.mcq("b3-25.3", "Medium", "Resolve (A ∨ ¬B) with (B ∨ C):", "A ∨ C", [["A ∨ B ∨ C", "B cancels."], ["¬B ∨ C", "A remains."], ["empty", "Literals remain."]], "Drop B, ¬B.", S("25.3", "logic-resolution"));
  A.mcq("b3-25.4", "Easy", "FOL: 'Every dog is an animal.'", "∀x Dog(x) ⇒ Animal(x)", [["∀x Dog(x) ∧ Animal(x)", "Everything is a dog."], ["∃x Dog(x) ∧ Animal(x)", "Only some."], ["∀x Animal(x) ⇒ Dog(x)", "Converse."]], "∀ with ⇒.", S("25.4", "logic-fol"));
  A.blank("b3-25.5", "Easy", "How many models for 4 symbols?", "16", [], "2⁴.", S("25.5", "logic-model-checking", { calc: true }));
  A.mcq("b3-25.6", "Easy", "Which instantiation needs a new constant?", "existential", [["universal", "Any ground term."], ["both", "Only EI."], ["neither", "EI does."]], "Skolem constant.", S("25.6", "logic-fol-inference"));
  A.tf("b3-eval", "Medium", "With P = T, Q = F, R = T, (P ∨ Q) ⇒ ¬R is true.", false, "P ∨ Q = T, ¬R = F, T ⇒ F = F.", "Evaluate inside out.", Sc(25, "logic-semantics"));
  A.mcq("b3-cnfiff", "Hard", "CNF of P ⇔ (Q ∨ R):", "(¬P ∨ Q ∨ R) ∧ (¬Q ∨ P) ∧ (¬R ∨ P)", [["(¬P ∨ Q ∨ R) ∧ (Q ∨ R ∨ P)", "Second direction wrong."], ["(P ∨ Q ∨ R)", "Lost the structure."], ["(¬P ∨ Q) ∧ (¬P ∨ R)", "That is P ⇒ (Q ∧ R)."]], "Three clauses.", Sc(25, "logic-resolution", { steps: ["(P ⇒ (Q ∨ R)) ∧ ((Q ∨ R) ⇒ P)", "(¬P ∨ Q ∨ R) ∧ (¬(Q ∨ R) ∨ P)", "(¬P ∨ Q ∨ R) ∧ ((¬Q ∧ ¬R) ∨ P)", "(¬P ∨ Q ∨ R) ∧ (¬Q ∨ P) ∧ (¬R ∨ P)"] }));
  A.tf("b3-converse", "Easy", "The converse Q ⇒ P is equivalent to P ⇒ Q.", false, "Only the contrapositive ¬Q ⇒ ¬P is.", "Wet road doesn't mean it rained.", Sc(25, "logic-equivalence"));
  A.mcq("b3-rainproof", "Medium", "KB: P, P ⇒ Q, Q ⇒ R. Resolution proof of R starts by adding:", "¬R", [["¬P", "Negate the query, not a fact."], ["R", "Adding the query proves nothing."], ["¬(P ⇒ Q)", "Never negate the KB."]], "Then ¬Q, ¬P, □.", Sc(25, "logic-resolution"));
}
// ---------------- BAYES (ch 26) ----------------
{ const A = au("bayes");
  A.blank("b3-26.1", "Hard", "Burglary BN: P(¬j, ¬m, ¬a, ¬b, ¬e) = ___ (3 d.p.).", "0.936", ["0.937"], "0.999 × 0.998 × 0.999 × 0.95 × 0.99.", S("26.1", "bayes-bn-joint", { calc: true, tol: 0.0015 }));
  A.blank("b3-26.2", "Easy", "How many numbers for a Boolean node with 3 Boolean parents?", "8", [], "2³.", S("26.2", "bayes-bn", { calc: true }));
  A.blank("b3-26.3", "Easy", "s₊ = 0.003, s₋ = 0.012. Normalised P(+) = ___.", "0.2", [], "0.003/0.015.", S("26.3", "bayes-enumeration", { calc: true }));
  A.tf("b3-26.4", "Easy", "J is independent of B given A.", true, "Conditional independence from the network structure.", "Given parents.", S("26.4", "bayes-bn", { trap: false }));
  A.blank("b3-jmabne", "Medium", "Burglary BN: P(j, m, a, b, ¬e) = ___ (6 d.p.).", "0.000591", ["5.91e-4"], "0.001 × 0.998 × 0.94 × 0.9 × 0.7.", Sc(26, "bayes-bn-joint", { calc: true }));
  A.mcq("b3-whylow", "Medium", "Why is P(b | j, m) only 0.284 even though both neighbours called?", "burglaries are rare, so false alarms (earthquakes, random alarms, John's confusion) together are more common", [["John and Mary are unreliable", "Partly, but the prior dominates."], ["the CPTs are wrong", "No."], ["enumeration is approximate", "It is exact."]], "Base rates matter.", Sc(26, "bayes-enumeration"));
  A.blank("b1-typo", "Hard", "The Lecture 11 slide prints 0.0000405594 for the joint row (¬b, e, ¬a, j, m). The correct value is 0.999 × 0.002 × 0.71 × 0.05 × 0.01 = ___ (3 s.f., e.g. 1.23e-7).", "7.09e-7", ["0.000000709"], "Only this value makes s_¬B = 0.00149186.", B1(11, "bayes-enumeration", { calc: true, tol: 6e-10 }));
  A.mcq("b1-cmp", "Medium", "Full joint table vs Bayesian network: main operation for inference?", "joint table: filter matching rows and add; BN: multiply factors and sum hidden states", [["both multiply CPTs", "The table already holds products."], ["joint table: sampling; BN: exact", "Both exact here."], ["BN: filter rows; joint table: multiply", "Reversed."]], "Same answer 0.2842.", B1(11, ["bayes-joint-table", "bayes-enumeration"]));
}
// ---------------- KR (ch 27) ----------------
{ const A = au("kr");
  A.mcq("b3-27.1", "Easy", "Which requirement says an entity belongs to only one sibling class?", "mutual exclusivity", [["inclusiveness", "Top class."], ["transitivity", "Chains of is-a."], ["inheritance", "Properties flow down."]], "Siblings don't overlap.", S("27.1", "kr-hierarchy"));
  A.tf("b3-27.2", "Easy", "Ostrich ⊆ Bird, Ostrich: cannot fly. Olly the ostrich can fly.", false, "The specific value wins.", "Exceptions override.", S("27.2", "kr-reasoning"));
  A.blank("b3-27.3", "Easy", "wdt:P31 means ___.", "instance of", ["instance"], "P31.", S("27.3", "kr-sparql"));
  A.blanks("b3-27.4", "Easy", "The three parts of a triple:", ["1st", "2nd", "3rd"], ["subject", "predicate", "object"], [["subject"], ["predicate", "property"], ["object"]], "RDF.", S("27.4", "kr-kg"));
  A.tf("b3-owa", "Hard", "OWL reasoning is closed-world: missing information is treated as false.", false, "It is open-world: missing means unknown.", "No closed-world validation by itself.", Sc(27, "kr-ontology"));
  A.mcq("b1-watermelon", "Easy", "Green mottled skin, ovoid, red flesh, black seeds, in the fruit aisle ⇒ Watermelon ⇒ good for fruit salad. This illustrates:", "reasoning with categories: perceive → classify → predict", [["resolution", "Logic proof method."], ["SPARQL", "Query language."], ["inheritance exceptions", "No exception here."]], "Categories let us predict.", B1(12, "kr-reasoning"));
}

export const book3 = Object.fromEntries(Object.entries(T).map(([t, A]) => [t, A.out]));

// ---------------- New Learn Cards (from Book 3 worked examples) ----------------
const tx = (t, where) => ({ t, where });
export const bookCards = {
  nn: [{ id: "nn-c-bpworked", title: "Backprop by hand: a full 2-2-1 example", cov: ["nn-backprop"], src: b3c(16), slides: [`B3/${B3CH[16] + 3}`, `B3/${B3CH[16] + 4}`],
    hook: "Forward: weighted sums and squashes. Backward: pass the error back along the same links, multiplied by the weights.",
    visual: table(["Step", "Value"], [["in3, a3", "0.4, 0.5987"], ["in4, a4", "0.5, 0.6225"], ["in5, ŷ", "0.3079, 0.5764"], ["loss", "0.1795"], ["Δ5", "0.2069"], ["Δ3, Δ4", "0.0348, −0.0243"], ["new w3,5 / w4,5", "0.762 / −0.436"], ["new w1,3 / w2,3 / w1,4", "0.417 / −0.191 / 0.288"]]),
    formula: [["Output", "Δ_out = 2(y − ŷ) g′(in_out)"], ["Hidden", "Δj = g′(inj) Σk wj,k Δk"], ["Update", "wi,j ← wi,j + α ai Δj"]],
    example: ["x = (1, 0.5), y = 1, α = 0.5; w1,3 = 0.4, w2,3 = −0.2, b3 = 0.1; w1,4 = 0.3, w2,4 = 0.6, b4 = −0.1; w3,5 = 0.7, w4,5 = −0.5, b5 = 0.2.", "Δ3 = a3(1 − a3) w3,5 Δ5 = 0.2403 × 0.7 × 0.2069 = 0.0348."],
    memory: "Error at a hidden unit = its slope × (weight to the next unit × that unit's error).", trap: "Use the activation a_i of the SENDING unit in the update, and x_i (or 1 for a bias) for input links.", check: "nn-b3-bpbwd",
    explain: ["Training needs ∂L/∂w for every weight. For an output weight it comes straight from the chain rule. For a hidden weight, ask how much that hidden unit contributed to the output error: pass the error back along the link, multiplied by its weight and by the hidden unit's own slope.", "With sigmoid units g′(in) = a(1 − a). Each layer multiplies by a factor at most 0.25, which is why deep sigmoid networks suffer vanishing gradients (Extra: optional 'for high flyers' on the slides)."],
    tex: [tx(String.raw`\Delta_5=2(y-\hat y)\,\hat y(1-\hat y),\quad \Delta_3=a_3(1-a_3)\,w_{3,5}\,\Delta_5,\quad w_{i,j}\leftarrow w_{i,j}+\alpha\,a_i\,\Delta_j`, [["Δ", "perceived error at a unit's input"], ["a_i", "output of the sending unit"]])] },
  { id: "nn-c-lstmnum", title: "An LSTM step with numbers", cov: ["nn-lstm"], src: b3c(17), slides: [`B3/${B3CH[17] + 1}`, `B3/${B3CH[17] + 2}`],
    hook: "The cell state is a conveyor belt: scaled by the forget gate, added to by the input gate, shown through the output gate.",
    visual: table(["Quantity", "Value"], [["c_(t−1)", "0.8"], ["f, i, o", "0.9, 0.5, 0.7"], ["candidate tanh(·)", "0.6"], ["c_t = 0.8(0.9) + 0.5(0.6)", "1.02"], ["z_t = tanh(1.02) × 0.7", "0.539"], ["if f = 0", "c_t = 0.3 (memory wiped)"]]),
    formula: [["Cell", "c_t = c_(t−1) ⊙ f_t + i_t ⊙ tanh(...)"], ["Hidden", "z_t = tanh(c_t) ⊙ o_t"]],
    example: ["Simple RNN one step: x = 1, w_x = 0.8, h_prev = 0.5, w_h = −0.4, b = 0.1 → sum 0.7 → tanh = 0.604.", "Two steps with w_x = w_h = 0.5: h1 = 0.462, h2 = 0.447."],
    memory: "Forget = keep or wipe; Input = write; Output = show.", trap: "The gates are sigmoids (0..1); the candidate is a tanh (−1..1).", check: "nn-b3-lstmstep",
    explain: ["Going back k steps multiplies the RNN gradient by roughly (w_zz · g′)ᵏ: below 1 it vanishes (0.5²⁰ ≈ 10⁻⁶), above 1 it explodes (1.5²⁰ ≈ 3300).", "In an LSTM the path from c_(t−1) to c_t is just multiplication by f plus an addition. With f near 1 the error flows back almost unchanged ('constant error flow'), so long-range dependencies can be learned."],
    tex: [tx(String.raw`c_t=c_{t-1}\odot f_t+i_t\odot\tanh(W_{x,c}x_t+W_{z,c}z_{t-1}),\qquad z_t=\tanh(c_t)\odot o_t`, [["⊙", "elementwise product"], ["f, i, o", "forget, input, output gates (sigmoid)"]])] }],
  mdp: [{ id: "mdp-c-handcalc", title: "MDP & RL hand calculations (Book 3)", cov: ["mdp-vi-pi", "mdp-qlearning"], src: b3c(18), slides: [`B3/${B3CH[18] + 3}`, `B3/${B3CH[18] + 4}`, `B3/${B3CH[19] + 2}`],
    hook: "Four calculation patterns cover almost every MDP/RL exam item: Q from utilities, one value-iteration sweep, policy evaluation by equations, and the Q-learning update.",
    visual: table(["Pattern", "Worked numbers"], [["Q at (1,1)", "Up 0.706, Left 0.671, Down 0.660, Right 0.631 → Up"], ["VI at (3,3)", "0.76 → 0.832 → 0.890 → … 0.918"], ["Policy evaluation", "U(A) = −1 + U(B); U(B) = 5 + 0.5(−1 + U(A)) → U(B) = 8, U(A) = 7"], ["Q-table A→B→G", "ep1 Q(B) = 5; ep2 Q(A) = 2.25, Q(B) = 7.5"]]),
    formula: [["Q", "Σ P(s′|s,a)[R + γU(s′)]"], ["Q-learning", "Q ← Q + α[R + γ max Q′ − Q]"]],
    example: ["For each action list the three landing squares with 0.8 / 0.1 / 0.1 and replace any wall bump by 'stay'.", "Value flows backwards from the reward one step per episode (or per iteration)."],
    memory: "Table first, numbers second: action | landing square | probability | U.", trap: "In value iteration the max makes the equations non-linear; in policy evaluation (fixed policy) they are linear.", check: "mdp-b3-poleval",
    explain: ["Value iteration repeats the Bellman update with a max until nothing changes; policy iteration alternates exact evaluation of a fixed policy (linear equations) with greedy improvement, and stops when the policy is stable.", "Q-learning needs no model at all; a deep Q-network replaces the table by a neural network and uses experience replay and a target network for stability."],
    tex: [tx(String.raw`U^{\pi}(s)=\sum_{s'}P(s'\mid s,\pi(s))\big[R+\gamma U^{\pi}(s')\big]`, [["π(s)", "the fixed action: no max"]])] }],
  ml: [{ id: "ml-c-ensemblehand", title: "Bagging and boosting by hand", cov: ["ml-ensembles"], src: b3c(15), slides: [`B3/${B3CH[15]}`, `B3/${B3CH[15] + 1}`],
    hook: "Average many friends' guesses (bagging) or let each new student fix what the last got wrong (boosting).",
    visual: table(["", "Bagging (Random Forest)", "Boosting"], [["Built", "independently, in parallel", "one after another"], ["Mainly reduces", "variance", "bias"], ["Combine", "vote / average", "weighted sum"], ["Example", "votes Y, N, Y, Y, N → Yes", "y = 10: 7 → 9.5 → 9.9"]]),
    formula: [["Boosting", "F_m(x) = F_(m−1)(x) + η t_m(x)"], ["Out-of-bag", "(1 − 1/N)ᴺ → e⁻¹ ≈ 0.368"]],
    example: ["Regression trees 200, 220, 210 → bagged prediction 210.", "Gradient boosting: F₀ = mean; each tree fits the residuals r = y − F; with learning rate 0.1 each step adds a tenth."],
    memory: "Bagging = Bootstrap AGGregatING.", trap: "Too many boosting trees can overfit (use early stopping); a small learning rate needs more trees.", check: "ml-b3-gbhand",
    explain: ["A bootstrap sample draws N rows with replacement; about 37% of rows are left out of each sample, giving a free out-of-bag validation score.", "Random forests also pick a random feature subset at each split so trees differ and their errors cancel."],
    tex: [tx(String.raw`F_0=\bar y,\quad r_j=y_j-F_{m-1}(x_j),\quad F_m=F_{m-1}+\eta\,t_m`, [["η", "learning rate (shrinkage)"], ["t_m", "small tree fitted to residuals"]])] }],
};
