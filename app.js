/* =========================================================
   STUDYCORE — MAIN APP
   ========================================================= */

const DATA_FILES = {
  NCERT: {
    "10": {
      English: {
        "Footprints Without Feet": "data/ncert/class10/english/footprints.js",
        "First Flight": "data/ncert/class10/english/first-flight.js",
        "Grammar": "data/ncert/class10/english/grammar.js"
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

  className: "",
  board: "",
  stream: "",
  subject: "",
  book: "",
  chapter: "",
  topic: "",

  tab: "learn"
};


/* Currently loaded data file */
let loadedData = null;


/* =========================================================
   BASIC HELPERS
   ========================================================= */

const app = document.getElementById("app");


function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


function goHome() {
  state.step = "class";

  state.className = "";
  state.board = "";
  state.stream = "";
  state.subject = "";
  state.book = "";
  state.chapter = "";
  state.topic = "";
  state.tab = "learn";

  loadedData = null;

  render();
}


function showAccount() {
  showToast("Account system will be added soon.");
}


/* =========================================================
   ASSET URL
   Makes GitHub Pages paths reliable
   ========================================================= */

function getAssetURL(path) {

  const appScript = Array.from(document.scripts).find(
    script => script.src.includes("/app.js")
  );

  if (appScript) {

    const appFolder = new URL("./", appScript.src);

    return new URL(path, appFolder).href;
  }

  return new URL(path, document.baseURI).href;
}


/* =========================================================
   LOAD DATA FILE
   ========================================================= */

function loadDataFile(path) {

  return new Promise((resolve, reject) => {

    /* Remove previous StudyCore data script */
    const oldScript =
      document.querySelector('script[data-study-data="true"]');

    if (oldScript) {
      oldScript.remove();
    }

    /* Clear old data */
    window.STUDY_DATA = null;
    loadedData = null;

    const script = document.createElement("script");

    script.src = getAssetURL(path);

    script.dataset.studyData = "true";

    script.onload = () => {

      if (window.STUDY_DATA) {

        loadedData = window.STUDY_DATA;

        resolve(window.STUDY_DATA);

      } else {

        reject(
          new Error(
            "The file loaded, but STUDY_DATA was not created."
          )
        );

      }
    };


    script.onerror = () => {

      reject(
        new Error(
          "Could not load data file: " + getAssetURL(path)
        )
      );

    };


    document.body.appendChild(script);

  });
}


/* =========================================================
   GET AVAILABLE BOOKS
   IMPORTANT:
   Books come from DATA_FILES, NOT loadedData.
   ========================================================= */

function getAvailableBooks() {

  const subjectData =
    DATA_FILES?.[state.board]?.[state.className]?.[state.subject];

  if (!subjectData) {
    return [];
  }

  return Object.keys(subjectData);
}


/* =========================================================
   GET CURRENT BOOK FILE
   ========================================================= */

function getCurrentBookFile() {

  return (
    DATA_FILES?.[state.board]
      ?.[state.className]
      ?.[state.subject]
      ?.[state.book]
  );
}


/* =========================================================
   LOADING SCREEN
   ========================================================= */

function renderLoading(message = "Loading...") {

  app.innerHTML = `
    <section class="loading-screen">

      <div class="loading-logo">S</div>

      <h1>StudyCore</h1>

      <p>${message}</p>

    </section>
  `;
}


/* =========================================================
   ERROR SCREEN
   ========================================================= */

function renderError(error, filePath = "") {

  console.error("StudyCore error:", error);

  app.innerHTML = `

    <section class="hero">

      <div class="eyebrow">STUDYCORE</div>

      <h1>Something didn't load.</h1>

      <p>
        The learning data could not be loaded right now.
      </p>

      <div class="topic-content">

        <h3>Technical information</h3>

        <p>
          ${error?.message || "Unknown error"}
        </p>

        ${
          filePath
            ? `
              <p>
                <strong>File:</strong><br>
                ${filePath}
              </p>
            `
            : ""
        }

      </div>

      <button
        class="back-button"
        onclick="goHome()"
      >
        ← HOME
      </button>

    </section>
  `;
}


/* =========================================================
   RESET STATE
   ========================================================= */

function resetFrom(level) {

  if (level === "class") {

    state.board = "";
    state.stream = "";
    state.subject = "";
    state.book = "";
    state.chapter = "";
    state.topic = "";

  }

  if (level === "board") {

    state.stream = "";
    state.subject = "";
    state.book = "";
    state.chapter = "";
    state.topic = "";

  }

  if (level === "stream") {

    state.subject = "";
    state.book = "";
    state.chapter = "";
    state.topic = "";

  }

  if (level === "subject") {

    state.book = "";
    state.chapter = "";
    state.topic = "";

  }

  if (level === "book") {

    state.chapter = "";
    state.topic = "";

  }

  if (level === "chapter") {

    state.topic = "";

  }
}


/* =========================================================
   CLASS SELECTION
   ========================================================= */

function chooseClass(value) {

  resetFrom("class");

  state.className = value;

  state.step = "board";

  render();
}


/* =========================================================
   BOARD SELECTION
   ========================================================= */

function chooseBoard(value) {

  resetFrom("board");

  state.board = value;

  if (state.className === "10") {
    state.stream = "General";
    state.step = "stream";
  } else {
    state.step = "stream";
  }

  render();
}


/* =========================================================
   STREAM SELECTION
   ========================================================= */

function chooseStream(value) {

  resetFrom("stream");

  state.stream = value;

  state.step = "subject";

  render();
}


/* =========================================================
   SUBJECT SELECTION
   ========================================================= */

function chooseSubject(value) {

  resetFrom("subject");

  state.subject = value;

  state.step = "book";

  /*
    IMPORTANT:
    We DO NOT load a book file here.

    The book list is already known from DATA_FILES.
  */

  render();
}


/* =========================================================
   BOOK SELECTION
   ========================================================= */

async function chooseBook(value) {

  resetFrom("book");

  state.book = value;

  const filePath = getCurrentBookFile();

  if (!filePath) {

    renderError(
      new Error("No data file is registered for this book."),
      "No file registered"
    );

    return;
  }


  renderLoading("Loading " + value + "...");


  try {

    await loadDataFile(filePath);

    state.step = "chapter";

    render();

  } catch (error) {

    renderError(error, filePath);

  }
}


/* =========================================================
   CHAPTER SELECTION
   ========================================================= */

function chooseChapter(value) {

  resetFrom("chapter");

  state.chapter = value;

  state.step = "topic";

  render();
}


/* =========================================================
   TOPIC SELECTION
   ========================================================= */

function chooseTopic(value) {

  state.topic = value;

  state.step = "topic";

  state.tab = "learn";

  render();
}


/* =========================================================
   BACK
   ========================================================= */

function goBack() {

  if (state.step === "board") {

    state.step = "class";

  } else if (state.step === "stream") {

    state.step = "board";

  } else if (state.step === "subject") {

    state.step = "stream";

  } else if (state.step === "book") {

    state.step = "subject";

  } else if (state.step === "chapter") {

    loadedData = null;
    state.book = "";
    state.step = "book";

  } else if (state.step === "topic") {

    state.topic = "";
    state.step = "chapter";

  }

  render();
}


/* =========================================================
   BREADCRUMBS
   ========================================================= */

function breadcrumbs() {

  const items = ["Home"];

  if (state.className) {
    items.push("Class " + state.className);
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
      ${items.map((item, index) => `
        <span>${item}</span>
        ${
          index < items.length - 1
            ? `<b>›</b>`
            : ""
        }
      `).join("")}
    </div>
  `;
}


/* =========================================================
   GENERIC CHOICE CARD
   ========================================================= */

function choiceCard(title, subtitle, onclick) {

  return `

    <button
      class="choice-card"
      onclick="${onclick}"
    >

      <span class="choice-title">
        ${title}
      </span>

      ${
        subtitle
          ? `<span class="choice-subtitle">${subtitle}</span>`
          : ""
      }

      <span class="choice-arrow">→</span>

    </button>

  `;
}


/* =========================================================
   PAGE HEADER
   ========================================================= */

function pageHeader(stepNumber, title, description) {

  return `

    ${breadcrumbs()}

    <section class="hero">

      <div class="eyebrow">
        STEP ${String(stepNumber).padStart(2, "0")}
      </div>

      <h1>${title}</h1>

      <p>${description}</p>

    </section>

  `;
}


/* =========================================================
   CLASS PAGE
   ========================================================= */

function renderClassPage() {

  app.innerHTML = `

    <section class="hero hero-main">

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


    <section class="choice-grid">

      ${choiceCard(
        "Class 10",
        "Foundation & board preparation",
        "chooseClass('10')"
      )}

      ${choiceCard(
        "Class 11",
        "Build strong concepts",
        "chooseClass('11')"
      )}

      ${choiceCard(
        "Class 12",
        "Boards & higher studies",
        "chooseClass('12')"
      )}

    </section>

  `;
}


/* =========================================================
   BOARD PAGE
   ========================================================= */

function renderBoardPage() {

  app.innerHTML = `

    ${pageHeader(
      2,
      "Choose your curriculum",
      "Select the curriculum you are studying."
    )}

    <section class="choice-grid">

      ${choiceCard(
        "NCERT",
        "National curriculum",
        "chooseBoard('NCERT')"
      )}

      ${choiceCard(
        "WBBSE",
        "West Bengal Board",
        "chooseBoard('WBBSE')"
      )}

      ${choiceCard(
        "WBCHSE",
        "West Bengal Higher Secondary",
        "chooseBoard('WBCHSE')"
      )}

    </section>

  `;
}


/* =========================================================
   STREAM PAGE
   ========================================================= */

function renderStreamPage() {

  if (state.className === "10") {

    app.innerHTML = `

      ${pageHeader(
        3,
        "Choose your stream",
        "Class 10 subjects are grouped under General."
      )}

      <section class="choice-grid">

        ${choiceCard(
          "General",
          "Class 10",
          "chooseStream('General')"
        )}

      </section>

    `;

    return;
  }


  app.innerHTML = `

    ${pageHeader(
      3,
      "Choose your stream",
      "Select the stream you are studying."
    )}

    <section class="choice-grid">

      ${choiceCard(
        "Science",
        "Physics, Chemistry, Mathematics & more",
        "chooseStream('Science')"
      )}

      ${choiceCard(
        "Commerce",
        "Accounts, Economics, Business & more",
        "chooseStream('Commerce')"
      )}

      ${choiceCard(
        "Arts",
        "Humanities & social sciences",
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
    DATA_FILES?.[state.board]?.[state.className]
      ? Object.keys(
          DATA_FILES[state.board][state.className]
        )
      : [];


  if (!subjects.length) {

    app.innerHTML = `

      ${pageHeader(
        4,
        "Subjects",
        "This curriculum is being prepared."
      )}

      <div class="topic-content">

        <h3>Content coming soon</h3>

        <p>
          StudyCore does not have subject data for this
          class and curriculum yet.
        </p>

      </div>

      <button
        class="back-button"
        onclick="goBack()"
      >
        ← BACK
      </button>

    `;

    return;
  }


  app.innerHTML = `

    ${pageHeader(
      4,
      "Choose your subject",
      "Select what you want to study."
    )}

    <section class="choice-grid">

      ${subjects.map(subject =>

        choiceCard(
          subject,
          "Open subject",
          `chooseSubject(${JSON.stringify(subject)})`
        )

      ).join("")}

    </section>

  `;
}


/* =========================================================
   BOOK PAGE
   ========================================================= */

function renderBookPage() {

  /*
    THIS IS THE IMPORTANT FIX.

    Books are taken directly from DATA_FILES.

    We do NOT depend on STUDY_DATA here.
  */

  const books = getAvailableBooks();


  if (!books.length) {

    app.innerHTML = `

      ${pageHeader(
        5,
        state.subject || "Subject",
        "Choose the book or learning resource."
      )}

      <div class="topic-content">

        <h3>Book data is not available yet.</h3>

        <p>
          StudyCore is preparing learning resources
          for this subject.
        </p>

      </div>

      <button
        class="back-button"
        onclick="goBack()"
      >
        ← BACK
      </button>

    `;

    return;
  }


  app.innerHTML = `

    ${pageHeader(
      5,
      state.subject,
      "Choose the book or learning resource."
    )}

    <section class="choice-grid">

      ${books.map(book =>

        choiceCard(
          book,
          "Learning resource",
          `chooseBook(${JSON.stringify(book)})`
        )

      ).join("")}

    </section>

  `;
}


/* =========================================================
   CHAPTER PAGE
   ========================================================= */

function renderChapterPage() {

  if (!loadedData) {

    renderError(
      new Error("No book data is loaded."),
      getCurrentBookFile() || ""
    );

    return;
  }


  const book =
    loadedData.books?.[state.book];


  if (!book) {

    renderError(
      new Error(
        "The selected book exists in DATA_FILES, but its data file does not contain that book."
      ),
      getCurrentBookFile() || ""
    );

    return;
  }


  const chapters =
    book.chapters
      ? Object.keys(book.chapters)
      : [];


  if (!chapters.length) {

    app.innerHTML = `

      ${pageHeader(
        6,
        state.book,
        "Choose a chapter."
      )}

      <div class="topic-content">

        <h3>No chapters yet</h3>

        <p>
          Chapters for this resource are being prepared.
        </p>

      </div>

      <button
        class="back-button"
        onclick="goBack()"
      >
        ← BACK
      </button>

    `;

    return;
  }


  app.innerHTML = `

    ${pageHeader(
      6,
      state.book,
      "Choose a chapter."
    )}

    <section class="choice-grid">

      ${chapters.map(chapter =>

        choiceCard(
          chapter,
          "Open chapter",
          `chooseChapter(${JSON.stringify(chapter)})`
        )

      ).join("")}

    </section>

  `;
}


/* =========================================================
   TOPIC PAGE
   ========================================================= */

function renderTopicPage() {

  if (!loadedData) {

    renderError(
      new Error("No topic data is loaded."),
      getCurrentBookFile() || ""
    );

    return;
  }


  const book =
    loadedData.books?.[state.book];


  const chapter =
    book?.chapters?.[state.chapter];


  if (!chapter) {

    renderError(
      new Error(
        "Chapter data could not be found."
      ),
      getCurrentBookFile() || ""
    );

    return;
  }


  const topics =
    chapter.topics
      ? Object.keys(chapter.topics)
      : [];


  if (!state.topic && topics.length) {
    state.topic = topics[0];
  }


  const topic =
    chapter.topics?.[state.topic];


  if (!topic) {

    app.innerHTML = `

      ${breadcrumbs()}

      <div class="topic-content">

        <h2>Topic data is not available.</h2>

        <p>
          This topic is being prepared.
        </p>

      </div>

      <button
        class="back-button"
        onclick="goBack()"
      >
        ← BACK
      </button>

    `;

    return;
  }


  renderTopic(topic);
}


/* =========================================================
   TOPIC RENDERER
   ========================================================= */

function renderTopic(topic) {

  const tabs = [
    ["learn", "LEARN"],
    ["practice", "PRACTICE"],
    ["quiz", "QUIZ"],
    ["keypoints", "KEY POINTS"],
    ["ai", "ASK AI"]
  ];


  app.innerHTML = `

    ${breadcrumbs()}


    <section class="topic-header">

      <div class="eyebrow">
        TOPIC
      </div>

      <h1>${state.topic}</h1>

      ${
        topic.subtitle
          ? `<p>${topic.subtitle}</p>`
          : ""
      }

    </section>


    <div class="topic-tabs">

      ${tabs.map(([key, label]) => `

        <button
          class="${state.tab === key ? "active" : ""}"
          onclick="changeTab('${key}')"
        >
          ${label}
        </button>

      `).join("")}

    </div>


    <section class="topic-content">

      ${renderTopicTab(topic)}

    </section>


    <button
      class="back-button"
      onclick="goBack()"
    >
      ← BACK
    </button>

  `;
}


/* =========================================================
   CHANGE TOPIC TAB
   ========================================================= */

function changeTab(tab) {

  state.tab = tab;

  render();
}


/* =========================================================
   TOPIC TAB CONTENT
   ========================================================= */

function renderTopicTab(topic) {

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


  return renderLearn(topic);
}


/* =========================================================
   LEARN
   ========================================================= */

function renderLearn(topic) {

  return `

    ${
      topic.introduction
        ? `
          <section>
            <h2>Introduction</h2>
            <p>${topic.introduction}</p>
          </section>
        `
        : ""
    }


    ${
      topic.summary
        ? `
          <section>
            <h2>Summary</h2>
            <p>${topic.summary}</p>
          </section>
        `
        : ""
    }


    ${
      topic.storyUnderstanding
        ? `
          <section>
            <h2>Understanding the topic</h2>
            <p>${topic.storyUnderstanding}</p>
          </section>
        `
        : ""
    }


    ${
      topic.characters?.length
        ? `
          <section>

            <h2>Characters</h2>

            <ul>

              ${topic.characters.map(item =>

                `<li>${item}</li>`

              ).join("")}

            </ul>

          </section>
        `
        : ""
    }


    ${
      topic.themes?.length
        ? `
          <section>

            <h2>Important themes</h2>

            <ul>

              ${topic.themes.map(item =>

                `<li>${item}</li>`

              ).join("")}

            </ul>

          </section>
        `
        : ""
    }


    ${
      topic.vocabulary?.length
        ? `
          <section>

            <h2>Vocabulary</h2>

            <ul>

              ${topic.vocabulary.map(item =>

                `<li>${item}</li>`

              ).join("")}

            </ul>

          </section>
        `
        : ""
    }

  `;
}


/* =========================================================
   PRACTICE
   ========================================================= */

function renderPractice(topic) {

  const questions = topic.practice || [];


  if (!questions.length) {

    return `
      <h2>Practice</h2>
      <p>Practice questions are being prepared.</p>
    `;
  }


  return `

    <h2>Practice</h2>

    ${questions.map((question, index) => `

      <article class="question-card">

        <span class="question-number">
          QUESTION ${index + 1}
        </span>

        <p>${question.question || question}</p>

        ${
          question.answer
            ? `
              <details>
                <summary>Show answer</summary>
                <p>${question.answer}</p>
              </details>
            `
            : ""
        }

      </article>

    `).join("")}

  `;
}


/* =========================================================
   KEY POINTS
   ========================================================= */

function renderKeyPoints(topic) {

  const points =
    topic.keyPoints ||
    topic.examPoints ||
    [];


  return `

    <h2>Key points</h2>

    ${
      points.length
        ? `
          <ul>

            ${points.map(point =>

              `<li>${point}</li>`

            ).join("")}

          </ul>
        `
        : `
          <p>
            Key points are being prepared.
          </p>
        `
    }

  `;
}


/* =========================================================
   QUIZ
   ========================================================= */

function renderQuiz(topic) {

  const quiz = topic.quiz || [];


  if (!quiz.length) {

    return `
      <h2>Quiz</h2>
      <p>Quiz questions are being prepared.</p>
    `;
  }


  return `

    <h2>Quick quiz</h2>

    ${quiz.map((question, index) => `

      <article class="question-card">

        <span class="question-number">
          QUESTION ${index + 1}
        </span>

        <p>
          ${question.question}
        </p>

        ${
          question.options
            ? `
              <div class="quiz-options">

                ${question.options.map(option => `

                  <button
                    onclick="checkQuizAnswer(
                      ${index},
                      ${JSON.stringify(option)},
                      ${JSON.stringify(question.answer)}
                    )"
                  >
                    ${option}
                  </button>

                `).join("")}

              </div>
            `
            : ""
        }

        <div id="quiz-result-${index}"></div>

      </article>

    `).join("")}

  `;
}


/* =========================================================
   QUIZ CHECK
   ========================================================= */

function checkQuizAnswer(index, selected, correct) {

  const result =
    document.getElementById(
      "quiz-result-" + index
    );


  if (!result) return;


  if (selected === correct) {

    result.innerHTML =
      `<p class="quiz-correct">✓ Correct</p>`;

  } else {

    result.innerHTML =
      `<p class="quiz-wrong">Not quite. Try again.</p>`;

  }
}


/* =========================================================
   AI
   ========================================================= */

function renderAI() {

  return `

    <div class="ai-box">

      <div class="eyebrow">
        AI TUTOR
      </div>

      <h2>
        Ask StudyCore
      </h2>

      <p>
        The AI tutor will explain questions
        step-by-step, including formulas,
        reasoning and simpler explanations.
      </p>

      <div class="ai-status">
        AI TUTOR — COMING SOON
      </div>

    </div>

  `;
}


/* =========================================================
   MAIN RENDER
   ========================================================= */

function render() {

  switch (state.step) {

    case "class":
      renderClassPage();
      break;

    case "board":
      renderBoardPage();
      break;

    case "stream":
      renderStreamPage();
      break;

    case "subject":
      renderSubjectPage();
      break;

    case "book":
      renderBookPage();
      break;

    case "chapter":
      renderChapterPage();
      break;

    case "topic":
      renderTopicPage();
      break;

    default:
      goHome();

  }

}


/* =========================================================
   START APP
   ========================================================= */

render();
