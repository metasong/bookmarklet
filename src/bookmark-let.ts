import { bookmarkBarId } from "./const"
import { SandboxEval } from "./lib/sandbox-eval";
// put it out out of the class, otherwise it will be created every time (3 times) with the popup.tsx
const sandboxEval = new SandboxEval();

export class BookmarkLet {

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

    const bookmarkLetUrl = url || chrome.runtime.getURL('resources/bookmarklet/index.js')
    let resp = await fetch(bookmarkLetUrl);
    if (!resp.ok) throw new Error('can not load the file. is the url right?');

    const text = await resp.text();
    const { bookmarkLet } = await sandboxEval.evalAsync(text);

    // console.log(bookmarkLet);
    for (const [key, value] of Object.entries(bookmarkLet as Record<string, any>)) {
      await chrome.bookmarks.create({ parentId: bookmarkFolder.id, title: key, url: `${value}` })
    }
  }

  async update(oldFolder: string | undefined, folder: string, url?: string) {
    await this.remove(oldFolder);
    await this.add(folder, url);
  }
}