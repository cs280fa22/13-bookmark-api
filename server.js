import express from "express";
import bookmarks from "./src/routes/bookmarks.js";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Bookmarks API");
});

app.use(bookmarks);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
