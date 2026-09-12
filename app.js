/* =========================================================
   STUDYCORE
   Main Application
   ========================================================= */

const app = document.getElementById("app");


/* =========================================================
   APPLICATION STATE
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

  tab: "learn",

  quizScore: 0,

  loadedData: null
};


/* =========================================================
   DATA FILE MAP
   =========================================================

   We will add more files here later.

   The important part:
   StudyCore does NOT need one giant content.js anymore.

   Each subject/book can have its own file.
*/

const DATA_FILES = {

  NCERT: {

    "10": {

      English: "data/ncert/class10/english/footprints.js"

    }

  },

  WBBSE: {

    "10": {

    }

  },

  WBCHSE: {

    "11": {

    },

    "12": {

    }

  }

};


/* =========================================================
   ESCAPE HTML
   ========================================================= */

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


/* =========================================================
   TOAST
   ========================================================= */

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

  state.quizScore = 0;

  state.loadedData = null;

  render();
}


/* =========================================================
   ACCOUNT
   ========================================================= */

function showAccount() {

  showToast("Account system is coming next.");

}


/* =========================================================
   BACK
   ========================================================= */

function goBack() {

  if (state.step === "topic") {

    state.step = "chapter";
    state.topic = null;
    state.tab = "learn";

  }

  else if (state.step === "chapter") {

    state.step = "book";
    state.chapter = null;

  }

  else if (state.step === "book") {

    state.step = "subject";
    state.book = null;

  }

  else if (state.step === "subject") {

    state.step = "stream";
    state.subject = null;
    state.loadedData = null;

  }

  else if (state.step === "stream") {

    state.step = "board";
    state.stream = null;

  }

  else if (state.step === "board") {

    state.step = "class";
    state.board = null;

  }

  render();
}


/* =========================================================
   SELECT LEVEL
   ========================================================= */

function selectLevel(type, value) {

  if (type === "class") {

    state.className = value;
    state.step = "board";

  }

  else if (type === "board") {

    state.board = value;

    /*
      Class 10 currently doesn't need a stream selection
      for the first version.

      We will add stream handling when Commerce/Arts/Science
      datasets are connected.
    */

    if (state.className === "10") {

      state.stream = "General";
      state.step = "stream";

    } else {

      state.step = "stream";

    }

  }

  else if (type === "stream") {

    state.stream = value;
    state.step = "subject";

  }

  else if (type === "subject") {

    state.subject = value;

    loadSubjectData()
      .then(() => {

        state.step = "book";

        render();

      })
      .catch(() => {

        showToast("This subject is not available yet.");

      });

    return;

  }

  else if (type === "book") {

    state.book = value;
    state.step = "chapter";

  }

  else if (type === "chapter") {

    state.chapter = value;
    state.step = "topic";

  }

  else if (type === "topic") {

    state.topic = value;
    state.tab = "learn";

    state.quizScore = 0;

    state.step = "topic";

  }

  render();
}


/* =========================================================
   LOAD SUBJECT DATA
   ========================================================= */

function loadSubjectData() {

  return new Promise((resolve, reject) => {

    /*
      Already loaded?
    */

    if (state.loadedData) {

      resolve(state.loadedData);

      return;

    }


    const board = state.board;
    const className = state.className;
    const subject = state.subject;


    if (
      !DATA_FILES[board] ||
      !DATA_FILES[board][className] ||
      !DATA_FILES[board][className][subject]
    ) {

      reject(new Error("Data file not found"));

      return;

    }


    const file = DATA_FILES[board][className][subject];


    /*
      Remove old StudyCore data object if one exists.
    */

    window.STUDY_DATA = null;


    /*
      Create script dynamically.
    */

    const script = document.createElement("script");

    script.src = file + "?v=" + Date.now();

    script.onload = () => {

      if (!window.STUDY_DATA) {

        reject(new Error("Study data missing"));

        return;

      }

      state.loadedData = window.STUDY_DATA;

      resolve(window.STUDY_DATA);

    };


    script.onerror = () => {

      reject(new Error("Could not load " + file));

    };


    document.body.appendChild(script);

  });

}


/* =========================================================
   GET CURRENT DATA
   ========================================================= */

function getCurrentData() {

  return state.loadedData || window.STUDY_DATA || null;

}


/* =========================================================
   GET CURRENT BOOK
   ========================================================= */

function getCurrentBook() {

  const data = getCurrentData();

  if (!data || !data.books) return null;

  return data.books[state.book] || null;

}


/* =========================================================
   GET CURRENT CHAPTER
   ========================================================= */

function getCurrentChapter() {

  const book = getCurrentBook();

  if (!book || !book.chapters) return null;

  return book.chapters[state.chapter] || null;

}


