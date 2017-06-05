import FontFaceObserver from 'fontfaceobserver';
import { select } from 'd3-selection';
import { csvParseRows } from 'd3-dsv';
import { timeYears, timeMonths, timeDays, timeHours, timeMinutes } from 'd3-time';
import {
  curveLinear,
  curveCardinal,
  curveCatmullRom,
  curveMonotoneX,
  curveNatural,
  curveStepBefore,
  curveStepAfter
} from 'd3-shape';
import Settings from '../config/chart-settings';
import bucket from '../config/env';

export function debounce(fn, timeout, root) {
  let timeoutID = -1;
  return (() => {
    if (timeoutID > -1) { root.clearTimeout(timeoutID); }
    timeoutID = root.setTimeout(() => {
      fn();
    }, timeout);
  });
}

export function clearChart(cont) {
  let el = document.querySelector(cont);
  while (el && el.querySelectorAll('svg').length) {
    let svg = el.querySelectorAll('svg');
    svg[svg.length - 1].parentNode.removeChild(svg[svg.length - 1]);
  }
  while (el && el.querySelectorAll('div').length) {
    let div = el.querySelectorAll('div');
    div[div.length - 1].parentNode.removeChild(div[div.length - 1]);
  }
  return cont;
}

export function clearObj(obj) {
  if (obj.chartObj) { obj.chartObj = undefined; }
  return obj;
}

export function clearDrawn(drawn, obj) {
  if (drawn.length) {
    for (let i = drawn.length - 1; i >= 0; i--) {
      if (drawn[i].id === obj.id) {
        drawn.splice(i, 1);
      }
    }
  }
  return drawn;
}

export function getBounding(selector, dimension) {
  return document.querySelector(selector).getBoundingClientRect()[dimension];
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

export function timeDiff(d1, d2, tolerance) {

  const diff = d2 - d1,
    time = new TimeObj();

  // returning the context
  if ((diff / time.year) > tolerance) { return 'years'; }
  else if ((diff / time.month) > tolerance) { return 'months'; }
  else if ((diff / time.week) > tolerance) { return 'weeks'; }
  else if ((diff / time.day) > tolerance) { return 'days'; }
  else if ((diff / time.hour) > tolerance) { return 'hours'; }
  else if ((diff / time.min) > tolerance) { return 'minutes'; }
  else { return 'days'; }
  // if none of these work i feel bad for you son
  // i've got 99 problems but an if/else ain't one

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
    case 'cardinal':
      return curveCardinal;
    case 'linear':
      return curveLinear;
    case 'step-before':
      return curveStepBefore;
    case 'step-after':
      return curveStepAfter;
    case 'monotone':
      return curveMonotoneX;
    case 'catmull-rom':
      return curveCatmullRom;
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

export function waitForFonts(fonts) {
  return new Promise((resolve, reject) => {
    if (fonts && fonts.length) {
      Promise.all(fonts.map(f => new FontFaceObserver(f).load()))
        .then(() => resolve())
        .catch(() => reject());
    } else {
      resolve();
    }
  });
}
