const bookmarkLet = {
  "Design Mode 💡": () => {
    document.designMode = document.designMode == "on" ? "off" : "on";
    void 0;
  },

  "Theme (Dark/Light) 💡": () => {
    if (document.documentElement.style.colorScheme == "dark")
      document.documentElement.style.colorScheme = "light";
    else document.documentElement.style.colorScheme = "dark";
  },

  "Layout Highlight 💡": () => {
    let domStyle = document.getElementById("domStylee");
    if (domStyle) {
      document.body.removeChild(domStyle);
      return;
    }
    domStyle = document.createElement("style");
    domStyle.setAttribute("id", "domStylee");
    domStyle.append(
      [
        "* { background-color: rgba(255,0,0,.2) !important; color:#0f0!important;outline:solid #f00 1px!important; }",
      ],
      ["* * { background-color: rgba(0,255,0,.2) !important; }"],
      ["* * * { background-color: rgba(0,0,255,.2) !important; }"],
      ["* * * * { background-color: rgba(255,0,255,.2) !important; }"],
      ["* * * * * { background-color: rgba(0,255,255,.2) !important; }"],
      ["* * * * * * { background-color: rgba(255,255,0,.2) !important; }"],
      ["* * * * * * * { background-color: rgba(255,0,0,.2) !important; }"],
      ["* * * * * * * * { background-color: rgba(0,255,0,.2) !important; }"],
      ["* * * * * * * * * { background-color: rgba(0,0,255,.2) !important; }"]
    );
    document.body.appendChild(domStyle);
  },

  "Color Palette": () => {
    let input_color = document.head.querySelector("input[type=color]");
    if (!input_color) {
      /*<input type="color"*/ input_color = document.createElement("input");
      input_color.setAttribute("type", "color");
      document.head.append(input_color);
    }
    input_color.click();
  },

  "Color Picker": async () => {
    try {
      prompt("Selected HEX color:", (await new EyeDropper().open()).sRGBHex);
    } catch (e) {
      alert(e);
    }
  },
  "Remove Via Click": () => {
    document.body.style.cursor = "pointer";
    let clickHandler = (event) => {
      console.log("removeViaClick: click");
      document.body.style.cursor = "";
      event.preventDefault();
      document.removeEventListener("click", clickHandler);
      let element = document.elementFromPoint(event.clientX, event.clientY);
      if (!element) {
        return;
      }
      console.log("removeViaClick: click", element);
      /*start*/ let positions = ["fixed", "absolute", "sticky"];
      const style = getComputedStyle(element);
      while (
        element &&
        !positions.includes(style.position) &&
        style.zIndex < 100
      ) {
        element = element.parentNode;
      }
      if (element && element.remove) {
        element.remove();
        console.log("removeViaClick: remove", element);
      }
      window.focus();
      window.addEventListener(
        "blur",
        () => {
          setTimeout(() => {
            const iframe = document.activeElement;
            if (iframe.tagName === "IFRAME") {
              element.remove();
              console.log("removeViaClick: remove iframe", iframe);
            }
          });
        },
        { once: true }
      );
      console.log(`removeViaClick: cannot find element to remove`);
      document.documentElement.style.overflow = "auto !important";
      document.body.style.overflow = "auto !important"; /*end*/
    };
    document.addEventListener("click", clickHandler);
  },

  "Document Part URL": () => {
    document.body.style.cursor = "pointer";
    let clickHandler = (event) => {
      document.body.style.cursor = "";
      event.preventDefault();
      document.removeEventListener("click", clickHandler);
      let element = document.elementFromPoint(event.clientX, event.clientY);
      if (!element) {
        return;
      }
      /*start*/ while (element && !element.id) {
        element = element.parentNode;
      }
      if (element && element.id) {
        location.hash = element.id;
      } /*end*/
    };
    document.addEventListener("click", clickHandler);
  },

  UUID: () => {
    prompt("UUID:", self.crypto.randomUUID());
  },

  "QR Code": () => {
    open(
      "https://chart.apis.google.com/chart?cht=qr&chs=300x300&chld=L|2&chl= " +
        /*note: no encodeURIComponent(href)?*/
        (prompt("Enter text for QR code: ", location.href) ??
          (() => {
            throw null;
          })()),
      null,
      "location=no,status=yes,menubar=no,scrollbars=no,resizable=yes,width=500,height=500,modal=yes,dependent=yes"
    );
  },

  "Password (Show/Hide)": () => {
    document
      .querySelectorAll("input[type=password]")
      .forEach((el) => (el.type = "text"));
  },

  Cookies: () => {
    document.cookie = "";
    function hjK(S4p) {
      D3p = /; /g;
      return S4p.replace(D3p, "<br><br>");
    }
    if (document.cookie.length < 1) {
      alert("No cookie from this site!");
    } else {
      with ((na = open("", "", "")).document) {
        write(
          hjK(
            "Cookie for " +
              document.title.link(window.location.href) +
              ", dd. " +
              new Date() +
              "<hr>" +
              document.cookie
          )
        );
        close();
      }
    }
  },

  "Strip Script": () => {
    if (frames.length) {
      alert("Sorry, doesn't work in frames.");
    } else {
      while ((es = document.getElementsByTagName("script")).length) {
        es[0].parentNode.removeChild(es[0]);
      }
      es = document.querySelectorAll("*");
      for (i = 0; i < es.length; ++i) {
        e = es[i];
        for (p in e) {
          if (!p.indexOf("on") && e[p]) {
            e[p] = null;
          }
        }
      }
      document.write(document.documentElement.outerHTML);
      document.close();
      onerror = function () {
        return true;
      };
    }
  },
};

const obj = { bookmarkLet };
const str = () => JSON.stringify(obj, (key, value) =>typeof value === "function" ? `javascript:(${value})()` : value)
var module;
module ? module.exports = data => obj: str();
