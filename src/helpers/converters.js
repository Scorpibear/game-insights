import { Chess } from "chess.js";

export const addUsername = (username) => (game) => ({ ...game, username });

export const endTime2lastMoveAt = (game) =>
  "end_time" in game ? { ...game, lastMoveAt: game.end_time * 1000 } : game;

export const pgn2moves = (pgn) =>
  pgn
    .replace(/\[[^\]]*\]\n/gm, "") // e.g. [Site "Chess.com"]\n
    .replace(/\{[^}]*\}\s/gm, "") // e.g. {[%clk 0:03:01.2]}
    .replace(/\d+\.{1,3}\s/gm, "") // e.g. '1. ' or '1... '
    .trim()
    .split(" ")
    .slice(0, -1);

export function lichess2fenData(input) {
  const result = { depth: input.depth };
  if (input.pvs && input.pvs.length && input.pvs[0].moves) {
    const moveData = input.pvs[0].moves.split(" ")[0];
    const castling = { e1h1: "O-O", e8h8: "O-O", e1a1: "O-O-O", e8a8: "O-O-O" };
    result.bestMove =
      castling[moveData] ||
      new Chess(input.fen).move(moveData, {
        sloppy: true,
      })?.san;
    result.cp = input.pvs[0].cp;
  }
  return result;
}

export function mergeGameStats(masters, online) {
  const jointData = {
    moves: masters?.moves?.map(({ san, white, draws, black }) => ({
      san,
      masterGamesAmount: white + draws + black,
      onlineGamesAmount: 0,
    })),
    opening: masters?.opening,
  };
  online?.moves?.forEach(({ san, white, draws, black }) => {
    let el = jointData?.moves?.find((el) => el.san == san);
    if (el) {
      el.onlineGamesAmount = white + draws + black;
    } else {
      jointData?.moves?.push({
        san,
        masterGamesAmount: 0,
        onlineGamesAmount: white + draws + black,
      });
    }
  });
  return jointData;
}

export const num2k = (num) =>
  num >= 1e12
    ? Math.floor(num / 1e12) + "Q"
    : num >= 1e9
    ? Math.floor(num / 1e9) + "B"
    : num >= 1e6
    ? Math.floor(num / 1e6) + "M"
    : num >= 1e3
    ? Math.floor(num / 1e3) + "K"
    : "" + num;

export const formatBest = (data) =>
  data && data.bestMove
    ? {
        san: data.bestMove,
        score:
          'score' in data
            ? data.score
            : 'cp' in data
            ? data.cp / 100
            : undefined,
        depth: data.depth,
        alt: data.alt,
      }
    : null;

export const formatPopular = (movesData) =>
  movesData
    .map(
      ({ san, masterGamesAmount, onlineGamesAmount }) =>
        `${san} (${num2k(masterGamesAmount)}+${num2k(onlineGamesAmount)})`
    )
    .join(", ");
