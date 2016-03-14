'use strict';

var hasItselfAsExport = require("../meta");

describe('Utils', function() {

  jest.unmock('../../src/js/utils/utils');

  var Utils = require('../../src/js/utils/utils');

  describe('debounce', function() {

    it('has debounce as an export', function() {
      expect(Utils.debounce).not.toBeNull();
    });

    var debounce = Utils.debounce;

    var obj = { test: "hello world" },
        testFn = function() { return obj.test; },
        timeout = 200;

    var deb = debounce(testFn, obj, timeout, window);

    it('should be a function', function() {
      expect(typeof deb).toBe("function")
    });

    it('shouldnt execute immediately', function() {
      var hasHappened = false;
      expect(hasHappened).toBe(false);
      deb();
      expect(hasHappened).toBe(false);
    });

    it('should execute after delay', function() {

      function callback() { expect(hasHappened).toBe(true); }

      var hasHappened = false;

      var fn = debounce(function() {
        hasHappened = true;
      }, null, 100, window);

      var otherFn = debounce(function() {
        callback();
      }, null, 200, window);

      expect(hasHappened).toBe(false);

      fn();
      otherFn();

    });

  });

  describe('clearChart', function() {

    it('has clearChart as an export', function() {
      expect(Utils.clearChart).not.toBeNull();
    });

    var clearChart = Utils.clearChart;

  });

  describe('clearObj', function() {

    it('has clearObj as an export', function() {
      expect(Utils.clearObj).not.toBeNull();
    });

    var clearObj = Utils.clearObj;

    it('sets the chartObj prop as undefined', function() {

      var obj = { chartObj: "test" },
          newObj = clearObj(obj);

      expect(newObj.chartObj).toBeUndefined();

    });

  });

  describe('clearDrawn', function() {

    it('has clearDrawn as an export', function() {
      expect(Utils.clearDrawn).not.toBeNull();
    });

    var clearDrawn = Utils.clearDrawn;

    var drawn = [
      { id: "tabby" },
      { id: "persian" },
      { id: "black" },
      { id: "siamese" },
      { id: "shorthair" }
    ];

    var obj = { id: "siamese" },
        dLength = drawn.length;

    it('originally has that item in its array', function() {
      var isInArray = false;
      for (var i = 0; i < drawn.length; i++) {
        if (drawn[i] && drawn[i].id === obj.id) {
          isInArray = true;
        }
      };
      expect(isInArray).toBe(true);
    });

    it('no longer has that item in its array', function() {
      Utils.clearDrawn(drawn, obj);
      var isInArray = false;
      for (var i = 0; i < drawn.length; i++) {
        if (drawn[i] && drawn[i].id === obj.id) {
          isInArray = true;
        }
      };
      expect(isInArray).toBe(false);
    });

    it('is one item shorter than before', function() {
      expect(drawn.length).toBe(dLength - 1);
    });

  });

  describe('getBounding', function() {

    it('has getBounding as an export', function() {
      expect(Utils.getBounding).not.toBeNull();
    });

    var getBounding = Utils.getBounding;

  });

  describe('TimeObj', function() {

    it('has TimeObj as an export', function() {
      expect(Utils.TimeObj).not.toBeNull();
    });

    var TimeObj = Utils.TimeObj;

    it('returns an object', function() {
      var time = new TimeObj();
      expect(typeof time).toBe("object");
    });

    it('has time properties', function() {
      var time = new TimeObj();
      expect(time.sec).toBe(1000);
      expect(time.min).toBe(60000);
      expect(time.hour).toBe(3600000);
      expect(time.day).toBe(86400000);
      expect(time.week).toBe(604800000);
      expect(time.month).toBe(2592000000);
      expect(time.year).toBe(31536000000);
    });

  });

  describe('wrapText', function() {

    it('has wrapText as an export', function() {
      expect(Utils.wrapText).not.toBeNull();
    });

    var wrapText = Utils.wrapText;

  });

  describe('timeDiff', function() {

    it('has timeDiff as an export', function() {
      expect(Utils.timeDiff).not.toBeNull();
    });

    var timeDiff = Utils.timeDiff;

    var date = new Date(),
        time = new Utils.TimeObj(),
        prevDate = date - time.year;

    it('returns a string', function() {
      expect(typeof timeDiff(prevDate, date, 3)).toBe("string");
    });

    it('should return the proper time context', function() {

      var tolerance = 4;

      var prevYear = date - (time.year * tolerance),
          prevMonth = date - (time.month * tolerance),
          prevWeek = date - (time.week * tolerance),
          prevDay = date - (time.day * tolerance),
          prevHour = date - (time.hour * tolerance),
          prevMinute = date - (time.min * tolerance),
          defaultDate = date - (time.sec * tolerance);

      expect(timeDiff(prevYear, date, tolerance - 1)).toBe("years");
      expect(timeDiff(prevMonth, date, tolerance - 1)).toBe("months");
      expect(timeDiff(prevWeek, date, tolerance - 1)).toBe("weeks");
      expect(timeDiff(prevDay, date, tolerance - 1)).toBe("days");
      expect(timeDiff(prevHour, date, tolerance - 1)).toBe("hours");
      expect(timeDiff(prevMinute, date, tolerance - 1)).toBe("minutes");
      expect(timeDiff(defaultDate, date, tolerance - 1)).toBe("days");
    });

  });

  describe('timeInterval', function() {

    it('has timeInterval as an export', function() {
      expect(Utils.timeInterval).not.toBeNull();
    });

    var timeInterval = Utils.timeInterval;

  });

  describe('getTranslateXY', function() {

    it('has getTranslateXY as an export', function() {
      expect(Utils.getTranslateXY).not.toBeNull();
    });

    var getTranslateXY = Utils.getTranslateXY;

  });

  describe('svgTest', function() {

    it('has svgTest as an export', function() {
      expect(Utils.svgTest).not.toBeNull();
    });

    var svgTest = Utils.svgTest;

  });

  describe('getThumbnailPath', function() {

    it('has getThumbnailPath as an export', function() {
      expect(Utils.getThumbnailPath).not.toBeNull();
    });

    var getThumbnailPath = Utils.getThumbnailPath;

  });

  describe('generateThumb', function() {

    it('has generateThumb as an export', function() {
      expect(Utils.generateThumb).not.toBeNull();
    });

    var generateThumb = Utils.generateThumb;

  });

  describe('csvToTable', function() {

    it('has csvToTable as an export', function() {
      expect(Utils.csvToTable).not.toBeNull();
    });

    var csvToTable = Utils.csvToTable;

  });


});
