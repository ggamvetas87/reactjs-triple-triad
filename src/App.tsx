import { useGame } from "@/hooks/useGame";
import Board from "@/components/Board";
import Card from "@/components/Card";

export default function App() {
  const {
    board,
    turn,
    currentHand,
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

      <h2>Turn: {turn}</h2>
      <h3>Score P1: {score.p1} | P2: {score.p2}</h3>

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

      {!gameOver && (
        <div className="hand">
          {currentHand.map(card => (
            <Card 
              key={card.id} 
              card={card}
              selected={selectedCard?.id === card.id}
              onClick={() => selectCard(card)} />
          ))}
        </div>
      )}

      <p>Selected: {selectedCard?.name ?? "None"}</p>

      <Board 
        board={board}
        onPlace={placeCard}
        hasSelectedCard={!!selectedCard}
      />
    </div>
  );
}
