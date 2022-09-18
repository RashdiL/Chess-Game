import Chessboard from "../Chessboard/Chessboard";
import MoveTracker from "../MoveTracker/MoveTracker";
import "./Trainer.css";
import { useState } from "react";
import { moveHistory } from "../../Constants";
export default function Trainer() {
  const [moveHistory, setMoveHistory] = useState<moveHistory[]>([]);
  const [undoMove, setUndoMove] = useState<moveHistory | undefined>();
  function handleClick(e: React.MouseEvent) {
    const newMoveHistory = [...moveHistory];
    const removed_move = newMoveHistory.pop();
    setUndoMove(removed_move);
    console.log("undo");
    setMoveHistory(newMoveHistory);
  }
  return (
    <>
      <div className="parent">
        <div className="child">
          <Chessboard
            moveHistory={moveHistory}
            setMoveHistory={setMoveHistory}
            undoMove={undoMove}
          />
        </div>
        <div className="child">
          <MoveTracker moveHistory={moveHistory} />
        </div>
        <button
          className="button"
          onClick={(e) => {
            handleClick(e);
          }}
        >
          Undo
        </button>
      </div>
    </>
  );
}
