# import object defined in js file
1. one preferred way: eval text from js file and get js object, but because browser extension security limitation, we could not directly run `eval`, an official way is using the [sandbox](https://developer.chrome.com/docs/extensions/mv3/sandboxingEval/), [examples](https://github.dev/GoogleChrome/chrome-extensions-samples), and [reference on stackoverflow](https://stackoverflow.com/questions/12777434/how-to-communicate-with-a-sandboxed-window-in-chrome-packaged-app#answer-13098365)

1. another way, not eval js file and directly public json file generated from the js object. during development a plugin [GenerateJsonFromJsPlugin](https://github.com/kelyvin/generate-json-from-js-webpack-plugin), steps:
  1. webpack.common.js: 
  ```js
  plugins: [
    new GenerateJsonFromJsPlugin({
      path: "./public/resources/bookmarklet/index.js",
      filename: "../resources/bookmarklet/index.json",
      data: {
        env: process.env.NODE_ENV, //'production'?
      },
      options: {
        replacer: (key, value) =>
          typeof value === "function" ? `javascript:(${value})()` : value,
      },
    }),
  ],
  ```
  ```js
    const bookmarkLetUrl = url ?? chrome.runtime.getURL('resources/bookmarklet/index.json')
    let resp = await fetch(bookmarkLetUrl);
    if (!resp.ok) throw new Error('can not load the file. is the url right?');
    let { bookmarkLet } = await resp.json();
  ```
  1. in the js file, at the end.
  ```js
  const obj = { bookmarkLet };
  const str = () => JSON.stringify(obj, (key, value) =>typeof value === "function" ? `javascript:(${value})()` : value)
  var module;
  module ? module.exports = data => obj: str();
  ```
  with this at the end, this file could also be used by the first `eval` way, if the module is not defined run `str()`, the `eval` would return the obj from its last expression.
