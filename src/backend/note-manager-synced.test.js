import { afterEach, describe, expect, it, vi } from "vitest";
import NoteManagerSynced from "./note-manager-synced";

const spyOn = vi.spyOn;

describe("NoteManagerSynced", () => {
  describe("constructor", () => {
    it("loads data from localStorage", () => {
      spyOn(global.localStorage, "getItem").mockReturnValue(
        '[["fen7","good move!"]]'
      );
      let mgr = new NoteManagerSynced();
      expect(mgr.get("fen7")).toEqual("good move!");
    });
    it("loads what was saved", () => {
      let mgr = new NoteManagerSynced();
      mgr.set("fen-saved", "that what was saved");
      mgr = new NoteManagerSynced();
      expect(mgr.get("fen-saved")).toEqual("that what was saved");
    });
    it("don't try to parse if no data in localStorage", () => {
      spyOn(global.localStorage, "getItem").mockReturnValue(undefined);
      spyOn(global.JSON, "parse").mockImplementation(() => {})
      new NoteManagerSynced();
      expect(global.JSON.parse).not.toHaveBeenCalled();
    });
    it("initiates even if localStorage is broken", () => {
      spyOn(global.localStorage, "getItem").mockReturnValue(
        "broken{serialized string"
      );
      spyOn(global.console, "error").mockImplementation(() => {});
      expect(new NoteManagerSynced()).toBeDefined();
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
  });
  describe("methods", () => {
    describe("set", () => {
      it("saves data to localStorage", () => {
        spyOn(localStorage, "getItem").mockResolvedValue(undefined);
        let mgr = new NoteManagerSynced();
        spyOn(global.localStorage, "setItem").mockImplementation(() => {});
        mgr.set("somefen", "some notes");
        expect(global.localStorage.setItem).toHaveBeenCalledWith(
          "notes",
          '[["somefen","some notes"]]'
        );
      });
    });
    describe("get", () => {
      it("still works", () => {
        let mgr = new NoteManagerSynced();
        mgr.set("fenget", "super useful notes");
        expect(mgr.get("fenget")).toEqual("super useful notes");
      });
    });
  });
});
