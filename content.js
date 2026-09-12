/* =========================================
   STUDYCORE — EDUCATIONAL CONTENT DATABASE
   VERSION 1
========================================= */

window.STUDY_DATA = {

  /* =======================================
     CLASS 10
  ======================================= */

  "Class 10": {

    /* =====================================
       CBSE
    ===================================== */

    "CBSE": {

      "General": {

        /* -------------------------------
           MATHEMATICS
        ------------------------------- */

        "Mathematics": {

          "Real Numbers": {

            "Euclid's Division Lemma": {

              explanation:
                "Euclid's Division Lemma tells us that for positive integers a and b, we can write a = bq + r, where 0 ≤ r < b. Here q is the quotient and r is the remainder.",

              example:
                "For 29 divided by 6: 29 = 6 × 4 + 5. Therefore q = 4 and r = 5.",

              points: [

                "a and b are positive integers.",

                "The remainder r is always smaller than the divisor b.",

                "The lemma is written as a = bq + r.",

                "Euclid's division lemma is the foundation of Euclid's division algorithm.",

                "Euclid's algorithm can be used to find the HCF of two positive integers."

              ],

              formulas: [

                "a = bq + r",

                "0 ≤ r < b"

              ],

              questions: [

                {

                  q:
                    "If 47 = 5q + r and 0 ≤ r < 5, what are q and r?",

                  options: [

                    "q = 9, r = 2",

                    "q = 8, r = 7",

                    "q = 10, r = -3",

                    "q = 7, r = 12"

                  ],

                  answer: 0

                },

                {

                  q:
                    "In a = bq + r, which condition must the remainder satisfy?",

                  options: [

                    "r > b",

                    "r = b",

                    "0 ≤ r < b",

                    "r < 0"

                  ],

                  answer: 2

                },

                {

                  q:
                    "When 35 is divided by 8, what is the remainder?",

                  options: [

                    "2",

                    "3",

                    "4",

                    "5"

                  ],

                  answer: 1

                }

              ]

            }

          }

        },


        /* -------------------------------
           SCIENCE
        ------------------------------- */

        "Science": {

          "Chemical Reactions and Equations": {

            "Introduction to Chemical Reactions": {

              explanation:
                "A chemical reaction is a process in which one or more substances change into new substances with different properties. The starting substances are called reactants and the new substances are called products.",

              example:
                "When magnesium reacts with oxygen, magnesium oxide is formed. Magnesium and oxygen are the reactants, while magnesium oxide is the product.",

              points: [

                "Reactants are the substances present before a reaction.",

                "Products are the substances formed after a reaction.",

                "A chemical equation represents a chemical reaction using symbols and formulas.",

                "Chemical equations should be balanced because atoms are conserved during a chemical reaction."

              ],

              formulas: [

                "Reactants → Products",

                "Number of atoms of each element must be equal on both sides of a balanced equation."

              ],

              questions: [

                {

                  q:
                    "What are the substances present before a chemical reaction called?",

                  options: [

                    "Products",

                    "Reactants",

                    "Catalysts",

                    "Mixtures"

                  ],

                  answer: 1

                },

                {

                  q:
                    "Why should a chemical equation be balanced?",

                  options: [

                    "To make it longer",

                    "To change the products",

                    "Because atoms are conserved",

                    "To increase temperature"

                  ],

                  answer: 2

                }

              ]

            }

          }

        }

      }

    }

  }

};


/* =========================================
   END OF CONTENT DATABASE
========================================= */
