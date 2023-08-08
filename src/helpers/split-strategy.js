import { extendPgn, pgn2fen } from "./pgn-manipulations";

export default class SplitStrategy {
  constructor(backend) {
    this.backend = backend;
  }
  async split2top(count, startPgn) {
    const minRootMoves = 3;
    let stats = await this.getPopularMovesStats(startPgn, count);
    let remainingCount = count - minRootMoves;
    let activeStats = stats.slice(0, minRootMoves * 2);
    while (remainingCount > 0 && activeStats.length) {
      const activeNode = activeStats.shift();
      const nodeStats = await this.getStatsForBest(
        activeNode.pgn,
        remainingCount + 1,
      );
      stats.push(...nodeStats.slice(1));
      activeStats.push(...nodeStats);
      activeStats.sort((s1, s2) => s2.amount - s1.amount);
      remainingCount -= 1;
    }
    stats.sort((s1, s2) => s2.amount - s1.amount);
    return stats.slice(0, count).map(({ pgn }) => pgn);
  }

  async getStatsForBest(pgn, movesLimit) {
    const activePgn = await this.addBestMove(pgn);
    return activePgn ? this.getPopularMovesStats(activePgn, movesLimit) : [];
  }

  async addBestMove(pgn) {
    return extendPgn(
      pgn,
      (await this.backend.getBestMove(pgn2fen(pgn))).bestMove,
    );
  }
  /**
   *
   * @param {String} pgn
   * @param {Number} limit
   * @returns {Array<{pgn: String, amount: Number}>} list of stats about popularity of the specific sub-pgns
   */
  async getPopularMovesStats(pgn, limit) {
    const popularMoves = await this.backend.getPopularMoves(pgn2fen(pgn));
    return popularMoves?.moves
      ? popularMoves.moves.slice(0, limit).map((moveData) => ({
          pgn: extendPgn(pgn, moveData.san),
          amount: moveData.masterGamesAmount || 0,
        }))
      : [];
  }
}
