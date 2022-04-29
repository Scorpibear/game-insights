export class LichessClient {
  async getTheMostPopularByMasters(fen) {
    const url = `https://explorer.lichess.ovh/masters?fen=${fen}`;
    const response = await fetch(url, {headers: {Accept:'application/json' }});
    return response.json();
  }
}