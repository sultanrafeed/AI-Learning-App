# Lecturer exam-prep files: every question with answers (42172 Introduction to AI)

Compiled 2026-11-10 from the exam-preparation files the teaching team published: the Romania fill-in-the-blank decks, the step-by-step decision-tree sheet, the five Key points sheets, the Lecture 8 polls, the Lec11 class quiz, the nine Lec11 class exercise decks, the Lecture 11 spreadsheet activities and the Canvas week/module question lists. Questions marked 'Source: Key points ...' with new numbers were written in the same style to practise each rule on the sheet. Every calculation was checked by computer.

## Contents

1. Romania fill-in-the-blanks: Greedy best-first deck (Lecture 2) (5 questions)
2. Romania fill-in-the-blanks: Uniform-cost search deck (5 questions)
3. Romania fill-in-the-blanks: A* deck (5 questions)
4. Step-by-step sheet: comparing Type vs Patrons with information gain and Gini (Lecture 4) (17 questions)
5. Key points: convolution filters and parameter counts (Lecture 7) (12 questions)
6. Key points: IoU and non-max suppression (Lecture 7) (23 questions)
7. Key points: a simple RNN hidden-state update (Lecture 8) (10 questions)
8. Key points: attention weighted value aggregation (Lecture 8) (9 questions)
9. Lecture 8 class polls (Mentimeter) (8 questions)
10. Lec11 class quiz (3 questions)
11. Lec11 class exercise: Enumeration Reasoning (5 questions)
12. Lec11 class exercise: Inference Calculation (2 questions)
13. Lec11 class exercise: No-Burglary Expansion (2 questions)
14. Lec11 class exercise: Marginalisation fill-in-the-blanks (5 questions)
15. Lec11 class exercise: Causal and Diagnostic Directions (2 questions)
16. Lec11 class exercise: Reasoning Process Matching Quiz (2 questions)
17. Lec11 class exercise: Reasoning Process Multiple Answer Quiz 1 (2 questions)
18. Lec11 class exercise: Reasoning Process Multiple Answer Quiz 3 (2 questions)
19. Lec11 class exercise: Bayesian Network Reasoning Process Quiz (2 questions)
20. Lecture 11 class activity spreadsheets (experiments table, full joint table) (5 questions)
21. Canvas 'you should be able to answer these questions' lists, with model answers
22. Appendix: Practice quiz Module 1 (NOT examined; shows the exam's question format)


---

# 1. Romania fill-in-the-blanks: Greedy best-first deck (Lecture 2)

Helen posted these three decks as practice for evaluation-function questions in the exam.

### 1.1. [BLANK · Easy]

Greedy best-first search ranks each frontier node n using f(n) = ______.

**Answer:** h(n)
(Also accepted: h)

**Takeaway:** Ignore the path cost already travelled.

*Source: GBFS Romania fill-in-blanks Q1*

### 1.2. [BLANK · Easy · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

The straight-line distance from Arad to Bucharest is h(Arad) = 366. For greedy search, f(Arad) = ______.

**Answer:** 366

**Takeaway:** For greedy, f and h are the same.

*Source: GBFS Romania fill-in-blanks Q2*

### 1.3. [MCQ · Easy · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

From Arad: h(Sibiu) = 253, h(Timișoara) = 329, h(Zerind) = 374. Greedy search expands which node next?

  A. Zerind
  B. Timișoara
  C. Arad again
  D. Sibiu

**Answer:** D. Sibiu

**Option notes:**
  - A: Zerind has the LOWEST road cost (75) but the highest h.
  - B: 329 > 253.
  - C: Arad has already been expanded.

**Takeaway:** Choose the smallest heuristic value.

*Source: GBFS Romania fill-in-blanks Q3*

### 1.4. [BLANKS · Medium · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

After expanding Sibiu: h(Făgăraș) = 176, h(Râmnicu Vâlcea) = 193, h(Oradea) = 380. The next node is ______ because its f-value is ______.

  (1) node = ____
  (2) f = ____

**Answer:** node = Făgăraș; f = 176

**Takeaway:** Greedy always chooses the lowest h.

*Source: GBFS Romania fill-in-blanks Q4*

### 1.5. [BLANKS · Medium]

One frontier node has g = 400, h = 50; another has g = 100, h = 80. Greedy selects the node with h = ______, ignoring ______ (one symbol).

  (1) h = ____
  (2) ignored = ____

**Answer:** h = 50; ignored = g

**Takeaway:** The greedy evaluation has no accumulated path-cost term.

*Source: GBFS Romania fill-in-blanks Q5*


---

# 2. Romania fill-in-the-blanks: Uniform-cost search deck



### 2.1. [BLANK · Easy]

Uniform-cost search ranks frontier nodes using f(n) = ______.

**Answer:** g(n)
(Also accepted: g, path cost)

**Takeaway:** UCS: no heuristic term.

*Source: UCS Romania fill-in-blanks Q1*

### 2.2. [BLANKS · Easy · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

Road costs from Arad: Zerind 75, Timișoara 118, Sibiu 140. UCS expands ______ next with f = ______.

  (1) node = ____
  (2) f = ____

**Answer:** node = Zerind; f = 75

**Takeaway:** Lowest cumulative path cost first.

*Source: UCS Romania fill-in-blanks Q2*

### 2.3. [BLANK · Easy · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

Arad → Sibiu costs 140 and Sibiu → Râmnicu Vâlcea costs 80. g(Râmnicu Vâlcea) = ______.

**Answer:** 220

**Takeaway:** Add every road cost from the start.

*Source: UCS Romania fill-in-blanks Q3*

### 2.4. [MCQ · Medium · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

A frontier route to Făgăraș has g = 239 and one to Râmnicu Vâlcea has g = 220 (h(F) = 176, h(RV) = 193). Which does UCS expand first and why?

  A. Făgăraș, because 239 + 176 = 415 is the smallest f
  B. Both together, since they are siblings
  C. Făgăraș, because h = 176 < 193
  D. Râmnicu Vâlcea, because 220 < 239

**Answer:** D. Râmnicu Vâlcea, because 220 < 239

**Option notes:**
  - A: That mixes in h; UCS uses g only (and A* would pick RV with 413).
  - B: One node is popped at a time.
  - C: UCS ignores h.

**Takeaway:** Heuristic distance is irrelevant to UCS.

*Source: UCS Romania fill-in-blanks Q4*

### 2.5. [BLANK · Medium · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

When Bucharest is removed from the UCS frontier in the Romania example, f(Bucharest) = ______.

**Answer:** 418

**Takeaway:** For UCS, the goal's value is its total path cost.

*Source: UCS Romania fill-in-blanks Q5*


---

# 3. Romania fill-in-the-blanks: A* deck



### 3.1. [BLANKS · Easy]

Build the A* evaluation function: f(n) = ______ + ______.

  (1) first term = ____
  (2) second term = ____

**Answer:** first term = g(n); second term = h(n)

**Takeaway:** A* uses both the accumulated path cost and the heuristic estimate.

*Source: A* Romania fill-in-blanks Q1*

### 3.2. [BLANKS · Easy · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

At Arad, g(Arad) = 0 and h(Arad) = 366. f(Arad) = ______ + ______ = ______.

  (1) g = ____
  (2) h = ____
  (3) f = ____

**Answer:** g = 0; h = 366; f = 366

**Takeaway:** Apply f(n) = g(n) + h(n).

*Source: A* Romania fill-in-blanks Q2*

### 3.3. [BLANKS · Medium · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

From Arad: Sibiu g=140, h=253; Timișoara g=118, h=329; Zerind g=75, h=374. A* expands ______ next because its f-value is ______.

  (1) node = ____
  (2) f = ____

**Answer:** node = Sibiu; f = 393

**Takeaway:** Timișoara 447, Zerind 449.

*Source: A* Romania fill-in-blanks Q3*

### 3.4. [BLANKS · Medium · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

Via Sibiu: Râmnicu Vâlcea g=220, h=193; Făgăraș g=239, h=176. A* chooses ______ because 220 + 193 = ______.

  (1) node = ____
  (2) f = ____

**Answer:** node = Râmnicu Vâlcea; f = 413

**Takeaway:** f(Făgăraș) = 415 > 413.

*Source: A* Romania fill-in-blanks Q4*

### 3.5. [BLANKS · Medium · calculation]

[Diagram as text] Edges (label in brackets): Arad — Sibiu (140); Arad — Timișoara (118); Arad — Zerind (75); Zerind — Oradea (71); Oradea — Sibiu (151); Sibiu — Făgăraș (99); Sibiu — Râmnicu V. (80); Râmnicu V. — Pitești (97); Râmnicu V. — Craiova (146); Pitești — Craiova (138); Pitești — Bucharest (101); Făgăraș — Bucharest (211); Timișoara — Lugoj (111); Lugoj — Mehadia (70); Mehadia — Drobeta (75); Drobeta — Craiova (120); Bucharest — Giurgiu (90); Bucharest — Urziceni (85); Urziceni — Hirsova (98); Hirsova — Eforie (86); Urziceni — Vaslui (142); Vaslui — Iasi (92); Iasi — Neamt (87)
    Heuristic values: Arad h=366, Bucharest h=0, Craiova h=160, Drobeta h=242, Eforie h=161, Făgăraș h=176, Giurgiu h=77, Hirsova h=151, Iasi h=226, Lugoj h=244, Mehadia h=241, Neamt h=234, Oradea h=380, Pitești h=100, Râmnicu V. h=193, Sibiu h=253, Timișoara h=329, Urziceni h=80, Vaslui h=199, Zerind h=374
Romania (Lecture 2). Blue numbers = road costs; h = straight-line distance to Bucharest.

Complete the optimal A* route: Arad → Sibiu → ______ → ______ → Bucharest; total cost = ______.

  (1) city 3 = ____
  (2) city 4 = ____
  (3) cost = ____

**Answer:** city 3 = Râmnicu Vâlcea; city 4 = Pitești; cost = 418

**Working:**
  - g(RV) = 220, g(P) = 220 + 97 = 317, g(B) = 317 + 101 = 418.

**Takeaway:** Final road costs 97 (RV→P) and 101 (P→B).

*Source: A* Romania fill-in-blanks Q5*


---

# 4. Step-by-step sheet: comparing Type vs Patrons with information gain and Gini (Lecture 4)



### 4.1. [BLANKS · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Helen's step-by-step sheet (Restaurant data, 6 yes / 6 no). Type splits 1/1, 1/1, 2/2, 2/2; Patrons splits None 0/2, Some 4/0, Full 2/4. Fill in (4 d.p.).

  (1) IG(Type) = ____
  (2) IG(Patrons) = ____
  (3) Gini reduction Type = ____
  (4) Gini reduction Patrons = ____

**Answer:** IG(Type) = 0; IG(Patrons) = 0.5409; Gini reduction Type = 0; Gini reduction Patrons = 0.2778

**Working:**
  - Parent H = 1, Gini = 0.5.
  - Type: every branch 50/50 → weighted H = 1 → IG 0; weighted Gini 0.5 → reduction 0.
  - Patrons: H(Full) = B(1/3) = 0.9183; weighted 6/12 × 0.9183 = 0.4591; IG = 0.5409.
  - Gini(Full) = 1 − 1/9 − 4/9 = 0.4444; weighted 0.2222; reduction 0.2778.

**Takeaway:** Patrons wins under both criteria.

*Source: Book 2 (Exam examples), §4.1 step-by-step sheet, p. 16*

### 4.2. [MCQ · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Type gives IG = 0 and weighted Gini 0.5; Patrons gives IG = 0.5409 and weighted Gini 0.2222. Which attribute is chosen?

  A. Type by both criteria
  B. Neither: the tree stops
  C. Patrons by both criteria
  D. Patrons by IG, Type by Gini

**Answer:** C. Patrons by both criteria

**Option notes:**
  - A: Type removes no uncertainty.
  - B: Patrons gives a clear gain.
  - D: Lower weighted Gini (0.2222) is better → Patrons.

**Takeaway:** Highest IG and lowest weighted Gini both pick Patrons.

*Source: Comparing two attributes to split (Type vs Patrons)*

### 4.3. [MULTI · Medium]

Order of steps when comparing two attributes (the step-by-step file). Select ALL steps that are part of the process. (Select ALL that apply.)

  A. Compute the parent's entropy and Gini
  B. Pick the attribute with the most branches
  C. Compute each branch's entropy/Gini
  D. Weight each branch by |subset|/|parent|
  E. Subtract from the parent to get IG / Gini reduction

**Answer:** A. Compute the parent's entropy and Gini; C. Compute each branch's entropy/Gini; D. Weight each branch by |subset|/|parent|; E. Subtract from the parent to get IG / Gini reduction

**Option notes:**
  - A: Correct: Step 2 of the file.
  - B: Incorrect: Not a criterion.
  - C: Correct: Per subset.
  - D: Correct: Weighted child value.
  - E: Correct: Final comparison.

**Takeaway:** Parent → branches → weight → subtract → compare.

*Source: Comparing two attributes to split (Type vs Patrons)*

### 4.4. [BLANK · Medium · calculation]

Entropy of [2+, 4−] in bits (4 decimal places).

**Answer:** 0.9183
(Also accepted: 0.918)

**Takeaway:** −(1/3)log₂(1/3) − (2/3)log₂(2/3).

*Source: Comparing two attributes to split (Type vs Patrons)*

### 4.5. [MCQ · Easy · calculation]

Gini index of [2+, 4−]?

  A. 0.9183
  B. 0.4444
  C. 0.5556
  D. 0.2222

**Answer:** B. 0.4444

**Option notes:**
  - A: That's entropy.
  - C: That's Σp² (forgot 1 −).
  - D: That's the WEIGHTED Gini (× 6/12).

**Takeaway:** 1 − (1/3)² − (2/3)² = 4/9.

*Source: Comparing two attributes to split (Type vs Patrons)*

### 4.6. [BLANKS · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Patrons split: weighted child Gini = ______ and Gini reduction = ______ (4 dp).

  (1) weighted Gini = ____
  (2) reduction = ____

**Answer:** weighted Gini = 0.2222; reduction = 0.2778

**Takeaway:** 0.5 − 0.2222 = 0.2778.

*Source: Comparing two attributes to split (Type vs Patrons)*

### 4.7. [BLANK · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Restaurant data: IG(Patrons) = 1 − [2/12·0 + 4/12·0 + 6/12·0.9183] = ______ bits (4 dp).

**Answer:** 0.5409
(Also accepted: 0.541)

**Takeaway:** Weighted child entropy 0.4591.

*Source: Comparing two attributes to split (Type vs Patrons)*

### 4.8. [BLANK · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Restaurant data: every Type branch (French 1/1, Italian 1/1, Thai 2/2, Burger 2/2) is 50/50. IG(Type) = ______.

**Answer:** 0
(Also accepted: 0.0, 0.0000)

**Takeaway:** Weighted child entropy = 1 = parent entropy.

*Source: Comparing two attributes to split (Type vs Patrons)*

### 4.9. [MULTI · Hard · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Parent [6+, 6−] split by Patrons into None [0+,2−], Some [4+,0−], Full [2+,4−]. Select ALL correct values. (Select ALL that apply.)

  A. H(parent) = 1.0
  B. Weighted child entropy = 0.4591
  C. IG = 0.4591
  D. Weighted child Gini = 0.2222
  E. H(None) = H(Some) = 0

**Answer:** A. H(parent) = 1.0; B. Weighted child entropy = 0.4591; D. Weighted child Gini = 0.2222; E. H(None) = H(Some) = 0

**Option notes:**
  - A: Correct: 50/50.
  - B: Correct: 6/12 × 0.9183.
  - C: Incorrect: IG = 1 − 0.4591 = 0.5409.
  - D: Correct: 6/12 × 0.4444.
  - E: Correct: Pure.

**Takeaway:** Do the parent, children, weight, subtract.

*Source: Comparing two attributes to split (Type vs Patrons)*

### 4.10. [BLANKS · Hard · calculation]

Same method, new attribute. Parent 6+/6−. Attribute Hungry splits into Yes 7 (5+,2−) and No 5 (1+,4−). IG(Hungry) = ___ and Gini reduction = ___ (4 d.p.).

  (1) IG = ____
  (2) Gini reduction = ____

**Answer:** IG = 0.1957; Gini reduction = 0.1286

**Working:**
  - H(Yes) = 0.8631, H(No) = 0.7219
  - weighted = 7/12 × 0.8631 + 5/12 × 0.7219 = 0.8043 → IG = 0.1957
  - Gini(Yes) = 1 − (5/7)² − (2/7)² = 0.4082; Gini(No) = 0.32
  - weighted = 7/12 × 0.4082 + 5/12 × 0.32 = 0.3714 → reduction 0.1286

**Takeaway:** B(5/7) = 0.8631, B(1/5) = 0.7219.

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*

### 4.11. [BLANKS · Easy · calculation]

Step 1 of the sheet: parent set of 12 (6 positive: 1, 3, 4, 6, 8, 12; 6 negative). Entropy(Parent) = ___ bit; Gini(Parent) = ___ (4 d.p.).

  (1) entropy = ____
  (2) Gini = ____

**Answer:** entropy = 1.0000; Gini = 0.5000

**Takeaway:** p(pos) = p(neg) = 0.5.

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*

### 4.12. [BLANKS · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Patrons branches: None 2 (0+,2−), Some 4 (4+,0−), Full 6 (2+,4−). H(None) = ___, H(Some) = ___, H(Full) = ___ (4 d.p.); weighted child entropy = ___; IG(Patrons) = ___.

  (1) H(None) = ____
  (2) H(Some) = ____
  (3) H(Full) = ____
  (4) weighted = ____
  (5) IG = ____

**Answer:** H(None) = 0; H(Some) = 0; H(Full) = 0.9183; weighted = 0.4591; IG = 0.5409

**Working:**
  - H(Full) = −(1/3)log₂(1/3) − (2/3)log₂(2/3) = 0.9183
  - weighted = 6/12 × 0.9183 = 0.4591
  - IG = 1 − 0.4591 = 0.5409

**Takeaway:** Pure branches have entropy 0.

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*

### 4.13. [BLANKS · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Patrons Gini: Gini(Full) = ___; weighted child Gini = ___; Gini reduction = ___ (4 d.p.).

  (1) Gini(Full) = ____
  (2) weighted = ____
  (3) reduction = ____

**Answer:** Gini(Full) = 0.4444; weighted = 0.2222; reduction = 0.2778

**Takeaway:** 1 − (1/3)² − (2/3)².

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*

### 4.14. [MCQ · Easy]

Final step of the sheet: which attribute is picked, and by which criteria?

  A. Type, because it has more values
  B. neither: the gains tie
  C. Patrons, by both information gain (0.5409 > 0) and Gini reduction (0.2778 > 0)
  D. Patrons by IG but Type by Gini

**Answer:** C. Patrons, by both information gain (0.5409 > 0) and Gini reduction (0.2778 > 0)

**Option notes:**
  - A: More values does not mean more gain.
  - B: They do not tie.
  - D: Both criteria agree.

**Takeaway:** Pick the larger gain/reduction.

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*

### 4.15. [BLANKS · Medium · calculation]

Type branches: French 2 (1+,1−), Italian 2 (1+,1−), Thai 4 (2+,2−), Burger 4 (2+,2−). Each branch entropy = ___; weighted child entropy = ___; IG(Type) = ___.

  (1) branch H = ____
  (2) weighted = ____
  (3) IG = ____

**Answer:** branch H = 1; weighted = 1; IG = 0

**Working:**
  - H = −0.5 log₂0.5 − 0.5 log₂0.5 = 1
  - 2/12 + 2/12 + 4/12 + 4/12 = 1.0
  - IG = 1 − 1 = 0

**Takeaway:** Every branch is 50/50.

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*

### 4.16. [BLANKS · Medium · calculation]

Type: each branch Gini = ___; weighted child Gini = ___; Gini reduction = ___ (4 d.p.).

  (1) branch Gini = ____
  (2) weighted = ____
  (3) reduction = ____

**Answer:** branch Gini = 0.5000; weighted = 0.5000; reduction = 0.0000

**Takeaway:** No improvement.

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*

### 4.17. [TF · Medium]

In the sheet, the weighted child entropy for Type is the plain average (1 + 1 + 1 + 1)/4.

**Answer:** False

**Why:** It weights by branch size: 2/12, 2/12, 4/12, 4/12 (here it happens to give the same 1.0).

**Takeaway:** Weights are |subset|/|parent|.

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*


---

# 5. Key points: convolution filters and parameter counts (Lecture 7)



### 5.1. [MCQ · Easy · calculation]

Two 3×3 filters on an RGB input, one bias per filter. Trainable parameters?

  A. 55
  B. 20
  C. 54
  D. 56

**Answer:** D. 56

**Option notes:**
  - A: One bias per filter, not one in total.
  - B: Forgot the 3 input channels: (9+1)×2.
  - C: Forgot the biases.

**Takeaway:** (3×3×3 + 1)×2 = 56.

*Source: Key points about convolution filters and parameter counts*

### 5.2. [TF · Medium]

A bigger input image means a convolutional layer has more trainable parameters.

**Answer:** False

**Why:** Weights are reused across positions; image size doesn't add parameters.

**Takeaway:** Weight sharing.

*Source: Key points about convolution filters and parameter counts*

### 5.3. [MULTI · Medium]

Select ALL true statements about convolution filters. (Select ALL that apply.)

  A. Each standard filter spans all input channels
  B. Pooling layers add parameters per channel
  C. The same weights are reused across image positions
  D. Each filter produces one output feature map
  E. Number of filters = number of output channels

**Answer:** A. Each standard filter spans all input channels; C. The same weights are reused across image positions; D. Each filter produces one output feature map; E. Number of filters = number of output channels

**Option notes:**
  - A: Correct: 3×3 on RGB = 27 weights.
  - B: Incorrect: Pooling has none.
  - C: Correct: Weight sharing.
  - D: Correct:
  - E: Correct:

**Takeaway:** Depth in = filter depth; depth out = #filters.

*Source: Key points about convolution filters and parameter counts*

### 5.4. [BLANK · Medium · calculation]

Four 5 by 5 filters on RGB input, one bias per filter. Trainable parameters = ___.

**Answer:** 304

**Working:**
  - 5 × 5 × 3 = 75
  - + 1 bias = 76
  - × 4 filters = 304

**Takeaway:** (5 × 5 × 3 + 1) × 4.

*Source: Key points about convolution filters and parameter counts*

### 5.5. [BLANK · Medium · calculation]

Eight 3 by 3 filters on an input with 16 channels, no bias. Trainable parameters = ___.

**Answer:** 1152
(Also accepted: 1,152)

**Working:**
  - 3 × 3 × 16 = 144
  - × 8 = 1152

**Takeaway:** No bias stated → no +1.

*Source: Key points about convolution filters and parameter counts*

### 5.6. [BLANK · Medium · calculation]

Two 3 by 3 filters on a greyscale (1-channel) input, one bias per filter. Trainable parameters = ___.

**Answer:** 20

**Takeaway:** (9 + 1) × 2.

*Source: Key points about convolution filters and parameter counts*

### 5.7. [MCQ · Medium]

A student computes two 3 by 3 filters on RGB (with biases) as (3 × 3 + 1) × 2 = 20. The mistake is:

  A. multiplying by the number of filters
  B. adding the bias
  C. using the image size
  D. forgetting that each filter spans all 3 input channels

**Answer:** D. forgetting that each filter spans all 3 input channels

**Option notes:**
  - A: That step is correct.
  - B: The bias was specified.
  - C: They did not.

**Takeaway:** Correct: (27 + 1) × 2 = 56.

*Source: Key points about convolution filters and parameter counts*

### 5.8. [BLANK · Easy]

Sheet rule: a layer with 6 filters produces ___ output feature maps (output channels).

**Answer:** 6

**Takeaway:** One map per filter.

*Source: Key points about convolution filters and parameter counts*

### 5.9. [TF · Medium]

Moving from a 32 × 32 to a 224 × 224 RGB image changes the parameter count of a layer of two 3 × 3 filters (with biases).

**Answer:** False

**Why:** Still (27 + 1) × 2 = 56: weights are reused across positions.

**Takeaway:** Image size never adds parameters.

*Source: Key points about convolution filters and parameter counts*

### 5.10. [MULTI · Easy]

The sheet's recipe for counting parameters (select all steps): (Select ALL that apply.)

  A. multiply by the number of image positions
  B. add one bias per filter if specified
  C. multiply by the number of filters
  D. multiply filter height × width × input channels

**Answer:** B. add one bias per filter if specified; C. multiply by the number of filters; D. multiply filter height × width × input channels

**Option notes:**
  - A: Incorrect: weights are shared across positions
  - B: Correct:
  - C: Correct:
  - D: Correct:

**Takeaway:** Three steps.

*Source: Key points about convolution filters and parameter counts*

### 5.11. [BLANK · Easy · calculation]

Sheet rule: a 3 by 3 filter on RGB input contains ___ weights.

**Answer:** 27

**Takeaway:** 3 × 3 × 3: each filter spans all input channels.

*Source: Key points about convolution filters and parameter counts*

### 5.12. [BLANK · Easy · calculation]

Two 3 × 3 filters on RGB input with one bias each: ___ parameters.

**Answer:** 56

**Working:**
  - (3·3·3 + 1) × 2 = 56

**Takeaway:** (K × K × C_in + 1) × filters.

*Source: Book 2 (Exam examples), Q210, p. 31*


---

# 6. Key points: IoU and non-max suppression (Lecture 7)



### 6.1. [MCQ · Easy · calculation]

A has corners (0,0),(6,4); B has (2,0),(8,4). IoU?

  A. 0.67
  B. 0.25
  C. 0.50
  D. 0.33

**Answer:** C. 0.50

**Option notes:**
  - A: 16/24 divides by one box only.
  - B: Arithmetic slip.
  - D: Union must subtract the intersection: 16/48 is wrong.

**Takeaway:** 16/(24 + 24 − 16) = 0.5.

*Source: Key points about IoU and non-max suppression*

### 6.2. [TF · Easy]

If two boxes do not overlap at all, their IoU is 0.

**Answer:** True

**Why:** Intersection 0 → IoU 0.

**Takeaway:** IoU ∈ [0, 1].

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### 6.3. [TF · Medium]

Union area = area of A + area of B.

**Answer:** False

**Why:** Union = A + B − intersection; otherwise the overlap is counted twice.

**Takeaway:** Classic IoU trap.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### 6.4. [BLANKS · Medium · calculation]

Boxes (1,1)-(5,5) and (3,3)-(7,7). Intersection = ______, union = ______, IoU = ______ (3 dp).

  (1) I = ____
  (2) U = ____
  (3) IoU = ____

**Answer:** I = 4; U = 28; IoU = 0.143

**Takeaway:** Overlap 2×2 = 4; 16 + 16 − 4 = 28.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### 6.5. [MCQ · Medium · calculation]

Box A is completely inside box B (A = 4, B = 16). IoU?

  A. 0.33
  B. 0.2
  C. 0.25
  D. 1.0

**Answer:** C. 0.25

**Option notes:**
  - A: Divided by B − A.
  - B: 4/(16 + 4) forgets to subtract I.
  - D: Only identical boxes give 1.

**Takeaway:** I = 4, U = 16 → 0.25.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### 6.6. [MCQ · Medium]

NMS rule: suppress if IoU > 0.5. The kept box and a lower-scoring same-class box have IoU exactly 0.5. What happens?

  A. Both are removed
  B. It is suppressed
  C. The lower-scoring box is kept (equality does not trigger suppression)
  D. The higher-scoring box is removed

**Answer:** C. The lower-scoring box is kept (equality does not trigger suppression)

**Option notes:**
  - A: The top box is always kept.
  - B: Only strictly greater suppresses.
  - D: NMS keeps the highest score.

**Takeaway:** Read > vs ≥ carefully.

*Source: Key points about IoU and non-max suppression*

### 6.7. [TF · Medium]

NMS suppresses overlapping boxes even when they belong to different classes.

**Answer:** False

**Why:** Suppression is applied to boxes of the SAME class.

**Takeaway:** Per-class NMS.

*Source: Key points about IoU and non-max suppression*

### 6.8. [MATCH · Medium]

Match each detection term to its meaning.

  1. IoU
  2. NMS
  3. Objectness
  4. Class score

  A. overlap area ÷ union area
  B. pixel-level class map
  C. how likely a box contains any object
  D. removes duplicate boxes
  E. how likely the object is a given class

**Answer:** 1 → A, 2 → D, 3 → C, 4 → E

**Working:**
  - IoU → overlap area ÷ union area
  - NMS → removes duplicate boxes
  - Objectness → how likely a box contains any object
  - Class score → how likely the object is a given class

**Takeaway:** Know the vocabulary.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### 6.9. [TF · Easy]

Semantic segmentation predicts one class for every pixel.

**Answer:** True

**Why:** Lecture 7 slide 63.

**Takeaway:** Per-pixel classification.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### 6.10. [TF · Medium]

Object detection outputs a fixed number of boxes for every image.

**Answer:** False

**Why:** One image → a VARIABLE-length set of object records.

**Takeaway:** Count of objects varies.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### 6.11. [BLANK · Easy · calculation]

80 × 80 locations × 3 window scales × 3 aspect ratios = ______ candidate crops.

**Answer:** 57600
(Also accepted: 57,600)

**Takeaway:** Lecture 7 slide 60.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### 6.12. [TF · Medium]

YOLO processes all 400 spatial locations of a 20×20 feature map together in one pass.

**Answer:** True

**Why:** Lecture 7 slide 61.

**Takeaway:** One look.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### 6.13. [BLANK · Medium · calculation]

A YOLO head with C = 3 classes on a 20×20 grid predicts 20×20×______ values.

**Answer:** 8

**Takeaway:** 5 + C = 8.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### 6.14. [BLANKS · Medium · calculation]

Sheet method. A has corners (1, 2) and (7, 6); B has corners (4, 3) and (9, 8). Fill in: overlap width, overlap height, intersection, union, IoU (3 d.p.).

  (1) width = ____
  (2) height = ____
  (3) intersection = ____
  (4) union = ____
  (5) IoU = ____

**Answer:** width = 3; height = 3; intersection = 9; union = 40; IoU = 0.225

**Working:**
  - width = min(7, 9) − max(1, 4) = 3
  - height = min(6, 8) − max(2, 3) = 3
  - intersection 9
  - areas 6 × 4 = 24 and 5 × 5 = 25 → union 24 + 25 − 9 = 40
  - IoU = 9/40 = 0.225

**Takeaway:** Shared width = min(x₂) − max(x₁); shared height = min(y₂) − max(y₁).

*Source: Key points about IoU and non-max suppression*

### 6.15. [BLANKS · Medium · calculation]

A (0, 0)–(5, 5), B (1, 1)–(6, 6). Intersection ___, union ___, IoU ___ (3 d.p.).

  (1) intersection = ____
  (2) union = ____
  (3) IoU = ____

**Answer:** intersection = 16; union = 34; IoU = 0.471

**Working:**
  - overlap 4 × 4 = 16
  - 25 + 25 − 16 = 34
  - 16/34 = 0.471

**Takeaway:** 4 × 4 overlap.

*Source: Key points about IoU and non-max suppression*

### 6.16. [BLANK · Easy · calculation]

Sheet example: A (0,0)–(6,4), B (2,0)–(8,4). IoU = ___ (2 d.p.).

**Answer:** 0.50
(Also accepted: 0.5, 1/2)

**Working:**
  - Each area 24; overlap 4 × 4 = 16; union 32; IoU 0.50

**Takeaway:** 16/32.

*Source: Key points about IoU and non-max suppression*

### 6.17. [MULTI · Hard · calculation]

Threshold rule: 'suppress if IoU is strictly greater than 0.40'. Car boxes: P 0.92, Q 0.85, R 0.70. IoU(P,Q) = 0.40, IoU(P,R) = 0.55, IoU(Q,R) = 0.10. Which remain? (Select ALL that apply.)

  A. R
  B. Q
  C. P

**Answer:** B. Q; C. P

**Working:**
  - Keep P.
  - Q: 0.40 > 0.40? No → keep.
  - R: 0.55 > 0.40 → suppress (P is kept, so R goes).

**Option notes:**
  - A: Incorrect: IoU(P, R) = 0.55 > 0.40 → suppressed
  - B: Correct: IoU 0.40 is not strictly greater than 0.40
  - C: Correct: highest score, kept first

**Takeaway:** Equality does not trigger 'strictly greater'.

*Source: Key points about IoU and non-max suppression*

### 6.18. [MULTI · Hard · calculation]

Same boxes, but the rule is now 'suppress if IoU ≥ 0.40'. Which remain? (Select ALL that apply.)

  A. P
  B. Q
  C. R

**Answer:** A. P

**Option notes:**
  - A: Correct: kept first
  - B: Incorrect: 0.40 ≥ 0.40 → suppressed
  - C: Incorrect: 0.55 ≥ 0.40 → suppressed

**Takeaway:** Read > versus ≥ carefully.

*Source: Key points about IoU and non-max suppression*

### 6.19. [MCQ · Medium]

NMS: a person box (0.70) overlaps the kept car box (0.95) with IoU 0.8, threshold 0.5. What happens to the person box?

  A. it is merged with the car box
  B. the car box is suppressed
  C. it is kept: NMS only suppresses boxes of the same class
  D. it is suppressed because 0.8 > 0.5

**Answer:** C. it is kept: NMS only suppresses boxes of the same class

**Option notes:**
  - A: NMS deletes, it does not merge.
  - B: The higher score is kept.
  - D: Different classes are not compared.

**Takeaway:** Same class only.

*Source: Key points about IoU and non-max suppression*

### 6.20. [MCQ · Easy]

NMS starts by:

  A. deleting the lowest-confidence box
  B. keeping the highest-confidence detection
  C. averaging all boxes
  D. computing IoU between every pair of classes

**Answer:** B. keeping the highest-confidence detection

**Option notes:**
  - A: It keeps the best first.
  - C: No averaging.
  - D: Same class only.

**Takeaway:** Then suppress its same-class overlaps, and repeat.

*Source: Key points about IoU and non-max suppression*

### 6.21. [MCQ · Easy]

According to the key-points sheet, union area =

  A. area of A × area of B
  B. area of A + area of B − intersection area
  C. area of A + area of B
  D. the larger box's area

**Answer:** B. area of A + area of B − intersection area

**Option notes:**
  - A: Areas add, not multiply.
  - C: That counts the overlap twice.
  - D: Only if one box contains the other.

**Takeaway:** Subtract the overlap once.

*Source: Key points about IoU and non-max suppression*

### 6.22. [TF · Easy]

For corner coordinates, a box's width is the larger x-coordinate minus the smaller x-coordinate.

**Answer:** True

**Why:** Height likewise uses y; area = width × height.

**Takeaway:** Width from x, height from y.

*Source: Key points about IoU and non-max suppression*

### 6.23. [BLANKS · Medium · calculation]

A (0, 0)–(6, 4), B (2, 0)–(8, 4). Area A ___; overlap ___; union ___; IoU ___. If A scores higher and suppression requires IoU strictly greater than 0.40, is B suppressed (yes/no)? ___

  (1) area A = ____
  (2) overlap = ____
  (3) union = ____
  (4) IoU = ____
  (5) suppressed? = ____

**Answer:** area A = 24; overlap = 16; union = 32; IoU = 0.50; suppressed? = yes

**Working:**
  - overlap width min(6,8) − max(0,2) = 4; height 4
  - union 24 + 24 − 16 = 32
  - IoU 0.50 > 0.40 → suppress B

**Takeaway:** Overlap 4 × 4.

*Source: Book 2 (Exam examples), Q223, p. 32*


---

# 7. Key points: a simple RNN hidden-state update (Lecture 8)



### 7.1. [MCQ · Easy · calculation]

Key points: xₜ = 2, wₓ = 0.5, hₜ₋₁ = 0.4, wₕ = 0.25, no bias, tanh(1.1) = 0.800. hₜ = ?

  A. 0.800
  B. 1.1
  C. 0.4
  D. 1.0

**Answer:** A. 0.800

**Option notes:**
  - B: That's the sum before activation.
  - C: That's the old state.
  - D: Ignored the previous state.

**Takeaway:** Sum then squash.

*Source: Key points about a simple RNN hidden-state update*

### 7.2. [BLANKS · Medium · calculation]

Current input = 3, input weight = 0.2, previous state = 0.5, recurrent weight = 0.4, no bias. Sum = ___; with tanh(0.8) supplied as 0.664, new state = ___.

  (1) sum = ____
  (2) new state = ____

**Answer:** sum = 0.8; new state = 0.664

**Working:**
  - 0.6 + 0.2 = 0.8
  - tanh(0.8) = 0.664 (supplied)

**Takeaway:** 0.2 × 3 + 0.4 × 0.5.

*Source: Key points about a simple RNN hidden-state update*

### 7.3. [BLANKS · Medium · calculation]

Current input = 1, input weight = 0.6, previous state = −0.5, recurrent weight = 0.4, bias 0.1. Sum = ___; with tanh(0.5) supplied as 0.462, new state = ___.

  (1) sum = ____
  (2) new state = ____

**Answer:** sum = 0.5; new state = 0.462

**Working:**
  - 0.6 − 0.2 + 0.1 = 0.5
  - tanh(0.5) = 0.462

**Takeaway:** Bias is included because it is specified.

*Source: Key points about a simple RNN hidden-state update*

### 7.4. [MCQ · Medium]

When should a bias be added in the simple RNN update?

  A. only for tanh
  B. never
  C. only if a bias is specified in the question
  D. always add 1

**Answer:** C. only if a bias is specified in the question

**Option notes:**
  - A: Activation does not decide it.
  - B: Add it when given.
  - D: Never assume a bias.

**Takeaway:** Bias only if specified.

*Source: Key points about a simple RNN hidden-state update*

### 7.5. [TF · Easy]

The previous hidden state carries information from earlier steps of the sequence.

**Answer:** True

**Why:** That is how an RNN remembers.

**Takeaway:** Memory = previous state.

*Source: Key points about a simple RNN hidden-state update*

### 7.6. [TF · Easy]

The sum before the activation is the new hidden state.

**Answer:** False

**Why:** Apply the activation (use the supplied tanh lookup).

**Takeaway:** Sum ≠ state.

*Source: Key points about a simple RNN hidden-state update*

### 7.7. [BLANK · Medium · calculation]

Previous state 0, input 1, input weight 1, recurrent weight 0.9, no bias; tanh(1) supplied as 0.76159. Give the new state to 2 decimal places.

**Answer:** 0.76

**Takeaway:** Round only the final result.

*Source: Key points about a simple RNN hidden-state update*

### 7.8. [MCQ · Hard]

Current input = 2 (input weight 0.5), previous state = 0.4 (recurrent weight 0.25). A student computes 0.5 × 0.4 + 0.25 × 2 = 0.7. The mistake is:

  A. mixing up the input and the previous state (each must use its own weight)
  B. forgetting the bias
  C. nothing: 0.7 is right
  D. applying tanh

**Answer:** A. mixing up the input and the previous state (each must use its own weight)

**Option notes:**
  - B: No bias was given.
  - C: Correct sum is 1.1.
  - D: tanh is required.

**Takeaway:** Keep current input and previous state distinct.

*Source: Key points about a simple RNN hidden-state update*

### 7.9. [BLANKS · Easy · calculation]

Key points sheet: x = 2, w_x = 0.5, h_prev = 0.4, w_h = 0.25, no bias, tanh with tanh(1.1) = 0.800 supplied. Sum ___; new state ___.

  (1) sum = ____
  (2) h = ____

**Answer:** sum = 1.1; h = 0.800

**Working:**
  - 0.5 × 2 + 0.25 × 0.4 = 1.1
  - tanh(1.1) = 0.800

**Takeaway:** The sum is not the answer: apply tanh.

*Source: Book 2 (Exam examples), Q239, p. 34*

### 7.10. [MCQ · Easy]

A student reports h = 1.1 for the lecture example (x = 2, w_x = 0.5, h_prev = 0.4, w_h = 0.25). The mistake is:

  A. forgot to apply the activation
  B. added a bias
  C. used ReLU
  D. wrong weights

**Answer:** A. forgot to apply the activation

**Option notes:**
  - B: No bias was added.
  - C: ReLU(1.1) is also 1.1, but the task says tanh.
  - D: The weights give 1.1 correctly.

**Takeaway:** Pre-activation ≠ hidden state.

*Source: Book 2 (Exam examples), Q242, p. 34*


---

# 8. Key points: attention weighted value aggregation (Lecture 8)



### 8.1. [MCQ · Easy · calculation]

Key points: weights [0.3, 0.7], values [2, 0] and [0, 2]. Output?

  A. [1.4, 0.6]
  B. [2, 2]
  C. [0.6, 1.4]
  D. [0, 2]

**Answer:** C. [0.6, 1.4]

**Option notes:**
  - A: Components swapped.
  - B: Added unweighted values.
  - D: Picked only the largest-weight value.

**Takeaway:** Weight each value, then add per component.

*Source: Key points about Attention*

### 8.2. [BLANKS · Easy · calculation]

Sheet method. Weights 0.4 and 0.6; values [5, 1] and [0, 3]. Output = [___, ___].

  (1) 1st = ____
  (2) 2nd = ____

**Answer:** 1st = 2; 2nd = 2.2

**Working:**
  - 1st: 2 + 0 = 2
  - 2nd: 0.4 + 1.8 = 2.2

**Takeaway:** [0.4·5 + 0.6·0, 0.4·1 + 0.6·3].

*Source: Key points about Attention: weighted value aggregation*

### 8.3. [BLANKS · Medium · calculation]

Weights 0.5, 0.25, 0.25; values [4, 0, 2], [0, 8, 4], [2, 2, 2]. Output = [___, ___, ___].

  (1) 1st = ____
  (2) 2nd = ____
  (3) 3rd = ____

**Answer:** 1st = 2.5; 2nd = 2.5; 3rd = 2.5

**Working:**
  - 1st: 2 + 0 + 0.5 = 2.5
  - 2nd: 0 + 2 + 0.5 = 2.5
  - 3rd: 1 + 1 + 0.5 = 2.5

**Takeaway:** Component by component.

*Source: Key points about Attention: weighted value aggregation*

### 8.4. [TF · Easy]

The attention output has the same number of components as each value vector.

**Answer:** True

**Why:** Corresponding components are added.

**Takeaway:** Output length = value length.

*Source: Key points about Attention: weighted value aggregation*

### 8.5. [MCQ · Medium]

Weights 0.3 and 0.7; values [2, 0] and [0, 2]. A student answers [0, 2] (the value with the largest weight). The mistake is:

  A. using the wrong order
  B. selecting only the largest-weight vector instead of the weighted sum
  C. adding the unweighted vectors
  D. nothing: [0, 2] is correct

**Answer:** B. selecting only the largest-weight vector instead of the weighted sum

**Option notes:**
  - A: Order is fine.
  - C: That would give [2, 2].
  - D: Correct output is [0.6, 1.4].

**Takeaway:** Every value vector contributes in proportion to its weight.

*Source: Key points about Attention: weighted value aggregation*

### 8.6. [BLANK · Medium · calculation]

Normalised weights for three values are 0.2, 0.5 and ___.

**Answer:** 0.3

**Takeaway:** They must sum to 1.

*Source: Key points about Attention: weighted value aggregation*

### 8.7. [TF · Easy]

Normalised attention weights sum to one.

**Answer:** True

**Why:** They come from a softmax.

**Takeaway:** Weights add to 1.

*Source: Key points about Attention: weighted value aggregation*

### 8.8. [MCQ · Medium]

Same weights and values. Another student answers [2, 2]. The mistake is:

  A. adding the value vectors without multiplying by their weights
  B. picking the largest weight
  C. normalising twice
  D. nothing

**Answer:** A. adding the value vectors without multiplying by their weights

**Option notes:**
  - B: That gives [0, 2].
  - C: No normalising here.
  - D: Correct is [0.6, 1.4].

**Takeaway:** Weight first, then add.

*Source: Key points about Attention: weighted value aggregation*

### 8.9. [BLANKS · Easy · calculation]

Attention weights 0.3 and 0.7; values [2, 0] and [0, 2]. Output = [___, ___].

  (1) 1st = ____
  (2) 2nd = ____

**Answer:** 1st = 0.6; 2nd = 1.4

**Takeaway:** Weight every component, then add.

*Source: Book 2 (Exam examples), Q243, p. 34*


---

# 9. Lecture 8 class polls (Mentimeter)



### 9.1. [MATCH · Medium]

Poll 1: match each task to its sequence structure.

  1. ECG signal → diagnosis
  2. Initial pose → motion sequence
  3. Speech → text
  4. Style/seed → music sequence
  5. Sensor history → failure

  A. many-to-one
  B. many-to-many
  C. one-to-one
  D. many-to-one
  E. one-to-many
  F. one-to-many

**Answer:** 1 → A, 2 → E, 3 → B, 4 → E, 5 → A

**Working:**
  - ECG signal → diagnosis → many-to-one
  - Initial pose → motion sequence → one-to-many
  - Speech → text → many-to-many
  - Style/seed → music sequence → one-to-many
  - Sensor history → failure → many-to-one

**Takeaway:** Count inputs and outputs over time.

*Source: Lecture 8, slide 18*

### 9.2. [MATCH · Medium]

(Poll 1) Match each task to its sequence structure.

  1. ECG → diagnosis
  2. initial pose → motion
  3. speech → text

  A. one-to-one
  B. many-to-one
  C. many-to-many
  D. one-to-many

**Answer:** 1 → B, 2 → D, 3 → C

**Working:**
  - ECG → diagnosis → many-to-one
  - initial pose → motion → one-to-many
  - speech → text → many-to-many

**Takeaway:** Also: sensor history → failure and video → action label are many-to-one; seed → music is one-to-many.

*Source: Book 2 (Exam examples), Q255, p. 35*

### 9.3. [MCQ · Medium · calculation]

Poll 2: a dependency crosses 30 steps; each step multiplies the gradient by 0.8. Which diagnosis and response fit?

  A. ≈ 0.24; clip the gradients
  B. ≈ 0.001; use an LSTM or GRU
  C. ≈ 24; normalise the inputs
  D. ≈ 0.8; lower the learning rate

**Answer:** B. ≈ 0.001; use an LSTM or GRU

**Option notes:**
  - A: Clipping is for exploding gradients.
  - C: That's 0.8 × 30, not 0.8³⁰.
  - D: 0.8³⁰ is tiny, not 0.8.

**Takeaway:** Repeated products shrink the signal.

*Source: Lecture 8, slide 43*

### 9.4. [MCQ · Medium · calculation]

(Poll 2) A dependency crosses 30 steps; each multiplies the gradient by 0.8.

  A. ≈ 0.8; lower the learning rate
  B. ≈ 0.24; clip gradients
  C. ≈ 24; normalise inputs
  D. ≈ 0.001; use an LSTM/GRU

**Answer:** D. ≈ 0.001; use an LSTM/GRU

**Option notes:**
  - A: 0.8 is one step only.
  - B: 0.8 × 30 is not how it compounds; clipping fixes exploding.
  - C: That is 0.8 × 30.

**Takeaway:** 0.8³⁰ = 0.0012: vanishing.

*Source: Book 2 (Exam examples), Q253, p. 35*

### 9.5. [MCQ · Medium · calculation]

word | count in + (T₊ = 20) | count in − (T₋ = 18) | P_s(w|+) | P_s(w|−)
    heartwarming | 6 | 2 | 7/26 ≈ 0.27 | 3/24 ≈ 0.13
    delightful | 5 | 2 | 6/26 ≈ 0.23 | 3/24 ≈ 0.13
    slow | 2 | 6 | 3/26 ≈ 0.12 | 7/24 ≈ 0.29
    repetitive | 1 | 6 | 2/26 ≈ 0.08 | 7/24 ≈ 0.29
    charming | 6 | 1 | 7/26 ≈ 0.27 | 2/24 ≈ 0.08
    dull | 0 | 1 | 1/26 ≈ 0.04 | 2/24 ≈ 0.08

Lecture 8: 11 positive and 9 negative reviews → P(+) = 0.55, P(−) = 0.45; |V| = 6.

Poll 3: 'heartwarming and delightful, but slow'. P(+) = 0.55, P(−) = 0.45; likelihoods (+, −): heartwarming 0.27/0.13, delightful 0.23/0.13, slow 0.12/0.29. Which conclusion is correct?

  A. Negative: slow has the largest negative likelihood
  B. Positive: S₊ ≈ 0.00410 > S₋ ≈ 0.00221
  C. Tie: two positive words vs one negative
  D. Cannot decide until the scores are normalised

**Answer:** B. Positive: S₊ ≈ 0.00410 > S₋ ≈ 0.00221

**Option notes:**
  - A: Must multiply all terms.
  - C: Counting words isn't Naive Bayes.
  - D: Compare unnormalised scores directly.

**Takeaway:** Multiply prior and all matched likelihoods per class.

*Source: Lecture 8, slide 52*

### 9.6. [MCQ · Medium · calculation]

word | P(w|+) | P(w|−)
    heartwarming | 0.27 | 0.13
    delightful | 0.23 | 0.13
    slow | 0.12 | 0.29
    repetitive | 0.08 | 0.29
    charming | 0.27 | 0.08
    dull | 0.04 | 0.08

Priors P(+) = 0.55, P(−) = 0.45 (smoothed likelihoods).

(Poll 3) 'heartwarming and delightful, but slow.'

  A. Negative: slow has the largest negative likelihood
  B. Cannot decide until normalised
  C. Tie
  D. Positive: S+ ≈ 0.00410 > S− ≈ 0.00221

**Answer:** D. Positive: S+ ≈ 0.00410 > S− ≈ 0.00221

**Option notes:**
  - A: Compare whole products, not one word.
  - B: Normalising divides both by the same Z.
  - C: The products differ.

**Takeaway:** Compare S+ and S−.

*Source: Book 2 (Exam examples), Q261, p. 36*

### 9.7. [MCQ · Medium]

Poll 4: 'What was Mando searching for?' attends to mission-log tokens. Which Q/K/V assignment is correct?

  A. Q = log-token projections; K = question projection; V = question projection repeated
  B. Q = question projection; K = log-token keys; V = attention scores over log tokens
  C. Q = question projection; K = log-token key projections for matching; V = separate log-token value projections for aggregation
  D. Q = question projection; K = log-token value projections; V = log-token key projections

**Answer:** C. Q = question projection; K = log-token key projections for matching; V = separate log-token value projections for aggregation

**Option notes:**
  - A: Direction of retrieval reversed.
  - B: Scores are not values.
  - D: Keys and values swapped.

**Takeaway:** The question asks; the log tokens answer.

*Source: Lecture 8, slide 70*

### 9.8. [MCQ · Medium]

(Poll 4) 'What was Mando searching for?' over a mission log. Correct Q/K/V roles:

  A. Q = log projections, K = question, V = log values
  B. Q = question; K = log-token keys for matching; V = separate log-token values for aggregation
  C. Q = question, K = log keys, V = attention scores
  D. Q = question, K = log value projections, V = question repeated

**Answer:** B. Q = question; K = log-token keys for matching; V = separate log-token values for aggregation

**Option notes:**
  - A: The question is the query.
  - C: Scores are weights, not values.
  - D: V comes from the log tokens.

**Takeaway:** Query asks, keys match, values answer.

*Source: Book 2 (Exam examples), Q248, p. 35*


---

# 10. Lec11 class quiz



### 10.1. [BLANK · Easy · calculation]

Lec11 quiz: 5000 experiments, event (Val1 = F, Val2 = T, Val3 = T) occurred 88 times. Its probability is ______ % (2 dp).

**Answer:** 1.76
(Also accepted: 1.760)

**Takeaway:** 88/5000 = 0.0176.

*Source: Lec11 class quiz Q1*

### 10.2. [MATCH · Easy]

Lec11 quiz Q2: match the Bayesian-network component to its explanation.

  1. child node
  2. an edge
  3. arrow of an edge

  A. the normalisation constant
  B. indicates the link from a parent to a child
  C. a node that has a conditional probability distribution given its parents
  D. association between two nodes

**Answer:** 1 → C, 2 → D, 3 → B

**Working:**
  - child node → a node that has a conditional probability distribution given its parents
  - an edge → association between two nodes
  - arrow of an edge → indicates the link from a parent to a child

**Takeaway:** Node = variable, arrow = parent → child.

*Source: Lec11 class quiz Q2*

### 10.3. [BLANK · Easy · calculation]

B | E | P(A=t|B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t|A) | P(M=t|A)
    t | .90 | .70
    f | .05 | .01

Lec11 quiz Q3: the probability of the alarm sounding when there is an earthquake but no burglary, P(a | ¬b, e) = ______ (3 dp).

**Answer:** 0.290
(Also accepted: 0.29)

**Takeaway:** Read the CPT row B = f, E = t.

*Source: Lec11 class quiz Q3*


---

# 11. Lec11 class exercise: Enumeration Reasoning



### 11.1. [MCQ · Easy]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

When evaluating a path in an enumeration tree, what operation is performed along that path?

  A. Multiply the probabilities appearing on the path
  B. Normalise after every branch
  C. Select only the largest probability
  D. Add all probabilities on the path

**Answer:** A. Multiply the probabilities appearing on the path

**Option notes:**
  - B: Normalise once at the end.
  - C: All branches count.
  - D: Add ACROSS alternative branches, multiply ALONG a path.

**Takeaway:** Enumeration MCQ Q1.

*Source: Enumeration Reasoning MCQ Q1*

### 11.2. [MCQ · Medium]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

For a fixed value of B, why are the E = true and E = false branches added?

  A. They remove the need to consider Alarm
  B. They are repeated observations of the same event
  C. They convert joint probabilities into conditionals
  D. They represent alternative hidden states of Earthquake

**Answer:** D. They represent alternative hidden states of Earthquake

**Option notes:**
  - A: Alarm is summed too.
  - B: They are mutually exclusive alternatives.
  - C: Normalisation does that.

**Takeaway:** Enumeration MCQ Q2.

*Source: Enumeration Reasoning MCQ Q2*

### 11.3. [MCQ · Medium]

Which factor must use the Alarm CPT entries for B = false?

  A. P(A | ¬B, E)
  B. P(j | A)
  C. P(E)
  D. P(m | A)

**Answer:** A. P(A | ¬B, E)

**Option notes:**
  - B: Doesn't involve B.
  - C: Root prior.
  - D: Doesn't involve B.

**Takeaway:** Enumeration MCQ Q3: the outer prior is also P(¬B).

*Source: Enumeration Reasoning MCQ Q3*

### 11.4. [MCQ · Medium]

What does 'evaluate inside out' mean in this calculation?

  A. Add the B and ¬B cases before multiplying
  B. Normalise before calculating branch values
  C. Evaluate evidence likelihoods for each A state, sum over A, weight and sum over E, then apply the selected B prior
  D. Apply the B prior and ignore hidden-state branches

**Answer:** C. Evaluate evidence likelihoods for each A state, sum over A, weight and sum over E, then apply the selected B prior

**Option notes:**
  - A: They are separate scores.
  - B: Normalise last.
  - D: Hidden branches must be summed.

**Takeaway:** Enumeration MCQ Q4.

*Source: Enumeration Reasoning MCQ Q4*

### 11.5. [MCQ · Easy]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

After obtaining s_B and s_¬B, what is the correct next step?

  A. Subtract the smaller from the larger
  B. Divide each score by s_B + s_¬B
  C. Choose the larger score as probability 1
  D. Multiply the two scores

**Answer:** B. Divide each score by s_B + s_¬B

**Option notes:**
  - A: No.
  - C: That discards information.
  - D: No.

**Takeaway:** Enumeration MCQ Q5.

*Source: Enumeration Reasoning MCQ Q5*


---

# 12. Lec11 class exercise: Inference Calculation



### 12.1. [MCQ · Medium]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

P(B | event) = α · P(B) · Σₑ P(E) · Σₐ P(A|B,E)P(j|A)P(m|A). Why can P(B) be moved outside both summations?

  A. P(B) does not depend on E or A
  B. P(B) is always equal to 1
  C. P(B) must be summed over A
  D. P(B) is an evidence variable

**Answer:** A. P(B) does not depend on E or A

**Option notes:**
  - B: P(b) = 0.001.
  - C: It doesn't depend on A.
  - D: B is the query.

**Takeaway:** Inference Calculation MCQ Q1.

*Source: Inference Calculation MCQs Q1*

### 12.2. [MCQ · Easy]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

Which variables are summed out to obtain P(B | j, m)?

  A. j and m
  B. B and A
  C. E and A
  D. B and event

**Answer:** C. E and A

**Option notes:**
  - A: Evidence is fixed, not summed.
  - B: B is the query.
  - D: B is the query.

**Takeaway:** Inference Calculation MCQ Q2.

*Source: Inference Calculation MCQs Q2*


---

# 13. Lec11 class exercise: No-Burglary Expansion



### 13.1. [MCQ · Hard]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

Which expression correctly expands Σₑ P(E) Σₐ P(A|¬b,E) P(j|A) P(m|A) over E?

  A. P(e)Σₐ P(A|¬b,e)… + P(e)Σₐ P(A|¬b,¬e)…
  B. Σₐ P(A|¬b,e)… + Σₐ P(A|¬b,¬e)…
  C. P(e)Σₐ P(A|¬b,e)P(j|A)P(m|A) + P(¬e)Σₐ P(A|¬b,¬e)P(j|A)P(m|A)
  D. P(e)Σₐ P(A|¬b,e)P(j|A)P(m|A) × P(¬e)Σₐ P(A|¬b,¬e)P(j|A)P(m|A)

**Answer:** C. P(e)Σₐ P(A|¬b,e)P(j|A)P(m|A) + P(¬e)Σₐ P(A|¬b,¬e)P(j|A)P(m|A)

**Option notes:**
  - A: Second branch needs P(¬e).
  - B: Each branch is weighted by its prior.
  - D: Branches are ADDED.

**Takeaway:** No-Burglary Expansion MCQ Q1.

*Source: No_Burglary_Expansion MCQ Q1*

### 13.2. [MCQ · Hard]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

For the E = e branch, which expression correctly expands Σₐ P(A | ¬b, e) P(j|A) P(m|A)?

  A. P(a|¬b,e)P(j|a) + P(¬a|¬b,e)P(m|¬a)
  B. P(a|¬b,e)P(j|a)P(m|a) + P(¬a|¬b,e)P(j|¬a)P(m|¬a)
  C. P(a|¬b,e)P(j|a)P(m|a) × P(¬a|¬b,e)P(j|¬a)P(m|¬a)
  D. P(a|¬b,e)P(j|a)P(m|a) + P(¬a|¬b,e)P(j|a)P(m|a)

**Answer:** B. P(a|¬b,e)P(j|a)P(m|a) + P(¬a|¬b,e)P(j|¬a)P(m|¬a)

**Option notes:**
  - A: Each branch needs BOTH evidence terms.
  - C: Add, don't multiply, alternatives.
  - D: Evidence terms must use ¬a in the second branch.

**Takeaway:** No-Burglary Expansion MCQ Q2.

*Source: No_Burglary_Expansion MCQ Q2*


---

# 14. Lec11 class exercise: Marginalisation fill-in-the-blanks



### 14.1. [BLANKS · Easy]

Marginalisation quiz: To obtain P(X = x), sum the joint probabilities over ______ and ______.

  (1) first = ____
  (2) second = ____

**Answer:** first = Y; second = Z

**Takeaway:** Sum out every other variable.

*Source: Marginalisation fill-in-blanks Q1*

### 14.2. [BLANK · Easy]

Before summing, keep only the rows in which the query variable X has the required ______.

**Answer:** value
(Also accepted: Value)

**Takeaway:** Fix the query value.

*Source: Marginalisation fill-in-blanks Q2*

### 14.3. [BLANK · Easy]

For X = x₁, the selected probabilities are 0.06, 0.09, 0.14 and ______.

**Answer:** 0.11

**Takeaway:** Fourth x₁ row.

*Source: Marginalisation fill-in-blanks Q3*

### 14.4. [BLANK · Easy · calculation]

P(X = x₁) = 0.06 + 0.09 + 0.14 + 0.11 = ______.

**Answer:** 0.40
(Also accepted: 0.4)

**Takeaway:** Sum the selected rows.

*Source: Marginalisation fill-in-blanks Q4*

### 14.5. [BLANK · Easy]

Marginalisation removes variables from a joint distribution by ______ their probabilities.

**Answer:** summing
(Also accepted: summing out, adding, sum)

**Takeaway:** Sum out.

*Source: Marginalisation fill-in-blanks Q5*


---

# 15. Lec11 class exercise: Causal and Diagnostic Directions



### 15.1. [MCQ · Easy]

A disease D causes symptoms S. Which probability represents reasoning in the CAUSAL direction?

  A. P(D ∩ S)
  B. P(S | D)
  C. P(D | S)
  D. P(D)

**Answer:** B. P(S | D)

**Option notes:**
  - A: A joint, not a direction.
  - C: That's diagnostic (effect → cause).
  - D: A prior.

**Takeaway:** Causal: cause → effect.

*Source: Causal and Diagnostic Directions MCQ Q1*

### 15.2. [MCQ · Easy]

A patient is observed to have symptoms S. Which probability represents DIAGNOSTIC reasoning?

  A. P(D | S)
  B. P(S)
  C. P(D ∩ S)
  D. P(S | D)

**Answer:** A. P(D | S)

**Option notes:**
  - B: Evidence.
  - C: Joint.
  - D: Causal.

**Takeaway:** Bayes computes P(D|S) from P(S|D), P(D), P(S).

*Source: Causal and Diagnostic Directions MCQ Q2*


---

# 16. Lec11 class exercise: Reasoning Process Matching Quiz



### 16.1. [MATCH · Easy]

Match each direction to its reasoning process.

  1. Causal direction
  2. Diagnostic direction

  A. Cause → Effect | P(effect | cause)
  B. Effect → Cause | P(cause | effect)
  C. Effect → Effect | P(effect)

**Answer:** 1 → A, 2 → B

**Working:**
  - Causal direction → Cause → Effect | P(effect | cause)
  - Diagnostic direction → Effect → Cause | P(cause | effect)

**Takeaway:** Reasoning Process Matching Quiz Q1.

*Source: Reasoning Process Matching Quiz Q1*

### 16.2. [MATCH · Easy]

Match each probability to the reasoning process.

  1. P(S | D)
  2. P(D | S)

  A. Diagnostic: Symptoms → Disease
  B. Joint: Disease and Symptoms
  C. Causal: Disease → Symptoms

**Answer:** 1 → C, 2 → A

**Working:**
  - P(S | D) → Causal: Disease → Symptoms
  - P(D | S) → Diagnostic: Symptoms → Disease

**Takeaway:** Reasoning Process Matching Quiz Q2.

*Source: Reasoning Process Matching Quiz Q2*


---

# 17. Lec11 class exercise: Reasoning Process Multiple Answer Quiz 1



### 17.1. [MULTI · Medium]

For the target posterior P(X | e), which statements correctly describe the reasoning setup? (Select ALL that apply.)

  A. Y contains variables that are neither query nor evidence
  B. X represents the query variable(s) whose posterior is required
  C. E contains observed variables with their assigned evidence values e
  D. The hidden variables Y should be treated as additional observed evidence

**Answer:** A. Y contains variables that are neither query nor evidence; B. X represents the query variable(s) whose posterior is required; C. E contains observed variables with their assigned evidence values e

**Option notes:**
  - A: Correct: Hidden.
  - B: Correct: Query.
  - C: Correct: Evidence.
  - D: Incorrect: They are marginalised, not observed.

**Takeaway:** Reasoning Process Multiple Answer Quiz 1, Q1.

*Source: Reasoning Process Multiple Answer Quiz 1*

### 17.2. [MULTI · Medium]

Which actions are required to compute the posterior distribution P(X | e) in a Bayesian network? (Select ALL that apply.)

  A. Use the Bayesian-network factorisation to express the joint distribution
  B. Incorporate the observed evidence assignment e
  C. Sum out (marginalise) all hidden variables Y
  D. Return the unnormalised result without ensuring probabilities sum to 1

**Answer:** A. Use the Bayesian-network factorisation to express the joint distribution; B. Incorporate the observed evidence assignment e; C. Sum out (marginalise) all hidden variables Y

**Option notes:**
  - A: Correct: Step 1.
  - B: Correct: Step 2.
  - C: Correct: Step 3.
  - D: Incorrect: Must normalise.

**Takeaway:** Reasoning Process Multiple Answer Quiz 1, Q2.

*Source: Reasoning Process Multiple Answer Quiz 1*


---

# 18. Lec11 class exercise: Reasoning Process Multiple Answer Quiz 3



### 18.1. [MULTI · Medium]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

Which actions are required to compute P(B | j, m) from the full joint table? (Select ALL that apply.)

  A. Separate the retained rows into B = true and B = false
  B. For each B case, sum over every binary combination of E and A
  C. Divide each unnormalised score by s_B + s_¬B
  D. Choose only the single row with the largest joint probability
  E. Keep only rows in which j = true and m = true

**Answer:** A. Separate the retained rows into B = true and B = false; B. For each B case, sum over every binary combination of E and A; C. Divide each unnormalised score by s_B + s_¬B; E. Keep only rows in which j = true and m = true

**Option notes:**
  - A: Correct: Group.
  - B: Correct: Marginalise.
  - C: Correct: Normalise.
  - D: Incorrect: Must sum all relevant rows.
  - E: Correct: Filter.

**Takeaway:** Multiple-answer quiz 3, Q1.

*Source: Reasoning Process Multiple Answer Quiz 3*

### 18.2. [MULTI · Hard]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

What do the unnormalised scores s_B = Σₑ Σₐ P(B,E,A,j,m) and s_¬B represent? (Select ALL that apply.)

  A. s_B combines the four rows for B = true across all assignments of E and A
  B. s_¬B combines the four rows for B = false
  C. They can be normalised by dividing each by s_B + s_¬B
  D. They are already equal to P(B|j,m) and P(¬B|j,m)
  E. Both are computed after fixing j = true and m = true

**Answer:** A. s_B combines the four rows for B = true across all assignments of E and A; B. s_¬B combines the four rows for B = false; C. They can be normalised by dividing each by s_B + s_¬B; E. Both are computed after fixing j = true and m = true

**Option notes:**
  - A: Correct: Four rows.
  - B: Correct: Four rows.
  - C: Correct: Normalise.
  - D: Incorrect: Not until normalised.
  - E: Correct: Evidence fixed.

**Takeaway:** Multiple-answer quiz 3, Q2 (P(B|j,m) ≈ 0.284).

*Source: Reasoning Process Multiple Answer Quiz 3*


---

# 19. Lec11 class exercise: Bayesian Network Reasoning Process Quiz



### 19.1. [MATCH · Medium]

Match each reasoning step with its purpose (exact inference with the factorised BN).

  1. Sum over E
  2. Sum over A

  A. Accounts for both alarm states
  B. Accounts for both burglary states
  C. Accounts for both earthquake states

**Answer:** 1 → C, 2 → A

**Working:**
  - Sum over E → Accounts for both earthquake states
  - Sum over A → Accounts for both alarm states

**Takeaway:** BN Reasoning Process Quiz Q1.

*Source: Bayesian_Network_Reasoning_Process_Quiz Q1*

### 19.2. [MATCH · Medium]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

For the task P(B | J, M), match each component to its role.

  1. JohnCalls and MaryCalls
  2. Alarm and Earthquake
  3. Burglary

  A. Hidden variables to be summed out
  B. Normalisation constants
  C. Query variable
  D. Evidence variables

**Answer:** 1 → D, 2 → A, 3 → C

**Working:**
  - JohnCalls and MaryCalls → Evidence variables
  - Alarm and Earthquake → Hidden variables to be summed out
  - Burglary → Query variable

**Takeaway:** BN Reasoning Process Quiz Q2.

*Source: Bayesian_Network_Reasoning_Process_Quiz Q2*


---

# 20. Lecture 11 class activity spreadsheets (experiments table, full joint table)

The slide says: 'This activity is for preparation for calculation questions in the exam.'

### 20.1. [BLANKS · Hard · calculation]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

Activity: compute P(Burglary | JohnCalls = T, MaryCalls = F) from the full joint table. Summing the rows with J = T, M = F gives 0.000256774 for B = T and 0.049798101 for B = F. P(b | j, ¬m) = ___ (4 d.p.); P(¬b | j, ¬m) = ___ (4 d.p.).

  (1) P(b|j,¬m) = ____
  (2) P(¬b|j,¬m) = ____

**Answer:** P(b|j,¬m) = 0.0051; P(¬b|j,¬m) = 0.9949

**Working:**
  - 0.000256774/(0.000256774 + 0.049798101) = 0.00513
  - 1 − 0.00513 = 0.99487

**Takeaway:** Filter, group by B, sum, normalise.

*Source: Lecture 11 class activity spreadsheets (experiments table, full joint probability table)*

### 20.2. [BLANK · Medium · calculation]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

Activity 2: the experiments total N = 99,995,505,198. The event (JohnCalls, MaryCalls, Alarm, Burglary, Earthquake) = (T, F, T, T, F) occurred 25,329,240 times. Its probability = ___ (3 s.f., e.g. 1.23e-4).

**Answer:** 2.53e-4
(Also accepted: 0.000253)

**Takeaway:** P(event) = occurrences / total experiments.

*Source: Lecture 11 class activity spreadsheets (experiments table, full joint probability table)*

### 20.3. [BLANK · Easy · calculation]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

The full joint table for the five binary burglary variables has ___ rows.

**Answer:** 32

**Takeaway:** 2⁵.

*Source: Lecture 11 class activity spreadsheets (experiments table, full joint probability table)*

### 20.4. [MULTI · Medium]

[Diagram as text] Edges (label in brackets): Burglary — Alarm; Earthquake — Alarm; Alarm — JohnCalls; Alarm — MaryCalls

    P(B) | P(E)
    .001 | .002

    B | E | P(A=t | B,E)
    t | t | .95
    t | f | .94
    f | t | .29
    f | f | .001

    A | P(J=t | A) | P(M=t | A)
    t | .90 | .70
    f | .05 | .01

Which steps compute P(Burglary | j, ¬m) from the full joint table? (Select ALL that apply.)

  A. add the probabilities in each group (summing over A and E)
  B. multiply all 32 rows together
  C. keep only rows with JohnCalls = T and MaryCalls = F
  D. split the kept rows into B = T and B = F
  E. divide each sum by the total of both sums

**Answer:** A. add the probabilities in each group (summing over A and E); C. keep only rows with JohnCalls = T and MaryCalls = F; D. split the kept rows into B = T and B = F; E. divide each sum by the total of both sums

**Option notes:**
  - A: Correct: marginalise
  - B: Incorrect: rows are added, not multiplied
  - C: Correct: filter
  - D: Correct: group
  - E: Correct: normalise

**Takeaway:** Filter → group → marginalise → normalise.

*Source: Lecture 11 class activity spreadsheets (experiments table, full joint probability table)*

### 20.5. [TF · Easy]

The 32 probabilities of the full joint table add up to 1 (apart from rounding).

**Answer:** True

**Why:** Every possible event is listed once.

**Takeaway:** Joint table sums to 1.

*Source: Lecture 11 class activity spreadsheets (experiments table, full joint probability table)*


---

# 21. Canvas 'you should be able to answer these questions' lists, with model answers



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



---

# 22. Appendix: Practice quiz Module 1 (NOT examined; shows the exam's question format)



Module 1 is NOT examined. This Canvas practice quiz was given as "an example of quiz questions", so it shows the format (MCQ, multiple answers, fill in blanks, matching). Answers follow the Lecture 1 slides and the textbook.

**M1.1 (MCQ) Which statement about AI is incorrect?**
Answer: "The term AI was coined in the Dartmouth workshop in 1965 as a research field." The Dartmouth workshop was in 1956. (The other statements, including "AI is a truly universal field", are from the slides/textbook.)

**M1.2 (MCQ) Which approach supports "AI has focused on the study and construction of agents that do the right thing"?**
Answer: the rational agent approach.

**M1.3 (Matching) Match each AI history stage to its period.**
Answer: inception of AI → 1943–1956; a dose of reality → 1966–1973; expert systems → 1969–1986; deep learning → 2011–present.

**M1.4 (MCQ) The key factor that led to the return of neural networks?**
Answer: the back-propagation learning algorithm (reinvented in the mid-1980s).

**M1.5 (Fill in blanks) "___ and ___ are two dimensions in AI definitions by the authors of the textbook."**
Answer: thinking (thought) and behaviour (acting). The other dimension is humanly vs rationally.

**M1.6 (Multiple answers) In which areas were contributions "of lasting and major technical importance to the computer field" recognised by Turing Awards?**
Answer: deep learning and expert systems.

**M1.7 (MCQ) The target of the rational agent approach?**
Answer: behave (act) rationally.

**M1.8 (MCQ) Why did Bengio, Hinton and LeCun receive the Turing Award?**
Answer: making "deep learning" (multilayer neural networks) a critical part of modern computing.

**M1.9 (MCQ) Who won the Turing Award for "developing expert systems that encode human knowledge to solve real-world problems"?**
Answer: Ed Feigenbaum and Raj Reddy.

**M1.10 (Fill in blanks) "___ refers to the ___ of human intelligence in ___ that are programmed to ___ like humans and ___ their actions."**
Answer: Artificial intelligence; simulation; machines; think; mimic.

**M1.11 (Matching) Match each definition to the approach for the same category.**
Answer: Bellman 1978 ("automation of activities we associate with human thinking") → the cognitive modelling approach (thinking humanly); Winston 1992 ("computations that make it possible to perceive, reason and act") → the "laws of thought" approach (thinking rationally); Kurzweil 1990 ("machines that perform functions that require intelligence when performed by people") → the Turing Test approach (acting humanly); Nilsson/Poole ("intelligent behaviour in artifacts") → the rational agent approach (acting rationally).

