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
import { grabPiece } from "./PieceMovement";

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const [pieces, setPieces] = useState<Piece[]>(initialBoardStateForTesting);
  const [turn, setTurn] = useState<TeamType>(TeamType.WHITE);
  const [didKingsBlackRookMove, setDidKingsBlackRookMove] =
    useState<boolean>(false);
  const [didQueensBlackRookMove, setDidQueensBlackRookMove] =
    useState<boolean>(false);
  const [didKingsWhiteRookMove, setDidKingsWhiteRookMove] =
    useState<boolean>(false);
  const [didQueensWhiteRookMove, setDidQueensWhiteRookMove] =
    useState<boolean>(false);
  const [didBlackKingMove, setDidBlackKingMove] = useState<boolean>(false);
  const [didWhiteKingMove, setDidwhiteKingMove] = useState<boolean>(false);
  //const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const referee = new Referee();
  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition({ x: grabX, y: grabY });

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      setActivePiece(element);
    }
  }
  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
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
  }
  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      //the x and y coords below are the coords of where you are trying to drop your piece.
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      const currentPiece = pieces.find((p) =>
        samePosition(p.position, grabPosition)
      );

      if (currentPiece) {
        let piecesCopy = JSON.parse(JSON.stringify(pieces));
        const potentialBoardState = piecesCopy.reduce(
          (results: Piece[], piece: Piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y })) {
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
        let didKingMove =
          currentPiece.team === TeamType.WHITE
            ? didWhiteKingMove
            : didBlackKingMove;
        let didKingsRookMove =
          currentPiece.team === TeamType.WHITE
            ? didKingsWhiteRookMove
            : didKingsBlackRookMove;
        let didQueensRookMove =
          currentPiece.team === TeamType.WHITE
            ? didQueensWhiteRookMove
            : didQueensBlackRookMove;
        const validMove = referee.isValidMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces,
          potentialBoardState,
          didKingMove,
          didKingsRookMove,
          didQueensRookMove
        );

        const isEnPassantMove = referee.isEnPassantMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const pawnDirection = currentPiece.team === TeamType.WHITE ? 1 : -1;

        if (isEnPassantMove && currentPiece.team === turn) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (
              !samePosition(piece.position, { x, y: y - pawnDirection })
            ) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, [] as Piece[]);

          setPieces(updatedPieces);
        } else if (validMove && currentPiece.team === turn) {
          //UPDATES THE PIECE POSITION
          //AND IF A PIECE IS ATTACKED, REMOVES IT
          const queensBlackRookPosition: Position = { x: 0, y: 7 };
          const queensWhiteRookPosition: Position = { x: 0, y: 0 };
          const kingsBlackRookPosition: Position = { x: 7, y: 7 };
          const kingsWhiteRookPosition: Position = { x: 7, y: 0 };
          if (
            currentPiece.type === PieceType.ROOK &&
            (didKingsBlackRookMove ||
              didKingsWhiteRookMove ||
              didQueensBlackRookMove ||
              didQueensWhiteRookMove)
          ) {
            if (
              currentPiece.team === TeamType.WHITE &&
              currentPiece.position === queensWhiteRookPosition
            ) {
              setDidQueensWhiteRookMove(true);
            }

            if (
              currentPiece.team === TeamType.WHITE &&
              currentPiece.position === kingsWhiteRookPosition
            ) {
              setDidKingsWhiteRookMove(true);
            }

            if (
              currentPiece.team === TeamType.BLACK &&
              currentPiece.position === queensBlackRookPosition
            ) {
              setDidQueensBlackRookMove(true);
            }

            if (
              currentPiece.team === TeamType.BLACK &&
              currentPiece.position === kingsBlackRookPosition
            ) {
              setDidKingsBlackRookMove(true);
            }
          }

          if (
            currentPiece.type === PieceType.KING &&
            (didBlackKingMove || didWhiteKingMove)
          ) {
            if (currentPiece.team === TeamType.WHITE) {
              setDidwhiteKingMove(true);
            } else {
              setDidBlackKingMove(true);
            }
          }
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              //SPECIAL MOVE
              piece.enPassant =
                Math.abs(grabPosition.y - y) === 2 &&
                piece.type === PieceType.PAWN;

              piece.position.x = x;
              piece.position.y = y;
              let promotionRow = piece.team === TeamType.WHITE ? 7 : 0;

              if (y === promotionRow && piece.type === PieceType.PAWN) {
                modalRef.current?.classList.remove("hidden");
                setPromotionPawn(piece);
              }
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y })) {
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
        } else {
          //RESETS THE PIECE POSITION
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
      setActivePiece(null);
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
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        id="chessboard"
        ref={chessboardRef}
      >
        {board}
      </div>
    </>
  );
}
