import React from 'react';
import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import { app_settings } from './settings';
import { timeFormat, timeParse } from 'd3-time-format';
import ChartTool from './chart-tool';

export function randomFromArr(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function mode(arr) {
  return arr
    .sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length)
    .pop();
}

export function extend(from, to) {

  let target;

  if (from == null || typeof from != 'object') return from;
  if (from.constructor != Object && from.constructor != Array) return from;
  if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
    from.constructor == String || from.constructor == Number || from.constructor == Boolean)
    return new from.constructor(from);

  target = to || new from.constructor();

  for (let name in from) {
    target[name] = typeof target[name] == 'undefined' ? extend(from[name], null) : target[name];
  }

  return target;

}

export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function isObject(item) {
  return (typeof item === 'object' && !Array.isArray(item) && item !== null);
}

export function cleanEmbed(data) {
  const arr = [];
  arr.push(
    '_id',
    'slug',
    'createdAt',
    'lastEdited',
    'version',
    'build',
    'heading',
    'qualifier',
    'source',
    'md5',
    'date_format',
    'time_format',
    'print',
    'img',
    'prefix',
    'series',
    'range',
    'public',
    'users',
    'tags'
  );
  const chartObj = deleteProp(data, arr);
  const newData = csvFormat(data);
  chartObj.data = newData;
  return deleteNullProps(chartObj);
}

export function embed(obj) {
  return {
    'version': obj.version,
    'id': obj._id,
    'heading': obj.heading,
    'qualifier': obj.qualifier,
    'source': obj.source,
    'tags': obj.tags,
    'chart': cleanEmbed(obj)
  };
}

export function deleteNullProps(obj) {
  for (let i in obj) {
    if ((obj[i] === null) || (obj[i] === undefined)) {
      delete obj[i];
    } else if (obj[i] === '') {
      delete obj[i];
    } else if (typeof obj[i] === 'object') {
      if (Object.keys(obj[i]).length) {
        deleteNullProps(obj[i]);
      } else {
        delete obj[i];
      }
    }
  }
  return obj;
}

export function deleteProp(obj, del) {
  const copy = extend(obj);
  for (let i = 0; i < del.length; i++) {
    const elem = del[i];
    delete copy[elem];
  }
  return copy;
}

export function jsonToCSV(objArray, config) {
  const defaults = {
    delimiter: ',',
    newline: '\n'
  };
  const opt = config || defaults;
  const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  for (let i = 0; i < array.length; i++) {
    let line = '';

    for (let j = 0; j < array[i].length; j++) {
      if (line != '') { line += opt.delimiter; }
      if (array[i][j].match(/,/)) {
        line += `"${array[i][j]}"`;
      } else {
        line += array[i][j];
      }

    }

    if (i === array.length - 1) {
      str += line;
    } else {
      str += line + opt.newline;
    }
  }
  return str;
}

export function csvFormat(obj) {
  if (!isEmpty(obj)) {
    const data = obj.data;
    if (obj.x_axis.scale === 'time' || obj.x_axis.scale === 'ordinal-time') {
      let stdFormat = app_settings.chart.date_format;
      if (obj.hasHours) { stdFormat += ` ${app_settings.chart.time_format}`; }
      const currFormat = obj.date_format;
      return standardizeDates(data, currFormat, stdFormat);
    } else {
      return data;
    }
  }
}

