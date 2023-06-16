import { game } from "./scripts/game/Game";
import { startScreen } from "./scripts/game/StartScreen";
import { App } from "./scripts/system/App";

App.run();

startScreen.create(() => {
  game.start();
});
