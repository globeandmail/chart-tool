  function weekday() {

    cache = {};

    // Returns the weekday number for the given date relative to January 1, 1970.
    function weekday(date) {
      c = cache[date];
      if (c != null) {
        return c;
      }

      var weekdays = weekdayOfYear(date),
          year = date.getFullYear();
      while (--year >= 1970) weekdays += weekdaysInYear(year);

      cache[date] = weekdays;

      //if we're looking up a weekend day, make sure we cache the correct weekday
      if (cache[weekdays] == null) {

        newDate = new Date(date);
        offset = newDate.getDay() == 0 ? -2 : newDate.getDay() == 6 ? -1 : 0;

        if (offset > 0) {
          date.setDate(date.getDate() + offset);

          //cache the new date as well
          cache[newDate] = weekdays;
        }

        cache[weekdays] = newDate;
      }

      return weekdays;
    }

    //multiplier to go from weekday number to miliseconds (javascript timestamp)
    weekday.factor = 864e5;

    // Returns the date for the specified weekday number relative to January 1, 1970.
    weekday.invert = function(weekdays) {
      c = cache[weekdays];
      if (c != null) {
        return c;
      }

      var lookupWeekdays = weekdays;
      var year = 1970,
          yearWeekdays;

      // Compute the year.
      while ((yearWeekdays = weekdaysInYear(year)) <= weekdays) {
        ++year;
        weekdays -= yearWeekdays;
      }

      // Compute the date from the remaining weekdays.
      var days = weekdays % 5,
          day0 = ((new Date(year, 0, 1)).getDay() + 6) % 7;
      if (day0 + days > 4) days += 2;

      date = new Date(year, 0, (weekdays / 5 | 0) * 7 + days + 1);

      cache[date] = lookupWeekdays;
      cache[lookupWeekdays] = date;

      return date;
    };

    // Returns the number of weekdays in the specified year.
    function weekdaysInYear(year) {
      return weekdayOfYear(new Date(year, 11, 31)) + 1;
    }

    // Returns the weekday number for the given date relative to the start of the year.
    function weekdayOfYear(date) {
      var days = d3.time.dayOfYear(date),
          weeks = days / 7 | 0,
          day0 = (d3.time.year(date).getDay() + 6) % 7,
          day1 = day0 + days - weeks * 7;
      return Math.max(0, days - weeks * 2
          - (day0 <= 5 && day1 >= 5 || day0 <= 12 && day1 >= 12) // extra saturday
          - (day0 <= 6 && day1 >= 6 || day0 <= 13 && day1 >= 13)); // extra sunday
    }

  return weekday;

  }

  module.exports = weekday;
