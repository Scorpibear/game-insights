import { afterEach, describe, expect, it, vi } from "vitest";
import { LichessClient } from "./lichess-client";

const spyOn = vi.spyOn;

describe("lichess client", () => {
  let mocks = [];
  const lichessClient = new LichessClient();
  describe("getTheMostPopularByMasters", () => {
    it("fetches endpoint: https://explorer.lichess.ovh/masters", () => {
      spyOn(global, "fetch").mockImplementation(() => ({ json: () => {} }));
      lichessClient.getTheMostPopularByMasters("TESTFEN");
      expect(fetch).toHaveBeenCalledWith(
        "https://explorer.lichess.ovh/masters?fen=TESTFEN",
        { headers: { Accept: "application/json" } }
      );
    });
  });
  describe("getTheMostPopularOnline", () => {
    it("fetches endpoint: https://explorer.lichess.ovh/lichess", () => {
      spyOn(global, "fetch").mockImplementation(() => ({ json: () => {} }));
      lichessClient.getTheMostPopularOnline("TESTFEN");
      expect(fetch).toHaveBeenCalledWith(
        "https://explorer.lichess.ovh/lichess?variant=standard&speeds=blitz,rapid,classical,correspondence&ratings=2000,2200,2500&fen=TESTFEN",
        { headers: { Accept: "application/json" } }
      );
    });
  });
  describe("getCloudEval", () => {
    it("fetches endpoint https://lichess.org/api/cloud-eval", async () => {
      spyOn(global, "fetch").mockResolvedValue({
        json: () => Promise.resolve({}),
      });
      await lichessClient.getCloudEval("TESTFEN");
      expect(fetch).toHaveBeenCalledWith(
        "https://lichess.org/api/cloud-eval?fen=TESTFEN",
        { headers: { Accept: "application/json" } }
      );
    });
  });
  describe("getGames", () => {
    it("calls fetch to lichess.org/api/games/user", async () => {
      const body = {
        getReader: () => ({ read: () => Promise.resolve({ done: true }) }),
      };
      mocks.push(spyOn(global, "fetch").mockResolvedValue({ body }));
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
      mocks.push(spyOn(global, "fetch").mockResolvedValue({ body }));

      expect(await lichessClient.getGames("testuser", 1)).toEqual([game]);
    });
  });
  afterEach(() => {
    while (mocks.length) {
      mocks.pop().restore();
    }
  });
});