function qualifierComponent(node, obj) {

  if (obj.options.type !== "bar") {

    var yAxisNode = node.select("." + obj.prefix + "yAxis");

    if (obj.editable) {

      var foreignObject = yAxisNode.append("foreignObject")
        .attr({
          "class": obj.prefix + "fo " + obj.prefix + "qualifier",
          "width": "100%"
        });

      var foreignObjectGroup = foreignObject.append("xhtml:div")
        .attr("xmlns", "http://www.w3.org/1999/xhtml");

      var qualifierField = foreignObjectGroup.append("div")
        .attr({
          "class": obj.prefix + "chart_qualifier editable-chart_qualifier",
          "contentEditable": true,
          "xmlns": "http://www.w3.org/1999/xhtml"
        })
        .text(obj.qualifier);

      foreignObject
        .attr({
          "width": qualifierField.node().getBoundingClientRect().width + 15,
          "height": qualifierField.node().getBoundingClientRect().height,
          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + "," + ( - (qualifierField.node().getBoundingClientRect().height) / 2 ) + ")"
        });

    } else {

      var qualifierBg = yAxisNode.append("text")
        .attr("class", obj.prefix + "chart_qualifier-text-bg")
        .text(obj.qualifier)
        .attr({
          "dy": "0.32em",
          "y": "0",
          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", 0)"
        });

      var qualifierText = yAxisNode.append("text")
        .attr("class", obj.prefix + "chart_qualifier-text")
        .text(obj.qualifier)
        .attr({
          "dy": "0.32em",
          "y": "0",
          "transform": "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", 0)"
        });

    }

  }

  return {
    qualifierBg: qualifierBg,
    qualifierText: qualifierText
  };

}

module.exports = qualifierComponent;
