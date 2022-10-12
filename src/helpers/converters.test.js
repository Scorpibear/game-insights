import { describe, expect, it } from "vitest";
import {
  pgn2moves,
  lichess2fenData,
  mergeGameStats,
  num2k,
  formatBest,
  formatPopular,
} from "./converters";

describe("converters", () => {
  describe("pgn2moves", () => {
    it("works for lichess standard pgn", () => {
      const pgn = `[Event "Rated Rapid game"]
      [Site "https://lichess.org/eLGsJ1H1"]
      [Date "2022.04.30"]
      [White "proctovladimir"]
      [Black "Scorpibear"]
      
      1. d4 Nf6 2. Nf3 d5 3. Bf4 c5 4. e3 Nc6 5. c3 e6 6. Bd3 Bd6 7. Bg3 O-O 8. Nbd2 b6 9. Bh4 Be7 10. O-O Qc7 11. Rc1 e5 12. dxe5 Nxe5 13. Bg3 Bd6 14. Nxe5 Bxe5 15. Bxe5 Qxe5 16. Nf3 Qh5 17. Be2 Re8 18. Nd4 Qg6 19. Bd3 Qh6 20. Nf5 Bxf5 21. Bxf5 Qg5 22. Qf3 Ne4 23. Bxe4 dxe4 24. Qe2 Re6 25. Rcd1 Rg6 26. f3 exf3 27. Qxf3 Rf6 28. Qxa8# 1-0
      `;
      const moves = pgn2moves(pgn);
      expect(moves.length).toBe(55);
      expect(moves[0]).toBe("d4");
      expect(moves[54]).toBe("Qxa8#");
    });
    it("works for empty pgn", () => {
      expect(pgn2moves("")).toEqual([]);
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
    it("uses score as is if present", () => {
      expect(formatBest({ bestMove: "Nf3", score: 0.12, depth: 50 })).toEqual({
        san: "Nf3",
        score: 0.12,
        depth: 50,
      });
    });
    it("transforms null into undefined", () => {
      expect(formatBest(null)).toBeUndefined();
    });
    it("returns undefined if bestMove is missed", () => {
      expect(formatBest({ cp: -67, depth: 67 })).toBeUndefined();
    });
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
