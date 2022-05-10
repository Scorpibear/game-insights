const defaultTTL = 1000 * 60 * 60 * 24 * 30;

export default class History {
  constructor(options) {
    this.map = new Map();
    this.options = options || {};
  }
  get(key) {
    const data = this.map.get(key);
    return data
      ? Date.now() < data.expireAt
        ? data.value
        : undefined
      : undefined;
  }
  set(key, value) {
    return this.map.set(key, {
      value,
      expireAt: Date.now() + (this.options.ttl || defaultTTL),
    });
  }
}
