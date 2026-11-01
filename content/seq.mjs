import { makeAuthor } from "./helpers.mjs";
import { table } from "../js/gen-core.js";
const A = makeAuthor("seq", "Lecture 8 (Sequence modelling)");
const L = (p) => `Lecture 8, slide ${p}`;
const KP = "Key points about a simple RNN hidden-state update";
export const coverage = [
  { id: "seq-intro", text: "Sequence data (markets, motion, music, DNA, text); requirements: preserve order, carry context, share parameters, variable length; feed-forward has no state", src: L("2-9") },
  { id: "seq-structures", text: "Input-output structures: one-to-one, many-to-one (sentiment), one-to-many (captioning), many-to-many (translation); Poll 1 matching", src: L("14-18") },
  { id: "seq-rnn", text: "RNN: hₜ = f_W(xₜ, hₜ₋₁) = tanh(W_hhᵀhₜ₋₁ + W_xhᵀxₜ), ŷₜ = W_hyᵀhₜ, h₀ = 0, shared weights, folded/unrolled, PyTorch cell; key-points example 0.5×2 + 0.25×0.4 = 1.1 → tanh 0.800", src: L("10-29") + "; " + KP },
  { id: "seq-gradients", text: "BPTT: sum losses, backprop once, update shared params; ∂L/∂h₁ product of D_kW_hh; exploding (clipping) vs vanishing (activation, init, architecture → LSTM/GRU); 0.8³⁰ ≈ 0.001", src: L("31-43") },
  { id: "seq-gating", text: "Gated cells: g = σ(·) ∈ [0,1], hₜ = g ⊙ h̃ₜ ([0.8, 0.5, −0.6] ⊙ [1, 0.1, 0.7] = [0.8, 0.05, −0.42]); LSTM/GRU", src: L(44) },
  { id: "seq-encoding", text: "Language model requirements; tokenisation, indexing, one-hot (|V|), learned embeddings E (onehot × E = row)", src: L("46-48") },
  { id: "seq-nb", text: "Naive Bayes sentiment: P(c|text) ∝ P(c)ΠP(xᵢ|c), add-one smoothing (count + 1)/(T + |V|), S₊ = 0.000328 vs S₋ = 0.000640 → negative; Poll 3", src: L("49-52") },
  { id: "seq-ngram", text: "N-gram (trigram) models P(w|h) = C(h,w)/C(h) (Grogu 3/5); limits: fixed context, no semantic similarity", src: L("53-54") },
  { id: "seq-word2vec", text: "Word2Vec: CBOW (context → centre, average h), skip-gram (centre → context), softmax, L = −log p; embedding analogies Paris − France + Italy ≈ Rome", src: L("55-60") },
];
export const formulas = [
  { name: "RNN update", f: "hₜ = tanh(W_hh hₜ₋₁ + W_xh xₜ (+ b))", note: "ŷₜ = W_hy hₜ" },
  { name: "BPTT gradient", f: "∂Lₜ/∂h₁ = ∂Lₜ/∂hₜ · Π ∂hₖ/∂hₖ₋₁ = … D_kW_hh …", note: "repeated products" },
  { name: "Gate", f: "hₜ = gₜ ⊙ h̃ₜ, gₜ = σ(W_g · + b_g)", note: "element-wise" },
  { name: "Naive Bayes", f: "P(c|text) ∝ P(c) Πᵢ P(xᵢ|c)", note: "normalise with Z = S₊ + S₋" },
  { name: "Add-one smoothing", f: "P(w|c) = (count + 1)/(T_c + |V|)", note: "" },
  { name: "N-gram", f: "P(w|h) = C(h, w)/C(h)", note: "trigram: h = last 2 words" },
  { name: "CBOW / skip-gram", f: "s = W_out h; p = softmax(s); L = −log p_target", note: "" },
];
export const glossary = [
  { term: "Hidden state", def: "The RNN's memory hₜ carrying information from earlier steps." }, { term: "Unrolling", def: "Drawing the RNN as a chain over time; copies computation, not parameters." },
  { term: "BPTT", def: "Backpropagation through time: backprop through the unrolled graph." }, { term: "Vanishing gradient", def: "Gradients shrink exponentially when multiplied by many factors < 1." },
  { term: "Exploding gradient", def: "Gradients grow exponentially with factors > 1; fixed by gradient clipping." }, { term: "LSTM / GRU", def: "Gated recurrent cells that preserve long-term information." },
  { term: "Tokenisation", def: "Splitting raw text into tokens." }, { term: "One-hot vector", def: "Length-|V| vector with a single 1 at the token's index." },
  { term: "Embedding", def: "Learned dense vector for each token; similar words lie close together." }, { term: "Add-one (Laplace) smoothing", def: "Adds 1 to every count so unseen words don't zero the product." },
  { term: "N-gram", def: "Model predicting the next word from the previous n − 1 words by counting." }, { term: "CBOW", def: "Word2Vec variant: context words predict the centre word." },
  { term: "Skip-gram", def: "Word2Vec variant: the centre word predicts each context word." },
];
export const learn = [
  { id: "seq-intro", title: "Why sequences need memory", cov: ["seq-intro", "seq-structures"], src: L("2-18"),
    hook: "One frame tells you where; several frames tell you where it's going.",
    visual: table(["Structure", "Example"], [["one-to-one", "image classification"], ["many-to-one", "sentiment of a review; ECG → diagnosis"], ["one-to-many", "image captioning; seed → music"], ["many-to-many", "translation; speech → text"]]),
    formula: [["Requirements", "preserve order, carry context, share parameters, variable length"], ["Feed-forward", "ŷ = f(x): no state"]],
    example: ["'Mando protects Grogu' vs 'Grogu protects Mando': same words, different meaning."],
    memory: "Sequence = observations + meaningful order.", trap: "Applying the same network to each step independently does NOT pass information between steps.", check: "seq-c-intro-1" },
  { id: "seq-rnn", title: "The RNN hidden-state update", cov: ["seq-rnn"], src: L("20-29") + "; " + KP,
    hook: "New memory = squash(current input + old memory).",
    visual: table(["Quantity", "Key-points example"], [["xₜ, wₓ", "2, 0.5 → 1.0"], ["hₜ₋₁, wₕ", "0.4, 0.25 → 0.1"], ["sum (no bias)", "1.1"], ["tanh(1.1) lookup", "0.800 = hₜ"]]),
    formula: [["hₜ = tanh(W_hhᵀhₜ₋₁ + W_xhᵀxₜ)", ""], ["ŷₜ = W_hyᵀhₜ", ""], ["h₀", "zeros (or learned)"]],
    example: ["Same cell and same W_xh, W_hh, W_hy at every step; only xₜ, hₜ, ŷₜ change."],
    memory: "Input × input-weight, memory × recurrent-weight, add, squash.", trap: "The sum before activation is NOT the new hidden state. Add a bias only if specified.", check: "seq-c-rnn-1" },
  { id: "seq-gradients", title: "Training RNNs: BPTT and vanishing gradients", cov: ["seq-gradients", "seq-gating"], src: L("31-44"),
    hook: "Gradients flowing back through many steps get multiplied again and again.",
    visual: table(["Repeated factor", "Effect", "Fix"], [["> 1", "exploding", "gradient clipping"], ["< 1 (0.8³⁰ ≈ 0.001)", "vanishing → short-term bias", "activation, init, architecture (LSTM/GRU)"]]),
    formula: [["L = L₁ + L₂ + …", "sum losses → backprop once → update shared params"], ["∂hₖ/∂hₖ₋₁ = DₖW_hh", "D = activation derivative"], ["Gate", "hₜ = g ⊙ h̃ₜ"]],
    example: ["Gate [1.0, 0.1, 0.7] ⊙ candidate [0.8, 0.5, −0.6] = [0.8, 0.05, −0.42]."],
    memory: "Small × small × small = nothing left.", trap: "Gradient clipping fixes EXPLODING, not vanishing gradients.", check: "seq-c-grad-1" },
  { id: "seq-nb", title: "Naive Bayes sentiment", cov: ["seq-nb", "seq-encoding"], src: L("48-52"),
    hook: "Multiply the prior by how typical each word is of each class.",
    visual: table(["word", "+ count", "− count", "P(w|+)", "P(w|−)"], [["heartwarming", 6, 2, "7/26 ≈ 0.27", "3/24 ≈ 0.13"], ["delightful", 5, 2, "0.23", "0.13"], ["slow", 2, 6, "0.12", "0.29"], ["repetitive", 1, 6, "0.08", "0.29"]]),
    formula: [["S₊ = P(+)ΠP(xᵢ|+)", "Bayes numerator"], ["Add-one", "(count + 1)/(T + |V|), T₊ = 20, T₋ = 18, |V| = 6"], ["Priors", "11/20 = 0.55, 9/20 = 0.45"]],
    example: ["S₊ = 0.55×0.27×0.23×0.12×0.08 = 0.000328; S₋ = 0.45×0.13×0.13×0.29×0.29 = 0.000640.", "P(+|text) = 0.000328/0.000968 ≈ 0.34 → NEGATIVE."],
    memory: "Naive = pretend words don't affect each other.", trap: "Without smoothing a zero count wipes out the whole product.", check: "seq-c-nb-1" },
  { id: "seq-ngram", title: "N-grams and Word2Vec", cov: ["seq-ngram", "seq-word2vec"], src: L("53-60"),
    hook: "Count what comes next, or learn vectors where similar words live together.",
    visual: table(["Next after 'Mando protects'", "Count", "P"], [["Grogu", 3, "3/5"], ["villagers", 1, "1/5"], ["civilians", 1, "1/5"]]),
    formula: [["P(w|h) = C(h,w)/C(h)", "trigram: h = 2 previous words"], ["CBOW", "h = average of context embeddings; predict centre"], ["Skip-gram", "centre embedding predicts each context word"], ["Loss", "L = −log p_target"]],
    example: ["v(Paris) − v(France) + v(Italy) ≈ v(Rome) (cosine 0.707); v(Uncle) − v(Man) + v(Woman) ≈ v(Aunt) (0.824)."],
    memory: "N-grams memorise; embeddings generalise.", trap: "N-grams have a fixed context and no notion that 'Grogu ≈ foundling'.", check: "seq-c-ngram-1" },
];
export const cheat = { title: "Sequence models cheat sheet",
  rows: [["RNN", "h = tanh(W_hh h + W_xh x)", "0.5×2 + 0.25×0.4 = 1.1 → 0.800", ""], ["BPTT", "sum losses, backprop once", "shared weights", ""], ["Vanishing", "0.8³⁰ ≈ 0.001", "LSTM/GRU", ""], ["Naive Bayes", "P(c)ΠP(w|c)", "add-one smoothing", ""], ["Trigram", "C(h,w)/C(h)", "3/5", ""]],
  traps: ["Sum before tanh ≠ hidden state.", "Clipping fixes exploding only.", "One-hot vectors are equally distant.", "IDs are labels, not magnitudes.", "Compare unnormalised NB scores directly."] };

