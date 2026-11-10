These are the questions the Canvas pages say you "should be able to answer at the end of this module". They are short-answer study questions, so each has a model answer written from the lecture slides.

## Week 3 (Module 2, Topic 2: local search for optimisation problems)

**W3.1 How do you define an optimisation problem?**
Give the decision variables x₁…xₙ (one set of values = one state), a cost function Q(x₁…xₙ) or fitness function R(x₁…xₙ), the objective (f = min cost or f = max fitness), a successor (neighbour) function, and any constraints/ranges lowᵢ ≤ xᵢ ≤ highᵢ. Only the final state matters, not the path. Example: delivery route: state = a route, neighbour = swap two stops, objective = minimise distance, constraint = visit every location once and return to base. 8-queens: xᵢ = row of the queen in column i, cost = number of attacking pairs.

**W3.2 What are three typical local search algorithms for an optimisation problem?**
Hill climbing (steepest ascent), simulated annealing, and evolutionary algorithms (the genetic algorithm).

**W3.3 How does each one find an optimal solution?**
- Hill climbing: start anywhere, generate neighbours, move to the best neighbour, stop when no neighbour is better. Can stop at a local maximum, ridge or plateau.
- Simulated annealing: pick a random neighbour; always accept a better move; accept a worse move (worse by Δ) with probability e^(−Δ/T); lower T over time by a schedule. High T explores, low T settles. Can escape local optima, but one run is not guaranteed to find the best.
- Genetic algorithm: keep a population; score each individual with a fitness function; select parents (roulette P = fᵢ/Σf, or tournament of size k); create children by crossover and mutation (elitism keeps the best); repeat over generations.

**W3.4 Which algorithm is best for a given problem?**
Compare them on the problem: hill climbing is fastest and simplest but gets stuck (use random restarts); SA escapes local optima if cooled slowly, but is sensitive to the starting temperature and schedule; GAs explore a large space with a population but need a good representation and more computation. Choose based on the size and shape of the landscape (many local optima → SA or GA) and the time available; run several times because SA and GAs are random.

## Week 9 (Module 6: Generative AI)

**W9.1 What is generative AI about?**
Learning a model p_model(x) of the data distribution p_data(x) from training samples, so it can estimate density (how typical is x?) and generate new samples. Contrast: supervised learning maps x → y; unsupervised learning finds hidden structure.

**W9.2 What is the historic context?**
Deep generative models grew from autoencoders → variational autoencoders (2013) → GANs (2014) → autoregressive transformers (GPT-style) and diffusion models (DDPM 2020, Stable Diffusion), enabled by big data and GPU compute.

**W9.3 Systems, use cases and applications?**
Sample generation (text, images, video, audio, molecules), outlier/anomaly detection (train on normal products, flag defects), debiasing datasets (find under-represented latent features), denoising, data compression, text-to-image (latent diffusion).

**W9.4 What is an autoencoder?**
An unsupervised network: an encoder maps x to a low-dimensional latent code z, a decoder maps z back to x̂, trained to minimise the reconstruction loss ‖x − x̂‖². No labels needed. A smaller latent = tighter bottleneck = blurrier reconstruction. Limitation: not good at generating new samples from random codes.

**W9.5 How do you build an autoencoder for a simple problem?**
Choose the latent size; build an encoder (e.g. dense or conv layers shrinking to z) and a mirror decoder; train on the inputs themselves with MSE loss ‖x − x̂‖²; use z as a compact feature, or the reconstruction error to detect anomalies (or train on noisy inputs vs clean targets for denoising).

**W9.6 What is a VAE?**
An autoencoder whose encoder outputs a mean μ and standard deviation σ; z is sampled from N(μ, σ²) using the reparameterisation trick z = μ + σ ⊙ ε, ε ~ N(0, I). Loss = reconstruction loss + KL(q(z|x) ‖ N(0, I)), with KL = ½ Σ(μ² + σ² − 1 − log σ²). The regulariser gives continuity and completeness, so sampling z ~ N(0, I) and decoding generates new data. β-VAE (β > 1) encourages disentanglement.

**W9.7 How do you build a VAE for a simple problem?**
Encoder → two heads (μ, log σ²); sample z = μ + σε; decoder → x̂; train with reconstruction + KL loss; to generate, sample z from N(0, I) and decode.

