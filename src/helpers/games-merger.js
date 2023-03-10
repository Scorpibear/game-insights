import { addUsername, endTime2lastMoveAt, pgn2moves } from "./converters";

export class GamesMerger {
  static PLY_REQUIRED = 5;
  constructor({ chessComClient, lichessClient }) {
    this.chessComClient = chessComClient;
    this.lichessClient = lichessClient;
  }
  async getLastGames(userData, amount) {
    const filterKoef = 2;
    const chessComGames = (
      await this.chessComClient.getLastGames(
        userData.chessComUsername,
        amount * filterKoef
      )
    )
      .map(endTime2lastMoveAt)
      .map(addUsername(userData.chessComUsername));
    const lichessGames = (
      await this.lichessClient.getLastGames(
        userData.lichessUsername,
        amount * filterKoef
      )
    ).map(addUsername(userData.lichessUsername));
    const games = chessComGames
      .concat(lichessGames)
      .sort((g1, g2) => g2.lastMoveAt - g1.lastMoveAt); // the recent first
    const lastGames = games.filter(hasEnoughPly).slice(0, amount);
    return lastGames;
  }
}

const hasEnoughPly = (game) =>
  pgn2moves(game.pgn).length >= GamesMerger.PLY_REQUIRED;
