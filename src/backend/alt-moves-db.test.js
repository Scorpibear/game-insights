import { describe, expect, it } from "vitest";
import { AltMovesDB } from "./alt-moves-db";

describe("AltMovesDB", () => {
  const altMovesDB = new AltMovesDB();
  describe("get", () => {
    it("gets what was updated", () => {
      altMovesDB.update("somefen", ["d4", "Nf3"]);
      expect(altMovesDB.get("somefen")).toEqual(["d4", "Nf3"]);
    });
  });
});
