import { Piece, Position, samePosition, TeamType } from "../../Constants";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
} from "./GeneralRules";

export const rookMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (initialPosition.x === desiredPosition.x) {
    for (let i = 1; i < 8; i++) {
      let multiplier = desiredPosition.y < initialPosition.y ? -1 : 1;

      let passedPosition: Position = {
        x: initialPosition.x,
        y: initialPosition.y + i * multiplier,
      };
      if (samePosition(passedPosition, desiredPosition)) {
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        if (tileIsOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
  }

  if (initialPosition.y === desiredPosition.y) {
    for (let i = 1; i < 8; i++) {
      let multiplier = desiredPosition.x < initialPosition.x ? -1 : 1;

      let passedPosition: Position = {
        x: initialPosition.x + i * multiplier,
        y: initialPosition.y,
      };
      if (samePosition(passedPosition, desiredPosition)) {
        if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        if (tileIsOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
  }
  return false;
};

export const rookControls = (
  currentPosition: Position,
  boardState: Piece[]
) => {
  let tilesControlled = [];
  //vertically
  for (let j = -1; j < 2; j = j + 2) {
    for (let i = 1; i < 8; i++) {
      let controlledPosition: Position = {
        x: currentPosition.x,
        y: currentPosition.y + i * j,
      };
      if (
        tileIsOccupied(controlledPosition, boardState) ||
        controlledPosition.y < 0 ||
        controlledPosition.y > 7
      ) {
        break;
      }
      tilesControlled.push(controlledPosition);
    }
  }
  //horizontally
  for (let j = -1; j < 2; j = j + 2) {
    for (let i = 1; i < 8; i++) {
      let controlledPosition: Position = {
        x: currentPosition.x + i * j,
        y: currentPosition.y,
      };
      if (
        tileIsOccupied(controlledPosition, boardState) ||
        controlledPosition.x < 0 ||
        controlledPosition.x > 7
      ) {
        break;
      }
      tilesControlled.push(controlledPosition);
    }
  }
  return tilesControlled;
};
