// Extra questions on the lecturer's four exam-preparation sheets: every bullet rule
// becomes a question, plus same-style calculations with new numbers (re-checked by computer).
import { makeAuthor } from "./helpers.mjs";

const out = {};
const IOU = "Key points about IoU and non-max suppression";
const CONV = "Key points about convolution filters and parameter counts";
const RNN = "Key points about a simple RNN hidden-state update";
const DT = "Comparing two attributes to split (Type vs Patrons) step-by-step sheet";
const o = (src, cov, x = {}) => ({ src, cov: [].concat(cov), tags: ["keypoints"], ...x });

// ---------------- IoU & NMS sheet ----------------
{ const A = makeAuthor("detect", IOU);
  A.blanks("kp-iou-a", "Medium", "Sheet method. A has corners (1, 2) and (7, 6); B has corners (4, 3) and (9, 8). Fill in: overlap width, overlap height, intersection, union, IoU (3 d.p.).", ["width", "height", "intersection", "union", "IoU"], ["3", "3", "9", "40", "0.225"], null, "Shared width = min(x₂) − max(x₁); shared height = min(y₂) − max(y₁).", o(IOU, "detect-iou", { calc: true, steps: ["width = min(7, 9) − max(1, 4) = 3", "height = min(6, 8) − max(2, 3) = 3", "intersection 9", "areas 6 × 4 = 24 and 5 × 5 = 25 → union 24 + 25 − 9 = 40", "IoU = 9/40 = 0.225"] }));
  A.blanks("kp-iou-b", "Medium", "A (0, 0)–(5, 5), B (1, 1)–(6, 6). Intersection ___, union ___, IoU ___ (3 d.p.).", ["intersection", "union", "IoU"], ["16", "34", "0.471"], null, "4 × 4 overlap.", o(IOU, "detect-iou", { calc: true, steps: ["overlap 4 × 4 = 16", "25 + 25 − 16 = 34", "16/34 = 0.471"] }));
  A.mcq("kp-union", "Easy", "According to the key-points sheet, union area =", "area of A + area of B − intersection area", [["area of A + area of B", "That counts the overlap twice."], ["area of A × area of B", "Areas add, not multiply."], ["the larger box's area", "Only if one box contains the other."]], "Subtract the overlap once.", o(IOU, "detect-iou", { trap: true }));
  A.tf("kp-width", "Easy", "For corner coordinates, a box's width is the larger x-coordinate minus the smaller x-coordinate.", true, "Height likewise uses y; area = width × height.", "Width from x, height from y.", o(IOU, "detect-iou", { trap: false }));
  A.multi("kp-nms-a", "Hard", "Threshold rule: 'suppress if IoU is strictly greater than 0.40'. Car boxes: P 0.92, Q 0.85, R 0.70. IoU(P,Q) = 0.40, IoU(P,R) = 0.55, IoU(Q,R) = 0.10. Which remain?", [["P", true, "highest score, kept first"], ["Q", true, "IoU 0.40 is not strictly greater than 0.40"], ["R", false, "IoU(P, R) = 0.55 > 0.40 → suppressed"]], "Equality does not trigger 'strictly greater'.", o(IOU, "detect-nms", { calc: true, steps: ["Keep P.", "Q: 0.40 > 0.40? No → keep.", "R: 0.55 > 0.40 → suppress (P is kept, so R goes)."] }));
  A.multi("kp-nms-b", "Hard", "Same boxes, but the rule is now 'suppress if IoU ≥ 0.40'. Which remain?", [["P", true, "kept first"], ["Q", false, "0.40 ≥ 0.40 → suppressed"], ["R", false, "0.55 ≥ 0.40 → suppressed"]], "Read > versus ≥ carefully.", o(IOU, "detect-nms", { calc: true }));
  A.mcq("kp-nms-class", "Medium", "NMS: a person box (0.70) overlaps the kept car box (0.95) with IoU 0.8, threshold 0.5. What happens to the person box?", "it is kept: NMS only suppresses boxes of the same class", [["it is suppressed because 0.8 > 0.5", "Different classes are not compared."], ["it is merged with the car box", "NMS deletes, it does not merge."], ["the car box is suppressed", "The higher score is kept."]], "Same class only.", o(IOU, "detect-nms", { trap: true }));
  A.mcq("kp-nms-first", "Easy", "NMS starts by:", "keeping the highest-confidence detection", [["deleting the lowest-confidence box", "It keeps the best first."], ["averaging all boxes", "No averaging."], ["computing IoU between every pair of classes", "Same class only."]], "Then suppress its same-class overlaps, and repeat.", o(IOU, "detect-nms"));
  A.blank("kp-iou-sheet", "Easy", "Sheet example: A (0,0)–(6,4), B (2,0)–(8,4). IoU = ___ (2 d.p.).", "0.50", ["0.5", "1/2"], "16/32.", o(IOU, "detect-iou", { calc: true, steps: ["Each area 24; overlap 4 × 4 = 16; union 32; IoU 0.50"] }));
  out.detect = A.out;
}

