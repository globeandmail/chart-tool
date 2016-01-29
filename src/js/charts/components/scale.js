function scaleManager(obj, axisType) {

  var axis = obj[axisType],
      scaleObj = new ScaleObj(obj, axis, axisType);

  var scale = setScaleType(scaleObj.type);

  scale.domain(scaleObj.domain);

  setRangeArgs(scale, scaleObj);

  if (axis.nice) { niceify(scale, axisType, scaleObj); }
  if (axis.rescale) { rescale(scale, axisType, axis); }

  return {
    obj: scaleObj,
    scale: scale
  };

}

function ScaleObj(obj, axis, axisType) {
  this.type = axis.scale;
  this.domain = setDomain(obj, axis);
  this.rangeType = setRangeType(axis);
  this.range = setRange(obj, axisType);
  this.bands = obj.dimensions.bands;
  this.rangePoints = 1.0;
}

function setScaleType(type) {

  var scaleType;

  switch (type) {
    case "time":
      scaleType = d3.time.scale();
      break;
    case "ordinal":
    case "ordinal-time":
      scaleType = d3.scale.ordinal();
      break;
    case "linear":
      scaleType = d3.scale.linear();
      break;
    case "identity":
      scaleType = d3.scale.identity();
      break;
    case "pow":
      scaleType = d3.scale.pow();
      break;
    case "sqrt":
      scaleType = d3.scale.sqrt();
      break;
    case "log":
      scaleType = d3.scale.log();
      break;
    case "quantize":
      scaleType = d3.scale.quantize();
      break;
    case "quantile":
      scaleType = d3.scale.quantile();
      break;
    case "threshold":
      scaleType = d3.scale.threshold();
      break;
    default:
      scaleType = d3.scale.linear();
      break;
  }

  return scaleType;

}

function setRangeType(axis) {

  var type;

  switch(axis.scale) {
    case "time":
    case "linear":
      type = "range";
      break;
    case "ordinal":
    case "discrete":
      type = "rangeRoundBands";
      break;
    case "ordinal-time":
      type = "rangePoints";
      break;
    default:
      type = "range";
      break;
  }

  return type;

}

function setRange(obj, axisType) {

  var range;

  if (axisType === "xAxis") {
    range = [0, obj.dimensions.tickWidth()]; // operating on width
  } else if (axisType === "yAxis") {
    range = [obj.dimensions.yAxisHeight(), 0]; // operating on height
  }

  return range;

}

function setRangeArgs(scale, scaleObj) {

  switch (scaleObj.rangeType) {
    case "range":
      return scale[scaleObj.rangeType](scaleObj.range);
      break;
    case "rangeRoundBands":
      return scale[scaleObj.rangeType](scaleObj.range, scaleObj.bands.padding, scaleObj.bands.outerPadding);
      break;
    case "rangePoints":
      return scale[scaleObj.rangeType](scaleObj.range, scaleObj.rangePoints);
      break;
  }

}

function setDomain(obj, axis) {

  var data = obj.data.data;
  var domain;

  // included fallbacks just in case
  switch(axis.scale) {
    case "time":
      domain = setDateDomain(data, axis.min, axis.max);
      break;
    case "linear":
      domain = setNumericalDomain(data, axis.min, axis.max, obj.options.stacked);
      break;
    case "ordinal":
    case "ordinal-time":
      domain = setDiscreteDomain(data);
      break;
  }

  return domain;

}

function setDateDomain(data, min, max) {
  if (min && max) {
    var startDate = min, endDate = max;
  } else {
    var dateRange = d3.extent(data, function(d) { return d.key; });
    var startDate = min || new Date(dateRange[0]),
        endDate = max || new Date(dateRange[1]);
  }
  return [startDate, endDate];
}

function setNumericalDomain(data, min, max, stacked) {

  var minVal, maxVal;
  var mArr = [];

  d3.map(data, function(d) {
    for (var j = 0; j < d.series.length; j++) {
      mArr.push(Number(d.series[j].val));
    }
  });

  if (stacked) {
    var seriesAmount = data[0].series.length;
    var stack = d3.layout.stack();
    var seriesData = stack(d3.range(seriesAmount).map(function(key) {
      return data.map(function(d) {
        return {
          x: d.key,
          y: Number(d.series[key].val),
        };
      });
    }));

    maxVal = d3.max(seriesData[seriesData.length - 1], function(d) {
      return (d.y0 + d.y);
    });

  } else {
    maxVal = d3.max(mArr);
  }

  minVal = d3.min(mArr);

  if (min) {
    minVal = min;
  } else if (minVal > 0) {
    minVal = 0;
  }

  if (max) { maxVal = max; }

  return [minVal, maxVal];

}

function setDiscreteDomain(data) {
  return data.map(function(d) { return d.key; });
}

function rescale(scale, axisType, axisObj) {

  switch(axisObj.scale) {
    case "linear":
      if (!axisObj.max) { rescaleNumerical(scale, axisObj); }
      break;
  }
}

function rescaleNumerical(scale, axisObj) {

  // rescales the "top" end of the domain
  var ticks = scale.ticks(10).slice(),
      tickIncr = Math.abs(ticks[ticks.length - 1]) - Math.abs(ticks[ticks.length - 2]);

  var newMax = ticks[ticks.length - 1] + tickIncr;

  scale.domain([scale.domain()[0], newMax]);

}

function niceify(scale, axisType, scaleObj) {

  switch(scaleObj.type) {
    case "time":
      var timeDiff = require("../../utils/utils").timeDiff;
      var context = timeDiff(scale.domain()[0], scale.domain()[1], 3);
      niceifyTime(scale, context);
      break;
    case "linear":
      niceifyNumerical(scale);
      break;
  }

}

function niceifyTime(scale, context) {

  var getTimeInterval = require("../../utils/utils").timeInterval;
  var timeInterval = getTimeInterval(context);
  scale.domain(scale.domain()).nice(timeInterval);

}

function niceifyNumerical(scale) {
  scale.domain(scale.domain()).nice();
}

module.exports = {
  scaleManager: scaleManager,
  ScaleObj: ScaleObj,
  setScaleType: setScaleType,
  setRangeType: setRangeType,
  setRangeArgs: setRangeArgs,
  setRange: setRange,
  setDomain: setDomain,
  setDateDomain: setDateDomain,
  setNumericalDomain: setNumericalDomain,
  setDiscreteDomain: setDiscreteDomain,
  rescale: rescale,
  rescaleNumerical: rescaleNumerical,
  niceify: niceify,
  niceifyTime: niceifyTime,
  niceifyNumerical: niceifyNumerical
};
