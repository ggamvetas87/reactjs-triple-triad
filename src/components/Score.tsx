type ScoreProps = {
  score: { p1: number; p2: number };
  turn: "p1" | "p2" | "computer";
}

export default function Score({ score, turn }: ScoreProps) {
  let playerName = "computer";

  if (turn === "p1") {
    playerName = "Player 1";
  } else if (turn === "p2") {
    playerName = "Player 2";
  }

  return (
    <div className="score">
      <span className="p1">{score.p1}</span>
      <div>
        <h2>Score</h2>
        <span className={`turn ${turn}`}>{playerName}</span>
      </div>
      <span className="p2">{score.p2}</span>
    </div>
  );
}
