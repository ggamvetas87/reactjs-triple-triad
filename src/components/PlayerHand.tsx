import React from "react";
import type { CardType, Player } from "@/types/game";

type PlayerHandProps = {
  player: Player;
  cards: CardType[];
  isActive: boolean;
  selectedCard: CardType | null;
  onSelect: (card: CardType) => void;
};

export default function PlayerHand({
  player,
  cards,
  isActive,
  onSelect,
  selectedCard
}: PlayerHandProps) {
  let positionTop = 0;

  return (
    <div className={`hand hand-${player} ${!isActive ? "disabled" : ""}`}>
      {cards.map((card, index) => {
        if (index > 0) {
          positionTop += 100; // Increment top position for each card after the first (for visual stacking)
        }

        return (
          <button
            key={card.id}
            className={`card playerhand ${selectedCard?.id === card.id ? "selected" : ""}`}
            onClick={() => isActive && onSelect(card)}
            style={{
              top: `${positionTop}px`,
              backgroundImage: `url(${card.image})`
            }}
            title={card.name}
          />
        );
      })}
    </div>
  );
}
