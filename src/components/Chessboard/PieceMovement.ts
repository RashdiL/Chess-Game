import { GRID_SIZE } from "../../Constants";

export function grabPiece(
  e: React.MouseEvent,
  chessboardRef: HTMLDivElement | null
) {
  const element = e.target as HTMLElement;
  const chessboard = chessboardRef;
  if (element.classList.contains("chess-piece") && chessboard) {
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
}
