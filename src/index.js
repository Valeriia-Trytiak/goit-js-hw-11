import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { serviceSearchImg } from './js/img-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEL: document.querySelector('#search-form'),
  containerCards: document.querySelector('.gallery'),
  btnLoadMor: document.querySelector('.load-more-hidden'),
};

let gallery = new SimpleLightbox('.gallery a');
let currentPage = 1;
let quantityImg = 0;

refs.formEL.addEventListener('submit', onSubmitBtn);
refs.containerCards.addEventListener('click', onClickCard);
refs.btnLoadMor.addEventListener('click', onClickBtnLoadMor);

function onSubmitBtn(evt) {
  evt.preventDefault();
  refs.containerCards.innerHTML = '';
  refs.btnLoadMor.classList.replace('load-more', 'load-more-hidden');

  const valueSearch = evt.target.elements.searchQuery.value.trim();
  localStorage.setItem('input-value', valueSearch);
  let currentPage = 1;

  if (!valueSearch) {
    return Notify.failure('Enter your search details.');
  }
  serviceSearchImg(currentPage, valueSearch)
    .then(data => {
      quantityImg += data.hits.length;
      createCards(data.hits);
      refs.containerCards.insertAdjacentHTML(
        'beforeend',
        createCards(data.hits)
      );
      if (data.totalHits !== 0) {
        Notify.info(`"Hooray! We found ${data.totalHits} images."`);
      }

      if (data.totalHits > quantityImg) {
        refs.btnLoadMor.classList.replace('load-more-hidden', 'load-more');
      }

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
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

function onClickBtnLoadMor() {
  const inputValue = localStorage.getItem('input-value');
  currentPage += 1;
  serviceSearchImg(currentPage, inputValue)
    .then(data => {
      quantityImg += data.hits.length;
      createCards(data.hits);
      refs.containerCards.insertAdjacentHTML(
        'beforeend',
        createCards(data.hits)
      );
      if (data.totalHits <= quantityImg) {
        refs.btnLoadMor.classList.replace('load-more', 'load-more-hidden');
      }
    })
    .catch(error => {
      Notify.failure(error.message);
    })
    .finally(() => {
      gallery.refresh();
    });
}

function createCards(arr) {
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
       <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
       </a>
    </div>`;
      }
    )
    .join('');
}
