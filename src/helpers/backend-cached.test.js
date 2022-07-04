import { describe, expect, it, vi } from "vitest";
import { BackendCached } from "./backend-cached";
const spyOn = vi.spyOn;

describe("backendCached", () => {
  let backend = {
    analyze: () => {},
    getPopularMoves: () => Promise.resolve([{}]),
  };
  let cached = new BackendCached(backend);
  let fen = "some test fen";

  describe("constructor", () => {
    it("creates named local histories", () => {
      expect(cached.analyzeCache.options.name).toBe("analyzeCache");
      expect(cached.bestMoveCache.options.name).toBe("bestMoveCache");
      expect(cached.analyzeCache.constructor.name).toBe("HistoryLocal");
      expect(cached.bestMoveCache.constructor.name).toBe("HistoryLocal");
    });
  });
  describe("analyze", () => {
    it("does not send for analysis what was sent within 4 days", async () => {
      vi.spyOn(backend, "analyze").mockImplementation(() => Promise.resolve());
      await cached.analyze(["d4"]);
      await cached.analyze(["d4"]);
      expect(backend.analyze).toHaveBeenCalledOnce();
    });
    it("rejects the promise when analyze of backend rejects the promise", async () => {
      vi.spyOn(backend, "analyze").mockImplementation(() =>
        Promise.reject("something went wrong")
      );
      try {
        await cached.analyze(["e4", "e5", "Nf3"]);
        expect.fail("error was supressed");
      } catch (err) {
        expect(err).toContain("something went wrong");
      }
    });
  });
  describe("getPopularMoves", () => {
    it("calls backend when cache is empty", () => {
      spyOn(backend, "getPopularMoves");
      cached.getPopularMoves(fen);
      expect(backend.getPopularMoves).toHaveBeenCalled();
    });
    it("calls backend when cache is expired");
    it("uses cache when it presented");
  });
});
