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
  team: TeamType,
  type?: PieceType
): boolean => {
  const piece = findEnemyPiece(boardState, position, team, type);

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
  let controlled = false;
  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i].tilesControlled) {
      for (let j = 0; j < boardState[i].tilesControlled.length; j++) {
        if (
          samePosition(position, boardState[i].tilesControlled[j]) &&
          boardState[i].team !== team
        ) {
          controlled = true;
          break;
        }
      }
      if (controlled) {
        break;
      }
    }
  }
  return controlled;
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
