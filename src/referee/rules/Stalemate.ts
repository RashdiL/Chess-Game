import { Piece, PieceType, Position, TeamType } from "../../Constants";
import { isKingInCheck } from "./Check";
import { isTileControlledByAPiece, isTileOccupied } from "./GeneralRules";
function canKingMove(
  initialPosition: Position,
  boardState: Piece[],
  team: TeamType
) {
  const enemyTeam = team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
  for (let j = -1; j < 2; j = j + 2) {
    let checkingPosition: Position = {
      x: initialPosition.x + 1 * j,
      y: initialPosition.y + 1 * j,
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
      !isTileControlledByAPiece(checkingPosition, boardState, enemyTeam) &&
      !isTileOccupied(checkingPosition, boardState, team)
    ) {
      return true;
    }
  }
  for (let j = -1; j < 2; j = j + 2) {
    let checkingPosition: Position = {
      x: initialPosition.x - 1 * j,
      y: initialPosition.y + 1 * j,
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
      !isTileControlledByAPiece(checkingPosition, boardState, enemyTeam) &&
      !isTileOccupied(checkingPosition, boardState, team)
    ) {
      return true;
    }
  }

  for (let j = -1; j < 2; j = j + 2) {
    let checkingPosition: Position = {
      x: initialPosition.x,
      y: initialPosition.y + 1 * j,
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
      !isTileControlledByAPiece(checkingPosition, boardState, enemyTeam) &&
      !isTileOccupied(checkingPosition, boardState, team)
    ) {
      return true;
    }
  }
  for (let j = -1; j < 2; j = j + 2) {
    let checkingPosition: Position = {
      x: initialPosition.x + 1 * j,
      y: initialPosition.y,
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
      !isTileControlledByAPiece(checkingPosition, boardState, enemyTeam) &&
      !isTileOccupied(checkingPosition, boardState, team)
    ) {
      return true;
    }
  }
  return false;
}
function canQueenMove(
  initialPosition: Position,
  team: TeamType,
  boardState: Piece[]
) {
  for (let i = -1; i < 2; i = i + 2) {
    for (let j = 1; j < 8; j++) {
      let checkingPosition: Position = {
        x: initialPosition.x + 1 * j * i,
        y: initialPosition.y + 1 * j * i,
      };
      if (
        checkingPosition.x < 0 ||
        checkingPosition.x > 7 ||
        checkingPosition.y < 0 ||
        checkingPosition.y > 7
      ) {
        continue;
      }
      if (!isTileOccupied(checkingPosition, boardState, team)) {
        return true;
      }
    }
    for (let j = 1; j < 8; j++) {
      let checkingPosition: Position = {
        x: initialPosition.x - 1 * j * i,
        y: initialPosition.y + 1 * j * i,
      };
      if (
        checkingPosition.x < 0 ||
        checkingPosition.x > 7 ||
        checkingPosition.y < 0 ||
        checkingPosition.y > 7
      ) {
        continue;
      }
      if (!isTileOccupied(checkingPosition, boardState, team)) {
        return true;
      }
    }
    for (let j = 1; j < 8; j++) {
      let checkingPosition: Position = {
        x: initialPosition.x,
        y: initialPosition.y + 1 * j * i,
      };
      if (
        checkingPosition.x < 0 ||
        checkingPosition.x > 7 ||
        checkingPosition.y < 0 ||
        checkingPosition.y > 7
      ) {
        continue;
      }
      if (!isTileOccupied(checkingPosition, boardState, team)) {
        return true;
      }
    }
    for (let j = 1; j < 8; j++) {
      let checkingPosition: Position = {
        x: initialPosition.x + 1 * j * i,
        y: initialPosition.y,
      };
      if (
        checkingPosition.x < 0 ||
        checkingPosition.x > 7 ||
        checkingPosition.y < 0 ||
        checkingPosition.y > 7
      ) {
        continue;
      }
      if (!isTileOccupied(checkingPosition, boardState, team)) {
        return true;
      }
    }
  }
  return false;
}
function canRookMove(
  initialPosition: Position,
  team: TeamType,
  boardState: Piece[]
) {
  for (let i = -1; i < 2; i = i + 2) {
    for (let j = 1; j < 8; j++) {
      let checkingPosition: Position = {
        x: initialPosition.x,
        y: initialPosition.y + 1 * j * i,
      };
      if (
        checkingPosition.x < 0 ||
        checkingPosition.x > 7 ||
        checkingPosition.y < 0 ||
        checkingPosition.y > 7
      ) {
        continue;
      }
      if (!isTileOccupied(checkingPosition, boardState, team)) {
        return true;
      }
    }
    for (let j = 1; j < 8; j++) {
      let checkingPosition: Position = {
        x: initialPosition.x + 1 * j * i,
        y: initialPosition.y,
      };
      if (
        checkingPosition.x < 0 ||
        checkingPosition.x > 7 ||
        checkingPosition.y < 0 ||
        checkingPosition.y > 7
      ) {
        continue;
      }
      if (!isTileOccupied(checkingPosition, boardState, team)) {
        return true;
      }
    }
  }
  return false;
}
function canBishopMove(
  initialPosition: Position,
  team: TeamType,
  boardState: Piece[]
) {
  for (let i = -1; i < 2; i = i + 2) {
    for (let j = 1; j < 8; j++) {
      let checkingPosition: Position = {
        x: initialPosition.x + 1 * j * i,
        y: initialPosition.y + 1 * j * i,
      };
      if (
        checkingPosition.x < 0 ||
        checkingPosition.x > 7 ||
        checkingPosition.y < 0 ||
        checkingPosition.y > 7
      ) {
        continue;
      }
      if (!isTileOccupied(checkingPosition, boardState, team)) {
        return true;
      }
    }
    for (let j = 1; j < 8; j++) {
      let checkingPosition: Position = {
        x: initialPosition.x - 1 * j * i,
        y: initialPosition.y + 1 * j * i,
      };
      if (
        checkingPosition.x < 0 ||
        checkingPosition.x > 7 ||
        checkingPosition.y < 0 ||
        checkingPosition.y > 7
      ) {
        continue;
      }
      if (!isTileOccupied(checkingPosition, boardState, team)) {
        return true;
      }
    }
  }
  return false;
}
function canKnightMove(
  currentPosition: Position,
  team: TeamType,
  boardState: Piece[]
) {
  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      //TOP AND BOTTOM SIDE MOVEMENT
      let checkingPosition: Position = {
        x: currentPosition.x + j,
        y: currentPosition.y + 2 * i,
      };
      if (
        !(
          checkingPosition.x < 0 ||
          checkingPosition.x > 7 ||
          checkingPosition.y < 0 ||
          checkingPosition.y > 7
        )
      ) {
        if (!isTileOccupied(checkingPosition, boardState, team)) {
          return true;
        }
      }
      //RIGHT AND LEFT SIDE MOVEMENT
      let checkingPosition2: Position = {
        x: currentPosition.x + 2 * i,
        y: currentPosition.y + j,
      };
      if (
        !(
          checkingPosition2.x < 0 ||
          checkingPosition2.x > 7 ||
          checkingPosition2.y < 0 ||
          checkingPosition2.y > 7
        )
      ) {
        if (!isTileOccupied(checkingPosition2, boardState, team)) {
          return true;
        }
      }
    }
  }
  return false;
}
function canPawnMove(
  currentPosition: Position,
  team: TeamType,
  boardState: Piece[]
) {
  let multiplier = team === TeamType.WHITE ? 1 : -1;
  for (let j = -1; j < 2; j = j + 2) {
    let checkingPosition: Position = {
      x: currentPosition.x + 1 * j,
      y: currentPosition.y + 1 * multiplier,
    };

    if (checkingPosition.x < 0 || checkingPosition.x > 7) {
      continue;
    }
    if (!isTileOccupied(checkingPosition, boardState, team)) {
      return true;
    }
  }
  return false;
}
export function isItStalemate(boardState: Piece[], team: TeamType) {
  if (isKingInCheck(boardState, team)) {
    return false;
  }
  let canMove = false;
  boardState.every((p) => {
    if (p.team !== team) {
      return true;
    }
    switch (p.type) {
      case PieceType.PAWN:
        canMove = canPawnMove(p.position, team, boardState);
        break;
      case PieceType.KNIGHT:
        canMove = canKnightMove(p.position, team, boardState);
        break;
      case PieceType.BISHOP:
        canMove = canBishopMove(p.position, team, boardState);
        break;
      case PieceType.ROOK:
        canRookMove(p.position, team, boardState);
        canMove = canRookMove(p.position, team, boardState);
        break;
      case PieceType.QUEEN:
        canQueenMove(p.position, team, boardState);
        canMove = canQueenMove(p.position, team, boardState);
        break;
      case PieceType.KING:
        canMove = canKingMove(p.position, boardState, team);
        break;
    }
    if (canMove === true) return false;
    return true;
  });
  return !canMove;
}