export function dataParse(data) {

  const newData = data.replace(/\n\n/g, '\n').trim();
  // parses data into JSON, then back into a CSV for delimiter consistency
  const headerRow = newData.split('\n')[0], //grab the first row of data - not concerned with the rest at this point.
    tryTabs = headerRow.split('\t').length,
    tryComma = headerRow.split(',').length,
    parseCSVParams = {
      delimiter: ','
    },
    parseTSVParams = {
      delimiter: '\t'
    };

  let parseParams,
    parsedData,
    reformattedCSV,
    output;

  //check that there are tabs or commas
  if (tryTabs > tryComma && tryTabs > 0) {
    parseParams = parseTSVParams;
  } else if (tryComma > 0) {
    parseParams = parseCSVParams;
  } else {
    Swal({
      title: "There's a problem with your data.",
      text: 'No tabs or commas were detected in your data set. Please check it over and retry.',
      type: 'error',
      confirmButtonColor: '#fff'
    });
  }

  let start, end;

  if (parseParams) {
    parsedData = cleanData(Papa.parse(newData, parseParams).data);
    start = parsedData.start;
    end = parsedData.end;
    const csvOptions = {
      delimiter: ',',
      newline: '\n'
    };
    reformattedCSV = jsonToCSV(parsedData.output, csvOptions);
    output = reformattedCSV;
  } else {
    output = newData;
  }

  return {
    data: output,
    start,
    end
  };

}

export function cleanData(data) {

  const start = [],
    end = [];

  // strip empty lines

  //ignore the first item which would be the header row
  const headerRow = data.shift();

  //step through each line in the csv
  const output = data.map(obj => {

    //ignore the first row which would identify the series - everything following is a value
    const headerCol = obj.shift();

    //step through each value
    const line = obj.map(arr => {
      const line_output = cleanNumber(arr);
      if (line_output.start.length) start.push(line_output.start);
      if (line_output.end.length) end.push(line_output.end);
      return line_output.data;
    });

    const re = /^\d*\/\d*\/\d*$/;

    // if it's all digits (i.e. a date)

    if (re.test(headerCol)) {
      const replace_slashes = /\//g;
      line.unshift(headerCol.replace(replace_slashes,'-'));
    } else {
      line.unshift(headerCol);
    }

    return line;
  });

  // add the header row back to the data
  output.unshift(headerRow);
  return {
    output,
    start,
    end
  };
}

export function formatDate(data, format) {
  const d = format.parse(data);
  const output = format(d);
  return output;
}

export function cleanNumber(data) {
  // remove everything that isnt a number, decimal, or negative
  // and do some checking for characters we can use for prefix/suffix
  return {
    data: data.toString().replace(/[^0-9\.-]/g, ''),
    start: data.match(/^[^0-9\.-]+/g) || [],
    end: data.match(/[^0-9\.-]+$/g) || []
  };
}

export function removeNbsp(val) {
  const re = new RegExp(String.fromCharCode(160), 'g');
  return val.replace(re, '');
}

export function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function standardizeDates(data, oldFormat, newFormat) {

  const stdFormat = timeFormat(newFormat),
    currFormat = timeParse(oldFormat);

  const jsonData = Papa.parse(data, { delimiter: ',' });

  for (let i = 1; i < jsonData.data.length; i++) {
    const date = currFormat(jsonData.data[i][0]);
    if (date !== null) {
      jsonData.data[i][0] = stdFormat(date);
    } else {
      throw new Meteor.Error('Incompatible date formatting', "Make sure your data's date style matches the formatting dropdown.");
    }
  }

  const csvOptions = {
    delimiter: ',',
    newline: '\n'
  };

  const output = jsonToCSV(jsonData.data, csvOptions);

  const op = output;

  return op;

}

export function updateObject(chartObj, obj) {
  for (let prop in obj) {
    updateAndSave(`update${prop}`, chartObj, obj[prop]);
  }
}

export function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);

  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Using pattern from https://www.discovermeteor.com/blog/query-constructors/

export const queries = {
  default: () => {
    return {
      find: {},
      options: {
        sort: {
          lastEdited: -1
        },
        limit: 24
      }
    };
  },
  'chart.archive': params => {

    const types = params.filters.types,
      tags = params.filters.tags,
      searchVal = params.filters.search,
      limit = params.limit;

    if (!types.length && !tags.length && !searchVal && !limit) {
      return queries.default();
    } else {

      const find = {},
        options = {
          sort: { lastEdited: -1 },
          limit: params.limit
        };

      if (types.length) {
        find['options.type'] = { $in: types };
      }

      if (tags.length) {
        find.tags = { $in: tags };
      }

      // $text isnt supported in minimongo yet,
      // hence the server check
      if (searchVal && Meteor.isServer) {
        find.$text = { $search: searchVal };
        options.fields = {
          score: { $meta: 'textScore' }
        };
        options.sort = {
          score: { $meta: 'textScore' }
        };
      }

      return {
        find: find,
        options: options
      };
    }
  }
};

