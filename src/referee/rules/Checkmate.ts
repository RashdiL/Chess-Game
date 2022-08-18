import {
  findPieceControllingThisSquare,
  Piece,
  PieceType,
  Position,
  TeamType,
} from "../../Constants";
import { tileIsControlledByOpponent, tileIsOccupied } from "./GeneralRules";
export const isKingInCheck = (boardState: Piece[], team: TeamType) => {
  const king = boardState.find((p) => {
    if (p.type === PieceType.KING && p.team !== team) {
      return p;
    }
    return false;
  });
  if (
    king &&
    tileIsControlledByOpponent(king?.position, boardState, king.team)
  ) {
    console.log("CHECK");
    return true;
  }
  return false;
};
export function getPieceGivingCheck(boardState: Piece[], team: TeamType) {
  const king = boardState.find((p) => {
    if (p.type === PieceType.KING && p.team !== team) {
      return p;
    }
    return false;
  });
  if (
    king &&
    tileIsControlledByOpponent(king?.position, boardState, king.team)
  ) {
    let pieceChecking = findPieceControllingThisSquare(
      boardState,
      team,
      king.position
    );
    return pieceChecking;
  }
  return false;
}
//this must execute before the "enemy" gets to play or right after the player with the legal turn plays a legal move.
export function isCheckHorizontalVerticalOrDiagonal(
  boardState: Piece[],
  team: TeamType
) {
  let checkType = "";
  console.log("searching");
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
export const canKingMove = (boardState: Piece[], team: TeamType) => {
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
        !tileIsControlledByOpponent(checkingPosition, boardState, king.team) &&
        !tileIsOccupied(checkingPosition, boardState)
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
          !tileIsControlledByOpponent(
            checkingPosition,
            boardState,
            king.team
          ) &&
          !tileIsOccupied(checkingPosition, boardState)
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
          !tileIsControlledByOpponent(
            checkingPosition,
            boardState,
            king.team
          ) &&
          !tileIsOccupied(checkingPosition, boardState)
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
          !tileIsControlledByOpponent(
            checkingPosition,
            boardState,
            king.team
          ) &&
          !tileIsOccupied(checkingPosition, boardState)
        ) {
          kingCanMove = true;
          break;
        }
      }
    }
  }
  if (!kingCanMove) {
    console.log("King can't move.");
  }
  return kingCanMove;
};

export const canPieceGetCaptured = (
  boardState: Piece[],
  team: TeamType,
  piece: Piece
) => {
  if (tileIsControlledByOpponent(piece.position, boardState, team)) {
    return true;
  }
  return false;
};
export const isGameOver = (boardState: Piece[], team: TeamType) => {
  let result = false;
  console.log(isCheckHorizontalVerticalOrDiagonal(boardState, team));
  if (!isKingInCheck(boardState, team) || canKingMove(boardState, team)) {
    return result;
  }
  let pieceChecking = getPieceGivingCheck(boardState, team);
  if (pieceChecking && canPieceGetCaptured(boardState, team, pieceChecking)) {
    return result;
  }
  result = true;
  console.log("that's game");
  return result;
};