A.mcq("c-intro-1", "Easy", "Why can't a plain feed-forward network model sequences well?", "It has no state: its output depends only on the current fixed-size input", [["It cannot use non-linear activations", "It can."], ["It has too few parameters", "Not the issue."], ["It requires one-hot inputs", "No."]], "No memory → no context.", { cov: ["seq-intro"], src: L(8) });
A.multi("c-intro-2", "Medium", "Which are requirements for a sequence model (Lecture 8)?", [["Preserve order", true, ""], ["Carry context forward", true, ""], ["Share parameters across time", true, ""], ["Handle variable-length sequences", true, ""], ["Use a separate weight matrix for every time step", false, "Opposite of sharing."]], "Four design criteria.", { cov: ["seq-intro"], src: L(7) });
A.match("c-intro-3", "Medium", "Poll 1: match each task to its sequence structure.", [["ECG signal → diagnosis", "many-to-one"], ["Initial pose → motion sequence", "one-to-many"], ["Speech → text", "many-to-many"], ["Style/seed → music sequence", "one-to-many"], ["Sensor history → failure", "many-to-one"]], ["one-to-one"], "Count inputs and outputs over time.", { cov: ["seq-structures"], src: L(18) });
A.mcq("c-intro-4", "Easy", "Image captioning ('A runner crosses the field') is which structure?", "one-to-many", [["many-to-one", "That's sentiment."], ["many-to-many", "Translation."], ["one-to-one", "Single output."]], "One image in, many words out.", { cov: ["seq-structures"], src: L(16) });
A.tf("c-intro-5", "Medium", "In many-to-many machine translation, the input and output sequences must have the same length.", false, "Lecture 8: lengths may differ ('Mando protects the child' → 'Mando protège l'enfant').", "Seq2seq lengths can differ.", { cov: ["seq-structures"], src: L(17) });
A.mcq("c-rnn-1", "Easy", "Key points: xₜ = 2, wₓ = 0.5, hₜ₋₁ = 0.4, wₕ = 0.25, no bias, tanh(1.1) = 0.800. hₜ = ?", "0.800", [["1.1", "That's the sum before activation."], ["1.0", "Ignored the previous state."], ["0.4", "That's the old state."]], "Sum then squash.", { cov: ["seq-rnn"], calc: true, src: KP });
A.tf("c-rnn-2", "Medium", "Unrolling an RNN creates a new set of weights for every time step.", false, "Unrolling copies the computation, not the parameters: the same cell is reused.", "Shared W_xh, W_hh, W_hy.", { cov: ["seq-rnn"], src: L(13) });
A.blank("c-rnn-3", "Easy", "The initial hidden state h₀ is usually set to ______ (or a learned state).", "zeros", ["zero", "0"], "Lecture 8 slide 11.", { cov: ["seq-rnn"], src: L(11) });
A.match("c-rnn-4", "Medium", "Match the RNN weight matrix to its role (MyRNNCell(3, 4, 2)).", [["W_xh", "maps input xₜ (3) to hidden (4)"], ["W_hh", "maps previous hidden hₜ₋₁ (4) to hidden (4)"], ["W_hy", "maps hidden hₜ (4) to output ŷₜ (2)"]], ["maps output back to input"], "x → h, h → h, h → y.", { cov: ["seq-rnn"], src: L(28) });
A.mcq("c-rnn-5", "Medium", "In the PyTorch RNN loop over 3 time steps, what changes from step to step?", "Only xₜ, hₜ and ŷₜ; the parameters stay fixed", [["The weight matrices", "Same cell object."], ["The hidden size", "Fixed at 4."], ["The activation function", "Always tanh."]], "Parameter sharing.", { cov: ["seq-rnn"], src: L(29) });
A.blank("c-rnn-6", "Medium", "hₜ = tanh(0.3×1 + 0.5×0.2 + 0.1). The value inside tanh is ______.", "0.5", ["0.50"], "0.3 + 0.1 + 0.1.", { cov: ["seq-rnn"], calc: true, tol: 0.001 });
A.mcq("c-grad-1", "Medium", "Poll 2: a dependency crosses 30 steps; each step multiplies the gradient by 0.8. Which diagnosis and response fit?", "≈ 0.001; use an LSTM or GRU", [["≈ 0.8; lower the learning rate", "0.8³⁰ is tiny, not 0.8."], ["≈ 0.24; clip the gradients", "Clipping is for exploding gradients."], ["≈ 24; normalise the inputs", "That's 0.8 × 30, not 0.8³⁰."]], "Repeated products shrink the signal.", { cov: ["seq-gradients"], calc: true, src: L(43) });
A.tf("c-grad-2", "Medium", "Gradient clipping is the standard fix for vanishing gradients.", false, "Clipping scales down EXPLODING gradients. Vanishing → better activation, initialisation or architecture (LSTM/GRU).", "Know which fix goes with which problem.", { cov: ["seq-gradients"], src: L("40-41") });
A.multi("c-grad-3", "Medium", "Select ALL correct statements about BPTT in Lecture 8.", [["Losses over time steps are summed into a total loss", true, "L = L₁ + L₂ + L₃."], ["backward() computes gradients through time", true, ""], ["step() updates the shared parameters", true, ""], ["Each time step's weights are updated separately", false, "Weights are shared."], ["Vanishing gradients bias the model toward short-term dependencies", true, "Slide 42."]], "Sum → backprop once → update.", { cov: ["seq-gradients"], src: L("35-42") });
A.mcq("c-grad-4", "Hard", "Why do long-term gradients vanish in a simple RNN?", "∂L/∂h₁ involves repeated multiplication by W_hh and activation derivatives that are often < 1", [["Because tanh outputs are always 0", "They're in (−1, 1)."], ["Because the loss is summed", "Summing doesn't shrink gradients."], ["Because h₀ = 0", "Initial state isn't the cause."]], "Product of many small factors.", { cov: ["seq-gradients"], src: L("37-39") });
A.blanks("c-gate-1", "Easy", "Gate g = [1.0, 0.1, 0.7], candidate h̃ = [0.8, 0.5, −0.6]. hₜ = g ⊙ h̃ = [___, ___, ___].", ["h₁", "h₂", "h₃"], ["0.8", "0.05", "-0.42"], [["0.8", "0.80"], ["0.05"], ["-0.42", "−0.42"]], "Element-wise products.", { cov: ["seq-gating"], calc: true, src: L(44) });
A.tf("c-gate-2", "Medium", "A gate value comes from a sigmoid, so it lies between 0 and 1 and controls how much of the candidate passes through.", true, "Lecture 8 slide 44.", "Gating idea used in LSTMs and GRUs.", { cov: ["seq-gating"], trap: false });
A.mcq("c-gate-3", "Medium", "What does a gate value near 0 do to that component of the candidate hidden state?", "Blocks it from passing to the next time step", [["Doubles it", "Gates are in [0, 1]."], ["Passes it unchanged", "That's a gate value near 1."], ["Negates it", "No."]], "0 = closed, 1 = open.", { cov: ["seq-gating"] });
A.mcq("c-enc-1", "Easy", "Why can't a neural network take the raw word 'with' as input?", "Neural networks operate on numerical vectors", [["Words are too long", "Length isn't the issue."], ["The vocabulary is unknown", "Even known words must be numbers."], ["Words have no order", "Irrelevant."]], "Tokenise → index → vector.", { cov: ["seq-encoding"], src: L(47) });
A.tf("c-enc-2", "Medium", "Token IDs carry numerical meaning: 'Leia' (ID 5) is 'larger' than 'Jedi' (ID 0).", false, "IDs identify words, not magnitude.", "Use one-hot or embeddings.", { cov: ["seq-encoding"], src: L(48) });
A.mcq("c-enc-3", "Medium", "onehot(droid) × E selects…", "row 2 of the embedding matrix E (droid's ID)", [["column 2 of E", "One-hot row vector × E picks a row."], ["the sum of all rows", "Only one 1 in the one-hot."], ["a random row", "Deterministic lookup."]], "Embedding lookup = one-hot × E.", { cov: ["seq-encoding"], src: L(48) });
A.multi("c-enc-4", "Medium", "Select ALL true statements about one-hot vectors vs learned embeddings.", [["One-hot vectors have length |V|", true, ""], ["All one-hot vectors are equally distant", true, "No similarity."], ["Learned embeddings place similar words near each other", true, ""], ["New words shrink |V|", false, "They expand it."]], "Embeddings capture meaning.", { cov: ["seq-encoding"], src: L(48) });
A.mcq("c-nb-1", "Medium", "Poll 3: 'heartwarming and delightful, but slow'. P(+) = 0.55, P(−) = 0.45; likelihoods (+, −): heartwarming 0.27/0.13, delightful 0.23/0.13, slow 0.12/0.29. Which conclusion is correct?", "Positive: S₊ ≈ 0.00410 > S₋ ≈ 0.00221", [["Negative: slow has the largest negative likelihood", "Must multiply all terms."], ["Tie: two positive words vs one negative", "Counting words isn't Naive Bayes."], ["Cannot decide until the scores are normalised", "Compare unnormalised scores directly."]], "Multiply prior and all matched likelihoods per class.", { cov: ["seq-nb"], calc: true, src: L(52) });
A.blank("c-nb-2", "Easy", "Add-one smoothing: heartwarming appears 6 times in T₊ = 20 positive occurrences, |V| = 6. P_s(heartwarming|+) = 7/______.", "26", [], "(6 + 1)/(20 + 6).", { cov: ["seq-nb"], calc: true, src: L(50) });
A.tf("c-nb-3", "Medium", "Without smoothing, a word never seen in positive reviews makes the whole positive score 0.", true, "Product with P = 0 → 0 ('dull' has 0 positive counts).", "Smoothing prevents zeros.", { cov: ["seq-nb"], src: L(50), trap: false });
A.blanks("c-nb-4", "Hard", "Lecture 8: S₊ = 0.000328 and S₋ = 0.000640. Give P(+|text) (2 dp) and the prediction.", ["P(+|text)", "class"], ["0.34", "negative"], [["0.34", "0.339"], ["negative", "NEGATIVE", "neg", "-"]], "0.000328/0.000968.", { cov: ["seq-nb"], calc: true, tol: 0.006, src: L(51) });
A.blank("c-ngram-1", "Easy", "Trigram corpus: 'Mando protects' is followed by Grogu 3 times, villagers once, civilians once. P(Grogu | 'Mando protects') = ______.", "3/5", ["0.6", "0.60"], "C(h, w)/C(h).", { cov: ["seq-ngram"], calc: true, src: L(53) });
A.multi("c-ngram-2", "Medium", "What are the limits of n-gram models (Lecture 8)?", [["Fixed context: only the last n − 1 words", true, ""], ["No semantic similarity between words", true, "Grogu ≈ foundling unknown."], ["They memorise local patterns rather than learning representations", true, ""], ["They cannot be estimated from counts", false, "Counting is how they work."]], "Fixed context + no meaning.", { cov: ["seq-ngram"], src: L(54) });
A.match("c-w2v-1", "Medium", "Match each Word2Vec variant to its training task.", [["CBOW", "context words predict the centre word"], ["Skip-gram", "the centre word predicts each nearby context word"]], ["the centre word predicts the next sentence"], "Window radius 2 around 'Grogu'.", { cov: ["seq-word2vec"], src: L(55) });
A.mcq("c-w2v-2", "Medium", "In CBOW with window radius 2, the hidden vector h is…", "the average of the four context embeddings", [["the centre word's embedding", "That's skip-gram's input."], ["the sum of all vocabulary embeddings", "Only context rows."], ["a one-hot vector", "Embeddings are dense."]], "h = ¼Σ v_w.", { cov: ["seq-word2vec"], src: L(56) });
A.tf("c-w2v-3", "Easy", "Word2Vec training examples are created by a sliding window, so no manual labels are needed.", true, "Lecture 8 slide 55.", "Self-supervised.", { cov: ["seq-word2vec"], trap: false });
A.blank("c-w2v-4", "Medium", "Vector arithmetic: v('Paris') − v('France') + v('Italy') ≈ v('______').", "Rome", ["rome"], "Analogies via offsets.", { cov: ["seq-word2vec"], src: L(59) });

export const questions = A.out;
