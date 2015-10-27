function footerComponent(container, obj) {

  var footerGroup = d3.select(container)
    .append("div")
    .classed(obj.prefix + "chart_source", true)
    .text(obj.source);

  if (obj.editable) {
    footerGroup
      .attr("contentEditable", true)
      .classed("editable-chart_source", true);
  }

  obj.dimensions.footerHeight = footerGroup.node().getBoundingClientRect().height;

  return {
    footerGroup: footerGroup
  };

}

module.exports = footerComponent;
