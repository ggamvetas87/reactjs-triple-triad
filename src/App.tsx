import { useGame } from "@/hooks/useGame";
import Board from "@/components/Board";
import Card from "@/components/Card";
import PlayerHand from "@/components/PlayerHand";

export default function App() {
  const {
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
  } = useGame();

  return (
    <div className="app">
      <h1>Triple Triad</h1>

      <div className="score">
        <span className="p1">{score.p1}</span>
        <div>
          <h2>Score</h2>
          <span className={`turn ${turn}`}>{turn === "p1" ? "Player 1" : "Player 2"}</span>
        </div>
        <span className="p2">{score.p2}</span>
      </div>

      {gameOver && (
        <div className="result-overlay">
          <div className="result-modal">
            <h2>{winner === "Player 1" ? "🏆 Winner!" : winner === "Player 2" ? "💀 Loser!" : "🤝 Draw!"}</h2>

            <p>
              Final Score: {score.p1} - {score.p2}
            </p>

            <button onClick={restart}>Play Again</button>
          </div>
        </div>
      )}

      {/* {!gameOver && (
        <div className="hand">
          {currentHand.map(card => (
            <Card 
              key={card.id} 
              card={card}
              selected={selectedCard?.id === card.id}
              onClick={() => selectCard(card)} />
          ))}
        </div>
      )} */}

      <PlayerHand
        player="p1"
        cards={p1Hand}
        isActive={turn === "p1"}
        onSelect={selectCard}
        selectedCard={selectedCard}
      />

      <PlayerHand
        player="p2"
        cards={p2Hand}
        isActive={turn === "p2"}
        onSelect={selectCard}
        selectedCard={selectedCard}
      />

      <p>Selected: {selectedCard?.name ?? "None"}</p>

      <Board 
        board={board}
        onPlace={placeCard}
        hasSelectedCard={!!selectedCard}
      />
    </div>
  );
}
