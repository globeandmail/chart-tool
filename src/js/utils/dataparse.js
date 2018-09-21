import { csvParseRows, csvParse } from 'd3-dsv';
import { timeParse } from 'd3-time-format';
import { stack } from 'd3-shape';
import { range } from 'd3-array';
import { getUniqueValues, getUniqueDateValues } from './utils';

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

  const keys = csvParseRows(csv.match(/^.*$/m)[0])[0];

  let groupingKey, dotSizingKey;

  const isScatterplot = type && type === 'scatterplot';

  if (isScatterplot) {
    if (keys.length > 3) groupingKey = keys[3];
    if (keys.length >= 4) dotSizingKey = keys[4];
  }

  if (groupingKey) keys.splice(keys.indexOf(groupingKey), 1);
  if (dotSizingKey) keys.splice(keys.indexOf(dotSizingKey), 1);

  const data = csvParse(csv, (d, i) => {

    const obj = {};

    if (inputDateFormat) {
      const dateFormat = timeParse(inputDateFormat);
      if (isScatterplot) {
        obj.key = d[keys[0]];
        // key will be along x-axis
        d[keys[1]] = dateFormat(d[keys[1]]);
      } else {
        obj.key = dateFormat(d[keys[0]]);
      }
    } else {
      obj.key = d[keys[0]];
    }

    if (groupingKey) obj.group = d[groupingKey];
    if (dotSizingKey) obj.size = d[dotSizingKey];

    obj.series = [];

    for (let j = 1; j < keys.length; j++) {

      const key = keys[j];

      if (d[key] === 0 || d[key] === '') d[key] = '__undefined__';

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

  const groups = groupingKey ? getUniqueValues(data.map(d => d.group)) : undefined;

  const seriesAmount = data[0].series.length;

  let stackedData;

  if (stacked && keys.length > 2) {
    const stackFn = stack().keys(keys.slice(1));
    stackedData = stackFn(range(data.length).map(i => {
      const o = {};
      o[keys[0]] = data[i].key;
      for (let j = 0; j < data[i].series.length; j++) {
        if (!data[i].series[j].val || data[i].series[j].val === '__undefined__') {
          o[data[i].series[j].key] = '0';
        } else {
          o[data[i].series[j].key] = data[i].series[j].val;
        }
      }
      return o;
    }));
  }

  const dateKey = isScatterplot ? 'series.0.val' : 'key',
    uniqueDayValues = inputDateFormat ? getUniqueDateValues(data, 'day', dateKey) : undefined,
    uniqueMonthValues = inputDateFormat ? getUniqueDateValues(data, 'month', dateKey) : undefined,
    uniqueYearValues = inputDateFormat ? getUniqueDateValues(data, 'year', dateKey) : undefined;

  return {
    csv,
    inputDateFormat,
    data,
    seriesAmount,
    keys,
    stackedData,
    uniqueDayValues,
    uniqueMonthValues,
    uniqueYearValues,
    groupingKey,
    dotSizingKey,
    groups
  };

}
