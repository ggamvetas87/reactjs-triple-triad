import { useEffect, useMemo, useState, useRef } from "react";
import { player1Cards, player2Cards } from "@/data/cards";
import type { CardType, Player } from "@/types/game";
import { applyCaptures, playSelectSound, stopAllSounds } from "@/utils/gameHelpers";

export function useGame() {
  const [board, setBoard] = useState<(CardType | null)[]>(Array(9).fill(null));
  const [hasStarted, setHasStarted] = useState(false);
  const [turn, setTurn] = useState<Player>("p1");
  const [p1Deck, setP1Hand] = useState<CardType[]>(player1Cards);
  const [p2Deck, setP2Hand] = useState<CardType[]>(player2Cards);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const currentHand = turn === "p1" ? p1Deck : p2Deck;

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  function selectCard(card: CardType) {
    if (card.owner !== turn) return;

    playSelectSound("card-select.ogg");
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

    playSelectSound("card-place2.wav");
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

  function startGame() {
    setHasStarted(true);

    if (bgMusicRef.current) {
      void bgMusicRef.current.play();
      setIsMusicPlaying(true);
    }
  }

  function restart() {
    setBoard(Array(9).fill(null));
    setTurn("p1");
    setP1Hand(player1Cards);
    setP2Hand(player2Cards);
    setSelectedCard(null);
    stopAllSounds();
  }

  function toggleMusic(refMusic?: React.RefObject<HTMLAudioElement>) {
    const audio = refMusic?.current || bgMusicRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play();
      setIsMusicPlaying(true);
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  }

  useEffect(() => {
    const audio = new Audio("/sounds/bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.35;

    bgMusicRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return {
    board,
    turn,
    currentHand,
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