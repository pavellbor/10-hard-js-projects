const formEl = document.getElementById("todo-form");
const inputEl = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");

checkLS();
addItem();

function createItem(text, classes = null) {
  const itemEl = document.createElement("li");
  if (classes) {
    classes.forEach(i => itemEl.classList.add(i));
  } else {
    itemEl.classList.add('todo__item')
  }
  itemEl.textContent = text;
  listEl.appendChild(itemEl);

  removeItem(itemEl);
  doneItem(itemEl);
}

function addItem() {
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = inputEl.value;
    createItem(text);
    e.target.reset();
    updateLS();
  });
}

function removeItem(itemEl) {
  itemEl.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    itemEl.remove();
    updateLS();
  });
}

function doneItem(itemEl) {
  itemEl.addEventListener("click", (e) => {
    e.preventDefault();
    itemEl.classList.toggle("todo__item--done");
    updateLS();
  });
}

function updateLS() {
  const todosDB = [];
  localStorage.clear();
  for (let { className, textContent } of listEl.children) {
    todosDB.push([className, textContent]);
  }
  localStorage.setItem("todos", JSON.stringify(todosDB));
}

function checkLS() {
  todosLS = JSON.parse(localStorage.getItem("todos"));

  if (todosLS) {
    todosLS.forEach(([classes, text]) => {
      classes = classes.split(' ')
      createItem(text, classes);
    });
  }
}
