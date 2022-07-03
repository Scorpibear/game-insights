import { describe, expect, it, vi } from "vitest";
import { CheguraClient } from "./chegura-client";

const spyOn = vi.spyOn;

describe("CheguraClient", () => {
  let cheguraClient = new CheguraClient({
    hostname: "testhost",
    protocol: "https",
    port: 87654,
  });
  describe("getBaseUrl", () => {
    it("uses protocol, hostname and port", () => {
      expect(cheguraClient.getBaseUrl()).toBe("https://testhost:87654/api/");
    });
    it("if protocol is ommitted, skips it", () => {
      let testClient = new CheguraClient({
        hostname: "newhost",
        protocol: "https",
      });
      expect(testClient.getBaseUrl()).toBe("https://newhost/api/");
    });
  });
  describe("analyze", () => {
    it("calls fetch after the previous call was completed", async () => {
      spyOn(global, "fetch").mockImplementation(() => Promise.resolve());
      await cheguraClient.analyze();
      cheguraClient.analyze();
      expect(global.fetch).toHaveBeenCalledOnce();
    });
    it("does not call fetch if moves were not defined");
  });
  describe("getFenData", () => {
    it("calls fetch immediately", async () => {
      spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({ json: () => Promise.resolve({}) })
      );
      await cheguraClient.getFenData("some fen");
      cheguraClient.getFenData("some fen");
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
