import { makeAuthor } from "./helpers.mjs";
import { table, grid } from "../js/gen-core.js";
const A = makeAuthor("cnn", "Lecture 7 (Computer vision)");
const L = (p) => `Lecture 7, slide ${p}`;
const KP = "Key points about convolution filters and parameter counts";
export const coverage = [
  { id: "cnn-basics", text: "Why CV rose (data + compute + learning); sensing modalities (RGB, thermal, depth, LiDAR, radar, event, CT/MRI); pipeline signal→sensor→data→model→action; image as tensor [batch, channels, H, W]; tasks: classification, detection, segmentation", src: L("3-12") },
  { id: "cnn-why", text: "Hand-engineered features and their limits (viewpoint, illumination, scale, deformation, occlusion, pose, clutter, intra-class); flattening loses neighbourhoods; parameter explosion 224×224×3 → 150,528 inputs → 150,528,000 weights; locality, weight sharing, hierarchy", src: L("13-25") },
  { id: "cnn-conv", text: "Convolution operation: slide, multiply, sum (+ bias); diagonal/top-bar/vertical/edge filters; '7' worked example output [[-2,-3,1],[-2,3,-2],[1,-1,-1]]", src: L("26-39") },
  { id: "cnn-outsize", text: "Output size ⌊(N + 2P − K)/S⌋ + 1 (7×7, 3×3, S=1, P=0 → 5×5; 5×5 → 3×3)", src: L("22, 28") },
  { id: "cnn-params", text: "Filters span all input channels; output channels = number of filters; params = (K·K·C_in + 1)·C_out; weight sharing (image size irrelevant); 64×64×3 with 8 filters → 62×62×8", src: L(40) + "; " + KP },
  { id: "cnn-pool", text: "ReLU / Leaky ReLU non-linearity; max pooling 2×2 stride 2 (231, 0, 207, 0), no learned weights", src: L("41-45") },
  { id: "cnn-arch", text: "Feature hierarchy (edges → parts → objects, ResNet-18 activation shapes, GAP); CNN classifier head (flatten, FC, softmax, logits); PyTorch layers & 5 training steps; custom CNN shape tracking; BatchNorm, Dropout", src: L("46-53") },
  { id: "cnn-classic", text: "AlexNet (2012), VGG11 (2014), ResNet18 (2015); residual block y = ReLU(F(x) + x); fine-tuning 5 steps", src: L("54-56") },
  { id: "cnn-rf", text: "Receptive field grows with depth (Extra: RF formula not in the slides)", src: L(48) + " (formula: Extra)" },
];
export const formulas = [
  { name: "Conv output size", f: "N_out = ⌊(N_in + 2P − K)/S⌋ + 1", note: "floor before +1" },
  { name: "Conv parameters", f: "(K_h·K_w·C_in + 1)·C_out", note: "+1 = one bias per filter" },
  { name: "Conv layer output", f: "z[p,q] = Σᵢ Σⱼ wᵢⱼ·x[p+i, q+j] + b", note: "no kernel flip" },
  { name: "ReLU / Leaky ReLU", f: "max(0, x) ; max(αx, x), α = 0.1", note: "" },
  { name: "Receptive field (Extra)", f: "RF_l = RF_(l−1) + (K_l − 1)·Π strides of earlier layers", note: "RF₀ = 1" },
  { name: "ResNet block", f: "y = ReLU(F(x) + x)", note: "skip connection" },
];
export const glossary = [
  { term: "Tensor", def: "Multi-dimensional array of numbers; an image batch is [batch, channels, height, width]." }, { term: "Kernel / filter", def: "Small learned weight grid slid over the input; asks the same local question everywhere." },
  { term: "Stride", def: "Step size of the filter as it slides." }, { term: "Padding", def: "Extra border (usually zeros) added around the input." },
  { term: "Feature map", def: "Output grid of one filter; one channel of the output volume." }, { term: "Weight sharing", def: "The same filter weights are reused at every location." },
  { term: "Max pooling", def: "Keeps the largest value in each window; reduces spatial size; no parameters." }, { term: "Receptive field", def: "Region of the input that affects one unit; grows with depth." },
  { term: "Logits", def: "Raw class scores before softmax; CrossEntropyLoss expects logits." }, { term: "Fine-tuning", def: "Start from pretrained weights, replace the head, train with a small learning rate." },
  { term: "Skip connection", def: "ResNet identity path adding the input to the block output." }, { term: "Global average pooling (GAP)", def: "Averages each channel to a single value (e.g. 512×7×7 → 512)." },
];
const seven = grid([[1, 1, 1, 1, 1], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [0, 1, 0, 0, 0]], { caption: "Input '7' (5×5)", hl: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] }) + grid([[-1, -1, 1], [-1, 1, -1], [1, -1, -1]], { caption: "Diagonal kernel" }) + grid([[-2, -3, 1], [-2, 3, -2], [1, -1, -1]], { caption: "Output 3×3" });
export const learn = [
  { id: "cnn-basics", title: "How computers see", cov: ["cnn-basics"], src: L("3-12"),
    hook: "To a computer, an image is just a grid (tensor) of numbers.",
    visual: table(["Task", "Question", "Output"], [["Classification", "what is in the image?", "one label (Grogu 82%)"], ["Object detection", "what and where?", "box + label + confidence per object"], ["Semantic segmentation", "what is each pixel?", "class per pixel"]]),
    formula: [["Grayscale", "H × W × 1, values 0–255"], ["Colour", "3 aligned grids R, G, B"], ["PyTorch batch", "[batch, channels, height, width]"], ["Pipeline", "signal → sensor → data → model → action"]],
    example: ["512×512×1 Grogu photo → resize 16×16×1 → tensor [16, 16, 1] in 0…255."],
    memory: "Data + Compute + Learning = the rise of computer vision.", trap: "Classification says WHAT is present, not WHERE.", check: "cnn-c-basics-1" },
  { id: "cnn-why", title: "Why convolution (not dense layers)?", cov: ["cnn-why"], src: L("13-25"),
    hook: "Dense layers forget which pixels were neighbours and need millions of weights.",
    visual: table(["Problem with FC", "Convolution's answer"], [["Flattening destroys 2D neighbourhoods", "local connectivity (3×3 patches)"], ["224×224×3 = 150,528 inputs × 1,000 units = 150,528,000 weights", "shared weights: one small filter reused everywhere"], ["Hand-written rules can't cover every variation", "learn the features from data"]]),
    formula: [["Locality", "look at a small neighbourhood"], ["Weight sharing", "same detector at every location"], ["Hierarchy", "edges → parts → objects"]],
    example: ["Two different '7's share a top bar, a descending diagonal and a lower stroke: local filters can match both."],
    memory: "L-W-H: Locality, Weight sharing, Hierarchy.", trap: "Hand-engineered features must anticipate viewpoint, illumination, scale, deformation, occlusion, pose, clutter and intra-class variation.", check: "cnn-c-why-1" },
  { id: "cnn-conv", title: "The convolution operation", cov: ["cnn-conv", "cnn-outsize"], src: L("22-36"), visual: seven,
    hook: "Slide the filter, multiply element-wise, sum: one number per position.",
    formula: [["z[p,q] = ΣΣ w·x + b", "window ⊙ kernel, summed"], ["Output size", "⌊(N + 2P − K)/S⌋ + 1"], ["Example", "(5 − 3)/1 + 1 = 3"]],
    example: ["Step 1: window rows 0-2, cols 0-2. Matches with +1 weights: 1; with −1 weights: 3 → 1 − 3 = −2.", "Step 5 (centre): +1 matches 3, −1 matches 0 → output[1,1] = 3 (strong diagonal)."],
    memory: "Slide, Multiply, Sum (SMS).", trap: "Floor before +1, and padding counts twice (2P).", check: "cnn-c-conv-1" },
  { id: "cnn-params", title: "Filters, channels and parameter counts", cov: ["cnn-params"], src: L(40) + "; " + KP,
    hook: "Each filter looks through ALL input channels and produces ONE output channel.",
    visual: table(["Input", "Filters", "Output", "Params"], [["64×64×3", "8 × (3×3×3)", "62×62×8", "(27 + 1)×8 = 224"], ["RGB", "2 × (3×3×3) + bias", "2 channels", "(27 + 1)×2 = 56"]]),
    formula: [["Params", "(K·K·C_in + 1)·C_out"], ["Channels out", "= number of filters"], ["Image size", "does NOT affect parameters"]],
    example: ["Two 3×3 filters on RGB with bias: (3×3×3 + 1)×2 = 56."],
    memory: "Filter depth = input depth; output depth = filter count.", trap: "Forgetting the bias, or forgetting × C_in.", check: "cnn-c-params-1" },
  { id: "cnn-pool", title: "ReLU and pooling", cov: ["cnn-pool"], src: L("41-45"),
    hook: "ReLU keeps positive evidence; pooling keeps the strongest response and shrinks the map.",
    visual: grid([[230, 135, 0, 0], [231, 146, 0, 0], [207, 136, 0, 0], [163, 120, 0, 0]], { caption: "4×4 patch" }) + grid([[231, 0], [207, 0]], { caption: "2×2 max pool, stride 2" }),
    formula: [["ReLU", "max(0, x)"], ["Leaky ReLU", "max(αx, x), α = 0.1"], ["Max pool 2×2, s2", "halves H and W; 512×512 → 256×256"], ["Pool parameters", "0"]],
    example: ["max(230, 135, 231, 146) = 231; max(207, 136, 163, 120) = 207."],
    memory: "Pooling: keep the loudest voice in each room.", trap: "Pooling has NO learnable weights and does not change the number of channels.", check: "cnn-c-pool-1" },
  { id: "cnn-arch", title: "CNN classifiers, training & classic architectures", cov: ["cnn-arch", "cnn-classic", "cnn-rf"], src: L("46-56"),
    hook: "Conv + ReLU + pool blocks extract features; a head turns them into class scores.",
    visual: table(["Stage", "Shape"], [["Input", "1×28×28"], ["Conv16 stride 2", "16×14×14"], ["MaxPool", "16×7×7"], ["Conv32", "32×7×7"], ["MaxPool", "32×3×3"], ["Flatten", "288"], ["Linear", "288 → 10 logits"]]),
    formula: [["Training loop", "zero_grad → forward → loss → backward → step"], ["ResNet", "y = ReLU(F(x) + x)"], ["Fine-tune", "load pretrained → replace head → small LR → unfreeze selected → evaluate"]],
    example: ["ResNet-18: 3×224×224 → 64×112×112 → 128×28×28 → 512×7×7 → GAP 512.", "AlexNet 2012 (large kernels, ReLU, dropout, GPU), VGG11 2014 (repeated 3×3), ResNet18 2015 (skip connections)."],
    memory: "Spatial size shrinks, channels grow, receptive field grows.", trap: "Don't put softmax in the model when training with CrossEntropyLoss: it expects raw logits.", check: "cnn-c-arch-1" },
];
export const cheat = { title: "CNN cheat sheet",
  rows: [["Output size", "⌊(N + 2P − K)/S⌋ + 1", "7×7, K3, S1, P0 → 5", ""], ["Params", "(K²C_in + 1)C_out", "2×3×3 on RGB → 56", ""], ["Channels", "= #filters", "64×64×3, 8 filters → 62×62×8", ""], ["Pooling", "max/avg window", "0 params, same channels", ""], ["Dense", "inputs × units", "150,528 × 1000", ""], ["RF (Extra)", "RF += (K−1)·Πstrides", "", ""]],
  traps: ["Filter spans all input channels.", "One bias per FILTER.", "Image size doesn't change conv params.", "Floor before +1.", "Softmax not inside the model for CrossEntropyLoss."] };