/* =========================================================
   GET CURRENT TOPIC
   ========================================================= */

function getCurrentTopic() {

  const chapter = getCurrentChapter();

  if (!chapter || !chapter.topics) return null;

  return chapter.topics[state.topic] || null;

}


/* =========================================================
   RENDER
   ========================================================= */

function render() {

  if (!app) return;


  if (state.step === "class") {

    renderClass();

    return;

  }


  if (state.step === "board") {

    renderBoard();

    return;

  }


  if (state.step === "stream") {

    renderStream();

    return;

  }


  if (state.step === "subject") {

    renderSubject();

    return;

  }


  if (state.step === "book") {

    renderBook();

    return;

  }


  if (state.step === "chapter") {

    renderChapter();

    return;

  }


  if (state.step === "topic") {

    renderTopic();

    return;

  }

}


/* =========================================================
   PAGE WRAPPER
   ========================================================= */

function pageHeader(title, subtitle) {

  return `

    <section class="hero">

      <p class="eyebrow">STUDYCORE</p>

      <h1>${escapeHTML(title)}</h1>

      <p>${escapeHTML(subtitle)}</p>

    </section>

  `;

}


/* =========================================================
   BACK BUTTON
   ========================================================= */

function backButton() {

  return `

    <button class="back-button" onclick="goBack()">

      ← Back

    </button>

  `;

}


/* =========================================================
   CARD GRID
   ========================================================= */

function cards(items, type) {

  return `

    <div class="card-grid">

      ${items.map(item => `

        <button
          class="choice-card"
          onclick="selectLevel('${type}', '${String(item).replace(/'/g, "\\'")}')"
        >

          <span class="choice-title">
            ${escapeHTML(item)}
          </span>

          <span class="choice-arrow">
            →
          </span>

        </button>

      `).join("")}

    </div>

  `;

}


/* =========================================================
   CLASS
   ========================================================= */

function renderClass() {

  app.innerHTML = `

    ${pageHeader(
      "WHAT ARE YOU STUDYING?",
      "Choose your class to begin."
    )}

    <section class="content-section">

      <div class="card-grid">

        <button
          class="choice-card"
          onclick="selectLevel('class','10')"
        >

          <span class="choice-title">
            Class 10
          </span>

          <span class="choice-description">
            Secondary school
          </span>

          <span class="choice-arrow">
            →
          </span>

        </button>


        <button
          class="choice-card"
          onclick="selectLevel('class','11')"
        >

          <span class="choice-title">
            Class 11
          </span>

          <span class="choice-description">
            Higher secondary
          </span>

          <span class="choice-arrow">
            →
          </span>

        </button>


        <button
          class="choice-card"
          onclick="selectLevel('class','12')"
        >

          <span class="choice-title">
            Class 12
          </span>

          <span class="choice-description">
            Higher secondary
          </span>

          <span class="choice-arrow">
            →
          </span>

        </button>

      </div>

    </section>

  `;

}


/* =========================================================
   BOARD
   ========================================================= */

function renderBoard() {

  app.innerHTML = `

    ${backButton()}

    ${pageHeader(
      "CHOOSE YOUR CURRICULUM",
      "Select the curriculum you are studying."
    )}

    <section class="content-section">

      <div class="card-grid">

        <button
          class="choice-card"
          onclick="selectLevel('board','NCERT')"
        >

          <span class="choice-title">
            NCERT
          </span>

          <span class="choice-description">
            National curriculum resources
          </span>

          <span class="choice-arrow">
            →
          </span>

        </button>


        <button
          class="choice-card"
          onclick="selectLevel('board','WBBSE')"
        >

          <span class="choice-title">
            WBBSE
          </span>

          <span class="choice-description">
            West Bengal Board
          </span>

          <span class="choice-arrow">
            →
          </span>

        </button>


        <button
          class="choice-card"
          onclick="selectLevel('board','WBCHSE')"
        >

          <span class="choice-title">
            WBCHSE
          </span>

          <span class="choice-description">
            West Bengal Higher Secondary
          </span>

          <span class="choice-arrow">
            →
          </span>

        </button>

      </div>

    </section>

  `;

}


/* =========================================================
   STREAM
   ========================================================= */

function renderStream() {

  /*
    Class 10 currently uses General.

    Later we can make this depend on the curriculum.
  */

  if (state.className === "10") {

    selectLevel("stream", "General");

    return;

  }


  app.innerHTML = `

    ${backButton()}

    ${pageHeader(
      "CHOOSE YOUR STREAM",
      "Select the stream you are studying."
    )}

    <section class="content-section">

      <div class="card-grid">

        <button
          class="choice-card"
          onclick="selectLevel('stream','Science')"
        >

          <span class="choice-title">
            Science
          </span>

          <span class="choice-arrow">
            →
          </span>

        </button>


        <button
          class="choice-card"
          onclick="selectLevel('stream','Commerce')"
        >

          <span class="choice-title">
            Commerce
          </span>

          <span class="choice-arrow">
            →
          </span>

        </button>


        <button
          class="choice-card"
          onclick="selectLevel('stream','Arts')"
        >

          <span class="choice-title">
            Arts
          </span>

          <span class="choice-arrow">
            →
          </span>

        </button>

      </div>

    </section>

  `;

}


