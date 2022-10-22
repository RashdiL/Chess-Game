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
import { tilesControlled } from "../../referee/rules/tilesControlled";
interface pieceAndMove {
  piece: Piece;
  eval: number;
  potentialPosition: Position;
}
interface validMove {
  piece: Piece;
  desiredPosition: Position;
  board: Piece[];
}
export default function CalculateEvaluation(pieces: Piece[]) {
  let pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 10 ** 4,
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
  return bestMove;
}
export function generatePossibleMoves(pieces: Piece[], team: TeamType) {
  const referee = new Referee();
  let validMoves: validMove[] = [];
  let multiplier = team === TeamType.BLACK ? -1 : 1;
  pieces.forEach((p) => {
    if (p.team === team) {
      let checkingTiles: Position[] =
        p.type === PieceType.PAWN
          ? [
              { x: p.position.x, y: p.position.y + 1 * multiplier },
              { x: p.position.x, y: p.position.y + 2 * multiplier },
            ].concat(p.tilesControlled)
          : p.tilesControlled;
      checkingTiles.forEach((desiredPosition) => {
        const currentPosition = p.position;
        const validMove: boolean[] = referee.isValidMove(
          desiredPosition,
          currentPosition,
          pieces,
          {
            didWhiteKingMove: false,
            didBlackKingMove: false,
            didWQueenRookMove: false,
            didBQueenRookMove: false,
            didWKingRookMove: false,
            didBKingRookMove: false,
          },
          team
        );
        if (validMove[0]) {
          let piecesCopy = JSON.parse(JSON.stringify(pieces));
          let promotionRow = team === TeamType.WHITE ? 7 : 0;
          let updatedPieces: Piece[] = piecesCopy.reduce(
            (results: Piece[], piece: Piece) => {
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
            },
            [] as Piece[]
          );
          updatedPieces.forEach((p: Piece) => {
            p.tilesControlled = tilesControlled(
              p.position,
              p.type,
              updatedPieces,
              p.team
            );
          });
          validMoves.push({
            piece: p,
            desiredPosition: desiredPosition,
            board: updatedPieces,
          });
        }
      });
    }
  });
  return validMoves;
}

