/* eslint-disable quotes */
"use strict";

// ---RESULT LIST

let searchSerie = "";
const getUserInput = () => {
  const userInput = document.querySelector("#search-input");
  return (searchSerie = userInput.value);
};

let dataList = [];

const saveData = data => {
  for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
    dataList.push({
      name: data[dataIndex].show.name,
      id: data[dataIndex].show.id,
      genres: data[dataIndex].show.genres
    });
    if (data[dataIndex].show.image) {
      dataList[dataIndex].image = data[dataIndex].show.image.medium;
      dataList[dataIndex].fullImage = data[dataIndex].show.image.original;
    } else {
      dataList[dataIndex].image = `https://via.placeholder.com/210x295/ffffff/666666/?text=${
        data[dataIndex].show.name
      }`;
      dataList[dataIndex].fullImage = `https://via.placeholder.com/210x295/ffffff/666666/?text=${
        data[dataIndex].show.name
      }`;

    }
  }
  return dataList;
};

const resultUL = document.querySelector(".result-list");

const addFavClass = (serie, newResult) => {
  for (const fav of favoritesList) {
    if (serie.id === parseInt(fav.id)) {
      newResult.classList.add("js-favorite");
    }
  }
};

const createResultElements = serie => {
  const newResult = document.createElement("li");
  newResult.classList.add("result-list-item");
  newResult.dataset.id = serie.id;
  newResult.dataset.index = serie.id;
  const newResultTitle = `<h3 class="result-list-item-title"> ${
    serie.name
  }</h3>`;
  let newResultImg = "";
  newResultImg = `<img class="result-list-item-img" src="${serie.image}">`;
  let newResultGenres = `<ul class="result-list-item-genres">`;
  for (const genre of serie.genres) {
    let newLi = `<li>${genre}</li>`;
    newResultGenres = newResultGenres + newLi;
  }
  newResultGenres = newResultGenres + "</ul>";
  newResult.innerHTML = newResultImg + newResultTitle + newResultGenres;
  addFavClass(serie, newResult);
  resultUL.appendChild(newResult);
};

const printResultSeries = () => {
  if (dataList) {
    for (const serie of dataList) {
      createResultElements(serie);
    }
  }
};

const getDataFromServer = () => {
  fetch(`http://api.tvmaze.com/search/shows?q=${searchSerie}`)
    .then(response => response.json())
    .then(data => {
      saveData(data);
      printResultSeries();
    })
    .then(() => addEventinResultImages());
};

const deletResultList = () => {
  dataList = [];
  resultUL.innerHTML = "";
};

const searchBtn = document.querySelector("#btn-input");
const handleBtnClick = () => {
  deletResultList();
  getUserInput();
  getDataFromServer();
};

searchBtn.addEventListener("click", handleBtnClick);

// ---FAVORITES

let favoritesList = JSON.parse(localStorage.getItem("favorite")) || [];
let favoritesContainer = [];

const generateNewFavElem = serie => {
  const newFavorite = document.createElement("li");
  newFavorite.classList.add("favorites-list-item");
  newFavorite.dataset.id = serie.id;
  newFavorite.innerHTML =
    serie.element +
    "<img  id='remove-img' src='./assets/icons/close.svg' alt='remove this serie from favorites'>";
  newFavorite.removeChild(newFavorite.children[2]);
  newFavorite.firstElementChild.classList.replace('result-list-item-img', 'favorites-list-item-img');
  favoritesContainer.appendChild(newFavorite);
};

const printSerieInFavoritesList = () => {
  favoritesContainer = document.querySelector(".favorites-list");
  favoritesContainer.innerHTML = "";
  if (JSON.parse(localStorage.getItem("favorite"))) {
    favoritesList = JSON.parse(localStorage.getItem("favorite"));
    for (const serie of favoritesList) {
      generateNewFavElem(serie);
    }
  }
};
printSerieInFavoritesList();

const addSerieOnFavorites = event => {
  favoritesList.push({
    id: event.currentTarget.dataset.id,
    element: event.currentTarget.innerHTML
  });
  localStorage.setItem("favorite", JSON.stringify(favoritesList));
};

let resultListItems = [];

const saveSerieInlocal = event => {
  let favorite = false;
  for (const favSerie of favoritesList) {
    if (favSerie.id === event.currentTarget.dataset.id) {
      favorite = true;
    }
  }
  if (favorite === false) {
    addSerieOnFavorites(event);
  }
  return favoritesList;
};

const changeSerieBG = event => event.currentTarget.classList.add("js-favorite");

const handleResultListClick = event => {
  saveSerieInlocal(event);
  printSerieInFavoritesList();
  changeSerieBG(event);
};

const addEventInResultItems = () => {
  resultListItems = document.querySelectorAll(".result-list-item");
  for (const item of resultListItems) {
    item.addEventListener("click", handleResultListClick);
  }
  return resultListItems;
};

const main = document.querySelector(".main");
main.addEventListener("mouseover", addEventInResultItems);

// REMOVE FAVORITE
const removeFromFavoriteList = event => {
  for (let i = 0; i < favoritesList.length; i++) {
    if (favoritesList[i].id === event.currentTarget.parentElement.dataset.id) {
      favoritesList.splice(i, 1);
    }
  }
  localStorage.setItem("favorite", JSON.stringify(favoritesList));
};

const removeSerieBG = event => {
  for (const result of resultListItems){
    if(result.dataset.id === event.currentTarget.parentElement.dataset.id){
      result.classList.remove('js-favorite');
    }
  }
};

const handleRemoveImgClick = event => {
  removeFromFavoriteList(event);
  printSerieInFavoritesList();
  removeSerieBG(event);
};

const AddEventInRemoveIcons = () => {
  const xImgs = document.querySelectorAll("#remove-img");
  for (const images of xImgs) {
    images.addEventListener("click", handleRemoveImgClick);
  }
};

favoritesContainer.addEventListener("mouseover", AddEventInRemoveIcons);

// Remove from favorites button

const removeFavoriteClass = () => {
  for (let i = 0; i < resultListItems.length; i++) {
    resultListItems[i].classList.remove("js-favorite");
  }
};

const handleRemoveFavoritesBTNClick = () => {
  removeFavoriteClass();
  favoritesList = [];
  favoritesContainer.innerHTML = "";
  localStorage.setItem("favorite", JSON.stringify(favoritesList));
};

const removeBtn = document.querySelector("#btn-remove-favotites");

removeBtn.addEventListener("click", handleRemoveFavoritesBTNClick);

/// Big image funcion 

const handleImageClick = event => {
  for (const data of dataList){
    if (event.currentTarget.parentElement.dataset.id == data.id){
      window.open(data.fullImage, '_blank');
    }
  }
};

const addEventinResultImages = () => {
  const resultImages = document.querySelectorAll('.result-list-item-img');
  for (const image of resultImages){
    image.addEventListener('click', handleImageClick);
  }
};