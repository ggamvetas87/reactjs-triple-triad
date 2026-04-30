import useDetectDevice from "@/hooks/useDetectDevice";
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
  const device = useDetectDevice();
  
  const isMobile = device === "mobile";
  const CARD_OFFSET = isMobile ? 65 : 100;
  let value = 0;

  return (
    <div className={`hand hand-${player} ${!isActive ? "disabled" : ""}`}>
      {cards.map((card, index) => {
        if (index > 0) {
          value = index * CARD_OFFSET; // Increment top / left position for each card after the first (for visual stacking)
        }

        return (
          <button
            key={card.id}
            className={`card playerhand ${selectedCard?.id === card.id ? "selected" : ""}`}
            onClick={() => isActive && onSelect(card)}
            style={{
              top: isMobile ? undefined : `${value}px`,
              left: isMobile ? `${value}px` : undefined,
              backgroundImage: `url(${card.image})`
            }}
            title={`${card.name} - Level ${card.level}`}
          >
            {/* Cursor */}
            {selectedCard?.id === card.id && (
              <img className={`card-cursor ${player}`} 
                src={`${import.meta.env.BASE_URL}/assets/cursor.png`} 
                alt="cursor" />
            )}
          </button>
        );
      })}
    </div>
  );
}
