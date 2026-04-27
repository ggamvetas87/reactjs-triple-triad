import { useEffect, useMemo, useState } from "react";
import type { RawCard, CardType, Player } from "@/types/game";
import { deck as cardsDeck } from "@/data/allCards";
import {
  dealHands,
  applyCaptures,
  playSound,
  stopAllSounds,
  toggleBackgroundMusic
} from "@/utils/gameHelpers";

export function useGame() {
  const [board, setBoard] = useState<(CardType | null)[]>(Array(9).fill(null));
  const [hasStarted, setHasStarted] = useState(false);
  const [turn, setTurn] = useState<Player>("p1");
  const { player1Cards, player2Cards } = dealHands(cardsDeck as RawCard[]);
  const [p1Deck, setP1Deck] = useState<CardType[]>(player1Cards);
  const [p2Deck, setP2Deck] = useState<CardType[]>(player2Cards);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const currentDeck = turn === "p1" ? p1Deck : p2Deck;

  function selectCard(card: CardType) {
    if (card.owner !== turn) return;

    playSound("card-select.ogg");
    setSelectedCard(card);
  }
  
  function placeCard(index: number) {
    if (board[index] || !selectedCard) return;

    let newBoard = [...board];
    newBoard[index] = selectedCard;
    newBoard = applyCaptures(newBoard, index, selectedCard);

    setBoard(newBoard);

    if (turn === "p1") {
      setP1Deck(prev => prev.filter(c => c.id !== selectedCard.id));
      setTurn("p2");
    } else {
      setP2Deck(prev => prev.filter(c => c.id !== selectedCard.id));
      setTurn("p1");
    }

    playSound("card-place2.wav");
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
      (p1Deck.length === 0 && p2Deck.length === 0)
    );
  }, [board, p1Deck.length, p2Deck.length]);

  const winner = useMemo(() => {
    if (!gameOver) return null;
    if (score.p1 > score.p2) return "Player 1";
    if (score.p2 > score.p1) return "Player 2";
    return "Draw";
  }, [gameOver, score]);

  const startBgMusic = () => playSound("bg-music.mp3", {
    volume: 0.35,
    loop: true,
    isBackground: true,
  });

  function startGame() {
    setHasStarted(true);
    startBgMusic();
    setIsMusicPlaying(true);
  }

  function restart() {
    setBoard(Array(9).fill(null));
    setTurn("p1");
    setP1Deck(player1Cards);
    setP2Deck(player2Cards);
    setSelectedCard(null);
    
    stopAllSounds();
    startBgMusic();
  }

  function toggleMusic() {
    const isPlaying = toggleBackgroundMusic();
    setIsMusicPlaying(isPlaying);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, []);

  return {
    board,
    turn,
    currentDeck,
    p1Deck,
    p2Deck,
    selectedCard,
    score,
    gameOver,
    winner,
    hasStarted,
    isMusicPlaying,
    selectCard,
    placeCard,
    startGame,
    restart,
    toggleMusic
  };
}