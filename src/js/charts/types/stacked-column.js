function StackedColumnChart(node, obj) {

  var axisModule = require("../components/axis"),
      scaleModule = require("../components/scale"),
      Axis = axisModule.axisManager,
      Scale = scaleModule.scaleManager,
      Tips = require("../components/tips");

  //  scales
  var xScaleObj = new Scale(obj, "xAxis"),
      yScaleObj = new Scale(obj, "yAxis"),
      xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  if (obj.yAxis.nice) { yScale.nice(); }

  //  axes
  var yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis"),
      xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
      yAxis = yAxisObj.axis, xAxis = xAxisObj.axis;

  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);

  var seriesGroup = node.append("g")
    .attr("class", function() {
      var output = obj.prefix + "series_group";
      if (obj.data.seriesAmount > 1) {
        // If more than one series append a 'muliple' class so we can target
        output += " " + obj.prefix + "multiple";
      }
      return output;
    })
    .attr("transform", function() {
      return "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)";
    })

  // Add a group for each cause.
  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
    .data(obj.data.stackedData)
    .enter().append("svg:g")
    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i); });


  // xScale.rangeRoundBands(xScale, obj.dimensions.bands.padding, obj.dimensions.bands.outerPadding())

  // Add a rect for each data point.
  var rect = series.selectAll("rect")
    .data(Object)
    .enter().append("svg:rect")
    .attr({
      "class": obj.prefix + "column",
      "data-key": function(d) { return d.x; },
      "x": function(d) { return xScale(d.x); },
      "y": function(d) { return yScale(Math.max(0, d.y0 + d.y)); },
      "height": function(d) { return Math.abs(yScale(d.y) - yScale(0)); },
      "width": xScale.rangeBand()
    });

  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    series: series,
    rect: rect
  };

};

module.exports = StackedColumnChart;
