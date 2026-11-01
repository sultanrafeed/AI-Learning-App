import { makeAuthor } from "./helpers.mjs";
import { table } from "../js/gen-core.js";
const A = makeAuthor("nn", "Workshop 5 (Neural network models)");
const W = (p) => `Workshop 5, slide ${p}`;
export const coverage = [
  { id: "nn-structure", text: "Biological inspiration; McCulloch-Pitts unit (1943); layers (input, hidden, output), weights wᵢⱼ, inⱼ = Σwᵢⱼaᵢ, outⱼ = g(inⱼ); FFN vs RNN topologies; parameter counts", src: W("4-10") },
  { id: "nn-activation", text: "Activation functions: ReLU, sigmoid, tanh, softplus, step; why different activations (non-linearity, gradient flow, layer purpose); leaky ReLU; tanh = 2/(1 + e^(−2x)) − 1", src: W("8-9") + "; Python warm-up 2" },
  { id: "nn-perceptron", text: "Perceptron: weighted sum + bias w₀ (shifts curve), hard threshold, binary classification; perceptron learning rule wᵢ ← wᵢ + α(y − h)xᵢ", src: W("12-17") },
  { id: "nn-gd", text: "Sigmoid unit gradient descent wᵢ ← wᵢ + α(y − h)h(1 − h)xᵢ; squared-error loss; chain rule; optimiser (SGD, Adam)", src: W("17-18, 26-27, 35") },
  { id: "nn-backprop", text: "MLP, universal approximation theorem, forward/backward phases, perceived error Δ, Δᵢ = g′(inᵢ)wᵢⱼΔⱼ, gradient aᵢΔⱼ, vanishing gradient; keras workflow", src: W("20-34") },
  { id: "nn-lstm", text: "RNN in Workshop 5 (Markov assumption zₜ = f_w(zₜ₋₁, xₜ), BPTT, w_zz < 1 vanishing / > 1 exploding); LSTM memory cell, forget/input/output gates, update equations", src: W("37-45") },
];
export const formulas = [
  { name: "Unit", f: "inⱼ = Σᵢ wᵢⱼ aᵢ ; aⱼ = g(inⱼ)", note: "bias = weight w₀ⱼ on constant input 1" },
  { name: "Perceptron rule", f: "wᵢ ← wᵢ + α(y − h_w(x))·xᵢ", note: "hard threshold" },
  { name: "Sigmoid GD rule", f: "wᵢ ← wᵢ + α(y − h)·h(1 − h)·xᵢ", note: "σ′ = σ(1 − σ)" },
  { name: "Output perceived error", f: "Δ₅ = 2(ŷ − y)·g′(in₅)", note: "squared loss" },
  { name: "Hidden perceived error", f: "Δᵢ = g′(inᵢ)·wᵢⱼ·Δⱼ", note: "backpropagated" },
  { name: "Weight gradient", f: "∂L/∂wᵢⱼ = aᵢ·Δⱼ ; wᵢⱼ ← wᵢⱼ − α·aᵢ·Δⱼ", note: "" },
  { name: "LSTM cell", f: "cₜ = cₜ₋₁ ⊙ fₜ + iₜ ⊙ tanh(W_xc xₜ + W_zc zₜ₋₁); zₜ = tanh(cₜ) ⊙ oₜ", note: "f, i, o = σ(…)" },
];
export const glossary = [
  { term: "Perceptron", def: "Single neuron with weighted inputs, bias and threshold; binary classifier." }, { term: "Bias", def: "Constant-input weight w₀ that shifts the activation curve left/right." },
  { term: "Activation function", def: "Non-linear function g applied to a unit's weighted sum." }, { term: "MLP", def: "Multilayer perceptron: input layer, ≥1 hidden layers, output layer." },
  { term: "Universal approximation theorem", def: "Two layers (non-linear then linear) can approximate any continuous function." }, { term: "Backpropagation", def: "Passing error signals backward to compute gradients for every weight." },
  { term: "Perceived error Δ", def: "Error signal at a unit's input used to compute its incoming weights' gradients." }, { term: "Optimiser", def: "Algorithm minimising the loss, e.g. SGD or Adam." },
  { term: "Forget gate", def: "LSTM gate deciding which memory cell elements to keep or reset." }, { term: "Input gate", def: "LSTM gate deciding which new information is added to the cell." },
  { term: "Output gate", def: "LSTM gate deciding how much of the cell is exposed as the short-term memory zₜ." }, { term: "Softplus", def: "log(1 + eˣ), a smooth version of ReLU." },
];
export const learn = [
  { id: "nn-structure", title: "Neurons and networks", cov: ["nn-structure", "nn-activation"], src: W("4-10"),
    hook: "A neuron fires when a weighted combination of its inputs passes a threshold.",
    visual: table(["Activation", "Formula", "Range / use"], [["Step", "1 if x ≥ 0 else 0", "{0, 1}, perceptron"], ["Sigmoid", "1/(1 + e^(−z))", "(0, 1), probability output"], ["Tanh", "(e^{2x} − 1)/(e^{2x} + 1)", "(−1, 1), centred"], ["ReLU", "max(0, x)", "[0, ∞), efficient hidden layers"], ["Softplus", "log(1 + eˣ)", "smooth ReLU"]]),
    formula: [["inⱼ = Σ wᵢⱼaᵢ", "weighted sum"], ["outⱼ = g(inⱼ)", "activation"], ["Dense params", "(inputs + 1) × units"]],
    example: ["Inputs (1, 2), weights (0.5, −1), bias 0.5: in = 0.5 + 0.5 − 2 = −1 → ReLU 0, sigmoid 0.269."],
    memory: "Weigh, sum, squash.", trap: "There is no single best activation: choose by problem, layer type and training behaviour.", check: "nn-c-struct-1" },
  { id: "nn-perceptron", title: "Perceptron and its learning rule", cov: ["nn-perceptron"], src: W("12-17"),
    hook: "Nudge the weights toward the right answer only when the perceptron is wrong.",
    visual: table(["Case", "y − h", "Weight change"], [["Correct", "0", "none"], ["Missed a positive (y=1, h=0)", "+1", "w += αx"], ["False positive (y=0, h=1)", "−1", "w −= αx"]]),
    formula: [["ws = Σ xⱼwⱼ (x₀ = 1)", "includes bias w₀"], ["h = 1 if ws ≥ 0 else 0", "hard threshold"], ["wᵢ ← wᵢ + α(y − h)xᵢ", "perceptron rule"]],
    example: ["w = (w₀, w₁, w₂) = (−1, 1, 1), x = (1, 0): ws = 0 → h = 1. If y = 0, α = 0.5: w₀ → −1.5, w₁ → 0.5, w₂ stays 1."],
    memory: "Wrong → move toward the example (or away).", trap: "The bias input x₀ = 1 also gets updated.", check: "nn-c-perc-1" },
  { id: "nn-backprop", title: "Gradient descent and backpropagation", cov: ["nn-gd", "nn-backprop"], src: W("17-35"),
    hook: "Errors flow backward, layer by layer, to tell every weight how to change.",
    visual: table(["Quantity", "Formula"], [["Output error", "Δ₅ = 2(ŷ − y)g′(in₅)"], ["Hidden error", "Δ₃ = Δ₅ w₃,₅ g′(in₃)"], ["Gradient", "∂L/∂w₃,₅ = a₃Δ₅; ∂L/∂w₁,₃ = x₁Δ₃"], ["Update", "w ← w − α·aᵢΔⱼ"]]),
    formula: [["Sigmoid", "g′(z) = g(z)(1 − g(z))"], ["Forward", "h_w(x) = g⁽²⁾(W⁽²⁾ g⁽¹⁾(W⁽¹⁾x))"], ["Universal approximation", "non-linear layer + linear layer ≈ any continuous function"]],
    example: ["ŷ = 0.8, y = 1: Δ₅ = 2(−0.2)(0.8)(0.2) = −0.064; with a₃ = 0.5 → ∂L/∂w₃,₅ = −0.032."],
    memory: "Gradient = what comes in × error going out.", trap: "Vanishing gradient: error signals are extinguished as they propagate back through many sigmoid layers.", check: "nn-c-bp-1" },
  { id: "nn-lstm", title: "RNNs and LSTMs (Workshop 5)", cov: ["nn-lstm"], src: W("37-45"),
    hook: "An LSTM adds a protected memory lane so information survives many steps.",
    visual: table(["Gate", "Decides"], [["Forget fₜ", "keep (≈1) or reset (≈0) each memory element"], ["Input iₜ", "which new information to ADD"], ["Output oₜ", "how much memory to expose as zₜ"]]),
    formula: [["zₜ = f_w(zₜ₋₁, xₜ)", "Markov assumption on the hidden state"], ["cₜ = cₜ₋₁ ⊙ fₜ + iₜ ⊙ tanh(…)", "additive update"], ["zₜ = tanh(cₜ) ⊙ oₜ", "short-term memory"], ["w_zz < 1 / > 1", "vanishing / exploding"]],
    example: ["'I grew up in Sydney … therefore I speak English': a plain RNN may forget 'Sydney'; an LSTM can keep it."],
    memory: "Forget, Input, Output: F-I-O, like a fridge (throw out, put in, take out).", trap: "LSTM gradients don't vanish as fast because new information is ADDED, not repeatedly multiplied.", check: "nn-c-lstm-1" },
];
export const cheat = { title: "Neural networks cheat sheet",
  rows: [["Unit", "a = g(Σwx + w₀)", "", ""], ["Perceptron rule", "w += α(y − h)x", "only when wrong", ""], ["Sigmoid GD", "w += α(y − h)h(1 − h)x", "", ""], ["Backprop", "Δᵢ = g′(inᵢ)wᵢⱼΔⱼ", "grad = aᵢΔⱼ", ""], ["Dense params", "(in + 1)·out", "", ""], ["LSTM", "c = c·f + i·c̃", "z = tanh(c)·o", ""]],
  traps: ["Bias is a weight on input 1.", "Step: 1 when ws ≥ 0.", "σ′ ≤ 0.25 → vanishing gradients.", "w_zz > 1 → exploding.", "Choose activation by layer purpose."] };

