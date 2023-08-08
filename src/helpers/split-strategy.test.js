import { it, vi, beforeAll, expect } from "vitest";
import SplitStrategy from "./split-strategy";
import { pgn2fen } from "./pgn-manipulations";

const spyOn = vi.spyOn;

describe("SplitStrategy", () => {
  const backend = {
    getPopularMoves: () =>
      Promise.resolve({ moves: [{ san: "c5" }, { san: "e5" }] }),
    getBestMove: () => Promise.resolve({ bestMove: "Nf3" }),
  };
  let strategy;

  beforeAll(() => {
    strategy = new SplitStrategy(backend);
  });
  describe("addBestMove", () => {
    it("extends pgn with the best move", async () => {
      const result = await strategy.addBestMove("1. e4 e5");
      expect(result).toEqual("1. e4 e5 2. Nf3");
    });
  });
  describe("split2top3", () => {
    it("gets 3 from popular", async () => {
      spyOn(backend, "getPopularMoves").mockResolvedValueOnce({
        moves: [{ san: "Nf3" }, { san: "Nc3" }, { san: "c3" }],
      });
      expect(await strategy.split2top(3, "1. e4 c5")).toEqual([
        "1. e4 c5 2. Nf3",
        "1. e4 c5 2. Nc3",
        "1. e4 c5 2. c3",
      ]);
    });
  });
  describe("split2top", () => {
    const pgnStats = {
      "1. e4": [
        { san: "c5", masterGamesAmount: 500 },
        { san: "e5", masterGamesAmount: 250 },
        { san: "e6", masterGamesAmount: 150 },
        { san: "c6", masterGamesAmount: 90 },
        { san: "d6", masterGamesAmount: 41 },
      ],
      "1. e4 c5 2. Nf3": [
        { san: "d6", masterGamesAmount: 200 },
        { san: "Nc6", masterGamesAmount: 120 },
        { san: "e6", masterGamesAmount: 100 },
        { san: "g6", masterGamesAmount: 8 },
      ],
      "1. e4 c5 2. Nf3 d6 3. Nc3": [
        { san: "Nf6", masterGamesAmount: 2 },
        { san: "a6", masterGamesAmount: 0.8 },
      ],
      "1. e4 c5 2. Nf3 Nc6 3. Bb5": [
        { san: "g6", masterGamesAmount: 16 },
        { san: "e6", masterGamesAmount: 9 },
      ],
      "1. e4 c5 2. Nf3 e6 3. d4": [
        { san: "cxd4", masterGamesAmount: 74 },
        { san: "a6", masterGamesAmount: 0.07 },
        { san: "d5", masterGamesAmount: 0.05 },
      ],
      "1. e4 e5 2. Nf3": [
        { san: "Nc6", masterGamesAmount: 202 },
        { san: "Nf6", masterGamesAmount: 27 },
        { san: "d6", masterGamesAmount: 6 },
      ],
      "1. e4 e5 2. Nf3 Nf6 3. Nxe5": [
        { san: "d6", masterGamesAmount: 18 },
        { san: "Nxe4", masterGamesAmount: 0.2 },
      ],
      "1. e4 e6 2. d4": [
        { san: "d5", masterGamesAmount: 125 },
        { san: "c5", masterGamesAmount: 1 },
      ],
      "1. e4 e6 2. d4 d5 3. Nc3": [
        { san: "Bb4", masterGamesAmount: 29 },
        { san: "Nf6", masterGamesAmount: 26 },
        { san: "dxe4", masterGamesAmount: 5 },
        { san: "Nc6", masterGamesAmount: 1 },
        { san: "Be7", masterGamesAmount: 0.3 },
      ],
    };
    const bestMoves = {
      "1. e4 c5": "2. Nf3",
      "1. e4 e5": "2. Nf3",
      "1. e4 e6": "2. d4",
      "1. e4 c5 2. Nf3 d6": "3. Nc3",
      "1. e4 c5 2. Nf3 e6": "3. d4",
      "1. e4 e6 2. d4 d5": "3. Nc3",
    };
    const fenStats = {};
    for (const pgn in pgnStats) {
      fenStats[pgn2fen(pgn)] = pgnStats[pgn];
    }
    const fakeAddBestMove = (pgn) =>
      Promise.resolve(
        pgn in bestMoves ? pgn + " " + bestMoves[pgn] : undefined,
      );
    it("gets 3 from root and second main if it more popular then 4th root", async () => {
      spyOn(backend, "getPopularMoves").mockImplementation((fen, depth) =>
        Promise.resolve({ moves: fenStats[fen].slice(0, depth) }),
      );
      spyOn(strategy, "addBestMove").mockImplementation(fakeAddBestMove);
      expect(await strategy.split2top(4, "1. e4")).toEqual([
        "1. e4 c5",
        "1. e4 e5",
        "1. e4 e6",
        "1. e4 c5 2. Nf3 Nc6",
      ]);
    });
    it("returns top 5", async () => {
      spyOn(backend, "getPopularMoves").mockImplementation((fen, depth) =>
        Promise.resolve({ moves: fenStats[fen].slice(0, depth) }),
      );
      spyOn(strategy, "addBestMove").mockImplementation(fakeAddBestMove);
      expect(await strategy.split2top(5, "1. e4")).toEqual([
        "1. e4 c5", // 500
        "1. e4 e5", // 250
        "1. e4 e6", // 150
        "1. e4 c5 2. Nf3 Nc6", // 120
        "1. e4 c5 2. Nf3 e6", // 100
      ]);
    });
    it("returns top 6", async () => {
      spyOn(backend, "getPopularMoves").mockImplementation((fen, depth) =>
        Promise.resolve({ moves: fenStats[fen].slice(0, depth) }),
      );
      spyOn(strategy, "addBestMove").mockImplementation(fakeAddBestMove);
      expect(await strategy.split2top(6, "1. e4")).toEqual([
        "1. e4 c5", // 500
        "1. e4 e5", // 250
        "1. e4 e6", // 150
        "1. e4 c5 2. Nf3 Nc6", // 120
        "1. e4 c5 2. Nf3 e6", // 100
        "1. e4 c6", // 90
      ]);
    });
    it("sort first and second level by popularity", async () => {
      spyOn(backend, "getPopularMoves").mockImplementation((fen, depth) =>
        Promise.resolve({ moves: fenStats[fen].slice(0, depth) }),
      );
      spyOn(strategy, "addBestMove").mockImplementation(fakeAddBestMove);
      expect(await strategy.split2top(8, "1. e4")).toEqual([
        "1. e4 c5", // 500
        "1. e4 e5", // 250
        "1. e4 e6", // 150
        "1. e4 c5 2. Nf3 Nc6", // 120
        "1. e4 c5 2. Nf3 e6", // 100
        "1. e4 c6", // 90
        "1. e4 d6", // 41
        "1. e4 e5 2. Nf3 Nf6", // 27
      ]);
    });
    it("looks at 3rd level", async () => {
      spyOn(backend, "getPopularMoves").mockImplementation((fen, depth) =>
        Promise.resolve({ moves: fenStats[fen].slice(0, depth) }),
      );
      spyOn(strategy, "addBestMove").mockImplementation(fakeAddBestMove);
      expect(await strategy.split2top(10, "1. e4")).toEqual([
        "1. e4 c5", // 500
        "1. e4 e5", // 250
        "1. e4 e6", // 150
        "1. e4 c5 2. Nf3 Nc6", // 120
        "1. e4 c5 2. Nf3 e6", // 100
        "1. e4 c6", // 90
        "1. e4 d6", // 41
        "1. e4 e5 2. Nf3 Nf6", // 27
        "1. e4 e6 2. d4 d5 3. Nc3 Nf6", // 26
        "1. e4 c5 2. Nf3 g6", // 8
        /* out
        "1. e4 e5 2. Nf3 d6", // 6
        */
      ]);
    });
    it("number of getPopularMoves calls is less than number of moves to get", async () => {
      spyOn(backend, "getPopularMoves").mockImplementation(() =>
        Promise.resolve({
          moves: Array(18).fill({
            san:
              ["a", "b", "c", "d", "e", "f", "g", "h"][
                (Math.random() * 8) | 0
              ] +
              (((Math.random() * 4) | 0) + 3),
            masterGamesAmount: (Math.random() * 500) | 0,
          }),
        }),
      );
      spyOn(strategy, "addBestMove").mockImplementation(
        (pgn) => pgn + Math.random() * 99,
      );
      await strategy.split2top(18, "1. e4 c6 2. d4");
      let callsCount = backend.getPopularMoves.mock.calls.length;
      console.log("backend.getPopularMoves.calls:", callsCount);
      expect(callsCount).lessThanOrEqual(18);
    });
    it("number of getPopularMoves calls is 1 for top3 request", async () => {
      spyOn(backend, "getPopularMoves").mockImplementation(() =>
        Promise.resolve({
          moves: Array(18).fill({
            san:
              ["a", "b", "c", "d", "e", "f", "g", "h"][
                (Math.random() * 8) | 0
              ] +
              (((Math.random() * 4) | 0) + 3),
            masterGamesAmount: (Math.random() * 500) | 0,
          }),
        }),
      );
      spyOn(strategy, "addBestMove").mockImplementation(
        (pgn) => pgn + Math.random() * 99,
      );
      await strategy.split2top(3, "1. e4 c6 2. d4");
      expect(backend.getPopularMoves).toHaveBeenCalledTimes(1);
    });
  });
  describe("getPopularMovesStats", () => {
    it("returns empty list if there is no popular data", async () => {
      spyOn(backend, "getPopularMoves").mockResolvedValue(undefined);
      expect(await strategy.getPopularMovesStats("some", 42)).toEqual([]);
    });
  });
});
