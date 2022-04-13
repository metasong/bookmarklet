//https://stackoverflow.com/questions/12777434/how-to-communicate-with-a-sandboxed-window-in-chrome-packaged-app
export class Eval {
  private sandboxWin = window.open("sandbox.html","SANDBOXED!","height=800,width=500"); 
  constructor() {
    console.log("Eval constructor");
    this.init();
  }

  private resolve: ((value?: unknown) => void )| null = null;
  init() {  
    this.evalAsync = this.evalAsync.bind(this);
    window.addEventListener('message', event => {
      if (event.source === this.sandboxWin) {
        console.log(event.data);
        if(event.data.result) {
          // parse to object but with function as string (javascript:(...)())
          this.resolve?.(JSON.parse(event.data.result));
        }
      }
    });
    let i = 1;
    setInterval(() => {
      this.sandboxWin!.postMessage({heartbeat: i++}, "*");
    }, 50);

  }

  close() {
    this.sandboxWin!.close();
  }


  evalAsync(code: string, context?: any): Promise<any> {

    return new Promise((resolve, reject) => {
      try {
        this.sandboxWin!.postMessage({code}, "*");
        this.resolve = resolve;
        // resolve(eval(code));
      } catch (e) {
        reject(e);
      }
    });
  }

}