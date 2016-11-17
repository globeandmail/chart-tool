import {
  scaleTime,
  scaleBand,
  scalePoint,
  scaleLinear,
  scaleIdentity,
  scalePow,
  scaleSqrt,
  scaleLog,
  scaleQuantize,
  scaleQuantile,
  scaleThreshold
} from 'd3-scale';
import { min, max, extent } from 'd3-array';
import { timeDiff, timeInterval } from '../../utils/utils';
import { map } from 'd3-collection';

export function scaleManager(obj, axisType) {

  const axis = obj[axisType],
    scaleObj = new ScaleObj(obj, axis, axisType);

  const scale = setScaleType(scaleObj.type);

  scale.domain(scaleObj.domain);

  setRangeArgs(scale, scaleObj);

  if (axis.nice) { niceify(scale, axisType, scaleObj); }
  if (axis.rescale) { rescale(scale, axisType, axis); }

  return {
    obj: scaleObj,
    scale: scale
  };

}

export class ScaleObj {
  constructor(obj, axis, axisType) {
    this.type = axis.scale;
    this.domain = setDomain(obj, axis);
    this.rangeType = setRangeType(axis);
    this.range = setRange(obj, axisType);
    this.bands = obj.dimensions.bands;
    this.rangePoints = axis.rangePoints || 1.0;
  }
}

export function setScaleType(type) {
  switch (type) {
    case 'time': return scaleTime();
    case 'ordinal': return scaleBand();
    case 'ordinal-time': return scalePoint();
    case 'linear': return scaleLinear();
    case 'identity': return scaleIdentity();
    case 'pow': return scalePow();
    case 'sqrt': return scaleSqrt();
    case 'log': return scaleLog();
    case 'quantize': return scaleQuantize();
    case 'quantile': return scaleQuantile();
    case 'threshold': return scaleThreshold();
    default: return scaleLinear();
  }
}

export function setRangeType(axis) {
  switch(axis.scale) {
    case 'time':
    case 'linear':
    case 'ordinal-time':
      return 'range';
    case 'ordinal':
    case 'discrete':
      return 'rangeRound';
    default:
      return 'range';
  }
}

export function setRange(obj, axisType) {

  let range;

  if (axisType === 'xAxis') {
    range = [0, obj.dimensions.tickWidth()]; // operating on width
  } else if (axisType === 'yAxis') {
    range = [obj.dimensions.yAxisHeight(), 0]; // operating on height
  }

  return range;

}

export function setRangeArgs(scale, scaleObj) {
  switch (scaleObj.rangeType) {
    case 'range':
      if (scaleObj.type === 'ordinal-time') {
        return scale[scaleObj.rangeType](scaleObj.range, scaleObj.rangePoints);
      } else {
        return scale[scaleObj.rangeType](scaleObj.range);
      }
    case 'rangeRound':
      return scale[scaleObj.rangeType](scaleObj.range, scaleObj.bands.padding, scaleObj.bands.outerPadding);
  }
}

export function setDomain(obj, axis) {

  const data = obj.data;
  let domain;

  switch(axis.scale) {
    case 'time':
      domain = setDateDomain(data, axis.min, axis.max);
      break;
    case 'linear':
      if (obj.options.type === 'area' || obj.options.type === 'column' || obj.options.type === 'bar') {
        domain = setNumericalDomain(data, axis.min, axis.max, obj.options.stacked, true);
      } else {
        domain = setNumericalDomain(data, axis.min, axis.max, obj.options.stacked);
      }
      break;
    case 'ordinal':
    case 'ordinal-time':
      domain = setDiscreteDomain(data);
      break;
  }

  return domain;

}

export function setDateDomain(data, min, max) {
  let startDate, endDate;
  if (min && max) {
    startDate = min;
    endDate = max;
  } else {
    const dateRange = extent(data.data, d => { return d.key; });
    startDate = min || new Date(dateRange[0]);
    endDate = max || new Date(dateRange[1]);
  }
  return [startDate, endDate];
}

export function setNumericalDomain(data, vmin, vmax, stacked, forceMaxVal) {

  let minVal, maxVal;

  const mArr = [];

  map(data.data, d => {
    for (let j = 0; j < d.series.length; j++) {
      mArr.push(Number(d.series[j].val));
    }
  });

  if (stacked) {
    maxVal = max(data.stackedData[data.stackedData.length - 1], d => {
      return (d.y0 + d.y);
    });
  } else {
    maxVal = max(mArr);
  }

  minVal = min(mArr);

  if (vmin) {
    minVal = vmin;
  } else if (minVal > 0) {
    minVal = 0;
  }

  if (vmax) {
    maxVal = vmax;
  } else if (maxVal < 0 && forceMaxVal) {
    maxVal = 0;
  }

  return [minVal, maxVal];

}

export function setDiscreteDomain(data) {
  return data.data.map(d => { return d.key; });
}

export function rescale(scale, axisType, axisObj) {
  switch(axisObj.scale) {
    case 'linear':
      if (!axisObj.max) { rescaleNumerical(scale); }
      break;
  }
}

export function rescaleNumerical(scale) {

  // rescales the 'top' end of the domain
  const ticks = scale.ticks(10).slice(),
    tickIncr = Math.abs(ticks[ticks.length - 1]) - Math.abs(ticks[ticks.length - 2]);

  const newMax = ticks[ticks.length - 1] + tickIncr;

  scale.domain([scale.domain()[0], newMax]);

}

export function niceify(scale, axisType, scaleObj) {
  switch(scaleObj.type) {
    case 'time':
      niceifyTime(scale, timeDiff(scale.domain()[0], scale.domain()[1], 3));
      break;
    case 'linear':
      niceifyNumerical(scale);
      break;
  }
}

export function niceifyTime(scale, context) {
  const interval = timeInterval(context);
  scale.domain(scale.domain()).nice(interval);
}

export function niceifyNumerical(scale) {
  scale.domain(scale.domain()).nice();
}
