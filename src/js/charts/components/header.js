function headerComponent(node, obj) {

  var helpers = require("../../helpers/helpers");

  var foreignObject = node.append("foreignObject")
    .attr({
      "class": obj.prefix + "fo",
      "width": "100%"
    });

  var foreignObjectGroup = foreignObject.append("xhtml:div")
    .attr("xmlns", "http://www.w3.org/1999/xhtml");

  var titleField = foreignObjectGroup.append("div")
    .classed(obj.prefix + "chart_title", true)
    .attr("xmlns", "http://www.w3.org/1999/xhtml")
    .text(obj.heading);

  if (obj.editable === true) {
    titleField.attr("contentEditable", true);
    titleField.classed("editable-chart_title", true);
  }

  // if we do need a legend
    if (obj.data.keys.length > 2) {

    // create a node for our legend
    var legend = foreignObjectGroup.append("div")
      .classed(obj.prefix + "chart_legend", true)
      .attr("xmlns", "http://www.w3.org/1999/xhtml");

    var keys = helpers.extend(obj.data.keys);

    // get rid of the first item as it doesnt represent a series
    keys.shift();

    // for each other item in the array add a node
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

  foreignObject.attr("height", foreignObjectGroup.node().getBoundingClientRect().height);

  // basically like a return statement, writing stuff back to the object
  obj.dimensions.headerHeight = foreignObjectGroup.node().getBoundingClientRect().height;

  return {
    foreignObject: foreignObject,
    foreignObjectGroup: foreignObjectGroup,
    titleField: titleField,
    legend: legend
  };

}

module.exports = headerComponent;
