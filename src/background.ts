//https://developer.chrome.com/docs/extensions/mv3/service_workers/
function polling() {
  console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();
const bookmarkLetUrl = chrome.runtime.getURL('resources/bookmarklet/index.json');
(async ()=>{
const a = await import(bookmarkLetUrl);
})();