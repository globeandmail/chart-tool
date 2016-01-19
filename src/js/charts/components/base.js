function append(container, obj) {

  var margin = obj.dimensions.margin;

  var chartBase = d3.select(container)
    .insert("svg", "." + obj.prefix + "chart_source")
    .attr({
      "class": obj.baseClass() + "_svg " + obj.prefix + obj.customClass + " " + obj.prefix + "type_" + obj.options.type + " " + obj.prefix + "series-" + obj.data.seriesAmount,
      "width": obj.dimensions.computedWidth() + margin.left + margin.right,
      "height": obj.dimensions.computedHeight() + margin.top + margin.bottom,
      "version": 1.1,
      "xmlns": "http://www.w3.org/2000/svg"
    });

  // background
  chartBase
    .append("rect")
    .attr({
      "class": obj.prefix + "bg",
      "x": 0,
      "y": 0,
      "width": obj.dimensions.computedWidth(),
      "height": obj.dimensions.computedHeight(),
      "transform": "translate(" + margin.left + "," + margin.top + ")"
    });

  var graph = chartBase.append("g")
    .attr({
      "class": obj.prefix + "graph",
      "transform": "translate(" + margin.left + "," + margin.top + ")"
    });

  return graph;

}

module.exports = append;
