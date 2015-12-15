function DynamicBarChart(node, obj) {

  var axisModule = require("../components/axis"),
    scaleModule = require("../components/scale"),
    Axis = axisModule.axisManager,
    Scale = scaleModule.scaleManager,
    Tips = require("../components/tips");

  // because the elements will be appended in reverse due to the
  // bar chart operating on the y-axis, need to reverse the dataset.
  obj.data.data.reverse();

  var xAxisOffset = 10;

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

  var textLengths = [];

  xAxisNode.selectAll("text").each(function() { textLengths.push(d3.select(this).node().getBoundingClientRect().height); })

  var tallestText = textLengths.reduce(function(a, b) { return (a > b ? a : b) });

  obj.dimensions.xAxisHeight = tallestText + xAxisOffset;

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

  if (obj.dimensions.width > obj.yAxis.widthThreshold) {
    var maxLabelWidth = obj.dimensions.computedWidth() / 3.5;
  } else {
    var maxLabelWidth = obj.dimensions.computedWidth() / 3;
  }

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
              "y": ((textHeight / tspanCount) / 2) - (textHeight / 2)
            });
        }
      });
  }

  obj.dimensions.labelWidth = yAxisNode.node().getBBox().width;

  yAxisGroup.attr("transform", "translate(" + obj.dimensions.labelWidth + ",0)");

  if (obj.exportable.x_axis) {
    xAxisSettings = obj.exportable.x_axis;
  } else {
    xAxisSettings = obj.xAxis;
  }

  var tickFinderX = axisModule.tickFinderY;

  if (obj.xAxis.widthThreshold > obj.dimensions.width) {
    var xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 6 };
  } else {
    var xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 4 };
  }

  var ticks = tickFinderX(xScale, obj.xAxis.ticks, xAxisTickSettings);

  xScale.range([0, obj.dimensions.tickWidth()]);

  xAxis.tickValues(ticks);

  xAxisNode.call(xAxis);

  xAxisNode.selectAll(".tick text")
    .call(axisModule.updateTextX, xAxisNode, obj, xAxis, obj.xAxis);

  xAxisGroup
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + obj.dimensions.computedHeight() + ")");

  var xAxisWidth = d3.transform(xAxisGroup.attr("transform")).translate[0] + xAxisGroup.node().getBBox().width;

  if (xAxisWidth > obj.dimensions.computedWidth()) {

    var allTicks = xAxisNode.selectAll(".tick")[0];
    var lastTickPos = d3.transform(d3.select(allTicks[allTicks.length - 1]).attr("transform")).translate[0];

    xScale.range([0, obj.dimensions.tickWidth() - (xAxisWidth - obj.dimensions.computedWidth())]);

    xAxisNode.call(xAxis);

    xAxisNode.selectAll(".tick text")
      .text(function(d, i) {
        var lastTick = xAxis.tickValues()[xAxis.tickValues().length - 1];
        var val = axisModule.setTickFormatY(obj.xAxis.format, d, lastTick);
        if (i === xAxis.tickValues().length - 1) {
          val = (obj.xAxis.prefix || "") + val + (obj.xAxis.suffix || "");
        }
        return val;
      });

  }

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
          return xScale(Math.min(0, d.series[i].val));
        },
        "y": function() {
          return i * singleBar;
        },
        "width": function(d) {
          return Math.abs(xScale(d.series[i].val) - xScale(0));
        },
        "height": function(d) { return singleBar; }
      });

    if (obj.data.seriesAmount > 1) {
      var barOffset = obj.dimensions.bands.offset;
      barItem.selectAll("rect")
        .attr({
          "y": function() {
            return ((i * singleBar) + (singleBar * (barOffset / 2)));
          },
          "height": singleBar - (singleBar * barOffset)
        });
    }

  }
  
  xAxisNode.selectAll("g")
    .filter(function(d) { return d; })
    .classed(obj.prefix + "minor", true);  

  xAxisNode.selectAll("line")
    .attr({
      "y1": -(obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight),
      "y2": 0
  });

  xAxisGroup
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");

  return {    
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: { node: xAxisGroup, axis: xAxis },
    yAxisObj: { node: yAxisGroup, axis: yAxis },
    seriesGroup: seriesGroup,
    series: series,
    singleBar: singleBar,
    barItem: barItem
  };

}

