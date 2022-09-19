import { useEffect, useState } from "react";
import { moveHistory } from "../../Constants";
type Props = {
  moveHistory: moveHistory[] | undefined;
  setMoveHistory: React.Dispatch<React.SetStateAction<moveHistory[]>>;
  resetBoard: boolean;
  setResetBoard: React.Dispatch<React.SetStateAction<boolean>>;
};
const OpeningTester: React.FC<Props> = ({
  moveHistory,
  setMoveHistory,
  resetBoard,
  setResetBoard,
}) => {
  const [testingOpening, setTestingOpening] = useState<
    moveHistory[] | undefined
  >();
  const [testingMode, setTestingMode] = useState<boolean>(false);

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
      } else {
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
    <button
      onClick={() => {
        saveOpening();
      }}
    >
      Click here to save your moves.
    </button>
  );
};
export default OpeningTester;
