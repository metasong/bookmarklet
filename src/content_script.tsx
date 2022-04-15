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
port.onMessage.addListener(function (msg) {
  // console.log("Receive msg = ", msg);
  if (msg.code) {
    // https://developer.chrome.com/docs/extensions/mv3/mv2-sunset/
    // https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#code-execution
    // https://github.com/Tampermonkey/tampermonkey/issues/644
    // https://github.com/violentmonkey/violentmonkey/issues/505
    // https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions/9517879#answer-9517879
    // problem: scripts are accumulated! seems remove attribute is not working
    // const eventName = "onreset";
    // document.documentElement.setAttribute(eventName, msg.code);
    // document.documentElement.dispatchEvent(new CustomEvent("reset"));
    // document.documentElement.removeAttribute(eventName);
    window.addEventListener(
      "focus",
      () => {
        if (msg.code) {
          navigator.clipboard.writeText(msg.code).then(
            function () {
              console.log("Copied code to clipboard");
            },
            function (err) {
              console.error("Could not copy code to clipboard");
            }
          );
        }
      },
      { once: true }
    );

    // not working
    // var script = document.createElement("script");
    // script.textContent = msg.code;
    // (document.head || document.documentElement).appendChild(script);
    // script.remove();
  }
});
