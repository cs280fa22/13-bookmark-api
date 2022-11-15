import app from "./src/index.js";
import * as db from "./src/data/db.js";

db.connect(process.env.DB_URI);
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Bookmark API at http://localhost:${PORT}/`);
});
