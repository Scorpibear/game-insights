import { describe, expect, test, vi } from "vitest";
import { LichessClient } from "./lichess-client";

describe('lichess client', () => {
  const lichessClient = new LichessClient();
  describe('getTheMostPopularByMasters', () => {
    test('fetch endpoint: https://explorer.lichess.ovh/masters', () => {
      vi.spyOn(global, 'fetch').mockImplementation(() => ({json: () => {}}));
      lichessClient.getTheMostPopularByMasters('TESTFEN');
      expect(fetch).toHaveBeenCalledWith('https://explorer.lichess.ovh/masters?fen=TESTFEN', {headers: {Accept:'application/json' }});
    })
  })
})