A.mcq("c-basics-1", "Easy", "Which task assigns one class label to every pixel?", "Semantic segmentation", [["Image classification", "One label per image."], ["Object detection", "Box + label per object."], ["Pooling", "Not a task."]], "Segmentation = per-pixel labels.", { cov: ["cnn-basics"], src: L(12) });
A.match("c-basics-2", "Medium", "Match each physical signal to its sensor (Lecture 7).", [["Laser pulses", "LiDAR → point cloud"], ["Radio waves", "Radar → range-Doppler map"], ["Infrared radiation", "Thermal camera → thermal image"], ["Brightness changes", "Event camera → event stream"]], ["Sound waves → spectrogram camera"], "Different sensors, complementary views of one scene.", { cov: ["cnn-basics"], src: L(5) });
A.blank("c-basics-3", "Easy", "PyTorch image batch shape order: [batch, ______, height, width].", "channels", ["channel", "C"], "NCHW.", { cov: ["cnn-basics"], src: L(10) });
A.multi("c-basics-4", "Easy", "Which are the three drivers of modern computer vision (Lecture 7)?", [["Data (massive datasets)", true, ""], ["Compute (GPUs)", true, ""], ["Learning (better architectures and training)", true, ""], ["Hand-written feature rules", false, "That's the old approach."]], "Data + Compute + Learning.", { cov: ["cnn-basics"], src: L(3) });
A.tf("c-basics-5", "Easy", "Image classification tells you where an object is in the image.", false, "Classification says WHAT is present, not where; detection adds boxes.", "Different targets → different tasks.", { cov: ["cnn-basics"], src: L(11) });
A.mcq("c-why-1", "Medium", "Why are fully connected networks a poor default for images?", "Flattening loses neighbourhood structure and the parameter count explodes", [["They cannot learn at all", "They can learn, just inefficiently."], ["They need images to be grayscale", "No."], ["They have no weights", "They have far too many."]], "Two problems, one fix: convolution.", { cov: ["cnn-why"], src: L("17-19") });
A.blanks("c-why-2", "Easy", "224 × 224 × 3 = ______ inputs; connected to 1,000 units gives ______ weights.", ["inputs", "weights"], ["150528", "150528000"], [["150528", "150,528"], ["150528000", "150,528,000"]], "Parameters explode.", { cov: ["cnn-why"], calc: true, src: L(18) });
A.match("c-why-3", "Medium", "Match each idea to why convolution works well for images.", [["Locality", "look at a small neighbourhood at a time"], ["Weight sharing", "use the same feature detector at every location"], ["Hierarchy", "stack layers so simple features become parts, then objects"]], ["make every pixel its own parameter"], "L-W-H.", { cov: ["cnn-why"], src: L(23) });
A.multi("c-why-4", "Medium", "Which variations must hand-engineered features anticipate (Lecture 7)?", [["Viewpoint and scale", true, ""], ["Illumination", true, ""], ["Occlusion and background clutter", true, ""], ["Intra-class variation and deformation", true, ""], ["The GPU model used", false, "Irrelevant."]], "A robust rulebook needs special handling for all of them.", { cov: ["cnn-why"], src: L(16) });
A.tf("c-why-5", "Medium", "Two handwritten '7's that differ pixel-by-pixel can still share local visual clues such as a top bar and a descending diagonal.", true, "Lecture 7 slides 24-25.", "Local filters match local clues.", { cov: ["cnn-why"], src: L(25), trap: false });
A.mcq("c-conv-1", "Medium", "In the Lecture 7 '7' example (5×5 input, diagonal kernel), output[1,1] = 3. What does a large positive output mean?", "The local patch strongly matches the diagonal pattern", [["The patch is all zeros", "That gives 0."], ["The kernel weights were updated", "Forward pass only."], ["The patch is the opposite of the pattern", "That gives large negatives."]], "Filter = small visual question.", { cov: ["cnn-conv"], src: L(32) });
A.blank("c-conv-2", "Medium", "Lecture 7 '7' example, step 3: the window's +1-weight matches sum to 3 and −1-weight matches sum to 2. output[0,2] = ______.", "1", [], "3 − 2.", { cov: ["cnn-conv"], calc: true, visual: seven, src: L(30) });
A.blanks("c-conv-3", "Hard", "Give the bottom row of the Lecture 7 output (output[2,0], output[2,1], output[2,2]).", ["[2,0]", "[2,1]", "[2,2]"], ["1", "-1", "-1"], [["1"], ["-1", "−1"], ["-1", "−1"]], "Steps 7-9: 2−1, 1−2, 0−1.", { cov: ["cnn-conv"], calc: true, visual: seven, src: L("34-36") });
A.tf("c-conv-4", "Medium", "A convolutional layer adds one bias per output position.", false, "One bias per FILTER, shared across positions: z[p,q] = ΣΣ w x + b.", "Shared weights, shared bias.", { cov: ["cnn-conv", "cnn-params"], src: L(39) });
A.match("c-conv-5", "Medium", "Match each 3×3 kernel (rows top→bottom) to what it detects.", [["[-1 0 1; -1 0 1; -1 0 1]", "vertical edges"], ["[-1 -1 -1; 0 0 0; 1 1 1]", "horizontal edges"], ["[0 1 2; -1 0 1; -2 -1 0]", "diagonal edges"]], ["colour saturation"], "Lecture 7 slide 37 Grogu responses.", { cov: ["cnn-conv"], src: L(37) });
A.mcq("c-out-1", "Easy", "7×7 input, 3×3 filter, stride 1, padding 0. Output size?", "5×5", [["7×7", "That needs padding 1."], ["4×4", "(7−3)/1 + 1 = 5."], ["3×3", "That's for a 5×5 input."]], "⌊(7 + 0 − 3)/1⌋ + 1 = 5.", { cov: ["cnn-outsize"], calc: true, src: L(22) });
A.tf("c-out-2", "Medium", "With 'same' padding P = (K − 1)/2 and stride 1, the output has the same width as the input.", true, "N + 2P − K + 1 = N when 2P = K − 1. (Lecture 7 FashionCNN uses padding = 1 with 3×3.)", "padding=1 for 3×3 keeps size.", { cov: ["cnn-outsize"], src: L(51), trap: false });
A.blank("c-out-3", "Medium", "Conv2d(1, 16, 3, stride=2, padding=1) on a 1×28×28 input gives 16×___×___. Give the spatial size.", "14", [], "⌊(28 + 2 − 3)/2⌋ + 1 = 13 + 1 = 14.", { cov: ["cnn-outsize"], calc: true, src: L(53) });
A.mcq("c-params-1", "Easy", "Two 3×3 filters on an RGB input, one bias per filter. Trainable parameters?", "56", [["20", "Forgot the 3 input channels: (9+1)×2."], ["54", "Forgot the biases."], ["55", "One bias per filter, not one in total."]], "(3×3×3 + 1)×2 = 56.", { cov: ["cnn-params"], calc: true, src: KP });
A.tf("c-params-2", "Medium", "A bigger input image means a convolutional layer has more trainable parameters.", false, "Weights are reused across positions; image size doesn't add parameters.", "Weight sharing.", { cov: ["cnn-params"], src: KP });
A.blanks("c-params-3", "Medium", "Input 64×64×3, 8 learned filters of 3×3×3, stride 1, no padding. Output volume = ______ × ______ × ______.", ["H", "W", "C"], ["62", "62", "8"], null, "Output depth = number of filters.", { cov: ["cnn-params", "cnn-outsize"], calc: true, src: L(40) });
A.multi("c-params-4", "Medium", "Select ALL true statements about convolution filters.", [["Each standard filter spans all input channels", true, "3×3 on RGB = 27 weights."], ["Each filter produces one output feature map", true, ""], ["Number of filters = number of output channels", true, ""], ["Pooling layers add parameters per channel", false, "Pooling has none."], ["The same weights are reused across image positions", true, "Weight sharing."]], "Depth in = filter depth; depth out = #filters.", { cov: ["cnn-params"], src: KP });
A.mcq("c-pool-1", "Easy", "How many learnable parameters does a 2×2 max-pooling layer have?", "0", [["4 per channel", "No weights."], ["1 bias per channel", "No bias."], ["4", "No weights."]], "Pooling is a fixed operation.", { cov: ["cnn-pool"], src: L(45) });
A.blanks("c-pool-2", "Easy", "Max-pool the 4×4 patch [230 135 0 0; 231 146 0 0; 207 136 0 0; 163 120 0 0] with 2×2, stride 2.", ["[0,0]", "[0,1]", "[1,0]", "[1,1]"], ["231", "0", "207", "0"], null, "Lecture 7 slides 42-45.", { cov: ["cnn-pool"], calc: true, src: L("42-45") });
A.mcq("c-pool-3", "Medium", "Leaky ReLU with α = 0.1 applied to −5 gives…", "−0.5", [["0", "That's ReLU."], ["−5", "That's identity."], ["0.5", "Sign is kept."]], "max(0.1×(−5), −5) = −0.5.", { cov: ["cnn-pool"], calc: true, src: L(41) });
A.tf("c-pool-4", "Medium", "Max pooling 2×2 with stride 2 on a 512×512 feature map gives 256×256 and keeps the number of channels.", true, "Lecture 7 slide 42.", "Pooling shrinks H, W only.", { cov: ["cnn-pool"], src: L(42), trap: false });
A.mcq("c-pool-5", "Medium", "Why do CNNs need a non-linearity like ReLU between layers?", "Without it, stacked linear layers collapse into a single linear function", [["To reduce the image size", "That's pooling."], ["To normalise activations", "That's BatchNorm."], ["To prevent overfitting", "That's dropout."]], "Non-linearity lets stacked layers learn complex functions.", { cov: ["cnn-pool"], src: L(41) });
A.match("c-arch-1", "Medium", "Match each block to its role in the custom CNN (Lecture 7 lab readiness).", [["BatchNorm", "stabilise activations"], ["Dropout", "regularise the classifier"], ["ReLU", "add non-linearity"], ["MaxPool", "reduce spatial size"]], ["increase the number of channels"], "Know what each layer does.", { cov: ["cnn-arch"], src: L(53) });
A.mcq("c-arch-2", "Medium", "Why does the FashionCNN return logits and not softmax probabilities?", "nn.CrossEntropyLoss expects raw class scores (logits)", [["Softmax is not differentiable", "It is."], ["Logits are always positive", "They can be negative."], ["Softmax changes the predicted class", "Argmax is unchanged."]], "Don't put Softmax in the model during training.", { cov: ["cnn-arch"], src: L(51) });
A.multi("c-arch-3", "Easy", "Select ALL steps of each training batch (Lecture 7).", [["optimizer.zero_grad()", true, "Clear old gradients."], ["forward: logits = model(images)", true, ""], ["loss = loss_fn(logits, labels)", true, ""], ["loss.backward()", true, "Compute gradients."], ["optimizer.step()", true, "Update weights."], ["model.eval() before every batch", false, "eval() is for inference."]], "zero-grad, forward, loss, backward, step.", { cov: ["cnn-arch"], src: L(52) });
A.blank("c-arch-4", "Medium", "Custom CNN: after the second MaxPool the tensor is 32×3×3. Flatten gives a vector of length ______.", "288", [], "32 × 3 × 3.", { cov: ["cnn-arch"], calc: true, src: L(53) });
A.tf("c-arch-5", "Medium", "In a trained CNN, deeper layers have smaller receptive fields and detect simpler patterns such as edges.", false, "Deeper layers have LARGER receptive fields and combine simple features into complex ones.", "Edges → parts → objects.", { cov: ["cnn-arch", "cnn-rf"], src: L(48) });
A.match("c-classic-1", "Medium", "Match each classic CNN to its design idea.", [["AlexNet (2012)", "large early kernels + ReLU + dropout; GPU training breakthrough"], ["VGG11 (2014)", "repeated 3×3 convs in regular blocks"], ["ResNet18 (2015)", "3×3 conv blocks + skip (identity) connections"]], ["attention over image patches"], "Same recipe, different block design.", { cov: ["cnn-classic"], src: L(54) });
A.mcq("c-classic-2", "Medium", "In a ResNet block y = ReLU(F(x) + x), what happens if F(x) = 0?", "The block preserves its input x, giving gradients a direct route", [["The output is always 0", "x is added back."], ["The block doubles x", "F(x) = 0 adds nothing."], ["Training stops", "No."]], "Skip connections ease very deep training.", { cov: ["cnn-classic"], src: L(55) });
A.multi("c-classic-3", "Medium", "Which are steps in Lecture 7's fine-tuning recipe?", [["Load pretrained weights", true, "General edges and textures."], ["Replace the classifier to match your classes", true, ""], ["Train with a small learning rate", true, ""], ["Unfreeze selected layers carefully", true, ""], ["Delete all convolutional layers", false, "Reuse them."]], "Pretraining is a starting point, not a guarantee.", { cov: ["cnn-classic"], src: L(56) });
A.blank("c-rf-1", "Hard", "(Extra) Two stacked 3×3 convolutions with stride 1 give each output unit a receptive field of ______×______ input pixels (one number).", "5", [], "1 + 2 + 2 = 5.", { cov: ["cnn-rf"], calc: true, src: "Extra (RF formula), Lecture 7 slide 48 concept" });
A.tf("c-rf-2", "Medium", "Lecture 7's top-activating patches show early channels with receptive field 7×7 selecting local geometry, while middle channels (RF 99×99) combine parts like eye + face.", true, "Optional slide 47.", "Receptive field grows with depth.", { cov: ["cnn-rf"], src: L(47), trap: false });
A.mcq("c-rf-3", "Medium", "Which change INCREASES the receptive field of later layers the most?", "Adding a stride-2 layer early in the network", [["Reducing the number of filters", "Channels don't change RF."], ["Adding a 1×1 convolution", "1×1 adds 0 to RF."], ["Using padding", "Padding keeps size, not RF growth."]], "Strides multiply the growth of all later layers (Extra).", { cov: ["cnn-rf"] });

export const questions = A.out;
