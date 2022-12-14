import { tilesControlled } from "./referee/rules/tilesControlled";
export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const GRID_SIZE = 100;
export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING,
}
export interface PieceValue {
  pieceType: PieceType;
  value: number;
}
export function samePosition(p1: Position, p2: Position) {
  return p1.x === p2.x && p1.y === p2.y;
}
export interface moveHistory {
  piece: Piece;
  prevPosition: Position;
  newPosition: Position;
  newAnnotatedPosition: string;
}
export function setBoard(
  boardState: Piece[],
  initialPosition: Position,
  desiredPosition: Position
) {
  let piecesCopy = JSON.parse(JSON.stringify(boardState));
  const potentialBoardState = piecesCopy.reduce(
    (results: Piece[], piece: Piece) => {
      if (samePosition(piece.position, initialPosition)) {
        piece.position = desiredPosition;
        results.push(piece);
      } else if (!samePosition(piece.position, desiredPosition)) {
        if (piece.type === PieceType.PAWN) {
          piece.enPassant = false;
        }
        results.push(piece);
      }

      return results;
    },
    [] as Piece[]
  );
  potentialBoardState.forEach((p: Piece) => {
    p.tilesControlled = tilesControlled(
      p.position,
      p.type,
      potentialBoardState,
      p.team
    );
  });
  return potentialBoardState;
}
export function findPieceControllingThisSquare(
  boardState: Piece[],
  team: TeamType,
  position: Position
) {
  for (let i = 0; i < boardState.length; i++) {
    let piece = boardState[i];
    if (piece.tilesControlled) {
      for (let j = 0; j < piece.tilesControlled.length; j++) {
        if (
          samePosition(position, piece.tilesControlled[j]) &&
          piece.team === team
        ) {
          return piece;
        }
      }
    }
  }
  return false;
}

export interface Position {
  x: number;
  y: number;
}
export function findPiecesControllingThisSquare(
  boardState: Piece[],
  team: TeamType,
  position: Position
) {
  let piecesControllingTheSquare: Piece[] = [];
  for (let i = 0; i < boardState.length; i++) {
    let piece = boardState[i];
    if (piece.tilesControlled) {
      for (let j = 0; j < piece.tilesControlled.length; j++) {
        if (
          samePosition(position, piece.tilesControlled[j]) &&
          piece.team === team
        ) {
          piecesControllingTheSquare.push(piece);
        }
      }
    }
  }
  return piecesControllingTheSquare;
}
export interface castlingPieceMoveHistory {
  didWhiteKingMove: boolean;
  didBlackKingMove: boolean;
  didWQueenRookMove: boolean;
  didBQueenRookMove: boolean;
  didWKingRookMove: boolean;
  didBKingRookMove: boolean;
}

export enum TeamType {
  BLACK,
  WHITE,
}

