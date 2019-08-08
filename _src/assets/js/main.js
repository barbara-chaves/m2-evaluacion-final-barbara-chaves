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
    .then(data => {
      printResultSeries(data);
      datasFromServer = data;
      return datasFromServer;
    });
};

const printResultSeries = data => {
  for (const serie of data) {
    createResultElements(serie);
  }
};

const resultList = document.querySelector('.result-list');
const createResultElements = serie => {
  const newResult = document.createElement('li');
  newResult.classList.add('result-list-item', 'js-normal');
  newResult.dataset.index = serie.show.id;
  const newResultTitle = `<h3 class="result-list-item-title"> ${
    serie.show.name
  }</h3>`;
  let newResultImg = '';
  if (serie.show.image) {
    newResultImg = `<img class="result-list-item-img" src="${
      serie.show.image.medium
    }">`;
  } else {
    newResultImg = `<img class="result-list-img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=${
      serie.show.name
    }">`;
  }
  newResult.innerHTML = newResultImg + newResultTitle;
  resultList.appendChild(newResult);
};

const deletResultList = () => {
  resultList.innerHTML = '';
};

const searchBtn = document.querySelector('#btn-input');

const addEventInResultItems = () => {
  const resultListItems = document.querySelectorAll('.result-list-item');
  for (const item of resultListItems){
    item.addEventListener('click', handleListClick);
  }
};

const handleBtnClick = () => {
  deletResultList();
  getUserInput();
  getDataFromServer();
  // addEventInResultItems();
};

searchBtn.addEventListener('click', handleBtnClick);

// ---FAVORITES

const favoritList = [{serieName: ' ', serieElement: ' '}];
const saveSerieInlocal = (event) => {
  for (let favIndex = 0; favIndex < favoritList.length; favIndex++){
    favoritList.push({
      serieName: event.currentTarget.innerText,
      serieElement: event.currentTarget.innerHTML
    });
  }
  localStorage.setItem('favorite', JSON.stringify(favoritList));
  return favoritList;
};



// const getPrintedItems = () => document.querySelectorAll('.result-list-item');
const printedFavoriteList = document.querySelector('.favorites-list');

const printSerieInFavoritesList = () => {
  for (const serieItem of favoritList){
    let serie = document.createElement('li');
    serie.innerHTML = serieItem.serieElement;
    printedFavoriteList.appendChild(serie);
  }
};

const changeSerieBG = (event) => {
  event.currentTarget.classList.replace('js-normal', 'js-favorite');
};

const handleListClick = (event) => {
  saveSerieInlocal(event);
  printSerieInFavoritesList();
  changeSerieBG(event);
};


const main = document.querySelector('.main');
main.addEventListener('click', addEventInResultItems);
