import { describe, expect, it } from "vitest";
import {
  addUsername,
  pgn2moves,
  lichess2fenData,
  mergeGameStats,
  num2k,
  formatBest,
  formatPopular,
  endTime2lastMoveAt,
} from "./converters";

describe("converters", () => {
  describe("addUsername", () => {
    it("returns transform function", () => {
      const transformFunc = addUsername("testuser");
      const res = transformFunc({ pgn: "1. d4 d5" });
      expect(res).toEqual({ pgn: "1. d4 d5", username: "testuser" });
    });
  });
  describe("endTime2lastMoveAt", () => {
    it("multiplies at 1000 the value", () => {
      const game = { end_time: 1234567 };
      const outputGame = endTime2lastMoveAt(game);
      expect(outputGame.lastMoveAt).toBe(1234567000);
    });
  });
  describe("lichess2fenData", () => {
    const input = {
      fen: "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
      depth: 42,
      pvs: [
        {
          moves: "e7e6 d2d4 c7c5 c2c3 b8c6 g1f3 c8d7 b1a3 c5d4 c3d4",
          cp: 27,
        },
      ],
    };

    it("leaves depth as is", () => {
      const data = lichess2fenData(input);
      expect(data.depth).toBe(42);
    });
    it("transforms pvs data to algebraic move", () => {
      const data = lichess2fenData(input);
      expect(data.bestMove).toBe("e6");
    });
    it("transforms short castling correctly", () => {
      const input = { pvs: [{ moves: "e1h1" }] };
      const output = lichess2fenData(input);
      expect(output.bestMove).toBe("O-O");
    });
    it("transforms long castling for black", () => {
      const input = { pvs: [{ moves: "e8a8" }] };
      const output = lichess2fenData(input);
      expect(output.bestMove).toBe("O-O-O");
    });
    it("move cp to the top level property", () => {
      const data = lichess2fenData(input);
      expect(data.cp).toBe(27);
    });
  });
  describe("mergeGameStats", () => {
    it("online stats extends master", () => {
      const master = { moves: [{ san: "d4", white: 3, draws: 2, black: 1 }] };
      const online = {
        moves: [
          { san: "e4", white: 8, draws: 5, black: 3 },
          { san: "d4", white: 30, draws: 20, black: 10 },
        ],
      };
      const expected = {
        moves: [
          { san: "d4", masterGamesAmount: 6, onlineGamesAmount: 60 },
          { san: "e4", masterGamesAmount: 0, onlineGamesAmount: 16 },
        ],
      };
      expect(mergeGameStats(master, online)).toEqual(expected);
    });
  });
  describe("num2k", () => {
    it("makes 1000 as 1K", () => {
      expect(num2k(1000)).toBe("1K");
    });
    it("leaves 999 as is", () => {
      expect(num2k(999)).toBe("999");
    });
    it("makes 1000000 as 1M", () => {
      expect(num2k(1000000)).toBe("1M");
    });
    it("makes 1000000000 as 1B", () => {
      expect(num2k(1000000000)).toBe("1B");
    });
    it("makes 1e12 as 1Q", () => {
      expect(num2k(1e12)).toBe("1Q");
    });
    it("makes 1234567 as 1M", () => {
      expect(num2k(1234567)).toBe("1M");
    });
    it("makes 1093761 as 1M", () => {
      expect(num2k(1093761)).toBe("1M");
    });
  });
  describe("formatBest", () => {
    it("uses cp if score is missed", () => {
      expect(formatBest({ bestMove: "Nf3", cp: 12, depth: 50 })).toEqual({
        san: "Nf3",
        score: 0.12,
        depth: 50,
      });
    });
    it("uses cp if score is missed and cp is zero", () => {
      expect(formatBest({ bestMove: "Nf3", cp: 0, depth: 50 })).toEqual({
        san: "Nf3",
        score: 0,
        depth: 50,
      });
    });
    it("uses score as is if it is zero", () => {
      expect(formatBest({ bestMove: "Nf3", score: 0, depth: 50 })).toEqual({
        san: "Nf3",
        score: 0,
        depth: 50,
      });
    });
    it("uses score as is if present", () => {
      expect(formatBest({ bestMove: "Nf3", score: 0.12, depth: 50 })).toEqual({
        san: "Nf3",
        score: 0.12,
        depth: 50,
      });
    });
    it("uses alt as is", () => {
      expect(formatBest({ bestMove: "e4", alt: ["d4"] })).toEqual({
        san: "e4",
        alt: ["d4"],
      });
    });
    it("null in, null out", () => {
      expect(formatBest(null)).toBeNull();
    });
    it("returns empty object if no bestMove", () => {
      expect(formatBest({ cp: -67, depth: 67 })).toEqual({});
    });
    it("saves alt even if bestMove is missed", () => {
      expect(formatBest({ alt: ["e4"] })).toEqual({ alt: ["e4"] });
    });
    it("returns null, if undefined is entered as an input", () => {
      expect(formatBest(undefined)).toBeNull();
    })
  });
  describe("formatPopular", () => {
    it("displays as a readable comma-separated string", () => {
      const movesData = [
        { san: "e4", masterGamesAmount: 10, onlineGamesAmount: 100 },
        { san: "d4", masterGamesAmount: 5, onlineGamesAmount: 50 },
      ];
      expect(formatPopular(movesData)).toBe("e4 (10+100), d4 (5+50)");
    });
  });
});
