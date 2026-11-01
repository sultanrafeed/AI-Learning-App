import { makeAuthor } from "./helpers.mjs";
import { table } from "../js/gen-core.js";
const A = makeAuthor("logic", "Lecture 10 (Logical knowledge representation and inference)");
const L = (p) => `Lecture 10, slide ${p}`;
export const coverage = [
  { id: "logic-kb", text: "Knowledge base of facts and rules (P, P⇒Q, Q⇒R; robot route), inference engine, formal languages (syntax/grammar + semantics)", src: L("4-8") },
  { id: "logic-syntax", text: "Propositional logic: propositions, BNF grammar, connectives, precedence ¬ ∧ ∨ ⇒ ⇔, negation/literal/conjunction/disjunction/implication terms", src: L("9-11") },
  { id: "logic-semantics", text: "Semantics: model = truth assignment; truth tables; implication (vacuously true), biconditional", src: L("12-14") },
  { id: "logic-equivalence", text: "Standard logical equivalences (commutativity, associativity, double negation, contraposition, implication & biconditional elimination, De Morgan, distributivity)", src: L("15, 34") },
  { id: "logic-fol", text: "First-order logic: objects, relations/predicates (unary, binary, zero-ary), functions, terms (constants, variables, functions), quantifiers ∀ ∃, order matters, De Morgan for quantifiers, FOL BNF", src: L("16-23") },
  { id: "logic-reasoning", text: "Reasoning (deductive vs inductive) and inference (logical vs machine learning)", src: L("25-26") },
  { id: "logic-model-checking", text: "Entailment α ⊨ β ⇔ M(α) ⊆ M(β); inference problem KB ⊨ γ; model checking process and rain example", src: L("28-32") },
  { id: "logic-theorem", text: "Theorem proving with sound rules: Modus Ponens, And-elimination", src: L("33-36") },
  { id: "logic-resolution", text: "Literal, clause, CNF, satisfiability (SAT), unit & full resolution, proof by contradiction KB ∧ ¬γ, empty clause □", src: L("37-43") },
  { id: "logic-fol-inference", text: "FOL inference by propositionalisation: Universal Instantiation, Existential Instantiation (fresh constant), process and limitations", src: L("45-48") },
];
export const formulas = [
  { name: "Implication elimination", f: "α ⇒ β ≡ ¬α ∨ β", note: "" }, { name: "Biconditional elimination", f: "α ⇔ β ≡ (α ⇒ β) ∧ (β ⇒ α)", note: "" },
  { name: "Contraposition", f: "α ⇒ β ≡ ¬β ⇒ ¬α", note: "" }, { name: "De Morgan", f: "¬(α ∧ β) ≡ ¬α ∨ ¬β ; ¬(α ∨ β) ≡ ¬α ∧ ¬β", note: "" },
  { name: "Quantifier De Morgan", f: "∀x ¬P ⇔ ¬∃x P", note: "" }, { name: "Entailment", f: "α ⊨ β ⇔ M(α) ⊆ M(β)", note: "" },
  { name: "Modus Ponens", f: "α ⇒ β, α ⊢ β", note: "" }, { name: "And-elimination", f: "α ∧ β ⊢ α", note: "" },
  { name: "Resolution", f: "(ℓ₁ ∨ … ∨ ℓₖ), (m₁ ∨ … ∨ mₙ) ⊢ all literals except the complementary pair", note: "" },
  { name: "Refutation", f: "α ⊨ β ⇔ α ∧ ¬β is unsatisfiable", note: "derive □" },
  { name: "Universal Instantiation", f: "∀v α ⊢ Subst({v/g}, α)", note: "any ground term g" }, { name: "Existential Instantiation", f: "∃v α ⊢ Subst({v/k}, α)", note: "k a NEW constant" },
];
export const glossary = [
  { term: "Proposition", def: "Declarative statement that is either true or false (not a question or command)." }, { term: "Literal", def: "Atomic sentence or its negation." },
  { term: "Clause", def: "Disjunction of literals." }, { term: "CNF", def: "Conjunction of clauses." }, { term: "Model", def: "Assignment of a truth value to every proposition symbol." },
  { term: "Entailment", def: "α ⊨ β: β is true in every model where α is true." }, { term: "Satisfiable", def: "True under at least one truth assignment." },
  { term: "Vacuously true", def: "An implication with a false premise is true." }, { term: "Predicate", def: "Names a property or relation; returns true or false." },
  { term: "Term", def: "Expression naming an object (constant, variable, or function applied to terms)." }, { term: "Arity", def: "Number of arguments of a predicate." },
  { term: "Deductive reasoning", def: "General rule applied to a specific case; certain if premises are true." }, { term: "Inductive reasoning", def: "Pattern in observations supports a likely conclusion; probable." },
  { term: "Propositionalisation", def: "Turning a FOL KB into propositional sentences by instantiating quantifiers." },
];
const mc = table(["Model", "P", "Q", "P⇒Q", "KB = P ∧ (P⇒Q)", "Q"], [["1", "T", "T", "T", "T", "T"], ["2", "T", "F", "F", "F", "F"], ["3", "F", "T", "T", "F", "T"], ["4", "F", "F", "T", "F", "F"]]);
export const learn = [
  { id: "logic-pl", title: "Propositional logic: syntax and semantics", cov: ["logic-kb", "logic-syntax", "logic-semantics"], src: L("4-14"),
    hook: "Facts + rules in a knowledge base let an agent derive what to do (rain → wet → indoor route).",
    visual: table(["P", "Q", "P∧Q", "P∨Q", "P⇒Q", "P⇔Q"], [["T", "T", "T", "T", "T", "T"], ["T", "F", "F", "T", "F", "F"], ["F", "T", "F", "T", "T", "F"], ["F", "F", "F", "F", "T", "T"]]),
    formula: [["Precedence", "¬, ∧, ∨, ⇒, ⇔ (highest → lowest)"], ["¬P ∨ Q ∧ R ⇒ S", "= ((¬P) ∨ (Q ∧ R)) ⇒ S"], ["P ⇒ Q", "false only when P = T and Q = F"]],
    example: ["'If 2 + 2 = 5, then x > 3' is TRUE (vacuously: the premise is false)."],
    memory: "Implication is a promise: only broken when the condition happens and the result doesn't.", trap: "P ⇒ Q asserts no causation, and is NOT equivalent to Q ⇒ P.", check: "logic-c-pl-1" },
  { id: "logic-equivalence", title: "Logical equivalences", cov: ["logic-equivalence"], src: L(15),
    hook: "Rewrite rules that never change truth: your CNF toolkit.",
    visual: table(["Name", "Equivalence"], [["Implication elimination", "α ⇒ β ≡ ¬α ∨ β"], ["Biconditional elimination", "α ⇔ β ≡ (α⇒β) ∧ (β⇒α)"], ["Contraposition", "α ⇒ β ≡ ¬β ⇒ ¬α"], ["De Morgan", "¬(α∧β) ≡ ¬α∨¬β; ¬(α∨β) ≡ ¬α∧¬β"], ["Distributivity", "α∨(β∧γ) ≡ (α∨β)∧(α∨γ)"], ["Double negation", "¬¬α ≡ α"]]),
    formula: [["Commutativity / associativity", "of ∧ and ∨"]],
    example: ["¬(P ∧ Q) ⇒ R ≡ ¬¬(P ∧ Q) ∨ R ≡ (P ∧ Q) ∨ R ≡ (P ∨ R) ∧ (Q ∨ R) (CNF)."],
    memory: "De Morgan: flip the operator, negate each part.", trap: "The converse (Q ⇒ P) and inverse (¬P ⇒ ¬Q) are NOT equivalent to P ⇒ Q; only the contrapositive is.", check: "logic-c-eq-1" },
  { id: "logic-fol", title: "First-order logic", cov: ["logic-fol", "logic-fol-inference"], src: L("16-23, 45-48"),
    hook: "FOL talks about objects and ALL/SOME of them in one sentence.",
    visual: table(["Element", "Example", "Returns"], [["Constant", "John, Sydney, 2", "object"], ["Variable", "x", "object"], ["Function", "Father(John), MotherOf(John)", "object"], ["Predicate", "Brother(Richard, John), Student(x)", "true/false"], ["Quantifier", "∀x King(x) ⇒ Person(x); ∃x Student(x)", "–"]]),
    formula: [["∀x ∃y Loves(x,y)", "everyone loves someone"], ["∃y ∀x Loves(x,y)", "someone is loved by everyone (different!)"], ["∀x ¬P ⇔ ¬∃x P", "De Morgan for quantifiers"], ["UI / EI", "∀: any ground term; ∃: one NEW constant"]],
    example: ["'All students study': ∀x Student(x) ⇒ Studies(x).", "EI: ∃x Student(x) ∧ Enrolled(x) → Student(k) ∧ Enrolled(k) with fresh k."],
    memory: "A term names a thing; a sentence is true or false.", trap: "Quantifier order matters; EI must use a NEW constant.", check: "logic-c-fol-1" },
  { id: "logic-inference", title: "Inference: model checking, theorem proving, resolution", cov: ["logic-model-checking", "logic-theorem", "logic-resolution", "logic-reasoning"], src: L("25-43"), visual: mc,
    hook: "Three ways to show KB ⊨ γ: check every model, chain sound rules, or refute the negation.",
    formula: [["Model checking", "list symbols → all models → keep KB-true → check γ"], ["Theorem proving", "Modus Ponens: P, P ⇒ Q ⊢ Q"], ["Refutation", "KB ∧ ¬γ → CNF → resolve → □ ⇒ KB ⊨ γ"]],
    example: ["Rain: only model 1 satisfies KB, and Q is true there → KB ⊨ Q.", "Resolution: C1: P, C2: ¬P ∨ Q, C3: ¬Q → resolve C1, C2 → Q; with C3 → □."],
    memory: "Assume the opposite, find the empty box.", trap: "Negate ONLY the query (KB ∧ ¬γ), not the KB.", check: "logic-c-inf-1" },
];
export const cheat = { title: "Logic cheat sheet",
  rows: [["P ⇒ Q", "≡ ¬P ∨ Q", "false only T⇒F", ""], ["Entailment", "M(KB) ⊆ M(γ)", "no KB-true model with γ false", ""], ["Modus Ponens", "P, P⇒Q ⊢ Q", "", ""], ["Resolution", "drop complementary pair", "□ = contradiction", ""], ["UI / EI", "any ground term / new constant", "", ""]],
  traps: ["Vacuous truth.", "Converse ≠ original.", "Precedence ¬ ∧ ∨ ⇒ ⇔.", "Negate only the query.", "∀∃ order matters."] };

