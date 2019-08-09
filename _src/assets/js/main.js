"use strict";

// ---RESULT LIST

let searchSerie = "";
const getUserInput = () => {
  const userInput = document.querySelector("#search-input");
  return (searchSerie = userInput.value);
};

let datasFromServer = [];

const getDataFromServer = () => {
  fetch(`http://api.tvmaze.com/search/shows?q=${searchSerie}`)
    .then(response => response.json())
    .then(data => saveData(data));
};

const saveData = data => {
  for (const serie of data) {
    if (serie.show.image) {
      datasFromServer.push({
        name: serie.show.name,
        id: serie.show.id,
        image: serie.show.image.medium
      });
    } else {
      datasFromServer.push({
        name: serie.show.name,
        id: serie.show.id,
        image: `https://via.placeholder.com/210x295/ffffff/666666/?text=${
          serie.show.name
        }`
      });
    }
  }
  localStorage.setItem("result", JSON.stringify(datasFromServer));
};

let dataList = [];
const printResultSeries = () => {
  dataList = JSON.parse(localStorage.getItem("result"));
  for (const serie of dataList) {
    createResultElements(serie);
  }
};

const resultUL = document.querySelector(".result-list");

const createResultElements = serie => {
  const newResult = document.createElement("li");
  newResult.classList.add("result-list-item", "js-normal");
  newResult.dataset.index = serie.id;
  const newResultTitle = `<h3 class="result-list-item-title"> ${
    serie.name
  }</h3>`;
  let newResultImg = "";
  newResultImg = `<img class="result-list-item-img" src="${serie.image}">`;
  newResult.innerHTML = newResultImg + newResultTitle;
  resultUL.appendChild(newResult);
};

const deletResultList = () => {
  datasFromServer = [];
};

const searchBtn = document.querySelector("#btn-input");

const handleBtnClick = () => {
  deletResultList();
  getUserInput();
  getDataFromServer();
  printResultSeries();
  // saveInnerHTMLInLocal();
};

searchBtn.addEventListener("click", handleBtnClick);

// ---FAVORITES
const favoritList = [];

const printSerieInFavoritesList = () => {
  for (const serie of favoritList) {
    const newFavorite = document.createElement("li");
    newFavorite.innerHTML = serie.element;
    document.querySelector(".favorites").appendChild(newFavorite);
  }
};

const saveSerieInlocal = event => {
  for (let i = 0; i < resultListItems.length; i++) {
    if (resultListItems[i] === event.currentTarget) {
      console.log(i);
      dataList[i].element = resultListItems[i].innerHTML;
      favoritList.push(dataList[i]);
      localStorage.setItem("favorite", JSON.stringify(favoritList));
    }
  }
  return favoritList;
};

// const getPrintedItems = () => document.querySelectorAll('.result-list-item');

const changeSerieBG = event => {
  event.currentTarget.classList.replace("js-normal", "js-favorite");
};

const handleListClick = event => {
  saveSerieInlocal(event);
  // saveInnerHTMLInLocal();
  printSerieInFavoritesList();
  changeSerieBG(event);
};
let resultListItems = [];
const addEventInResultItems = () => {
  resultListItems = document.querySelectorAll(".result-list-item");
  for (const item of resultListItems) {
    item.addEventListener("click", handleListClick);
  }
};
const main = document.querySelector(".main");
main.addEventListener("click", addEventInResultItems);
