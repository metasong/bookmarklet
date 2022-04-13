import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import { css } from "@emotion/react";
import { BookmarkLet } from "./lib/bookmark-let";
import { Box, TextField } from "@mui/material";
import { Config, configDefault, getConfig, setConfig } from "./lib/config";
import { bookmarkFolderDefault, remoteUrlDefault } from "./lib/const";

export const Popup = () => {
  // console.log("Popup.render");// why 3 times?
  const [bookmarkFolder, setBookmarkFolder] = useState<string>("");
  const [remoteUrl, setRemoteUrl] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const bookmarkLet = new BookmarkLet();
  const urlRef = React.createRef<HTMLInputElement>();
  const [hasError, setHasError] = useState<boolean>(false);

  // useEffect(() => {
  //   chrome.action.setBadgeText({ text: count.toString() });
  // }, [count]);

  useEffect(() => {
    getConfig((items: Config) => {
      setRemoteUrl(items.remoteUrl ?? remoteUrlDefault);
      setBookmarkFolder(items.bookmarkFolder ?? configDefault.bookmarkFolder);
    });
  }, []);

  const update = async () => {
    const remoteUrl = urlRef.current!.value;
    try {
      const { bookmarkFolder: bookmarkFolderOriginal } = await getConfig({
        bookmarkFolder: bookmarkFolderDefault,
      });
      await bookmarkLet.update(bookmarkFolderOriginal, bookmarkFolder, remoteUrl);
      setHasError(false);
      setHelperText("");
    } catch (error: any) {
      console.log(error.message);
      setHasError(true);
      setHelperText(error.message);
      return;
    }

    await setConfig({ remoteUrl, bookmarkFolder });

    // communicate with content script
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   const tab = tabs[0];
    //   if (tab.id) {
    //     chrome.tabs.sendMessage(
    //       tab.id,
    //       {
    //         color: "#555555",
    //       },
    //       (msg) => {
    //         console.log("result message:", msg);
    //       }
    //     );
    //   }
    // });

  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        style={{ minWidth: "600px" }}
        value={bookmarkFolder}
        onChange={(v) => setBookmarkFolder(v.target.value)}
        label="Wandlets Folder on Bookmarks(Favorites) Bar"
      />
      <TextField
        error={hasError}
        helperText={helperText}
        inputRef={urlRef}
        style={{ minWidth: "600px" }}
        defaultValue={remoteUrl}
        multiline
        label="Wandlets Url"
      />
      <Button onClick={update}>Update</Button>
    </Box>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
