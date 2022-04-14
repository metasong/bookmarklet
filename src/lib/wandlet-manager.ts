import { bookmarkBarId, wandletFolderDefault } from "./const"
import { SandboxEval } from "./sandbox-eval";
import { sleep } from "./sleep";

export class WandletManager {
  private _sandboxEval: SandboxEval | undefined;
  private async sandboxEval() {
    if (this._sandboxEval) return this._sandboxEval;

    this._sandboxEval = new SandboxEval();
    // wait for the iframe to load
    await sleep(50)
    return this._sandboxEval;
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

    const bookmarkLetUrl = url || chrome.runtime.getURL('resources/bookmarklet/index.js')
    let resp = await fetch(bookmarkLetUrl);
    if (!resp.ok) throw new Error('can not load the file. is the url right?');

    const text = await resp.text();
    const sandbox = await this.sandboxEval();
  
    const { bookmarkLet } = await sandbox!.evalAsync(text);

     console.log('bookmarklets: ',bookmarkLet);
    for (const [key, value] of Object.entries(bookmarkLet as Record<string, any>)) {
      await chrome.bookmarks.create({ parentId: bookmarkFolder.id, title: key, url: `${value}` })
    }
  }

  async update(oldFolder: string | undefined, folder: string, url?: string) {
    await this.remove(oldFolder);
    await this.add(folder, url);
  }

  async get(folder = wandletFolderDefault) {
    const bookmarkFolder = (await chrome.bookmarks.getChildren(bookmarkBarId)).filter(
      child => child.title === folder
    )[0];

    if (!bookmarkFolder) {
      return {};
    }

    const bookmarkLet = (await chrome.bookmarks.getChildren(bookmarkFolder.id)).reduce((acc, child) => {
      acc[child.title] = child.url!;
      return acc;
    }, {} as Record<string, string>);

    return bookmarkLet;
  }
}