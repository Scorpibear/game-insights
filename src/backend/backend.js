// backend.js

import { CheguraClient } from "../clients/chegura-client";
import { ChessComClient } from "../clients/chesscom-client";
import { LichessClient } from "../clients/lichess-client";
import { mergeGameStats } from "../helpers/converters";
import BestMoveCache from "./best-move-cache";
import { GamesMerger } from "../helpers/games-merger";
import { AltMovesDBSynced } from "./alt-moves-db-synced";

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
    this.altMovesDB = new AltMovesDBSynced();
  }
  analyze(moves) {
    return this.cheguraClient.analyze(moves);
  }

  /**
   * Get best move for provided fen
   * @param {string} fen FEN notation as a string
   * @returns {Promise<{bestMove: string, alt: Array<string>, fen: string}>} information about the best move (san) and alternative best (array of san), if there is such
   */
  async getBestMove(fen) {
    let fenData;
    try {
      fenData = await this.bestMoveCache.getFenData(fen);
    } catch (err) {
      // do nothing, no need to spam in console
    }
    return this.addAlt(fenData, fen);
  }
  addAlt(data, fen) {
    const alt = this.altMovesDB.get(fen);
    return alt !== undefined ? { ...data, alt } : data;
  }
  /**
   *
   * @param {string} fen
   * @returns {Promise<{moves: [{san: string, masterGamesAmount: number, onlineGamesAmount: number}], opening: string}>}
   */
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
  updateAltMoves(fen, moves) {
    this.altMovesDB.update(fen, moves);
  }
  getGames(userData, gamesToLoad) {
    return this.gamesMerger.getLastGames(userData, gamesToLoad);
  }
}
