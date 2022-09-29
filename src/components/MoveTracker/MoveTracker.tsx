import { useEffect, useState } from "react";
import { moveHistory } from "../../Constants";
import "./MoveTracker.css";
type Props = {
  moveHistory: moveHistory[];
};
const MoveTracker: React.FC<Props> = ({ moveHistory }) => {
  const [moves, setMoves] = useState<string>("");
  function produceMoveHistory() {
    let count: number = 0;
    let subtraction: number = -1;
    let moveCount: number[] = [];
    for (let i = 0; i <= moveHistory.length; i++) {
      moveCount.push(i);
    }
    let newMoves = "";
    moveHistory.map((move) => {
      count++;
      if (moveHistory && count % 2 !== 0) {
        subtraction++;
      }
      let moveNumber =
        moveHistory && count % 2 !== 0
          ? `${moveCount[count] - subtraction}. `
          : "";
      let moveAnnotation = `${move.newAnnotatedPosition} `;
      newMoves += moveNumber + moveAnnotation;
    });
    return newMoves;
  }

  useEffect(() => {
    setMoves(produceMoveHistory());
  }, [moveHistory]);

  return (
    <>
      <h1>Move History:</h1>
      <div className="moves">{moves}</div>
    </>
  );
};
export default MoveTracker;
