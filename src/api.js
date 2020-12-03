const BASE_URL = 'https://thinkful-list-api.herokuapp.com/nikki/bookmarks';

const listApiFetch = function (...args) {
  let error;
  return fetch(...args)
    .then((response) => {
      if (!response.ok) {
        error = { code: response.status };

        if (!response.headers.get('Content-Type').includes('json')) {
          error.message = response.statusText;
          return Promise.reject(error);
        }
      }
      return response.json();
    })
    .then((data) => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};

const getBookmark = function () {
  return listApiFetch(BASE_URL, {});
};

const createBookmark = function (bookmark) {
  let newBookmark = JSON.stringify(bookmark);
  return listApiFetch(BASE_URL, {
    method: 'Post',
    headers: { 'Content-Type': 'application/json' },
    body: newBookmark,
  });
};

const updateBookmark = function (id, updateBM) {
  let newData = JSON.stringify(updateBM);

  return listApiFetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: newData,
  });
};

const deleteBookmark = function (id) {
  return listApiFetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
};

export default {
  getBookmark,
  createBookmark,
  updateBookmark,
  deleteBookmark,
};
