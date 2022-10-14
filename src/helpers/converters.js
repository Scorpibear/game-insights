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
  if (input.pvs && input.pvs.length && input.pvs[0].moves) {
    const move = input.pvs[0].moves.split(" ")[0];
    const moveObject = chess.move(move, { sloppy: true });
    result.bestMove = moveObject?.san;
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
        score: data.score !== undefined ? data.score : data.cp / 100,
        depth: data.depth,
      }
    : undefined;

export const formatPopular = (movesData) =>
  movesData
    .map(
      ({ san, masterGamesAmount, onlineGamesAmount }) =>
        `${san} (${num2k(masterGamesAmount)}+${num2k(onlineGamesAmount)})`
    )
    .join(", ");
