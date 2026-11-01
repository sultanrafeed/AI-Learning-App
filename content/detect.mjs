import { makeAuthor } from "./helpers.mjs";
import { table } from "../js/gen-core.js";
const A = makeAuthor("detect", "Lecture 7 (Object detection) + Key points about IoU and NMS");
const KP = "Key points about IoU and non-max suppression";
export const coverage = [
  { id: "detect-task", text: "Object detection = what + where: class, box (x, y, w, h), confidence; variable-length set of object records", src: "Lecture 7, slide 58" },
  { id: "detect-naive", text: "Naive crop classification; search-space explosion 80×80×3×3 = 57,600; repeated computation", src: "Lecture 7, slides 59-60" },
  { id: "detect-yolo", text: "YOLO: shared feature map 20×20×256, dense predictions 20×20×(5 + C), single pass", src: "Lecture 7, slide 61" },
  { id: "detect-iou", text: "IoU from corner coordinates: widths/heights, intersection, union = A + B − I", src: KP + "; Lecture 7, slide 62" },
  { id: "detect-nms", text: "Non-max suppression: keep highest confidence, suppress same-class boxes with IoU above threshold (strict >), repeat; threshold trade-offs", src: KP + "; Lecture 7, slide 62" },
  { id: "detect-seg", text: "Semantic segmentation: encoder (downsample) → decoder (upsample) → C logits per pixel → argmax class map", src: "Lecture 7, slide 63" },
];
export const formulas = [
  { name: "IoU", f: "IoU = I / (A + B − I)", note: "I = intersection area" },
  { name: "Intersection width", f: "min(x₂ᴬ, x₂ᴮ) − max(x₁ᴬ, x₁ᴮ) (0 if negative)", note: "same for height" },
  { name: "YOLO output", f: "S × S × (5 + C)", note: "x, y, w, h, objectness + C class scores" },
];
export const glossary = [
  { term: "Bounding box", def: "Rectangle (x, y, width, height) or corners locating an object." }, { term: "Confidence / objectness", def: "How strongly the model supports that a box contains an object." },
  { term: "IoU", def: "Intersection over Union: overlap area ÷ union area of two boxes." }, { term: "Non-max suppression", def: "Removes duplicate detections by keeping the top-scoring box and deleting its heavy overlaps." },
  { term: "YOLO", def: "Single-pass detector predicting boxes densely from one shared feature map." }, { term: "Semantic segmentation", def: "Predicting a class label for every pixel." },
];
const boxes = `<svg viewBox="-5 -5 270 150" class="bsvg"><rect x="0" y="20" width="150" height="100" fill="#6366f1" fill-opacity=".18" stroke="#6366f1" stroke-width="2"/><rect x="50" y="20" width="150" height="100" fill="#f97316" fill-opacity=".18" stroke="#f97316" stroke-width="2"/><rect x="50" y="20" width="100" height="100" fill="#10b981" fill-opacity=".35"/><text x="5" y="15" class="bl">A (0,0)-(6,4)</text><text x="150" y="140" class="bl">B (2,0)-(8,4)</text><text x="75" y="75" class="bl">I = 4×4 = 16</text></svg>`;
export const learn = [
  { id: "detect-task", title: "From classification to detection", cov: ["detect-task", "detect-naive", "detect-yolo"], src: "Lecture 7, slides 58-61",
    hook: "Detection answers 'what?' AND 'where?' for every object in one image.",
    visual: table(["Approach", "How", "Problem / benefit"], [["Naive crops", "classify each crop", "80×80 locations × 3 scales × 3 ratios = 57,600 crops; repeated work"], ["YOLO", "one CNN pass → 20×20×256 feature map → 20×20×(5 + C)", "all 400 locations predicted together"]]),
    formula: [["Record", "class + box (x, y, w, h) + confidence"], ["YOLO vector", "box x, y, w, h + objectness + class scores"]],
    example: ["One prediction: box, objectness 0.94, car .91, person .03 → 'car 0.91'."],
    memory: "You Only Look Once: share the feature map.", trap: "The output is a VARIABLE-length set of records, not a fixed single label.", check: "detect-c-task-1" },
  { id: "detect-iou", title: "Intersection over Union", cov: ["detect-iou"], src: KP, visual: boxes,
    hook: "IoU scores how much two boxes overlap, from 0 (none) to 1 (identical).",
    formula: [["Width", "larger x − smaller x"], ["Intersection", "shared width × shared height"], ["Union", "A + B − I"], ["IoU", "I / Union"]],
    example: ["A (0,0)-(6,4), B (2,0)-(8,4): areas 24 and 24; overlap 4×4 = 16; union 24 + 24 − 16 = 32; IoU = 0.50."],
    memory: "Shared over Total (don't double-count the shared part).", trap: "Union = A + B − I. Forgetting −I gives 16/48 = 0.33.", check: "detect-c-iou-1" },
  { id: "detect-nms", title: "Non-max suppression", cov: ["detect-nms"], src: KP,
    hook: "NMS deletes duplicate boxes around the same object.",
    visual: table(["Box", "Score", "IoU with kept B1", "Decision (thr > 0.4)"], [["B1", "0.95", "–", "keep"], ["B2", "0.90", "0.62", "suppress"], ["B3", "0.70", "0.10", "keep (next round)"], ["B4", "0.60", "0.40", "keep (0.40 is not > 0.40)"]]),
    formula: [["1", "sort by confidence"], ["2", "keep the top box"], ["3", "suppress same-class boxes with IoU > threshold"], ["4", "repeat with the next remaining box"]],
    example: ["Key points: IoU(A, B) = 0.50 with threshold 'strictly above 0.40' and A higher-scoring → suppress B."],
    memory: "Keep the king, remove the clones, repeat.", trap: "Equality does NOT trigger suppression when the rule is 'strictly greater'. NMS is per class.", check: "detect-c-nms-1" },
  { id: "detect-seg", title: "Semantic segmentation", cov: ["detect-seg"], src: "Lecture 7, slide 63",
    hook: "Beyond boxes: a class for every pixel.",
    visual: table(["Stage", "Shape"], [["RGB image", "[3, H, W]"], ["Encoder", "conv + downsampling"], ["Decoder", "upsampling + conv"], ["Logits", "[C, H, W]"], ["argmax over classes", "[H, W] class map"]]),
    formula: [["pred_mask", "logits.argmax(dim = 1) → [N, H, W]"]],
    example: ["SceneSegmenter(num_classes = 4): logits [N, 4, H, W] → mask [N, H, W]."],
    memory: "Squeeze (encoder), then stretch back (decoder).", trap: "The decoder RESTORES spatial resolution; the encoder reduces it.", check: "detect-c-seg-1" },
];
export const cheat = { title: "Detection cheat sheet",
  rows: [["IoU", "I/(A + B − I)", "(0,0)-(6,4) vs (2,0)-(8,4) → 0.5", ""], ["NMS", "sort, keep top, suppress IoU > thr", "per class", ""], ["YOLO", "S×S×(5 + C)", "20×20 → 400 locations", ""], ["Crops", "80×80×3×3", "57,600", ""], ["Segmentation", "[C,H,W] logits → argmax", "", ""]],
  traps: ["Subtract the intersection in the union.", "No overlap → IoU 0 (not negative).", "Strict > vs ≥.", "Only same-class boxes suppress each other.", "Higher threshold → more duplicates kept; lower → risk deleting real neighbours."] };

