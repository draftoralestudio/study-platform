/* =========================================================
   STUDYCORE — MAIN APPLICATION
   ========================================================= */

const app = document.getElementById("app");

const state = {
  step: 0,

  className: null,
  board: null,
  stream: null,
  subject: null,
  book: null,
  chapter: null,
  topic: null,

  tab: "learn",
  quizScore: 0,
  quizAnswered: false
};


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function getData() {
  if (
    typeof window.STUDY_DATA !== "object" ||
    window.STUDY_DATA === null
  ) {
    return {};
  }

  return window.STUDY_DATA;
}


function getKeys(object) {
  if (!object || typeof object !== "object") {
    return [];
  }

  return Object.keys(object);
}


function getCurrentObject() {
  const data = getData();

  let current = data;

  if (state.className) {
    current = current[state.className];
  }

  if (state.board) {
    current = current[state.board];
  }

  if (state.stream) {
    current = current[state.stream];
  }

  if (state.subject) {
    current = current[state.subject];
  }

  if (state.book) {
    current = current[state.book];
  }

  if (state.chapter) {
    current = current[state.chapter];
  }

  return current || {};
}


/* =========================================================
   SAFE CLICK VALUE
   ========================================================= */

function encodeValue(value) {
  return encodeURIComponent(String(value));
}


function decodeValue(value) {
  return decodeURIComponent(value);
}


/* =========================================================
   HOME
   ========================================================= */

