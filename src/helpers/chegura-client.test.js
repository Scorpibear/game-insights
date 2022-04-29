import { describe, expect } from "vitest";
import { CheguraClient } from "./chegura-client";

describe('CheguraClient', () => {
  describe('getBaseUrl', () => {
    test('use protocol, hostname and port', () => {
      let cheguraClient = new CheguraClient({hostname: 'testhost', protocol: 'https', port: 87654})
      expect(cheguraClient.getBaseUrl()).toBe('https://testhost:87654/api/');
    })
  })
});