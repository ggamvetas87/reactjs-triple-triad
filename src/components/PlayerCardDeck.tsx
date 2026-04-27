import type { CardType, Player } from "@/types/game";

type PlayerCardDeckProps = {
  player: Player;
  cards: CardType[];
  isActive: boolean;
  selectedCard: CardType | null;
  onSelect: (card: CardType) => void;
};

export default function PlayerCardDeck({
  player,
  cards,
  isActive,
  onSelect,
  selectedCard
}: PlayerCardDeckProps) {
  const CARD_OFFSET = 100;
  let positionTop = 0;

  return (
    <div className={`hand hand-${player} ${!isActive ? "disabled" : ""}`}>
      {cards.map((card, index) => {
        if (index > 0) {
          positionTop = index * CARD_OFFSET; // Increment top position for each card after the first (for visual stacking)
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
            title={`${card.name} - Level ${card.level}`}
          >
            {/* Cursor */}
            {selectedCard?.id === card.id && (
              <img className={`card-cursor ${player}`} 
                src="/img/cursor.png" 
                alt="cursor" />
            )}
          </button>
        );
      })}
    </div>
  );
}
