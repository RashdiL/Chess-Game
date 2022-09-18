import {
  findPieceControllingThisSquare,
  findPiecesControllingThisSquare,
  Piece,
  PieceType,
  Position,
  TeamType,
} from "../../Constants";
import {
  canCheckGetBlocked,
  getPieceGivingCheck,
  isKingInCheck,
} from "./Check";
import { isTileControlledByAPiece, isTileOccupied } from "./GeneralRules";

export const canEnemyKingMove = (boardState: Piece[], team: TeamType) => {
  const king = boardState.find((p) => {
    if (p.type === PieceType.KING && p.team !== team) {
      return p;
    }
    return false;
  });
  let kingCanMove = false;
  if (king) {
    for (let j = -1; j < 2; j = j + 2) {
      let checkingPosition: Position = {
        x: king?.position.x + 1 * j,
        y: king?.position.y + 1 * j,
      };
      if (
        checkingPosition.x < 0 ||
        checkingPosition.x > 7 ||
        checkingPosition.y < 0 ||
        checkingPosition.y > 7
      ) {
        continue;
      }
      if (
        !isTileControlledByAPiece(checkingPosition, boardState, team) &&
        !isTileOccupied(checkingPosition, boardState, king.team)
      ) {
        kingCanMove = true;
        break;
      }
    }
    if (!kingCanMove) {
      for (let j = -1; j < 2; j = j + 2) {
        let checkingPosition: Position = {
          x: king?.position.x - 1 * j,
          y: king?.position.y + 1 * j,
        };
        if (
          checkingPosition.x < 0 ||
          checkingPosition.x > 7 ||
          checkingPosition.y < 0 ||
          checkingPosition.y > 7
        ) {
          continue;
        }
        if (
          !isTileControlledByAPiece(checkingPosition, boardState, team) &&
          !isTileOccupied(checkingPosition, boardState, king.team)
        ) {
          kingCanMove = true;
          break;
        }
      }
    }

    if (!kingCanMove) {
      for (let j = -1; j < 2; j = j + 2) {
        let checkingPosition: Position = {
          x: king?.position.x,
          y: king?.position.y + 1 * j,
        };
        if (
          checkingPosition.x < 0 ||
          checkingPosition.x > 7 ||
          checkingPosition.y < 0 ||
          checkingPosition.y > 7
        ) {
          continue;
        }
        if (
          !isTileControlledByAPiece(checkingPosition, boardState, team) &&
          !isTileOccupied(checkingPosition, boardState, king.team)
        ) {
          kingCanMove = true;
          break;
        }
      }
    }
    if (!kingCanMove) {
      for (let j = -1; j < 2; j = j + 2) {
        let checkingPosition: Position = {
          x: king?.position.x + 1 * j,
          y: king?.position.y,
        };
        if (
          checkingPosition.x < 0 ||
          checkingPosition.x > 7 ||
          checkingPosition.y < 0 ||
          checkingPosition.y > 7
        ) {
          continue;
        }
        if (
          !isTileControlledByAPiece(checkingPosition, boardState, team) &&
          !isTileOccupied(checkingPosition, boardState, king.team)
        ) {
          kingCanMove = true;
          break;
        }
      }
    }
  }
  if (!kingCanMove) {
  }
  return kingCanMove;
};

export const canPieceGetCaptured = (
  boardState: Piece[],
  team: TeamType,
  piece: Piece
) => {
  const king = boardState.find((p) => {
    if (p.type === PieceType.KING && p.team !== team) {
      return p;
    }
    return false;
  });
  if (!king) return;
  if (!isTileControlledByAPiece(piece.position, boardState, king.team))
    return false;
  const piecesControllingTheSquare = findPiecesControllingThisSquare(
    boardState,
    king.team,
    piece.position
  );
  if (piecesControllingTheSquare.length > 1) {
    return true;
  }
  const doesKingControlTheSquare = piecesControllingTheSquare.find((p) => {
    if (p.type === PieceType.KING) {
      return true;
    }
    return false;
  });
  if (!doesKingControlTheSquare) {
    return true;
  }
  const doesOurTeamControlTheSquare = findPieceControllingThisSquare(
    boardState,
    team,
    piece.position
  );
  if (doesOurTeamControlTheSquare) {
    return false;
  } else {
    return true;
  }
};

export const isGameOver = (boardState: Piece[], team: TeamType) => {
  let result = false;
  const king = boardState.find((p) => {
    if (p.type === PieceType.KING && p.team !== team) {
      return p;
    }
    return false;
  });
  if (!isKingInCheck(boardState, team) || canEnemyKingMove(boardState, team)) {
    return result;
  }
  let pieceChecking = getPieceGivingCheck(boardState, team);
  if (!pieceChecking || !king) {
    return result;
  }
  if (
    canPieceGetCaptured(boardState, team, pieceChecking) ||
    canCheckGetBlocked(boardState, team)
  ) {
    return result;
  }
  result = true;
  if (result) {
    console.log("THAT IS GAME");
  }
  return result;
};
