import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import BookmarkDAO from "../../src/data/BookmarkDAO";
import { faker } from "@faker-js/faker";
import Bookmark from "../../src/model/Bookmark";

describe("Test BookmarkDAO", () => {
  const numBookmarks = 5;
  let bookmarks;
  let bookmarkDao;

  beforeAll(() => {
    bookmarks = [];
    for (let index = 0; index < numBookmarks; index++) {
      bookmarks.push(
        new Bookmark(faker.lorem.sentence(), faker.internet.url())
      );
    }
  });

  beforeEach(() => {
    bookmarkDao = new BookmarkDAO();
  });

  it("test constructor()", () => {
    expect(bookmarkDao.bookmarks.length).toBe(0);
  });

  it("test create()", () => {
    const title = faker.lorem.sentence();
    const url = faker.internet.url();
    const bookmark = bookmarkDao.create({ title, url });
    expect(bookmarkDao.bookmarks.length).toBe(1);
    expect(bookmark.title).toBe(title);
    expect(bookmark.url).toBe(url);
    expect(bookmark.id).toBeDefined();
    expect(bookmarkDao.bookmarks[0]).toMatchObject(bookmark);
  });

  it("test readAll()", () => {
    bookmarkDao.bookmarks = bookmarks.map(b => b);
    expect(bookmarkDao.readAll().length).toBe(bookmarks.length);
  });

  it("test read() given valid ID", () => {
    bookmarkDao.bookmarks = bookmarks.map(b => b);
    const bookmark = bookmarks[0];
    expect(bookmarkDao.read(bookmark.id)).toMatchObject(bookmark);
  });

  it("test read() given invalid ID", () => {
    bookmarkDao.bookmarks = bookmarks.map(b => b);
    expect(bookmarkDao.read("invalid_id")).toBeUndefined();
  });

  it("test update() given valid ID", () => {
    bookmarkDao.bookmarks = bookmarks.map(b => b);
    const bookmark = bookmarks[0];
    expect(
      bookmarkDao.update({
        id: bookmark.id,
        title: "updated title",
        url: "update url",
      })
    ).toMatchObject({
      id: bookmark.id,
      title: "updated title",
      url: "update url",
    });
  });

  it("test update() given invalid ID", () => {
    bookmarkDao.bookmarks = bookmarks.map(b => b);
    expect(bookmarkDao.update({ id: "invalid_id" })).toBeUndefined();
  });

  it("test delete() given valid ID", () => {
    bookmarkDao.bookmarks = bookmarks.map(b => b);
    const toDelete = bookmarks[0];
    const bookmark = bookmarkDao.delete(toDelete.id);
    expect(toDelete).toMatchObject(bookmark);
    expect(bookmarkDao.bookmarks.length).toBe(numBookmarks - 1);
  });

  it("test delete() given invalid ID", () => {
    bookmarkDao.bookmarks = bookmarks.map(b => b);
    const bookmark = bookmarkDao.delete("invalid_id");
    expect(bookmark).toBeUndefined();
    expect(bookmarkDao.bookmarks.length).toBe(numBookmarks);
  });
});
