import Bookmark from "../model/Bookmark.js";
import ApiError from "../model/ApiError.js";
import { z } from "zod";
import mongoose from "mongoose";

const validObjectId = z.string().refine((id) => mongoose.isValidObjectId(id), {
  message: "Invalid ID!",
});

class BookmarkDAO {
  // return the created bookmark
  // throws ApiError when title or url are invalid
  async create({ title, url }) {
    try {
      const bookmark = await Bookmark.create({ title, url });
      return bookmark;
    } catch (err) {
      throw new ApiError(400, err.message);
    }
  }

  // return all bookmarks
  async readAll({ title, url }) {
    const filter = {};
    if (title) {
      filter.title = title;
    }

    if (url) {
      filter.url = url;
    }

    const bookmarks = await Bookmark.find(filter);
    return bookmarks;
  }

  // return the bookmark with the given id
  // return null if resource does not exist in our database
  // throws ApiError if id is invalid
  async read(id) {
    try {
      validObjectId.parse(id);
      const bookmark = await Bookmark.findById(id);
      return bookmark;
    } catch (err) {
      throw new ApiError(400, err.message);
    }
  }

  // return the updated bookmark
  // return null if resource does not exist in our database
  // throws ApiError if id is invalid
  async update({ id, title, url }) {
    try {
      validObjectId.parse(id);
      const bookmark = await Bookmark.findByIdAndUpdate(
        id,
        { title, url },
        { new: true, runValidators: true }
      );
      return bookmark;
    } catch (err) {
      throw new ApiError(400, err.message);
    }
  }

  // return the deleted bookmark
  // return null if resource does not exist in our database
  // throws ApiError if id is invalid
  async delete(id) {
    try {
      validObjectId.parse(id);
      const bookmark = await Bookmark.findByIdAndDelete(id);
      return bookmark;
    } catch (err) {
      throw new ApiError(400, err.message);
    }
  }

  async deleteAll() {
    await Bookmark.deleteMany({});
  }
}

export default BookmarkDAO;
