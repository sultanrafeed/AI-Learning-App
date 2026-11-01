// Registry of all calculation generators by topic.
import { searchQuestion, SEARCH_KINDS } from "./gen-search.js";
import { treeQuestion, TREE_KINDS, mlQuestion, ML_KINDS, localQuestion, LOCAL_KINDS, nnQuestion, NN_KINDS } from "./gen-ml.js";
import { mdpQuestion, MDP_KINDS, cnnQuestion, CNN_KINDS, detectQuestion, DETECT_KINDS } from "./gen-mdp.js";
import { seqQuestion, SEQ_KINDS, attnQuestion, ATTN_KINDS, genaiQuestion, GENAI_KINDS } from "./gen-seq.js";
import { bayesQuestion, BAYES_KINDS, logicQuestion, LOGIC_KINDS } from "./gen-prob.js";

export const GEN = {
  search: { fn: searchQuestion, kinds: SEARCH_KINDS },
  local: { fn: localQuestion, kinds: LOCAL_KINDS },
  ml: { fn: mlQuestion, kinds: ML_KINDS },
  trees: { fn: treeQuestion, kinds: TREE_KINDS },
  nn: { fn: nnQuestion, kinds: NN_KINDS },
  mdp: { fn: mdpQuestion, kinds: MDP_KINDS },
  cnn: { fn: cnnQuestion, kinds: CNN_KINDS },
  detect: { fn: detectQuestion, kinds: DETECT_KINDS },
  seq: { fn: seqQuestion, kinds: SEQ_KINDS },
  attn: { fn: attnQuestion, kinds: ATTN_KINDS },
  genai: { fn: genaiQuestion, kinds: GENAI_KINDS },
  bayes: { fn: bayesQuestion, kinds: BAYES_KINDS },
  logic: { fn: logicQuestion, kinds: LOGIC_KINDS },
};
// Fresh question for runtime practice (new seed each call)
export function freshQuestion(topic, kind, seed) {
  const g = GEN[topic]; if (!g) return null;
  const k = kind || g.kinds[Math.floor(Math.random() * g.kinds.length)];
  const q = g.fn(seed ?? Math.floor(Math.random() * 1e9), k);
  q.id = q.id + "-x"; q.fresh = true; return q;
}
