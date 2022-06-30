import { CheguraClient } from "./chegura-client";
import { LichessClient } from "./lichess-client";
import { lichess2fenData, mergeGameStats } from "./converters";

export class Backend {
  constructor(cheguraClient, lichessClient) {
    this.cheguraClient =
      cheguraClient ||
      new CheguraClient({
        hostname: "bestmoves.azurewebsites.net", //"umain-02.cloudapp.net",
        protocol: "https", //"http",
        //port: 9966,
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
    const result = fenData?.bestMove
      ? fenData
      : this.lichessClient.getCloudEval(fen).then(lichess2fenData);
    return result;
  }
  async getPopularMove(fen) {
    const movesData = await this.lichessClient.getTheMostPopularByMasters(fen);
    return movesData && movesData.length ? movesData[0] : null;
  }
  async getPopularMoves(fen) {
    let jointData = {};
    try {
      const masters = await this.lichessClient.getTheMostPopularByMasters(fen);
      const online = await this.lichessClient.getTheMostPopularOnline(fen);
      jointData = mergeGameStats(masters, online);
    } catch (err) {
      console.error(err);
    }
    return jointData;
  }
}
