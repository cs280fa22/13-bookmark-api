import { expect, test } from "vitest";
import Bookmark from "../../src/model/Bookmark.js";
import { faker } from "@faker-js/faker";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";

dotenv.config();

test("test constructor", async () => {
  db.connect(process.env.DB_TEST_URI);
  const title = faker.lorem.sentence();
  const url = faker.internet.url();
  const bookmark = await Bookmark.create({ title, url });
  expect(bookmark.title).toBe(title);
  expect(bookmark.url).toBe(url);
  expect(bookmark.id).toBeDefined();
  await Bookmark.deleteMany({});
});
