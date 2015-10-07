function qualifierComponent(node, obj) {

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
      .classed(obj.prefix + "chart_qualifier", true)
        .attr({
          "contentEditable": true,
          "xmlns": "http://www.w3.org/1999/xhtml"
        })
       .text(obj.qualifier);

    foreignObject
      .attr("width", qualifierField.node().getBoundingClientRect().width + 15);

    foreignObject
      .attr("height", qualifierField.node().getBoundingClientRect().height);

    foreignObject
      .attr("transform", "translate(" + (obj.dimensions.width - obj.dimensions.tickWidth()) + "," + ( - (qualifierField.node().getBoundingClientRect().height) / 2 ) + ")");

  } else {

    var qualifierBg = yAxisNode.append("rect")
      .attr("class", obj.prefix + "qualifier_text_bg");

    var qualifierText = yAxisNode.append("text")
      .attr("class", obj.prefix + "qualifier_text")
      .text(obj.qualifier);

    var textBox = qualifierText.node().getBoundingClientRect();
    var textWidth = qualifierText.node().getComputedTextLength();

    qualifierText
      .attr({
        "dy": "0.32em",
        "y": "0",
        "transform": "translate(" + (obj.dimensions.width - obj.dimensions.tickWidth()) + ", 0)"
      });

    qualifierBg
      .style("fill", "white")
      .attr({
        "dy": "0.32em",
        "y": "0",
        "x": "-1",
        "width": (textWidth * 0.865) + 1,
        "height": textBox.height,
        "transform": "translate(" + (obj.dimensions.width - obj.dimensions.tickWidth()) + "," + ( - (textBox.height / 2) ) + ")"
      });

  }

  return {
    qualifierBg: qualifierBg,
    qualifierText: qualifierText,
    textBox: textBox,
    textWidth: textWidth
  };

}

module.exports = qualifierComponent;