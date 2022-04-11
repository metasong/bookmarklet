import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import { css } from "@emotion/react";
import { BookmarkLet } from "./bookmark-let";
import { Box, TextField } from "@mui/material";
import { Config, configDefault, getConfig, setConfig } from "./config";
import { remoteUrlDefault } from "./const";

const Popup = () => {
  const [count, setCount] = useState(0);
  const [bookmarkFolder, setBookmarkFolder] = useState<string>("");
  const [remoteUrl, setRemoteUrl] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const bookmarkLet = new BookmarkLet();
  const urlRef = React.createRef<HTMLInputElement>();
  const folderRef = React.createRef<HTMLInputElement>();
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  // useEffect(() => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     setRemoteURL(tabs[0].url);
  //   });
  // }, []);

  useEffect(() => {
    getConfig((items: Config) => {
      setRemoteUrl(items.remoteUrl ?? remoteUrlDefault);
      setBookmarkFolder(items.bookmarkFolder ?? configDefault.bookmarkFolder);
    });
  }, []);

  const update = async () => {
    const remoteUrl = urlRef.current!.value;
    const newFolder = folderRef.current!.value;
    try {
      await bookmarkLet.update(bookmarkFolder, newFolder, remoteUrl);
      setHasError(false);
      setHelperText("");
    } catch (error:any) {
      console.log(error.message);
      setHasError(true);
      setHelperText(error.message);

      return;
    }
    setConfig({ remoteUrl, bookmarkFolder });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      {/* <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
      </ul>
      <Button
        onClick={() => setCount(count + 1)}
        style={{ marginRight: "5px" }}
      >
        count up
      </Button> */}
      <TextField
        inputRef={folderRef}
        style={{ minWidth: "600px" }}
        value={bookmarkFolder}
        onChange={(v) => setBookmarkFolder(v.target.value)}
        label="Bookmarklet Folder on Bookmarks Bar"
      />
      <TextField
        error={hasError}
        helperText={helperText}
        inputRef={urlRef}
        style={{ minWidth: "600px" }}
        defaultValue={remoteUrl}
        multiline
        label="Bookmarklet Remote Url"
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
