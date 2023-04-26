import { describe, expect, it, vi } from "vitest";
import boardHelper from "./board-helper";

describe("boardHelper", () => {
  const chess = {
    turn: () => "w",
    header: () => ({ White: "Alex", Black: "Joe" }),
  };
  describe("getGames", () => {
    const pgn = "1. e4 c6";
    const moves = ["d4", "Nf3"];
    const username = "nakajan";
    const orientation = "white";
    it("saves username and orientation", () => {
      expect(boardHelper.getGames(pgn, moves, username, orientation)).toEqual([
        { pgn: pgn + " 2. d4", username, orientation },
        { pgn: pgn + " 2. Nf3", username, orientation },
      ]);
    });
  });
  describe("identifyOrientation", () => {
    it("returns white if header has this info for specified username", () => {
      expect(boardHelper.identifyOrientation(chess, "Alex")).toBe("white");
    });
    it("returns black from header when usernames matches", () => {
      expect(boardHelper.identifyOrientation(chess, "Joe")).toBe("black");
    });
    it("uses turn info (white) if username is missed", () => {
      expect(boardHelper.identifyOrientation(chess, undefined)).toBe("white");
    });
    it("uses turn info (black) if username is missed", () => {
      vi.spyOn(chess, "turn").mockImplementation(() => "b");
      expect(boardHelper.identifyOrientation(chess, undefined)).toBe("black");
    });
  });
});
