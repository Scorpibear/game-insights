import { afterEach, describe, expect, it, vi } from "vitest";
import { LichessClient } from "./lichess-client";

const spyOn = vi.spyOn;

describe("lichess client", () => {
  const lichessClient = new LichessClient();
  describe("getTheMostPopularByMasters", () => {
    it("fetches endpoint: https://explorer.lichess.ovh/masters", () => {
      spyOn(global, "fetch").mockResolvedValue({ json: () => {} });
      lichessClient.getTheMostPopularByMasters("TESTFEN");
      expect(fetch).toHaveBeenCalledWith(
        "https://explorer.lichess.ovh/masters?fen=TESTFEN",
        { headers: { Accept: "application/json" } }
      );
    });
    it("handles disconnects", async () => {
      spyOn(global, "fetch").mockRejectedValue("ERR_INTERNET_DISCONNECTED");
      const output = await lichessClient.getTheMostPopularByMasters("TESTFEN");
      expect(output).toBeNull();
    })
    afterEach(() => {
      vi.restoreAllMocks();
    });
  });
  describe("getTheMostPopularOnline", () => {
    it("fetches endpoint: https://explorer.lichess.ovh/lichess", () => {
      spyOn(global, "fetch").mockResolvedValue({ json: () => {} });
      lichessClient.getTheMostPopularOnline("TESTFEN");
      expect(fetch).toHaveBeenCalledWith(
        "https://explorer.lichess.ovh/lichess?variant=standard&speeds=blitz,rapid,classical,correspondence&ratings=2000,2200,2500&fen=TESTFEN",
        { headers: { Accept: "application/json" } }
      );
    });
    it("handles disconnects", async () => {
      spyOn(global, "fetch").mockRejectedValue("ERR_INTERNET_DISCONNECTED");
      const output = await lichessClient.getTheMostPopularOnline("TESTFEN");
      expect(output).toBeNull();
    })
    afterEach(() => {
      vi.restoreAllMocks();
    });
  });
  describe("getGames", () => {
    it("calls fetch to lichess.org/api/games/user", async () => {
      const body = {
        getReader: () => ({ read: () => Promise.resolve({ done: true }) }),
      };
      spyOn(global, "fetch").mockResolvedValue({ body });
      await lichessClient.getGames("testuser", 2);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://lichess.org/api/games/user/testuser?max=2&pgnInJson=true&opening=true",
        { headers: { Accept: "application/x-ndjson" } }
      );
    });
    it("collects games from fetch output stream", async () => {
      const game = { pgn: "1. e4 c6 2. d4 d5" };
      const reader = { read: () => {} };
      const encoder = new TextEncoder();
      spyOn(reader, "read")
        .mockResolvedValueOnce({
          done: false,
          value: encoder.encode(JSON.stringify(game)),
        })
        .mockResolvedValueOnce({ done: true });

      const body = {
        getReader: () => reader,
      };
      spyOn(global, "fetch").mockResolvedValue({ body });
      expect(await lichessClient.getGames("testuser", 1)).toEqual([game]);
    });
    it("does not call fetch if username is not specified", async () => {
      spyOn(global, 'fetch');
      await lichessClient.getGames("", 2);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
});
