// communicate with popup.tsx:
// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//   if (msg.color) {
//     console.log("Receive color = " + msg.color);
//     document.body.style.backgroundColor = msg.color;
//     sendResponse("Change color to " + msg.color);
//   } else {
//     sendResponse("Color message is none.");
//   }
// });

var port = chrome.runtime.connect({ name: "wand" });
// port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(async (msg) => {
  // console.log("Receive msg = ", msg);
  if (msg.code) {
    // https://developer.chrome.com/docs/extensions/mv3/mv2-sunset/
    // https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#code-execution
    // https://github.com/Tampermonkey/tampermonkey/issues/644
    // https://github.com/violentmonkey/violentmonkey/issues/505
    // https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions/9517879#answer-9517879
    // problem: scripts are accumulated! seems remove attribute is not working, also may be blocked by security config on page, i.e. google page
    // const eventName = "onreset";
    // document.documentElement.setAttribute(eventName, msg.code);
    // document.documentElement.dispatchEvent(new CustomEvent("reset"));
    // document.documentElement.removeAttribute(eventName);


    /// focus not work, so not work, user have to click the document to focus.
    function copyClipboard(code: string) {
      return new Promise((resolve, reject) => {
        const _asyncCopyFn = async () => {
          try {
            const value = await navigator.clipboard.writeText(code);
            console.log(`${value} is write!`);
            resolve(value);
          } catch (e) {
            reject(e);
          }
          window.removeEventListener("focus", _asyncCopyFn);
        };

        window.addEventListener("focus", _asyncCopyFn);
        console.log(
          "Hit <Tab> to give focus back to document (or we will face a DOMException);"
        );
      });
    }
    // document.documentElement.dispatchEvent(new CustomEvent("focus"));//not work
    await copyClipboard(msg.code);

    // not working, security of v3
    // var script = document.createElement("script");
    // script.textContent = msg.code;
    // (document.head || document.documentElement).appendChild(script);
    // script.remove();
  }
});
