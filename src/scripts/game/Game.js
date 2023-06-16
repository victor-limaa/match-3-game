import { Container } from "pixi.js";
import { board } from "./Board";
import { startScreen } from "./StartScreen";
import { Gem } from "./Gem";
import { App } from "../system/App";

const MAX_TIME = 30;
const MATCH_THRESHOLD = 3;
const GEM_SIZE = 80;
const MAX_SCORE = 60;

class Game {
  constructor() {
    this.container = new Container();
    this.gems = [];
    this.selectedGem = null;
    this.targetGem = null;
    this.isDragging = false;
    this.score = 0;
    this.time = MAX_TIME;
    this.interval = null;
    this.gameOver = true;
    this.isFillingBoard = false;

    board.container.on("gem-pointer-down", this.onGemClick.bind(this));
    board.container.on("gem-pointer-enter", this.onGemPointerEnter.bind(this));
    board.container.on("gem-pointer-up", this.onGemRelease.bind(this));
    board.container.on("gem-pointer-move", this.onGemMove.bind(this));
  }

  start() {
    startScreen.destroy();
    board.create();
    this.gems = board.gems;
    this.clearMatchWhenStart();

    App.app.stage.addChild(this.container);

    this.gameOver = false;
    App.app.ticker.start();
    App.app.ticker.add(() => this.updateGame());

    this.interval = setInterval(() => {
      this.time -= 1;
    }, 1000);
  }

  reset() {
    this.gems.forEach((gemData) => {
      board.container.removeChild(gemData.gem);
    });

    this.gems = [];
    this.selectedGem = null;
    this.isDragging = false;
    this.score = 0;
    this.time = MAX_TIME;
    this.gameOver = true;

    this.start();
  }

  updateGame() {
    if (this.gameOver) {
      return;
    }

    if (this.time <= 0) {
      this.endGame(App.app);
    }

    if (this.score >= MAX_SCORE) {
      this.endGame(App.app);
    }

    App.app.renderer.plugins.interaction.cursorStyles.default = this.isDragging
      ? "grabbing"
      : "default";

    App.app.renderer.plugins.interaction.moveWhenInside = true;
    App.app.renderer.plugins.interaction.autoPreventDefault = false;
  }

  endGame() {
    App.app.ticker.stop();
    App.app.ticker.remove(this.updateGame);
    clearInterval(this.interval);
    this.gameOver = true;
    window.confirm(
      `Fim de jogo! \nSua pontuação é: ${this.score} \nDeseja reiniciar?`
    )
      ? this.reset(App.app)
      : null;
  }

  onGemPointerEnter(gem) {}

  onGemClick(gem) {
    if (this.isDragging || this.gameOver || this.isFillingBoard) {
      return;
    }

    if (this.selectedGem) {
      this.targetGem = gem;
    } else {
      this.selectedGem = gem;
      this.selectedGem.gem.scale.set(0.2);
      this.selectedGemPreviousPosition = {
        x: gem.gem.x,
        y: gem.gem.y,
      };

      board.container.addChild(this.selectedGem.gem);
    }

    this.isDragging = true;
  }

  onGemRelease() {
    if (!this.isDragging || this.gameOver) {
      return;
    }

    this.isDragging = false;

    const tempX = this.selectedGem.gem.x;
    const tempY = this.selectedGem.gem.y;
    this.selectedGem.gem.x = this.selectedGemPreviousPosition.x;
    this.selectedGem.gem.y = this.selectedGemPreviousPosition.y;

    if (!this.targetGem) this.targetGem = this.getGemByPosition(tempX, tempY);

    if (this.targetGem.gem === this.selectedGem.gem) {
      this.targetGem = null;
      return;
    }

    if (this.selectedGem && this.targetGem) {
      const isPossibleToMove = this.checkPossiblesMoves(
        this.selectedGem,
        this.targetGem
      );

      if (isPossibleToMove) {
        this.swapGem(this.selectedGem, this.targetGem);
        this.selectedGem.gem.scale.set(0.155);

        const isValidMove = this.checkIsValidMove(
          this.selectedGem,
          this.targetGem
        );

        setTimeout(() => {
          isValidMove
            ? this.filterMatches(isValidMove)
            : this.swapGem(this.selectedGem, this.targetGem);
          this.selectedGem = null;
          this.targetGem = null;
        }, 200);
      } else {
        this.selectedGem.gem.scale.set(0.155);
        this.selectedGem.gem.x = this.selectedGemPreviousPosition.x;
        this.selectedGem.gem.y = this.selectedGemPreviousPosition.y;

        this.selectedGem = this.targetGem;
        this.selectedGemPreviousPosition = {
          x: this.targetGem.gem.x,
          y: this.targetGem.gem.y,
        };
        this.selectedGem.gem.scale.set(0.2);
      }
    }
  }

  onGemMove(event) {
    if (this.isDragging && this.selectedGem) {
      const newPosition = event.data.getLocalPosition(App.app.stage);
      this.selectedGem.gem.x = newPosition.x;
      this.selectedGem.gem.y = newPosition.y;
    }
  }

  getGemByPosition(x, y) {
    for (const gemData of this.gems) {
      if (gemData && gemData.gem.getBounds().contains(x, y)) {
        return gemData;
      }
    }
    return null;
  }

  checkIsValidMove(currentGem, targetGem) {
    const matches = this.checkMatchGems();
    if (matches.length) {
      const findGem = matches.find(
        (data) => data.gem === currentGem.gem || data.gem === targetGem.gem
      );
      if (findGem) return matches;
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

  clearMatchWhenStart() {
    let matches = this.checkMatchGems();

    while (matches.length) {
      this.filterMatches(matches);
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
      matches = this.checkMatchGems();
    }
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
    if (this.isFillingBoard) {
      return;
    }

    if (!this.gameOver) {
      this.score += matches.length;
    }

    matches.forEach((gemData) => {
      const index = this.gems.findIndex((gem) => gem.gem === gemData.gem);
      this.gems[index] = { gem: null, type: null };
      board.container.removeChild(gemData.gem);
    });

    setTimeout(() => {
      this.fillEmptyGaps();
    }, 500);
  }

  fillEmptyGaps() {
    this.isFillingBoard = true;

    this.fallDownGemsInnerBoard();

    for (let x = 0; x < board.size; x++) {
      for (let y = 0; y < board.size; y++) {
        const current = this.gems[x * board.size + y];
        if (current.gem === null) {
          const newGem = new Gem({ x, y: 0 });
          newGem.create(board.container);
          this.gems[x * board.size + y] = {
            gem: newGem.sprite,
            type: newGem.type,
          };

          setTimeout(() => {
            this.gems[x * board.size + y].gem.y = y * GEM_SIZE + GEM_SIZE / 2;
          }, 500);
        }
      }
    }

    setTimeout(() => {
      this.isFillingBoard = false;
      let matches = this.checkMatchGems();
      matches.length ? this.filterMatches(matches) : null;
    }, 600);
  }

  fallDownGemsInnerBoard() {
    for (let x = 0; x < board.size; x++) {
      let hasGemY = [];
      for (let y = 0; y < board.size; y++) {
        const current = this.gems[x * board.size + y];
        if (current?.gem === null) {
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
        if (current?.gem === null) {
          for (let i = 0; i <= y; i++) {
            const currentGem = this.gems[x * board.size + i];
            const nextGem = this.gems[x * board.size + i + 1];

            if (currentGem?.gem && !nextGem.gem) {
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
