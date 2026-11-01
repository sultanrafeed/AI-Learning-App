import { makeAuthor } from "./helpers.mjs";
import { table, grid } from "../js/gen-core.js";
const A = makeAuthor("mdp", "Workshop 6 (Reinforcement learning)");
const W = (p) => `Workshop 6, slide ${p}`;
export const coverage = [
  { id: "mdp-meu", text: "Markov assumption; decision theory; utility U(s); deterministic vs non-deterministic outcomes P(s′|s,a); MEU principle (Route A EU 6 vs Route B EU 7)", src: W("5-10") },
  { id: "mdp-def", text: "Sequential decision problems (5 characteristics); MDP definition (fully observable, stochastic, Markovian transitions, additive rewards); elements S, ACTIONS(s), P(s′|s,a), R(s,a,s′); MDP vs RL", src: W("12-22") },
  { id: "mdp-grid", text: "4×3 grid world: 0.8 intended / 0.1 each side, living reward −0.04, terminals +1 (4,3) and −1 (4,2); optimal policy arrows", src: W("20-26") },
  { id: "mdp-utility", text: "Additive vs discounted reward, G = Σ γᵏ R; utility of a policy U^π(s); policy π(s); MDP search tree (state, q-state, transition)", src: W("23-27") },
  { id: "mdp-bellman", text: "Bellman equation U(s) = maxₐ Σ P(s′|s,a)[R + γU(s′)]; Q-function; U(s) = maxₐ Q; π* = argmaxₐ Q", src: W("29-30") },
  { id: "mdp-vi-pi", text: "Value iteration (Bellman update, convergence δ ≤ ε(1−γ)/γ) and policy iteration (policy evaluation without max, policy improvement)", src: W("32-39") },
  { id: "mdp-rl", text: "RL: agent/environment/state/action/reward/policy; exploration vs exploitation; immediate/sparse/intermediate rewards; model-based vs model-free; passive vs active", src: W("42-48") },
  { id: "mdp-passive", text: "Passive RL: direct utility estimation (reward-to-go), ADP (learn P from counts, then Bellman), comparison", src: W("50-57") },
  { id: "mdp-td", text: "Temporal-difference learning U(s) ← U(s) + α[R + γU(s′) − U(s)]; TD vs ADP", src: W("58-60") },
  { id: "mdp-qlearning", text: "Q-learning (model-free TD): Q ← Q + α[R + γ maxₐ′ Q(s′,a′) − Q]; exploratory agent; exploration function f(u,n)", src: W("62-65") },
];
export const formulas = [
  { name: "Discounted return", f: "G = R₁ + γR₂ + γ²R₃ + … = Σ γᵏ Rₖ₊₁", note: "0 ≤ γ < 1 (γ = 1 → additive)" },
  { name: "Expected utility", f: "EU(a|s) = Σₛ′ P(s′|s,a) U(s′)", note: "MEU: choose argmax" },
  { name: "Bellman equation", f: "U(s) = maxₐ Σₛ′ P(s′|s,a)[R(s,a,s′) + γU(s′)]", note: "one equation per state" },
  { name: "Q-function", f: "Q(s,a) = Σₛ′ P(s′|s,a)[R(s,a,s′) + γ maxₐ′ Q(s′,a′)]", note: "U(s) = maxₐ Q(s,a); π*(s) = argmaxₐ Q(s,a)" },
  { name: "Policy evaluation", f: "Uᵢ(s) = Σₛ′ P(s′|s,πᵢ(s))[R + γUᵢ(s′)]", note: "no max: action fixed" },
  { name: "TD update", f: "U(s) ← U(s) + α[R + γU(s′) − U(s)]", note: "passive, model-free" },
  { name: "Q-learning", f: "Q(s,a) ← Q(s,a) + α[R + γ maxₐ′ Q(s′,a′) − Q(s,a)]", note: "active, model-free" },
  { name: "Exploration function", f: "f(u, n) = R⁺ if n < Nₑ else u", note: "optimism for rarely tried actions" },
];
export const glossary = [
  { term: "Markov assumption", def: "The current state depends only on a finite fixed number of previous states (first-order: just the last one)." },
  { term: "MDP", def: "Sequential decision problem for a fully observable, stochastic environment with a Markovian transition model and additive rewards." },
  { term: "Policy (π)", def: "A mapping from every state to an action." }, { term: "Discount factor (γ)", def: "Weight on future rewards, 0 ≤ γ < 1 for discounting." },
  { term: "Q-function", def: "Expected utility of taking action a in state s, then acting optimally." }, { term: "Value iteration", def: "Repeatedly apply the Bellman update to all state utilities until convergence." },
  { term: "Policy iteration", def: "Alternate policy evaluation and policy improvement until the policy stops changing." }, { term: "Exploration / exploitation", def: "Trying new actions vs using actions known to give high reward." },
  { term: "Passive RL", def: "Policy is fixed; learn the utilities of states." }, { term: "Active RL", def: "Agent must decide what to do (explore/exploit), e.g. Q-learning." },
  { term: "ADP", def: "Adaptive dynamic programming: learn P(s′|s,a) from counts, then solve the Bellman equations." }, { term: "Temporal difference", def: "Update a utility toward the observed successor's estimate after each transition." },
  { term: "Reward-to-go", def: "Total (discounted) reward from a state until the end of the trial." },
];
const pol = grid([["→", "→", "→", "+1"], ["↑", "▓", "↑", "−1"], ["↑", "←", "←", "←"]], { caption: "Optimal policy, living reward −0.04 (rows 3→1)" });
export const learn = [
  { id: "mdp-meu", title: "Utility and maximum expected utility", cov: ["mdp-meu"], src: W("5-10"),
    hook: "When outcomes are uncertain, a rational agent maximises EXPECTED utility, not the best case.",
    visual: table(["Route", "Outcomes", "Expected utility"], [["A (short, risky)", "80% U = +10, 20% U = −10", "0.8×10 + 0.2×(−10) = 6"], ["B (long, safe)", "100% U = +7", "7 ← choose"]]),
    formula: [["EU(a|s)", "Σₛ′ P(Result(a) = s′ | a, s) U(s′)"], ["MEU", "action = argmaxₐ EU(a|s)"], ["Markov", "P(Xₜ | X₀:ₜ₋₁) = P(Xₜ | Xₜ₋₁)"]],
    example: ["Robot on a slippery floor: forward = 80% target, 20% slip sideways → weigh both."],
    memory: "Average, don't dream: expected beats best case.", trap: "Choosing Route A because +10 is the best outcome ignores the 20% −10.", check: "mdp-c-meu-1" },
  { id: "mdp-def", title: "What an MDP is", cov: ["mdp-def", "mdp-grid"], src: W("12-22"), visual: grid([["", "", "", "+1"], ["", "▓", "", "−1"], ["START", "", "", ""]], { caption: "4×3 grid world (columns 1-4, rows 1-3)" }),
    hook: "An MDP is the formal model of a sequential decision problem under uncertainty.",
    formula: [["S", "states, start s₀, terminal states"], ["ACTIONS(s)", "Up, Down, Left, Right"], ["P(s′|s,a)", "0.8 intended, 0.1 each perpendicular"], ["R(s,a,s′) or R(s)", "−0.04 per step; +1 / −1 terminals"]],
    example: ["Up from START: 0.8 up, 0.1 left (bumps wall → stays), 0.1 right."],
    memory: "MDP = States, Actions, Transitions, Rewards (+ γ).", trap: "MDP = the PROBLEM model; RL = a LEARNING method used when P or R is unknown.", check: "mdp-c-def-1" },
  { id: "mdp-utility", title: "Discounted reward and utility of a policy", cov: ["mdp-utility"], src: W("23-27"), visual: pol,
    hook: "Rewards now are worth more than rewards later.",
    formula: [["Gₜ = Rₜ₊₁ + γRₜ₊₂ + γ²Rₜ₊₃ + …", "discounted return"], ["γ = 1", "additive reward"], ["U^π(s)", "E[Σ γᵗ R(Sₜ, π(Sₜ), Sₜ₊₁)]"], ["Policy π(s)", "action for EVERY reachable state"]],
    example: ["Rewards 1, 2, 3 with γ = 0.9: G = 1 + 0.9×2 + 0.81×3 = 5.23."],
    memory: "γ shrinks the future: level k of the search tree is weighted γᵏ.", trap: "The first reward gets γ⁰ = 1, not γ.", check: "mdp-c-util-1" },
  { id: "mdp-bellman", title: "Bellman equation and Q-values", cov: ["mdp-bellman"], src: W("29-30"),
    hook: "A state's value = best action's expected (reward now + discounted value next).",
    visual: table(["Next state s′", "P", "R", "U(s′)", "P×(R + γU)"], [["s1", "0.8", "0", "10", "0.8×(0 + 0.9×10) = 7.2"], ["s2", "0.2", "−1", "5", "0.2×(−1 + 4.5) = 0.7"], ["Q(s,a)", "", "", "", "7.9"]]),
    formula: [["Q(s,a) = Σₛ′ P(s′|s,a)[R(s,a,s′) + γU(s′)]", ""], ["U(s) = maxₐ Q(s,a)", ""], ["π*(s) = argmaxₐ Q(s,a)", ""]],
    example: ["If Q(s,Up) = 7.9 and Q(s,Right) = 6.2 then U(s) = 7.9 and π*(s) = Up."],
    memory: "Bellman = Best action, Expected, Look one step ahead.", trap: "Forgetting R inside the brackets, or forgetting to weight by P.", check: "mdp-c-bell-1" },
  { id: "mdp-vi-pi", title: "Value iteration vs policy iteration", cov: ["mdp-vi-pi"], src: W("32-39"),
    hook: "Two ways to solve the Bellman equations.",
    visual: table(["", "Value iteration", "Policy iteration"], [["Updates", "U(s) with max over actions", "evaluate fixed π (no max), then improve"], ["Equations", "non-linear (max)", "evaluation is linear"], ["Stops", "δ ≤ ε(1−γ)/γ", "policy unchanged"], ["Speed", "many cheap sweeps", "often fewer iterations"]]),
    formula: [["VI", "Uᵢ₊₁(s) ← maxₐ Σ P(s′|s,a)[R + γUᵢ(s′)]"], ["PI evaluation", "Uᵢ(s) = Σ P(s′|s,πᵢ(s))[R + γUᵢ(s′)]"], ["PI improvement", "πᵢ₊₁(s) = argmaxₐ Σ P[R + γUᵢ(s′)]"]],
    example: ["n states → n Bellman equations, solved recursively in VI."],
    memory: "VI: Values first, policy at the end. PI: Policy first, refine.", trap: "Policy EVALUATION has no max (the action is fixed by π).", check: "mdp-c-vi-1" },
  { id: "mdp-rl", title: "Reinforcement learning family", cov: ["mdp-rl", "mdp-passive", "mdp-td"], src: W("42-60"),
    hook: "When you don't know P or R, learn by trying.",
    visual: table(["", "Learns", "Needs model?", "Update"], [["Direct utility est.", "U(s)", "no", "average reward-to-go at trial end"], ["ADP", "U(s)", "learns P from counts", "solve Bellman (all successors)"], ["TD", "U(s)", "no", "toward observed successor"], ["Q-learning", "Q(s,a)", "no", "toward r + γ max Q(s′,·)"]]),
    formula: [["Passive", "fixed policy, learn utilities"], ["Active", "choose actions: explore vs exploit"], ["Model-based", "learn P, R then plan"], ["Model-free", "learn U or Q directly"]],
    example: ["Trial (0,0)→…→(3,2): U(0,0) = (−0.04)×4 + 1 = 0.84 (direct utility estimation)."],
    memory: "TD = Take one step, Drift toward it.", trap: "TD adjusts toward the OBSERVED successor; ADP toward ALL successors weighted by probability.", check: "mdp-c-rl-1" },
  { id: "mdp-qlearning", title: "Q-learning", cov: ["mdp-qlearning"], src: W("62-65"),
    hook: "Learn the quality of each action directly, with no model of the world.",
    visual: table(["Quantity", "Value"], [["Q(s,a)", "2.0"], ["r", "1"], ["γ", "0.9"], ["max Q(s′,·)", "max(3, 1, 0) = 3"], ["TD target", "1 + 0.9×3 = 3.7"], ["α = 0.5 update", "2.0 + 0.5×(3.7 − 2.0) = 2.85"]]),
    formula: [["Q(s,a) ← Q(s,a) + α[r + γ maxₐ′ Q(s′,a′) − Q(s,a)]", ""], ["f(u,n)", "R⁺ if n < Nₑ (be curious) else u (be greedy)"]],
    example: ["Exploratory agent: observe s, choose a (explore/exploit), observe r, s′, update Q, repeat."],
    memory: "Q = Quality; use the MAX of the next state.", trap: "Using the average of Q(s′,·) or forgetting γ.", check: "mdp-c-q-1" },
];
export const cheat = { title: "MDP & RL cheat sheet",
  rows: [["Return", "Σ γᵏ Rₖ₊₁", "first reward × 1", ""], ["Bellman", "U = maxₐ Σ P[R + γU′]", "π* = argmax Q", ""], ["Value iteration", "repeat Bellman update", "stop δ ≤ ε(1−γ)/γ", ""], ["Policy iteration", "evaluate (no max) + improve", "stop when π unchanged", ""], ["TD", "U += α(R + γU′ − U)", "passive, model-free", ""], ["Q-learning", "Q += α(r + γ max Q′ − Q)", "active, model-free", ""]],
  traps: ["MEU uses expected, not best-case utility.", "Slips are perpendicular; walls mean stay put.", "Policy evaluation has no max.", "Q-learning uses max over next actions.", "MDP is the model; RL is the learning method."] };

