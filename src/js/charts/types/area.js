function AreaChart(node, obj) {

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

  var seriesGroup = node.append("g")
    .attr("class", function() {
      var output = obj.prefix + "series_group";
      if (obj.data.seriesAmount > 1) {
        // If more than one series append a 'multiple' class so we can target
        output += " " + obj.prefix + "multiple";
      }
      return output;
    });

  // Secondary array is used to store a reference to all series except for the highlighted item
  var secondaryArr = [];

  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) {
    // Dont want to include the highlighted item in the loop
    // because we always want it to sit above all the other lines

    if (i !== obj.seriesHighlight()) {

      var area = d3.svg.area().interpolate(obj.options.interpolation)
        .defined(function(d) { return !isNaN(d.series[i].val); })
        .x(function(d) { return xScale(d.key); })
        .y0(yScale(0))
        .y1(function(d) { return yScale(d.series[i].val); });

      var line = d3.svg.line().interpolate(obj.options.interpolation)
        .defined(function(d) { return !isNaN(d.series[i].val); })
        .x(function(d) { return xScale(d.key); })
        .y(function(d) { return yScale(d.series[i].val); });

      var pathRef = seriesGroup.append("path")
        .datum(obj.data.data)
        .attr({
          "d": area,
          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
          "class": function() {
            var output = obj.prefix + "fill " + obj.prefix + "fill-" + (i);
            return output;
          }
        });

      seriesGroup.append("path")
        .datum(obj.data.data)
        .attr({
          "d": line,
          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
          "class": function() {
            var output = obj.prefix + "line " + obj.prefix + "line-" + (i);
            return output;
          }
        });

      secondaryArr.push(pathRef);
    }

  }

  // Loop through all the secondary series (all series except the highlighted one)
  // and set the colours in the correct order

  var secondaryArr = secondaryArr.reverse();

  var hArea = d3.svg.area().interpolate(obj.options.interpolation)
    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
    .x(function(d) { return xScale(d.key); })
    .y0(yScale(0))
    .y1(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });

  var hLine = d3.svg.line().interpolate(obj.options.interpolation)
    .defined(function(d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
    .x(function(d) { return xScale(d.key); })
    .y(function(d) { return yScale(d.series[obj.seriesHighlight()].val); });

  seriesGroup.append("path")
    .datum(obj.data.data)
    .attr({
      "d": hArea,
      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
      "class": function() {
        var output = obj.prefix + "fill " + obj.prefix + "fill-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
        return output;
      }
    });

  seriesGroup.append("path")
    .datum(obj.data.data)
    .attr({
      "d": hLine,
      "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)",
      "class": function() {
        var output = obj.prefix + "line " + obj.prefix + "line-" + (obj.seriesHighlight()) + " " + obj.prefix + "highlight";
        return output;
      }
    });

  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    hLine: hLine,
    hArea: hArea,
    line: line,
    area: area
  };

};

module.exports = AreaChart;
