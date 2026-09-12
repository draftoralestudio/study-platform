/* =========================================================
   STUDYCORE — MAIN APPLICATION
   ========================================================= */

const DATA_FILES = {

  NCERT: {

    "10": {

      English: {
        "Footprints Without Feet":
          "data/ncert/class10/english/footprints.js",

        "First Flight":
          "data/ncert/class10/english/first-flight.js",

        Grammar:
          "data/ncert/class10/english/grammar.js"
      }

    }

  },

  WBBSE: {},

  WBCHSE: {}

};


/* =========================================================
   APP STATE
   ========================================================= */

const state = {

  step: "class",

  className: null,

  board: null,

  stream: null,

  subject: null,

  book: null,

  chapter: null,

  topic: null,

  tab: "learn"

};


/* =========================================================
   HELPERS
   ========================================================= */

const app = document.getElementById("app");

let loadedData = null;


/* Escape HTML safely */
function escapeHTML(value) {

  if (value === undefined || value === null) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* Toast */
function showToast(message) {

  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);

}


/* =========================================================
   HOME
   ========================================================= */

function goHome() {

  state.step = "class";

  state.className = null;
  state.board = null;
  state.stream = null;
  state.subject = null;
  state.book = null;
  state.chapter = null;
  state.topic = null;
  state.tab = "learn";

  loadedData = null;

  render();

}


/* =========================================================
   ACCOUNT
   ========================================================= */

function showAccount() {

  alert(
    "StudyCore accounts will be connected here later.\n\n" +
    "AI Tutor will require an account."
  );

}


/* =========================================================
   RESET
   ========================================================= */