export interface Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  enPassant?: boolean;
  tilesControlled: Array<Position>;
}
export const initialCastlingState: castlingPieceMoveHistory = {
  didWhiteKingMove: false,
  didBlackKingMove: false,
  didWQueenRookMove: false,
  didBQueenRookMove: false,
  didWKingRookMove: false,
  didBKingRookMove: false,
};
export const initialBoardState: Piece[] = [
  {
    image: `assets/images/rook_b.png`,
    position: {
      x: 0,
      y: 7,
    },
    type: PieceType.ROOK,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 1, y: 7 },
      { x: 0, y: 6 },
    ],
  },
  {
    image: `assets/images/knight_b.png`,
    position: {
      x: 1,
      y: 7,
    },
    type: PieceType.KNIGHT,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 0, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 6 },
    ],
  },
  {
    image: `assets/images/bishop_b.png`,
    position: {
      x: 2,
      y: 7,
    },
    type: PieceType.BISHOP,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 1, y: 6 },
      { x: 3, y: 6 },
    ],
  },
  {
    image: `assets/images/queen_b.png`,
    position: {
      x: 3,
      y: 7,
    },
    type: PieceType.QUEEN,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 2, y: 6 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 2, y: 7 },
      { x: 4, y: 7 },
    ],
  },
  {
    image: `assets/images/king_b.png`,
    position: {
      x: 4,
      y: 7,
    },
    type: PieceType.KING,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 3, y: 7 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 5, y: 7 },
    ],
  },
  {
    image: `assets/images/bishop_b.png`,
    position: {
      x: 5,
      y: 7,
    },
    type: PieceType.BISHOP,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 4, y: 6 },
      { x: 6, y: 6 },
    ],
  },
  {
    image: `assets/images/knight_b.png`,
    position: {
      x: 6,
      y: 7,
    },
    type: PieceType.KNIGHT,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 7, y: 5 },
      { x: 5, y: 5 },
      { x: 4, y: 6 },
    ],
  },
  {
    image: `assets/images/rook_b.png`,
    position: {
      x: 7,
      y: 7,
    },
    type: PieceType.ROOK,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 7, y: 6 },
      { x: 6, y: 7 },
    ],
  },
  {
    image: `assets/images/pawn_b.png`,
    position: {
      x: 0,
      y: 6,
    },
    type: PieceType.PAWN,
    team: TeamType.BLACK,
    tilesControlled: [{ x: 1, y: 5 }],
  },
  {
    image: `assets/images/pawn_b.png`,
    position: {
      x: 1,
      y: 6,
    },
    type: PieceType.PAWN,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 0, y: 5 },
      { x: 2, y: 5 },
    ],
  },
  {
    image: `assets/images/pawn_b.png`,
    position: {
      x: 2,
      y: 6,
    },
    type: PieceType.PAWN,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 1, y: 5 },
      { x: 3, y: 5 },
    ],
  },
  {
    image: `assets/images/pawn_b.png`,
    position: {
      x: 3,
      y: 6,
    },
    type: PieceType.PAWN,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 2, y: 5 },
      { x: 4, y: 5 },
    ],
  },
  {
    image: `assets/images/pawn_b.png`,
    position: {
      x: 4,
      y: 6,
    },
    type: PieceType.PAWN,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 3, y: 5 },
      { x: 5, y: 5 },
    ],
  },
  {
    image: `assets/images/pawn_b.png`,
    position: {
      x: 5,
      y: 6,
    },
    type: PieceType.PAWN,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 4, y: 5 },
      { x: 6, y: 5 },
    ],
  },
  {
    image: `assets/images/pawn_b.png`,
    position: {
      x: 6,
      y: 6,
    },
    type: PieceType.PAWN,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 5, y: 5 },
      { x: 7, y: 5 },
    ],
  },
  {
    image: `assets/images/pawn_b.png`,
    position: {
      x: 7,
      y: 6,
    },
    type: PieceType.PAWN,
    team: TeamType.BLACK,
    tilesControlled: [{ x: 6, y: 5 }],
  },

  {
    image: `assets/images/rook_w.png`,
    position: {
      x: 0,
      y: 0,
    },
    type: PieceType.ROOK,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ],
  },
  {
    image: `assets/images/knight_w.png`,
    position: {
      x: 1,
      y: 0,
    },
    type: PieceType.KNIGHT,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 0, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 1 },
    ],
  },
  {
    image: `assets/images/bishop_w.png`,
    position: {
      x: 2,
      y: 0,
    },
    type: PieceType.BISHOP,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
    ],
  },
  {
    image: `assets/images/queen_w.png`,
    position: {
      x: 3,
      y: 0,
    },
    type: PieceType.QUEEN,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 0 },
    ],
  },
  {
    image: `assets/images/king_w.png`,
    position: {
      x: 4,
      y: 0,
    },
    type: PieceType.KING,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 5, y: 0 },
    ],
  },
  {
    image: `assets/images/bishop_w.png`,
    position: {
      x: 5,
      y: 0,
    },
    type: PieceType.BISHOP,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 4, y: 1 },
      { x: 6, y: 1 },
    ],
  },
  {
    image: `assets/images/knight_w.png`,
    position: {
      x: 6,
      y: 0,
    },
    type: PieceType.KNIGHT,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 7, y: 2 },
      { x: 5, y: 2 },
      { x: 4, y: 1 },
    ],
  },
  {
    image: `assets/images/rook_w.png`,
    position: {
      x: 7,
      y: 0,
    },
    type: PieceType.ROOK,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 7, y: 1 },
      { x: 6, y: 0 },
    ],
  },
  {
    image: `assets/images/pawn_w.png`,
    position: {
      x: 0,
      y: 1,
    },
    type: PieceType.PAWN,
    team: TeamType.WHITE,
    tilesControlled: [{ x: 1, y: 2 }],
  },
  {
    image: `assets/images/pawn_w.png`,
    position: {
      x: 1,
      y: 1,
    },
    type: PieceType.PAWN,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 0, y: 1 },
      { x: 2, y: 0 },
    ],
  },
  {
    image: `assets/images/pawn_w.png`,
    position: {
      x: 2,
      y: 1,
    },
    type: PieceType.PAWN,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 1, y: 1 },
      { x: 3, y: 0 },
    ],
  },
  {
    image: `assets/images/pawn_w.png`,
    position: {
      x: 3,
      y: 1,
    },
    type: PieceType.PAWN,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 2, y: 1 },
      { x: 4, y: 0 },
    ],
  },
  {
    image: `assets/images/pawn_w.png`,
    position: {
      x: 4,
      y: 1,
    },
    type: PieceType.PAWN,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 3, y: 1 },
      { x: 5, y: 0 },
    ],
  },
  {
    image: `assets/images/pawn_w.png`,
    position: {
      x: 5,
      y: 1,
    },
    type: PieceType.PAWN,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 4, y: 1 },
      { x: 6, y: 0 },
    ],
  },
  {
    image: `assets/images/pawn_w.png`,
    position: {
      x: 6,
      y: 1,
    },
    type: PieceType.PAWN,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 5, y: 1 },
      { x: 7, y: 0 },
    ],
  },
  {
    image: `assets/images/pawn_w.png`,
    position: {
      x: 7,
      y: 1,
    },
    type: PieceType.PAWN,
    team: TeamType.WHITE,
    tilesControlled: [{ x: 6, y: 1 }],
  },
];

