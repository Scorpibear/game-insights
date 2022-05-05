export class CheguraClient {
  constructor({ hostname, protocol, port }) {
    this.getBaseUrl = () => `${protocol}://${hostname}:${port}/api/`;
  }
  analyze(moves) {
    console.log("Chegura Client Analyze", moves);
    const url = `${this.getBaseUrl()}analyze`;
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({ moves }),
    });
  }
  async getFenData(fen) {
    const url = `${this.getBaseUrl()}fendata?fen=${fen}`;
    try {
      const response = await fetch(url);
      return response.json();
    } catch (err) {
      console.error("Could not get fenData from chegura: ", err);
    }
  }
}