function goHome() {

  state.step = 0;

  state.className = null;
  state.board = null;
  state.stream = null;
  state.subject = null;
  state.book = null;
  state.chapter = null;
  state.topic = null;

  state.tab = "learn";
  state.quizScore = 0;
  state.quizAnswered = false;

  render();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   ACCOUNT
   ========================================================= */

function showAccount() {

  showToast(
    "Student accounts and AI access are coming soon."
  );
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.studyCoreToastTimer);

  window.studyCoreToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


/* =========================================================
   SELECTION ENGINE
   ========================================================= */

function selectLevel(type, encodedValue) {

  const value = decodeValue(encodedValue);

  if (type === "class") {

    state.className = value;

    state.board = null;
    state.stream = null;
    state.subject = null;
    state.book = null;
    state.chapter = null;
    state.topic = null;

    state.step = 1;
  }


  else if (type === "board") {

    state.board = value;

    state.stream = null;
    state.subject = null;
    state.book = null;
    state.chapter = null;
    state.topic = null;

    state.step = 2;
  }


  else if (type === "stream") {

    state.stream = value;

    state.subject = null;
    state.book = null;
    state.chapter = null;
    state.topic = null;

    state.step = 3;
  }


  else if (type === "subject") {

    state.subject = value;

    state.book = null;
    state.chapter = null;
    state.topic = null;

    state.step = 4;
  }


  else if (type === "book") {

    state.book = value;

    state.chapter = null;
    state.topic = null;

    state.step = 5;
  }


  else if (type === "chapter") {

    state.chapter = value;

    state.topic = null;

    state.step = 6;
  }


  else if (type === "topic") {

    state.topic = value;

    state.step = 7;

    state.tab = "learn";
    state.quizScore = 0;
    state.quizAnswered = false;
  }

  render();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   BACK
   ========================================================= */

function goBack() {

  if (state.step <= 0) {
    goHome();
    return;
  }

  if (state.step === 1) {

    state.className = null;
    state.step = 0;
  }

  else if (state.step === 2) {

    state.board = null;
    state.step = 1;
  }

  else if (state.step === 3) {

    state.stream = null;
    state.step = 2;
  }

  else if (state.step === 4) {

    state.subject = null;
    state.step = 3;
  }

  else if (state.step === 5) {

    state.book = null;
    state.step = 4;
  }

  else if (state.step === 6) {

    state.chapter = null;
    state.step = 5;
  }

  else if (state.step === 7) {

    state.topic = null;
    state.step = 6;
  }

  state.tab = "learn";

  render();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   BREADCRUMB
   ========================================================= */

function createPath() {

  const parts = [];

  if (state.className) parts.push(state.className);
  if (state.board) parts.push(state.board);
  if (state.stream) parts.push(state.stream);
  if (state.subject) parts.push(state.subject);
  if (state.book) parts.push(state.book);
  if (state.chapter) parts.push(state.chapter);
  if (state.topic) parts.push(state.topic);

  return parts
    .map(item => escapeHTML(item))
    .join(" / ");
}


/* =========================================================
   CARD
   ========================================================= */

function createOptionCard(title, index, type) {

  return `
    <button
      class="option-card"
      onclick="selectLevel(
        '${escapeHTML(type)}',
        '${encodeValue(title)}'
      )"
    >

      <span class="card-number">
        ${String(index + 1).padStart(2, "0")}
      </span>

      <strong>
        ${escapeHTML(title)}
      </strong>

      <span class="card-action">
        Continue →
      </span>

    </button>
  `;
}


/* =========================================================
   PAGE HEADER
   ========================================================= */

function pageHeader(title, subtitle) {

  return `
    <section class="hero">

      <div class="eyebrow">
        STUDYCORE • FREE LEARNING
      </div>

      <h1>
        ${escapeHTML(title)}
      </h1>

      <p>
        ${escapeHTML(subtitle)}
      </p>

    </section>
  `;
}


/* =========================================================
   BACK BUTTON
   ========================================================= */

function backButton() {

  return `
    <button
      class="back-button"
      onclick="goBack()"
    >
      ← Back
    </button>
  `;
}


/* =========================================================
   CHOOSER
   ========================================================= */

function renderChooser(title, subtitle, items, type) {

  if (!items || items.length === 0) {

    return `
      ${pageHeader(title, subtitle)}

      ${backButton()}

      <section class="empty-state">

        <h2>
          Coming soon
        </h2>

        <p>
          This section is being built.
        </p>

      </section>
    `;
  }


  return `
    ${pageHeader(title, subtitle)}

    <div class="breadcrumb">
      ${createPath()}
    </div>

    ${backButton()}

    <section class="options-section">

      <div class="section-label">
        OPTIONS
      </div>

      <div class="option-grid">

        ${items
          .map((item, index) =>
            createOptionCard(item, index, type)
          )
          .join("")}

      </div>

    </section>
  `;
}


/* =========================================================
   DETERMINE AVAILABLE STREAMS
   ========================================================= */

function getStreams() {

  const current = getData()[state.className]?.[state.board];

  if (!current) {
    return [];
  }

  return getKeys(current);
}


/* =========================================================
   DETERMINE WHETHER A LEVEL IS A BOOK
   ========================================================= */

function looksLikeTopicData(object) {

  if (!object || typeof object !== "object") {
    return false;
  }

  return (
    "explanation" in object ||
    "example" in object ||
    "points" in object ||
    "formulas" in object ||
    "questions" in object
  );
}


/* =========================================================
   TOPIC DATA
   ========================================================= */

function getTopicData() {

  const current = getCurrentObject();

  if (!current || typeof current !== "object") {
    return {};
  }

  return current;
}


/* =========================================================
   TAB SWITCHING
   ========================================================= */

function setTab(tab) {

  state.tab = tab;

  renderTopic();
}


/* =========================================================
   QUIZ
   ========================================================= */

function answerQuiz(answerIndex, correctIndex) {

  if (state.quizAnswered) {
    return;
  }

  state.quizAnswered = true;

  if (answerIndex === correctIndex) {
    state.quizScore += 1;
    showToast("Correct! 🎉");
  } else {
    showToast("Not quite. Check the explanation.");
  }

  renderTopic();
}


/* =========================================================
   AI PLACEHOLDER
   ========================================================= */

function askAI() {

  showToast(
    "AI Tutor will be available soon."
  );
}


/* =========================================================
   TOPIC PAGE
   ========================================================= */

function renderTopic() {

  const data = getTopicData();

  const questions =
    Array.isArray(data.questions)
      ? data.questions
      : [];

  const points =
    Array.isArray(data.points)
      ? data.points
      : [];

  const formulas =
    Array.isArray(data.formulas)
      ? data.formulas
      : [];


  let content = "";


  /* -------------------------------------------------------
     LEARN
     ------------------------------------------------------- */

  if (state.tab === "learn") {

    content = `
      <div class="content-card">

        <div class="content-label">
          LEARN
        </div>

        <h2>
          ${escapeHTML(state.topic)}
        </h2>

        <p>
          ${escapeHTML(
            data.explanation ||
            "StudyCore explanation coming soon."
          )}
        </p>

        ${
          data.example
            ? `
              <div class="example-box">

                <strong>
                  Example
                </strong>

                <p>
                  ${escapeHTML(data.example)}
                </p>

              </div>
            `
            : ""
        }

        ${
          points.length
            ? `
              <div class="points-box">

                <h3>
                  Important Points
                </h3>

                <ul>

                  ${points
                    .map(point => `
                      <li>
                        ${escapeHTML(point)}
                      </li>
                    `)
                    .join("")}

                </ul>

              </div>
            `
            : ""
        }

      </div>
    `;
  }


  /* -------------------------------------------------------
     PRACTICE
     ------------------------------------------------------- */

  else if (state.tab === "practice") {

    content = `
      <div class="content-card">

        <div class="content-label">
          PRACTICE
        </div>

        <h2>
          Practice Questions
        </h2>

        ${
          questions.length
            ? questions
                .map((question, index) => `
                  <div class="question-card">

                    <span class="question-number">
                      ${index + 1}
                    </span>

                    <p>
                      ${escapeHTML(
                        typeof question === "string"
                          ? question
                          : question.question
                      )}
                    </p>

                  </div>
                `)
                .join("")
            : `
              <p>
                Practice questions are being added.
              </p>
            `
        }

      </div>
    `;
  }


  /* -------------------------------------------------------
     QUIZ
     ------------------------------------------------------- */

  else if (state.tab === "quiz") {

    if (!questions.length) {

      content = `
        <div class="content-card">

          <div class="content-label">
            QUIZ
          </div>

          <h2>
            Quiz coming soon
          </h2>

          <p>
            Questions will be added here.
          </p>

        </div>
      `;

    } else {

      const quizQuestions = questions.filter(
        q =>
          typeof q === "object" &&
          Array.isArray(q.options)
      );


      if (!quizQuestions.length) {

        content = `
          <div class="content-card">

            <div class="content-label">
              QUIZ
            </div>

            <h2>
              Quiz coming soon
            </h2>

            <p>
              Interactive multiple-choice questions
              will be added here.
            </p>

          </div>
        `;

      } else {

        const quiz = quizQuestions[0];

        const correctIndex =
          Number.isInteger(quiz.answer)
            ? quiz.answer
            : 0;

        content = `
          <div class="content-card">

            <div class="content-label">
              QUIZ
            </div>

            <div class="quiz-score">
              Score: ${state.quizScore}
            </div>

            <h2>
              ${escapeHTML(quiz.question)}
            </h2>

            <div class="quiz-options">

              ${quiz.options
                .map((option, index) => `
                  <button
                    class="quiz-option"
                    onclick="answerQuiz(
                      ${index},
                      ${correctIndex}
                    )"
                  >
                    ${escapeHTML(option)}
                  </button>
                `)
                .join("")}

            </div>

            ${
              state.quizAnswered
                ? `
                  <div class="quiz-result">

                    ${
                      state.quizScore > 0
                        ? "Correct! 🎉"
                        : "Review the concept and try again."
                    }

                  </div>
                `
                : ""
            }

          </div>
        `;
      }
    }
  }


  /* -------------------------------------------------------
     FORMULAS
     ------------------------------------------------------- */

  else if (state.tab === "formulas") {

    content = `
      <div class="content-card">

        <div class="content-label">
          KEY POINTS
        </div>

        <h2>
          Formulas & Key Concepts
        </h2>

        ${
          formulas.length
            ? `
              <div class="formula-list">

                ${formulas
                  .map(formula => `
                    <div class="formula-card">
                      ${escapeHTML(formula)}
                    </div>
                  `)
                  .join("")}

              </div>
            `
            : `
              <p>
                Formula and key-point notes are being added.
              </p>
            `
        }

      </div>
    `;
  }


  /* -------------------------------------------------------
     AI
     ------------------------------------------------------- */

  else if (state.tab === "ai") {

    content = `
      <div class="ai-box">

        <div class="content-label">
          ASK AI
        </div>

        <h2>
          StudyCore AI Tutor
        </h2>

        <p>
          Ask questions, get step-by-step explanations,
          understand formulas and learn difficult concepts.
        </p>

        <div class="ai-limit">
          3 questions per day
        </div>

        <button
          class="primary-button"
          onclick="askAI()"
        >
          ASK THE AI →
        </button>

        <small>
          AI Tutor is being connected to the StudyCore
          learning system.
        </small>

      </div>
    `;
  }


  app.innerHTML = `

    <section class="topic-page">

      ${pageHeader(
        state.topic,
        "Learn the concept, practise it and test yourself."
      )}

      <div class="breadcrumb">
        ${createPath()}
      </div>

      ${backButton()}

      <div class="topic-tabs">

        <button
          class="${state.tab === "learn" ? "active" : ""}"
          onclick="setTab('learn')"
        >
          LEARN
        </button>

        <button
          class="${state.tab === "practice" ? "active" : ""}"
          onclick="setTab('practice')"
        >
          PRACTICE
        </button>

        <button
          class="${state.tab === "quiz" ? "active" : ""}"
          onclick="setTab('quiz')"
        >
          QUIZ
        </button>

        <button
          class="${state.tab === "formulas" ? "active" : ""}"
          onclick="setTab('formulas')"
        >
          KEY POINTS
        </button>

        <button
          class="${state.tab === "ai" ? "active" : ""}"
          onclick="setTab('ai')"
        >
          ASK AI
        </button>

      </div>

      ${content}

    </section>

  `;
}


/* =========================================================
   MAIN RENDER ENGINE
   ========================================================= */

function render() {

  const data = getData();

  /* -------------------------------------------------------
     STEP 0 — CLASS
     ------------------------------------------------------- */

  if (state.step === 0) {

    const classes = getKeys(data);

    app.innerHTML = `

      ${pageHeader(
        "What are you studying?",
        "Start with your class. Everything here is designed to be simple, practical and free."
      )}

      <section class="options-section">

        <div class="section-label">
          CHOOSE YOUR CLASS
        </div>

        <div class="option-grid">

          ${
            classes.length
              ? classes
                  .map((item, index) =>
                    createOptionCard(
                      item,
                      index,
                      "class"
                    )
                  )
                  .join("")
              : `
                <p>
                  Curriculum is being prepared.
                </p>
              `
          }

        </div>

      </section>
    `;

    return;
  }


  /* -------------------------------------------------------
     STEP 1 — BOARD / CURRICULUM
     ------------------------------------------------------- */

  if (state.step === 1) {

    const current =
      data[state.className] || {};

    const boards = getKeys(current);

    app.innerHTML =
      renderChooser(
        "Choose your board",
        "Pick the curriculum you follow.",
        boards,
        "board"
      );

    return;
  }


  /* -------------------------------------------------------
     STEP 2 — STREAM
     ------------------------------------------------------- */

  if (state.step === 2) {

    const streams = getStreams();

    /*
      If there is only one stream such as "General",
      we still show it because it keeps the data structure
      consistent and lets the user choose it.
    */

    app.innerHTML =
      renderChooser(
        "Choose your stream",
        "Choose the stream that matches your studies.",
        streams,
        "stream"
      );

    return;
  }


  /* -------------------------------------------------------
     STEP 3 — SUBJECT
     ------------------------------------------------------- */

  if (state.step === 3) {

    const current = getCurrentObject();

    const subjects = getKeys(current);

    app.innerHTML =
      renderChooser(
        "Choose a subject",
        "Choose a subject to continue.",
        subjects,
        "subject"
      );

    return;
  }


  /* -------------------------------------------------------
     STEP 4 — BOOK
     ------------------------------------------------------- */

  if (state.step === 4) {

    const current = getCurrentObject();

    const books = getKeys(current);

    /*
      If a subject directly contains topics rather than books,
      allow the system to continue without forcing a book.
    */

    const hasDirectTopic =
      books.some(book =>
        looksLikeTopicData(current[book])
      );

    if (hasDirectTopic) {

      /*
        Treat the current subject as the topic container.
        We skip the book screen.
      */

      state.step = 5;

      render();

      return;
    }


    app.innerHTML =
      renderChooser(
        "Choose your book",
        "Pick the book you want to study.",
        books,
        "book"
      );

    return;
  }


  /* -------------------------------------------------------
     STEP 5 — CHAPTER
     ------------------------------------------------------- */

  if (state.step === 5) {

    const current = getCurrentObject();

    const chapters = getKeys(current);

    app.innerHTML =
      renderChooser(
        "Choose a chapter",
        "Choose a chapter to continue.",
        chapters,
        "chapter"
      );

    return;
  }


  /* -------------------------------------------------------
     STEP 6 — TOPIC
     ------------------------------------------------------- */

  if (state.step === 6) {

    const current = getCurrentObject();

    const topics = getKeys(current);

    app.innerHTML =
      renderChooser(
        "Choose a topic",
        "Choose a topic to start studying.",
        topics,
        "topic"
      );

    return;
  }


  /* -------------------------------------------------------
     STEP 7 — TOPIC CONTENT
     ------------------------------------------------------- */

  if (state.step === 7) {

    renderTopic();

    return;
  }
}


/* =========================================================
   START APPLICATION
   ========================================================= */

render();
