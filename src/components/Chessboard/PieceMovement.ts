export function grabPiece(e: React.MouseEvent, chessboard: HTMLDivElement) {
  const GRID_SIZE = chessboard.offsetWidth / 8;
  const element = e.target as HTMLElement;
  const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);

  const grabY = Math.abs(
    Math.ceil(
      (e.clientY - chessboard.offsetTop - chessboard.offsetWidth) / GRID_SIZE
    )
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
  const GRID_SIZE = chessboard.offsetWidth / 8;
  const minX = chessboard.offsetLeft - GRID_SIZE / 4;
  const minY = chessboard.offsetTop - GRID_SIZE / 4;
  const maxX =
    chessboard.offsetLeft + chessboard.offsetWidth - (GRID_SIZE / 4) * 3;
  const maxY =
    chessboard.offsetTop + chessboard.offsetHeight - (GRID_SIZE / 4) * 3;
  const x = e.clientX - GRID_SIZE / 2;
  const y = e.clientY - GRID_SIZE / 2;
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
