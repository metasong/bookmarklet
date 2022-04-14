import { Omnibox } from "./lib/omnibox";

//https://developer.chrome.com/docs/extensions/mv3/service_workers/
function polling() {
  console.log("polling");
  
  // setTimeout(polling, 1000 * 30);
}
const omnibox = new Omnibox();

// https://developer.chrome.com/docs/extensions/mv3/messaging/
let wandPort: chrome.runtime.Port | null = null;  
chrome.runtime.onConnect.addListener(function(port) {
  if(port.name === "wand") {
    wandPort = port;
    omnibox.port = port;
    // port.onMessage.addListener(function(msg) {
    //   if (msg.joke === "Knock knock")
    //     port.postMessage({question: "Who's there?"});
    //   else if (msg.answer === "Madame")
    //     port.postMessage({question: "Madame who?"});
    //   else if (msg.answer === "Madame... Bovary")
    //     port.postMessage({question: "I don't get it."});
    // });

  }

});

polling();
