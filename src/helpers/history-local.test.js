import { describe, expect, it } from "vitest";
import HistoryLocal from "./history-local";

describe("HistoryLocal", () => {
  it("saves the state between creation", () => {
    let history = new HistoryLocal({ name: "test" });
    history.set("keyA", "valueA");
    let history2 = new HistoryLocal({ name: "test" });
    expect(history2.get("keyA")).toBe("valueA");
  });
});
