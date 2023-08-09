import { expect, it, describe } from "vitest";
import { extendPgn, pgn2moves, pgn2fen } from "./pgn-manipulations";

describe("pgn-manipulations", () => {
  describe("extendPgn", () => {
    it("works for black additions", () => {
      expect(extendPgn("1. d4 d5", "Nf3")).toEqual("1. d4 d5 2. Nf3");
    });
  });
  describe("pgn2fen", () => {
    it("works for 1. e4 e5 2. ?-?", () => {
      expect(pgn2fen("1. e4 e5 2. ?-?")).toEqual(
        "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
      );
    });
  });
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
    it("works for chess.com annotations", () => {
      const pgn = `
        [Site "Chess.com"]

        1. e4 {[%clk 0:03:00.9]} 1... c5 {[%clk 0:02:59.3]} 2. c3 {[%clk 0:03:01.2]} 2... d5 {[%clk 0:02:56]} 3. exd5 {[%clk 0:00:22.2]} 0-1
      `;
      const moves = pgn2moves(pgn);
      expect(moves).toEqual(["e4", "c5", "c3", "d5", "exd5"]);
    });
    it("works for simple pgn", () => {
      expect(pgn2moves("1. d4 d5")).toEqual(["d4", "d5"]);
    });
  });
});
