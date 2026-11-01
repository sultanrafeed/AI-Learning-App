import { makeAuthor } from "./helpers.mjs";
import { table } from "../js/gen-core.js";
const A = makeAuthor("genai", "Lecture 9 (Generative AI)");
const L = (p) => `Lecture 9, slide ${p}`;
export const coverage = [
  { id: "genai-intro", text: "Supervised vs unsupervised vs generative modelling; density estimation & sample generation (P_model ≈ P_data); uses: sample generation, outlier detection, debiasing; latent variables (audio mixer, shadow, pose/lighting)", src: L("2-10") + "; Week 9 page" },
  { id: "genai-ae", text: "Autoencoders: encoder x→z, decoder z→x̂, L = ‖x − x̂‖² (no labels), bottleneck/compression (2D vs 5D), denoising AE, applications & limitation", src: L("12-17") },
  { id: "genai-vae", text: "VAEs: μ and σ, sample z, loss = reconstruction + KL regulariser, prior N(0, I), KL = ½Σ(μ² + σ² − 1 − log σ²), continuity & completeness, reparameterisation z = μ + σ⊙ε, β-VAE disentanglement", src: L("19-37") },
  { id: "genai-gan", text: "GANs: generator G (noise → fake) vs discriminator D (real vs fake), training D then G alternately, min-max objective, equilibrium p_G = p_data, D ≈ 0.5, mode collapse, latent interpolation (StyleGAN)", src: L("39-55") },
  { id: "genai-autoregressive", text: "Autoregressive models: predict, sample, append, repeat; xᵢ ~ p(·|x₁…xᵢ₋₁); FVSBN σ(b + Σⱼ<ᵢ wᵢⱼxⱼ); causal masking (parallel training, sequential generation); GPT, PixelCNN, WaveNet, Evo", src: L("57-62") },
  { id: "genai-diffusion", text: "Diffusion: forward noising xₜ = √ᾱₜ x₀ + √(1 − ᾱₜ) ε; train denoiser ε_θ(xₜ, t) with MSE ‖ε̂ − ε‖²; sampling by repeated denoising; text-guided latent diffusion; ControlNet; four ways to generate", src: L("64-70") },
];
export const formulas = [
  { name: "AE loss", f: "L(x, x̂) = ‖x − x̂‖²", note: "no labels" },
  { name: "VAE loss", f: "L = reconstruction loss + D_KL(q_φ(z|x) ‖ p(z))", note: "p(z) = N(0, I)" },
  { name: "KL to N(0,1)", f: "½ Σⱼ (μⱼ² + σⱼ² − 1 − log σⱼ²)", note: "0 when μ = 0, σ = 1" },
  { name: "Reparameterisation", f: "z = μ + σ ⊙ ε, ε ~ N(0, I)", note: "backprop through μ, σ" },
  { name: "β-VAE", f: "−E[log p_θ(x|z)] + β D_KL", note: "β > 1 → disentanglement" },
  { name: "GAN objective", f: "min_G max_D E_x[log D(x)] + E_z[log(1 − D(G(z)))]", note: "" },
  { name: "Autoregressive", f: "p(x₁…xₙ) = Πᵢ p(xᵢ | x₁…xᵢ₋₁)", note: "FVSBN x̂ᵢ = σ(bᵢ + Σⱼ<ᵢ wᵢⱼxⱼ)" },
  { name: "Diffusion forward", f: "xₜ = √ᾱₜ x₀ + √(1 − ᾱₜ) ε", note: "train: ‖ε̂ − ε‖²" },
];
export const glossary = [
  { term: "Generative model", def: "Learns a model P_model(x) of the data distribution to estimate density or generate samples." }, { term: "Latent variable", def: "Hidden factor z that explains observed data x." },
  { term: "Autoencoder", def: "Encoder-decoder trained to reconstruct its input through a low-dimensional bottleneck." }, { term: "Denoising autoencoder", def: "Reconstructs the clean input from a noisy version." },
  { term: "VAE", def: "Probabilistic autoencoder: encoder outputs μ and σ, latent z is sampled, KL regularises toward N(0, I)." }, { term: "KL divergence", def: "Measure of difference between two distributions (here inferred latent vs prior)." },
  { term: "Reparameterisation trick", def: "Write z = μ + σε so gradients can flow through sampling." }, { term: "GAN", def: "Generator and discriminator trained adversarially." },
  { term: "Mode collapse", def: "Generator covers only one region (mode) of the data and misses diversity." }, { term: "Autoregressive model", def: "Generates one element at a time, each conditioned on earlier ones." },
  { term: "Causal masking", def: "Mask hiding future positions so training can be parallel while preserving order." }, { term: "Diffusion model", def: "Learns to reverse a gradual noising process by predicting the noise." },
  { term: "Latent diffusion", def: "Diffusion on a compact latent representation, decoded once at the end; can be text-conditioned." },
];
export const learn = [
  { id: "genai-intro", title: "What generative modelling is", cov: ["genai-intro"], src: L("2-10"),
    hook: "Learn the distribution of the data, then sample new data from it.",
    visual: table(["Learning", "Data", "Goal", "Examples"], [["Supervised", "(x, y)", "x → y", "classification, detection"], ["Unsupervised", "x only", "hidden structure", "clustering, dimensionality reduction"], ["Generative", "samples ~ P_data", "P_model ≈ P_data", "density estimation, sample generation"]]),
    formula: [["Uses", "sample generation, outlier detection (cracks, scratches), debiasing"], ["Latent z", "hidden factors (pose, lighting, scale, identity) that explain x"]],
    example: ["Audio mixer: we hear the final mix x but not the hidden controls (vocals, bass, tempo) = latent z."],
    memory: "x is what you see, z is why.", trap: "Generative ≠ supervised: the goal is the DATA distribution, not a label.", check: "genai-c-intro-1" },
  { id: "genai-ae", title: "Autoencoders and VAEs", cov: ["genai-ae", "genai-vae"], src: L("12-37"),
    hook: "Compress to a small code z, then rebuild: a VAE makes that code a well-behaved distribution.",
    visual: table(["", "Autoencoder", "VAE"], [["Encoder outputs", "a point z", "μ and σ (a distribution)"], ["Loss", "‖x − x̂‖²", "reconstruction + KL to N(0, I)"], ["Sampling new data", "poor", "good (continuity + completeness)"], ["Trick", "–", "z = μ + σ⊙ε"]]),
    formula: [["KL", "½Σ(μ² + σ² − 1 − log σ²)"], ["Regularisation", "means → 0, variances → 1"], ["β-VAE", "β > 1 → disentangled latents"]],
    example: ["μ = 0.5, σ = 1: KL = ½(0.25 + 1 − 1 − 0) = 0.125.", "μ = 1, σ = 0.5, ε = −0.4 → z = 1 + 0.5×(−0.4) = 0.8."],
    memory: "VAE = AE + Variance + a nudge toward the standard normal.", trap: "We can't backprop through random sampling, so ε carries the randomness instead.", check: "genai-c-ae-1" },
  { id: "genai-gan", title: "GANs", cov: ["genai-gan"], src: L("39-55"),
    hook: "A forger (G) and a detective (D) train each other.",
    visual: table(["Player", "Wants", "Objective"], [["Discriminator D", "D(real) ≈ 1, D(fake) ≈ 0", "max E[log D(x)] + E[log(1 − D(G(z)))]"], ["Generator G", "fool D", "min the same expression"], ["Equilibrium", "p_G = p_data", "D(x) ≈ 0.5 everywhere"]]),
    formula: [["Training", "alternate: train D, then train G with D fixed"], ["Mode collapse", "G covers one mode only"]],
    example: ["Interpolating z_A → z_B through the trained generator gives smoothly changing faces (StyleGAN2)."],
    memory: "Forger vs detective until the detective just guesses (0.5).", trap: "G never sees real data directly: it learns only through D's feedback.", check: "genai-c-gan-1" },
  { id: "genai-ar-diff", title: "Autoregressive and diffusion models", cov: ["genai-autoregressive", "genai-diffusion"], src: L("57-70"),
    hook: "Build data one piece at a time, or carve it out of noise step by step.",
    visual: table(["Model", "Starts from", "Generates by"], [["VAE", "latent z", "decoder → image"], ["GAN", "noise z", "generator → image"], ["Autoregressive", "earlier elements", "next element → repeat"], ["Diffusion", "Gaussian noise", "denoise → repeat → image"]]),
    formula: [["xᵢ ~ p_θ(·|x₁…xᵢ₋₁)", "predict, sample, append"], ["xₜ = √ᾱₜx₀ + √(1−ᾱₜ)ε", "forward noising"], ["L = ‖ε̂ − ε‖²", "denoiser predicts the noise"]],
    example: ["'May the Force' → 'be' (highest) → 'with' → 'you'.", "Causal mask: 'Force' sees May, the, Force but not 'be'."],
    memory: "AR = Again and Again (one token at a time); Diffusion = Dust off the noise.", trap: "Causal masking makes TRAINING parallel, but generation stays sequential.", check: "genai-c-ar-1" },
];
export const cheat = { title: "Generative AI cheat sheet",
  rows: [["AE", "‖x − x̂‖²", "compression, denoising, anomalies", ""], ["VAE", "recon + KL", "z = μ + σε", ""], ["GAN", "min_G max_D", "D → 0.5", ""], ["Autoregressive", "Π p(xᵢ|x<ᵢ)", "GPT, PixelCNN, WaveNet", ""], ["Diffusion", "predict noise ε", "repeat denoising", ""]],
  traps: ["AE: no labels.", "Plain AEs generate poorly from random z.", "KL pulls μ → 0, σ → 1.", "Mode collapse = missing diversity.", "Latent diffusion decodes once at the end."] };

