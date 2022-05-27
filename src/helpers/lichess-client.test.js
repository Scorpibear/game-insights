import { describe, expect, it, vi } from "vitest";
import { LichessClient } from "./lichess-client";

describe("lichess client", () => {
  const lichessClient = new LichessClient();
  describe("getTheMostPopularByMasters", () => {
    it("fetches endpoint: https://explorer.lichess.ovh/masters", () => {
      vi.spyOn(global, "fetch").mockImplementation(() => ({ json: () => {} }));
      lichessClient.getTheMostPopularByMasters("TESTFEN");
      expect(fetch).toHaveBeenCalledWith(
        "https://explorer.lichess.ovh/masters?fen=TESTFEN",
        { headers: { Accept: "application/json" } }
      );
    });
  });
  describe("getCloudEval", () => {
    it("fetches endpoint https://lichess.org/api/cloud-eval", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
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
