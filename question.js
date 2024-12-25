const questionContainer = document.querySelector('.question');
const btnContainer = document.querySelector('.btns');
const lang = localStorage.getItem('lang')||'en';

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
  const response = await fetch(`quiz.${lang}.json`);
  const { questions } = await response.json();

  const images = [... new Set(questions.map(q => q.background))];

  images.forEach(image => {
    const img = new Image();
    img.src = `img/bg/${image}`;
  });

  return questions;
}

function startQuiz(data) {
  questions = data;
  showQuestion(currentQuestion);
  document.body.hidden = false;
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

  document.documentElement.scrollTop = 0;
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