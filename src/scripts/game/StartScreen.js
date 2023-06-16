import { Container, Text } from "pixi.js";
import { App } from "../system/App";

class StartScreen {
  create(onStartButtonPress) {
    this.screen = new Container();

    const titleText = new Text("Match-3", {
      fontSize: 48,
      fill: "#fff",
    });
    titleText.anchor.set(0.5);
    titleText.position.set(
      App.app.renderer.width / 2,
      App.app.renderer.height / 2
    );
    this.screen.addChild(titleText);

    const startButton = new Text("start", {
      fontSize: 32,
      fill: "#fff",
      padding: 10,
      backgroundColor: "#ccc",
    });
    startButton.anchor.set(0.5);
    startButton.position.set(
      App.app.renderer.width / 2,
      App.app.renderer.height / 2 + 80
    );
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", onStartButtonPress);
    this.screen.addChild(startButton);

    App.app.stage.addChild(this.screen);
  }

  destroy() {
    App.app.stage.removeChild(this.screen);
  }
}

export const startScreen = new StartScreen();
