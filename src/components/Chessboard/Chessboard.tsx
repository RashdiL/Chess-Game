import { useRef, useState } from "react";
import "./Chessboard.css";
import Tile from "../Tile/Tile";
import Referee from "../../referee/Referee";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
  Piece,
  PieceType,
  TeamType,
  //initialBoardState,
  Position,
  samePosition,
  initialBoardStateForTesting,
  //initialBoardState,
} from "../../Constants";
import { tilesControlled } from "../../referee/rules/tilesControlled";
import { isGameOver } from "../../referee/rules/Checkmate";
import { isKingInCheck } from "../../referee/rules/Check";
import { grabPiece, movePiece, dropPiece } from "./PieceMovement";

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const [pieces, setPieces] = useState<Piece[]>(initialBoardStateForTesting);
  const [turn, setTurn] = useState<TeamType>(TeamType.WHITE);
  //const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  function handleEvent(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (!element.classList.contains("chess-piece") || !chessboard) return;
    if (e.type === "mousedown") {
      grabPiece(e, chessboard);
      setActivePiece(element);
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition({ x: grabX, y: grabY });
    }
    if (e.type === "mousemove" && activePiece) {
      movePiece(e, chessboard, activePiece);
    }
    if (e.type === "mouseup") {
      dropPiece(
        e,
        chessboard,
        pieces,
        setPieces,
        grabPosition,
        turn,
        setTurn,
        activePiece,
        setActivePiece
      );
    }
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }

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
      }
      results.push(piece);
      return results;
    }, [] as Piece[]);

    setPieces(updatedPieces);

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.WHITE ? "w" : "b";
  }

  let board = [];

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
      <div
        onMouseMove={(e) => handleEvent(e)}
        onMouseDown={(e) => handleEvent(e)}
        onMouseUp={(e) => handleEvent(e)}
        id="chessboard"
        ref={chessboardRef}
      >
        {board}
      </div>
    </>
  );
}
