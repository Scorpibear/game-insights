import { beforeAll, describe, expect, it, vi } from "vitest";
import { GamesMerger } from "./games-merger";

const spyOn = vi.spyOn;

describe("GamesMerger", () => {
  const ccClient = { getLastGames: () => Promise.resolve([]) };
  const liClient = { getLastGames: () => Promise.resolve([]) };
  const g1 = { pgn: "1. e4 c6" },
    g2 = { pgn: "1. d4 Nf6" },
    g3 = { pgn: "1. c4 Nf6" },
    g4 = { pgn: "1.Nf6 d5" };
  let merger;
  beforeAll(() => {
    merger = new GamesMerger({
      chessComClient: ccClient,
      lichessClient: liClient,
    });
  });
  describe("getLastGames", () => {
    it("joins games from lichess and chess.com", async () => {
      spyOn(ccClient, "getLastGames").mockResolvedValue([g1, g2]);
      spyOn(liClient, "getLastGames").mockResolvedValue([g3, g4]);
      await merger.getLastGames(3);
      expect(ccClient.getLastGames).toHaveBeenCalled();
      expect(liClient.getLastGames).toHaveBeenCalled();
    });
    it("limits number of games");
    it("cuts off the oldest");
  });
});
