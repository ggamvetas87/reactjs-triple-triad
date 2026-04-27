import { useState } from "react"; 
import { useGame } from "@/hooks/useGame";
import Board from "@/components/Board";
import Score from "@/components/Score";
import PlayerCardDeck from "@/components/PlayerCardDeck";
import Modal from "@/components/Modal";

export default function App() {
  const {
    board,
    turn,
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
  } = useGame();

  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  
  const introContent = (
    <>
      <img src="/assets/card-back.png" alt="Triple Triad" 
        style={{ width: "100%", maxWidth: "150px" }} />
      <p>Triple Triad is a card game from 
        <a href="https://en.wikipedia.org/wiki/Final_Fantasy_VIII" target="_blank">Final Fantasy VIII</a>. 
      <br />This project implements only the game itself,
      with only basic rule types and basic AI.</p>
      <p>For a list of rules and gameplay, 
        <a href="https://finalfantasy.fandom.com/wiki/Triple_Triad" 
        target="_blank">ℹ️ instructions read here.</a></p>
      <p>Click the button below to start the game.</p>
    </>
  );

  return (
    <div className="app">
      <h1>
        <img src="/assets/card-back.png" alt="Triple Triad" 
        style={{ width: "100%", maxWidth: "50px" }} />
        Triple Triad
      </h1>
      
      <div className="instructions">
        <a onClick={() => setInfoModalVisible(true)}>ℹ️ Info</a>
      </div>

      {/* Menu Buttons */}
      <div className="menu-buttons">
        <button onClick={() => restart()}>
          New Game
        </button>

        <button onClick={() => toggleMusic()}>
          {isMusicPlaying ? "⏸ Pause Music" : "▶️ Resume Music"}
        </button>
      </div>

      {/* Score Board */}
      <Score score={score} turn={turn} />

      {/* Game Over Modal */}
      {gameOver && (
        <Modal
          title={winner === "Player 1" ? "🏆 Winner!" : winner === "Player 2" ? "💀 Loser!" : "🤝 Draw!"}
          content={<p>Final Score: {score.p1} - {score.p2}</p>}
          buttonText="Play Again"
          onClick={restart}
          soundEffect={winner === "Player 1" ? "ff8-victory-fanfare.ogg" : winner === "Player 2" ? "game-over.mp3" : "game-over.mp3"}
        />
      )}

      {/* Start Game Modal */}
      {(!hasStarted || isInfoModalVisible) && (
        <Modal
          title="Welcome to Triple Triad!"
          content={introContent}
          buttonText={!hasStarted ? "Start Game" : "Close"}
          onClick={!hasStarted ? startGame : () => setInfoModalVisible(false)}
        />
      )}

      {/* Player Decks */}
      <PlayerCardDeck
        player="p1"
        cards={p1Deck}
        isActive={turn === "p1"}
        onSelect={selectCard}
        selectedCard={selectedCard}
      />

      <PlayerCardDeck
        player="p2"
        cards={p2Deck}
        isActive={turn === "p2"}
        onSelect={selectCard}
        selectedCard={selectedCard}
      />

      <p>Selected: {selectedCard ? `${selectedCard.name} - Level ${selectedCard.level}` : "None"}</p>

      <Board 
        board={board}
        onPlace={placeCard}
        hasSelectedCard={!!selectedCard}
      />
    </div>
  );
}
