import {
  castlingPieceMoveHistory,
  Piece,
  PieceType,
  samePosition,
  TeamType,
} from "../../Constants";
import Referee from "../../referee/Referee";
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
  pieces.forEach((p) => {
    if (p.team === TeamType.BLACK) {
      console.log(
        `checking ${p.type} in position ${p.position.x} and ${p.position.y}`
      );
      console.log(`piece can move to`);
      console.log(p.tilesControlled);
      console.log("-----------------------------------");
      p.tilesControlled.forEach((desiredPosition) => {
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
          const updatedPieces = pieces.reduce((results, piece) => {
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
          console.log(CalculateEvaluation(updatedPieces));
        }
      });
    }
  });
  return;
}
