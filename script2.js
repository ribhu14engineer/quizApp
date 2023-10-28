//https://quizapi.io/clientarea/settings/token         This is where you can get API; login with your google id ribhuswat
const apiKey = "qdZpUEQQPrshLoavNwwLNXaGYznySv3C1WMrjwEG";

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");


async function quizJS() {
    try {
        let response = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=10&tags=JavaScript`)
        const data = await response.json();
        questions = data;
        startQuiz();
    } catch (error) {
        console.log("Failed to Fetch Questions: ", error);
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    for (const key in currentQuestion.answers) {
        if (currentQuestion.answers[key] === null)
            break;
        const button = document.createElement("button");
        button.textContent = currentQuestion.answers[key];
        button.classList.add("btn");
        answerButtons.appendChild(button);

        if (currentQuestion.correct_answers[key + "_correct"])
            button.dataset.correct = currentQuestion.correct_answers[key + "_correct"];

        button.addEventListener("click", (e) => {
            const selectedBtn = e.target;
            const isCorrect = selectedBtn.dataset.correct === "true";
            if (isCorrect) {
                selectedBtn.classList.add("correct");
                score++;
            } else
                selectedBtn.classList.add("incorrect");

            console.log(score);
            Array.from(answerButtons.children).forEach(button => {
                if (button.dataset.correct === "true")
                    button.classList.add("correct");
                button.disabled = true;
            });
            nextButton.style.display = "block";
        });
    }
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length)
        showQuestion();
    else
        showScore();
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length)
        handleNextButton();
    else
        quizJS();
});

function showScore() {
    resetState();
    questionElement.innerHTML = `You Scored ${score} out of ${length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

quizJS();