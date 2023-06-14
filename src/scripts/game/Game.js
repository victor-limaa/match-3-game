import { Container, Filter, filters } from "pixi.js";
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

    app.ticker.add(this.updateGame);
  }

  updateGame(app) {
    // if (gameOver) {
    //   return;
    // }
    // if (time > 0) {
    //   time -= app.ticker.elapsedMS / 1000;
    //   if (time <= 0) {
    //     time = 0;
    //     // endGame();
    //   }
    // }
    // if (moves >= MAX_MOVES) {
    //   // endGame();
    // }
    // // app.renderer.plugins.interaction.cursorStyles.default = isDragging ? 'grabbing' : 'default';
    // // app.renderer.plugins.interaction.moveWhenInside = true;
    // app.renderer.plugins.interaction.autoPreventDefault = false;
  }

  onGemClick(gem) {
    if (this.selectedGem) {
      const isPossibleToMove = this.checkPossiblesMoves(this.selectedGem, gem);

      if (isPossibleToMove) {
        this.swapGem(this.selectedGem, gem);
        this.selectedGem.gem.scale.set(0.155);

        const isValidMove = this.checkIsValidMove(this.selectedGem, gem);

        setTimeout(() => {
          isValidMove
            ? this.filterMatches(isValidMove)
            : this.swapGem(this.selectedGem, gem);
          this.selectedGem = null;

          this.fillEmptyGaps();
        }, 500);
      } else {
        this.selectedGem.gem.scale.set(0.155);
        this.selectedGem = gem;
        this.selectedGem.gem.scale.set(0.2);
      }
    } else {
      this.selectedGem = gem;
      this.selectedGem.gem.scale.set(0.2);
    }
  }

  checkIsValidMove(currentGem, targetGem) {
    const matches = this.checkMatchGems();
    if (matches.length) {
      const findGem = matches.find(
        (data) => data.gem === currentGem.gem || data.gem === targetGem.gem
      );
      if (findGem) return matches;
      else return false;
    }
    return false;
  }

  swapGem(currentGem, targetGem) {
    const tempX = currentGem.gem.x;
    const tempY = currentGem.gem.y;
    const indexCurrent = this.gems.findIndex(
      (gem) => gem.gem === currentGem.gem
    );
    const indexTarget = this.gems.findIndex((gem) => gem.gem === targetGem.gem);

    currentGem.gem.x = targetGem.gem.x;
    currentGem.gem.y = targetGem.gem.y;
    targetGem.gem.x = tempX;
    targetGem.gem.y = tempY;

    const tempIndexCurrentGem = this.gems[indexCurrent];

    this.gems[indexCurrent] = this.gems[indexTarget];
    this.gems[indexTarget] = tempIndexCurrentGem;
  }

  checkMatchGems() {
    let matches = [];

    for (let y = 0; y < board.size; y++) {
      let matchCount = 1;
      for (let x = 0; x < board.size; x++) {
        const currentGem = this.gems[x * board.size + y];
        const nextXGem = this.gems[x * board.size + board.size + y];

        if (currentGem?.type === nextXGem?.type) {
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
        const nextYGem = this.gems[x * board.size + y + 1];

        if (currentGem?.type === nextYGem?.type) {
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
      const index = this.gems.findIndex((gem) => gem.gem === gemData.gem);
      // this.gems.splice(index, 1);
      this.gems[index] = { gem: null, type: null };
      board.container.removeChild(gemData.gem);
    });
  }

  fillEmptyGaps() {
    setTimeout(() => {
      this.fallDownGemsInnerBoard();
    }, 1500);

    setTimeout(() => {
      for (let x = 0; x < board.size; x++) {
        for (let y = 0; y < board.size; y++) {
          const current = this.gems[x * board.size + y];
          if (current.gem === null) {
            const newGem = new Gem({ x, y });
            newGem.create(board.container);
            this.gems[x * board.size + y] = {
              gem: newGem.sprite,
              type: newGem.type,
            };
          }
        }
      }
    }, 3000);
  }

  fallDownGemsInnerBoard() {
    for (let x = 0; x < board.size; x++) {
      let hasGemY = [];
      for (let y = 0; y < board.size; y++) {
        const current = this.gems[x * board.size + y];
        if (current.gem === null) {
          hasGemY.length &&
            hasGemY.forEach((gem) => {
              gem.gem.y = gem.gem.y + GEM_SIZE;
            });
        } else {
          hasGemY.push(current);
        }
      }

      for (let y = board.size - 1; y >= 0; y--) {
        const current = this.gems[x * board.size + y];
        if (current.gem === null) {
          for (let i = 0; i <= y; i++) {
            const currentGem = this.gems[x * board.size + i];
            const nextGem = this.gems[x * board.size + i + 1];

            if (currentGem.gem && !nextGem.gem) {
              this.gems[x * board.size + i + 1] = currentGem;
              this.gems[x * board.size + i] = { gem: null, type: null };
            }
          }
        }
      }

      hasGemY = [];
    }
  }

  checkPossiblesMoves(currentGem, targetGem) {
    const currentGemIndex = this.gems.findIndex(
      (data) => data.gem === currentGem.gem
    );
    const targetGemIndex = this.gems.findIndex(
      (data) => data.gem === targetGem.gem
    );
    if (
      targetGemIndex === currentGemIndex + 1 ||
      targetGemIndex === currentGemIndex - 1 ||
      targetGemIndex === currentGemIndex + board.size ||
      targetGemIndex === currentGemIndex - board.size
    ) {
      return true;
    } else {
      return false;
    }
  }
}

export const game = new Game();
