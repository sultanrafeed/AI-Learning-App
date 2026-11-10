# AI Quest: questions on the lecturer's 4 exam-prep sheets (IoU/NMS, convolution parameters, RNN update, Type vs Patrons) (42172 Introduction to AI)

Generated 2026-11-10 from the app's question bank. Each question shows its type, difficulty and source, then the answer and the worked solution.
Types: MCQ (one answer), MULTI (select all that apply), TF (true/false), BLANK (fill one blank), BLANKS (fill several), MATCH (matching).
Part A of each topic = hand-written questions (lectures, workshops, key-points sheets, class exercises, Books 1-3, AIMA). Part B = computer-generated calculation drills (fresh numbers for every skill).

## Contents

- 🌳 Decision Trees (Lecture 4): 18 hand-written + 0 calculation drills
- 🧱 CNNs & Computer Vision (Lecture 7): 12 hand-written + 0 calculation drills
- 📦 Object Detection (IoU & NMS) (Lecture 7): 23 hand-written + 0 calculation drills
- 🔁 Sequence Models & NLP (Lecture 8): 10 hand-written + 0 calculation drills

**Total: 63 questions.**


---

# 🌳 Decision Trees (Lecture 4)

## Part A: hand-written questions (18)

### TREES A1. [BLANK · Medium · calculation]

Entropy of [2+, 4−] in bits (4 decimal places).

**Answer:** 0.9183
(Also accepted: 0.918)

**Takeaway:** −(1/3)log₂(1/3) − (2/3)log₂(2/3).

*Source: Comparing two attributes to split (Type vs Patrons)*

### TREES A2. [BLANK · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Restaurant data: IG(Patrons) = 1 − [2/12·0 + 4/12·0 + 6/12·0.9183] = ______ bits (4 dp).

**Answer:** 0.5409
(Also accepted: 0.541)

**Takeaway:** Weighted child entropy 0.4591.

*Source: Comparing two attributes to split (Type vs Patrons)*

### TREES A3. [BLANK · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Restaurant data: every Type branch (French 1/1, Italian 1/1, Thai 2/2, Burger 2/2) is 50/50. IG(Type) = ______.

**Answer:** 0
(Also accepted: 0.0, 0.0000)

**Takeaway:** Weighted child entropy = 1 = parent entropy.

*Source: Comparing two attributes to split (Type vs Patrons)*

### TREES A4. [MULTI · Hard · calculation]

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

### TREES A5. [MCQ · Easy · calculation]

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

### TREES A6. [BLANKS · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

Patrons split: weighted child Gini = ______ and Gini reduction = ______ (4 dp).

  (1) weighted Gini = ____
  (2) reduction = ____

**Answer:** weighted Gini = 0.2222; reduction = 0.2778

**Takeaway:** 0.5 − 0.2222 = 0.2778.

*Source: Comparing two attributes to split (Type vs Patrons)*

### TREES A7. [MCQ · Medium · calculation]

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

### TREES A8. [MULTI · Medium]

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

### TREES A9. [BLANKS · Medium · calculation]

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

### TREES A10. [BLANKS · Medium · calculation]

[Diagram as text] Labels: Patrons? · [6+, 6−] · None · [0+, 2−] · Some · [4+, 0−] · Full · [2+, 4−]

    [Diagram as text] Labels: Type? · [6+, 6−] · French · [1+, 1−] · Italian · [1+, 1−] · Thai · [2+, 2−] · Burger · [2+, 2−]
Restaurant data (Lecture 4, 12 examples, WillWait 6 yes / 6 no).

AIMA restaurant data (12 examples, 6+/6−): Gain(Patrons) ≈ ___ bits (3 d.p.) and Gain(Type) = ___.

  (1) Patrons = ____
  (2) Type = ____

**Answer:** Patrons = 0.541; Type = 0

**Takeaway:** Patrons is the root, exactly as in Lecture 4.

*Source: AIMA 4th ed. (Russell & Norvig 2022), Ch. 19: restaurant example*

### TREES A11. [BLANKS · Easy · calculation]

Step 1 of the sheet: parent set of 12 (6 positive: 1, 3, 4, 6, 8, 12; 6 negative). Entropy(Parent) = ___ bit; Gini(Parent) = ___ (4 d.p.).

  (1) entropy = ____
  (2) Gini = ____

**Answer:** entropy = 1.0000; Gini = 0.5000

**Takeaway:** p(pos) = p(neg) = 0.5.

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*

### TREES A12. [BLANKS · Medium · calculation]

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

### TREES A13. [BLANKS · Medium · calculation]

Type: each branch Gini = ___; weighted child Gini = ___; Gini reduction = ___ (4 d.p.).

  (1) branch Gini = ____
  (2) weighted = ____
  (3) reduction = ____

**Answer:** branch Gini = 0.5000; weighted = 0.5000; reduction = 0.0000

**Takeaway:** No improvement.

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*

### TREES A14. [BLANKS · Medium · calculation]

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

### TREES A15. [BLANKS · Medium · calculation]

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

### TREES A16. [MCQ · Easy]

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

### TREES A17. [TF · Medium]

