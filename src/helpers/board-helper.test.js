import { describe, expect, it, vi } from "vitest";
import boardHelper from "./board-helper";

describe("boardHelper", () => {
  const chess = {
    turn: () => "w",
    header: () => ({ White: "Alex", Black: "Joe" }),
  };
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
