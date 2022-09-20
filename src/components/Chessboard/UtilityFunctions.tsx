import {
  castlingPieceMoveHistory,
  GRID_SIZE,
  HORIZONTAL_AXIS,
  moveHistory,
  Piece,
  PieceType,
  Position,
  samePosition,
  TeamType,
  VERTICAL_AXIS,
} from "../../Constants";
import { isKingInCheck } from "../../referee/rules/Check";
import { isGameOver } from "../../referee/rules/Checkmate";
import { findPieceInSpecificPosition } from "../../referee/rules/GeneralRules";
import { tilesControlled } from "../../referee/rules/tilesControlled";
import Tile from "../Tile/Tile";
export const initialBoard = (initialBoardState: Piece[]) => {
  let board: JSX.Element[] = [];
  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = initialBoardState.find((p) =>
        samePosition(p.position, { x: i, y: j })
      );
      let image = piece ? piece.image : undefined;

      board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
    }
  }
  return board;
};
export const generateAnnotation = (
  currentPiece: Piece,
  desiredPosition: Position,
  boardState: Piece[],
  isCastling: boolean
) => {
  //account for castling, eating pieces, regular movement, and movement that can be made by two of the same pieces.
  const opposite_team =
    currentPiece.team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;

  if (isCastling) {
    if (currentPiece.position.x < desiredPosition.x) {
      return `O-O`;
    } else return `O-O-O`;
  }
  //Lets see if an enemy piece exists in the position we want to move to.
  const enemy_piece = findPieceInSpecificPosition(
    boardState,
    desiredPosition,
    opposite_team
  );
  const pieceSymbols = ["", "B", "N", "R", "Q", "K"];
  const desired_x = desiredPosition.x;
  const desired_y = desiredPosition.y;
  if (!enemy_piece) {
    return `${pieceSymbols[currentPiece.type]}${HORIZONTAL_AXIS[desired_x]}${
      desired_y + 1
    }`;
  } else {
    if (currentPiece.type === PieceType.PAWN) {
      return `${HORIZONTAL_AXIS[currentPiece.position.x]}x${
        HORIZONTAL_AXIS[desired_x]
      }${desired_y + 1}`;
    } else {
      return `${pieceSymbols[currentPiece.type]}x${HORIZONTAL_AXIS[desired_x]}${
        desired_y + 1
      }`;
    }
  }
};

export function adjustPieceMoveHistory(
  castlingPieceMoveHistory: castlingPieceMoveHistory,
  currentPiece: Piece
) {
  let newCastlingPieceMoveHistory = Object.assign(castlingPieceMoveHistory);
  if (currentPiece.type === PieceType.KING) {
    if (
      currentPiece.team === TeamType.WHITE &&
      !newCastlingPieceMoveHistory.didWhiteKingMove
    ) {
      newCastlingPieceMoveHistory.didWhiteKingMove = true;
    } else if (
      currentPiece.team === TeamType.BLACK &&
      !newCastlingPieceMoveHistory.didBlackKingMove
    ) {
      newCastlingPieceMoveHistory.didBlackKingMove = true;
    }
  }

  if (
    currentPiece.type === PieceType.ROOK &&
    currentPiece.team === TeamType.WHITE
  ) {
    if (
      currentPiece.position.x === 0 &&
      !newCastlingPieceMoveHistory.didWQueenRookMove
    ) {
      newCastlingPieceMoveHistory.didWQueenRookMove = true;
    } else if (
      currentPiece.position.x === 7 &&
      !newCastlingPieceMoveHistory.didWKingRookMove
    ) {
      newCastlingPieceMoveHistory.didWKingRookMove = true;
    }
  } else if (
    currentPiece.type === PieceType.ROOK &&
    currentPiece.team === TeamType.BLACK
  ) {
    if (
      currentPiece.position.x === 0 &&
      !newCastlingPieceMoveHistory.didBQueenRookMove
    ) {
      newCastlingPieceMoveHistory.didBQueenRookMove = true;
    } else if (
      currentPiece.position.x === 7 &&
      !newCastlingPieceMoveHistory.didBKingRookMove
    ) {
      newCastlingPieceMoveHistory.didBKingRookMove = true;
    }
  }
  return newCastlingPieceMoveHistory;
}

