function footerComponent(container, obj) {

  var footerGroup;

  if (obj.source !== "" || obj.editable) {
    footerGroup = d3.select(container)
      .append("div")
      .classed(obj.prefix + "chart_source", true);

    // hack necessary to ensure PDF fields are sized properly
    if (obj.exportable) {
      footerGroup.style("width", obj.exportable.width + "px");
    }

    var footerText = footerGroup.append("div")
      .attr("class", obj.prefix + "chart_source-text")
      .text(obj.source);

    if (obj.editable) {
      footerText
        .attr("contentEditable", true)
        .classed("editable-chart_source", true);
    }

    obj.dimensions.footerHeight = footerGroup.node().getBoundingClientRect().height;

  }

  return {
    footerGroup: footerGroup
  };

}

module.exports = footerComponent;
