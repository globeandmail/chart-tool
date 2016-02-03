/**
 * Data parsing module. Takes a CSV and turns it into an Object, and optionally determines the formatting to use when parsing dates.
 * @module utils/dataparse
 * @see module:utils/factory
 */

/**
 * Determines whether a scale returns an input date or not.
 * @param  {String} scaleType      The type of scale.
 * @param  {String} defaultFormat  Format set by the chart tool settings.
 * @param  {String} declaredFormat Format passed by the chart embed code, if there is one
 * @return {String|Undefined}
 */
function inputDate(scaleType, defaultFormat, declaredFormat) {

  if (scaleType === "time" || scaleType === "ordinal-time") {
    return declaredFormat || defaultFormat;
  } else {
    return undefined;
  }

}

/**
 * Parses a CSV string using d3.csv.parse() and turns it into an array of objects.
 * @param  {String} csv             CSV string to be parsed
 * @param  {String inputDateFormat Date format in D3 strftime style, if there is one
 * @param  {String} index           Value to index the data to, if there is one
 * @return { {csv: String, data: Array, seriesAmount: Integer, keys: Array} }                 An object with the original CSV string, the newly-formatted data, the number of series in the data and an array of keys used.
 */
function parse(csv, inputDateFormat, index, stacked, type) {

  var keys,
      val,
      firstVal;

  var data = d3.csv.parse(csv, function(d, i) {

    var obj = {};

    if (i === 0) { keys = d3.keys(d); }

    if (inputDateFormat) {
      var dateFormat = d3.time.format(inputDateFormat);
      obj.key = dateFormat.parse(d3.values(d)[0]);
    } else {
      obj.key = d3.values(d)[0];
    }

    obj.series = [];

    for (var j = 1; j < d3.keys(d).length; j++) {

      var key = d3.keys(d)[j];

      if (d[key] === 0 || d[key] === "") {
        d[key] = "__undefined__";
      }

      if (index) {

        if (i === 0) {
          firstVal = d[key];
        }

        if (index === "0") {
          val = ((d[key] / firstVal) - 1) * 100;
        } else {
          val = (d[key] / firstVal) * index;
        }

      } else {
        val = d[key];
      }

      obj.series.push({
        val: val,
        key: key
      });

    }

    return obj;

  });

  var seriesAmount = data[0].series.length;

  if (stacked) {
    if (type === "stream") {
      var stack = d3.layout.stack().offset("silhouette");
    } else {
      var stack = d3.layout.stack();
    }
    var stackedData = stack(d3.range(seriesAmount).map(function(key) {
      return data.map(function(d) {
        return {
          legend: keys[key + 1],
          x: d.key,
          y: Number(d.series[key].val),
          raw: d
        };
      });
    }));
  }

  return {
    csv: csv,
    data: data,
    seriesAmount: seriesAmount,
    keys: keys,
    stackedData: stackedData || undefined
  }
}

module.exports = {
  inputDate: inputDate,
  parse: parse
};
