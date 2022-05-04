import { describe, expect, it, vi} from 'vitest';
import { LichessClient } from './lichess-client';

import { Backend } from './backend';
import { CheguraClient } from './chegura-client';

describe('backend', () => {
  let cheClient = new CheguraClient({});
  let liClient = new LichessClient();
  let backend = new Backend(cheClient, liClient);
  describe('getPopularMove', () => {
    it('calls lichessClient for the most popular move', () => {
      vi.spyOn(liClient, 'getTheMostPopularByMasters').mockImplementation(() => Promise.resolve({}));
      backend.getPopularMove();
      expect(liClient.getTheMostPopularByMasters).toHaveBeenCalled();
    })
  })
  describe('getBestMove', () => {
    it('calls cheguraClient for the best move', () => {
      vi.spyOn(cheClient, 'getFenData').mockImplementation(() => Promise.resolve({}));
      backend.getBestMove();
      expect(cheClient.getFenData).toHaveBeenCalled();
    })
  })
})