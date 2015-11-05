// Expecting a function that can map between non-uniform day scale (weekdays,
// for eg.) and a linear scale. The map function needs to return linear values
// as output, given a input Date(), respond to .invert() given a value from
// linear scale and return a corresponding Date() object, and a .factor
// property containing a multplier to convert the linear values to
// miliseconds.
//
// This scale is currently tailored to weekday scale, as the values in
// dayselect_time_scaleSteps reflect 5 day weeks. It should be possible to
// calculate these values based on the map function, rather than hardcoding
// them into the function.
//
// In theory, it should be possible to use any function that does similar
// mapping, for eg. business hours. Let's call it weekhours and each hour of a
// business week would be mapped onto a uniform scale just like weekdays.
// Performance of this kind of map may be an issue though.

function daySelect(mapFunction) {

  function dayselect_scale(linear, methods, format, mapFunction) {

    function scale(x) {
      return linear(x);
    }

    function tickMethod(extent, count) {
      var span = extent[1] - extent[0];
      //var target = span / count;
      var target = span * mapFunction.factor / count;
      var i = d3.bisect(dayselect_time_scaleSteps, target);
      /* changing 31536e6 to 22550.4e6, to factor for shorter years */
      return i == dayselect_time_scaleSteps.length ? [dayselect_time_scaleLocalMethods.year, dayselect_scale_linearTickRange(extent.map(function(d) { return d / 22550.4e6; }), count)[2]]
          : !i ? [dayselect_time_scaleMilliseconds, dayselect_scale_linearTickRange(extent, count)[2]]
          : dayselect_time_scaleLocalMethods[target / dayselect_time_scaleSteps[i - 1] < dayselect_time_scaleSteps[i] / target ? i - 1 : i];
    }

    scale.ticks = function(interval, skip) {
      var extent = dayselect_scaleExtent(x.domain());
      var method = interval == null ? tickMethod(extent, 10)
          : typeof interval === "number" ? tickMethod(extent, interval)
          : !interval.range && [{range: interval}, skip]; // assume deprecated range function

      if (method) interval = method[0], skip = method[1];

      //return
      out = interval.range(mapFunction.invert(extent[0]), mapFunction.invert(+extent[1] + 1), skip < 1 ? 1 : skip); // inclusive upper bound

      //convert to weekdays
      return out.map(function(e) { return mapFunction(e); });
    }

    scale.tickFormat = function() {
      return format;
    };

    scale.copy = function() {
      return dayselect_scale(linear.copy(), methods, format, mapFunction);
    };

    return d3.rebind(scale, linear, "nice", "domain", "invert", "range", "rangeRound", "interpolate", "clamp");
  }

  /* clean copy from d3, becase we're crossing namespaces */
  function dayselect_scale_linearTickRange(domain, m) {
    if (m == null) m = 10;

    var extent = dayselect_scaleExtent(domain),
        span = extent[1] - extent[0],
        step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)),
        err = m / span * step;

    // Filter ticks to get closer to the desired count.
    if (err <= .15) step *= 10;
    else if (err <= .35) step *= 5;
    else if (err <= .75) step *= 2;

    // Round start and stop values to step interval.
    extent[0] = Math.ceil(extent[0] / step) * step;
    extent[1] = Math.floor(extent[1] / step) * step + step * .5; // inclusive
    extent[2] = step;
    return extent;
  }

  /* clean copy from d3, becase we're crossing namespaces */
  function dayselect_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];

    return start < stop ? [start, stop] : [stop, start];
  }

  /* clean copy from d3, becase we're crossing namespaces */
  function dayselect_time_scaleDate(t) {
    return new Date(mapFunction.invert(t));
  }

  var dayselect_time_scaleSteps = [
    1e3,    // 1-second
    5e3,    // 5-second
    15e3,   // 15-second
    3e4,    // 30-second
    6e4,    // 1-minute
    3e5,    // 5-minute
    9e5,    // 15-minute
    18e5,   // 30-minute
    36e5,   // 1-hour
    108e5,  // 3-hour
    216e5,  // 6-hour
    432e5,  // 12-hour
    864e5,  // 1-day
    1728e5, // 2-day
    4320e5, // 1-week  // 5 days. original value 6048e5 = 7  days
    1900.8e6, // 1-month // 22 days is 21 better?. orignal value 2592e6 = 30 days
    5702.4e6, // 3-month // 66 days. is 63 better?. orignal value 7776e6 = 90 days
    22550.4e6 // 1-year //261 days. is 260 better?. original value 31536e6 = 365 days
  ];

  var dayselect_time_scaleLocalMethods = [
    [d3.time.second, 1],
    [d3.time.second, 5],
    [d3.time.second, 15],
    [d3.time.second, 30],
    [d3.time.minute, 1],
    [d3.time.minute, 5],
    [d3.time.minute, 15],
    [d3.time.minute, 30],
    [d3.time.hour, 1],
    [d3.time.hour, 3],
    [d3.time.hour, 6],
    [d3.time.hour, 12],
    [d3.time.day, 1],
    [d3.time.day, 2],
    [d3.time.day, 5], //.week, 1
    [d3.time.day, 22], //.month, 1
    [d3.time.day, 66], //.month, 3
    [d3.time.day, 261] //.year, 1
  ];

  function dayselect_time_formatMulti(formats) {
    var n = formats.length, i = -1;

    while (++i < n) {
      formats[i][0] = d3.time.format(formats[i][0]);
    }

    return function(date) {
      date = mapFunction.invert(date);

      var i = 0, f = formats[i];

      while (!f[1](date)) {
        f = formats[++i];
      }

      return f[0](date);
    };
  }

  var dayselect_time_scaleLocalFormat = dayselect_time_formatMulti(([
      [".%L", function(d) { return d.getMilliseconds(); }],
      [":%S", function(d) { return d.getSeconds(); }],
      ["%I:%M", function(d) { return d.getMinutes(); }],
      ["%I %p", function(d) { return d.getHours(); }],
      ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
      ["%b %d", function(d) { return d.getDate() != 1; }],
      ["%B", function(d) { return d.getMonth(); }],
      ["%Y", function() { return true; }]
    ]));

  var dayselect_time_scaleMilliseconds = {
    range: function(start, stop, step) { return d3.range(Math.ceil(start / step) * step, +stop, step).map(dayselect_time_scaleDate); },
    floor: d3.identity,
    ceil: d3.identity
  };

  dayselect_time_scaleLocalMethods.year = d3.time.year;

  return dayselect_scale(d3.scale.linear(), dayselect_time_scaleLocalMethods, dayselect_time_scaleLocalFormat, mapFunction);
};

module.exports = daySelect;