In the sheet, the weighted child entropy for Type is the plain average (1 + 1 + 1 + 1)/4.

**Answer:** False

**Why:** It weights by branch size: 2/12, 2/12, 4/12, 4/12 (here it happens to give the same 1.0).

**Takeaway:** Weights are |subset|/|parent|.

*Source: Comparing two attributes to split (Type vs Patrons) step-by-step sheet*

### TREES A18. [BLANKS · Hard · calculation]

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


---

# 🧱 CNNs & Computer Vision (Lecture 7)

## Part A: hand-written questions (12)

### CNN A1. [MCQ · Easy · calculation]

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

### CNN A2. [TF · Medium]

A bigger input image means a convolutional layer has more trainable parameters.

**Answer:** False

**Why:** Weights are reused across positions; image size doesn't add parameters.

**Takeaway:** Weight sharing.

*Source: Key points about convolution filters and parameter counts*

### CNN A3. [MULTI · Medium]

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

### CNN A4. [BLANK · Easy · calculation]

Two 3 × 3 filters on RGB input with one bias each: ___ parameters.

**Answer:** 56

**Working:**
  - (3·3·3 + 1) × 2 = 56

**Takeaway:** (K × K × C_in + 1) × filters.

*Source: Book 2 (Exam examples), Q210, p. 31*

### CNN A5. [BLANK · Easy · calculation]

Sheet rule: a 3 by 3 filter on RGB input contains ___ weights.

**Answer:** 27

**Takeaway:** 3 × 3 × 3: each filter spans all input channels.

*Source: Key points about convolution filters and parameter counts*

### CNN A6. [BLANK · Medium · calculation]

Four 5 by 5 filters on RGB input, one bias per filter. Trainable parameters = ___.

**Answer:** 304

**Working:**
  - 5 × 5 × 3 = 75
  - + 1 bias = 76
  - × 4 filters = 304

**Takeaway:** (5 × 5 × 3 + 1) × 4.

*Source: Key points about convolution filters and parameter counts*

### CNN A7. [BLANK · Medium · calculation]

Eight 3 by 3 filters on an input with 16 channels, no bias. Trainable parameters = ___.

**Answer:** 1152
(Also accepted: 1,152)

**Working:**
  - 3 × 3 × 16 = 144
  - × 8 = 1152

**Takeaway:** No bias stated → no +1.

*Source: Key points about convolution filters and parameter counts*

### CNN A8. [BLANK · Medium · calculation]

Two 3 by 3 filters on a greyscale (1-channel) input, one bias per filter. Trainable parameters = ___.

**Answer:** 20

**Takeaway:** (9 + 1) × 2.

*Source: Key points about convolution filters and parameter counts*

### CNN A9. [BLANK · Easy]

Sheet rule: a layer with 6 filters produces ___ output feature maps (output channels).

**Answer:** 6

**Takeaway:** One map per filter.

*Source: Key points about convolution filters and parameter counts*

### CNN A10. [TF · Medium]

Moving from a 32 × 32 to a 224 × 224 RGB image changes the parameter count of a layer of two 3 × 3 filters (with biases).

**Answer:** False

**Why:** Still (27 + 1) × 2 = 56: weights are reused across positions.

**Takeaway:** Image size never adds parameters.

*Source: Key points about convolution filters and parameter counts*

### CNN A11. [MCQ · Medium]

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

### CNN A12. [MULTI · Easy]

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


---

# 📦 Object Detection (IoU & NMS) (Lecture 7)

## Part A: hand-written questions (23)

### DETECT A1. [TF · Medium]

Object detection outputs a fixed number of boxes for every image.

**Answer:** False

**Why:** One image → a VARIABLE-length set of object records.

**Takeaway:** Count of objects varies.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### DETECT A2. [BLANK · Easy · calculation]

80 × 80 locations × 3 window scales × 3 aspect ratios = ______ candidate crops.

**Answer:** 57600
(Also accepted: 57,600)

**Takeaway:** Lecture 7 slide 60.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### DETECT A3. [TF · Medium]

YOLO processes all 400 spatial locations of a 20×20 feature map together in one pass.

**Answer:** True

**Why:** Lecture 7 slide 61.

**Takeaway:** One look.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### DETECT A4. [BLANK · Medium · calculation]

A YOLO head with C = 3 classes on a 20×20 grid predicts 20×20×______ values.

**Answer:** 8

**Takeaway:** 5 + C = 8.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### DETECT A5. [MCQ · Easy · calculation]

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

### DETECT A6. [TF · Easy]

If two boxes do not overlap at all, their IoU is 0.

**Answer:** True

**Why:** Intersection 0 → IoU 0.

**Takeaway:** IoU ∈ [0, 1].

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### DETECT A7. [TF · Medium]

Union area = area of A + area of B.

**Answer:** False

**Why:** Union = A + B − intersection; otherwise the overlap is counted twice.

**Takeaway:** Classic IoU trap.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### DETECT A8. [BLANKS · Medium · calculation]

Boxes (1,1)-(5,5) and (3,3)-(7,7). Intersection = ______, union = ______, IoU = ______ (3 dp).

  (1) I = ____
  (2) U = ____
  (3) IoU = ____