// ---------------- Convolution parameters sheet ----------------
{ const A = makeAuthor("cnn", CONV);
  A.blank("kp-c-weights", "Easy", "Sheet rule: a 3 by 3 filter on RGB input contains ___ weights.", "27", [], "3 × 3 × 3: each filter spans all input channels.", o(CONV, "cnn-params", { calc: true }));
  A.blank("kp-c-a", "Medium", "Four 5 by 5 filters on RGB input, one bias per filter. Trainable parameters = ___.", "304", [], "(5 × 5 × 3 + 1) × 4.", o(CONV, "cnn-params", { calc: true, steps: ["5 × 5 × 3 = 75", "+ 1 bias = 76", "× 4 filters = 304"] }));
  A.blank("kp-c-b", "Medium", "Eight 3 by 3 filters on an input with 16 channels, no bias. Trainable parameters = ___.", "1152", ["1,152"], "No bias stated → no +1.", o(CONV, "cnn-params", { calc: true, steps: ["3 × 3 × 16 = 144", "× 8 = 1152"] }));
  A.blank("kp-c-c", "Medium", "Two 3 by 3 filters on a greyscale (1-channel) input, one bias per filter. Trainable parameters = ___.", "20", [], "(9 + 1) × 2.", o(CONV, "cnn-params", { calc: true }));
  A.blank("kp-c-out", "Easy", "Sheet rule: a layer with 6 filters produces ___ output feature maps (output channels).", "6", [], "One map per filter.", o(CONV, "cnn-params"));
  A.tf("kp-c-size", "Medium", "Moving from a 32 × 32 to a 224 × 224 RGB image changes the parameter count of a layer of two 3 × 3 filters (with biases).", false, "Still (27 + 1) × 2 = 56: weights are reused across positions.", "Image size never adds parameters.", o(CONV, "cnn-params"));
  A.mcq("kp-c-mist", "Medium", "A student computes two 3 by 3 filters on RGB (with biases) as (3 × 3 + 1) × 2 = 20. The mistake is:", "forgetting that each filter spans all 3 input channels", [["adding the bias", "The bias was specified."], ["multiplying by the number of filters", "That step is correct."], ["using the image size", "They did not."]], "Correct: (27 + 1) × 2 = 56.", o(CONV, "cnn-params", { trap: true }));
  A.multi("kp-c-steps", "Easy", "The sheet's recipe for counting parameters (select all steps):", [["multiply filter height × width × input channels", true, ""], ["add one bias per filter if specified", true, ""], ["multiply by the number of filters", true, ""], ["multiply by the number of image positions", false, "weights are shared across positions"]], "Three steps.", o(CONV, "cnn-params"));
  out.cnn = A.out;
}

