import { board } from "./Board";
import { startScreen } from "./StartScreen";

class Game {
  start(app) {
    startScreen.destroy(app);
    board.create(app);
    console.log(board.gems);
  }
}

export const game = new Game();
