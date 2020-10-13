const quiz = [
  {
    question: "Как часто перекрашивают Эйфелевую башню?",
    answer1: "Каждые семь лет",
    answer2: "Каждые три года",
    answer3: "Каждые десять лет",
    answer4: "Никогда",
    correct: 1,
  },
  {
    question: "Сколько процентов населения Земли рыжие?",
    answer1: "2%",
    answer2: "10%",
    answer3: "15%",
    answer4: "8%",
    correct: 1,
  },
  {
    question: "Какую должность занимал Ленин после революции?",
    answer1: "Глава государства",
    answer2: "Глава правительства",
    answer3: "Глава партии",
    answer4: "Глава Коминтерна",
    correct: 2,
  },
  {
    question: 'В какой стране находится знаменитая "Церковь из костей"?',
    answer1: "Индия",
    answer2: "Словакия",
    answer3: "Индонезия",
    answer4: "Чешская республика",
    correct: 4,
  },
];

const container = document.querySelector(".container");

let i = 0;
let correct = 0;
renderQuestion(i);

function renderQuestion(i) {
  container.innerHTML = `
  <b class="question">${quiz[i].question}</b>
  <ul class="answers-list">
  <li class="answers-item">
  <input type="radio" name="answer" value="1" id="answer1" checked>
  <label for="answer1">${quiz[i].answer1}</label>
  </li>
  <li class="answers-item">
  <input type="radio" name="answer" value="2" id="answer2">
  <label for="answer2">${quiz[i].answer2}</label>
  </li>
  <li class="answers-item">
  <input type="radio" name="answer" value="3" id="answer3">
  <label for="answer3">${quiz[i].answer3}</label>
  </li>
  <li class="answers-item">
  <input type="radio" name="answer" value="4" id="answer4">
  <label for="answer4">${quiz[i].answer4}</label>
  </li>
  </ul>
  <button class="btn">Готово</button>
  `;

  const btn = document.querySelector(".btn");

  btn.addEventListener("click", () => {
    checkAnswer();
    changeQuestion();
  });
}

function checkAnswer() {
  const input = document.querySelector("input:checked");
  if (input.value == quiz[i].correct) correct += 1;
}

function changeQuestion() {
  i++;

  if (i === quiz.length) {
    showResult();
    return;
  }

  renderQuestion(i);
}

function showResult() {
  container.innerHTML = `
    <b class="title">Вопросы закончились :(</b>
    <p>Ваш результат таков: ${correct} правильных ответа из ${quiz.length}</p>
    <button class="btn" onclick="location.reload()">Попробовать снова</button>
  `;
}
