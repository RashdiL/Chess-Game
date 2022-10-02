import { basename } from "path";
import {
  castlingPieceMoveHistory,
  Piece,
  PieceType,
  Position,
  samePosition,
  TeamType,
} from "../../Constants";
import Referee from "../../referee/Referee";
interface pieceAndMove {
  piece: Piece;
  eval: number;
  potentialPosition: Position;
}
export default function CalculateEvaluation(pieces: Piece[]) {
  let pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 10 ** 6,
  };
  let evaluation = 0;
  pieces.forEach((p) => {
    if (p) {
      let evaluationSign = p.team === TeamType.WHITE ? 1 : -1;
      switch (p.type) {
        case PieceType.ROOK: {
          evaluation += pieceValues.rook * evaluationSign;
          break;
        }
        case PieceType.BISHOP: {
          evaluation += pieceValues.bishop * evaluationSign;
          break;
        }
        case PieceType.KNIGHT: {
          evaluation += pieceValues.knight * evaluationSign;
          break;
        }
        case PieceType.QUEEN: {
          evaluation += pieceValues.queen * evaluationSign;
          break;
        }
        case PieceType.PAWN: {
          evaluation += pieceValues.pawn * evaluationSign;
          break;
        }
        case PieceType.KING: {
          evaluation += pieceValues.king * evaluationSign;
          break;
        }
      }
    }
  });
  return evaluation;
}

export function generateMove(
  pieces: Piece[],
  castlingPieceMoveHistory: castlingPieceMoveHistory
) {
  const referee = new Referee();
  const computerTeam = TeamType.BLACK;
  let movesAndEvals: pieceAndMove[] = [];
  pieces.forEach((p) => {
    if (p.team === TeamType.BLACK) {
      let checkingTiles: Position[] =
        p.type === PieceType.PAWN
          ? [
              { x: p.position.x, y: p.position.y - 1 },
              { x: p.position.x, y: p.position.y - 2 },
            ].concat(p.tilesControlled)
          : p.tilesControlled;
      checkingTiles.forEach((desiredPosition) => {
        const currentPosition = p.position;
        const validMove: boolean[] = referee.isValidMove(
          desiredPosition,
          currentPosition,
          pieces,
          castlingPieceMoveHistory,
          computerTeam
        );
        if (validMove[0]) {
          const promotionRow = 0;
          let piecesCopy: Piece[] = JSON.parse(JSON.stringify(pieces));
          let updatedPieces = piecesCopy.reduce((results, piece) => {
            if (samePosition(piece.position, currentPosition)) {
              if (piece.type === PieceType.PAWN) {
                if (desiredPosition.y === promotionRow) {
                  piece.type = PieceType.QUEEN;
                } else if (
                  Math.abs(desiredPosition.y - currentPosition.y) === 2
                ) {
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
          movesAndEvals.push({
            piece: p,
            eval: CalculateEvaluation(updatedPieces),
            potentialPosition: desiredPosition,
          });
        }
      });
    }
  });
  let min = 10 ** 6;
  let bestMove: pieceAndMove[] = [];
  movesAndEvals.forEach((move) => {
    if (move.eval < min) {
      bestMove = [move];
      min = move.eval;
    }
  });
  console.log(bestMove);
  return bestMove;
}
