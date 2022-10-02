import Chessboard from "../Chessboard/Chessboard";
import MoveTracker from "../MoveTracker/MoveTracker";
import "./Trainer.css";
import { useState } from "react";
import { moveHistory } from "../../Constants";
import OpeningTester from "../OpeningTester/OpeningTester";
export default function Trainer() {
  const [moveHistory, setMoveHistory] = useState<moveHistory[]>([]);
  const [resetBoard, setResetBoard] = useState<boolean>(false);
  return (
    <>
      <h1 className="title">Chess Opening Trainer</h1>
      <div className="parent">
        <div className="child chessboard">
          <Chessboard
            moveHistory={moveHistory}
            setMoveHistory={setMoveHistory}
            resetBoard={resetBoard}
            setResetBoard={setResetBoard}
            playingAI={false}
          />
        </div>
        <div className="child history">
          <MoveTracker moveHistory={moveHistory} />
        </div>
        <div className="child tester">
          <OpeningTester
            moveHistory={moveHistory}
            setMoveHistory={setMoveHistory}
            setResetBoard={setResetBoard}
          />
        </div>
      </div>
    </>
  );
}
