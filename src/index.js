import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { serviceSearchImg } from './js/img-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEL: document.querySelector('#search-form'),
  containerCards: document.querySelector('.gallery'),
};

let gallery = new SimpleLightbox('.gallery a');

refs.formEL.addEventListener('submit', onSubmitBtn);
refs.containerCards.addEventListener('click', onClickCard);

function onSubmitBtn(evt) {
  evt.preventDefault();
  refs.containerCards.innerHTML = '';
  const valueSearch = evt.target.elements.searchQuery.value;

  if (valueSearch === ' ' || valueSearch === '') {
    return Notify.failure('Enter your search details.');
  }
  serviceSearchImg(valueSearch)
    .then(data => {
      createCards(data.hits);
      refs.containerCards.insertAdjacentHTML(
        'beforeend',
        createCards(data.hits)
      );
    })
    .catch(error => {
      Notify.failure(error.message);
    })
    .finally(() => {
      gallery.refresh();
    });
}

function onClickCard(evt) {
  evt.preventDefault();
  gallery.next();
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
        return `<div class ="photo-card">
       <a class="gallery-link" href="${largeImageURL}"> 
       <img src="${webformatURL}" alt="${tags}" width = "" height ="" loading="lazy" />
       </a>
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
