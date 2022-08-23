import { Piece, TeamType } from "../../Constants";
import { isKingInCheck } from "./Check";
import { canKingMove } from "./Checkmate";

export const isItStalemate = (boardState: Piece[], team: TeamType): boolean => {
  if (!isKingInCheck(boardState, team)) return false;
  if (canKingMove(boardState, team)) return false;

  return false;
};
