import { makeAuthor, } from "./helpers.mjs";
import { table } from "../js/gen-core.js";
const A = makeAuthor("trees", "Lecture 4 (Decision trees)");
const DT = "Comparing two attributes to split (Type vs Patrons)";

export const coverage = [
  { id: "trees-structure", text: "Decision tree structure: root, internal nodes (attribute tests), leaves (outputs), branches, decision paths; restaurant WillWait example", src: "Lecture 4, slides 32-34" },
  { id: "trees-entropy", text: "Entropy H = −Σ p log₂ p; B(q); pure node = 0; 50/50 = 1 bit; 90/10 ≈ 0.47", src: "Lecture 4, slides 35-36" },
  { id: "trees-ig", text: "Information gain IG = H(parent) − Σ |Sᵥ|/|S|·H(Sᵥ) (ID3); Patrons IG = 0.5409, Type IG = 0", src: "Lecture 4, slides 35-39; " + DT },
  { id: "trees-gini", text: "Gini = 1 − Σ pᵢ² (CART); weighted child Gini; Gini reduction; Patrons 0.2222 / 0.2778; binary split Some vs rest = 0.25", src: "Lecture 4, slides 40-41; " + DT },
  { id: "trees-compare", text: "Step-by-step comparison of two attributes (Type vs Patrons) with IG and Gini; choose highest IG / lowest weighted Gini", src: DT },
  { id: "trees-algos", text: "ID3 (information gain), C4.5 (gain ratio + pruning), CART (Gini/MSE, binary splits); overfitting, pruning, max_depth, min_samples_leaf, ccp_alpha; sklearn DecisionTreeClassifier/Regressor", src: "Lecture 4, slides 27-31" },
];
export const formulas = [
  { name: "Entropy", f: "H(S) = − Σᵢ pᵢ log₂ pᵢ", note: "binary: B(q) = −[q log₂ q + (1−q) log₂(1−q)]" },
  { name: "Information gain", f: "IG(A) = H(parent) − Σᵥ (|Sᵥ|/|S|)·H(Sᵥ)", note: "choose the highest" },
  { name: "Gini index", f: "Gini(S) = 1 − Σᵢ pᵢ²", note: "binary max 0.5, pure 0" },
  { name: "Weighted child Gini", f: "Σᵢ (|Subsetᵢ|/|parent|)·Gini(Subsetᵢ)", note: "choose the lowest" },
  { name: "Gini reduction", f: "Gini(parent) − weighted child Gini", note: "choose the highest" },
];
export const glossary = [
  { term: "Entropy", def: "Measure of uncertainty/impurity of a node's class distribution (bits)." },
  { term: "Information gain", def: "Reduction in entropy achieved by splitting on an attribute." },
  { term: "Gini index", def: "Probability a random sample is misclassified if labelled by the node's class distribution." },
  { term: "Gini reduction", def: "Gini(parent) minus the weighted Gini of the children." },
  { term: "Leaf node", def: "Terminal node that outputs a class label (or numeric value for regression trees)." },
  { term: "Pruning", def: "Removing branches to reduce overfitting (e.g. ccp_alpha in sklearn)." },
  { term: "ID3 / C4.5 / CART", def: "Classic tree algorithms using information gain / gain ratio + pruning / Gini or MSE with binary splits." },
];
const tree = `<svg viewBox="0 0 360 160" class="tsvg"><rect x="130" y="6" width="100" height="30" rx="8" class="tn root"/><text x="180" y="20" class="tt">Patrons?</text><text x="180" y="32" class="ts">[6+, 6−]</text>
<line x1="180" y1="36" x2="60" y2="100" class="te"/><line x1="180" y1="36" x2="180" y2="100" class="te"/><line x1="180" y1="36" x2="300" y2="100" class="te"/>
<text x="105" y="70" class="tlab">None</text><text x="190" y="70" class="tlab">Some</text><text x="255" y="70" class="tlab">Full</text>
<rect x="20" y="100" width="80" height="34" rx="8" class="tn"/><text x="60" y="114" class="ts">[0+, 2−]</text><text x="60" y="128" class="ts">H=0</text>
<rect x="140" y="100" width="80" height="34" rx="8" class="tn"/><text x="180" y="114" class="ts">[4+, 0−]</text><text x="180" y="128" class="ts">H=0</text>
<rect x="260" y="100" width="80" height="34" rx="8" class="tn"/><text x="300" y="114" class="ts">[2+, 4−]</text><text x="300" y="128" class="ts">H=0.918</text></svg>`;
export const learn = [
  { id: "trees-structure", title: "What a decision tree is", cov: ["trees-structure", "trees-algos"], src: "Lecture 4, slides 27-34",
    hook: "A decision tree asks one question per node until it reaches an answer.",
    visual: table(["Part", "Meaning"], [["Root node", "first attribute test (e.g. Patrons?)"], ["Internal node", "attribute test"], ["Branch", "one value of the attribute"], ["Leaf", "output class (WillWait Yes/No)"], ["Decision path", "root → leaf = an if/then rule"]]),
    formula: [["Split criteria", "classification: entropy/IG or Gini; regression: MSE/variance reduction"], ["ID3", "information gain"], ["C4.5", "gain ratio + pruning"], ["CART", "Gini / MSE, binary splits"]],
    example: ["Restaurant tree: Patrons = None → No; Some → Yes; Full → ask WaitEstimate.", "x4 (Full, 10-30, Hungry, Alternate, Raining) → Yes."],
    memory: "Root asks, branches answer, leaves decide.",
    trap: "Trees overfit when grown too deep: control with max_depth, min_samples_leaf or pruning (ccp_alpha).", check: "trees-c-struct-1" },
  { id: "trees-entropy", title: "Entropy", cov: ["trees-entropy"], src: "Lecture 4, slides 35-36",
    hook: "Entropy measures how mixed (uncertain) a node is.",
    visual: table(["Class split", "Entropy"], [["50% / 50%", "1.0 (max for 2 classes)"], ["90% / 10%", "≈ 0.47"], ["100% / 0%", "0 (pure, certain)"]]),
    formula: [["H(S) = −Σ pᵢ log₂ pᵢ", "pᵢ = fraction of class i"], ["0·log₂0", "taken as 0"], ["Unit", "bits (log base 2)"]],
    example: ["Full branch [2+, 4−]: p = 1/3, 2/3.", "H = −(1/3)log₂(1/3) − (2/3)log₂(2/3) = 0.5283 + 0.3900 = 0.9183."],
    memory: "Pure = zero; fifty-fifty = one.",
    trap: "Using ln instead of log₂ gives values in nats (max 0.693), not bits.", check: "trees-c-ent-1" },
  { id: "trees-ig", title: "Information gain (ID3)", cov: ["trees-ig"], src: "Lecture 4, slides 37-39; " + DT, visual: tree,
    hook: "Information gain = how much a split reduces uncertainty.",
    formula: [["IG(A) = H(parent) − Σ (|Sᵥ|/|S|)·H(Sᵥ)", "weighted average of child entropies"], ["|Sᵥ|/|S|", "fraction of examples going down branch v"]],
    example: ["Parent [6+, 6−]: H = 1.0.", "Patrons: None 2/12·0 + Some 4/12·0 + Full 6/12·0.9183 = 0.4591.", "IG(Patrons) = 1 − 0.4591 = 0.5409 bits.", "Type: every branch 50/50 → weighted entropy 1.0 → IG = 0."],
    memory: "Gain = Before − Weighted After.",
    trap: "Weight children by size. An unweighted average of child entropies is the #1 IG mistake.", check: "trees-c-ig-1" },
  { id: "trees-gini", title: "Gini index and Gini reduction (CART)", cov: ["trees-gini", "trees-compare"], src: "Lecture 4, slides 40-41; " + DT,
    hook: "Gini asks: if I label randomly by this node's mix, how often am I wrong?",
    visual: table(["Node", "Gini"], [["Parent [6+, 6−]", "1 − 0.5² − 0.5² = 0.5"], ["None [0+, 2−]", "0"], ["Some [4+, 0−]", "0"], ["Full [2+, 4−]", "1 − (1/3)² − (2/3)² = 0.4444"], ["Weighted after Patrons", "6/12 × 0.4444 = 0.2222"], ["Gini reduction", "0.5 − 0.2222 = 0.2778"]]),
    formula: [["Gini = 1 − Σ pᵢ²", "0 = pure, 0.5 = binary max"], ["Weighted Gini", "Σ (|Sᵢ|/|S|)·Gini(Sᵢ)"], ["Gini reduction", "Gini(parent) − weighted Gini"]],
    example: ["Type: all branches 50/50 → weighted Gini 0.5 → reduction 0.", "CART binary split Some vs {None, Full}: weighted Gini 0.25, gain 0.25 (Lecture 4 slide 41)."],
    memory: "Entropy and Gini agree in spirit: low impurity after the split wins.",
    trap: "Pick the LOWEST weighted Gini but the HIGHEST information gain. Don't mix the directions.", check: "trees-c-gini-1" },
];
export const cheat = { title: "Decision tree cheat sheet",
  rows: [["Entropy", "−Σ p log₂ p", "0 pure, 1 at 50/50", "bits"], ["IG", "H(parent) − Σ wᵥH(Sᵥ)", "pick highest", "ID3"], ["Gini", "1 − Σ p²", "0 pure, 0.5 max", "CART"], ["Weighted Gini", "Σ wᵥ Gini(Sᵥ)", "pick lowest", "gain = parent − weighted"], ["Patrons", "IG 0.5409", "weighted Gini 0.2222", "reduction 0.2778"]],
  traps: ["Weight by branch size |Sᵥ|/|S|.", "log₂ not ln.", "0·log 0 = 0.", "Highest IG ↔ lowest weighted Gini.", "IG and Gini can occasionally prefer different attributes."] };

