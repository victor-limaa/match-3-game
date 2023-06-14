import { Container } from "pixi.js";
import { board } from "./Board";
import { startScreen } from "./StartScreen";
import { Gem } from "./Gem";

const MAX_TIME = 60;
const MATCH_THRESHOLD = 3;
const GEM_SIZE = 80;

class Game {
  constructor() {
    this.container = new Container();

    this.gems = [];
    this.selectedGem = null;
    this.isDragging = false;
    this.moves = 0;
    this.score = 0;
    this.time = MAX_TIME;
    this.gameOver = false;

    board.container.on("gem-pointer-down", this.onGemClick.bind(this));
  }

  start(app) {
    startScreen.destroy(app);
    board.create(this.container);
    this.gems = board.gems;

    app.stage.addChild(this.container);
  }

  onGemClick(gem) {
    if (this.selectedGem) {
      this.swapGem(this.selectedGem, gem);
      this.selectedGem.gem.scale.set(0.155);
      this.selectedGem = null;
    } else {
      this.selectedGem = gem;
      this.selectedGem.gem.scale.set(0.2);
    }
  }

  swapGem(gem1, gem2) {
    const tempX = gem1.gem.x;
    const tempY = gem1.gem.y;
    const index1 = this.gems.findIndex(
      (gem) => gem.gem == gem1.gem && gem.type == gem1.type
    );
    const index2 = this.gems.findIndex(
      (gem) => gem.gem == gem2.gem && gem.type == gem2.type
    );

    gem1.gem.x = gem2.gem.x;
    gem1.gem.y = gem2.gem.y;
    gem2.gem.x = tempX;
    gem2.gem.y = tempY;

    const tempIndex1Gem = this.gems[index1];

    this.gems[index1] = this.gems[index2];
    this.gems[index2] = tempIndex1Gem;

    const matches = this.checkMatchGems();
    if (matches.length) {
      this.filterMatches(matches);
    }

    setTimeout(() => {
      this.fillEmptyGaps();
    }, 1000);
  }

  checkMatchGems() {
    let matches = [];

    for (let y = 0; y < board.size; y++) {
      let matchCount = 1;
      for (let x = 0; x < board.size; x++) {
        const currentGem = this.gems[x * board.size + y];
        const nextGem = this.gems[x * board.size + board.size + y];

        if (currentGem?.type === nextGem?.type) {
          matchCount++;
        } else {
          if (matchCount >= MATCH_THRESHOLD) {
            for (let i = 0; i < matchCount; i++) {
              matches.push(this.gems[(x - i) * board.size + y]);
            }
          }
          matchCount = 1;
        }
      }
    }

    for (let x = 0; x < board.size; x++) {
      let matchCount = 1;
      for (let y = 0; y < board.size; y++) {
        const currentGem = this.gems[x * board.size + y];
        const nextGem = this.gems[x * board.size + y + 1];

        if (currentGem?.type === nextGem?.type) {
          matchCount++;
        } else {
          if (matchCount >= MATCH_THRESHOLD) {
            for (let i = 0; i < matchCount; i++) {
              matches.push(this.gems[x * board.size + y - i]);
            }
          }
          matchCount = 1;
        }
      }
    }

    return matches;
  }

  filterMatches(matches) {
    matches.forEach((gemData) => {
      const index = this.gems.findIndex(
        (gem) => gem.gem == gemData.gem && gem.type == gemData.type
      );
      // this.gems.splice(index, 1);
      this.gems[index] = { gem: null, type: null };
      board.container.removeChild(gemData.gem);
    });
  }

  fillEmptyGaps() {
    for (let x = 0; x < board.size; x++) {
      for (let y = 0; y < board.size; y++) {
        const current = this.gems[x * board.size + y];
        if (current.gem === null && current.type === null) {
          const newGem = new Gem({ x, y });
          newGem.create(board.container);
          this.gems[x * board.size + y] = {
            gem: newGem.sprite,
            type: newGem.type,
          };
        }
      }
    }
  }
}

export const game = new Game();
