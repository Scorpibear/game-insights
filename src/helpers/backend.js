import { CheguraClient } from "./chegura-client";
import { LichessClient } from "./lichess-client";
import { lichess2fenData } from "./converters";

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
    return this.cheguraClient.analyze(moves);
  }
  async getBestMove(fen) {
    let fenData;
    try {
      fenData = await this.cheguraClient.getFenData(fen);
    } catch (err) {
      console.error("Could not get fen data from chegura", err);
    }
    return (
      fenData?.bestMove ||
      this.lichessClient.getCloudEval(fen).then(lichess2fenData)
    );
  }
  getPopularMove(fen) {
    return this.lichessClient.getTheMostPopularByMasters(fen);
  }
}
