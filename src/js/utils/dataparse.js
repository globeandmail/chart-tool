import { csvParseRows, csvParse } from 'd3-dsv';
import { timeParse } from 'd3-time-format';
import { stack } from 'd3-shape';
import { range } from 'd3-array';
import { getUniqueDateValues } from './utils';

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

export function parse(csv, inputDateFormat, index, stacked) {

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

  if (stacked && headers.length > 2) {
    const stackFn = stack().keys(headers.slice(1));
    stackedData = stackFn(range(data.length).map(i => {
      const o = {};
      o[headers[0]] = data[i].key;
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

  const uniqueDayValues = inputDateFormat ? getUniqueDateValues(data, 'day') : undefined;
  const uniqueMonthValues = inputDateFormat ? getUniqueDateValues(data, 'month') : undefined;
  const uniqueYearValues = inputDateFormat ? getUniqueDateValues(data, 'year') : undefined;

  return {
    csv: csv,
    data: data,
    seriesAmount: seriesAmount,
    keys: headers,
    stackedData: stackedData,
    uniqueDayValues: uniqueDayValues,
    uniqueMonthValues: uniqueMonthValues,
    uniqueYearValues: uniqueYearValues
  };

}

// export function gridify(str, increment){
//   let newStr = 'x,y,z\n', x, y, z, c, inc = '';
//
//   increment = (increment) ? increment : 1;
//
//   if(increment > 1){inc = ` (x${increment})`;}
//
//   str = str.replace(/\t/g, ',');
//
//   const headers = csvParseRows(str.match(/^.*$/m)[0])[0];
//
//   csvParse(str, function(d,i){
//     for(let k in d){
//       z = k+(inc);
//       if(headers.indexOf(k) == 0){
//         x = (d[k]);
//         c = 0;
//       }else{
//         let n = Math.round(Number(d[k])/increment);
//         if (n > 0){
//           for (i = 1; i <= n; i++){
//             c += 1;
//             y = c;
//             newStr += (x + ',' + y +','+z+'\n');
//           }
//         }
//       }
//     }
//   });
//   return newStr;
//   console.log(newStr);
// }
