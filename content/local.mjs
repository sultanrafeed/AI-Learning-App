import { makeAuthor } from "./helpers.mjs";
import { table } from "../js/gen-core.js";
const A = makeAuthor("local", "Lecture 3 (Local search)");
const L = (p) => `Lecture 3, slide ${p}`;
export const coverage = [
  { id: "local-problem", text: "Local search / optimisation problems: only the best state matters, not the path; objective/cost/fitness function, decision variables, constraints; discrete vs continuous; state-space landscape; 8-queens (56 successors, 92 solutions, cost = attacking pairs); delivery route (20! routes)", src: L("4-12") },
  { id: "local-hc", text: "Hill climbing (steepest ascent): start anywhere, move to best improving neighbour, stop at a peak (possibly local); pseudocode", src: L("14-18") },
  { id: "local-sa", text: "Simulated annealing: metallurgy analogy, temperature, cooling schedule, accept worse moves with p = exp(−Δ/T), limitations (cooling too fast/slow, parameters, randomness)", src: L("20-28") },
  { id: "local-ga", text: "Genetic algorithm (Holland 1975): population, fitness, selection (roulette wheel, tournament), crossover, mutation, elitism; factors; 8-queens GA example; applications", src: L("30-41") },
];
export const formulas = [
  { name: "SA acceptance", f: "p = exp(−Δ/T)", note: "better moves always accepted" },
  { name: "Roulette probability", f: "P(i) = fᵢ / Σⱼ fⱼ", note: "24/78 = 0.31" },
  { name: "Objective", f: "f = min(cost) or f = max(fit)", note: "cost = Q(x₁, …, xₙ)" },
  { name: "8-queens successors", f: "8 × 7 = 56", note: "move one queen within its column" },
];
export const glossary = [
  { term: "Optimisation problem", def: "Find the best state (solution) satisfying constraints; the path is irrelevant." }, { term: "Objective function", def: "Function to minimise (cost) or maximise (fitness)." },
  { term: "Decision variables", def: "Variables whose values define a candidate solution (e.g. queen rows)." }, { term: "Local maximum", def: "A peak better than its neighbours but not the global best." },
  { term: "Simulated annealing", def: "Stochastic hill climbing that sometimes accepts worse moves, less often as temperature drops." }, { term: "Cooling schedule", def: "Function giving temperature T over time t." },
  { term: "Chromosome", def: "Representation of an individual, traditionally a string of 0s and 1s." }, { term: "Crossover", def: "Combine parts of two parents into children." },
  { term: "Mutation", def: "Randomly alter a small part of a solution to keep diversity." }, { term: "Elitism", def: "Copy the best few individuals directly into the next generation." },
  { term: "Roulette-wheel selection", def: "Select parents with probability proportional to fitness." }, { term: "Tournament selection", def: "Pick k random individuals; the fittest becomes a parent." },
];
export const learn = [
  { id: "local-problem", title: "Local search & optimisation problems", cov: ["local-problem"], src: L("4-12"),
    hook: "When there are too many possibilities (20! ≈ 2.4×10¹⁸ routes), improve one candidate step by step.",
    visual: table(["Search problem", "Local search / optimisation"], [["state space", "range of decision variables + constraints"], ["transition function", "successor (neighbour) function"], ["goal test", "objective f = min(cost) or max(fit)"], ["path matters", "only the final state matters"]]),
    formula: [["cost = Q(x₁, …, xₙ)", "8-queens: pairs of attacking queens"], ["Discrete", "integer variables (8-queens)"], ["Continuous", "e.g. min y = x² − 4x + 7, −2 ≤ x ≤ 6"]],
    example: ["cost(2, 4, 6, 8, 3, 1, 7, 5) = 0 (a solution); 92 solutions, 12 fundamental.", "Delivery: STATE = route, NEIGHBOUR = swap two stops, OBJECTIVE = minimise distance, CONSTRAINT = visit once."],
    memory: "Destination, not journey.", trap: "Local search doesn't return a path; it returns the best state found.", check: "local-c-prob-1" },
  { id: "local-hc", title: "Hill climbing", cov: ["local-hc"], src: L("14-18"),
    hook: "Keep walking uphill while the next step improves your height.",
    visual: table(["Step", "Action"], [["1", "start anywhere"], ["2", "generate neighbours"], ["3", "move to the best improving neighbour"], ["4", "stop when no neighbour is better (a peak)"]]),
    formula: [["neighbor ← highest-valued successor", ""], ["if VALUE(neighbor) ≤ VALUE(current) return current", ""], ["8-queens", "f = max(−cost)"]],
    example: ["8-queens state with h = 17; best successor cost 12 → move there."],
    memory: "Greedy uphill, one step at a time.", trap: "It can stop at a LOCAL maximum (or plateau), not the global best.", check: "local-c-hc-1" },
  { id: "local-sa", title: "Simulated annealing", cov: ["local-sa"], src: L("20-28"),
    hook: "Like cooling metal slowly: shake a lot when hot, settle when cold.",
    visual: table(["Δ (worse by)", "T = 10", "T = 1"], [["1", "e^(−0.1) = 0.905", "e^(−1) = 0.368"], ["5", "e^(−0.5) = 0.607", "e^(−5) = 0.007"]]),
    formula: [["p = exp(−Δ/T)", "accept a worse move"], ["Schedule", "T(t) decreasing; T = 0 → stop"], ["Better moves", "always accepted"]],
    example: ["Δ = 2, T = 5: p = e^(−0.4) = 0.670 → accept if random r < 0.670."],
    memory: "Hot = Happy to explore; Cold = Careful.", trap: "Cooling too fast behaves like hill climbing; too slow needs many iterations. No guarantee of the best in one run.", check: "local-c-sa-1" },
  { id: "local-ga", title: "Genetic algorithms", cov: ["local-ga"], src: L("30-41"),
    hook: "Evolve a population: the fitter breed more, children mix and mutate.",
    visual: table(["Individual", "Fitness", "P = f/Σf", "Cumulative (x4, x3, x2, x1)"], [["x1", "24", "0.31", "0.69 – 1.00"], ["x2", "23", "0.29", "0.40 – 0.69"], ["x3", "20", "0.26", "0.14 – 0.40"], ["x4", "11", "0.14", "0 – 0.14"]]),
    formula: [["Selection", "fitter → more likely parent"], ["Crossover", "combine two parents"], ["Mutation", "random small change, keeps diversity"], ["Elitism", "copy the best directly"]],
    example: ["Random numbers 0.164, 0.416, 0.607, 0.894 → x3, x2, x2, x1.", "8-queens: 32752411 × 24748552 → child 32748552 → mutation 32748152."],
    memory: "Select, Cross, Mutate (and keep the Elite).", trap: "Roulette: even weak individuals can be chosen (if fitness > 0); one very fit individual may dominate.", check: "local-c-ga-1" },
];
export const cheat = { title: "Local search cheat sheet",
  rows: [["Hill climbing", "best neighbour", "stops at local max", ""], ["SA", "p = e^(−Δ/T)", "cool slowly", ""], ["GA", "select, crossover, mutate", "population", ""], ["Roulette", "fᵢ/Σf", "24/78 = 0.31", ""], ["Tournament", "best of k", "k controls pressure", ""]],
  traps: ["Path irrelevant in optimisation.", "HC: ≤ current → stop.", "SA always accepts better moves.", "Larger tournament k → less diversity.", "56 successors for 8-queens."] };

