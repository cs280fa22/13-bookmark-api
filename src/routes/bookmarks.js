import express from "express";
import BookmarkDAO from "../data/BookmarkDAO.js";

const router = express.Router();
export const bookmarkDao = new BookmarkDAO();

router.get("/bookmarks", async (req, res) => {
  const { title, url } = req.query;
  const bookmarks = await bookmarkDao.readAll({ title, url });
  res.json({
    status: 200,
    message: `Successfully retrieved ${bookmarks.length} bookmarks!`,
    data: bookmarks,
  });
});

router.get("/bookmarks/:id", async (req, res) => {
  const { id } = req.params;
  const bookmark = await bookmarkDao.read(id);
  res.json({
    status: 200,
    message: `Successfully retrieved the following bookmark!`,
    data: bookmark,
  });
});

router.post("/bookmarks", async (req, res) => {
  const { title, url } = req.body;
  const bookmark = await bookmarkDao.create({ title, url });
  res.status(201).json({
    status: 201,
    message: `Successfully created the following bookmark!`,
    data: bookmark,
  });
});

router.put("/bookmarks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;
  const bookmarks = await bookmarkDao.update({ id, title, url });
  res.json({
    status: 200,
    message: `Successfully updated the following bookmark!`,
    data: bookmarks,
  });
});

router.delete("/bookmarks/:id", async (req, res) => {
  const { id } = req.params;
  const bookmark = await bookmarkDao.delete(id);
  res.json({
    status: 200,
    message: `Successfully deleted the following bookmark!`,
    data: bookmark,
  });
});

export default router;