// ---------------- RNN hidden-state sheet ----------------
{ const A = makeAuthor("seq", RNN);
  A.blanks("kp-r-a", "Medium", "Current input = 3, input weight = 0.2, previous state = 0.5, recurrent weight = 0.4, no bias. Sum = ___; with tanh(0.8) supplied as 0.664, new state = ___.", ["sum", "new state"], ["0.8", "0.664"], null, "0.2 × 3 + 0.4 × 0.5.", o(RNN, "seq-rnn", { calc: true, steps: ["0.6 + 0.2 = 0.8", "tanh(0.8) = 0.664 (supplied)"] }));
  A.blanks("kp-r-b", "Medium", "Current input = 1, input weight = 0.6, previous state = −0.5, recurrent weight = 0.4, bias 0.1. Sum = ___; with tanh(0.5) supplied as 0.462, new state = ___.", ["sum", "new state"], ["0.5", "0.462"], null, "Bias is included because it is specified.", o(RNN, "seq-rnn", { calc: true, steps: ["0.6 − 0.2 + 0.1 = 0.5", "tanh(0.5) = 0.462"] }));
  A.mcq("kp-r-swap", "Hard", "Current input = 2 (input weight 0.5), previous state = 0.4 (recurrent weight 0.25). A student computes 0.5 × 0.4 + 0.25 × 2 = 0.7. The mistake is:", "mixing up the input and the previous state (each must use its own weight)", [["forgetting the bias", "No bias was given."], ["applying tanh", "tanh is required."], ["nothing: 0.7 is right", "Correct sum is 1.1."]], "Keep current input and previous state distinct.", o(RNN, "seq-rnn", { trap: true }));
  A.tf("kp-r-pre", "Easy", "The sum before the activation is the new hidden state.", false, "Apply the activation (use the supplied tanh lookup).", "Sum ≠ state.", o(RNN, "seq-rnn"));
  A.tf("kp-r-carry", "Easy", "The previous hidden state carries information from earlier steps of the sequence.", true, "That is how an RNN remembers.", "Memory = previous state.", o(RNN, "seq-rnn", { trap: false }));
  A.mcq("kp-r-bias", "Medium", "When should a bias be added in the simple RNN update?", "only if a bias is specified in the question", [["always add 1", "Never assume a bias."], ["only for tanh", "Activation does not decide it."], ["never", "Add it when given."]], "Bias only if specified.", o(RNN, "seq-rnn", { trap: true }));
  A.blank("kp-r-round", "Medium", "Previous state 0, input 1, input weight 1, recurrent weight 0.9, no bias; tanh(1) supplied as 0.76159. Give the new state to 2 decimal places.", "0.76", [], "Round only the final result.", o(RNN, "seq-rnn", { calc: true }));
  out.seq = A.out;
}

