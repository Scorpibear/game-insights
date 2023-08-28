import { beforeAll, describe, expect, it, vi } from "vitest";

import NoteManager from "./note-manager";

const spyOn = vi.spyOn;

describe("Note Manager", () => {
  describe("methods", () => {
    let noteManager;
    beforeAll(() => {
      noteManager = new NoteManager();
    });
    describe("getNote", () => {
      it("gets what is set", () => {
        const note = "You should move your king to safety";
        noteManager.set("fen8", note);
        expect(noteManager.get("fen8")).toBe(note);
      })
    })
  });
});
