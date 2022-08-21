import { Piece, PieceType, Position, TeamType } from "../../Constants";
import { isTileOccupied } from "./GeneralRules";
import { findPieceInSpecificPosition } from "./GeneralRules";

export const tilesControlled = (
  currentPosition: Position,
  pieceType: PieceType,
  boardState: Piece[],
  team: TeamType
) => {
  let oppositeTeam = team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
  let tilesControlled = [];
  let canPieceMoveVerticallyOrHorizontally = false;
  let canPieceMoveDiagonally = false;
  let isPieceAKnight = false;
  let isPieceAKing = false;
  let isPieceAPawn = false;
  let multiplier = team === TeamType.WHITE ? 1 : -1;
  if (pieceType === PieceType.QUEEN || pieceType === PieceType.ROOK) {
    canPieceMoveVerticallyOrHorizontally = true;
  }
  if (pieceType === PieceType.QUEEN || pieceType === PieceType.BISHOP) {
    canPieceMoveDiagonally = true;
  }
  if (pieceType === PieceType.KNIGHT) {
    isPieceAKnight = true;
  }
  if (pieceType === PieceType.KING) {
    isPieceAKing = true;
  }
  if (pieceType === PieceType.PAWN) {
    isPieceAPawn = true;
  }
  //vertically
  if (canPieceMoveVerticallyOrHorizontally) {
    for (let j = -1; j < 2; j = j + 2) {
      for (let i = 1; i < 8; i++) {
        let controlledPosition: Position = {
          x: currentPosition.x,
          y: currentPosition.y + i * j,
        };
        if (controlledPosition.y < 0 || controlledPosition.y > 7) {
          break;
        }
        tilesControlled.push(controlledPosition);
        if (isTileOccupied(controlledPosition, boardState)) {
          let piece = findPieceInSpecificPosition(
            boardState,
            controlledPosition,
            oppositeTeam,
            PieceType.KING
          );
          if (piece?.type !== PieceType.KING) {
            break;
          }
        }
      }
    }
    //horizontally
    for (let j = -1; j < 2; j = j + 2) {
      for (let i = 1; i < 8; i++) {
        let controlledPosition: Position = {
          x: currentPosition.x + i * j,
          y: currentPosition.y,
        };
        if (controlledPosition.x < 0 || controlledPosition.x > 7) {
          break;
        }
        tilesControlled.push(controlledPosition);
        if (isTileOccupied(controlledPosition, boardState)) {
          let piece = findPieceInSpecificPosition(
            boardState,
            controlledPosition,
            oppositeTeam,
            PieceType.KING
          );
          if (piece?.type !== PieceType.KING) {
            break;
          }
        }
      }
    }
  }
  //diagonally
  if (canPieceMoveDiagonally) {
    for (let j = -1; j < 2; j = j + 2) {
      for (let i = 1; i < 8; i++) {
        let controlledPosition: Position = {
          x: currentPosition.x + i * j,
          y: currentPosition.y + i * j,
        };
        if (
          controlledPosition.x < 0 ||
          controlledPosition.x > 7 ||
          controlledPosition.y < 0 ||
          controlledPosition.y > 7
        ) {
          break;
        }
        tilesControlled.push(controlledPosition);
        if (isTileOccupied(controlledPosition, boardState)) {
          let piece = findPieceInSpecificPosition(
            boardState,
            controlledPosition,
            oppositeTeam,
            PieceType.KING
          );
          if (piece?.type !== PieceType.KING) {
            break;
          }
        }
      }
    }
    for (let j = -1; j < 2; j = j + 2) {
      for (let i = 1; i < 8; i++) {
        let controlledPosition: Position = {
          x: currentPosition.x + i * j * -1,
          y: currentPosition.y + i * j,
        };
        if (
          controlledPosition.x < 0 ||
          controlledPosition.x > 7 ||
          controlledPosition.y < 0 ||
          controlledPosition.y > 7
        ) {
          break;
        }
        tilesControlled.push(controlledPosition);
        if (isTileOccupied(controlledPosition, boardState)) {
          let piece = findPieceInSpecificPosition(
            boardState,
            controlledPosition,
            oppositeTeam,
            PieceType.KING
          );
          if (piece?.type !== PieceType.KING) {
            break;
          }
        }
      }
    }
  }
  //knight controls
  if (isPieceAKnight) {
    for (let i = -1; i < 2; i += 2) {
      for (let j = -1; j < 2; j += 2) {
        //TOP AND BOTTOM SIDE MOVEMENT
        let controlledPosition: Position = {
          x: currentPosition.x + j,
          y: currentPosition.y + 2 * i,
        };
        if (
          !(
            controlledPosition.x < 0 ||
            controlledPosition.x > 7 ||
            controlledPosition.y < 0 ||
            controlledPosition.y > 7
          )
        ) {
          tilesControlled.push(controlledPosition);
        }
        //RIGHT AND LEFT SIDE MOVEMENT
        let controlledPosition2: Position = {
          x: currentPosition.x + 2 * i,
          y: currentPosition.y + j,
        };
        if (
          !(
            controlledPosition2.x < 0 ||
            controlledPosition2.x > 7 ||
            controlledPosition2.y < 0 ||
            controlledPosition2.y > 7
          )
        ) {
          tilesControlled.push(controlledPosition2);
        }
      }
    }
  }

  if (isPieceAKing) {
    for (let j = -1; j < 2; j = j + 2) {
      let controlledPosition: Position = {
        x: currentPosition.x + 1 * j,
        y: currentPosition.y + 1 * j,
      };
      if (
        controlledPosition.x < 0 ||
        controlledPosition.x > 7 ||
        controlledPosition.y < 0 ||
        controlledPosition.y > 7
      ) {
        continue;
      }
      tilesControlled.push(controlledPosition);
    }
    for (let j = -1; j < 2; j = j + 2) {
      let controlledPosition: Position = {
        x: currentPosition.x - 1 * j,
        y: currentPosition.y + 1 * j,
      };
      if (
        controlledPosition.x < 0 ||
        controlledPosition.x > 7 ||
        controlledPosition.y < 0 ||
        controlledPosition.y > 7
      ) {
        continue;
      }
      tilesControlled.push(controlledPosition);
    }

    for (let j = -1; j < 2; j = j + 2) {
      let controlledPosition: Position = {
        x: currentPosition.x,
        y: currentPosition.y + 1 * j,
      };
      if (
        controlledPosition.x < 0 ||
        controlledPosition.x > 7 ||
        controlledPosition.y < 0 ||
        controlledPosition.y > 7
      ) {
        continue;
      }
      tilesControlled.push(controlledPosition);
    }
    for (let j = -1; j < 2; j = j + 2) {
      let controlledPosition: Position = {
        x: currentPosition.x + 1 * j,
        y: currentPosition.y,
      };
      if (
        controlledPosition.x < 0 ||
        controlledPosition.x > 7 ||
        controlledPosition.y < 0 ||
        controlledPosition.y > 7
      ) {
        continue;
      }
      tilesControlled.push(controlledPosition);
    }
  }
  if (isPieceAPawn) {
    for (let j = -1; j < 2; j = j + 2) {
      let controlledPosition: Position = {
        x: currentPosition.x + 1 * j,
        y: currentPosition.y + 1 * multiplier,
      };

      if (controlledPosition.x < 0 || controlledPosition.x > 7) {
        continue;
      }
      tilesControlled.push(controlledPosition);
    }
  }
  return tilesControlled;
};
