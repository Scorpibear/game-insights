import { describe, expect, it } from "vitest";
import History from "./history";

describe("History", () => {
  it("gets what has been set", () => {
    let history = new History();
    history.set("keyA", 42);
    expect(history.get("keyA")).toBe(42);
  });
});
