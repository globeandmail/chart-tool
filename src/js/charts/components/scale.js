import { scaleTime, scaleBand, scalePoint, scaleLinear } from 'd3-scale';
import { min, max, extent } from 'd3-array';
import { timeDiff, timeInterval } from '../../utils/utils';
import { map } from 'd3-collection';
import { csvParse } from 'd3-dsv';

export function scaleManager(obj, axisType) {

  const axis = obj[axisType],
    scaleObj = new ScaleObj(obj, axis, axisType);

  const scale = setScaleType(scaleObj.type);

  scale.domain(scaleObj.domain);

  setRangeArgs(scale, scaleObj);

  if (axis.nice) { niceify(scale, axisType, scaleObj); }

  if (scaleObj.type === 'ordinal') {
    scale
      .align(0.5)
      .paddingInner(scaleObj.bands.padding)
      .paddingOuter(scaleObj.bands.outerPadding);
  }

  return {
    obj: scaleObj,
    scale: scale
  };

}

export class ScaleObj {
  constructor(obj, axis, axisType) {
    this.type = axis.scale;
    this.domain = setDomain(obj, axis, axisType);
    this.rangeType = 'range';
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
    default: return scaleLinear();
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
  if (scaleObj.rangeType === 'range') {
    if (scaleObj.type === 'ordinal-time') {
      return scale[scaleObj.rangeType](scaleObj.range).padding(0.5).align(0);
    } else {
      return scale[scaleObj.rangeType](scaleObj.range);
    }
  }
}

export function setDomain(obj, axis, axisType) {
  const data = obj.data;
  let domain;

  switch(axis.scale) {
    case 'time':
      domain = setDateDomain(data, axis.min, axis.max);
      break;
    case 'linear':
      if (obj.options.type === 'area' || obj.options.type === 'column' || obj.options.type === 'bar') {
        domain = setNumericalDomain(data, axis.min, axis.max, obj.options.stacked, true);
      } else if (obj.options.type === 'scatterplot') {
        // Murat's note:
        // For the scatterplot, min and max must be set separately for each axis. 
        // Best to determine min and max here. 
        const column = (axisType == 'xAxis') ? data.data.columns[0] : data.data.columns[1];
        const d = csvParse(data.csv, function(d){ return Number(d[column]); });
        let minv = min(d), maxv = max(d);
        domain = setNumericalDomain(data, minv, maxv, obj.options.stacked);
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
    maxVal = max(data.stackedData, layer => {
      return max(layer, d => { return d[1]; });
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
