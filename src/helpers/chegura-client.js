export class CheguraClient {
  constructor({ hostname, protocol, port }) {
    this.getBaseUrl = () => `${protocol}://${hostname}:${port}/api/`;
    this.lastCallResult = Promise.resolve();
    this.errorHandler = (err) => console.error(err);
  }
  async analyze(moves) {
    const url = `${this.getBaseUrl()}analyze`;
    try {
      await this.lastCallResult;
      this.lastCallResult = fetch(url, {
        method: "POST",
        body: JSON.stringify({ moves }),
      }).catch(this.errorHandler);
      return this.lastCallResult;
    } catch (err) {
      this.errorHandler(err);
    }
  }
  async getFenData(fen) {
    const url = `${this.getBaseUrl()}fendata?fen=${fen}`;
    try {
      await this.lastCallResult;
      const response = await fetch(url);
      this.lastCallResult = response.json();
      return this.lastCallResult;
    } catch (err) {
      console.error("Could not get fenData from chegura: ", err);
    }
  }
}
