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
      return Promise.reject(err);
    }
  }
  async getFenData(fen) {
    const url = `${this.getBaseUrl()}fendata?fen=${fen}`;
    try {
      const response = await fetch(url);
      return response.json().then(fixFenData);
    } catch (err) {
      console.error("Could not get fenData from chegura: ", err);
      return Promise.reject(err);
    }
  }
}

function fixFenData(data) {
  if (data && "sp" in data) {
    data.cp = data.sp;
  }
  return data;
}