A.mcq("c-task-1", "Easy", "Which three things does each object-detection record contain?", "Class, bounding box and confidence", [["Class, pixel mask and depth", "Masks are segmentation."], ["Only a class probability vector", "That's classification."], ["Box and loss value", "Loss is for training."]], "What, where, how sure.", { cov: ["detect-task"], src: "Lecture 7, slide 58" });
A.tf("c-task-2", "Medium", "Object detection outputs a fixed number of boxes for every image.", false, "One image → a VARIABLE-length set of object records.", "Count of objects varies.", { cov: ["detect-task"] });
A.multi("c-task-3", "Medium", "Why is classifying many crops a poor detection strategy?", [["The number of candidate crops explodes (positions × scales × shapes)", true, "57,600 for 80×80×3×3."], ["Nearby crops overlap, so the CNN repeats the same computation", true, ""], ["Crops can't be classified by a CNN", false, "They can."], ["It needs one CNN pass per crop", true, "Very slow."]], "Better: run the CNN once and share the feature map.", { cov: ["detect-naive"], src: "Lecture 7, slides 59-60" });
A.blank("c-task-4", "Easy", "80 × 80 locations × 3 window scales × 3 aspect ratios = ______ candidate crops.", "57600", ["57,600"], "Lecture 7 slide 60.", { cov: ["detect-naive"], calc: true });
A.mcq("c-task-5", "Medium", "In YOLO (Lecture 7), what does each spatial feature vector of the 20×20×256 map get mapped to?", "Box (x, y, w, h) + objectness + class scores", [["A single class label for the whole image", "That's classification."], ["A per-pixel mask", "That's segmentation."], ["A new crop to classify", "No crops in YOLO."]], "Dense predictions in one pass.", { cov: ["detect-yolo"], src: "Lecture 7, slide 61" });
A.tf("c-task-6", "Medium", "YOLO processes all 400 spatial locations of a 20×20 feature map together in one pass.", true, "Lecture 7 slide 61.", "One look.", { cov: ["detect-yolo"], trap: false });
A.blank("c-task-7", "Medium", "A YOLO head with C = 3 classes on a 20×20 grid predicts 20×20×______ values.", "8", [], "5 + C = 8.", { cov: ["detect-yolo"], calc: true });
A.mcq("c-iou-1", "Easy", "A has corners (0,0),(6,4); B has (2,0),(8,4). IoU?", "0.50", [["0.33", "Union must subtract the intersection: 16/48 is wrong."], ["0.67", "16/24 divides by one box only."], ["0.25", "Arithmetic slip."]], "16/(24 + 24 − 16) = 0.5.", { cov: ["detect-iou"], calc: true, src: KP });
A.tf("c-iou-2", "Easy", "If two boxes do not overlap at all, their IoU is 0.", true, "Intersection 0 → IoU 0.", "IoU ∈ [0, 1].", { cov: ["detect-iou"], trap: false });
A.tf("c-iou-3", "Medium", "Union area = area of A + area of B.", false, "Union = A + B − intersection; otherwise the overlap is counted twice.", "Classic IoU trap.", { cov: ["detect-iou"] });
A.blanks("c-iou-4", "Medium", "Boxes (1,1)-(5,5) and (3,3)-(7,7). Intersection = ______, union = ______, IoU = ______ (3 dp).", ["I", "U", "IoU"], ["4", "28", "0.143"], [["4"], ["28"], ["0.143", "0.14"]], "Overlap 2×2 = 4; 16 + 16 − 4 = 28.", { cov: ["detect-iou"], calc: true, tol: 0.0015 });
A.mcq("c-iou-5", "Medium", "Box A is completely inside box B (A = 4, B = 16). IoU?", "0.25", [["1.0", "Only identical boxes give 1."], ["0.2", "4/(16 + 4) forgets to subtract I."], ["0.33", "Divided by B − A."]], "I = 4, U = 16 → 0.25.", { cov: ["detect-iou"], calc: true });
A.mcq("c-nms-1", "Medium", "NMS rule: suppress if IoU > 0.5. The kept box and a lower-scoring same-class box have IoU exactly 0.5. What happens?", "The lower-scoring box is kept (equality does not trigger suppression)", [["It is suppressed", "Only strictly greater suppresses."], ["Both are removed", "The top box is always kept."], ["The higher-scoring box is removed", "NMS keeps the highest score."]], "Read > vs ≥ carefully.", { cov: ["detect-nms"], src: KP });
A.tf("c-nms-2", "Medium", "NMS suppresses overlapping boxes even when they belong to different classes.", false, "Suppression is applied to boxes of the SAME class.", "Per-class NMS.", { cov: ["detect-nms"], src: KP });
A.multi("c-nms-3", "Medium", "Select ALL steps of non-max suppression (Lecture 7).", [["Keep the highest-score box", true, "Step 1."], ["Suppress highly overlapping boxes", true, "Step 2."], ["Repeat with the next remaining box", true, "Step 3."], ["Average the overlapping boxes into one", false, "That's not standard NMS."], ["Delete the highest-score box if it overlaps others", false, "It is always kept."]], "Keep, suppress, repeat.", { cov: ["detect-nms"], src: "Lecture 7, slide 62" });
A.mcq("c-nms-4", "Hard", "Raising the NMS IoU threshold (e.g. 0.3 → 0.7) tends to…", "keep more boxes, so more duplicate detections may survive", [["remove more boxes", "Higher threshold suppresses fewer."], ["change the confidence scores", "Scores are unchanged."], ["merge classes", "No."]], "Thresholds trade missed objects against duplicates.", { cov: ["detect-nms"], src: "Lecture 7, slide 62" });
A.match("c-nms-5", "Medium", "Match each detection term to its meaning.", [["IoU", "overlap area ÷ union area"], ["NMS", "removes duplicate boxes"], ["Objectness", "how likely a box contains any object"], ["Class score", "how likely the object is a given class"]], ["pixel-level class map"], "Know the vocabulary.", { cov: ["detect-nms", "detect-iou", "detect-yolo"] });
A.mcq("c-seg-1", "Medium", "In the segmentation model, what does the decoder do?", "Restores spatial resolution with upsampling + convolution", [["Reduces resolution with downsampling", "That's the encoder."], ["Draws bounding boxes", "Detection."], ["Applies NMS", "Not used here."]], "Encoder ↓, decoder ↑.", { cov: ["detect-seg"], src: "Lecture 7, slide 63" });
A.blanks("c-seg-2", "Medium", "SceneSegmenter(num_classes = 4): logits shape [N, ______, H, W]; pred_mask = logits.argmax(dim = 1) has shape [N, ______, ______] (use H and W).", ["classes", "dim 2", "dim 3"], ["4", "H", "W"], [["4"], ["H", "h"], ["W", "w"]], "One class ID per pixel.", { cov: ["detect-seg"], src: "Lecture 7, slide 63" });
A.tf("c-seg-3", "Easy", "Semantic segmentation predicts one class for every pixel.", true, "Lecture 7 slide 63.", "Per-pixel classification.", { cov: ["detect-seg"], trap: false });
A.match("c-seg-4", "Medium", "Match the vision task to its output.", [["Classification", "one label for the whole image"], ["Object detection", "a box, label and confidence for every object"], ["Semantic segmentation", "a class label for every pixel"]], ["a caption sentence"], "Different training targets, different questions.", { cov: ["detect-seg", "detect-task"], src: "Lecture 7, slide 12" });

export const questions = A.out;
