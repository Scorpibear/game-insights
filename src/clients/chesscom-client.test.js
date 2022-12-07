import { describe, expect, it, vi } from "vitest";
import { ChesscomClient } from "./chesscom-client";

const spyOn = vi.spyOn;

describe("chess.com client", () => {
  describe("getGamesArchives", () => {
    it("fetch https://api.chess.com/pub/player/${username}/games/archives");
  });
  describe("getGamesForMonth", () => {
    it(
      "fetch https://api.chess.com/pub/player/${username}/games/${year}/${month}"
    );
  });
});
