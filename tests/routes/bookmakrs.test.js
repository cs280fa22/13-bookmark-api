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

  it("POST a bookmark", async () => {
    const title = faker.lorem.sentence();
    const url = faker.internet.url();
    const response = await request.post("/bookmarks").send({
      title,
      url,
    });
    expect(response.status).toBe(201);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.title).toBe(title);
    expect(response.body.data.url).toBe(url);
  });

  it("GET a bookmark given its ID", async () => {
    const index = Math.floor(Math.random() * numBookmarks);
    const bookmark = bookmarkDao.readAll({})[index];
    const response = await request.get(`/bookmarks/${bookmark.id}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject(bookmark);
  });

  it("Update a bookmark given its ID", async () => {
    const index = Math.floor(Math.random() * numBookmarks);
    const bookmark = bookmarkDao.readAll({})[index];
    const response = await request.put(`/bookmarks/${bookmark.id}`).send({
      title: "Update title",
      url: "Update url",
    });
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(bookmark.id);
    expect(response.body.data.title).toBe("Update title");
    expect(response.body.data.url).toBe("Update url");
  });

  it("Delete a bookmark given its ID", async () => {});
});
