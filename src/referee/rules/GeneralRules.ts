import {
  Piece,
  PieceType,
  Position,
  samePosition,
  TeamType,
} from "../../Constants";

export const tileIsOccupied = (
  position: Position,
  boardState: Piece[]
): boolean => {
  const piece = boardState.find((p) => samePosition(p.position, position));

  if (piece) {
    return true;
  } else {
    return false;
  }
};

export const tileIsOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  const piece = boardState.find(
    (p) => samePosition(p.position, position) && p.team !== team
  );

  if (piece) {
    return true;
  } else {
    return false;
  }
};

export const findPiece = (
  boardState: Piece[],
  position: Position,
  type: PieceType,
  team: TeamType
) => {
  const piece = boardState.find(
    (p) =>
      samePosition(p.position, position) && p.team !== team && p.type === type
  );
  return piece;
};

export const tileIsControlledByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  //check vertical control
  for (let checkingY = position.y; checkingY < 8; checkingY++) {
    let checkingPosition = { x: position.x, y: checkingY };
    if (tileIsOccupiedByOpponent(checkingPosition, boardState, team)) {
      const piece = boardState.find(
        (p) => samePosition(p.position, position) && p.team !== team
      );
    }
  }

  return false;
};

export const tileIsEmptyOrOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
) => {
  return (
    !tileIsOccupied(position, boardState) ||
    tileIsOccupiedByOpponent(position, boardState, team)
  );
};

/*
  if(initialPosition.y === desiredPosition.y) {
      for(let i = 1; i < 8; i++) {
        let multiplier = (desiredPosition.x < initialPosition.x) ? -1 : 1;

        let passedPosition: Position = {x: initialPosition.x + (i * multiplier), y: initialPosition.y};
        if(samePosition(passedPosition, desiredPosition)) {
          if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
            return true;
          }
        } else {
          if(tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }
    }
    */
