import { Piece, Position, samePosition, TeamType } from "../../Constants";
import { isKingInCheck } from "./Check";
import {
  tileIsEmptyOrOccupiedByOpponent,
  isTileOccupied,
  isTileControlledByAPiece,
} from "./GeneralRules";

export const kingMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  let oppositeTeam = team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
  for (let i = 1; i < 2; i++) {
    //Diagonal
    let multiplierX =
      desiredPosition.x < initialPosition.x
        ? -1
        : desiredPosition.x > initialPosition.x
        ? 1
        : 0;
    let multiplierY =
      desiredPosition.y < initialPosition.y
        ? -1
        : desiredPosition.y > initialPosition.y
        ? 1
        : 0;

    let passedPosition: Position = {
      x: initialPosition.x + i * multiplierX,
      y: initialPosition.y + i * multiplierY,
    };

    if (samePosition(passedPosition, desiredPosition)) {
      if (
        tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team) &&
        !isTileControlledByAPiece(desiredPosition, boardState, oppositeTeam)
      ) {
        return true;
      }
    } else {
      if (isTileOccupied(passedPosition, boardState)) {
        break;
      }
    }
  }

  return false;
};

export const doesKingHaveToMove = (
  boardState: Piece[],
  team: TeamType
): boolean => {
  const oppositeTeam =
    team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
  if (isKingInCheck(boardState, oppositeTeam)) return true;
  return false;
};
