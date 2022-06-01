import { describe, expect, it, vi } from "vitest";
import { LichessClient } from "./lichess-client";

import { Backend } from "./backend";
import { CheguraClient } from "./chegura-client";

describe("backend", () => {
  let cheClient = new CheguraClient({});
  let liClient = new LichessClient();
  let backend = new Backend(cheClient, liClient);
  let fenSample = "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2";

  describe("getPopularMove", () => {
    it("calls lichessClient for the most popular move", () => {
      vi.spyOn(liClient, "getTheMostPopularByMasters").mockImplementation(() =>
        Promise.resolve({})
      );
      backend.getPopularMove();
      expect(liClient.getTheMostPopularByMasters).toHaveBeenCalled();
    });
  });
  describe("getBestMove", () => {
    it("calls cheguraClient for the best move", () => {
      vi.spyOn(cheClient, "getFenData").mockImplementation(() =>
        Promise.resolve({})
      );
      backend.getBestMove();
      expect(cheClient.getFenData).toHaveBeenCalled();
    });
    it("get lichess /api/cloud-eval if not data from chegura", async () => {
      vi.spyOn(cheClient, "getFenData").mockImplementation(() =>
        Promise.resolve({})
      );
      vi.spyOn(liClient, "getCloudEval").mockImplementation(() =>
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
  });
  describe("analyze", () => {
    it("calls chegura client", () => {
      vi.spyOn(cheClient, "analyze").mockImplementation(() =>
        Promise.resolve()
      );
      backend.analyze(["d4", "Nf6"]);
      expect(cheClient.analyze).toHaveBeenCalledWith(["d4", "Nf6"]);
    });
  });
});
