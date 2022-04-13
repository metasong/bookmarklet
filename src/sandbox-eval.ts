export class SandboxEval {
  private sandbox = document.createElement('iframe');
  private resolve: ((value?: unknown) => void )| null = null;

  constructor() {
    // console.log("Eval constructor");
    this.init();
  }

  init() {  
    this.sandbox.setAttribute('style', 'display:none;');
    this.sandbox.setAttribute('src', 'sandbox.html');
    document.body.appendChild(this.sandbox);

    this.evalAsync = this.evalAsync.bind(this);

    // receive message from sandbox.js
    window.addEventListener('message', event => {
      if (event.source === this.sandbox.contentWindow) {
        // console.log(event.data);
        if(event.data.result) {
          // parse to object but with function as string: (javascript:(...)())
          this.resolve?.(JSON.parse(event.data.result));
        }
      }
    });

  }

  evalAsync(code: string, context?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.sandbox!.contentWindow!.postMessage({code}, "*");
        this.resolve = resolve;
        // resolve(eval(code));
      } catch (e) {
        reject(e);
      }
    });
  }

}