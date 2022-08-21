import {
  Piece,
  PieceType,
  Position,
  samePosition,
  TeamType,
} from "../../Constants";

export const isTileOccupied = (
  position: Position,
  boardState: Piece[],
  team?: TeamType
): boolean => {
  let piece = findPieceInSpecificPosition(boardState, position, team);
  if (piece) {
    return true;
  } else {
    return false;
  }
};

export const findPieceInSpecificPosition = (
  boardState: Piece[],
  position: Position,
  team?: TeamType,
  type?: PieceType
) => {
  if (!team && !type) {
    const piece = boardState.find((p) => samePosition(p.position, position));
    return piece;
  }
  if (team && type) {
    const piece = boardState.find(
      (p) =>
        samePosition(p.position, position) && p.team === team && p.type === type
    );
    return piece;
  }
  if (type) {
    const piece = boardState.find(
      (p) => samePosition(p.position, position) && p.type === type
    );
    return piece;
  } else {
    const piece = boardState.find(
      (p) => samePosition(p.position, position) && p.team === team
    );
    return piece;
  }
};

export const isTileControlledByAPiece = (
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
          boardState[i].team === team
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
  let oppositeTeam = team === TeamType.BLACK ? TeamType.WHITE : TeamType.BLACK;
  return (
    !isTileOccupied(position, boardState) ||
    isTileOccupied(position, boardState, oppositeTeam)
  );
};
