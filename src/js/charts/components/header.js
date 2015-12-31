function headerComponent(container, obj) {

  var helpers = require("../../helpers/helpers");

  var headerGroup = d3.select(container)
    .append("div")
    .classed(obj.prefix + "chart_title " + obj.prefix + obj.customClass, true);

  headerGroup
    .text(obj.heading);

  if (obj.editable) {
    headerGroup
      .attr("contentEditable", true)
      .classed("editable-chart_title", true);
  }

  if (obj.data.keys.length > 2) {

    var legend = headerGroup.append("div")
      .classed(obj.prefix + "chart_legend", true);

    var keys = helpers.extend(obj.data.keys);

    // get rid of the first item as it doesnt represent a series
    keys.shift();

    var legendItem = legend.selectAll("div." + obj.prefix + "legend_item")
      .data(keys)
      .enter()
      .append("div")
      .attr("class", function(d, i) {
        return obj.prefix + "legend_item " + obj.prefix + "legend_item_" + (i);
      });

    legendItem.append("span")
      .attr("class", obj.prefix + "legend_item_icon");

    legendItem.append("span")
      .attr("class", obj.prefix + "legend_item_text")
      .text(function(d) { return d; });
  }

  obj.dimensions.headerHeight = headerGroup.node().getBoundingClientRect().height;

  return {
    headerGroup: headerGroup,
    legend: legend
  };

}

module.exports = headerComponent;
