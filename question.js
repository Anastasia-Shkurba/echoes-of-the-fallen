const questionContainer = document.querySelector('.question');
const btnContainer = document.querySelector('.btns');

let questions = [];
let currentQuestion = 0;
let answers = {};

btnContainer.onclick = handleClick;

continueStartedQuiz();

getQuestions().then(startQuiz);

function continueStartedQuiz() {
  const index = localStorage.getItem('index');
  const storedAnswers = localStorage.getItem('answers');

  if (index) {
    currentQuestion = +index;

    if (currentQuestion > 12) {
      location.href = "results.html";
    }
  }
  if (storedAnswers) {
    answers = JSON.parse(storedAnswers);
  }
}

function storeProgress() {
  localStorage.setItem('index', currentQuestion);
  localStorage.setItem('answers', JSON.stringify(answers));
}

async function getQuestions() {
  const response = await fetch('quiz.en.json');
  const { questions } = await response.json();

  return questions;
}

function startQuiz(data) {
  questions = data;
  showQuestion(currentQuestion);
}

function showQuestion(questionIndex) {
  const { question, answers, background } = questions[questionIndex];

  questionContainer.innerHTML = question.split('\n')
    .map(line => `<p>${line}</p>`).join('');
  btnContainer.innerHTML = answers.map(answer => {
    return `
      <button>${answer.text}</button>
    `
  }).join('');
  document.body.style.backgroundImage = `url('img/bg/${background}')`;
}

function handleClick(e) {
  if (e.target.matches('button')) {
    const i = Array.from(btnContainer.children).indexOf(e.target);
    const {points} = questions[currentQuestion].answers[i];

    Object.keys(points).forEach(key => {
      answers[key] = (answers[key] || 0) + points[key];
    });
    currentQuestion++;

    storeProgress();

    if (currentQuestion < questions.length) {
      showQuestion(currentQuestion);
    } else {
      showResults();
    }
  }
}

function showResults() {
  location.href = "results.html";
}