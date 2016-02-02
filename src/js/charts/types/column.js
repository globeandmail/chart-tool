function ColumnChart(node, obj) {

  var axisModule = require("../components/axis"),
    scaleModule = require("../components/scale"),
    Axis = axisModule.axisManager,
    Scale = scaleModule.scaleManager,
    Tips = require("../components/tips");

  //  scales
  var yScaleObj = new Scale(obj, "yAxis"),
    xScaleObj = new Scale(obj, "xAxis"),
    yScale = yScaleObj.scale,
    xScale = xScaleObj.scale;

  // axes
  var yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis"),
    xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
    yAxis = yAxisObj.axis,
    xAxis = xAxisObj.axis;

  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);

  var timeScale = (obj.xAxis.scale === "time") ? true : false;

  if (timeScale) {

    var timeInterval = require("../../utils/utils").timeInterval,
        timeElapsed = timeInterval(obj.data.data);
    var singleColumn = obj.dimensions.tickWidth() / timeElapsed;

    xAxisObj.range = [0, (obj.dimensions.tickWidth() - singleColumn)];

    axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);

  } else {
    var singleColumn = xScale.rangeBand() / obj.data.seriesAmount;
  }

  var seriesGroup = node.append("g")
    .attr("class", function() {
      var output = obj.prefix + "series_group";
      if (obj.data.seriesAmount > 1) {
        // If more than one series append a 'multiple' class so we can target
        output += " " + obj.prefix + "multiple";
      }
      return output;
    })
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");

  for (var i = 0; i < obj.data.seriesAmount; i++) {

    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);

    var columnItem = series
      .selectAll("." + obj.prefix + "column")
      .data(obj.data.data).enter()
      .append("g")
      .attr({
        "class": obj.prefix + "column " + obj.prefix + "column-" + (i),
        "data-series": i,
        "data-key": function(d) { return d.key; },
        "data-legend": function() { return obj.data.keys[i + 1]; },
        "transform": function(d) {
          return "translate(" + xScale(d.key) + ",0)";
        }
      });

    columnItem.append("rect")
      .attr({
        "class": function(d) {
          return d.series[i].val < 0 ? "negative" : "positive";
        },
        "x": function(d) {
          return i * singleColumn;
        },
        "y": function(d) {
          return yScale(Math.max(0, d.series[i].val));
        },
        "height": function(d) {
          return Math.abs(yScale(d.series[i].val) - yScale(0));
        },
        "width": function() {
          return singleColumn;
        }
      });

    if (obj.data.seriesAmount > 1) {

      var columnOffset = obj.dimensions.bands.offset;

      columnItem.selectAll("rect")
        .attr({
          "x": function() {
            return ((i * singleColumn) + (singleColumn * (columnOffset / 2)));
          },
          "width": singleColumn - (singleColumn * columnOffset)
        });
    }

  }

  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    series: series,
    singleColumn: singleColumn,
    columnItem: columnItem
  };

}

function OrdinalTimeColumnChart(node, obj) {

  var axisModule = require("../components/axis"),
      scaleModule = require("../components/scale"),
      Axis = axisModule.axisManager,
      Scale = scaleModule.scaleManager,
      Tips = require("../components/tips");

  //  scales
  var xScaleObj = new Scale(obj, "xAxis"),
      yScaleObj = new Scale(obj, "yAxis"),
      xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  // axes
  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis"),
      xAxis = xAxisObj.axis, yAxis = yAxisObj.axis;

  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);

  var singleColumn = xScale(obj.data.data[1].key) - xScale(obj.data.data[0].key);

  node.select("." + obj.prefix + "axis-group." + obj.prefix + "xAxis")
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");

  var seriesGroup = node.append("g")
    .attr("class", function() {
      var output = obj.prefix + "series_group";
      if (obj.data.seriesAmount > 1) {
        output += " " + obj.prefix + "multiple";
      }
      return output;
    })
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + ",0)");

  for (var i = 0; i < obj.data.seriesAmount; i++) {

    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);

    var columnItem = series
      .selectAll("." + obj.prefix + "column")
      .data(obj.data.data).enter()
      .append("g")
      .attr({
        "class": obj.prefix + "column " + obj.prefix + "column-" + (i),
        "data-series": i,
        "data-key": function(d) { return d.key; },
        "data-legend": function() { return obj.data.keys[i + 1]; }
      });

    columnItem.append("rect")
      .attr({
        "class": function(d) {
          return d.series[i].val < 0 ? "negative" : "positive";
        },
        "x": function(d) {
          return xScale(d.key);
        },
        "y": function(d) {
          if (d.series[i].val !== "__undefined__") {
            return yScale(Math.max(0, d.series[i].val));
          }
        },
        "height": function(d) {
          if (d.series[i].val !== "__undefined__") {
            return Math.abs(yScale(d.series[i].val) - yScale(0));
          }
        },
        "width": function() {
          return (singleColumn / obj.data.seriesAmount);
        }
      });

    if (obj.data.seriesAmount > 1) {

      var columnOffset = obj.dimensions.bands.offset;

      columnItem.selectAll("rect")
        .attr({
          "x": function(d) {
            return xScale(d.key) + (i * (singleColumn / obj.data.seriesAmount));
          }
        });
    }

  }

  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    series: series,
    singleColumn: singleColumn,
    columnItem: columnItem
  };

}

module.exports = {
  ColumnChart :ColumnChart,
  OrdinalTimeColumnChart: OrdinalTimeColumnChart
};
