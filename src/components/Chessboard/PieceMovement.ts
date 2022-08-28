import {
  castlingPieceMoveHistory,
  GRID_SIZE,
  isPlayerTryingToCastle,
  Piece,
  PieceType,
  Position,
  samePosition,
  TeamType,
} from "../../Constants";
import Referee from "../../referee/Referee";
import { isKingInCheck } from "../../referee/rules/Check";
import { isGameOver } from "../../referee/rules/Checkmate";
import { isItStalemate } from "../../referee/rules/Stalemate";
import { tilesControlled } from "../../referee/rules/tilesControlled";

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

export function grabPiece(e: React.MouseEvent, chessboard: HTMLDivElement) {
  const element = e.target as HTMLElement;
  const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
  const grabY = Math.abs(
    Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
  );

  const x = e.clientX - GRID_SIZE / 2;
  const y = e.clientY - GRID_SIZE / 2;
  element.style.position = "absolute";
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  return [{ x: grabX, y: grabY }, element];
}

const referee = new Referee();
export function movePiece(
  e: React.MouseEvent,
  chessboard: HTMLDivElement,
  activePiece: HTMLElement
) {
  const minX = chessboard.offsetLeft - 25;
  const minY = chessboard.offsetTop - 25;
  const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
  const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
  const x = e.clientX - 50;
  const y = e.clientY - 50;
  activePiece.style.position = "absolute";

  //If x is smaller than minimum amount
  if (x < minX) {
    activePiece.style.left = `${minX}px`;
  }
  //If x is bigger than maximum amount
  else if (x > maxX) {
    activePiece.style.left = `${maxX}px`;
  }
  //If x is in the constraints
  else {
    activePiece.style.left = `${x}px`;
  }

  //If y is smaller than minimum amount
  if (y < minY) {
    activePiece.style.top = `${minY}px`;
  }
  //If y is bigger than maximum amount
  else if (y > maxY) {
    activePiece.style.top = `${maxY}px`;
  }
  //If y is in the constraints
  else {
    activePiece.style.top = `${y}px`;
  }
}

export function dropPiece(
  e: React.MouseEvent,
  chessboard: HTMLDivElement,
  pieces: Piece[],
  setPieces: React.Dispatch<React.SetStateAction<Piece[]>>,
  grabPosition: Position,
  turn: TeamType,
  setTurn: React.Dispatch<React.SetStateAction<TeamType>>,
  activePiece: HTMLElement | null,
  setActivePiece: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
  castlingPieceMoveHistory: castlingPieceMoveHistory,
  setCastlingMoves: React.Dispatch<
    React.SetStateAction<castlingPieceMoveHistory>
  >,
  setPromotionPawn: React.Dispatch<React.SetStateAction<Piece | undefined>>,
  modalRef: React.RefObject<HTMLDivElement>
) {
  //the x and y coords below are the coords of where you are trying to drop your piece.
  const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
  const y = Math.abs(
    Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
  );
  const desiredPosition: Position = { x: x, y: y };
  const currentPiece = pieces.find((p) =>
    samePosition(p.position, grabPosition)
  );
  if (!currentPiece) return;
  if (
    isPlayerTryingToCastle(currentPiece, desiredPosition, currentPiece.team)
  ) {
    const validCastle = referee.isValidCastle(
      grabPosition,
      desiredPosition,
      currentPiece.type,
      currentPiece.team,
      pieces,
      castlingPieceMoveHistory
    );
    if (validCastle) {
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
      isKingInCheck(updatedPieces, turn);
      isGameOver(updatedPieces, currentPiece.team);
      if (turn === TeamType.WHITE) {
        setTurn(TeamType.BLACK);
      } else {
        setTurn(TeamType.WHITE);
      }
      return;
    }
  }
  const isEnPassantMove = referee.isEnPassantMove(
    grabPosition,
    desiredPosition,
    currentPiece.type,
    currentPiece.team,
    pieces
  );
  console.log(isEnPassantMove);

  const validMove = referee.isValidMove(
    grabPosition,
    desiredPosition,
    currentPiece.type,
    currentPiece.team,
    pieces,
    castlingPieceMoveHistory
  );
  const pawnDirection = currentPiece.team === TeamType.WHITE ? 1 : -1;

  if (isEnPassantMove && currentPiece.team === turn) {
    const updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, grabPosition)) {
        piece.enPassant = false;
        piece.position.x = x;
        piece.position.y = y;
        results.push(piece);
      } else if (!samePosition(piece.position, { x, y: y - pawnDirection })) {
        if (piece.type === PieceType.PAWN) {
          piece.enPassant = false;
        }
        results.push(piece);
      }

      return results;
    }, [] as Piece[]);

    setPieces(updatedPieces);
  } else if (validMove && currentPiece.team === turn) {
    let promotionRow = currentPiece.team === TeamType.WHITE ? 7 : 0;
    adjustPieceMoveHistory(castlingPieceMoveHistory, currentPiece);
    const updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, grabPosition)) {
        if (piece.type === PieceType.PAWN) {
          if (desiredPosition.y === promotionRow) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(piece);
          } else if (Math.abs(desiredPosition.y - grabPosition.y) === 2) {
            piece.enPassant = true;
          }
        }
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
    isKingInCheck(updatedPieces, turn);
    isGameOver(updatedPieces, currentPiece.team);
    let enemy =
      currentPiece.team === TeamType.WHITE ? TeamType.BLACK : TeamType.WHITE;
    isItStalemate(updatedPieces, enemy);
    if (turn === TeamType.WHITE) {
      setTurn(TeamType.BLACK);
    } else {
      setTurn(TeamType.WHITE);
    }
  } else {
    //RESETS THE PIECE POSITION
    if (activePiece) {
      activePiece.style.position = "relative";
      activePiece.style.removeProperty("top");
      activePiece.style.removeProperty("left");
    }
  }
  setActivePiece(null);
}
