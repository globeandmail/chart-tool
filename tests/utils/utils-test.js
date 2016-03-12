'use strict';

var hasItselfAsExport = require("../meta");

describe('Utils', function() {

  jest.unmock('../../src/js/utils/utils');

  var Utils = require('../../src/js/utils/utils');

  describe('debounce', function() {

    hasItselfAsExport(Utils, 'debounce');
    var debounce = Utils.debounce;

  });

  describe('clearChart', function() {

    hasItselfAsExport(Utils, 'clearChart');
    var clearChart = Utils.clearChart;

  });

  describe('clearObj', function() {

    hasItselfAsExport(Utils, 'clearObj');
    var clearObj = Utils.clearObj;

  });

  describe('clearDrawn', function() {

    hasItselfAsExport(Utils, 'clearDrawn');
    var clearDrawn = Utils.clearDrawn;

  });

  describe('getBounding', function() {

    hasItselfAsExport(Utils, 'getBounding');
    var getBounding = Utils.getBounding;

  });

  describe('TimeObj', function() {

    hasItselfAsExport(Utils, 'TimeObj');
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

    hasItselfAsExport(Utils, 'wrapText');
    var wrapText = Utils.wrapText;

  });

  describe('timeDiff', function() {

    hasItselfAsExport(Utils, 'timeDiff');
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
          prevMinute = date - (time.minute * tolerance);

      expect(timeDiff(prevYear, date, tolerance - 1)).toBe("years");
      expect(timeDiff(prevMonth, date, tolerance - 1)).toBe("months");
      expect(timeDiff(prevWeek, date, tolerance - 1)).toBe("weeks");
      expect(timeDiff(prevDay, date, tolerance - 1)).toBe("days");
      expect(timeDiff(prevHour, date, tolerance - 1)).toBe("hours");
      expect(timeDiff(prevMinute, date, tolerance - 1)).toBe("minutes");
    });

  });

  describe('timeInterval', function() {

    hasItselfAsExport(Utils, 'timeInterval');
    var timeInterval = Utils.timeInterval;

  });

  describe('getTranslateXY', function() {

    hasItselfAsExport(Utils, 'getTranslateXY');
    var getTranslateXY = Utils.getTranslateXY;

  });

  describe('svgTest', function() {

    hasItselfAsExport(Utils, 'svgTest');
    var svgTest = Utils.svgTest;

  });

  describe('getThumbnailPath', function() {

    hasItselfAsExport(Utils, 'getThumbnailPath');
    var getThumbnailPath = Utils.getThumbnailPath;

  });

  describe('generateThumb', function() {

    hasItselfAsExport(Utils, 'generateThumb');
    var generateThumb = Utils.generateThumb;

  });

  describe('csvToTable', function() {

    hasItselfAsExport(Utils, 'csvToTable');
    var csvToTable = Utils.csvToTable;

  });


});
