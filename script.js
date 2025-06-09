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
let showingFeedback = false;

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
    li.innerHTML = `
      <label class="option">
        <input type="radio" name="option" value="${option}"> ${option}
      </label>`;
    optionsEl.appendChild(li);
  });

  resultEl.innerHTML = ""; // Clear feedback
  nextBtn.textContent = "Submit";
  showingFeedback = false;
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

function showResult() {
  document.getElementById("quiz").style.display = "none";
  resultEl.innerHTML = `<h2>Your Score: ${score}/${questions.length}</h2>`;
}

loadQuestion();
