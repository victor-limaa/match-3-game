import * as PIXI from "pixi.js";

class Application {
  run() {
    this.app = new PIXI.Application({ width: 640, height: 640 });
    document.body.appendChild(this.app.view);
  }
}

export const App = new Application();
