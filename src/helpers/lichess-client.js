export class LichessClient {
  async getTheMostPopularByMasters(fen) {
    const url = `https://explorer.lichess.ovh/masters?fen=${fen}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    return response.json();
  }
  async getTheMostPopularOnline(fen, options) {
    const speeds =
      options?.speeds?.join(",") || "blitz,rapid,classical,correspondence";
    const ratings = options?.ratings?.join(",") || "2000,2200,2500";
    const url = `https://explorer.lichess.ovh/lichess?variant=standard&speeds=${speeds}&ratings=${ratings}&fen=${fen}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    return response.json();
  }
  async getCloudEval(fen) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const url = `https://lichess.org/api/cloud-eval?fen=${fen}`;
        try {
          const response = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          const result = await response.json();
          resolve(result);
        } catch (err) {
          resolve({}); // no cloud eval - not an issue
        }
      }, 100);
    });
  }
}
