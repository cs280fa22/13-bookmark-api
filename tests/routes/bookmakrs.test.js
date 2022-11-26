import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import app from "../../src/index.js";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { bookmarkDao } from "../../src/routes/bookmarks.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

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
        url: `https://fake-url-${index}.com`,
      });
    }

    for (let index = cutoff; index < numBookmarks; index++) {
      await bookmarkDao.create({
        title: faker.lorem.sentence(),
        url: faker.internet.url(),
      });
    }
  });

  describe("GET bookmarks", () => {
    it("GET all bookmarks", async () => {
      const response = await request.get("/bookmarks");
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(numBookmarks);
    });

    it("GET all bookmarks given title", async () => {
      const title = "Fake title";
      const response = await request.get(`/bookmarks?title=${title}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
    });

    it("GET all bookmarks given URL", async () => {
      const url = "https://fake-url-0.com";
      const response = await request.get(`/bookmarks?url=${url}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe("POST a bookmark", () => {
    it("Valid title and URL", async () => {
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

    it("Empty title", async () => {
      const title = "";
      const url = faker.internet.url();
      const response = await request.post("/bookmarks").send({
        title,
        url,
      });
      expect(response.status).toBe(400);
    });

    it("Null title", async () => {
      const title = null;
      const url = faker.internet.url();
      const response = await request.post("/bookmarks").send({
        title,
        url,
      });
      expect(response.status).toBe(400);
    });

    it("Undefined title", async () => {
      const title = undefined;
      const url = faker.internet.url();
      const response = await request.post("/bookmarks").send({
        title,
        url,
      });
      expect(response.status).toBe(400);
    });

    it("Empty url", async () => {
      const title = faker.lorem.sentence();
      const url = "";
      const response = await request.post("/bookmarks").send({
        title,
        url,
      });
      expect(response.status).toBe(400);
    });

    it("Null url", async () => {
      const title = faker.lorem.sentence();
      const url = null;
      const response = await request.post("/bookmarks").send({
        title,
        url,
      });
      expect(response.status).toBe(400);
    });

    it("undefined url", async () => {
      const title = faker.lorem.sentence();
      const url = undefined;
      const response = await request.post("/bookmarks").send({
        title,
        url,
      });
      expect(response.status).toBe(400);
    });

    it("invalid url", async () => {
      const title = faker.lorem.sentence();
      const url = faker.lorem.sentence();
      const response = await request.post("/bookmarks").send({
        title,
        url,
      });
      expect(response.status).toBe(400);
    });
  });

  describe("GET a bookmark given its ID", () => {
    it("Valid ID", async () => {
      const index = Math.floor(Math.random() * numBookmarks);
      const bookmarks = await bookmarkDao.readAll({});
      const bookmark = bookmarks[index];
      const response = await request.get(`/bookmarks/${bookmark.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(bookmark.id);
      expect(response.body.data.title).toBe(bookmark.title);
      expect(response.body.data.url).toBe(bookmark.url);
    });

    it("Invalid ID", async () => {
      const response = await request.get(
        `/bookmarks/${mongoose.Types.ObjectId().toString()}`
      );
      expect(response.status).toBe(404);
    });
  });

  describe("Update a bookmark given its ID", () => {
    it("Valid ID", async () => {
      const index = Math.floor(Math.random() * numBookmarks);
      const bookmarks = await bookmarkDao.readAll({});
      const bookmark = bookmarks[index];
      const response = await request.put(`/bookmarks/${bookmark.id}`).send({
        title: "Update title",
        url: "https://update-url.com",
      });
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(bookmark.id);
      expect(response.body.data.title).toBe("Update title");
      expect(response.body.data.url).toBe("https://update-url.com");
    });

    it("Invalid ID", async () => {
      const response = await request
        .put(`/bookmarks/${mongoose.Types.ObjectId().toString()}`)
        .send({
          title: "Update title",
          url: "https://update-url.com",
        });
      expect(response.status).toBe(404);
    });
  });

  describe("Delete a bookmark given its ID", () => {
    it("Valid ID", async () => {
      const index = Math.floor(Math.random() * numBookmarks);
      const bookmarks = await bookmarkDao.readAll({});
      const bookmark = bookmarks[index];
      const response = await request.delete(`/bookmarks/${bookmark.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(bookmark.id);
      expect(response.body.data.title).toBe(bookmark.title);
      expect(response.body.data.url).toBe(bookmark.url);
    });

    it("Invalid ID", async () => {
      const response = await request.delete(
        `/bookmarks/${mongoose.Types.ObjectId().toString()}`
      );
      expect(response.status).toBe(404);
    });
  });

  afterAll(async () => {
    await bookmarkDao.deleteAll();
  });
});
