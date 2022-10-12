import { useEffect, useRef, useState } from "react";
import "./Chessboard.css";
import {
  Piece,
  PieceType,
  TeamType,
  initialBoardState,
  Position,
  samePosition,
  castlingPieceMoveHistory,
  initialCastlingState,
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  moveHistory,
} from "../../Constants";
import { grabPiece, movePiece } from "./PieceMovement";
import Tile from "../Tile/Tile";
import Referee from "../../referee/Referee";
import { updateBoard } from "./UtilityFunctions";
import {
  generateMove,
  generatePossibleMoves,
  getBestMove,
} from "../Movegenerator/Evaluation";
import { deepEqual } from "assert";
type Props = {
  moveHistory: moveHistory[];
  setMoveHistory: React.Dispatch<React.SetStateAction<moveHistory[]>>;
  resetBoard: boolean;
  setResetBoard: React.Dispatch<React.SetStateAction<boolean>>;
  playingAI: boolean;
};
const Chessboard: React.FC<Props> = ({
  moveHistory,
  setMoveHistory,
  resetBoard,
  setResetBoard,
  playingAI,
}) => {
  const [newMove, setNewMove] = useState<boolean>(false);
  const [previousMove, setPreviousMove] = useState<boolean>(false);
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const [pieces, setPieces] = useState<Piece[]>(
    JSON.parse(JSON.stringify(initialBoardState))
  );
  const [turn, setTurn] = useState<TeamType>(TeamType.WHITE);
  const [castlingPieceMoveHistory, setCastlingPieceMoveHistory] =
    useState<castlingPieceMoveHistory>(
      JSON.parse(JSON.stringify(initialCastlingState))
    );
  const chessboardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [deadPieces, setDeadPieces] = useState<Piece[] | null>(null);
  const [gameStateHistory, setGameStateHistory] = useState<Piece[][]>([
    JSON.parse(JSON.stringify(initialBoardState)),
  ]);
  const [moveCount, setMoveCount] = useState<number>(0);
  function createBoard(initialBoardState: Piece[]) {
    let board: JSX.Element[] = [];
    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
      for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
        const number = j + i + 2;
        const piece = pieces.find((p) =>
          samePosition(p.position, { x: i, y: j })
        );
        let image = piece ? piece.image : undefined;

        board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
      }
    }
    return board;
  }

  var [board, setBoard] = useState<JSX.Element[]>(createBoard(pieces));

  useEffect(() => {
    if (resetBoard) {
      setPieces(JSON.parse(JSON.stringify(initialBoardState)));
      setCastlingPieceMoveHistory(
        JSON.parse(JSON.stringify(initialCastlingState))
      );
      setResetBoard(false);
      setTurn(TeamType.WHITE);
    }
  }, [resetBoard, setResetBoard]);
  useEffect(() => {
    if (newMove) {
      setBoard(createBoard(pieces));
      let newMoveCount = moveCount + 1;
      setMoveCount(newMoveCount);
      let newGameStateForHistory = JSON.parse(JSON.stringify(gameStateHistory));
      let currentPieceState = JSON.parse(JSON.stringify(pieces));
      newGameStateForHistory.push(currentPieceState);
      setGameStateHistory(newGameStateForHistory);
      setNewMove(false);
      if (turn === TeamType.WHITE) {
        setTurn(TeamType.BLACK);
      } else {
        setTurn(TeamType.WHITE);
      }
    } else if (previousMove) {
      setBoard(createBoard(pieces));
      setPreviousMove(false);
    }
  }, [pieces]);
  useEffect(() => {
    if (turn === TeamType.BLACK) {
      let piecesClone = JSON.parse(JSON.stringify(pieces));
      let newBoard = getBestMove(2, piecesClone, true).bestMove;
      setPieces(newBoard);
      setNewMove(true);
    }
  }, [turn]);
  function handlePieceMovement(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (!element.classList.contains("chess-piece") || !chessboard) return;
    const GRID_SIZE = chessboard.offsetWidth / 8;
    if (e.type === "mousedown") {
      grabPiece(e, chessboard);
      setActivePiece(element);
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil(
          (e.clientY - chessboard.offsetTop - chessboard.offsetWidth) /
            GRID_SIZE
        )
      );
      setGrabPosition({ x: grabX, y: grabY });
    }
    if (e.type === "mousemove" && activePiece) {
      movePiece(e, chessboard, activePiece);
    }
    if (e.type === "mouseup") {
      const referee = new Referee();
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil(
          (e.clientY - chessboard.offsetTop - chessboard.offsetWidth) /
            GRID_SIZE
        )
      );
      const desiredPosition: Position = { x: x, y: y };
      const validMove: boolean[] = referee.isValidMove(
        desiredPosition,
        grabPosition,
        pieces,
        castlingPieceMoveHistory,
        turn
      );
      //if the move is valid. validMove[1] is a boolean stating if the player is trying to castle.
      //validMove[2] states if the player is trying to enPassent.
      if (validMove[0]) {
        updateBoard(
          validMove,
          desiredPosition,
          castlingPieceMoveHistory,
          pieces,
          grabPosition,
          setPieces,
          moveHistory,
          setMoveHistory,
          deadPieces,
          setDeadPieces,
          setPromotionPawn,
          modalRef,
          false
        );
        setNewMove(true);
      } else {
        if (!activePiece) return;
        activePiece.style.position = "relative";
        activePiece.style.removeProperty("top");
        activePiece.style.removeProperty("left");
      }
      setActivePiece(null);
    }
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }
    setNewMove(true);
    const updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, promotionPawn.position)) {
        piece.type = pieceType;
        const teamType = piece.team === TeamType.WHITE ? "w" : "b";
        let image = "";
        switch (pieceType) {
          case PieceType.ROOK: {
            image = "rook";
            break;
          }
          case PieceType.BISHOP: {
            image = "bishop";
            break;
          }
          case PieceType.KNIGHT: {
            image = "knight";
            break;
          }
          case PieceType.QUEEN: {
            image = "queen";
            break;
          }
        }
        piece.image = `assets/images/${image}_${teamType}.png`;
        console.log(piece.image);
      }
      results.push(piece);
      return results;
    }, [] as Piece[]);

    setPieces(updatedPieces);
    console.log("pieces set");
    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.WHITE ? "w" : "b";
  }

  function handleUndo() {
    if (!gameStateHistory) return;
    setPreviousMove(true);
    const newMoveHistory = JSON.parse(JSON.stringify(moveHistory));
    const lastMove = newMoveHistory.pop();
    setMoveHistory(newMoveHistory);

    const previousMoveCount = moveCount - 1;
    console.log(`returning to move ${previousMoveCount}`);
    setMoveCount(previousMoveCount);
    let previousGameState = gameStateHistory.at(previousMoveCount);
    console.log(previousGameState);
    if (previousGameState) {
      setPieces(previousGameState);
    }
    if (turn === TeamType.WHITE) {
      setTurn(TeamType.BLACK);
    } else {
      setTurn(TeamType.WHITE);
    }
  }
  return (
    <>
      <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
        <div className="modal-body">
          <img
            onClick={() => promotePawn(PieceType.ROOK)}
            src={`/assets/images/rook_${promotionTeamType()}.png`}
            alt="rook"
          />
          <img
            onClick={() => promotePawn(PieceType.BISHOP)}
            src={`/assets/images/bishop_${promotionTeamType()}.png`}
            alt="bishop"
          />
          <img
            onClick={() => promotePawn(PieceType.KNIGHT)}
            src={`/assets/images/knight_${promotionTeamType()}.png`}
            alt="knight"
          />
          <img
            onClick={() => promotePawn(PieceType.QUEEN)}
            src={`/assets/images/queen_${promotionTeamType()}.png`}
            alt="queen"
          />
        </div>
      </div>
      <div className="chessboard-container">
        <div
          onMouseMove={(e) => handlePieceMovement(e)}
          onMouseDown={(e) => handlePieceMovement(e)}
          onMouseUp={(e) => handlePieceMovement(e)}
          id="chessboard"
          ref={chessboardRef}
        >
          {board}
        </div>
      </div>
      <button
        className="button"
        onClick={() => {
          handleUndo();
        }}
      >
        Undo Move
      </button>
    </>
  );
};
export default Chessboard;
