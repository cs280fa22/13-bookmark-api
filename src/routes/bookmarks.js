import express from "express";
import BookmarkDAO from "../data/BookmarkDAO.js";

const router = express.Router();
const bookmarkDao = new BookmarkDAO();

router.get("/bookmarks", (req, res) => {
  const bookmarks = bookmarkDao.readAll();
  res.json({
    status: 200,
    message: `Successfully retrieved ${bookmarks.length} bookmarks!`,
    data: bookmarks
  });
});

export default router;