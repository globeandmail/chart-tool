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
  if (obj.xAxis.scale === "time") {

    var singleColumn = (obj.dimensions.tickWidth() / obj.data.data.length);

    for (var j = 0; j < obj.data.seriesAmount; j++) {
      var series = seriesGroup.append("g").attr("class", obj.prefix + "series_" + j);

      var columnItem = series
        .selectAll("." + obj.prefix + "column")
        .data(obj.data.data).enter()
        .append("g")
        .attr({
          "class": obj.prefix + "column " + obj.prefix + "column-" + (j),
          "data-series": j,
          "data-key": function(d) {
            return d.key;
          },
          "data-legend": function() {
            return obj.data.keys[j + 1];
          }
        });

      columnItem.append("rect")
        .attr({
          "class": function(d) {
            return d.series[j].val < 0 ? "negative" : "positive";
          },
          "x": function(d, i) {
            return singleColumn * i;
          },
          "y": function(d) {
            return yScale(Math.max(0, d.series[j].val));
          },
          "height": function(d) {
            return Math.abs(yScale(d.series[j].val) - yScale(0));
          },
          "width": function(d) { return singleColumn; }
        });

    }

  } else {

    var singleColumn = xScale.rangeBand() / obj.data.seriesAmount;

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
