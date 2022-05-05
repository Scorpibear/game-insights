import { Backend } from "./backend";
import NodeCache from "node-cache";

const fourHours = 1000 * 60 * 60 * 4;
const fourDays = fourHours * 24;
const plyLimit = 50;

export class BackendCached {
  constructor(backend) {
    this.backend = backend || new Backend();
    this.analyzeCache = new NodeCache({ stdTTL: fourDays });
    this.bestMoveCache = new NodeCache({ stdTTL: fourHours });
  }
  analyze(moves) {
    moves = moves.slice(0, plyLimit);
    const key = moves.join(" ");
    let result = this.analyzeCache.get(key);
    if (!result) {
      result = this.backend.analyze(moves);
      this.analyzeCache.set(key, result);
    }
    return result;
  }
  getBestMove(fen) {
    let result = this.bestMoveCache.get(fen);
    if (!result) {
      result = this.backend.getBestMove(fen);
      this.bestMoveCache.set(fen, result);
    }
    return result;
  }
  getPopularMove(fen) {
    return this.lichessClient.getTheMostPopularByMasters(fen);
  }
}
