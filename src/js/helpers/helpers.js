/**
 * Helpers that manipulate and check primitives. Nothing D3-specific here.
 * @module helpers/helpers
 */

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
  let o1 = {}, o2 = {}, diff = [], i, len, k;
  for (i = 0, len = a1.length; i < len; i++) { o1[a1[i]] = true; }
  for (i = 0, len = a2.length; i < len; i++) { o2[a2[i]] = true; }
  for (k in o1) { if (!(k in o2)) { diff.push(k); } }
  for (k in o2) { if (!(k in o1)) { diff.push(k); } }
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