function resetFrom(level) {

  if (level === "class") {

    state.className = null;
    state.board = null;
    state.stream = null;
    state.subject = null;
    state.book = null;
    state.chapter = null;
    state.topic = null;

  }

  if (level === "board") {

    state.board = null;
    state.stream = null;
    state.subject = null;
    state.book = null;
    state.chapter = null;
    state.topic = null;

  }

  if (level === "stream") {

    state.stream = null;
    state.subject = null;
    state.book = null;
    state.chapter = null;
    state.topic = null;

  }

  if (level === "subject") {

    state.subject = null;
    state.book = null;
    state.chapter = null;
    state.topic = null;

  }

  if (level === "book") {

    state.book = null;
    state.chapter = null;
    state.topic = null;

  }

  if (level === "chapter") {

    state.chapter = null;
    state.topic = null;

  }

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function chooseClass(value) {

  resetFrom("class");

  state.className = value;

  state.step = "board";

  render();

}


function chooseBoard(value) {

  resetFrom("board");

  state.board = value;

  if (state.className === "10") {

    state.stream = "General";

    state.step = "subject";

  } else {

    state.step = "stream";

  }

  render();

}


function chooseStream(value) {

  resetFrom("stream");

  state.stream = value;

  state.step = "subject";

  render();

}


function chooseSubject(value) {

  resetFrom("subject");

  state.subject = value;

  state.step = "book";

  render();

}


async function chooseBook(value) {

  resetFrom("book");

  state.book = value;

  state.step = "chapter";

  await loadSubjectData();

  render();

}


function chooseChapter(value) {

  state.chapter = value;

  state.topic = null;

  state.step = "topic";

  render();

}


function chooseTopic(value) {

  state.topic = value;

  state.tab = "learn";

  render();

}


function goBack() {

  if (state.step === "board") {

    state.step = "class";

  }

  else if (state.step === "stream") {

    state.step = "board";

  }

  else if (state.step === "subject") {

    state.step = state.className === "10"
      ? "board"
      : "stream";

  }

  else if (state.step === "book") {

    state.step = "subject";

  }

  else if (state.step === "chapter") {

    state.step = "book";

  }

  else if (state.step === "topic") {

    state.step = "chapter";

  }

  render();

}


/* =========================================================
   LOAD DATA FILE
   ========================================================= */

function loadScript(src) {

  return new Promise((resolve, reject) => {

    const oldScript =
      document.querySelector(
        'script[data-study-data="true"]'
      );

    if (oldScript) {
      oldScript.remove();
    }

    window.STUDY_DATA = null;

    const script = document.createElement("script");

    script.src = new URL(src, window.location.href).href;

    script.dataset.studyData = "true";

    script.onload = () => {

      if (window.STUDY_DATA) {

        resolve(window.STUDY_DATA);

      } else {

        reject(
          new Error(
            "STUDY_DATA was not created by " + src
          )
        );

      }

    };

    script.onerror = () => {

      reject(
        new Error(
          "Could not load " + src
        )
      );

    };

    document.body.appendChild(script);

  });

}


async function loadSubjectData() {

  loadedData = null;

  const classData =
    DATA_FILES[state.board]?.[state.className];

  if (!classData) {

    console.warn(
      "No data mapping found:",
      state.board,
      state.className
    );

    return;

  }


  const subjectData =
    classData[state.subject];

  if (!subjectData) {

    console.warn(
      "No subject mapping found:",
      state.subject
    );

    return;

  }


  const filePath =
    subjectData[state.book];

  if (!filePath) {

    console.warn(
      "No book mapping found:",
      state.book
    );

    return;

  }


  try {

    loadedData =
      await loadScript(filePath);

    console.log(
      "Study data loaded successfully:",
      filePath
    );

  }

  catch (error) {

    console.error(
      "StudyCore data loading error:",
      error
    );

    loadedData = null;

  }

}


/* =========================================================
   DATA ACCESS
   ========================================================= */

function getBooks() {

  if (!loadedData?.books) {
    return [];
  }

  return Object.keys(loadedData.books);

}


function getChapters() {

  if (!loadedData?.books?.[state.book]?.chapters) {
    return [];
  }

  return Object.keys(
    loadedData.books[state.book].chapters
  );

}


function getTopics() {

  const chapter =
    loadedData
      ?.books
      ?.[state.book]
      ?.chapters
      ?.[state.chapter];

  if (!chapter?.topics) {
    return [];
  }

  return Object.keys(chapter.topics);

}


function getCurrentTopic() {

  return loadedData
    ?.books
    ?.[state.book]
    ?.chapters
    ?.[state.chapter]
    ?.topics
    ?.[state.topic];

}


/* =========================================================
   GENERIC CARD
   ========================================================= */

function choiceCard(
  title,
  subtitle,
  onclick
) {

  return `
    <button
      class="choice-card"
      onclick="${onclick}"
    >

      <strong>
        ${escapeHTML(title)}
      </strong>

      ${
        subtitle
          ? `<span>${escapeHTML(subtitle)}</span>`
          : ""
      }

    </button>
  `;

}


/* =========================================================
   BREADCRUMBS
   ========================================================= */

function breadcrumbs() {

  const items = ["Home"];

  if (state.className) {
    items.push(`Class ${state.className}`);
  }

  if (state.board) {
    items.push(state.board);
  }

  if (state.stream) {
    items.push(state.stream);
  }

  if (state.subject) {
    items.push(state.subject);
  }

  if (state.book) {
    items.push(state.book);
  }

  if (state.chapter) {
    items.push(state.chapter);
  }

  if (state.topic) {
    items.push(state.topic);
  }

  return `
    <div class="breadcrumbs">

      ${items
        .map((item, index) => {

          return `
            <span>
              ${escapeHTML(item)}
            </span>

            ${
              index < items.length - 1
                ? `<b>›</b>`
                : ""
            }
          `;

        })
        .join("")}

    </div>
  `;

}


/* =========================================================
   PAGE HEADER
   ========================================================= */

function pageHeader(
  eyebrow,
  title,
  description = ""
) {

  return `

    ${breadcrumbs()}

    <div class="page-heading">

      <div class="eyebrow">
        ${escapeHTML(eyebrow)}
      </div>

      <h1>
        ${escapeHTML(title)}
      </h1>

      ${
        description
          ? `<p>${escapeHTML(description)}</p>`
          : ""
      }

    </div>

  `;

}


/* =========================================================
   CLASS PAGE
   ========================================================= */

function renderClassPage() {

  app.innerHTML = `

    <section class="hero">

      <div class="eyebrow">
        STUDYCORE
      </div>

      <h1>
        WHAT ARE YOU STUDYING?
      </h1>

      <p>
        Choose your class to enter your learning space.
      </p>

    </section>

    <section class="selection-section">

      <div class="section-label">
        SELECT CLASS
      </div>

      <div class="choice-grid">

        ${choiceCard(
          "Class 10",
          "Secondary level",
          "chooseClass('10')"
        )}

        ${choiceCard(
          "Class 11",
          "Higher secondary — first year",
          "chooseClass('11')"
        )}

        ${choiceCard(
          "Class 12",
          "Higher secondary — final year",
          "chooseClass('12')"
        )}

      </div>

    </section>

  `;

}


/* =========================================================
   BOARD PAGE
   ========================================================= */

function renderBoardPage() {

  app.innerHTML = `

    ${pageHeader(
      "STEP 02",
      "CHOOSE YOUR CURRICULUM",
      `You're studying Class ${state.className}.`
    )}

    <button
      class="back-button"
      onclick="goBack()"
    >
      ← BACK
    </button>

    <section class="choice-grid">

      ${choiceCard(
        "NCERT",
        "National curriculum",
        "chooseBoard('NCERT')"
      )}

      ${choiceCard(
        "WBBSE",
        "West Bengal Board of Secondary Education",
        "chooseBoard('WBBSE')"
      )}

      ${choiceCard(
        "WBCHSE",
        "West Bengal Council of Higher Secondary Education",
        "chooseBoard('WBCHSE')"
      )}

    </section>

  `;

}


/* =========================================================
   STREAM PAGE
   ========================================================= */

function renderStreamPage() {

  app.innerHTML = `

    ${pageHeader(
      "STEP 03",
      "CHOOSE YOUR STREAM",
      "Select the stream you are studying."
    )}

    <button
      class="back-button"
      onclick="goBack()"
    >
      ← BACK
    </button>

    <section class="choice-grid">

      ${choiceCard(
        "Science",
        "Physics, Chemistry, Mathematics and more",
        "chooseStream('Science')"
      )}

      ${choiceCard(
        "Commerce",
        "Accounts, Economics, Business and more",
        "chooseStream('Commerce')"
      )}

      ${choiceCard(
        "Arts",
        "Humanities and social sciences",
        "chooseStream('Arts')"
      )}

    </section>

  `;

}


/* =========================================================
   SUBJECT PAGE
   ========================================================= */

function renderSubjectPage() {

  const subjects =
    DATA_FILES[state.board]?.[state.className]
      ? Object.keys(
          DATA_FILES[state.board][state.className]
        )
      : [];

  app.innerHTML = `

    ${pageHeader(
      "STEP 04",
      "CHOOSE A SUBJECT",
      `${state.board} · Class ${state.className}`
    )}

    <button
      class="back-button"
      onclick="goBack()"
    >
      ← BACK
    </button>

    ${
      subjects.length
        ? `
          <section class="choice-grid">

            ${subjects
              .map(subject =>
                choiceCard(
                  subject,
                  "Open subject",
                  `chooseSubject('${escapeJS(subject)}')`
                )
              )
              .join("")}

          </section>
        `
        : `
          <div class="empty-state">

            <h3>
              Content is being prepared.
            </h3>

            <p>
              This curriculum will be added to StudyCore.
            </p>

          </div>
        `
    }

  `;

}


/* =========================================================
   BOOK PAGE
   ========================================================= */

function renderBookPage() {

  const books = getBooks();

  app.innerHTML = `

    ${pageHeader(
      "STEP 05",
      state.subject,
      "Choose the book or learning resource."
    )}

    <button
      class="back-button"
      onclick="goBack()"
    >
      ← BACK
    </button>

    ${
      books.length
        ? `
          <section class="choice-grid">

            ${books
              .map(book =>
                choiceCard(
                  book,
                  "Open book",
                  `chooseBook('${escapeJS(book)}')`
                )
              )
              .join("")}

          </section>
        `
        : `
          <div class="empty-state">

            <h3>
              Book data is not available yet.
            </h3>

            <p>
              More StudyCore content will be added here.
            </p>

          </div>
        `
    }

  `;

}


/* =========================================================
   CHAPTER PAGE
   ========================================================= */

function renderChapterPage() {

  const chapters = getChapters();

  app.innerHTML = `

    ${pageHeader(
      "CHAPTERS",
      state.book,
      "Choose a chapter to start studying."
    )}

    <button
      class="back-button"
      onclick="goBack()"
    >
      ← BACK
    </button>

    ${
      chapters.length
        ? `
          <section class="choice-grid">

            ${chapters
              .map((chapter, index) => {

                return choiceCard(
                  `${index + 1}. ${chapter}`,
                  "Open chapter",
                  `chooseChapter('${escapeJS(chapter)}')`
                );

              })
              .join("")}

          </section>
        `
        : `
          <div class="empty-state">

            <h3>
              Chapter data is not available yet.
            </h3>

            <p>
              Check that the selected data file contains chapter information.
            </p>

          </div>
        `
    }

  `;

}


/* =========================================================
   TOPIC PAGE
   ========================================================= */

function renderTopicPage() {

  const topics = getTopics();

  if (!state.topic) {

    if (!topics.length) {

      app.innerHTML = `

        ${pageHeader(
          "TOPIC",
          state.chapter || "Topic",
          "Topic data is not available yet."
        )}

        <button
          class="back-button"
          onclick="goBack()"
        >
          ← BACK
        </button>

        <div class="empty-state">

          <h3>
            Topic data is not available yet.
          </h3>

          <p>
            This chapter does not contain any topics.
          </p>

        </div>

      `;

      return;

    }


    state.topic = topics[0];

  }


  const topic =
    getCurrentTopic();


  if (!topic) {

    app.innerHTML = `

      ${pageHeader(
        "TOPIC",
        state.topic || "Topic",
        "We couldn't find this topic in the loaded data."
      )}

      <button
        class="back-button"
        onclick="goBack()"
      >
        ← BACK
      </button>

      <div class="empty-state">

        <h3>
          Topic data is not available yet.
        </h3>

      </div>

    `;

    return;

  }


  renderTopicContent(topic);

}


/* =========================================================
   TOPIC CONTENT
   ========================================================= */

function renderTopicContent(topic) {

  const topics =
    getTopics();


  app.innerHTML = `

    ${pageHeader(
      "TOPIC",
      state.topic,
      topic.subtitle || ""
    )}

    <button
      class="back-button"
      onclick="goBack()"
    >
      ← BACK
    </button>


    ${
      topics.length > 1
        ? `
          <div class="topic-selector">

            ${topics
              .map(item => `

                <button
                  class="${
                    item === state.topic
                      ? "active"
                      : ""
                  }"
                  onclick="chooseTopic('${escapeJS(item)}')"
                >
                  ${escapeHTML(item)}
                </button>

              `)
              .join("")}

          </div>
        `
        : ""
    }


    <div class="topic-tabs">

      ${tabButton(
        "learn",
        "LEARN"
      )}

      ${tabButton(
        "practice",
        "PRACTICE"
      )}

      ${tabButton(
        "quiz",
        "QUIZ"
      )}

      ${tabButton(
        "keypoints",
        "KEY POINTS"
      )}

      ${tabButton(
        "ai",
        "ASK AI"
      )}

    </div>


    <section class="topic-content">

      ${renderActiveTab(topic)}

    </section>

  `;

}


/* =========================================================
   TAB BUTTON
   ========================================================= */

function tabButton(
  id,
  label
) {

  return `

    <button
      class="${
        state.tab === id
          ? "active"
          : ""
      }"
      onclick="setTab('${id}')"
    >
      ${label}
    </button>

  `;

}


function setTab(tab) {

  state.tab = tab;

  render();

}


/* =========================================================
   ACTIVE TAB
   ========================================================= */

function renderActiveTab(topic) {

  if (state.tab === "learn") {

    return renderLearn(topic);

  }

  if (state.tab === "practice") {

    return renderPractice(topic);

  }

  if (state.tab === "quiz") {

    return renderQuiz(topic);

  }

  if (state.tab === "keypoints") {

    return renderKeyPoints(topic);

  }

  if (state.tab === "ai") {

    return renderAI();

  }

  return "";

}


/* =========================================================
   LEARN
   ========================================================= */

function renderLearn(topic) {

  return `

    <article class="content-card">

      <div class="content-label">
        INTRODUCTION
      </div>

      <h2>
        Understand the chapter
      </h2>

      <p>
        ${escapeHTML(topic.introduction || "")}
      </p>

    </article>


    ${
      topic.summary
        ? `
          <article class="content-card">

            <div class="content-label">
              SUMMARY
            </div>

            <h2>
              What happens?
            </h2>

            <p>
              ${escapeHTML(topic.summary)}
            </p>

          </article>
        `
        : ""
    }


    ${
      topic.storyUnderstanding?.length
        ? `

          <article class="content-card">

            <div class="content-label">
              UNDERSTAND DEEPLY
            </div>

            <h2>
              Important ideas
            </h2>

            <div class="info-list">

              ${topic.storyUnderstanding
                .map(item => `

                  <div class="info-item">

                    <h3>
                      ${escapeHTML(item.heading)}
                    </h3>

                    <p>
                      ${escapeHTML(item.text)}
                    </p>

                  </div>

                `)
                .join("")}

            </div>

          </article>

        `
        : ""
    }


    ${
      topic.characters?.length
        ? `

          <article class="content-card">

            <div class="content-label">
              CHARACTERS
            </div>

            <div class="info-list">

              ${topic.characters
                .map(character => `

                  <div class="info-item">

                    <h3>
                      ${escapeHTML(character.name)}
                    </h3>

                    <p>
                      ${escapeHTML(character.description)}
                    </p>

                  </div>

                `)
                .join("")}

            </div>

          </article>

        `
        : ""
    }


    ${
      topic.themes?.length
        ? `

          <article class="content-card">

            <div class="content-label">
              THEMES
            </div>

            <ul class="clean-list">

              ${topic.themes
                .map(theme => `
                  <li>
                    ${escapeHTML(theme)}
                  </li>
                `)
                .join("")}

            </ul>

          </article>

        `
        : ""
    }


    ${
      topic.vocabulary?.length
        ? `

          <article class="content-card">

            <div class="content-label">
              VOCABULARY
            </div>

            <div class="vocabulary-grid">

              ${topic.vocabulary
                .map(item => `

                  <div class="vocabulary-item">

                    <strong>
                      ${escapeHTML(item.word)}
                    </strong>

                    <span>
                      ${escapeHTML(item.meaning)}
                    </span>

                  </div>

                `)
                .join("")}

            </div>

          </article>

        `
        : ""
    }

  `;

}


/* =========================================================
   PRACTICE
   ========================================================= */

function renderPractice(topic) {

  if (!topic.practice?.length) {

    return `

      <div class="empty-state">

        <h3>
          Practice is coming soon.
        </h3>

        <p>
          Practice questions will appear here.
        </p>

      </div>

    `;

  }


  return `

    <div class="practice-list">

      ${topic.practice
        .map((item, index) => `

          <article class="question-card">

            <div class="question-number">
              QUESTION ${index + 1}
            </div>

            <h3>
              ${escapeHTML(item.question)}
            </h3>

            <details>

              <summary>
                SHOW ANSWER
              </summary>

              <p>
                ${escapeHTML(item.answer)}
              </p>

            </details>

          </article>

        `)
        .join("")}

    </div>

  `;

}


/* =========================================================
   QUIZ
   ========================================================= */

function renderQuiz(topic) {

  if (!topic.quiz?.length) {

    return `

      <div class="empty-state">

        <h3>
          Quiz is coming soon.
        </h3>

      </div>

    `;

  }


  return `

    <div class="quiz-list">

      ${topic.quiz
        .map((item, index) => `

          <article class="quiz-card">

            <div class="question-number">
              QUESTION ${index + 1}
            </div>

            <h3>
              ${escapeHTML(item.question)}
            </h3>

            <div class="quiz-options">

              ${item.options
                .map(option => `

                  <button
                    onclick="checkQuizAnswer(
                      this,
                      '${escapeJS(option)}',
                      '${escapeJS(item.answer)}'
                    )"
                  >
                    ${escapeHTML(option)}
                  </button>

                `)
                .join("")}

            </div>

            <div class="quiz-result"></div>

          </article>

        `)
        .join("")}

    </div>

  `;

}


function checkQuizAnswer(
  button,
  selected,
  correct
) {

  const card =
    button.closest(".quiz-card");

  if (!card) return;

  const result =
    card.querySelector(".quiz-result");

  const buttons =
    card.querySelectorAll(
      ".quiz-options button"
    );


  buttons.forEach(item => {

    item.disabled = true;

  });


  if (selected === correct) {

    button.classList.add("correct");

    result.textContent =
      "✓ Correct";

    result.classList.add("correct");

  } else {

    button.classList.add("wrong");

    result.textContent =
      "✕ Not quite. Try reviewing the chapter.";

    result.classList.add("wrong");

  }

}


/* =========================================================
   KEY POINTS
   ========================================================= */

function renderKeyPoints(topic) {

  const points =
    topic.keyPoints || [];

  const examPoints =
    topic.examPoints || [];


  return `

    ${
      points.length
        ? `

          <article class="content-card">

            <div class="content-label">
              REMEMBER
            </div>

            <h2>
              Key points
            </h2>

            <ol class="clean-list numbered">

              ${points
                .map(point => `
                  <li>
                    ${escapeHTML(point)}
                  </li>
                `)
                .join("")}

            </ol>

          </article>

        `
        : ""
    }


    ${
      examPoints.length
        ? `

          <article class="content-card">

            <div class="content-label">
              EXAM FOCUS
            </div>

            <h2>
              What to prepare
            </h2>

            <ul class="clean-list">

              ${examPoints
                .map(point => `
                  <li>
                    ${escapeHTML(point)}
                  </li>
                `)
                .join("")}

            </ul>

          </article>

        `
        : ""
    }

  `;

}


/* =========================================================
   AI
   ========================================================= */

function renderAI() {

  return `

    <article class="ai-box">

      <div class="content-label">
        STUDYCORE AI
      </div>

      <h2>
        ASK AI
      </h2>

      <p>
        Ask questions about this topic and get a
        step-by-step explanation.
      </p>

      <div class="ai-limit">

        <strong>
          3
        </strong>

        <span>
          questions available today
        </span>

      </div>

      <button
        class="primary-button"
        onclick="showToast('AI Tutor will be connected next.')"
      >
        ASK A QUESTION
      </button>

      <p class="small-note">
        AI Tutor requires an account.
      </p>

    </article>

  `;

}


/* =========================================================
   ESCAPE JAVASCRIPT STRINGS
   ========================================================= */

function escapeJS(value) {

  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");

}


/* =========================================================
   MAIN RENDER
   ========================================================= */

function render() {

  try {

    if (state.step === "class") {

      renderClassPage();

    }

    else if (state.step === "board") {

      renderBoardPage();

    }

    else if (state.step === "stream") {

      renderStreamPage();

    }

    else if (state.step === "subject") {

      renderSubjectPage();

    }

    else if (state.step === "book") {

      renderBookPage();

    }

    else if (state.step === "chapter") {

      renderChapterPage();

    }

    else if (state.step === "topic") {

      renderTopicPage();

    }

  }

  catch (error) {

    console.error(
      "StudyCore rendering error:",
      error
    );

    app.innerHTML = `

      <div class="error-state">

        <h2>
          Something went wrong.
        </h2>

        <p>
          Please refresh the page and try again.
        </p>

        <button
          class="primary-button"
          onclick="goHome()"
        >
          RETURN HOME
        </button>

      </div>

    `;

  }

}


/* =========================================================
   START
   ========================================================= */

render();
