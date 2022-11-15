import { describe, it, expect } from "vitest";
import app from "../../src/index.js";
import supertest from "supertest";

const request = new supertest(app);

describe("Test API /bookmarks endpoints", () => {
  it("GET all bookmarks", async () => {
    const response = await request.get("/bookmarks");
    expect(response.status).toBe(200);
  });

  it("POST a bookmark", async () => {});

  it("GET a bookmark given its ID", async () => {});

  it("Update a bookmark given its ID", async () => {});

  it("Delete a bookmark given its ID", async () => {});
});
