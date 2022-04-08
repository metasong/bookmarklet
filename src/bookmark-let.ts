import { Config, configDefault, getConfig } from "./config"
import { bookmarkBarId } from "./const"

export class BookmarkLet {
  constructor() {

  }

  async remove() {
    const config = await getConfig({bookmarkFolder:configDefault.bookmarkFolder}) as Config;
    let bookmarkFolder = (await chrome.bookmarks.getChildren(bookmarkBarId)).filter(
      child => child.title === config.bookmarkFolder
    )[0];

    if (bookmarkFolder) {
      chrome.bookmarks.removeTree(bookmarkFolder.id);
    }

  }

  async add() {
    const config = await getConfig({bookmarkFolder:configDefault.bookmarkFolder}) as Config;

    const bookmarkFolder = await chrome.bookmarks.create({ parentId: bookmarkBarId, index: 0, title: config.bookmarkFolder })

    const bookmarkLetUrl = chrome.runtime.getURL('resources/bookmarklet/index.json')
    let resp = await fetch(bookmarkLetUrl);
    let { bookmarkLet } = await resp.json();
    // console.log(bookmarkLet);
    for (const [key, value] of Object.entries(bookmarkLet as Record<string, string>)) {
      await chrome.bookmarks.create({ parentId: bookmarkFolder.id, title: key, url: value })

    }
  }

  async update()
{
  await this.remove();
  await this.add();
}}