import { Piece, Position, TeamType } from "../../Constants";
import { isTileOccupied } from "./GeneralRules";

export const pawnMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  let oppositeTeam = team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
  const specialRow = team === TeamType.WHITE ? 1 : 6;
  const pawnDirection = team === TeamType.WHITE ? 1 : -1;

  //MOVEMENT LOGIC
  if (
    initialPosition.x === desiredPosition.x &&
    initialPosition.y === specialRow &&
    desiredPosition.y - initialPosition.y === 2 * pawnDirection
  ) {
    if (
      !isTileOccupied(desiredPosition, boardState) &&
      !isTileOccupied(
        { x: desiredPosition.x, y: desiredPosition.y - pawnDirection },
        boardState
      )
    ) {
      return true;
    }
  } else if (
    initialPosition.x === desiredPosition.x &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    if (!isTileOccupied(desiredPosition, boardState)) {
      return true;
    }
  }
  //ATTACK LOGIC
  else if (
    desiredPosition.x - initialPosition.x === -1 &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    //ATTACK IN UPPER OR BOTTOM LEFT CORNER
    if (isTileOccupied(desiredPosition, boardState, oppositeTeam)) {
      return true;
    }
  } else if (
    desiredPosition.x - initialPosition.x === 1 &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    //ATTACK IN THE UPPER OR BOTTOM RIGHT CORNER
    if (isTileOccupied(desiredPosition, boardState, oppositeTeam)) {
      return true;
    }
  }

  return false;
};
