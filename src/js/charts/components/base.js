function append(container, obj) {

  // var height = obj.dimensions.height();

  // obj.dimensions.height = function() {
  //   if (obj.exportable) {
  //     return height - obj.dimensions.headerHeight - obj.dimensions.footerHeight;
  //   } else {
  //     return height;
  //   }
  // }

  var chartBase = d3.select(container)
    .insert("svg", "." + obj.prefix + "chart_source")
    .attr({
      "class": obj.baseClass() + "_svg " + obj.prefix + obj.customClass + " " + obj.prefix + obj.options.type + " " + obj.prefix + "series-" + obj.data.seriesAmount,
      "width": obj.dimensions.width,
      "height": obj.dimensions.computedHeight()
    })
    .style("padding-top", obj.dimensions.margins.top + "px");

  // background
  chartBase
    .append("rect")
    .attr({
      "class": obj.prefix + "bg",
      "x": 0,
      "y": 0,
      "width": obj.dimensions.width,
      "height": obj.dimensions.computedHeight()
    });

  // need to remember to reduce the width by 5px or so
  // so that paths have space for linecaps

  var graph = chartBase.append("g").attr("class", obj.prefix + "graph");

  return graph;

}

// function resize(container, obj) {

//   var computedHeight = obj.dimensions.height() - obj.dimensions.headerHeight - obj.dimensions.footerHeight;

//   var chartBase = d3.select(container).select("svg")
//     .attr("height", computedHeight);

//   chartBase.select("." + obj.prefix + "bg")
//     .attr("height", computedHeight);

//   obj.dimensions.height = function() {
//     return computedHeight;
//   }

// }

module.exports = append;
