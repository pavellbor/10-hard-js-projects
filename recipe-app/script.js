const cardsList = document.querySelector(".cards__list");
const popupContainer = document.querySelector(".popup-container");
const searchForm = document.forms[0];
let favouriteObj = {};

if (localStorage.getItem("favouriteObj")) {
  favouriteObj = JSON.parse(localStorage.getItem("favouriteObj"));
  updateFavouriteList(favouriteObj);
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchAsk = searchForm.querySelector("input").value;

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchAsk}`)
    .then((response) => response.json())
    .then((data) => {
      const { meals } = data;

      meals ? createCard(meals) : cardsList.innerHTML = `<p>Not found</p>`
    });
});

fetch("https://www.themealdb.com/api/json/v1/1/random.php")
  .then((response) => response.json())
  .then((data) => {
    const { meals } = data;
    createRandomCard(meals);
  });

function createRandomCard(meals) {
  meals.forEach((meal) => {
    cardsList.innerHTML = `
      <div class="card" data-id="${meal.idMeal}">
        <div class="card__header">
          <span>Random recipe</span>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="card__content">
          <h2><a href="#">${meal.strMeal}</a></h2>
          <button><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
        </svg></button>
        </div>
      </div>
    `;

    toggleFavourite(meal);
    openFullCard(meal);
  });
}

function createCard(meals) {
  cardsList.innerHTML = ``;
  meals.forEach((meal) => {
    cardsList.innerHTML += `
      <div class="card" data-id="${meal.idMeal}">
        <div class="card__header">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="card__content">
          <h2><a href="#">${meal.strMeal}</a></h2>
          <button><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
        </svg></button>
        </div>
      </div>
    `;

    toggleFavourite();
    openFullCard();
  });
}

function openFullCard() {
  const links = document.querySelectorAll(".card a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = e.currentTarget.closest(".card").dataset.id;

      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((response) => response.json())
        .then(({ meals }) => createFullCard(meals[0]));
    });
  });
}

function openFullFavouriteCard() {
  const links = document.querySelectorAll(".favourite__item a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = e.currentTarget.closest(".favourite__item").dataset.id;

      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((response) => response.json())
        .then(({ meals }) => createFullCard(meals[0]));
    });
  });
}

function createFullCard(meal) {
  popupContainer.innerHTML = `
      <div class="full-card">
        <button class="full-card__button">×</button>
        <h2>${meal.strMeal}</h2>
        <div class="full-card__header">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="full-card__content">
          <p>${meal.strInstructions}</p>
          <h3>Ingredients</h3>
          <ul></ul>
        </div>
      </div>
    `;

  createIngredientsList(meal);
  closeFullCard();
}

function createIngredientsList(meal) {
  const ul = document.querySelector(".full-card__content ul");
  const obj = Object.entries(meal);
  const ingredients = obj.filter(
    (item) =>
      item[0].startsWith("strIngredient") &&
      item[1] !== null &&
      item[1].length > 0
  );
  const quantities = obj.filter(
    (item) =>
      item[0].startsWith("strMeasure") && item[1] !== null && item[1].length > 0
  );

  let ingredientsHTML = ``;
  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i][1];
    const quantity = quantities[i][1];
    ingredientsHTML += `<li>${ingredient} — ${quantity}</li>`;
  }

  ul.innerHTML = ingredientsHTML;
}

function closeFullCard() {
  const closeBtn = document.querySelector(".full-card__button");
  closeBtn.addEventListener("click", () => {
    popupContainer.innerHTML = ``;
  });
}

function toggleFavourite() {
  const favouriteBtns = document.querySelectorAll(".card button");

  favouriteBtns.forEach((favouriteBtn) => {
    favouriteBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const id = e.currentTarget.closest(".card").dataset.id;

      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((response) => response.json())
        .then(({ meals }) => {
          addFavourite(favouriteObj, ...meals, id, favouriteBtn);
        });
    });
  });
}

function addFavourite(favouriteObj, meals, id, favouriteBtn) {
  if (favouriteObj[id] === undefined) {
    favouriteObj[id] = {
      id: meals.idMeal,
      img: meals.strMealThumb,
      title: meals.strMeal,
    };

    localStorage.setItem("favouriteObj", JSON.stringify(favouriteObj));

    favouriteBtn.innerHTML = `
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-heart-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
      </svg>
    `;

    updateFavouriteList(favouriteObj, favouriteBtn);
  } else {
    removeFavourite(favouriteObj, id, favouriteBtn);
  }
}

function removeFavourite(favouriteObj, id, favouriteBtn) {
  delete favouriteObj[id];

  localStorage.setItem("favouriteObj", JSON.stringify(favouriteObj));

  if (favouriteBtn) {
    favouriteBtn.innerHTML = `
  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
  </svg>
`;
  }

  updateFavouriteList(favouriteObj, favouriteBtn);
}

function updateFavouriteList(favouriteObj) {
  const favouriteList = document.querySelector(".favourite__list");
  let favouriteItemHTML = ``;
  favouriteList.innerHTML = favouriteItemHTML;

  if (Object.keys(favouriteObj).length > 0) {
    for (let item in favouriteObj) {
      favouriteItemHTML = `
        <li class="favourite__item" data-id="${favouriteObj[item].id}">
          <button>✖</button>
          <a href="#">
            <div><img src="${favouriteObj[item].img}"></div>
            <h3>${favouriteObj[item].title}</h3>
          </a>
        </li>
      `;
      favouriteList.innerHTML += favouriteItemHTML;
      listenRemoveFavouriteBtn(favouriteObj);
    }
    openFullFavouriteCard();
  } else {
    favouriteList.innerHTML = `<li class="favourite__empty">It's empty now...<br>Add something</li>`;
  }
}

function listenRemoveFavouriteBtn(favouriteObj) {
  const removeBtns = document.querySelectorAll(".favourite__item button");
  removeBtns.forEach((removeBtn) => {
    removeBtn.addEventListener("click", (e) => {
      const id = e.currentTarget.closest("li").dataset.id;
      const favBtn = document.querySelector(`.card[data-id="${id}"] button`);
      e.preventDefault();
      console.log(favouriteObj, favBtn);
      removeFavourite(favouriteObj, id, favBtn);
    });
  });
}
