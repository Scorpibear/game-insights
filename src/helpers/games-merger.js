import { addUsername, endTime2lastMoveAt } from "./converters";

export class GamesMerger {
  constructor({ chessComClient, lichessClient }) {
    this.chessComClient = chessComClient;
    this.lichessClient = lichessClient;
  }
  async getLastGames(userData, amount) {
    const chessComGames = (
      await this.chessComClient.getLastGames(userData.chessComUsername, amount)
    )
      .map(endTime2lastMoveAt)
      .map(addUsername(userData.chessComUsername));
    const lichessGames = (
      await this.lichessClient.getLastGames(userData.lichessUsername, amount)
    ).map(addUsername(userData.lichessUsername));
    const games = chessComGames
      .concat(lichessGames)
      .sort((g1, g2) => g2.lastMoveAt - g1.lastMoveAt); // the recent first
    const lastGames = games.slice(0, amount);
    return lastGames;
  }
}
