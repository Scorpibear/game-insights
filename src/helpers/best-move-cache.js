import { fourHours, fourWeeks } from "./constants";

export default class BestMoveCache {
  constructor(cloudClient) {
    this.cloudClient = cloudClient;
    this.baseLSKey = "fenbase";
    this.baseCreatedLSKey = "fenbase-created";
    this.baseTTL = fourWeeks;
    let localFenBase;
    const created = localStorage.getItem(this.baseCreatedLSKey);
    if (created && Date.now() - created < fourWeeks) {
      const fenbaseAsStr = localStorage.getItem(this.baseLSKey);
      try {
        localFenBase = new Map(JSON.parse(fenbaseAsStr));
      } catch (err) {
        console.error(
          "Could not load fenbase from local storage: ",
          err,
          fenbaseAsStr
        );
      }
    }
    this.fenBaseAsPromised = localFenBase
      ? Promise.resolve(localFenBase)
      : this.cloudClient
          .getFenBase()
          .then((array) => new Map(array))
          .then((fenBase) => this.saveNewBaseFromCloud(fenBase))
          .catch(console.error);
  }
  saveNewBaseFromCloud(fenBase) {
    localStorage.setItem(this.baseCreatedLSKey, Date.now());
    return this.saveBase(fenBase);
  }
  saveBase(fenBase) {
    localStorage.setItem(this.baseLSKey, JSON.stringify([...fenBase]));
    return fenBase;
  }
  async getFenData(fen) {
    const fenBase = await this.fenBaseAsPromised;
    let fenData = fenBase.get(fen) || {};
    if (!fenData?.bestMove || Date.now() - fenData.updated > fourHours) {
      try {
        fenData = await this.cloudClient.getFenData(fen);
      } catch (err) {
        // no data in cloud - not an issue as it rejects with 404 for all unknown fens
      }
      fenData.updated = Date.now();
      fenBase.set(fen, fenData);
      this.fenBaseAsPromised = Promise.resolve(fenBase);
      this.saveBase(fenBase);
    }
    return Promise.resolve(fenData);
  }
  async updateAltMoves(fen, altMoves) {
    const fenBase = await this.fenBaseAsPromised;
    console.log("fenBase: ", fenBase);
    let fenData = fenBase.get(fen) || {};
    fenData.alt = altMoves;
    console.log("new fendata: ", fenData);
    fenBase.set(fen, fenData);
    this.fenBaseAsPromised = Promise.resolve(this.saveBase(fenBase));
  }
}