export function queryConstructor(args) {

  const queryName = args ? args.queryName : 'default';

  const queryFunction = queries[queryName],
    parameters = queryFunction(args);

  if (!parameters.options) {
    parameters.options = {};
  }

  if (parameters.options.limit > 100) {
    parameters.options.limit = 48;
  }

  if (parameters.options.limit === undefined || parameters.options.limit === '') {
    parameters.options.limit = 24;
  }

  return parameters;

}

export function timeSince(timeStamp) {
  const now = new Date(),
    secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;

  if (secondsPast < 60) {
    return `${parseInt(secondsPast)} seconds ago`;
  }
  if (secondsPast < 3600) {
    return `${parseInt(secondsPast / 60)} minutes ago`;
  }
  if (secondsPast <= 86400) {
    return `${parseInt(secondsPast / 3600)} hours ago`;
  }
  if (secondsPast > 86400) {
    const day = timeStamp.getDate(),
      month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(' ', ''),
      year = timeStamp.getFullYear() === now.getFullYear() ? '' : `, ${timeStamp.getFullYear()}`;
    return `${month} ${day} ${year}`;
  }
}

export function prettyCreatedAt(createdAt) {
  const now = new Date(),
    timeStamp = createdAt,
    day = timeStamp.getDate(),
    month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(' ', ''),
    year = timeStamp.getFullYear() === now.getFullYear() ? '' : ` ${timeStamp.getFullYear()}`;
  return `${month} ${day} ${year}`;
}

export function renderLoading() {
  return <div className='loading'><p>Loading…</p></div>;
}

const debouncedThumb = debounce(id => {
  generateThumb(id);
}, app_settings.thumbnail_debounce);

function generateThumb(id) {
  Meteor.call('chart.update.thumbnail', id, {
    width: app_settings.s3.thumbnailWidth,
    scale: 2,
    dynamicHeight: false
  }, error => {
    if (error) console.log(error);
  });
}

export function updateAndSave(method, id, data) {
  const thumbnailMethods = [
    'charts.update.multiple.fields',
    'charts.update.data',
    'charts.update.dateformat',
    'charts.update.hashours',
    'charts.update.heading',
    'charts.update.qualifier',
    'charts.update.source',
    'charts.update.class',
    'charts.update.options.type',
    'charts.update.options.interpolation',
    'charts.update.options.stacked',
    'charts.update.options.expanded',
    'charts.update.options.indexed',
    'charts.update.x_axis.scale',
    'charts.update.x_axis.ticks',
    'charts.update.x_axis.orient',
    'charts.update.x_axis.format',
    'charts.update.x_axis.prefix',
    'charts.update.x_axis.suffix',
    'charts.update.x_axis.min',
    'charts.update.x_axis.max',
    'charts.update.x_axis.nice',
    'charts.update.y_axis.scale',
    'charts.update.y_axis.ticks',
    'charts.update.y_axis.orient',
    'charts.update.y_axis.format',
    'charts.update.y_axis.prefix',
    'charts.update.y_axis.suffix',
    'charts.update.y_axis.min',
    'charts.update.y_axis.max',
    'charts.update.y_axis.nice',
    'charts.reset.x_axis',
    'charts.reset.y_axis',
    'charts.update.annotations.reset',
    'charts.update.annotations.highlight',
    'charts.update.annotations.highlight.reset'
  ];

  const createThumbnail = thumbnailMethods.indexOf(method) !== -1 ? true : false;

  Meteor.call(method, id, data, (err) => {
    if (err) {
      console.log(err);
    } else if (createThumbnail) {
      debouncedThumb(id);
    }
  });
}

