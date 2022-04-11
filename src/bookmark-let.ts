import { Config, configDefault, getConfig } from "./config"
import { bookmarkBarId } from "./const"

export class BookmarkLet {

  constructor() {

  }

  async remove(folder?: string) {
    // const config = await getConfig({ bookmarkFolder: configDefault.bookmarkFolder }) as Config;
    let bookmarkFolder = (await chrome.bookmarks.getChildren(bookmarkBarId)).filter(
      child => child.title === folder
    )[0];

    if (bookmarkFolder) {
      chrome.bookmarks.removeTree(bookmarkFolder.id);
    }

  }

  async add(folder: string, url?: string) {
    // const config = await getConfig({ bookmarkFolder: configDefault.bookmarkFolder }) as Config;

    const bookmarkFolder = await chrome.bookmarks.create({ parentId: bookmarkBarId, index: 0, title: folder })

    const bookmarkLetUrl = url ?? chrome.runtime.getURL('resources/bookmarklet/index.json')
    let resp = await fetch(bookmarkLetUrl);
    if(!resp.ok) throw new Error('can not load the file. is the url right?');

    let { bookmarkLet } = await resp.json();
    // console.log(bookmarkLet);
    for (const [key, value] of Object.entries(bookmarkLet as Record<string, string>)) {
      await chrome.bookmarks.create({ parentId: bookmarkFolder.id, title: key, url: value })

    }
  }

  async update(oldFolder: string|undefined, folder:string, url?: string) {
    await this.remove(oldFolder);
    await this.add(folder,url);
  }
}