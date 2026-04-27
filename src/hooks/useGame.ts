import { useMemo, useState } from "react";
import { player1Cards, player2Cards } from "@/data/cards";
import type { CardType, Player } from "@/types/game";
import { applyCaptures } from "@/utils/gameHelpers";

export function useGame() {
  const [board, setBoard] = useState<(CardType | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>("p1");
  const [p1Hand, setP1Hand] = useState<CardType[]>(player1Cards);
  const [p2Hand, setP2Hand] = useState<CardType[]>(player2Cards);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const currentHand = turn === "p1" ? p1Hand : p2Hand;

  function selectCard(card: CardType) {
    if (card.owner !== turn) return;
    setSelectedCard(card);
  }
  
  function placeCard(index: number) {
    if (board[index] || !selectedCard) return;

    let newBoard = [...board];
    newBoard[index] = selectedCard;
    newBoard = applyCaptures(newBoard, index, selectedCard);

    setBoard(newBoard);

    if (turn === "p1") {
      setP1Hand(prev => prev.filter(c => c.id !== selectedCard.id));
      setTurn("p2");
    } else {
      setP2Hand(prev => prev.filter(c => c.id !== selectedCard.id));
      setTurn("p1");
    }

    setSelectedCard(null);
  }

  const score = useMemo(() => {
    let p1 = 0;
    let p2 = 0;

    board.forEach(c => {
      if (!c) return;
      if (c.owner === "p1") p1++;
      if (c.owner === "p2") p2++;
    });

    return { p1, p2 };
  }, [board]);

  const gameOver = useMemo(() => {
    return (
      board.every(Boolean) ||
      (p1Hand.length === 0 && p2Hand.length === 0)
    );
  }, [board, p1Hand.length, p2Hand.length]);

  const winner = useMemo(() => {
    if (!gameOver) return null;
    if (score.p1 > score.p2) return "Player 1";
    if (score.p2 > score.p1) return "Player 2";
    return "Draw";
  }, [gameOver, score]);

  function restart() {
    setBoard(Array(9).fill(null));
    setTurn("p1");
    setP1Hand(player1Cards);
    setP2Hand(player2Cards);
    setSelectedCard(null);
  }

  return {
    board,
    turn,
    currentHand,
    p1Hand,
    p2Hand,
    selectedCard,
    score,
    gameOver,
    winner,
    selectCard,
    placeCard,
    restart
  };
}