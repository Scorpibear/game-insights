import { CheguraClient } from "../clients/chegura-client";
import { ChessComClient } from "../clients/chesscom-client";
import { LichessClient } from "../clients/lichess-client";
import { lichess2fenData, mergeGameStats } from "./converters";
import BestMoveCache from "./best-move-cache";
import { GamesMerger } from "./games-merger";

export class Backend {
  constructor(cheguraClient, chessComClient, lichessClient) {
    this.cheguraClient =
      cheguraClient ||
      new CheguraClient({
        hostname: "bestmoves.azurewebsites.net", //"umain-02.cloudapp.net",
        protocol: "https", //"http",
        //port: 9966,
      });
    this.chessComClient = chessComClient || new ChessComClient();
    this.lichessClient = lichessClient || new LichessClient();
    this.bestMoveCache = new BestMoveCache(this.cheguraClient);
    this.gamesMerger = new GamesMerger({
      chessComClient: this.chessComClient,
      lichessClient: this.lichessClient,
    });
  }
  analyze(moves) {
    return this.cheguraClient.analyze(moves);
  }
  async getBestMove(fen) {
    let fenData;
    try {
      fenData = await this.bestMoveCache.getFenData(fen);
    } catch (err) {
      // do nothing, no need to spam in console
    }
    const result = fenData?.bestMove
      ? fenData
      : this.lichessClient
          .getCloudEval(fen)
          .then(lichess2fenData)
          .catch(() => {});
    return result;
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
  updateAltMoves(fen, altMoves) {
    this.bestMoveCache.updateAltMoves(fen, altMoves);
  }
  getGames(userData, gamesToLoad) {
    return this.gamesMerger.getLastGames(userData, gamesToLoad);
  }
}