// ---------------- Decision-tree step-by-step sheet ----------------
{ const A = makeAuthor("trees", DT);
  const v = { cov: ["trees-ig", "trees-gini", "trees-compare"] };
  A.blanks("kp-dt-par", "Easy", "Step 1 of the sheet: parent set of 12 (6 positive: 1, 3, 4, 6, 8, 12; 6 negative). Entropy(Parent) = ___ bit; Gini(Parent) = ___ (4 d.p.).", ["entropy", "Gini"], ["1.0000", "0.5000"], [["1.0000", "1", "1.0"], ["0.5000", "0.5"]], "p(pos) = p(neg) = 0.5.", o(DT, v.cov, { calc: true }));
  A.blanks("kp-dt-type", "Medium", "Type branches: French 2 (1+,1−), Italian 2 (1+,1−), Thai 4 (2+,2−), Burger 4 (2+,2−). Each branch entropy = ___; weighted child entropy = ___; IG(Type) = ___.", ["branch H", "weighted", "IG"], ["1", "1", "0"], null, "Every branch is 50/50.", o(DT, v.cov, { calc: true, steps: ["H = −0.5 log₂0.5 − 0.5 log₂0.5 = 1", "2/12 + 2/12 + 4/12 + 4/12 = 1.0", "IG = 1 − 1 = 0"] }));
  A.blanks("kp-dt-typeg", "Medium", "Type: each branch Gini = ___; weighted child Gini = ___; Gini reduction = ___ (4 d.p.).", ["branch Gini", "weighted", "reduction"], ["0.5000", "0.5000", "0.0000"], [["0.5000", "0.5"], ["0.5000", "0.5"], ["0.0000", "0"]], "No improvement.", o(DT, v.cov, { calc: true }));
  A.blanks("kp-dt-pat", "Medium", "Patrons branches: None 2 (0+,2−), Some 4 (4+,0−), Full 6 (2+,4−). H(None) = ___, H(Some) = ___, H(Full) = ___ (4 d.p.); weighted child entropy = ___; IG(Patrons) = ___.", ["H(None)", "H(Some)", "H(Full)", "weighted", "IG"], ["0", "0", "0.9183", "0.4591", "0.5409"], null, "Pure branches have entropy 0.", o(DT, v.cov, { calc: true, steps: ["H(Full) = −(1/3)log₂(1/3) − (2/3)log₂(2/3) = 0.9183", "weighted = 6/12 × 0.9183 = 0.4591", "IG = 1 − 0.4591 = 0.5409"] }));
  A.blanks("kp-dt-patg", "Medium", "Patrons Gini: Gini(Full) = ___; weighted child Gini = ___; Gini reduction = ___ (4 d.p.).", ["Gini(Full)", "weighted", "reduction"], ["0.4444", "0.2222", "0.2778"], null, "1 − (1/3)² − (2/3)².", o(DT, v.cov, { calc: true }));
  A.mcq("kp-dt-pick", "Easy", "Final step of the sheet: which attribute is picked, and by which criteria?", "Patrons, by both information gain (0.5409 > 0) and Gini reduction (0.2778 > 0)", [["Type, because it has more values", "More values does not mean more gain."], ["Patrons by IG but Type by Gini", "Both criteria agree."], ["neither: the gains tie", "They do not tie."]], "Pick the larger gain/reduction.", o(DT, v.cov));
  A.tf("kp-dt-wavg", "Medium", "In the sheet, the weighted child entropy for Type is the plain average (1 + 1 + 1 + 1)/4.", false, "It weights by branch size: 2/12, 2/12, 4/12, 4/12 (here it happens to give the same 1.0).", "Weights are |subset|/|parent|.", o(DT, v.cov));
  A.blanks("kp-dt-new", "Hard", "Same method, new attribute. Parent 6+/6−. Attribute Hungry splits into Yes 7 (5+,2−) and No 5 (1+,4−). IG(Hungry) = ___ and Gini reduction = ___ (4 d.p.).", ["IG", "Gini reduction"], ["0.1957", "0.1286"], null, "B(5/7) = 0.8631, B(1/5) = 0.7219.", o(DT, v.cov, { calc: true, tol: 0.0002, steps: ["H(Yes) = 0.8631, H(No) = 0.7219", "weighted = 7/12 × 0.8631 + 5/12 × 0.7219 = 0.8043 → IG = 0.1957", "Gini(Yes) = 1 − (5/7)² − (2/7)² = 0.4082; Gini(No) = 0.32", "weighted = 7/12 × 0.4082 + 5/12 × 0.32 = 0.3714 → reduction 0.1286"] }));
  out.trees = A.out;
}

