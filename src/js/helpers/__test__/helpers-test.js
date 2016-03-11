describe('Helpers', function() {

  jest.autoMockOff();

  var Helpers = require('../helpers');

  describe('isFloat', function() {

    it('has isFloat as an export', function() {
      expect(Helpers.isFloat).not.toBeNull();
    });

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

});
