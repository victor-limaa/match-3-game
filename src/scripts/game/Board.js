import { Container } from "pixi.js";
import { Gem } from "./Gem";
import { game } from "./Game";

const BOARD_SIZE = 8;

class Board {
  constructor() {
    this.container = new Container();
    this.size = BOARD_SIZE;
  }

  create() {
    const gems = [];
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const gem = new Gem({ x, y });
        gem.create();
        gems.push({ gem: gem.sprite, type: gem.type });
      }
    }
    this.gems = gems;
    game.container.addChild(this.container);
  }
}

export const board = new Board();