A.mcq("c-struct-1", "Easy", "In a decision tree, what do internal nodes represent?", "Tests on attribute values", [["Final class predictions", "Those are leaves."], ["Training examples", "Examples flow through the tree; they aren't nodes."], ["Learning rates", "Trees don't use a learning rate."]], "Internal node = attribute test; leaf = output.", { cov: ["trees-structure"], src: "Lecture 4, slide 34" });
A.match("c-struct-2", "Medium", "Match each decision-tree algorithm to its split criterion.", [["ID3", "Information gain"], ["C4.5", "Gain ratio + pruning"], ["CART", "Gini / MSE with binary splits"]], ["Mean absolute percentage error"], "ID3 → IG, C4.5 → gain ratio, CART → Gini.", { cov: ["trees-algos"], src: "Lecture 4, slide 27" });
A.multi("c-struct-3", "Medium", "Which settings help control overfitting of a sklearn decision tree?", [["max_depth", true, "Limits tree depth."], ["min_samples_leaf", true, "Prevents tiny leaves."], ["ccp_alpha", true, "Pruning strength."], ["random_state", false, "Only makes results reproducible."], ["criterion='entropy'", false, "Changes the split measure, not complexity."]], "Deep trees overfit; limit or prune them.", { cov: ["trees-algos"], src: "Lecture 4, slides 28-30" });
A.tf("c-struct-4", "Easy", "Decision trees can be used for both classification and regression.", true, "Lecture 4: DecisionTreeClassifier and DecisionTreeRegressor (MSE / variance reduction).", "Regression trees store constant numeric predictions in leaves.", { cov: ["trees-structure", "trees-algos"], trap: false });
A.blank("c-struct-5", "Medium", "In the restaurant tree (Lecture 4), Patrons = Some leads directly to the leaf WillWait = ______.", "Yes", ["yes", "True", "true"], "Some → all 4 examples positive.", { cov: ["trees-structure"], src: "Lecture 4, slide 34" });
A.mcq("c-struct-6", "Hard", "For DecisionTreeRegressor, what does score() return and what do leaves store?", "R² on the given data; constant numeric predictions", [["Accuracy; class labels", "That's the classifier."], ["MSE; class probabilities", "score() is R² for regressors."], ["F1; probabilities", "Classification metrics."]], "Regressor leaves = constants; score = R².", { cov: ["trees-algos"], src: "Lecture 4, slide 29" });
A.tf("c-ent-1", "Easy", "The entropy of a pure node (all examples in one class) is 0.", true, "No uncertainty → H = 0.", "Pure = 0, 50/50 = 1.", { cov: ["trees-entropy"], trap: false });
A.tf("c-ent-2", "Medium", "For a binary class variable, the maximum possible entropy is 0.5.", false, "0.5 is the maximum GINI. Maximum binary entropy is 1 bit at 50/50.", "Entropy max 1, Gini max 0.5.", { cov: ["trees-entropy", "trees-gini"] });
A.mcq("c-ent-3", "Easy", "Which node has the LOWEST entropy?", "[9+, 1−]", [["[5+, 5−]", "50/50 → maximum entropy (1)."], ["[6+, 4−]", "Closer to 50/50 → higher entropy."], ["[3+, 3−]", "50/50 → 1."]], "The more homogeneous, the lower the entropy (90/10 ≈ 0.47).", { cov: ["trees-entropy"], src: "Lecture 4, slide 36" });
A.blank("c-ent-4", "Medium", "Entropy of [2+, 4−] in bits (4 decimal places).", "0.9183", ["0.918"], "−(1/3)log₂(1/3) − (2/3)log₂(2/3).", { cov: ["trees-entropy"], calc: true, tol: 0.0006, format: "4 decimal places", src: DT });
A.blank("c-ent-5", "Easy", "In Lecture 4 notation, B(q) is the entropy of a Boolean variable that is true with probability q. B(1) = ______ (all samples positive).", "0", ["0.0"], "Certain variable → entropy 0.", { cov: ["trees-entropy"], src: "Lecture 4, slide 38" });
A.mcq("c-ent-6", "Hard", "Using natural log instead of log₂ for H([5+, 5−]) gives…", "0.693, a different unit (nats), so values won't match the expected bits", [["1.0, the same as log₂", "ln 2 ≈ 0.693, not 1."], ["0.5", "That's the Gini of a 50/50 node."], ["2.0", "Entropy of two classes never exceeds 1 bit."]], "Always use log₂ for entropy here.", { cov: ["trees-entropy"], calc: true });
A.blank("c-ig-1", "Medium", "Restaurant data: IG(Patrons) = 1 − [2/12·0 + 4/12·0 + 6/12·0.9183] = ______ bits (4 dp).", "0.5409", ["0.541"], "Weighted child entropy 0.4591.", { cov: ["trees-ig"], calc: true, tol: 0.0006, src: DT, format: "4 decimal places" });
A.blank("c-ig-2", "Medium", "Restaurant data: every Type branch (French 1/1, Italian 1/1, Thai 2/2, Burger 2/2) is 50/50. IG(Type) = ______.", "0", ["0.0", "0.0000"], "Weighted child entropy = 1 = parent entropy.", { cov: ["trees-ig", "trees-compare"], calc: true, src: DT });
A.tf("c-ig-3", "Medium", "Information gain is computed by subtracting the plain (unweighted) average of the child entropies from the parent entropy.", false, "Children must be weighted by |Sᵥ|/|S|.", "Weighted, always.", { cov: ["trees-ig"] });
A.mcq("c-ig-4", "Medium", "ID3 chooses the attribute with…", "the highest information gain", [["the lowest information gain", "Lower IG = less uncertainty removed."], ["the highest weighted child entropy", "That would be the WORST split."], ["the most branches", "Number of values is not the criterion (it can even bias IG)."]], "Max IG = min weighted child entropy.", { cov: ["trees-ig"] });
A.multi("c-ig-5", "Hard", "Parent [6+, 6−] split by Patrons into None [0+,2−], Some [4+,0−], Full [2+,4−]. Select ALL correct values.", [["H(parent) = 1.0", true, "50/50."], ["H(None) = H(Some) = 0", true, "Pure."], ["Weighted child entropy = 0.4591", true, "6/12 × 0.9183."], ["IG = 0.4591", false, "IG = 1 − 0.4591 = 0.5409."], ["Weighted child Gini = 0.2222", true, "6/12 × 0.4444."]], "Do the parent, children, weight, subtract.", { cov: ["trees-ig", "trees-gini"], calc: true, src: DT });
A.mcq("c-gini-1", "Easy", "Gini index of [2+, 4−]?", "0.4444", [["0.9183", "That's entropy."], ["0.5556", "That's Σp² (forgot 1 −)."], ["0.2222", "That's the WEIGHTED Gini (× 6/12)."]], "1 − (1/3)² − (2/3)² = 4/9.", { cov: ["trees-gini"], calc: true, src: DT });
A.tf("c-gini-2", "Medium", "When using the Gini index, we choose the split with the HIGHEST weighted child Gini.", false, "Choose the LOWEST weighted child Gini (= largest Gini reduction).", "Impurity after the split should be small.", { cov: ["trees-gini"] });
A.blanks("c-gini-3", "Medium", "Patrons split: weighted child Gini = ______ and Gini reduction = ______ (4 dp).", ["weighted Gini", "reduction"], ["0.2222", "0.2778"], [["0.2222", "0.222"], ["0.2778", "0.278"]], "0.5 − 0.2222 = 0.2778.", { cov: ["trees-gini", "trees-compare"], calc: true, tol: 0.0006, src: DT });
A.blank("c-gini-4", "Hard", "Lecture 4 also tries a CART binary split on Patrons: Some vs (None or Full). The Gini gain of that binary split is ______.", "0.25", ["0.250", "1/4"], "Weighted Gini after split 0.25 → gain 0.5 − 0.25.", { cov: ["trees-gini"], calc: true, tol: 0.001, src: "Lecture 4, slide 41" });
A.match("c-gini-5", "Medium", "Match each quantity to its value for a binary node.", [["Maximum entropy", "1"], ["Maximum Gini", "0.5"], ["Entropy of a pure node", "0"], ["Entropy of a 90/10 node (approx.)", "0.47"]], ["0.69"], "Max entropy 1 bit; max Gini 0.5.", { cov: ["trees-gini", "trees-entropy"], src: "Lecture 4, slide 36" });
A.mcq("c-cmp-1", "Medium", "Type gives IG = 0 and weighted Gini 0.5; Patrons gives IG = 0.5409 and weighted Gini 0.2222. Which attribute is chosen?", "Patrons by both criteria", [["Type by both criteria", "Type removes no uncertainty."], ["Patrons by IG, Type by Gini", "Lower weighted Gini (0.2222) is better → Patrons."], ["Neither: the tree stops", "Patrons gives a clear gain."]], "Highest IG and lowest weighted Gini both pick Patrons.", { cov: ["trees-compare"], calc: true, src: DT });
A.tf("c-cmp-2", "Hard", "Information gain and Gini reduction always choose the same attribute.", false, "They usually agree but can disagree on close splits (different impurity curves).", "Compute both when asked.", { cov: ["trees-compare"] });
A.multi("c-cmp-3", "Medium", "Order of steps when comparing two attributes (the step-by-step file). Select ALL steps that are part of the process.", [["Compute the parent's entropy and Gini", true, "Step 2 of the file."], ["Compute each branch's entropy/Gini", true, "Per subset."], ["Weight each branch by |subset|/|parent|", true, "Weighted child value."], ["Subtract from the parent to get IG / Gini reduction", true, "Final comparison."], ["Pick the attribute with the most branches", false, "Not a criterion."]], "Parent → branches → weight → subtract → compare.", { cov: ["trees-compare"], src: DT });

export const questions = A.out;
