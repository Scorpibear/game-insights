import { beforeAll, describe, expect, it, vi } from "vitest";

import { Backend } from "./backend";

const spyOn = vi.spyOn;

describe("backend", () => {
  let cheClient = {
    getFenBase: () => Promise.resolve([]),
    getFenData: () => Promise.resolve({ bestMove: "Nf3" }),
    analyze: () => Promise.resolve(),
  };
  let chessComClient = {};
  let liClient = {
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
      backend = new Backend(cheClient, chessComClient, liClient);
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
      it("returns undefined if there is no best move data from any sources", async () => {
        spyOn(backend.bestMoveCache, "getFenData").mockRejectedValue("err1");
        const res = await backend.getBestMove(fenSample);
        expect(res).toBeUndefined();
      });
      it("does not spoil console with errors if there is no data from any sources", async () => {
        spyOn(console, "error");
        spyOn(backend.bestMoveCache, "getFenData").mockRejectedValue("err1");
        await backend.getBestMove(fenSample);
        expect(console.error).not.toHaveBeenCalled();
      });
      it("get alt moves", async () => {
        spyOn(backend.altMovesDB, "get").mockReturnValue(["c5", "e5"]);
        const data = await backend.getBestMove(fenSample);
        expect(data.alt).toEqual(["c5", "e5"]);
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
      it("uses games merger to get last games", async () => {
        const games = [{ pgn: "1.e4 c5" }, { pgn: "1.d4 Nf6" }];
        const userData = {
          chesscomUsername: "testuser",
          lichessUsername: "testuser",
        };
        vi.spyOn(backend.gamesMerger, "getLastGames").mockResolvedValue(games);
        expect(await backend.getGames(userData, 2)).toBe(games);
      });
    });
    describe("updateAltMoves", () => {
      it("calls update to AltMovesDB", () => {
        spyOn(backend.altMovesDB, "update").mockImplementation(() => {});
        backend.updateAltMoves("testfen", ["c5", "d5"]);
        expect(backend.altMovesDB.update).toHaveBeenCalledWith("testfen", [
          "c5",
          "d5",
        ]);
      });
    });
    describe("addAlt", () => {
      it("provide valid object in case of no best move data but alt is available", () => {
        spyOn(backend.altMovesDB, "get").mockReturnValueOnce(["e4"]);
        expect(backend.addAlt(undefined, "somefen")).toEqual({
          alt: ["e4"],
        });
      });
    });
  });
});
