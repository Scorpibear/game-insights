import { Backend } from "./backend";
import HistoryLocal from "./history-local";
import { fourDays, fourMonths } from "./constants";

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
      ttl: fourMonths,
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
  async getPopularMoves(fen) {
    let result = this.popularCache.get(fen);
    if (!result?.moves) {
      result = await this.backend.getPopularMoves(fen);
      this.popularCache.set(fen, result);
    }
    return result;
  }
  updateAltMoves(fen, altMoves) {
    this.backend.updateAltMoves(fen, altMoves);
  }
  async getGames(userData, gamesToLoad) {
    return this.backend.getGames(userData, gamesToLoad);
  }
}
