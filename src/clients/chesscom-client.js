import { readStream } from "../helpers/stream-reader";

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
    return new Promise((resolve, reject) => {
      try {
        const stream = fetch(url, {
          headers: { Accept: "application/x-ndjson" },
        });
        const games = [];
        const onMessage = (game) => {
          games.push(game);
        };
        const onComplete = () => {
          resolve(games);
        };
        stream.then(readStream(onMessage)).then(onComplete).catch(reject);
      } catch (err) {
        reject(
          `could not get games archives for user '${username}', year '${year}', month '${month}' : ${err}`
        );
      }
    });
  }
}
