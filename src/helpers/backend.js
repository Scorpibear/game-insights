import { CheguraClient } from "./chegura-client";
import { LichessClient } from "./lichess-client";

export class Backend {
  constructor(cheguraClient, lichessClient) {
    this.cheguraClient =
      cheguraClient ||
      new CheguraClient({
        hostname: "umain-02.cloudapp.net",
        protocol: "http",
        port: 9966,
      });
    this.lichessClient = lichessClient || new LichessClient();
  }
  analyze(moves) {
    console.log("analyze", moves);
    return this.cheguraClient.analyze(moves);
  }
  getBestMove(fen) {
    console.log(`get best move for '${fen}'`);
    return this.cheguraClient.getFenData(fen);
  }
  getPopularMove(fen) {
    return this.lichessClient.getTheMostPopularByMasters(fen);
  }
}
