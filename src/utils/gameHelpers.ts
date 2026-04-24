import type { CardType } from "@/types/game";

export function getNeighbors(index: number) {
  const row = Math.floor(index / 3);
  const col = index % 3;

  const neighbors: { index: number; side: keyof CardType; opposite: keyof CardType }[] = [];

  if (row > 0) neighbors.push({ index: index - 3, side: "top", opposite: "bottom" });
  if (row < 2) neighbors.push({ index: index + 3, side: "bottom", opposite: "top" });
  if (col > 0) neighbors.push({ index: index - 1, side: "left", opposite: "right" });
  if (col < 2) neighbors.push({ index: index + 1, side: "right", opposite: "left" });

  return neighbors;
}

export function applyCaptures(board: (CardType | null)[], placedIndex: number, card: CardType) {
  const updated = [...board];
  const neighbors = getNeighbors(placedIndex);

  for (const n of neighbors) {
    const target = updated[n.index];
    if (!target) continue;
    if (target.owner === card.owner) continue;

    if (card[n.side] > target[n.opposite]) {
      updated[n.index] = { ...target, owner: card.owner };
    }
  }

  return updated;
}
