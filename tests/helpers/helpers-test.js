'use strict';

var hasItselfAsExport = require("../meta");

describe('Helpers', function() {

  jest.unmock('../../src/js/helpers/helpers');

  var Helpers = require('../../src/js/helpers/helpers');

  describe('isFloat', function() {

    hasItselfAsExport(Helpers, 'isFloat');

    var isFloat = Helpers.isFloat;

    it('returns false on strings', function() {
      expect(isFloat('test')).toBe(false);
    });

    it('returns true on float', function() {
      expect(isFloat(0.1)).toBe(true);
    });

    it('returns false on not-float', function() {
      expect(isFloat(1)).toBe(false);
    });

  });

  describe('isUndefined', function() {

    hasItselfAsExport(Helpers, 'isUndefined');

    var isUndefined = Helpers.isUndefined;

    it('returns false on strings', function() {
      expect(isUndefined('test')).toBe(false);
    });

    it('returns false on float', function() {
      expect(isUndefined(0.1)).toBe(false);
    });

    it('returns false on null', function() {
      expect(isUndefined(null)).toBe(false);
    });

    it('returns true on undefined', function() {
      expect(isUndefined(undefined)).toBe(true);
    });

  });

  describe('extend', function() {

    hasItselfAsExport(Helpers, 'extend');

    var extend = Helpers.extend;

    var firstObj = {
      fruit: "apple",
      colors: ["red", "blue", "green"],
      value: 12,
      car: "porsche"
    };

    var secondObj = {
      car: "delorean",
      clothes: ["hat", "shirt", "pants"]
    };

    var copiedObj = extend(firstObj),
        extendedObj = extend(firstObj, secondObj);

    firstObj.value = 10;

    it('returns a copy of an object', function() {
      expect(typeof copiedObj).toBe("object");
      expect(copiedObj.fruit).toBe("apple");
      expect(Array.isArray(firstObj.colors)).toBe(true);
      expect(firstObj.colors.indexOf("red")).toBe(0);
      expect(firstObj.colors.indexOf("blue")).toBe(1);
      expect(firstObj.colors.indexOf("green")).toBe(2);
      expect(copiedObj.value).toBe(12);
    });

    it('extends second object with properties from first', function() {
      expect(extendedObj.fruit).toBe("apple");
      expect(Array.isArray(extendedObj.colors)).toBe(true);
      expect(extendedObj.colors.indexOf("red")).toBe(0);
      expect(extendedObj.colors.indexOf("blue")).toBe(1);
      expect(extendedObj.colors.indexOf("green")).toBe(2);
      expect(extendedObj.value).toBe(12);
      expect(extendedObj.car).toBe("delorean");
      expect(Array.isArray(extendedObj.clothes)).toBe(true);
      expect(extendedObj.clothes.indexOf("hat")).toBe(0);
      expect(extendedObj.clothes.indexOf("shirt")).toBe(1);
      expect(extendedObj.clothes.indexOf("pants")).toBe(2);
    });

  });

});
