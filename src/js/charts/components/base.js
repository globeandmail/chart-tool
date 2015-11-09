function append(container, obj) {

  var chartBase = d3.select(container)
    .insert("svg", "." + obj.prefix + "chart_source")
    .attr({
      "class": obj.baseClass() + "_svg " + obj.prefix + obj.customClass + " " + obj.prefix + "type_" + obj.options.type + " " + obj.prefix + "series-" + obj.data.seriesAmount,
      "width": obj.dimensions.computedWidth(),
      "height": obj.dimensions.computedHeight()
    })
    .style({
      "padding": function() {
        var p = obj.dimensions.padding;
        return (p.top + "px " + p.right + "px " + p.bottom + "px " + p.left);
      }
    });

  // background
  chartBase
    .append("rect")
    .attr({
      "class": obj.prefix + "bg",
      "x": 0,
      "y": 0,
      "width": obj.dimensions.computedWidth(),
      "height": obj.dimensions.computedHeight()
    });

  var graph = chartBase.append("g")
    .attr("class", obj.prefix + "graph");

  return graph;

}

module.exports = append;
