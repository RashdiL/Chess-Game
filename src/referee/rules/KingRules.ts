import { Piece, Position, samePosition, TeamType } from "../../Constants";
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
      if (isTileOccupied(passedPosition, boardState, team)) {
        break;
      }
      if (
        tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team) &&
        !isTileControlledByAPiece(desiredPosition, boardState, oppositeTeam)
      ) {
        console.log(
          "tile is not controlled by opponent, contains an enemy piece, or it is empty"
        );
        return true;
      }
    }
  }

  return false;
};