/* =========================================================
   SUBJECT
   ========================================================= */

function renderSubject() {

  const availableSubjects = [];

  const board = state.board;
  const className = state.className;


  if (
    DATA_FILES[board] &&
    DATA_FILES[board][className]
  ) {

    Object.keys(DATA_FILES[board][className])
      .forEach(subject => {

        availableSubjects.push(subject);

      });

  }


  if (availableSubjects.length === 0) {

    app.innerHTML = `

      ${backButton()}

      ${pageHeader(
        "SUBJECTS",
        "More subjects are being prepared."
      )}

      <section class="content-section">

        <div class="empty-state">

          <h2>Coming soon</h2>

          <p>
            This curriculum and class will be added soon.
          </p>

        </div>

      </section>

    `;

    return;

  }


  app.innerHTML = `

    ${backButton()}

    ${pageHeader(
      "CHOOSE A SUBJECT",
      `${state.board} • Class ${state.className}`
    )}

    <section class="content-section">

      ${cards(availableSubjects, "subject")}

    </section>

  `;

}


/* =========================================================
   BOOK
   ========================================================= */

function renderBook() {

  const data = getCurrentData();

  if (!data || !data.books) {

    app.innerHTML = `

      ${backButton()}

      ${pageHeader(
        "BOOKS",
        "No book data available."
      )}

    `;

    return;

  }


  const books = Object.keys(data.books);


  app.innerHTML = `

    ${backButton()}

    ${pageHeader(
      data.title || state.subject,
      "Choose your book."
    )}

    <section class="content-section">

      ${cards(books, "book")}

    </section>

  `;

}


/* =========================================================
   CHAPTER
   ========================================================= */

function renderChapter() {

  const book = getCurrentBook();

  if (!book) {

    app.innerHTML = `

      ${backButton()}

      ${pageHeader(
        "CHAPTERS",
        "No chapter data available."
      )}

    `;

    return;

  }


  const chapters = Object.keys(book.chapters || {});


  app.innerHTML = `

    ${backButton()}

    ${pageHeader(
      state.book,
      "Choose a chapter."
    )}

    <section class="content-section">

      ${cards(chapters, "chapter")}

    </section>

  `;

}


/* =========================================================
   TOPIC
   ========================================================= */

function renderTopic() {

  const topic = getCurrentTopic();


  if (!topic) {

    app.innerHTML = `

      ${backButton()}

      ${pageHeader(
        "TOPIC",
        "Topic data is not available yet."
      )}

    `;

    return;

  }


  const tab = state.tab || "learn";


  app.innerHTML = `

    ${backButton()}


    <section class="topic-header">

      <p class="eyebrow">

        ${escapeHTML(state.book)}

      </p>

      <h1>
        ${escapeHTML(state.topic)}
      </h1>

      <p>
        ${escapeHTML(topic.subtitle || "")}
      </p>

    </section>


    <nav class="topic-tabs">

      <button
        class="${tab === "learn" ? "active" : ""}"
        onclick="changeTab('learn')"
      >
        LEARN
      </button>

      <button
        class="${tab === "practice" ? "active" : ""}"
        onclick="changeTab('practice')"
      >
        PRACTICE
      </button>

      <button
        class="${tab === "quiz" ? "active" : ""}"
        onclick="changeTab('quiz')"
      >
        QUIZ
      </button>

      <button
        class="${tab === "keypoints" ? "active" : ""}"
        onclick="changeTab('keypoints')"
      >
        KEY POINTS
      </button>

      <button
        class="${tab === "ai" ? "active" : ""}"
        onclick="changeTab('ai')"
      >
        ASK AI
      </button>

    </nav>


    <section class="topic-content">

      ${renderTopicTab(topic, tab)}

    </section>

  `;

}


/* =========================================================
   CHANGE TAB
   ========================================================= */

function changeTab(tab) {

  state.tab = tab;

  render();

}


/* =========================================================
   TOPIC TAB CONTENT
   ========================================================= */