**W9.8 What is a GAN?**
Two networks in a game: a generator G turns noise z into fake samples; a discriminator D outputs the probability its input is real. min_G max_D E[log D(x)] + E[log(1 − D(G(z)))]. At the ideal equilibrium p_G = p_data and D = 0.5 everywhere. Problem: mode collapse. After training only G is used.

**W9.9 How do you build a GAN for a simple problem?**
Define G (noise → sample) and D (sample → real/fake probability); alternate: update D on real (label 1) and fake (label 0) batches, then update G to make D(G(z)) → 1; repeat until fakes are realistic; sample by feeding new noise to G.

**W9.10 What is a transformer-based autoregressive model? (optional)**
A model that generates one element at a time, each conditioned on all previous ones: p(x) = Π p(xᵢ | x₁…xᵢ₋₁): predict, sample, append, repeat. A causal mask lets training compute all positions in parallel, but generation is sequential (GPT-style text, PixelCNN pixels, WaveNet audio).

**W9.11 Ethical considerations and challenges?**
Bias in training data and outputs, deepfakes and misinformation, privacy and intellectual property (training on copyrighted or personal data), hallucination, misuse, and the cost/energy of training; need for evaluation, human oversight and governance.

## Module 7 overview (Knowledge representation and reasoning)

**M7.1 What are propositional logic and first-order logic?**
Propositional logic: a declarative language of propositions (statements that are true or false) combined with ¬, ∧, ∨, ⇒, ⇔. First-order logic adds objects (constants, variables, functions), predicates (properties and relations) and quantifiers ∀, ∃, so one sentence can talk about all objects.

**M7.2 How do you represent knowledge in PL and FOL?**
PL: choose symbols (P = "it is raining") and write sentences (P ⇒ Q). FOL: choose predicates and functions; "All students study" = ∀x Student(x) ⇒ Studies(x); "Some student is enrolled in AI" = ∃x Student(x) ∧ Enrolled(x, AI). ∀ goes with ⇒, ∃ goes with ∧.

**M7.3 How do you reason with PL and FOL?**
PL: model checking (truth table over 2ⁿ models: KB ⊨ γ if γ is true in every model where KB is true), theorem proving (Modus Ponens, And-elimination, equivalences), and proof by contradiction with resolution (add ¬γ, convert to CNF, resolve to the empty clause). FOL: instantiate quantifiers (UI with any ground term; EI with a new constant), propositionalise, then use a propositional method.

**M7.4 How do you build a hierarchical knowledge representation?**
Organise categories from general to specific with is-a (subclass) links, attach objects by membership, and attach properties to the most general category they hold for, with exceptions on more specific categories. Follow the seven requirements: inclusiveness, species/differentia, inheritance, transitivity, systematic and predictable rules, mutual exclusivity, necessary and sufficient criteria.

**M7.5 What is a semantic network?**
A graph of nodes (categories/objects) and labelled links (MemberOf, SubsetOf, has part, can …). Reasoning by inheritance: start at the object, follow member/subclass links upward, the first value found wins (so exceptions override defaults: Pingu the penguin cannot fly).

**M7.6 What is a Bayesian network?**
A directed acyclic graph whose nodes are random variables, arrows point from parent to child, and each node has a conditional probability table P(X | Parents(X)). It encodes conditional independences, so the full joint is P(x₁…xₙ) = Π P(xᵢ | parents(Xᵢ)) using far fewer numbers (burglary: 10 instead of 31).

**M7.7 How do you convert between the full joint table and the node CPTs?**
CPTs → joint: multiply one entry from each CPT for every complete assignment (P(j, m, a, ¬b, ¬e) = P(j|a)P(m|a)P(a|¬b,¬e)P(¬b)P(¬e) = 0.000628). Joint → CPT: marginalise (sum rows) to get P(X, parents) and P(parents), then divide: P(X | parents) = P(X, parents)/P(parents). Estimating the joint from data: count occurrences / total experiments.

**M7.8 How do you reason with a semantic network and a Bayesian network?**
Semantic network: inheritance upward, most specific value wins. Bayesian network: exact inference by enumeration: for the query X with evidence e and hidden Y, compute P(X | e) = α Σ_y P(X, e, y) using the factorisation, then normalise (burglary: P(b | j, m) = 0.2842).