// ---------------- Attention key-points sheet ----------------
{ const ATT = "Key points about Attention: weighted value aggregation";
  const A = makeAuthor("attn", ATT);
  A.blanks("kp-a-a", "Easy", "Sheet method. Weights 0.4 and 0.6; values [5, 1] and [0, 3]. Output = [___, ___].", ["1st", "2nd"], ["2", "2.2"], null, "[0.4·5 + 0.6·0, 0.4·1 + 0.6·3].", o(ATT, "attn-aggregate", { calc: true, steps: ["1st: 2 + 0 = 2", "2nd: 0.4 + 1.8 = 2.2"] }));
  A.blanks("kp-a-b", "Medium", "Weights 0.5, 0.25, 0.25; values [4, 0, 2], [0, 8, 4], [2, 2, 2]. Output = [___, ___, ___].", ["1st", "2nd", "3rd"], ["2.5", "2.5", "2.5"], null, "Component by component.", o(ATT, "attn-aggregate", { calc: true, steps: ["1st: 2 + 0 + 0.5 = 2.5", "2nd: 0 + 2 + 0.5 = 2.5", "3rd: 1 + 1 + 0.5 = 2.5"] }));
  A.mcq("kp-a-max", "Medium", "Weights 0.3 and 0.7; values [2, 0] and [0, 2]. A student answers [0, 2] (the value with the largest weight). The mistake is:", "selecting only the largest-weight vector instead of the weighted sum", [["adding the unweighted vectors", "That would give [2, 2]."], ["using the wrong order", "Order is fine."], ["nothing: [0, 2] is correct", "Correct output is [0.6, 1.4]."]], "Every value vector contributes in proportion to its weight.", o(ATT, "attn-aggregate", { trap: true }));
  A.mcq("kp-a-sum", "Medium", "Same weights and values. Another student answers [2, 2]. The mistake is:", "adding the value vectors without multiplying by their weights", [["picking the largest weight", "That gives [0, 2]."], ["normalising twice", "No normalising here."], ["nothing", "Correct is [0.6, 1.4]."]], "Weight first, then add.", o(ATT, "attn-aggregate", { trap: true }));
  A.tf("kp-a-len", "Easy", "The attention output has the same number of components as each value vector.", true, "Corresponding components are added.", "Output length = value length.", o(ATT, "attn-aggregate", { trap: false }));
  A.tf("kp-a-norm", "Easy", "Normalised attention weights sum to one.", true, "They come from a softmax.", "Weights add to 1.", o(ATT, "attn-softmax", { trap: false }));
  A.blank("kp-a-miss", "Medium", "Normalised weights for three values are 0.2, 0.5 and ___.", "0.3", [], "They must sum to 1.", o(ATT, "attn-softmax", { calc: true }));
  out.attn = A.out;
}

// ---------------- Lecture 11 class activity spreadsheets ----------------
{ const SRC = "Lecture 11 class activity spreadsheets (experiments table, full joint probability table)";
  const A = makeAuthor("bayes", SRC);
  const N = "99,995,505,198";
  A.blank("act-row", "Medium", `Activity 2: the experiments total N = ${N}. The event (JohnCalls, MaryCalls, Alarm, Burglary, Earthquake) = (T, F, T, T, F) occurred 25,329,240 times. Its probability = ___ (3 s.f., e.g. 1.23e-4).`, "2.53e-4", ["0.000253"], "P(event) = occurrences / total experiments.", o(SRC, "bayes-joint-table", { calc: true, tol: 6e-7 }));
  A.blank("act-rows", "Easy", "The full joint table for the five binary burglary variables has ___ rows.", "32", [], "2⁵.", o(SRC, "bayes-joint-table", { calc: true }));
  A.blanks("act-post", "Hard", "Activity: compute P(Burglary | JohnCalls = T, MaryCalls = F) from the full joint table. Summing the rows with J = T, M = F gives 0.000256774 for B = T and 0.049798101 for B = F. P(b | j, ¬m) = ___ (4 d.p.); P(¬b | j, ¬m) = ___ (4 d.p.).", ["P(b|j,¬m)", "P(¬b|j,¬m)"], ["0.0051", "0.9949"], null, "Filter, group by B, sum, normalise.", o(SRC, ["bayes-joint-table", "bayes-enumeration"], { calc: true, steps: ["0.000256774/(0.000256774 + 0.049798101) = 0.00513", "1 − 0.00513 = 0.99487"] }));
  A.multi("act-steps", "Medium", "Which steps compute P(Burglary | j, ¬m) from the full joint table?", [["keep only rows with JohnCalls = T and MaryCalls = F", true, "filter"], ["split the kept rows into B = T and B = F", true, "group"], ["add the probabilities in each group (summing over A and E)", true, "marginalise"], ["divide each sum by the total of both sums", true, "normalise"], ["multiply all 32 rows together", false, "rows are added, not multiplied"]], "Filter → group → marginalise → normalise.", o(SRC, "bayes-joint-table"));
  A.tf("act-sum1", "Easy", "The 32 probabilities of the full joint table add up to 1 (apart from rounding).", true, "Every possible event is listed once.", "Joint table sums to 1.", o(SRC, "bayes-joint-table", { trap: false }));
  out.bayes = A.out;
}

export const keypoints = out;
