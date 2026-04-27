export type Player = "p1" | "p2";

export type CardType = {
  id: number;
  name: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
  owner: Player;
  image: string;
  element?: string | null;
  level: number;
};

export type BoardCell = CardType | null;
