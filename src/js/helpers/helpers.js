/**
 * Helpers that manipulate and check primitives. Nothing D3-specific here.
 * @module helpers/helpers
 */

/**
 * Returns true if value is an integer, false otherwise.
 * @return {Boolean}
 */
function isInteger(x) {
  return x % 1 === 0;
}

/**
 * Returns true if value is a float.
 * @return {Boolean}
 */
function isFloat(n) {
  return n === +n && n !== (n|0);
}

/**
 * Returns true if a value is empty. Works for Objects, Arrays, Strings and Integers.
 * @return {Boolean}
 */
function isEmpty(val) {
  if (val.constructor == Object) {
    for (var prop in val) {
      if (val.hasOwnProperty(prop)) { return false; }
    }
    return true;
  } else if (val.constructor == Array) {
    return !val.length;
  } else {
    return !val;
  }
}

/**
 * Simple check for whether a value is undefined or not
 * @return {Boolean}
 */
function isUndefined(val) {
  return val === undefined ? true : false;
}

/**
 * Given two arrays, returns only unique values in those arrays.
 * @param  {Array} a1
 * @param  {Array} a2
 * @return {Array}    Array of unique values.
 */
function arrayDiff(a1, a2) {
  var o1 = {}, o2 = {}, diff= [], i, len, k;
  for (i = 0, len = a1.length; i < len; i++) { o1[a1[i]] = true; }
  for (i = 0, len = a2.length; i < len; i++) { o2[a2[i]] = true; }
  for (k in o1) { if (!(k in o2)) { diff.push(k); } }
  for (k in o2) { if (!(k in o1)) { diff.push(k); } }
  return diff;
}

/**
 * Opposite of arrayDiff(), this returns only common elements between arrays.
 * @param  {Array} arr1
 * @param  {Array} arr2
 * @return {Array}      Array of common values.
 */
function arraySame(a1, a2) {
  var ret = [];
  for (i in a1) {
    if (a2.indexOf( a1[i] ) > -1){
      ret.push( a1[i] );
    }
  }
  return ret;
}

/**
 * Extends 'from' object with members from 'to'. If 'to' is null, a deep clone of 'from' is returned
 * @param  {*} from
 * @param  {*} to
 * @return {*}      Cloned object.
 */
function extend(from, to) {
  if (from == null || typeof from != "object") return from;
  if (from.constructor != Object && from.constructor != Array) return from;
  if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
    from.constructor == String || from.constructor == Number || from.constructor == Boolean)
    return new from.constructor(from);

  to = to || new from.constructor();

  for (var name in from) {
    to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
  }

  return to;
}

/**
 * Compares two objects, returning an array of unique keys.
 * @param  {Object} o1
 * @param  {Object} o2
 * @return {Array}
 */
function uniqueKeys(o1, o2) {
  return arrayDiff(d3.keys(o1), d3.keys(o2));
}

/**
 * Compares two objects, returning an array of common keys.
 * @param  {Object} o1
 * @param  {Object} o2
 * @return {Array}
 */
function sameKeys(o1, o2) {
  return arraySame(d3.keys(o1), d3.keys(o2));
}

/**
 * If a string is undefined, return an empty string instead.
 * @param  {String} str
 * @return {String}
 */
function cleanStr(str){
  if (str === undefined) {
    return "";
  } else {
    return str;
  }
}

module.exports = {
  isInteger: isInteger,
  isFloat: isFloat,
  isEmpty: isEmpty,
  isUndefined: isUndefined,
  extend: extend,
  arrayDiff: arrayDiff,
  arraySame: arraySame,
  uniqueKeys: uniqueKeys,
  sameKeys: sameKeys,
  cleanStr: cleanStr
};
