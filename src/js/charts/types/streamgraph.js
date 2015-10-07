function StreamgraphChart(node, obj) {

  var axisModule = require("../components/axis"),
      scaleModule = require("../components/scale"),
      Axis = axisModule.axisManager,
      Scale = scaleModule.scaleManager,
      Tips = require("../components/tips"),
      colorScale = require("../../config/chart-tool-settings").colorScale;

  //  scales
  var xScaleObj = new Scale(obj, "xAxis"),
      yScaleObj = new Scale(obj, "yAxis"),
      xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  var stack = d3.layout.stack().offset("silhouette");

  var seriesData = stack(d3.range(obj.data.seriesAmount).map(function(key) {
    return obj.data.data.map(function(d) {
      return {
        legend: obj.data.keys[key],
        x: d.key,
        y: Number(d.series[key].val)
      };
    });
  }));

  yScaleObj.scale.domain([0, d3.max(seriesData[seriesData.length - 1], function(d) {
    var scaleMultiplier = require("../../config/chart-tool-settings").scaleMultiplier;
    return (d.y0 + d.y) * scaleMultiplier;
  })]);

  //  axes
  var xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
      yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis"),
      xAxis = xAxisObj.axis, yAxis = yAxisObj.axis;

  axisModule.axisCleanup(xAxisObj, yAxisObj, obj, node);

  if (xScaleObj.obj.type === "ordinal") {
    xScale.rangeRoundPoints([0, obj.dimensions.tickWidth()], 1.0);
  }

  var seriesGroup = node.append("g")
    .attr({
      "class": obj.prefix + "series_group",
      "transform": function() {
        return "translate(" + (obj.dimensions.width - obj.dimensions.tickWidth()) + "," + obj.dimensions.headerHeight + ")"
    }});

  // Add a group for each cause.
  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
    .data(seriesData)
    .enter().append("svg:g")
    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i + 1); })
    .style({
      "fill": function() { return "red"; },
      "stroke": function() { return "white"; }
    });

  var area = d3.svg.area().interpolate(obj.interpolation)
    .x(function(d) { return xScale(d.x); })
    .y0(function(d) { return yScale(d.y0); })
    .y1(function(d) { return yScale(d.y0 + d.y); });

  var line = d3.svg.line().interpolate(obj.interpolation)
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y0 + d.y); });

  series.append("path")
    .attr("class", function(d, i) {
      var output = obj.prefix + "stream-series " + obj.prefix + "stream-" + (i + 1);
      if (i === obj.seriesHighlight()) {
        output = obj.prefix + "stream-series " + obj.prefix + "stream-" + (i + 1) + " " + obj.prefix + "highlight";
      }
      return output;
    })
    .attr("d", area)
    .style('fill', function(d, i) {
      if (i !== obj.seriesHighlight()) {
        var output = colorScale[i - 1];
        if (i >= colorScale.length) {
          output = colorScale[colorScale.length-1];
        }
        return output;
      }
    });

  series.append("path")
    .attr("class", function() { return obj.prefix + "stream-series " + obj.prefix + "line"; })
    .attr("d", line);

  axisModule.addZeroLine(obj, node, yAxisObj);

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

module.exports = StreamgraphChart;