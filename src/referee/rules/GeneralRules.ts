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
  const piece = findEnemyPiece(boardState, position, team);

  if (piece) {
    return true;
  } else {
    return false;
  }
};

export const tileIsOccupiedByUs = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  const piece = findOURPiece(boardState, position, team);

  if (piece) {
    return true;
  } else {
    return false;
  }
};

export const findEnemyPiece = (
  boardState: Piece[],
  position: Position,
  OURteam: TeamType,
  type?: PieceType
) => {
  if (type) {
    const piece = boardState.find(
      (p) =>
        samePosition(p.position, position) &&
        p.team !== OURteam &&
        p.type === type
    );
    return piece;
  } else {
    const piece = boardState.find(
      (p) => samePosition(p.position, position) && p.team !== OURteam
    );
    return piece;
  }
};

export const findOURPiece = (
  boardState: Piece[],
  position: Position,
  OURteam: TeamType,
  type?: PieceType
) => {
  if (type) {
    const piece = boardState.find(
      (p) =>
        samePosition(p.position, position) &&
        p.team === OURteam &&
        p.type === type
    );
    return piece;
  } else {
    const piece = boardState.find(
      (p) => samePosition(p.position, position) && p.team === OURteam
    );
    return piece;
  }
};

export const tileIsControlledByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  //check vertical control
  for (let checkingY = position.y + 1; checkingY < 8; checkingY++) {
    console.log(`Checking X: ${position.x} and Y: ${checkingY}`);
    let checkingPosition = { x: position.x, y: checkingY };
    if (tileIsOccupiedByUs(checkingPosition, boardState, team)) {
      console.log(
        `We have a piece on X: ${checkingPosition.x} Y: ${checkingPosition.y}`
      );
      return false;
    }
    if (tileIsOccupiedByOpponent(checkingPosition, boardState, team)) {
      const Pieces_to_Look_For = [PieceType.QUEEN, PieceType.ROOK];
      for (let i = 0; i < Pieces_to_Look_For.length; i++) {
        if (
          findEnemyPiece(
            boardState,
            checkingPosition,
            team,
            Pieces_to_Look_For[i]
          )
        ) {
          console.log(Pieces_to_Look_For[i]);
          console.log(
            `There's a queen on X: ${checkingPosition.x} and Y: ${checkingPosition.y}`
          );
          return true;
        }
      }
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
