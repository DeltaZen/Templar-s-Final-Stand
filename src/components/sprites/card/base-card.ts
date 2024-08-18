import { GameObject, Sprite, SpriteClass } from "kontra";
import { GRID_SIZE } from "../../../constants/size";

import { COLOR } from "../../../constants/color";
import { CardType } from "./type";
import { tween } from "../../../utils/tween-utils";

type CardProps = {
  type: CardType;
  x: number;
  y: number;
};

enum CardPart {
  BACKGROUND,
  CIRCLE,
}

export abstract class BaseCard extends SpriteClass {
  public type: CardType;
  protected main: Sprite;
  public isActive: boolean = true;

  constructor({ type, x, y }: CardProps) {
    super({
      x,
      y,
      width: GRID_SIZE,
      height: GRID_SIZE,
      anchor: { x: 0.5, y: 0.5 },
    });
    this.type = type;
    this.setScale(0);

    this.main = Sprite({
      width: GRID_SIZE,
      height: GRID_SIZE,
      color: getCardColor(type, CardPart.BACKGROUND),
      anchor: { x: 0.5, y: 0.5 },
    });
    this.addChild(this.main);

    const circle = Sprite({
      radius: 24,
      color: getCardColor(type, CardPart.CIRCLE),
      anchor: { x: 0.5, y: 0.5 },
      y: this.type === CardType.TEMPLAR ? 0 : -20,
    });
    const mainIcon = this.getMainIcon();
    this.main.addChild([circle, mainIcon]);
  }

  protected abstract getMainIcon(): GameObject;

  public moveTo(x: number, y: number) {
    tween(this, { targetX: x, targetY: y }, 200);
  }

  public setInactive() {
    this.setChildrenOpacity(0, 200);
    this.isActive = false;
  }
  public reset() {
    this.setChildrenOpacity(1, 0);
    this.setScale(0);
    this.isActive = true;
    // TODO: Props update
  }

  protected setChildrenOpacity(opacity: number, duration: number) {
    tween(this, { opacity }, duration);
    this.children.forEach((child) => tween(child, { opacity }, duration));
    this.main.children.forEach((child) => tween(child, { opacity }, duration));
  }

  public update(): void {
    // When generating the card
    if (this.scaleX <= 1) {
      this.scaleX += 0.1;
      this.scaleY += 0.1;
      if (this.scaleX > 1) this.setScale(1);
    }
  }

  public render(): void {
    if (this.opacity < 0) return;
    super.render();
  }
}

// Utils
function getCardColor(type: CardType, part: CardPart) {
  switch (type) {
    case CardType.TEMPLAR:
      switch (part) {
        case CardPart.BACKGROUND:
          return COLOR.YELLOW_7;
        case CardPart.CIRCLE:
          return COLOR.YELLOW_6;
      }
    case CardType.WEAPON:
      switch (part) {
        case CardPart.BACKGROUND:
          return COLOR.BLUE_7;
        case CardPart.CIRCLE:
          return COLOR.BLUE_6;
      }
  }
}
