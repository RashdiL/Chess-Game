import {
  HORIZONTAL_AXIS,
  Piece,
  samePosition,
  VERTICAL_AXIS,
} from "../../Constants";
import Tile from "../Tile/Tile";
export const initialBoard = (initialBoardState: Piece[]) => {
  let board: JSX.Element[] = [];
  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = initialBoardState.find((p) =>
        samePosition(p.position, { x: i, y: j })
      );
      let image = piece ? piece.image : undefined;

      board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
    }
  }
  return board;
};
