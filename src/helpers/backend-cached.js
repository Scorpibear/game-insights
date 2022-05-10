import { Backend } from "./backend";
import History from "./history";

const fourHours = 1000 * 60 * 60 * 4;
const fourDays = fourHours * 24;
const plyLimit = 50;

export class BackendCached {
  constructor(backend) {
    this.backend = backend || new Backend();
    this.analyzeCache = new History({ ttl: fourDays });
    this.bestMoveCache = new History({ ttl: fourHours });
  }
  analyze(moves) {
    moves = moves.slice(0, plyLimit);
    const key = moves.join(" ");
    let value = this.analyzeCache.get(key);
    let promisedResult;
    if (!value) {
      promisedResult = this.backend.analyze(moves);
      promisedResult.then(() => {
        // analyze does not provided the output, so just saving that it has been sent
        this.analyzeCache.set(key, "sent");
      });
    } else {
      promisedResult = Promise.resolve(value);
    }
    return promisedResult;
  }
  getBestMove(fen) {
    let value = this.bestMoveCache.get(fen);
    let promisedResult;
    if (!value) {
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
}
