import { Backend } from "./backend";
import HistoryLocal from "./history-local";

const fourHours = 1000 * 60 * 60 * 4;
const fourDays = fourHours * 24;
const plyLimit = 50;

export class BackendCached {
  constructor(backend) {
    this.backend = backend || new Backend();
    this.analyzeCache = new HistoryLocal({
      ttl: fourDays,
      name: "analyzeCache",
    });
    this.bestMoveCache = new HistoryLocal({
      ttl: fourHours,
      name: "bestMoveCache",
    });
  }
  async analyze(moves) {
    moves = moves.slice(0, plyLimit);
    const key = moves.join(" ");
    let value = this.analyzeCache.get(key);
    let promisedResult;
    if (value === undefined) {
      try {
        promisedResult = await this.backend.analyze(moves);
        // analyze does not provided the output, so just saving that it has been sent
        this.analyzeCache.set(key, "sent");
      } catch (err) {
        promisedResult = Promise.reject(err);
      }
    } else {
      promisedResult = Promise.resolve(value);
    }
    return promisedResult;
  }
  getBestMove(fen) {
    let value = this.bestMoveCache.get(fen);
    let promisedResult;
    if (!value || !value.bestMove) {
      promisedResult = this.backend.getBestMove(fen);
      promisedResult.then((value) => {
        this.bestMoveCache.set(fen, value);
      });
    } else {
      promisedResult = Promise.resolve(value);
    }
    return promisedResult;
  }
  getPopularMove(fen) {
    // should not be cached, returned as is
    return this.backend.getPopularMove(fen);
  }
  async getPopularMoves(fen) {
    return await this.backend.getPopularMoves(fen);
  }
}