A.mcq("c-struct-1", "Easy", "Each unit j first computes inⱼ = Σ wᵢⱼaᵢ. What does it do next?", "Applies an activation function g to get outⱼ = g(inⱼ)", [["Normalises by the number of inputs", "Not part of the unit."], ["Sends inⱼ unchanged to the next layer", "Activation is applied."], ["Multiplies by the learning rate", "Only in training updates."]], "Weighted sum, then activation.", { cov: ["nn-structure"], src: W(7) });
A.match("c-struct-2", "Medium", "Match each activation to its typical use (Workshop 5).", [["ReLU", "efficient hidden layers"], ["Sigmoid", "probability-style output"], ["Tanh", "centred output scale"], ["Softplus", "smooth ReLU alternative"]], ["counting parameters"], "Choose by layer purpose.", { cov: ["nn-activation"], src: W(9) });
A.tf("c-struct-3", "Easy", "The universal approximation theorem says a network with one non-linear layer followed by a linear layer can approximate any continuous function to arbitrary accuracy.", true, "Workshop 5 slide 22.", "Width, not depth, in the theorem.", { cov: ["nn-backprop"], src: W(22), trap: false });
A.blank("c-struct-4", "Medium", "A dense layer with 4 inputs and 3 units (each with a bias) has ______ parameters.", "15", [], "(4 + 1) × 3.", { cov: ["nn-structure"], calc: true });
A.multi("c-struct-5", "Medium", "Why do we need (different) activation functions?", [["To add non-linearity so networks can learn complex patterns", true, ""], ["To shape responses to negative, small or large inputs", true, ""], ["To improve learning speed, gradient flow and stability", true, ""], ["To match the layer's purpose (hidden vs output)", true, ""], ["To reduce the number of weights", false, "Activations add no weights."]], "Workshop 5 slide 9.", { cov: ["nn-activation"], src: W(9) });
A.mcq("c-struct-6", "Medium", "Which equals tanh(x) (Python warm-up 2)?", "2/(1 + e^(−2x)) − 1", [["1/(1 + e^(−x))", "That's sigmoid."], ["max(0, x)", "ReLU."], ["log(1 + eˣ)", "Softplus."]], "tanh = 2σ(2x) − 1.", { cov: ["nn-activation"], src: "Python additional warm-up 2" });
A.tf("c-struct-7", "Easy", "A McCulloch-Pitts style unit fires when a linear combination of its inputs exceeds a (hard or soft) threshold.", true, "Workshop 5 slide 6.", "Neuron model (1943).", { cov: ["nn-structure"], src: W(6), trap: false });
A.mcq("c-perc-1", "Medium", "What does the bias w₀ do in a perceptron?", "Shifts the activation function curve left or right", [["Scales the inputs to [0, 1]", "That's normalisation."], ["Sets the learning rate", "Separate hyperparameter."], ["Counts the number of inputs", "No."]], "Positive bias shifts sigmoid left (centre at x = −b).", { cov: ["nn-perceptron"], src: W("12-14") });
A.tf("c-perc-2", "Medium", "If the perceptron already classifies an example correctly, the perceptron learning rule leaves its weights unchanged.", true, "y − h = 0 → no change.", "Learning only from mistakes.", { cov: ["nn-perceptron"], trap: false });
A.blanks("c-perc-3", "Medium", "Perceptron: w₀ = −1, w₁ = 1, w₂ = 1, x = (1, 0), hard threshold (1 if ws ≥ 0). Give ws and the output.", ["ws", "output"], ["0", "1"], null, "−1 + 1 + 0 = 0 → ws ≥ 0 → 1.", { cov: ["nn-perceptron"], calc: true });
A.mcq("c-perc-4", "Hard", "Perceptron with w = (w₀, w₁, w₂) = (−1, 1, 1), x = (1, 0), y = 0, α = 0.5. After one update?", "(−1.5, 0.5, 1)", [["(−0.5, 1.5, 1)", "Wrong sign: y − h = −1."], ["(−1, 1, 1)", "It misclassified, so weights change."], ["(−1.5, 0.5, 0.5)", "x₂ = 0, so w₂ doesn't change."]], "h = 1, error −1: w ← w − 0.5·(1, 1, 0).", { cov: ["nn-perceptron"], calc: true });
A.match("c-perc-5", "Medium", "Match the learning rule to its activation (Workshop 5 slide 17).", [["Hard threshold", "wᵢ ← wᵢ + α(y − h)xᵢ"], ["Sigmoid", "wᵢ ← wᵢ + α(y − h)h(1 − h)xᵢ"]], ["wᵢ ← wᵢ − αxᵢ always"], "Sigmoid adds the derivative h(1 − h).", { cov: ["nn-perceptron", "nn-gd"], src: W(17) });
A.mcq("c-gd-1", "Medium", "What is the derivative of the sigmoid σ(z)?", "σ(z)(1 − σ(z))", [["σ(z)²", "Missing (1 − σ)."], ["1 − σ(z)", "Missing σ(z)."], ["e^(−z)", "Not the derivative of σ."]], "Max value 0.25 at z = 0.", { cov: ["nn-gd"], src: W(27) });
A.tf("c-gd-2", "Medium", "Modern neural networks are almost always trained with some variant of stochastic gradient descent, such as Adam.", true, "Workshop 5 slide 35.", "Optimiser chosen at compile time in keras.", { cov: ["nn-gd"], trap: false });
A.blank("c-gd-3", "Hard", "Sigmoid unit, h = 0.5, y = 1, α = 1, x₁ = 2. Rule wᵢ ← wᵢ + α(y − h)h(1 − h)xᵢ: the change in w₁ is ______.", "0.25", ["+0.25"], "0.5 × 0.25 × 2 = 0.25.", { cov: ["nn-gd"], calc: true, tol: 0.001 });
A.mcq("c-bp-1", "Medium", "In backpropagation, the gradient of the loss with respect to weight wᵢ,ⱼ equals…", "aᵢ × Δⱼ (incoming activation × perceived error at unit j)", [["Δᵢ × Δⱼ", "Only one Δ."], ["wᵢ,ⱼ × Δⱼ", "That's used to pass the error back, not the gradient."], ["aⱼ × Δᵢ", "Indices reversed."]], "Workshop 5 slide 32.", { cov: ["nn-backprop"], src: W(32) });
A.multi("c-bp-2", "Medium", "Select ALL correct statements about the learning process of a feedforward NN.", [["Forward phase passes activations from input to output", true, ""], ["Backward phase propagates errors from output to input", true, ""], ["Weights are updated using gradient descent", true, ""], ["The perceived error at a hidden unit uses the errors of the units it feeds", true, "Δᵢ = g′(inᵢ)wᵢⱼΔⱼ."], ["Backpropagation needs no derivatives", false, "It uses the chain rule."]], "Forward then backward.", { cov: ["nn-backprop"], src: W("23-32") });
A.blank("c-bp-3", "Hard", "Output unit: ŷ = 0.8, y = 1, sigmoid. Δ₅ = 2(ŷ − y)ŷ(1 − ŷ) = ______ (3 dp).", "-0.064", ["−0.064"], "2 × (−0.2) × 0.8 × 0.2.", { cov: ["nn-backprop"], calc: true, tol: 0.0006 });
A.tf("c-bp-4", "Medium", "The vanishing gradient problem means error signals grow larger as they are propagated back through the network.", false, "They are EXTINGUISHED (shrink) as they propagate back.", "Growing = exploding.", { cov: ["nn-backprop"], src: W(33) });
A.mcq("c-bp-5", "Medium", "In keras, model.compile(loss='mean_squared_error', optimizer='adam', metrics=['mean_absolute_error']). What is MAE here?", "A metric reported during training, not the loss being minimised", [["The loss being minimised", "MSE is the loss."], ["The optimiser", "Adam is the optimiser."], ["A layer", "No."]], "Loss vs metric.", { cov: ["nn-backprop"], src: W(34) });
A.mcq("c-lstm-1", "Medium", "Which LSTM gate decides whether each element of the memory cell is kept or reset to zero?", "Forget gate", [["Input gate", "Adds new information."], ["Output gate", "Exposes memory to zₜ."], ["Reset gate", "That's a GRU term."]], "f ≈ 1 keep, f ≈ 0 forget.", { cov: ["nn-lstm"], src: W(42) });
A.tf("c-lstm-2", "Medium", "In an LSTM, new information enters the memory cell by multiplication, which is why gradients vanish less.", false, "New information enters by ADDING updates, so gradients don't accumulate multiplicatively.", "Additive cell path = nearly linear gradient flow.", { cov: ["nn-lstm"], src: W(41) });
A.mcq("c-lstm-3", "Hard", "For a simple RNN with recurrent weight w_zz and activation derivatives g′ ≤ 1, which is true?", "If w_zz < 1 gradients vanish; if w_zz > 1 they may explode", [["Gradients never vanish with tanh", "g′ ≤ 1 for tanh."], ["w_zz has no effect on gradients", "Gradients ∝ w_zz^T Π g′."], ["Exploding happens when w_zz < 1", "Reversed."]], "Workshop 5 slide 40.", { cov: ["nn-lstm"], src: W(40) });
A.blanks("c-lstm-4", "Medium", "cₜ₋₁ = 0.5, fₜ = 0.8, iₜ = 0.4, candidate c̃ₜ = 0.5. cₜ = cₜ₋₁·fₜ + iₜ·c̃ₜ = ______.", ["cₜ"], ["0.6"], [["0.6", "0.60"]], "0.4 + 0.2.", { cov: ["nn-lstm"], calc: true, tol: 0.001 });
A.match("c-lstm-5", "Medium", "Match each LSTM gate to its role.", [["Forget gate f", "remember or reset memory elements"], ["Input gate i", "add new information from the input"], ["Output gate o", "transfer memory to the short-term state z"]], ["compute the loss"], "F-I-O.", { cov: ["nn-lstm"], src: W(42) });
A.mcq("c-lstm-6", "Medium", "The RNN Markov assumption in Workshop 5 states that…", "the hidden state zₜ suffices to capture the information from all previous inputs", [["each input is independent of all others", "That's i.i.d."], ["the network forgets everything each step", "No: zₜ carries context."], ["outputs depend only on the first input", "No."]], "zₜ = f_w(zₜ₋₁, xₜ).", { cov: ["nn-lstm"], src: W(37) });

export const questions = A.out;
