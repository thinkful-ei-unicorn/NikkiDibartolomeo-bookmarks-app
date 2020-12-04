import $ from 'jquery';
import store from './store.js';
import api from './api.js';
import './index.css';

function initialView() {
  $('main').html(`<section class ='topButton'>
  <div class='box color2'><button type="button" id='newBookmark'>+ New Bookmark</button></div>
  <div class='box color2'><button type="button" id='filterBy'>Filter By</button><br></div>
</section>
<div class='box newBookmarkForm newBookFormColor' ${store.adding? '': `style = 'display: none'`}>
  <form id ='newBookmarkForm'>
      <label for='newBookmarkLink'>Add New Bookmark:</label><br>
      <input type='text' id='newBookmarkLink' name='newBookmarkLink' placeholder='https://samplelink.com' required> <br>
      <label for='bookName'></label><br>
      <input type='text' id='bookName' name='bookName' placeholder='Name of Book' required>
  <br>
  <label for="description">Description:</label><br>
  <textarea name= "Description" id='description' rows="10" cols="25" placeholder="Type your description here"></textarea><br>
  <select name="rating" id="rating" label = "Rating" required>
  <option value ='' disabled selected>Choose a Rating</option>
  <option value="1" >1 Star</option>
  <option value="2" >2 Stars</option>
  <option value="3" >3 Stars</option>
  <option value="4" >4 Stars</option>
  <option value="5" >5 Stars</option>
  </select> 
  <input type="submit" value='submit'>
  </div></form>
  
  <div class='box filterByForm filterFormColor' ${store.filtering? '': `style = 'display: none'`}>
  <form id='starRate'>
Filter Bookmarks: <select name="starRatings" id='rateValue'>
<option value="1" >1 Star</option>
<option value="2" >2 Stars</option>
<option value="3" >3 Stars</option>
<option value="4" >4 Stars</option>
<option value="5" selected="selected">5 Stars</option>
</select>
<br><br>

<input type="submit" value="Submit">
</form>
</div>

<div class='box bookmarksTileColor'>
  <h2>Bookmarks</h2>

   <span id='listOfBookmarks' class="js-bookmark-list"> </span>

</div>

`);
}

function newBookmark() {
  $('main').on('click', '#newBookmark', function (event) {
    event.preventDefault();

    store.adding = true;
    render();

  });
}

function filterBy() {
  $('main').on('click', '#filterBy', function (event) {
    event.preventDefault();

    store.filtering = true;
    render();
  });
}

function deleteBookmark() {
  $('main').on('click', '.delete', function (event) {
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
  $('main').on('click', '.detail', function (event) {
    event.preventDefault();

    let bookmarkId = getBookmarkIdFromElement(event.currentTarget);
    let bookmark = store.findById(bookmarkId);
    
    bookmark.expanded = !bookmark.expanded;
    render();
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
    store.adding = false;
  });
}

const render = function (bookmarksSaved = [...store.store.bookmarks]) {
  initialView();

  const bookmarkListString = generateBookmarkListString(bookmarksSaved);
  $('.js-bookmark-list').html(bookmarkListString);
};

function generateBookmarkElement(bookmark) {
  let bookMarkItem = `<div class='box js-bookmark-item tile' data-item-id='${bookmark.id}' tabindex='0'>
    <div class ='V'>Title: </div>
    <div class ='I'>${bookmark.title}</div>
    <div ${bookmark.expanded === true? '': `style = 'display: none'`}>
      <div class ='B'>Url: </div>
      <div class ='G'><a href="${bookmark.url}">${bookmark.url}</a></div>
      <div class ='Y'>Description: </div>
      <div class ='O'>${bookmark.desc}</div>
    </div>
    <div class ='R'>Rating: ${bookmark.rating}</div>
    <button class='delete'>Delete</button><br>
    <button class='detail'>details</button>
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
