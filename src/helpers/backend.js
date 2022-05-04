import { CheguraClient } from './chegura-client';
import { LichessClient } from './lichess-client';

export class Backend {
  constructor(cheguraClient, lichessClient) {
    this.cheguraClient = cheguraClient || new CheguraClient({hostname: 'umain-02.cloudapp.net', protocol: 'http', port: 9966});
    this.lichessClient = lichessClient || new LichessClient();
  }
  getBestMove(fen) {
    return this.cheguraClient.getFenData(fen);
  }
  getPopularMove(fen) {
    return this.lichessClient.getTheMostPopularByMasters(fen);
  }
}