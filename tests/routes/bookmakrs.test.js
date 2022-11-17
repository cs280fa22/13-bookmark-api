import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import app from "../../src/index.js";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { bookmarkDao } from "../../src/routes/bookmarks.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";

dotenv.config();

const request = new supertest(app);

describe("Test API /bookmarks endpoints", () => {
  const numBookmarks = 5;

  beforeAll(async () => {
    db.connect(process.env.DB_TEST_URI);
    await bookmarkDao.deleteAll();
  });

  beforeEach(async () => {
    await bookmarkDao.deleteAll();

    const cutoff = 2;
    for (let index = 0; index < cutoff; index++) {
      await bookmarkDao.create({
        title: "Fake title",
        url: `url-${index}`,
      });
    }

    for (let index = cutoff; index < numBookmarks; index++) {
      await bookmarkDao.create({
        title: faker.lorem.sentence(),
        url: faker.internet.url(),
      });
    }
  });

  it("GET all bookmarks", async () => {
    const response = await request.get("/bookmarks");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(numBookmarks);
  });

  describe("GET with query parameters", async () => {
    it("GET all bookmarks given title", async () => {
      const title = "Fake title";
      const response = await request.get(`/bookmarks?title=${title}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
    });

    it("GET all bookmarks given URL", async () => {
      const url = "url-0";
      const response = await request.get(`/bookmarks?url=${url}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });

  it("POST a bookmark", async () => {
    const title = faker.lorem.sentence();
    const url = faker.internet.url();
    const response = await request.post("/bookmarks").send({
      title,
      url,
    });
    expect(response.status).toBe(201);
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.title).toBe(title);
    expect(response.body.data.url).toBe(url);
  });

  it("GET a bookmark given its ID", async () => {
    const index = Math.floor(Math.random() * numBookmarks);
    const bookmarks = await bookmarkDao.readAll({});
    const bookmark = bookmarks[index];
    const response = await request.get(`/bookmarks/${bookmark.id}`);
    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(bookmark.id);
    expect(response.body.data.title).toBe(bookmark.title);
    expect(response.body.data.url).toBe(bookmark.url);
  });

  it("Update a bookmark given its ID", async () => {
    const index = Math.floor(Math.random() * numBookmarks);
    const bookmarks = await bookmarkDao.readAll({});
    const bookmark = bookmarks[index];
    const response = await request.put(`/bookmarks/${bookmark.id}`).send({
      title: "Update title",
      url: "Update url",
    });
    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(bookmark.id);
    expect(response.body.data.title).toBe("Update title");
    expect(response.body.data.url).toBe("Update url");
  });

  it("Delete a bookmark given its ID", async () => {
    const index = Math.floor(Math.random() * numBookmarks);
    const bookmarks = await bookmarkDao.readAll({});
    const bookmark = bookmarks[index];
    const response = await request.delete(`/bookmarks/${bookmark.id}`);
    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(bookmark.id);
    expect(response.body.data.title).toBe(bookmark.title);
    expect(response.body.data.url).toBe(bookmark.url);
  });

  afterAll(async () => {
    await bookmarkDao.deleteAll();
  });
});
