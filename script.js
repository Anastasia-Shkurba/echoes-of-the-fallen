const startBtn = document.querySelector("button");
const langToggle = document.querySelector("#toggle");
let lang = localStorage.getItem('lang')||'en';
let dict = {};

if (lang === 'uk') {
  langToggle.checked = true;
}

getText().then(applyLang);

startBtn.onclick = () => {
  location.href = "question.html";
};

langToggle.onchange = () => {
  lang = langToggle.checked ? 'uk' : 'en';
  applyLang();
  localStorage.setItem('lang', lang);
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

  document.body.hidden = false;
}