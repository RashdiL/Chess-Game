import { useEffect, useRef, useState } from "react";
import { moveHistory } from "../../Constants";
import "./OpeningTester.css";
type Props = {
  moveHistory: moveHistory[] | undefined;
  setMoveHistory: React.Dispatch<React.SetStateAction<moveHistory[]>>;
  setResetBoard: React.Dispatch<React.SetStateAction<boolean>>;
};
const OpeningTester: React.FC<Props> = ({
  moveHistory,
  setMoveHistory,
  setResetBoard,
}) => {
  const [testingOpening, setTestingOpening] = useState<
    moveHistory[] | undefined
  >();
  const [testingMode, setTestingMode] = useState<boolean>(false);
  const isMoveCorrect = useRef<HTMLDivElement>(null);
  const isMoveWrong = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (testingMode && moveHistory && testingOpening) {
      testingMoves(moveHistory, testingOpening);
    }
  }, [moveHistory]);
  function testingMoves(
    moveHistory: moveHistory[],
    testingOpening: moveHistory[]
  ) {
    for (let i = 0; i < moveHistory.length; i++) {
      if (
        moveHistory[i].newAnnotatedPosition ===
        testingOpening[i].newAnnotatedPosition
      ) {
        console.log("CORRECT");
        if (isMoveCorrect.current) {
          isMoveCorrect.current.style.display = "inline";
        }
      } else {
        if (isMoveWrong.current && isMoveCorrect.current) {
          isMoveCorrect.current.style.display = "none";
          isMoveWrong.current.style.display = "inline";
        }
        console.log("FALSE");
      }
    }
    return;
  }
  function saveOpening() {
    setTestingOpening(moveHistory);
    setMoveHistory([]);
    setResetBoard(true);
    setTestingMode(true);
    console.log(testingOpening);
  }
  return (
    <>
      <div className="button-container">
        <button
          className="button"
          onClick={() => {
            saveOpening();
          }}
        >
          Click here to save your moves.
        </button>
      </div>
      <div className="moveResult">
        <h1 className="wrongMove" ref={isMoveWrong}>
          WRONG
        </h1>
        <h1 className="rightMove" ref={isMoveCorrect}>
          RIGHT
        </h1>
      </div>
    </>
  );
};
export default OpeningTester;
