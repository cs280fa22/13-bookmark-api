import { describe, it, expect, beforeEach } from "vitest";
import app from "../../src/index.js";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { bookmarkDao } from "../../src/routes/bookmarks.js";

const request = new supertest(app);

describe("Test API /bookmarks endpoints", () => {
  const numBookmarks = 5;

  beforeEach(() => {
    bookmarkDao.deleteAll();
    for (let index = 0; index < numBookmarks; index++) {
      bookmarkDao.create({
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

  it("POST a bookmark", async () => {});

  it("GET a bookmark given its ID", async () => {
    const index = Math.floor(Math.random() * numBookmarks);
    const bookmark = bookmarkDao.readAll({})[index];
    const response = await request.get(`/bookmarks/${bookmark.id}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject(bookmark);
  });

  it("Update a bookmark given its ID", async () => {});

  it("Delete a bookmark given its ID", async () => {});
});
