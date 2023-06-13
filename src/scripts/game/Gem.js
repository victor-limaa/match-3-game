import { Sprite, Texture } from "pixi.js";

const MAX_GEM_TYPES = 5;
const GEM_SIZE = 80;

export class Gem {
  constructor(app, { x, y }) {
    this.position = {
      x,
      y,
    };
    this.app = app;
  }

  create() {
    const gem = new Sprite();
    const gemType = Math.floor(Math.random() * MAX_GEM_TYPES);
    gem.texture = Texture.from(`assets/gems/Gems_${gemType}.png`);
    gem.width = GEM_SIZE;
    gem.height = GEM_SIZE;
    gem.position.set(this.position.x * GEM_SIZE, this.position.y * GEM_SIZE);
    gem.interactive = true;
    gem.buttonMode = true;
    gem.on("pointerdown", this.onGemClick);
    gem.on("pointerup", this.onGemRelease);
    gem.on("pointerupoutside", this.onGemRelease);
    gem.on("pointermove", this.onGemMove);

    this.type = gemType;
    this.sprite = gem;

    this.app.stage.addChild(gem);
  }

  onGemClick() {}

  onGemRelease() {}

  onGemRelease() {}

  onGemMove() {}
}
