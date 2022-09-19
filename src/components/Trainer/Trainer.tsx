import Chessboard from "../Chessboard/Chessboard";
import MoveTracker from "../MoveTracker/MoveTracker";
import "./Trainer.css";
import { useState } from "react";
import { moveHistory } from "../../Constants";
import OpeningTester from "../OpeningTester/OpeningTester";
export default function Trainer() {
  const [moveHistory, setMoveHistory] = useState<moveHistory[]>([]);
  const [undoMove, setUndoMove] = useState<boolean>(false);
  const [resetBoard, setResetBoard] = useState<boolean>(false);
  return (
    <>
      <div className="parent">
        <div className="child">
          <Chessboard
            moveHistory={moveHistory}
            setMoveHistory={setMoveHistory}
            undoMove={undoMove}
            resetBoard={resetBoard}
            setResetBoard={setResetBoard}
          />
        </div>
        <div className="child">
          <MoveTracker moveHistory={moveHistory} />
        </div>
        <OpeningTester
          moveHistory={moveHistory}
          setMoveHistory={setMoveHistory}
          resetBoard={resetBoard}
          setResetBoard={setResetBoard}
        />
      </div>
    </>
  );
}
