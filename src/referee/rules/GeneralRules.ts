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

export const controlledVerticallyByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  for (let checkingYUp = position.y + 1; checkingYUp < 8; checkingYUp++) {
    console.log(`checking X: ${position.x} and Y: ${checkingYUp}`);
    let checkingPosition = { x: position.x, y: checkingYUp };
    if (tileIsOccupiedByUs(checkingPosition, boardState, team)) {
      return false;
    }
    if (
      tileIsOccupiedByOpponent(
        checkingPosition,
        boardState,
        team,
        PieceType.QUEEN
      ) ||
      tileIsOccupiedByOpponent(
        checkingPosition,
        boardState,
        team,
        PieceType.ROOK
      )
    ) {
      return true;
    }
  }

  for (
    let checkingYDown = position.y - 1;
    checkingYDown > -1;
    checkingYDown--
  ) {
    let checkingPosition = { x: position.x, y: checkingYDown };
    console.log(`checking X: ${position.x} and Y: ${checkingYDown}`);
    if (tileIsOccupiedByUs(checkingPosition, boardState, team)) {
      return false;
    }
    if (
      tileIsOccupiedByOpponent(
        checkingPosition,
        boardState,
        team,
        PieceType.QUEEN
      ) ||
      tileIsOccupiedByOpponent(
        checkingPosition,
        boardState,
        team,
        PieceType.ROOK
      )
    ) {
      return true;
    }
  }
  return false;
};

export const tileIsControlledByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  //check vertical control
  if (controlledVerticallyByOpponent(position, boardState, team)) {
    return true;
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
