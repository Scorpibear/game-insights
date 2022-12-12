import { beforeAll, describe, expect, it, vi } from "vitest";
import { ChesscomClient } from "./chesscom-client";

const spyOn = vi.spyOn;

describe("chess.com client", () => {
  let chesscomClient;
  beforeAll(() => {
    chesscomClient = new ChesscomClient();
  });
  describe("getGamesArchives", () => {
    it("fetch https://api.chess.com/pub/player/${username}/games/archives", async () => {
      spyOn(global, "fetch").mockResolvedValue({
        json: () => Promise.resolve({}),
      });
      await chesscomClient.getGamesArchives("testuser");
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.chess.com/pub/player/testuser/games/archives"
      );
    });
  });
  describe("getGamesForMonth", () => {
    it("fetch https://api.chess.com/pub/player/${username}/games/${year}/${month}", async () => {
      const body = {
        on: (event, handler) => {
          if (event == "end") {
            handler();
          }
        },
      };
      spyOn(global, "fetch").mockResolvedValue({ body });
      await chesscomClient.getGamesForMonth("testuser", 2022, 12);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.chess.com/pub/player/testuser/games/2022/12",
        { headers: { Accept: "application/x-ndjson" } }
      );
    });
  });
});
