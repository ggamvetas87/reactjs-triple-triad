import { useEffect, useMemo, useState } from "react";
import type { GameMode, RawCard, CardType, Player } from "@/types/game";
import { deck as cardsDeck } from "@/data/allCards";
import {
  dealHands,
  applyCaptures,
  playSound,
  stopAllSounds,
  toggleBackgroundMusic,
  getBestComputerMove
} from "@/utils/gameHelpers";

export function useGame() {
  const { player1Cards, player2Cards, computerCards } = dealHands(cardsDeck as RawCard[]);

  const [gameMode, setGameMode] = useState<GameMode>("single");
  const [board, setBoard] = useState<(CardType | null)[]>(Array(9).fill(null));
  const [hasStarted, setHasStarted] = useState(false);
  const [turn, setTurn] = useState<Player>("p1");
  const [p1Deck, setP1Deck] = useState<CardType[]>(player1Cards);
  const [opponentDeck, setOpponentDeck] = useState<CardType[]>(
    gameMode === "single" ? computerCards : player2Cards
  );
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const currentDeck = turn === "p1" ? p1Deck : opponentDeck;

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

    // Remove card from player's / bot's hand and switch turn
    if (turn === "p1") {
      setP1Deck(prev => prev.filter(c => c.id !== selectedCard.id));
      setTurn(gameMode === "single" ? "computer" : "p2");
    } else {
      setOpponentDeck(prev =>
        prev.filter(c => c.id !== selectedCard.id)
      );
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
      if (c.owner === "p2" || c.owner === "computer") p2++;
    });

    return { p1, p2 };
  }, [board]);

  const gameOver = useMemo(() => {
    return (
      board.every(Boolean) ||
      (p1Deck.length === 0 && opponentDeck.length === 0)
    );
  }, [board, p1Deck.length, opponentDeck.length]);

  const winner = useMemo(() => {
    if (!gameOver) return null;
    if (score.p1 > score.p2) return "Player 1";
    if (score.p2 > score.p1) return gameMode === "single" ? "Computer" : "Player 2";
    return "Draw";
  }, [gameOver, score, gameMode]);

  const startBgMusic = () => playSound("bg-music.mp3", {
    volume: 0.35,
    loop: true,
    isBackground: true,
  });

  function startGame(mode: GameMode) {
    setGameMode(mode);

  const { player1Cards, player2Cards, computerCards } =
    dealHands(cardsDeck as RawCard[]);

    setBoard(Array(9).fill(null));
    setTurn("p1");
    setP1Deck(player1Cards);

    setOpponentDeck(
      mode === "multiplayer"
        ? player2Cards
        : computerCards
    );

    if (hasStarted) {
      stopAllSounds();
    }

    setSelectedCard(null);
    setHasStarted(true);

    startBgMusic();
    setIsMusicPlaying(true);
  }

  function restart(mode: GameMode = gameMode) {
    startGame(mode);
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

  useEffect(() => {
  if (gameMode !== "single" || turn !== "computer" || gameOver) return;

    const move = getBestComputerMove(board, opponentDeck);
    const delayTime = 500 + Math.random() * 800;

    if (!move) return;

    // COM Visually select card
    setSelectedCard(move.card);

    const timer = setTimeout(() => {
      let newBoard = [...board];
      newBoard[move.index] = move.card;
      newBoard = applyCaptures(newBoard, move.index, move.card);

      setBoard(newBoard);

      setOpponentDeck((prev) =>
        prev.filter((c) => c.id !== move.card.id)
      );

      playSound("card-place2.wav");

      setSelectedCard(null);
      setTurn("p1");
    }, delayTime);

    return () => clearTimeout(timer);
  }, [turn, gameMode, board, opponentDeck, gameOver]);

  return {
    board,
    turn,
    currentDeck,
    p1Deck,
    opponentDeck,
    selectedCard,
    score,
    gameOver,
    winner,
    hasStarted,
    isMusicPlaying,
    gameMode,
    selectCard,
    placeCard,
    startGame,
    restart,
    toggleMusic,
    setGameMode
  };
}