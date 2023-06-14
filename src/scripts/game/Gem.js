import { Sprite, Texture } from "pixi.js";

const MAX_GEM_TYPES = 5;
const GEM_SIZE = 80;

export class Gem {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
  }

  create(container) {
    const gem = new Sprite();
    const gemType = Math.floor(Math.random() * MAX_GEM_TYPES);
    gem.texture = Texture.from(`assets/gems/Gems_${gemType}.png`);
    gem.width = GEM_SIZE;
    gem.height = GEM_SIZE;
    gem.anchor.set(0.5);
    gem.position.set(
      this.position.x * GEM_SIZE + GEM_SIZE / 2,
      this.position.y * GEM_SIZE + GEM_SIZE / 2
    );
    gem.interactive = true;
    gem.buttonMode = true;

    this.type = gemType;
    this.sprite = gem;

    gem.on("pointerdown", () =>
      container.emit("gem-pointer-down", { gem: gem, type: gemType })
    );
    gem.on("pointerup", () => container.emit("gem-pointer-up"));
    gem.on("pointerupoutside", () => container.emit("gem-pointer-up-outside"));
    gem.on("pointermove", () => container.emit("gem-pointer-move"));

    container.addChild(gem);
  }

  fallDown() {}

  onGemRelease() {}

  onGemRelease() {}

  onGemMove() {}
}
