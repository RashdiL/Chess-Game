import { useEffect } from "react";
import { moveHistory } from "../../Constants";
import "./MoveTracker.css";
type Props = {
  moveHistory: moveHistory[];
};
const MoveTracker: React.FC<Props> = ({ moveHistory }) => {
  let count: number = 0;
  let subtraction: number = -1;
  let moveCount: number[] = [];
  for (let i = 0; i <= moveHistory.length; i++) {
    moveCount.push(i);
  }

  return (
    <>
      <h1>Move History:</h1>
      <div className="moves">
        {moveHistory.map((move) => {
          count++;
          if (moveHistory && count % 2 !== 0) {
            subtraction++;
          }
          return (
            <div className="movecounts">
              {moveHistory && count % 2 !== 0 && (
                <h2 key={`${count * 1000}`}>{` ${
                  moveCount[count] - subtraction
                }. `}</h2>
              )}
              <h2 key={`${count}`} className="move">
                {`${move.newAnnotatedPosition} `}
              </h2>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default MoveTracker;
