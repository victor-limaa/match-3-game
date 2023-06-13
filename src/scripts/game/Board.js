import { Gem } from "./Gem";

const BOARD_SIZE = 8;

class Board {
  create(app) {
    const gems = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const gem = new Gem(app, { x, y });
        gem.create();
        gems.push({ gem: gem.sprite, type: gem.type });
      }
    }
    this.gems = gems;
  }
}

export const board = new Board();
