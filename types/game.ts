export interface Dice {
  value: number;
  position: {
    row: number;
    col: number;
  } | null;
}

export interface Dices {
  dice1: Dice;
  dice2: Dice;
}

export type Grid = Array<Array<string>>;
