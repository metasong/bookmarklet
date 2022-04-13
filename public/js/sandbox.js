window.addEventListener("message", function (event) {
if (event.data.code) {
    console.log("code received", event.data.code);
    const obj = eval(event.data.code);
    // function to string, we could not postMessage that contains function
    // and on the receiver side we could not eval it back because of security of eval in chrome extension
    // note, return 'func:...' and then parse it with new Function(`return ${value.substr(5)}`)(); also not working because of it use eval instead.
    const result = JSON.stringify(obj, (key, value) =>typeof value === "function" ? `javascript:(${value})()` : value)
    console.info("result: " + result);
    event.source.postMessage({ result }, event.origin);
  }
});
