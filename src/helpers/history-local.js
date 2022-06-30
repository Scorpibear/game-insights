import History from "./history";

export default class HistoryLocal extends History {
  constructor(options) {
    super(options);
    this.localStorageKey = this.options.name
      ? `history-${this.options.name}`
      : null;
    if (this.localStorageKey) {
      try {
        let serialized = localStorage.getItem(this.localStorageKey);
        let values = JSON.parse(serialized);
        this.map = new Map(values);
      } catch (err) {
        console.error(`Unsuccessful load of '${this.localStorageKey}':`, err);
      }
    }
  }
  set(key, value) {
    let result = super.set(key, value);
    if (this.localStorageKey && global.localStorage) {
      localStorage.setItem(this.localStorageKey, JSON.stringify([...this.map]));
    }
    return result;
  }
}
