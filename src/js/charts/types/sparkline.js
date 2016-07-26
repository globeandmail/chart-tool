function LineChart(node, obj) {

  var axisModule = require("../components/axis"),
      scaleModule = require("../components/scale"),
      Axis = axisModule.axisManager,
      Scale = scaleModule.scaleManager;

  //  scales
  var xScaleObj = new Scale(obj, "xAxis"),
      yScaleObj = new Scale(obj, "yAxis"),
      xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  // axes
  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis");

  // axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);

  var line = d3.svg.line().interpolate(obj.options.interpolation)
    .defined(function(d) { return !isNaN(d.series[0].val); })
    .x(function(d) { return xScale(d.key); })
    .y(function(d) { return yScale(d.series[0].val); });

  var seriesGroup = node.append("g")
    .attr("class", function() { return obj.prefix + "series_group"; });

  seriesGroup.append("path")
    .datum(obj.data.data)
    .attr({
      // "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
      "class": function() {
        var output = obj.prefix + obj.options.type + " " + obj.prefix + obj.options.type + "-0 " + obj.prefix + "highlight";
        return output;
      },
      "d": line
    });

  var dotGroup = node.append("g")
    .attr("class", function() {
      return obj.prefix + "dot-group";
    });

  dotGroup.selectAll("circle")
    .data([obj.data.data[0], obj.data.data[obj.data.data.length - 1]])
    .enter().append("circle")
    .attr({
      // "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
      "cx": function(d) { return xScale(d.key) },
      "cy": function(d) { return yScale(d.series[0].val) },
      "r": 4.5
    });

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    seriesGroup: seriesGroup,
    line: line
  };

};

module.exports = LineChart;
