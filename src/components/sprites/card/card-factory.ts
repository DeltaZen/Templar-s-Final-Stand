import { GameManager } from "../../../managers/game-manager";
import { AttackDirection } from "../../../types/character";
import { randomPick } from "../../../utils/random-utils";
import { BaseCard } from "./base-card";
import { EnemyCard } from "./enemy-card";
import { ItemCard, ItemCardProps } from "./item-card";
import { TemplarCard } from "./templar-card";

import { CardType } from "./type";

type CreateCardProps = {
  type: CardType;
  x: number;
  y: number;
};

type ItemSetProps = Pick<ItemCardProps, "buff" | "duration" | "weight">;

export class CardFactory {
  static createCard(x: number, y: number): BaseCard {
    const { moveCount } = GameManager.getInstance();
    const isSpawnEnemy = moveCount % 13 === 0 || moveCount % 2 === 0;
    if (isSpawnEnemy) {
      return CardFactory.factory({
        type: CardType.ENEMY,
        x,
        y,
      });
    } else {
      const picked = randomPick([CardType.SHIELD]);
      return CardFactory.factory({
        type: picked,
        x,
        y,
      });
    }
  }

  static factory({ type, x, y }: CreateCardProps): BaseCard {
    const gm = GameManager.getInstance();
    const factor = gm.level + 1;
    console.log("factor", factor);
    switch (type) {
      case CardType.TEMPLAR:
        return new TemplarCard({ x, y });
      case CardType.ENEMY:
        if (gm.reusableEnemyCards.length > 2) {
          const card = gm.reusableEnemyCards.shift()!;
          card.reset();
          card.x = x;
          card.y = y;
          return card;
        }
        return new EnemyCard({ x, y });
      case CardType.WEAPON:
        return new ItemCard({
          type,
          x,
          y,
          ...CardFactory.randomPickWeapon(),
        });
      case CardType.SHIELD:
        return new ItemCard({
          type,
          x,
          y,
          buff: {
            shield: 1 * factor,
          },
          duration: 2,
          weight: 1,
        });
      default:
        throw new Error(`Invalid card type: ${type}`);
    }
  }

  private static randomPickWeapon(): ItemSetProps {
    const gm = GameManager.getInstance();
    const factor = gm.level + 1;
    const weaponSet: ItemSetProps[] = [
      {
        buff: { attack: 2 * factor, criticalRate: -0.1 },
        duration: 2,
        weight: 2,
      }, // Sword
      {
        buff: { attack: 1 * factor, criticalRate: 0.2 },
        duration: 2,
        weight: 1,
      }, // Dagger
      {
        buff: { hitRate: 0.1, criticalRate: -0.1 },
        duration: 4,
        weight: 2,
      },
      { buff: { attack: 3 * factor, hitRate: -0.3 }, duration: 3, weight: 3 }, // Axe
      {
        buff: {
          attack: 1 * factor,
          attackDirection:
            Math.random() > 0.5 ? AttackDirection.AROUND : AttackDirection.LINE,
        },
        duration: 3,
        weight: 4,
      }, // Bow
    ];
    return randomPick(weaponSet);
  }
}
