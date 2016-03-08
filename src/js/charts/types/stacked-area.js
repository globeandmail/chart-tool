function StackedAreaChart(node, obj) {

  var axisModule = require("../components/axis"),
      scaleModule = require("../components/scale"),
      Axis = axisModule.axisManager,
      Scale = scaleModule.scaleManager;

  //  scales
  var xScaleObj = new Scale(obj, "xAxis"),
      yScaleObj = new Scale(obj, "yAxis"),
      xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  // axes
  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis");

  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);

  if (xScaleObj.obj.type === "ordinal") {
    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
  }

  // wha?
  if (obj.data.seriesAmount === 1) { obj.seriesHighlight = function() { return 0; } }

  node.classed(obj.prefix + "stacked", true);

  var seriesGroup = node.append("g")
    .attr("class", function() {
      var output = obj.prefix + "series_group";
      if (obj.data.seriesAmount > 1) {
        // If more than one series append a 'muliple' class so we can target
        output += " " + obj.prefix + "multiple";
      }
      return output;
    });

  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
    .data(obj.data.stackedData)
    .enter().append("svg:g")
    .attr({
      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
      "class": function(d, i) {
        var output = obj.prefix + "series " + obj.prefix + "series_" + (i);
        if (i === obj.seriesHighlight()) {
          output = obj.prefix + "series " + obj.prefix + "series_" + (i) + " " + obj.prefix + "highlight";
        }
        return output;
      }
    });

  var area = d3.svg.area().interpolate(obj.options.interpolation)
    .defined(function(d) { return !isNaN(d.y0 + d.y); })
    .x(function(d) { return xScale(d.x); })
    .y0(function(d) { return yScale(d.y0); })
    .y1(function(d) { return yScale(d.y0 + d.y); });

  var line = d3.svg.line().interpolate(obj.options.interpolation)
    .defined(function(d) { return !isNaN(d.y0 + d.y); })
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y0 + d.y); });

  series.append("path")
    .attr("class", function(d, i) {
      var output = obj.prefix + "fill " + obj.prefix + "fill-" + (i);
      if (i === obj.seriesHighlight()) {
        output = obj.prefix + "fill " + obj.prefix + "fill-" + (i) + " " + obj.prefix + "highlight";
      }
      return output;
    })
    .attr("d", area);

  series.append("path")
    .attr("class", function(d, i) { return obj.prefix + "line " + obj.prefix + "line-" + (i); })
    .attr("d", line);

  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    series: series,
    line: line,
    area: area
  };

};

module.exports = StackedAreaChart;
