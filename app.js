/* =========================================
   STUDYCORE — MAIN APPLICATION
========================================= */

let state = {
  step: "class",

  selected: {
    class: null,
    board: null,
    stream: null,
    subject: null,
    chapter: null,
    topic: null
  },

  topic: null,

  tab: "learn",

  quizScore: 0
};


/* =========================================
   APP ELEMENT
========================================= */

const app = document.getElementById("app");


/* =========================================
   SAFETY HELPERS
========================================= */

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function getKeys(object) {
  return Object.keys(object || {});
}


/* =========================================
   HOME
========================================= */

function goHome() {

  state = {
    step: "class",

    selected: {
      class: null,
      board: null,
      stream: null,
      subject: null,
      chapter: null,
      topic: null
    },

    topic: null,

    tab: "learn",

    quizScore: 0
  };

  render();
}


/* =========================================
   SMALL MESSAGE
========================================= */

function showToast(message) {

  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 1800);
}


/* =========================================
   ACCOUNT
========================================= */

function showAccount() {

  showToast(
    "Accounts and AI will be added in the next stage."
  );
}


/* =========================================
   SELECT AN OPTION
========================================= */

function selectLevel(level, value) {

  state.selected[level] = value;

  const order = [
    "class",
    "board",
    "stream",
    "subject",
    "chapter",
    "topic"
  ];

  const currentIndex = order.indexOf(level);


  /* Clear everything after current selection */

  for (
    let i = currentIndex + 1;
    i < order.length;
    i++
  ) {

    state.selected[order[i]] = null;
  }


  /* Topic selected */

  if (level === "topic") {

    state.topic = value;

    state.tab = "learn";

    state.quizScore = 0;

    renderTopic();

    return;
  }


  /* Move to next step */

  state.step = order[currentIndex + 1];

  render();
}


/* =========================================
   GET CURRENT DATA LEVEL
========================================= */

function getCurrentObject() {

  let object = window.STUDY_DATA || {};

  const selected = state.selected;


  const levels = [
    "class",
    "board",
    "stream",
    "subject",
    "chapter"
  ];


  for (const level of levels) {

    const value = selected[level];


    /*
      Some future classes/boards may not
      need a stream.
    */

    if (
      level === "stream" &&
      object &&
      !Object.prototype.hasOwnProperty.call(
        object,
        value
      )
    ) {

      continue;
    }


    if (
      object &&
      value &&
      Object.prototype.hasOwnProperty.call(
        object,
        value
      )
    ) {

      object = object[value];

    } else {

      return {};
    }
  }


  return object || {};
}


/* =========================================
   BACK
========================================= */

function goBack() {

  const order = [
    "class",
    "board",
    "stream",
    "subject",
    "chapter",
    "topic"
  ];

  const currentIndex =
    order.indexOf(state.step);


  if (currentIndex <= 0) {

    goHome();

    return;
  }


  const previousLevel =
    order[currentIndex - 1];


  state.step = previousLevel;

  state.selected[order[currentIndex]] = null;


  if (state.step !== "topic") {

    state.topic = null;
  }


  render();
}


/* =========================================
   BREADCRUMB
========================================= */

function createPath() {

  const selected = state.selected;


  const levels = [
    "class",
    "board",
    "stream",
    "subject",
    "chapter"
  ];


  const parts = [];


  for (const level of levels) {

    if (selected[level]) {

      parts.push(
        `<span>${escapeHTML(
          selected[level]
        )}</span>`
      );

    }
  }


  return parts.join(" / ");
}


/* =========================================
   MAIN RENDER
========================================= */

