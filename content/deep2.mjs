// Deeper explanations, KaTeX formulas and slide links: nn, mdp, bayes, logic, kr.
const R = String.raw;
export const deep = {
  "nn-structure": {
    slides: ["W5/5", "W5/6", "W5/7", "W5/8", "W5/9"],
    explain: [
      "An artificial neuron is a tiny calculator inspired by brain cells: it multiplies each input by a weight (how much it cares about that input), adds them up together with a bias, then passes the total through an <b>activation function</b>.",
      "Neurons are arranged in layers: an input layer, one or more hidden layers and an output layer. Each link carries one weight; learning means adjusting these weights.",
      "The activation adds non-linearity. Without it, stacking layers would still only give a straight-line (linear) model. ReLU is the usual choice for hidden layers; sigmoid suits probability outputs.",
    ],
    tex: [
      { t: R`in_j = \sum_{i} w_{i,j}\, a_i \;(+\, w_{0,j}), \qquad a_j = g(in_j)`, where: [[R`a_i`, "activation coming from unit i"], [R`w_{i,j}`, "weight on the link i → j"], [R`g`, "activation function"]] },
      { t: R`\text{ReLU}(x) = \max(0,x)\quad \sigma(z) = \frac{1}{1+e^{-z}}\quad \tanh(x) = \frac{e^{2x}-1}{e^{2x}+1}\quad \text{softplus}(x) = \ln(1+e^x)`, where: [] },
      { t: R`\#\text{params of a dense layer} = (\#\text{inputs} + 1)\times \#\text{units}`, where: [] },
    ],
  },
  "nn-perceptron": {
    slides: ["W5/12", "W5/13", "W5/14", "W5/15", "W5/17"],
    explain: [
      "A perceptron is a single neuron with a hard on/off output: if the weighted sum is at least 0 it outputs 1, otherwise 0. It draws a straight line that separates two classes.",
      "The bias w₀ (weight on a constant input of 1) slides that line or threshold left or right.",
      "Learning rule: if the prediction is right, change nothing. If it is wrong, nudge every weight toward the correct answer by α × error × input.",
    ],
    tex: [
      { t: R`ws = \sum_{j=0}^{n} w_j x_j \;(x_0 = 1), \qquad h_w(\mathbf x) = \begin{cases}1 & ws \ge 0\\ 0 & ws < 0\end{cases}`, where: [] },
      { t: R`w_i \leftarrow w_i + \alpha\,\big(y - h_w(\mathbf x)\big)\,x_i`, where: [[R`\alpha`, "learning rate"], [R`y - h_w(\mathbf x)`, "error: +1, 0 or −1"]] },
    ],
  },
  "nn-backprop": {
    slides: ["W5/21", "W5/25", "W5/27", "W5/30", "W5/31", "W5/32"],
    explain: [
      "Training a network = gradient descent on its loss. The difficulty is finding how each hidden weight affects the final error.",
      "<b>Backpropagation</b> solves this with the chain rule: compute the error signal Δ at the output, then pass it backwards. Each hidden unit's Δ is the Δ of the units it feeds, times the connecting weight, times its own activation slope g′.",
      "The gradient for any weight is simply (activation coming in) × (Δ at the receiving unit). With sigmoid, g′ = g(1 − g) ≤ 0.25, so signals shrink layer by layer: the vanishing-gradient problem.",
    ],
    tex: [
      { t: R`\text{Loss} = (y - \hat y)^2, \qquad \Delta_5 = 2(\hat y - y)\, g'(in_5)`, where: [] },
      { t: R`\Delta_i = g'(in_i)\, w_{i,j}\, \Delta_j`, where: [] },
      { t: R`\frac{\partial L}{\partial w_{i,j}} = a_i\,\Delta_j, \qquad w_{i,j} \leftarrow w_{i,j} - \alpha\, a_i\,\Delta_j`, where: [] },
      { t: R`\text{sigmoid unit: } w_i \leftarrow w_i + \alpha\,(y - h)\,h(1-h)\,x_i`, where: [] },
    ],
  },
  "nn-lstm": {
    slides: ["W5/38", "W5/40", "W5/42", "W5/43", "W5/44"],
    explain: [
      "A recurrent network feeds its own hidden state back in at the next time step, so it carries memory of earlier inputs.",
      "Backpropagating through many time steps multiplies by w_zz (and g′ ≤ 1) again and again: values below 1 make gradients vanish, above 1 make them explode.",
      "An LSTM adds a <b>memory cell</b> cₜ that is copied forward and updated by ADDING new information. Three gates (numbers between 0 and 1) control it: forget (keep or wipe), input (how much new info to add), output (how much to reveal as zₜ).",
    ],
    tex: [
      { t: R`z_t = g_z(W_{zz} z_{t-1} + W_{xz} x_t), \qquad \hat y_t = g_y(W_{zy} z_t)`, where: [] },
      { t: R`f_t = \sigma(W_{xf}x_t + W_{zf}z_{t-1}),\; i_t = \sigma(W_{xi}x_t + W_{zi}z_{t-1}),\; o_t = \sigma(W_{xo}x_t + W_{zo}z_{t-1})`, where: [] },
      { t: R`c_t = c_{t-1}\odot f_t + i_t \odot \tanh(W_{xc}x_t + W_{zc}z_{t-1}), \qquad z_t = \tanh(c_t)\odot o_t`, where: [[R`\odot`, "element-wise multiplication"]] },
    ],
  },
  // ---------- MDP / RL ----------
  "mdp-meu": {
    slides: ["W6/8", "W6/9", "W6/10"],
    explain: [
      "When an action can lead to several outcomes, judge it by its <b>average</b> result weighted by how likely each outcome is: its expected utility.",
      "Route A: 80% chance of +10, 20% chance of −10 → 0.8×10 + 0.2×(−10) = 6. Route B: always +7. A rational agent picks B, even though A has the better best case.",
      "The Markov assumption keeps things manageable: the next state depends only on the current state (and action), not on the whole history.",
    ],
    tex: [{ t: R`EU(a \mid s) = \sum_{s'} P(s' \mid s, a)\, U(s'), \qquad a^* = \arg\max_a EU(a \mid s)`, where: [[R`P(s' \mid s,a)`, "probability that action a in s leads to s′"], [R`U(s')`, "utility (desirability) of s′"]] }, { t: R`P(X_t \mid X_{0:t-1}) = P(X_t \mid X_{t-1})`, where: [] }],
  },
  "mdp-def": {
    slides: ["W6/18", "W6/19", "W6/20", "W6/21", "W6/22"],
    explain: [
      "An MDP describes a world where you make a series of decisions and outcomes are random. It has states, actions, a transition model (probabilities of where each action leads) and rewards.",
      "Grid world: the robot tries to move Up, but only goes up 80% of the time; 10% it slips left and 10% right. Every step costs −0.04 (to encourage hurrying); reaching +1 or −1 ends the episode.",
      "MDP = the problem description. Reinforcement learning = a way to learn good behaviour when you DON'T know the probabilities or rewards in advance.",
    ],
    tex: [{ t: R`\text{MDP} = \big(S,\; \text{ACTIONS}(s),\; P(s' \mid s,a),\; R(s,a,s')\big)`, where: [] }],
  },
  "mdp-utility": {
    slides: ["W6/24", "W6/25", "W6/26", "W6/27"],
    explain: [
      "The return adds up all future rewards, but rewards further in the future are multiplied by γ (between 0 and 1) once per step, so they count less. γ close to 1 = patient agent; γ close to 0 = short-sighted.",
      "A <b>policy</b> π says which action to take in EVERY state. The utility of a state under π is the expected discounted return when you start there and follow π.",
      "The picture: arrows on the grid show the optimal policy when each step costs −0.04: head for +1 and steer around −1.",
    ],
    tex: [
      { t: R`G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \cdots = \sum_{k=0}^{\infty}\gamma^k R_{t+k+1}`, where: [[R`\gamma`, "discount factor, 0 ≤ γ < 1 (γ = 1: additive reward)"]] },
      { t: R`U^\pi(s) = E\left[\sum_{t=0}^{\infty}\gamma^t R(S_t, \pi(S_t), S_{t+1})\right]`, where: [] },
    ],
  },
  "mdp-bellman": {
    slides: ["W6/29", "W6/30", "W6/27"],
    explain: [
      "The Bellman equation says: the value of a state = the value of its best action. The value of an action is the average over outcomes of (immediate reward + discounted value of where you land).",
      "Q(s, a) is exactly that action value. Once you know Q, acting optimally is easy: pick the action with the largest Q.",
      "Calculate it like a table: one row per possible next state, compute P × (R + γU′), add the rows. Repeat for each action and take the max.",
    ],
    tex: [
      { t: R`U(s) = \max_{a} \sum_{s'} P(s' \mid s, a)\,\big[R(s,a,s') + \gamma\, U(s')\big]`, where: [] },
      { t: R`Q(s,a) = \sum_{s'} P(s' \mid s, a)\,\big[R(s,a,s') + \gamma \max_{a'} Q(s',a')\big]`, where: [] },
      { t: R`U(s) = \max_a Q(s,a), \qquad \pi^*(s) = \arg\max_a Q(s,a)`, where: [] },
    ],
  },
  "mdp-vi-pi": {
    slides: ["W6/33", "W6/34", "W6/37", "W6/38", "W6/39"],
    explain: [
      "<b>Value iteration</b>: start with all utilities 0 and repeatedly apply the Bellman update to every state. Values spread out from the rewards until they stop changing; then read off the best action in each state.",
      "<b>Policy iteration</b>: start with any policy. (1) Evaluate it: compute the utilities if you always follow it (no max, because the action is fixed). (2) Improve it: in each state switch to the action with the best one-step look-ahead. Stop when the policy no longer changes.",
    ],
    tex: [
      { t: R`U_{i+1}(s) \leftarrow \max_a \sum_{s'} P(s' \mid s,a)\big[R(s,a,s') + \gamma U_i(s')\big]`, where: [] },
      { t: R`\text{stop when } \delta \le \epsilon(1-\gamma)/\gamma`, where: [] },
      { t: R`U_i(s) = \sum_{s'} P(s' \mid s, \pi_i(s))\big[R + \gamma U_i(s')\big], \quad \pi_{i+1}(s) = \arg\max_a \sum_{s'} P(s'|s,a)\big[R + \gamma U_i(s')\big]`, where: [] },
    ],
  },
  "mdp-rl": {
    slides: ["W6/43", "W6/48", "W6/51", "W6/56", "W6/58", "W6/60"],
    explain: [
      "In RL the agent learns by trial and error. <b>Passive</b> RL: the policy is fixed; just learn how good each state is. <b>Active</b> RL: the agent also chooses actions, balancing <b>exploration</b> (try new things) and <b>exploitation</b> (use what works).",
      "<b>Direct utility estimation</b>: after each trial, compute the total reward from each visited state to the end (reward-to-go) and average them. Simple but slow.",
      "<b>ADP</b>: count transitions to estimate P(s′|s,a), then solve the Bellman equations. <b>TD learning</b>: after every single step, nudge U(s) toward 'reward + γ × U(next state)'.",
    ],
    tex: [
      { t: R`\text{reward-to-go}(0,0) = (-0.04)\times 4 + 1 = 0.84`, where: [] },
      { t: R`\hat P(s' \mid s,a) = \frac{N(s,a \to s')}{N(s,a)}`, where: [[R`N`, "observed counts"]] },
      { t: R`U^\pi(s) \leftarrow U^\pi(s) + \alpha\big[R + \gamma U^\pi(s') - U^\pi(s)\big]`, where: [[R`\alpha`, "learning rate"]] },
    ],
  },
  "mdp-qlearning": {
    slides: ["W6/62", "W6/63", "W6/64", "W6/65"],
    explain: [
      "Q-learning learns Q(s,a) directly from experience, with no model of the world (model-free).",
      "After each step (s, a, r, s′): the TD target is r + γ × (best Q in the new state). Move Q(s,a) a fraction α of the way toward that target.",
      "The exploration function keeps the agent curious: actions tried fewer than Nₑ times are treated as if they give the optimistic reward R⁺.",
    ],
    tex: [
      { t: R`Q(s,a) \leftarrow Q(s,a) + \alpha\big[R(s,a,s') + \gamma \max_{a'} Q(s',a') - Q(s,a)\big]`, where: [] },
      { t: R`f(u, n) = \begin{cases} R^+ & n < N_e \\ u & \text{otherwise}\end{cases}`, where: [] },
    ],
  },
  // ---------- probability & BN ----------
  "bayes-rules": {
    slides: ["L11/14", "L11/15", "L11/20", "L11/21"],
    explain: [
      "Probability is a number from 0 (certainly false) to 1 (certainly true) expressing how strongly you believe something.",
      "NOT: 1 − P. OR for events that can't happen together: add. AND for independent events: multiply. GIVEN: restrict attention to cases where the condition holds, then ask how often the event happens there.",
      "The prior is your belief before seeing evidence; the posterior is your updated belief after.",
    ],
    tex: [{ t: R`P(\neg A) = 1 - P(A),\quad P(A\cup B) = P(A) + P(B),\quad P(A \cap B) = P(A)P(B),\quad P(A \mid B) = \frac{P(A\cap B)}{P(B)}`, where: [] }],
  },
  "bayes-joint-table": {
    slides: ["L11/22", "L11/23", "L11/25", "L11/32", "L11/44"],
    explain: [
      "A full joint table lists the probability of EVERY complete combination of the variables. With it you can answer any question by adding the right rows.",
      "To find P(X = x₁): keep the rows where X = x₁ and add them up (this 'sums out' the other variables). To estimate the table from experiments: probability = how often the event happened ÷ number of experiments.",
      "The problem: n binary variables need 2ⁿ rows (5 → 32, 20 → over a million), which is too big to store or estimate.",
    ],
    tex: [{ t: R`P(X = x) = \sum_y \sum_z P(X = x, Y = y, Z = z)`, where: [] }, { t: R`P(\text{event}_j) = \frac{\text{occurrences of event}_j}{\text{total experiments}}`, where: [] }],
  },
  "bayes-bn": {
    slides: ["L11/26", "L11/27", "L11/30", "L11/35", "L11/52"],
    explain: [
      "A Bayesian network stores the same information much more compactly. Each variable is a node; an arrow from X to Y means X directly influences Y. Each node only stores a small table: its probability given its parents.",
      "To get the probability of a full combination, multiply each node's entry given its parents. Burglary: P(B)P(E)P(A|B,E)P(J|A)P(M|A).",
      "For a 'false' value use 1 − the table entry (e.g. P(¬b) = 1 − 0.001 = 0.999).",
    ],
    tex: [{ t: R`P(x_1,\dots,x_n) = \prod_{i=1}^{n} P\big(x_i \mid \text{Parents}(X_i)\big)`, where: [] }, { t: R`P(B,E,A,J,M) = P(B)\,P(E)\,P(A \mid B,E)\,P(J \mid A)\,P(M \mid A)`, where: [] }],
  },
  "bayes-rule": {
    slides: ["L11/28", "L11/29"],
    explain: [
      "Bayes' rule lets you flip a conditional probability. Doctors know P(symptom | disease) (causal direction) but need P(disease | symptom) (diagnostic direction).",
      "Multiply the likelihood P(S|D) by the prior P(D) and divide by how common the symptom is overall, P(S).",
      "If the disease is rare, even a good test gives a modest posterior: most positives come from the many healthy people.",
    ],
    tex: [
      { t: R`P(D \mid S) = \frac{P(S \mid D)\,P(D)}{P(S)}, \qquad P(S) = P(S\mid D)P(D) + P(S \mid \neg D)P(\neg D)`, where: [[R`P(D)`, "prior"], [R`P(S\mid D)`, "likelihood"], [R`P(D\mid S)`, "posterior"]] },
      { t: R`P(Y \mid X) = \alpha\, P(X \mid Y)\, P(Y)`, where: [[R`\alpha`, "normalisation constant (makes the posterior sum to 1)"]] },
      { t: R`\text{Conditional independence: } P(X, Y \mid Z) = P(X \mid Z)\,P(Y \mid Z)`, where: [] },
    ],
  },
  "bayes-enumeration": {
    slides: ["L11/45", "L11/48", "L11/49", "L11/50", "L11/53", "L11/54", "L11/56"],
    explain: [
      "Question: given John and Mary both called, what is the chance of a burglary? B is the <b>query</b>, J and M are the <b>evidence</b>, A and E are <b>hidden</b> (we don't know them, so we must consider every possibility).",
      "Compute an unnormalised score for B = true: multiply the factors along each path of the tree and ADD over every value of E and A. Do the same for B = false.",
      "Finally divide each score by their total so they sum to 1 (normalise). Lecture 11: s_B = 0.00059224, s_¬B = 0.00149186 → P(b | j, m) ≈ 0.284.",
    ],
    tex: [
      { t: R`P(B \mid j, m) = \alpha\, P(B)\sum_{e} P(e)\sum_{a} P(a \mid B, e)\, P(j \mid a)\, P(m \mid a)`, where: [] },
      { t: R`P(b \mid j,m) = \frac{s_B}{s_B + s_{\neg B}} = \frac{0.00059224}{0.00059224 + 0.00149186} \approx 0.2842`, where: [] },
    ],
  },
  // ---------- logic ----------
  "logic-pl": {
    slides: ["L10/5", "L10/7", "L10/10", "L10/12", "L10/13", "L10/14"],
    explain: [
      "Propositional logic uses symbols (P, Q, …) that are simply true or false, joined by connectives: not ¬, and ∧, or ∨, implies ⇒, if-and-only-if ⇔.",
      "A <b>model</b> assigns true/false to every symbol; the truth table tells you whether a sentence is true in that model.",
      "P ⇒ Q is a promise 'if P then Q'. It is only broken when P is true and Q is false. If P is false the promise can't be broken, so it counts as true ('vacuously true').",
    ],
    tex: [{ t: R`P \Rightarrow Q \;\equiv\; \neg P \vee Q, \qquad P \Leftrightarrow Q \;\equiv\; (P\Rightarrow Q)\wedge(Q \Rightarrow P)`, where: [] }, { t: R`\neg P \vee Q \wedge R \Rightarrow S \;=\; \big((\neg P) \vee (Q \wedge R)\big) \Rightarrow S`, where: [] }],
  },
  "logic-equivalence": {
    slides: ["L10/15"],
    explain: ["Two sentences are equivalent if they are true in exactly the same models. These rewrite rules let you transform sentences, for example into CNF for resolution, without changing their meaning."],
    tex: [{ t: R`\neg(\alpha\wedge\beta) \equiv \neg\alpha \vee \neg\beta \qquad \neg(\alpha\vee\beta) \equiv \neg\alpha\wedge\neg\beta`, where: [] }, { t: R`\alpha \Rightarrow \beta \equiv \neg\beta \Rightarrow \neg\alpha \qquad \alpha\vee(\beta\wedge\gamma) \equiv (\alpha\vee\beta)\wedge(\alpha\vee\gamma)`, where: [] }],
  },
  "logic-fol": {
    slides: ["L10/16", "L10/17", "L10/20", "L10/22", "L10/23", "L10/46", "L10/47"],
    explain: [
      "First-order logic talks about objects (John, Sydney), properties and relations between them (Student(John), Brother(Richard, John)) and functions that name objects (Father(John)).",
      "Quantifiers let one sentence cover many objects: ∀x (for all x) and ∃x (there exists an x). Pattern: ∀ usually goes with ⇒, ∃ usually goes with ∧.",
      "To reason, propositionalise: replace ∃x by a brand-new constant (EI) and ∀x by specific objects (UI), then use propositional methods.",
    ],
    tex: [
      { t: R`\forall x\; \text{Student}(x) \Rightarrow \text{Studies}(x) \qquad \exists x\; \text{Student}(x) \wedge \text{Enrolled}(x, AI)`, where: [] },
      { t: R`\forall x\, \neg P(x) \;\Leftrightarrow\; \neg \exists x\, P(x)`, where: [] },
      { t: R`\text{UI: } \forall v\,\alpha \vdash \text{Subst}(\{v/g\}, \alpha) \qquad \text{EI: } \exists v\,\alpha \vdash \text{Subst}(\{v/k\}, \alpha),\; k \text{ new}`, where: [] },
    ],
  },
  "logic-inference": {
    slides: ["L10/28", "L10/31", "L10/32", "L10/36", "L10/42", "L10/43"],
    explain: [
      "<b>Entailment</b> KB ⊨ γ: whenever everything in the knowledge base is true, γ must be true too.",
      "<b>Model checking</b>: list every truth assignment, keep the ones where the KB is true, and check that γ is true in all of them.",
      "<b>Theorem proving</b>: chain sound rules such as Modus Ponens (P and P ⇒ Q give Q). <b>Resolution</b>: assume the opposite (KB ∧ ¬γ), turn it into clauses, and cancel complementary literals until you reach the empty clause □, a contradiction, which proves KB ⊨ γ.",
    ],
    tex: [
      { t: R`\alpha \models \beta \iff M(\alpha) \subseteq M(\beta)`, where: [[R`M(\alpha)`, "set of models in which α is true"]] },
      { t: R`\frac{\alpha\Rightarrow\beta,\quad \alpha}{\beta}\;(\text{Modus Ponens}) \qquad \frac{\ell_1 \vee \dots \vee \ell_k,\quad m_1\vee\dots\vee m_n}{\text{all literals except the complementary pair}}`, where: [] },
      { t: R`\alpha \models \beta \iff \alpha \wedge \neg\beta \text{ is unsatisfiable}`, where: [] },
    ],
  },
  // ---------- knowledge representation ----------
  "kr-hierarchy": {
    slides: ["L12/4", "L12/6", "L12/7", "L12/8"],
    explain: [
      "Hierarchies organise knowledge from general to specific (Entity → Living thing → Animal …). Every lower class is a kind of ('is-a') the class above it.",
      "Because of inheritance and transitivity, facts you state once at a high level automatically apply to everything below.",
      "Membership (∈) links an individual object to its category; subset (⊆) links a sub-category to a bigger one.",
    ],
    tex: [{ t: R`\text{Basketball} \in \text{SportsBalls}, \qquad \text{Basketballs} \subseteq \text{SportsBalls}`, where: [] }],
  },
  "kr-semnet": {
    slides: ["L12/10", "L12/11", "L12/12", "L12/19", "L12/22"],
    explain: [
      "A semantic network is a drawing of knowledge: nodes for concepts/objects, labelled arrows for relations (subclass of, member of, can, has part).",
      "To answer 'can Tweety fly?', climb upward from Tweety (Canary → Bird) until you find a value: Bird can fly.",
      "Exceptions override: Penguin has its own 'cannot fly', which is found first (more specific), so Pingu cannot fly.",
    ],
    tex: [],
  },
  "kr-ontology": {
    slides: ["L12/13", "L12/14", "L12/15", "L12/26", "L12/27", "L12/29", "L12/30"],
    explain: [
      "An ontology is a semantic network with precise, machine-readable rules: classes, properties, individuals and axioms (e.g. every Student is a Person).",
      "A reasoner uses those rules to infer new facts (Alice is a Person; Alice studies in the School of CS) and to catch mistakes (a Room can't enrol in a course).",
      "A knowledge graph stores actual facts about real entities as labelled edges; an ontology supplies its schema.",
    ],
    tex: [{ t: R`\text{Student} \sqsubseteq \text{Person},\; \text{Student}(Alice) \Rightarrow \text{Person}(Alice)`, where: [] }, { t: R`\text{enrolsIn}(s,c)\wedge\text{includes}(c,u)\wedge\text{ownedBy}(u,d) \Rightarrow \text{studiesInDepartment}(s,d)`, where: [] }],
  },
  "kr-sparql": {
    slides: ["L12/16", "L12/32", "L12/35", "L12/36", "L12/37"],
    explain: [
      "RDF stores every fact as a triple: subject — predicate → object.",
      "SPARQL asks questions by writing triple patterns with ?variables; the query returns every way of filling in the variables that matches the graph.",
      "In Wikidata Q-ids are items (Q146 = house cat, Q42 = Douglas Adams) and P-ids are properties (P31 = instance of, P18 = image).",
    ],
    tex: [],
  },
};
