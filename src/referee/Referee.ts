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
  GRID_SIZE,
  isPlayerTryingToCastle,
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
    desiredPosition: Position,
    initialPosition: Position,
    boardState: Piece[],
    castlingPieceMoveHistory: castlingPieceMoveHistory,
    turn: TeamType
  ) {
    let validMove = false;
    let isCastling = false;
    let enPassanting = false;
    let moveSummary = [validMove, isCastling, enPassanting];
    const currentPiece = boardState.find((p) =>
      samePosition(p.position, initialPosition)
    );
    if (!currentPiece) return moveSummary;
    let team = currentPiece.team;
    if (!(team === turn)) return moveSummary;
    const oppositeTeam =
      currentPiece.team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
    let potentialBoardState = setBoard(
      boardState,
      initialPosition,
      desiredPosition
    );
    if (
      isPlayerTryingToCastle(currentPiece, desiredPosition, currentPiece.team)
    ) {
      const validCastle = this.isValidCastle(
        initialPosition,
        desiredPosition,
        currentPiece.type,
        currentPiece.team,
        boardState,
        castlingPieceMoveHistory
      );
      if (!validCastle) return moveSummary;
      return [true, true, false];
    }
    const isEnPassantMove = this.isEnPassantMove(
      initialPosition,
      desiredPosition,
      currentPiece.type,
      currentPiece.team,
      boardState
    );
    if (isEnPassantMove) {
      return [true, false, true];
    }
    if (isKingInCheck(potentialBoardState, oppositeTeam)) return moveSummary;
    switch (currentPiece.type) {
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
    return [validMove, false, false];
  }
}
