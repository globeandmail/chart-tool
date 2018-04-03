import React from 'react';
import { Meteor } from 'meteor/meteor';
// import Charts from '../api/Charts/Charts';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import { app_settings } from './settings';
import { timeFormat } from 'd3-time-format';
// import multiSVGtoPNG from './multiSVGtoPNG';
import ChartTool from './chart-tool';

export function randomFromArr(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

export function escapeStr(str) {
  if (typeof str === 'string') {
    return str ? str.replace(/\'/g, '\\\'') : str;
  }
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
    'annotations',
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
  const data = {
    'version': obj.version,
    'id': obj._id,
    'heading': escapeStr(obj.heading),
    'qualifier': escapeStr(obj.qualifier),
    'source': escapeStr(obj.source),
    'tags': escapeStr(obj.tags)
  };
  data.chart = cleanEmbed(obj);
  return data;
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
        line += `'${array[i][j]}'`;
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

export function slugParse(slug) {
  const re = /^[a-zA-Z0-9-]*$/;
  if (!re.test(slug)) {
    return slug.replace(/[ +.,!@#$%^&*();:\/|<>'" =]/g,'-').toLowerCase();
  } else {
    return slug.toLowerCase();
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

  if (parseParams) {
    parsedData = cleanData(Papa.parse(newData, parseParams).data);
    const csvOptions = {
      delimiter: ',',
      newline: '\n'
    };
    reformattedCSV = jsonToCSV(parsedData, csvOptions);
    output = reformattedCSV;
  } else {
    output = newData;
  }

  return output;

}

export function cleanData(data) {

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
      return line_output;
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
  return output;
}

export function formatDate(data, format) {
  const d = format.parse(data);
  const output = format(d);
  return output;
}

export function cleanNumber(data) {
  // remove everything that isnt a number, decimal, or negative
  return data.toString().replace(/[^0-9\.-]/g, '');
}

export function removeNbsp(val) {
  const re = new RegExp(String.fromCharCode(160), 'g');
  return val.replace(re, '');
}

export function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// converts from columns into millimeters
export function determineWidth(columns) {
  let cols;

  switch (columns) {
    case '1col':
      cols = 1;
      break;
    case '2col':
      cols = 2;
      break;
    case '3col':
      cols = 3;
      break;
    case '4col':
      cols = 4;
      break;
    case '5col':
      cols = 5;
      break;
    default:
      cols = app_settings.print.default_cols;
      break;
  }
  return ((cols * app_settings.print.column_width) + ((cols - 1) * app_settings.print.gutter_width));
}

// converts from lines into mm
export function determineHeight(lines, width) {
  if (!lines) {
    return width * 0.75;
  } else {
    return app_settings.print.first_line_depth + (app_settings.print.line_depth * (lines - 1));
  }
}

export function standardizeDates(data, oldFormat, newFormat) {

  const stdFormat = timeFormat(newFormat),
    currFormat = timeFormat(oldFormat);

  const jsonData = Papa.parse(data, { delimiter: ',' });

  for (let i = 1; i < jsonData.data.length; i++) {
    const date = currFormat.parse(jsonData.data[i][0]);
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
  },
  'chart.tags': params => {
    return {
      find: { tagged: params.chartId }
    };
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

export function setInactive() {
  const containers = document.querySelectorAll('.preview-outer-container');
  for (let i = 0; i < containers.length; i++) {
    containers[i].classList.add('preview-inactive');
  }
}

export function setActive() {
  const containers = document.querySelectorAll('.preview-outer-container');
  for (let i = 0; i < containers.length; i++) {
    containers[i].classList.remove('preview-inactive');
  }
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

export function drawError(error) {
  return (
    <div className='chart-error-container'>
      <div className='chart-error'>
        <img src='/images/error.svg' className='chart-error_img' />
        <p className='chart-error_text'>{error.error}</p>
        <p className='chart-error_reason'>{error.reason}</p>
      </div>
    </div>
  );
}

// export function updateAndSave(method, obj, data) {
//   setInactive();
//   Meteor.call(method, obj._id, data, (err) => {
//     if (!err) {
//       const newObj = Charts.findOne(Session.get('chartId'));
//       generateThumb(newObj);
//     } else {
//       console.log(err);
//     }
//     setActive();
//   });
// }

export function drawChart(container, obj, cb) {
  let error;
  // debugger;
  // const ct = ChartTool();
  console.log(ChartTool);
//   try {
//     const chartObj = {};
//     chartObj.id = obj._id;
//     chartObj.data = embed(obj);
//     ChartTool.create(container, chartObj, cb);
//   } catch (e) {
//     error = e;
//     console.log(error);
//     drawError(container, error);
//     if (obj.drawFinished) { obj.drawFinished(); }
//   }
//   if (error) {
//     return error;
//   }
}

// export function generateThumb(obj) {
//
//   const scale = 2,
//     ratio = 67,
//     className = 'chart-thumbnail',
//     container = `.${className}`;
//
//   let div = document.createElement('div');
//
//   obj.exportable = {};
//   obj.exportable.type = 'web';
//   obj.exportable.dynamicHeight = false;
//   obj.exportable.width = app_settings.s3.thumbnailWidth;
//   div.style.width = `${obj.exportable.width}px`;
//
//   if (obj.options.type !== 'bar') {
//     obj.exportable.height = obj.exportable.width * (ratio / 100);
//     div.style.height = `${obj.exportable.height}px`;
//   }
//
//   div.className = className;
//   document.body.appendChild(div);
//
//   const chartError = drawChart(container, obj);
//
//   if (!chartError) {
//
//     let svgContainer = document.createElement('div');
//     svgContainer.className = 'svg-container';
//     document.body.appendChild(svgContainer);
//
//     let outputCanvas = document.createElement('div');
//     outputCanvas.className = 'canvas-container';
//     document.body.appendChild(outputCanvas);
//
//     const drawnChartContainer = document.querySelector(container);
//
//     const prefix = app_settings.chart.prefix;
//
//     drawnChartContainer.querySelector(`.${prefix}chart_title`).classList.add('target');
//     drawnChartContainer.querySelector(`.${prefix}chart_svg`).classList.add('target');
//     drawnChartContainer.querySelector(`.${prefix}chart_source`).classList.add('target');
//
//     multiSVGtoPNG.convertToSVG({
//       input: '.chart-thumbnail',
//       selector: `.${prefix}chart_title.target, .${prefix}chart_svg.target, .${prefix}chart_source.target`,
//       output: '.svg-container'
//     });
//
//     multiSVGtoPNG.encode({
//       input: '.svg-container',
//       output: '.canvas-container',
//       scale: scale || 2
//     }, data => {
//
//       if (app_settings.s3 && app_settings.s3.enable) {
//
//         const file = dataURLtoBlob(data);
//         file.name = `${app_settings.s3.filename}.${app_settings.s3.extension}`;
//
//         S3.upload({
//           files: [file],
//           path: app_settings.s3.base_path + obj._id,
//           expiration: app_settings.s3.expiration || 30000,
//           unique_name: false
//         }, (err, result) => {
//           if (err) {
//             console.error('S3 thumbnail upload error!');
//           } else {
//             Meteor.call('updateImg', obj._id, result.secure_url);
//           }
//         });
//       } else {
//         Meteor.call('updateImg', obj._id, data);
//       }
//
//     });
//
//     svgContainer.parentNode.removeChild(svgContainer);
//     svgContainer = null;
//
//     outputCanvas.parentNode.removeChild(outputCanvas);
//     outputCanvas = null;
//
//   }
//
//   div.parentNode.removeChild(div);
//   div = null;
//
// }


// downloads a web image to certain specifications
// export function downloadImg(obj, options) {
//
//   const scale = options.scale,
//     className = 'chart-export',
//     container = `.${className}`,
//     filename = `${obj.slug}-${  options.descriptor}-${  obj.exportable.width}`;
//
//   let div = document.createElement('div');
//
//   div.style.width = `${obj.exportable.width}px`;
//   div.style.height = `${obj.exportable.height}px`;
//   div.className = className;
//   document.body.appendChild(div);
//
//   const chartError = drawChart(container, obj);
//
//   if (!chartError) {
//
//     let svgContainer = document.createElement('div');
//     svgContainer.className = 'svg-container';
//     document.body.appendChild(svgContainer);
//
//     let outputCanvas = document.createElement('div');
//     outputCanvas.className = 'canvas-container';
//     document.body.appendChild(outputCanvas);
//
//     const drawnChartContainer = document.querySelector(`.${className}`);
//
//     const prefix = app_settings.chart.prefix;
//
//     drawnChartContainer.querySelector(`.${prefix}chart_title`).classList.add('target');
//     drawnChartContainer.querySelector(`.${prefix}chart_svg`).classList.add('target');
//     drawnChartContainer.querySelector(`.${prefix}chart_source`).classList.add('target');
//
//     multiSVGtoPNG.convertToSVG({
//       input: '.chart-export',
//       selector: `.${prefix}chart_title.target, .${prefix}chart_svg.target, .${prefix}chart_source.target`,
//       output: '.svg-container'
//     });
//
//     multiSVGtoPNG.downloadPNG({
//       filename: filename,
//       input: '.svg-container',
//       output: '.canvas-container',
//       scale: scale || 2
//     });
//
//     svgContainer.parentNode.removeChild(svgContainer);
//     svgContainer = null;
//
//     outputCanvas.parentNode.removeChild(outputCanvas);
//     outputCanvas = null;
//
//   }
//
//   div.parentNode.removeChild(div);
//   div = null;
//
// }
