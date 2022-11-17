import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import BookmarkDAO from "../../src/data/BookmarkDAO.js";
import { faker } from "@faker-js/faker";
import Bookmark from "../../src/model/Bookmark.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { bookmarkDao } from "../../src/routes/bookmarks.js";

dotenv.config();

const bookmarkDAO = new BookmarkDAO();

describe("Test BookmarkDAO", () => {
  const numBookmarks = 5;
  let bookmarks;

  beforeAll(async () => {
    db.connect(process.env.DB_TEST_URI);
    await bookmarkDao.deleteAll();
  });

  beforeEach(async () => {
    await bookmarkDAO.deleteAll();
    bookmarks = [];
    for (let index = 0; index < numBookmarks; index++) {
      const bookmark = await Bookmark.create({
        title: faker.lorem.sentence(),
        url: faker.internet.url(),
      });
      bookmarks.push(bookmark);
    }
  });

  it("test create()", async () => {
    const title = faker.lorem.sentence();
    const url = faker.internet.url();
    const _bookmark = await bookmarkDAO.create({ title, url });
    expect(_bookmark.title).toBe(title);
    expect(_bookmark.url).toBe(url);
    expect(_bookmark.id).toBeDefined();
  });

  it("test readAll()", async () => {
    const _bookmarks = await bookmarkDAO.readAll({});
    expect(_bookmarks.length).toBe(bookmarks.length);
  });

  it("test read() given valid ID", async () => {
    const index = Math.floor(Math.random() * numBookmarks);
    const bookmark = bookmarks[index];
    const _bookmark = await bookmarkDAO.read(bookmark.id);
    expect(_bookmark.title).toBe(bookmark.title);
    expect(_bookmark.url).toBe(bookmark.url);
    expect(_bookmark.id).toBe(bookmark.id);
  });

  it("test read() given invalid ID", async () => {
    const _bookmark = await bookmarkDAO.read(
      mongoose.Types.ObjectId().toString()
    );
    expect(_bookmark).toBeNull();
  });

  it("test update() given valid ID", async () => {
    const index = Math.floor(Math.random() * numBookmarks);
    const bookmark = bookmarks[index];
    const _bookmark = await bookmarkDao.update({
      id: bookmark._id,
      title: "updated title",
      url: "update url",
    });

    expect(_bookmark.title).toBe("updated title");
    expect(_bookmark.url).toBe("update url");
    expect(_bookmark.id).toBe(bookmark.id);
  });

  it("test update() given invalid ID", async () => {
    const _bookmark = await bookmarkDAO.update({
      id: mongoose.Types.ObjectId().toString(),
    });
    expect(_bookmark).toBeNull();
  });

  it("test delete() given valid ID", async () => {
    const index = Math.floor(Math.random() * numBookmarks);
    const bookmark = bookmarks[index];
    const _bookmark = await bookmarkDao.delete(bookmark._id);
    expect(_bookmark.title).toBe(bookmark.title);
    expect(_bookmark.url).toBe(bookmark.url);
    expect(_bookmark.id).toBe(bookmark.id);
  });

  it("test delete() given invalid ID", async () => {
    const _bookmark = await bookmarkDAO.delete(mongoose.Types.ObjectId());
    expect(_bookmark).toBeNull();
  });

  afterAll(async () => {
    await bookmarkDao.deleteAll();
  });
});
