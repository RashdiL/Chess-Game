import { useState } from "react";
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
  function saveOpening() {
    setTestingOpening(moveHistory);
    setMoveHistory([]);
    setResetBoard(true);
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