function render() {

  if (!window.STUDY_DATA) {

    app.innerHTML = `
      <section class="empty">
        <h2>StudyCore is loading...</h2>
        <p>
          The study database could not be loaded.
        </p>
      </section>
    `;

    return;
  }


  if (state.step === "class") {

    renderChooser(
      "WHAT ARE YOU STUDYING?",
      "Start with your class. Everything here is designed to be simple, practical and free.",
      getKeys(window.STUDY_DATA),
      "class"
    );

    return;
  }


  if (state.step === "board") {

    const classData =
      window.STUDY_DATA[
        state.selected.class
      ];


    renderChooser(
      "CHOOSE YOUR BOARD",
      "Pick the curriculum you follow.",
      getKeys(classData),
      "board"
    );

    return;
  }


  if (state.step === "stream") {

    const boardData =
      window.STUDY_DATA[
        state.selected.class
      ][
        state.selected.board
      ];


    renderChooser(
      "CHOOSE YOUR STREAM",
      "Choose the stream that matches your studies.",
      getKeys(boardData),
      "stream"
    );

    return;
  }


  if (state.step === "subject") {

    const data =
      getCurrentObject();


    renderChooser(
      "CHOOSE A SUBJECT",
      "Choose a subject to continue.",
      getKeys(data),
      "subject"
    );

    return;
  }


  if (state.step === "chapter") {

    const data =
      getCurrentObject();


    renderChooser(
      "CHOOSE A CHAPTER",
      "Choose a chapter to continue.",
      getKeys(data),
      "chapter"
    );

    return;
  }


  if (state.step === "topic") {

    const data =
      getCurrentObject();


    renderChooser(
      "CHOOSE A TOPIC",
      "Learn, practise and test yourself.",
      getKeys(data),
      "topic"
    );

    return;
  }
}


/* =========================================
   CHOOSER SCREEN
========================================= */

