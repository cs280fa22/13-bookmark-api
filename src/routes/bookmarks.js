import express from "express";
import BookmarkDAO from "../data/BookmarkDAO.js";

const router = express.Router();
const bookmarkDao = new BookmarkDAO();

router.get("/bookmarks", (req, res) => {
  const bookmarks = bookmarkDao.readAll();
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

export default router;
