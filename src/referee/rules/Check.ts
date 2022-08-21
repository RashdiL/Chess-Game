import {
  findPieceControllingThisSquare,
  findPiecesControllingThisSquare,
  Piece,
  PieceType,
  TeamType,
} from "../../Constants";
import { isTileControlledByAPiece } from "./GeneralRules";
export function getPieceGivingCheck(boardState: Piece[], team: TeamType) {
  const king = boardState.find((p) => {
    if (p.type === PieceType.KING && p.team !== team) {
      return p;
    }
    return false;
  });
  if (king && isTileControlledByAPiece(king.position, boardState, team)) {
    let pieceChecking = findPieceControllingThisSquare(
      boardState,
      team,
      king.position
    );
    return pieceChecking;
  }
  return false;
}

export const isKingInCheck = (boardState: Piece[], team: TeamType) => {
  if (getPieceGivingCheck(boardState, team)) {
    return true;
  }
  return false;
};
//this must execute before the "enemy" gets to play or right after the player with the legal turn plays a legal move.
export function isCheckHorizontalVerticalOrDiagonal(
  boardState: Piece[],
  team: TeamType
) {
  let checkType = "";
  if (!isKingInCheck(boardState, team)) return false;
  const king = boardState.find((p) => {
    if (p.type === PieceType.KING && p.team !== team) {
      return p;
    }
    return false;
  });
  let piece = getPieceGivingCheck(boardState, team);
  if (!piece || !king) return false;
  if (piece.position.x - king?.position.x === 0) {
    checkType = "vertical";
  } else if (piece.position.y - king.position.y === 0) {
    checkType = "horizontal";
  } else {
    checkType = "diagonal";
  }
  return checkType;
}

export const canCheckGetBlocked = (boardState: Piece[], team: TeamType) => {
  if (!isKingInCheck(boardState, team)) return false;
  const checkDirection = isCheckHorizontalVerticalOrDiagonal(boardState, team);
  const piece = getPieceGivingCheck(boardState, team);
  const king = boardState.find((p) => {
    if (p.type === PieceType.KING && p.team !== team) {
      return p;
    }
    return false;
  });
  if (piece && king) {
    if (checkDirection === "vertical") {
      //check if piece is right next to the king.
      if (piece.position.y - king.position.y === 1) {
        return false;
      }
      const multiplier = piece.position.y < king.position.y ? 1 : -1;
      const PositionDifference = Math.abs(piece.position.y - king.position.y);
      for (let i = 1; i < PositionDifference; i++) {
        let checkingPosition = {
          x: piece.position.x,
          y: piece.position.y + i * multiplier,
        };
        const piecesControllingTheSquare = findPiecesControllingThisSquare(
          boardState,
          king.team,
          checkingPosition
        );
        if (!piecesControllingTheSquare) return false;
        if (piecesControllingTheSquare.length > 1) {
          return true;
        }
        const doesKingControlTheSquare = piecesControllingTheSquare.find(
          (p) => {
            if (p.type === PieceType.KING) {
              return true;
            }
            return false;
          }
        );
        if (!doesKingControlTheSquare) {
          return true;
        }
        const doesCheckingTeamControlTheSquare = findPieceControllingThisSquare(
          boardState,
          team,
          checkingPosition
        );
        if (doesCheckingTeamControlTheSquare) {
          return false;
        } else {
          return true;
        }
      }
    }
    if (checkDirection === "horizontal") {
      //check if piece is right next to the king.
      if (piece.position.x - king.position.x === 1) {
        return false;
      }
      const multiplier = piece.position.x < king.position.x ? 1 : -1;
      const PositionDifference = Math.abs(piece.position.x - king.position.x);
      for (let i = 1; i < PositionDifference; i++) {
        let checkingPosition = {
          x: piece.position.x + i * multiplier,
          y: piece.position.y,
        };
        const piecesControllingTheSquare = findPiecesControllingThisSquare(
          boardState,
          king.team,
          checkingPosition
        );
        if (piecesControllingTheSquare.length === 0) return false;
        if (piecesControllingTheSquare.length > 1) {
          return true;
        }
        const doesKingControlTheSquare = piecesControllingTheSquare.find(
          (p) => {
            if (p.type === PieceType.KING) {
              return true;
            }
            return false;
          }
        );
        if (!doesKingControlTheSquare) {
          return true;
        }
        const doesCheckingTeamControlTheSquare = findPieceControllingThisSquare(
          boardState,
          team,
          checkingPosition
        );
        if (doesCheckingTeamControlTheSquare) {
          return false;
        } else {
          return true;
        }
      }
    }
    if (checkDirection === "diagonal") {
      //check if piece is right next to the king.
      if (piece.position.y - king.position.y === 1) {
        return false;
      }
      const Ymultiplier = piece.position.y < king.position.y ? 1 : -1;
      const Xmultiplier = piece.position.x < king.position.x ? 1 : -1;
      const PositionDifference = Math.abs(piece.position.y - king.position.y);
      for (let i = 1; i < PositionDifference; i++) {
        let checkingPosition = {
          x: piece.position.x + i * Xmultiplier,
          y: piece.position.y + i * Ymultiplier,
        };
        const piecesControllingTheSquare = findPiecesControllingThisSquare(
          boardState,
          king.team,
          checkingPosition
        );
        if (!piecesControllingTheSquare) return false;
        if (piecesControllingTheSquare.length > 1) {
          return true;
        }
        const doesKingControlTheSquare = piecesControllingTheSquare.find(
          (p) => {
            if (p.type === PieceType.KING) {
              return true;
            }
            return false;
          }
        );
        if (!doesKingControlTheSquare) {
          return true;
        }
        const doesCheckingTeamControlTheSquare = findPieceControllingThisSquare(
          boardState,
          team,
          checkingPosition
        );
        if (doesCheckingTeamControlTheSquare) {
          return false;
        } else {
          return true;
        }
      }
    }
    return false;
  }
};
