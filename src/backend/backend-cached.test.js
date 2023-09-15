import { describe, expect, it, vi, afterEach } from "vitest";
import { BackendCached } from "./backend-cached";
const spyOn = vi.spyOn;

describe("backendCached", () => {
  let backend = {
    analyze: () => {},
    getBestMove: () => Promise.resolve({}),
    getGames: () => Promise.resolve([{}]),
    getPopularMoves: () => Promise.resolve([{}]),
    updateAltMoves: () => {},
  };
  let cached = new BackendCached(backend);
  let fen = "some test fen";

  describe("constructor", () => {
    it("creates named local histories", () => {
      expect(cached.analyzeCache.options.name).toBe("analyzeCache");
      expect(cached.analyzeCache.constructor.name).toBe("HistoryLocal");
    });
  });
  describe("getShared", () => {
    it("provides the same instance", () => {
      expect(BackendCached.getShared()).toBe(BackendCached.getShared());
    })
  })
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
    afterEach(() => {
      vi.restoreAllMocks();
    })
  });
  describe("getBestMove", () => {
    it("returns result from backend", async () => {
      const bestMoveData = { bestMove: "Nf3", cp: 23, depth: 75 };
      vi.spyOn(backend, "getBestMove").mockResolvedValue(bestMoveData);
      expect(await cached.getBestMove("some valid fen")).toBe(bestMoveData);
    });
  });
  describe("getPopularMoves", () => {
    it("calls backend when cache is empty", () => {
      spyOn(backend, "getPopularMoves");
      cached.getPopularMoves(fen);
      expect(backend.getPopularMoves).toHaveBeenCalled();
    });
    it("calls backend when cache is expired", () => {
      spyOn(cached.popularCache, 'get').mockReturnValue(undefined);
      spyOn(backend, "getPopularMoves");
      cached.getPopularMoves(fen);
      expect(backend.getPopularMoves).toHaveBeenCalled();
    });
    it("uses cache when it presented", async () => {
      const cachedData = {moves: [{san: "f6", popularOnline: 67890}]};
      spyOn(cached.popularCache, "get").mockReturnValue(cachedData);
      expect(await cached.getPopularMoves(fen)).toBe(cachedData);
    });
    afterEach(() => {
      vi.restoreAllMocks();
    })
  });
  describe("updateAltMoves", () => {
    it("calles backend as is", () => {
      vi.spyOn(backend, "updateAltMoves");
      cached.updateAltMoves("fen", ["c4"]);
      expect(backend.updateAltMoves).toHaveBeenCalledWith("fen", ["c4"]);
    });
    afterEach(() => {
      vi.restoreAllMocks();
    })
  });
  describe("getGames", () => {
    it("returns result from backend", async () => {
      const games = [{ pgn: "1.e4 c5" }, { pgn: "1.d4 Nf6" }];
      vi.spyOn(backend, "getGames").mockResolvedValue(games);
      expect(await cached.getGames({ lichessUsername: "testuser" }, 2)).toBe(
        games
      );
    });
    afterEach(() => {
      vi.restoreAllMocks();
    })
  });
});
