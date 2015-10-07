function appendBase(container, chart) {

  var chartBase = d3.selectAll(container)
    .append("svg")
    .attr({
      "class": chart.baseClass() + "_svg " + chart.prefix + chart.customClass + " " + chart.prefix + chart.options.type + " " + chart.prefix + "series-" + chart.data.seriesAmount,
      "width": chart.dimensions.width,
      "height": chart.dimensions.height()
    });

  // background
  chartBase
    .append("rect")
    .attr({
      "class": chart.prefix + "bg",
      "x": 0,
      "y": 0,
      "width": chart.dimensions.width,
      "height": chart.dimensions.height()
    });

  // need to remember to reduce the width by 5px or so
  // so that paths have space for linecaps

  var graph = chartBase.append("g").attr("class", chart.prefix + "graph");

  return graph;
}

module.exports = appendBase;
