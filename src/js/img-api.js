import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

async function serviceSearchImg(valueSearch) {
  const params = new URLSearchParams({
    key: '39204172-43f1bb7905ec0f3758e1627d0',
    q: `${valueSearch}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });
  try {
    const response = await axios.get(`?${params}`);
    if (response.data.total === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return response.data;
  } catch (error) {
    Notify.failure(error.message);
  }
}

export { serviceSearchImg };
