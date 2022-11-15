import express from "express";
import BookmarkDAO from "../data/BookmarkDAO.js";

const router = express.Router();
export const bookmarkDao = new BookmarkDAO();

router.get("/bookmarks", (req, res) => {
  const { title, url } = req.query;
  const bookmarks = bookmarkDao.readAll({ title, url });
  res.json({
    status: 200,
    message: `Successfully retrieved ${bookmarks.length} bookmarks!`,
    data: bookmarks,
  });
});

router.get("/bookmarks/:id", (req, res) => {
  const { id } = req.params;
  const bookmark = bookmarkDao.read(id);
  res.json({
    status: 200,
    message: `Successfully retrieved the following bookmark!`,
    data: bookmark,
  });
});

router.post("/bookmarks", (req, res) => {
  const { title, url } = req.body;
  const bookmark = bookmarkDao.create({ title, url });
  res.status(201).json({
    status: 201,
    message: `Successfully created the following bookmark!`,
    data: bookmark,
  });
});

router.put("/bookmarks/:id", (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;
  const bookmarks = bookmarkDao.update({ id, title, url });
  res.json({
    status: 200,
    message: `Successfully updated the following bookmark!`,
    data: bookmarks,
  });
});

router.delete("/bookmarks/:id", (req, res) => {
  const { id } = req.params;
  const bookmark = bookmarkDao.delete(id);
  res.json({
    status: 200,
    message: `Successfully deleted the following bookmark!`,
    data: bookmark,
  });
});

export default router;
