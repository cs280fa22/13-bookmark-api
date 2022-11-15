import { v4 as uuidv4 } from "uuid";

class Bookmark {
  // pre: title is a non-empty string
  //      and url is a valid url
  constructor(title, url) {
    this.id = uuidv4();
    this.title = title;
    this.url = url;
  }
}

export default Bookmark;
