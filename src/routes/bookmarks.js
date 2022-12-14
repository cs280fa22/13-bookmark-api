import express from "express";
import BookmarkDAO from "../data/BookmarkDAO.js";
import ApiError from "../model/ApiError.js";

const router = express.Router();
export const bookmarkDao = new BookmarkDAO();

router.get("/bookmarks", async (req, res, next) => {
  try {
    const { title, url } = req.query;
    const bookmarks = await bookmarkDao.readAll({ title, url });
    res.json({
      status: 200,
      message: `Successfully retrieved ${bookmarks.length} bookmarks!`,
      data: bookmarks,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/bookmarks/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookmark = await bookmarkDao.read(id);

    if (!bookmark) {
      throw new ApiError(404, "Resource not found!");
    }

    res.json({
      status: 200,
      message: `Successfully retrieved the following bookmark!`,
      data: bookmark,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/bookmarks", async (req, res, next) => {
  try {
    const { title, url } = req.body;
    const bookmark = await bookmarkDao.create({ title, url });
    res.status(201).json({
      status: 201,
      message: `Successfully created the following bookmark!`,
      data: bookmark,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/bookmarks/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, url } = req.body;
    const bookmark = await bookmarkDao.update({ id, title, url });

    if (!bookmark) {
      throw new ApiError(404, "Resource not found!");
    }

    res.json({
      status: 200,
      message: `Successfully updated the following bookmark!`,
      data: bookmark,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/bookmarks/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookmark = await bookmarkDao.delete(id);

    if (!bookmark) {
      throw new ApiError(404, "Resource not found!");
    }

    res.json({
      status: 200,
      message: `Successfully deleted the following bookmark!`,
      data: bookmark,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
