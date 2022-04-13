import { bookmarkFolderDefault, remoteUrlDefault } from "./const";

export const configDefault =
{
  favoriteColor: "red",
  likesColor: true,
  bookmarkFolder: bookmarkFolderDefault,
  remoteUrl: remoteUrlDefault
}

export type Config = Partial<typeof configDefault>;

export const getConfig = chrome.storage.sync.get.bind(chrome.storage.sync);
export const setConfig = chrome.storage.sync.set.bind(chrome.storage.sync);
