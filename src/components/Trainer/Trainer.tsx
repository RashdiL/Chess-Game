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
      <h1 className="title">Chess Opening Trainer</h1>
      <div className="parent">
        <div className="child-1">
          <div className="chessboard">
            <Chessboard
              moveHistory={moveHistory}
              setMoveHistory={setMoveHistory}
              undoMove={undoMove}
              resetBoard={resetBoard}
              setResetBoard={setResetBoard}
            />
          </div>
        </div>
        <div className="child-2">
          <MoveTracker moveHistory={moveHistory} />
        </div>
        <OpeningTester
          moveHistory={moveHistory}
          setMoveHistory={setMoveHistory}
          setResetBoard={setResetBoard}
        />
      </div>
    </>
  );
}
