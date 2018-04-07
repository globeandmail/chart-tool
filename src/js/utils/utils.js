import { select } from 'd3-selection';
import { csvParseRows } from 'd3-dsv';
import { timeYears, timeMonths, timeDays, timeHours, timeMinutes } from 'd3-time';
import {
  curveLinear,
  curveNatural,
  curveStepBefore,
  curveStepAfter,
  curveStep
} from 'd3-shape';
import Settings from '../config/chart-settings';
import bucket from '../config/env';
import 'core-js/fn/set';
import 'core-js/fn/array/from';

export function debounce(fn, params, timeout, root) {
  let timeoutID = -1;
  return (() => {
    if (timeoutID > -1) { root.clearTimeout(timeoutID); }
    timeoutID = root.setTimeout(() => {
      fn(params);
    }, timeout);
  });
}

export function clearChart(cont) {
  if (typeof document !== 'undefined') {
    let el = isElement(cont) ? cont : document.querySelector(cont);
    while (el && el.querySelectorAll('svg').length) {
      let svg = el.querySelectorAll('svg');
      svg[svg.length - 1].parentNode.removeChild(svg[svg.length - 1]);
    }
    while (el && el.querySelectorAll('div').length) {
      let div = el.querySelectorAll('div');
      div[div.length - 1].parentNode.removeChild(div[div.length - 1]);
    }
  }
  return cont;
}

export function clearObj(obj) {
  if (obj.chartObj) { obj.chartObj = undefined; }
  return obj;
}

export function getBounding(selector, dimension) {
  if (isElement(selector)) {
    return selector.getBoundingClientRect()[dimension];
  } else {
    return document.querySelector(selector).getBoundingClientRect()[dimension];
  }

}

export class TimeObj {
  constructor() {
    this.second = 1000;
    this.minute = this.second * 60;
    this.hour = this.minute * 60;
    this.day = this.hour * 24;
    this.week = this.day * 7;
    this.month = this.day * 30;
    this.year = this.day * 365;
    this.today = new Date();
  }
}

export function wrapText(text, width) {
  text.each(function() {

    const text = select(this),
      y = text.attr('y'),
      lineHeight = 1.0, // ems
      x = 0,
      dy = parseFloat(text.attr('dy'));

    let words = text.text().split(/\s+/).reverse(),
      line = [],
      lineNumber = 0,
      word,
      tspan = text.text(null).append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', `${dy}em`);

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', `${++lineNumber * lineHeight + dy}em`)
          .text(word);
      }
    }
  });
}

export function timeDiff(d1, d2, tolerance, data) {

  const diff = d2 - d1,
    time = new TimeObj();

  let ctx;

  // returning the context
  if ((diff / time.year) > tolerance) { ctx = 'years'; }
  else if ((diff / time.month) > tolerance) { ctx = 'months'; }
  else if ((diff / time.week) > tolerance) { ctx = 'weeks'; }
  else if ((diff / time.day) > tolerance) { ctx = 'days'; }
  else if ((diff / time.hour) > tolerance) { ctx = 'hours'; }
  else if ((diff / time.min) > tolerance) { ctx = 'minutes'; }
  else { ctx = 'days'; }
  // if none of these work i feel bad for you son
  // i've got 99 problems but an if/else ain't one

  // data passed in, looking at drawing tips
  if (data && (ctx === 'years' || ctx === 'months')) {
    const uniqueDayValues = data.uniqueDayValues;
    const uniqueMonthValues = data.uniqueMonthValues;

    if (ctx === 'years') {
      // if only one unique day value, but multiple unique month values, probably monthly data
      if (uniqueDayValues.length === 1 && uniqueMonthValues.length > 1) ctx = 'monthly';
      // if many unique day values and multiple unique month values, probably months data
      if (uniqueDayValues.length > 1 && uniqueMonthValues.length > 1) ctx = 'months';
    }

    if (ctx == 'months') {
      // if only one unique day value, and only one unique month values, probably annual data
      if (uniqueDayValues.length === 1 && uniqueMonthValues.length === 1) ctx = 'years';
      // if only one unique day value and many unique months, probably monthly data
      if (uniqueDayValues.length === 1 && uniqueMonthValues.length > 1) ctx = 'monthly';
    }
  }

  return ctx;

}

export function timeInterval(data) {

  const dataLength = data.length,
    d1 = data[0].key,
    d2 = data[dataLength - 1].key;

  const intervals = [
    { fn: timeYears, step: 1 },
    { fn: timeMonths, step: 3 }, // quarters
    { fn: timeMonths, step: 1 },
    { fn: timeDays, step: 1 },
    { fn: timeHours, step: 1 },
    { fn: timeMinutes, step: 1 }
  ];

  let ret;

  for (let i = 0; i < intervals.length; i++) {
    const intervalCandidate = intervals[i].fn(d1, d2, intervals[i].step).length;
    if (intervalCandidate >= dataLength - 1) {
      ret = intervalCandidate;
      break;
    }
  }

  return ret;

}

export function getCurve(interp) {
  switch (interp) {
    case 'linear':
      return curveLinear;
    case 'step':
      return curveStep;
    case 'step-before':
      return curveStepBefore;
    case 'step-after':
      return curveStepAfter;
    case 'cardinal':
    case 'monotone':
    case 'natural':
      return curveNatural;
  }
}

export function getTranslate(node) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttributeNS(null, 'transform', node.getAttribute('transform'));
  const matrix = g.transform.baseVal.consolidate().matrix;
  return [matrix.e, matrix.f];
}

export function svgTest(root) {
  return !!root.document && !!root.document.createElementNS && !!root.document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
}

export function getThumbnailPath(obj) {
  const imgSettings = obj.image;
  imgSettings.bucket = bucket;
  const id = obj.id.replace(obj.prefix, '');

  return `https://s3.amazonaws.com/${imgSettings.bucket}/${imgSettings.base_path}${id}/${imgSettings.filename}.${imgSettings.extension}`;
}

export function generateThumb(container, obj) {

  const settings = new Settings();

  const imgSettings = settings.image;

  const cont = document.querySelector(container),
    fallback = cont.querySelector(`.${settings.prefix}base64img`);

  if (imgSettings && imgSettings.enable && obj.data.id) {

    const img = document.createElement('img');

    img.setAttribute('src', getThumbnailPath(obj));
    img.setAttribute('alt', obj.data.heading);
    img.setAttribute('class', `${settings.prefix}thumbnail`);

    cont.appendChild(img);

  } else if (fallback) {

    fallback.style.display = 'block';

  }

}

export function csvToTable(target, data) {
  const parsedCSV = csvParseRows(data);
  target.append('table').selectAll('tr')
    .data(parsedCSV).enter()
    .append('tr').selectAll('td')
    .data(d => d).enter()
    .append('td')
    .text(d => d);
}

export function getUniqueDateValues(data, type) {
  const allDates = data.map(d => {
    switch (type) {
      case 'day': return d.key.getDate();
      case 'month': return d.key.getMonth();
      case 'year': return d.key.getFullYear();
    }
  });
  return Array.from(new Set(allDates));
}

export function isElement(el) {
  const isString = typeof cont === 'string';
  return !isString && el.nodeName;
}