export function getBestMove(
  depth: number,
  pieces: Piece[],
  isAI: boolean,
  alpha: number = 10 ** 4,
  beta: number = (-10) ** 4
) {
  let team = isAI === true ? TeamType.BLACK : TeamType.WHITE;
  if (depth === 0) {
    return {
      bestEval: oneDepthBestMove(pieces, team).bestEval,
      bestMove: oneDepthBestMove(pieces, team).bestMove,
    };
  }

  let possibleMoves = generatePossibleMoves(pieces, team);
  if (isAI) {
    let minimumEval = 1 * 10 ** 6;
    let bestMinMove: Piece[] = possibleMoves[0].board;
    for (let i = 0; i < possibleMoves.length; i++) {
      let candidateMoveOriginal = possibleMoves[i];
      let candidateMinMove = JSON.parse(JSON.stringify(candidateMoveOriginal));
      let board: Piece[] = candidateMinMove.board;
      let minimizerCurrentEvaluation: number = getBestMove(
        depth - 1,
        board,
        false
      ).bestEval;
      if (minimizerCurrentEvaluation < minimumEval) {
        minimumEval = minimizerCurrentEvaluation;
        bestMinMove = board;
      }
      if (minimizerCurrentEvaluation < alpha) {
        alpha = minimizerCurrentEvaluation;
      }
    }
    return {
      bestEval: minimumEval,
      bestMove: bestMinMove,
    };
  } else {
    let maximumEval = -1 * 10 ** 6;
    let bestMaxMove: Piece[] = possibleMoves[0].board;
    for (let i = 0; i < possibleMoves.length; i++) {
      let candidateMaxMoveOriginal = possibleMoves[i];
      let candidateMaxMove = JSON.parse(
        JSON.stringify(candidateMaxMoveOriginal)
      );
      let MaxBoard: Piece[] = candidateMaxMove.board;
      console.log(`next depth: ${depth - 1}, board: ${MaxBoard}`);
      let maximizerCurrentEvaluation = getBestMove(
        depth - 1,
        MaxBoard,
        true
      ).bestEval;
      if (maximizerCurrentEvaluation > maximumEval) {
        maximumEval = maximizerCurrentEvaluation;
        bestMaxMove = MaxBoard;
      }
      if (maximizerCurrentEvaluation > beta) {
        beta = maximizerCurrentEvaluation;
      }

      if (alpha <= beta) {
        break;
      }
    }
    return {
      bestEval: maximumEval,
      bestMove: bestMaxMove,
    };
  }
}
/*
export function getBestMove(depth: number, pieces: Piece[], isAI: boolean) {
  let team = isAI === true ? TeamType.BLACK : TeamType.WHITE;
  if (depth === 0) {
    return {
      bestEval: oneDepthBestMove(pieces, team).bestEval,
      bestMove: oneDepthBestMove(pieces, team).bestMove,
    };
  }

  let possibleMoves = generatePossibleMoves(pieces, team);
  if (isAI) {
    let minimumEval = 1 * 10 ** 6;
    let bestMinMove: Piece[] = possibleMoves[0].board;
    for (let i = 0; i < possibleMoves.length; i++) {
      let candidateMoveOriginal = possibleMoves[i];
      let candidateMinMove = JSON.parse(JSON.stringify(candidateMoveOriginal));
      let board: Piece[] = candidateMinMove.board;
      let minEvaluation: number = getBestMove(depth - 1, board, false).bestEval;
      if (minEvaluation < minimumEval) {
        minimumEval = minEvaluation;
        bestMinMove = board;
      }
    }
    return {
      bestEval: minimumEval,
      bestMove: bestMinMove,
    };
  } else {
    let maximumEval = -1 * 10 ** 6;
    let bestMaxMove: Piece[] = possibleMoves[0].board;
    for (let i = 0; i < possibleMoves.length; i++) {
      let candidateMaxMoveOriginal = possibleMoves[i];
      let candidateMaxMove = JSON.parse(
        JSON.stringify(candidateMaxMoveOriginal)
      );
      let MaxBoard: Piece[] = candidateMaxMove.board;
      console.log(`next depth: ${depth - 1}, board: ${MaxBoard}`);
      let maxEvaluation = getBestMove(depth - 1, MaxBoard, true).bestEval;
      if (maxEvaluation > maximumEval) {
        maximumEval = maxEvaluation;
        bestMaxMove = MaxBoard;
      }
    }
    return {
      bestEval: maximumEval,
      bestMove: bestMaxMove,
    };
  }
}
*/
//This function looks one move into the future and plays a move that does not hang a piece. Or it takes the piece with the best value.
export function oneDepthBestMove(pieces: Piece[], team: TeamType) {
  const allMoves = generatePossibleMoves(pieces, team);
  if (team === TeamType.WHITE) {
    let maximumEval = -1 * 10 ** 6;
    let bestMove = allMoves[0];
    allMoves.forEach((move) => {
      let currentEval = CalculateEvaluation(move.board);
      if (currentEval > maximumEval) {
        maximumEval = currentEval;
        bestMove = move;
      }
    });
    let bestEval = maximumEval;
    let bestMoveCopy: Piece[] = JSON.parse(JSON.stringify(bestMove.board));
    return { bestEval: bestEval, bestMove: bestMoveCopy };
  } else {
    let minimumEval = 1 * 10 ** 6;
    let bestMove = allMoves[0];
    allMoves.forEach((move) => {
      let currentEval = CalculateEvaluation(move.board);
      if (currentEval < minimumEval) {
        minimumEval = currentEval;
        bestMove = move;
      }
    });
    let bestEval = minimumEval;
    let bestMoveCopy: Piece[] = JSON.parse(JSON.stringify(bestMove.board));
    return { bestEval: bestEval, bestMove: bestMoveCopy };
  }
}
