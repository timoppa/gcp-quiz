const questions = [
  {
    question: "Which GCP service is a fully managed NoSQL database?",
    options: ["Cloud SQL", "Firestore", "BigQuery", "Dataproc"],
    answer: "Firestore"
  },
  {
    question: "Which GCP service is used for serverless compute?",
    options: ["App Engine", "Compute Engine", "Cloud Run", "Cloud Functions"],
    answer: "Cloud Functions"
  }
];

questions.sort(() => Math.random() - 0.5);


let currentQuestion = 0;
let score = 0;
let showingFeedback = false;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const resultEl = document.getElementById("result");
const finishBtn = document.getElementById('finishTestBtn');



function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function updateProgress() {
  const progressPercent = ((currentQuestion) / questions.length) * 100;
  document.getElementById('progressBar').style.width = `${progressPercent}%`;
  document.getElementById('progressText').textContent = `Question ${currentQuestion + 1}`;
}

function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  const shuffledOptions = shuffleArray([...q.options]);

  shuffledOptions.forEach(option => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label class="option">
        <input type="radio" name="option" value="${option}">
        <span>${option}</span>
      </label>`;
    optionsEl.appendChild(li);
  });

  resultEl.innerHTML = "";
  nextBtn.textContent = "Submit";
  showingFeedback = false;
  updateProgress(); // update bar
  finishBtn.style.display = (currentQuestion === questions.length - 1) ? "block" : "none";
}


nextBtn.addEventListener("click", () => {
  const selected = document.querySelector("input[name='option']:checked");
  const correct = questions[currentQuestion].answer;

  if (!showingFeedback) {
    if (!selected) return alert("Please select an option.");

    const answer = selected.value;

    // Disable all inputs
    document.querySelectorAll("input[name='option']").forEach(input => input.disabled = true);

    // Highlight correct and incorrect
    document.querySelectorAll("input[name='option']").forEach(input => {
      const parentLabel = input.parentElement;
      if (input.value === correct) {
        parentLabel.classList.add("correct");
      }
      if (input.checked && input.value !== correct) {
        parentLabel.classList.add("incorrect");
      }
    });

    // Feedback text
    if (answer === correct) {
      score++;
      resultEl.innerHTML = `<p style="color: green;">✅ Correct!</p>`;
    } else {
      resultEl.innerHTML = `<p style="color: red;">❌ Incorrect.</p>
                            <p>Correct Answer: <strong>${correct}</strong></p>`;
    }

    nextBtn.textContent = currentQuestion < questions.length - 1 ? "Next Question" : "See Result";
    showingFeedback = true;

  } else {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }
});


// Save score to history in localStorage
function saveScoreToHistory(score, total) {
  const scoreRecord = {
    score,
    total,
    date: new Date().toLocaleString()
  };

  let history = JSON.parse(localStorage.getItem('quizScoreHistory')) || [];
  history.push(scoreRecord);
  localStorage.setItem('quizScoreHistory', JSON.stringify(history));
}

// Show full history above quiz
function displayScoreHistory() {
  const container = document.querySelector(".container");
  let history = JSON.parse(localStorage.getItem('quizScoreHistory')) || [];

  // Remove existing history display if any
  const existingHistory = document.getElementById('scoreHistory');
  if (existingHistory) existingHistory.remove();

  if (history.length === 0) return;

  // Create history table
  const historyDiv = document.createElement('div');
  historyDiv.id = 'scoreHistory';
  historyDiv.innerHTML = `
    <h3>Score History</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th>#</th>
          <th>Score</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${history.map((item, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${item.score} / ${item.total}</td>
            <td>${item.date}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <button id="clearHistoryBtn" style="margin-top: 10px;">Clear History</button>
    <hr>
  `;

  container.insertBefore(historyDiv, document.getElementById("quiz"));

  // Add clear history button event listener
  document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    if (confirm("Are you sure you want to clear your score history?")) {
      localStorage.removeItem('quizScoreHistory');
      displayScoreHistory(); // Remove history display
    }
  });
}

// Updated showResult to save score and show history
function showResult() {
  saveScoreToHistory(score, questions.length);
  document.getElementById("quiz").style.display = "none";
  resultEl.innerHTML = `<h2>Your Score: ${score}/${questions.length}</h2>`;
  finishBtn.style.display = "none";
  displayScoreHistory();
}

// Initial call to show history on page load
displayScoreHistory();

finishBtn.style.display = "none"; // start hidden

// Initial call to load first question
loadQuestion();