export const initialBoardStateForTesting: Piece[] = [
  {
    image: `assets/images/rook_b.png`,
    position: {
      x: 0,
      y: 7,
    },
    type: PieceType.ROOK,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 1, y: 7 },
      { x: 0, y: 6 },
    ],
  },
  {
    image: `assets/images/queen_b.png`,
    position: {
      x: 3,
      y: 7,
    },
    type: PieceType.QUEEN,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 2, y: 6 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 2, y: 7 },
      { x: 4, y: 7 },
    ],
  },
  {
    image: `assets/images/king_b.png`,
    position: {
      x: 4,
      y: 7,
    },
    type: PieceType.KING,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 3, y: 7 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 5, y: 7 },
    ],
  },
  {
    image: `assets/images/rook_b.png`,
    position: {
      x: 7,
      y: 7,
    },
    type: PieceType.ROOK,
    team: TeamType.BLACK,
    tilesControlled: [
      { x: 7, y: 6 },
      { x: 6, y: 7 },
    ],
  },

  {
    image: `assets/images/rook_w.png`,
    position: {
      x: 0,
      y: 0,
    },
    type: PieceType.ROOK,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ],
  },
  {
    image: `assets/images/queen_w.png`,
    position: {
      x: 3,
      y: 0,
    },
    type: PieceType.QUEEN,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 0 },
    ],
  },
  {
    image: `assets/images/king_w.png`,
    position: {
      x: 4,
      y: 0,
    },
    type: PieceType.KING,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 5, y: 0 },
    ],
  },
  {
    image: `assets/images/rook_w.png`,
    position: {
      x: 7,
      y: 0,
    },
    type: PieceType.ROOK,
    team: TeamType.WHITE,
    tilesControlled: [
      { x: 7, y: 1 },
      { x: 6, y: 0 },
    ],
  },
];

export function isPlayerTryingToCastle(
  currentPiece: Piece,
  desiredPosition: Position,
  team: TeamType
) {
  let castlingY = team === TeamType.WHITE ? 0 : 7;
  let kingSideCastlePosition: Position = { x: 6, y: castlingY };
  let queenSideCastlePosition: Position = { x: 2, y: castlingY };
  if (currentPiece.type !== PieceType.KING) return false;
  if (!samePosition(currentPiece.position, { x: 4, y: castlingY }))
    return false;
  if (
    samePosition(desiredPosition, kingSideCastlePosition) ||
    samePosition(desiredPosition, queenSideCastlePosition)
  ) {
    return true;
  }
}
