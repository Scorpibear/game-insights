import { describe, expect, it } from "vitest";
import { CheguraClient } from "./chegura-client";

describe("CheguraClient", () => {
  describe("getBaseUrl", () => {
    it("uses protocol, hostname and port", () => {
      let cheguraClient = new CheguraClient({
        hostname: "testhost",
        protocol: "https",
        port: 87654,
      });
      expect(cheguraClient.getBaseUrl()).toBe("https://testhost:87654/api/");
    });
  });
});
