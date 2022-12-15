export class ChesscomClient {
  async getGamesArchives(username) {
    const url = `https://api.chess.com/pub/player/${username}/games/archives`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.archives;
    } catch (err) {
      return Promise.reject(
        `could not get games archives for '${username}' : ${err}`
      );
    }
  }
  async getGamesForMonth(username, year, month) {
    const url = `https://api.chess.com/pub/player/${username}/games/${year}/${month}`;
    return this.getGamesByUrl(url);
  }
  async getGamesByUrl(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.games;
    } catch (err) {
      return Promise.reject(`could not get games for '${url}': ${err}`);
    }
  }
  async getLastGames(username, amount) {
    const archives = await this.getGamesArchives(username);
    const games = [];
    while (games.length < amount && archives.length > 0) {
      const lastGames = await this.getGamesByUrl(archives.pop());
      while (games.length < amount && lastGames.length > 0) {
        games.push(lastGames.pop());
      }
    }
    return games.reverse();
  }
}
