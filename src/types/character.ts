export enum AttackDirection {
  FRONT = "front", // 1 grid
  LINE = "line", // 4 grid
  AROUND = "around", // 4 grid
}
export enum AttackType {
  NORMAL = "normal",
  PENETRATE = "penetrate",
}

export type CharacterProps = {
  health: number;
  shield: number;
  attack: number;
  hitRate: number;
  critical: number;
  attackDirection: AttackDirection;
  attackType: AttackType;
  hitBack: number;
};
export type OptionalCharacterProps = {
  [P in keyof CharacterProps]?: CharacterProps[P];
};
