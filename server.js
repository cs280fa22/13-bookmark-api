import app from "./src/index.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Bookmark API at http://localhost:${PORT}/`);
});
