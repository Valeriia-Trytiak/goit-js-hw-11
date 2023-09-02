import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { serviceSearchImg } from './js/img-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEL: document.querySelector('#search-form'),
  containerCards: document.querySelector('.gallery'),
};

refs.formEL.addEventListener('submit', onSubmitBtn);

function onSubmitBtn(evt) {
  evt.preventDefault();
  refs.containerCards.innerHTML = '';
  const valueSearch = evt.target.elements.searchQuery.value;
  console.dir(evt.target.elements.searchQuery);
  if (valueSearch === ' ' || valueSearch === '') {
    return Notify.failure('Enter your search details.');
  }
  serviceSearchImg(valueSearch).then(data => {
    createCards(data.hits);
    // refs.containerCards.innerHTML = createCards(data.hits);
    refs.containerCards.insertAdjacentHTML('beforeend', createCards(data.hits));
  });
}

function createCards(arr) {
  console.log(arr);
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        console.log(webformatURL);
        return `<div class ="photo-card">
        <img src="${webformatURL}" alt="${tags}" width = "" height ="" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes <span class= "item-text">${likes}</span></b>
          </p>
          <p class="info-item">
            <b>Views <span class= "item-text">${views}</span></b>
          </p>
          <p class="info-item">
            <b>Comments <span class= "item-text">${comments}</span></b>
          </p>
          <p class="info-item">
            <b>Downloads <span class= "item-text">${downloads}</span></b>
          </p>
        </div>
        </div>`;
      }
    )
    .join('');
}
