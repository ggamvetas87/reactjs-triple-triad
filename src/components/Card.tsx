import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CardType } from "@/types/game";

type Props = {
  card: CardType;
  selected?: boolean;
  onClick?: () => void;
};

export default function Card({ 
    card,
    selected = false,
    onClick
}: Props) {
    const previousOwner = useRef(card.owner);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (previousOwner.current !== card.owner) {
            setIsFlipped(true);

            const timer = setTimeout(() => {
                setIsFlipped(false);
                previousOwner.current = card.owner;
            }, 450);

            return () => clearTimeout(timer);
        }
    }, [card.owner]);
  
  return (
    <motion.div
        className={`card ${card.owner} ${selected ? "selected" : ""}`}
        onClick={onClick}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
            opacity: 1,
            scale: 1,
            rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
            duration: 0.45,
            type: "spring",
            stiffness: 180,
        }}
        style={{
            transformStyle: "preserve-3d",
        }}
        data-owner={card.owner}
    >
      <div>{card.top}</div>

      <div className="middle">
        <span>{card.left}</span>
        <div>
          <div
            style={{
              width: 48,
              height: 48,
              margin: "0 auto 8px",
              borderRadius: 8,
              background: `url(${card.image}) no-repeat center/cover`,
            }}
          />
          <strong>{card.name}</strong>
        </div>
        <span>{card.right}</span>
      </div>

      <div>{card.bottom}</div>
    </motion.div>
  );
}
