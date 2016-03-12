/**
 * Helpers that manipulate and check primitives. Nothing D3-specific here.
 * @module helpers/helpers
 */

/**
 * Returns true if value is a float.
 * @return {Boolean}
 */
function isFloat(n) {
  return n === +n && n !== (n|0);
}

/**
 * Simple check for whether a value is undefined or not
 * @return {Boolean}
 */
function isUndefined(val) {
  return val === undefined ? true : false;
}

/**
 * Extends 'source' object with members from 'destination'. If 'destination' is null, a deep clone of 'source' is returned
 * @param  {*} source
 * @param  {*} destination
 * @return {*}      Cloned object.
 */
function extend(source, destination) {
  if (source == null || typeof source != "object") return source;
  if (source.constructor != Object && source.constructor != Array) return source;
  if (source.constructor == Date || source.constructor == RegExp || source.constructor == Function ||
    source.constructor == String || source.constructor == Number || source.constructor == Boolean)
    return new source.constructor(source);

  destination = destination || new source.constructor();

  for (var name in source) {
    destination[name] = typeof destination[name] == "undefined" ? extend(source[name], null) : destination[name];
  }

  return destination;
}

module.exports = {
  isFloat: isFloat,
  isUndefined: isUndefined,
  extend: extend
};
