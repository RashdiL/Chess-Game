import { GRID_SIZE } from "../../Constants";

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
