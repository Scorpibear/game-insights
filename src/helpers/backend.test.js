import { describe, expect, it, vi } from "vitest";
import { LichessClient } from "./lichess-client";

import { Backend } from "./backend";
import { CheguraClient } from "./chegura-client";

const spyOn = vi.spyOn;

describe("backend", () => {
  let cheClient = new CheguraClient({});
  let liClient = new LichessClient();
  let backend = new Backend(cheClient, liClient);
  let fenSample = "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2";

  describe("getPopularMove", () => {
    it("calls lichessClient for the most popular move", () => {
      spyOn(liClient, "getTheMostPopularByMasters").mockImplementation(() =>
        Promise.resolve({})
      );
      backend.getPopularMove();
      expect(liClient.getTheMostPopularByMasters).toHaveBeenCalled();
    });
  });
  describe("getPopularMoves", () => {
    it("calls lichessClient to get top 5 most popular by masters", async () => {
      spyOn(liClient, "getTheMostPopularByMasters").mockImplementation(() =>
        Promise.resolve({})
      );
      await backend.getPopularMoves(fenSample);
      expect(liClient.getTheMostPopularByMasters).toHaveBeenCalled();
    });
    it("calls lichessClient to get top 5 most popular online", async () => {
      spyOn(liClient, "getTheMostPopularOnline").mockImplementation(() => {
        Promise.resolve({});
      });
      await backend.getPopularMoves(fenSample);
      expect(liClient.getTheMostPopularOnline).toHaveBeenCalled();
    });
    it("merge number of games", async () => {
      spyOn(liClient, "getTheMostPopularByMasters").mockImplementation(() =>
        Promise.resolve({
          moves: [{ san: "d4", white: 1, draws: 2, black: 3 }],
        })
      );
      spyOn(liClient, "getTheMostPopularOnline").mockImplementation(() =>
        Promise.resolve({
          moves: [{ san: "d4", white: 4, draws: 5, black: 6 }],
        })
      );
      const results = await backend.getPopularMoves(fenSample);
      expect(results.moves).toEqual([
        { san: "d4", masterGamesAmount: 6, onlineGamesAmount: 15 },
      ]);
    });
  });
  describe("getBestMove", () => {
    it("calls cheguraClient for the best move", () => {
      spyOn(cheClient, "getFenData").mockImplementation(() =>
        Promise.resolve({})
      );
      backend.getBestMove();
      expect(cheClient.getFenData).toHaveBeenCalled();
    });
    it("get lichess /api/cloud-eval if not data from chegura", async () => {
      spyOn(cheClient, "getFenData").mockImplementation(() =>
        Promise.resolve({})
      );
      spyOn(liClient, "getCloudEval").mockImplementation(() =>
        Promise.resolve({
          fen: "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
          knodes: 13683,
          depth: 50,
          pvs: [
            {
              moves: "c8f5 d2d4 e7e6 g1f3 g8e7 c1e3 c7c5 d4c5 e7c6 b1c3",
              cp: -13,
            },
          ],
        })
      );
      const data = await backend.getBestMove(fenSample);
      expect(data).toEqual({ bestMove: "Bf5", cp: -13, depth: 50 });
    });
    it("throws error if there is no best move data from any sources", async () => {
      spyOn(cheClient, "getFenData").mockRejectedValue("err1");
      spyOn(liClient, "getCloudEval").mockRejectedValue("err2");
      try {
        const res = await backend.getBestMove(fenSample);
        throw new Error(`result ${res} returned while was not expected`);
      } catch (err) {
        // as expected
      }
    });
  });
  describe("analyze", () => {
    it("calls chegura client", () => {
      spyOn(cheClient, "analyze").mockImplementation(() => Promise.resolve());
      backend.analyze(["d4", "Nf6"]);
      expect(cheClient.analyze).toHaveBeenCalledWith(["d4", "Nf6"]);
    });
  });
});
