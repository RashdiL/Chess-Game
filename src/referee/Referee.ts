import {
  PieceType,
  TeamType,
  Piece,
  Position,
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  samePosition,
  setBoard,
  castlingPieceMoveHistory,
} from "../Constants";

import {
  pawnMove,
  knightMove,
  bishopMove,
  rookMove,
  queenMove,
  kingMove,
} from "./rules";
import { isKingInCheck } from "./rules/Check";
import {
  findPieceInSpecificPosition,
  isTileControlledByAPiece,
} from "./rules/GeneralRules";

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
  isValidCastle(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[],
    castlingPieceMoveHistory: castlingPieceMoveHistory
  ) {
    let oppositeTeam =
      team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
    //Check if we are trying to castle
    let castlingY = team === TeamType.WHITE ? 0 : 7;
    let kingSideCastlePosition: Position = { x: 6, y: castlingY };
    let queenSideCastlePosition: Position = { x: 2, y: castlingY };
    if (samePosition(desiredPosition, kingSideCastlePosition)) {
      if (isKingInCheck(boardState, team)) return false;
      if (
        findPieceInSpecificPosition(boardState, { x: 5, y: castlingY }) ||
        findPieceInSpecificPosition(boardState, kingSideCastlePosition)
      ) {
        return false;
      }
      if (team === TeamType.WHITE) {
        if (castlingPieceMoveHistory.didWhiteKingMove) return false;
        if (castlingPieceMoveHistory.didWKingRookMove) return false;
      } else {
        if (castlingPieceMoveHistory.didBlackKingMove) return false;
        if (castlingPieceMoveHistory.didBKingRookMove) return false;
      }
      if (
        isTileControlledByAPiece(
          { x: 5, y: castlingY },
          boardState,
          oppositeTeam
        ) ||
        isTileControlledByAPiece(
          kingSideCastlePosition,
          boardState,
          oppositeTeam
        )
      ) {
        return false;
      }
    }
    if (samePosition(desiredPosition, queenSideCastlePosition)) {
      if (isKingInCheck(boardState, team)) return false;
      if (
        findPieceInSpecificPosition(boardState, { x: 1, y: castlingY }) ||
        findPieceInSpecificPosition(boardState, queenSideCastlePosition) ||
        findPieceInSpecificPosition(boardState, { x: 3, y: castlingY })
      ) {
        return false;
      }
      if (team === TeamType.WHITE) {
        if (castlingPieceMoveHistory.didWhiteKingMove) return false;
        if (castlingPieceMoveHistory.didWQueenRookMove) return false;
      } else {
        if (castlingPieceMoveHistory.didBlackKingMove) return false;
        if (castlingPieceMoveHistory.didBQueenRookMove) return false;
      }
      if (
        isTileControlledByAPiece(
          { x: 1, y: castlingY },
          boardState,
          oppositeTeam
        ) ||
        isTileControlledByAPiece(
          queenSideCastlePosition,
          boardState,
          oppositeTeam
        ) ||
        isTileControlledByAPiece(
          { x: 3, y: castlingY },
          boardState,
          oppositeTeam
        )
      ) {
        return false;
      }
    }
    return true;
  }
  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[],
    castlingPieceMoveHistory: castlingPieceMoveHistory
  ) {
    let validMove = false;
    const oppositeTeam =
      team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
    let potentialBoardState = setBoard(
      boardState,
      initialPosition,
      desiredPosition
    );
    if (isKingInCheck(potentialBoardState, oppositeTeam)) return false;
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
          boardState
        );
    }

    return validMove;
  }
}
