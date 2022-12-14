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
    const games = chessComGames.concat(lichessGames);
    return games;
  }
}
