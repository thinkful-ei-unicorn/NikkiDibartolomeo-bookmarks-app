const store = {
  bookmarks: [
    
  ],
  adding: false,
  error: null,
  filter: 0,
};

function addBookmark(bookmark) {
  this.store.bookmarks.push(bookmark);
}

function filterByRatings(rating) {
  let ratingsFilter = this.store.bookmarks.filter(bookmarksRating => bookmarksRating.rating >= rating);
  return ratingsFilter;
}

function findById(id) {
  let foundBookmark = this.store.bookmarks.find(currentBM => currentBM.id === id);
  return foundBookmark;
}

function findAndDelete(id) {
  this.store.bookmarks = this.store.bookmarks.filter(currentBm => currentBm.id !== id);
}



export default {store, addBookmark, filterByRatings, findById, findAndDelete};
