const title = document.querySelector('h2');
const picture = document.querySelector('img');
const text = document.querySelector('.text');
const restartBtn = document.querySelector("button");
const lang = localStorage.getItem('lang')||'en';

let answers = {};

restartBtn.onclick = () => {
  localStorage.removeItem('answers');
  localStorage.removeItem('index');
  location.href = "index.html";
}

continueStartedQuiz();

getText().then(applyLang);
getResults().then(showResults);

function continueStartedQuiz() {
  const index = localStorage.getItem('index');
  const storedAnswers = localStorage.getItem('answers');

  if (!index || !storedAnswers || index !== '13') {
    location.href = "question.html";
  }

  answers = JSON.parse(storedAnswers);
}

async function getResults() {
  const response = await fetch(`quiz.${lang}.json`);
  const { results } = await response.json();

  return results;
}

function showResults(results) {
  const {male, female, ...points} = answers;
  const gender = male ? 'male' : 'female';
  const key = getDominant(points);
  const result = results[key];
  
  title.innerText = result.title;
  text.innerHTML = result.text.split('\n')
    .map(line => `<p>${line}</p>`).join('');
  picture.src = `img/characters/${gender}-${key}.jpg`;
  picture.alt = result.title;
  document.body.hidden = false;
}

function getDominant(points) {
  const sorted = Object.entries(points).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

async function getText() {
  const response = await fetch("text.json");
  dict = await response.json();
}

function applyLang() {
  const elements = document.querySelectorAll("[data-text]");

  elements.forEach(element => {
    element.innerText = dict[element.dataset.text][lang];
  });
}