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

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const resultEl = document.getElementById("result");

function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach(option => {
    const li = document.createElement("li");
    li.innerHTML = `<label><input type="radio" name="option" value="${option}"> ${option}</label>`;
    optionsEl.appendChild(li);
  });
}

nextBtn.addEventListener("click", () => {
  const selected = document.querySelector("input[name='option']:checked");
  if (!selected) return alert("Please select an option.");

  const answer = selected.value;
  if (answer === questions[currentQuestion].answer) score++;

  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  document.getElementById("quiz").style.display = "none";
  resultEl.innerHTML = `<h2>Your Score: ${score}/${questions.length}</h2>`;
}

loadQuestion();
