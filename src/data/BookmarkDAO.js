import Bookmark from "../model/Bookmark.js";

class BookmarkDAO {
  constructor() {
    this.bookmarks = [];
  }

  // return the created bookmark
  create({ title, url }) {
    const bookmark = new Bookmark(title, url);
    this.bookmarks.push(bookmark);
    return bookmark;
  }

  // return all bookmarks
  readAll({ title, url }) {
    let bookmarks = this.bookmarks;

    if (title) {
      bookmarks = bookmarks.filter((bookmark) => bookmark.title === title);
    }

    if (url) {
      bookmarks = bookmarks.filter((bookmark) => bookmark.url === url);
    }

    return bookmarks;
  }

  // return the bookmark with the given id
  // return undefined if id does not exist in our database
  read(id) {
    return this.bookmarks.find((bookmark) => bookmark.id === id);
  }

  // return the updated bookmark
  update({ id, title, url }) {
    const bookmark = this.read(id);
    if (bookmark) {
      title && (bookmark.title = title);
      url && (bookmark.url = url);
    }
    return bookmark;
  }

  // return the deleted bookmark
  delete(id) {
    const index = this.bookmarks.findIndex((bookmark) => bookmark.id === id);
    if (index === -1) {
      return undefined;
    }

    const bookmark = this.bookmarks[index];
    this.bookmarks.splice(index, 1);
    return bookmark;
  }

  deleteAll() {
    this.bookmarks = [];
  }
}

export default BookmarkDAO;
