import type { CardType } from "@/types/game";

export const player1Cards: CardType[] = [
  {
    id: 1,
    name: "Ifrit",
    top: 9,
    right: 6,
    bottom: 2,
    left: 8,
    owner: "p1",
    image: "/cards/ifrit.png"
  },
  {
    id: 2,
    name: "Shiva",
    top: 6,
    right: 7,
    bottom: 4,
    left: 9,
    owner: "p1",
    image: "/cards/shiva.png"
  },
  {
    id: 3,
    name: "Quezacotl",
    top: 2,
    right: 9,
    bottom: 9,
    left: 4,
    owner: "p1",
    image: "/cards/quezacotl.png"
  },
];

export const player2Cards: CardType[] = [
  {
    id: 4,
    name: "Bahamut",
    top: 10,
    right: 8,
    bottom: 2,
    left: 6,
    owner: "p2",
    image: "/cards/bahamut.png"
  },
  {
    id: 5,
    name: "Odin",
    top: 8,
    right: 10,
    bottom: 3,
    left: 5,
    owner: "p2",
    image: "/cards/odin.png"
  },
  {
    id: 6,
    name: "Diablos",
    top: 5,
    right: 10,
    bottom: 8,
    left: 3,
    owner: "p2",
    image: "/cards/diablos.png"
  },
];