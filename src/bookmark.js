import $ from 'jquery';
import store from './store.js';
import api from './api.js';

function initialView() {
  $('main').html(`<section class ='topButton'>
  <div class='box color2'><button type="button" id='newBookmark'>+ New Bookmark</button></div>
  <div class='box color2'><button type="button" id='filterBy'>Filter By</button><br></div>
</section>
<div class='box newBookmarkForm color3' style = 'display: none'>
  <form id ='newBookmarkForm'>
      <label for='newBookmarkLink'>Add New Bookmark:</label><br>
      <input type='text' id='newBookmarkLink' name='newBookmarkLink' placeholder='https://samplelink.com' required> <br>
      <label for='bookName'></label><br>
      <input type='text' id='bookName' name='bookName' placeholder='Name of Book' required>
  <br>
  <label for="description">Description:</label><br>
  <textarea name= "Description" id='description' rows="10" cols="30" placeholder="Type your description here"></textarea><br>
  <select name="rating" id="rating" required>
  <option value="1" selected="selected">1 Star</option>
  <option value="2" selected="selected">2 Stars</option>
  <option value="3" selected="selected">3 Stars</option>
  <option value="4" selected="selected">4 Stars</option>
  <option value="5" selected="selected">5 Stars</option>
  </select> 
  <input type="submit" value='submit'>
  </div></form>
  
  <div class='box filterByForm' style = 'display: none'>
  <form id='starRate'>
Filter Bookmarks: <select name="starRatings" id='rateValue'>
<option value="1" selected="selected">1 Star</option>
<option value="2" selected="selected">2 Stars</option>
<option value="3" selected="selected">3 Stars</option>
<option value="4" selected="selected">4 Stars</option>
<option value="5" selected="selected">5 Stars</option>
</select>
<br><br>

<input type="submit" value="Submit">
</form>
</div>

<div class='box'>
  <h2>Bookmarks</h2>

  <div class='box'> <ul id='listOfBookmarks' class="js-bookmark-list"> </ul> </div>

</div>

`);
}

function newBookmark() {
  $('main').on('click', '#newBookmark', function (event) {
    event.preventDefault();

    $('.newBookmarkForm').show();
  });
}

function filterBy() {
  $('main').on('click', '#filterBy', function (event) {
    event.preventDefault();

    $('.filterByForm').show();
  });
}

function deleteBookmark() {
  $('main').on('click', '#delete', function (event) {
    event.preventDefault();

    let bookmarkId = getBookmarkIdFromElement(event.currentTarget);

    api.deleteBookmark(bookmarkId)
      .then(() => {
        store.findAndDelete(bookmarkId);
        render();
      });
  });
}

function expandView() {
  $('main').on('click', '#detail', function (event) {
    event.preventDefault();

    let bookmarkId = getBookmarkIdFromElement(event.currentTarget);
    
    // [] = attribute selector
    $('[data-item-id="'+bookmarkId+'"] .details').toggleClass('hide');
  });
}

function getBookmarkIdFromElement (bookmarkElement) {
  return $(bookmarkElement)

    .closest('.js-bookmark-item')

    .data('item-id');
}

function submitNewBookmark() {
  $('main').on('submit', '#newBookmarkForm', function (event) {
    event.preventDefault();

    let title = $('#bookName').val();
    let url = $('#newBookmarkLink').val();
    let desc = $('#description').val();
    let expanded = false;
    let rating = $('#rating').val();

    let userBookmarkInfo = {title, url, desc, expanded, rating};
    api.createBookmark(userBookmarkInfo).then((bookmarkData) => {
      store.addBookmark(bookmarkData);
      render();
    });
    $('.newBookmarkForm').hide();
  });
}

const render = function (bookmarksSaved = [...store.store.bookmarks]) {
  initialView();

  const bookmarkListString = generateBookmarkListString(bookmarksSaved);
  $('.js-bookmark-list').html(bookmarkListString);
};

function generateBookmarkElement(bookmark) {
  let bookMarkItem = `<div class='box js-bookmark-item' data-item-id='${bookmark.id}' tabindex='0'>
  <div>Title: </div>
  <div>${bookmark.title}</div>
  <div class='details hide'><div>Url: </div>
  <div><a href="${bookmark.url}">${bookmark.url}</a></div>
  <div>Description: </div>
  <div>${bookmark.desc}</div></div>
  <div>Rating: </div>
  <div>${bookmark.rating}</div><button id='delete'>Delete</button><br>
  <button id='detail'>details</button>
  </div>
  `;
  return bookMarkItem;
}

function generateBookmarkListString(bookmark) {
  let bmList = bookmark.map((list) => generateBookmarkElement(list));
  return bmList.join('');
}

function filterBookmarks() {
  $('main').on('submit', '#starRate', function (event) {
    event.preventDefault();
    let starVal = $('#rateValue').val();
    let filteredBookmarks = store.filterByRatings(starVal);


    $('.filterByForm').hide();
    render(filteredBookmarks);
  }); 
}

function bindEventListeners() {
  newBookmark();
  submitNewBookmark();
  filterBookmarks();
  filterBy();
  deleteBookmark();
  expandView();
}

export default {
  render,
  bindEventListeners,
};
