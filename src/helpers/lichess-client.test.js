import { describe, expect, it, vi } from "vitest";
import { LichessClient } from "./lichess-client";

const spyOn = vi.spyOn;

describe("lichess client", () => {
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
});
