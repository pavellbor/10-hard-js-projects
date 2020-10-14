const addNoteBtn = document.getElementById("add-note");
const notesList = document.getElementById("notes-list");
const noteIndex = document.querySelector(".notes-item__index");
const noteContent = document.querySelector(".notes-item__content");
const noteTextarea = document.querySelector(".notes-item__textarea");
const notesDB = {};

startApp();

function startApp() {
  const notesFromLS = checkLS();

  if (notesFromLS) {
    for (let index in notesFromLS) {
      notesDB[index] = notesFromLS[index];
      createNote(index, notesFromLS[index], true);
    }
  } else {
    createNote();
  }

  addNote();
}

function addNote() {
  addNoteBtn.addEventListener("click", (e) => {
    createNote();
  });
}

function createNote(noteIndexLS = null, noteTextLS = null, isBlocked = false) {
  const noteIndex = noteIndexLS || getNoteIndex();
  const noteItem = document.createElement("li");
  noteItem.dataset.index = noteIndexLS || noteIndex;
  noteItem.classList.add("notes__item", "notes-item");
  noteItem.innerHTML = `
  <p class="notes-item__control">
    <span class="notes-item__index"># ${noteIndex}</span>
    <button class="notes-item__button notes-item__button--modify">
      <i class="fa fa-pencil" aria-hidden="true"></i>
    </button>
    <button class="notes-item__button notes-item__button--delete">
      <i class="fa fa-trash-o" aria-hidden="true"></i>
    </button>
  </p>
  <p class="notes-item__content" ${isBlocked ? "" : "hidden"}>${
    noteTextLS || ""
  }</p>
  <textarea class="notes-item__textarea" ${
    isBlocked ? "hidden" : ""
  }>${noteTextLS || ''}</textarea>
  `;
  modifyNote(noteItem, noteIndex);
  deleteNote(noteItem, noteIndex);
  notesList.appendChild(noteItem);
}

function getNoteIndex() {
  const lastNote = notesList.lastElementChild;
  if (lastNote) {
    const lastIndex = lastNote.dataset.index;
    return Number(lastIndex) + 1;
  } else {
    return 1;
  }
}

function deleteNote(noteItem, noteIndex) {
  const deleteNoteBtn = noteItem.querySelector(".notes-item__button--delete");
  deleteNoteBtn.addEventListener("click", () => {
    noteItem.remove();
    deleteNoteLS(noteIndex);
  });
}

function modifyNote(noteItem, noteIndex) {
  const modifyNoteBtn = noteItem.querySelector(".notes-item__button--modify");
  const noteTextarea = noteItem.querySelector(".notes-item__textarea");
  const noteContent = noteItem.querySelector(".notes-item__content");

  noteContent.addEventListener("click", () => {
    changeNoteIcon(modifyNoteBtn, true);
    changeNoteText(noteContent, noteTextarea);
    noteTextarea.focus();
  });

  noteTextarea.addEventListener("focus", () => {
    changeNoteIcon(modifyNoteBtn, true);
  });

  noteTextarea.addEventListener("blur", () => {
    changeNoteIcon(modifyNoteBtn, false);
    changeNoteText(noteContent, noteTextarea);
    addNoteLS(noteIndex, noteTextarea);
  });
}

function changeNoteText(noteContent, noteTextarea) {
  const noteText = noteTextarea.value;
  let isEditable = noteContent.hasAttribute("hidden");

  if (isEditable) {
    noteTextarea.setAttribute("hidden", "");
    noteContent.removeAttribute("hidden");
  } else {
    noteContent.setAttribute("hidden", "");
    noteTextarea.removeAttribute("hidden");
    noteTextarea.selectionStart = noteTextarea.value.length;
  }

  noteContent.innerHTML = noteText;
}

function changeNoteIcon(modifyNoteBtn, addFocus) {
  if (addFocus) {
    modifyNoteBtn.classList.add("notes-item__button--active");
  } else {
    modifyNoteBtn.classList.remove("notes-item__button--active");
  }
}

function addNoteLS(noteIndex, noteTextarea) {
  const noteText = noteTextarea.value;
  notesDB[noteIndex] = noteText;
  if (noteText) {
    localStorage.setItem("notesDB", JSON.stringify(notesDB));
  }
}

function deleteNoteLS(noteIndex) {
  delete notesDB[noteIndex];
  localStorage.setItem("notesDB", JSON.stringify(notesDB));
}

function checkLS() {
  const notesFromLS = JSON.parse(localStorage.getItem("notesDB")) || {};
  const isEmpty = Object.keys(notesFromLS).length === 0;

  return !isEmpty ? notesFromLS : false;
}