function renderTopicTab(topic, tab) {


  /* ---------------- LEARN ---------------- */

  if (tab === "learn") {

    return `

      <article class="lesson">

        <h2>
          Introduction
        </h2>

        <p>
          ${escapeHTML(topic.introduction || "Content coming soon.")}
        </p>


        ${
          topic.summary
          ? `

            <h2>
              Summary
            </h2>

            <p>
              ${escapeHTML(topic.summary)}
            </p>

          `
          : ""
        }


        ${
          topic.characters
          ? `

            <h2>
              Characters
            </h2>

            <div class="info-list">

              ${topic.characters.map(character => `

                <div class="info-item">

                  <strong>
                    ${escapeHTML(character.name)}
                  </strong>

                  <p>
                    ${escapeHTML(character.description)}
                  </p>

                </div>

              `).join("")}

            </div>

          `
          : ""
        }


        ${
          topic.themes
          ? `

            <h2>
              Major Themes
            </h2>

            <ul>

              ${topic.themes.map(theme => `

                <li>
                  ${escapeHTML(theme)}
                </li>

              `).join("")}

            </ul>

          `
          : ""
        }


        ${
          topic.vocabulary
          ? `

            <h2>
              Vocabulary
            </h2>

            <div class="vocabulary-grid">

              ${topic.vocabulary.map(word => `

                <div class="formula-card">

                  <strong>
                    ${escapeHTML(word.word)}
                  </strong>

                  <span>
                    ${escapeHTML(word.meaning)}
                  </span>

                </div>

              `).join("")}

            </div>

          `
          : ""
        }

      </article>

    `;

  }


  /* ---------------- PRACTICE ---------------- */

  if (tab === "practice") {

    const questions = topic.practice || [];


    if (questions.length === 0) {

      return `

        <div class="empty-state">

          <h2>
            Practice coming soon
          </h2>

          <p>
            Original practice questions will appear here.
          </p>

        </div>

      `;

    }


    return `

      <div class="question-list">

        ${questions.map((question, index) => `

          <article class="question-card">

            <span class="question-number">
              Question ${index + 1}
            </span>

            <h3>
              ${escapeHTML(question.question)}
            </h3>

            ${
              question.answer
              ? `

                <details>

                  <summary>
                    Show answer
                  </summary>

                  <p>
                    ${escapeHTML(question.answer)}
                  </p>

                </details>

              `
              : ""
            }

          </article>

        `).join("")}

      </div>

    `;

  }


  /* ---------------- QUIZ ---------------- */

  if (tab === "quiz") {

    const quiz = topic.quiz || [];


    if (quiz.length === 0) {

      return `

        <div class="empty-state">

          <h2>
            Quiz coming soon
          </h2>

          <p>
            Interactive quizzes will appear here.
          </p>

        </div>

      `;

    }


    return `

      <div class="quiz-box">

        <h2>
          Quick Quiz
        </h2>

        ${quiz.map((question, index) => `

          <div class="quiz-question">

            <h3>
              ${index + 1}. ${escapeHTML(question.question)}
            </h3>

            <div class="quiz-options">

              ${question.options.map(option => `

                <button
                  onclick="answerQuiz(
                    ${index},
                    '${String(option).replace(/'/g, "\\'")}',
                    '${String(question.answer).replace(/'/g, "\\'")}'
                  )"
                >

                  ${escapeHTML(option)}

                </button>

              `).join("")}

            </div>

          </div>

        `).join("")}


        <div class="quiz-score">

          Score:
          <strong>${state.quizScore}</strong>

        </div>

      </div>

    `;

  }


  /* ---------------- KEY POINTS ---------------- */

  if (tab === "keypoints") {

    const points = topic.keyPoints || [];


    return `

      <article class="lesson">

        <h2>
          Key Points
        </h2>

        ${
          points.length
          ? `

            <ul>

              ${points.map(point => `

                <li>
                  ${escapeHTML(point)}
                </li>

              `).join("")}

            </ul>

          `
          : `

            <p>
              Key points are being prepared.
            </p>

          `
        }

      </article>

    `;

  }


  /* ---------------- AI ---------------- */

  if (tab === "ai") {

    return `

      <div class="ai-box">

        <div class="ai-icon">
          AI
        </div>

        <h2>
          StudyCore AI Tutor
        </h2>

        <p>
          Ask a question about this topic and get a
          step-by-step explanation.
        </p>

        <div class="ai-limit">

          <strong>
            3
          </strong>

          AI questions available today

        </div>


        <button
          class="primary-button"
          onclick="showToast('AI Tutor connection is coming next.')"
        >

          ASK A QUESTION

        </button>

      </div>

    `;

  }


  return "";

}


/* =========================================================
   QUIZ ANSWER
   ========================================================= */

function answerQuiz(index, selected, correct) {

  if (selected === correct) {

    state.quizScore++;

    showToast("Correct!");

  } else {

    showToast("Not quite. Try the next one.");

  }

}


/* =========================================================
   START APPLICATION
   ========================================================= */

render();
