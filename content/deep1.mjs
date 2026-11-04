// Deeper explanations, typeset formulas (KaTeX) and slide links for Learn Cards: search, local, ml, trees.
// slides: "DECK/page" (images in slides/DECK/page.jpg).
const R = String.raw;
export const deep = {
  "search-problem": {
    slides: ["L2/5", "L2/9", "L2/11", "L2/20"],
    explain: [
      "A search problem is a precise description of a puzzle so a computer can solve it. Think of planning a road trip: you need to know every city you could be in (states), where you start, where you want to end up, which roads leave each city (actions), where each road takes you (transition model) and how long each road is (cost).",
      "The lecture assumes the world is <b>fully observable</b> (you always know which city you are in), <b>deterministic</b> (a road always leads to the same city) and <b>known</b> (you have the full map). Because nothing is uncertain, the answer is simply a fixed list of moves.",
      "A <b>solution</b> is ANY sequence of actions from the start to the goal. The <b>optimal</b> solution is the one with the smallest total cost. In Romania there are many routes from Arad to Bucharest (450, 733, 418, …); only the 418 km route is optimal.",
    ],
    tex: [
      { t: R`\text{Path cost} = \sum_{i=1}^{k} \text{cost}(s_{i-1}, a_i)`, where: [[R`s_0`, "start state (Arad)"], [R`a_i`, "the i-th action (drive along a road)"], [R`\text{cost}(s,a)`, "step cost of doing action a in state s (road length)"]] },
      { t: R`\text{RESULT}(s, a) = s'`, where: [[R`s'`, "the state you reach (transition model)"]] },
    ],
  },
  "search-tree": {
    slides: ["L2/24", "L2/25", "L2/28", "L2/29"],
    explain: [
      "Search algorithms build a <b>search tree</b>. The root is the start state. <b>Expanding</b> a node means asking 'where can I go from here?' and adding every answer as a child.",
      "The <b>frontier</b> is the to-do list: all leaf nodes generated but not yet expanded. Every algorithm in Lecture 2 has the same loop (pick a node from the frontier, test if it is the goal, expand it); they only differ in WHICH node they pick.",
      "<b>Tree search</b> forgets where it has been, so the same city can appear many times (Arad → Sibiu → Arad …). <b>Graph search</b> keeps an <b>explored set</b> and never expands a state twice, which avoids loops and wasted work.",
    ],
    tex: [{ t: R`\text{Frontier} = \{\text{generated nodes}\} \setminus \{\text{expanded nodes}\}`, where: [] }],
  },
  "search-bfs-dfs": {
    slides: ["L2/34", "L2/37", "L2/53"],
    explain: [
      "<b>Breadth-first search</b> explores level by level, like ripples on a pond: all nodes 1 step away, then 2 steps away, and so on. It uses a FIFO queue (first in, first out). It always finds the solution with the fewest actions, but it must remember a whole level, so memory grows as b<sup>d</sup>.",
      "<b>Depth-first search</b> dives down one branch as far as possible before backing up, like exploring a maze by always taking the left-most corridor. It uses a LIFO stack (last in, first out). It needs little memory (one path plus siblings) but it can return an expensive solution and can get lost in infinite branches.",
      "Both are <b>uninformed</b> (blind): they use no estimate of how far the goal is.",
    ],
    tex: [
      { t: R`\text{BFS: time } O(b^d),\; \text{space } O(b^d) \qquad \text{DFS: time } O(b^m),\; \text{space } O(bm)`, where: [[R`b`, "branching factor (max children per node)"], [R`d`, "depth of the shallowest solution"], [R`m`, "maximum depth of the tree"]] },
    ],
  },
  "search-ucs": {
    slides: ["L2/41", "L2/43", "UCS/3", "UCS/5"],
    explain: [
      "Uniform-cost search always expands the node with the <b>cheapest path so far</b>. Imagine water flowing out from Arad along every road at the same speed: it reaches nearby cities first, and it reaches Bucharest first along the shortest road route.",
      "It keeps the frontier in a <b>priority queue</b> ordered by g(n). It only stops when the goal is <b>taken out</b> of the frontier, not when it is first seen, because a cheaper route might still be waiting.",
      "UCS is complete and cost-optimal, but it has no sense of direction: it expands cities in every direction, even away from the goal.",
    ],
    tex: [{ t: R`f(n) = g(n)`, where: [[R`g(n)`, "exact cost of the path from the start to node n"]] }, { t: R`g(\text{Râmnicu Vâlcea}) = 140 + 80 = 220`, where: [] }],
  },
  "search-gbfs": {
    slides: ["L2/44", "L2/45", "GBFS/4", "GBFS/5"],
    explain: [
      "Greedy best-first search always expands the node that <b>looks closest to the goal</b>, using a heuristic h(n), such as the straight-line distance to Bucharest.",
      "It completely ignores how much it has already travelled. That makes it fast and focused, but it can be fooled: from Sibiu it picks Făgăraș (h = 176) over Râmnicu Vâlcea (h = 193) and ends up with a 450 km route instead of 418 km.",
      "A heuristic is just an educated guess of the remaining cost; it is not the true distance.",
    ],
    tex: [{ t: R`f(n) = h(n)`, where: [[R`h(n)`, "estimated cost from n to the goal (e.g. straight-line distance)"]] }],
  },
  "search-astar": {
    slides: ["L2/47", "L2/48", "ASTAR/4", "ASTAR/5", "ASTAR/6"],
    explain: [
      "A* adds the two ideas together: what the path has cost so far (g, like UCS) plus what it probably still costs (h, like greedy). f(n) estimates the total cost of the best route that passes through n.",
      "At each step A* expands the frontier node with the smallest f. Compare EVERY frontier node, not just the newest children: Timișoara (447) stays in the frontier while Sibiu's children are compared.",
      "If h never overestimates (admissible), A* returns the optimal route. Romania: Arad 366 → Sibiu 393 → Râmnicu Vâlcea 413 → Făgăraș 415 → Pitești 417 → Bucharest 418.",
    ],
    tex: [{ t: R`f(n) = g(n) + h(n)`, where: [[R`g(n)`, "path cost from the start to n"], [R`h(n)`, "estimated cost from n to the goal"], [R`f(n)`, "estimated cost of the cheapest solution through n"]] }, { t: R`f(\text{Sibiu}) = 140 + 253 = 393`, where: [] }],
  },
  "search-heuristics": {
    slides: ["L2/50", "L2/51", "L2/52"],
    explain: [
      "<b>Admissible</b> means the heuristic is never too pessimistic: it never says the goal is further away than it really is. Straight-line distance is admissible because a road can never be shorter than the straight line.",
      "<b>Consistent</b> is stronger: the estimate must not drop by more than the cost of a single step. Going from n to a neighbour n′ costs c; your estimate at n can be at most c plus the estimate at n′ (a triangle inequality).",
      "Every consistent heuristic is admissible, but not the other way round. Tree-search A* needs admissible; graph-search A* needs consistent to stay optimal.",
    ],
    tex: [{ t: R`\text{Admissible: } h(n) \le h^*(n)`, where: [[R`h^*(n)`, "the TRUE cheapest cost from n to the goal"]] }, { t: R`\text{Consistent: } h(n) \le c(n, a, n') + h(n')`, where: [[R`c(n,a,n')`, "cost of the step from n to its successor n′"]] }],
  },
  // ---------- local search ----------
  "local-problem": {
    slides: ["L3/4", "L3/6", "L3/8", "L3/10", "L3/11"],
    explain: [
      "Sometimes we don't care HOW we get to a solution, only how GOOD the final answer is. Planning a delivery route over 20 customers has 20! ≈ 2.4 × 10¹⁸ possible routes, far too many to check one by one.",
      "Local search keeps one (or a few) complete candidate solutions and keeps tweaking them to make them better. Each candidate is a <b>state</b>; small tweaks give <b>neighbours</b>; an <b>objective function</b> scores each state.",
      "8-queens: a state lists the row of the queen in each column; the cost counts pairs of queens attacking each other. A goal state has cost 0 (there are 92 of them).",
    ],
    tex: [{ t: R`f = \min\,\text{cost}(x_1,\dots,x_n) \quad\text{or}\quad f = \max\,\text{fit}(x_1,\dots,x_n)`, where: [[R`x_i`, "decision variables (e.g. queen positions)"], [R`\text{low}_i \le x_i \le \text{high}_i`, "constraints on each variable"]] }],
  },
  "local-hc": {
    slides: ["L3/14", "L3/15", "L3/16", "L3/9"],
    explain: [
      "Hill climbing is like walking up a hill in thick fog: you can only see the ground right around you, so you always step in the direction that goes up the most.",
      "It looks at all neighbours, moves to the best one if it is better than where you are, and stops when no neighbour is better. It's fast and simple.",
      "The danger: it stops at the first peak it finds, which may only be a <b>local maximum</b> (a small hill), not the highest mountain.",
    ],
    tex: [{ t: R`\text{if } \text{VALUE}(\text{best neighbour}) \le \text{VALUE}(\text{current}) \text{ then stop}`, where: [] }],
  },
  "local-sa": {
    slides: ["L3/20", "L3/23", "L3/24", "L3/28"],
    explain: [
      "Simulated annealing copies how metal is hardened: heat it, then cool it slowly so the atoms settle into a strong, low-energy arrangement.",
      "Like hill climbing it tries a neighbour, but it will sometimes accept a WORSE move. When the temperature T is high it accepts bad moves often (exploring); as T cools it becomes picky (settling). This lets it escape small hills that would trap hill climbing.",
      "Better moves are always accepted. Worse moves (worse by Δ) are accepted with probability e^(−Δ/T).",
    ],
    tex: [{ t: R`p(\text{accept worse move}) = e^{-\Delta/T}`, where: [[R`\Delta`, "how much worse the neighbour is (energy increase)"], [R`T`, "current temperature from the cooling schedule"]] }, { t: R`\Delta=2,\;T=5:\; p = e^{-0.4} \approx 0.670`, where: [] }],
  },
  "local-ga": {
    slides: ["L3/30", "L3/35", "L3/36", "L3/37", "L3/38", "L3/39", "L3/40"],
    explain: [
      "A genetic algorithm imitates evolution. It keeps a whole <b>population</b> of candidate solutions. Fitter candidates are more likely to become parents; parents swap parts (<b>crossover</b>); children occasionally change randomly (<b>mutation</b>).",
      "<b>Roulette wheel</b>: each individual gets a slice of a wheel proportional to its fitness; spin to pick a parent. <b>Tournament</b>: pick k at random and take the fittest.",
      "Over generations the population drifts toward better solutions while mutation keeps diversity.",
    ],
    tex: [{ t: R`P(i) = \frac{f_i}{\sum_j f_j}`, where: [[R`f_i`, "fitness of individual i"]] }, { t: R`P(x_1) = \frac{24}{24+23+20+11} = \frac{24}{78} \approx 0.31`, where: [] }],
  },
  // ---------- supervised learning ----------
  "ml-types": {
    slides: ["L4/5", "L4/6", "L4/8", "L4/9", "L4/11", "L4/12"],
    explain: [
      "Machine learning means a program gets better at a task by learning from data instead of being told the rules. What kind of learning it is depends on <b>what feedback the data gives</b>:",
      "<b>Supervised learning</b>: every example comes with the correct answer (a label). Like a student with a worked-answer book: show photos labelled 'cat' or 'dog' and it learns a function h(x) that maps inputs to outputs, then predicts labels for new photos.",
      "<b>Unsupervised learning</b>: no answers at all. The program must find structure on its own, e.g. grouping customers into clusters with similar buying habits.",
      "<b>Reinforcement learning</b>: no answer per example, only rewards or punishments after actions (win or lose a game). The agent learns which actions lead to high reward over time.",
      "Within supervised learning: if the output is a category (sunny/cloudy/rainy, COVID positive/negative) it is <b>classification</b>; if it is a number (house price, temperature) it is <b>regression</b>.",
      "Learning assumes the data is <b>i.i.d.</b>: examples are independent of each other and come from the same distribution, so the future looks like the past.",
      "<b>Generalisation</b> = doing well on NEW data. A degree-12 polynomial through every training point <b>overfits</b>: it memorises noise and predicts badly. <b>Ockham's razor</b>: choose the simplest hypothesis that fits the data.",
    ],
    tex: [{ t: R`\text{Data } (x_1,y_1),\dots,(x_N,y_N) \text{ with } y = f(x); \text{ learn } h \approx f`, where: [[R`f`, "the true (unknown) function"], [R`h`, "the hypothesis (model) we learn"], [R`x_{N+1}`, "a new input; predict y = h(x)"]] }],
  },
  "ml-classification-metrics": {
    slides: ["L4/16", "L4/17"],
    explain: [
      "A confusion matrix counts four kinds of outcome. In Lecture 4, <b>rows are what the model PREDICTED</b> and <b>columns are what is ACTUALLY true</b>.",
      "<b>TP</b>: said positive, really positive. <b>FP</b>: said positive, really negative (false alarm). <b>FN</b>: said negative, really positive (a miss). <b>TN</b>: said negative, really negative.",
      "<b>Accuracy</b> = fraction of all predictions that are right. It can mislead: if 99% of emails are not spam, always saying 'not spam' scores 99%.",
      "<b>Precision</b> asks: when the model says positive, how often is it right? Use it when false alarms are costly. <b>Recall</b> asks: of all real positives, how many did it catch? Use it when misses are costly (cancer screening).",
      "<b>F1</b> combines precision and recall (their harmonic mean). <b>ROC</b> plots TPR against FPR for every threshold; <b>AUC</b> is the area under it (1 = perfect, 0.5 = random guessing).",
    ],
    tex: [
      { t: R`\text{Accuracy} = \frac{TP + TN}{TP + FP + FN + TN}`, where: [] },
      { t: R`\text{Precision} = \frac{TP}{TP + FP} \qquad \text{Recall (TPR)} = \frac{TP}{TP + FN}`, where: [] },
      { t: R`F_1 = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}`, where: [] },
      { t: R`\text{Specificity} = \frac{TN}{TN + FP}, \quad \text{FPR} = 1 - \text{Specificity}, \quad \text{Balanced acc.} = \frac{TPR + TNR}{2}`, where: [] },
    ],
  },
  "ml-regression-metrics": {
    slides: ["L4/18"],
    explain: [
      "Regression metrics measure how far numeric predictions are from the truth. Each one looks at the errors y − ŷ differently.",
      "<b>MAE</b>: average size of the error, ignoring sign. Easy to read ('on average we're off by $20,000').",
      "<b>MSE</b>: average of SQUARED errors. Squaring makes big mistakes count much more. <b>RMSE</b> = √MSE brings it back to the original units.",
      "<b>R²</b>: how much better than just predicting the average. 1 = perfect, 0 = no better than the mean, negative = worse than the mean.",
      "<b>MAPE</b>: average error as a percentage of the true value. Scale-free, but breaks when true values are 0 or near 0.",
    ],
    tex: [
      { t: R`\text{MAE} = \frac{1}{N}\sum_{i=1}^{N} |y_i - \hat y_i| \qquad \text{MSE} = \frac{1}{N}\sum_{i=1}^{N} (y_i - \hat y_i)^2`, where: [[R`y_i`, "true value"], [R`\hat y_i`, "predicted value"], [R`N`, "number of examples"]] },
      { t: R`\text{RMSE} = \sqrt{\frac{1}{N}\sum_{i=1}^{N} (y_i - \hat y_i)^2}`, where: [] },
      { t: R`R^2 = 1 - \frac{\sum_i (y_i - \hat y_i)^2}{\sum_i (y_i - \bar y)^2}`, where: [[R`\bar y`, "mean of the true values"]] },
      { t: R`\text{MAPE} = \frac{100\%}{N}\sum_{i=1}^{N} \left|\frac{y_i - \hat y_i}{y_i}\right|`, where: [] },
    ],
  },
  "ml-workflow": {
    slides: ["L4/21", "L4/23", "L4/24", "L4/30"],
    explain: [
      "To get an honest score you must test on data the model has never seen. So you split off a <b>test set</b> first and lock it away.",
      "To choose settings (hyperparameters such as tree depth) you use <b>k-fold cross-validation</b> on the training set only: split it into k folds, train on k − 1 and validate on the remaining one, rotate, and average the k scores.",
      "Pick the best settings, retrain on the full training set, then evaluate ONCE on the test set. Using the test set to tune is <b>data leakage</b> and gives an over-optimistic score.",
    ],
    tex: [{ t: R`\text{CV score} = \frac{1}{k}\sum_{i=1}^{k} S_i`, where: [[R`S_i`, "score on validation fold i"], [R`k`, "number of folds (5 in Lecture 4)"]] }],
  },
  "ml-ensembles": {
    slides: ["L4/43", "L4/44", "L4/47"],
    explain: [
      "An ensemble asks many models and combines their answers, like asking a crowd instead of one person.",
      "<b>Random forest (bagging)</b>: grow many decision trees, each on a random bootstrap sample of the rows and random subsets of features. They vote (classification) or average (regression). Independent trees make different mistakes that cancel out, so variance drops.",
      "<b>Gradient boosting</b>: grow trees one after another; each new tree fixes the errors left by the previous ones. The final prediction is the sum of all the small corrections, scaled by a learning rate.",
    ],
    tex: [{ t: R`\hat y_{\text{RF}} = \text{vote/average}(T_1(x),\dots,T_B(x)) \qquad \hat y_{\text{GB}} = F_0(x) + \eta\sum_{m=1}^{M} T_m(x)`, where: [[R`T_m`, "the m-th tree"], [R`\eta`, "learning rate (shrinkage)"]] }],
  },
  "ml-gd": {
    slides: ["L4/52", "L4/53"],
    explain: [
      "Linear regression fits a straight line ŷ = w₁x + w₀. We want the line with the smallest total squared error (loss).",
      "Gradient descent finds it by walking downhill on the loss surface: compute the slope (gradient) of the loss for each weight and take a small step the OPPOSITE way. The step size α is the learning rate.",
      "Too large α overshoots and can diverge; too small α is slow. Because this loss is convex (a bowl), gradient descent reaches the global minimum.",
    ],
    tex: [
      { t: R`\text{Loss}(h_w) = \sum_j \big(y_j - (w_1 x_j + w_0)\big)^2`, where: [] },
      { t: R`w_i \leftarrow w_i - \alpha \frac{\partial\, \text{Loss}}{\partial w_i}`, where: [[R`\alpha`, "learning rate (step size)"]] },
      { t: R`w_0 \leftarrow w_0 + \alpha\,(y - h_w(x)) \qquad w_1 \leftarrow w_1 + \alpha\,(y - h_w(x))\,x`, where: [] },
    ],
  },
  "ml-logistic": {
    slides: ["L4/54", "L4/55"],
    explain: [
      "Logistic regression is a CLASSIFIER. It computes a linear score z = w·x, then squashes it through the sigmoid into a probability between 0 and 1.",
      "It's trained with binary cross-entropy, which punishes confident wrong answers very heavily (p = 0.99 for a true 0 gives loss ≈ 4.6).",
      "The gradient is beautifully simple: (p − y) × input.",
    ],
    tex: [
      { t: R`p = \sigma(z) = \frac{1}{1 + e^{-z}},\quad z = \mathbf w\cdot\mathbf x`, where: [] },
      { t: R`L = -\big[\,y\ln p + (1 - y)\ln(1 - p)\,\big]`, where: [[R`y`, "true label (0 or 1)"], [R`p`, "predicted P(y = 1)"]] },
      { t: R`\frac{\partial L}{\partial w_j} = (p - y)\,x_j`, where: [] },
    ],
  },
  "ml-knn": {
    slides: ["L4/59", "L4/60", "L4/61", "L4/62"],
    explain: [
      "KNN doesn't build a model. To predict for a new point, it finds the k most similar training points (closest by distance) and lets them decide.",
      "Classification: majority vote of the k neighbours. Regression: average of their values.",
      "Because it is all about distance, features must be scaled; otherwise a feature measured in thousands drowns out one measured in units.",
    ],
    tex: [{ t: R`d(\mathbf x, \mathbf q) = \sqrt{\sum_i (x_i - q_i)^2} \qquad \hat y = \frac{1}{k}\sum_{j \in N_k(\mathbf q)} y_j`, where: [[R`\mathbf q`, "query point"], [R`N_k(\mathbf q)`, "the k nearest training points"]] }],
  },
  "ml-svm": {
    slides: ["L4/67", "L4/70", "L4/71", "L4/73", "L4/79", "L4/82"],
    explain: [
      "An SVM draws the separating line (hyperplane) that leaves the <b>widest possible gap</b> between the two classes, like the widest street you can drive between two groups of houses.",
      "Only the points touching the edges of the street matter; they are the <b>support vectors</b>. A wide margin tends to generalise well.",
      "<b>Soft margin</b>: allow a few points inside the street, paying a penalty C for each. Large C = strict (narrow street, fewer errors), small C = relaxed. <b>Kernels</b> let the SVM draw curved boundaries by implicitly mapping the data into a higher-dimensional space.",
    ],
    tex: [
      { t: R`\mathbf w\cdot\mathbf x + b = 0, \qquad f(\mathbf x) = \operatorname{sign}(\mathbf w\cdot\mathbf x + b), \qquad \text{margin} = \frac{2}{\lVert \mathbf w\rVert}`, where: [] },
      { t: R`\min_{\mathbf w, b}\; \tfrac12 \lVert \mathbf w\rVert^2 \;\text{ s.t. }\; y_i(\mathbf w\cdot\mathbf x_i + b) \ge 1`, where: [] },
      { t: R`K(\mathbf x,\mathbf z) = (\mathbf x\cdot\mathbf z + 1)^p \qquad K(\mathbf x,\mathbf z) = \exp\!\left(-\frac{\lVert\mathbf x - \mathbf z\rVert^2}{2\sigma^2}\right)`, where: [] },
    ],
  },
  // ---------- decision trees ----------
  "trees-structure": {
    slides: ["L4/27", "L4/32", "L4/34"],
    explain: [
      "A decision tree is a flowchart of questions. You start at the top (root), answer a question about one attribute, follow the branch for your answer, and keep going until you reach a leaf that gives the prediction.",
      "Restaurant example: 'How many patrons?' None → don't wait; Some → wait; Full → ask about the wait estimate, and so on.",
      "Learning a tree means choosing which question to ask at each node. Good questions split the examples into groups that are as 'pure' (all one class) as possible. Entropy and Gini measure that purity.",
    ],
    tex: [],
  },
  "trees-entropy": {
    slides: ["L4/35", "L4/36"],
    explain: [
      "Entropy measures <b>how mixed up</b> a group is, i.e. how surprised you'd be by a random example's label.",
      "If every example in a node is 'yes', there's no surprise: entropy 0. If it's exactly half yes and half no, you can't guess at all: entropy is at its maximum, 1 bit (for two classes).",
      "Use log base 2, so the answer is in bits. By convention 0 × log₂0 = 0.",
    ],
    tex: [
      { t: R`H(S) = -\sum_{i} p_i \log_2 p_i`, where: [[R`p_i`, "fraction of examples in class i"]] },
      { t: R`B(q) = -\big[q\log_2 q + (1-q)\log_2(1-q)\big]`, where: [[R`q`, "fraction of positive examples (two classes)"]] },
      { t: R`H([2+,4-]) = -\tfrac13\log_2\tfrac13 - \tfrac23\log_2\tfrac23 = 0.9183`, where: [] },
    ],
  },
  "trees-ig": {
    slides: ["L4/37", "L4/38", "L4/39", "DT/1", "DT/3", "DT/5"],
    explain: [
      "Information gain = how much a question reduces the mixed-up-ness. Entropy before the split minus the (weighted) entropy after.",
      "Weighted means each branch counts in proportion to how many examples go down it: a big messy branch hurts more than a tiny messy one.",
      "ID3 picks the attribute with the highest gain. Patrons: before 1.0, after 0.4591 → gain 0.5409. Type: every branch still 50/50 → gain 0.",
    ],
    tex: [{ t: R`IG(A) = H(\text{parent}) - \sum_{v} \frac{|S_v|}{|S|}\, H(S_v)`, where: [[R`S_v`, "examples with attribute value v (one branch)"], [R`|S_v|/|S|`, "the branch's share of the examples"]] }, { t: R`IG(\text{Patrons}) = 1 - \left[\tfrac{2}{12}\cdot0 + \tfrac{4}{12}\cdot0 + \tfrac{6}{12}\cdot0.9183\right] = 0.5409`, where: [] }],
  },
  "trees-gini": {
    slides: ["L4/40", "L4/41", "DT/4", "DT/6", "DT/7"],
    explain: [
      "<b>What Gini means:</b> pick one example at random from the node, then guess its label at random using the node's own class proportions. Gini is the probability your guess is WRONG. So Gini measures impurity: 0 means you can never be wrong (pure node); bigger means more mixed.",
      "<b>Why it is 1 − Σp²:</b> the chance your guess is RIGHT is: pick class i (probability pᵢ) AND guess class i (probability pᵢ), summed over classes = Σpᵢ². So the chance of being wrong is 1 − Σpᵢ².",
      "<b>What 'binary max = 0.5' means:</b> with only two classes ('binary'), the worst possible mix is 50/50. Then Gini = 1 − 0.5² − 0.5² = 0.5. That is the largest value Gini can reach with two classes, just as entropy's maximum is 1 bit. (With more classes the maximum is higher, e.g. 1 − 1/3 ≈ 0.667 for three equal classes.)",
      "<b>Using it for splits (CART):</b> compute Gini of each branch, weight by branch size, and add: that's the weighted child Gini. The best split has the LOWEST weighted Gini, i.e. the LARGEST Gini reduction (parent − weighted children).",
      "Patrons: parent 0.5 → weighted children 0.2222 → reduction 0.2778. Type: every branch stays 50/50 → weighted Gini 0.5 → reduction 0. So Patrons wins, agreeing with information gain.",
    ],
    tex: [
      { t: R`\text{Gini}(S) = 1 - \sum_{i} p_i^{\,2}`, where: [[R`p_i`, "fraction of examples in class i"]] },
      { t: R`\text{binary: } \text{Gini} = 1 - p^2 - (1-p)^2,\quad \max \text{ at } p = 0.5:\; 1 - 0.25 - 0.25 = 0.5`, where: [] },
      { t: R`\text{Weighted Gini} = \sum_i \frac{|S_i|}{|S|}\,\text{Gini}(S_i) \qquad \text{Reduction} = \text{Gini}(\text{parent}) - \text{Weighted Gini}`, where: [] },
      { t: R`\text{Gini(Full } [2+,4-]) = 1 - \left(\tfrac13\right)^2 - \left(\tfrac23\right)^2 = \tfrac49 = 0.4444`, where: [] },
    ],
  },
};
