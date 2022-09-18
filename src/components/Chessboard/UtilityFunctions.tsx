import {
  HORIZONTAL_AXIS,
  Piece,
  PieceType,
  Position,
  samePosition,
  TeamType,
  VERTICAL_AXIS,
} from "../../Constants";
import { findPieceInSpecificPosition } from "../../referee/rules/GeneralRules";
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
export const generateAnnotation = (
  currentPiece: Piece,
  desiredPosition: Position,
  boardState: Piece[]
) => {
  //account for castling, eating pieces, regular movement, and movement that can be made by two of the same pieces.
  const opposite_team =
    currentPiece.team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
  //Lets see if an enemy piece exists in the position we want to move to.
  const enemy_piece = findPieceInSpecificPosition(
    boardState,
    desiredPosition,
    opposite_team
  );
  const pieceSymbols = ["", "B", "N", "R", "Q", "K"];
  if (!enemy_piece) {
    const desired_x = desiredPosition.x;
    const desired_y = desiredPosition.y;
    return `${pieceSymbols[currentPiece.type]}${HORIZONTAL_AXIS[desired_x]}${
      desired_y + 1
    }`;
  }
};
