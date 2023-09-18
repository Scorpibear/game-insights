import { readStream } from "../helpers/stream-reader";

export class LichessClient {
  getTheMostPopularByMasters(fen) {
    const url = `https://explorer.lichess.ovh/masters?fen=${fen}`;
    return fetch(url, {
      headers: { Accept: "application/json" },
    }).then(response => response.json()).catch(() => null);
  }
  getTheMostPopularOnline(fen, options) {
    const speeds =
      options?.speeds?.join(",") || "blitz,rapid,classical,correspondence";
    const ratings = options?.ratings?.join(",") || "2000,2200,2500";
    const url = `https://explorer.lichess.ovh/lichess?variant=standard&speeds=${speeds}&ratings=${ratings}&fen=${fen}`;
    return fetch(url, {
      headers: { Accept: "application/json" },
    }).then(response => response.json()).catch(() => null);
  }
  getGamesEndpoint(userID, gamesToLoad) {
    return `https://lichess.org/api/games/user/${userID}?max=${gamesToLoad}&pgnInJson=true&opening=true`;
  }
  async getGames(userID, gamesToLoad = 3) {
    return new Promise((resolve, reject) => {
      try {
        const games = [];
        if(!userID) {
          resolve(games);
          return;
        }
        const apiURL = this.getGamesEndpoint(userID, gamesToLoad);
        const stream = fetch(apiURL, {
          headers: { Accept: "application/x-ndjson" },
        });
        
        const onMessage = (game) => {
          games.push(game);
        };
        const onComplete = () => {
          resolve(games);
        };
        stream.then(readStream(onMessage)).then(onComplete).catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }
  async getLastGames(userId, gamesToLoad) {
    return this.getGames(userId, gamesToLoad);
  }
}
