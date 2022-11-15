import { expect, test } from "vitest";
import Bookmark from "../../src/model/Bookmark.js";
import { faker } from "@faker-js/faker";

test("test constructor", () => {
  const title = faker.lorem.sentence();
  const url = faker.internet.url();
  const bookmark = new Bookmark(title, url);
  expect(bookmark.title).toBe(title);
  expect(bookmark.url).toBe(url);
  expect(bookmark.id).toBeDefined();
});
