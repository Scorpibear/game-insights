import { Chess } from "chess.js";
import fenAnalyzer from "fen-analyzer";

export function extendPgn(pgn, san) {
  const chess = pgn2chessObject(pgn);
  chess.move(san);
  return chess.pgn();
}

export const pgn2moves = (pgn) =>
  pgn
    ? pgn
      .replace(/\[[^\]]*\]\n/gm, "") // e.g. [Site "Chess.com"]\n
      .replace(/\{[^}]*\}\s/gm, "") // e.g. {[%clk 0:03:01.2]}
      .replace(/\d+\.{1,3}\s/gm, "") // e.g. '1. ' or '1... '
      .replace(/(1-0)|(0-1)|(\?-\?)/gm, "") // e.g. '1-0' or ?-? at the end
      .trim()
      .split(" ")
    : [];

/**
 * 
 * @param {string} pgn 
 * @returns {string} fen for the last move in pgn
 */
export const pgn2fen = (pgn) => chessObject2fen(pgn2chessObject(pgn));

export function pgn2chessObject(pgn) {
  let chess = new Chess();
  chess.load_pgn(pgn);
  return chess;
}

export const chessObject2fen = (chess) => fenAnalyzer.normalize(chess.fen());
