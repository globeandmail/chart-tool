export function isInteger(x) {
  return x % 1 === 0;
}

export function isFloat(n) {
  return n === +n && n !== (n|0);
}

export function isEmpty(val) {
  if (val.constructor == Object) {
    for (let prop in val) {
      if (val.hasOwnProperty(prop)) { return false; }
    }
    return true;
  } else if (val.constructor == Array) {
    return !val.length;
  } else {
    return !val;
  }
}

export function isUndefined(val) {
  return val === undefined ? true : false;
}

export function arrayDiff(a1, a2) {
  const o1 = {}, o2 = {}, diff = [];
  for (let i = 0; i < a1.length; i++) { o1[a1[i]] = true; }
  for (let i = 0; i < a2.length; i++) { o2[a2[i]] = true; }
  for (let k in o1) { if (!(k in o2)) { diff.push(k); } }
  for (let k in o2) { if (!(k in o1)) { diff.push(k); } }
  return diff;
}

export function arraySame(a1, a2) {
  const ret = [];
  for (let i in a1) {
    if (a2.indexOf(a1[i]) > -1){
      ret.push(a1[i]);
    }
  }
  return ret;
}

export function uniqueKeys(o1, o2) {
  return arrayDiff(Object.keys(o1), Object.keys(o2));
}

export function sameKeys(o1, o2) {
  return arraySame(Object.keys(o1), Object.keys(o2));
}

export function cleanStr(str) {
  return (str === undefined) ? '' : str;
}

export function extend(from, to) {

  let target;

  if (from == null || typeof from != 'object') return from;
  if (from.constructor != Object && from.constructor != Array) return from;
  if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
    from.constructor == String || from.constructor == Number || from.constructor == Boolean)
    return new from.constructor(from);

  target = to || new from.constructor();

  for (let name in from) {
    target[name] = typeof target[name] == 'undefined' ? extend(from[name], null) : target[name];
  }

  return target;
}
