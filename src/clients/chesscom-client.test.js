import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ChessComClient } from "./chesscom-client";

const spyOn = vi.spyOn;

describe("chess.com client", () => {
  let chesscomClient;
  const fetchJsonOutput = {
    json: () => Promise.resolve({}),
  };
  const g1 = { pgn: "1. e4 c5 2. Nf3" },
    g2 = { pgn: "1. d4 Nf6 2. Nf3" },
    g3 = { pgn: "1. Nf3 Nf6 2. g3" },
    g4 = { pgn: "1. c4 c5 2. Nc3" };

  beforeAll(() => {
    chesscomClient = new ChessComClient();
  });
  describe("getGamesArchives", () => {
    it("fetch https://api.chess.com/pub/player/${username}/games/archives", async () => {
      spyOn(global, "fetch").mockResolvedValue(fetchJsonOutput);
      await chesscomClient.getGamesArchives("testuser");
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.chess.com/pub/player/testuser/games/archives"
      );
    });
    it("rejects promise if fetch fails", async () => {
      vi.spyOn(global, "fetch").mockImplementationOnce(() =>
        Promise.reject("page not found")
      );
      let passed;
      try {
        await chesscomClient.getGamesArchives("unknown user");
        passed = true;
      } catch (err) {
        passed = false;
      }
      expect(passed).toBeFalsy();
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
  });
  describe("getGamesForMonth", () => {
    it("fetch https://api.chess.com/pub/player/${username}/games/${year}/${month}", async () => {
      spyOn(global, "fetch").mockResolvedValue(fetchJsonOutput);
      await chesscomClient.getGamesForMonth("testuser", 2022, 12);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.chess.com/pub/player/testuser/games/2022/12"
      );
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
  });
  describe("getLastGames", () => {
    it("get the last 3 games from the last month when they are present", async () => {
      spyOn(chesscomClient, "getGamesArchives").mockResolvedValue([
        "https://api.chess.com/pub/player/testuser/games/2022/11",
      ]);
      spyOn(chesscomClient, "getGamesByUrl").mockResolvedValue([
        g1,
        g2,
        g3,
        g4,
      ]);
      const games = await chesscomClient.getLastGames("testuser", 3);
      expect(games).toEqual([g2, g3, g4]);
    });
    it("uses the last 2 archives if in the last not enough games", async () => {
      spyOn(chesscomClient, "getGamesArchives").mockResolvedValue([
        "https://api.chess.com/pub/player/testuser/games/2022/10",
        "https://api.chess.com/pub/player/testuser/games/2022/11",
      ]);
      spyOn(chesscomClient, "getGamesByUrl").mockImplementation((url) =>
        url.includes("2022/10")
          ? Promise.resolve([g1, g2])
          : Promise.resolve([g3, g4])
      );
      const games = await chesscomClient.getLastGames("testuser", 3);
      expect(games).toEqual([g2, g3, g4]);
    });
    it("returns empty array if there are no games for the user", async () => {
      spyOn(chesscomClient, "getGamesArchives").mockResolvedValue(undefined);
      const games = await chesscomClient.getLastGames("", 1);
      expect(games).toEqual([]);
    })

    afterEach(() => {
      vi.restoreAllMocks();
    });
  });
  describe("getGamesByUrl", () => {
    it("rejects with the incorrect url data", async () => {
      spyOn(global, "fetch").mockImplementationOnce(() =>
        Promise.reject("page not found")
      );
      let passed = false;
      try {
        await chesscomClient.getGamesByUrl("https://strange.url/asdf");
        passed = true;
      } catch (err) {
        expect(err).toEqual(
          "could not get games for 'https://strange.url/asdf': page not found"
        );
      }
      expect(passed).toBeFalsy();
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
  });
});