A.mcq("c-pl-1", "Easy", "When is P ⇒ Q false?", "Only when P is true and Q is false", [["When P is false", "Then it's vacuously true."], ["When Q is true", "Always true then."], ["When both are false", "True (vacuously)."]], "Implication = a promise.", { cov: ["logic-semantics"], src: L(13) });
A.tf("c-pl-2", "Medium", "'If 2 + 2 = 5, then x > 3' is false because its premise is false.", false, "A false premise makes the implication VACUOUSLY TRUE.", "False premise → true implication.", { cov: ["logic-semantics"], src: L(13) });
A.mcq("c-pl-3", "Easy", "Which is NOT a proposition?", "Is it raining?", [["It is raining.", "Declarative: T/F."], ["2 + 2 = 5.", "False, but a proposition."], ["Sydney is in Australia.", "True proposition."]], "Questions and commands are not propositions.", { cov: ["logic-syntax"], src: L(9) });
A.match("c-pl-4", "Medium", "Match each term to its definition.", [["Literal", "an atomic sentence or a negated atomic sentence"], ["Conjunction", "two sentences connected by ∧"], ["Disjunction", "two sentences connected by ∨"], ["Implication", "P ⇒ Q, with premise P and conclusion Q"]], ["a sentence that is always false"], "Lecture 10 slide 11.", { cov: ["logic-syntax"], src: L(11) });
A.tf("c-pl-5", "Medium", "P ⇔ Q is true whenever P and Q have the same truth value.", true, "Both T or both F.", "Biconditional = necessary and sufficient.", { cov: ["logic-semantics"], src: L(14), trap: false });
A.multi("c-pl-6", "Medium", "Select ALL correct statements about a knowledge base (Lecture 10).", [["It stores facts and rules as sentences in a representation language", true, ""], ["An inference engine derives new knowledge from it", true, ""], ["From P, P ⇒ Q, Q ⇒ R we can infer R", true, "Chain."], ["It must be written in natural language", false, "A formal language."]], "KB + inference → action.", { cov: ["logic-kb"], src: L("5-7") });
A.mcq("c-pl-7", "Medium", "A formal language's grammar defines ______ and its semantic rules define ______.", "the syntax of legal sentences; their meaning", [["their meaning; the syntax", "Reversed."], ["the truth values; the symbols", "Not quite."], ["the inference engine; the KB", "No."]], "Syntax vs semantics.", { cov: ["logic-kb"], src: L(8) });
A.mcq("c-eq-1", "Medium", "Which sentence is equivalent to P ⇒ Q?", "¬Q ⇒ ¬P", [["Q ⇒ P", "Converse."], ["¬P ⇒ ¬Q", "Inverse."], ["P ∧ ¬Q", "That's ¬(P ⇒ Q)."]], "Contraposition.", { cov: ["logic-equivalence"], src: L(15) });
A.match("c-eq-2", "Medium", "Match each equivalence to its name.", [["α ⇒ β ≡ ¬α ∨ β", "implication elimination"], ["¬(α ∧ β) ≡ ¬α ∨ ¬β", "De Morgan"], ["α ∨ (β ∧ γ) ≡ (α ∨ β) ∧ (α ∨ γ)", "distributivity of ∨ over ∧"], ["¬(¬α) ≡ α", "double-negation elimination"]], ["modus ponens"], "Equivalence table.", { cov: ["logic-equivalence"], src: L(15) });
A.tf("c-eq-3", "Medium", "¬(P ∨ Q) ≡ ¬P ∨ ¬Q.", false, "De Morgan: ¬(P ∨ Q) ≡ ¬P ∧ ¬Q (flip ∨ to ∧).", "Flip the operator.", { cov: ["logic-equivalence"] });
A.mcq("c-fol-1", "Medium", "Which FOL sentence says 'every king is a person'?", "∀x King(x) ⇒ Person(x)", [["∀x King(x) ∧ Person(x)", "Says everything is a king and a person."], ["∃x King(x) ⇒ Person(x)", "Existential: too weak."], ["King(Person)", "Person isn't an object here."]], "∀ pairs with ⇒.", { cov: ["logic-fol"], src: L(22) });
A.tf("c-fol-2", "Medium", "∀x ∃y Loves(x, y) means the same as ∃y ∀x Loves(x, y).", false, "Order matters: 'everyone loves someone' vs 'someone is loved by everyone'.", "Quantifier order.", { cov: ["logic-fol"], src: L(22) });
A.match("c-fol-3", "Medium", "Match each FOL expression to its category.", [["John", "constant symbol (term)"], ["Father(John)", "function applied to a term (names an object)"], ["Brother(Richard, John)", "binary predicate (true/false)"], ["Raining", "zero-ary predicate"]], ["quantifier"], "Term names an object; predicate is true/false.", { cov: ["logic-fol"], src: L("20-21") });
A.mcq("c-fol-4", "Medium", "By De Morgan for quantifiers, 'All cats do not talk' (∀x ¬P(x)) is equivalent to…", "There does not exist a cat that talks (¬∃x P(x))", [["Some cats do not talk (∃x ¬P(x))", "Weaker."], ["All cats talk (∀x P(x))", "Opposite."], ["There exists a cat that talks", "Opposite."]], "∀x ¬P ⇔ ¬∃x P.", { cov: ["logic-fol"], src: L(23) });
A.mcq("c-fol-5", "Hard", "In Existential Instantiation, what must the replacement constant be?", "A new constant that does not appear elsewhere in the KB", [["Any existing constant", "That's Universal Instantiation."], ["A variable", "Must be ground."], ["The constant True", "No."]], "Fresh constant names an unspecified existing object.", { cov: ["logic-fol-inference"], src: L(47) });
A.multi("c-fol-6", "Medium", "Select ALL steps of FOL inference by propositionalisation.", [["Apply Existential Instantiation with fresh constants", true, ""], ["Apply Universal Instantiation to create ground instances", true, ""], ["Treat ground atoms as propositions", true, ""], ["Run a complete propositional inference method", true, ""], ["Delete all predicates", false, "They become ground atoms."]], "EI → UI → propositionalise → infer.", { cov: ["logic-fol-inference"], src: L(48) });
A.tf("c-fol-7", "Medium", "Propositionalisation can be impractical because it may generate very many ground instances, especially with functions or large domains.", true, "Slide 45/48.", "Practical limitation.", { cov: ["logic-fol-inference"], trap: false });
A.match("c-reason-1", "Medium", "Match each reasoning/inference type to its example.", [["Deductive reasoning", "All students must submit; Mia is a student → Mia must submit"], ["Inductive reasoning", "Last five lab-goers passed; Leo attends → Leo will probably pass"], ["Machine learning inference", "Trained flower classifier predicts Iris setosa for new measurements"]], ["Assume the opposite and find a contradiction"], "Deduction certain; induction probable.", { cov: ["logic-reasoning"], src: L("25-26") });
A.tf("c-reason-2", "Easy", "Deductive conclusions are certain if the premises are true, while inductive conclusions are only probable.", true, "Slide 25.", "Key difference.", { cov: ["logic-reasoning"], trap: false });
A.mcq("c-inf-1", "Medium", "KB ⊨ γ holds when…", "γ is true in every model in which KB is true", [["γ is true in at least one model of KB", "That's satisfiability of KB ∧ γ."], ["KB is true in every model of γ", "Reversed: M(KB) ⊆ M(γ)."], ["KB and γ have the same symbols", "Irrelevant."]], "No KB-true model makes γ false.", { cov: ["logic-model-checking"], src: L(28) });
A.blanks("c-inf-2", "Medium", "Rain example: KB = P ∧ (P ⇒ Q). In how many of the 4 models is KB true, and is Q true in them? (number, Yes/No)", ["KB-true models", "Q true there?"], ["1", "Yes"], [["1"], ["Yes", "yes"]], "Only model 1 (P = T, Q = T).", { cov: ["logic-model-checking"], calc: true, visual: mc, src: L(32) });
A.multi("c-inf-3", "Medium", "Select ALL steps of model checking in order.", [["Identify the symbols", true, ""], ["Generate all models", true, ""], ["Find models that satisfy KB", true, ""], ["Check the query in those models", true, ""], ["Negate the KB", false, "Not model checking."]], "List → generate → filter → check.", { cov: ["logic-model-checking"], src: L(31) });
A.mcq("c-inf-4", "Easy", "From P and P ⇒ Q we derive Q. This inference rule is…", "Modus Ponens", [["And-elimination", "That's α ∧ β ⊢ α."], ["Resolution", "Uses clauses."], ["Contraposition", "An equivalence."]], "Theorem proving.", { cov: ["logic-theorem"], src: L(35) });
A.tf("c-inf-5", "Medium", "Theorem proving needs to enumerate all possible models.", false, "Theorem proving builds a proof chain WITHOUT enumerating all models.", "That's its advantage over model checking.", { cov: ["logic-theorem"], src: L(33) });
A.mcq("c-inf-6", "Medium", "To prove KB ⊨ γ by contradiction, which sentence do we show is unsatisfiable?", "KB ∧ ¬γ", [["KB ∧ γ", "Negate the query."], ["¬KB ∧ γ", "Don't negate the KB."], ["¬KB ∨ γ", "That's KB ⇒ γ."]], "Negate only the query.", { cov: ["logic-resolution"], src: L(42) });
A.tf("c-inf-7", "Medium", "Deriving the empty clause □ by resolution proves that the starting clause set is satisfiable.", false, "□ proves the set is UNSATISFIABLE (a contradiction).", "Empty clause = contradiction.", { cov: ["logic-resolution"], src: L(41) });
A.blank("c-inf-8", "Medium", "Resolving clauses (P ∨ Q) and (¬P ∨ R) gives the resolvent ______.", "Q ∨ R", ["Q v R", "QvR", "Q∨R", "R ∨ Q"], "Drop P and ¬P.", { cov: ["logic-resolution"], src: L(41) });
A.mcq("c-inf-9", "Medium", "Which is in conjunctive normal form (CNF)?", "(P ∨ Q) ∧ (¬P ∨ R)", [["(P ∧ Q) ∨ R", "A disjunction of a conjunction."], ["P ⇒ Q", "Contains ⇒."], ["¬(P ∨ Q)", "Negation outside a clause."]], "CNF = AND of ORs of literals.", { cov: ["logic-resolution"], src: L(37) });
A.tf("c-inf-10", "Easy", "P ∧ ¬P is unsatisfiable.", true, "No assignment makes both true.", "Classic contradiction.", { cov: ["logic-resolution"], trap: false });

export const questions = A.out;
