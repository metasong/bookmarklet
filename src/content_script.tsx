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

var port = chrome.runtime.connect({name: "wand"});
// port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
  // console.log("Receive msg = ", msg);
  if(msg.code) {
    document.documentElement.setAttribute('onreset', decodeURI(msg.code));
    document.documentElement.dispatchEvent(new CustomEvent('reset'));
    document.documentElement.removeAttribute('onreset');
  }
});


