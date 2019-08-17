/* eslint-disable quotes */
"use strict";

// ---RESULT LIST

let userInput = "";

const getUserInput = () => {
  userInput = document.querySelector("#search-input");
  return userInput;
};

let dataList = [];

const getDataFromServer = () => {
  fetch(`http://api.tvmaze.com/search/shows?q=${userInput.value}`)
    .then(response => response.json())
    .then(data => {
      saveData(data);
      printResultSeries();
    });
};

const setSerieAsFavorite = () => {
  for (const serie of dataList) {
    for (let fav = 0; fav < favoritList.length; fav++) {
      if (serie.id === favoritList[fav].id) {
        serie.favorite = true;
      }
    }
  }
};


const saveData = data => {
  for (const serie of data) {
    dataList.push({
      name: serie.show.name,
      id: serie.show.id,
      genres: serie.show.genres
    });
    if (serie.show.image) {
      serie.image = serie.show.image.medium;
    } else {
      serie.image = `https://via.placeholder.com/210x295/ffffff/666666/?text=${serie.show.name}`;
    }
  }
  console.log(dataList);
  return dataList;
};
const resultUL = document.querySelector(".result-list");


const createResultElements = (serie, container) => {
  const newResult = document.createElement("li");
  newResult.classList.add("result-list-item");
  newResult.dataset.id = serie.id;

  const newResultTitle = `<h3 class="result-list-item-title"> ${
    serie.name
  }</h3>`;
  let newResultImg = "";
  newResultImg = `<img class="result-list-item-img" src="${serie.image}">`;
  let newResultGenres = `<ul class="result-list-item-genres">`;
  for (const genre of serie.genres){
    let newLi = `<li>${genre}</li>`;
    newResultGenres = newResultGenres + newLi;
  }
  newResultGenres = newResultGenres + '</ul>';
  newResult.innerHTML = newResultImg + newResultTitle + newResultGenres;
  resultUL.appendChild(newResult);
};

const deletResultList = () => {
  resultUL.innerHTML = '';
};
const printResultSeries = (data) => {
  // setSerieAsFavorite();
  for (const serie of data) {
    createResultElements(serie.show, resultUL);
  }
};

// const getDataFromServer = () => {
//   fetch(`http://api.tvmaze.com/search/shows?q=${userInput.value}`)
//     .then(response => response.json())
//     .then(data => {

//       printResultSeries(data);
//     });
// };

// const setSerieAsFavorite = () => {
//   for (const serie of dataList) {
//     for (let fav = 0; fav < favoritList.length; fav++) {
//       if (serie.id === favoritList[fav].id) {
//         serie.favorite = true;
//       }
//     }
//   }
// };


const searchBtn = document.querySelector("#btn-input");
const handleBtnClick = () => {
  deletResultList();
  getUserInput();
  getDataFromServer();
};

searchBtn.addEventListener("click", handleBtnClick);

// ---FAVORITES

let favoritList = JSON.parse(localStorage.getItem("favorite")) || [];
let favoritesContainer = document.querySelector(".favorites-list");

const printSerieInFavoritesList = () => {
  if (favoritList.length > 0){
    // console.log('favoritList is not empty');
    createResultElements(favoritList[0], favoritesContainer);
    const favoritesLength = favoritesContainer.children.length - 1;
    favoritesContainer.children[favoritesLength].classList.replace('result-list-item', 'favorites-list-item');
  }
};

// printSerieInFavoritesList();

const printAllFavoriteSeries = () => {
  for (const serie of favoritList){
    createResultElements(serie, favoritesContainer);
  }
};

printAllFavoriteSeries();

const addSerieOnFavorites = event => {
  favoritList.unshift({
    name: event.currentTarget.lastChild.innerHTML,
    id: event.currentTarget.dataset.id,
    image: {medium: event.currentTarget.firstElementChild.src}
  });
  localStorage.setItem('favorite', JSON.stringify(favoritList));
};

const removeSerieFromFavories = serie => {
  for (let favIndex = 0; favIndex < favoritList.length; favIndex++) {
    if (serie  === favoritList[favIndex].id) {
      favoritList.splice(favoritList.indexOf(favoritList[favIndex]), 1);
    }
  }
  localStorage.setItem("favorite", JSON.stringify(favoritList));
};

let resultListItems = [];
const saveSerieInlocal = event => {
  if (favoritList.length > 0){
    for (let i = 0; i < favoritList.length; i++) {
      if (favoritList[i].id === event.currentTarget.dataset.id) {
        removeSerieFromFavories(favoritList[i]);
        console.log('Im already in favorites');
      } else {
        addSerieOnFavorites(event);
        printSerieInFavoritesList();
        console.log('Im not in favorites');
      }
    }
  } else{
    addSerieOnFavorites(event);
    printSerieInFavoritesList();
  }
  return favoritList;
};

// const changeSerieBG = () => {
//   for (let i = 0; i < dataList.length; i++) {
//     if (dataList[i].favorite) {
//       resultListItems[i].classList.add("js-favorite");
//     } else {
//       resultListItems[i].classList.remove("js-favorite");
//     }
//   }
// };

const handleListClick = event => {
  saveSerieInlocal(event);
  // addSerieOnFavorites(event);
  // printSerieInFavoritesList();
  // changeSerieBG();
};

const addEventInResultItems = () => {
  resultListItems = document.querySelectorAll(".result-list-item");
  for (const item of resultListItems) {
    item.addEventListener("click", handleListClick);
  }
};

const main = document.querySelector(".main");
main.addEventListener("mouseover", addEventInResultItems);

// REMOVE FAVORITE

let favoritesItems = document.querySelectorAll(".favorites-list-item");

const removeAnImageFromFavoriteList = event => {
  for (let i = 0; i < favoritList.length; i++) {
    if (favoritList[i].id === parseInt(event.currentTarget.parentElement.dataset.id)) {
      for (let dataIndex = 0; dataIndex < dataList.length; dataIndex++){
        if (dataList[dataIndex].id === favoritList[i].id) {
          dataList[dataIndex].favorite = false;
        }
      }
      favoritList.splice(i, 1);
    }
  }
  localStorage.setItem("favorite", JSON.stringify(favoritList));
};

const handleRemoveImgClick = event => {
  removeAnImageFromFavoriteList(event);
  printSerieInFavoritesList();
  changeSerieBG();
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
  for(let i = 0; i < resultListItems.length; i++){
    resultListItems[i].classList.remove('js-favorite');
  }
};

const handleRemoveFavoritesBTNClick = () => {
  removeFavoriteClass();
  favoritList = [];
  favoritesContainer.innerHTML = '';
  localStorage.setItem("favorite", JSON.stringify(favoritList));
};

const removeBtn = document.querySelector("#btn-remove-favotites");

removeBtn.addEventListener("click", handleRemoveFavoritesBTNClick);
