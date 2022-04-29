export class CheguraClient {
  constructor({hostname, protocol, port}) {
    this.getBaseUrl = () => `${protocol}://${hostname}:${port}/api/`;
  }
  async getFenData(fen) {
    const url = `${this.getBaseUrl()}fendata?fen=${fen}`;
    try {
      const response = await fetch(url);
      return response.json();
    } catch (err) {
      console.error('Could not get fenData from chegura: ', err);
    }
  }
    
}