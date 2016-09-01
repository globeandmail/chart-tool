function SparklineChart(node, obj) {

  var scaleModule = require("../components/scale"),
      Scale = scaleModule.scaleManager;

  // reset yAxisPaddingRight since we won't have a yAxis
  obj.dimensions.yAxisPaddingRight = 0;

  //  scales
  var xScaleObj = new Scale(obj, "xAxis"),
      yScaleObj = new Scale(obj, "yAxis"),
      xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  var dotRadius = 5;

  xScale.range([dotRadius, xScale.range()[1] - dotRadius]);

  var sparkline = d3.svg.line().interpolate(obj.options.interpolation)
    .defined(function(d) { return !isNaN(d.series[0].val); })
    .x(function(d) { return xScale(d.key); })
    .y(function(d) { return yScale(d.series[0].val); });

  var seriesGroup = node.append("g")
    .attr("class", function() { return obj.prefix + "series_group"; });

  seriesGroup.append("path")
    .datum(obj.data.data)
    .attr({
      "class": function() {
        var output = obj.prefix + obj.options.type + " " + obj.prefix + obj.options.type + "-0 " + obj.prefix + "highlight";
        return output;
      },
      "d": sparkline
    });

  seriesGroup.append("line")
    .attr({
      "class": obj.prefix + "zero-line",
      "x1": xScale(obj.data.data[0].key),
      "x2": xScale(obj.data.data[obj.data.data.length - 1].key),
      "y1": yScale(obj.data.data[0].series[0].val),
      "y2": yScale(obj.data.data[0].series[0].val)
    });

  // debugger;

  var dotGroup = node.append("g")
    .attr("class", function() {
      return obj.prefix + "dot-group";
    });

  var dotScale = new Scale(obj, "xAxis").scale;

  // need to handle dots near top or bottom. maybe create a dotRadius-
  // wide bounding box within the group for the chart?

  var firstLast = dotGroup.selectAll("circle")
    .data([obj.data.data[0], obj.data.data[obj.data.data.length - 1]]);

  firstLast.enter().append("circle")
    .attr({
      "cx": function(d, i) {
        var symbol = (i === 0) ? 1 : -1;
        return dotScale(d.key) + (dotRadius * symbol);
      },
      "cy": function(d) { return yScale(d.series[0].val) },
      "r": dotRadius
    });

  var dateFormatter = require("../../utils/utils").dateFormatter,
      timeDiff = require("../../utils/utils").timeDiff,
      setTextFormat = require("../components/axis").setTickFormatY;

  var ctx = timeDiff(dotScale.domain()[0], dotScale.domain()[dotScale.domain().length - 1], 8);

  var text = firstLast.enter().append("text")
    .style("text-anchor", function(d, i) {
      return (i === 0) ? "start" : "end";
    });

  text.append("tspan")
    .attr({
      "x": function(d) { return dotScale(d.key); },
      "y": function(d) { return yScale(d.series[0].val); },
      "dy": "0em",
      "class": obj.prefix + "text_date"
    })
    .call(dateFormatter, ctx, obj.monthsAbr);

  text.append("tspan")
    .attr({
      "x": function(d) { return dotScale(d.key); },
      "y": function(d, i) { return yScale(d.series[0].val); },
      "dy": "1em",
      "class": obj.prefix + "text_value"
    })
    .text(function(d) {
      var axis = obj.yAxis,
          formatted = setTextFormat(axis.format, d.series[0].val);
      return ((axis.prefix || "") + formatted + (axis.suffix || ""));
    });

  var lineHeight;

  text.selectAll("tspan")
    .attr("y", function(d) {
      var lineHeight = 26;
      var yPos = yScale(d.series[0].val),
          yShift = dotRadius;
      if (yPos / yScale.range()[0] < 0.5) {
        console.log("above");
        return yScale(d.series[0].val) + lineHeight;
      } else {
        console.log("below");
        return yScale(d.series[0].val) - lineHeight;
      }

      // if (yPos / yScale.range()[0] < 0.5) { yShift = yShift * -1; lineHeight * -1; }
      // return yScale(d.series[0].val) + lineHeight;
      // return yScale(d.series[0].val);
    });

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    seriesGroup: seriesGroup,
    dotGroup: dotGroup,
    sparkline: sparkline
  };

};

module.exports = SparklineChart;
