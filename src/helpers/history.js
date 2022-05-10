export default class History {
  constructor(options) {
    this.map = new Map();
    this.options = options || {};
  }
  get(key) {
    console.log("HISTORY GET", key);
    return this.map.get(key);
  }
  set(key, value) {
    console.log("HISTORY SET", key, value);
    return this.map.set(key, value);
  }
}
