import { afterEach, describe, expect, it, vi } from "vitest";
import { AltMovesDBSynced } from "./alt-moves-db-synced";

const spyOn = vi.spyOn;

describe("AltMovesDBSynced", () => {
  describe("constructor", () => {
    let mocks = [];
    it("loads data from localStorage", () => {
      mocks.push(
        spyOn(global.localStorage, "getItem").mockReturnValue(
          '[["fentestload",["O-O-O"]]]'
        )
      );
      let db = new AltMovesDBSynced();
      expect(db.get("fentestload")).toEqual(["O-O-O"]);
    });
    it("loads what was saved", () => {
      let db = new AltMovesDBSynced();
      db.update("fen1", ["c4"]);
      db = new AltMovesDBSynced();
      expect(db.get("fen1")).toEqual(["c4"]);
    });
    it("don't try to parse if no data in localStorage", () => {
      mocks.push(
        spyOn(global.localStorage, "getItem").mockReturnValue(undefined)
      );
      spyOn(global.JSON, "parse");
      new AltMovesDBSynced();
      expect(global.JSON.parse).not.toHaveBeenCalled();
    });
    it("initiates even if localStorage is broken", () => {
      mocks.push(
        spyOn(global.localStorage, "getItem").mockReturnValue(
          "broken{serialized string"
        )
      );
      mocks.push(spyOn(console, "error").mockImplementation(() => {}));
      expect(new AltMovesDBSynced()).toBeDefined();
    });
    afterEach(() => {
      while (mocks.length) {
        mocks.pop().restore();
      }
    });
  });
  describe("methods", () => {
    describe("update", () => {
      it("saves data to localStorage", () => {
        spyOn(localStorage, "getItem").mockResolvedValue(undefined);
        let altMovesDB = new AltMovesDBSynced();
        spyOn(global.localStorage, "setItem").mockImplementation(() => {});
        altMovesDB.update("somefen", ["c4", "d4"]);
        expect(global.localStorage.setItem).toHaveBeenCalledWith(
          "altMoves",
          '[["somefen",["c4","d4"]]]'
        );
      });
    });
    describe("get", () => {
      it("still works", () => {
        let altMovesDB = new AltMovesDBSynced();
        altMovesDB.update("fenget", ["d4", "Nf6"]);
        expect(altMovesDB.get("fenget")).toEqual(["d4", "Nf6"]);
      });
    });
  });
});
