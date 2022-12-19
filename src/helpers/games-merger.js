export class GamesMerger {
  constructor({ chessComClient, lichessClient }) {
    this.chessComClient = chessComClient;
    this.lichessClient = lichessClient;
  }
  async getLastGames(userData, amount) {
    const chessComGames = await this.chessComClient.getLastGames(
      userData.chessComUsername,
      amount
    );
    const lichessGames = await this.lichessClient.getLastGames(
      userData.lichessUsername,
      amount
    );
    const games = chessComGames
      .concat(lichessGames)
      .map((game) =>
        "endTime" in game ? { ...game, lastMoveAt: game.endTime * 1000 } : game
      ) // transform endTime property of chess.com format to lastMoveAt of lichess.org
      .sort((g1, g2) => g2.lastMoveAt - g1.lastMoveAt); // the recent first
    const lastGames = games.slice(0, amount);
    return lastGames;
  }
}