**Answer:** I = 4; U = 28; IoU = 0.143

**Takeaway:** Overlap 2×2 = 4; 16 + 16 − 4 = 28.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### DETECT A9. [MCQ · Medium · calculation]

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

### DETECT A10. [MCQ · Medium]

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

### DETECT A11. [TF · Medium]

NMS suppresses overlapping boxes even when they belong to different classes.

**Answer:** False

**Why:** Suppression is applied to boxes of the SAME class.

**Takeaway:** Per-class NMS.

*Source: Key points about IoU and non-max suppression*

### DETECT A12. [MATCH · Medium]

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

### DETECT A13. [TF · Easy]

Semantic segmentation predicts one class for every pixel.

**Answer:** True

**Why:** Lecture 7 slide 63.

**Takeaway:** Per-pixel classification.

*Source: Lecture 7 (Object detection) + Key points about IoU and NMS*

### DETECT A14. [BLANKS · Medium · calculation]

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

### DETECT A15. [BLANKS · Medium · calculation]

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

### DETECT A16. [BLANKS · Medium · calculation]

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

### DETECT A17. [MCQ · Easy]

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

### DETECT A18. [TF · Easy]

For corner coordinates, a box's width is the larger x-coordinate minus the smaller x-coordinate.

**Answer:** True

**Why:** Height likewise uses y; area = width × height.

**Takeaway:** Width from x, height from y.

*Source: Key points about IoU and non-max suppression*

### DETECT A19. [MULTI · Hard · calculation]

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

### DETECT A20. [MULTI · Hard · calculation]

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

### DETECT A21. [MCQ · Medium]

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

### DETECT A22. [MCQ · Easy]

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

### DETECT A23. [BLANK · Easy · calculation]

Sheet example: A (0,0)–(6,4), B (2,0)–(8,4). IoU = ___ (2 d.p.).

**Answer:** 0.50
(Also accepted: 0.5, 1/2)

**Working:**
  - Each area 24; overlap 4 × 4 = 16; union 32; IoU 0.50

**Takeaway:** 16/32.

*Source: Key points about IoU and non-max suppression*


---

# 🔁 Sequence Models & NLP (Lecture 8)

## Part A: hand-written questions (10)

### SEQ A1. [MCQ · Easy · calculation]

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

### SEQ A2. [BLANKS · Easy · calculation]

Key points sheet: x = 2, w_x = 0.5, h_prev = 0.4, w_h = 0.25, no bias, tanh with tanh(1.1) = 0.800 supplied. Sum ___; new state ___.

  (1) sum = ____
  (2) h = ____

**Answer:** sum = 1.1; h = 0.800

**Working:**
  - 0.5 × 2 + 0.25 × 0.4 = 1.1
  - tanh(1.1) = 0.800

**Takeaway:** The sum is not the answer: apply tanh.

*Source: Book 2 (Exam examples), Q239, p. 34*

### SEQ A3. [MCQ · Easy]

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

### SEQ A4. [BLANKS · Medium · calculation]

Current input = 3, input weight = 0.2, previous state = 0.5, recurrent weight = 0.4, no bias. Sum = ___; with tanh(0.8) supplied as 0.664, new state = ___.

  (1) sum = ____
  (2) new state = ____

**Answer:** sum = 0.8; new state = 0.664

**Working:**
  - 0.6 + 0.2 = 0.8
  - tanh(0.8) = 0.664 (supplied)

**Takeaway:** 0.2 × 3 + 0.4 × 0.5.

*Source: Key points about a simple RNN hidden-state update*

### SEQ A5. [BLANKS · Medium · calculation]

Current input = 1, input weight = 0.6, previous state = −0.5, recurrent weight = 0.4, bias 0.1. Sum = ___; with tanh(0.5) supplied as 0.462, new state = ___.

  (1) sum = ____
  (2) new state = ____

**Answer:** sum = 0.5; new state = 0.462

**Working:**
  - 0.6 − 0.2 + 0.1 = 0.5
  - tanh(0.5) = 0.462

**Takeaway:** Bias is included because it is specified.

*Source: Key points about a simple RNN hidden-state update*

### SEQ A6. [MCQ · Hard]

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

### SEQ A7. [TF · Easy]

The sum before the activation is the new hidden state.

**Answer:** False

**Why:** Apply the activation (use the supplied tanh lookup).

**Takeaway:** Sum ≠ state.

*Source: Key points about a simple RNN hidden-state update*

### SEQ A8. [TF · Easy]

The previous hidden state carries information from earlier steps of the sequence.

**Answer:** True

**Why:** That is how an RNN remembers.

**Takeaway:** Memory = previous state.

*Source: Key points about a simple RNN hidden-state update*

### SEQ A9. [MCQ · Medium]

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

### SEQ A10. [BLANK · Medium · calculation]

Previous state 0, input 1, input weight 1, recurrent weight 0.9, no bias; tanh(1) supplied as 0.76159. Give the new state to 2 decimal places.

**Answer:** 0.76

**Takeaway:** Round only the final result.

*Source: Key points about a simple RNN hidden-state update*
