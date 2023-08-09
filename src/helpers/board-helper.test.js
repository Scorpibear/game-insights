import { describe, expect, it, vi } from "vitest";
import BoardHelper from "./board-helper";

const spyOn = vi.spyOn;

describe("boardHelper", () => {
  const chess = {
    turn: () => "w",
    header: () => ({ White: "Alex", Black: "Joe" }),
  };
  const backend = {};
  const boardHelper = new BoardHelper(backend);
  describe("getGamesFromMoves", () => {
    const pgn = "1. e4 c6";
    const moves = ["d4", "Nf3"];
    const username = "nakajan";
    const orientation = "white";
    it("saves username and orientation", () => {
      expect(
        boardHelper.getGamesFromMoves({ pgn, username, orientation }, moves),
      ).toEqual([
        { pgn: pgn + " 2. d4", username, orientation },
        { pgn: pgn + " 2. Nf3", username, orientation },
      ]);
    });
  });
  describe("getTopGames", () => {
    it("replaces pgn with split2top results", async () => {
      const initGame = {
        pgn: "1. e4 c6 2. d4",
        username: "helicopter",
        orientation: "white",
      };
      const pgn1 = "1. e4 c6 2. d4 d5",
        pgn2 = "1. e4 c6 2. d4 g6";
      spyOn(boardHelper.splitStrategy, "split2top").mockResolvedValue([
        pgn1,
        pgn2,
      ]);
      const result = await boardHelper.getTopGames(initGame, 1);
      expect(result).toEqual([
        { ...initGame, pgn: pgn1 },
        { ...initGame, pgn: pgn2 },
      ]);
    });
  });
  describe("getGameInfo", () => {
    it("get one object with username, orientation, pgn and opening", () => {
      const username = "abc",
        orientation = "black",
        openingInfo = { name: "Ruy Lopez", eco: "E60" },
        pgn = "1. e4 e5 2. Nf3 Nc6 3. Bb4";
      const gameInfo = boardHelper.getGameInfo(
        { game: { username } },
        { orientation: () => orientation },
        { value: openingInfo },
        { pgn: () => pgn },
      );
      expect(gameInfo).toEqual({
        username,
        orientation,
        openingInfo,
        pgn,
      });
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
