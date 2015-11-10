function BarChart(node, obj) {

  var axisModule = require("../components/axis"),
    scaleModule = require("../components/scale"),
    Axis = axisModule.axisManager,
    Scale = scaleModule.scaleManager,
    Tips = require("../components/tips");


  // because the elements will be appended in reverse due to the
  // bar chart operating on the y-axis, need to reverse the dataset.
  obj.data.data.reverse();


  var xScaleObj = new Scale(obj, "xAxis"),
    xScale = xScaleObj.scale;

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var xAxisGroup = node.append("g")
    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + "xAxis")
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");

  var xAxisNode = xAxisGroup.append("g")
    .attr("class", obj.prefix + "x-axis")
    .call(xAxis);

  obj.dimensions.xAxisHeight = xAxisNode.node().getBBox().height;

  xAxisNode.selectAll("g")
    .filter(function(d) { return d; })
    .classed(obj.prefix + "minor", true);


  //  scales
  var yScaleObj = new Scale(obj, "yAxis"),
    yScale = yScaleObj.scale;

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  var yAxisGroup = node.append("g")
    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + "yAxis")
    .attr("transform", "translate(0,0)");

  var yAxisNode = yAxisGroup.append("g")
    .attr("class", obj.prefix + "y-axis")
    .call(yAxis);

  yAxisNode.selectAll("line").remove();
  yAxisNode.selectAll("text").attr("x", 0);

  var maxLabelWidth = obj.dimensions.computedWidth() / 3.5;

  if (yAxisNode.node().getBBox().width > maxLabelWidth) {
    var wrapText = require("../../utils/utils").wrapText;
    yAxisNode.selectAll("text")
      .call(wrapText, maxLabelWidth)
      .each(function() {
        var tspans = d3.select(this).selectAll("tspan"),
            tspanCount = tspans[0].length,
            textHeight = d3.select(this).node().getBBox().height;
        if (tspanCount > 1) {
          tspans
            .attr({
              "y": -((textHeight / tspanCount / 2) * (tspanCount - 1))
            });
        }
      });
  }

  obj.dimensions.labelWidth = yAxisNode.node().getBBox().width;

  yAxisGroup.attr("transform", "translate(" + obj.dimensions.labelWidth + ",0)");






  // run tickFinder calculation here


  if (obj.exportable && obj.exportable.x_axis) {
    xAxisSettings = obj.exportable.x_axis;
  } else {
    xAxisSettings = obj.xAxis;
  }

  var tickFinderX = axisModule.tickFinderY;

  var ticks = tickFinderX(xScale, obj.xAxis.ticks, xAxisSettings);

  // need to write a tickFinder that has a tickTarget and a ticksSmall, like with the regular xAxis.




  xScale.range([0, obj.dimensions.tickWidth()]);

  xAxisNode.call(xAxis);

  xAxisGroup
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");

  // need to add prefix and suffix to last tick text value

  var xAxisWidth = d3.transform(xAxisGroup.attr("transform")).translate[0] + xAxisGroup.node().getBBox().width;

  if (xAxisWidth > obj.dimensions.computedWidth()) {

    var allTicks = xAxisNode.selectAll(".tick")[0];
    var lastTickPos = d3.transform(d3.select(allTicks[allTicks.length - 1]).attr("transform")).translate[0];

    xScale.range([0, obj.dimensions.tickWidth() - (xAxisWidth - obj.dimensions.computedWidth())]);

    xAxisNode.call(xAxis);

    // need to re-add prefix and suffix to last tick text value

  }

  xAxisNode.selectAll("line")
    .attr({
      "y1": -(obj.dimensions.yAxisHeight()),
      "y2": 0
    });




  var seriesGroup = node.append("g")
    .attr("class", function() {
      var output = obj.prefix + "series_group";
      if (obj.data.seriesAmount > 1) {
        output += " " + obj.prefix + "multiple";
      }
      return output;
    })
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");


  var singleBar = yScale.rangeBand() / obj.data.seriesAmount;

  for (var i = 0; i < obj.data.seriesAmount; i++) {

    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);

    var barItem = series
      .selectAll("." + obj.prefix + "bar")
      .data(obj.data.data).enter()
      .append("g")
      .attr({
        "class": obj.prefix + "bar " + obj.prefix + "bar-" + (i),
        "data-series": i,
        "data-key": function(d) { return d.key; },
        "data-legend": function() { return obj.data.keys[i + 1]; },
        "transform": function(d) {
          return "translate(0," + yScale(d.key) + ")";
        }
      });

    barItem.append("rect")
      .attr({
        "class": function(d) {
          return d.series[i].val < 0 ? "negative" : "positive";
        },
        "x": function(d) {
          return yScale(Math.max(0, d.series[i].val));
        },
        "y": function() {
          return i * singleBar;
        },
        "width": function(d) {
          return Math.abs(xScale(d.series[i].val) - xScale(0));
        },
        "height": function(d) { return singleBar; }
      });

  }

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    seriesGroup: seriesGroup,
    series: series,
    singleBar: singleBar,
    barItem: barItem
  };

};

module.exports = BarChart;
