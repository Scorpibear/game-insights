import { describe, expect, it, vi } from "vitest";
import { BackendCached } from "./backend-cached";

describe("backendCached", () => {
  let backend = { analyze: () => {} };
  let cached = new BackendCached(backend);
  describe("analyze", () => {
    it("does not send for analysis what was sent within 4 days", async () => {
      vi.spyOn(backend, "analyze").mockImplementation(() => Promise.resolve());
      await cached.analyze(["d4"]);
      await cached.analyze(["d4"]);
      expect(backend.analyze).toHaveBeenCalledOnce();
    });
  });
});
