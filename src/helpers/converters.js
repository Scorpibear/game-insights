import { Chess } from "chess.js";

export const pgn2moves = (pgn) =>
  pgn
    .replace(/(\[.*\])|(\d+\.\s)|(\n*)/g, "")
    .trim()
    .split(" ")
    .slice(0, -1);

export function lichess2fenData(input) {
  const result = { depth: input.depth };
  const chess = new Chess(input.fen);
  const move = input?.pvs?.length ? input.pvs[0].moves.split(" ")[0] : "";
  const moveObject = chess.move(move, { sloppy: true });
  result.bestMove = moveObject?.san;
  return result;
}
