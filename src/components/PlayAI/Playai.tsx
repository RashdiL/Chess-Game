import Chessboard from "../Chessboard/Chessboard";
import "./Playai.css";
import { useState } from "react";
import { moveHistory } from "../../Constants";
export default function Playai() {
  const [moveHistory, setMoveHistory] = useState<moveHistory[]>([]);
  const [resetBoard, setResetBoard] = useState<boolean>(false);
  return (
    <>
      <h1 className="title">Play My Chess AI!</h1>
      <div className="parent">
        <div className="child chessboard">
          <Chessboard
            moveHistory={moveHistory}
            setMoveHistory={setMoveHistory}
            resetBoard={resetBoard}
            setResetBoard={setResetBoard}
          />
        </div>
      </div>
    </>
  );
}
