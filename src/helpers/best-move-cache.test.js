import { beforeEach, describe, expect, it, vi } from "vitest";
import BestMoveCache from "./best-move-cache";
import { fourWeeks, fourHours } from "./constants";

describe("bestMoveCache", () => {
  const fenBase = [["fen1", { bestMove: "Nf3" }]];
  const fenBaseAsStr = JSON.stringify(fenBase);
  const fenData = { fen: "fen1", bestMove: "d4" };
  const fakeCloudClient = {
    getFenBase: () => Promise.resolve(fenBase),
    getFenData: () => Promise.resolve(fenData),
  };
  describe("constructor", () => {
    it("uses localStorage first", async () => {
      vi.spyOn(localStorage, "getItem").mockImplementation((key) =>
        key == "fenbase" ? fenBaseAsStr : Date.now()
      );
      vi.spyOn(fakeCloudClient, "getFenBase");
      const bestMoveCache = new BestMoveCache(fakeCloudClient);
      const fenBase = await bestMoveCache.fenBaseAsPromised;
      expect(JSON.stringify([...fenBase])).toBe(fenBaseAsStr);
      expect(fakeCloudClient.getFenBase).not.toHaveBeenCalled();
    });
    it("if no fenbase in localStorage get it from cloud", async () => {
      vi.spyOn(localStorage, "getItem").mockResolvedValue(undefined);
      const bestMoveCache = new BestMoveCache(fakeCloudClient);
      const returnedFenBase = await bestMoveCache.fenBaseAsPromised;
      expect([...returnedFenBase]).toEqual(fenBase);
    });
    it("if localStorage exists but created >4weeks ago, update it from cloud", async () => {
      vi.spyOn(localStorage, "getItem").mockImplementation((key) => {
        switch (key) {
          case "fenbase":
            return JSON.stringify([["fen1", { bestMove: "d4" }]]);
          case "fenbase-created":
            return Date.now() - fourWeeks;
        }
      });
      const bestMoveCache = new BestMoveCache(fakeCloudClient);
      const returnedFenBase = await bestMoveCache.fenBaseAsPromised;
      expect([...returnedFenBase]).toEqual(fenBase);
    });
    it("when updated from cloud, new creation date is saved", async () => {
      const fixedtime = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(fixedtime);
      vi.spyOn(localStorage, "setItem");
      vi.spyOn(localStorage, "getItem").mockReturnValue(undefined); // to make sure cloud call will be made
      await new BestMoveCache(fakeCloudClient).fenBaseAsPromised; // required to make sure cloud call finalized
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "fenbase-created",
        fixedtime
      );
    });
    it("logs error of fenBase is in incorrect format in localStorage", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(localStorage, "getItem").mockReturnValue(Date.now());
      new BestMoveCache(fakeCloudClient);
      expect(console.error).toHaveBeenCalled();
    });
  });
  describe("getFenData", () => {
    let bestMoveCache;
    beforeEach(() => {
      bestMoveCache = new BestMoveCache(fakeCloudClient);
    });
    it("no calls to cloud if fen is in cache", async () => {
      vi.spyOn(fakeCloudClient, "getFenData");
      await bestMoveCache.getFenData("fen1");
      expect(fakeCloudClient.getFenData).not.toHaveBeenCalled();
    });
    it("if fen is undefined, calls cloud", async () => {
      vi.spyOn(fakeCloudClient, "getFenData");
      await bestMoveCache.getFenData("fen43(unknown)");
      expect(fakeCloudClient.getFenData).toHaveBeenCalled();
    });
    it("saves requested time of the last cloud update", async () => {
      const fixedtime = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(fixedtime);
      let returnedFenData = await bestMoveCache.getFenData("fen43(unknown)");
      expect(returnedFenData.updated).toBe(fixedtime);
    });
    it("calls cloud if last requested time >4 hours", async () => {
      vi.spyOn(fakeCloudClient, "getFenData");
      bestMoveCache.fenBaseAsPromised = Promise.resolve(
        new Map([
          ["fen2", { bestMove: "c4", updated: Date.now() - fourHours - 1000 }],
        ])
      );
      await bestMoveCache.getFenData("fen2");
      expect(fakeCloudClient.getFenData).toHaveBeenCalled();
    });
    it("does not call cloud if last requested time is <4 hours", async () => {
      vi.spyOn(fakeCloudClient, "getFenData");
      bestMoveCache.fenBaseAsPromised = Promise.resolve(
        new Map([
          ["fen2", { bestMove: "c4", updated: Date.now() - fourHours + 1000 }],
        ])
      );
      await bestMoveCache.getFenData("fen2");
      expect(fakeCloudClient.getFenData).not.toHaveBeenCalled();
    });
    it("does not spam log with errors if no fen data in the cloud", async () => {
      vi.spyOn(console, "error");
      vi.spyOn(fakeCloudClient, "getFenData").mockRejectedValue("no data");
      await bestMoveCache.getFenData("fen-unknown");
      expect(console.error).not.toHaveBeenCalled();
    });
  });
  describe("updateAltMoves", () => {
    it("saves alt to base", async () => {
      vi.spyOn(fakeCloudClient, "getFenBase").mockResolvedValue([
        ["fen1", { bestMove: "Nf3" }],
      ]);
      const bestMoveCache = new BestMoveCache(fakeCloudClient);
      expect(fakeCloudClient.getFenBase).toHaveBeenCalled();
      vi.spyOn(bestMoveCache, "saveBase").mockImplementation((base) => base);
      await bestMoveCache.updateAltMoves("fen1", ["d4"]);
      expect(bestMoveCache.saveBase).toHaveBeenCalled();
    });
    it("creates a new node if fenData not defined", async () => {
      vi.spyOn(Date, "now").mockReturnValue(12345678);
      const bestMoveCache = new BestMoveCache(fakeCloudClient);
      await bestMoveCache.updateAltMoves("testFenNew", ["d4"]);
      expect(await bestMoveCache.getFenData("testFenNew")).toEqual({
        alt: ["d4"],
        updated: 12345678,
      });
    });
  });
});
