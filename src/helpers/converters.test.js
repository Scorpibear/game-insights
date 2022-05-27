import { describe, expect, it } from "vitest";
import { pgn2moves, lichess2fenData } from "./converters";

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
    it("leaves depth as is", () => {
      const data = lichess2fenData({ depth: 42 });
      expect(data.depth).toBe(42);
    });
  });
});
