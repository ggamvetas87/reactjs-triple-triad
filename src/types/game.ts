export type Player = "p1" | "p2" | "computer";

export type RawCard = {
  id: number;
  name: string;
  ranks: [number, number, number, number]; // [top, left, right, bottom]
  element: string;
  level: number;
};

export type CardType = {
  id: number | string; // Updated to allow string IDs after owner assignment
  name: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
  owner?: Player;
  image: string;
  element?: string | null;
  level: number;
};

export type BoardCell = CardType | null;
