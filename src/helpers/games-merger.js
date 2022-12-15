export class GamesMerger {
  constructor({ chessComClient, lichessClient, chessComID, lichessID }) {
    this.chessComClient = chessComClient;
    this.lichessClient = lichessClient;
    this.chessComID = chessComID;
    this.lichessID = lichessID;
  }
  async getLastGames(amount) {
    const chessComGames = await this.chessComClient.getLastGames(
      this.chessComID,
      amount
    );
    const lichessGames = await this.lichessClient.getLastGames(
      this.lichessID,
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
