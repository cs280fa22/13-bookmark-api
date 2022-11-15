import express from "express";
import bookmarks from "./routes/bookmarks.js";
import * as db from "./data/db.js";

db.connect();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Bookmark API!");
});

app.use(bookmarks);

export default app;
