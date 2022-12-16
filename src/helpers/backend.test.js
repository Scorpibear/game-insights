import { beforeAll, describe, expect, it, vi } from "vitest";

import { Backend } from "./backend";

const spyOn = vi.spyOn;

describe("backend", () => {
  let cheClient = {
    getFenBase: () => Promise.resolve([]),
    getFenData: () => Promise.resolve({ bestMove: "Nf3" }),
    analyze: () => Promise.resolve(),
  };
  let liClient = {
    getCloudEval: () => Promise.resolve({ bestMove: "d4" }),
    getGames: () => Promise.resolved([{}]),
    getTheMostPopularByMasters: () => Promise.resolve({}),
    getTheMostPopularOnline: () => Promise.resolve({}),
  };
  let backend;
  let fenSample = "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2";
  describe("constructor", () => {
    it("creates chegura instance if not specified", () => {
      let backend = new Backend();
      expect(backend.cheguraClient).toBeDefined();
    });
  });
  describe("methods", () => {
    beforeAll(() => {
      backend = new Backend(cheClient, liClient);
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
      it("logs error if server request fails", async () => {
        spyOn(console, "error").mockImplementation(() => {});
        spyOn(liClient, "getTheMostPopularByMasters").mockRejectedValue(
          "gracefully fails"
        );
        await backend.getPopularMoves("some fen");
        expect(console.error).toHaveBeenCalled();
      });
    });
    describe("getBestMove", () => {
      it("calls bestMoveCache for the best move", () => {
        spyOn(backend.bestMoveCache, "getFenData").mockImplementation(() =>
          Promise.resolve({ bestMove: "Nf6" })
        );
        backend.getBestMove();
        expect(backend.bestMoveCache.getFenData).toHaveBeenCalled();
      });
      it("get lichess /api/cloud-eval if data from bestMoveCache is empty", async () => {
        spyOn(backend.bestMoveCache, "getFenData").mockImplementation(() =>
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
      it("get cloudEval if bestMoveCache fails", async () => {
        spyOn(backend.bestMoveCache, "getFenData").mockRejectedValue("oops");
        spyOn(liClient, "getCloudEval");
        await backend.getBestMove("some fen");
        expect(liClient.getCloudEval).toHaveBeenCalled();
      });
      it("returns undefined if there is no best move data from any sources", async () => {
        spyOn(cheClient, "getFenData").mockRejectedValue("err1");
        spyOn(liClient, "getCloudEval").mockRejectedValue("err2");
        const res = await backend.getBestMove(fenSample);
        expect(res).toBeUndefined();
      });
      it("does not spoil console with errors if there is no data from any sources", async () => {
        spyOn(console, "error");
        spyOn(cheClient, "getFenData").mockRejectedValue("err1");
        spyOn(liClient, "getCloudEval").mockRejectedValue("err2");
        await backend.getBestMove(fenSample);
        expect(console.error).not.toHaveBeenCalled();
      });
    });
    describe("analyze", () => {
      it("calls chegura client", () => {
        spyOn(cheClient, "analyze").mockImplementation(() => Promise.resolve());
        backend.analyze(["d4", "Nf6"]);
        expect(cheClient.analyze).toHaveBeenCalledWith(["d4", "Nf6"]);
      });
    });
    describe("getGames", () => {
      it("get games from lichess", async () => {
        const games = [{ pgn: "1.e4 c5" }, { pgn: "1.d4 Nf6" }];
        vi.spyOn(liClient, "getGames").mockResolvedValue(games);
        expect(await backend.getGames({ lichessUsername: "testuser" }, 2)).toBe(
          games
        );
      });
    });
    describe("updateAltMoves", () => {
      it("calls bestMoveCache as is", () => {
        spyOn(backend.bestMoveCache, "updateAltMoves").mockImplementation(
          () => {}
        );
        backend.updateAltMoves("fen", ["d4"]);
        expect(backend.bestMoveCache.updateAltMoves).toHaveBeenCalledWith(
          "fen",
          ["d4"]
        );
      });
    });
  });
});
