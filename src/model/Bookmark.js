import mongoose from "mongoose";
import { z } from "zod";

const BookmarkSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Each bookmark must have a title"] },
  url: { type: String, required: [true, "Each bookmark must have a URL"] },
});

BookmarkSchema.path("url").validate((url) => {
  try {
    z.string().url().parse(url);
    return true;
  } catch (err) {
    return false;
  }
}, "Invalid URL");

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);

export default Bookmark;
