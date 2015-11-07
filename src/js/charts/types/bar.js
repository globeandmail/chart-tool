function BarChart(node, obj) {

  var axisModule = require("../components/axis"),
    scaleModule = require("../components/scale"),
    Axis = axisModule.axisManager,
    Scale = scaleModule.scaleManager,
    Tips = require("../components/tips");

  //  scales
  var yScaleObj = new Scale(obj, "yAxis"),
    yScale = yScaleObj.scale;

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  var yAxisGroup = node.append("g")
    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + "y-axis-group")
    .attr("transform", "translate(0,0)");

  var yAxisNode = yAxisGroup.append("g")
    .attr("class", obj.prefix + "y-axis")
    .call(yAxis);

  yAxisNode.selectAll("line").remove();
  yAxisNode.selectAll("text").attr("x", 0);

  obj.dimensions.labelWidth = yAxisNode.node().getBBox().width;

  yAxisGroup.attr("transform", "translate(" + obj.dimensions.labelWidth + ",0)");



  var xScaleObj = new Scale(obj, "xAxis"),
    xScale = xScaleObj.scale;

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var xAxisGroup = node.append("g")
    .attr("class", obj.prefix + "axis-group" + " " + obj.prefix + "x-axis-group")
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");

  var xAxisNode = xAxisGroup.append("g")
    .attr("class", obj.prefix + "x-axis")
    .call(xAxis);

  obj.dimensions.xAxisHeight = xAxisNode.node().getBBox().height;

  // yScale.range([0, obj.dimensions.yAxisHeight()]);

  // yAxisNode.call(yAxis);

  xAxisNode.selectAll("line")
    .attr({
      "y1": 0,
      "y2": obj.dimensions.yAxisHeight()
    });

  // debugger;


  // obj.dimensions.xAxisHeight = xAxisNode.node().getBBox().height;







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


  var singleBar = yScale.rangeBand() / obj.data.seriesAmount;

  for (var i = 0; i < obj.data.seriesAmount; i++) {

    var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + i);

    var barItem = series
      .selectAll("." + obj.prefix + "bar")
      .data(obj.data.data)
      .enter()
      .append("g")
      .attr({
        "class": obj.prefix + "bar " + obj.prefix + "bar-" + (i),
        "data-series": i,
        "data-key": function(d) {
          return d.key;
        },
        "data-legend": function() {
          return obj.data.keys[i + 1];
        },
        "transform": function(d) {
          return "translate(0," + (yScale(d.key)) + ")";
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

  // axisModule.axisCleanup(xAxisObj, yAxisObj, obj, node);

  // axisModule.addZeroLine(obj, node, yAxisObj);

  // return {
  //   xScaleObj: xScaleObj,
  //   yScaleObj: yScaleObj,
  //   xAxisObj: xAxisObj,
  //   yAxisObj: yAxisObj,
  //   seriesGroup: seriesGroup,
  //   series: series,
  //   singleColumn: singleColumn,
  //   columnItem: columnItem
  // };

};

module.exports = BarChart;
