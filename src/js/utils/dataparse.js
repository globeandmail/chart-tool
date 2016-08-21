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

  var val;

  var firstVals = {};

  var headers = d3.csv.parseRows(csv.match(/^.*$/m)[0])[0];

  var data = d3.csv.parse(csv, function(d, i) {

    var obj = {};

    if (inputDateFormat) {
      var dateFormat = d3.time.format(inputDateFormat);
      obj.key = dateFormat.parse(d[headers[0]]);
    } else {
      obj.key = d[headers[0]];
    }

    obj.series = [];

    for (var j = 1; j < headers.length; j++) {

      var key = headers[j];

      if (d[key] === 0 || d[key] === "") {
        d[key] = "__undefined__";
      }

      if (index) {

        if (i === 0 && !firstVals[key]) {
          firstVals[key] = d[key];
        }

        if (index === "0") {
          val = ((d[key] / firstVals[key]) - 1) * 100;
        } else {
          val = (d[key] / firstVals[key]) * index;
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
          legend: headers[key + 1],
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
    keys: headers,
    stackedData: stackedData || undefined
  }
}

module.exports = {
  inputDate: inputDate,
  parse: parse
};
