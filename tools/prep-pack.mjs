// Builds docs/LECTURER_EXAM_PREP_QA.md: every question from the lecturer's exam-preparation files,
// in the order of the files, with answers. Run: node tools/prep-pack.mjs  (after tools/build.mjs)
import fs from "fs";
import { execFileSync } from "child_process";
const root = new URL("../", import.meta.url).pathname;
const idx = JSON.parse(fs.readFileSync(root + "data/index.json"));
const all = []; for (const t of idx.topics) for (const q of JSON.parse(fs.readFileSync(root + `data/questions/${t.id}.json`))) if (!/-\d{4,}$/.test(q.id)) all.push(q);
const num = (q) => { const m = q.source.match(/Q(\d+)|Quiz (\d)/); return m ? +(m[1] || m[2]) : 99; };
const pick = (re, extraIds = []) => [...all.filter((q) => re.test(q.source)).sort((a, b) => num(a) - num(b) || a.id.localeCompare(b.id)).map((q) => q.id), ...extraIds];
const sections = [
  { title: "Romania fill-in-the-blanks: Greedy best-first deck (Lecture 2)", intro: "Helen posted these three decks as practice for evaluation-function questions in the exam.", ids: pick(/^GBFS Romania/) },
  { title: "Romania fill-in-the-blanks: Uniform-cost search deck", ids: pick(/^UCS Romania/) },
  { title: "Romania fill-in-the-blanks: A* deck", ids: pick(/^A\* Romania/) },
  { title: "Step-by-step sheet: comparing Type vs Patrons with information gain and Gini (Lecture 4)", ids: [...pick(/Comparing two attributes|step-by-step/i), "trees-b2-sheet"] },
  { title: "Key points: convolution filters and parameter counts (Lecture 7)", ids: [...pick(/Key points about convolution/i), "cnn-b2-q210"] },
  { title: "Key points: IoU and non-max suppression (Lecture 7)", ids: [...pick(/Key points about IoU/i), "detect-b2-q223"] },
  { title: "Key points: a simple RNN hidden-state update (Lecture 8)", ids: [...pick(/Key points about a simple RNN/i), "seq-b2-q239", "seq-b2-q242"] },
  { title: "Key points: attention weighted value aggregation (Lecture 8)", ids: [...pick(/Key points about Attention/i), "attn-b2-q243"] },
  { title: "Lecture 8 class polls (Mentimeter)", ids: ["seq-c-intro-3", "seq-b2-q255", "seq-c-grad-1", "seq-b2-q253", "seq-c-nb-1", "seq-b2-q261", "attn-c-intro-1", "attn-b2-q248"] },
  { title: "Lec11 class quiz", ids: pick(/Lec11 class quiz/) },
  { title: "Lec11 class exercise: Enumeration Reasoning", ids: pick(/Enumeration Reasoning MCQ/) },
  { title: "Lec11 class exercise: Inference Calculation", ids: pick(/Inference Calculation MCQs/) },
  { title: "Lec11 class exercise: No-Burglary Expansion", ids: pick(/No_Burglary_Expansion/) },
  { title: "Lec11 class exercise: Marginalisation fill-in-the-blanks", ids: pick(/Marginalisation fill-in-blanks/) },
  { title: "Lec11 class exercise: Causal and Diagnostic Directions", ids: pick(/Causal and Diagnostic Directions/) },
  { title: "Lec11 class exercise: Reasoning Process Matching Quiz", ids: pick(/Reasoning Process Matching Quiz/) },
  { title: "Lec11 class exercise: Reasoning Process Multiple Answer Quiz 1", ids: pick(/Reasoning Process Multiple Answer Quiz 1/) },
  { title: "Lec11 class exercise: Reasoning Process Multiple Answer Quiz 3", ids: pick(/Reasoning Process Multiple Answer Quiz 3/) },
  { title: "Lec11 class exercise: Bayesian Network Reasoning Process Quiz", ids: pick(/Bayesian_Network_Reasoning_Process_Quiz/) },
  { title: "Lecture 11 class activity spreadsheets (experiments table, full joint table)", intro: "The slide says: 'This activity is for preparation for calculation questions in the exam.'", ids: pick(/class activity spreadsheets/) },
  { title: "Canvas 'you should be able to answer these questions' lists, with model answers", md: fs.readFileSync(root + "content/prep-study-questions.md", "utf8") },
  { title: "Appendix: Practice quiz Module 1 (NOT examined; shows the exam's question format)", md: fs.readFileSync(root + "content/prep-module1-quiz.md", "utf8") },
];
for (const x of sections) if (x.ids) x.ids = [...new Set(x.ids)];
const pack = { title: "Lecturer exam-prep files: every question with answers (42172 Introduction to AI)", intro: `Compiled ${new Date().toISOString().slice(0, 10)} from the exam-preparation files the teaching team published: the Romania fill-in-the-blank decks, the step-by-step decision-tree sheet, the five Key points sheets, the Lecture 8 polls, the Lec11 class quiz, the nine Lec11 class exercise decks, the Lecture 11 spreadsheet activities and the Canvas week/module question lists. Questions marked 'Source: Key points ...' with new numbers were written in the same style to practise each rule on the sheet. Every calculation was checked by computer.`, sections };
const tmp = root + ".prep-pack.json"; fs.writeFileSync(tmp, JSON.stringify(pack));
execFileSync("node", [root + "tools/export-questions.mjs", root + "docs/LECTURER_EXAM_PREP_QA.md", "pack:" + tmp], { stdio: "inherit" });
fs.unlinkSync(tmp);