export function updateBoard(
  validMove: boolean[],
  desiredPosition: Position,
  castlingPieceMoveHistory: castlingPieceMoveHistory,
  pieces: Piece[],
  grabPosition: Position,
  setPieces: React.Dispatch<React.SetStateAction<Piece[]>>,
  moveHistory: moveHistory[],
  setMoveHistory: React.Dispatch<React.SetStateAction<moveHistory[]>>,
  deadPieces: Piece[] | null,
  setDeadPieces: React.Dispatch<React.SetStateAction<Piece[] | null>>,
  setPromotionPawn: React.Dispatch<React.SetStateAction<Piece | undefined>>,
  modalRef: React.RefObject<HTMLDivElement>,
  isUndo: boolean
) {
  const currentPiece = pieces.find((p) =>
    samePosition(p.position, grabPosition)
  );
  if (!currentPiece) return false;
  //Is the player trying to castle?
  if (validMove[1] === true) {
    const castling_move = generateAnnotation(
      currentPiece,
      desiredPosition,
      pieces,
      true
    );
    if (castling_move) {
      const newMove = {
        piece: currentPiece,
        prevPosition: currentPiece.position,
        newPosition: desiredPosition,
        newAnnotatedPosition: castling_move,
      };
      setMoveHistory([...moveHistory, newMove]);
    }
    const rook_x_position = desiredPosition.x === 6 ? 7 : 0;
    const rook_end_x_position = desiredPosition.x === 6 ? 5 : 3;
    //we just need to know that the king has moved.
    const rook_position = { x: rook_x_position, y: desiredPosition.y };
    const rook_end_position = {
      x: rook_end_x_position,
      y: desiredPosition.y,
    };
    adjustPieceMoveHistory(castlingPieceMoveHistory, currentPiece);
    let updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, grabPosition)) {
        piece.position = desiredPosition;
        results.push(piece);
      } else if (
        piece.type === PieceType.ROOK &&
        samePosition(piece.position, rook_position)
      ) {
        piece.position = rook_end_position;
        results.push(piece);
      } else if (!samePosition(piece.position, desiredPosition)) {
        if (piece.type === PieceType.PAWN) {
          piece.enPassant = false;
        }
        results.push(piece);
      }
      return results;
    }, [] as Piece[]);
    setPieces(updatedPieces);
    updatedPieces.forEach((p) => {
      p.tilesControlled = tilesControlled(
        p.position,
        p.type,
        updatedPieces,
        p.team
      );
    });
    isKingInCheck(updatedPieces, currentPiece.team);
    isGameOver(updatedPieces, currentPiece.team);
    return;
  }
  //Is the player trying to enPassent?
  const pawnDirection = currentPiece.team === TeamType.WHITE ? 1 : -1;
  if (validMove[2]) {
    const updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, grabPosition)) {
        piece.enPassant = false;
        piece.position.x = desiredPosition.x;
        piece.position.y = desiredPosition.y;
        results.push(piece);
      } else if (
        !samePosition(piece.position, {
          x: desiredPosition.x,
          y: desiredPosition.y - pawnDirection,
        })
      ) {
        if (piece.type === PieceType.PAWN) {
          piece.enPassant = false;
        }
        results.push(piece);
      }

      return results;
    }, [] as Piece[]);

    setPieces(updatedPieces);
    return;
  }
  //regular move
  const move = generateAnnotation(currentPiece, desiredPosition, pieces, false);
  if (!isUndo) {
    if (move) {
      const newMove = {
        piece: currentPiece,
        prevPosition: currentPiece.position,
        newPosition: desiredPosition,
        newAnnotatedPosition: move,
      };
      setMoveHistory([...moveHistory, newMove]);
    }
    let promotionRow = currentPiece.team === TeamType.WHITE ? 7 : 0;
    adjustPieceMoveHistory(castlingPieceMoveHistory, currentPiece);
    const opposite_team =
      currentPiece.team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
    //Lets see if an enemy piece exists in the position we want to move to.
    const enemy_piece = findPieceInSpecificPosition(
      pieces,
      desiredPosition,
      opposite_team
    );
    if (enemy_piece) {
      let newEnemyPieces: Piece[] | null = [];
      if (deadPieces) {
        newEnemyPieces = [...deadPieces, enemy_piece];
      } else {
        newEnemyPieces = [enemy_piece];
      }
      setDeadPieces(newEnemyPieces);
    }
  }
  const updatedPieces = pieces.reduce((results, piece) => {
    if (samePosition(piece.position, grabPosition)) {
      /*
      if (piece.type === PieceType.PAWN) {
        if (desiredPosition.y === promotionRow) {
          modalRef.current?.classList.remove("hidden");
          setPromotionPawn(piece);
        } else if (Math.abs(desiredPosition.y - grabPosition.y) === 2) {
          piece.enPassant = true;
        }
      }
      */
      //error above for promoting
      piece.position = desiredPosition;
      results.push(piece);
    } else if (!samePosition(piece.position, desiredPosition)) {
      if (piece.type === PieceType.PAWN) {
        piece.enPassant = false;
      }
      results.push(piece);
    }
    return results;
  }, [] as Piece[]);

  setPieces(updatedPieces);
  updatedPieces.forEach((p) => {
    p.tilesControlled = tilesControlled(
      p.position,
      p.type,
      updatedPieces,
      p.team
    );
  });
}