export function drawChart(container, obj, cb) {
  let error;
  try {
    const chartObj = {};
    chartObj.id = obj._id;
    chartObj.data = embed(obj);
    ChartTool.create(container, chartObj, cb);
  } catch (e) {
    error = e;
    console.log(error);
    if (obj.drawFinished) { obj.drawFinished(); }
  }
  return error;
}

export function chartTypeFieldReset(type) {
  const defaults = app_settings.chart.options;
  switch (type) {
    case 'line':
      return {
        'options.type': type,
        'options.interpolation': defaults.interpolation,
        'options.stacked': defaults.stacked,
        'x_axis.scale': 'time',
        'x_axis.nice': false,
        'y_axis.scale': 'linear',
        'y_axis.nice': true,
        'options.indexed': false,
        'annotations.highlight': []
      };
    case 'multiline':
      return {
        'options.type': type,
        'options.interpolation': defaults.interpolation,
        'options.stacked': defaults.stacked,
        'x_axis.scale': 'time',
        'x_axis.nice': false,
        'y_axis.scale': 'linear',
        'y_axis.nice': true,
        'options.indexed': false,
        'annotations.highlight': []
      };
    case 'area':
      return {
        'options.type': type,
        'options.interpolation': defaults.interpolation,
        'x_axis.scale': 'time',
        'x_axis.nice': false,
        'y_axis.scale': 'linear',
        'y_axis.nice': true,
        'y_axis.min': '',
        'options.indexed': false,
        'annotations.highlight': []
      };
    case 'column':
      return {
        'options.type': type,
        'options.interpolation': false,
        'x_axis.scale': 'ordinal',
        'x_axis.nice': false,
        'y_axis.scale': 'linear',
        'y_axis.nice': true,
        'y_axis.min': '',
        'options.indexed': false
      };
    case 'bar':
      return {
        'options.type': type,
        'options.interpolation': false,
        'x_axis.scale': 'linear',
        'x_axis.nice': false,
        'y_axis.scale': 'ordinal',
        'y_axis.nice': false,
        'y_axis.min': '',
        'options.indexed': false,
      };
  }

}

export function arrayDiff(a1, a2) {
  const o1 = {}, o2 = {}, diff = [];
  for (let i = 0; i < a1.length; i++) { o1[a1[i]] = true; }
  for (let i = 0; i < a2.length; i++) { o2[a2[i]] = true; }
  for (let k in o1) { if (!(k in o2)) { diff.push(k); } }
  for (let k in o2) { if (!(k in o1)) { diff.push(k); } }
  return diff;
}

export function setDocumentTitle(path, slug) {
  const titles = {
    '/new': 'New chart - Chart Tool',
    '/status': 'Status - Chart Tool',
    '/archive': 'Archive - Chart Tool',
    '/chart/:_id': `${slug} - Chart Tool`,
    '/chart/:_id/pdf': `${slug} - Chart Tool`,
    '/chart/:_id/edit': `${slug} - Chart Tool`
  };
  return titles[path] ? titles[path] : 'Not found - Chart Tool';
}

export function convertToMM(print) {
  let width, height;

  // get mm width and height
  if (print.mode === 'columns') {
    const x = Number(print.columns.replace('col', '')), y = Number(print.lines);
    width = (x * app_settings.print.column_width) + ((x - 1) * app_settings.print.gutter_width);
    height = (y - 1) * app_settings.print.line_depth + app_settings.print.first_line_depth;
  } else {
    width = print.width;
    height = print.height;
  }

  return {
    width: Math.round(width * 100) / 100,
    height: Math.round(height * 100) / 100
  };
}

export function generateMeasurements(print) {

  const { width, height } = convertToMM(print);

  const name = print.mode === 'columns' ? `${print.columns}-${print.lines}lin` : `${width}mm-${height}mm`;

  const dpi = 96;

  return {
    width: (width * dpi) / 25.4,
    height: (height * dpi) / 25.4,
    name
  };
}