function FixedBarChart(node, obj) {

  var axisModule = require("../components/axis"),
    scaleModule = require("../components/scale"),
    Axis = axisModule.axisManager,
    Scale = scaleModule.scaleManager,
    Tips = require("../components/tips");

  // because the elements will be appended in reverse due to the
  // bar chart operating on the y-axis, need to reverse the dataset.
  obj.data.data.reverse();

  var xAxisOffset = 10;

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

  var textLengths = [];

  xAxisNode.selectAll("text").each(function() { textLengths.push(d3.select(this).node().getBoundingClientRect().height); })

  var tallestText = textLengths.reduce(function(a, b) { return (a > b ? a : b) });

  obj.dimensions.xAxisHeight = tallestText + xAxisOffset;

  xAxisNode.selectAll("g")
    .filter(function(d) { return d; })
    .classed(obj.prefix + "minor", true);

  //  scales
  var yScaleObj = new Scale(obj, "yAxis"),
      yScale = yScaleObj.scale;

  var totalBarHeight = (obj.dimensions.barHeight * obj.data.data.length * obj.data.seriesAmount);

  yScale.rangeRoundBands([totalBarHeight, 0], obj.dimensions.bands.padding, obj.dimensions.bands.outerPadding());

  obj.dimensions.yAxisHeight = totalBarHeight - (totalBarHeight * obj.dimensions.bands.outerPadding() * 2);

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

  if (obj.dimensions.width > obj.yAxis.widthThreshold) {
    var maxLabelWidth = obj.dimensions.computedWidth() / 3.5;
  } else {
    var maxLabelWidth = obj.dimensions.computedWidth() / 3;
  }

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
              "y": ((textHeight / tspanCount) / 2) - (textHeight / 2)
            });
        }
      });
  }

  obj.dimensions.labelWidth = yAxisNode.node().getBBox().width;

  yAxisGroup.attr("transform", "translate(" + obj.dimensions.labelWidth + ",0)");

  if (obj.exportable && obj.exportable.x_axis) {
    xAxisSettings = obj.exportable.x_axis;
  } else {
    xAxisSettings = obj.xAxis;
  }

  var tickFinderX = axisModule.tickFinderY;

  if (obj.xAxis.widthThreshold > obj.dimensions.width) {
    var xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 6 };
  } else {
    var xAxisTickSettings = { tickLowerBound: 3, tickUpperBound: 8, tickGoal: 4 };
  }

  var ticks = tickFinderX(xScale, obj.xAxis.ticks, xAxisTickSettings);

  xScale.range([0, obj.dimensions.tickWidth()]);

  xAxis.tickValues(ticks);

  xAxisNode.call(xAxis);

  xAxisNode.selectAll(".tick text")
    .call(axisModule.updateTextX, xAxisNode, obj, xAxis, obj.xAxis);

  xAxisGroup
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + totalBarHeight + ")");

  var xAxisWidth = d3.transform(xAxisGroup.attr("transform")).translate[0] + xAxisGroup.node().getBBox().width;

  if (xAxisWidth > obj.dimensions.computedWidth()) {

    var allTicks = xAxisNode.selectAll(".tick")[0];
    var lastTickPos = d3.transform(d3.select(allTicks[allTicks.length - 1]).attr("transform")).translate[0];

    xScale.range([0, obj.dimensions.tickWidth() - (xAxisWidth - obj.dimensions.computedWidth())]);

    xAxisNode.call(xAxis);

    xAxisNode.selectAll(".tick text")
      .text(function(d, i) {
        var lastTick = xAxis.tickValues()[xAxis.tickValues().length - 1];
        var val = axisModule.setTickFormatY(obj.xAxis.format, d, lastTick);
        if (i === xAxis.tickValues().length - 1) {
          val = (obj.xAxis.prefix || "") + val + (obj.xAxis.suffix || "");
        }
        return val;
      });

  }

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
          return xScale(Math.min(0, d.series[i].val));
        },
        "y": function() {
          return i * singleBar;
        },
        "width": function(d) {
          return Math.abs(xScale(d.series[i].val) - xScale(0));
        },
        "height": function(d) { return singleBar; }
      });

    if (obj.data.seriesAmount > 1) {
      var barOffset = obj.dimensions.bands.offset;
      barItem.selectAll("rect")
        .attr({
          "y": function() {
            return ((i * singleBar) + (singleBar * (barOffset / 2)));
          },
          "height": singleBar - (singleBar * barOffset)
        });
    }

  }
  
  xAxisNode.selectAll("g")
    .filter(function(d) { return d; })
    .classed(obj.prefix + "minor", true);

  xAxisNode.selectAll("line")
    .attr({
      "y1": -(totalBarHeight),
      "y2": 0
    });

  xAxisGroup
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + (totalBarHeight) + ")");

  // obj.dimensions.xAxisHeight = xAxisNode.node().getBBox().height;

  d3.select(node.node().parentNode)
    .attr("height", totalBarHeight + obj.dimensions.xAxisHeight);

  // d3.select(node.node().parentNode).select("." + obj.prefix + "bg")
  //   .attr({
  //     "y": -(xAxisOffset / 2),
  //     "height": obj.dimensions.xAxisHeight
  //   });

  obj.dimensions.computedHeight = function() { return this.xAxisHeight; };

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: { node: xAxisGroup, axis: xAxis },
    yAxisObj: { node: yAxisGroup, axis: yAxis },    
    seriesGroup: seriesGroup,
    series: series,
    singleBar: singleBar,
    barItem: barItem
  };

}

function BarChart(node, obj) {

  if (obj.exportable) {
    var barChart = DynamicBarChart(node, obj);
  } else {
    var barChart = FixedBarChart(node, obj);
  }
  
  var axisModule = require("../components/axis");
  
  axisModule.addZeroLine(obj, node, barChart.xAxisObj, "xAxis");

  return barChart;

}

module.exports = BarChart;