A.mcq("c-prob-1", "Easy", "What distinguishes a local search (optimisation) problem from classical path search?", "Only the final state matters, not the path to reach it", [["It always uses a heuristic h(n)", "Not required."], ["It requires a known goal state", "Often only an objective to optimise."], ["It needs a FIFO frontier", "No frontier needed."]], "Destination, not journey.", { cov: ["local-problem"], src: L(5) });
A.blank("c-prob-2", "Medium", "In 8-queens (one queen per column, moves within its column) each state has 8 × 7 = ______ successors.", "56", [], "8 queens × 7 other rows.", { cov: ["local-problem"], calc: true, src: L(10) });
A.tf("c-prob-3", "Medium", "Minimising y = x² − 4x + 7 subject to −2 ≤ x ≤ 6 is a discrete optimisation problem.", false, "x is drawn from a continuous range → continuous optimisation.", "Integers → discrete; real ranges → continuous.", { cov: ["local-problem"], src: L(7) });
A.match("c-prob-4", "Medium", "Delivery route optimisation (Lecture 3): match each concept to its meaning.", [["STATE", "route"], ["NEIGHBOUR", "swap two stops"], ["OBJECTIVE", "minimise distance"], ["CONSTRAINT", "visit each customer once"]], ["maximise the number of stops"], "Formulate before solving.", { cov: ["local-problem"], src: L(12) });
A.blank("c-prob-5", "Easy", "The 8-queens problem has ______ goal states (12 fundamental solutions).", "92", [], "Lecture 3 slide 10.", { cov: ["local-problem"], src: L(10) });
A.mcq("c-prob-6", "Medium", "In the 8-queens formulation, what is the cost function?", "The number of pairs of queens attacking each other", [["The number of queens on the board", "Always 8."], ["The distance moved by the last queen", "Path cost is irrelevant."], ["The number of empty rows", "Not the lecture's cost."]], "cost(2,4,6,8,3,1,7,5) = 0.", { cov: ["local-problem"], src: L(11) });
A.tf("c-hc-1", "Medium", "Steepest-ascent hill climbing always finds the global maximum.", false, "It stops at the first peak where no neighbour is better: possibly a local maximum.", "Restart or use SA/GA to escape.", { cov: ["local-hc"], src: L("14-16") });
A.mcq("c-hc-2", "Easy", "In hill climbing, what happens if the best neighbour's value equals the current value?", "The algorithm returns the current state", [["It moves to that neighbour", "Moves only if strictly better (VALUE(neighbor) ≤ VALUE(current) → return)."], ["It picks a random neighbour", "That's not steepest ascent."], ["It restarts", "No restart in the basic algorithm."]], "Pseudocode Fig 4.2.", { cov: ["local-hc"], src: L(16) });
A.multi("c-hc-3", "Medium", "Select ALL true statements about hill climbing (Lecture 3).", [["It keeps track of one current state", true, ""], ["It moves to the neighbour with the highest value (steepest ascent)", true, ""], ["It needs a population of candidates", false, "That's GA."], ["For 8-queens it maximises f = −cost", true, "Slide 15."], ["It accepts worse moves with probability e^(−Δ/T)", false, "That's SA."]], "One state, greedy moves.", { cov: ["local-hc"], src: L("14-16") });
A.mcq("c-sa-1", "Medium", "In simulated annealing, a neighbour is worse by Δ = 2 at T = 5. Acceptance probability?", "e^(−0.4) ≈ 0.670", [["e^(−10) ≈ 0.000045", "Used Δ × T."], ["e^(0.4) ≈ 1.49", "Sign error; probabilities ≤ 1."], ["0.4", "Forgot the exponential."]], "p = exp(−Δ/T).", { cov: ["local-sa"], calc: true, src: L(23) });
A.tf("c-sa-2", "Medium", "As the temperature T decreases, simulated annealing becomes MORE likely to accept worse moves.", false, "Lower T → exp(−Δ/T) smaller → fewer worse moves accepted.", "High T explores; low T is selective.", { cov: ["local-sa"], src: L(23) });
A.match("c-sa-3", "Medium", "Match each SA limitation to its consequence.", [["Cooling too fast", "may behave like hill climbing and get trapped early"], ["Cooling too slow", "may require many iterations before convergence"], ["Parameter sensitivity", "initial temperature and schedule must be chosen carefully"], ["Randomness", "different runs may return different solutions"]], ["guaranteed global optimum in one run"], "SA can escape local optima but guarantees nothing in one run.", { cov: ["local-sa"], src: L(28) });
A.mcq("c-sa-4", "Easy", "Simulated annealing is described in Lecture 3 as a version of…", "stochastic hill climbing where some downhill moves are allowed", [["breadth-first search with a temperature", "Not a tree search."], ["a genetic algorithm with one individual", "No crossover."], ["A* with a cooling heuristic", "No."]], "Fig 4.5 caption.", { cov: ["local-sa"], src: L(24) });
A.multi("c-sa-5", "Medium", "Which are stages of the metallurgical annealing analogy?", [["Heating", true, ""], ["Soaking (hold temperature)", true, ""], ["Slow cooling", true, ""], ["Rapid quenching in ice water", false, "That's the opposite of annealing."]], "Slow cooling → low-energy, stable state.", { cov: ["local-sa"], src: L(20) });
A.blank("c-ga-1", "Easy", "Roulette wheel: fitness 24, 23, 20, 11 (total 78). P(x1) = 24/78 = ______ (2 dp).", "0.31", ["0.308", "0.3077"], "Lecture 3 slide 39.", { cov: ["local-ga"], calc: true, tol: 0.006, src: L(39) });
A.mcq("c-ga-2", "Medium", "Lecture 3 wheel order x4 [0, 0.14), x3 [0.14, 0.40), x2 [0.40, 0.69), x1 [0.69, 1.0]. Random number 0.416 selects…", "x2", [["x3", "0.416 > 0.40."], ["x1", "0.416 < 0.69."], ["x4", "0.416 > 0.14."]], "0.40 ≤ 0.416 < 0.69.", { cov: ["local-ga"], calc: true, src: L(40) });
A.match("c-ga-3", "Easy", "Match each GA operator to what it does.", [["Selection", "choose parents; fitter individuals more likely"], ["Crossover", "combine parts of two parents"], ["Mutation", "randomly alter a small part to keep diversity"], ["Elitism", "copy a few best candidates directly"]], ["sort the population alphabetically"], "Lecture 3 slide 35.", { cov: ["local-ga"], src: L(35) });
A.tf("c-ga-4", "Medium", "In tournament selection, a larger tournament size k increases diversity in the population.", false, "Larger k → higher selection pressure → LESS diversity, faster convergence. Small k (2) keeps more diversity.", "k controls selection pressure.", { cov: ["local-ga"], src: L(36) });
A.multi("c-ga-5", "Medium", "Which factors affect an evolutionary algorithm (Lecture 3)?", [["Population size", true, ""], ["Representation of each individual", true, ""], ["Mutation rate", true, ""], ["Selection and recombination procedures", true, ""], ["The learning rate α", false, "That's gradient descent."]], "Also mixing number and makeup of the next generation.", { cov: ["local-ga"], src: L(32) });
A.mcq("c-ga-6", "Medium", "Tournament (k = 3) with population A70, B55, C40, D30, E20, F10 draws {C, D, E}. Winner?", "C", [["E", "Lowest fitness."], ["A", "A wasn't drawn."], ["D", "40 > 30."]], "Best fitness among the k drawn.", { cov: ["local-ga"], calc: true, src: L(36) });
A.tf("c-ga-7", "Easy", "The genetic algorithm was introduced by Holland in 1975 and uses reproduction, crossover and mutation operators.", true, "Lecture 3 slide 33.", "Inspired by natural evolution.", { cov: ["local-ga"], trap: false });
A.match("c-cmp-1", "Hard", "Which local search method fits each scenario?", [["Smooth landscape, need a quick decent answer", "hill climbing"], ["Many local optima, single candidate, can tune a cooling schedule", "simulated annealing"], ["Huge search space with many good alternatives to explore in parallel", "genetic algorithm"]], ["A* search"], "HC fast, SA escapes optima, GA explores populations.", { cov: ["local-hc", "local-sa", "local-ga"], src: L("14-41") });

export const questions = A.out;
