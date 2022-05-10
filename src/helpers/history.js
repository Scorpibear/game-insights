export default class History {
  constructor(options) {
    this.map = new Map();
    this.options = options || {};
  }
  get(key) {
    return this.map.get(key);
  }
  set(key, value) {
    return this.map.set(key, value);
  }
}
