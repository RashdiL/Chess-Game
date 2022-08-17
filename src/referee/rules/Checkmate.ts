import { Piece, PieceType, Position, TeamType } from "../../Constants";
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
//this must execute before the "enemy" gets to play or right after the player with the legal turn plays a legal move.
export const isGameOver = (boardState: Piece[], team: TeamType) => {
  if (isKingInCheck(boardState, team)) {
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
      console.log("CHECKMATE!");
    }
    return kingCanMove;
  }
  return false;
};
