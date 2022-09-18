import { moveHistory } from "../../Constants";
import "./MoveTracker.css";
type Props = {
  moveHistory: moveHistory[];
};
const MoveTracker: React.FC<Props> = ({ moveHistory }) => {
  return (
    <>
      <h1>Move History:</h1>
      <div className="moves">
        {moveHistory.map((move) => {
          return (
            <h2 key="" className="move">{`${move.newAnnotatedPosition} `}</h2>
          );
        })}
      </div>
    </>
  );
};
export default MoveTracker;