A.match("c-intro-1", "Easy", "Match each learning type to its goal (Lecture 9).", [["Supervised", "learn a function mapping x → y"], ["Unsupervised", "learn the hidden structure of unlabelled data"], ["Generative modelling", "learn a model whose samples look like the training distribution"]], ["maximise cumulative reward"], "Generative: P_model ≈ P_data.", { cov: ["genai-intro"], src: L("2-4") });
A.multi("c-intro-2", "Medium", "Why are generative models useful (Lecture 9)?", [["Sample generation (language, images, molecules)", true, ""], ["Outlier detection (e.g. manufacturing defects)", true, ""], ["Debiasing datasets by uncovering underlying features", true, ""], ["Guaranteeing perfect classification accuracy", false, "Not a claim made."]], "Three motivations.", { cov: ["genai-intro"], src: L("5-7") });
A.mcq("c-intro-3", "Medium", "In the shadow example, what are the latent variables?", "Object shape, orientation, light direction and light distance", [["The observed shadow", "That's x."], ["The pixel values", "Observed."], ["The camera resolution", "Not a hidden factor here."]], "Hidden factors = z; observed result = x.", { cov: ["genai-intro"], src: L(8) });
A.tf("c-intro-4", "Easy", "Density estimation and sample generation are the two goals of generative modelling in Lecture 9.", true, "Slide 4.", "Learn P_model(x) similar to P_data(x).", { cov: ["genai-intro"], trap: false });
A.mcq("c-ae-1", "Easy", "What is the autoencoder's training loss?", "‖x − x̂‖², comparing the input with its reconstruction", [["Cross-entropy with class labels", "No labels used."], ["KL divergence only", "That's the VAE regulariser."], ["The discriminator loss", "GANs."]], "Input = target.", { cov: ["genai-ae"], src: L(14) });
A.tf("c-ae-2", "Medium", "A smaller latent space (e.g. 2D instead of 5D) gives a tighter bottleneck and usually blurrier reconstructions.", true, "Slide 15: autoencoding is compression.", "Bottleneck size trades compression vs quality.", { cov: ["genai-ae"], src: L(15), trap: false });
A.mcq("c-ae-3", "Medium", "In a denoising autoencoder, the reconstruction is compared with…", "the clean image x", [["the noisy input x̃", "That would learn to reproduce noise."], ["random noise", "No."], ["the latent z", "Different spaces."]], "Noisy in, clean target.", { cov: ["genai-ae"], src: L(16) });
A.multi("c-ae-4", "Medium", "Select ALL applications/limitations of standard autoencoders (Lecture 9).", [["Compact representations for visualisation", true, ""], ["Denoising", true, ""], ["Anomaly detection via high reconstruction error", true, ""], ["Excellent generation from randomly sampled codes", false, "That's their LIMITATION."]], "AEs aren't good generators.", { cov: ["genai-ae"], src: L(17) });
A.mcq("c-vae-1", "Medium", "What is the key difference between a VAE and a traditional autoencoder?", "The encoder outputs a mean μ and standard deviation σ, and z is sampled from them", [["The VAE has no decoder", "It has one."], ["The VAE uses class labels", "Still unsupervised."], ["The VAE uses a discriminator", "That's a GAN."]], "Probabilistic twist.", { cov: ["genai-vae"], src: L("20-21") });
A.blank("c-vae-2", "Hard", "KL term for one latent dimension with μ = 0.5, σ = 1: ½(μ² + σ² − 1 − ln σ²) = ______.", "0.125", [], "½(0.25 + 1 − 1 − 0).", { cov: ["genai-vae"], calc: true, tol: 0.0006 });
A.tf("c-vae-3", "Medium", "Regularising with the normal prior encourages means toward 0 and variances toward 1, which gives continuity and completeness.", true, "Slides 28-30.", "Close points decode similarly; samples decode meaningfully.", { cov: ["genai-vae"], trap: false });
A.mcq("c-vae-4", "Medium", "Why is the reparameterisation trick needed?", "Gradients cannot be backpropagated through a random sampling node", [["To make the decoder deterministic", "Decoder is already deterministic."], ["To remove the KL term", "KL stays."], ["To speed up the forward pass", "Not the purpose."]], "z = μ + σ⊙ε moves randomness to ε.", { cov: ["genai-vae"], src: L("31-34") });
A.mcq("c-vae-5", "Hard", "In a β-VAE with β > 1, what happens?", "The latent bottleneck is constrained more, encouraging disentangled factors", [["Reconstruction is weighted more heavily", "β weights the KL term."], ["The model becomes a GAN", "No."], ["Latents become more entangled", "Opposite."]], "β = 250: head rotation without smile change.", { cov: ["genai-vae"], src: L(36) });
A.match("c-vae-6", "Medium", "Match each VAE loss term to its role.", [["Reconstruction loss", "make x̂ close to x (e.g. ‖x − x̂‖²)"], ["KL regulariser", "keep q(z|x) close to the prior N(0, I)"]], ["make D output 0.5"], "Two terms.", { cov: ["genai-vae"], src: L("22-27") });
A.mcq("c-gan-1", "Easy", "In a GAN, what does the discriminator learn?", "To distinguish real training samples from generated samples", [["To generate new samples from noise", "That's the generator."], ["To encode images into μ and σ", "That's a VAE encoder."], ["To predict the next token", "Autoregressive."]], "D outputs a realness score.", { cov: ["genai-gan"], src: L(40) });
A.tf("c-gan-2", "Medium", "At the ideal GAN equilibrium, the discriminator outputs D(x) ≈ 0.5 because generated and real distributions match.", true, "Slide 45.", "Neither source is more likely.", { cov: ["genai-gan"], trap: false });
A.mcq("c-gan-3", "Medium", "The generator learns one output that fools D very well and ignores the other modes of the data. This is…", "mode collapse", [["overfitting", "Different concept."], ["vanishing gradient", "Different issue."], ["posterior collapse", "VAE term."]], "Matches one region, misses diversity.", { cov: ["genai-gan"], src: L(46) });
A.multi("c-gan-4", "Hard", "Select ALL true statements about GAN training (Lecture 9).", [["D maximises E[log D(x)] + E[log(1 − D(G(z)))]", true, ""], ["G minimises the same expression; the real term is constant w.r.t. G", true, ""], ["Training alternates between D and G", true, ""], ["G is trained on real images directly", false, "It learns via D."], ["After training, the generator alone creates new data", true, ""]], "Adversarial min-max.", { cov: ["genai-gan"], src: L("44-51") });
A.blank("c-gan-5", "Medium", "D(x) = 0.5 and D(G(z)) = 0.5: log D(x) + log(1 − D(G(z))) = 2 ln 0.5 = ______ (3 dp).", "-1.386", ["−1.386"], "ln 0.5 = −0.693.", { cov: ["genai-gan"], calc: true, tol: 0.0015 });
A.mcq("c-ar-1", "Easy", "How does an autoregressive model generate a sentence?", "Predict a distribution for the next token, sample it, append it, repeat", [["Decode a single latent vector in one step", "That's VAE/GAN style."], ["Denoise random noise", "Diffusion."], ["Classify the whole sentence", "Not generation."]], "Predict, sample, append, repeat.", { cov: ["genai-autoregressive"], src: L(58) });
A.tf("c-ar-2", "Medium", "With causal masking, autoregressive models generate all tokens of a new sentence in one parallel step.", false, "TRAINING is parallel across positions; GENERATION is sequential, token by token.", "Mask = no peeking at the future.", { cov: ["genai-autoregressive"], src: L(60) });
A.match("c-ar-3", "Medium", "Match each domain to its autoregressive model (Lecture 9 table).", [["Language", "GPT-style models (tokens)"], ["Images", "PixelCNN (pixels)"], ["Audio", "WaveNet (audio samples)"], ["DNA", "Evo (nucleotides)"]], ["YOLO (boxes)"], "Same idea, different elements.", { cov: ["genai-autoregressive"], src: L(62) });
A.mcq("c-ar-4", "Medium", "In FVSBN, which inputs does the output unit x̂₄ receive?", "Only the earlier visible variables x₁, x₂, x₃", [["All four variables including x₄", "It can't see itself."], ["Only x₃", "All earlier ones."], ["A latent vector z", "Fully visible: no latents."]], "x̂₄ = σ(b₄ + w₄₁x₁ + w₄₂x₂ + w₄₃x₃).", { cov: ["genai-autoregressive"], src: L(59) });
A.blank("c-ar-5", "Medium", "FVSBN: b₄ = −1, w₄₁ = 2, w₄₂ = 0.5, w₄₃ = −1, x = (1, 0, 1). The input to the sigmoid is ______.", "0", ["0.0"], "−1 + 2 + 0 − 1.", { cov: ["genai-autoregressive"], calc: true, tol: 0.001 });
A.mcq("c-diff-1", "Medium", "What does the diffusion denoising network ε_θ(xₜ, t) learn to predict during training?", "The noise ε that was added to produce xₜ", [["The class label", "No labels."], ["The latent μ and σ", "VAE."], ["Whether xₜ is real or fake", "GAN discriminator."]], "MSE loss ‖ε̂ − ε‖².", { cov: ["genai-diffusion"], src: L(65) });
A.tf("c-diff-2", "Medium", "In the forward process, as t approaches T, xₜ approaches pure Gaussian noise N(0, I).", true, "Slide 64.", "Clear image → nearly pure noise.", { cov: ["genai-diffusion"], trap: false });
A.multi("c-diff-3", "Medium", "Select ALL true statements about text-guided latent diffusion.", [["It denoises in a compact latent space", true, ""], ["A text encoder conditions each denoising step", true, ""], ["It decodes to an image once at the end", true, ""], ["It needs no noise at all", false, "Starts from random latent noise."]], "Prompt steers the denoising.", { cov: ["genai-diffusion"], src: L(68) });
A.match("c-diff-4", "Medium", "Lecture 9 'Four ways to generate new data': match each model to its process.", [["VAE", "latent z → decoder → image"], ["GAN", "noise z → generator → image"], ["Autoregressive", "earlier elements → next element → repeat"], ["Diffusion", "Gaussian noise → denoise → repeat → image"]], ["image → classifier → label"], "Slide 70.", { cov: ["genai-diffusion", "genai-autoregressive", "genai-gan", "genai-vae"], src: L(70) });
A.mcq("c-diff-5", "Medium", "In ControlNet (Lecture 9), what does the pose map control?", "Where things appear (spatial structure), while text describes the content", [["The colour palette only", "No."], ["The noise schedule", "No."], ["The model's training data", "No."]], "Same spatial guide, varied prompts.", { cov: ["genai-diffusion"], src: L(69) });
A.blank("c-diff-6", "Hard", "xₜ = √ᾱ x₀ + √(1 − ᾱ) ε with ᾱ = 0.64, x₀ = 1, ε = 0.5. xₜ = ______.", "1.1", ["1.10"], "0.8×1 + 0.6×0.5.", { cov: ["genai-diffusion"], calc: true, tol: 0.001 });

export const questions = A.out;
