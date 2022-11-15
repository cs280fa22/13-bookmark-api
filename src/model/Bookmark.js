import { v4 as uuidv4 } from "uuid";

class Bookmark {
  constructor(title, url) {
    this.id = uuidv4();
    this.title = title;
    this.url = url;
  }
}

export default Bookmark;
