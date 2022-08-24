import {
  PieceType,
  TeamType,
  Piece,
  Position,
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
} from "../Constants";

import {
  pawnMove,
  knightMove,
  bishopMove,
  rookMove,
  queenMove,
  kingMove,
  doesKingHaveToMove,
} from "./rules";
import { isKingInCheck } from "./rules/Check";

export default class Referee {
  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = team === TeamType.WHITE ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  NewMove(desiredPosition: Position, type: PieceType) {
    const NewPos = `${HORIZONTAL_AXIS[desiredPosition.x]}${
      VERTICAL_AXIS[desiredPosition.y]
    }`;
    return NewPos;
  }
  //TODO
  //Prevent the king from moving into danger!
  //Add castling!
  //Add check!
  //Add checkmate!
  //Add stalemate!
  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[],
    potentialBoardState: Piece[],
    didKingMove: boolean,
    didKingsRookMove: boolean,
    didQueensRookMove: boolean
  ) {
    let validMove = false;
    const oppositeTeam =
      team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
    if (isKingInCheck(potentialBoardState, oppositeTeam)) return false;
    if (doesKingHaveToMove(boardState, team)) {
      if (type !== PieceType.KING) {
        return false;
      }
    }
    switch (type) {
      case PieceType.PAWN:
        validMove = pawnMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.KNIGHT:
        validMove = knightMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.BISHOP:
        validMove = bishopMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.ROOK:
        validMove = rookMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.QUEEN:
        validMove = queenMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
        break;
      case PieceType.KING:
        validMove = kingMove(
          initialPosition,
          desiredPosition,
          team,
          boardState,
          didKingMove,
          didKingsRookMove,
          didQueensRookMove
        );
    }

    return validMove;
  }
}
