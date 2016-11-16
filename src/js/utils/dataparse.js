import { csvParseRows, csvParse } from 'd3-dsv';
import { timeParse } from 'd3-time-format';
import { stack } from 'd3-shape';
import { range } from 'd3-array';

/**
 * Data parsing module. Takes a CSV and turns it into an Object, and optionally determines the formatting to use when parsing dates.
 * @module utils/dataparse
 */

export function inputDate(scaleType, defaultFormat, declaredFormat) {
  if (scaleType === 'time' || scaleType === 'ordinal-time') {
    return declaredFormat || defaultFormat;
  } else {
    return undefined;
  }
}

export function parse(csv, inputDateFormat, index, stacked, type) {

  let val;

  const firstVals = {};

  const headers = csvParseRows(csv.match(/^.*$/m)[0])[0];

  const data = csvParse(csv, (d, i) => {

    const obj = {};

    if (inputDateFormat) {
      const dateFormat = timeParse(inputDateFormat);
      obj.key = dateFormat(d[headers[0]]);
    } else {
      obj.key = d[headers[0]];
    }

    obj.series = [];

    for (let j = 1; j < headers.length; j++) {

      const key = headers[j];

      if (d[key] === 0 || d[key] === '') {
        d[key] = '__undefined__';
      }

      if (index) {

        if (i === 0 && !firstVals[key]) {
          firstVals[key] = d[key];
        }

        if (index === '0') {
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

  const seriesAmount = data[0].series.length;

  let stackedData;

  if (stacked) {
    const stackFn = type === 'stream' ? stack().offset('silhouette') : stack();
    stackedData = stackFn(range(seriesAmount).map(key => {
      return data.map(d => {
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
  };

}
