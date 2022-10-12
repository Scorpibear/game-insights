import { Backend } from "./backend";
import HistoryLocal from "./history-local";
import { fourDays, fourWeeks } from "./constants";

const plyLimit = 50;

export class BackendCached {
  static sharedInstance;
  constructor(backend) {
    this.backend = backend || new Backend();
    this.analyzeCache = new HistoryLocal({
      ttl: fourDays,
      name: "analyzeCache",
    });
    this.popularCache = new HistoryLocal({
      ttl: fourWeeks,
      name: "popularCache",
    });
  }
  static getShared() {
    this.sharedInstance = this.sharedInstance || new BackendCached();
    return this.sharedInstance;
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
  async getBestMove(fen) {
    return await this.backend.getBestMove(fen);
  }
  getPopularMove(fen) {
    let value = this.popularCache.get(fen);
    let promisedResult;
    if (!value) {
      promisedResult = this.backend.getPopularMove(fen);
      promisedResult.then((value) => {
        this.popularCache.set(fen, value);
      });
    } else {
      promisedResult = Promise.resolve(value);
    }
    return promisedResult;
  }
  async getPopularMoves(fen) {
    return await this.backend.getPopularMoves(fen);
  }
}
