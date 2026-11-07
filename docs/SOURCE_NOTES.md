# Source notes

Where the uploaded materials disagree with each other or with textbooks, the app follows the materials and records the difference here.

1. **Burglary full joint table totals.** Lecture 11 (slide 32) uses N = 99,995,505,198. The spreadsheet `full_joint_probability_table-2.xlsx` computes probabilities with an implied total of 10¹⁰, and two of its counts are rounded (93,670,000,000 and 4,930,000,000). Questions follow Lecture 11 and its CPTs. Every enumeration result is computed from the CPTs: s_B = 0.00059224, s_¬B = 0.00149186, P(B|j,m) = 0.2842.
2. **Receptive field formula.** Lecture 7 only says deeper layers have larger receptive fields (slides 47-48). The formula RF_l = RF_(l−1) + (K_l − 1)·Π(earlier strides) is labelled *(Extra, not in your slides)* wherever it is used.
3. **KNN house example (Lecture 4, slide 61).** The burst "16.68" on the slide equals the mean of the three nearest *distances* ((10.00 + 10.05 + 30.00)/3). The k = 3 *price* prediction is (220 + 260 + 180)/3 = 220. The app teaches the price prediction (220).
4. **Sigmoid-unit gradient sign (Workshop 5, slide 27).** The slide drops the minus sign in ∂Loss/∂w. The app uses the slide 17 update rule wᵢ ← wᵢ + α(y − h)·h(1 − h)·xᵢ, which is the correct descent direction. For backpropagation it uses Δ₅ = 2(ŷ − y)g′(in₅) and w ← w − α·aᵢ·Δⱼ (slides 30-32).
5. **Direct utility estimation, two-trial example (Workshop 6, slide 52).** The slide's averaged arithmetic is inconsistent with its own grid, so the app only uses the clean single-trial values (e.g. U(0,0) = (−0.04)×4 + 1 = 0.84) and computes new reward-to-go questions itself.
6. **Confusion matrix orientation.** Lecture 4 puts PREDICTED on the rows and ACTUAL on the columns. All metric questions use that layout and label it.
7. **Goal test.** UCS and A* questions use the Lecture 2 convention that the goal test happens when a node is *selected for expansion*, with alphabetical tie-breaking and graph search (a cheaper path replaces a frontier entry). Every generated search question states these conventions.
8. **Cross-entropy logarithm.** Lecture 4 writes "log". Generated BCE questions state that the natural log is used. Entropy for decision trees always uses log₂ (bits), as in the step-by-step split file.
9. **Not examined.** Lecture 1 / Module 1, the Module 1 practice quiz, the Python notebooks and Lab 0 are not quizzed. They were used only for question style (the practice quiz mixes MCQ, multiple-answer, dropdown blanks and matching). The one exception is the softmax example from Python warm-up 2 ([2, 1, 0.1] → [0.659, 0.242, 0.099]), which supports the attention topic.
10. **Out of scope per Lecture 11.** Approximate inference (sampling) and dynamic worlds are flagged as optional/out of scope. The app only asks for their names and one-line descriptions.

## Course books (Books 1-3)

- Book 1 (Compiled lecture notes), Book 2 (Exam examples and worked explanations) and Book 3 (AI from zero) were read in full. Questions from them are tagged `Book N ..., p. P`; P is the PDF page shown in Learn → Lecture slides & course books.
- Book 2 Q1-Q432 and the 40-question mixed paper are all in the bank (content/book2a.mjs, book2b.mjs, book2paper.mjs). Long written answers (FOL sentences, CNF, formulations) became MCQ or MATCH so they can be marked automatically; the correct option is the book's answer and the distractors are the mistakes the book warns about.
- Every Book 2 number was re-checked by computer (8-queens costs, convolutions, burglary-network posteriors P(e|j,m) = 0.176, P(b|j) = 0.016, P(b|j,¬m) = 0.0051, attention outputs [0.99, 2.41]). No disagreements with the book were found.
- Book 3's EXTRA boxes (GRU, why divide by √d_k, OOB 37%) are labelled "(Extra, not in your slides)" where they go beyond the lectures.
- Book 1 and Book 3 both confirm the Lecture 11 slide typo already noted above (row (¬b, e, ¬a, j, m) should be 7.09 × 10⁻⁷).