function renderChooser(
  title,
  description,
  options,
  level
) {

  const isHome =
    level === "class";


  const optionsHTML =
    options.length > 0

      ? options.map(function (item, index) {

          const safeValue =
            String(item)
              .replace(/\\/g, "\\\\")
              .replace(/'/g, "\\'");


          return `
            <button
              class="choice"
              onclick="selectLevel(
                '${level}',
                '${safeValue}'
              )"
            >

              <div class="num">
                ${String(index + 1).padStart(2, "0")}
              </div>

              <h3>
                ${escapeHTML(item)}
              </h3>

              <p>
                ${level === "topic"
                  ? "Open topic →"
                  : "Continue →"}
              </p>

            </button>
          `;

        }).join("")

      : `
          <div class="empty">
            <h2>Coming soon</h2>
            <p>
              This section is being built.
            </p>
          </div>
        `;


  app.innerHTML = `

    <section class="hero">

      <div class="eyebrow">
        STUDYCORE • FREE LEARNING
      </div>

      <h1>
        ${escapeHTML(title)}
      </h1>

      <p>
        ${escapeHTML(description)}
      </p>

    </section>


    ${
      !isHome
        ? `
          <div class="path">
            ${createPath()}
          </div>

          <div class="back">
            <button onclick="goBack()">
              ← Back
            </button>
          </div>
        `
        : ""
    }


    <div class="section-title">
      ${isHome ? "Choose your class" : "Options"}
    </div>


    <div class="grid">

      ${optionsHTML}

    </div>

  `;
}


/* =========================================
   FIND TOPIC DATA
========================================= */

function getTopicData() {

  const s = state.selected;


  try {

    return window.STUDY_DATA
      [s.class]
      [s.board]
      [s.stream]
      [s.subject]
      [s.chapter]
      [state.topic];

  } catch (error) {

    return null;
  }
}


/* =========================================
   TOPIC PAGE
========================================= */

function renderTopic() {

  const topic =
    getTopicData();


  if (!topic) {

    app.innerHTML = `
      <section class="empty">

        <h2>Topic unavailable</h2>

        <p>
          This topic has not been added yet.
        </p>

        <div class="actions">

          <button
            class="action"
            onclick="state.step='topic'; render();"
          >
            ← Back to topics
          </button>

        </div>

      </section>
    `;

    return;
  }


  const tabs = [
    ["learn", "LEARN"],
    ["practice", "PRACTICE"],
    ["quiz", "QUIZ"],
    ["formulas", "FORMULAS"],
    ["ai", "ASK AI"]
  ];


  let body = "";


  /* =====================================
     LEARN
  ===================================== */

  if (state.tab === "learn") {

    body = `

      <div class="content">

        <h2>
          Understand it first
        </h2>

        <p>
          ${escapeHTML(
            topic.explanation || ""
          )}
        </p>


        <h3>
          Example
        </h3>

        <p>
          ${escapeHTML(
            topic.example || ""
          )}
        </p>


        <h3>
          Important points
        </h3>

        <ul>

          ${
            (topic.points || [])
              .map(function (point) {

                return `
                  <li>
                    ${escapeHTML(point)}
                  </li>
                `;

              })
              .join("")
          }

        </ul>

      </div>

    `;
  }


  /* =====================================
     PRACTICE
  ===================================== */

  if (state.tab === "practice") {

    body = `

      <div class="content">

        <h2>
          Practice
        </h2>

        <p>
          Try these questions yourself first.
        </p>


        ${
          (topic.questions || [])
            .map(function (question, index) {

              return `

                <div class="question">

                  <strong>
                    ${index + 1}.
                    ${escapeHTML(question.q)}
                  </strong>


                  <div class="actions">

                    <button
                      class="action"
                      onclick="showToast(
                        'Solve it on paper first.'
                      )"
                    >
                      Start
                    </button>

                  </div>

                </div>

              `;

            })
            .join("")
        }

      </div>

    `;
  }


  /* =====================================
     QUIZ
  ===================================== */

  if (state.tab === "quiz") {

    body = `

      <div class="content">

        <h2>
          Quick Quiz
        </h2>

        <p>
          Current score:
          <strong>
            ${state.quizScore}
          </strong>
        </p>


        ${
          (topic.questions || [])
            .map(function (question, index) {

              return `

                <div class="question">

                  <strong>
                    ${index + 1}.
                    ${escapeHTML(question.q)}
                  </strong>


                  ${
                    (question.options || [])
                      .map(function (option, optionIndex) {

                        return `

                          <button
                            onclick="
                              answerQuiz(
                                ${index},
                                ${optionIndex}
                              )
                            "
                          >
                            ${escapeHTML(option)}
                          </button>

                        `;

                      })
                      .join("")
                  }

                </div>

              `;

            })
            .join("")
        }

      </div>

    `;
  }


  /* =====================================
     FORMULAS
  ===================================== */

  if (state.tab === "formulas") {

    body = `

      <div class="content">

        <h2>
          Formula / Key Points
        </h2>


        ${
          (topic.formulas || [])
            .map(function (formula) {

              return `
                <div class="formula">
                  ${escapeHTML(formula)}
                </div>
              `;

            })
            .join("")
        }


        <p>
          Tip: understand what each symbol
          means before memorising a formula.
        </p>

      </div>

    `;
  }


  /* =====================================
     AI
  ===================================== */

  if (state.tab === "ai") {

    body = `

      <div class="ai-box">

        <h2>
          Ask AI Tutor
        </h2>

        <p>
          The AI tutor will eventually solve
          questions, explain concepts and
          teach step-by-step.
        </p>


        <textarea
          placeholder="Example: Explain this topic like I'm a beginner..."
        ></textarea>


        <div class="actions">

          <button
            class="action"
            onclick="
              showToast(
                'AI connection comes in the next stage.'
              )
            "
          >
            ASK AI
          </button>

        </div>


        <div class="ai-note">

          Demo stage • AI allowance will be
          3 questions per day.

        </div>

      </div>

    `;
  }


  /* =====================================
     FINAL TOPIC HTML
  ===================================== */

  app.innerHTML = `

    <div class="path">

      ${createPath()}

      / <span>
        ${escapeHTML(state.topic)}
      </span>

    </div>


    <div class="back">

      <button
        onclick="
          state.step='topic';
          render();
        "
      >
        ← Topics
      </button>

    </div>


    <section class="card topic-head">

      <div class="eyebrow">
        TOPIC
      </div>

      <h1>
        ${escapeHTML(state.topic)}
      </h1>

      <p>
        ${escapeHTML(state.selected.subject)}
        •
        ${escapeHTML(state.selected.chapter)}
      </p>

    </section>


    <div class="tabs">

      ${
        tabs.map(function (tab) {

          return `

            <button
              class="tab ${
                state.tab === tab[0]
                  ? "active"
                  : ""
              }"
              onclick="
                state.tab='${tab[0]}';
                renderTopic();
              "
            >
              ${tab[1]}
            </button>

          `;

        }).join("")
      }

    </div>


    <section class="card">

      ${body}

    </section>

  `;
}


/* =========================================
   QUIZ ANSWER
========================================= */

function answerQuiz(
  questionIndex,
  selectedIndex
) {

  const topic =
    getTopicData();


  if (!topic) return;


  const question =
    topic.questions[
      questionIndex
    ];


  if (!question) return;


  if (
    selectedIndex ===
    question.answer
  ) {

    state.quizScore++;

    showToast("Correct ✓");

  } else {

    showToast("Not quite — try again.");

  }


  renderTopic();
}


/* =========================================
   START APP
========================================= */

render();
