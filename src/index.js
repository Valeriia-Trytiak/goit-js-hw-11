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
        return `<img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>`;
      }
    )
    .join('');
}
