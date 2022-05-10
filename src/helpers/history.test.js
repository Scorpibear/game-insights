import { describe, expect, it } from "vitest";
import History from "./history";

describe("History", () => {
  it("gets what has been set", () => {
    let history = new History();
    history.set("keyA", 42);
    expect(history.get("keyA")).toBe(42);
  });
  it("makes a key value expired if ttl is specified", async () => {
    let history = new History({ ttl: 1 });
    history.set("myKey", "value5");
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2);
    });
    expect(history.get("myKey")).toBeUndefined();
  });
});
