export class CheguraClient {
  constructor({ hostname, protocol, port }) {
    this.getBaseUrl = () =>
      `${protocol}://${hostname}${port ? ":" + port : ""}/api/`;
    this.lastCallResult = Promise.resolve();
    this.errorHandler = (err) => console.error(err);
  }
  async analyze(moves) {
    const url = `${this.getBaseUrl()}analyze?code=YChrCbCY07S7aCaEamHr7mXp-oZN3h892sYTF00QrSdGAzFuM4Sjtg==`;
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await this.lastCallResult;
          this.lastCallResult = fetch(url, {
            method: "POST",
            body: JSON.stringify({ moves }),
          }).catch(this.errorHandler);
          resolve(this.lastCallResult);
        } catch (err) {
          this.errorHandler(err);
          reject(err);
        }
      }, 100);
    });
  }
  async getFenBase() {
    const url = `${this.getBaseUrl()}fenbase?code=zwz2bDT31bM6DjNMn8wehRbrRHUyUBhOUvH4jrq-S18wAzFuKCjW1A==`;
    try {
      const response = await fetch(url);
      const fenBase = await response.json();
      return fenBase;
    } catch (err) {
      console.error("Could not get fen base: ", err);
      return Promise.reject(err);
    }
  }
  async getFenData(fen) {
    const url = `${this.getBaseUrl()}fendata?fen=${fen}&code=A1M51hEuXS8ivHQCNo0rmPkIgeg-I7CosdyYDLIV0kAaAzFuymxztg==`;
    try {
      const response = await fetch(url);
      return response.json();
    } catch (err) {
      console.error(`Could not get fenData from bestmovedb for ${fen}: `, err);
      return Promise.reject(err);
    }
  }
}
