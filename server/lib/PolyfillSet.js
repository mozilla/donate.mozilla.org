class PolyfillSet {
  constructor(polyfillset) {
    this.data = polyfillset;
  }

  static stringify() {
    return Object.keys(this.data).map(featureName => {
      const flags = this.data[featureName].flags;
      return featureName + (flags.length ? '|' + flags.join('|') : '');
    }, this).join(',');
  }

  get() {
    return this.data;
  }
}

module.exports = function PolyfillSetFromQueryParams(polyfillList, additionalFlags) {
  const list = polyfillList.split(',').filter(x => x.length);
  additionalFlags = additionalFlags || [];

  return new PolyfillSet(list.sort().reduce((obj, name) => {
    const nameAndFlags = name.split('|');
    obj[nameAndFlags[0]] = {
      flags: nameAndFlags.slice(1).concat(additionalFlags)
    };

    return obj;
  }, {}));
};
