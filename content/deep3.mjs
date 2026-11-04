// Deeper explanations, KaTeX formulas and slide links: cnn, detect, seq, attn, genai.
const R = String.raw;
export const deep = {
  "cnn-basics": {
    slides: ["L7/7", "L7/9", "L7/10", "L7/11", "L7/12"],
    explain: [
      "A computer sees an image as a grid of numbers: brightness 0–255 for grayscale, or three grids (red, green, blue) for colour. In PyTorch a batch of images has shape [batch, channels, height, width].",
      "Different tasks ask different questions: classification (what is in the image?), detection (what, and where, as boxes?), segmentation (what is each pixel?).",
    ],
    tex: [{ t: R`\text{image tensor} \in \mathbb R^{C \times H \times W}, \quad \text{grayscale } C = 1,\; \text{RGB } C = 3`, where: [] }],
  },
  "cnn-why": {
    slides: ["L7/15", "L7/16", "L7/17", "L7/19", "L7/23", "L7/25"],
    explain: [
      "Hand-written rules ('ears at an angle < 35°') break under new viewpoints, lighting, sizes or occlusion.",
      "A fully connected layer flattens the image into a long list, forgetting which pixels were neighbours, and needs a weight for every pixel-unit pair: 224×224×3 inputs × 1,000 units = 150 million weights.",
      "Convolution fixes both: each unit looks only at a small patch (locality), the same small filter is reused everywhere (weight sharing), and stacked layers build edges → parts → objects (hierarchy).",
    ],
    tex: [{ t: R`224 \times 224 \times 3 = 150{,}528 \text{ inputs};\; 150{,}528 \times 1000 = 150{,}528{,}000 \text{ weights}`, where: [] }],
  },
  "cnn-conv": {
    slides: ["L7/22", "L7/26", "L7/28", "L7/32", "L7/36", "L7/37"],
    explain: [
      "A filter (kernel) is a small grid of weights, e.g. 3×3. Place it on the top-left patch of the image, multiply matching numbers, and add them up: that's one output value. Slide it one step (the stride) and repeat.",
      "A big positive output means the patch looks like the filter's pattern (e.g. a diagonal stroke); negative means the opposite.",
      "Padding adds a border of zeros so the filter can sit on the edges; it keeps the output larger.",
    ],
    tex: [
      { t: R`z[p,q] = \sum_{i}\sum_{j} w_{ij}\, x[p+i,\, q+j] + b`, where: [[R`w_{ij}`, "kernel weights"], [R`b`, "bias (one per filter)"]] },
      { t: R`N_{\text{out}} = \left\lfloor \frac{N_{\text{in}} + 2P - K}{S} \right\rfloor + 1`, where: [[R`N_{\text{in}}`, "input width"], [R`P`, "padding"], [R`K`, "kernel size"], [R`S`, "stride"]] },
    ],
  },
  "cnn-params": {
    slides: ["L7/39", "L7/40", "KPCONV/1"],
    explain: [
      "A filter is as deep as its input: on an RGB image a 3×3 filter is really 3×3×3 = 27 weights.",
      "Each filter produces one output feature map, so the number of filters = the number of output channels.",
      "Parameters = (weights per filter + 1 bias) × number of filters. The image size doesn't matter because the same filter is reused at every position.",
    ],
    tex: [{ t: R`\#\text{params} = (K_h \cdot K_w \cdot C_{\text{in}} + 1)\cdot C_{\text{out}}`, where: [[R`C_{\text{in}}`, "input channels"], [R`C_{\text{out}}`, "number of filters"]] }, { t: R`(3\cdot3\cdot3 + 1)\cdot 2 = 56`, where: [] }],
  },
  "cnn-pool": {
    slides: ["L7/41", "L7/42", "L7/45"],
    explain: [
      "ReLU sets negative responses to 0, keeping only positive evidence and adding non-linearity.",
      "Max pooling slides a window (usually 2×2, stride 2) and keeps only the largest value, halving the height and width. It has no weights to learn and keeps the number of channels.",
    ],
    tex: [{ t: R`\text{ReLU}(z) = \max(0, z), \qquad \text{LeakyReLU}(z) = \max(\alpha z, z),\; \alpha = 0.1`, where: [] }, { t: R`\max(230, 135, 231, 146) = 231`, where: [] }],
  },
  "cnn-arch": {
    slides: ["L7/46", "L7/48", "L7/49", "L7/51", "L7/53", "L7/54", "L7/55", "L7/56"],
    explain: [
      "A CNN classifier stacks blocks of conv → ReLU → pool (spatial size shrinks, channels grow), then flattens and uses a fully connected head to output class scores (logits).",
      "Training repeats 5 steps per batch: zero the gradients, forward pass, compute the loss, backward pass, optimiser step.",
      "ResNet adds skip connections: each block learns a correction F(x) and adds back x, so very deep networks still train.",
    ],
    tex: [{ t: R`y = \text{ReLU}\big(F(x) + x\big)`, where: [] }, { t: R`1{\times}28{\times}28 \to 16{\times}14{\times}14 \to 16{\times}7{\times}7 \to 32{\times}7{\times}7 \to 32{\times}3{\times}3 \to 288 \to 10`, where: [] }],
  },
  "detect-task": {
    slides: ["L7/58", "L7/59", "L7/60", "L7/61"],
    explain: [
      "Detection outputs a list of records, one per object: class + bounding box + confidence.",
      "Trying every crop is hopeless (80×80 positions × 3 sizes × 3 shapes = 57,600 crops), and nearby crops repeat work.",
      "YOLO runs the CNN once to get a shared feature map and predicts a box + objectness + class scores at every location in one pass.",
    ],
    tex: [{ t: R`\text{YOLO output} = S \times S \times (5 + C)`, where: [[R`5`, "x, y, w, h, objectness"], [R`C`, "number of classes"]] }],
  },
  "detect-iou": {
    slides: ["L7/62", "KPIOU/1"],
    explain: [
      "IoU measures how much two boxes overlap: the shared area divided by the total area they cover together.",
      "Find the overlap rectangle: its width = (smaller right edge) − (larger left edge), same for height (0 if negative). Union = area A + area B − overlap, so the overlap isn't counted twice.",
    ],
    tex: [{ t: R`\text{IoU} = \frac{I}{A + B - I}, \quad I = \max\!\big(0, \min(x_2^A,x_2^B) - \max(x_1^A,x_1^B)\big)\cdot \max\!\big(0, \min(y_2^A,y_2^B)-\max(y_1^A,y_1^B)\big)`, where: [] }, { t: R`\frac{16}{24 + 24 - 16} = \frac{16}{32} = 0.5`, where: [] }],
  },
  "detect-nms": {
    slides: ["L7/62", "KPIOU/1"],
    explain: [
      "Detectors often fire several boxes on the same object. NMS cleans up: sort boxes by confidence, keep the best, delete every same-class box that overlaps it too much (IoU above the threshold), then repeat with the next best remaining box.",
      "Read the rule carefully: 'strictly greater than 0.5' means a box with IoU exactly 0.5 survives.",
    ],
    tex: [],
  },
  "detect-seg": {
    slides: ["L7/63", "L7/12"],
    explain: ["Semantic segmentation labels every pixel. An encoder shrinks the image into features; a decoder grows them back to full size with C scores per pixel; argmax picks each pixel's class."],
    tex: [{ t: R`[N, C, H, W] \xrightarrow{\arg\max_C} [N, H, W]`, where: [] }],
  },
  "seq-intro": {
    slides: ["L8/3", "L8/7", "L8/14", "L8/18"],
    explain: [
      "Order matters in sequences: one video frame shows where a ball is, several frames show where it's going. 'Mando protects Grogu' ≠ 'Grogu protects Mando'.",
      "A sequence model must keep order, carry context forward, reuse the same parameters at every step, and handle any length.",
      "Shapes of tasks: many-to-one (review → sentiment), one-to-many (image → caption), many-to-many (sentence → translation).",
    ],
    tex: [{ t: R`h_t = f(x_t, h_{t-1}), \qquad \hat y_t = g(h_t)`, where: [] }],
  },
  "seq-rnn": {
    slides: ["L8/20", "L8/25", "L8/28", "L8/29", "KPRNN/1"],
    explain: [
      "An RNN keeps a hidden state h (its memory). At each step it combines the new input x with the old memory h, then squashes the result with tanh to get the new memory.",
      "Calculation recipe: input × input weight, plus previous state × recurrent weight (plus bias if given), then apply tanh (use the supplied lookup value). The sum before tanh is NOT the answer.",
      "The same weights are used at every time step; unrolling just copies the computation.",
    ],
    tex: [{ t: R`h_t = \tanh\big(W_{hh}^{\top} h_{t-1} + W_{xh}^{\top} x_t\big), \qquad \hat y_t = W_{hy}^{\top} h_t`, where: [] }, { t: R`0.5\times 2 + 0.25 \times 0.4 = 1.1 \;\Rightarrow\; h_t = \tanh(1.1) = 0.800`, where: [] }],
  },
  "seq-gradients": {
    slides: ["L8/33", "L8/35", "L8/39", "L8/41", "L8/43", "L8/44"],
    explain: [
      "Training an RNN = backpropagation through the unrolled chain (BPTT): add up the losses over all time steps, backprop once, update the shared weights.",
      "The gradient reaching early steps is a long product of factors. Factors below 1 shrink it to nothing (vanishing, 0.8³⁰ ≈ 0.001); factors above 1 blow it up (exploding).",
      "Fixes: gradient clipping (exploding); better activations, initialisation, or gated cells such as LSTM/GRU (vanishing). A gate is a number in [0, 1] multiplied element-wise with the candidate state.",
    ],
    tex: [{ t: R`\frac{\partial L_t}{\partial h_1} = \frac{\partial L_t}{\partial h_t}\prod_{k=2}^{t}\frac{\partial h_k}{\partial h_{k-1}} = \frac{\partial L_t}{\partial h_t}\, D_t W_{hh} D_{t-1} W_{hh}\cdots D_2 W_{hh}`, where: [] }, { t: R`h_t = g_t \odot \tilde h_t`, where: [] }],
  },
  "seq-nb": {
    slides: ["L8/48", "L8/49", "L8/50", "L8/51", "L8/52"],
    explain: [
      "Naive Bayes scores each class by: prior × likelihood of each word given the class. 'Naive' = it pretends the words are independent given the class.",
      "Likelihoods come from counts. Add-one smoothing adds 1 to every count (and |V| to the total) so an unseen word never makes the whole product 0.",
      "Compare the two scores: the bigger wins. Normalise (divide by their sum) only if you need actual probabilities.",
    ],
    tex: [{ t: R`P(c \mid \text{text}) \propto P(c)\prod_i P(x_i \mid c)`, where: [] }, { t: R`P_s(w \mid c) = \frac{\text{count}(w, c) + 1}{T_c + |V|}`, where: [[R`T_c`, "total word occurrences in class c"], [R`|V|`, "vocabulary size"]] }, { t: R`S_+ = 0.55\times0.27\times0.23\times0.12\times0.08 = 0.000328`, where: [] }],
  },
  "seq-ngram": {
    slides: ["L8/48", "L8/53", "L8/54", "L8/55", "L8/56", "L8/60"],
    explain: [
      "Text must become numbers: tokenise, give each token an ID, then use a one-hot vector or a learned embedding.",
      "An n-gram model predicts the next word by counting what followed the previous n − 1 words in the training text. It can't see further back and doesn't know that similar words are similar.",
      "Word2Vec learns embeddings by predicting words from their neighbours (CBOW: context → centre; skip-gram: centre → context). Similar words get nearby vectors, and offsets capture relations (Paris − France + Italy ≈ Rome).",
    ],
    tex: [{ t: R`P(w \mid h) = \frac{C(h, w)}{C(h)}, \qquad P(\text{Grogu} \mid \text{Mando protects}) = \frac{3}{5}`, where: [] }, { t: R`s = W_{\text{out}}\, h,\quad p = \text{softmax}(s),\quad L = -\log p_{\text{target}}`, where: [] }],
  },
  "attn-intro": {
    slides: ["L8/62", "L8/64", "L8/65", "L8/66", "L8/67", "L8/69", "L8/70"],
    explain: [
      "Attention works like an online search. Your <b>query</b> is what you are looking for; every item has a <b>key</b> (its title, used for matching) and a <b>value</b> (the full content you get back).",
      "Compare the query with every key to get relevance scores, turn the scores into weights that sum to 1, and return a weighted blend of the values.",
      "In self-attention every token does this over the same sentence, so each word can pull in context from any other word directly, with no long recurrent chain.",
    ],
    tex: [],
  },
  "attn-calc": {
    slides: ["L8/74", "L8/76", "L8/77", "KPATT/1"],
    explain: [
      "Step 1: score = dot product of the query with each key (bigger = more aligned), divided by √d_k to keep the numbers moderate.",
      "Step 2: softmax: exponentiate each score and divide by the total, so weights are positive and sum to 1.",
      "Step 3: output = Σ weight × value, computed component by component.",
    ],
    tex: [
      { t: R`\text{score}_i = \frac{\mathbf q\cdot \mathbf k_i}{\sqrt{d_k}}, \qquad w_i = \frac{e^{\text{score}_i}}{\sum_j e^{\text{score}_j}}, \qquad \mathbf z = \sum_i w_i\, \mathbf v_i`, where: [] },
      { t: R`[0.3, 0.7] \text{ with } [2,0],[0,2] \Rightarrow [0.3\cdot2 + 0.7\cdot 0,\; 0.3\cdot 0 + 0.7\cdot 2] = [0.6, 1.4]`, where: [] },
    ],
  },
  "attn-matrix": {
    slides: ["L8/72", "L8/73", "L8/75", "L8/76", "L8/77", "L8/78", "L8/79"],
    explain: [
      "Do it for all tokens at once: project the (position-aware) inputs X into Q, K, V with three weight matrices; multiply Q by Kᵀ to get every query-key score; softmax each row; multiply by V.",
      "Positional encodings are added to the embeddings so the model knows word order. Multi-head attention runs several heads in parallel, each learning different relationships, then concatenates them.",
    ],
    tex: [
      { t: R`Q = XW_Q,\; K = XW_K,\; V = XW_V, \qquad \text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V`, where: [] },
      { t: R`PE(pos, 2i) = \sin\!\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right), \quad PE(pos, 2i+1) = \cos\!\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)`, where: [] },
      { t: R`\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1,\dots,\text{head}_h)\,W^O`, where: [] },
    ],
  },
  "genai-intro": {
    slides: ["L9/2", "L9/3", "L9/4", "L9/8", "L9/9", "L9/10"],
    explain: [
      "A generative model learns what the data looks like overall (its distribution), so it can produce new examples that look real, or tell when something looks unusual.",
      "Much of what you see is explained by a few hidden factors (latent variables z): pose, lighting, identity. Generators learn to turn z into data x.",
    ],
    tex: [{ t: R`\text{training data} \sim P_{\text{data}}(x), \quad \text{learn } P_{\text{model}}(x) \approx P_{\text{data}}(x)`, where: [] }],
  },
  "genai-ae": {
    slides: ["L9/14", "L9/15", "L9/16", "L9/21", "L9/25", "L9/27", "L9/30", "L9/34", "L9/36"],
    explain: [
      "An autoencoder squeezes the input through a small bottleneck z (encoder) and tries to rebuild it (decoder). No labels needed: the input is its own target.",
      "A VAE makes the encoder output a mean μ and spread σ instead of a single point, samples z from them, and adds a KL penalty that pulls these distributions toward a standard normal. That keeps the latent space smooth, so random samples decode into sensible new data.",
      "Reparameterisation trick: write z = μ + σ·ε with random ε, so gradients can flow through μ and σ.",
    ],
    tex: [
      { t: R`\mathcal L(x, \hat x) = \lVert x - \hat x\rVert^2`, where: [] },
      { t: R`\mathcal L(\phi,\theta,x) = \text{reconstruction} + D_{KL}\big(q_\phi(z \mid x)\,\Vert\, p(z)\big), \quad D_{KL} = \tfrac12\sum_j\big(\mu_j^2 + \sigma_j^2 - 1 - \log\sigma_j^2\big)`, where: [] },
      { t: R`z = \mu + \sigma\odot\varepsilon,\quad \varepsilon\sim\mathcal N(0, I)`, where: [] },
    ],
  },
  "genai-gan": {
    slides: ["L9/40", "L9/42", "L9/43", "L9/44", "L9/45", "L9/46", "L9/50"],
    explain: [
      "A GAN is a contest between a forger and a detective. The generator G turns random noise into fake samples; the discriminator D tries to tell real from fake.",
      "D is trained to output ≈1 on real data and ≈0 on fakes; G is trained to make D call its fakes real. When G becomes perfect, D can only guess: D(x) ≈ 0.5.",
      "Mode collapse: G finds one kind of sample that fools D and keeps producing only that, missing the variety in the real data.",
    ],
    tex: [{ t: R`\min_G \max_D\; \mathbb E_{x\sim p_{\text{data}}}\big[\log D(x)\big] + \mathbb E_{z\sim p(z)}\big[\log\big(1 - D(G(z))\big)\big]`, where: [] }],
  },
  "genai-ar-diff": {
    slides: ["L9/58", "L9/59", "L9/60", "L9/64", "L9/65", "L9/66", "L9/68", "L9/70"],
    explain: [
      "Autoregressive models write one piece at a time: predict a distribution for the next token, sample it, append it, repeat (this is how GPT writes).",
      "Diffusion models learn to remove noise. Training: add a random amount of noise to a real image and teach a network to predict that noise. Generation: start from pure noise and repeatedly remove a little predicted noise until an image appears.",
    ],
    tex: [
      { t: R`p(x_1,\dots,x_n) = \prod_i p(x_i \mid x_1,\dots,x_{i-1}), \qquad \hat x_i = \sigma\Big(b_i + \sum_{j<i} w_{ij}x_j\Big)`, where: [] },
      { t: R`x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\epsilon, \qquad \mathcal L_{\text{MSE}} = \lVert \hat\epsilon - \epsilon\rVert^2`, where: [] },
    ],
  },
};
