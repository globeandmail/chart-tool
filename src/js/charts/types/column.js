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

  axisModule.axisCleanup(xAxisObj, yAxisObj, obj, node);

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

  // hack to get time-series columns to work. should maybe be rewritten?
  if (xScaleObj.obj.rangeType === "range") {
    var getTimeDiff = require("../../utils/utils").timeDiff;
    var getTimeInterval = require("../../utils/utils").timeInterval;

    var interval = getTimeInterval(getTimeDiff(xScale.domain()[0], xScale.domain()[1],1));

    var singleColumn = (obj.dimensions.tickWidth() / obj.data.data.length);
  } else {
    var singleColumn = xScale.rangeBand() / obj.data.seriesAmount;
  }

  for (var i = 0; i < obj.data.seriesAmount; i++) {

    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);

    var columnItem = series
      .selectAll("." + obj.prefix + "column")
      .data(obj.data.data).enter()
      .append("g")
      .attr({
        "class": obj.prefix + "column " + obj.prefix + "column-" + (i),
        "data-series": i,
        "data-key": function(d) {
          return d.key;
        },
        "data-legend": function() {
          return obj.data.keys[i + 1];
        },
        "transform": function(d) {
          return "translate(" + (xScale(d.key)) + ",0)";
        }
      });

    columnItem.append("rect")
      .attr({
        "class": function(d) {
          return d.series[i].val < 0 ? "negative" : "positive";
        },
        "x": function() {
          return i * singleColumn;
        },
        "y": function(d) {
          return yScale(Math.max(0, d.series[i].val));
        },
        "height": function(d) {
          return Math.abs(yScale(d.series[i].val) - yScale(0));
        },
        "width": function(d) { return ((obj.dimensions.tickWidth() / 67) - 1); }
      });

    if (obj.data.seriesAmount > 1) {

      var columnOffset = obj.dimensions.bands.offset;

      columnItem.select("rect")
        .attr({
          "x": function() {
            return ((i * singleColumn) + (singleColumn * (columnOffset / 2)));
          },
          "width": singleColumn - (singleColumn * columnOffset)
        });
    }

  }

  axisModule.addZeroLine(obj, node, yAxisObj);

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

};

module.exports = ColumnChart;
