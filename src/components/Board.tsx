import { AnimatePresence, motion } from "framer-motion";
import type { CardType } from "@/types/game";
import Card from "@/components/Card";

type Props = {
  board: (CardType | null)[];
  onPlace: (index: number) => void;
  hasSelectedCard?: boolean;
};

export default function Board({
  board,
  onPlace,
  hasSelectedCard = false,
}: Props) {
  return (
    <div className="board">
      {board.map((cell, i) => {
        const isSelectable = !cell && hasSelectedCard;

        return (
          <div
            key={i}
            className={`cell ${isSelectable ? "selectable" : ""}`}
            onClick={() => onPlace(i)}
          >
            <AnimatePresence mode="wait">
                {cell && (
                    <motion.div
                        key={cell.id}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card card={cell} />
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
