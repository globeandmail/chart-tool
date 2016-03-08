function headerComponent(container, obj) {

  var helpers = require("../../helpers/helpers");

  var headerGroup = d3.select(container)
    .append("div")
    .classed(obj.prefix + "chart_title " + obj.prefix + obj.customClass, true)

  // hack necessary to ensure PDF fields are sized properly
  if (obj.exportable) {
    headerGroup.style("width", obj.exportable.width + "px");
  }

  if (obj.heading !== "" || obj.editable) {
    var headerText = headerGroup
      .append("div")
      .attr("class", obj.prefix + "chart_title-text")
      .text(obj.heading);

    if (obj.editable) {
      headerText
        .attr("contentEditable", true)
        .classed("editable-chart_title", true);
    }

  }

  var qualifier;

  if (obj.options.type === "bar") {
    qualifier = headerGroup
      .append("div")
      .attr({
        "class": function() {
          var str = obj.prefix + "chart_qualifier " + obj.prefix + "chart_qualifier-bar";
          if (obj.editable) {
            str += " editable-chart_qualifier";
          }
          return str;
        },
        "contentEditable": function() {
          return obj.editable ? true : false;
        }
      })
      .text(obj.qualifier);
  }

  if (obj.data.keys.length > 2) {

    var legend = headerGroup.append("div")
      .classed(obj.prefix + "chart_legend", true);

    var keys = helpers.extend(obj.data.keys);

    // get rid of the first item as it doesnt represent a series
    keys.shift();

    if (obj.options.type === "multiline") {
      keys = [keys[0], keys[1]];
      legend.classed(obj.prefix + "chart_legend-" + obj.options.type, true);
    }

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
    legend: legend,
    qualifier: qualifier
  };

}

module.exports = headerComponent;
