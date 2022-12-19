import { beforeAll, describe, expect, it, vi } from "vitest";
import { GamesMerger } from "./games-merger";

const spyOn = vi.spyOn;

describe("GamesMerger", () => {
  const ccClient = { getLastGames: () => Promise.resolve([]) };
  const liClient = { getLastGames: () => Promise.resolve([]) };
  const ccg1 = { testid: "pre-last", pgn: "1. e4 c6", end_time: 1670877300 }, // #3
    ccg2 = { testid: "second", pgn: "1. d4 Nf6", end_time: 1670877200 }, // #2
    lig1 = { testid: "last", pgn: "1. c4 Nf6", lastMoveAt: 1670877400000 }, // #4
    lig2 = { testid: "first", pgn: "1. Nf6 d5", lastMoveAt: 1670877100000 }; // #1
  const userData = {
    chessComUsername: "testuser",
    lichessUsername: "testuser",
  };
  let merger;
  beforeAll(() => {
    merger = new GamesMerger({
      chessComClient: ccClient,
      lichessClient: liClient,
    });
  });
  describe("getLastGames", () => {
    it("joins games from lichess and chess.com", async () => {
      spyOn(ccClient, "getLastGames").mockResolvedValue([ccg1, ccg2]);
      spyOn(liClient, "getLastGames").mockResolvedValue([lig1, lig2]);
      await merger.getLastGames(userData, 3);
      expect(ccClient.getLastGames).toHaveBeenCalled();
      expect(liClient.getLastGames).toHaveBeenCalled();
    });
    it("limits number of games", async () => {
      spyOn(ccClient, "getLastGames").mockResolvedValue([ccg1, ccg2]);
      spyOn(liClient, "getLastGames").mockResolvedValue([lig1, lig2]);
      const games = await merger.getLastGames(userData, 3);
      expect(games.length).toBe(3);
    });
    it("returns the most recent", async () => {
      spyOn(ccClient, "getLastGames").mockResolvedValue([ccg1, ccg2]);
      spyOn(liClient, "getLastGames").mockResolvedValue([lig1, lig2]);
      const games = await merger.getLastGames(userData, 2);
      expect(games[0].testid).toBe("last");
      expect(games[1].testid).toBe("pre-last");
    });
    it("adds lastMoveAt to chess.com games", async () => {
      spyOn(ccClient, "getLastGames").mockResolvedValue([ccg1]);
      spyOn(liClient, "getLastGames").mockResolvedValue([]);
      const [game] = await merger.getLastGames(userData, 1);
      expect(game.lastMoveAt).toBe(1670877300000);
    });
  });
});