A.mcq("c-meu-1", "Easy", "Route A: 80% U = +10, 20% U = −10. Route B: 100% U = +7. Under MEU the agent chooses…", "Route B (EU 7 > 6)", [["Route A, because its best outcome is +10", "MEU uses expectation, not best case."], ["Route A (EU 8)", "EU(A) = 8 − 2 = 6."], ["Either; they are equal", "6 ≠ 7."]], "EU(A) = 6, EU(B) = 7.", { cov: ["mdp-meu"], calc: true, src: W(10) });
A.tf("c-meu-2", "Medium", "The Markov assumption says the current state depends on ALL previous states.", false, "It depends only on a finite fixed number of previous states (first-order: only the last).", "Markov = short memory.", { cov: ["mdp-meu"], src: W(6) });
A.blank("c-meu-3", "Easy", "In decision theory, a ______ function U(s) assigns a single number expressing the desirability of state s.", "utility", ["Utility"], "Utility = desirability.", { cov: ["mdp-meu"], src: W(7) });
A.multi("c-meu-4", "Medium", "Select ALL correct statements (Workshop 6 background).", [["In a non-deterministic environment the outcome of an action is a random variable", true, "Described by P(s′|s,a)."], ["MEU picks argmaxₐ Σ P(s′|a,s) U(s′)", true, "Definition."], ["Eₜ denotes observable variables and Xₜ unobservable ones", true, "Slide 5."], ["The MEU principle chooses the action whose best outcome is highest", false, "Expected, not best."]], "Uncertain outcomes → expectation.", { cov: ["mdp-meu"], src: W("5-9") });
A.mcq("c-def-1", "Easy", "An MDP is a sequential decision problem for which kind of environment?", "Fully observable, stochastic, Markovian transitions, additive rewards", [["Partially observable and deterministic", "MDPs assume full observability (partial → POMDP)."], ["Fully observable and deterministic", "Deterministic is classical search."], ["Unknown and non-stationary only", "Not the definition."]], "Know the four properties.", { cov: ["mdp-def"], src: W(18) });
A.match("c-def-2", "Medium", "Match the MDP element to its grid-world instance.", [["Transition model P(s′|s,a)", "0.8 intended, 0.1 left, 0.1 right"], ["Reward function", "−0.04 per step, +1/−1 at terminals"], ["Actions", "Up, Down, Left, Right"], ["Terminal states", "(4,3) and (4,2)"]], ["γ = 0.9 always"], "States, actions, transitions, rewards.", { cov: ["mdp-def", "mdp-grid"], src: W("20-21") });
A.tf("c-def-3", "Medium", "MDP and RL are the same thing: both learn a policy from trial and error.", false, "MDP DEFINES the task (states, actions, P, R); RL LEARNS how to act, useful when the model or policy is unknown.", "MDP = problem; RL = method.", { cov: ["mdp-def", "mdp-rl"], src: W(15) });
A.multi("c-def-4", "Medium", "Which are key characteristics of sequential decision problems (Workshop 6)?", [["Sequential nature", true, "Order/timing matter."], ["Uncertainty", true, "Randomness, incomplete info."], ["An objective/utility to optimise", true, "Goal."], ["State and transition dynamics", true, "State evolves."], ["Single one-shot decision", false, "It's a SERIES of decisions."]], "Five characteristics incl. policy.", { cov: ["mdp-def"], src: W(13) });
A.mcq("c-grid-1", "Medium", "In the 4×3 grid world the agent chooses Up. With what probabilities does it move?", "0.8 up, 0.1 left, 0.1 right", [["0.8 up, 0.2 down", "Slips are perpendicular, not backwards."], ["1.0 up", "That's the deterministic world."], ["0.7 up, 0.1 each other direction", "Not the Workshop 6 model."]], "Perpendicular slips.", { cov: ["mdp-grid"], src: W(20) });
A.blank("c-grid-2", "Hard", "Grid world, γ = 1, living reward −0.04. From s, action Up reaches a cell with U = 0.9 (prob 0.8), slips left into a wall (stays in s, U(s) = 0.7, prob 0.1) and slips right to U = 0.6 (prob 0.1). Q(s, Up) = ______ (3 dp).", "0.810", ["0.81"], "Each branch: probability × (step reward + next utility).", { cov: ["mdp-grid", "mdp-bellman"], calc: true, tol: 0.0015, format: "3 decimal places", steps: ["Up: 0.8×(−0.04 + 0.9) = 0.8×0.86 = 0.688", "Left slip (wall, stay): 0.1×(−0.04 + 0.7) = 0.066", "Right slip: 0.1×(−0.04 + 0.6) = 0.056", "Q(s, Up) = 0.688 + 0.066 + 0.056 = 0.810"] });
A.mcq("c-util-1", "Easy", "Rewards 1, 2, 3 (in order) with γ = 0.9. Discounted return?", "5.23", [["6", "No discount."], ["5.4", "Used 0.9 on every reward."], ["4.707", "Discounted the first reward too."]], "1 + 1.8 + 2.43.", { cov: ["mdp-utility"], calc: true });
A.tf("c-util-2", "Medium", "With discount factor γ = 1, the discounted reward reduces to the additive reward.", true, "Workshop 6, slide 24.", "γ = 1: no discount.", { cov: ["mdp-utility"], src: W(24), trap: false });
A.match("c-util-3", "Medium", "Match the MDP search-tree element to its meaning.", [["s (triangle)", "a state"], ["(s, a) (circle)", "a q-state"], ["(s, a, s′)", "a transition with T = P(s′|s,a) and reward R(s,a,s′)"]], ["a terminal utility"], "State → q-state → transition.", { cov: ["mdp-utility"], src: W(27) });
A.mcq("c-util-4", "Medium", "What is a policy in an MDP?", "A mapping that gives an action for every state the agent might reach", [["A fixed sequence of actions from the start", "That's a classical-search solution."], ["The reward function", "Rewards are given by the environment."], ["The transition probabilities", "That's the model."]], "π(s) = recommended action in s.", { cov: ["mdp-utility"], src: W(26) });
A.blank("c-util-5", "Hard", "Rewards 0, 0, 10 (in order) with γ = 0.5. The discounted return G = ______.", "2.5", ["2.50"], "0 + 0.5×0 + 0.25×10.", { cov: ["mdp-utility"], calc: true, tol: 0.001 });
A.mcq("c-bell-1", "Medium", "Which equation is the Bellman equation for utilities in Workshop 6?", "U(s) = maxₐ Σₛ′ P(s′|s,a)[R(s,a,s′) + γU(s′)]", [["U(s) = Σₛ′ P(s′|s,a)U(s′)", "Missing max, reward and γ."], ["U(s) = maxₐ R(s,a) + γ U(s)", "Next-state utilities must be averaged with P."], ["U(s) = Σₐ Σₛ′ [R + γU(s′)]", "Missing probabilities and max."]], "Max over actions of expected (reward + γ next utility).", { cov: ["mdp-bellman"], src: W(29) });
A.tf("c-bell-2", "Medium", "The optimal policy can be read from the Q-function as π*(s) = argmaxₐ Q(s,a).", true, "Workshop 6, slide 30.", "U = max Q; π* = argmax Q.", { cov: ["mdp-bellman"], src: W(30), trap: false });
A.blanks("c-bell-3", "Medium", "Q(s, Left) = 4.2 and Q(s, Right) = 5.1. U(s) = ______ and π*(s) = ______.", ["U(s)", "π*(s)"], ["5.1", "Right"], [["5.1"], ["Right", "right"]], "Take the max value; argmax gives the action.", { cov: ["mdp-bellman"], calc: true });
A.mcq("c-bell-4", "Hard", "Why are the n Bellman equations of value iteration non-linear?", "Because of the max operator over actions", [["Because of the discount factor", "Multiplying by γ is linear."], ["Because probabilities sum to 1", "Linear."], ["Because rewards are negative", "Irrelevant."]], "Max → non-linear → solve iteratively.", { cov: ["mdp-bellman", "mdp-vi-pi"], src: W(33) });
A.mcq("c-vi-1", "Medium", "How does policy evaluation differ from a value-iteration update?", "Policy evaluation has no max: the action in each state is fixed by the policy", [["Policy evaluation ignores rewards", "Rewards are included."], ["Policy evaluation uses γ = 1 always", "γ is the same."], ["Value iteration does not use transition probabilities", "Both use P."]], "Fixed π → linear equations.", { cov: ["mdp-vi-pi"], src: W(37) });
A.tf("c-vi-2", "Medium", "Policy iteration terminates when the policy improvement step yields no change.", true, "Workshop 6, slide 38.", "Then U is a fixed point of the Bellman update → optimal.", { cov: ["mdp-vi-pi"], src: W(38), trap: false });
A.multi("c-vi-3", "Hard", "Select ALL true statements about value and policy iteration.", [["Value iteration repeats the Bellman update until utilities converge", true, "Slide 34."], ["Value iteration stops when δ ≤ ε(1 − γ)/γ", true, "Figure 17.6."], ["Policy iteration alternates evaluation and improvement starting from π₀", true, "Slide 36."], ["Policy iteration's evaluation equations are linear because the policy is fixed", true, "No max."], ["Value iteration requires the policy to be known in advance", false, "It finds the policy at the end."]], "VI: values then policy; PI: policy evaluation + improvement.", { cov: ["mdp-vi-pi"], src: W("32-39") });
A.match("c-vi-4", "Medium", "Match the algorithm to its update.", [["Value iteration", "Uᵢ₊₁(s) ← maxₐ Σ P[R + γUᵢ(s′)]"], ["Policy evaluation", "Uᵢ₊₁(s) ← Σ P(s′|s,πᵢ(s))[R + γUᵢ(s′)]"], ["Policy improvement", "π(s) ← argmaxₐ Σ P[R + γU(s′)]"]], ["U(s) ← U(s) + α(R − U(s))"], "Max (VI), no max (evaluation), argmax (improvement).", { cov: ["mdp-vi-pi"], src: W("33-38") });
A.blank("c-vi-5", "Easy", "If an MDP has n states, value iteration solves ______ Bellman equations (one per state).", "n", [], "One equation per state.", { cov: ["mdp-vi-pi"], src: W(33) });
A.mcq("c-rl-1", "Medium", "TD vs ADP: which is correct?", "TD adjusts a state toward its observed successor; ADP toward all possible successors weighted by probability", [["TD learns a transition model; ADP does not", "Reversed."], ["ADP makes one adjustment per transition; TD makes many", "Reversed."], ["They converge to different values", "TD converges to ADP's values as trials → ∞."]], "TD = crude but efficient approximation to ADP.", { cov: ["mdp-td", "mdp-passive"], src: W(60) });
A.match("c-rl-2", "Medium", "Match the RL term to its definition.", [["Exploration", "trying new actions to discover their effects"], ["Exploitation", "leveraging known actions that yield high rewards"], ["Passive RL", "fixed policy, learn state utilities"], ["Active RL", "decide what to do via exploration and exploitation"]], ["copying an expert's actions exactly"], "Balance exploration and exploitation.", { cov: ["mdp-rl"], src: W("43-48") });
A.tf("c-rl-3", "Medium", "Direct utility estimation updates utilities after every single transition.", false, "It learns nothing until the END of the trial (averages observed reward-to-go). TD updates every transition.", "Direct estimation converges very slowly.", { cov: ["mdp-passive"], src: W(50) });
A.blank("c-rl-4", "Easy", "First trial (γ = 1): state (0,0) is followed by 4 steps of −0.04 and then +1. Its reward-to-go is ______.", "0.84", [], "(−0.04)×4 + 1.", { cov: ["mdp-passive"], calc: true, tol: 0.001, src: W(51) });
A.multi("c-rl-5", "Medium", "Which are model-free methods?", [["Q-learning", true, "Learns Q(s,a) directly."], ["TD learning", true, "No transition model needed."], ["ADP", false, "Learns the transition model."], ["Direct utility estimation", true, "Averages returns; no P."], ["Value iteration with a known model", false, "Planning with a model."]], "Model-free = no P(s′|s,a).", { cov: ["mdp-rl", "mdp-passive"], src: W(48) });
A.mcq("c-rl-6", "Medium", "Sparse rewards means…", "the agent gets no informative reward signal in most states", [["rewards after every transition", "That's immediate rewards."], ["rewards are always negative", "No."], ["the reward function is unknown", "Unknown ≠ sparse."]], "Intermediate rewards make learning easier.", { cov: ["mdp-rl"], src: W(46) });
A.blank("c-rl-7", "Medium", "ADP: Right was executed 4 times in (3,3), reaching (4,3) twice and (3,2) twice. P((3,2) | (3,3), Right) = ______.", "0.5", ["1/2", "0.50"], "2/4.", { cov: ["mdp-passive"], calc: true, tol: 0.001, src: W(56) });
A.tf("c-td-1", "Medium", "TD learning needs a transition model P(s′|s,a) to perform its updates.", false, "TD doesn't: the environment supplies the connection through observed transitions.", "Model-free.", { cov: ["mdp-td"], src: W(58) });
A.mcq("c-td-2", "Easy", "In the TD update U(s) ← U(s) + α[R + γU(s′) − U(s)], what is α?", "The learning rate", [["The discount factor", "That's γ."], ["The reward", "That's R."], ["The exploration probability", "Not in this formula."]], "α = step size.", { cov: ["mdp-td"], src: W(58) });
A.mcq("c-q-1", "Medium", "Q(s,a) = 2, α = 0.5, r = 1, γ = 0.9, Q(s′,·) = [3, 1, 0]. The Q-learning update gives…", "2.85", [["3.7", "That's the TD target."], ["2.1", "Used the average of Q(s′,·) (1.333) instead of the max."], ["3.0", "Forgot γ: 2 + 0.5(1 + 3 − 2)."]], "Target 1 + 0.9×3 = 3.7.", { cov: ["mdp-qlearning"], calc: true, src: W(63) });
A.tf("c-q-2", "Medium", "Q-learning needs the transition model both for learning and for choosing actions.", false, "Q-learning is model-free for learning AND action selection (Workshop 6, slide 63).", "Q replaces U + model.", { cov: ["mdp-qlearning"], src: W(63) });
A.mcq("c-q-3", "Hard", "The exploration function f(u, n) = R⁺ if n < Nₑ else u. What does it achieve?", "Untried actions look optimistic (R⁺) until tried Nₑ times, encouraging exploration", [["It always chooses the greedy action", "Only once n ≥ Nₑ."], ["It decays the learning rate", "That's α(n)."], ["It removes rarely tried actions", "It favours them."]], "Optimism in the face of uncertainty.", { cov: ["mdp-qlearning"], src: W(65) });
A.multi("c-q-4", "Medium", "Select ALL steps of the exploratory Q-learning agent loop.", [["Observe the current state s", true, "Step 1."], ["Select an action (explore or exploit)", true, "Step 2."], ["Execute it and observe R and s′", true, "Step 3."], ["Update Q(s,a) with target r + γ maxₐ′ Q(s′,a′)", true, "Step 4."], ["Estimate P(s′|s,a) from counts", false, "That's ADP."]], "Observe → act → observe → update → repeat.", { cov: ["mdp-qlearning"], src: W(64) });

export const questions = A.out;
